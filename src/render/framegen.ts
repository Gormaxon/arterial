/**
 * Frame generation: of every N frames shown, one is drawn and the rest are made from it (the multiplier, 2x to
 * 6x: 2x is every other frame). It has no quality modes; those belong to the upscaler (render/fsr1.ts).
 *
 * AMD's FSR 3 frame generation needs the engine's motion vectors and a DirectX 12 compute queue, neither of
 * which a web page has. What a page can do, and what VR headsets have done for years, is reproject: keep the
 * colour and depth of the last frame the world was really drawn, and for the frames in between, move every
 * pixel to where its surface lands in the camera as it is NOW.
 *
 * How it is put together, and why:
 *
 *   The scenery only. Everything that moves on its own (render/live.ts: platforms, doors, the defences' working
 *   parts, particles, tracers) is left out of the reprojected frame and drawn fresh on every frame over it, as the
 *   hands are. Reprojected, a platform stepped at the rate the world is really drawn — ten steps a second at 6x.
 *
 *   Anti-aliased. With anti-aliasing on, the real frame is smoothed with FXAA once, as it is drawn, and every frame
 *   shown is made from that smoothed image. (Frame generation used to draw with no anti-aliasing at all: three's
 *   multisampled target with a readable depth was refused by the Chromebook's driver. Drawing it multisampled into
 *   storage of our own and copying colour and depth out worked, but cost more than frame generation saved — 18 ms a
 *   frame against 11 with it off, on the Chromebook stand-in. One FXAA pass a real frame costs a fraction of that.)
 *
 *   With a margin. The real frame is drawn a tenth wider and taller than the screen on every side. A turn needs
 *   what was just off screen when the frame was drawn, and without the margin the edges of every generated frame
 *   were the last column of pixels smeared inwards.
 *
 *   Sharp. A real frame is put on screen as an exact pixel copy of the middle of that wider frame; a generated one
 *   is sampled with a Catmull-Rom filter rather than a plain bilinear one, which softened every generated frame.
 *
 *   Steady in the distance. Far off, depth is too coarse to place a pixel well and reprojecting from it wobbled; but
 *   that far away only the turn of the camera matters, so distant pixels are moved by the rotation alone.
 *
 *   With depth. Each frame put down this way writes the depth of what it shows, so the live objects drawn over it
 *   are hidden behind walls as they should be.
 */

import * as THREE from 'three'
import type { Upscaler } from './upscale'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`

/**
 * FXAA (after Timothy Lottes): find the edge through each pixel from the luma around it and blend along it. One pass
 * over the real frame when anti-aliasing is on; everything shown is made from the result.
 */
const FXAA_FRAG = /* glsl */ `
uniform sampler2D tColor;
uniform vec2 uTexel;
varying vec2 vUv;
float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
void main() {
  vec3 nw = texture2D(tColor, vUv + vec2(-1.0, -1.0) * uTexel).rgb;
  vec3 ne = texture2D(tColor, vUv + vec2(1.0, -1.0) * uTexel).rgb;
  vec3 sw = texture2D(tColor, vUv + vec2(-1.0, 1.0) * uTexel).rgb;
  vec3 se = texture2D(tColor, vUv + vec2(1.0, 1.0) * uTexel).rgb;
  vec3 m = texture2D(tColor, vUv).rgb;
  float lNW = luma(nw), lNE = luma(ne), lSW = luma(sw), lSE = luma(se), lM = luma(m);
  float lMin = min(lM, min(min(lNW, lNE), min(lSW, lSE)));
  float lMax = max(lM, max(max(lNW, lNE), max(lSW, lSE)));
  vec2 dir = vec2(-((lNW + lNE) - (lSW + lSE)), (lNW + lSW) - (lNE + lSE));
  float reduce = max((lNW + lNE + lSW + lSE) * (0.25 * 0.125), 1.0 / 128.0);
  float rcpMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + reduce);
  dir = clamp(dir * rcpMin, vec2(-8.0), vec2(8.0)) * uTexel;
  vec3 a = 0.5 * (texture2D(tColor, vUv + dir * (1.0 / 3.0 - 0.5)).rgb + texture2D(tColor, vUv + dir * (2.0 / 3.0 - 0.5)).rgb);
  vec3 b = a * 0.5 + 0.25 * (texture2D(tColor, vUv - dir * 0.5).rgb + texture2D(tColor, vUv + dir * 0.5).rgb);
  float lB = luma(b);
  gl_FragColor = vec4((lB < lMin || lB > lMax) ? a : b, 1.0);
}`

/** A real frame: the middle of the wider frame, pixel for pixel, with its depth. */
const COPY_FRAG = /* glsl */ `
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform vec2 uGuard;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy) + ivec2(uGuard);
  gl_FragColor = vec4(texelFetch(tColor, p, 0).rgb, 1.0);
  gl_FragDepth = texelFetch(tDepth, p, 0).x;
}`

/**
 * A generated frame. For each pixel, find the pixel of the last real frame that shows the same surface: start where
 * the same view ray fell, read the depth there, put that point in space, project it into the new camera, and shift
 * the guess by how far off it landed. A few rounds settle it wherever the depth is smooth.
 */
const WARP_FRAG = /* glsl */ `
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform mat4 uReproj;
uniform mat4 uProjNew;
uniform mat4 uInvProjOld;
uniform vec2 uScale;
uniform vec2 uOffset;
uniform vec2 uSize;
uniform float uFar;
varying vec2 vUv;

