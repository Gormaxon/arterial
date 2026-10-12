/**
 * The GPU side of the particle engine: one batch per style, each a single draw call shared
 * by every effect drawn in that style.
 *
 * A batch is a RING of particle records. A record is written once, when the particle is
 * born — where, how fast, when, for how long, which effect layer — and never touched
 * again: the vertex shader works out where the particle is now and how it looks from the
 * clock (curves.ts). So the per-frame cost on the CPU is one uniform, and the upload is
 * only the records born that frame, in at most two contiguous ranges of one interleaved
 * buffer. Dead and unborn records are pushed outside the clip volume in the vertex shader
 * and cost no raster at all; the whole batch is switched off once its last particle dies.
 *
 * A record is 16 floats:
 *    0- 2  birth position           3  birth time (engine clock)
 *    4- 6  birth velocity           7  life, seconds
 *    8     gravity                  9  drag
 *   10     size                    11  first ramp row of the layer
 *   12-14  style-specific          15  style-specific
 *     points:  12 rotation, 13 spin, 14 alpha, 15 bearing from the emitter's axis (for billow)
 *     streak:  14 alpha, 15 floor-hit age (or -1)
 *     tracer:  12-14 where it is drawn from (a muzzle), 15 alpha
 *     fireball: 14 alpha
 */

import * as THREE from 'three'
import { MOTION_GLSL, RAMP_GLSL } from './curves'

export const STRIDE = 16

/** Shared by every particle material, so one write updates them all. */
export interface SharedUniforms {
  uTime: { value: number }
  uRamp: { value: THREE.Texture }
}

/** A per-particle seed from its slot, so the record need not carry one. */
const SEED_GLSL = /* glsl */ `
float ptSeed(float id) { return fract(sin(id * 12.9898 + 78.233) * 43758.5453); }
`

export abstract class Batch {
  readonly data: Float32Array
  /** What is added to the scene. Built by the subclass once its own fields exist. */
  object!: THREE.Object3D
  /** Records written ever; the next one goes in slot `written % capacity`. */
  written = 0
  /** When the last particle written dies (engine clock). After it the batch is switched off. */
  lastDeath = -1
  private dirtyLo = -1
  private dirtyHi = -1
  protected abstract readonly buffer: THREE.InterleavedBuffer

  constructor(readonly capacity: number) {
    this.data = new Float32Array(capacity * STRIDE)
  }

  protected abstract build(): THREE.Object3D

  /** Claim the next slot, recycling the oldest when full. Returns the record's offset into `data`. */
  claim(): number {
    const slot = this.written % this.capacity
    this.written++
    // Track the span written this frame in "written" order, so a wrap is two ranges.
    if (this.dirtyLo < 0) this.dirtyLo = this.written - 1
    this.dirtyHi = this.written
    return slot * STRIDE
  }

  /** The slot index a handle (a `written` count at claim time) lives in, if it has not been recycled. */
  slotOf(handle: number): number {
    if (handle < 0 || handle >= this.written || handle < this.written - this.capacity) return -1
    return handle % this.capacity
  }

  /** Mark one already-written slot for re-upload (a tracer cut short). */
  touch(slot: number): void {
    const attr = this.buffer
    attr.addUpdateRange(slot * STRIDE, STRIDE)
    attr.needsUpdate = true
  }

  /** Send this frame's new records and decide whether there is anything to draw. */
  flush(now: number): void {
    // Idle and nothing new: nothing to do (the common case for most styles, most frames).
    if (this.dirtyLo < 0 && !this.object.visible && now >= this.lastDeath) return
    const buf = this.buffer
    if (this.dirtyLo >= 0) {
      const n = this.dirtyHi - this.dirtyLo
      if (n >= this.capacity) {
        buf.addUpdateRange(0, this.capacity * STRIDE)
      } else {
        const a = this.dirtyLo % this.capacity
        const b = a + n
        if (b <= this.capacity) buf.addUpdateRange(a * STRIDE, n * STRIDE)
        else {
          buf.addUpdateRange(a * STRIDE, (this.capacity - a) * STRIDE)
          buf.addUpdateRange(0, (b - this.capacity) * STRIDE)
        }
      }
      buf.needsUpdate = true
      this.dirtyLo = this.dirtyHi = -1
    }
    const live = now < this.lastDeath
    this.object.visible = live
    if (live) this.setDrawCount(Math.min(this.written, this.capacity))
  }

