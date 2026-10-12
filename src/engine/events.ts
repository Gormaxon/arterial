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
  }

  emit<T>(name: string, payload: T): void {
    for (const t of [...this.taps]) t(name, payload)
    const set = this.map.get(name)
    if (!set) return
    // Copy before iterating: a listener that unsubscribes itself (common for
    // once-only triggers) would otherwise mutate the set mid-iteration.
    for (const fn of [...set]) (fn as Listener<T>)(payload)
  }

  clear(): void {
    this.map.clear()
  }
}
