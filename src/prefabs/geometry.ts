/**
 * Geometry helpers for prefab construction.
 *
 * Everything is built from boxes, but with world-scaled UVs so texel density stays
 * constant across objects of wildly different size — a 16 m floor slab and a 0.2 m
 * trim strip get the same grain. Without this, big surfaces look blurry and small
 * ones look like noise.
 */

import * as THREE from 'three'
import { surfaceScale, type SurfaceKey } from '../render/materials'

/**
 * A slack cable strung between two points, approximated as short segments that dip
 * in the middle. Each segment owns its own slice along the run, so a cable never
 * interpenetrates itself.
 */
export function cableRun(
  x: number,
  bottomY: number,
  zStart: number,
  zEnd: number,
  sag: number,
  thickness: number,
  segments: number,
  surface: SurfaceKey,
): Part[] {
  // A real cable: one round tube along a catenary, the curve a hanging cable actually takes. It used to be a row of
  // unrotated boxes stepped down the curve, which read as a staircase of pixels rather than anything slung.
  const span = zEnd - zStart
  const half = Math.abs(span) / 2
  const r = thickness / 2
  // Catenary y = a·cosh(u/a) through the two anchors with the given dip at the middle: solve a for the dip.
  let a = Math.max(half, 1e-3)
  if (sag > 1e-4) {
    let lo = 1e-3
    let hi = 1e4
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2
      const dip = mid * (Math.cosh(half / mid) - 1)
      if (dip > sag) lo = mid
      else hi = mid
    }
    a = (lo + hi) / 2
  }
  const samples = Math.max(8, segments * 2)
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const u = (t - 0.5) * 2 * half
    const dip = sag > 1e-4 ? a * (Math.cosh(half / a) - Math.cosh(u / a)) : 0
    points.push(new THREE.Vector3(x, bottomY + r - dip, zStart + span * t))
  }
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
  const radial = r < 0.06 ? 6 : 8
  const g = new THREE.TubeGeometry(curve, samples, r, radial, false)
  // The end rings sit square to a cable that leaves its anchor at a slope, so they lean a hair past the anchor's
  // face; flatten them onto it, so the cable meets its clamp rather than poking into it.
  const zLo = Math.min(zStart, zEnd)
  const zHi = Math.max(zStart, zEnd)
  const pos = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.min(zHi, Math.max(zLo, pos.getZ(i))))
  pos.needsUpdate = true
  g.computeVertexNormals()
  // World-scaled UVs, as the boxes have: along the cable and around it.
  const length = curve.getLength()
  const scale = surfaceScale(surface)
  const uv = g.attributes.uv as THREE.BufferAttribute
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * length * scale, uv.getY(i) * 2 * Math.PI * r * scale)
  uv.needsUpdate = true
  return [{ geometry: g, surface }]
}

export interface Part {
  geometry: THREE.BufferGeometry
  surface: SurfaceKey
  /**
   * Structural backing that damage never removes.
   *
   * Only meaningful on breakables. Their collision stays whole until they collapse,
   * so a piece chipped clean through would read as a doorway you inexplicably can't
   * walk through. Marking the back layer core keeps the silhouette solid: the face
   * spalls, the wall still looks like a wall.
   */
  core?: boolean
  /**
   * Which moving leaf of a door this piece belongs to; unset for the fixed frame.
   * Only doors read it (see entities/door.ts) — everything else draws all parts alike.
   */
  leaf?: number
}

/** A slab placed by FRACTIONS of the prefab's width, height and depth, from its back-left-bottom. */
export type Place = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, surface: SurfaceKey) => Part

/**
 * Lay a prefab out as fractions of its size. Two pieces that meet at the same fraction meet
 * exactly at any size, which keeps a prefab a clean partition when it is built small, large
 * or stretched.
 */
export function placer(w: number, h: number, d: number): Place {
  return (x0, x1, y0, y1, z0, z1, surface) =>
    box({ x: ((x0 + x1) / 2 - 0.5) * w, y: ((y0 + y1) / 2) * h, z: ((z0 + z1) / 2 - 0.5) * d, w: (x1 - x0) * w, h: (y1 - y0) * h, d: (z1 - z0) * d }, surface)
}

/**
 * A cylinder inscribed in a box, running along `axis`. Its round section fits the smaller of
 * the box's other two sides, and the box is its bounding box exactly — so for the partition
 * rule (no two pieces overlap) it counts as that box.
 */
export type CylPlace = (
  axis: 'x' | 'y' | 'z',
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z0: number,
  z1: number,
  surface: SurfaceKey,
  segments?: number,
) => Part

