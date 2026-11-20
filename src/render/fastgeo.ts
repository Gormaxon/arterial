/**
 * Faster stand-ins for three.js geometry steps the boot leans on, with the same results.
 *
 * three's versions work a vertex at a time through Vector3 methods and attribute getters, and `mergeVertices` builds a
 * text key per vertex. On the Chromebook, which runs JavaScript with its optimising compilers switched off, every one
 * of those calls is paid for in full: building the gauntlets and the suit was about a third of the boot. These do the
 * same arithmetic, in the same order, straight on the arrays. Anything they do not cover (interleaved or normalised
 * attributes, morph targets, tangents, stored bounds) goes to three's own version.
 */

import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

type Attr = THREE.BufferAttribute | THREE.InterleavedBufferAttribute

function plain(a: Attr | undefined): a is THREE.BufferAttribute {
  return !!a && !(a as THREE.InterleavedBufferAttribute).isInterleavedBufferAttribute && !a.normalized
}

const _nm = new THREE.Matrix3()

/** `g.applyMatrix4(m)`. */
export function transformGeometry(g: THREE.BufferGeometry, m: THREE.Matrix4): THREE.BufferGeometry {
  const pos = g.attributes.position as Attr | undefined
  const nor = g.attributes.normal as Attr | undefined
  if (g.attributes.tangent || g.boundingBox || g.boundingSphere || (pos && !plain(pos)) || (nor && !plain(nor))) return g.applyMatrix4(m)
  const e = m.elements
  if (pos) {
    const a = pos.array as Float32Array
    const s = pos.itemSize
    for (let i = 0, n = pos.count * s; i < n; i += s) {
      const x = a[i]!, y = a[i + 1]!, z = a[i + 2]!
      const w = 1 / (e[3]! * x + e[7]! * y + e[11]! * z + e[15]!)
      a[i] = (e[0]! * x + e[4]! * y + e[8]! * z + e[12]!) * w
      a[i + 1] = (e[1]! * x + e[5]! * y + e[9]! * z + e[13]!) * w
      a[i + 2] = (e[2]! * x + e[6]! * y + e[10]! * z + e[14]!) * w
    }
    pos.needsUpdate = true
  }
  if (nor) {
    const k = _nm.getNormalMatrix(m).elements
    const a = nor.array as Float32Array
    const s = nor.itemSize
    for (let i = 0, n = nor.count * s; i < n; i += s) {
      const x = a[i]!, y = a[i + 1]!, z = a[i + 2]!
      let nx = k[0]! * x + k[3]! * y + k[6]! * z
      let ny = k[1]! * x + k[4]! * y + k[7]! * z
      let nz = k[2]! * x + k[5]! * y + k[8]! * z
      const inv = 1 / (Math.sqrt(nx * nx + ny * ny + nz * nz) || 1)
      nx *= inv; ny *= inv; nz *= inv
      a[i] = nx; a[i + 1] = ny; a[i + 2] = nz
    }
    nor.needsUpdate = true
  }
  return g
}

/**
 * A copy placed by `m`, for merging (its stored bounds dropped: the merge works out its own): `g.clone().applyMatrix4(m)`
 * through transformGeometry. The props' batches (engine/batches.ts) are rebuilt from these when a level comes in — a
 * few hundred thousand vertices, seconds of a slow processor through three's vertex-at-a-time version.
 */
export function placedCopy(g: THREE.BufferGeometry, m: THREE.Matrix4): THREE.BufferGeometry {
  const c = g.clone()
  c.boundingBox = null
  c.boundingSphere = null
  return transformGeometry(c, m)
}

/** The box round `g`'s vertices into `out` (empty where it has none) — straight on the array, nothing kept on `g`. */
export function boundBox(g: THREE.BufferGeometry, out: THREE.Box3): THREE.Box3 {
  const pos = g.attributes.position as Attr | undefined
  if (!pos || !plain(pos) || pos.itemSize !== 3) return pos ? out.setFromBufferAttribute(pos as THREE.BufferAttribute) : out.makeEmpty()
  const a = pos.array as Float32Array
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  for (let i = 0; i < a.length; i += 3) {
    const x = a[i]!, y = a[i + 1]!, z = a[i + 2]!
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (z < minZ) minZ = z
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
    if (z > maxZ) maxZ = z
  }
  out.min.set(minX, minY, minZ)
  out.max.set(maxX, maxY, maxZ)
  return out
}

/** `g.computeBoundingSphere()`: the box's middle, out to the farthest vertex — straight on the array. */
export function boundSphere(g: THREE.BufferGeometry): void {
  const pos = g.attributes.position as Attr | undefined
  if (!pos || !plain(pos) || pos.itemSize !== 3 || Object.keys(g.morphAttributes).length) {
    g.computeBoundingSphere()
    return
  }
  const a = pos.array as Float32Array
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  for (let i = 0; i < a.length; i += 3) {
    const x = a[i]!, y = a[i + 1]!, z = a[i + 2]!
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (z < minZ) minZ = z
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
    if (z > maxZ) maxZ = z
  }
  const sphere = (g.boundingSphere ??= new THREE.Sphere())
  if (minX > maxX) {
    sphere.center.set(0, 0, 0)
    sphere.radius = -1
    return
  }
  const cx = (minX + maxX) * 0.5, cy = (minY + maxY) * 0.5, cz = (minZ + maxZ) * 0.5
  let r2 = 0
  for (let i = 0; i < a.length; i += 3) {
    const dx = a[i]! - cx, dy = a[i + 1]! - cy, dz = a[i + 2]! - cz
    const d = dx * dx + dy * dy + dz * dz
    if (d > r2) r2 = d
  }
  sphere.center.set(cx, cy, cz)
  sphere.radius = Math.sqrt(r2)
}

