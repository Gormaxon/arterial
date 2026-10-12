/**
 * Particle effects as data, and the registry that names them.
 *
 * An effect is a list of LAYERS; a layer is one kind of particle thrown one way — the dust
 * ring of a landing, the sparks off the boots, the smoke off a flame. Everything about a
 * layer is plain numbers and strings, so an effect can live in a library file, in a level,
 * or be built in the editor, and the engine draws all of it: every layer of every effect
 * shares its style's single draw call.
 *
 * Numbers that should scale with how hard something happened are RANGES: `[lo, hi]`, picked
 * by the `intensity` (0..1) the effect is fired with. A landing is one effect, its dust
 * count running from 14 at a soft touchdown to 40 at a hard one.
 *
 * Styles:
 *   soft     billowing sprites, normally blended: dust, steam, ash
 *   smoke    soft sprites shaded as volume (lit from above), drawn under the glows: smoke
 *   glow     additive sprites: flame, embers, glints
 *   streak   additive quads stretched along their motion: sparks, motes, debris trails
 *   tracer   additive fixed-length bolts along a flight path, under drag: tracers, laser bolts
 *   fireball additive swelling spheres: explosions
 *   chunk    solid instanced pieces that tumble, bounce and settle: rubble, gore, brass
 */

import * as THREE from 'three'
import { MODELS, RAMP_W, ROWS_PER_LAYER, sampleColorCurve, sampleCurve, type ColorCurve, type Curve, type ModelInput, type Sample } from './curves'

export type ParticleStyle = 'soft' | 'smoke' | 'glow' | 'streak' | 'tracer' | 'fireball' | 'chunk'
export const PARTICLE_STYLES: readonly ParticleStyle[] = ['soft', 'smoke', 'glow', 'streak', 'tracer', 'fireball', 'chunk']

/** A number, or a `[lo, hi]` range picked by the intensity the effect is fired at. */
export type Range = number | [number, number]

export interface LayerDef {
  style: ParticleStyle
  /** Particles per burst. */
  count?: Range
  /** Particles per second while an emitter streams the effect. */
  rate?: Range
  /** Skip this layer below this intensity (a soft landing throws no sparks). */
  minIntensity?: number

  // --- where they start ------------------------------------------------------
  /**
   * `point` (default): at the origin. `ring`: round a circle of `radius` in the horizontal
   * plane, thrown outward. `disc`: anywhere on a horizontal disc of `radius`. `box`: anywhere
   * in a box of half-extents `extent`.
   */
  shape?: 'point' | 'ring' | 'disc' | 'box'
  radius?: Range
  extent?: [number, number, number]
  /** How far up a ring throws, as the vertical part of its direction. */
  lift?: number
  /** Raised this far above the origin. */
  offsetY?: number
  /** A random offset of up to this much (a cube), on top of the shape. */
  jitter?: Range

  // --- how they leave --------------------------------------------------------
  /**
   * Direction. Given, it is fixed for the layer; omitted, the layer is thrown along the
   * direction the effect is fired with (an impact normal, a muzzle). Its length matters:
   * it is mixed with a random direction by `spread`, as the old emitters did.
   */
  dir?: [number, number, number]
  /** 0 = straight along `dir`, 1 = a full sphere. */
  spread?: Range
  /** Metres per second. Each particle gets (1 ± speedVariance) of it. */
  speed?: Range
  /** Default 0.45: 55-145% of `speed`, as the old emitters threw. */
  speedVariance?: number
  /** How much of the velocity the effect is fired with is carried (a footfall's dust rides along). */
  inherit?: number
  /** Seconds before the layer appears. */
  delay?: number

  // --- how they move ---------------------------------------------------------
  /** Metres per second², downward. Negative rises. */
  gravity?: Range
  /** Linear drag: the share of velocity lost per second. */
  drag?: Range
  /** Bounce off the floor the effect is fired with, keeping this much speed. Unset: no floor. */
  bounce?: number
  /** The floor sits this far above the one given at the call. */
  floorOffset?: number
  /** Side-to-side wander in metres, growing over the life (flame licks, rising smoke). */
  turbulence?: number
  /** Wander cycles per second. */
  turbulenceFreq?: number
  /** Top spin, radians per second; each sprite gets a random share, either way round. */
  spin?: number
  /**
   * Pulled in toward the line it was fired along, per second: particles born off-centre on a
   * disc are thrown back toward its axis, so a flame column necks in above its grate.
   */
  pinch?: number
  /**
   * Spread outward from the emitter's axis by this many metres by the end of the life, growing as age²
   * (soft, smoke, glow): a flame column or a plume that widens as it rises.
   */
  billow?: number
  /** Sprite shape for soft, smoke and glow: `puff` (default, a soft cloud) or `lick` (a flame lick, an ember). */
  sprite?: 'puff' | 'lick'

