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
 * SUB-OBJECTIVES. An objective can be made of smaller ones (`subs`): the steps within a step of a mission — "sweep the
 * facility" as clear reception, clear storage, clear the hall. Each is an objective like any other, finished by its own
 * events; the objective they make up is done when its required ones are (any order, or one at a time: `subsOrdered`).
 * They are live only while the objective they belong to is. An objective (or a sub) can also be finished by a set of
 * events each happening once (`all`), not one event some number of times: "both of reception's spawners cleared".
 *
 * The system keeps state and says what it is; it draws nothing. It outlives level loads
 * (it hears events through the bus's tap), so progress is not lost when a level is replaced.
 */

import type { EventBus } from './events'

export interface ObjectiveDef {
  id: string
  /** What the player is told to do. */
  text: string
  /** The event that counts toward it. (Not needed when it is finished by `all`, or made of `subs`.) */
  event?: string
  /** Done when every one of these events has happened, each once (in any order): instead of `event` and `count`. */
  all?: string[]
  /** Smaller objectives it is made of: it is done when its required ones are, and its own `event` is not used. */
  subs?: ObjectiveDef[]
  /** Its subs one at a time, in order, rather than all at once (the default). */
  subsOrdered?: boolean
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
  /** What it is made of (sub-objectives), if anything. */
  subs: QuestObjectiveView[]
}

export interface QuestView {
  id: string
  title: string
  state: QuestState
  objectives: QuestObjectiveView[]
}

export type QuestSave = Record<string, { state: QuestState; progress: number[]; subs?: number[][] }>

export type QuestNotice =
  | { kind: 'started'; quest: string; title: string }
  | { kind: 'objective'; quest: string; objective: string; text: string }
  | { kind: 'sub'; quest: string; objective: string; sub: string; text: string }
  | { kind: 'completed'; quest: string; title: string; reward: Record<string, number> | null }
  | { kind: 'failed'; quest: string; title: string }

export const START_PREFIX = 'quest:start:'

interface Run {
  def: QuestDef
  state: QuestState
  /**
   * Each objective's count (for one finished by `all`: which of its events have happened, one bit each; for one made of
   * subs: unused, its subs' are kept in `subs`).
   */
  progress: number[]
  /** Each objective's subs' counts, as `progress` (empty for one with none). */
  subs: number[][]
}

/** How many times it must happen to be done (for `all`: how many events). */
function needed(o: ObjectiveDef): number {
  return o.all ? o.all.length : Math.max(1, o.count ?? 1)
}
/** How far along a count (or an `all` bit set) is. */
function counted(o: ObjectiveDef, raw: number): number {
  if (!o.all) return raw
  let n = 0
  for (let b = raw; b; b &= b - 1) n++
  return n
}
const fresh = (def: QuestDef): { progress: number[]; subs: number[][] } => ({
  progress: def.objectives.map(() => 0),
  subs: def.objectives.map((o) => (o.subs ?? []).map(() => 0)),
})

/** Is it done, at `raw` (its count, or its `all` bits)? */
function done(o: ObjectiveDef, raw: number): boolean {
  return counted(o, raw) >= needed(o)
}

/** Its count (or `all` bits) after the event `name` with `payload` is heard (the same if it does not count). */
function advance(o: ObjectiveDef, raw: number, name: string, payload: unknown): number {
  if (done(o, raw)) return raw
  if (o.all) {
    const k = o.all.indexOf(name)
    return k < 0 || !matches(o.match, payload) ? raw : raw | (1 << k)
  }
  return o.event === name && matches(o.match, payload) ? raw + 1 : raw
}

/**
 * Which of `list` can be worked on: every one not done (not `ordered`), or the next required one not done (`ordered`)
 * — and the optional ones not done, always. Done is told by each one's count in `raw`, or given (`finished`).
 */
function liveIn(list: ObjectiveDef[], raw: number[], ordered: boolean, finished?: boolean[]): Set<number> {
  const live = new Set<number>()
  let nextRequired = true
  list.forEach((o, i) => {
    if (finished ? finished[i] : done(o, raw[i]!)) return
    if (o.optional) live.add(i)
    else if (!ordered || nextRequired) {
      live.add(i)
      nextRequired = false
    }
  })
  return live
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
    this.runs.set(def.id, { def, state: 'inactive', ...fresh(def) })
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
    Object.assign(run, fresh(run.def))
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
    for (const [id, r] of this.runs) {
      if (r.state === 'inactive') continue
      out[id] = { state: r.state, progress: [...r.progress] }
      if (r.subs.some((x) => x.length)) out[id]!.subs = r.subs.map((x) => [...x])
    }
    return out
  }

  /** Put quests back as `serialize` left them. Unknown ids are ignored. */
  restore(save: QuestSave): void {
    for (const [id, s] of Object.entries(save)) {
      const run = this.runs.get(id)
      if (!run) continue
      run.state = s.state
      run.progress = run.def.objectives.map((_, i) => s.progress[i] ?? 0)
      run.subs = run.def.objectives.map((o, i) => (o.subs ?? []).map((_, j) => s.subs?.[i]?.[j] ?? 0))
    }
    this.version++
  }

  private view(run: Run): QuestView {
    const live = this.liveObjectives(run)
    return {
      id: run.def.id,
      title: run.def.title,
      state: run.state,
      objectives: run.def.objectives.map((o, i) => {
        const subs = o.subs ?? []
        const raw = run.subs[i]!
        const subLive = live.has(i) ? liveIn(subs, raw, o.subsOrdered === true) : new Set<number>()
        return {
          id: o.id,
          text: o.text,
          // Made of subs: its progress is how many of its required ones are done.
          progress: subs.length ? subs.filter((x, j) => !x.optional && done(x, raw[j]!)).length : counted(o, run.progress[i]!),
          count: subs.length ? subs.filter((x) => !x.optional).length : needed(o),
          done: this.objectiveDone(run, i),
          optional: o.optional === true,
          current: live.has(i),
          subs: subs.map((x, j) => ({
            id: x.id,
            text: x.text,
            progress: counted(x, raw[j]!),
            count: needed(x),
            done: done(x, raw[j]!),
            optional: x.optional === true,
            current: subLive.has(j),
            subs: [],
          })),
        }
      }),
    }
  }

  /** Is objective `i` done: its count reached, or (made of subs) every required sub done. */
  private objectiveDone(run: Run, i: number): boolean {
    const o = run.def.objectives[i]!
    if (o.subs?.length) return o.subs.every((x, j) => x.optional || done(x, run.subs[i]![j]!))
    return done(o, run.progress[i]!)
  }

  /** Which objectives the player can be working on: the next required one (or all of them), plus optionals. */
  private liveObjectives(run: Run): Set<number> {
    const finished = run.def.objectives.map((_, i) => this.objectiveDone(run, i))
    return liveIn(run.def.objectives, [], run.def.ordered !== false, finished)
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
        if (!live.has(i)) return
        if (o.subs?.length) {
          // Its subs count instead; it is done when they are.
          const raw = run.subs[i]!
          const subLive = liveIn(o.subs, raw, o.subsOrdered === true)
          let changed = false
          o.subs.forEach((x, j) => {
            if (!subLive.has(j)) return
            const next = advance(x, raw[j]!, name, payload)
            if (next === raw[j]) return
            raw[j] = next
            changed = true
            if (done(x, next)) {
              this.notify({ kind: 'sub', quest: run.def.id, objective: o.id, sub: x.id, text: x.text })
              this.events.emit('quest:subobjective', { quest: run.def.id, objective: o.id, sub: x.id })
            }
          })
          if (changed) {
            this.version++
            if (this.objectiveDone(run, i)) doneNow.push(i)
          }
          return
        }
        const next = advance(o, run.progress[i]!, name, payload)
        if (next === run.progress[i]) return
        run.progress[i] = next
        this.version++
        if (done(o, next)) doneNow.push(i)
      })
      for (const i of doneNow) {
        const o = run.def.objectives[i]!
        this.notify({ kind: 'objective', quest: run.def.id, objective: o.id, text: o.text })
        this.events.emit('quest:objective', { quest: run.def.id, objective: o.id })
      }
      // Finished when every required objective is.
      const finished = run.def.objectives.every((o, i) => o.optional || this.objectiveDone(run, i))
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
