/**
 * The collision system: one BVH over all baked static geometry, plus a list of
 * dynamic box bodies (movers) solved analytically.
 *
 * No rigid-body solver — every good one ships WebAssembly. The player is a kinematic
 * capsule that integrates its own velocity, gets pushed out of whatever it ended up
 * inside, and reads the push directions back as contact normals.
 */

import * as THREE from 'three'
import { MeshBVH, ExtendedTriangle } from 'three-mesh-bvh'
import { resolveCapsuleBox } from './capsule'

/** A push direction steeper than this counts as floor. ~53° — steep enough to stand on. */
const GROUND_NORMAL_Y = 0.6
/** A push direction flatter than this counts as wall, and is therefore clingable. */
const WALL_NORMAL_Y = 0.45

/** Anything the player can stand on and be carried by. */
/** Side of the squares still bodies are filed in (metres), and the most squares a query looks through before it takes all. */
const STILL_CELL = 4
const STILL_MAX_CELLS = 24
/** How far round the capsule a body is looked at even when it has not moved (resolve: a dash closing on it). */
const STILL_MARGIN = 0.35
const stillKey = (x: number, z: number): number => (x + 4096) * 8192 + (z + 4096)

export interface DynamicBody {
  /** World-space bounds, refreshed by the owner each tick. */
  readonly aabb: THREE.Box3
  /** How far this body moved during the current tick — riders are offset by it. */
  readonly delta: THREE.Vector3
  /** Back-reference for gameplay code. Untyped to keep physics free of entity deps. */
  readonly owner: unknown
  solid: boolean
  /** Struck by blows and bullets even when not solid: a decoration you walk through but can still smash. */
  readonly hittable?: boolean
  /**
   * Where a ray meets the body's real shape, for rays that reach its `aabb`. Without it the aabb is the shape: right for
   * a box that never turns, coarse for something that does (a turned drone's aabb is far bigger than the drone).
   * `normal` points out of the body. Return null for a miss.
   */
  rayHit?(ray: THREE.Ray, far: number): { distance: number; point: THREE.Vector3; normal: THREE.Vector3 } | null
  /**
   * Could a ray from `origin` along `dir` (unit) for `far` metres come near the body at all? A cheap test asked before
   * its `aabb` is read, for a body whose box is dear to work out (a posed enemy's, from its bones). Without it, yes.
   */
  nearRay?(origin: THREE.Vector3, dir: THREE.Vector3, far: number): boolean
  /**
   * Never moves by itself (a crate, a door's frame): its box changes only when it is put somewhere else, and the
   * collision is told (CollisionSystem.moved). Filed by where it is, so what is near a point or a line is found without
   * looking through every body in the level (bodiesIn).
   */
  readonly still?: boolean
}

export interface Contacts {
  hit: boolean
  grounded: boolean
  onWall: boolean
  groundNormal: THREE.Vector3
  /** Averaged and normalised. Points away from the wall, toward the player. */
  wallNormal: THREE.Vector3
  /** The mover being stood on, if any. Null when standing on static geometry. */
  groundBody: DynamicBody | null
  /** Which static brush was hit, by bake index. -1 when none or when a mover. */
  brushIndex: number
  /** Something is bearing down on your head. Grounded AND ceiling means squeezed. */
  ceiling: boolean
}

export function createContacts(): Contacts {
  return {
    hit: false,
    grounded: false,
    onWall: false,
    groundNormal: new THREE.Vector3(),
    wallNormal: new THREE.Vector3(),
    groundBody: null,
    brushIndex: -1,
    ceiling: false,
  }
}

const _box = new THREE.Box3()
const _capBounds = new THREE.Box3()
const _near = new THREE.Box3()
const _triPoint = new THREE.Vector3()
const _capPoint = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _e1 = new THREE.Vector3()
const _e2 = new THREE.Vector3()
const _triN = new THREE.Vector3()
/**
 * Metres round a resolve's capsule that the level's triangles are gathered from (CollisionSystem.near), and reused for
 * every resolve after it that stays inside: a player moves centimetres a step, and walking the level's BVH from its root
 * several times a step was half a millisecond a step on the Chromebook.
 */
