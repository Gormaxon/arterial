/**
 * Quests and objectives: what the player is trying to do, and when it is done.
 *
 * A quest is plain data (`QuestDef`): a title and a list of objectives, each finished by an
 * EVENT on the world's bus happening a number of times. So nothing about a quest lives in
 * game code — a trigger placed in a level, a weapon being taken, a wall breaking or a
 * cutscene ending all count the same way, because they are all just events. A quest
 * starts the same way (`quest:start:<id>`, or its own `start` event), and finishing one
 * announces `quest:completed:<id>`, which another quest can use as its `start`, so quests
 * chain with no code.
 *
 * The system keeps state and says what it is; it draws nothing. It outlives level loads
 * (it hears events through the bus's tap), so progress is not lost when a level is replaced.
 */

import type { EventBus } from './events'

export interface ObjectiveDef {
  id: string
  /** What the player is told to do. */
  text: string
  /** The event that counts toward it. */
  event: string
  /** How many times it must happen. Default 1. */
  count?: number
  /**
   * Only count the event when its payload matches: equal for a plain value, or every field
   * equal for an object. Lets "take a weapon" and "take the pistol" be different objectives.
   */
  match?: unknown
  /** Counts whenever it happens but is not needed to finish the quest. */
  optional?: boolean
}

export interface QuestDef {
  id: string
  title: string
  objectives: ObjectiveDef[]
  /** One objective at a time, in order (default), or all at once. Optional ones are always live. */
  ordered?: boolean
  /** An event that starts it. It can also be started by name (`quest:start:<id>`) or in code. */
  start?: string
  /** An event that fails it while it is running. */
  failOn?: string
  /** Handed to whoever listens in the `quest:completed` payload; the engine does not interpret it. */
  reward?: Record<string, number>
}

export type QuestState = 'inactive' | 'active' | 'completed' | 'failed'

export interface QuestObjectiveView {
  id: string
  text: string
  progress: number
  count: number
  done: boolean
  optional: boolean
  /** Live right now: the player can be working on it. */
  current: boolean
}

export interface QuestView {
  id: string
  title: string
  state: QuestState
  objectives: QuestObjectiveView[]
}

export type QuestSave = Record<string, { state: QuestState; progress: number[] }>

export type QuestNotice =
  | { kind: 'started'; quest: string; title: string }
  | { kind: 'objective'; quest: string; objective: string; text: string }
  | { kind: 'completed'; quest: string; title: string; reward: Record<string, number> | null }
  | { kind: 'failed'; quest: string; title: string }

export const START_PREFIX = 'quest:start:'

interface Run {
  def: QuestDef
  state: QuestState
  progress: number[]
}

function matches(want: unknown, got: unknown): boolean {
  if (want === undefined) return true
  if (typeof want !== 'object' || want === null) return want === got
  if (typeof got !== 'object' || got === null) return false
  return Object.entries(want as Record<string, unknown>).every(([k, v]) => (got as Record<string, unknown>)[k] === v)
}

export class QuestSystem {
  private readonly runs = new Map<string, Run>()
  private readonly listeners = new Set<(n: QuestNotice) => void>()
  /** Bumped on every change, so a screen can redraw only when something happened. */
  version = 0

  constructor(private readonly events: EventBus) {
    events.tap((name, payload) => this.hear(name, payload))
  }

  /** Every quest registered, by id. */
  ids(): string[] {
    return [...this.runs.keys()]
  }

  register(def: QuestDef): void {
    this.runs.set(def.id, { def, state: 'inactive', progress: def.objectives.map(() => 0) })
    this.version++
  }

  /** Hear what happens to quests: started, an objective done, finished, failed. Survives level loads. */
  onNotice(fn: (n: QuestNotice) => void): void {
    this.listeners.add(fn)
  }

  state(id: string): QuestState {
    return this.runs.get(id)?.state ?? 'inactive'
  }

  /** Start a quest. Ignored if it is unknown or has already been started. */
  start(id: string): boolean {
    const run = this.runs.get(id)
    if (!run || run.state !== 'inactive') return false
    run.state = 'active'
    this.version++
    this.notify({ kind: 'started', quest: id, title: run.def.title })
    this.events.emit('quest:started', { quest: id })
    return true
  }

