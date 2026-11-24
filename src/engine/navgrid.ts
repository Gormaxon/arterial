/**
 * The level as the enemies walk it, and the way to you from everywhere at once: a crowd's pathfinding done once for all
 * of them, not once for each.
 *
 *   The grid    the level's floors in CELL-metre squares, every storey of them: for each square, each floor a man can
 *               stand on in it (a surface with room over it for him — not inside a wall, not under a pipe), and which
 *               floor of each neighbouring square he can cross to (a step he can take, no wall between at his knees).
 *               Worked out from the level's own collision, a slice at a time (`build`, `buildAsync`); again whenever the
 *               level's static collision changes.
 *   The field   from every floor he could walk from, how many squares it is to the one you are standing on, round walls,
 *               through doors that are open, up and down stairs — the solid things that move (a door's leaves, a crate)
 *               stamped onto the grid afresh each time. Worked out again as you move, a slice a frame (`tick`), into a
 *               second copy that takes over when it is done, so a fight never waits for it.
 *
 * An enemy asks the way (`toward`: downhill on the field, round corners and through doorways, from wherever it is), and
 * whether a step is clear (`clear`: the floor there, no wall or solid thing in the way, no drop) — a look-up each, where
 * every rifleman had cast his own rays through the level, several times a second, for both. Each is asked from where he
 * is, height and all: the floor he is on is the one under his feet, not the storey above or below.
 *
 * (Every storey: the grid was one floor only, looked for a little under where the player starts — and Level 1 and Level
 * 2 start at the top of a 56 m shaft, so it found no floor at all in either: nothing stopped an enemy walking into a
 * wall, and nothing led one round it. The user, 2026-11-24: "enemies get stuck on wall decorations and sometimes in walls
 * and objects".)
 */

import * as THREE from 'three'
import type { CollisionSystem } from '../physics/collision'

/** Metres a cell is across. */
export const NAV_CELL = 1
/** How far over the floor (metres) walls are looked for, and the step up or down a man can take between two cells. */
const KNEE = 0.5
const STEP = 0.6
/** Room a man needs over a floor for it to be one he can stand on (metres). */
const HEAD = 1.8
/** At most this many floors one over another in a square, and surfaces a column is looked down through for them. */
const MAX_LAYERS = 8
const MAX_HITS = 64
/** A man this far over the floor under him is not on it (falling, flying, inside something): the grid has no say. */
const ON_FLOOR = 2.5
/** Cells beyond this many from you are not worked out: an enemy that far off walks straight at you until it is nearer. */
const FIELD_REACH = 90
const UNREACHED = 0xffff
/** How often a second the field is worked out again (sooner when you move to another cell). */
const FIELD_HZ = 4
/** The four ways out of a square, as `link` holds them: +X, -X, +Z, -Z. */
const PX = 0
const NX = 1
const PZ = 2
const NZ = 3

const _o = new THREE.Vector3()
const _d = new THREE.Vector3()
const _down = new THREE.Vector3(0, -1, 0)

export class NavGrid {
  minX = 0
  minZ = 0
  nx = 0
  nz = 0
  /** Squares in the grid (nx * nz). A floor is a node: layer * cells + square. */
  cells = 0
  /** Floors one over another in the square that has most (each square's from its highest, layer 0, down). */
  layers = 0
  /** Floor height per node; NaN: no floor. */
  floor = new Float32Array(0)
  /** Per node: bit 2, its floor is flat — level with, and crossable to, a floor in each of its four neighbours. */
  side = new Uint8Array(0)
  /** Per node, four of them (PX, NX, PZ, NZ): the layer of the floor next door it crosses to that way; -1, none. */
  link = new Int8Array(0)
  /** Ready to be asked (the grid is built). */
  ready = false
  /** Where the level's player starts (kept for the world that sets it; the grid looks for every floor). */
  ground = 0
  /** The static collision it was built from (CollisionSystem.signature). */
  private builtFor = ''
  private building: Generator<void> | null = null
  private buildingFor = ''

