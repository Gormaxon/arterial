/**
 * Minimal event bus. Level entities talk to each other through named events rather
 * than direct references, so a trigger can target a door that does not exist yet —
 * which is exactly what level editing needs.
 */

export type Listener<T> = (payload: T) => void

export class EventBus {
  private readonly map = new Map<string, Set<Listener<never>>>()
  private readonly taps = new Set<(name: string, payload: unknown) => void>()

  /** Returns an unsubscribe function. */
  on<T>(name: string, fn: Listener<T>): () => void {
    let set = this.map.get(name)
    if (!set) {
      set = new Set()
      this.map.set(name, set)
    }
    set.add(fn as Listener<never>)
    return () => this.off(name, fn)
  }

  off<T>(name: string, fn: Listener<T>): void {
    this.map.get(name)?.delete(fn as Listener<never>)
  }

  /**
   * Hear every event, whatever its name. Unlike `on`, a tap survives `clear()`, so an
   * engine system can watch for a family of events across level loads.
   */
  tap(fn: (name: string, payload: unknown) => void): void {
    this.taps.add(fn)
    this.tapList = null
  }

  emit<T>(name: string, payload: T): void {
    // The taps as an array, made again only when one is added: emit runs for every shot, hit and effect, and two fresh
    // copies an event were steady garbage on the Chromebook.
    let taps = this.tapList
    if (!taps) taps = this.tapList = [...this.taps]
    for (let i = 0; i < taps.length; i++) taps[i]!(name, payload)
    const set = this.map.get(name)
    if (!set || set.size === 0) return
    if (set.size === 1) {
      for (const fn of set) (fn as Listener<T>)(payload)
      return
    }
    // Copy before iterating: a listener that unsubscribes itself (common for
    // once-only triggers) would otherwise mutate the set mid-iteration.
    for (const fn of [...set]) (fn as Listener<T>)(payload)
  }
  private tapList: ((name: string, payload: unknown) => void)[] | null = null

  clear(): void {
    this.map.clear()
  }
}
