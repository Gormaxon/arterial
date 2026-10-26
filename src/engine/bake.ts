/**
 * Baking one cell of static geometry.
 *
 * A level is cut into square cells (see chunks.ts) and each is baked on its own, and only as much of it as is
 * wanted at the moment (the collision always; the structure while the camera is within drawing distance; the
 * detail only close), into:
 *
 *  - Render: its buildables' geometry in two layers, STRUCTURE (the big parts, always drawn) and DETAIL
 *    (anything under DETAIL_SIZE on every side: rivets, bolts, studs, trim; drawn only near). Every surface
 *    goes into the same layer: each vertex carries which surface it is (see render/levelmaterial.ts), so a
 *    layer is ONE draw however many surfaces it has. Packed straight into typed arrays: indexed, positions as
 *    float32, normals as int8 and UVs as float32, about 40% of what merged non-indexed geometry weighs.
 *  - Collision: each buildable's simplified boxes as one triangle soup, with a per-triangle owner so a
 *    raycast still resolves to a real entity. Decorative detail never reaches the BVH.
 *
 * Most levels are the same few blocks stamped many times, so a buildable's parts are built, face-culled
 * and compacted ONCE per (block, size) into a template (`Buildable.bakeKey`), and every instance is a
 * transformed copy of it. That is what keeps a few thousand blocks from taking seconds to load.
 */

import * as THREE from 'three'
import { seedSurfaceBoxes, type Buildable } from '../entities/buildable'
import type { SurfaceKey } from '../render/materials'
import { cullHiddenFaces } from './facecull'
import { surfaceLayer } from '../render/levelmaterial'

/** Parts whose longest side is under this are fine detail: drawn only near the camera. */
/** Two well-mixed bytes from a position: a piece's shade (low byte) and warm/cool cast (next byte). */
export function toneOf(x: number, y: number, z: number): number {
  let h = Math.imul(Math.round(x * 2) | 0, 73856093) ^ Math.imul(Math.round(y * 2) | 0, 19349663) ^ Math.imul(Math.round(z * 2) | 0, 83492791)
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b)
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
  return (h ^ (h >>> 16)) >>> 0
}

export const DETAIL_SIZE = 1.0

/** One part of a template: positions, normals and UVs of the vertices its faces use, and its triangles. */
interface TemplatePart {
  surface: SurfaceKey
  fine: boolean
  pos: Float32Array
  nrm: Float32Array
  uv: Float32Array
  index: Uint32Array
  vertices: number
}

interface Template {
  parts: TemplatePart[]
  triangles: number
  /** Triangles dropped as hidden when this template was made. */
  culled: number
}

const templates = new Map<string, Template>()
const boxTemplates = new Map<string, import('../prefabs/geometry').BoxSpec[]>()
/** Past this many templates the cache starts over: a long editing session makes a new size now and then. */
const TEMPLATE_LIMIT = 1500

export function clearBakeCache(): void {
  templates.clear()
  boxTemplates.clear()
}

/** Build a buildable's template: its parts face-culled and compacted to just the vertices they use. */
function makeTemplate(entity: Buildable): Template {
  const parts = entity.buildParts()
  // The same parts say what each of its surfaces is where (Buildable.surfaceAt): noted now, while they exist.
  seedSurfaceBoxes(entity.bakeKey(), parts)
  const culled = cullHiddenFaces(parts)
  const out: TemplatePart[] = []
  let triangles = 0
  for (const part of parts) {
    const g = part.geometry
    const pos = g.attributes.position!
    const nrm = g.attributes.normal!
    const uv = g.attributes.uv!
    const index = g.index
    const remap = new Int32Array(pos.count).fill(-1)
    let used = 0
    const count = index ? index.count : pos.count
    for (let i = 0; i < count; i++) {
      const v = index ? index.getX(i) : i
      if (remap[v]! < 0) remap[v] = used++
    }
    const tp: TemplatePart = {
      surface: part.surface,
      fine: false,
      pos: new Float32Array(used * 3),
      nrm: new Float32Array(used * 3),
      uv: new Float32Array(used * 2),
      index: new Uint32Array(count),
      vertices: used,
    }
    let minX = Infinity
    let minY = Infinity
    let minZ = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    let maxZ = -Infinity
    for (let v = 0; v < pos.count; v++) {
      const r = remap[v]!
      if (r < 0) continue
      const x = pos.getX(v)
      const y = pos.getY(v)
      const z = pos.getZ(v)
      tp.pos[r * 3] = x
      tp.pos[r * 3 + 1] = y
      tp.pos[r * 3 + 2] = z
      tp.nrm[r * 3] = nrm.getX(v)
      tp.nrm[r * 3 + 1] = nrm.getY(v)
      tp.nrm[r * 3 + 2] = nrm.getZ(v)
      tp.uv[r * 2] = uv.getX(v)
      tp.uv[r * 2 + 1] = uv.getY(v)
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (z < minZ) minZ = z
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
      if (z > maxZ) maxZ = z
    }
    for (let i = 0; i < count; i++) tp.index[i] = remap[index ? index.getX(i) : i]!
    tp.fine = Math.max(maxX - minX, maxY - minY, maxZ - minZ) < DETAIL_SIZE && !part.core
    triangles += count / 3
    out.push(tp)
    g.dispose()
  }
  return { parts: out, triangles, culled }
}