const NEAR_MARGIN = 1.25
const _nearTri = new ExtendedTriangle()
const _ray = new THREE.Ray()
const _hitPoint = new THREE.Vector3()
const _hitNormal = new THREE.Vector3()
const _rayHit = { distance: 0, point: _hitPoint, normal: _hitNormal }
const _castRay = new THREE.Ray()
const _wallFrom = new THREE.Vector3()
const _wallDir = new THREE.Vector3()

/** A hit from `raycastAny`. */
export interface RayHit {
  distance: number
  point: THREE.Vector3
  normal: THREE.Vector3
  body: DynamicBody | null
  faceIndex: number
}

/**
 * The one `raycastAny` result, reused. The controller fires several of these probes
 * per step (step-up, wall-height checks), and a fresh object plus two cloned vectors
 * each time was steady garbage. Valid until the next `raycastAny` call.
 */
const _anyHit: RayHit = {
  distance: 0,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3(),
  body: null,
  faceIndex: -1,
}

/**
 * Slab-method ray vs AABB, returning the entry face normal.
 *
 * `Ray.intersectBox` gives the point but not which face was crossed, and the face is
 * what impact effects need to spray along.
 */
function rayBox(ray: THREE.Ray, box: THREE.Box3, far: number): typeof _rayHit | null {
  let tmin = 0
  let tmax = far
  let axis = -1
  let sign = 1

  for (let i = 0; i < 3; i++) {
    const o = ray.origin.getComponent(i)
    const d = ray.direction.getComponent(i)
    const lo = box.min.getComponent(i)
    const hi = box.max.getComponent(i)

    if (Math.abs(d) < 1e-9) {
      // Parallel to this slab: a miss unless the origin is already inside it.
      if (o < lo || o > hi) return null
      continue
    }
    const inv = 1 / d
    let t1 = (lo - o) * inv
    let t2 = (hi - o) * inv
    let s = -1
    if (t1 > t2) {
      const tmp = t1
      t1 = t2
      t2 = tmp
      s = 1
    }
    if (t1 > tmin) {
      tmin = t1
      axis = i
      sign = s
    }
    if (t2 < tmax) tmax = t2
    if (tmin > tmax) return null
  }

  if (tmin < 0 || tmin > far) return null
  _rayHit.distance = tmin
  _hitPoint.copy(ray.origin).addScaledVector(ray.direction, tmin)
  _hitNormal.set(0, 0, 0)
  // Started inside the box: there is no entry face, so face the ray.
  if (axis < 0) _hitNormal.copy(ray.direction).negate()
  else _hitNormal.setComponent(axis, sign)
  return _rayHit
}

/**
 * One cell's static collision: its own BVH over its own triangles.
 *
 * A level is many small trees instead of one huge one, so rebuilding after an edit costs one cell, and a
 * query only visits the cells it overlaps.
 */
export interface CollisionChunk {
  id: number
  bounds: THREE.Box3
  bvh: MeshBVH
  /** Per triangle, in ORIGINAL (pre-BVH) order, the owning entity's global index. */
  owners: Uint32Array
  /**
   * The geometry's index buffer. MeshBVH adds an index to non-indexed geometry and permutes it while
   * building, so the triangle indices it reports are in BVH order; this maps them back.
   */
  geometryIndex: ArrayLike<number>
}

/**
 * Face indices handed out by raycasts carry their cell: `cellId * FACE_STRIDE + triangle`. A BVH knows only
 * its own triangle numbers, and a hit has to name the entity it hit whichever cell it was in.
 */
export const FACE_STRIDE = 1 << 21

export class CollisionSystem {
  private readonly chunkMap = new Map<string, CollisionChunk>()
  private readonly chunkById = new Map<number, CollisionChunk>()
  /** The cells to visit, as an array so a query does not allocate an iterator. */
  private chunkList: CollisionChunk[] = []
  private nextChunkId = 1

