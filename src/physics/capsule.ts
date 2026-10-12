/**
 * Vertical-capsule vs axis-aligned box depenetration.
 *
 * Used for moving platforms. They deliberately do NOT go through the BVH: rebuilding
 * a BVH every time a platform moves is the classic way to lose this fight, and a
 * mover is a box, so a closed-form solve is both exact and far cheaper.
 *
 * The player capsule is always vertical, which makes the closest-point solve
 * separable per axis.
 */

import * as THREE from 'three'

const _n = new THREE.Vector3()

export interface BoxHit {
  /** Push direction, pointing out of the box toward the capsule. */
  normal: THREE.Vector3
  depth: number
}

const _hit: BoxHit = { normal: _n, depth: 0 }

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}

/**
 * If `segment` (a vertical capsule core) overlaps `box`, push it out and return the
 * contact. Mutates `segment`. Returns null when there is no overlap.
 *
 * `maxDepth` limits how far one call may move the capsule. The contact is still
 * reported at full depth — callers need the true normal to classify it — but the
 * displacement is clamped. That matters for the deep-overlap branch below: when the
 * capsule's axis ends up inside the box there is no surface direction to use, so it
 * falls back to the nearest face, and "nearest" can be most of the box away. A
 * platform descending onto a standing player resolves as a metre of downward shove in
 * a single tick, which is enough to drive them clean through the floor.
 */
export function resolveCapsuleBox(
  segment: THREE.Line3,
  radius: number,
  box: THREE.Box3,
  maxDepth = Number.POSITIVE_INFINITY,
): BoxHit | null {
  const px = segment.start.x
  const pz = segment.start.z
  const y0 = Math.min(segment.start.y, segment.end.y)
  const y1 = Math.max(segment.start.y, segment.end.y)

  // Closest point on the box to the capsule's axis, solved per axis.
  const cx = clamp(px, box.min.x, box.max.x)
  const cz = clamp(pz, box.min.z, box.max.z)

  // Y is the only axis where the capsule has extent, so the closest pair depends on
  // whether the segment's span overlaps the box's span.
  let py: number
  let cy: number
  if (y1 < box.min.y) {
    py = y1
    cy = box.min.y
  } else if (y0 > box.max.y) {
    py = y0
    cy = box.max.y
  } else {
    // Overlapping in Y — any shared height is equidistant, so distance in Y is zero.
    py = clamp((y0 + y1) * 0.5, box.min.y, box.max.y)
    cy = py
  }

  const dx = px - cx
  const dy = py - cy
  const dz = pz - cz
  const d2 = dx * dx + dy * dy + dz * dz

  if (d2 >= radius * radius) return null

  if (d2 > 1e-10) {
    const dist = Math.sqrt(d2)
    _n.set(dx / dist, dy / dist, dz / dist)
    _hit.depth = radius - dist
  } else {
    // The axis is inside the box. There is no closest-surface direction to use, so
    // fall back to the minimum translation: push out along whichever face is nearest.
    const midY = clamp((y0 + y1) * 0.5, box.min.y, box.max.y)
    const penXMin = px - box.min.x + radius
    const penXMax = box.max.x - px + radius
    const penYMin = midY - box.min.y + radius
    const penYMax = box.max.y - midY + radius
    const penZMin = pz - box.min.z + radius
    const penZMax = box.max.z - pz + radius

    let best = penXMin
    _n.set(-1, 0, 0)
    if (penXMax < best) {
      best = penXMax
      _n.set(1, 0, 0)
    }
    if (penYMin < best) {
      best = penYMin
      _n.set(0, -1, 0)
    }
    if (penYMax < best) {
      best = penYMax
      _n.set(0, 1, 0)
    }
    if (penZMin < best) {
      best = penZMin
      _n.set(0, 0, -1)
    }
    if (penZMax < best) {
      best = penZMax
      _n.set(0, 0, 1)
    }
    _hit.depth = best
  }

  const applied = Math.min(_hit.depth, maxDepth)
  segment.start.addScaledVector(_n, applied)
  segment.end.addScaledVector(_n, applied)
  _hit.normal = _n
  return _hit
}