  // --- how long --------------------------------------------------------------
  life?: Range
  /** Share of the life that varies, 0..1. */
  lifeVariance?: number

  // --- how they look ---------------------------------------------------------
  /** Metres. For streaks the width, for tracers the width, for fireballs the radius. */
  size?: Range
  sizeVariance?: number
  color?: THREE.ColorRepresentation
  colorEnd?: THREE.ColorRepresentation
  alpha?: Range
  /** Size at the end of the life as a multiple of the start (soft, smoke). */
  grow?: number
  /** Share of the life spent fading in (soft, smoke, glow). */
  fadeIn?: number
  /** How the curves are made: a built-in model (curves.ts MODELS). Default by style. */
  model?: string
  /** Hand-drawn curves, replacing the model's. */
  colorCurve?: ColorCurve
  alphaCurve?: Curve
  sizeCurve?: Curve
  /** Streak: seconds of travel drawn as the tail. */
  stretch?: number
  /** Tracer: length of the bolt in metres. */
  length?: number
  /**
   * Tracer: and at least this many seconds of its flight drawn as its length, at the speed it has now. A round at
   * 900 m/s moves 15 m between two frames at 60 Hz; drawn shorter than that it strobes as a row of separate dashes,
   * where the eye (and a camera) sees one streak.
   */
  lengthTime?: number
  /** Tracer: turns a second of a tumbling round (a ricochet): it burns unsteadily, flaring each time it turns side-on. 0: steady. */
  tumble?: number
  /** Tracer: drag is v² (rounds), not linear. */
  quadraticDrag?: boolean

  // --- chunks ----------------------------------------------------------------
  /** Which registered chunk kind (rubble, gore, brass...). */
  chunk?: string
  minSize?: Range
  maxSize?: Range

  // --- what follows ----------------------------------------------------------
  /**
   * When each particle dies, sometimes fire another effect where it ended: flame licks
   * that burn out high turn to smoke. Worked out at birth, so it costs nothing per frame.
   */
  onDeath?: { effect: string; chance?: number; minRise?: number }
}

export interface EffectDef {
  layers: LayerDef[]
  /** Not fired at all farther than this from the camera. Default 150 m. */
  cullDistance?: number
  /** Shown in the editor's effect list. */
  label?: string
}

/** A layer with its ramp rows assigned and its defaults filled in. */
export interface CompiledLayer {
  def: LayerDef
  style: ParticleStyle
  /** First of this layer's ROWS_PER_LAYER rows in the ramp texture. */
  row: number
}

export interface CompiledEffect {
  name: string
  def: EffectDef
  layers: CompiledLayer[]
  cullDistanceSq: number
}

const DEFAULT_MODEL: Record<ParticleStyle, string> = {
  soft: 'puff',
  smoke: 'puff',
  glow: 'puff',
  streak: 'spark',
  tracer: 'constant',
  fireball: 'fireball-core',
  chunk: 'constant',
}

/** Pick a value from a range at an intensity. */
export function pick(r: Range | undefined, intensity: number, fallback: number): number {
  if (r === undefined) return fallback
  if (typeof r === 'number') return r
  return r[0] + (r[1] - r[0]) * intensity
}

/**
 * The ramp texture: every layer's curves, one texture for every particle shader. Float so
 * colours can run hot, read with texelFetch so no filtering support is needed.
 */
export class RampTable {
  readonly texture: THREE.DataTexture
  private readonly data: Float32Array
  private rowsUsed = 0

  constructor(readonly maxLayers: number) {
    this.data = new Float32Array(RAMP_W * maxLayers * ROWS_PER_LAYER * 4)
    this.texture = new THREE.DataTexture(this.data, RAMP_W, maxLayers * ROWS_PER_LAYER, THREE.RGBAFormat, THREE.FloatType)
    this.texture.minFilter = THREE.NearestFilter
    this.texture.magFilter = THREE.NearestFilter
    this.texture.generateMipmaps = false
    this.texture.needsUpdate = true
  }