  protected abstract setDrawCount(n: number): void

  /** Shift every birth time back by `dt` (the engine clock was rebased) and resend everything. */
  rebase(dt: number): void {
    const n = Math.min(this.written, this.capacity)
    for (let i = 0; i < n; i++) this.data[i * STRIDE + 3]! -= dt
    if (this.lastDeath > 0) this.lastDeath -= dt
    this.buffer.addUpdateRange(0, n * STRIDE)
    this.buffer.needsUpdate = true
  }

  clear(): void {
    // Everything dies now: zero the lives and resend, so a reused slot cannot flash its old particle.
    const n = Math.min(this.written, this.capacity)
    for (let i = 0; i < n; i++) this.data[i * STRIDE + 7] = 0
    if (n > 0) {
      this.buffer.addUpdateRange(0, n * STRIDE)
      this.buffer.needsUpdate = true
    }
    this.lastDeath = -1
    this.object.visible = false
  }
}

// ---------------------------------------------------------------------------
// Sprites: soft, smoke, glow
// ---------------------------------------------------------------------------

/** A soft, lumpy puff: dense in the middle, a feathered irregular edge. */
function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function vnoise(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

/** Sprite shapes in the atlas, by the index a layer's `sprite` picks. */
export const SPRITES = { puff: 0, lick: 1 } as const

let atlas: THREE.Texture | null | undefined
/**
 * The sprite atlas: two 128 px cells side by side.
 *   puff  a soft, lumpy cloud — dense in the middle, a feathered irregular edge (dust, smoke, steam)
 *   lick  a firmer round blob with a wavering edge — a flame lick or an ember, so a crowd of them reads as
 *         flame rather than as one soft glow (the old exhaust vent's own sprite)
 * Each sprite spins at its own rate, so the one fixed shape still never repeats on screen.
 */
export function spriteAtlas(): THREE.Texture | null {
  if (atlas !== undefined) return atlas
  atlas = null
  if (typeof document === 'undefined') return null
  const S = 128
  const c = document.createElement('canvas')
  c.width = S * 2
  c.height = S
  const ctx = c.getContext('2d')
  if (!ctx) return null
  const img = ctx.createImageData(S * 2, S)
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (x + 0.5) / S - 0.5
      const dy = (y + 0.5) / S - 0.5
      const r = Math.hypot(dx, dy) * 2
      const n = vnoise(x * 0.09, y * 0.09) * 0.5 + vnoise(x * 0.19 + 7, y * 0.19 + 3) * 0.3 + vnoise(x * 0.41 + 1, y * 0.41 + 9) * 0.2
      const edge = 0.5 + 0.5 * n
      const a = Math.min(1, Math.max(0, (edge - r) / 0.4))
      const puffA = a * a * (3 - 2 * a) * (0.82 + 0.18 * Math.exp(-r * r * 3))
      // The lick: solid to a third of the way out, then a falloff whose start wavers round the rim.
      const wob = 0.12 * Math.sin(Math.atan2(dy, dx) * 5 + 1.3)
      const t = Math.min(1, Math.max(0, (r - (0.35 + wob)) / (1 - (0.35 + wob))))
      const lickA = r >= 1 ? 0 : 1 - t * t * (3 - 2 * t)
      const i = (y * S * 2 + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255
      img.data[i + 3] = Math.round(255 * Math.min(1, puffA))
      const j = (y * S * 2 + x + S) * 4
      img.data[j] = img.data[j + 1] = img.data[j + 2] = 255
      img.data[j + 3] = Math.round(255 * Math.min(1, lickA))
    }
  }
  ctx.putImageData(img, 0, 0)
  atlas = new THREE.CanvasTexture(c)
  atlas.colorSpace = THREE.SRGBColorSpace
  return atlas
}

