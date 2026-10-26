/**
 * StaticBatches — many small props drawn as one mesh per material.
 *
 * Every breakable used to be its own meshes: a crate three, a banner four, a wall section five, each a separate draw
 * call of a few dozen triangles. A level with a dozen of them spent half its draw calls on props that make up a tiny
 * share of what is on screen, and on a Chromebook each draw call is the expensive part, not its triangles.
 *
 * Here each prop hands in its geometry (in its own space) and the object that places it; the batch merges everything
 * of one material, in world space, into one mesh. A prop that loses a piece collapses that piece's run of triangles in
 * place (`Slot.setRange`), exactly as it did in its own mesh. A prop that moves (the editor dragging it) or is
 * added, removed or rebuilt marks its material dirty, and that one batch is merged again on the next frame; each slot
 * is then told (`onRebuilt`) so it can collapse whatever it has lost again.
 *
 * A prop whose placing object is hidden is not drawn: its whole run is collapsed, and put back (with whatever it has
 * lost collapsed again) when it is shown. A shattered wall hides its object; before this, the object went invisible
 * but its triangles in the batch did not, so a broken wall stayed standing on screen while you walked through it.
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { surfaceOf } from '../render/materials'
import { getLevelMaterial, surfaceLayer } from '../render/levelmaterial'
import { toneOf } from './bake'

/**
 * Is a placer shown: it and what it hangs from (a rack's guns hang from its models' group, hidden while the room cannot
 * be seen, and from the rack, hidden when it is shattered).
 */
function shownOf(placer: THREE.Object3D): boolean {
  for (let o: THREE.Object3D | null = placer; o; o = o.parent) if (!o.visible) return false
  return true
}

export class BatchSlot {
  /** Where this slot's indices start in its batch's index buffer, after the last rebuild. -1 before the first. */
  start = -1
  /** Index count of the slot's own geometry. */
  readonly count: number
  /** The placing object's matrix when the batch was last built: a change means it moved. */
  readonly placedAt = new THREE.Matrix4()
  /** Whether the slot is drawn: its placer's visibility, as last applied. */
  shown = true

  constructor(
    readonly batch: MaterialBatch,
    /** Indexed geometry in the owner's space. Owned by the slot from here on (disposed on removal). */
    readonly geometry: THREE.BufferGeometry,
    /** What places it in the world (its matrixWorld is used). */
    readonly placer: THREE.Object3D,
    /** Called after every rebuild of its batch, to collapse again whatever the owner has hidden. */
    readonly onRebuilt: () => void,
    /** In the level material's batch: the surface's layer of it (render/levelmaterial.ts); -1 otherwise. */
    readonly layer = -1,
  ) {
    this.count = geometry.index ? geometry.index.count : 0
  }

  /** Draw a run of this slot's indices (`start`, `count` relative to the slot) or collapse it to nothing. */
  setRange(start: number, count: number, visible: boolean): void {
    this.batch.setRange(this, start, count, visible)
  }
}

class MaterialBatch {
  readonly slots: BatchSlot[] = []
  mesh: THREE.Mesh | null = null
  private original: Uint16Array | Uint32Array | null = null
  dirty = true

  constructor(
    readonly material: THREE.Material,
    private readonly scene: THREE.Scene,
  ) {}

  rebuild(): void {
    this.dirty = false
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh = null
      this.original = null
    }
    const parts: THREE.BufferGeometry[] = []
    const used: BatchSlot[] = []
    for (const s of this.slots) {
      s.start = -1
      if (s.count === 0) continue
      s.placer.updateWorldMatrix(true, false)
      s.placedAt.copy(s.placer.matrixWorld)
      const g = s.geometry.clone().applyMatrix4(s.placer.matrixWorld)
      if (s.layer >= 0) {
        // Drawn in the level's own material: which surface each vertex is, and its piece's shade and cast, as the baked
        // level has them (engine/bake.ts) — so props of every surface are one draw, like the level.
        const n = g.attributes.position!.count
        const surf = new Float32Array(n * 4)
        const e = s.placer.matrixWorld.elements
        const tone = toneOf(e[12]!, e[13]!, e[14]!)
        for (let i = 0; i < n; i++) {
          surf[i * 4] = s.layer
          surf[i * 4 + 1] = tone & 255
          surf[i * 4 + 2] = (tone >>> 8) & 255
        }
        g.setAttribute('aSurface', new THREE.BufferAttribute(surf, 4))
        for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal' && name !== 'uv' && name !== 'aSurface') g.deleteAttribute(name)
        if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n * 2), 2))
      }
      parts.push(g)
      used.push(s)
    }
    if (parts.length === 0) return
    const merged = parts.length === 1 ? parts[0]! : mergeGeometries(parts, false)
    if (parts.length > 1) for (const p of parts) p.dispose()
    if (!merged || !merged.index) return
    let at = 0
    for (const s of used) {
      s.start = at
      at += s.count
    }
    merged.index.setUsage(THREE.DynamicDrawUsage)
    merged.computeBoundingSphere()
    this.original = (merged.index.array as Uint16Array | Uint32Array).slice()
    const mesh = new THREE.Mesh(merged, this.material)
    // Already in world space; it never moves as an object.
    mesh.matrixAutoUpdate = false
    mesh.name = 'static-batch'
    this.scene.add(mesh)
    this.mesh = mesh
    for (const s of used) {
      s.shown = shownOf(s.placer)
      if (s.shown) s.onRebuilt()
      else this.setRange(s, 0, s.count, false)
    }
  }

  /** Follow each slot's placer being hidden or shown. */
  syncShown(): void {
    const slots = this.slots
    for (let i = 0; i < slots.length; i++) this.syncOne(slots[i]!)
  }

  /** Follow one slot's placer being hidden or shown. */
  syncOne(s: BatchSlot): void {
    const shown = shownOf(s.placer)
    if (shown === s.shown) return
    s.shown = shown
    this.setRange(s, 0, s.count, s.shown)
    // Shown again whole: what the owner has lost goes again.
    if (s.shown) s.onRebuilt()
  }

  setRange(slot: BatchSlot, start: number, count: number, visible: boolean): void {
    const index = this.mesh?.geometry.index
    if (!index || !this.original || slot.start < 0 || count <= 0) return
    const a = slot.start + start
    const arr = index.array as Uint16Array | Uint32Array
    if (visible) arr.set(this.original.subarray(a, a + count), a)
    // Every index of the run pointing at one vertex: zero-area triangles, which the GPU discards unshaded.
    else arr.fill(arr[a] ?? 0, a, a + count)
    index.addUpdateRange(a, count)
    index.needsUpdate = true
  }
}

