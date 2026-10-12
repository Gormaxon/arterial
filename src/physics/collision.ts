/**
 * The collision system: one BVH over all baked static geometry, plus a list of
 * dynamic box bodies (movers) solved analytically.
 *
 * No rigid-body solver — every good one ships WebAssembly. The player is a kinematic
 * capsule that integrates its own velocity, gets pushed out of whatever it ended up
 * inside, and reads the push directions back as contact normals.
 */

import * as THREE from 'three'
import { MeshBVH, type ExtendedTriangle } from 'three-mesh-bvh'
import { resolveCapsuleBox } from './capsule'

/** A push direction steeper than this counts as floor. ~53° — steep enough to stand on. */
const GROUND_NORMAL_Y = 0.6
/** A push direction flatter than this counts as wall, and is therefore clingable. */
const WALL_NORMAL_Y = 0.45

/** Anything the player can stand on and be carried by. */
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
const _ray = new THREE.Ray()
const _hitPoint = new THREE.Vector3()
const _hitNormal = new THREE.Vector3()
const _rayHit = { distance: 0, point: _hitPoint, normal: _hitNormal }
const _castRay = new THREE.Ray()

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
  private curChunk: CollisionChunk | null = null

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
  }

  removeChunk(key: string): void {
    const old = this.chunkMap.get(key)
    if (!old) return
    this.chunkMap.delete(key)
    this.chunkById.delete(old.id)
    this.chunkList = [...this.chunkMap.values()]
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

  addDynamic(body: DynamicBody): void {
    this.dynamics.push(body)
  }

  removeDynamic(body: DynamicBody): void {
    const i = this.dynamics.indexOf(body)
    if (i >= 0) this.dynamics.splice(i, 1)
  }

  clear(): void {
    this.chunkMap.clear()
    this.chunkById.clear()
    this.chunkList = []
    this.dynamics.length = 0
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

  private readonly staticCast = {
    intersectsBounds: (box: THREE.Box3): boolean => box.intersectsBox(_box),
    intersectsTriangle: (tri: ExtendedTriangle, triIndex: number): boolean => {
      const segment = this.curSegment
      const radius = this.curRadius
      const dist = tri.closestPointToSegment(segment, _triPoint, _capPoint)
      if (dist >= radius) return false

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
      this.classify(_dir, null, this.chunkBrush(this.curChunk!, triIndex))
      return false
    },
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
    for (const body of this.dynamics) {
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
      const reach = body.delta.length() + 0.35
      // Far from the capsule, cheaply: most bodies in a big level are nowhere near.
      if (!body.aabb.intersectsBox(_near.copy(_capBounds).expandByScalar(reach))) continue
      const hit = resolveCapsuleBox(segment, radius, body.aabb, reach)
      if (hit) this.classify(hit.normal, body, -1)
    }

    // --- static geometry --------------------------------------------------
    _box.copy(_capBounds)
    for (const chunk of this.chunkList) {
      if (!chunk.bounds.intersectsBox(_box)) continue
      this.curChunk = chunk
      chunk.bvh.shapecast(this.staticCast)
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
    for (const chunk of this.chunkList) {
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
   * Nearest hit against static geometry OR a dynamic body.
   *
   * Dynamic bodies are not in the BVH, so anything that needs to interact with them
   * — punches, hitscan — has to test both and take whichever is closer.
   *
   * The returned object is SHARED and overwritten by the next call: read what you
   * need from it before probing again.
   */
  /** The nearest thing along a ray, level or body. `hits` also finds bodies that are hittable but not solid (decorations). */
  raycastAny(origin: THREE.Vector3, direction: THREE.Vector3, far: number, hits = false): RayHit | null {
    let found = false

    const staticHit = this.raycast(origin, direction, far)
    if (staticHit) {
      _anyHit.distance = staticHit.distance
      _anyHit.point.copy(staticHit.point)
      _anyHit.normal.copy(staticHit.face?.normal ?? direction)
      _anyHit.body = null
      _anyHit.faceIndex = staticHit.faceIndex ?? -1
      found = true
    }

    _ray.set(origin, direction)
    for (const body of this.dynamics) {
      if (!body.solid && !(hits && body.hittable)) continue
      const hit = rayBox(_ray, body.aabb, far)
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