const SPRITE_VERT = /* glsl */ `
attribute float aBirth;
attribute vec4 aVel;    // xyz velocity, w life
attribute vec4 aPhys;   // gravity, drag, size, row
attribute vec4 aMisc;   // rotation, spin, alpha, bearing from the emitter's axis
uniform float uTime;
uniform float uScale;
uniform float uMaxPx;
varying vec3 vColor;
varying float vAlpha;
varying vec2 vRot;
varying float vCell;
${RAMP_GLSL}
${MOTION_GLSL}
${SEED_GLSL}
void main() {
  float age = uTime - aBirth;
  float life = aVel.w;
  if (age < 0.0 || age >= life) {
    // Unborn or dead: outside the clip volume, no raster.
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vAlpha = 0.0;
    return;
  }
  float a = age / life;
  float row = aPhys.w;
  vec3 p = ptTraj(position, aVel.xyz, aPhys.x, aPhys.y, age);
  vec4 k = ptConst(row, 0);
  if (k.x > 0.0) {
    // Wander, growing over the life, out of phase per particle.
    float s = ptSeed(float(gl_VertexID)) * 40.0;
    float w = 6.2832 * k.y * age;
    p.xz += k.x * a * vec2(sin(w + s), cos(w * 0.87 + s * 1.3));
  }
  vec4 k1 = ptConst(row, 1);
  if (k1.w > 0.0) {
    // Billow: thrown out from the column's axis, slowly and then faster, as a rising flame or plume spreads.
    p.xz += k1.w * a * a * vec2(cos(aMisc.w), sin(aMisc.w));
  }
  vec4 look = ptRamp(row, a);
  vec4 sz = ptRamp(row + 1.0, a);
  vCell = k1.z * 0.5;
  // Everything that is the same over a whole sprite is done here, once, not per pixel.
  vColor = pow(max(look.rgb, vec3(0.0)), vec3(0.4545));
  float rot = aMisc.x + aMisc.y * age;
  vRot = vec2(cos(rot), sin(rot));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float px = aPhys.z * sz.x * uScale / max(-mv.z, 0.001);
  // A sprite swollen to a large part of the screen is nothing but overdraw: it thins out
  // as it nears the cap and is never drawn larger.
  vAlpha = look.a * aMisc.z * (1.0 - smoothstep(uMaxPx * 0.45, uMaxPx, px));
  gl_PointSize = min(px, uMaxPx);
  gl_Position = projectionMatrix * mv;
  if (vAlpha < 0.004) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`

const SPRITE_FRAG = /* glsl */ `
uniform sampler2D uMap;
varying vec3 vColor;
varying float vAlpha;
varying vec2 vRot;
varying float vCell;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  vec2 p = vec2(vRot.x * q.x - vRot.y * q.y, vRot.y * q.x + vRot.x * q.y) + 0.5;
  // Rotation can carry a corner outside the cell; clamp so it never reads the neighbouring sprite.
  p = clamp(p, 0.004, 0.996);
  float a = texture2D(uMap, vec2(vCell + p.x * 0.5, p.y)).a * vAlpha;
#ifdef SHADED
  // Smoke is a volume lit from above: brighter at the top of each puff, darker underneath,
  // denser in the middle. Unrotated coordinates, so the light stays overhead as it spins.
  float lit = mix(1.18, 0.62, smoothstep(-0.45, 0.45, q.y));
  gl_FragColor = vec4(vColor * lit, a);
#else
  gl_FragColor = vec4(vColor, a);
#endif
}`

export class SpriteBatch extends Batch {
  protected buffer!: THREE.InterleavedBuffer
  private geometry!: THREE.BufferGeometry
  material!: THREE.ShaderMaterial

  constructor(
    capacity: number,
    private readonly shared: SharedUniforms,
    private readonly blending: THREE.Blending,
    private readonly shaded: boolean,
    private readonly order: number,
  ) {
    super(capacity)
    this.object = this.build()
  }

  protected build(): THREE.Object3D {
    this.buffer = new THREE.InterleavedBuffer(this.data, STRIDE).setUsage(THREE.DynamicDrawUsage)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.InterleavedBufferAttribute(this.buffer, 3, 0))
    g.setAttribute('aBirth', new THREE.InterleavedBufferAttribute(this.buffer, 1, 3))
    g.setAttribute('aVel', new THREE.InterleavedBufferAttribute(this.buffer, 4, 4))
    g.setAttribute('aPhys', new THREE.InterleavedBufferAttribute(this.buffer, 4, 8))
    g.setAttribute('aMisc', new THREE.InterleavedBufferAttribute(this.buffer, 4, 12))
    g.setDrawRange(0, 0)
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6)
    this.geometry = g
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: this.shared.uTime,
        uRamp: this.shared.uRamp,
        uMap: { value: spriteAtlas() },
        // Pixels per metre at unit distance; set for whatever camera and target it is drawn with.
        uScale: { value: 600 },
        uMaxPx: { value: 400 },
      },
      defines: this.shaded ? { SHADED: '' } : {},
      vertexShader: SPRITE_VERT,
      fragmentShader: SPRITE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: this.blending,
    })
    const points = new THREE.Points(g, this.material)
    points.frustumCulled = false
    points.renderOrder = this.order
    points.visible = false
    points.onBeforeRender = (renderer, _scene, camera) => sizeForTarget(renderer, camera, this.material)
    return points
  }

  protected setDrawCount(n: number): void {
    this.geometry.setDrawRange(0, n)
  }
}

