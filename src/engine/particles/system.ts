/**
 * ParticleWorld — the engine's particle system, owned by the World like its lights.
 *
 * Every particle in the game goes through here: dust, smoke, sparks, flame, fireballs,
 * tracers, rubble. Effects are named data (effects.ts) and are fired three ways, all the
 * engine's own:
 *   - from code:          world.particles.fire('impact.concrete', point, { dir: normal })
 *   - from the event bus: world.events.emit('fx', { effect: 'steam.burst', at })  — so a
 *                         trigger, a cutscene or any entity can set one off by name
 *   - from the level:     an `emitter` entity placed in the editor streams or bursts one
 *
 * What makes it cheap (see batches.ts): one draw call per style for every effect at once;
 * particles move in closed form on the GPU, so the CPU only writes a particle when it is
 * born and uploads only what was born this frame; idle styles are switched off; effects
 * far from the camera are not fired at all, and emitters out of range do not emit; and the
 * whole system thins out under the GPU budget (`density`) rather than dropping frames.
 */

import * as THREE from 'three'
import type { EventBus } from '../events'
import { addLive } from '../../render/live'
import { floorHitTime, trajectory } from './curves'
import { Batch, FireballBatch, SpriteBatch, StreakBatch, STRIDE, TracerBatch, type SharedUniforms } from './batches'
import { ChunkPool } from './chunks'
import { EffectRegistry, pick, RampTable, type CompiledEffect, type CompiledLayer, type EffectDef, type ParticleStyle } from './effects'

/** How an effect is fired. Everything is optional. */
export interface FireOptions {
  /** The direction layers without their own are thrown along (an impact normal, a muzzle). Default up. */
  dir?: THREE.Vector3
  /** 0..1, picks between the low and high end of every ranged number. Default 1. */
  intensity?: number
  /** Velocity of whatever threw it; each layer carries its `inherit` share. */
  velocity?: THREE.Vector3
  /** Floor height, for layers that bounce. */
  floor?: number
  /** Multiplier on every layer's count. */
  count?: number
}

/**
 * A continuous source: streams an effect's layers at their `rate`, from a point that may
 * ride on an object. Made with `ParticleWorld.emitter`; nothing else to manage per frame.
 */
export class ParticleEmitter {
  /** World position, or local to `follow` when set. */
  readonly position = new THREE.Vector3()
  /** Direction for layers without their own; world, or local to `follow`. */
  readonly direction = new THREE.Vector3(0, 1, 0)
  /** Ride on this object (a vent, a moving platform): position and direction are in its space. */
  follow: THREE.Object3D | null = null
  /** Multiplier on every layer's rate. */
  rate = 1
  intensity = 1
  active = true
  /** Does not emit farther than this from the camera, metres. */
  range = 80
  /** Replaces the layers' disc/ring radius (a vent sized in the editor). */
  radius: number | null = null
  /** Replaces the layers' box half-extents. */
  extent: THREE.Vector3 | null = null
  /** Carried by layers with `inherit`. */
  readonly velocity = new THREE.Vector3()
  /** For layers that bounce. */
  floor: number | null = null
  /** Fractional particles owed, per layer. */
  readonly carry: number[] = []

  constructor(public effect: string) {}
}

const _o = new THREE.Vector3()
const _d = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _v = new THREE.Vector3()
const _p0 = new THREE.Vector3()
const _end = new THREE.Vector3()
const _wp = new THREE.Vector3()
const _wd = new THREE.Vector3()
const _deathAt = new THREE.Vector3()
/** Reused for every stream, so emitters allocate nothing per frame. */
const _streamOpts: FireOptions = {}
const UP = new THREE.Vector3(0, 1, 0)
const NO_OPTS: FireOptions = {}
/** Seconds a tracer takes to burn out after its round has stopped (see endTracer; the shader knows it too). */
export const TRACER_LINGER = 0.09

/** Stochastic rounding: a count of 0.3 is one particle three times in ten. */
function roundCount(x: number): number {
  const f = Math.floor(x)
  return f + (Math.random() < x - f ? 1 : 0)
}