  /** Back to not started, its progress gone: a mission played again. */
  reset(id: string): void {
    const run = this.runs.get(id)
    if (!run) return
    run.state = 'inactive'
    run.progress = run.def.objectives.map(() => 0)
    this.version++
  }

  fail(id: string): void {
    const run = this.runs.get(id)
    if (!run || run.state !== 'active') return
    run.state = 'failed'
    this.version++
    this.notify({ kind: 'failed', quest: id, title: run.def.title })
    this.events.emit('quest:failed', { quest: id })
    this.events.emit(`quest:failed:${id}`, null)
  }

  /** The quests in progress, with what to show for each. */
  active(): QuestView[] {
    return [...this.runs.values()].filter((r) => r.state === 'active').map((r) => this.view(r))
  }

  get(id: string): QuestView | null {
    const run = this.runs.get(id)
    return run ? this.view(run) : null
  }

  serialize(): QuestSave {
    const out: QuestSave = {}
    for (const [id, r] of this.runs) if (r.state !== 'inactive') out[id] = { state: r.state, progress: [...r.progress] }
    return out
  }

  /** Put quests back as `serialize` left them. Unknown ids are ignored. */
  restore(save: QuestSave): void {
    for (const [id, s] of Object.entries(save)) {
      const run = this.runs.get(id)
      if (!run) continue
      run.state = s.state
      run.progress = run.def.objectives.map((_, i) => s.progress[i] ?? 0)
    }
    this.version++
  }

  private view(run: Run): QuestView {
    const live = this.liveObjectives(run)
    return {
      id: run.def.id,
      title: run.def.title,
      state: run.state,
      objectives: run.def.objectives.map((o, i) => ({
        id: o.id,
        text: o.text,
        progress: run.progress[i]!,
        count: o.count ?? 1,
        done: run.progress[i]! >= (o.count ?? 1),
        optional: o.optional === true,
        current: live.has(i),
      })),
    }
  }

  /** Which objectives the player can be working on: the next required one (or all of them), plus optionals. */
  private liveObjectives(run: Run): Set<number> {
    const live = new Set<number>()
    let nextRequired = true
    run.def.objectives.forEach((o, i) => {
      const done = run.progress[i]! >= (o.count ?? 1)
      if (done) return
      if (o.optional) live.add(i)
      else if (run.def.ordered === false || nextRequired) {
        live.add(i)
        nextRequired = false
      }
    })
    return live
  }

  private hear(name: string, payload: unknown): void {
    if (name.startsWith(START_PREFIX)) this.start(name.slice(START_PREFIX.length))
    for (const run of this.runs.values()) {
      if (run.state === 'inactive' && run.def.start === name) this.start(run.def.id)
      if (run.state === 'active' && run.def.failOn === name) this.fail(run.def.id)
    }
    for (const run of this.runs.values()) {
      if (run.state !== 'active') continue
      const live = this.liveObjectives(run)
      const doneNow: number[] = []
      run.def.objectives.forEach((o, i) => {
        if (!live.has(i) || o.event !== name || !matches(o.match, payload)) return
        run.progress[i]!++
        this.version++
        if (run.progress[i]! >= (o.count ?? 1)) doneNow.push(i)
      })
      for (const i of doneNow) {
        const o = run.def.objectives[i]!
        this.notify({ kind: 'objective', quest: run.def.id, objective: o.id, text: o.text })
        this.events.emit('quest:objective', { quest: run.def.id, objective: o.id })
      }
      // Finished when every required objective is.
      const finished = run.def.objectives.every((o, i) => o.optional || run.progress[i]! >= (o.count ?? 1))
      if (finished && run.state === 'active') {
        run.state = 'completed'
        this.version++
        const reward = run.def.reward ?? null
        this.notify({ kind: 'completed', quest: run.def.id, title: run.def.title, reward })
        this.events.emit('quest:completed', { quest: run.def.id, reward })
        this.events.emit(`quest:completed:${run.def.id}`, reward)
      }
    }
  }

  private notify(n: QuestNotice): void {
    for (const l of this.listeners) l(n)
  }
}
