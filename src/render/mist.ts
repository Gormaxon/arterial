/**
 * A level's mist (LevelFile.mist): the FOB's (the user, 2026-11-13: "the sky is completely fogged out"). A thick fog that
 * swallows what is far and IS the sky: everything is mixed toward one colour by distance, after its own colour is
 * worked out and put in the screen's terms — the rooms in Nikolai's shader (render/rt/bake/tier.ts), three's lit things
 * (misted; the flight's own mist too, ui/flight.ts), and the sky, mist all over — so a wall going into it and the sky behind it end on the very same colour.
 *
 * One vector for all of it: the colour as the screen shows it (sRGB) and the density (per metre; 0 is no mist: every
 * level but the FOB, whose pictures are then exactly as they were).
 */

import * as THREE from 'three'

/** xyz: the mist's colour as shown (sRGB, 0..1); w: its density per metre. Shared, by reference, as a uniform's value. */
export const MIST = new THREE.Vector4(0, 0, 0, 0)
export const mistUniform = { value: MIST }

/** Seconds, for the mist's billows on the sky (main.ts moves it on each frame). */
export const mistTime = { value: 0 }

/** Value noise and its sum over four octaves, for the mist's billows (the sky here; the flight's fog, ui/flightworld.ts). */
export const MIST_NOISE_GLSL = /* glsl */ `
float mistHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float mistNoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(mistHash(i), mistHash(i + vec3(1.0, 0.0, 0.0)), f.x), mix(mistHash(i + vec3(0.0, 1.0, 0.0)), mistHash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(mistHash(i + vec3(0.0, 0.0, 1.0)), mistHash(i + vec3(1.0, 0.0, 1.0)), f.x), mix(mistHash(i + vec3(0.0, 1.0, 1.0)), mistHash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
float mistFbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * mistNoise(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
  return s;
}
`

/** As a level sets it: its colour (0xRRGGBB as shown) and density, or nothing. */
export interface MistSetting {
  color: number
  density: number
}

/** The mist the level loaded asks for (none: off). */
export function setMist(m: MistSetting | null | undefined): void {
  if (!m || !(m.density > 0)) {
    MIST.set(0, 0, 0, 0)
    return
  }
  MIST.set(((m.color >> 16) & 255) / 255, ((m.color >> 8) & 255) / 255, (m.color & 255) / 255, m.density)
}

/** How much of the mist is in front of something `d` metres off: squared, so the near stays clear and the far goes all at once. */
export const MIST_GLSL = /* glsl */ `
float mistAmount(float d, float density) { float k = d * density; return 1.0 - exp(-k * k); }
`

/**
 * One of three's lit (or unlit) materials, with the mist mixed in last (three's own fog step, which the baked tier
 * empties: it is where three mixes its fog, after the colour is in the screen's terms). Its other compile hooks kept.
 */
export function misted<T extends THREE.Material>(mat: T, uniform: { value: THREE.Vector4 } = mistUniform): T {
  const before = mat.onBeforeCompile.bind(mat)
  mat.onBeforeCompile = (shader, renderer) => {
    before(shader, renderer)
    shader.uniforms.uMist = uniform
    shader.vertexShader = shader.vertexShader
      .replace('void main() {', 'varying vec3 vMistW;\nvoid main() {')
      .replace('#include <project_vertex>', '#include <project_vertex>\n\tvMistW = (modelMatrix * vec4(transformed, 1.0)).xyz;')
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', `uniform vec4 uMist;\nvarying vec3 vMistW;\n${MIST_GLSL}\nvoid main() {`)
      .replace('#include <fog_fragment>', '#include <fog_fragment>\n\tif (uMist.w > 0.0) gl_FragColor.rgb = mix(gl_FragColor.rgb, uMist.rgb, mistAmount(distance(vMistW, cameraPosition), uMist.w));')
  }
  // Its own program: not shared with the same material unmisted.
  const key = mat.customProgramCacheKey.bind(mat)
  mat.customProgramCacheKey = () => key() + '|mist'
  return mat
}
