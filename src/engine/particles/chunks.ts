/**
 * The particle engine's one solid style: chunks — rubble, gore, armour plate, spent brass.
 *
 * Unlike the sprite styles these are simulated on the CPU, because a chunk has to come to
 * rest on the floor and stop dead, which no closed form gives cheaply; they are few (a pool
 * of tens), and the per-frame work is one matrix each for the live ones only.
 *
 * Each KIND (a mesh and a material) is one InstancedMesh, every piece preallocated — a wall shattering must not allocate,
 * and it must not cost a draw call per fragment.
 *
 * The "physics" is a ballistic integrator with a per-burst rest height, not a solver:
 * every good rigid-body engine ships WebAssembly, and chunks that arc, tumble, bounce
 * once and settle are indistinguishable from the real thing for something that lives
 * two seconds.
 */

import * as THREE from 'three'
import { getMaterial, type SurfaceKey } from '../../render/materials'

const _m = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()
const _p = new THREE.Vector3()
const _s = new THREE.Vector3()
const _dir = new THREE.Vector3()

export interface ChunkBurst {
  count: number
  /** Outward direction the fragments are thrown along. */
  normal: THREE.Vector3
  /** Metres per second. */
  speed: number
  /** Half-extent of the region chunks spawn within. */
  spread: number
  /** Size range of a chunk. */
  minSize: number
  maxSize: number
  /** Height chunks come to rest at. Usually the floor under the impact. */
  restY: number
  life?: number
}

export class ChunkPool {
  readonly mesh: THREE.InstancedMesh

  private readonly capacity: number
  private readonly pos: Float32Array
  private readonly vel: Float32Array
  private readonly rot: Float32Array
  private readonly spin: Float32Array
  private readonly size: Float32Array
  private readonly life: Float32Array
  private readonly maxLife: Float32Array
  private readonly restY: Float32Array
  /** Has each chunk come down on its floor yet? */
  private readonly landed: Uint8Array
  /** Lying still with its place written (update): left alone until it starts to shrink away. */
  private readonly held: Uint8Array
  /** Each still piece's place at its full size (held): shrinking away, only its size changes — scaled, not worked out. */
  private readonly rest: Float32Array
  /**
   * Called the first time each chunk comes down on its floor: where, how fast it was falling (m/s) and how big it is
   * (its largest side). What a spent case hitting the floor is heard by.
   */
  onLand: ((x: number, y: number, z: number, speed: number, size: number) => void) | null = null
  /** Live chunks occupy [0, count); the InstancedMesh draws exactly that many. */
  private count = 0
  private cursor = 0

  constructor(capacity = 160, surface: SurfaceKey = 'concrete', material?: THREE.Material, geometry?: THREE.BufferGeometry) {
    this.capacity = capacity
    this.pos = new Float32Array(capacity * 3)
    this.vel = new Float32Array(capacity * 3)
    this.rot = new Float32Array(capacity * 3)
    this.spin = new Float32Array(capacity * 3)
    this.size = new Float32Array(capacity * 3)
    this.life = new Float32Array(capacity)
    this.maxLife = new Float32Array(capacity)
    this.restY = new Float32Array(capacity)
    this.landed = new Uint8Array(capacity)
    this.held = new Uint8Array(capacity)
    this.rest = new Float32Array(capacity * 16)

    this.mesh = new THREE.InstancedMesh(
      // Boxes for rubble and plate; a caller can give another shape (gore is lumps, not cubes).
      geometry ?? new THREE.BoxGeometry(1, 1, 1),
      // An override exists so spent brass can be brass: the level's surfaces are all
      // architecture, and a shell casing in concrete grey reads as a lump of rubble.
      material ?? getMaterial(surface).clone(),
      capacity,
    )
    // An instanced mesh is drawn (program lookup and all) even at count 0, so an idle pool is switched off.
    this.mesh.visible = false
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.mesh.frustumCulled = false
    // Live chunks are kept contiguous by swap-removal, so the instance count — and
    // therefore the per-frame work and the GPU's instance draw — tracks what is
    // actually on screen rather than the pool size.
    this.mesh.count = 0
  }

  get active(): number {
    return this.count
  }

