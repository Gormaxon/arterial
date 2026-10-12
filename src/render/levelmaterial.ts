/**
 * One material for all of the level's static surfaces.
 *
 * Drawing is paid for per material per mesh, and a level has about ten surfaces, so a cell used to cost ten
 * draws and a big level hundreds. Here every surface is a LAYER of two texture arrays (colour and normal)
 * and each vertex carries the layer it uses, so a whole cell is one draw (two with its detail layer). The
 * shading is the same MeshPhong shader the per-surface materials use, with just the lookups patched:
 * colour and normal come from the array at the vertex's layer; shininess, specular colour and emissive come
 * from small per-layer tables; the lava's slow drift and the glow pulses are per-layer uniforms instead of
 * texture offsets and material intensities. The per-surface materials (materials.ts) stay for everything
 * that is not baked static geometry, and `tools/matparity.mjs` renders both side by side to prove they agree.
 */

import * as THREE from 'three'
import { SURFACE_KEYS, surfaceMaps, type SurfaceKey } from './textures'
import { SURFACE_LOOKS } from './materials'

/** A surface's layer in the arrays: its place in the surface list. */
export function surfaceLayer(key: SurfaceKey): number {
  return SURFACE_KEYS.indexOf(key)
}

const LAYERS = SURFACE_KEYS.length

interface Uniforms {
  uMapArray: THREE.IUniform<THREE.Texture | null>
  uNormalArray: THREE.IUniform<THREE.Texture | null>
  uSpecular: THREE.IUniform<THREE.Color[]>
  uShininess: THREE.IUniform<number[]>
  uEmissive: THREE.IUniform<THREE.Color[]>
  uOffset: THREE.IUniform<THREE.Vector2[]>
  /** Each layer's average colour, linear: the point its texture's contrast is stretched about. */
  uMean: THREE.IUniform<THREE.Color[]>
}

let material: THREE.MeshPhongMaterial | null = null
const uniforms: Uniforms = {
  uMapArray: { value: null },
  uNormalArray: { value: null },
  uSpecular: { value: Array.from({ length: LAYERS }, () => new THREE.Color(0, 0, 0)) },
  uShininess: { value: Array.from({ length: LAYERS }, () => 30) },
  uEmissive: { value: Array.from({ length: LAYERS }, () => new THREE.Color(0, 0, 0)) },
  uOffset: { value: Array.from({ length: LAYERS }, () => new THREE.Vector2(0, 0)) },
  uMean: { value: Array.from({ length: LAYERS }, () => new THREE.Color(0.5, 0.5, 0.5)) },
}

/**
 * The variety on top of the textures, kept moderate on purpose: a texture's light and dark are stretched 15% further
 * apart about its own average (so its overall shade does not move), and each placed piece is up to 9% lighter or
 * darker than the next and carries one of a few muted colour casts (its tone, written by the bake from where it
 * stands), so neighbouring walls read as different walls rather than one grey mass.
 */
const TEX_CONTRAST = 1.15
const SHADE_RANGE = 0.18
/**
 * The casts, as multipliers of about equal brightness: cool slate, warm sand, sage, plain, dusty rose, steel teal.
 * Roughly a tenth off grey: enough to tell two walls apart, not enough to read as painted.
 */
const TINTS: [number, number, number][] = [
  [0.89, 0.98, 1.14],
  [1.11, 1.0, 0.85],
  [0.94, 1.07, 0.93],
  [1.0, 1.0, 1.0],
  [1.1, 0.95, 0.95],
  [0.9, 1.04, 1.07],
]
/**
 * How much of the cast each surface takes. Only the neutral greys: hazard stripes, lava, the red accent and the
 * pad glow have colours that mean something, and a tint would only muddy them.
 */
const TINT_AMOUNT: Partial<Record<SurfaceKey, number>> = { concrete: 1, panel: 1, metal: 0.8, tile: 0.8, dark: 0.7, grate: 0.6 }
let ownedTextures: THREE.Texture[] = []

