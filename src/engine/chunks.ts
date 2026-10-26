/**
 * The level's static geometry, held as a grid of cells and STREAMED.
 *
 * Every static buildable belongs to the cell its centre falls in. What a cell holds depends on how near the
 * camera is:
 *
 *  - its COLLISION (its own BVH) is always there, so physics never waits for graphics;
 *  - its STRUCTURE meshes (the big parts) are built while the cell is within the drawing distance, and let go
 *    once the camera has moved well clear;
 *  - its DETAIL meshes (rivets, bolts, trim) are built only when the camera is close.
 *
 * So the memory and the load time of a level follow what can be seen, not how big the level is. Baking is
 * only stamping prepared templates (see bake.ts), cheap enough to do a cell or two a frame, nearest first,
 * within a time budget; after a jump (a respawn) the budget is lifted so the view is not left bare.
 *
 * Editing re-bakes only the cells whose contents changed: `sync` compares a signature of each cell's
 * buildables (what they are, where, how big, turned how) with the one it was last baked from, and leaves the
 * rest untouched. A big level costs one cell per edit, not the level.
 */

import * as THREE from 'three'
import type { Buildable } from '../entities/buildable'
import type { CollisionSystem } from '../physics/collision'
import { getLevelDepthMaterial, getLevelMaterial } from '../render/levelmaterial'
import { bakeCell, warmTemplates, type Want } from './bake'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/** Side of a cell, metres. Big enough that a view covers few of them, small enough to cull usefully. */
export const CELL_SIZE = 96
/** How near the camera has to be to a cell for it to have its fine detail, metres. */
export const DETAIL_RANGE = 80
/** A built layer is let go once the camera is this much farther than it was built for, so hovering at an edge does not rebuild it every frame. */
/**
 * The depth pass's draw order: before everything else opaque in the same drawing of the scene (depthScene is drawn as
 * part of the scene, not on its own: a drawing of its own was a whole walk, sort and set-up for one draw).
 */
export const DEPTH_FIRST = -1000
const RELEASE_MARGIN = 60
/** A camera that moves farther than this in one frame has jumped: the streaming budget is lifted to catch up. */
const JUMP = 40
/**
 * A level of no more cells than this is drawn MERGED in play: all of its structure in one mesh, all of its detail in
 * another, one depth copy — three draws, where it was one a cell a layer (sixteen for the facility), each of them a
 * fifth of a millisecond of a Chromebook's processor. Baked from every cell's buildables at once (mergeNow) when the
 * level loads or build mode closes; while building, each cell is drawn as itself (an edit bakes one cell, not the level).
 */
const MERGE_MAX_CELLS = 12

/** Budget for streaming per frame, ms, in normal play. */
const FRAME_BUDGET = 5
/** And right after a jump. */
const JUMP_BUDGET = 60

type Layer = 'structure' | 'detail'

interface Cell {
  key: string
  signature: string
  entities: Buildable[]
  /** From the buildables' own bounds, so it is known without baking anything. */
  bounds: THREE.Box3
  structure: THREE.Mesh | null
  detail: THREE.Mesh | null
  /** The structure's stand-in in the depth scene. */
  structureDepth: THREE.Mesh | null
  /**
   * Whether each layer has been baked, whether or not it came out with anything in it. A cell whose blocks are
   * all hidden, or that has no fine detail, has an empty layer: without this it looked unbuilt and was baked
   * again every frame.
   */
  structureReady: boolean
  detailReady: boolean
  structureTriangles: number
  detailTriangles: number
  culledTriangles: number
  collisionTriangles: number
}

export interface SyncStats {
  cells: number
  rebuilt: number
  removed: number
  ms: number
  /** The longest a single cell took to bake, ms: the shortest the main thread can be held for. */
  slowestCell: number
}

const yieldToBrowser = (): Promise<void> => new Promise((r) => setTimeout(r, 0))

const _box = new THREE.Box3()

