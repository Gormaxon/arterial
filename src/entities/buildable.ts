/**
 * Buildable — the base for anything that contributes level geometry.
 *
 * Splits visual geometry from collision on purpose. Prefabs carry a lot of decorative
 * detail (rails, flutes, rivets) that would be both slower and worse to play against
 * if the player capsule collided with it, so each type declares a much simpler set of
 * collision boxes separately.
 */

import * as THREE from 'three'
import { Entity, type EntityDef } from '../engine/entity'
import type { Part, BoxSpec } from '../prefabs/geometry'
import type { SurfaceKey } from '../render/textures'

/** A part's box and surface: enough to say which surface a point on the buildable is. */
interface SurfaceBox {
  box: THREE.Box3
  surface: SurfaceKey
  volume: number
}

/** Surface boxes by bake key: every buildable that bakes the same geometry shares one list. */
const SURFACE_BOXES = new Map<string, SurfaceBox[]>()
const _local = new THREE.Vector3()
const _holeInv = new THREE.Matrix4()
const _holeRay = new THREE.Ray()
const _holeHit = new THREE.Vector3()
/** How far past where a round met its collision a hole is looked for in its drawn pieces (metres, its own space). */
const HOLE_REACH = 3

function boxesOf(parts: Part[]): SurfaceBox[] {
  return parts.map((p) => {
    p.geometry.computeBoundingBox()
    const box = p.geometry.boundingBox!.clone()
    const s = box.getSize(_local)
    return { box, surface: p.surface, volume: s.x * s.y * s.z }
  })
}

/**
 * Note a shape's surface boxes from parts that are being built anyway — by the level bake, a breakable cutting its
 * pieces, a door building its leaves — so the first round or footstep on it does not have to build them again (up to
 * 7 ms for a detailed prefab on a desktop: a hitch on a Chromebook). The parts are only read.
 */
export function seedSurfaceBoxes(key: string | null, parts: Part[]): void {
  // No parts is not an answer: a thing that draws itself bakes none (a breakable, a door, a mine), and its own build
  // brings the real ones.
  if (key !== null && parts.length > 0 && !SURFACE_BOXES.has(key)) SURFACE_BOXES.set(key, boxesOf(parts))
}

export abstract class Buildable extends Entity {
  /** Does the player collide with it? */
  solid = true
  /** Does it render? */
  visible = true
  /** Lava, spikes — the hook for a damage system. */
  hazard = false
  /** Of the hazards, the ones you sink into. Drives which death plays. */
  molten = false
  /** World-space footprint, used by the editor for selection and gizmo placement. */
  readonly size = new THREE.Vector3(1, 1, 1)

  constructor(def: EntityDef) {
    super(def)
  }

  /**
   * What decides this buildable's parts and collision boxes, as a string, or null when that cannot be said.
   * Two buildables with the same key bake to the same local geometry, so the bake builds it once and stamps
   * it for each. Whether it is solid is not part of the key; the bake adds that for collision.
   */
  bakeKey(): string | null {
    return null
  }

  /** Detailed render geometry, in local space. */
  abstract buildParts(): Part[]

  /** Simplified collision volumes, in local space. */
  abstract collisionBoxes(): BoxSpec[]

  /** Surface boxes of a buildable with no bake key, and the size they were made at. */
  private ownBoxes: SurfaceBox[] | null = null
  private ownBoxesAt = new THREE.Vector3()

  /**
   * The surface at a world point on (or right by) it — where a round, a fist or a boot met it. Collision only knows
   * which object a ray hit, not which of its parts; this finds the part: the one whose box the point is on, or nearest.
   * Where parts overlap (a panel set into a wall) the point lies on the face of the one it hit, which wins.
   */
  surfaceAt(point: THREE.Vector3): SurfaceKey | null {
    const boxes = this.surfaceBoxes()
    if (boxes.length === 0) return null
    if (boxes.length === 1) return boxes[0]!.surface
    this.object.updateMatrixWorld()
    this.object.worldToLocal(_local.copy(point))
    let best: SurfaceBox | null = null
    let bestD = Infinity
    for (const b of boxes) {
      const { min, max } = b.box
      // Outside: how far off the box. Inside: how far in from its nearest face (a point on a face is 0 either way).
      const d = b.box.containsPoint(_local)
        ? Math.min(_local.x - min.x, max.x - _local.x, _local.y - min.y, max.y - _local.y, _local.z - min.z, max.z - _local.z)
        : b.box.distanceToPoint(_local)
      if (d < bestD - 1e-4 || (Math.abs(d - bestD) <= 1e-4 && best && b.volume < best.volume)) {
        best = b
        bestD = d
      }
    }
    return best ? best.surface : null
  }