  /** Move chunk `from` into slot `to`, keeping the live range contiguous. */
  private move(to: number, from: number): void {
    const a = to * 3
    const b = from * 3
    for (let k = 0; k < 3; k++) {
      this.pos[a + k] = this.pos[b + k]!
      this.vel[a + k] = this.vel[b + k]!
      this.rot[a + k] = this.rot[b + k]!
      this.spin[a + k] = this.spin[b + k]!
      this.size[a + k] = this.size[b + k]!
    }
    this.life[to] = this.life[from]!
    this.maxLife[to] = this.maxLife[from]!
    this.restY[to] = this.restY[from]!
    this.landed[to] = this.landed[from]!
    // (Its place is written at its old slot, not this one.)
    this.held[to] = 0
  }

  burst(origin: THREE.Vector3, o: ChunkBurst): void {
    _dir.copy(o.normal)
    if (_dir.lengthSq() < 1e-6) _dir.set(0, 1, 0)
    else _dir.normalize()

    for (let n = 0; n < o.count; n++) {
      let i: number
      if (this.count < this.capacity) {
        i = this.count++
      } else {
        i = this.cursor
        this.cursor = (this.cursor + 1) % this.capacity
      }
      const i3 = i * 3

      // Scatter the spawn point so the break reads as coming FROM the impact.
      this.pos[i3] = origin.x + (Math.random() - 0.5) * o.spread * 2
      this.pos[i3 + 1] = origin.y + (Math.random() - 0.5) * o.spread * 2
      this.pos[i3 + 2] = origin.z + (Math.random() - 0.5) * o.spread * 2

      // Mostly along the impact normal, with enough scatter to look torn apart.
      const speed = o.speed * (0.35 + Math.random() * 0.95)
      this.vel[i3] = (_dir.x + (Math.random() - 0.5) * 0.9) * speed
      this.vel[i3 + 1] = (_dir.y + Math.random() * 0.7) * speed + 1.5
      this.vel[i3 + 2] = (_dir.z + (Math.random() - 0.5) * 0.9) * speed

      this.rot[i3] = Math.random() * Math.PI
      this.rot[i3 + 1] = Math.random() * Math.PI
      this.rot[i3 + 2] = Math.random() * Math.PI
      this.spin[i3] = (Math.random() - 0.5) * 12
      this.spin[i3 + 1] = (Math.random() - 0.5) * 12
      this.spin[i3 + 2] = (Math.random() - 0.5) * 12

      // Irregular, slab-ish chunks rather than cubes.
      const base = o.minSize + Math.random() * (o.maxSize - o.minSize)
      this.size[i3] = base * (0.6 + Math.random() * 0.8)
      this.size[i3 + 1] = base * (0.6 + Math.random() * 0.8)
      this.size[i3 + 2] = base * (0.6 + Math.random() * 0.8)

      const life = (o.life ?? 2.6) * (0.7 + Math.random() * 0.6)
      this.life[i] = life
      this.maxLife[i] = life
      this.restY[i] = o.restY
      this.landed[i] = 0
      this.held[i] = 0
    }
  }