export interface ParticleCapacity {
  soft: number
  smoke: number
  glow: number
  streak: number
  tracer: number
  fireball: number
}

const DEFAULT_CAPACITY: ParticleCapacity = { soft: 1024, smoke: 512, glow: 2048, streak: 1024, tracer: 128, fireball: 16 }

export class ParticleWorld {
  readonly ramps = new RampTable(192)
  readonly effects = new EffectRegistry(this.ramps)
  /** Every batch and chunk pool. Added to the world scene, and drawn fresh each frame under frame generation. */
  readonly root = new THREE.Group()
  /** The camera, last seen: effects and emitters far from it are skipped. */
  readonly focus = new THREE.Vector3()
  /**
   * Share of the asked-for particles actually made, 0..1. Lowered by the game while the GPU
   * is struggling: fewer particles is the cheaper way to pay than a softer picture.
   */
  density = 1
  /** The particle clock, seconds. Only ever moves forward; rebased now and then to keep float precision. */
  time = 0

  private readonly shared: SharedUniforms
  private readonly batches: Record<Exclude<ParticleStyle, 'chunk'>, Batch>
  /** The same batches as a plain list, so the per-frame loops allocate nothing. */
  private readonly batchList: Batch[]
  private readonly chunkList: ChunkPool[] = []
  private readonly chunks = new Map<string, ChunkPool>()
  private readonly emitters = new Set<ParticleEmitter>()
  private seenView = false

  constructor(scene: THREE.Scene, events: EventBus, capacity: Partial<ParticleCapacity> = {}) {
    const cap = { ...DEFAULT_CAPACITY, ...capacity }
    this.shared = { uTime: { value: 0 }, uRamp: { value: this.ramps.texture } }
    // Draw order among the transparent styles: smoke under everything, then dust, then the additive glows over both.
    this.batches = {
      smoke: new SpriteBatch(cap.smoke, this.shared, THREE.NormalBlending, true, 3),
      soft: new SpriteBatch(cap.soft, this.shared, THREE.NormalBlending, false, 5),
      glow: new SpriteBatch(cap.glow, this.shared, THREE.AdditiveBlending, false, 6),
      streak: new StreakBatch(cap.streak, this.shared),
      tracer: new TracerBatch(cap.tracer, this.shared),
      fireball: new FireballBatch(cap.fireball, this.shared),
    }
    this.batchList = Object.values(this.batches)
    this.root.name = 'particles'
    for (const b of this.batchList) this.root.add(b.object)
    scene.add(this.root)
    addLive(this.root)
    // A tap, not a listener: it survives the bus being cleared for a new level.
    events.tap((name, payload) => {
      if (name === 'fx') this.onEvent(payload)
    })
  }

  // --- definitions ---------------------------------------------------------

  /** Name an effect. Re-registering a name replaces it in place (live tuning). */
  register(name: string, def: EffectDef): void {
    this.effects.register(name, def)
  }

  /** Is there an effect by this name? */
  has(name: string): boolean {
    return this.effects.get(name) !== undefined
  }

  /** A solid kind for `chunk` layers: a mesh and a material, its own pool. */
  registerChunk(name: string, pool: ChunkPool): void {
    const old = this.chunks.get(name)
    if (old) {
      this.root.remove(old.mesh)
      this.chunkList.splice(this.chunkList.indexOf(old), 1)
    }
    this.chunks.set(name, pool)
    this.chunkList.push(pool)
    this.root.add(pool.mesh)
  }

  chunkPool(name: string): ChunkPool | undefined {
    return this.chunks.get(name)
  }

  // --- firing --------------------------------------------------------------

  /**
   * Fire an effect once at `at`. Returns false if it was not drawn (unknown, or too far
   * from the camera to be seen).
   */
  fire(name: string, at: THREE.Vector3, opts: FireOptions = NO_OPTS): boolean {
    return this.fireDelayed(name, at, opts, 0)
  }