  // ---- the field
  /** Cells to you, per node (UNREACHED: not reached); the one being asked, and the one being worked out. */
  private dist = new Uint16Array(0)
  private next = new Uint16Array(0)
  /** Nodes covered this time by solid things that move. */
  private blocked = new Uint8Array(0)
  private queue = new Int32Array(0)
  private qHead = 0
  private qTail = 0
  private filling = false
  /** The node the field leads to (-1: none yet), and the one being worked out toward. */
  private target = -1
  private fillTarget = -1
  private sinceFill = Infinity
  /** A field has been worked out at least once. */
  fieldReady = false

  constructor(private readonly collision: CollisionSystem) {}

  /**
   * The level it was worked out for is gone (World.clear): its way to you is not asked for again until worked out afresh
   * — it would lead the next level's crowd by the old one's walls. The grid itself is kept: it is built again only if the
   * next level's collision differs (`current`), and a level loaded again as it was (every restart) keeps it: built anew
   * each time, it was seconds of a slow machine's frames after every restart.
   */
  forget(): void {
    this.fieldReady = false
    this.filling = false
    this.target = -1
    this.sinceFill = Infinity
  }

  /** The whole grid, at once. */
  build(): void {
    for (const _ of this.buildSteps()) {
      /* all of it */
    }
  }

  /** The grid built a slice at a time, `slice` awaited between (a loading screen paints). */
  async buildAsync(slice: () => Promise<void> = async () => {}, sliceMs = 14): Promise<void> {
    let t = performance.now()
    for (const _ of this.buildSteps()) {
      if (performance.now() - t > sliceMs) {
        await slice()
        t = performance.now()
      }
    }
  }

  /** Is it built for the level as it stands? (Not: built again by `tick`, a slice a frame.) */
  get current(): boolean {
    return this.ready && this.builtFor === this.collision.signature
  }

