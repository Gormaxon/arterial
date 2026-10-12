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
 */

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export class BatchSlot {
  /** Where this slot's indices start in its batch's index buffer, after the last rebuild. -1 before the first. */
  start = -1
  /** Index count of the slot's own geometry. */
  readonly count: number
  /** The placing object's matrix when the batch was last built: a change means it moved. */
  readonly placedAt = new THREE.Matrix4()

  constructor(
    readonly batch: MaterialBatch,
    /** Indexed geometry in the owner's space. Owned by the slot from here on (disposed on removal). */
    readonly geometry: THREE.BufferGeometry,
    /** What places it in the world (its matrixWorld is used). */
    readonly placer: THREE.Object3D,
    /** Called after every rebuild of its batch, to collapse again whatever the owner has hidden. */
    readonly onRebuilt: () => void,
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
      s.placer.updateMatrixWorld(true)
      s.placedAt.copy(s.placer.matrixWorld)
      const g = s.geometry.clone().applyMatrix4(s.placer.matrixWorld)
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
    for (const s of used) s.onRebuilt()
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

  constructor(private readonly scene: THREE.Scene) {}

  /** Add a prop's geometry for one material. Returns the slot to collapse its pieces through and to remove it by. */
  add(material: THREE.Material, geometry: THREE.BufferGeometry, placer: THREE.Object3D, onRebuilt: () => void): BatchSlot {
    let b = this.batches.get(material)
    if (!b) this.batches.set(material, (b = new MaterialBatch(material, this.scene)))
    const slot = new BatchSlot(b, geometry, placer, onRebuilt)
    b.slots.push(slot)
    b.dirty = true
    return slot
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
   * Once a frame: rebuild any batch that changed or whose props moved. The move check compares sixteen numbers per
   * prop, so it is close to free; a rebuild happens only when something really changed.
   */
  update(): void {
    for (const b of this.batches.values()) {
      if (!b.dirty) {
        for (const s of b.slots) {
          s.placer.updateMatrixWorld(true)
          if (!s.placer.matrixWorld.equals(s.placedAt)) {
            b.dirty = true
            break
          }
        }
      }
      if (b.dirty) b.rebuild()
    }
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