  readonly dynamics: DynamicBody[] = []

  /** Is there any static collision at all? */
  get hasStatic(): boolean {
    return this.chunkList.length > 0
  }

  /** How many cells have collision. */
  get chunkCount(): number {
    return this.chunkList.length
  }

  /** Total static collision triangles. */
  get triangleCount(): number {
    let n = 0
    for (const c of this.chunkList) n += c.owners.length
    return n
  }

  /** Build (or rebuild) the BVH for a cell. `owners` is each triangle's owning entity index. */
  setChunk(key: string, geometry: THREE.BufferGeometry, owners: Uint32Array): void {
    this.removeChunk(key)
    geometry.computeBoundingBox()
    const bvh = new MeshBVH(geometry)
    // Read the index AFTER building: MeshBVH is what creates and permutes it.
    const chunk: CollisionChunk = { id: this.nextChunkId++, bounds: geometry.boundingBox!.clone(), bvh, owners, geometryIndex: geometry.index!.array }
    this.chunkMap.set(key, chunk)
    this.chunkById.set(chunk.id, chunk)
    this.chunkList = [...this.chunkMap.values()]
    this.sig = null
    this.staticVersion++
  }

  private sig: string | null = null
  /** Goes up whenever the static collision changes (a cell set or removed): what gathered near it is stale then. */
  private staticVersion = 0
  /** The level's triangles near the last resolves (NEAR_MARGIN): their corners, nine numbers each, and their brushes. */
  private readonly near = { box: new THREE.Box3(), version: -1, tris: new Float32Array(9 * 256), brush: new Int32Array(256), n: 0 }
  /**
   * What the static collision is, in a word: the same after a rebake that changed nothing (a level loaded again), a
   * different one after any change. For what is worked out from it once (engine/navgrid.ts).
   */
  get signature(): string {
    this.sig ??= [...this.chunkMap.entries()]
      .map(([k, c]) => `${k}:${c.geometryIndex.length}:${c.bounds.min.toArray().map((v) => v.toFixed(2))}:${c.bounds.max.toArray().map((v) => v.toFixed(2))}`)
      .sort()
      .join('|')
    return this.sig
  }

  /** The box round all of the static collision, into `out` (empty if there is none). */
  staticBounds(out: THREE.Box3): THREE.Box3 {
    out.makeEmpty()
    for (const c of this.chunkList) out.union(c.bounds)
    return out
  }

  removeChunk(key: string): void {
    const old = this.chunkMap.get(key)
    if (!old) return
    this.chunkMap.delete(key)
    this.chunkById.delete(old.id)
    this.chunkList = [...this.chunkMap.values()]
    this.sig = null
    this.staticVersion++
  }

  /** The entity index for a triangle of one cell, in that cell's BVH numbering. */
  private chunkBrush(chunk: CollisionChunk, triIndex: number): number {
    // Each original triangle's three vertices are consecutive, so any one of them identifies it.
    const vertex = chunk.geometryIndex[triIndex * 3] ?? 0
    return chunk.owners[(vertex / 3) | 0] ?? -1
  }

  /** The entity index for a face index a raycast returned (see FACE_STRIDE). */
  brushForTriangle(faceIndex: number): number {
    const id = Math.floor(faceIndex / FACE_STRIDE)
    const chunk = this.chunkById.get(id)
    return chunk ? this.chunkBrush(chunk, faceIndex - id * FACE_STRIDE) : -1
  }

  /**
   * A moving body comes or goes without the filing being done again (file() would look at every body's box — every
   * living man's worked out afresh from his posed pieces, a few hundred microseconds each without the optimising
   * compiler — on every arrival and every death): it goes at the end of the unfiled ones, or out of them, as a fresh
   * filing would have it. A still body is filed again. (A man's box is then worked out when something first asks for it,
   * not also as a side effect of every arrival and death: never older than before, and with any turn he made since.)
   */
  /** Counts every body added or taken away: whoever keeps hold of bodies can tell nothing went without searching for it. */
  dynamicsVersion = 0

