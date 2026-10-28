/**
 * The level as the enemies walk it, and the way to you from everywhere at once: a crowd's pathfinding done once for all
 * of them, not once for each.
 *
 *   The grid    the level's floor in CELL-metre squares: for each, the height of the floor (none: no floor within
 *               reach — a pit, inside a wall), and which of its sides a man can cross (no wall between the two cells at
 *               his knees, a step he can take). Worked out from the level's own collision, a slice at a time (`build`,
 *               `buildAsync`); again whenever the level's static collision changes.
 *   The field   from every cell he could walk from, how many cells it is to the one you are standing in, round walls,
 *               through doors that are open — the solid things that move (a door's leaves, a crate) stamped onto the grid
 *               afresh each time. Worked out again as you move, a slice a frame (`tick`), into a second copy that takes
 *               over when it is done, so a fight never waits for it.
 *
 * An enemy asks the way (`toward`: downhill on the field, round corners and through doorways, from wherever it is), and
 * whether a step is clear (`clear`: the floor there, no wall or solid thing in the way, no drop) — a look-up each, where
 * every rifleman had cast his own rays through the level, several times a second, for both.
 */

import * as THREE from 'three'
import type { CollisionSystem } from '../physics/collision'

/** Metres a cell is across. */
export const NAV_CELL = 1
/** How far over the floor (metres) walls are looked for, and the step up or down a man can take between two cells. */
const KNEE = 0.5
const STEP = 0.6
/** Where the floor is looked for from: this far over the level's ground (`ground`: under any ceiling, over any step). */
const FLOOR_FROM = 2.4
/** No floor within this far below `FLOOR_FROM` — a pit — is no floor. */
const FLOOR_REACH = 6
/** Cells beyond this many from you are not worked out: an enemy that far off walks straight at you until it is nearer. */
const FIELD_REACH = 90
const UNREACHED = 0xffff
/** How often a second the field is worked out again (sooner when you move to another cell). */
const FIELD_HZ = 4

const _o = new THREE.Vector3()
const _d = new THREE.Vector3()
const _down = new THREE.Vector3(0, -1, 0)

export class NavGrid {
  minX = 0
  minZ = 0
  nx = 0
  nz = 0
  /** Floor height per cell; NaN: no floor. */
  floor = new Float32Array(0)
  /** Per cell: bit 0, its +X side can be crossed; bit 1, its +Z side; bit 2, its floor is flat, level with all four neighbours'. */
  side = new Uint8Array(0)
  /** Ready to be asked (the grid is built). */
  ready = false
  /** The height of the level's ground (where its player starts), that the floor is looked for from above. */
  ground = 0
  /** The static collision it was built from (CollisionSystem.signature). */
  private builtFor = ''
  private building: Generator<void> | null = null
  private buildingFor = ''

  // ---- the field
  /** Cells to you, per cell (UNREACHED: not reached); the one being asked, and the one being worked out. */
  private dist = new Uint16Array(0)
  private next = new Uint16Array(0)
  /** Cells covered this time by solid things that move. */
  private blocked = new Uint8Array(0)
  private queue = new Int32Array(0)
  private qHead = 0
  private qTail = 0
  private filling = false
  /** The cell the field leads to (-1: none yet), and the one being worked out toward. */
  private target = -1
  private fillTarget = -1
  private sinceFill = Infinity
  /** A field has been worked out at least once. */
  fieldReady = false

  constructor(private readonly collision: CollisionSystem) {}

  /** The level it was built for is gone (World.clear): ask nothing of it until the next one's grid is built — its cells
   * and field would lead the new level's crowd by the old one's walls. */
  forget(): void {
    this.ready = false
    this.fieldReady = false
    this.filling = false
    this.target = -1
    this.building = null
    this.builtFor = ''
  }

  // ---- the grid ----------------------------------------------------------------------------------------------------