export class StaticChunks {
  /** Every static buildable ever baked this session, by the stable index collisions report. */
  private readonly table: (Buildable | null)[] = []
  private readonly indexes = new Map<Buildable, number>()
  private readonly cells = new Map<string, Cell>()
  private cellList: Cell[] = []
  /** Where the camera was last, or the level's start before it has been anywhere. */
  readonly focus = new THREE.Vector3()
  private lastCamera: THREE.Vector3 | null = null
  /** How far from the camera cells are built, metres; the world sets it from the level's fog. */
  drawDistance = 600
  /**
   * The level's structure again, as depth only, drawn before the scene (see main.ts). The renderer sorts whole
   * meshes, and a cell's mesh is as big as the cell, so with a wall in the face it shaded everything behind the wall
   * first and then painted the wall over it: the slowest frames in the game were the ones looking at a wall. With
   * the nearest surface's depth already laid down, every pixel is shaded once. A scene of its own, so the main
   * scene's lights are not set up twice a frame.
   */
  readonly depthScene = StaticChunks.stillScene()
  /** A scene that is never moved (its meshes are in world space): left out of drawing's walk (World.walkedScene). */
  private static stillScene(): THREE.Scene {
    const s = new THREE.Scene()
    s.matrixAutoUpdate = false
    s.matrixWorldAutoUpdate = false
    return s
  }

  /** May the level be drawn merged now (not while it is being built: World.building). */
  mergeAllowed = true
  /** Changes whenever a cell's contents do (rebuild, removed, cleared): the merged meshes are of one version. */
  private version = 0
  private mergedVersion = -1
  private readonly merged: { structure: THREE.Mesh | null; detail: THREE.Mesh | null; depth: THREE.Mesh | null } = { structure: null, detail: null, depth: null }

  /** Is the level drawn merged right now? */
  get isMerged(): boolean {
    return this.mergedVersion >= 0
  }

  /**
   * Draw the level merged (see MERGE_MAX_CELLS), baked afresh if its cells have changed since; or each cell as itself,
   * where merging is not allowed or the level is too big. Cheap to call every frame when nothing has changed.
   */
  mergeNow(): void {
    if (!this.mergeAllowed || this.cellList.length === 0 || this.cellList.length > MERGE_MAX_CELLS) {
      this.unmerge()
      return
    }
    if (this.mergedVersion === this.version) return
    this.unmerge()
    const all: Buildable[] = []
    for (const c of this.cellList) all.push(...c.entities)
    const geos: Partial<Record<'structure' | 'detail', THREE.BufferGeometry>> = {}
    for (const layer of ['structure', 'detail'] as const) {
      const baked = bakeCell(all, this.indexOf, this.layerWant(layer))
      const l = baked.layers[0]
      if (l) geos[layer] = l.geometry
    }
    // The depth pass, of the structure alone (its big surfaces are what hide the rest).
    if (geos.structure) {
      const depth = this.levelMesh(geos.structure.clone(), getLevelDepthMaterial())
      depth.renderOrder = DEPTH_FIRST
      this.depthScene.add(depth)
      this.merged.depth = depth
    }
    // Structure and detail drawn as ONE mesh: both in the level's material, both always shown when merged — two draws
    // where one does (a draw is a quarter of a millisecond of a Chromebook's processor).
    const both = geos.structure && geos.detail ? mergeGeometries([geos.structure, geos.detail], false) : null
    if (both) {
      geos.structure!.dispose()
      geos.detail!.dispose()
      const mesh = this.levelMesh(both, getLevelMaterial())
      this.scene.add(mesh)
      this.merged.structure = mesh
    } else {
      for (const layer of ['structure', 'detail'] as const) {
        const g = geos[layer]
        if (!g) continue
        const mesh = this.levelMesh(g, getLevelMaterial())
        this.scene.add(mesh)
        this.merged[layer] = mesh
      }
    }
    this.mergedVersion = this.version
    this.showCells(false)
  }

  /** Back to each cell drawn as itself. */
  private unmerge(): void {
    if (this.mergedVersion < 0 && !this.merged.structure && !this.merged.detail) return
    for (const k of ['structure', 'detail', 'depth'] as const) {
      const m = this.merged[k]
      if (!m) continue
      m.parent?.remove(m)
      m.geometry.dispose()
      this.merged[k] = null
    }
    this.mergedVersion = -1
    this.showCells(true)
  }

  private showCells(on: boolean): void {
    for (const c of this.cellList) {
      if (c.structure) c.structure.visible = on
      if (c.detail) c.detail.visible = on
      if (c.structureDepth) c.structureDepth.visible = on
    }
  }

