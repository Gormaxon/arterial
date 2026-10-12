/**
 * Procedural sky, drawn as an equirectangular canvas and used as the scene
 * background.
 *
 * A dark vault with a furnace glow low on one side: it reads as "somewhere very bad,
 * underground-ish" without lifting the ambient level enough to flatten the white
 * architecture the whole art direction depends on.
 */

import * as THREE from 'three'
import { fbm, takeBakedSky } from './textures'

const W = 1024
const H = 512

function clamp255(n: number): number {
  return n < 0 ? 0 : n > 255 ? 255 : n
}

export function buildSkyTexture(): THREE.Texture | null {
  // The baked picture, if the loader fetched it: painting this is ~3.7 million noise
  // evaluations, most of a second on a fast laptop and many times that on a Chromebook.
  const baked = takeBakedSky()
  if (baked) {
    baked.mapping = THREE.EquirectangularReflectionMapping
    baked.colorSpace = THREE.SRGBColorSpace
    return baked
  }
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')
  if (!ctx) return null

  const img = ctx.createImageData(W, H)

  // The glow sits at u = 0.62, just above the horizon.
  const GLOW_U = 0.62
  const GLOW_V = 0.54

  for (let y = 0; y < H; y++) {
    const v = y / H // 0 = zenith, 1 = nadir
    for (let x = 0; x < W; x++) {
      const u = x / W

      // Base vertical gradient: near-black overhead, warmer toward the horizon,
      // then dark again below it.
      const horizon = 1 - Math.abs(v - 0.5) * 2
      const up = Math.max(0, 1 - v * 2)
      let r = 10 + horizon * horizon * 46
      let g = 10 + horizon * horizon * 16
      let b = 14 + up * 20 + horizon * horizon * 14

      // Furnace glow, wrapped in u so it does not seam.
      let du = Math.abs(u - GLOW_U)
      if (du > 0.5) du = 1 - du
      const dv = v - GLOW_V
      const glow = Math.exp(-(du * du) / 0.012 - (dv * dv) / 0.004)
      r += glow * 210
      g += glow * 74
      b += glow * 28

      // Cloud banding. Stretched in u so the bands run horizontally, and faded out
      // at the poles where an equirect projection pinches.
      const poleFade = Math.sin(v * Math.PI)
      const cloud = fbm(x * 0.55, y * 2.1, 5, 64, 91)
      const band = Math.max(0, cloud - 0.48) * 2.1 * poleFade
      const lit = 0.25 + glow * 1.5
      r += band * 70 * lit
      g += band * 40 * lit
      b += band * 44 * lit

      // Faint grit so large flat areas do not band on 8-bit displays.
      const grit = (fbm(x, y, 2, 128, 7) - 0.5) * 7

      const i = (y * W + x) * 4
      img.data[i] = clamp255(r + grit)
      img.data[i + 1] = clamp255(g + grit)
      img.data[i + 2] = clamp255(b + grit)
      img.data[i + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)

  const tex = new THREE.CanvasTexture(c)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * Install the sky: a box round the camera that looks the picture up by direction, as a scene background would.
 *
 * Not `scene.background`, because three draws a background FIRST, over the whole screen, and then draws the level
 * over most of it: on integrated graphics that full-screen pass was a frame's worth of pixels spent on sky that
 * is mostly hidden. The box is pushed to the far plane and drawn after everything solid, so the depth test lets
 * it touch only the pixels where the sky actually shows. Returns the box (hidden where a level sets a flat colour).
 */
export function applySky(scene: THREE.Scene): THREE.Mesh | null {
  const tex = buildSkyTexture()
  if (!tex) return null
  // Mipmaps would blur a seam where the direction's angle wraps round; the picture is soft enough without them.
  tex.generateMipmaps = false
  tex.minFilter = THREE.LinearFilter
  tex.mapping = THREE.UVMapping
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false, fog: false })
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('void main() {', 'varying vec3 vSkyDir;\nvoid main() {\n\tvSkyDir = position;')
      // Onto the far plane, so anything solid in front of it wins the depth test.
      .replace('#include <project_vertex>', '#include <project_vertex>\n\tgl_Position.z = gl_Position.w;')
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', 'varying vec3 vSkyDir;\nvoid main() {')
      .replace('#include <map_fragment>', 'vec4 sampledDiffuseColor = texture2D( map, equirectUv( normalize( vSkyDir ) ) );\ndiffuseColor *= sampledDiffuseColor;')
  }
  const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), mat)
  box.name = 'sky'
  box.frustumCulled = false
  box.matrixAutoUpdate = false
  box.raycast = () => {}
  // After every solid thing, so the depth test can skip what they cover.
  box.renderOrder = 1_000_000
  box.onBeforeRender = (_r, _s, camera) => {
    box.matrixWorld.makeTranslation(camera.matrixWorld.elements[12]!, camera.matrixWorld.elements[13]!, camera.matrixWorld.elements[14]!)
    box.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, box.matrixWorld)
  }
  scene.background = null
  scene.add(box)
  return box
}