/** Cylinders laid out by fractions of the prefab's size, like `placer`. */
export function cylPlacer(w: number, h: number, d: number): CylPlace {
  return (axis, x0, x1, y0, y1, z0, z1, surface, segments = 14) => {
    const sx = (x1 - x0) * w
    const sy = (y1 - y0) * h
    const sz = (z1 - z0) * d
    const radius = (axis === 'y' ? Math.min(sx, sz) : axis === 'x' ? Math.min(sy, sz) : Math.min(sx, sy)) / 2
    const length = axis === 'y' ? sy : axis === 'x' ? sx : sz
    // A slim cylinder needs fewer sides: at fist-sized radii the extra ones cost triangles nobody can resolve.
    const sides = Math.max(6, Math.min(segments, Math.round(5 + radius * 28)))
    const g = new THREE.CylinderGeometry(radius, radius, length, sides, 1)
    if (axis === 'x') g.rotateZ(Math.PI / 2)
    else if (axis === 'z') g.rotateX(Math.PI / 2)
    // World-scaled UVs: around the barrel and along it, the same texel density as the boxes.
    const scale = surfaceScale(surface)
    const uv = g.attributes.uv as THREE.BufferAttribute
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2 * Math.PI * radius * scale, uv.getY(i) * length * scale)
    uv.needsUpdate = true
    g.translate(((x0 + x1) / 2 - 0.5) * w, ((y0 + y1) / 2) * h, ((z0 + z1) / 2 - 0.5) * d)
    return { geometry: g, surface }
  }
}

/**
 * Metre-based layout for a prefab of fixed default size: coordinates are metres from the
 * back-left-bottom corner, as measured at `size`, and scale with the prefab if it is ever built
 * at another size. Far easier to author fine detail in than fractions.
 */
export function metric(size: [number, number, number]): (w: number, h: number, d: number) => { P: Place; C: CylPlace } {
  return (w, h, d) => {
    const [sx, sy, sz] = size
    const P0 = placer(w, h, d)
    const C0 = cylPlacer(w, h, d)
    return {
      P: (x0, x1, y0, y1, z0, z1, surface) => P0(x0 / sx, x1 / sx, y0 / sy, y1 / sy, z0 / sz, z1 / sz, surface),
      C: (axis, x0, x1, y0, y1, z0, z1, surface, segments) => C0(axis, x0 / sx, x1 / sx, y0 / sy, y1 / sy, z0 / sz, z1 / sz, surface, segments),
    }
  }
}

/** The same fractional box as a collision volume: centred on the prefab, as collision boxes are. */
export function boxAt(w: number, h: number, d: number, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): BoxSpec {
  return { x: ((x0 + x1) / 2 - 0.5) * w, y: ((y0 + y1) / 2 - 0.5) * h, z: ((z0 + z1) / 2 - 0.5) * d, w: (x1 - x0) * w, h: (y1 - y0) * h, d: (z1 - z0) * d }
}

/** Mark parts as belonging to a moving leaf. */
export function leaf(index: number, parts: Part[]): Part[] {
  for (const p of parts) p.leaf = index
  return parts
}

/** Tag a part as structural backing. See `Part.core`. */
export function asCore(part: Part): Part {
  part.core = true
  return part
}

/** A local-space box: centre + half-extents are derived from centre/size. */
export interface BoxSpec {
  x: number
  y: number
  z: number
  w: number
  h: number
  d: number
}

/**
 * Box with per-face UVs laid out in world units.
 *
 * BoxGeometry's default UVs are 0..1 per face, which stretches the texture over
 * whatever size the face happens to be. Rewriting them per face against the face's
 * actual dimensions is what keeps the detail consistent.
 */
export function box(spec: BoxSpec, surface: SurfaceKey): Part {
  const { x, y, z, w, h, d } = spec
  const g = new THREE.BoxGeometry(w, h, d)
  const scale = surfaceScale(surface)

  const uv = g.attributes.uv as THREE.BufferAttribute
  // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z — four vertices each.
  const dims: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ]
  for (let face = 0; face < 6; face++) {
    const dim = dims[face]!
    const su = dim[0] * scale
    const sv = dim[1] * scale
    for (let v = 0; v < 4; v++) {
      const i = face * 4 + v
      uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv)
    }
  }
  uv.needsUpdate = true

  g.translate(x, y, z)
  return { geometry: g, surface }
}

/** Convenience: a box positioned by its BOTTOM rather than its centre. */
export function slab(
  x: number,
  bottomY: number,
  z: number,
  w: number,
  h: number,
  d: number,
  surface: SurfaceKey,
): Part {
  return box({ x, y: bottomY + h / 2, z, w, h, d }, surface)
}

/**
 * An inner panel plus the ring that frames it, as an EXACT partition.
 *
 * Sizing the inner piece by eye (say `w - 0.5` against a 0.28 frame) leaves a sliver
 * of overlap whose top face is coplanar with the frame's — which is precisely the
 * condition the depth buffer cannot resolve, and the shimmer you see along tile
 * edges. Derive the inner size from the thickness and the two can never fight.
 */
export function framedPanel(
  bottomY: number,
  h: number,
  w: number,
  d: number,
  thickness: number,
  inner: SurfaceKey,
  frame: SurfaceKey,
  innerHeight = h,
): Part[] {
  const t = Math.min(thickness, Math.min(w, d) / 2 - 0.01)
  return [
    slab(0, bottomY, 0, w - t * 2, innerHeight, d - t * 2, inner),
    ...frameXZ(bottomY, h, w, d, t, frame),
  ]
}