  private fireDelayed(name: string, at: THREE.Vector3, opts: FireOptions, delay: number): boolean {
    const fx = this.effects.get(name)
    if (!fx) return false
    if (this.seenView && at.distanceToSquared(this.focus) > fx.cullDistanceSq) return false
    const intensity = opts.intensity ?? 1
    const mult = (opts.count ?? 1) * this.density
    for (const layer of fx.layers) {
      const d = layer.def
      if (d.minIntensity !== undefined && intensity < d.minIntensity) continue
      const n = roundCount(pick(d.count, intensity, 1) * mult)
      if (n <= 0) continue
      if (layer.style === 'chunk') this.burstChunks(layer, at, opts, n, intensity)
      else for (let i = 0; i < n; i++) this.spawn(layer, at, opts, intensity, i, n, delay + (d.delay ?? 0), null)
    }
    return true
  }

  /** A stream: an emitter that keeps firing `name` at its layers' rates until removed. */
  emitter(name: string): ParticleEmitter {
    const e = new ParticleEmitter(name)
    this.emitters.add(e)
    return e
  }

  removeEmitter(e: ParticleEmitter): void {
    this.emitters.delete(e)
  }

  get emitterCount(): number {
    return this.emitters.size
  }

  /**
   * A tracer that flies on its own along a round's path, drawn by the engine: from `from`
   * at `velocity`, drawn back to `muzzle` for its first metres. Uses the effect's tracer
   * layer for its look; `gravity` and `drag` (v², a round's) match the simulation that owns
   * the round. Returns a handle to `endTracer` when the round stops; -1 if not drawn.
   */
  tracer(name: string, from: THREE.Vector3, vel: THREE.Vector3, muzzle: THREE.Vector3, gravity: number, drag: number, life: number): number {
    const fx = this.effects.get(name)
    const layer = fx?.layers.find((l) => l.style === 'tracer')
    if (!layer) return -1
    const b = this.batches.tracer
    const handle = b.written
    const o = b.claim()
    const r = b.data
    r[o] = from.x
    r[o + 1] = from.y
    r[o + 2] = from.z
    r[o + 3] = this.time
    r[o + 4] = vel.x
    r[o + 5] = vel.y
    r[o + 6] = vel.z
    r[o + 7] = life
    r[o + 8] = gravity
    r[o + 9] = drag
    r[o + 10] = pick(layer.def.size, 1, 0.085)
    r[o + 11] = layer.row
    r[o + 12] = muzzle.x
    r[o + 13] = muzzle.y
    r[o + 14] = muzzle.z
    r[o + 15] = pick(layer.def.alpha, 1, 1)
    b.lastDeath = Math.max(b.lastDeath, this.time + life)
    return handle
  }

  /**
   * The round a tracer belongs to has stopped, `flight` seconds after the tracer started (the owner's clock; now, if
   * not given). The head flies on to there — the drawing can be a frame behind the simulation — and stops.
   */
  endTracer(handle: number, flight?: number): void {
    const b = this.batches.tracer
    const slot = b.slotOf(handle)
    if (slot < 0) return
    const o = slot * STRIDE
    const age = this.time - b.data[o + 3]!
    // Already ending (a negative alpha marks it) or already gone: nothing to do.
    if (b.data[o + 15]! < 0 || age >= b.data[o + 7]!) return
    const stop = Math.max(0, flight ?? age)
    // It does not vanish: its head stops where the round did and its tail runs in after it and fades, over
    // TRACER_LINGER. At 900 m/s a round crosses a room in a frame or two, and cut at the hit a tracer was barely seen.
    b.data[o + 7] = stop + TRACER_LINGER
    b.data[o + 15] = -Math.abs(b.data[o + 15]!)
    b.lastDeath = Math.max(b.lastDeath, b.data[o + 3]! + stop + TRACER_LINGER)
    b.touch(slot)
  }

  // --- the per-particle work ---------------------------------------------