/** The image of a texture as RGBA bytes at `size`, with rows in the order the GPU would have stored them. */
function pixelsOf(tex: THREE.Texture | null, size: number, fill: number[]): Uint8Array {
  const out = new Uint8Array(size * size * 4)
  const image = tex?.image as CanvasImageSource | undefined
  if (!tex || !image || typeof document === 'undefined') {
    for (let i = 0; i < out.length; i += 4) {
      out[i] = fill[0]!
      out[i + 1] = fill[1]!
      out[i + 2] = fill[2]!
      out[i + 3] = 255
    }
    return out
  }
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(image, 0, 0, size, size)
  const data = ctx.getImageData(0, 0, size, size).data
  // A texture with flipY set is uploaded upside down, and the array is not, so its rows are put that way here.
  if (tex.flipY) {
    const row = size * 4
    for (let y = 0; y < size; y++) out.set(data.subarray((size - 1 - y) * row, (size - y) * row), y * row)
  } else {
    out.set(data)
  }
  return out
}

function makeArray(pick: (key: SurfaceKey) => THREE.Texture | null, fill: number[], srgb: boolean): THREE.DataArrayTexture {
  let size = 0
  for (const key of SURFACE_KEYS) {
    const img = pick(key)?.image as { width?: number } | undefined
    if (img?.width) size = Math.max(size, img.width)
  }
  if (size === 0) size = 4
  const layer = size * size * 4
  const data = new Uint8Array(layer * LAYERS)
  SURFACE_KEYS.forEach((key, i) => data.set(pixelsOf(pick(key), size, fill), i * layer))
  const t = new THREE.DataArrayTexture(data, size, size, LAYERS)
  t.format = THREE.RGBAFormat
  t.type = THREE.UnsignedByteType
  t.wrapS = THREE.RepeatWrapping
  t.wrapT = THREE.RepeatWrapping
  t.magFilter = THREE.LinearFilter
  t.minFilter = THREE.LinearMipmapLinearFilter
  t.generateMipmaps = true
  t.anisotropy = 2
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
  t.needsUpdate = true
  return t
}

/** Fill the per-layer tables from the same looks the per-surface materials use. */
function fillTables(): void {
  SURFACE_KEYS.forEach((key, i) => {
    const look = SURFACE_LOOKS[key]
    uniforms.uSpecular.value[i]!.set(look.specular)
    uniforms.uShininess.value[i] = look.shininess
    if (look.emissive !== undefined) uniforms.uEmissive.value[i]!.set(look.emissive).multiplyScalar(look.emissiveIntensity ?? 1)
    else uniforms.uEmissive.value[i]!.set(0x000000)
  })
}