/**
 * A slab rotated about X — a genuinely angled surface rather than a staircase.
 *
 * `y` and `z` are the CENTRE of the rotated slab. Callers are responsible for
 * choosing a length that keeps the rotated footprint inside the prefab's box; see
 * `tiltedFit` for the arithmetic.
 */
export function tiltedSlab(
  x: number,
  y: number,
  z: number,
  w: number,
  thickness: number,
  length: number,
  angle: number,
  surface: SurfaceKey,
): Part {
  const g = new THREE.BoxGeometry(w, thickness, length)
  const scale = surfaceScale(surface)
  // World-scaled UVs, same as `box`, but only the two faces that matter here.
  const uv = g.attributes.uv as THREE.BufferAttribute
  const dims: [number, number][] = [
    [length, thickness],
    [length, thickness],
    [w, length],
    [w, length],
    [w, thickness],
    [w, thickness],
  ]
  for (let face = 0; face < 6; face++) {
    const dim = dims[face]!
    for (let v = 0; v < 4; v++) {
      const i = face * 4 + v
      uv.setXY(i, uv.getX(i) * dim[0] * scale, uv.getY(i) * dim[1] * scale)
    }
  }
  uv.needsUpdate = true

  g.rotateX(angle)
  g.translate(x, y, z)
  return { geometry: g, surface }
}

/**
 * Longest slab of `thickness` that fits a box `d` deep and `h` tall at `angle`.
 *
 * A rotated box grows in both axes: depth becomes L·cos + t·sin, height L·sin + t·cos.
 * Solving for L against whichever axis binds first is what keeps a tilted prefab
 * inside its declared size at every scale.
 */
export function tiltedFit(h: number, d: number, thickness: number, angle: number): number {
  const c = Math.abs(Math.cos(angle))
  const s = Math.abs(Math.sin(angle))
  const byDepth = c > 1e-4 ? (d - thickness * s) / c : Infinity
  const byHeight = s > 1e-4 ? (h - thickness * c) / s : Infinity
  return Math.max(0.1, Math.min(byDepth, byHeight))
}

/** Largest frame thickness that still leaves a non-degenerate interior. */
export function frameThickness(w: number, d: number, wanted: number): number {
  return Math.min(wanted, w / 2, d / 2)
}

/**
 * Four trim strips framing a rectangle in the XZ plane, as a clean ring.
 *
 * The thickness is clamped against both spans: asking for a 0.3 frame on a 0.5-deep
 * object made the front and back strips overlap each other through the middle.
 */
export function frameXZ(
  bottomY: number,
  h: number,
  w: number,
  d: number,
  thickness: number,
  surface: SurfaceKey,
): Part[] {
  const t = frameThickness(w, d, thickness)
  const parts = [
    slab(0, bottomY, -d / 2 + t / 2, w, h, t, surface),
    slab(0, bottomY, d / 2 - t / 2, w, h, t, surface),
  ]
  // When the strips already meet there is no interior left to edge.
  const innerD = d - t * 2
  if (innerD > 1e-4) {
    parts.push(slab(-w / 2 + t / 2, bottomY, 0, t, h, innerD, surface))
    parts.push(slab(w / 2 - t / 2, bottomY, 0, t, h, innerD, surface))
  }
  return parts
}

/**
 * A picture frame in the XY plane, full depth — for thin, wall-mounted panels where
 * an XZ ring would have nothing to enclose.
 */
export function frameXY(
  bottomY: number,
  h: number,
  w: number,
  d: number,
  thickness: number,
  surface: SurfaceKey,
): Part[] {
  const t = Math.min(thickness, w / 2, h / 2)
  const parts = [
    slab(-(w - t) / 2, bottomY, 0, t, h, d, surface),
    slab((w - t) / 2, bottomY, 0, t, h, d, surface),
  ]
  const innerW = w - t * 2
  if (innerW > 1e-4) {
    parts.push(slab(0, bottomY, 0, innerW, t, d, surface))
    parts.push(slab(0, bottomY + h - t, 0, innerW, t, d, surface))
  }
  return parts
}

/** Evenly spaced ribs along an axis, e.g. catwalk slats or wall pilasters. */
export function ribs(
  count: number,
  span: number,
  make: (offset: number, index: number) => Part | Part[],
): Part[] {
  const out: Part[] = []
  if (count < 1) return out
  const step = span / count
  for (let i = 0; i < count; i++) {
    const offset = -span / 2 + step * (i + 0.5)
    const made = make(offset, i)
    if (Array.isArray(made)) out.push(...made)
    else out.push(made)
  }
  return out
}

/** How many whole repeats of `unit` fit in `span`, at least `min`. */
export function repeatsFor(span: number, unit: number, min = 1): number {
  return Math.max(min, Math.round(span / unit))
}