const _m4 = new THREE.Matrix4()
export const translateGeometry = (g: THREE.BufferGeometry, x: number, y: number, z: number): THREE.BufferGeometry =>
  transformGeometry(g, _m4.makeTranslation(x, y, z))
export const rotateGeometryX = (g: THREE.BufferGeometry, a: number): THREE.BufferGeometry => transformGeometry(g, _m4.makeRotationX(a))
export const rotateGeometryZ = (g: THREE.BufferGeometry, a: number): THREE.BufferGeometry => transformGeometry(g, _m4.makeRotationZ(a))

/**
 * `mergeVertices(g, tolerance)`: the same vertices kept, in the same order, under the same rounding — keyed by the
 * rounded numbers themselves in a hash table, not by a string built from them.
 */
export function weldVertices(g: THREE.BufferGeometry, tolerance = 1e-4): THREE.BufferGeometry {
  const names = Object.keys(g.attributes)
  const attrs = names.map((n) => g.attributes[n] as Attr)
  if (Object.keys(g.morphAttributes).length > 0 || !attrs.every((a) => plain(a) && a.itemSize <= 4)) return mergeVertices(g, tolerance)
  const list = attrs as THREE.BufferAttribute[]

  tolerance = Math.max(tolerance, Number.EPSILON)
  const halfTolerance = tolerance * 0.5
  const exponent = Math.log10(1 / tolerance)
  const hashMultiplier = Math.pow(10, exponent)
  const hashAdditive = halfTolerance * hashMultiplier

  const index = g.getIndex()
  const count = index ? index.count : g.attributes.position!.count
  let K = 0
  for (const a of list) K += a.itemSize

  // Every source vertex's rounded key, kept for the kept vertices only.
  const keys = new Int32Array(count * K)
  const kept = new Int32Array(count)
  let size = 1
  while (size < count * 2) size <<= 1
  const table = new Int32Array(size).fill(-1)
  const mask = size - 1
  const newIndex = new Uint32Array(count)
  const key = new Int32Array(K)
  let next = 0

  for (let i = 0; i < count; i++) {
    const v = index ? index.getX(i) : i
    let h = 0x811c9dc5 | 0
    let c = 0
    for (let j = 0; j < list.length; j++) {
      const a = list[j]!
      const arr = a.array
      const s = a.itemSize
      const base = v * s
      for (let k = 0; k < s && k < 4; k++) {
        const q = ~~(arr[base + k]! * hashMultiplier + hashAdditive)
        key[c++] = q
        h = Math.imul(h ^ q, 0x01000193)
      }
    }
    let slot = (h ^ (h >>> 15)) & mask
    let found = -1
    for (;;) {
      const t = table[slot]!
      if (t < 0) break
      const o = t * K
      let same = true
      for (let k = 0; k < K; k++) {
        if (keys[o + k] !== key[k]) {
          same = false
          break
        }
      }
      if (same) {
        found = t
        break
      }
      slot = (slot + 1) & mask
    }
    if (found >= 0) {
      newIndex[i] = found
      continue
    }
    table[slot] = next
    keys.set(key, next * K)
    kept[next] = v
    newIndex[i] = next
    next++
  }

  const out = new THREE.BufferGeometry()
  out.name = g.name
  out.userData = JSON.parse(JSON.stringify(g.userData))
  for (const gr of g.groups) out.addGroup(gr.start, gr.count, gr.materialIndex)
  out.drawRange.start = g.drawRange.start
  out.drawRange.count = g.drawRange.count
  if (g.boundingBox) out.boundingBox = g.boundingBox.clone()
  if (g.boundingSphere) out.boundingSphere = g.boundingSphere.clone()
  for (let j = 0; j < list.length; j++) {
    const a = list[j]!
    const s = a.itemSize
    const src = a.array as THREE.TypedArray
    const Ctor = src.constructor as new (n: number) => THREE.TypedArray
    const dst = new Ctor(next * s)
    for (let n = 0; n < next; n++) {
      const from = kept[n]! * s
      const to = n * s
      for (let k = 0; k < s; k++) dst[to + k] = src[from + k]!
    }
    out.setAttribute(names[j]!, new (a.constructor as typeof THREE.BufferAttribute)(dst, s, a.normalized))
  }
  out.setIndex(next > 65535 ? new THREE.Uint32BufferAttribute(newIndex, 1) : new THREE.Uint16BufferAttribute(Uint16Array.from(newIndex), 1))
  return out
}