/** (Re)build the texture arrays from the surfaces' current textures. Call again if they are ever replaced. */
export function rebuildLevelTextures(): void {
  for (const t of ownedTextures) t.dispose()
  const color = makeArray((k) => surfaceMaps(k).map, [200, 200, 200], true)
  const normal = makeArray((k) => surfaceMaps(k).normalMap, [128, 128, 255], false)
  ownedTextures = [color, normal]
  // Each layer's average, in linear light as the shader sees it.
  const data = color.image.data as Uint8Array
  const per = color.image.width * color.image.height
  const lin = (b: number): number => {
    const c = b / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const step = Math.max(1, Math.floor(per / 4096))
  for (let l = 0; l < LAYERS; l++) {
    let r = 0, g = 0, b = 0, n = 0
    for (let i = 0; i < per; i += step, n++) {
      const o = (l * per + i) * 4
      r += lin(data[o]!)
      g += lin(data[o + 1]!)
      b += lin(data[o + 2]!)
    }
    uniforms.uMean.value[l]!.setRGB(r / n, g / n, b / n)
  }
  uniforms.uMapArray.value = color
  uniforms.uNormalArray.value = normal
}

function patch(shader: { uniforms: Record<string, THREE.IUniform>; vertexShader: string; fragmentShader: string }): void {
  Object.assign(shader.uniforms, uniforms)
  const chunk = THREE.ShaderChunk

  shader.vertexShader = shader.vertexShader
    .replace('void main() {', `attribute vec4 aSurface;
flat varying float vLayer;
flat varying vec2 vTone;
varying vec3 vPointDiffuse;
#if NUM_POINT_LIGHTS > 0
struct PointLight { vec3 position; vec3 color; float distance; float decay; };
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
#endif
void main() {
\tvLayer = aSurface.x;
\tvTone = aSurface.yz / 255.0;`)
    .replace('#include <project_vertex>', `#include <project_vertex>
\tvPointDiffuse = vec3( 0.0 );
#if NUM_POINT_LIGHTS > 0
\t{
\t\tvec3 pn = normalize( transformedNormal );
\t\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
\t\t\tvec3 L = pointLights[ i ].position - mvPosition.xyz;
\t\t\tfloat d = length( L );
\t\t\tfloat fall = 1.0 / max( pow( d, pointLights[ i ].decay ), 0.01 );
\t\t\tif ( pointLights[ i ].distance > 0.0 ) fall *= pow2( saturate( 1.0 - pow4( d / pointLights[ i ].distance ) ) );
\t\t\tvPointDiffuse += pointLights[ i ].color * fall * saturate( dot( pn, L / d ) );
\t\t}
\t}
#endif`)

  const tables = `
uniform highp sampler2DArray uMapArray;
uniform highp sampler2DArray uNormalArray;
uniform vec3 uSpecular[ ${LAYERS} ];
uniform float uShininess[ ${LAYERS} ];
uniform vec3 uEmissive[ ${LAYERS} ];
uniform vec2 uOffset[ ${LAYERS} ];
uniform vec3 uMean[ ${LAYERS} ];
const vec3 uTints[ ${TINTS.length} ] = vec3[]( ${TINTS.map((t) => `vec3( ${t.map((v) => v.toFixed(3)).join(', ')} )`).join(', ')} );
const float uTintAmount[ ${LAYERS} ] = float[]( ${SURFACE_KEYS.map((k) => (TINT_AMOUNT[k] ?? 0).toFixed(2)).join(', ')} );
flat varying float vLayer;
flat varying vec2 vTone;
varying vec3 vPointDiffuse;
`
  const normalMaps = chunk.normal_fragment_maps.replace(/texture2D\( normalMap, vNormalMapUv \)/g, 'texture( uNormalArray, vec3( vNormalMapUv + uOffset[ li ], vLayer ) )')
  const phong = chunk.lights_phong_fragment.replace('= specular;', '= uSpecular[ li ];').replace('= shininess;', '= uShininess[ li ];')
  // Highlights from the main light only. Every light's specular term (a normalised half vector, a power, a Fresnel
  // term) is computed per pixel, and on a Chromebook's graphics it was a sixth of the whole frame across five lights.
  // The surfaces' specular is faint, and only the main light's highlight is one you can pick out: the fill light and
  // the point lights add only their diffuse light, which is all they visibly add.
  const diffuseOnly = `
void RE_Direct_Diffuse( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	reflectedLight.directDiffuse += dotNL * directLight.color * BRDF_Lambert( material.diffuseColor );
}
`
  const phongPars = chunk.lights_phong_pars_fragment.replace('#define RE_Direct', diffuseOnly + '#define RE_Direct')
  let lights = chunk.lights_fragment_begin
  // Point lights: diffuse only, and worked out at the vertices rather than for every pixel. The level's point lights are
  // broad washes of colour from tens of metres away, which hardly change across a surface; per vertex they look the same
  // and cost a fraction (only the surface relief no longer catches their colour).
  const pointStart = lights.indexOf('#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )')
  const pointEnd = lights.indexOf('#endif', lights.indexOf('#pragma unroll_loop_end', pointStart)) + '#endif'.length
  if (pointStart >= 0 && pointEnd > pointStart) {
    lights = lights.slice(0, pointStart) + '#if ( NUM_POINT_LIGHTS > 0 )\n\treflectedLight.directDiffuse += vPointDiffuse * BRDF_Lambert( material.diffuseColor );\n#endif' + lights.slice(pointEnd)
  }
  // Directional lights: the first (the level's key light) keeps its highlight, the rest are diffuse.
  const dirAt = lights.indexOf('getDirectionalLightInfo( directionalLight, directLight );')
  const dirShade = lights.indexOf('RE_Direct( directLight', dirAt)
  if (dirAt >= 0 && dirShade >= 0) {
    const end = lights.indexOf(';', dirShade) + 1
    const call = lights.slice(dirShade, end)
    lights = lights.slice(0, dirShade) + `if ( UNROLLED_LOOP_INDEX == 0 ) { ${call} } else { ${call.replace('RE_Direct(', 'RE_Direct_Diffuse(')} }` + lights.slice(end)
  }
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', `#include <common>\n${tables}`)
    .replace(
      '#include <map_fragment>',
      `int li = int( vLayer + 0.5 );
vec4 sampledDiffuseColor = texture( uMapArray, vec3( vMapUv + uOffset[ li ], vLayer ) );
vec3 texel = max( uMean[ li ] + ( sampledDiffuseColor.rgb - uMean[ li ] ) * ${TEX_CONTRAST.toFixed(3)}, 0.0 );
float shade = 1.0 + ( vTone.x - 0.5 ) * ${SHADE_RANGE.toFixed(3)};
vec3 tint = mix( vec3( 1.0 ), uTints[ int( vTone.y * ${(TINTS.length - 0.001).toFixed(3)} ) ], uTintAmount[ li ] );
diffuseColor.rgb *= texel * shade * tint;
diffuseColor.a *= sampledDiffuseColor.a;`,
    )
    .replace('#include <normal_fragment_maps>', normalMaps)
    .replace('#include <emissivemap_fragment>', 'totalEmissiveRadiance = uEmissive[ li ] * sampledDiffuseColor.rgb;')
    .replace('#include <lights_phong_fragment>', phong)
    .replace('#include <lights_phong_pars_fragment>', phongPars)
    .replace('#include <lights_fragment_begin>', lights)
}

/** The one material every baked static cell is drawn with. */
export function getLevelMaterial(): THREE.MeshPhongMaterial {
  if (material) return material
  fillTables()
  rebuildLevelTextures()
  // Stand-in maps: they switch on the shader's colour and normal-map paths, which the patch then redirects.
  const stand = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1)
  stand.needsUpdate = true
  material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: stand, normalMap: stand })
  material.normalScale.set(0.85, 0.85)
  material.onBeforeCompile = patch
  material.customProgramCacheKey = () => 'level-surfaces-v6'
  return material
}