  private *buildSteps(): Generator<void> {
    const sig = this.collision.signature
    const b = this.collision.staticBounds(new THREE.Box3())
    this.ready = false
    if (b.isEmpty()) {
      this.builtFor = sig
      return
    }
    const nx = Math.max(1, Math.ceil((b.max.x - b.min.x) / NAV_CELL))
    const nz = Math.max(1, Math.ceil((b.max.z - b.min.z) / NAV_CELL))
    const cells = nx * nz
    // Each square's floors, from the top down: one ray down through the whole column at a time, both faces of every
    // surface met. A floor is a surface's top with open air over it, HEAD at least, up to the last thing above — not
    // the top of a slab under another's top (inside a wall: its floor runs under it), not under a pipe.
    const found = new Float32Array(cells * MAX_LAYERS).fill(NaN)
    const count = new Uint8Array(cells)
    let layers = 0
    const top = b.max.y + 1
    const bottom = b.min.y - 1
    for (let z = 0; z < nz; z++) {
      for (let x = 0; x < nx; x++) {
        const c = z * nx + x
        _o.set(b.min.x + (x + 0.5) * NAV_CELL, top, b.min.z + (z + 0.5) * NAV_CELL)
        // The last surface met over the one now, and whether there was open air under it (an underside, or the sky).
        let aboveY = Infinity
        let openUnder = true
        for (let k = 0; k < MAX_HITS && _o.y > bottom; k++) {
          const hit = this.collision.raycast(_o, _down, _o.y - bottom, THREE.DoubleSide)
          if (!hit) break
          const ny = hit.face?.normal.y ?? 0
          const y = hit.point.y
          if (ny > 0.5) {
            if (openUnder && aboveY - y >= HEAD && count[c]! < MAX_LAYERS) found[c * MAX_LAYERS + count[c]!++] = y
            openUnder = false
          } else openUnder = true
          aboveY = y
          _o.y = y - 0.002
        }
        if (count[c]! > layers) layers = count[c]!
      }
      yield
    }
    layers = Math.max(1, layers)
    const nodes = cells * layers
    const floor = new Float32Array(nodes).fill(NaN)
    for (let c = 0; c < cells; c++) for (let l = 0; l < count[c]!; l++) floor[l * cells + c] = found[c * MAX_LAYERS + l]!
    const side = new Uint8Array(nodes)
    const link = new Int8Array(nodes * 4).fill(-1)
    // Which floor next door each floor crosses to: the one within a step of it (the nearest), with no wall between at
    // his knees (faces turned either way: a wall's face is only met from in front of it, and one cast seeing both is
    // half the casts of looking from each end).
    const pair = (c: number, n: number, ax: number, az: number, dx: number, dz: number, out: number, back: number): void => {
      for (let la = 0; la < count[c]!; la++) {
        const fa = floor[la * cells + c]!
        let lb = -1
        let best = STEP
        for (let l = 0; l < count[n]!; l++) {
          const d = Math.abs(floor[l * cells + n]! - fa)
          if (d <= best) {
            best = d
            lb = l
          }
        }
        if (lb < 0) continue
        const y = Math.max(fa, floor[lb * cells + n]!) + KNEE
        _o.set(b.min.x + (ax + 0.5) * NAV_CELL, y, b.min.z + (az + 0.5) * NAV_CELL)
        _d.set(dx, 0, dz)
        if (this.collision.raycast(_o, _d, NAV_CELL, THREE.DoubleSide)) continue
        link[(la * cells + c) * 4 + out] = lb
        link[(lb * cells + n) * 4 + back] = la
      }
    }
    for (let z = 0; z < nz; z++) {
      for (let x = 0; x < nx; x++) {
        const c = z * nx + x
        if (!count[c]) continue
        if (x + 1 < nx) pair(c, c + 1, x, z, 1, 0, PX, NX)
        if (z + 1 < nz) pair(c, c + nx, x, z, 0, 1, PZ, NZ)
      }
      yield
    }
    // Flat: crossable each of the four ways to a floor level with its own — the floor anywhere in it is its own height.
    for (let n = 0; n < nodes; n++) {
      const f = floor[n]!
      if (Number.isNaN(f)) continue
      const c = n % cells
      let flat = true
      for (let w = 0; w < 4 && flat; w++) {
        const l = link[n * 4 + w]!
        const nb = l < 0 ? -1 : this.stepCell(c, w, nx, cells)
        if (nb < 0 || Math.abs(floor[l * cells + nb]! - f) > 0.01) flat = false
      }
      if (flat) side[n]! |= 4
    }
    this.minX = b.min.x
    this.minZ = b.min.z
    this.nx = nx
    this.nz = nz
    this.cells = cells
    this.layers = layers
    this.floor = floor
    this.side = side
    this.link = link
    this.dist = new Uint16Array(nodes).fill(UNREACHED)
    this.next = new Uint16Array(nodes).fill(UNREACHED)
    this.blocked = new Uint8Array(nodes)
    this.queue = new Int32Array(nodes)
    this.filling = false
    this.fieldReady = false
    this.target = -1
    this.sinceFill = Infinity
    this.builtFor = sig
    this.ready = true
  }

  /** The square next to `c` the way `w` goes, or -1 off the grid. */
  private stepCell(c: number, w: number, nx = this.nx, cells = this.cells): number {
    const x = c % nx
    if (w === PX) return x + 1 < nx ? c + 1 : -1
    if (w === NX) return x > 0 ? c - 1 : -1
    if (w === PZ) return c + nx < cells ? c + nx : -1
    return c - nx >= 0 ? c - nx : -1
  }

