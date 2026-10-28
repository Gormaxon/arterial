/**
 * More than one level: a game's levels in order, which one is loaded, and the way from one to the next.
 *
 * A level is an entry (`LevelEntry`): an id, what it is called, and where its file comes from — a file in hand, or a
 * function that fetches or builds one (a server's saved copy, falling back to the one that ships). The set loads one
 * into its world by id (`load`), and goes on to the next (`next`: the entry's own `next`, else the one added after it).
 *
 * Going on is an EVENT, as everything a level does is: a trigger at the end of a level, a door, a boss's
 * `boss:defeated:<id>` or a quest's `quest:completed:<id>` can each say `level:exit` (on to the next) or
 * `level:goto:<id>` (to that one), with no code. The set hears them through the bus's tap, so a level load — which
 * clears the bus — does not deafen it, and it acts on them once the step that announced them is over (a level is not
 * replaced from under the entities being updated).
 *
 * Announced: `level:loading` { level, index, title }, then `level:loaded` { level, index, title } once the new level is
 * in (its entities spawned and baked, so they hear it too), `level:complete` { level } as one is left by its exit, and
 * `levels:finished` { level } when the last is left with nowhere to go. It keeps which levels have been reached and
 * finished (`save` / `restore`, plain data for wherever the game keeps its progress). It draws nothing.
 */

import type { LevelFile, World } from './world'

export interface LevelEntry {
  id: string
  /** What the player is told it is called. Default: the file's own name. */
  title?: string
  /** The level's file, or what gets it. Null (none to be had): the load fails and the level loaded stays. */
  source: LevelFile | (() => LevelFile | null | Promise<LevelFile | null>)
  /** The level after it. Default: the one added after it. */
  next?: string
}

export interface LevelSave {
  current: string | null
  reached: string[]
  completed: string[]
}

export interface LevelInfo {
  level: string
  index: number
  title: string
}

export const LEVEL_EXIT = 'level:exit'
export const LEVEL_GOTO_PREFIX = 'level:goto:'

/**
 * How a level is loaded. With neither, in one go (World.load): what a change of level in play wants, so nothing runs
 * on a level half spawned. With either, a slice at a time (World.loadAsync) — for a loading screen, with the game's
 * loop not yet running.
 */
export interface LoadOptions {
  /** 0..1 as it spawns and bakes. */
  onProgress?: (done: number) => void
  /** How it lets the page breathe between slices. */
  yieldFn?: () => Promise<void>
}

export class LevelSet {
  private readonly entries: LevelEntry[] = []
  /** The level loaded, or null before the first. */
  current: string | null = null
  private readonly reached = new Set<string>()
  private readonly completed = new Set<string>()
  /** A load under way, and one asked for while it was. */
  private loading: Promise<boolean> | null = null
  private queued: { id: string; opts?: LoadOptions } | null = null
  /** What the queued ask resolves to: every caller that asked while one was loading hears how the latest went. */
  private queuedDone: Promise<boolean> | null = null
  /** An exit heard and not yet acted on: a second exit in the same step (two triggers, a boss and a quest) is the same
   * way out, not a second one — it would otherwise complete the level just loaded too, and skip one. */
  private leaving = false

  constructor(private readonly world: World) {
    world.events.tap((name, payload) => {
      if (name === LEVEL_EXIT) {
        const to = (payload as { to?: unknown } | null)?.to
        this.later(() => this.leave(typeof to === 'string' ? to : undefined))
      } else if (name.charCodeAt(0) === 108 /* l */ && name.startsWith(LEVEL_GOTO_PREFIX)) {
        const to = name.slice(LEVEL_GOTO_PREFIX.length)
        this.later(() => this.leave(to))
      }
    })
  }

  /** Add a level (after those already added). Replaces one of the same id where it stands. */
  add(entry: LevelEntry): this {
    const i = this.entries.findIndex((e) => e.id === entry.id)
    if (i >= 0) this.entries[i] = entry
    else this.entries.push(entry)
    return this
  }

