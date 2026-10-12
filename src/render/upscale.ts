/**
 * Render low, present sharp — and put the suit's camera between you and the world.
 *
 * The dynamic resolution (resolution.ts) lowers the render resolution on a GPU that
 * cannot keep up, and on a Chromebook that is most of the time. That used to lower the
 * CANVAS: the browser then stretched a small image over a dense panel with plain
 * bilinear filtering, and the whole game looked soft and grainy — texture detail
 * smeared, edges stair-stepped a second time by the stretch.
 *
 * Now the frame is drawn into an offscreen buffer at the dynamic resolution (with its
 * own MSAA), and one cheap full-screen pass puts it on a canvas that always runs at the
 * panel's density. That pass is a contrast-adaptive sharpen (after AMD's CAS): it
 * restores edge and texture contrast the upscale softened, and backs off on edges that
 * are already hard, so it does not ring or crawl. The canvas itself has no MSAA — the
 * only thing ever drawn to it is this one quad.
 *
 * The same pass is the visor. You are looking through a camera in a suit, so the image
 * carries what a camera does: a little sensor grain, colour fringing that grows toward
 * the edges and is zero at the crosshair, a faint scan structure with a slow rolling
 * band, a cool cast, a touch more contrast and the corners dropping away. It all folds
 * into the pass that was already running, so it costs a few more texture taps and no
 * extra pass. A burst of static (`pulse`) plays when the optics come online.
 *
 * Colour is untouched apart from that. The buffer is flagged the way three flags an XR
 * framebuffer, so every material writes exactly the sRGB values it would have written to
 * the screen, into a plain RGBA8 buffer, and blending happens in the same space it
 * always did. The present pass copies those values straight through.
 */

import * as THREE from 'three'
import { EASU_FRAG, EASU_VERT, RCAS_STOPS, easuCon0 } from './fsr1'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`

const FRAG = /* glsl */ `
uniform sampler2D tFrame;
uniform vec2 texel;
uniform float sharpness;
uniform float uTime;
uniform float uPulse;
uniform float uStrength;
uniform float uAspect;
uniform float uRcas;
varying vec2 vUv;

// Hash without sin(): stable across GPUs, and cheap.
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  // A cross of five taps one SOURCE texel apart.
  vec3 c = texture2D(tFrame, vUv).rgb;
  vec3 n = texture2D(tFrame, vUv + vec2(0.0, texel.y)).rgb;
  vec3 s = texture2D(tFrame, vUv - vec2(0.0, texel.y)).rgb;
  vec3 e = texture2D(tFrame, vUv + vec2(texel.x, 0.0)).rgb;
  vec3 w = texture2D(tFrame, vUv - vec2(texel.x, 0.0)).rgb;
#ifdef FSR_RCAS
  // AMD FSR 1 RCAS (FsrRcasF, ffx_fsr1.h, MIT): the sharpening FSR follows its upscale with. The lobe is the
  // largest negative weight that cannot push any channel past black or white, capped at FSR_RCAS_LIMIT.
  vec3 mn4 = min(min(n, s), min(e, w));
  vec3 mx4 = max(max(n, s), max(e, w));
  vec3 hitMin = min(mn4, c) / max(4.0 * mx4, vec3(1e-5));
  vec3 hitMax = (1.0 - max(mx4, c)) / min(4.0 * mn4 - 4.0, vec3(-1e-5));
  vec3 lobeRGB = max(-hitMin, hitMax);
  float lobe = max(-(0.25 - 1.0 / 16.0), min(max(lobeRGB.r, max(lobeRGB.g, lobeRGB.b)), 0.0)) * uRcas;
  vec3 outc = (lobe * (n + s + e + w) + c) / (4.0 * lobe + 1.0);
#else
  vec3 mn = min(c, min(min(n, s), min(e, w)));
  vec3 mx = max(c, max(max(n, s), max(e, w)));
  // CAS: the headroom left in the local range decides how hard to sharpen, so flat
  // areas and soft detail get it and edges already at full contrast do not.
  vec3 amp = sqrt(clamp(min(mn, 1.0 - mx) / max(mx, 1e-4), 0.0, 1.0));
  vec3 wgt = -amp * mix(0.125, 0.2, sharpness);
  vec3 outc = (c + (n + s + e + w) * wgt) / (1.0 + 4.0 * wgt);