const _buf = new THREE.Vector2()

/**
 * Keep sprites a true world size whatever they are drawn into: the drawing buffer, the
 * upscaler's smaller target, frame generation's overscanned capture. `gl_PointSize` is in
 * pixels of whatever is bound, so the projection's pixels-per-metre is worked out from it.
 */
function sizeForTarget(renderer: THREE.WebGLRenderer, camera: THREE.Camera, material: THREE.ShaderMaterial): void {
  const cam = camera as THREE.PerspectiveCamera
  if (!cam.isPerspectiveCamera) return
  const rt = renderer.getRenderTarget()
  const h = rt ? rt.height : renderer.getDrawingBufferSize(_buf).y
  // A view offset draws a window of a larger image into the target: scale by how much of it.
  const view = cam.view && cam.view.enabled ? cam.view.fullHeight / cam.view.height : 1
  const scale = (h * view) / (2 * Math.tan((cam.fov * Math.PI) / 360) / cam.zoom)
  const u = material.uniforms
  u.uScale!.value = scale
  u.uMaxPx!.value = h * 0.4
}

// ---------------------------------------------------------------------------
// Streaks: sparks
// ---------------------------------------------------------------------------

const STREAK_VERT = /* glsl */ `
attribute vec4 iA;   // birth position, birth
attribute vec4 iB;   // velocity, life
attribute vec4 iC;   // gravity, drag, size, row
attribute vec4 iD;   // -, -, alpha, floor-hit age
uniform float uTime;
varying vec3 vCol;
varying vec2 vUv;
varying float vA;
${RAMP_GLSL}
${MOTION_GLSL}
void main() {
  float age = uTime - iA.w;
  float life = iB.w;
  if (age < 0.0 || age >= life) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vA = 0.0; return; }
  float row = iC.w;
  float a = age / life;
  vec3 p; vec3 v;
  float th = iD.w;
  if (th >= 0.0 && age > th) {
    // Off the floor: where and how fast it hit, the bounce, then the same motion again.
    vec3 p1 = ptTraj(iA.xyz, iB.xyz, iC.x, iC.y, th);
    vec3 v1 = ptVel(iB.xyz, iC.x, iC.y, th);
    float keep = ptConst(row, 0).w;
    v1 = vec3(v1.x * 0.72, -v1.y * keep, v1.z * 0.72);
    p = ptTraj(p1, v1, iC.x, iC.y, age - th);
    v = ptVel(v1, iC.x, iC.y, age - th);
    // One bounce is drawn; after it, it slides rather than sinking through.
    if (p.y < p1.y) { p.y = p1.y; v.y = 0.0; }
  } else {
    p = ptTraj(iA.xyz, iB.xyz, iC.x, iC.y, age);
    v = ptVel(iB.xyz, iC.x, iC.y, age);
  }
  vec4 look = ptRamp(row, a);
  float width = iC.z * ptRamp(row + 1.0, a).y;
  float stretch = ptConst(row, 0).z;
  vec4 vp = viewMatrix * vec4(p, 1.0);
  vec3 vv = (viewMatrix * vec4(v, 0.0)).xyz;
  // Only motion across the screen draws as length: a spark flying at you is a dot.
  float sp = length(vv.xy);
  vec2 d = sp > 1e-4 ? vv.xy / sp : vec2(0.0, 1.0);
  float len = max(width * 1.4, sp * stretch);
  vec2 perp = vec2(-d.y, d.x);
  vp.xy += perp * position.x * width + d * (position.y - 0.5) * len;
  gl_Position = projectionMatrix * vp;
  vCol = look.rgb;
  vUv = uv;
  vA = look.a * iD.z;
}`

