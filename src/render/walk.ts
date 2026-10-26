/**
 * Working out the world matrices of what is about to be drawn.
 */

import * as THREE from 'three'

const baseWalk = THREE.Object3D.prototype.updateMatrixWorld

/**
 * three.js's updateMatrixWorld, but a part hidden inside a shown object (a stand's weapon out of range, a rifleman's
 * model while he is drawn with the crowd, a spare pooled model) gets its own transform only, as a hidden object at the
 * top does (walkedScene) — not its every part. Kept walked whole: bones (a skinned mesh shown elsewhere is drawn from
 * them) and what is under a LOD (it picks the level to show after this walk). Anything with its own updateMatrixWorld
 * (a skinned mesh, a rifleman's held skeleton) is left to it.
 */
export function walkShown(o: THREE.Object3D, force = false): void {
  if (o.updateMatrixWorld !== baseWalk) {
    o.updateMatrixWorld(force)
    return
  }
  if (o.matrixAutoUpdate) o.updateMatrix()
  if (o.matrixWorldNeedsUpdate || force) {
    if (o.matrixWorldAutoUpdate) {
      if (o.parent === null) o.matrixWorld.copy(o.matrix)
      else o.matrixWorld.multiplyMatrices(o.parent.matrixWorld, o.matrix)
    }
    o.matrixWorldNeedsUpdate = false
    force = true
  }
  const kids = o.children
  const lod = (o as THREE.LOD).isLOD
  for (let i = 0; i < kids.length; i++) {
    const c = kids[i]!
    if (c.visible || lod || (c as THREE.Bone).isBone) {
      walkShown(c, force)
      continue
    }
    // Its own transform, and marked still to work out, so that shown again it brings everything under it with it.
    if (c.matrixAutoUpdate) c.updateMatrix()
    if (c.matrixWorldAutoUpdate && (force || c.matrixWorldNeedsUpdate)) c.matrixWorld.multiplyMatrices(o.matrixWorld, c.matrix)
    c.matrixWorldNeedsUpdate = true
  }
}