  /** The square at (x, z), or -1 off the grid. */
  cellAt(x: number, z: number): number {
    const cx = Math.floor((x - this.minX) / NAV_CELL)
    const cz = Math.floor((z - this.minZ) / NAV_CELL)
    if (cx < 0 || cz < 0 || cx >= this.nx || cz >= this.nz) return -1
    return cz * this.nx + cx
  }

  /**
   * The floor someone at (x, y, z) is on: the highest in that square at or under his feet (a step up allowed), so long as
   * he is no more than `reach` over it. -1: none (off the grid, no floor under him, or not on it).
   */
  nodeAt(x: number, y: number, z: number, reach = ON_FLOOR): number {
    const c = this.cellAt(x, z)
    if (c < 0) return -1
    for (let l = 0; l < this.layers; l++) {
      const n = l * this.cells + c
      const f = this.floor[n]!
      if (Number.isNaN(f)) return -1
      if (f <= y + STEP) return y - f <= reach ? n : -1
    }
    return -1
  }

  /** The floor a man on node `a` crosses to going way `w` (one of the four), now; -1 if he cannot. */
  private open(a: number, w: number): number {
    const l = this.link[a * 4 + w]!
    if (l < 0) return -1
    const c = this.stepCell(a % this.cells, w)
    if (c < 0) return -1
    const n = l * this.cells + c
    return this.blocked[n] ? -1 : n
  }

  /** From node `a`, a diagonal (ways `wx` then `wz`, or `wz` then `wx`): the floor it reaches if both ways round are open; else -1. */
  private corner(a: number, wx: number, wz: number): number {
    const m1 = this.open(a, wx)
    const m2 = this.open(a, wz)
    if (m1 < 0 || m2 < 0) return -1
    const n1 = this.open(m1, wz)
    const n2 = this.open(m2, wx)
    return n1 >= 0 && n1 === n2 ? n1 : -1
  }

  /** The node a step of (dx, dz) squares (each -1, 0 or 1) from `a` reaches by the grid; -1 if it cannot be taken. */
  private stepFrom(a: number, dx: number, dz: number): number {
    const wx = dx > 0 ? PX : NX
    const wz = dz > 0 ? PZ : NZ
    if (dx && dz) return this.corner(a, wx, wz)
    if (dx) return this.open(a, wx)
    if (dz) return this.open(a, wz)
    return a
  }

  // ---- the field ---------------------------------------------------------------------------------------------------

  /**
   * Once a frame: build the grid if the level has changed (a slice of it), and work the field out toward `goal` (a
   * slice of it), for up to `budgetMs` milliseconds. `solids` are the solid things that move, stamped on as they are now
   * each time the field is begun.
   */
  tick(goal: THREE.Vector3, dt: number, budgetMs: number, solids: Iterable<{ solid: boolean; aabb: THREE.Box3 }>): void {
    const until = performance.now() + budgetMs
    if (!this.current) {
      const sig = this.collision.signature
      if (!this.building || this.buildingFor !== sig) {
        this.building = this.buildSteps()
        this.buildingFor = sig
      }
      while (performance.now() < until) {
        if (this.building.next().done) {
          this.building = null
          break
        }
      }
      if (!this.current) return
    }
    this.sinceFill += dt
    // (You, mid-jump, are over the floor you left: any height over it is still yours.)
    const goalNode = this.nodeAt(goal.x, goal.y, goal.z, Infinity)
    if (!this.filling) {
      if (goalNode < 0 || (goalNode === this.target && this.sinceFill < 1 / FIELD_HZ)) return
      this.beginFill(goalNode, solids)
    }
    this.fill(until)
  }