const STREAK_FRAG = /* glsl */ `
varying vec3 vCol;
varying vec2 vUv;
varying float vA;
void main() {
  float h = vUv.y;
  float across = smoothstep(0.0, 0.7, 1.0 - abs(vUv.x * 2.0 - 1.0));
  float along = pow(h, 1.5);
  float core = smoothstep(0.72, 1.0, h) * across;
  vec3 c = vCol * (0.55 + along) + vec3(core) * 0.55;
  // Linear to sRGB by square root: within a few percent for hot colours, far cheaper than pow.
  gl_FragColor = vec4(sqrt(max(c, vec3(0.0))), vA * along * across);
}`

/** Shared shape of the instanced styles: a unit quad (or a given mesh), one instance per record. */
abstract class InstancedBatch extends Batch {
  protected buffer!: THREE.InstancedInterleavedBuffer
  protected geometry!: THREE.InstancedBufferGeometry
  material!: THREE.ShaderMaterial

  protected instanced(base: THREE.BufferGeometry, material: THREE.ShaderMaterial, order: number): THREE.Mesh {
    this.buffer = new THREE.InstancedInterleavedBuffer(this.data, STRIDE).setUsage(THREE.DynamicDrawUsage)
    const g = new THREE.InstancedBufferGeometry()
    g.index = base.index
    g.setAttribute('position', base.attributes.position!)
    if (base.attributes.uv) g.setAttribute('uv', base.attributes.uv)
    if (base.attributes.normal) g.setAttribute('normal', base.attributes.normal)
    g.setAttribute('iA', new THREE.InterleavedBufferAttribute(this.buffer, 4, 0))
    g.setAttribute('iB', new THREE.InterleavedBufferAttribute(this.buffer, 4, 4))
    g.setAttribute('iC', new THREE.InterleavedBufferAttribute(this.buffer, 4, 8))
    g.setAttribute('iD', new THREE.InterleavedBufferAttribute(this.buffer, 4, 12))
    g.instanceCount = 0
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6)
    this.geometry = g
    this.material = material
    const mesh = new THREE.Mesh(g, material)
    mesh.frustumCulled = false
    mesh.renderOrder = order
    mesh.visible = false
    return mesh
  }

  protected setDrawCount(n: number): void {
    this.geometry.instanceCount = n
  }
}

export class StreakBatch extends InstancedBatch {
  constructor(capacity: number, private readonly shared: SharedUniforms) {
    super(capacity)
    this.object = this.build()
  }

  protected build(): THREE.Object3D {
    return this.instanced(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({
        uniforms: { uTime: this.shared.uTime, uRamp: this.shared.uRamp },
        vertexShader: STREAK_VERT,
        fragmentShader: STREAK_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        // One pass: a double-sided transparent material is otherwise drawn twice.
        forceSinglePass: true,
      }),
      5,
    )
  }
}

// ---------------------------------------------------------------------------
// Tracers
// ---------------------------------------------------------------------------