  update(dt: number): void {
    // Sent to the graphics chip only when a place was written (a pile lying still is not sent again every frame).
    let wrote = false
    for (let i = 0; i < this.count; ) {
      const next = this.life[i]! - dt
      const i3 = i * 3
      if (next <= 0) {
        this.count--
        if (i !== this.count) this.move(i, this.count)
        wrote = true
        continue
      }
      this.life[i] = next
      // Shrink away over the last third of life, so pieces vanish rather than pop.
      const t = next / this.maxLife[i]!
      // Down and still, its place already written: nothing to work out until it begins to shrink (a room's rubble and
      // gore lying about was every piece's matrix worked out again every frame for nothing).
      if (this.held[i]) {
        if (t <= 0.33) {
          // Its place at full size, its three axes scaled down (what compose with the smaller size would give).
          const f = t / 0.33
          const r = this.rest
          const a = this.mesh.instanceMatrix.array as Float32Array
          const o = i * 16
          for (let k = 0; k < 12; k++) a[o + k] = r[o + k]! * f
          a[o + 12] = r[o + 12]!
          a[o + 13] = r[o + 13]!
          a[o + 14] = r[o + 14]!
          a[o + 15] = 1
          wrote = true
        }
        i++
        continue
      }

      this.vel[i3 + 1] = this.vel[i3 + 1]! - 34 * dt
      this.pos[i3] = this.pos[i3]! + this.vel[i3]! * dt
      this.pos[i3 + 1] = this.pos[i3 + 1]! + this.vel[i3 + 1]! * dt
      this.pos[i3 + 2] = this.pos[i3 + 2]! + this.vel[i3 + 2]! * dt

      const floor = this.restY[i]! + this.size[i3 + 1]! * 0.5
      if (this.pos[i3 + 1]! <= floor) {
        this.pos[i3 + 1] = floor
        if (!this.landed[i]) {
          this.landed[i] = 1
          this.onLand?.(this.pos[i3]!, floor, this.pos[i3 + 2]!, -this.vel[i3 + 1]!, Math.max(this.size[i3]!, this.size[i3 + 1]!, this.size[i3 + 2]!))
        }
        if (this.vel[i3 + 1]! < -1.2) {
          // Bounce, losing most of the energy and a lot of the spin.
          this.vel[i3 + 1] = -this.vel[i3 + 1]! * 0.32
          this.vel[i3]! *= 0.6
          this.vel[i3 + 2]! *= 0.6
          this.spin[i3]! *= 0.4
          this.spin[i3 + 1]! *= 0.4
          this.spin[i3 + 2]! *= 0.4
        } else {
          // Settled: stop dead so a pile of rubble does not jitter. (Sliding to a stop, and still at last: not crept toward
          // nought for a hundred frames, each of them its place worked out again.)
          this.vel[i3 + 1] = 0
          this.vel[i3]! *= 0.82
          this.vel[i3 + 2]! *= 0.82
          if (Math.abs(this.vel[i3]!) < 0.05 && Math.abs(this.vel[i3 + 2]!) < 0.05) {
            this.vel[i3] = 0
            this.vel[i3 + 2] = 0
          }
          this.spin[i3] = 0
          this.spin[i3 + 1] = 0
          this.spin[i3 + 2] = 0
        }
      }

      this.rot[i3] = this.rot[i3]! + this.spin[i3]! * dt
      this.rot[i3 + 1] = this.rot[i3 + 1]! + this.spin[i3 + 1]! * dt
      this.rot[i3 + 2] = this.rot[i3 + 2]! + this.spin[i3 + 2]! * dt

      const fade = t > 0.33 ? 1 : t / 0.33

      _p.set(this.pos[i3]!, this.pos[i3 + 1]!, this.pos[i3 + 2]!)
      _e.set(this.rot[i3]!, this.rot[i3 + 1]!, this.rot[i3 + 2]!)
      _q.setFromEuler(_e)
      _s.set(this.size[i3]! * fade, this.size[i3 + 1]! * fade, this.size[i3 + 2]! * fade)
      _m.compose(_p, _q, _s)
      this.mesh.setMatrixAt(i, _m)
      wrote = true
      this.held[i] = this.landed[i]! && this.vel[i3 + 1] === 0 && Math.abs(this.vel[i3]!) < 1e-3 && Math.abs(this.vel[i3 + 2]!) < 1e-3 && this.spin[i3] === 0 && this.spin[i3 + 1] === 0 && this.spin[i3 + 2] === 0 ? 1 : 0
      if (this.held[i]) {
        // Kept at full size for the shrinking (rest): the axes worked out at this fade, undone.
        const r = this.rest
        const o = i * 16
        const el = _m.elements
        const inv = fade > 0 ? 1 / fade : 0
        for (let k = 0; k < 12; k++) r[o + k] = el[k]! * inv
        r[o + 12] = el[12]!
        r[o + 13] = el[13]!
        r[o + 14] = el[14]!
      }
      i++
    }

    this.mesh.count = this.count
    this.mesh.visible = this.count > 0
    if (wrote) this.mesh.instanceMatrix.needsUpdate = true
  }

  clear(): void {
    this.count = 0
    this.cursor = 0
    this.mesh.count = 0
    this.mesh.visible = false
  }
}
