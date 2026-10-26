/**
 * Boss fights: a fight with one enemy that has a health bar of its own, phases and an entrance.
 *
 * As quests are (engine/quests.ts), a boss fight is plain data (`BossDef`) and announcements on the world's bus; what
 * the boss looks like, how it moves and what it does in each phase are the game's (an entity that owns a BossEncounter
 * and acts on its state). The encounter keeps the fight's state and says what it is; it draws nothing and hurts nothing.
 *
 *   Phases      each begins when the boss's health comes down to a share of its whole (`at`: 1 the first, then 0.66,
 *               0.33…). A blow that would carry it past the next phase's line stops on the line (`clampToPhase`), so
 *               no phase is skipped by one big hit.
 *   Untouchable while it makes its entrance (`intro` seconds) and for a phase's own `guard` seconds as it begins, so a
 *               phase change can be shown (a roar, armour coming off) without being shot through.
 *   Announced   `boss:start` { boss, title, health }, `boss:phase` { boss, phase, index }, `boss:health` { boss, health,
 *               max, fraction } on every change, `boss:defeated` { boss, title } and `boss:defeated:<id>` (so a quest
 *               objective, a door's unlock or a cutscene can wait on one boss by name), and `boss:reset` { boss }.
 */

import type { EventBus } from './events'

export interface BossPhaseDef {
  /** Its name, handed on in `boss:phase` (what the game keys its behaviour on). */
  id: string
  /** The share of the whole health (0..1] it begins at. The first phase's is 1. */
  at: number
  /** Seconds it cannot be hurt as the phase begins. Default 0. */
  guard?: number
  /** Also announced, with the `boss:phase` payload, as the phase begins. */
  event?: string
}

export interface BossDef {
  /** What the player is told it is called. */
  title: string
  health: number
  /** In any order; sorted by `at`, highest first. None: one phase, `fight`. */
  phases?: BossPhaseDef[]
  /** Seconds of entrance, untouchable, from `begin()` to the fight. Default 0. */
  intro?: number
  /** A blow stops on the next phase's line (default true). */
  clampToPhase?: boolean
}

/** dormant: not begun. intro: making its entrance. fighting. guarded: a phase beginning. defeated. */
export type BossState = 'dormant' | 'intro' | 'fighting' | 'guarded' | 'defeated'

export interface BossHealth {
  boss: string
  health: number
  max: number
  fraction: number
}

const ONE_PHASE: BossPhaseDef[] = [{ id: 'fight', at: 1 }]

export class BossEncounter {
  readonly max: number
  readonly phases: readonly BossPhaseDef[]
  state: BossState = 'dormant'
  health: number
  /** The phase it is in (an index into `phases`); -1 until it has begun. */
  phaseIndex = -1
  /** Seconds left of the entrance or a phase's guard. */
  private hold = 0

  constructor(
    private readonly events: EventBus,
    /** Its name on the bus: the entity's name, or anything unique to the fight. */
    readonly id: string,
    readonly def: BossDef,
  ) {
    this.max = Math.max(1, def.health)
    this.health = this.max
    const phases = (def.phases?.length ? def.phases : ONE_PHASE).map((p) => ({ ...p, at: Math.min(1, Math.max(0, p.at)) }))
    phases.sort((a, b) => b.at - a.at)
    // Whatever the first phase says, it is the one the fight starts in.
    phases[0] = { ...phases[0]!, at: 1 }
    this.phases = phases
  }

  /** The phase it is in, or null before it has begun. */
  get phase(): BossPhaseDef | null {
    return this.phases[this.phaseIndex] ?? null
  }

  get fraction(): number {
    return this.health / this.max
  }

  /** Begun and not yet beaten. */
  get active(): boolean {
    return this.state !== 'dormant' && this.state !== 'defeated'
  }

  /** A blow would land now. */
  get vulnerable(): boolean {
    return this.state === 'fighting'
  }

  /** Start the fight: the entrance, then the first phase. Does nothing once begun. */
  begin(): void {
    if (this.state !== 'dormant') return
    this.events.emit('boss:start', { boss: this.id, title: this.def.title, health: this.max })
    this.health = this.max
    this.announceHealth()
    this.hold = Math.max(0, this.def.intro ?? 0)
    this.state = this.hold > 0 ? 'intro' : 'fighting'
    if (this.state === 'fighting') this.enterPhase(0)
  }

  /**
   * Take a blow. Returns the health it actually took — 0 while it cannot be hurt, less than `amount` where the blow
   * stopped on a phase's line — which is what the entity takes off itself too.
   */
  damage(amount: number): number {
    if (!this.vulnerable || !(amount > 0)) return 0
    let floor = 0
    const next = this.phases[this.phaseIndex + 1]
    if (next && this.def.clampToPhase !== false) floor = next.at * this.max
    const taken = Math.min(amount, this.health - floor)
    if (taken <= 0) return 0
    this.health -= taken
    this.announceHealth()
    if (this.health <= 1e-6) {
      this.health = 0
      this.state = 'defeated'
      this.hold = 0
      this.events.emit('boss:defeated', { boss: this.id, title: this.def.title })
      this.events.emit(`boss:defeated:${this.id}`, { boss: this.id, title: this.def.title })
      return taken
    }
    // Past one line or more (unclamped): into the last phase it has reached.
    let to = this.phaseIndex
    while (to + 1 < this.phases.length && this.health <= this.phases[to + 1]!.at * this.max + 1e-6) to++
    if (to !== this.phaseIndex) this.enterPhase(to)
    return taken
  }

  /** Time passes: the entrance and a phase's guard run out. */
  update(dt: number): void {
    if (this.hold <= 0) return
    this.hold -= dt
    if (this.hold > 0) return
    this.hold = 0
    if (this.state === 'intro') {
      this.state = 'fighting'
      this.enterPhase(0)
    } else if (this.state === 'guarded') this.state = 'fighting'
  }

  /** Back to before it began, at full health (you died; the level is being edited). */
  reset(): void {
    const was = this.state
    this.state = 'dormant'
    this.health = this.max
    this.phaseIndex = -1
    this.hold = 0
    if (was !== 'dormant') this.events.emit('boss:reset', { boss: this.id })
  }

  private enterPhase(index: number): void {
    this.phaseIndex = index
    const p = this.phases[index]!
    const guard = Math.max(0, p.guard ?? 0)
    if (guard > 0) {
      this.state = 'guarded'
      this.hold = guard
    }
    const payload = { boss: this.id, phase: p.id, index }
    this.events.emit('boss:phase', payload)
    if (p.event) this.events.emit(p.event, payload)
  }

  private announceHealth(): void {
    const h: BossHealth = { boss: this.id, health: this.health, max: this.max, fraction: this.fraction }
    this.events.emit('boss:health', h)
  }
}
