/**
 * The world's lights sent to the graphics chip once per drawing of the world, in one uniform block every lit shader
 * reads, instead of by each shader for itself.
 *
 * three.js keeps the lights as uniforms of every lit program: each time a frame's drawing switches to a lit program, it
 * sends that program every light again — their places are in the camera's space, so they are new every frame — about
 * fifty uniform calls and a few hundred setter calls a frame in a fight, half of all three.js does setting uniforms, and
 * the difference between switching to a lit program and an unlit one. Here the shaders' light arrays are members of a
 * block (SgLights) instead, which three.js does not see as uniforms of theirs at all; the block is filled from three.js's
 * own light state (the same numbers it would have sent, worked out by it the same way) at the first draw of each
 * drawing of the world, after it has worked them out for that camera and before anything is drawn.
 *
 * Only shaders with point, directional and hemisphere lights at once use the block — the world's; any other (the hands'
 * scene, thumbnails) keeps three.js's own uniforms. As render/bones.ts does for bone matrices: the transport only.
 */

import * as THREE from 'three'

/** The block: the world's lights, in three.js's own light structures (lights_pars_begin's). */
const BLOCK = `layout(std140) uniform SgLights {
	PointLight point[ NUM_POINT_LIGHTS ];
	DirectionalLight dir[ NUM_DIR_LIGHTS ];
	HemisphereLight hemi[ NUM_HEMI_LIGHTS ];
} sgL;
#define pointLights sgL.point
#define directionalLights sgL.dir
#define hemisphereLights sgL.hemi`

const USES_BLOCK = '#if NUM_POINT_LIGHTS > 0 && NUM_DIR_LIGHTS > 0 && NUM_HEMI_LIGHTS > 0'

/**
 * For a vertex shader that reads the point lights itself (render/levelmaterial.ts): the same block, declared as the
 * fragment shader declares it (a block in both stages must match), or three.js's own uniform where there is no block.
 */
export const VERTEX_POINT_LIGHTS = `${USES_BLOCK}
struct DirectionalLight { vec3 direction; vec3 color; };
struct PointLight { vec3 position; vec3 color; float distance; float decay; };
struct HemisphereLight { vec3 direction; vec3 skyColor; vec3 groundColor; };
${BLOCK}
#elif NUM_POINT_LIGHTS > 0
struct PointLight { vec3 position; vec3 color; float distance; float decay; };
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
#endif`

// The fragment side: three.js's own light declarations, each array declared as a uniform only where there is no block,
// and the block after the last of the structures it holds. Done once, before anything is compiled.
{
  const chunk = THREE.ShaderChunk as unknown as Record<string, string>
  let src = chunk.lights_pars_begin!
  if (!src.includes('SgLights')) {
    const own = (decl: string): void => {
      if (!src.includes(decl)) throw new Error(`lightblock: three.js's lights_pars_begin has no "${decl}"`)
      src = src.replace(decl, `#ifndef SG_LIGHT_BLOCK\n\t${decl}\n\t#endif`)
    }
    own('uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];')
    own('uniform PointLight pointLights[ NUM_POINT_LIGHTS ];')
    own('uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];')
    chunk.lights_pars_begin = `${USES_BLOCK}\n#define SG_LIGHT_BLOCK\n#endif\n${src}\n#ifdef SG_LIGHT_BLOCK\n${BLOCK}\n#endif\n`
  }
}

interface PointState {
  position: THREE.Vector3
  color: THREE.Color
  distance: number
  decay: number
}
interface DirState {
  direction: THREE.Vector3
  color: THREE.Color
}
interface HemiState {
  direction: THREE.Vector3
  skyColor: THREE.Color
  groundColor: THREE.Color
}

/** Room for the block (bytes): far more lights than the game has (it needs 48 a point light, 32 a sun, 48 a sky). */
const BUFFER_BYTES = 4096