let depthMaterial: THREE.MeshBasicMaterial | null = null

/** Depth and nothing else, for laying down the level's nearest surfaces before it is shaded (StaticChunks.depthScene). */
export function getLevelDepthMaterial(): THREE.MeshBasicMaterial {
  if (depthMaterial) return depthMaterial
  depthMaterial = new THREE.MeshBasicMaterial({ colorWrite: false })
  // A hair behind the shaded pass, so the shaded surface always passes the depth test however the two programs round.
  depthMaterial.polygonOffset = true
  depthMaterial.polygonOffsetFactor = 1
  depthMaterial.polygonOffsetUnits = 1
  return depthMaterial
}

/**
 * Build the material and send its texture arrays to the GPU now, while a loading screen is up, instead of
 * on the first frame that draws a cell, which is when the upload would otherwise hold the game still.
 */
export function prepareLevelMaterial(renderer: THREE.WebGLRenderer): void {
  getLevelMaterial()
  if (uniforms.uMapArray.value) renderer.initTexture(uniforms.uMapArray.value)
  if (uniforms.uNormalArray.value) renderer.initTexture(uniforms.uNormalArray.value)
}

/** Drift the lava and pulse the glows, as `animateSurfaces` does for the per-surface materials. */
export function animateLevelMaterial(elapsed: number): void {
  const lava = surfaceLayer('lava')
  const pad = surfaceLayer('padglow')
  if (lava >= 0) {
    uniforms.uOffset.value[lava]!.set(elapsed * 0.013, elapsed * 0.021)
    const look = SURFACE_LOOKS.lava
    const pulse = Math.sin(elapsed * 1.1) * 0.5 + Math.sin(elapsed * 0.37) * 0.3
    uniforms.uEmissive.value[lava]!.set(look.emissive ?? 0).multiplyScalar(2.1 + pulse * 0.42)
  }
  if (pad >= 0) {
    const look = SURFACE_LOOKS.padglow
    uniforms.uEmissive.value[pad]!.set(look.emissive ?? 0).multiplyScalar(2.6 + Math.sin(elapsed * 2.6) * 0.55)
  }
}

export function disposeLevelMaterial(): void {
  for (const t of ownedTextures) t.dispose()
  ownedTextures = []
  material?.dispose()
  material = null
}
