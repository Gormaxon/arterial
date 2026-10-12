/**
 * The maths every particle shares: how it moves and how it looks over its life.
 *
 * Motion is CLOSED FORM. A particle is launched from p0 at v0 under gravity g (down) and
 * linear drag k (dv/dt = -k·v - g·ŷ), which has an exact solution — so where a particle
 * is at any moment is a function of its age alone, and the GPU works it out per vertex
 * from the clock. Nothing is stepped on the CPU and nothing is re-uploaded after a
 * particle is born. The same functions are mirrored here in TypeScript, for the few
 * things that have to be known at birth: where a spark will hit the floor, where a
 * flame lick will be when it burns out and turns to smoke.
 *
 * Looks are CURVES baked into a ramp texture, one row set per effect layer: colour and
 * alpha over the life, size over the life, streak width over the life. A model is a
 * function that fills those curves from a layer's few numbers — `puff` is how dust and
 * smoke have always behaved here, `spark` how sparks cool, `flame` how a flame lick goes
 * white to yellow to orange to red — so existing effects keep their look exactly, and a
 * new effect can name a model or give its own curves.
 */

import * as THREE from 'three'

/** Samples per curve. Plenty: every curve is smooth, and the shader interpolates between samples. */
export const RAMP_W = 64

/** Rows of the ramp texture each layer owns: colour+alpha, size+width, constants. */
export const ROWS_PER_LAYER = 3

// ---------------------------------------------------------------------------
// Closed-form motion (mirrored in the shaders: keep the two in step)
// ---------------------------------------------------------------------------

/** Below this drag the exponential form loses precision; the drag-free form is used instead. */
const K_EPS = 1e-4

/** Position at age `t` of a particle launched from p0 at v0, gravity `g` (positive = down), linear drag `k`. */
export function trajectory(p0: THREE.Vector3, v0: THREE.Vector3, g: number, k: number, t: number, out: THREE.Vector3): THREE.Vector3 {
  if (k > K_EPS) {
    const f = (1 - Math.exp(-k * t)) / k
    out.set(p0.x + v0.x * f, p0.y + v0.y * f - (g / k) * (t - f), p0.z + v0.z * f)
  } else {
    out.set(p0.x + v0.x * t, p0.y + v0.y * t - 0.5 * g * t * t, p0.z + v0.z * t)
  }
  return out
}

/** Velocity at age `t`; see `trajectory`. */
export function velocity(v0: THREE.Vector3, g: number, k: number, t: number, out: THREE.Vector3): THREE.Vector3 {
  if (k > K_EPS) {
    const e = Math.exp(-k * t)
    out.set(v0.x * e, v0.y * e - (g / k) * (1 - e), v0.z * e)
  } else {
    out.set(v0.x, v0.y - g * t, v0.z)
  }
  return out
}

/** Height at age `t` alone: the floor search runs this many times per spark. */
function heightAt(y0: number, vy0: number, g: number, k: number, t: number): number {
  if (k > K_EPS) {
    const f = (1 - Math.exp(-k * t)) / k
    return y0 + vy0 * f - (g / k) * (t - f)
  }
  return y0 + vy0 * t - 0.5 * g * t * t
}

/**
 * The age at which a particle first comes down through `floor`, or -1 if it does not
 * within `life`. Height under gravity and drag rises (at most once) and then only
 * falls, so after the apex a bisection is exact to well under a frame.
 */
export function floorHitTime(y0: number, vy0: number, g: number, k: number, floor: number, life: number): number {
  if (y0 <= floor) return vy0 < 0 ? 0 : -1
  if (heightAt(y0, vy0, g, k, life) > floor) return -1
  // Start the search at the apex: before it the particle is still climbing.
  let lo = 0
  if (vy0 > 0 && g > 0) {
    // vy(t) = 0 at t = ln(1 + k·vy0/g)/k (drag-free: vy0/g).
    lo = k > K_EPS ? Math.log(1 + (k * vy0) / g) / k : vy0 / g
    lo = Math.min(lo, life)
  }
  let hi = life
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) * 0.5
    if (heightAt(y0, vy0, g, k, mid) > floor) lo = mid
    else hi = mid
  }
  return hi
}