export class LightBlock {
  private gl: WebGL2RenderingContext
  private buffer: WebGLBuffer | null = null
  private readonly data = new Float32Array(BUFFER_BYTES / 4)
  private point: PointState[] | null = null
  private dir: DirState[] | null = null
  private hemi: HemiState[] | null = null
  private sentFrame = -1
  /** The context was lost and restored: three.js's light state is new, adopted again once it has compiled for it. */
  private restored = false

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    private readonly scene: THREE.Scene,
  ) {
    this.gl = renderer.getContext() as WebGL2RenderingContext
    this.bind()
    // At the first draw of each drawing of the world: three.js has worked the lights out for its camera by then
    // (renderScene's setupLightsView), and nothing is drawn yet. Every material's own hook is three.js's empty one.
    const self = this
    THREE.Material.prototype.onBeforeRender = function (renderer: THREE.WebGLRenderer, scene: THREE.Object3D) {
      if (scene === self.scene) self.send(renderer)
    } as THREE.Material['onBeforeRender']
    renderer.domElement.addEventListener('webglcontextrestored', () => {
      this.gl = renderer.getContext() as WebGL2RenderingContext
      this.point = this.dir = this.hemi = null
      this.restored = true
      // (Its drawing count starts again with its new bookkeeping.)
      this.sentFrame = -1
      this.bind()
    })
  }

  /** The buffer made (all lights dark until the first drawing fills it) and held at binding point 0, where every block reads. */
  private bind(): void {
    const gl = this.gl
    this.buffer = gl.createBuffer()
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer)
    gl.bufferData(gl.UNIFORM_BUFFER, BUFFER_BYTES, gl.DYNAMIC_DRAW)
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.buffer)
  }

  /**
   * three.js's own light state for the world, as a lit material compiled for it holds it (its uniforms' values are the
   * state's arrays, refilled in place every drawing). Call once the world's materials are compiled.
   */
  adopt(): boolean {
    let found: THREE.Material | null = null
    this.scene.traverse((o) => {
      if (found) return
      const m = (o as THREE.Mesh).material
      for (const mat of Array.isArray(m) ? m : m ? [m] : []) {
        const u = (this.renderer.properties.get(mat) as { uniforms?: Record<string, THREE.IUniform> }).uniforms
        if (u?.pointLights && u.directionalLights && u.hemisphereLights) {
          found = mat
          this.point = u.pointLights.value as PointState[]
          this.dir = u.directionalLights.value as DirState[]
          this.hemi = u.hemisphereLights.value as HemiState[]
          return
        }
      }
    })
    if (found) this.check(found)
    return found !== null
  }

  /**
   * The block is filled as std140 lays it out (send): a driver that lays it out otherwise would show the lights wrong,
   * so it is asked once, and said if so.
   */
  private check(mat: THREE.Material): void {
    const prog = (this.renderer.properties.get(mat) as { currentProgram?: { program: WebGLProgram } }).currentProgram?.program
    if (!prog) return
    const gl = this.gl
    const names = ['SgLights.point[0].color', 'SgLights.point[0].distance', 'SgLights.dir[0].direction', 'SgLights.hemi[0].groundColor']
    const idx = gl.getUniformIndices(prog, names)
    if (!idx || idx.some((i) => i === gl.INVALID_INDEX)) return
    const got = gl.getActiveUniforms(prog, idx, gl.UNIFORM_OFFSET) as number[]
    const p = this.point!.length
    const want = [16, 28, 48 * p, 48 * p + 32 * this.dir!.length + 32]
    if (want.some((w, i) => got[i] !== w)) console.warn('lightblock: the driver lays the light block out otherwise', got, want)
  }

  /** Fill the block from three.js's light state, once per drawing (render.frame counts drawings). */
  private send(renderer: THREE.WebGLRenderer): void {
    const frame = renderer.info.render.frame
    if (frame === this.sentFrame) return
    this.sentFrame = frame
    // After a restore: the world's lit materials are compiled again in its first drawing, so adopted from the next.
    if (this.restored) {
      if (!this.adopt()) return
      this.restored = false
    }
    const point = this.point
    const dir = this.dir
    const hemi = this.hemi
    if (!point || !dir || !hemi) return
    const f = this.data
    // std140: a point light 48 bytes (position, colour, distance, decay), a sun 32, a sky 48; each kind after the last.
    const dirAt = 48 * point.length
    const hemiAt = dirAt + 32 * dir.length
    const end = (hemiAt + 48 * hemi.length) >> 2
    if (end > f.length) return
    for (let i = 0; i < point.length; i++) {
      const s = point[i]!
      const o = i * 12
      f[o] = s.position.x
      f[o + 1] = s.position.y
      f[o + 2] = s.position.z
      f[o + 4] = s.color.r
      f[o + 5] = s.color.g
      f[o + 6] = s.color.b
      f[o + 7] = s.distance
      f[o + 8] = s.decay
    }
    for (let i = 0; i < dir.length; i++) {
      const s = dir[i]!
      const o = (dirAt >> 2) + i * 8
      f[o] = s.direction.x
      f[o + 1] = s.direction.y
      f[o + 2] = s.direction.z
      f[o + 4] = s.color.r
      f[o + 5] = s.color.g
      f[o + 6] = s.color.b
    }
    for (let i = 0; i < hemi.length; i++) {
      const s = hemi[i]!
      const o = (hemiAt >> 2) + i * 12
      f[o] = s.direction.x
      f[o + 1] = s.direction.y
      f[o + 2] = s.direction.z
      f[o + 4] = s.skyColor.r
      f[o + 5] = s.skyColor.g
      f[o + 6] = s.skyColor.b
      f[o + 8] = s.groundColor.r
      f[o + 9] = s.groundColor.g
      f[o + 10] = s.groundColor.b
    }
    const gl = this.gl
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer)
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, f, 0, end)
  }
}