#endif

  // --- the camera ---------------------------------------------------------------
  vec2 d = vUv - 0.5;
  vec2 da = d * vec2(uAspect, 1.0);
  float r2 = dot(da, da); // 0 at the centre, about 0.4 in the corners of a 16:9 frame

  // Colour fringing: red pushed out, blue pulled in, growing with the square of the
  // distance from the middle, so the crosshair sits on a clean image. The sharpening
  // delta rides along on each shifted channel, so the detail is not lost to the shift.
  vec2 shift = d * (0.0055 * r2 + 0.012 * uPulse) * uStrength;
  vec3 detail = outc - c;
  float rr = texture2D(tFrame, vUv + shift).r;
  float bb = texture2D(tFrame, vUv - shift).b;
  outc = vec3(rr + detail.r, outc.g, bb + detail.b);

  float luma = dot(outc, vec3(0.299, 0.587, 0.114));
  // Sensor grain: heavier in the dark where a sensor is noisiest, redrawn every frame.
  float g = hash(gl_FragCoord.xy + vec2(fract(uTime * 7.31) * 173.0, fract(uTime * 3.17) * 129.0)) - 0.5;
  outc += g * (0.032 + 0.2 * uPulse) * (1.15 - luma) * uStrength;

  // Faint scan structure, and a slow soft band rolling down the frame.
  outc *= 1.0 - 0.035 * (0.5 + 0.5 * sin(gl_FragCoord.y * 2.094)) * uStrength;
  float band = fract(vUv.y + uTime * 0.045) - 0.5;
  outc *= 1.0 + 0.04 * exp(-band * band * 90.0) * uStrength;

  // Grade: a faint cool-green cast, a touch more contrast, corners falling away.
  outc = mix(outc, outc * vec3(0.965, 1.0, 0.985), uStrength);
  outc = mix(outc, (outc - 0.5) * 1.05 + 0.5, uStrength);
  outc *= 1.0 - 0.15 * smoothstep(0.1, 0.4, r2) * uStrength;
  // The optics coming online: a flash of brightness with the static.
  outc += uPulse * 0.09 * uStrength;

  gl_FragColor = vec4(clamp(outc, 0.0, 1.0), 1.0);
}`

/** A colour buffer for the passes to draw into, the screen's way: values written as they will be shown. */
function screenTarget(depth: boolean): THREE.WebGLRenderTarget {
  const t = new THREE.WebGLRenderTarget(1, 1, {
    samples: 0,
    depthBuffer: depth,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: false,
  })
  // Screen-space sRGB in a plain RGBA8 buffer: the shaders encode, the hardware does
  // not. See the note at the top.
  t.texture.colorSpace = THREE.SRGBColorSpace
  t.texture.internalFormat = 'RGBA8'
  ;(t as unknown as { isXRRenderTarget: boolean }).isXRRenderTarget = true
  return t
}

/** The multisampled storage put under `Upscaler.draw`. */
interface Msaa {
  fb: WebGLFramebuffer
  color: WebGLRenderbuffer
  depth: WebGLRenderbuffer
  w: number
  h: number
}

/**
 * HOW THE ANTI-ALIASING IS DONE. three.js resolves a multisampled target (copies it, colour and depth, into a
 * plain texture) at the end of EVERY render call into it. A frame here is three or four calls into the same buffer
 * (world, hands, streaks), so the whole buffer was copied three or four times a frame, depth included, though only
 * the last copy of the colour is ever looked at. On integrated graphics those copies were a third of the frame.
 *
 * So the passes draw into `draw`, a plain target whose attachments are swapped for multisampled renderbuffers of
 * our own: three draws into it as into any plain target and never resolves, and `present` resolves the colour,
 * once, into `target`. A driver that will not have it gets plain drawing, without anti-aliasing, rather than none.
 */
export class Upscaler {
  /** What every pass of a frame draws into. */
  readonly draw: THREE.WebGLRenderTarget
  /** The finished frame, resolved, for the present pass to read. */
  readonly target: THREE.WebGLRenderTarget
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private readonly material: THREE.ShaderMaterial
  private pulseAmount = 0
  private strength = 1
  /**
   * AMD FSR 1 (experimental): the frame is upscaled to the canvas by EASU into `easu`, and the present pass
   * sharpens it with RCAS instead of CAS. Off, the present pass reads `target` directly, as before.
   */
  private fsr = false
  private readonly easu = screenTarget(false)
  private readonly easuScene = new THREE.Scene()
  private readonly easuMaterial: THREE.ShaderMaterial
  private readonly outSize = new THREE.Vector2()
  private msaa: Msaa | null = null
  /** Samples the anti-aliasing uses now: 0 or 1 is none. */
  private samples: number
  /** The most this GPU can do, and the most the game asks for. */
  private readonly maxSamples: number

  constructor(private readonly renderer: THREE.WebGLRenderer) {
    this.draw = screenTarget(true)
    this.target = screenTarget(false)
    const gl = renderer.getContext() as WebGL2RenderingContext
    this.maxSamples = Math.min(4, Number(gl.getParameter(gl.MAX_SAMPLES)) || 0)
    this.samples = this.maxSamples

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        tFrame: { value: this.target.texture },
        texel: { value: new THREE.Vector2(1, 1) },
        sharpness: { value: 0.5 },
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uStrength: { value: 1 },
        uAspect: { value: 16 / 9 },
        uRcas: { value: Math.pow(2, -RCAS_STOPS) },
      },
      depthTest: false,
      depthWrite: false,
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material)
    quad.frustumCulled = false
    this.scene.add(quad)
    this.easuMaterial = new THREE.ShaderMaterial({
      vertexShader: EASU_VERT,
      fragmentShader: EASU_FRAG,
      uniforms: { tInput: { value: this.target.texture }, con0: { value: new THREE.Vector4() } },
      depthTest: false,
      depthWrite: false,
    })
    const easuQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.easuMaterial)
    easuQuad.frustumCulled = false
    this.easuScene.add(easuQuad)
  }

  /** Turn AMD FSR 1 on or off. The present pass is rebuilt with RCAS in place of CAS (one shader compile). */
  setFsr(on: boolean): void {
    if (on === this.fsr) return
    this.fsr = on
    if (on) this.material.defines = { ...this.material.defines, FSR_RCAS: 1 }
    else delete (this.material.defines as Record<string, unknown>).FSR_RCAS
    this.material.needsUpdate = true
  }

  /** Anti-aliasing samples in use now: 0 for none. Frame generation draws its real frames with the same. */
  get sampleCount(): number {
    return this.samples >= 2 ? this.samples : 0
  }

  get fsrOn(): boolean {
    return this.fsr
  }

  /** Size the offscreen buffer: CSS size times the dynamic render ratio. */
  setSize(cssWidth: number, cssHeight: number, ratio: number): void {
    const w = Math.max(1, Math.round(cssWidth * ratio))
    const h = Math.max(1, Math.round(cssHeight * ratio))
    if (this.target.width !== w || this.target.height !== h) {
      this.draw.setSize(w, h)
      this.target.setSize(w, h)
    }
    this.material.uniforms.texel!.value.set(1 / w, 1 / h)
    this.material.uniforms.uAspect!.value = cssWidth / Math.max(1, cssHeight)
  }

  /**
   * How many samples the anti-aliasing takes: 4, 2, or 0 for none. Every sample is a full copy of the frame
   * written and resolved, so on a graphics chip short of memory bandwidth it is one of the dearest things drawn.
   */
  setSamples(n: number): void {
    const want = n >= 2 ? Math.min(n, this.maxSamples) : 0
    if (want === this.samples) return
    this.samples = want
    if (this.msaa) {
      const gl = this.renderer.getContext()
      gl.deleteRenderbuffer(this.msaa.color)
      gl.deleteRenderbuffer(this.msaa.depth)
      this.msaa = null
    }
    // Three remakes the target with its own plain attachments the next time it is drawn into; `begin` puts
    // multisampled ones under it again if anti-aliasing is still wanted.
    this.draw.dispose()
  }

  /** The framebuffer three made for a target, made now if it has not been yet. */
  private framebufferOf(t: THREE.WebGLRenderTarget): WebGLFramebuffer {
    this.renderer.setRenderTarget(t)
    return (this.renderer.properties.get(t) as { __webglFramebuffer: WebGLFramebuffer }).__webglFramebuffer
  }

  /** Put multisampled storage under `draw`, again whenever three has remade its framebuffer (a resize does). */
  private ensureMsaa(): void {
    if (this.samples < 2) return
    const fb = this.framebufferOf(this.draw)
    const { width: w, height: h } = this.draw
    const m = this.msaa
    if (m && m.fb === fb && m.w === w && m.h === h) return
    const gl = this.renderer.getContext() as WebGL2RenderingContext
    if (m) {
      gl.deleteRenderbuffer(m.color)
      gl.deleteRenderbuffer(m.depth)
      this.msaa = null
    }
    const color = gl.createRenderbuffer()
    const depth = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, color)
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.samples, gl.RGBA8, w, h)
    gl.bindRenderbuffer(gl.RENDERBUFFER, depth)
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.samples, gl.DEPTH_COMPONENT24, w, h)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    this.renderer.state.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, color)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth)
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      // Not this driver: have three remake the target with its own plain attachments, and draw without.
      gl.deleteRenderbuffer(color)
      gl.deleteRenderbuffer(depth)
      this.samples = 0
      this.draw.dispose()
      this.renderer.setRenderTarget(this.draw)
      return
    }
    this.msaa = { fb, color, depth, w, h }
  }

  /** How much of the camera look to apply: 1 in the suit, 0 for a clean image (build mode). */
  setStrength(s: number): void {
    this.strength = Math.max(0, Math.min(1, s))
  }

  /** A burst of static and a flash, for the optics coming online. It decays on its own. */
  pulse(amount = 1): void {
    this.pulseAmount = Math.max(this.pulseAmount, amount)
  }

  /** Start drawing a frame into the offscreen buffer. */
  begin(): void {
    this.ensureMsaa()
    this.renderer.setRenderTarget(this.draw)
    this.renderer.clear()
  }

  /** Copy the frame out of the draw buffer into `target`: the one resolve a frame costs. */
  private resolve(): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext
    const state = this.renderer.state
    const from = this.framebufferOf(this.draw)
    const to = this.framebufferOf(this.target)
    const { width: w, height: h } = this.draw
    state.bindFramebuffer(gl.READ_FRAMEBUFFER, from)
    state.bindFramebuffer(gl.DRAW_FRAMEBUFFER, to)
    gl.blitFramebuffer(0, 0, w, h, 0, 0, w, h, gl.COLOR_BUFFER_BIT, gl.NEAREST)
    // The next frame starts with a clear, so none of this needs keeping: telling the driver saves it the writes.
    gl.invalidateFramebuffer(gl.READ_FRAMEBUFFER, [gl.COLOR_ATTACHMENT0, gl.DEPTH_ATTACHMENT])
    state.bindFramebuffer(gl.READ_FRAMEBUFFER, null)
    state.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null)
  }

  /**
   * Put the frame on the canvas. `upscale` is how far it is being stretched (canvas
   * pixels per buffer pixel): at 1:1 there is nothing to restore and only a touch of
   * sharpening is applied; the more it is stretched, the more it gets. `dt` is seconds
   * since the last frame, for the static's decay.
   */
  present(upscale: number, dt = 1 / 60): void {
    const u = this.material.uniforms
    u.sharpness!.value = Math.max(0, Math.min(1, (upscale - 1) * 1.6 + 0.2))
    this.pulseAmount = Math.max(0, this.pulseAmount - dt * 1.7)
    u.uPulse!.value = this.pulseAmount
    u.uStrength!.value = this.strength
    // Wrapped so the float stays precise over a long session.
    u.uTime!.value = (performance.now() / 1000) % 600
    this.resolve()
    if (this.fsr) {
      // EASU: the frame, upscaled to the canvas's own pixels.
      const out = this.renderer.getDrawingBufferSize(this.outSize)
      if (this.easu.width !== out.x || this.easu.height !== out.y) this.easu.setSize(out.x, out.y)
      const con = easuCon0(this.target.width, this.target.height, out.x, out.y)
      ;(this.easuMaterial.uniforms.con0!.value as THREE.Vector4).set(...con)
      this.renderer.setRenderTarget(this.easu)
      this.renderer.render(this.easuScene, this.camera)
      u.tFrame!.value = this.easu.texture
      u.texel!.value.set(1 / out.x, 1 / out.y)
    } else {
      u.tFrame!.value = this.target.texture
      u.texel!.value.set(1 / this.target.width, 1 / this.target.height)
    }
    this.renderer.setRenderTarget(null)
    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    const gl = this.renderer.getContext()
    if (this.msaa) {
      gl.deleteRenderbuffer(this.msaa.color)
      gl.deleteRenderbuffer(this.msaa.depth)
    }
    this.draw.dispose()
    this.target.dispose()
    this.easu.dispose()
    this.material.dispose()
    this.easuMaterial.dispose()
  }
}
