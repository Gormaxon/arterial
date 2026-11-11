/**
 * Transmissions: lines over the radio — the handler, command, anyone on the net — shown on the HUD one at a time.
 *
 * A transmission is plain data (`TransmissionDef`): an id and its lines, each said by someone. It plays when the world's
 * bus hears `comms:play:<id>`, or any of its own `on` events — so a level plays one with a trigger, a quest with its
 * events (`quest:started:<id>`, an objective done), a cutscene with a step's `event`, and none of it is game code.
 *
 * One plays at a time: one asked for while another is on waits its turn (QUEUE_MAX at most; a `cut` transmission stops
 * what is on and goes first, for the moment that cannot wait). Each plays once, unless it is `repeat`; reset() (a death,
 * the level started over) lets them play again. Each line is held for its `hold` seconds, or by its length.
 *
 * The system keeps time and says what is on; it draws nothing (the game's HUD does: onLine). It announces
 * `comms:line` ({ id, from, text, index }) as each line comes on, and `comms:done:<id>` when a transmission is over, so a
 * door can open on the end of a briefing, or the next transmission follow it, with no code.
 */

import type { EventBus } from './events'

export interface TransmissionLine {
  /** Who is speaking, as the HUD names them: HANDLER, COMMAND, OVERWATCH... */
  from: string
  text: string
  /** Seconds it stays up. Default: by its length (readLine). */
  hold?: number
}

export interface TransmissionDef {
  id: string
  /** Events that play it, besides `comms:play:<id>`. */
  on?: string | string[]
  lines: TransmissionLine[]
  /** Plays every time it is asked for, not only the first. */
  repeat?: boolean
  /** Stops whatever is on (and empties the queue) and plays now. */
  cut?: boolean
  /** Seconds after it is asked for before its first line. Default 0. */
  delay?: number
}

/** A line as it is on now. */
export interface ActiveLine {
  id: string
  from: string
  text: string
  index: number
  /** Lines in this transmission. */
  of: number
  /** Seconds it has been up. */
  age: number
  /** Seconds it stays up. */
  hold: number
}

/** Seconds a line stays up when it does not say: long enough to read at an easy pace, never a flash. */
export function readLine(text: string): number {
  return Math.min(9, 1.6 + text.length * 0.055)
}

/** Transmissions waiting their turn, at most: past this, the oldest waiting is dropped. */
const QUEUE_MAX = 4
/** Seconds of quiet between one transmission and the next. */
const GAP = 0.6

export class CommsSystem {
  private readonly defs = new Map<string, TransmissionDef>()
  /** Which transmissions each event plays. */
  private readonly byEvent = new Map<string, string[]>()
  private readonly played = new Set<string>()
  private readonly queue: { id: string; wait: number }[] = []
  private playing: { def: TransmissionDef; index: number; age: number; hold: number } | null = null
  private quiet = 0
  private readonly lineListeners: ((line: ActiveLine | null) => void)[] = []

  constructor(private readonly events: EventBus) {
    events.tap((name) => this.hear(name))
  }

  register(def: TransmissionDef): void {
    if (this.defs.has(def.id)) throw new Error(`comms: two transmissions called "${def.id}"`)
    if (def.lines.length === 0) throw new Error(`comms: transmission "${def.id}" has no lines`)
    this.defs.set(def.id, def)
    const on = def.on === undefined ? [] : Array.isArray(def.on) ? def.on : [def.on]
    for (const e of [`comms:play:${def.id}`, ...on]) {
      const list = this.byEvent.get(e)
      if (list) list.push(def.id)
      else this.byEvent.set(e, [def.id])
    }
  }

  get(id: string): TransmissionDef | undefined {
    return this.defs.get(id)
  }

  /** Told each time a line comes on, and with null when the panel falls quiet. */
  onLine(fn: (line: ActiveLine | null) => void): void {
    this.lineListeners.push(fn)
  }

  /** Play a transmission by id (as `comms:play:<id>` does). */
  play(id: string): void {
    const def = this.defs.get(id)
    if (!def) return
    if (!def.repeat && this.played.has(id)) return
    this.played.add(id)
    if (def.cut) {
      this.queue.length = 0
      if (this.playing) this.finish()
      this.quiet = 0
    }
    if (this.queue.length >= QUEUE_MAX) this.queue.shift()
    this.queue.push({ id, wait: def.delay ?? 0 })
  }

  /** The line on now, or null. */
  current(): ActiveLine | null {
    const p = this.playing
    if (!p) return null
    const l = p.def.lines[p.index]!
    return { id: p.def.id, from: l.from, text: l.text, index: p.index, of: p.def.lines.length, age: p.age, hold: p.hold }
  }

  /** Has it played (since the last reset)? */
  hasPlayed(id: string): boolean {
    return this.played.has(id)
  }

  /** Time on, by `dt` seconds of play (not called while paused, so the radio waits with the game). */
  update(dt: number): void {
    const p = this.playing
    if (p) {
      p.age += dt
      if (p.age < p.hold) return
      if (p.index + 1 < p.def.lines.length) {
        p.index++
        p.age = 0
        p.hold = this.holdOf(p.def, p.index)
        this.announce()
        return
      }
      this.finish()
      this.quiet = GAP
      return
    }
    if (this.quiet > 0) {
      this.quiet -= dt
      return
    }
    const next = this.queue[0]
    if (!next) return
    next.wait -= dt
    if (next.wait > 0) return
    this.queue.shift()
    const def = this.defs.get(next.id)
    if (!def) return
    this.playing = { def, index: 0, age: 0, hold: this.holdOf(def, 0) }
    this.events.emit('comms:started', { id: def.id })
    this.announce()
  }

  /** Quiet again, nothing waiting, and every transmission free to play again: a death, the level started over. */
  reset(): void {
    const was = this.playing !== null
    this.playing = null
    this.queue.length = 0
    this.played.clear()
    this.quiet = 0
    if (was) for (const fn of this.lineListeners) fn(null)
  }

  /** `comms:play:<id>` is in byEvent as each is registered, so one look covers it and the `on` events (which can be another's `comms:done:<id>`, to chain them). */
  private hear(name: string): void {
    const ids = this.byEvent.get(name)
    if (ids) for (const id of ids) this.play(id)
  }

  private holdOf(def: TransmissionDef, index: number): number {
    const l = def.lines[index]!
    return l.hold ?? readLine(l.text)
  }

  private announce(): void {
    const line = this.current()
    if (!line) return
    this.events.emit('comms:line', { id: line.id, from: line.from, text: line.text, index: line.index })
    for (const fn of this.lineListeners) fn(line)
  }

  private finish(): void {
    const p = this.playing
    if (!p) return
    this.playing = null
    this.events.emit(`comms:done:${p.def.id}`, null)
    for (const fn of this.lineListeners) fn(null)
  }
}
