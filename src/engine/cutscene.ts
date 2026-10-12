/**
 * Cutscenes: a timeline the engine plays while the player is taken out of the loop.
 *
 * A cutscene is plain data (`CutsceneDef`): a camera path, and timed steps for captions,
 * fades and events. The engine owns the clock and says what the camera, caption and fade
 * are at any moment; it draws nothing and knows nothing about the game, so main.ts only
 * has to hand the sampled camera to the renderer and the caption to the screen.
 *
 * Two ways to frame it. With a `camera` track the camera is a free film camera and the
 * player's hands stay out of shot. Without one it is FIRST PERSON: the player's own eyes,
 * moved along a `player` track (position, yaw, pitch), with the hands still drawn. The
 * hands can be posed from an `arms` track, and the game's own weapon and melee code keeps
 * running on scripted input (`press` steps: attack, block, aim, fire, reload) so every
 * animation the game has — a punch, a cut, a reload, a draw — plays exactly as in play.
 * `do` steps call game-registered actions for anything else, such as drawing a weapon.
 *
 * Levels start one through the event bus the same way they trigger anything else: a
 * trigger whose event is `cutscene:play:<name>`. A step's `event` goes back out on the
 * same bus when its time comes, so a cutscene can open a door, spawn something or hand
 * control to another system with no code of its own.
 */

import type { EventBus } from './events'

export type Ease = 'lin' | 'in' | 'out' | 'inout'
export type Vec3 = readonly [number, number, number]

/** The camera at time `t` seconds: where it is, what it looks at, and the field of view. */
export interface CamKey {
  t: number
  pos: Vec3
  look: Vec3
  fov?: number
  /** How the camera eases from the previous key to this one. Default: 'inout'. */
  ease?: Ease
}

/** Where the Operator is: feet position, and where they look (degrees, as `rot` is in a level). */
export interface PlayerKey {
  t: number
  pos: Vec3
  yaw: number
  pitch?: number
  ease?: Ease
}

/**
 * Where a hand is on the view: `at` is [across, up, distance] — across and up run -1..1
 * over the screen, distance is metres out from the eye — and the rest is how the hand is
 * turned (degrees) and how tightly the fingers close (0 open, 1 fist).
 */
export interface HandTarget {
  at: Vec3
  twist?: number
  wp?: number
  wy?: number
  fist?: number
}

export interface ArmKey {
  t: number
  left?: HandTarget
  right?: HandTarget
  ease?: Ease
}

/** The inputs a cutscene can press for the Operator. */
export type CutInput = 'attack' | 'block' | 'aim' | 'fire' | 'reload'

export type CutsceneStep =
  /** Text on screen from `at` for `for` seconds, optionally with who is speaking. */
  | { at: number; caption: string; for: number; speaker?: string }
  /** Black fades in (`out`: the picture goes to black) or out over `for` seconds. */
  | { at: number; fade: 'out' | 'in'; for: number }
  /** Fires an event on the world's bus. */
  | { at: number; event: string; payload?: unknown }
  /** Presses a game input at `at`, held for `for` seconds (a single tap if left out). */
  | { at: number; press: CutInput; for?: number }
  /** Calls a game-registered action (see CutsceneSystem.onAction), e.g. drawing a weapon. */
  | { at: number; do: string; arg?: unknown }

export interface CutsceneDef {
  name: string
  /** Seconds. The cutscene ends here whatever else is on the timeline. */
  duration: number
  camera?: CamKey[]
  /** First person: moves the Operator along a path and turns them. */
  player?: PlayerKey[]
  /** First person: poses the hands, when the game's own animations are not wanted. */
  arms?: ArmKey[]
  steps?: CutsceneStep[]
  /** Black bars above and below. Default true. */
  letterbox?: boolean
  /** Whether the player may skip it. Default true. */
  skippable?: boolean
}

export interface CamSample {
  pos: [number, number, number]
  look: [number, number, number]
  fov: number | null
}

export interface PlayerSample {
  pos: [number, number, number]
  yaw: number
  pitch: number
}

export interface HandSample {
  at: [number, number, number]
  twist: number
  wp: number
  wy: number
  fist: number
}

export interface Caption {
  text: string
  speaker: string | null
}

function ease(e: Ease, k: number): number {
  switch (e) {
    case 'in':
      return k * k
    case 'out':
      return 1 - (1 - k) * (1 - k)
    case 'inout':
      return k * k * (3 - 2 * k)
    default:
      return k
  }
}

const mix = (a: number, b: number, k: number): number => a + (b - a) * k