  get list(): readonly LevelEntry[] {
    return this.entries
  }

  get(id: string): LevelEntry | undefined {
    return this.entries.find((e) => e.id === id)
  }

  indexOf(id: string): number {
    return this.entries.findIndex((e) => e.id === id)
  }

  /** The level after `id` (its own `next`, else the one added after it), or null at the end. */
  nextOf(id: string): string | null {
    const e = this.get(id)
    if (!e) return null
    if (e.next) return this.get(e.next) ? e.next : null
    return this.entries[this.indexOf(id) + 1]?.id ?? null
  }

  isReached(id: string): boolean {
    return this.reached.has(id)
  }

  isCompleted(id: string): boolean {
    return this.completed.has(id)
  }

  /**
   * Load a level into the world. Resolves true once it is in, false if there is no such level or no file to be had
   * (the level loaded stays). Asked again while one is loading, the latest ask is loaded after it.
   */
  async load(id: string, opts?: LoadOptions): Promise<boolean> {
    if (this.loading) {
      this.queued = { id, opts }
      if (!this.queuedDone) this.queuedDone = this.loading.then(() => this.drain(), () => this.drain())
      return this.queuedDone
    }
    this.loading = this.loadNow(id, opts)
    try {
      return await this.loading
    } finally {
      this.loading = null
    }
  }

  /** The level loaded, from the start again. */
  restart(opts?: LoadOptions): Promise<boolean> {
    return this.current ? this.load(this.current, opts) : Promise.resolve(false)
  }

  /** On to the level after this one. False at the end (and `levels:finished` is announced). */
  next(opts?: LoadOptions): Promise<boolean> {
    return this.leave(undefined, opts)
  }

  /** Progress, as plain data. */
  save(): LevelSave {
    return { current: this.current, reached: [...this.reached], completed: [...this.completed] }
  }

  /** Progress back from `save` (levels no longer in the set are kept, in case they come back). Loads nothing. */
  restore(save: Partial<LevelSave> | null | undefined): void {
    this.reached.clear()
    this.completed.clear()
    for (const id of save?.reached ?? []) if (typeof id === 'string') this.reached.add(id)
    for (const id of save?.completed ?? []) if (typeof id === 'string') this.completed.add(id)
  }

  /** Leave the level loaded by its exit: it is complete, and the next (or `to`) is loaded. */
  private async leave(to: string | undefined, opts?: LoadOptions): Promise<boolean> {
    const from = this.current
    if (from) {
      this.completed.add(from)
      this.world.events.emit('level:complete', { level: from })
    }
    const target = to ?? (from ? this.nextOf(from) : this.entries[0]?.id ?? null)
    if (!target) {
      this.world.events.emit('levels:finished', { level: from })
      return false
    }
    return this.load(target, opts)
  }

  private async loadNow(id: string, opts?: LoadOptions): Promise<boolean> {
    const entry = this.get(id)
    if (!entry) return false
    const file = typeof entry.source === 'function' ? await entry.source() : entry.source
    if (!file) return false
    const info: LevelInfo = { level: id, index: this.indexOf(id), title: entry.title ?? file.name }
    this.world.events.emit('level:loading', info)
    if (opts?.onProgress || opts?.yieldFn) await this.world.loadAsync(file, opts.onProgress, opts.yieldFn)
    else this.world.load(file)
    this.current = id
    this.reached.add(id)
    this.world.events.emit('level:loaded', info)
    return true
  }

  private drain(): Promise<boolean> {
    const q = this.queued
    this.queued = null
    this.queuedDone = null
    return q ? this.load(q.id, q.opts) : Promise.resolve(false)
  }

  /** After the step that announced it: a level is not replaced from under the entities being updated. Once per way
   * out: further exits are ignored until that one's level is in. */
  private later(fn: () => Promise<boolean>): void {
    if (this.leaving) return
    this.leaving = true
    void Promise.resolve()
      .then(fn)
      .finally(() => {
        this.leaving = false
      })
  }
}