const TRACER_VERT = /* glsl */ `
attribute vec4 iA;   // birth position, birth
attribute vec4 iB;   // velocity, life
attribute vec4 iC;   // gravity, drag, width, row
attribute vec4 iD;   // drawn-from point (muzzle), alpha
uniform float uTime;
uniform float uViewH;  // pixel height of what it is drawn into
varying vec3 vCol;
varying vec2 vUv;
varying float vA;
varying float vLen;
${RAMP_GLSL}
${MOTION_GLSL}
// Distance flown along the line and the speed now, under drag that goes as v² (a round's).
vec2 quadFlight(float v0, float d, float t) {
  if (d < 1e-6) return vec2(v0 * t, v0);
  float q = 1.0 + d * v0 * t;
  return vec2(log(q) / d, v0 / q);
}
// Where the round is at time t, which way it is going, how far it has come and how fast it is going now.
void flight(float t, float quad, out vec3 head, out vec3 dir, out float flown, out float speed) {
  float v0 = length(iB.xyz);
  vec3 d0 = iB.xyz / max(v0, 1e-4);
  if (quad > 0.5) {
    // A round: drag as v² along the line, gravity across it.
    vec2 f = quadFlight(v0, iC.y, t);
    head = iA.xyz + d0 * f.x - vec3(0.0, 0.5 * iC.x * t * t, 0.0);
    vec3 v = d0 * f.y - vec3(0.0, iC.x * t, 0.0);
    dir = normalize(v);
    flown = f.x;
    speed = length(v);
  } else {
    head = ptTraj(iA.xyz, iB.xyz, iC.x, iC.y, t);
    vec3 v = ptVel(iB.xyz, iC.x, iC.y, t);
    dir = normalize(v);
    flown = length(head - iA.xyz);
    speed = length(v);
  }
}
const float LINGER = 0.09;
void main() {
  float age = uTime - iA.w;
  float life = iB.w;
  if (age < 0.0 || age >= life) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vA = 0.0; return; }
  float row = iC.w;
  vec4 k1 = ptConst(row, 1);
  vec4 k2 = ptConst(row, 2);
  vec3 head; vec3 dir; float flown; float speed;
  // Ended (negative alpha): the round stopped at life - LINGER. The head stays there; the tail keeps coming.
  bool ended = iD.w < 0.0;
  float stopAt = ended ? max(0.0, life - LINGER) : 1e9;
  flight(min(age, stopAt), k1.y, head, dir, flown, speed);
  // As long as the effect says, and never shorter than the stretch of flight the eye keeps between frames.
  float len = max(k1.x, speed * k2.y);
  float tailLen = min(len, flown);
  float burn = 1.0;
  if (ended && age > stopAt) {
    // Stopped: the tail draws in to the head over LINGER and burns out. Slower than the round itself would run it
    // in, on purpose: a round reaches a wall ten metres off in a hundredth of a second, and the streak the eye
    // keeps of it is the only tracer anyone sees.
    float k = (age - stopAt) / LINGER;
    tailLen *= 1.0 - k;
    burn = 1.0 - k * k;
  }
  // Tumbling (a ricochet): brightest each time it turns side-on, a dull spark end-on; fatter as it flares.
  float flare = 1.0;
  if (k2.x > 0.0) {
    float turn = abs(sin(age * k2.x * 3.14159 + fract(iA.w * 7.31) * 6.2832));
    flare = 0.25 + 0.75 * turn * turn;
  }
  vec3 tail = head - dir * tailLen;
  // For the first few metres the tail is drawn back to where it was fired from — a muzzle —
  // so a round that really left the eye still appears to leave the barrel.
  tail = mix(iD.xyz, tail, clamp(flown / 6.0, 0.0, 1.0));
  vec4 vh = viewMatrix * vec4(head, 1.0);
  vec4 vt = viewMatrix * vec4(tail, 1.0);
  float w = iC.z * ptRamp(row + 1.0, age / life).y * (0.75 + 0.5 * flare);
  // A round coming straight at you is end-on: its streak shrank to nothing and incoming fire was invisible. On screen
  // a tracer is never shorter than a few widths, so one flying at you is a burning streak growing toward you.
  vec2 axis = vh.xy - vt.xy;
  float al = length(axis);
  float minLen = max(w, 2.0 * max(-vh.z, 0.05) / (projectionMatrix[1][1] * uViewH)) * 7.0;
  if (al < minLen) {
    // Too short to have a direction of its own (end-on, or a stopped tail run in to the head): along its flight.
    vec2 fd = vh.xy - (viewMatrix * vec4(head - dir, 1.0)).xy;
    vec2 ad = al > 1e-6 ? axis / al : (length(fd) > 1e-6 ? normalize(fd) : vec2(0.0, 1.0));
    vt.xy = vh.xy - ad * minLen;
    vt.z = vh.z;
    axis = vh.xy - vt.xy;
    al = minLen;
  }
  vec2 side = vec2(-axis.y, axis.x) / al;
  vec4 vp = mix(vt, vh, position.y + 0.5);
  // Never thinner than a couple of pixels wherever it is: a far tracer stays a thin bright line instead of breaking
  // up into crawling dots. A widened one is dimmed by as much, so it does not get brighter for being far away.
  float px = 2.0 * max(-vp.z, 0.05) / (projectionMatrix[1][1] * uViewH);
  float core = max(w, px * 2.6);
  // The quad is four times the core: the glow round it is part of the tracer, not a separate thing.
  vp.xy += side * position.x * core * 6.0;
  gl_Position = projectionMatrix * vp;
  vec4 look = ptRamp(row, age / life);
  vCol = look.rgb;
  vUv = uv;
  vA = look.a * abs(iD.w) * sqrt(w / core) * burn * flare;
  vLen = al;
}`