  addDynamic(body: DynamicBody): void {
    this.dynamicsVersion++
    this.dynamics.push(body)
    if (this.filed && !body.still) this.unfiled.push(body)
    else this.filed = false
  }

  removeDynamic(body: DynamicBody): void {
    const i = this.dynamics.indexOf(body)
    // (Not there — a dead man's wreck taken away: he went when he died.)
    if (i < 0) return
    this.dynamicsVersion++
    this.dynamics.splice(i, 1)
    const j = this.filed && !body.still ? this.unfiled.indexOf(body) : -1
    if (j >= 0) this.unfiled.splice(j, 1)
    else this.filed = false
  }

  /** A still body (DynamicBody.still) was put somewhere else: it is filed again where it is now. */
  moved(_body: DynamicBody): void {
    this.filed = false
  }

  /** The still bodies, filed by the STILL_CELL square their box's middle is in; the rest, unfiled (bodiesIn). */
  private readonly stillCells = new Map<number, DynamicBody[]>()
  private readonly unfiled: DynamicBody[] = []
  /** raycastAny's bodies, and resolve's, reused. */
  private readonly rayBodies: DynamicBody[] = []
  private readonly capBodies: DynamicBody[] = []
  /** The most any still body's box reaches from its middle, across (metres): how far round a query squares are looked in. */
  private stillReach = 0
  private filed = false

  private file(): void {
    this.stillCells.clear()
    this.unfiled.length = 0
    this.stillReach = 0
    for (const body of this.dynamics) {
      // A moving one is looked at by every query whatever its box: its box is not asked for (a man's is dear).
      if (!body.still) {
        this.unfiled.push(body)
        continue
      }
      const b = body.aabb
      const reach = Math.max(b.max.x - b.min.x, b.max.z - b.min.z) / 2
      // (One bigger than a square — a long wall — is looked at by every query, as the moving ones are: filed, its reach
      // would have every query look through squares for twenty metres round.)
      if (b.isEmpty() || !(reach <= STILL_CELL)) {
        this.unfiled.push(body)
        continue
      }
      this.stillReach = Math.max(this.stillReach, reach)
      const key = stillKey(Math.floor((b.min.x + b.max.x) / 2 / STILL_CELL), Math.floor((b.min.z + b.max.z) / 2 / STILL_CELL))
      let list = this.stillCells.get(key)
      if (!list) this.stillCells.set(key, (list = []))
      list.push(body)
    }
    this.filed = true
  }

  /**
   * Into `out`: the bodies whose boxes could reach into the stretch of ground [minX, maxX] × [minZ, maxZ] — every one
   * that moves, and the still ones filed round it — not the level's every body (a hundred and more in the facility, each
   * a few microseconds to look at without the browser's optimising compiler, for every ray). A stretch too long to be
   * worth it (a look across the level) gets them all.
   */
  bodiesIn(minX: number, maxX: number, minZ: number, maxZ: number, out: DynamicBody[]): DynamicBody[] {
    if (!this.filed) this.file()
    out.length = 0
    const r = this.stillReach
    const x0 = Math.floor((minX - r) / STILL_CELL), x1 = Math.floor((maxX + r) / STILL_CELL)
    const z0 = Math.floor((minZ - r) / STILL_CELL), z1 = Math.floor((maxZ + r) / STILL_CELL)
    if (!((x1 - x0 + 1) * (z1 - z0 + 1) <= STILL_MAX_CELLS)) {
      for (let i = 0; i < this.dynamics.length; i++) out.push(this.dynamics[i]!)
      return out
    }
    const moving = this.unfiled
    for (let i = 0; i < moving.length; i++) out.push(moving[i]!)
    for (let x = x0; x <= x1; x++) {
      for (let z = z0; z <= z1; z++) {
        const list = this.stillCells.get(stillKey(x, z))
        if (list) for (let i = 0; i < list.length; i++) out.push(list[i]!)
      }
    }
    return out
  }