function templateFor(entity: Buildable): Template {
  const key = entity.bakeKey()
  if (key === null) return makeTemplate(entity)
  let t = templates.get(key)
  if (!t) {
    if (templates.size >= TEMPLATE_LIMIT) templates.clear()
    t = makeTemplate(entity)
    templates.set(key, t)
  }
  return t
}

/** The packed buffers one layer of a cell is poured into. */
interface Pack {
  detail: boolean
  vertices: number
  indices: number
  pos?: Float32Array
  nrm?: Int8Array
  uv?: Float32Array
  surf?: Uint8Array
  idx?: Uint16Array | Uint32Array
  filledVertices: number
  filledIndices: number
}

export interface CellLayer {
  detail: boolean
  geometry: THREE.BufferGeometry
  triangles: number
}

/** Which parts of a cell to bake. */
export interface Want {
  structure: boolean
  detail: boolean
  collision: boolean
}

export const WANT_ALL: Want = { structure: true, detail: true, collision: true }

export interface CellBake {
  layers: CellLayer[]
  /** Collision triangle soup (positions only) and each triangle's owner, as a global entity index. */
  collision: THREE.BufferGeometry | null
  owners: Uint32Array
  collisionTriangles: number
  renderTriangles: number
  detailTriangles: number
  culledTriangles: number
}

const _m = new THREE.Matrix4()

/** The 12 triangles of a unit cube centred on the origin, as 36 corner positions. */
const CUBE: number[] = (() => {
  const g = new THREE.BoxGeometry(1, 1, 1).toNonIndexed()
  const out = Array.from(g.attributes.position!.array)
  g.dispose()
  return out
})()

function boxesFor(entity: Buildable): import('../prefabs/geometry').BoxSpec[] {
  const key = entity.bakeKey()
  if (key === null) return entity.collisionBoxes()
  const k = `${key}|${entity.solid ? 1 : 0}`
  let b = boxTemplates.get(k)
  if (!b) {
    if (boxTemplates.size >= TEMPLATE_LIMIT) boxTemplates.clear()
    b = entity.collisionBoxes()
    boxTemplates.set(k, b)
  }
  return b
}

/**
 * Build the templates for these buildables now, so that baking a cell later is only stamping them.
 * Returns how many it made. A budget (ms) makes it stop early; call again to carry on.
 */
export function warmTemplates(entities: Buildable[], budgetMs = Infinity): number {
  const t0 = performance.now()
  let made = 0
  for (const entity of entities) {
    const key = entity.bakeKey()
    if (key === null || templates.has(key)) continue
    templateFor(entity)
    made++
    if (performance.now() - t0 > budgetMs) break
  }
  return made
}