export class CutsceneSystem {
  private readonly defs = new Map<string, CutsceneDef>()
  private current: CutsceneDef | null = null
  private clock = 0
  private fired = new Set<number>()
  private readonly actions = new Map<string, (arg: unknown) => void>()
  private lastClock = -1
  private endPlayer: PlayerSample | null = null
  private readonly held = new Set<CutInput>()
  private readonly edges = new Set<CutInput>()

  constructor(private readonly events: EventBus) {
    // The tap outlives the bus's own clear() on a level load, so a level only has to
    // name the event; nothing needs re-registering when it is replaced.
    events.tap((name, payload) => {
      if (name.startsWith(PLAY_PREFIX)) this.play(name.slice(PLAY_PREFIX.length), payload)
    })
  }

  register(def: CutsceneDef): void {
    this.defs.set(def.name, def)
  }

  has(name: string): boolean {
    return this.defs.has(name)
  }

  get names(): string[] {
    return [...this.defs.keys()]
  }

  /** Is one playing? The game stands down for as long as this is true. */
  get active(): boolean {
    return this.current !== null
  }

  get playing(): string | null {
    return this.current?.name ?? null
  }

  get time(): number {
    return this.clock
  }

  get skippable(): boolean {
    return this.current?.skippable !== false
  }

  /** Register what a `do` step with this name does. */
  onAction(name: string, fn: (arg: unknown) => void): void {
    this.actions.set(name, fn)
  }

  /** Is this input held down by the cutscene right now? */
  isHeld(input: CutInput): boolean {
    return this.held.has(input)
  }

  /** Did the cutscene press this input during the last update? */
  justPressed(input: CutInput): boolean {
    return this.edges.has(input)
  }

  /** Start one by name. Ignored while another is playing, or if the name is unknown. */
  play(name: string, _payload?: unknown): boolean {
    const def = this.defs.get(name)
    if (!def || this.current) return false
    this.current = def
    this.clock = 0
    this.lastClock = -1
    this.endPlayer = null
    this.fired.clear()
    this.held.clear()
    this.edges.clear()
    this.events.emit('cutscene:started', { name })
    // Anything timed at zero happens now, not a frame late.
    this.fireDue()
    return true
  }

  /** Jump to the end. Steps not yet reached still fire, so the world ends up as intended. */
  skip(): void {
    if (!this.current || !this.skippable) return
    this.finish(true)
  }

  update(dt: number): void {
    if (!this.current) return
    this.clock += dt
    this.refreshInputs()
    this.fireDue()
    if (this.clock >= this.current.duration) this.finish(false)
  }

  /** Where the Operator was left when the last cutscene ended (null if it had no player track). */
  get finalPlayer(): PlayerSample | null {
    return this.endPlayer
  }

  /** Is the Operator's own body part of this cutscene (a first-person one)? */
  get firstPerson(): boolean {
    return !!this.current && !this.current.camera
  }

  get letterbox(): boolean {
    return this.current?.letterbox !== false
  }

  /** Where the Operator is and looks right now, or null with no player track. */
  samplePlayer(): PlayerSample | null {
    const keys = this.current?.player
    if (!keys || keys.length === 0) return null
    const t = this.clock
    const out = (k: PlayerKey): PlayerSample => ({ pos: [k.pos[0], k.pos[1], k.pos[2]], yaw: k.yaw, pitch: k.pitch ?? 0 })
    if (t <= keys[0]!.t) return out(keys[0]!)
    for (let i = 1; i < keys.length; i++) {
      const b = keys[i]!
      if (t <= b.t) {
        const a = keys[i - 1]!
        const k = ease(b.ease ?? 'inout', (t - a.t) / Math.max(1e-6, b.t - a.t))
        return {
          pos: [mix(a.pos[0], b.pos[0], k), mix(a.pos[1], b.pos[1], k), mix(a.pos[2], b.pos[2], k)],
          yaw: mix(a.yaw, b.yaw, k),
          pitch: mix(a.pitch ?? 0, b.pitch ?? 0, k),
        }
      }
    }
    return out(keys[keys.length - 1]!)
  }

  /** The hands the arms track is posing right now; a side with no key stays null (the game poses it). */
  sampleArms(): { left: HandSample | null; right: HandSample | null } {
    const keys = this.current?.arms
    if (!keys || keys.length === 0) return { left: null, right: null }
    return { left: this.sampleHand(keys, 'left'), right: this.sampleHand(keys, 'right') }
  }

