/**
 * Coarse copies of models, made at load: a cheap far level of detail for anything you mostly see from across a room.
 *
 * Vertex clustering: space is cut into a grid of cells, every vertex in a cell is merged into one (its position the
 * cell's average, its normal and texture coordinate the first vertex's), and triangles that collapse are dropped. It
 * is crude next to a proper simplifier — it ignores seams and features — but it is a single linear pass in plain
 * TypeScript, so there is nothing to download and nothing to wait for, and at the distance the copy is shown at, the
 * difference is a few pixels.
 */

import * as THREE from 'three'

/** A clustered copy of `geo` with grid cells `cell` metres across (in the geometry's own space). */
export function decimate(geo: THREE.BufferGeometry, cell: number): THREE.BufferGeometry {
  const pos = geo.attributes.position as THREE.BufferAttribute
  const nrm = geo.attributes.normal as THREE.BufferAttribute | undefined
  const uv = geo.attributes.uv as THREE.BufferAttribute | undefined
  const n = pos.count
  const inv = 1 / Math.max(1e-6, cell)
  const clusterOf = new Int32Array(n)
  const keys = new Map<string, number>()
  const sum: number[] = []
  const first: number[] = []
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const key = `${Math.floor(x * inv)},${Math.floor(y * inv)},${Math.floor(z * inv)}`
    let c = keys.get(key)
    if (c === undefined) {
      c = first.length
      keys.set(key, c)
      first.push(i)
      sum.push(0, 0, 0, 0)
    }
    clusterOf[i] = c
    sum[c * 4] = sum[c * 4]! + x
    sum[c * 4 + 1] = sum[c * 4 + 1]! + y
    sum[c * 4 + 2] = sum[c * 4 + 2]! + z
    sum[c * 4 + 3] = sum[c * 4 + 3]! + 1
  }
  const m = first.length
  const P = new Float32Array(m * 3)
  const N = nrm ? new Float32Array(m * 3) : null
  const U = uv ? new Float32Array(m * 2) : null
  for (let c = 0; c < m; c++) {
    const k = sum[c * 4 + 3]!
    P[c * 3] = sum[c * 4]! / k
    P[c * 3 + 1] = sum[c * 4 + 1]! / k
    P[c * 3 + 2] = sum[c * 4 + 2]! / k
    const f = first[c]!
    if (N && nrm) {
      N[c * 3] = nrm.getX(f)
      N[c * 3 + 1] = nrm.getY(f)
      N[c * 3 + 2] = nrm.getZ(f)
    }
    if (U && uv) {
      U[c * 2] = uv.getX(f)
      U[c * 2 + 1] = uv.getY(f)
    }
  }
  const src = geo.index
  const tris = src ? src.count / 3 : n / 3
  const out: number[] = []
  const seen = new Set<number>()
  for (let t = 0; t < tris; t++) {
    const a = clusterOf[src ? src.getX(t * 3) : t * 3]!
    const b = clusterOf[src ? src.getX(t * 3 + 1) : t * 3 + 1]!
    const c = clusterOf[src ? src.getX(t * 3 + 2) : t * 3 + 2]!
    if (a === b || b === c || a === c) continue
    // The same three clusters can come from several original triangles: keep one.
    const lo = Math.min(a, b, c)
    const hi = Math.max(a, b, c)
    const mid = a + b + c - lo - hi
    const key = (lo * m + mid) * m + hi
    if (seen.has(key)) continue
    seen.add(key)
    out.push(a, b, c)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(P, 3))
  if (N) g.setAttribute('normal', new THREE.BufferAttribute(N, 3))
  if (U) g.setAttribute('uv', new THREE.BufferAttribute(U, 2))
  g.setIndex(m > 65535 ? new THREE.Uint32BufferAttribute(out, 1) : new THREE.Uint16BufferAttribute(out, 1))
  g.computeBoundingSphere()
  return g
}

/**
 * A copy of the model `root` with every mesh clustered on a grid `share` of the whole model's size across (0.025 is
 * about 40 cells along its longest side). Materials are shared with the original; geometries are new.
 */
export function coarseCopy(root: THREE.Object3D, share = 0.025): THREE.Object3D {
  root.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())
  const worldCell = Math.max(size.x, size.y, size.z) * share
  const copy = root.clone(true)
  copy.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh || (mesh as THREE.SkinnedMesh).isSkinnedMesh) return
    // The cell is set in world terms, so a mesh scaled inside the model is clustered at the same real size.
    const s = new THREE.Vector3()
    mesh.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), s)
    const local = worldCell / Math.max(1e-6, Math.max(Math.abs(s.x), Math.abs(s.y), Math.abs(s.z)))
    mesh.geometry = decimate(mesh.geometry, local)
  })
  return copy
}

/** Triangles drawn for a model, for tests and tools. */
export function triangles(root: THREE.Object3D): number {
  let t = 0
  root.traverse((o) => {
    const g = (o as THREE.Mesh).geometry
    if ((o as THREE.Mesh).isMesh && g) t += (g.index ? g.index.count : g.attributes.position!.count) / 3
  })
  return t
}