  /** Write one particle of `layer`. `k`/`n` place it round a ring. `emitter` supplies stream overrides. */
  private spawn(layer: CompiledLayer, at: THREE.Vector3, opts: FireOptions, intensity: number, k: number, n: number, delay: number, emitter: ParticleEmitter | null): void {
    const d = layer.def
    const b = this.batches[layer.style as Exclude<ParticleStyle, 'chunk'>]
    // Where it starts, and which way it goes.
    _o.copy(at)
    if (d.offsetY) _o.y += d.offsetY
    const shape = d.shape ?? 'point'
    let ringDir = false
    if (shape === 'ring') {
      const radius = emitter?.radius ?? pick(d.radius, intensity, 0.28)
      // Even round the circle, a little scatter so it is not a wheel.
      const a = ((k + Math.random() * 0.8) / n) * Math.PI * 2
      const c = Math.cos(a)
      const s = Math.sin(a)
      _o.x += c * radius
      _o.z += s * radius
      _dir.set(c, d.lift ?? 0.07, s)
      ringDir = true
    } else if (shape === 'disc') {
      const radius = emitter?.radius ?? pick(d.radius, intensity, 0.5)
      const a = Math.random() * Math.PI * 2
      const r = Math.sqrt(Math.random()) * radius
      _o.x += Math.cos(a) * r
      _o.z += Math.sin(a) * r
    } else if (shape === 'box') {
      const e = emitter?.extent
      const ex = e ? e.x : (d.extent?.[0] ?? 0.5)
      const ey = e ? e.y : (d.extent?.[1] ?? 0.5)
      const ez = e ? e.z : (d.extent?.[2] ?? 0.5)
      _o.x += (Math.random() * 2 - 1) * ex
      _o.y += (Math.random() * 2 - 1) * ey
      _o.z += (Math.random() * 2 - 1) * ez
    }
    const jitter = pick(d.jitter, intensity, 0)
    if (jitter > 0) {
      _o.x += (Math.random() - 0.5) * jitter
      _o.y += (Math.random() - 0.5) * jitter
      _o.z += (Math.random() - 0.5) * jitter
    }
    if (!ringDir) {
      if (d.dir) _dir.set(d.dir[0], d.dir[1], d.dir[2])
      else _dir.copy(opts.dir ?? UP)
    }
    // A random direction bent toward `dir` by (1 - spread). The length of `dir` weights the mix, as it always has.
    const spread = pick(d.spread, intensity, shape === 'ring' ? 0.1 : 0.5)
    const theta = Math.random() * Math.PI * 2
    const z = Math.random() * 2 - 1
    const rr = Math.sqrt(Math.max(0, 1 - z * z))
    _d.set(rr * Math.cos(theta), rr * Math.sin(theta), z)
    _d.multiplyScalar(spread).addScaledVector(_dir, 1 - spread)
    if (_d.lengthSq() < 1e-8) _d.copy(_dir)
    _d.normalize()
    const sv = d.speedVariance ?? 0.45
    const speed = pick(d.speed, intensity, 0) * (1 - sv + Math.random() * 2 * sv)
    _v.copy(_d).multiplyScalar(speed)
    const inherit = d.inherit ?? 1
    if (opts.velocity && inherit !== 0) _v.addScaledVector(opts.velocity, inherit)
    if (d.pinch) {
      // Back toward the axis through the origin, across the direction of travel.
      _p0.subVectors(_o, at)
      _p0.addScaledVector(_d, -_p0.dot(_d))
      _v.addScaledVector(_p0, -d.pinch)
    }

    const life = pick(d.life, intensity, 1) * (1 - (d.lifeVariance ?? 0.35) * Math.random())
    const size = pick(d.size, intensity, 0.1) * (1 - (d.sizeVariance ?? 0.4) * Math.random())
    const g = pick(d.gravity, intensity, 0)
    const drag = pick(d.drag, intensity, 1.4)
    const alpha = pick(d.alpha, intensity, layer.style === 'soft' || layer.style === 'smoke' || layer.style === 'glow' ? 0.75 : 1)
    const birth = this.time + delay

    const o = b.claim()
    const r = b.data
    r[o] = _o.x
    r[o + 1] = _o.y
    r[o + 2] = _o.z
    r[o + 3] = birth
    r[o + 4] = _v.x
    r[o + 5] = _v.y
    r[o + 6] = _v.z
    r[o + 7] = life
    r[o + 8] = g
    r[o + 9] = drag
    r[o + 10] = size
    r[o + 11] = layer.row
    if (layer.style === 'streak') {
      const floor = opts.floor ?? emitter?.floor ?? null
      r[o + 12] = 0
      r[o + 13] = 0
      r[o + 14] = alpha
      r[o + 15] = d.bounce !== undefined && floor !== null ? floorHitTime(_o.y, _v.y, g, drag, floor + (d.floorOffset ?? 0), life) : -1
    } else if (layer.style === 'tracer') {
      // Fired as an effect, a tracer is drawn from where it starts.
      r[o + 12] = _o.x
      r[o + 13] = _o.y
      r[o + 14] = _o.z
      r[o + 15] = alpha
    } else {
      r[o + 12] = Math.random() * Math.PI * 2
      r[o + 13] = (Math.random() * 2 - 1) * (d.spin ?? 1.1)
      r[o + 14] = alpha
      // Which way out from the emitter's axis it was born, for billow; anywhere if it was born on the axis.
      const ox = _o.x - at.x
      const oz = _o.z - at.z
      r[o + 15] = ox * ox + oz * oz > 1e-6 ? Math.atan2(oz, ox) : Math.random() * Math.PI * 2
    }
    b.lastDeath = Math.max(b.lastDeath, birth + life)

    // What it turns into when it dies, worked out now: where it will be then.
    const after = d.onDeath
    if (after && Math.random() < (after.chance ?? 1)) {
      _p0.copy(_o)
      trajectory(_p0, _v, g, drag, life, _end)
      if (after.minRise === undefined || _end.y - at.y >= after.minRise) {
        this.fireDelayed(after.effect, _deathAt.copy(_end), NO_OPTS, delay + life)
      }
    }
  }