  allocate(): number {
    if (this.rowsUsed + ROWS_PER_LAYER > this.maxLayers * ROWS_PER_LAYER) throw new Error('particles: out of effect layers')
    const row = this.rowsUsed
    this.rowsUsed += ROWS_PER_LAYER
    return row
  }

  get layersUsed(): number {
    return this.rowsUsed / ROWS_PER_LAYER
  }

  /** Bake a layer's curves and constants into its rows. */
  bake(row: number, layer: LayerDef, style: ParticleStyle): void {
    const model = MODELS[layer.model ?? DEFAULT_MODEL[style]] ?? MODELS.puff!
    const input: ModelInput = {
      color: new THREE.Color(layer.color ?? 0xffffff),
      colorEnd: new THREE.Color(layer.colorEnd ?? layer.color ?? 0xffffff),
      // Alpha may be a range; the curve holds its shape and the particle carries the scale.
      alpha: 1,
      grow: layer.grow ?? 1.8,
      fadeIn: layer.fadeIn ?? 0.08,
    }
    const s: Sample = { r: 0, g: 0, b: 0, a: 0, size: 1, width: 1 }
    const d = this.data
    for (let x = 0; x < RAMP_W; x++) {
      const age = x / (RAMP_W - 1)
      model(age, input, s)
      if (layer.colorCurve) sampleColorCurve(layer.colorCurve, age, s)
      if (layer.alphaCurve) s.a = sampleCurve(layer.alphaCurve, age)
      if (layer.sizeCurve) s.size = sampleCurve(layer.sizeCurve, age)
      const c = (row * RAMP_W + x) * 4
      d[c] = s.r
      d[c + 1] = s.g
      d[c + 2] = s.b
      d[c + 3] = s.a
      const z = ((row + 1) * RAMP_W + x) * 4
      d[z] = s.size
      d[z + 1] = s.width
      d[z + 2] = 0
      d[z + 3] = 0
    }
    // Constants: [turbulence, turbulence frequency, streak stretch, bounce], [tracer length, quadratic drag, lick
    // sprite, billow], [tracer tumble, tracer length in seconds, -, -].
    const k = (row + 2) * RAMP_W * 4
    d[k] = layer.turbulence ?? 0
    d[k + 1] = layer.turbulenceFreq ?? 1.4
    d[k + 2] = layer.stretch ?? 0.045
    d[k + 3] = layer.bounce ?? 0
    d[k + 4] = layer.length ?? 4.2
    d[k + 5] = layer.quadraticDrag ? 1 : 0
    d[k + 6] = layer.sprite === 'lick' ? 1 : 0
    d[k + 7] = layer.billow ?? 0
    d[k + 8] = layer.tumble ?? 0
    d[k + 9] = layer.lengthTime ?? 0
    this.texture.needsUpdate = true
  }
}

/**
 * Every effect by name. Effects are registered once (the game's library does it at boot;
 * a level or the editor may add more) and fired by name from anywhere: code, the `fx`
 * event, an emitter placed in a level.
 */
export class EffectRegistry {
  private readonly effects = new Map<string, CompiledEffect>()
  /** Rows a name was given, so re-registering an effect (live tuning) reuses them instead of leaking. */
  private readonly rows = new Map<string, number[]>()

  constructor(private readonly ramps: RampTable) {}

  register(name: string, def: EffectDef): CompiledEffect {
    const old = this.rows.get(name) ?? []
    const rows: number[] = []
    const layers: CompiledLayer[] = def.layers.map((layer, i) => {
      const row = old[i] ?? this.ramps.allocate()
      rows.push(row)
      if (layer.style !== 'chunk') this.ramps.bake(row, layer, layer.style)
      return { def: layer, style: layer.style, row }
    })
    // Rows a shorter redefinition no longer uses stay with the name for next time.
    for (let i = rows.length; i < old.length; i++) rows.push(old[i]!)
    this.rows.set(name, rows)
    const cull = def.cullDistance ?? 150
    const compiled: CompiledEffect = { name, def, layers, cullDistanceSq: cull * cull }
    this.effects.set(name, compiled)
    return compiled
  }

  get(name: string): CompiledEffect | undefined {
    return this.effects.get(name)
  }

  has(name: string): boolean {
    return this.effects.has(name)
  }

  names(): string[] {
    return [...this.effects.keys()].sort()
  }
}
