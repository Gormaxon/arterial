/**
 * Hidden-face culling for baked geometry.
 *
 * A prefab is a stack of boxes: tiers on tiers, bolts on plates, panels in frames. Wherever two of them touch,
 * the faces that press together can never be seen, but each still costs two triangles every frame. For every
 * axis-aligned box this finds the faces that are completely covered by the opposite faces of the boxes touching
 * it and drops them from the box's index. The picture is unchanged, since only unseen triangles go.
 *
 * Only plain axis-aligned `BoxGeometry` is touched. Rotated slabs, cylinders and anything else are left whole
 * (and never count as covering anything).
 */

import * as THREE from 'three'
import type { Part } from '../prefabs/geometry'

const EPS = 1e-4

interface Box {
  geometry: THREE.BoxGeometry
  min: [number, number, number]
  max: [number, number, number]
}

/** Face order of a one-segment BoxGeometry: +x, -x, +y, -y, +z, -z; six indices each. */
const FACE_INDICES = 6

/** Drop every fully covered face from the boxes among `parts`. Returns how many triangles were removed. */
export function cullHiddenFaces(parts: Part[]): number {
  const boxes: Box[] = []
  for (const p of parts) {
    // A moving leaf can uncover what it covered, so doors keep every face.
    if (p.leaf !== undefined) continue
    const g = p.geometry
    if (!(g instanceof THREE.BoxGeometry)) continue
    g.computeBoundingBox()
    const b = g.boundingBox!
    const pr = g.parameters
    if (pr.widthSegments !== 1 || pr.heightSegments !== 1 || pr.depthSegments !== 1) continue
    // Rotated boxes have a larger bounding box than their own size.
    if (Math.abs(b.max.x - b.min.x - pr.width) > EPS || Math.abs(b.max.y - b.min.y - pr.height) > EPS || Math.abs(b.max.z - b.min.z - pr.depth) > EPS) continue
    boxes.push({ geometry: g, min: [b.min.x, b.min.y, b.min.z], max: [b.max.x, b.max.y, b.max.z] })
  }
  if (boxes.length < 2) return 0

  // Boxes bucketed by where their faces lie, so a face only looks at boxes that actually touch its plane.
  const key = (v: number): number => Math.round(v * 1000)
  const lows: Map<number, Box[]>[] = [new Map(), new Map(), new Map()]
  const highs: Map<number, Box[]>[] = [new Map(), new Map(), new Map()]
  for (const b of boxes) {
    for (let axis = 0; axis < 3; axis++) {
      for (const [map, v] of [[lows[axis]!, b.min[axis]!], [highs[axis]!, b.max[axis]!]] as const) {
        const k = key(v)
        const list = map.get(k)
        if (list) list.push(b)
        else map.set(k, [b])
      }
    }
  }

  let removed = 0
  for (const a of boxes) {
    const hidden: boolean[] = [false, false, false, false, false, false]
    let any = false
    for (let face = 0; face < 6; face++) {
      const axis = face >> 1
      const positive = (face & 1) === 0
      const plane = positive ? a.max[axis]! : a.min[axis]!
      const u = (axis + 1) % 3
      const v = (axis + 2) % 3
      const u0 = a.min[u]!
      const u1 = a.max[u]!
      const v0 = a.min[v]!
      const v1 = a.max[v]!
      // The rectangles of the touching boxes' opposite faces, clipped to this face.
      const rects: [number, number, number, number][] = []
      const buckets = positive ? lows[axis]! : highs[axis]!
      const k0 = key(plane)
      for (let dk = -1; dk <= 1; dk++) {
        const list = buckets.get(k0 + dk)
        if (!list) continue
        for (const b of list) {
          if (b === a) continue
          const touching = positive ? Math.abs(b.min[axis]! - plane) < EPS : Math.abs(b.max[axis]! - plane) < EPS
          if (!touching) continue
          const r0 = Math.max(u0, b.min[u]!)
          const r1 = Math.min(u1, b.max[u]!)
          const s0 = Math.max(v0, b.min[v]!)
          const s1 = Math.min(v1, b.max[v]!)
          if (r1 - r0 > EPS && s1 - s0 > EPS) rects.push([r0, r1, s0, s1])
        }
      }
      if (rects.length > 0 && covered(u0, u1, v0, v1, rects)) {
        hidden[face] = true
        any = true
      }
    }
    if (!any) continue
    const index = a.geometry.index!.array
    const kept: number[] = []
    for (let face = 0; face < 6; face++) {
      if (hidden[face]) {
        removed += 2
        continue
      }
      for (let i = 0; i < FACE_INDICES; i++) kept.push(index[face * FACE_INDICES + i]!)
    }
    a.geometry.setIndex(kept)
  }
  return removed
}

/** Is the rectangle entirely inside the union of `rects`? Checked cell by cell on the rectangles' own edges. */
function covered(u0: number, u1: number, v0: number, v1: number, rects: [number, number, number, number][]): boolean {
  // One rectangle that covers it outright is the common case.
  for (const r of rects) if (r[0] <= u0 + EPS && r[1] >= u1 - EPS && r[2] <= v0 + EPS && r[3] >= v1 - EPS) return true
  const us = [u0, u1]
  const vs = [v0, v1]
  for (const r of rects) {
    us.push(r[0], r[1])
    vs.push(r[2], r[3])
  }
  us.sort((p, q) => p - q)
  vs.sort((p, q) => p - q)
  for (let i = 0; i + 1 < us.length; i++) {
    if (us[i + 1]! - us[i]! < EPS) continue
    const cu = (us[i]! + us[i + 1]!) / 2
    for (let j = 0; j + 1 < vs.length; j++) {
      if (vs[j + 1]! - vs[j]! < EPS) continue
      const cv = (vs[j]! + vs[j + 1]!) / 2
      let inside = false
      for (const r of rects) {
        if (cu >= r[0] && cu <= r[1] && cv >= r[2] && cv <= r[3]) {
          inside = true
          break
        }
      }
      if (!inside) return false
    }
  }
  return true
}