const TRACER_FRAG = /* glsl */ `
varying vec3 vCol;
varying vec2 vUv;
varying float vA;
varying float vLen;
void main() {
  float u = abs(vUv.x - 0.5) * 2.0;     // 0 on the line, 1 at the edge of the glow
  float t = 1.0 - vUv.y;                // 0 at the head, 1 at the tail
  // A white-hot thread, the tracer's colour round it, and a wide faint halo.
  // The quad is six cores wide: u = 0.17 is the edge of the core.
  float thread = exp(-u * u * 160.0);
  float body = exp(-u * u * 22.0);
  float halo = exp(-u * u * 4.0) * (1.0 - u * u);
  // Brightest at the head, the burning compound, then trailing off; the very end of the tail feathers out.
  float head = exp(-t * 9.0);
  float trail = pow(1.0 - t, 1.6) * smoothstep(1.0, 0.86, t);
  float hot = thread * (0.6 + 0.9 * head) * (0.35 + trail);
  float glow = body * (0.55 + 0.9 * head) * trail + halo * 0.3 * (0.4 + trail);
  float a = min(1.0, hot * 1.5 + glow) * vA;
  vec3 c = mix(vCol, vec3(1.0, 0.96, 0.86), clamp(hot * 1.3, 0.0, 1.0));
  gl_FragColor = vec4(sqrt(max(c, vec3(0.0))), a);
}`

export class TracerBatch extends InstancedBatch {
  constructor(capacity: number, private readonly shared: SharedUniforms) {
    super(capacity)
    this.object = this.build()
  }

  protected build(): THREE.Object3D {
    return this.instanced(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({
        uniforms: { uTime: this.shared.uTime, uRamp: this.shared.uRamp, uViewH: { value: 760 } },
        vertexShader: TRACER_VERT,
        fragmentShader: TRACER_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        forceSinglePass: true,
      }),
      4,
    )
  }

  protected override instanced(base: THREE.BufferGeometry, material: THREE.ShaderMaterial, order: number): THREE.Mesh {
    const mesh = super.instanced(base, material, order)
    // The minimum width is in pixels of whatever it is drawn into.
    mesh.onBeforeRender = (renderer) => {
      const rt = renderer.getRenderTarget()
      material.uniforms.uViewH!.value = rt ? rt.height : renderer.getDrawingBufferSize(_buf).y
    }
    return mesh
  }
}

// ---------------------------------------------------------------------------
// Fireballs
// ---------------------------------------------------------------------------

const FIREBALL_VERT = /* glsl */ `
attribute vec4 iA;
attribute vec4 iB;
attribute vec4 iC;
attribute vec4 iD;
uniform float uTime;
varying vec3 vCol;
varying float vA;
${RAMP_GLSL}
${MOTION_GLSL}
void main() {
  float age = uTime - iA.w;
  float life = iB.w;
  if (age < 0.0 || age >= life) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vA = 0.0; return; }
  float a = age / life;
  float row = iC.w;
  vec3 c = ptTraj(iA.xyz, iB.xyz, iC.x, iC.y, age);
  float r = iC.z * ptRamp(row + 1.0, a).x;
  vec4 look = ptRamp(row, a);
  vec3 wp = c + position * r;
  vec4 mv = modelViewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mv;
  vCol = look.rgb;
  vA = look.a * iD.z;
}`

const FIREBALL_FRAG = /* glsl */ `
varying vec3 vCol;
varying float vA;
void main() {
  gl_FragColor = vec4(sqrt(max(vCol, vec3(0.0))), vA);
}`

export class FireballBatch extends InstancedBatch {
  constructor(capacity: number, private readonly shared: SharedUniforms) {
    super(capacity)
    this.object = this.build()
  }

  protected build(): THREE.Object3D {
    return this.instanced(
      new THREE.SphereGeometry(1, 18, 12),
      new THREE.ShaderMaterial({
        uniforms: { uTime: this.shared.uTime, uRamp: this.shared.uRamp },
        vertexShader: FIREBALL_VERT,
        fragmentShader: FIREBALL_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      6,
    )
  }
}