  private beginFill(goal: number, solids: Iterable<{ solid: boolean; aabb: THREE.Box3 }>): void {
    this.blocked.fill(0)
    const cells = this.cells
    for (const s of solids) {
      if (!s.solid) continue
      const a = s.aabb
      // Only what stands in a man's way: over the floor, under his head.
      const x0 = Math.max(0, Math.floor((a.min.x - this.minX) / NAV_CELL))
      const x1 = Math.min(this.nx - 1, Math.floor((a.max.x - this.minX) / NAV_CELL))
      const z0 = Math.max(0, Math.floor((a.min.z - this.minZ) / NAV_CELL))
      const z1 = Math.min(this.nz - 1, Math.floor((a.max.z - this.minZ) / NAV_CELL))
      if ((x1 - x0 + 1) * (z1 - z0 + 1) > 400) continue
      for (let z = z0; z <= z1; z++) {
        for (let x = x0; x <= x1; x++) {
          for (let l = 0; l < this.layers; l++) {
            const i = l * cells + z * this.nx + x
            const f = this.floor[i]!
            if (Number.isNaN(f)) break
            if (a.min.y < f + 1.6 && a.max.y > f + 0.25) this.blocked[i] = 1
          }
        }
      }
    }
    this.next.fill(UNREACHED)
    this.fillTarget = goal
    this.next[goal] = 0
    this.queue[0] = goal
    this.qHead = 0
    this.qTail = 1
    this.filling = true
  }

  private fill(until: number): void {
    // The four ways out of each node written out, on locals: a method call and its property loads for every neighbour
    // of every node was a microsecond each without the optimising compiler.
    const nx = this.nx
    const cells = this.cells
    const next = this.next
    const queue = this.queue
    const blocked = this.blocked
    const link = this.link
    let head = this.qHead
    let tail = this.qTail
    let n = 0
    while (head < tail) {
      const a = queue[head++]!
      const d = next[a]! + 1
      if (d <= FIELD_REACH) {
        const c = a % cells
        const x = c % nx
        const o = a * 4
        for (let w = 0; w < 4; w++) {
          const l = link[o + w]!
          if (l < 0) continue
          const nc = w === PX ? (x + 1 < nx ? c + 1 : -1) : w === NX ? (x > 0 ? c - 1 : -1) : w === PZ ? (c + nx < cells ? c + nx : -1) : c - nx
          if (nc < 0) continue
          const nb = l * cells + nc
          if (next[nb] === UNREACHED && !blocked[nb]) {
            next[nb] = d
            queue[tail++] = nb
          }
        }
      }
      if ((++n & 63) === 0 && performance.now() > until) {
        this.qHead = head
        this.qTail = tail
        return
      }
    }
    this.qHead = head
    this.qTail = tail
    // Done: this field takes over.
    const t = this.dist
    this.dist = this.next
    this.next = t
    this.target = this.fillTarget
    this.filling = false
    this.sinceFill = 0
    this.fieldReady = true
  }