/** GLSL twin of `trajectory` and `velocity`, shared by every particle shader. */
export const MOTION_GLSL = /* glsl */ `
vec3 ptTraj(vec3 p0, vec3 v0, float g, float k, float t) {
  if (k > 1e-4) {
    float f = (1.0 - exp(-k * t)) / k;
    return vec3(p0.x + v0.x * f, p0.y + v0.y * f - (g / k) * (t - f), p0.z + v0.z * f);
  }
  return vec3(p0.x + v0.x * t, p0.y + v0.y * t - 0.5 * g * t * t, p0.z + v0.z * t);
}
vec3 ptVel(vec3 v0, float g, float k, float t) {
  if (k > 1e-4) {
    float e = exp(-k * t);
    return vec3(v0.x * e, v0.y * e - (g / k) * (1.0 - e), v0.z * e);
  }
  return vec3(v0.x, v0.y - g * t, v0.z);
}
`

/** GLSL for reading a layer's curves out of the ramp texture. `row` is the layer's first row. */
export const RAMP_GLSL = /* glsl */ `
uniform highp sampler2D uRamp;
vec4 ptRamp(float row, float a) {
  float x = clamp(a, 0.0, 1.0) * ${RAMP_W - 1}.0;
  int x0 = int(floor(x));
  int x1 = min(x0 + 1, ${RAMP_W - 1});
  int r = int(row + 0.5);
  return mix(texelFetch(uRamp, ivec2(x0, r), 0), texelFetch(uRamp, ivec2(x1, r), 0), fract(x));
}
vec4 ptConst(float row, int i) {
  return texelFetch(uRamp, ivec2(i, int(row + 0.5) + 2), 0);
}
`

// ---------------------------------------------------------------------------
// Looks over the life
// ---------------------------------------------------------------------------

/** What a model is given: the layer's own colours and numbers. Colours are linear. */
export interface ModelInput {
  color: THREE.Color
  colorEnd: THREE.Color
  /** Peak opacity. */
  alpha: number
  /** Size at the end of life as a multiple of the start (puffs). */
  grow: number
  /** Fraction of the life spent fading in. */
  fadeIn: number
}

/** One sample of a layer's curves at `age` 0..1. Colour linear; size and width are multiples of the particle's size. */
export interface Sample {
  r: number
  g: number
  b: number
  a: number
  size: number
  width: number
}

export type Model = (age: number, m: ModelInput, out: Sample) => void

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t
const srgbToLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))

/** A flame lick's colour through its life: white-hot, yellow, orange, a dull red. */
export function flameColour(t: number, out: { r: number; g: number; b: number }): void {
  const stops: [number, number, number, number][] = [
    [0.0, 1.0, 0.96, 0.82],
    [0.12, 1.0, 0.82, 0.38],
    [0.38, 1.0, 0.5, 0.12],
    [0.7, 0.78, 0.2, 0.05],
    [1.0, 0.35, 0.06, 0.02],
  ]
  let k = 0
  while (k < stops.length - 2 && t > stops[k + 1]![0]) k++
  const [t0, r0, g0, b0] = stops[k]!
  const [t1, r1, g1, b1] = stops[k + 1]!
  const u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)))
  out.r = lerp(r0, r1, u)
  out.g = lerp(g0, g1, u)
  out.b = lerp(b0, b1, u)
}

/**
 * The built-in models. Each reproduces, sample for sample, the curve the old per-system
 * code computed every frame on the CPU — so moving an effect onto the engine does not
 * change how it looks.
 */
