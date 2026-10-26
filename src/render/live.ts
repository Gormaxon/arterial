/**
 * The things that move on their own: moving platforms, doors, the defences' working parts, particles, tracers,
 * dropped guns, a stand's turning display. Frame generation (render/framegen.ts) leaves them out of the frames it
 * reprojects and draws them fresh on every frame instead, so a platform glides at the full frame rate rather than
 * stepping at the rate the world is really drawn — at 6x that was ten steps a second.
 *
 * Each registers its root object here when it is made and takes it back when it goes. With frame generation off this
 * changes nothing: everything is drawn together as always.
 */

import type * as THREE from 'three'

/** The layer live objects are also put on for frame generation's fresh pass. Layer 0 is kept, so raycasts still find them. */
export const LIVE_LAYER = 3

export const liveRoots = new Set<THREE.Object3D>()

/**
 * Frame generation is on (FrameGen.setEnabled): live objects are drawn fresh on every frame and everything else only on
 * the real ones. What hands its drawing over to the still scenery when it comes to rest (a door's leaves: door.ts)
 * does not while this is so — the handover would show for the frames made between two real ones.
 */
export const liveDrawing = { generated: false }

export function addLive(obj: THREE.Object3D): void {
  liveRoots.add(obj)
}

export function removeLive(obj: THREE.Object3D): void {
  liveRoots.delete(obj)
}