  private burstChunks(layer: CompiledLayer, at: THREE.Vector3, opts: FireOptions, n: number, intensity: number): void {
    const d = layer.def
    const pool = this.chunks.get(d.chunk ?? '')
    if (!pool) return
    pool.burst(at, {
      count: n,
      normal: d.dir ? _dir.set(d.dir[0], d.dir[1], d.dir[2]) : (opts.dir ?? UP),
      speed: pick(d.speed, intensity, 6),
      spread: pick(d.spread, intensity, 0.3),
      minSize: pick(d.minSize, intensity, 0.05),
      maxSize: pick(d.maxSize, intensity, 0.15),
      restY: (opts.floor ?? at.y) + (d.floorOffset ?? 0),
      life: pick(d.life, intensity, 2.6),
    })
  }

  // --- events --------------------------------------------------------------

  private onEvent(payload: unknown): void {
    const p = payload as { effect?: unknown; at?: unknown; dir?: unknown; intensity?: unknown } | null
    if (!p || typeof p.effect !== 'string') return
    const at = toVec(p.at, _wp)
    if (!at) return
    const dir = toVec(p.dir, _wd)
    this.fire(p.effect, at.clone(), { dir: dir ? dir.clone().normalize() : undefined, intensity: typeof p.intensity === 'number' ? p.intensity : undefined })
  }

  // --- per frame -----------------------------------------------------------

  /** Advance the clock, run the emitters, step the chunks, send what was born. Once per rendered frame. */
  update(dt: number, camera?: THREE.Camera): void {
    this.time += dt
    if (this.time > 2048) {
      // Float precision: keep the clock small. Every birth time shifts with it.
      for (const b of this.batchList) b.rebase(1024)
      this.time -= 1024
    }
    this.shared.uTime.value = this.time
    if (camera) {
      camera.getWorldPosition(this.focus)
      this.seenView = true
    }
    if (this.emitters.size > 0) for (const e of this.emitters) this.stream(e, dt)
    for (let i = 0; i < this.chunkList.length; i++) {
      const pool = this.chunkList[i]!
      if (pool.active > 0) pool.update(dt)
    }
    for (let i = 0; i < this.batchList.length; i++) this.batchList[i]!.flush(this.time)
  }