  clear(): void {
    this.chunkMap.clear()
    this.chunkById.clear()
    this.chunkList = []
    this.dynamics.length = 0
    this.unfiled.length = 0
    this.filed = false
    this.sig = null
    this.staticVersion++
  }

  // --- per-resolve state ---------------------------------------------------
  // Held on the instance rather than captured by closures, so the shapecast
  // callbacks below are built ONCE. Built per call — as they were — every resolve
  // allocated three closures and an object, several times a step.
  private curOut: Contacts = createContacts()
  private curSegment = new THREE.Line3()
  private curRadius = 0
  /**
   * The most floor-like normal seen so far this resolve. Tracked rather than taking
   * the first contact, so standing on the seam between two brushes doesn't pick an
   * arbitrary one.
   */
  private bestGroundY = GROUND_NORMAL_Y

  /** One of the level's triangles against the capsule being resolved: pushed out of it, and what it is noted. */
  private touch(tri: ExtendedTriangle, brush: number): void {
    {
      const segment = this.curSegment
      const radius = this.curRadius
      // Two exact rejections before the costly closest-point test (the bulk of a resolve on a slow machine): most
      // triangles of a leaf the capsule's bounds touch are nowhere near the capsule itself. Neither changes a result —
      // a triangle outside the capsule's bounds, or with both ends of its axis further than the radius on one side of
      // its plane, is further than the radius from every point of it.
      const a = tri.a
      const b = tri.b
      const c = tri.c
      const s = segment.start
      const e = segment.end
      if (
        Math.max(a.x, b.x, c.x) < Math.min(s.x, e.x) - radius ||
        Math.min(a.x, b.x, c.x) > Math.max(s.x, e.x) + radius ||
        Math.max(a.y, b.y, c.y) < Math.min(s.y, e.y) - radius ||
        Math.min(a.y, b.y, c.y) > Math.max(s.y, e.y) + radius ||
        Math.max(a.z, b.z, c.z) < Math.min(s.z, e.z) - radius ||
        Math.min(a.z, b.z, c.z) > Math.max(s.z, e.z) + radius
      )
        return
      _triN.crossVectors(_e1.subVectors(b, a), _e2.subVectors(c, a))
      const nLen = _triN.length()
      if (nLen > 1e-12) {
        const off = _triN.dot(a)
        const ds = (_triN.dot(s) - off) / nLen
        const de = (_triN.dot(e) - off) / nLen
        if ((ds >= radius && de >= radius) || (ds <= -radius && de <= -radius)) return
      }
      const dist = tri.closestPointToSegment(segment, _triPoint, _capPoint)
      if (dist >= radius) return

      const depth = radius - dist
      _dir.subVectors(_capPoint, _triPoint)
      const len = _dir.length()
      if (len < 1e-6) {
        // The capsule axis passes exactly through the triangle. normalize() would
        // produce NaN here and teleport the player out of the world.
        tri.getNormal(_dir)
      } else {
        _dir.divideScalar(len)
      }

      segment.start.addScaledVector(_dir, depth)
      segment.end.addScaledVector(_dir, depth)
      this.classify(_dir, null, brush)
    }
  }

  /** The chunk being gathered from (gatherNear): its callbacks are made once, not per gather. */
  private gatherChunk: CollisionChunk | null = null
  private readonly gatherCast = {
    intersectsBounds: (b: THREE.Box3): boolean => b.intersectsBox(this.near.box),
    intersectsTriangle: (tri: ExtendedTriangle, triIndex: number): boolean => {
      this.keepNear(tri, triIndex)
      return false
    },
  }

  /** Gather the level's triangles in `box` (in the BVH's own order, which resolving keeps), with their brushes. */
  private gatherNear(box: THREE.Box3): void {
    const near = this.near
    near.box.copy(box)
    near.version = this.staticVersion
    near.n = 0
    for (let c = 0; c < this.chunkList.length; c++) {
      const chunk = this.chunkList[c]!
      if (!chunk.bounds.intersectsBox(box)) continue
      this.gatherChunk = chunk
      chunk.bvh.shapecast(this.gatherCast)
    }
  }