export class StaticBatches {
  private readonly batches = new Map<THREE.Material, MaterialBatch>()
  private readonly batchList: MaterialBatch[] = []

  constructor(private readonly scene: THREE.Scene) {}

  /** Add a prop's geometry for one material. Returns the slot to collapse its pieces through and to remove it by. */
  add(material: THREE.Material, geometry: THREE.BufferGeometry, placer: THREE.Object3D, onRebuilt: () => void): BatchSlot {
    // A level surface's material (render/materials.ts) is drawn in the level's one material instead, every surface in
    // one batch: one draw for the props of the whole level, where it was one a surface (nine in the facility).
    const surface = surfaceOf(material)
    const key = surface ? getLevelMaterial() : material
    let b = this.batches.get(key)
    if (!b) {
      this.batches.set(key, (b = new MaterialBatch(key, this.scene)))
      this.batchList.push(b)
    }
    const slot = new BatchSlot(b, geometry, placer, onRebuilt, surface ? surfaceLayer(surface) : -1)
    b.slots.push(slot)
    b.dirty = true
    return slot
  }

  /**
   * Follow a slot's placer being hidden or shown now, not at the next update (which comes only every few frames on a
   * machine that is behind): for an owner handing its drawing to the batch or back on a given frame.
   */
  syncNow(slot: BatchSlot): void {
    slot.batch.syncOne(slot)
  }

  remove(slot: BatchSlot): void {
    const b = slot.batch
    const i = b.slots.indexOf(slot)
    if (i < 0) return
    b.slots.splice(i, 1)
    slot.geometry.dispose()
    b.dirty = true
  }

  /**
   * Once a frame: rebuild any batch that changed or whose props moved, and draw or collapse any prop that was shown or
   * hidden. The move check compares sixteen numbers per prop, so it is close to free; a rebuild happens only when
   * something really changed, and hiding a prop only rewrites its run of the index buffer.
   */
  update(watchMoves = true): void {
    // (Indexed and over a kept list: iterating a Map and its slots with for…of was garbage every frame on a slow machine.)
    const list = this.batchList
    for (let i = 0; i < list.length; i++) {
      const b = list[i]!
      if (!b.dirty && watchMoves) {
        for (let j = 0; j < b.slots.length; j++) {
          const s = b.slots[j]!
          // Its own matrix only (and its parents'): updateMatrixWorld(true) worked out everything under it too — a rack's
          // suit, every bone — for each prop, every check: a spike every half second.
          s.placer.updateWorldMatrix(true, false)
          if (!s.placer.matrixWorld.equals(s.placedAt)) {
            b.dirty = true
            break
          }
        }
      }
      if (b.dirty) b.rebuild()
      else b.syncShown()
    }
  }

  /** Frames since the props' matrices were last checked for a move. */
  private sinceChecked = 0

  /**
   * One frame: rebuild what changed, and show or hide what has been hidden or shown. Whether a prop has been MOVED is
   * checked every frame only when asked (`watchMoves`: while building, when props are dragged about); in play the
   * props are where they were put, and a check of every prop's matrix a frame was a few per cent of a slow frame — so
   * it is made twice a second.
   */
  tick(watchMoves: boolean): void {
    this.sinceChecked++
    const check = watchMoves || this.sinceChecked >= 30
    if (check) this.sinceChecked = 0
    this.update(check)
  }

  /** Draw calls the batches cost, and the props in them. For tests and tools. */
  stats(): { batches: number; slots: number } {
    let batches = 0
    let slots = 0
    for (const b of this.batches.values()) {
      if (b.mesh) batches++
      slots += b.slots.length
    }
    return { batches, slots }
  }

  clear(): void {
    for (const b of this.batches.values()) {
      for (const s of b.slots) s.geometry.dispose()
      b.slots.length = 0
      b.rebuild()
    }
  }
}