  private stream(e: ParticleEmitter, dt: number): void {
    if (!e.active || e.rate <= 0) return
    const fx = this.effects.get(e.effect)
    if (!fx) return
    if (e.follow) {
      _wp.copy(e.position).applyMatrix4(e.follow.matrixWorld)
      _wd.copy(e.direction).transformDirection(e.follow.matrixWorld)
    } else {
      _wp.copy(e.position)
      _wd.copy(e.direction).normalize()
    }
    if (this.seenView && _wp.distanceToSquared(this.focus) > e.range * e.range) {
      // Out of range: owe nothing, so it does not burst on coming back.
      e.carry.length = 0
      return
    }
    const opts = _streamOpts
    opts.dir = _wd
    opts.intensity = e.intensity
    opts.velocity = e.velocity
    opts.floor = e.floor ?? undefined
    const scale = e.rate * this.density
    for (let i = 0; i < fx.layers.length; i++) {
      const layer = fx.layers[i]!
      const rate = pick(layer.def.rate, e.intensity, 0) * scale
      if (rate <= 0) continue
      const owed = (e.carry[i] ?? 0) + rate * dt
      const n = Math.floor(owed)
      e.carry[i] = owed - n
      if (n <= 0) continue
      if (layer.style === 'chunk') {
        this.burstChunks(layer, _wp, opts, n, e.intensity)
        continue
      }
      for (let k = 0; k < n; k++) {
        // Spread the births across the frame (born a little in the past), so a fast stream is a stream and not bands.
        this.spawn(layer, _wp, opts, e.intensity, k, n, -dt * ((k + Math.random()) / n), e)
      }
    }
  }

  /** Everything gone at once (a respawn, a level load). Emitters stay: they belong to their entities. */
  clear(): void {
    for (const b of this.batchList) b.clear()
    for (const pool of this.chunkList) pool.clear()
  }

  /** How many particles are alive in each style right now. Walks the rings: for tools and the HUD, not per frame. */
  live(): Record<ParticleStyle, number> {
    const out = { soft: 0, smoke: 0, glow: 0, streak: 0, tracer: 0, fireball: 0, chunk: 0 } as Record<ParticleStyle, number>
    for (const [style, b] of Object.entries(this.batches) as [Exclude<ParticleStyle, 'chunk'>, Batch][]) {
      const n = Math.min(b.written, b.capacity)
      let c = 0
      for (let i = 0; i < n; i++) {
        const age = this.time - b.data[i * STRIDE + 3]!
        if (age >= 0 && age < b.data[i * STRIDE + 7]!) c++
      }
      out[style] = c
    }
    for (const pool of this.chunks.values()) out.chunk += pool.active
    return out
  }

  /** Total alive, every style. */
  get active(): number {
    const l = this.live()
    return l.soft + l.smoke + l.glow + l.streak + l.tracer + l.fireball + l.chunk
  }

  /** A batch, for tests and tools. */
  batch(style: Exclude<ParticleStyle, 'chunk'>): Batch {
    return this.batches[style]
  }

  /**
   * One particle of every style and every chunk kind at `at`, so each shader is compiled
   * behind the loading screen instead of on the frame an effect first appears. The caller
   * draws a frame and then clears.
   */
  warm(at: THREE.Vector3): void {
    const name = '__warm'
    if (!this.effects.has(name)) {
      this.register(name, {
        cullDistance: 1e9,
        layers: [
          { style: 'soft', count: 1, life: 1, size: 0.3 },
          { style: 'smoke', count: 1, life: 1, size: 0.3 },
          { style: 'glow', count: 1, life: 1, size: 0.3 },
          { style: 'streak', count: 1, life: 1, size: 0.05, speed: 1 },
          { style: 'tracer', count: 1, life: 1, size: 0.05, speed: 1 },
          { style: 'fireball', count: 1, life: 1, size: 0.1 },
          ...[...this.chunks.keys()].map((chunk) => ({ style: 'chunk' as const, chunk, count: 1, life: 1, speed: 0.1 })),
        ],
      })
    }
    const saved = this.density
    this.density = 1
    this.fire(name, at)
    this.density = saved
    this.update(0.001)
  }
}

function toVec(v: unknown, out: THREE.Vector3): THREE.Vector3 | null {
  if (v instanceof THREE.Vector3) return out.copy(v)
  if (Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === 'number')) return out.set(v[0] as number, v[1] as number, v[2] as number)
  return null
}

export type { CompiledEffect }