export const MODELS: Record<string, Model> = {
  /** Dust and smoke: blooms fast and settles, a quick fade in and a long soft fade out, colour drifting over the life. */
  puff(age, m, out) {
    const t = 1 - age
    out.r = lerp(m.color.r, m.colorEnd.r, age)
    out.g = lerp(m.color.g, m.colorEnd.g, age)
    out.b = lerp(m.color.b, m.colorEnd.b, age)
    out.a = m.alpha * Math.min(1, age / Math.max(1e-3, m.fadeIn)) * Math.pow(t, 1.25)
    out.size = 1 + (m.grow - 1) * (1 - t * t)
    out.width = 1
  },
  /** Sparks: white-hot as they leave, their own colour, then cooling toward dark as they thin and go out. */
  spark(age, m, out) {
    const t = 1 - age
    const hot = Math.max(0, 1 - age * 4.5)
    const cool = 0.25 + 0.75 * Math.min(1, t * 1.6)
    out.r = (m.color.r + (1 - m.color.r) * hot * 0.7) * cool
    out.g = (m.color.g + (1 - m.color.g) * hot * 0.7) * cool * (0.55 + 0.45 * t)
    out.b = (m.color.b + (1 - m.color.b) * hot * 0.7) * cool * (0.35 + 0.65 * t)
    out.a = m.alpha * Math.min(1, age / 0.04) * Math.min(1, t * 2.2)
    // Streak widths at call sites were tuned for round sprites: a streak is about half as wide.
    out.width = 0.55 * (0.35 + 0.65 * t)
    out.size = 1
  },
  /** A flame lick: white to yellow to orange to red, swelling as it rises, a quick flare and a long fade. */
  flame(age, m, out) {
    flameColour(age, out)
    // The vent's licks wrote these straight to the screen; the ramp holds linear colour.
    out.r = srgbToLinear(out.r)
    out.g = srgbToLinear(out.g)
    out.b = srgbToLinear(out.b)
    const fade = age < 0.08 ? age / 0.08 : 1 - Math.pow((age - 0.08) / 0.92, 1.6)
    out.a = m.alpha * fade
    // The vent's licks went from 0.32 to 1.57 times their size; `size` is the size at birth.
    out.size = (0.32 + age * 1.25) / 0.32
    out.width = 1
  },
  /** Plain smoke from a fire: in quickly, out over the rest, swelling to several times its size. */
  smoke(age, m, out) {
    out.r = lerp(m.color.r, m.colorEnd.r, age)
    out.g = lerp(m.color.g, m.colorEnd.g, age)
    out.b = lerp(m.color.b, m.colorEnd.b, age)
    out.a = m.alpha * (age < 0.2 ? age / 0.2 : 1 - (age - 0.2) / 0.8)
    out.size = 1 + (m.grow - 1) * age
    out.width = 1
  },
  /** A fireball's hot core: swells fast, cools through the flame colours, fades. */
  'fireball-core'(age, m, out) {
    const grow = 1 - Math.pow(1 - age, 3)
    flameColour(Math.min(1, age * 1.2), out)
    out.a = m.alpha * (1 - age)
    out.size = (0.25 + 0.55 * grow) / 0.25
    out.width = 1
  },
  /** The darker shell round a fireball. */
  'fireball-shell'(age, m, out) {
    const grow = 1 - Math.pow(1 - age, 3)
    flameColour(Math.min(1, age * 1.2), out)
    out.r *= 0.9
    out.g *= 0.5
    out.b *= 0.3
    out.a = m.alpha * (1 - age) * (1 - age)
    out.size = (0.35 + 0.85 * grow) / 0.35
    out.width = 1
  },
  /** Holds its colour and opacity: tracers, and anything that should not fade. */
  constant(_age, m, out) {
    out.r = m.color.r
    out.g = m.color.g
    out.b = m.color.b
    out.a = m.alpha
    out.size = 1
    out.width = 1
  },
}

/** A hand-drawn curve: `[age, value]` stops, linearly interpolated. */
export type Curve = [number, number][]
/** A hand-drawn colour curve: `[age, colour]` stops. */
export type ColorCurve = [number, THREE.ColorRepresentation][]

export function sampleCurve(c: Curve, age: number): number {
  if (c.length === 0) return 1
  if (age <= c[0]![0]) return c[0]![1]
  for (let i = 1; i < c.length; i++) {
    const [t1, v1] = c[i]!
    if (age <= t1) {
      const [t0, v0] = c[i - 1]!
      return lerp(v0, v1, (age - t0) / Math.max(1e-6, t1 - t0))
    }
  }
  return c[c.length - 1]![1]
}

const _ca = new THREE.Color()
const _cb = new THREE.Color()

export function sampleColorCurve(c: ColorCurve, age: number, out: { r: number; g: number; b: number }): void {
  if (c.length === 0) return
  let i = 1
  while (i < c.length - 1 && age > c[i]![0]) i++
  const [t0, c0] = c[Math.max(0, i - 1)]!
  const [t1, c1] = c[Math.min(c.length - 1, i)]!
  _ca.set(c0)
  _cb.set(c1)
  const u = t1 > t0 ? Math.min(1, Math.max(0, (age - t0) / (t1 - t0))) : 0
  out.r = lerp(_ca.r, _cb.r, u)
  out.g = lerp(_ca.g, _cb.g, u)
  out.b = lerp(_ca.b, _cb.b, u)
}