  /** One triangle gathered: its corners and its brush, kept for the resolves to come. */
  private keepNear(tri: ExtendedTriangle, triIndex: number): void {
    const near = this.near
    if (near.n === near.brush.length) {
      const tris = new Float32Array(near.tris.length * 2)
      tris.set(near.tris)
      near.tris = tris
      const brush = new Int32Array(near.brush.length * 2)
      brush.set(near.brush)
      near.brush = brush
    }
    const o = near.n * 9
    const t = near.tris
    t[o] = tri.a.x
    t[o + 1] = tri.a.y
    t[o + 2] = tri.a.z
    t[o + 3] = tri.b.x
    t[o + 4] = tri.b.y
    t[o + 5] = tri.b.z
    t[o + 6] = tri.c.x
    t[o + 7] = tri.c.y
    t[o + 8] = tri.c.z
    near.brush[near.n] = this.chunkBrush(this.gatherChunk!, triIndex)
    near.n++
  }

  private classify(n: THREE.Vector3, body: DynamicBody | null, brush: number): void {
    const out = this.curOut
    out.hit = true
    if (n.y > this.bestGroundY) {
      this.bestGroundY = n.y
      out.grounded = true
      out.groundNormal.copy(n)
      out.groundBody = body
      out.brushIndex = brush
    } else if (Math.abs(n.y) < WALL_NORMAL_Y) {
      // Summed, not replaced: in an inside corner both walls should contribute so
      // the wall jump kicks out along the bisector instead of picking one face.
      out.onWall = true
      out.wallNormal.add(n)
    } else if (n.y < -GROUND_NORMAL_Y) {
      // Pushing us DOWN, so we are under it. Paired with `grounded` this is the
      // only reliable signal that a platform is closing on you: measuring how hard
      // the depenetration shoves per tick cannot tell a slow press from a gentle
      // ride, since a platform moving at any survivable speed shoves only
      // millimetres per tick.
      out.ceiling = true
    }
  }

  /**
   * Push `segment` out of the world until it no longer overlaps anything. Mutates
   * `segment` and reports what it touched.
   */
  resolve(segment: THREE.Line3, radius: number, out: Contacts): void {
    out.hit = false
    out.grounded = false
    out.onWall = false
    out.groundNormal.set(0, 0, 0)
    out.wallNormal.set(0, 0, 0)
    out.groundBody = null
    out.brushIndex = -1
    out.ceiling = false

    this.curOut = out
    this.curSegment = segment
    this.curRadius = radius
    this.bestGroundY = GROUND_NORMAL_Y
    // The capsule's bounds, once: the movers and every cell are tested against it.
    _capBounds.makeEmpty()
    _capBounds.expandByPoint(segment.start)
    _capBounds.expandByPoint(segment.end)
    _capBounds.min.addScalar(-radius)
    _capBounds.max.addScalar(radius)

    // --- movers -----------------------------------------------------------
    // Resolved FIRST so static geometry gets the last word. The other way round, a
    // platform rising into you could push you down through the floor: the world is
    // immovable and must always win the argument.
    // (Those that move, and the still ones round the capsule: a still body's reach below is its margin alone, so none
    // farther away can touch it — and a dash, eight of these a step, looked through every body in the level each time.)
    const m = STILL_MARGIN
    const dyn = this.bodiesIn(_capBounds.min.x - m, _capBounds.max.x + m, _capBounds.min.z - m, _capBounds.max.z + m, this.capBodies)
    for (let i = 0; i < dyn.length; i++) {
      const body = dyn[i]!
      if (!body.solid) continue
      // A mover may only displace you as far as it actually travelled this tick.
      //
      // Depenetration reports however deep the overlap is, and once the capsule's
      // axis is inside the box it pushes out of the nearest face — for a platform
      // coming down on your head that is over a metre, downward, in one tick. That is
      // deep enough to bury you in the floor, and once you are far enough into a floor
      // slab the nearest way out of THAT is downward too, so it hands you to the void
      // instead of killing you. Being crushed is something this system should report,
      // not something it should solve by moving you.
      //
      // The margin covers a player closing on a stationary body under their own steam
      // — a dash is 0.28 m per tick — so ordinary collisions still resolve in one go.
      const reach = body.delta.length() + STILL_MARGIN
      // Far from the capsule, cheaply: most bodies in a big level are nowhere near.
      if (!body.aabb.intersectsBox(_near.copy(_capBounds).expandByScalar(reach))) continue
      const hit = resolveCapsuleBox(segment, radius, body.aabb, reach)
      if (hit) this.classify(hit.normal, body, -1)
    }

    // --- static geometry --------------------------------------------------
    // From the triangles gathered round the last resolves, while this one is inside them and the level is as it was.
    const near = this.near
    if (near.version !== this.staticVersion || !near.box.containsBox(_capBounds)) {
      _box.copy(_capBounds).expandByScalar(NEAR_MARGIN)
      this.gatherNear(_box)
    }
    const t = near.tris
    for (let i = 0; i < near.n; i++) {
      const o = i * 9
      _nearTri.a.set(t[o]!, t[o + 1]!, t[o + 2]!)
      _nearTri.b.set(t[o + 3]!, t[o + 4]!, t[o + 5]!)
      _nearTri.c.set(t[o + 6]!, t[o + 7]!, t[o + 8]!)
      _nearTri.needsUpdate = true
      this.touch(_nearTri, near.brush[i]!)
    }

    if (out.onWall) {
      if (out.wallNormal.lengthSq() > 1e-8) out.wallNormal.normalize()
      else out.onWall = false
    }
  }