  private sampleHand(keys: ArmKey[], side: 'left' | 'right'): HandSample | null {
    const own = keys.filter((k) => k[side] !== undefined)
    if (own.length === 0) return null
    const t = this.clock
    const full = (h: HandTarget): HandSample => ({
      at: [h.at[0], h.at[1], h.at[2]],
      twist: h.twist ?? -40,
      wp: h.wp ?? -4,
      wy: h.wy ?? 2,
      fist: h.fist ?? 0.1,
    })
    if (t <= own[0]!.t) return full(own[0]![side]!)
    for (let i = 1; i < own.length; i++) {
      const bk = own[i]!
      if (t <= bk.t) {
        const a = full(own[i - 1]![side]!)
        const b = full(bk[side]!)
        const k = ease(bk.ease ?? 'inout', (t - own[i - 1]!.t) / Math.max(1e-6, bk.t - own[i - 1]!.t))
        return {
          at: [mix(a.at[0], b.at[0], k), mix(a.at[1], b.at[1], k), mix(a.at[2], b.at[2], k)],
          twist: mix(a.twist, b.twist, k),
          wp: mix(a.wp, b.wp, k),
          wy: mix(a.wy, b.wy, k),
          fist: mix(a.fist, b.fist, k),
        }
      }
    }
    return full(own[own.length - 1]![side]!)
  }

  /** Work out which inputs the cutscene is pressing in the span since the last update. */
  private refreshInputs(): void {
    this.held.clear()
    this.edges.clear()
    const steps = this.current?.steps
    if (steps) {
      for (const s of steps) {
        if (!('press' in s)) continue
        const end = s.at + (s.for ?? 0)
        if (s.at > this.lastClock && s.at <= this.clock) this.edges.add(s.press)
        // Held while the clock is inside it; a tap is held for the update it lands in.
        if ((this.clock >= s.at && this.clock < end) || (s.at > this.lastClock && s.at <= this.clock)) this.held.add(s.press)
      }
    }
    this.lastClock = this.clock
  }

  /** Where the camera is right now, or null with no camera track (the game's own camera stays). */
  sample(): CamSample | null {
    const keys = this.current?.camera
    if (!keys || keys.length === 0) return null
    const t = this.clock
    if (t <= keys[0]!.t) return at(keys[0]!)
    for (let i = 1; i < keys.length; i++) {
      const b = keys[i]!
      if (t <= b.t) {
        const a = keys[i - 1]!
        const k = ease(b.ease ?? 'inout', (t - a.t) / Math.max(1e-6, b.t - a.t))
        return {
          pos: [mix(a.pos[0], b.pos[0], k), mix(a.pos[1], b.pos[1], k), mix(a.pos[2], b.pos[2], k)],
          look: [mix(a.look[0], b.look[0], k), mix(a.look[1], b.look[1], k), mix(a.look[2], b.look[2], k)],
          fov: a.fov !== undefined && b.fov !== undefined ? mix(a.fov, b.fov, k) : (b.fov ?? a.fov ?? null),
        }
      }
    }
    return at(keys[keys.length - 1]!)
  }

  /** The caption on screen now, if any. */
  get caption(): Caption | null {
    const steps = this.current?.steps
    if (!steps) return null
    for (const s of steps) {
      if ('caption' in s && this.clock >= s.at && this.clock < s.at + s.for) {
        return { text: s.caption, speaker: s.speaker ?? null }
      }
    }
    return null
  }

  /** How black the picture is, 0..1: the last fade that has started decides. */
  get fade(): number {
    const steps = this.current?.steps
    if (!steps) return 0
    let level = 0
    let latest = -1
    for (const s of steps) {
      if (!('fade' in s) || this.clock < s.at || s.at < latest) continue
      latest = s.at
      const k = Math.min(1, (this.clock - s.at) / Math.max(1e-6, s.for))
      level = s.fade === 'out' ? k : 1 - k
    }
    return level
  }

  private fireDue(): void {
    const steps = this.current?.steps
    if (!steps) return
    steps.forEach((s, i) => {
      if (this.fired.has(i) || this.clock < s.at) return
      if ('event' in s) {
        this.fired.add(i)
        this.events.emit(s.event, s.payload ?? null)
      } else if ('do' in s) {
        this.fired.add(i)
        this.actions.get(s.do)?.(s.arg)
      }
    })
  }

  private finish(skipped: boolean): void {
    const def = this.current
    if (!def) return
    this.clock = def.duration
    this.endPlayer = this.samplePlayer()
    this.fireDue()
    this.current = null
    this.clock = 0
    this.held.clear()
    this.edges.clear()
    this.events.emit('cutscene:ended', { name: def.name, skipped })
  }
}

/** The event a level names to start a cutscene: `cutscene:play:<name>`. */
export const PLAY_PREFIX = 'cutscene:play:'

function at(k: CamKey): CamSample {
  return { pos: [k.pos[0], k.pos[1], k.pos[2]], look: [k.look[0], k.look[1], k.look[2]], fov: k.fov ?? null }
}