  /**
   * Where a round that met its collision at `point`, going `dir`, holes what is drawn: its collision is a few plain
   * boxes round a shape's detail, so the round went on (in `outPoint`, the face's way out in `outNormal`) to the first
   * of its drawn pieces' boxes on its line. False if it meets none — through a gap in the shape: no hole in the air.
   */
  holeAt(point: THREE.Vector3, dir: THREE.Vector3, outPoint: THREE.Vector3, outNormal: THREE.Vector3): boolean {
    const boxes = this.surfaceBoxes()
    if (boxes.length === 0) return false
    this.object.updateMatrixWorld()
    _holeInv.copy(this.object.matrixWorld).invert()
    // From a hair before the point, so a point on a piece's face is on that piece.
    const d = _holeRay.direction.copy(dir).transformDirection(_holeInv)
    const o = _holeRay.origin.copy(point).applyMatrix4(_holeInv).addScaledVector(d, -0.01)
    let best = HOLE_REACH
    let at: SurfaceBox | null = null
    for (const b of boxes) {
      const t = b.box.containsPoint(o) ? 0 : _holeRay.intersectBox(b.box, _holeHit) ? _holeHit.distanceTo(o) : Infinity
      if (t < best) {
        best = t
        at = b
      }
    }
    if (!at) return false
    outPoint.copy(o).addScaledVector(d, best)
    // The face it is on: the one of the box nearest the point.
    const { min, max } = at.box
    const faces = [outPoint.x - min.x, max.x - outPoint.x, outPoint.y - min.y, max.y - outPoint.y, outPoint.z - min.z, max.z - outPoint.z]
    let f = 0
    for (let i = 1; i < 6; i++) if (Math.abs(faces[i]!) < Math.abs(faces[f]!)) f = i
    outNormal.set(f === 0 ? -1 : f === 1 ? 1 : 0, f === 2 ? -1 : f === 3 ? 1 : 0, f === 4 ? -1 : f === 5 ? 1 : 0)
    outPoint.applyMatrix4(this.object.matrixWorld)
    outNormal.transformDirection(this.object.matrixWorld)
    return true
  }

  /** The parts' boxes, built once per shape (the parts themselves are thrown away). */
  private surfaceBoxes(): SurfaceBox[] {
    const key = this.bakeKey()
    if (key !== null) {
      let list = SURFACE_BOXES.get(key)
      if (!list) SURFACE_BOXES.set(key, (list = this.makeSurfaceBoxes()))
      return list
    }
    if (!this.ownBoxes || !this.ownBoxesAt.equals(this.size)) {
      this.ownBoxes = this.makeSurfaceBoxes()
      this.ownBoxesAt.copy(this.size)
    }
    return this.ownBoxes
  }

  /** The parts its surfaces are read from: what it draws. Things that draw themselves rather than bake say so. */
  protected surfaceParts(): Part[] {
    return this.buildParts()
  }

  private makeSurfaceBoxes(): SurfaceBox[] {
    const parts = this.surfaceParts()
    const out = boxesOf(parts)
    for (const p of parts) p.geometry.dispose()
    return out
  }

  /** Which axes the editor may resize. */
  abstract scalableAxes(): [boolean, boolean, boolean]

  /** Minimum size per axis. */
  abstract minSize(): [number, number, number]

  /**
   * World-space AABB, correct under rotation.
   *
   * Projecting the half-extents through the absolute of the rotation matrix is the
   * standard rotated-box bound, and it is exact for the 90° steps the editor allows.
   * Using the raw size instead — as this did — silently mis-reports the footprint of
   * anything turned, which would break selection, the overlap guard and the arena
   * hygiene check all at once.
   */
  computeAABB(target: THREE.Box3): THREE.Box3 {
    this.object.updateMatrix()
    const m = this.object.matrix.elements
    const hx = this.size.x / 2
    const hy = this.size.y / 2
    const hz = this.size.z / 2

    const ex = Math.abs(m[0]!) * hx + Math.abs(m[4]!) * hy + Math.abs(m[8]!) * hz
    const ey = Math.abs(m[1]!) * hx + Math.abs(m[5]!) * hy + Math.abs(m[9]!) * hz
    const ez = Math.abs(m[2]!) * hx + Math.abs(m[6]!) * hy + Math.abs(m[10]!) * hz

    const p = this.object.position
    target.min.set(p.x - ex, p.y - ey, p.z - ez)
    target.max.set(p.x + ex, p.y + ey, p.z + ez)
    return target
  }

  /** Editor label. */
  get displayName(): string {
    return this.name || this.id
  }
}

export function round4(n: number): number {
  return Math.round(n * 1e4) / 1e4
}