  /**
   * The way to you from `p` (flat, unit, into `out`): toward the neighbouring square nearest you on the field, of the
   * eight (a corner only if both its sides are open). Null if `p` is not on the field (off the grid, too far, shut off).
   */
  toward(p: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 | null {
    if (!this.fieldReady) return null
    const a = this.nodeAt(p.x, p.y, p.z)
    if (a < 0) return null
    const here = this.dist[a]!
    if (here === UNREACHED) return null
    let best = here
    let bx = 0
    let bz = 0
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dz) continue
        const nb = this.stepFrom(a, dx, dz)
        if (nb < 0) continue
        // A diagonal step is longer: weighed so a straight one at the same count is taken.
        const v = this.dist[nb]! + (dx && dz ? 0.4 : 0)
        if (v < best) {
          best = v
          bx = dx
          bz = dz
        }
      }
    }
    // On your floor, or hemmed in: no way to give.
    if (bx === 0 && bz === 0) return null
    // Toward the middle of that square (which also keeps him off the walls of a corridor).
    const c = a % this.cells
    const cx = this.minX + ((c % this.nx) + bx + 0.5) * NAV_CELL
    const cz = this.minZ + (Math.floor(c / this.nx) + bz + 0.5) * NAV_CELL
    out.set(cx - p.x, 0, cz - p.z)
    const l = out.length()
    if (l < 1e-4) return out.set(bx, 0, bz).normalize()
    return out.divideScalar(l)
  }

  /** The floor's height under someone standing at (x, y, z) if it is somewhere flat (with nothing standing on it now); else null. */
  flatFloor(x: number, y: number, z: number): number | null {
    if (!this.ready) return null
    const a = this.nodeAt(x, y, z, 0.3)
    if (a < 0 || (this.side[a]! & 4) === 0 || this.blocked[a]) return null
    return this.floor[a]!
  }

  /**
   * May a man at height `y` go from (fx, fz) to (tx, tz) by the grid: the same square, or a neighbour whose floor he can
   * cross to (round a corner, both ways round it open)? True off the grid, or where he is on no floor it knows (inside
   * something already, falling, flying: let out), so it only ever stops a step through a wall or up a sheer edge.
   */
  canEnter(fx: number, fz: number, tx: number, tz: number, y: number): boolean {
    if (!this.ready) return true
    const a = this.nodeAt(fx, y, fz)
    if (a < 0) return true
    const c = a % this.cells
    const n = this.cellAt(tx, tz)
    if (n === c) return true
    if (n < 0) return false
    const nx = this.nx
    const dx = (n % nx) - (c % nx)
    const dz = Math.floor(n / nx) - Math.floor(c / nx)
    // A step over more than one cell (a hard shove, a blast's throw, a dodge, a long frame): walked a half cell at a time,
    // every crossing asked — once let through unasked, and a man thrown at a wall went through it (the user, 2026-11-24:
    // "enemies phase through walls sometimes").
    if (dx < -1 || dx > 1 || dz < -1 || dz > 1) {
      const steps = Math.ceil(Math.max(Math.abs(tx - fx), Math.abs(tz - fz)) / (NAV_CELL * 0.5))
      let px = fx
      let pz = fz
      let py = y
      for (let i = 1; i <= steps; i++) {
        const qx = fx + ((tx - fx) * i) / steps
        const qz = fz + ((tz - fz) * i) / steps
        if (!this.canEnter(px, pz, qx, qz, py)) return false
        // On whatever floor that step came onto (a stair taken partway).
        const on = this.nodeAt(qx, py, qz)
        if (on >= 0) py = this.floor[on]!
        px = qx
        pz = qz
      }
      return true
    }
    return this.stepFrom(a, dx, dz) >= 0
  }

  /** How many cells it is to you from `p`, on the field (Infinity: not on it). */
  distanceAt(p: THREE.Vector3): number {
    if (!this.fieldReady) return Infinity
    const a = this.nodeAt(p.x, p.y, p.z)
    if (a < 0) return Infinity
    const d = this.dist[a]!
    return d === UNREACHED ? Infinity : d
  }

  /**
   * Can a man walk from `p` `reach` metres along `dir` (flat, unit)? Every square the step passes into must have a floor
   * he can step onto from the last, with no wall or solid thing in the way, and no drop. Null if `p` is on no floor the
   * grid knows (ask the level itself).
   */
  clear(p: THREE.Vector3, dir: THREE.Vector3, reach: number): boolean | null {
    if (!this.ready) return null
    let a = this.nodeAt(p.x, p.y, p.z)
    if (a < 0) return null
    const steps = Math.max(1, Math.ceil(reach / (NAV_CELL * 0.5)))
    for (let s = 1; s <= steps; s++) {
      const t = (reach * s) / steps
      const n = this.cellAt(p.x + dir.x * t, p.z + dir.z * t)
      if (n < 0) return false
      const c = a % this.cells
      if (n === c) continue
      const dx = (n % this.nx) - (c % this.nx)
      const dz = Math.floor(n / this.nx) - Math.floor(c / this.nx)
      const nb = this.stepFrom(a, dx, dz)
      if (nb < 0) return false
      a = nb
    }
    return true
  }
}