vec3 oldViewPoint(vec2 s) {
  float d = texture2D(tDepth, s).x;
  vec4 v = uInvProjOld * vec4(s * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  return v.xyz / v.w;
}

/** Where an old view-space point lands in the new camera: near points by the full motion, far ones by the turn alone. */
vec4 project(vec3 p) {
  vec3 q = -p.z > uFar ? mat3(uReproj) * p : (uReproj * vec4(p, 1.0)).xyz;
  return uProjNew * vec4(q, 1.0);
}

/**
 * Catmull-Rom in five bilinear taps (Jimenez's lighter form, the four corner taps dropped and the weights renormalised):
 * far sharper than one bilinear tap, which visibly softened every generated frame, at half the cost of the full nine.
 */
vec3 sampleSharp(vec2 uv) {
  vec2 pos = uv * uSize;
  vec2 c = floor(pos - 0.5) + 0.5;
  vec2 f = pos - c;
  vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
  vec2 w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
  vec2 w2 = f * (0.5 + f * (2.0 - 1.5 * f));
  vec2 w3 = f * f * (-0.5 + 0.5 * f);
  vec2 w12 = w1 + w2;
  vec2 t12 = (c + w2 / w12) / uSize;
  vec2 t0 = (c - 1.0) / uSize;
  vec2 t3 = (c + 2.0) / uSize;
  vec3 r = texture2D(tColor, vec2(t12.x, t0.y)).rgb * (w12.x * w0.y);
  r += texture2D(tColor, vec2(t0.x, t12.y)).rgb * (w0.x * w12.y);
  r += texture2D(tColor, vec2(t12.x, t12.y)).rgb * (w12.x * w12.y);
  r += texture2D(tColor, vec2(t3.x, t12.y)).rgb * (w3.x * w12.y);
  r += texture2D(tColor, vec2(t12.x, t3.y)).rgb * (w12.x * w3.y);
  float wsum = w12.x * w0.y + w0.x * w12.y + w12.x * w12.y + w3.x * w12.y + w12.x * w3.y;
  return max(r / wsum, vec3(0.0));
}

void main() {
  vec2 s = vUv * uScale + uOffset;
  for (int i = 0; i < 3; i++) {
    vec4 c = project(oldViewPoint(clamp(s, 0.0005, 0.9995)));
    vec2 landed = c.xy / c.w * 0.5 + 0.5;
    s += (vUv - landed) * uScale;
  }
  s = clamp(s, 0.5 / uSize, 1.0 - 0.5 / uSize);
  vec4 c = project(oldViewPoint(s));
  gl_FragColor = vec4(sampleSharp(s), 1.0);
  gl_FragDepth = clamp(c.z / c.w * 0.5 + 0.5, 0.0, 1.0);
}`

/** A camera that has turned or moved more than this since the real frame is not reprojected from it. */
const MAX_TURN_COS = Math.cos((24 * Math.PI) / 180)
const MAX_MOVE = 4
/** The margin drawn around a real frame, as a share of its width and height on each side. */
const GUARD = 0.06
/** Beyond this distance (metres) a pixel is moved by the camera's turn alone. */
const FAR_ROTATION_ONLY = 70

export class FrameGen {
  /** What the player chose. Whether a frame is generated is also up to `shouldGenerate`. */
  enabled = false
  /** Called if the GPU turns out unable to run it, after it has switched itself off. */
  onFailure: ((reason: string) => void) | null = null
  /** Frames drawn and frames made, since the setting was last turned on. */
  readonly stats = { real: 0, generated: 0 }

  /** Frames of each kind still to be checked for errors after turning on. */
  private checksLeft = 0
  /** Why it is to be switched off, found mid-frame and acted on at the start of the next. */
  private failed: string | null = null
  /** The real frame, colour and depth, readable. */
  private world: THREE.WebGLRenderTarget | null = null
  /** The real frame's colour smoothed by FXAA, when anti-aliasing is on: what the copies and the warps sample then. */
  private smooth: THREE.WebGLRenderTarget | null = null
  private guardX = 0
  private guardY = 0
  private valid = false
  private generateNext = false
  /** Generated frames after each real one: the multiplier less one. */
  private genPer = 1
  private gensLeft = 0
  private readonly oldWorld = new THREE.Matrix4()
  private readonly oldProj = new THREE.Matrix4()
  private readonly oldInvProj = new THREE.Matrix4()
  private readonly reproj = new THREE.Matrix4()
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private readonly quad: THREE.Mesh
  private readonly copy: THREE.ShaderMaterial
  private readonly warp: THREE.ShaderMaterial
  private readonly fxaa: THREE.ShaderMaterial
  /** The colour the current real frame's copies and warps read: smoothed or plain. */
  private colour: THREE.Texture | null = null

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    private readonly upscaler: Upscaler,
  ) {
    // Full-screen passes that write depth: tested ALWAYS so the depth is written (a disabled test writes none).
    const pass = (frag: string, uniforms: Record<string, THREE.IUniform>): THREE.ShaderMaterial => {
      const m = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms, depthTest: true, depthWrite: true })
      m.depthFunc = THREE.AlwaysDepth
      return m
    }
    this.copy = pass(COPY_FRAG, { tColor: { value: null }, tDepth: { value: null }, uGuard: { value: new THREE.Vector2() } })
    this.warp = pass(WARP_FRAG, {
      tColor: { value: null },
      tDepth: { value: null },
      uReproj: { value: this.reproj },
      uProjNew: { value: new THREE.Matrix4() },
      uInvProjOld: { value: this.oldInvProj },
      uScale: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2() },
      uSize: { value: new THREE.Vector2(1, 1) },
      uFar: { value: FAR_ROTATION_ONLY },
    })
    this.fxaa = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FXAA_FRAG, uniforms: { tColor: { value: null }, uTexel: { value: new THREE.Vector2() } }, depthTest: false, depthWrite: false })
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.copy)
    this.quad.frustumCulled = false
    this.scene.add(this.quad)
  }

  /** Frames shown per frame drawn, 2 to 6: 2 is every other frame, 6 is one drawn and five made from it. */
  setMultiplier(n: number): void {
    this.genPer = Math.max(1, Math.min(5, Math.round(n) - 1))
    this.gensLeft = 0
  }

  /** Turn on or off. Off frees the buffers. */
  setEnabled(on: boolean): void {
    if (on === this.enabled) return
    this.enabled = on
    this.valid = false
    this.generateNext = false
    this.stats.real = 0
    this.stats.generated = 0
    if (!on) {
      this.release()
      return
    }
    this.checksLeft = 8
    // Pay for the buffers and the two shaders now, while the settings page is still open, not on a frame of play.
    this.ensureBuffers()
    for (const m of [this.copy, this.warp, this.fxaa]) {
      this.quad.material = m
      this.renderer.compile(this.scene, this.camera)
    }
  }

  private release(): void {
    this.world?.depthTexture?.dispose()
    this.world?.dispose()
    this.smooth?.dispose()
    this.world = this.smooth = null
  }

  /** The real frame's buffers, the size of the screen's buffer plus the margin on every side. */
  private ensureBuffers(): void {
    const { width, height } = this.upscaler.target
    this.guardX = Math.round(width * GUARD)
    this.guardY = Math.round(height * GUARD)
    const w = width + this.guardX * 2
    const h = height + this.guardY * 2
    if (this.world && this.world.width === w && this.world.height === h) return
    this.release()
    const world = new THREE.WebGLRenderTarget(w, h, { samples: 0, depthBuffer: true, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false })
    const depth = new THREE.DepthTexture(w, h)
    depth.minFilter = THREE.NearestFilter
    depth.magFilter = THREE.NearestFilter
    world.depthTexture = depth
    // The same flags as the buffer the game normally draws into: materials write screen-space sRGB values.
    world.texture.colorSpace = THREE.SRGBColorSpace
    world.texture.internalFormat = 'RGBA8'
    ;(world as unknown as { isXRRenderTarget: boolean }).isXRRenderTarget = true
    const smooth = new THREE.WebGLRenderTarget(w, h, { samples: 0, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false })
    smooth.texture.colorSpace = THREE.SRGBColorSpace
    smooth.texture.internalFormat = 'RGBA8'
    ;(smooth as unknown as { isXRRenderTarget: boolean }).isXRRenderTarget = true
    this.world = world
    this.smooth = smooth
    this.valid = false
  }

  /**
   * Should this frame be generated rather than drawn? Only while a run of generated frames is due, and only while the
   * camera is still close to where it was for the real one: a respawn, a cutscene cut or a teleport draws a real frame.
   */
  shouldGenerate(camera: THREE.PerspectiveCamera): boolean {
    if (this.failed) {
      const reason = this.failed
      this.failed = null
      console.warn(`frame generation switched off: ${reason}`)
      this.setEnabled(false)
      this.onFailure?.(reason)
      return false
    }
    if (!this.enabled || !this.valid || !this.generateNext || !this.world) return false
    const { width, height } = this.upscaler.target
    if (this.world.width !== width + this.guardX * 2 || this.world.height !== height + this.guardY * 2) return false
    camera.updateMatrixWorld()
    const a = camera.matrixWorld.elements
    const b = this.oldWorld.elements
    // The look direction is the third column, negated; the dot of two unit vectors is the cosine of the turn.
    const cos = a[8]! * b[8]! + a[9]! * b[9]! + a[10]! * b[10]!
    if (cos < MAX_TURN_COS) return false
    return Math.hypot(a[12]! - b[12]!, a[13]! - b[13]!, a[14]! - b[14]!) <= MAX_MOVE
  }

  /**
   * A real frame: `drawWorld` draws the scenery (the caller hides the live objects) into the frame generator's own
   * buffer, through the camera widened by the margin; it is smoothed if anti-aliasing is on, then its middle laid
   * down where the hands go, depth and all.
   */
  captureReal(camera: THREE.PerspectiveCamera, drawWorld: () => void): void {
    this.ensureBuffers()
    const world = this.world!
    const { width, height } = this.upscaler.target
    const antialias = this.upscaler.sampleCount >= 2
    if (this.checksLeft > 0) this.clearErrors()
    // The same camera, seeing a margin past every edge at exactly the same pixel size.
    camera.setViewOffset(width, height, -this.guardX, -this.guardY, width + this.guardX * 2, height + this.guardY * 2)
    camera.updateProjectionMatrix()
    this.renderer.setRenderTarget(world)
    this.renderer.clear()
    drawWorld()
    camera.updateMatrixWorld()
    this.oldWorld.copy(camera.matrixWorld)
    this.oldProj.copy(camera.projectionMatrix)
    this.oldInvProj.copy(camera.projectionMatrixInverse)
    camera.clearViewOffset()
    camera.updateProjectionMatrix()
    if (antialias) {
      // Smoothed once here; the copy and every warp made from this frame read the smoothed colour.
      const u = this.fxaa.uniforms
      u.tColor!.value = world.texture
      ;(u.uTexel!.value as THREE.Vector2).set(1 / world.width, 1 / world.height)
      this.quad.material = this.fxaa
      this.renderer.setRenderTarget(this.smooth)
      this.renderer.render(this.scene, this.camera)
    }
    this.colour = antialias ? this.smooth!.texture : world.texture
    this.valid = true
    this.stats.real++
    this.gensLeft = this.genPer
    this.generateNext = true
    // Its middle onto the screen's buffer, pixel for pixel.
    const u = this.copy.uniforms
    u.tColor!.value = this.colour
    u.tDepth!.value = world.depthTexture
    ;(u.uGuard!.value as THREE.Vector2).set(this.guardX, this.guardY)
    this.quad.material = this.copy
    this.renderer.setRenderTarget(this.upscaler.draw)
    this.renderer.render(this.scene, this.camera)
    this.check()
  }

  /** Make a frame: the last real frame's scenery as the camera sees it now, depth and all. */
  generate(camera: THREE.PerspectiveCamera): void {
    const w = this.world!
    const { width, height } = this.upscaler.target
    camera.updateMatrixWorld()
    // Old view space to new view space: out to the world through the old camera, back in through the new one.
    this.reproj.multiplyMatrices(camera.matrixWorldInverse, this.oldWorld)
    const u = this.warp.uniforms
    u.uProjNew!.value.copy(camera.projectionMatrix)
    u.tColor!.value = this.colour ?? w.texture
    u.tDepth!.value = w.depthTexture
    ;(u.uScale!.value as THREE.Vector2).set(width / w.width, height / w.height)
    ;(u.uOffset!.value as THREE.Vector2).set(this.guardX / w.width, this.guardY / w.height)
    ;(u.uSize!.value as THREE.Vector2).set(w.width, w.height)
    this.gensLeft--
    this.generateNext = this.gensLeft > 0
    this.stats.generated++
    this.quad.material = this.warp
    if (this.checksLeft > 0) this.clearErrors()
    this.renderer.setRenderTarget(this.upscaler.draw)
    this.renderer.render(this.scene, this.camera)
    this.check()
  }

  private clearErrors(): void {
    const gl = this.renderer.getContext()
    for (let i = 0; i < 16 && gl.getError() !== gl.NO_ERROR; i++);
  }

  /**
   * The first few frames after turning on are checked: an error from the GPU, or a shader that would not build, and
   * frame generation switches itself off rather than leave the screen blank on a driver that cannot run it.
   */
  private check(): void {
    if (this.checksLeft <= 0) return
    this.checksLeft--
    const gl = this.renderer.getContext()
    const err = gl.getError()
    if (err !== gl.NO_ERROR) return this.fail(`the GPU reported error 0x${err.toString(16)}`)
    for (const p of this.renderer.info.programs ?? []) {
      const d = (p as unknown as { diagnostics?: { runnable: boolean } }).diagnostics
      if (d && !d.runnable) return this.fail('a shader would not compile')
    }
  }

  private fail(reason: string): void {
    this.failed ??= reason
    this.checksLeft = 0
  }
}