  /** A mesh of the level's drawn geometry: never ray-cast (the collision answers that), its CPU copies dropped once on the GPU. */
  private levelMesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.matrixAutoUpdate = false
    mesh.raycast = () => {}
    for (const a of [...Object.values(geometry.attributes), geometry.index!] as THREE.BufferAttribute[]) a.onUpload(() => void ((a as unknown as { array: unknown }).array = null))
    return mesh
  }

  constructor(
    private readonly scene: THREE.Scene,
    private readonly collision: CollisionSystem,
  ) {}

  /** The buildable for an index a contact or a raycast reported. */
  entityAt(index: number): Buildable | null {
    return this.table[index] ?? null
  }

  private indexOf = (b: Buildable): number => {
    let i = this.indexes.get(b)
    if (i === undefined) {
      i = this.table.length
      this.table.push(b)
      this.indexes.set(b, i)
    }
    return i
  }

  get cellCount(): number {
    return this.cells.size
  }

  /** Has the camera been seen yet? Until then the focus is wherever the level starts. */
  get hasCamera(): boolean {
    return this.lastCamera !== null
  }

  /** Cells that currently have render geometry. */
  get builtCellCount(): number {
    let n = 0
    for (const c of this.cellList) if (c.structureReady) n++
    return n
  }

  private sum(pick: (c: Cell) => number): number {
    let n = 0
    for (const c of this.cellList) n += pick(c)
    return n
  }
  /** Triangles of the render geometry that is built right now. */
  get renderTriangles(): number {
    return this.sum((c) => c.structureTriangles + c.detailTriangles)
  }
  get detailTriangles(): number {
    return this.sum((c) => c.detailTriangles)
  }
  get culledTriangles(): number {
    return this.sum((c) => c.culledTriangles)
  }
  get collisionTriangles(): number {
    return this.sum((c) => c.collisionTriangles)
  }

  /** Drop every cell and forget every index. */
  clear(): void {
    this.unmerge()
    this.version++
    for (const cell of this.cellList) this.disposeCell(cell)
    this.cells.clear()
    this.cellList = []
    this.table.length = 0
    this.indexes.clear()
    this.collision.clear()
    this.lastCamera = null
  }

  private disposeLayer(cell: Cell, layer: Layer): void {
    if (layer === 'structure') cell.structureReady = false
    else cell.detailReady = false
    const mesh = cell[layer]
    if (layer === 'structure' && cell.structureDepth) {
      this.depthScene.remove(cell.structureDepth)
      cell.structureDepth = null
    }
    if (!mesh) return
    this.scene.remove(mesh)
    mesh.geometry.dispose()
    cell[layer] = null
    if (layer === 'structure') cell.structureTriangles = 0
    else cell.detailTriangles = 0
  }

  private disposeCell(cell: Cell): void {
    this.disposeLayer(cell, 'structure')
    this.disposeLayer(cell, 'detail')
    this.collision.removeChunk(cell.key)
  }

  /**
   * Let go of all the render geometry; it is built again as it is wanted. For when the GPU has lost it (a
   * lost WebGL context), since the CPU copies are dropped once uploaded.
   */
  invalidateRender(): void {
    for (const c of this.cellList) {
      this.disposeLayer(c, 'structure')
      this.disposeLayer(c, 'detail')
    }
  }

  // --- planning ----------------------------------------------------------------

  private plan(statics: Buildable[]): Map<string, Buildable[]> {
    const plan = new Map<string, Buildable[]>()
    for (const b of statics) {
      const p = b.object.position
      const key = `${Math.floor(p.x / CELL_SIZE)},${Math.floor(p.z / CELL_SIZE)}`
      let list = plan.get(key)
      if (!list) plan.set(key, (list = []))
      list.push(b)
    }
    return plan
  }

  /** What a cell's bake depends on, as a string: equal signatures bake to the same cell. */
  private signature(list: Buildable[]): string {
    const parts: string[] = []
    for (const b of list) {
      const p = b.object.position
      const q = b.object.quaternion
      // A buildable that cannot be keyed describes itself in full.
      const what = b.bakeKey() ?? JSON.stringify(b.serialize())
      parts.push(`${what}@${p.x},${p.y},${p.z}/${q.x},${q.y},${q.z},${q.w}/${b.solid ? 1 : 0}`)
    }
    return parts.join(';')
  }

  private diff(statics: Buildable[]): { todo: [string, Buildable[], string][]; gone: string[]; total: number } {
    const plan = this.plan(statics)
    const todo: [string, Buildable[], string][] = []
    for (const [key, list] of plan) {
      const signature = this.signature(list)
      if (this.cells.get(key)?.signature !== signature) todo.push([key, list, signature])
    }
    const gone = [...this.cells.keys()].filter((k) => !plan.has(k))
    return { todo, gone, total: plan.size }
  }

  // --- baking ------------------------------------------------------------------

  private layerWant(layer: Layer): Want {
    return { structure: layer === 'structure', detail: layer === 'detail', collision: false }
  }

  private buildLayer(cell: Cell, layer: Layer): void {
    this.disposeLayer(cell, layer)
    const baked = bakeCell(cell.entities, this.indexOf, this.layerWant(layer))
    if (layer === 'structure') cell.structureReady = true
    else cell.detailReady = true
    const l = baked.layers[0]
    if (!l) return
    const mesh = new THREE.Mesh(l.geometry, getLevelMaterial())
    mesh.matrixAutoUpdate = false
    // Never ray-cast the drawn level: its triangles are not kept on the CPU (below), and the collision tree is
    // what answers "what is under this ray" (see CollisionSystem.raycast).
    mesh.raycast = () => {}
    // Once the GPU has the buffers the CPU copies are dead weight: drop them. They are rebuilt from templates.
    for (const a of [...Object.values(l.geometry.attributes), l.geometry.index!] as THREE.BufferAttribute[]) a.onUpload(() => void ((a as unknown as { array: unknown }).array = null))
    this.scene.add(mesh)
    cell[layer] = mesh
    // Not drawn while the level is drawn merged (its own copy is in the merged mesh).
    mesh.visible = !this.isMerged
    if (layer === 'structure') {
      const depth = new THREE.Mesh(l.geometry, getLevelDepthMaterial())
      depth.matrixAutoUpdate = false
      depth.renderOrder = DEPTH_FIRST
      depth.raycast = mesh.raycast
      depth.visible = !this.isMerged
      this.depthScene.add(depth)
      cell.structureDepth = depth
      cell.structureTriangles = baked.renderTriangles
      cell.culledTriangles = baked.culledTriangles
    } else {
      cell.detailTriangles = baked.renderTriangles
    }
  }

  /** (Re)build a cell's contents after its buildables changed: collision at once, and any layers it has. */
  private rebuild(key: string, list: Buildable[], signature: string): void {
    this.version++
    const old = this.cells.get(key)
    const cell: Cell = old ?? {
      key,
      signature,
      entities: list,
      bounds: new THREE.Box3(),
      structure: null,
      detail: null,
      structureDepth: null,
      structureReady: false,
      detailReady: false,
      structureTriangles: 0,
      detailTriangles: 0,
      culledTriangles: 0,
      collisionTriangles: 0,
    }
    cell.signature = signature
    cell.entities = list
    cell.bounds.makeEmpty()
    for (const b of list) cell.bounds.union(b.computeAABB(_box))
    const baked = bakeCell(list, this.indexOf, { structure: false, detail: false, collision: true })
    cell.collisionTriangles = baked.collisionTriangles
    if (baked.collision) this.collision.setChunk(key, baked.collision, baked.owners)
    else this.collision.removeChunk(key)
    // A layer the cell already had is baked again at once, so an edit shows; one it did not have waits to be wanted.
    if (cell.structureReady) this.buildLayer(cell, 'structure')
    if (cell.detailReady) this.buildLayer(cell, 'detail')
    if (!old) {
      this.cells.set(key, cell)
      this.cellList.push(cell)
    }
  }

  private removeGone(gone: string[]): void {
    if (gone.length > 0) this.version++
    for (const k of gone) {
      const cell = this.cells.get(k)!
      this.disposeCell(cell)
      this.cells.delete(k)
    }
    if (gone.length > 0) this.cellList = [...this.cells.values()]
  }

  // --- streaming ---------------------------------------------------------------

  /**
   * How near a cell's detail is built. While the level is drawn merged (in play, a level small enough to), all of it, from the start, and none let
   * go: a cell built or let go there changes the level, and the merged mesh is then baked again whole — 40 to 75 ms on
   * the frame you walked into a new room. (The facility's detail is some 25,000 triangles in all.)
   */
  private get detailRange(): number {
    return this.mergeAllowed && this.cellList.length > 0 && this.cellList.length <= MERGE_MAX_CELLS ? Infinity : DETAIL_RANGE
  }

  /** The layers the focus wants that a cell lacks, nearest first. */
  private missing(): { cell: Cell; layer: Layer; d: number }[] {
    const out: { cell: Cell; layer: Layer; d: number }[] = []
    for (const cell of this.cellList) {
      const d = cell.bounds.distanceToPoint(this.focus)
      if (!cell.structureReady && d < this.drawDistance) out.push({ cell, layer: 'structure', d })
      if (!cell.detailReady && d < this.detailRange) out.push({ cell, layer: 'detail', d })
    }
    return out.sort((a, b) => a.d - b.d)
  }

  private releaseFar(): void {
    for (const cell of this.cellList) {
      const d = cell.bounds.distanceToPoint(this.focus)
      if (cell.structureReady && d > this.drawDistance + RELEASE_MARGIN) this.disposeLayer(cell, 'structure')
      if (cell.detailReady && d > this.detailRange + RELEASE_MARGIN) this.disposeLayer(cell, 'detail')
    }
  }

  /** Build everything the focus wants, with no budget: for a first load and for the synchronous paths. */
  prime(): void {
    this.releaseFar()
    for (const m of this.missing()) this.buildLayer(m.cell, m.layer)
  }

  /** The same, a few milliseconds at a time. `onProgress` is given 0..1. */
  async primeAsync(onProgress?: (done: number) => void, yieldFn: () => Promise<void> = yieldToBrowser, sliceMs = 14): Promise<void> {
    this.releaseFar()
    const todo = this.missing()
    let t = performance.now()
    for (let i = 0; i < todo.length; i++) {
      this.buildLayer(todo[i]!.cell, todo[i]!.layer)
      onProgress?.((i + 1) / todo.length)
      if (performance.now() - t > sliceMs) {
        await yieldFn()
        t = performance.now()
      }
    }
  }

  /**
   * Once a frame, before drawing: let go of what the camera has left far behind and build what it is coming
   * to, nearest first, within a time budget. A jump (a respawn, a teleport) lifts the budget so the view is
   * not left bare. `drawDistance` is how far the camera sees.
   */
  update(camera: THREE.Vector3): void {
    const jumped = this.lastCamera !== null && this.lastCamera.distanceTo(camera) > JUMP
    this.lastCamera = this.lastCamera ?? new THREE.Vector3()
    this.lastCamera.copy(camera)
    this.focus.copy(camera)
    this.releaseFar()
    this.mergeNow()
    const todo = this.missing()
    if (todo.length === 0) return
    const budget = jumped ? JUMP_BUDGET : FRAME_BUDGET
    const t0 = performance.now()
    for (const m of todo) {
      this.buildLayer(m.cell, m.layer)
      if (performance.now() - t0 > budget) break
    }
  }

  // --- syncing -----------------------------------------------------------------

  /** Bring the cells up to date with `statics`, baking only those that changed, and build what the focus wants. */
  sync(statics: Buildable[]): SyncStats {
    const t = performance.now()
    const { todo, gone, total } = this.diff(statics)
    this.removeGone(gone)
    let slowest = 0
    for (const [key, list, signature] of todo) {
      const c0 = performance.now()
      this.rebuild(key, list, signature)
      slowest = Math.max(slowest, performance.now() - c0)
    }
    this.prime()
    return { cells: total, rebuilt: todo.length, removed: gone.length, ms: performance.now() - t, slowestCell: slowest }
  }

  /**
   * The same, a few milliseconds at a time: after each slice it yields, so the page can paint and the loading
   * bar can move. Templates are prepared first, collision for every cell next, then the cells near the focus.
   * `onProgress` is given 0..1 over all of it.
   */
  async syncAsync(statics: Buildable[], onProgress?: (done: number) => void, yieldFn: () => Promise<void> = yieldToBrowser, sliceMs = 14): Promise<SyncStats> {
    const t0 = performance.now()
    const { todo, gone, total } = this.diff(statics)
    this.removeGone(gone)
    // 0..0.15 templates, 0.15..0.6 collision, 0.6..1 the cells in view.
    let t = performance.now()
    const keyed = statics.filter((b) => b.bakeKey() !== null)
    for (let i = 0; i < keyed.length; i += 64) {
      const made = warmTemplates(keyed.slice(i, i + 64), sliceMs)
      onProgress?.(0.15 * Math.min(1, (i + 64) / keyed.length))
      if (made > 0 && performance.now() - t > sliceMs) {
        await yieldFn()
        t = performance.now()
      }
    }
    let slowest = 0
    for (let i = 0; i < todo.length; i++) {
      const [key, list, signature] = todo[i]!
      const c0 = performance.now()
      this.rebuild(key, list, signature)
      slowest = Math.max(slowest, performance.now() - c0)
      onProgress?.(0.15 + 0.45 * ((i + 1) / todo.length))
      if (performance.now() - t > sliceMs) {
        await yieldFn()
        t = performance.now()
      }
    }
    await this.primeAsync((p) => onProgress?.(0.6 + 0.4 * p), yieldFn, sliceMs)
    onProgress?.(1)
    return { cells: total, rebuilt: todo.length, removed: gone.length, ms: performance.now() - t0, slowestCell: slowest }
  }
}
