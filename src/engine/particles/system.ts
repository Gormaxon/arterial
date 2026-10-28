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
import { Batch, FireballBatch, MIXED_BLENDING, SpriteBatch, StreakBatch, STRIDE, TracerBatch, type SharedUniforms } from './batches'
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
/** Reused by onEvent: an `fx` event's options. */
const _evOpts: FireOptions = {}
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

/** Frames the live count (ParticleWorld.active) takes to go through every ring. */
const COUNT_FRAMES = 15

const DEFAULT_CAPACITY: ParticleCapacity = { soft: 1024, smoke: 512, glow: 2048, streak: 1024, tracer: 128, fireball: 32 }

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
    // The sprite styles (smoke, dust, glow) share one batch and one draw (batches.ts MIXED_BLENDING), each particle drawn
    // as its layer says; the others are drawn over them.
    const sprites = new SpriteBatch(cap.smoke + cap.soft + cap.glow, this.shared, MIXED_BLENDING, false, 5)
    this.batches = {
      smoke: sprites,
      soft: sprites,
      glow: sprites,
      streak: new StreakBatch(cap.streak, this.shared),
      tracer: new TracerBatch(cap.tracer, this.shared),
      fireball: new FireballBatch(cap.fireball, this.shared),
    }
    this.batchList = [...new Set(Object.values(this.batches))]
    let slots = 0
    for (const b of this.batchList) slots += b.capacity
    this.countPer = Math.ceil(slots / COUNT_FRAMES)
    this.root.name = 'particles'
    for (const b of this.batchList) this.root.add(b.object)
    scene.add(this.root)
    // Never moved (everything in it is placed in world space): left out of drawing's walk (World.walkedScene).
    this.root.matrixAutoUpdate = false
    this.root.matrixWorldAutoUpdate = false
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
      else this.spawnLayer(layer, at, opts, intensity, n, delay + (d.delay ?? 0), null, -1)
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
    // The last of the batch to die, it may be the one cut short: the batch's last death worked out again (Batch.deathStale).
    const oldDeath = b.data[o + 3]! + b.data[o + 7]!
    if (oldDeath >= b.lastDeath - 1e-3) b.deathStale = true
    // It does not vanish: its head stops where the round did and its tail runs in after it and fades, over
    // TRACER_LINGER. At 900 m/s a round crosses a room in a frame or two, and cut at the hit a tracer was barely seen.
    b.data[o + 7] = stop + TRACER_LINGER
    b.data[o + 15] = -Math.abs(b.data[o + 15]!)
    b.lastDeath = Math.max(b.lastDeath, b.data[o + 3]! + stop + TRACER_LINGER)
    b.touch(slot)
  }

  // --- the per-particle work ---------------------------------------------

  /**
   * Write `n` particles of `layer`, born `delay` seconds from now — or, streaming (`streamDt` >= 0), each a little in the
   * past across the frame of `streamDt`. `emitter` supplies stream overrides. Everything that is the same for the whole
   * layer is worked out once, and each particle in plain numbers: a particle at a time, through a call per particle and
   * the vector helpers, was 7 microseconds a particle without the optimising compiler — a man's death burst, most of a
   * millisecond on the frame he died. The same draws of Math.random in the same order, and the same sums, as then.
   */
  private spawnLayer(layer: CompiledLayer, at: THREE.Vector3, opts: FireOptions, intensity: number, n: number, delay: number, emitter: ParticleEmitter | null, streamDt: number): void {
    const d = layer.def
    const style = layer.style
    const b = this.batches[style as Exclude<ParticleStyle, 'chunk'>]
    const r = b.data
    const row = layer.row
    const offsetY = d.offsetY
    const shapeName = d.shape ?? 'point'
    const shape = shapeName === 'ring' ? 1 : shapeName === 'disc' ? 2 : shapeName === 'box' ? 3 : 0
    const radius = shape === 1 ? (emitter?.radius ?? pick(d.radius, intensity, 0.28)) : shape === 2 ? (emitter?.radius ?? pick(d.radius, intensity, 0.5)) : 0
    const lift = d.lift ?? 0.07
    const ext = emitter?.extent
    const ex = shape === 3 ? (ext ? ext.x : (d.extent?.[0] ?? 0.5)) : 0
    const ey = shape === 3 ? (ext ? ext.y : (d.extent?.[1] ?? 0.5)) : 0
    const ez = shape === 3 ? (ext ? ext.z : (d.extent?.[2] ?? 0.5)) : 0
    const jitter = pick(d.jitter, intensity, 0)
    // The way it goes (a ring's, each particle's own, out from the middle).
    let wx = 0
    let wy = 0
    let wz = 0
    if (d.dir) {
      wx = d.dir[0]
      wy = d.dir[1]
      wz = d.dir[2]
    } else {
      const od = opts.dir ?? UP
      wx = od.x
      wy = od.y
      wz = od.z
    }
    const spread = pick(d.spread, intensity, shape === 1 ? 0.1 : 0.5)
    const keep = 1 - spread
    const sv = d.speedVariance ?? 0.45
    const speedBase = pick(d.speed, intensity, 0)
    const svLow = 1 - sv
    const inherit = d.inherit ?? 1
    const vel = opts.velocity && inherit !== 0 ? opts.velocity : null
    const pinch = d.pinch
    const lifeBase = pick(d.life, intensity, 1)
    const lifeVar = d.lifeVariance ?? 0.35
    const sizeBase = pick(d.size, intensity, 0.1)
    const sizeVar = d.sizeVariance ?? 0.4
    const g = pick(d.gravity, intensity, 0)
    const drag = pick(d.drag, intensity, 1.4)
    const sprite = style === 'soft' || style === 'smoke' || style === 'glow'
    const alpha = pick(d.alpha, intensity, sprite ? 0.75 : 1)
    const streak = style === 'streak'
    const tracer = style === 'tracer'
    const floor = streak ? (opts.floor ?? emitter?.floor ?? null) : null
    const bounceAt = streak && d.bounce !== undefined && floor !== null ? floor + (d.floorOffset ?? 0) : null
    const spin = d.spin ?? 1.1
    const after = d.onDeath
    for (let k = 0; k < n; k++) {
      const born = streamDt >= 0 ? -streamDt * ((k + Math.random()) / n) : delay
      // Where it starts, and which way it goes. (`at` read each time: a death's own death writes the one it was given.)
      let ox = at.x
      let oy = at.y
      let oz = at.z
      if (offsetY) oy += offsetY
      let dirx = wx
      let diry = wy
      let dirz = wz
      if (shape === 1) {
        // Even round the circle, a little scatter so it is not a wheel.
        const a = ((k + Math.random() * 0.8) / n) * Math.PI * 2
        const c = Math.cos(a)
        const s = Math.sin(a)
        ox += c * radius
        oz += s * radius
        dirx = c
        diry = lift
        dirz = s
      } else if (shape === 2) {
        const a = Math.random() * Math.PI * 2
        const rr = Math.sqrt(Math.random()) * radius
        ox += Math.cos(a) * rr
        oz += Math.sin(a) * rr
      } else if (shape === 3) {
        ox += (Math.random() * 2 - 1) * ex
        oy += (Math.random() * 2 - 1) * ey
        oz += (Math.random() * 2 - 1) * ez
      }
      if (jitter > 0) {
        ox += (Math.random() - 0.5) * jitter
        oy += (Math.random() - 0.5) * jitter
        oz += (Math.random() - 0.5) * jitter
      }
      // A random direction bent toward the way it goes by (1 - spread). That way's length weights the mix, as it always has.
      const theta = Math.random() * Math.PI * 2
      const z = Math.random() * 2 - 1
      const rr = Math.sqrt(Math.max(0, 1 - z * z))
      let dx = rr * Math.cos(theta)
      let dy = rr * Math.sin(theta)
      let dz = z
      dx *= spread
      dy *= spread
      dz *= spread
      dx += dirx * keep
      dy += diry * keep
      dz += dirz * keep
      if (dx * dx + dy * dy + dz * dz < 1e-8) {
        dx = dirx
        dy = diry
        dz = dirz
      }
      const inv = 1 / (Math.sqrt(dx * dx + dy * dy + dz * dz) || 1)
      dx *= inv
      dy *= inv
      dz *= inv
      const speed = speedBase * (svLow + Math.random() * 2 * sv)
      let vx = dx * speed
      let vy = dy * speed
      let vz = dz * speed
      if (vel) {
        vx += vel.x * inherit
        vy += vel.y * inherit
        vz += vel.z * inherit
      }
      if (pinch) {
        // Back toward the axis through the origin, across the direction of travel.
        let px = ox - at.x
        let py = oy - at.y
        let pz = oz - at.z
        const along = -(px * dx + py * dy + pz * dz)
        px += dx * along
        py += dy * along
        pz += dz * along
        vx += px * -pinch
        vy += py * -pinch
        vz += pz * -pinch
      }

      const life = lifeBase * (1 - lifeVar * Math.random())
      const size = sizeBase * (1 - sizeVar * Math.random())
      const birth = this.time + born

      const o = b.claim()
      r[o] = ox
      r[o + 1] = oy
      r[o + 2] = oz
      r[o + 3] = birth
      r[o + 4] = vx
      r[o + 5] = vy
      r[o + 6] = vz
      r[o + 7] = life
      r[o + 8] = g
      r[o + 9] = drag
      r[o + 10] = size
      r[o + 11] = row
      if (streak) {
        r[o + 12] = 0
        r[o + 13] = 0
        r[o + 14] = alpha
        r[o + 15] = bounceAt !== null ? floorHitTime(oy, vy, g, drag, bounceAt, life) : -1
      } else if (tracer) {
        // Fired as an effect, a tracer is drawn from where it starts.
        r[o + 12] = ox
        r[o + 13] = oy
        r[o + 14] = oz
        r[o + 15] = alpha
      } else {
        r[o + 12] = Math.random() * Math.PI * 2
        r[o + 13] = (Math.random() * 2 - 1) * spin
        r[o + 14] = alpha
        // Which way out from the emitter's axis it was born, for billow; anywhere if it was born on the axis.
        const bx = ox - at.x
        const bz = oz - at.z
        r[o + 15] = bx * bx + bz * bz > 1e-6 ? Math.atan2(bz, bx) : Math.random() * Math.PI * 2
      }
      b.lastDeath = Math.max(b.lastDeath, birth + life)

      // What it turns into when it dies, worked out now: where it will be then.
      if (after && Math.random() < (after.chance ?? 1)) {
        _p0.set(ox, oy, oz)
        _v.set(vx, vy, vz)
        trajectory(_p0, _v, g, drag, life, _end)
        if (after.minRise === undefined || _end.y - at.y >= after.minRise) {
          this.fireDelayed(after.effect, _deathAt.copy(_end), NO_OPTS, born + life)
        }
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
    // One options object, reused: fire reads it and keeps nothing of it (nor of `at`).
    const o = _evOpts
    o.dir = dir ? dir.normalize() : undefined
    o.intensity = typeof p.intensity === 'number' ? p.intensity : undefined
    this.fire(p.effect, at, o)
  }

  // --- per frame -----------------------------------------------------------

  private streamDt = 0
  private streamEach(e: ParticleEmitter): void {
    this.stream(e, this.streamDt)
  }

  /** Advance the clock, run the emitters, step the chunks, send what was born. Once per rendered frame. */
  update(dt: number, camera?: THREE.Camera): void {
    this.time += dt
    this.streamDt = dt
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
    if (this.emitters.size > 0) this.emitters.forEach(this.streamEach, this)
    for (let i = 0; i < this.chunkList.length; i++) {
      const pool = this.chunkList[i]!
      if (pool.active > 0) pool.update(dt)
    }
    for (let i = 0; i < this.batchList.length; i++) this.batchList[i]!.flush(this.time)
    this.countSlice()
  }

  /**
   * The next stretch of the count (`active`): countPer slots of the rings a frame, so the whole is counted about four
   * times a second at 60 frames a second; the total taken when the last ring is done, the chunks with it.
   */
  private countSlice(): void {
    const t = this.time
    let left = this.countPer
    while (left > 0) {
      const b = this.batchList[this.countBatch]
      if (!b) {
        let c = this.countSum
        for (let i = 0; i < this.chunkList.length; i++) c += this.chunkList[i]!.active
        this.activeCount = c
        this.countBatch = 0
        this.countAt = 0
        this.countSum = 0
        return
      }
      const n = Math.min(b.written, b.capacity)
      // (Past its last death, nothing in it is alive.)
      if (t >= b.lastDeath || this.countAt >= n) {
        this.countBatch++
        this.countAt = 0
        continue
      }
      const stop = Math.min(n, this.countAt + left)
      const d = b.data
      let c = 0
      // Each record's birth (its fourth number) and life (its eighth).
      for (let o = this.countAt * STRIDE + 3, end = stop * STRIDE + 3; o < end; o += STRIDE) {
        const age = t - d[o]!
        if (age >= 0 && age < d[o + 4]!) c++
      }
      this.countSum += c
      left -= stop - this.countAt
      this.countAt = stop
    }
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
      // Its births spread across the frame (born a little in the past), so a fast stream is a stream and not bands.
      this.spawnLayer(layer, _wp, opts, e.intensity, n, 0, e, dt)
    }
  }

  /** Everything gone at once (a respawn, a level load). Emitters stay: they belong to their entities. */
  clear(): void {
    for (const b of this.batchList) b.clear()
    for (const pool of this.chunkList) pool.clear()
    this.activeCount = 0
    this.countBatch = 0
    this.countAt = 0
    this.countSum = 0
  }

  /** How many particles are alive in each style right now. Walks the rings: for tools and the HUD, not per frame. */
  live(): Record<ParticleStyle, number> {
    const out = { soft: 0, smoke: 0, glow: 0, streak: 0, tracer: 0, fireball: 0, chunk: 0 } as Record<ParticleStyle, number>
    const counted = new Set<Batch>()
    for (const [style, b] of Object.entries(this.batches) as [Exclude<ParticleStyle, 'chunk'>, Batch][]) {
      // The sprite styles share one batch: each of its particles counted once, under its own layer's style.
      if (counted.has(b)) continue
      counted.add(b)
      const shared = b === this.batches.soft
      const n = Math.min(b.written, b.capacity)
      let c = 0
      for (let i = 0; i < n; i++) {
        const age = this.time - b.data[i * STRIDE + 3]!
        if (!(age >= 0 && age < b.data[i * STRIDE + 7]!)) continue
        if (shared) out[this.ramps.spriteStyle(b.data[i * STRIDE + 11]!)]++
        else c++
      }
      if (!shared) out[style] = c
    }
    for (const pool of this.chunks.values()) out.chunk += pool.active
    return out
  }

  /**
   * Total alive, every style, as last counted: a stretch of the rings a frame (countSlice), the whole about four times a
   * second. (Counted all at once on one frame in fifteen, that frame was 0.6 ms dearer on the Chromebook.)
   */
  get active(): number {
    return this.activeCount
  }
  private activeCount = 0
  /** The count under way: the batch it is in, how far into it, and what it has come to so far. */
  private countBatch = 0
  private countAt = 0
  private countSum = 0
  private readonly countPer: number

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
