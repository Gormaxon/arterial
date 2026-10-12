/**
 * What the level's surfaces are made of, for what happens when something meets one: the sound a boot, a fist or a
 * round makes on it, and how readily a round skips off it.
 *
 * The level is drawn in ten surfaces (render/textures.ts), but physically they are four things: stone (concrete,
 * floor tile), solid steel (plate, sheet panels, the dark cast metal, painted and striped steel, the glowing pads),
 * steel grating, and lava.
 */

import type { SurfaceKey } from '../render/textures'

export type SurfaceClass = 'stone' | 'metal' | 'grate' | 'lava'

export const SURFACE_CLASS: Record<SurfaceKey, SurfaceClass> = {
  concrete: 'stone',
  tile: 'stone',
  metal: 'metal',
  panel: 'metal',
  dark: 'metal',
  hazard: 'metal',
  accent: 'metal',
  padglow: 'metal',
  grate: 'grate',
  lava: 'lava',
}

/** The class of a surface, or stone when it is not known. */
export function surfaceClass(s: SurfaceKey | null | undefined): SurfaceClass {
  return (s && SURFACE_CLASS[s]) || 'stone'
}

/**
 * When a round may skip off each. Only at a graze: below `critical` degrees off the surface it might, with `chance`
 * at a dead graze falling to none at the critical angle. Even then most rounds do not — they flatten, break up and
 * stay. Hard steel plate turns a round most readily; concrete mostly breaks it up and keeps it; grating catches it
 * between the bars; lava takes it.
 */
export const RICOCHET: Record<SurfaceClass, { critical: number; chance: number }> = {
  metal: { critical: 14, chance: 0.55 },
  stone: { critical: 9, chance: 0.3 },
  grate: { critical: 6, chance: 0.15 },
  lava: { critical: 0, chance: 0 },
}