  /** The grid built whole, now (a small level, a test). */
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
    const floor = new Float32Array(nx * nz)
    const side = new Uint8Array(nx * nz)
    const from = this.ground + FLOOR_FROM
    // The floor under each cell's middle.
    for (let z = 0; z < nz; z++) {
      for (let x = 0; x < nx; x++) {
        _o.set(b.min.x + (x + 0.5) * NAV_CELL, from, b.min.z + (z + 0.5) * NAV_CELL)
        const hit = this.collision.raycast(_o, _down, FLOOR_REACH)
        floor[z * nx + x] = hit && (hit.face?.normal.y ?? 1) > 0.5 ? hit.point.y : NaN
      }
      yield
    }
    // Which sides can be crossed: a floor on both sides, a step a man can take, and no wall between at his knees (looked
    // for both ways: a wall's face is only met from in front of it).
    const crossable = (a: number, c: number, ax: number, az: number, cx: number, cz: number): boolean => {
      const fa = floor[a]!
      const fc = floor[c]!
      if (Number.isNaN(fa) || Number.isNaN(fc) || Math.abs(fa - fc) > STEP) return false
      const y = Math.max(fa, fc) + KNEE
      _o.set(b.min.x + (ax + 0.5) * NAV_CELL, y, b.min.z + (az + 0.5) * NAV_CELL)
      _d.set(cx - ax, 0, cz - az)
      if (this.collision.raycast(_o, _d, NAV_CELL)) return false
      _o.set(b.min.x + (cx + 0.5) * NAV_CELL, y, b.min.z + (cz + 0.5) * NAV_CELL)
      _d.negate()
      return !this.collision.raycast(_o, _d, NAV_CELL)
    }
    for (let z = 0; z < nz; z++) {
      for (let x = 0; x < nx; x++) {
        const i = z * nx + x
        if (x + 1 < nx && crossable(i, i + 1, x, z, x + 1, z)) side[i]! |= 1
        if (z + 1 < nz && crossable(i, i + nx, x, z, x, z + 1)) side[i]! |= 2
      }
      yield
    }
    // Flat: a floor level with every neighbour's (and crossable to each) — the floor anywhere in it is its own height.
    for (let z = 1; z < nz - 1; z++) {
      for (let x = 1; x < nx - 1; x++) {
        const i = z * nx + x
        const f = floor[i]!
        if (Number.isNaN(f)) continue
        if ((side[i]! & 3) !== 3 || (side[i - 1]! & 1) === 0 || (side[i - nx]! & 2) === 0) continue
        if ([i - 1, i + 1, i - nx, i + nx].every((n) => Math.abs(floor[n]! - f) < 0.01)) side[i]! |= 4
      }
    }
    this.minX = b.min.x
    this.minZ = b.min.z
    this.nx = nx
    this.nz = nz
    this.floor = floor
    this.side = side
    this.dist = new Uint16Array(nx * nz).fill(UNREACHED)
    this.next = new Uint16Array(nx * nz).fill(UNREACHED)
    this.blocked = new Uint8Array(nx * nz)
    this.queue = new Int32Array(nx * nz)
    this.filling = false
    this.fieldReady = false
    this.target = -1
    this.sinceFill = Infinity
    this.builtFor = sig
    this.ready = true
  }

  /** The cell at (x, z), or -1 off the grid. */
  cellAt(x: number, z: number): number {
    const cx = Math.floor((x - this.minX) / NAV_CELL)
    const cz = Math.floor((z - this.minZ) / NAV_CELL)
    if (cx < 0 || cz < 0 || cx >= this.nx || cz >= this.nz) return -1
    return cz * this.nx + cx
  }

  /** Can a man cross from cell `a` to its neighbour `c` (one of the four), now? */
  private open(a: number, c: number): boolean {
    if (this.blocked[c]) return false
    const d = c - a
    if (d === 1) return (this.side[a]! & 1) !== 0 && (a % this.nx) + 1 < this.nx
    if (d === -1) return (this.side[c]! & 1) !== 0 && a % this.nx > 0
    if (d === this.nx) return (this.side[a]! & 2) !== 0
    if (d === -this.nx) return (this.side[c]! & 2) !== 0
    return false
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
    const goalCell = this.cellAt(goal.x, goal.z)
    if (!this.filling) {
      if (goalCell < 0 || (goalCell === this.target && this.sinceFill < 1 / FIELD_HZ)) return
      this.beginFill(goalCell, solids)
    }
    this.fill(until)
  }

  private beginFill(goal: number, solids: Iterable<{ solid: boolean; aabb: THREE.Box3 }>): void {
    this.blocked.fill(0)
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
          const i = z * this.nx + x
          const f = this.floor[i]!
          if (!Number.isNaN(f) && a.min.y < f + 1.6 && a.max.y > f + 0.25) this.blocked[i] = 1
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
    // open()'s four tests written out, on locals: a method call and its property loads for every neighbour of every
    // cell was a microsecond a cell without the optimising compiler. (On a grid one cell wide nothing is open, as there.)
    const nx = this.nx
    const next = this.next
    const queue = this.queue
    const blocked = this.blocked
    const side = this.side
    const len = next.length
    let head = this.qHead
    let tail = this.qTail
    let n = 0
    while (head < tail) {
      const c = queue[head++]!
      const d = next[c]! + 1
      if (d <= FIELD_REACH && nx > 1) {
        const x = c % nx
        const s = side[c]!
        let nb = c + 1
        if (x + 1 < nx && (s & 1) !== 0 && next[nb] === UNREACHED && !blocked[nb]) {
          next[nb] = d
          queue[tail++] = nb
        }
        nb = c - 1
        if (x > 0 && (side[nb]! & 1) !== 0 && next[nb] === UNREACHED && !blocked[nb]) {
          next[nb] = d
          queue[tail++] = nb
        }
        nb = c + nx
        if (nb < len && (s & 2) !== 0 && next[nb] === UNREACHED && !blocked[nb]) {
          next[nb] = d
          queue[tail++] = nb
        }
        nb = c - nx
        if (nb >= 0 && (side[nb]! & 2) !== 0 && next[nb] === UNREACHED && !blocked[nb]) {
          next[nb] = d
          queue[tail++] = nb
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
   * The way to you from `p` (flat, unit, into `out`): toward the neighbouring cell nearest you on the field, of the eight
   * (a corner only if both its sides are open). Null if `p` is not on the field (off the grid, too far, shut off).
   */
  toward(p: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 | null {
    if (!this.fieldReady) return null
    const c = this.cellAt(p.x, p.z)
    if (c < 0) return null
    const here = this.dist[c]!
    if (here === UNREACHED) return null
    const nx = this.nx
    let best = here
    let bx = 0
    let bz = 0
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dz) continue
        const nb = c + dz * nx + dx
        if (nb < 0 || nb >= this.dist.length) continue
        if (dx && dz) {
          // A corner: both of the sides it passes open.
          if (!this.open(c, c + dx) || !this.open(c + dx, nb) || !this.open(c, c + dz * nx) || !this.open(c + dz * nx, nb)) continue
        } else if (!this.open(c, nb)) continue
        // A diagonal step is longer: weighed so a straight one at the same count is taken.
        const v = this.dist[nb]! + (dx && dz ? 0.4 : 0)
        if (v < best) {
          best = v
          bx = dx
          bz = dz
        }
      }
    }
    // In your cell, or hemmed in: no way to give.
    if (bx === 0 && bz === 0) return null
    // Toward the middle of that cell (which also keeps him off the walls of a corridor).
    const cx = this.minX + ((c % nx) + bx + 0.5) * NAV_CELL
    const cz = this.minZ + (Math.floor(c / nx) + bz + 0.5) * NAV_CELL
    out.set(cx - p.x, 0, cz - p.z)
    const l = out.length()
    if (l < 1e-4) return out.set(bx, 0, bz).normalize()
    return out.divideScalar(l)
  }

  /** The floor's height at (x, z) if it is somewhere flat (a flat cell's, with nothing standing on it now); else null. */
  flatFloor(x: number, z: number): number | null {
    if (!this.ready) return null
    const c = this.cellAt(x, z)
    if (c < 0 || (this.side[c]! & 4) === 0 || this.blocked[c]) return null
    return this.floor[c]!
  }

  /**
   * May a man go from (fx, fz) to (tx, tz) — a step no longer than a cell — by the grid: the same cell, or a neighbour
   * whose side between them can be crossed (round a corner, both ways round it open)? True off the grid or from a cell
   * with no floor (inside something already: let out), so it only ever stops a step through a wall or up a sheer edge.
   */
  canEnter(fx: number, fz: number, tx: number, tz: number): boolean {
    if (!this.ready) return true
    const c = this.cellAt(fx, fz)
    if (c < 0 || Number.isNaN(this.floor[c]!)) return true
    const n = this.cellAt(tx, tz)
    if (n === c) return true
    if (n < 0) return false
    const nx = this.nx
    const dx = (n % nx) - (c % nx)
    const dz = Math.floor(n / nx) - Math.floor(c / nx)
    if (dx < -1 || dx > 1 || dz < -1 || dz > 1) return true
    if (dx && dz) {
      const a = c + dx
      const b = c + dz * nx
      return (this.open(c, a) && this.open(a, n)) || (this.open(c, b) && this.open(b, n))
    }
    return this.open(c, n)
  }

  /** How many cells it is to you from `p`, on the field (Infinity: not on it). */
  distanceAt(p: THREE.Vector3): number {
    if (!this.fieldReady) return Infinity
    const c = this.cellAt(p.x, p.z)
    if (c < 0) return Infinity
    const d = this.dist[c]!
    return d === UNREACHED ? Infinity : d
  }

  /**
   * Can a man walk from `p` `reach` metres along `dir` (flat, unit)? Every cell the step passes into must be floor he can
   * step onto from the last, with no wall or solid thing in the way, and no drop. Null if `p` is not on the grid (ask
   * the level itself).
   */
  clear(p: THREE.Vector3, dir: THREE.Vector3, reach: number): boolean | null {
    if (!this.ready) return null
    let c = this.cellAt(p.x, p.z)
    if (c < 0 || Number.isNaN(this.floor[c]!)) return null
    const steps = Math.max(1, Math.ceil(reach / (NAV_CELL * 0.5)))
    for (let s = 1; s <= steps; s++) {
      const t = (reach * s) / steps
      const n = this.cellAt(p.x + dir.x * t, p.z + dir.z * t)
      if (n < 0) return false
      if (n === c) continue
      const dx = (n % this.nx) - (c % this.nx)
      const dz = Math.floor(n / this.nx) - Math.floor(c / this.nx)
      if (dx && dz) {
        // Across a corner: open both ways round it.
        const a = c + dx
        const b = c + dz * this.nx
        if (!((this.open(c, a) && this.open(a, n)) || (this.open(c, b) && this.open(b, n)))) return false
      } else if (!this.open(c, n)) return false
      c = n
    }
    return true
  }
}