  /** Nearest static hit along a ray. Used for line of sight, decals and hitscan. */
  raycast(origin: THREE.Vector3, direction: THREE.Vector3, far: number): THREE.Intersection | null {
    if (this.chunkList.length === 0) return null
    _castRay.set(origin, direction)
    let best: THREE.Intersection | null = null
    let reach = far
    // The box the ray sweeps: a cell outside it is passed over on six comparisons, before the slab test's divisions — a
    // short ray (a falling body's joint, a floor under a foot) was tested against every cell of the level.
    const x0 = origin.x, y0 = origin.y, z0 = origin.z
    const swept = Number.isFinite(far)
    const x1 = x0 + direction.x * far, y1 = y0 + direction.y * far, z1 = z0 + direction.z * far
    const minX = Math.min(x0, x1), maxX = Math.max(x0, x1)
    const minY = Math.min(y0, y1), maxY = Math.max(y0, y1)
    const minZ = Math.min(z0, z1), maxZ = Math.max(z0, z1)
    const chunks = this.chunkList
    for (let ci = 0; ci < chunks.length; ci++) {
      const chunk = chunks[ci]!
      const b = chunk.bounds
      if (swept && (b.min.x > maxX || b.max.x < minX || b.min.y > maxY || b.max.y < minY || b.min.z > maxZ || b.max.z < minZ)) continue
      // Only cells the ray enters within what it has left to travel.
      if (!chunk.bounds.containsPoint(origin)) {
        if (!_castRay.intersectBox(chunk.bounds, _hitPoint)) continue
        if (_hitPoint.distanceTo(origin) > reach) continue
      }
      const hit = chunk.bvh.raycastFirst(_castRay, THREE.FrontSide, 0, reach)
      if (hit && hit.faceIndex !== undefined && hit.faceIndex !== null) {
        reach = hit.distance
        hit.faceIndex = chunk.id * FACE_STRIDE + hit.faceIndex
        best = hit
      }
    }
    return best
  }