/** Bake the static buildables of one cell. `indexOf` gives each its stable global index. */
export function bakeCell(entities: Buildable[], indexOf: (b: Buildable) => number, want: Want = WANT_ALL): CellBake {
  const jobs: { template: Template; e: Float32Array }[] = []
  const packs = new Map<string, Pack>()
  let renderTriangles = 0
  let detailTriangles = 0
  let culledTriangles = 0

  // --- pass 1: which templates, and how big each pack has to be ----------------
  for (const entity of want.structure || want.detail ? entities : []) {
    entity.object.updateMatrix()
    const template = templateFor(entity)
    if (template.parts.length === 0) continue
    jobs.push({ template, e: Float32Array.from(entity.object.matrix.elements) })
    if (want.structure) culledTriangles += template.culled
    for (const tp of template.parts) {
      if (tp.fine ? !want.detail : !want.structure) continue
      const key = tp.fine ? 'd' : 's'
      let p = packs.get(key)
      if (!p) packs.set(key, (p = { detail: tp.fine, vertices: 0, indices: 0, filledVertices: 0, filledIndices: 0 }))
      p.vertices += tp.vertices
      p.indices += tp.index.length
      renderTriangles += tp.index.length / 3
      if (tp.fine) detailTriangles += tp.index.length / 3
    }
  }
  for (const p of packs.values()) {
    p.pos = new Float32Array(p.vertices * 3)
    p.nrm = new Int8Array(p.vertices * 4)
    p.uv = new Float32Array(p.vertices * 2)
    p.surf = new Uint8Array(p.vertices * 4)
    p.idx = p.vertices < 65536 ? new Uint16Array(p.indices) : new Uint32Array(p.indices)
  }

  // --- pass 2: pour each instance in, transformed -------------------------------
  for (const { template, e } of jobs) {
    const e0 = e[0]!, e1 = e[1]!, e2 = e[2]!, e4 = e[4]!, e5 = e[5]!, e6 = e[6]!, e8 = e[8]!, e9 = e[9]!, e10 = e[10]!, e12 = e[12]!, e13 = e[13]!, e14 = e[14]!
    // Each piece's own slight shade and cast (levelmaterial.ts), from where it stands: the same every bake, and
    // neighbours differ, so a run of identical blocks stops reading as one flat surface.
    const tone = toneOf(e12, e13, e14)
    for (const tp of template.parts) {
      const p = packs.get(tp.fine ? 'd' : 's')
      if (!p) continue
      const layer = surfaceLayer(tp.surface)
      const v0 = p.filledVertices
      const pos = p.pos!
      const nrm = p.nrm!
      const uv = p.uv!
      for (let i = 0; i < tp.vertices; i++) {
        const x = tp.pos[i * 3]!
        const y = tp.pos[i * 3 + 1]!
        const z = tp.pos[i * 3 + 2]!
        const o = (v0 + i) * 3
        pos[o] = e0 * x + e4 * y + e8 * z + e12
        pos[o + 1] = e1 * x + e5 * y + e9 * z + e13
        pos[o + 2] = e2 * x + e6 * y + e10 * z + e14
        // Entities are placed and turned, never scaled, so the upper 3x3 rotates a normal as it stands.
        const nx = tp.nrm[i * 3]!
        const ny = tp.nrm[i * 3 + 1]!
        const nz = tp.nrm[i * 3 + 2]!
        const n = (v0 + i) * 4
        nrm[n] = Math.round((e0 * nx + e4 * ny + e8 * nz) * 127)
        nrm[n + 1] = Math.round((e1 * nx + e5 * ny + e9 * nz) * 127)
        nrm[n + 2] = Math.round((e2 * nx + e6 * ny + e10 * nz) * 127)
        uv[(v0 + i) * 2] = tp.uv[i * 2]!
        uv[(v0 + i) * 2 + 1] = tp.uv[i * 2 + 1]!
        p.surf![(v0 + i) * 4] = layer
        p.surf![(v0 + i) * 4 + 1] = tone & 255
        p.surf![(v0 + i) * 4 + 2] = (tone >>> 8) & 255
      }
      const idx = p.idx!
      const i0 = p.filledIndices
      for (let k = 0; k < tp.index.length; k++) idx[i0 + k] = tp.index[k]! + v0
      p.filledVertices += tp.vertices
      p.filledIndices += tp.index.length
    }
  }

  const layers: CellLayer[] = []
  for (const p of packs.values()) {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(p.pos!, 3))
    g.setAttribute('normal', new THREE.BufferAttribute(p.nrm!, 4, true))
    g.setAttribute('uv', new THREE.BufferAttribute(p.uv!, 2))
    g.setAttribute('aSurface', new THREE.BufferAttribute(p.surf!, 4))
    g.setIndex(new THREE.BufferAttribute(p.idx!, 1))
    g.computeBoundingBox()
    g.computeBoundingSphere()
    layers.push({ detail: p.detail, geometry: g, triangles: p.indices / 3 })
  }

  // --- collision -----------------------------------------------------------------
  if (!want.collision) return { layers, collision: null, owners: new Uint32Array(0), collisionTriangles: 0, renderTriangles, detailTriangles, culledTriangles }
  let boxCount = 0
  const lists: { boxes: import('../prefabs/geometry').BoxSpec[]; owner: number; e: Float32Array }[] = []
  for (const entity of entities) {
    const boxes = boxesFor(entity)
    if (boxes.length === 0) continue
    boxCount += boxes.length
    _m.copy(entity.object.matrix)
    lists.push({ boxes, owner: indexOf(entity), e: Float32Array.from(_m.elements) })
  }
  let collision: THREE.BufferGeometry | null = null
  const owners = new Uint32Array(boxCount * 12)
  let collisionTriangles = 0
  if (boxCount > 0) {
    const out = new Float32Array(boxCount * 36 * 3)
    let o = 0
    let tri = 0
    for (const { boxes, owner, e } of lists) {
      for (const b of boxes) {
        for (let i = 0; i < 36; i++) {
          const x = CUBE[i * 3]! * b.w + b.x
          const y = CUBE[i * 3 + 1]! * b.h + b.y
          const z = CUBE[i * 3 + 2]! * b.d + b.z
          out[o++] = e[0]! * x + e[4]! * y + e[8]! * z + e[12]!
          out[o++] = e[1]! * x + e[5]! * y + e[9]! * z + e[13]!
          out[o++] = e[2]! * x + e[6]! * y + e[10]! * z + e[14]!
        }
        for (let t = 0; t < 12; t++) owners[tri++] = owner
      }
    }
    collisionTriangles = tri
    collision = new THREE.BufferGeometry()
    collision.setAttribute('position', new THREE.BufferAttribute(out, 3))
  }

  return { layers, collision, owners, collisionTriangles, renderTriangles, detailTriangles, culledTriangles }
}
