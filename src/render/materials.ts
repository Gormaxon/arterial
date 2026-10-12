/**
 * Shared material registry, keyed by surface.
 *
 * One material per surface means the whole level bakes down to ~9 draw calls no
 * matter how many objects it contains.
 *
 * UVs are generated per-box in world scale (see prefabs/geometry.ts), so a 2 m wall
 * and a 16 m floor show the same texel density instead of stretching.
 */

import * as THREE from 'three'
import { surfaceMaps, type SurfaceKey } from './textures'

export type { SurfaceKey }

export interface Look {
  color: number
  shininess: number
  specular: number
  emissive?: number
  emissiveIntensity?: number
}

/**
 * Per-surface shading.
 *
 * Everything here is deliberately MATTE. Phong's specular is a mirror highlight, and
 * with the arena's high-key albedo a shiny wall goes to near-white wherever a light
 * faces it — every surface picked up the same hot sheen, the normal-map detail washed
 * out inside it, and the whole level read as wet plastic. Concrete, painted panel and
 * grating are none of them glossy in life.
 *
 * Specular colours are kept very dark and shininess low, so the highlight is a broad,
 * faint sheen rather than a tight bright spot. Brushed metal keeps the most of it,
 * because a total matte reads as cardboard, but it is a fraction of what it was.
 */
export const SURFACE_LOOKS: Record<SurfaceKey, Look> = {
  concrete: { color: 0xffffff, shininess: 2, specular: 0x070707 },
  panel: { color: 0xffffff, shininess: 8, specular: 0x121214 },
  metal: { color: 0xffffff, shininess: 22, specular: 0x24262b },
  grate: { color: 0xffffff, shininess: 14, specular: 0x17191d },
  hazard: { color: 0xffffff, shininess: 6, specular: 0x0e0e0a },
  lava: { color: 0xffffff, shininess: 2, specular: 0x000000, emissive: 0xff8a2c, emissiveIntensity: 2.1 },
  accent: { color: 0xffffff, shininess: 7, specular: 0x120709 },
  dark: { color: 0xffffff, shininess: 11, specular: 0x0e0e11 },
  tile: { color: 0xffffff, shininess: 18, specular: 0x1a1a1e },
  /**
   * Launch-pad light. Cold cyan ON PURPOSE.
   *
   * Everything hot in this game kills you — lava is orange, hazard trim is amber.
   * A pad is the one bright thing you are meant to run at, so it gets the opposite
   * end of the spectrum. Against grey concrete and warm hazard stripes it is the
   * only cool light in the arena, which is what makes it findable at a distance.
   */
  padglow: { color: 0xffffff, shininess: 2, specular: 0x000000, emissive: 0x3ceaff, emissiveIntensity: 2.6 },
}


const cache = new Map<SurfaceKey, THREE.Material>()

export function getMaterial(key: SurfaceKey): THREE.Material {
  const hit = cache.get(key)
  if (hit) return hit

  const look = SURFACE_LOOKS[key]
  const maps = surfaceMaps(key)

  const mat = new THREE.MeshPhongMaterial({
    color: look.color,
    shininess: look.shininess,
    specular: look.specular,
    vertexColors: false,
  })
  if (maps.map) mat.map = maps.map
  if (maps.normalMap) {
    mat.normalMap = maps.normalMap
    mat.normalScale.set(0.85, 0.85)
  }
  if (look.emissive !== undefined) {
    mat.emissive = new THREE.Color(look.emissive)
    mat.emissiveIntensity = look.emissiveIntensity ?? 1
    if (maps.map) mat.emissiveMap = maps.map
  }

  cache.set(key, mat)
  return mat
}

/**
 * Creep the lava texture so the melt looks like it is moving.
 *
 * Offsetting the shared texture is the whole trick: every lava surface in the level
 * draws from one material, so one `offset` nudge per frame animates all of them for
 * no per-object cost and no custom shader. The colour map and the normal map are
 * driven together, so the crust plates drift with their own relief rather than
 * sliding out from under it.
 *
 * The drift is diagonal and slow — a pool that visibly scrolls reads as a conveyor
 * belt. The brightness pulse is what sells "molten"; the movement only has to stop
 * it looking painted on.
 */
export function animateSurfaces(elapsed: number): void {
  const mat = cache.get('lava') as THREE.MeshPhongMaterial | undefined
  if (!mat) return

  const u = elapsed * 0.013
  const v = elapsed * 0.021
  if (mat.map) mat.map.offset.set(u, v)
  if (mat.normalMap) mat.normalMap.offset.set(u, v)
  // Two detuned waves, so the glow never settles into an obvious loop.
  const pulse = Math.sin(elapsed * 1.1) * 0.5 + Math.sin(elapsed * 0.37) * 0.3
  mat.emissiveIntensity = 2.1 + pulse * 0.42

  // The pad breathes on its own rhythm — faster and shallower than lava, so the two
  // never drift into sync and read as the same material.
  const pad = cache.get('padglow') as THREE.MeshPhongMaterial | undefined
  if (pad) pad.emissiveIntensity = 2.6 + Math.sin(elapsed * 2.6) * 0.55
}

/** Texture repeats per world unit — geometry builders use this to lay out UVs. */
export function surfaceScale(key: SurfaceKey): number {
  return surfaceMaps(key).scale
}

export function disposeMaterials(): void {
  for (const m of cache.values()) m.dispose()
  cache.clear()
}