  /**
   * How many walls of the level lie on the straight line from `from` to (x, y, z), up to `max`, leaving out the last
   * `skip` metres. One entry into solid geometry per wall: a cast stops at the first surface it meets, so each hit is
   * followed up from just past it, and casts only see faces turned toward them, so the far face of the same wall is
   * passed over and the next hit is the next wall. What sound uses to be blocked and muffled.
   */
  wallsBetween(from: THREE.Vector3, x: number, y: number, z: number, skip: number, max: number): number {
    _wallFrom.copy(from)
    _wallDir.set(x, y, z).sub(from)
    let left = _wallDir.length() - skip
    if (left <= 0) return 0
    _wallDir.normalize()
    let walls = 0
    while (walls < max && left > 0) {
      const hit = this.raycast(_wallFrom, _wallDir, left)
      if (!hit) break
      walls++
      const on = hit.distance + 0.05
      _wallFrom.addScaledVector(_wallDir, on)
      left -= on
    }
    return walls
  }

  /**
   * Nearest hit against static geometry OR a dynamic body.
   *
   * Dynamic bodies are not in the BVH, so anything that needs to interact with them
   * — punches, hitscan — has to test both and take whichever is closer.
   *
   * The returned object is SHARED and overwritten by the next call: read what you
   * need from it before probing again.
   */
  /**
   * The nearest thing along a ray, level or body. `hits` also finds bodies that are hittable but not solid (decorations).
   * `skip` is passed over: the body a round came out of, whose own shape its first metre starts inside. `among`: those
   * bodies only, for many rays in one place (bodiesIn); without it, those the ray's own stretch of ground could reach.
   * `level` false: the bodies alone, not the level's own surfaces. `passes`: bodies it goes straight through (a hostile
   * round through the enemies).
   */
  raycastAny(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    far: number,
    hits = false,
    skip: DynamicBody | null = null,
    among: readonly DynamicBody[] | null = null,
    level = true,
    passes: ((body: DynamicBody) => boolean) | null = null,
  ): RayHit | null {
    let found = false

    const staticHit = level ? this.raycast(origin, direction, far) : null
    if (staticHit) {
      _anyHit.distance = staticHit.distance
      _anyHit.point.copy(staticHit.point)
      _anyHit.normal.copy(staticHit.face?.normal ?? direction)
      _anyHit.body = null
      _anyHit.faceIndex = staticHit.faceIndex ?? -1
      found = true
    }

    _ray.set(origin, direction)
    // The box the ray sweeps (as far as it can still matter): a body outside it cannot be hit, and saying so takes six
    // comparisons where the slab test takes a division per axis. Most of a level's bodies are nowhere near any ray.
    const reach = found ? Math.min(far, _anyHit.distance) : far
    const x0 = origin.x, y0 = origin.y, z0 = origin.z
    const x1 = x0 + direction.x * reach, y1 = y0 + direction.y * reach, z1 = z0 + direction.z * reach
    const minX = Math.min(x0, x1), maxX = Math.max(x0, x1)
    const minY = Math.min(y0, y1), maxY = Math.max(y0, y1)
    const minZ = Math.min(z0, z1), maxZ = Math.max(z0, z1)
    const dyn = among ?? this.bodiesIn(minX, maxX, minZ, maxZ, this.rayBodies)
    for (let i = 0; i < dyn.length; i++) {
      const body = dyn[i]!
      if (body === skip || (!body.solid && !(hits && body.hittable)) || (passes !== null && passes(body))) continue
      if (body.nearRay && !body.nearRay(origin, direction, reach)) continue
      const b = body.aabb
      if (b.min.x > maxX || b.max.x < minX || b.min.y > maxY || b.max.y < minY || b.min.z > maxZ || b.max.z < minZ) continue
      const near = found ? Math.min(far, _anyHit.distance) : far
      let hit: { distance: number; point: THREE.Vector3; normal: THREE.Vector3 } | null = rayBox(_ray, body.aabb, near)
      if (hit && body.rayHit) hit = body.rayHit(_ray, near)
      if (!hit) continue
      if (found && hit.distance >= _anyHit.distance) continue
      _anyHit.distance = hit.distance
      _anyHit.point.copy(hit.point)
      _anyHit.normal.copy(hit.normal)
      _anyHit.body = body
      _anyHit.faceIndex = -1
      found = true
    }

    return found ? _anyHit : null
  }
}
