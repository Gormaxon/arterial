/**
 * Upgrades: tracks a player moves up, a level at a time, each level improving something.
 *
 *   Track     One line of improvement (`UpgradeTrack`): an id, how many levels it has, and `apply(level)` — its
 *             effect at that level put onto whatever it improves. Level 0 is none of it.
 *   Upgrades  Where each track is up to. Whenever a level changes, what they improve is put back to its base (`base`)
 *             and every track applied again at its level: the effects are always worked out from the levels, never
 *             piled up on one another, so a level taken back or restored from a save comes out right.
 *   Saved     As plain data (`save`: track id to level), to be stored with a checkpoint or a save and put back
 *             (`restore`). A track a save does not know is at 0; a level past a track's top is held to it.
 *
 * What the tracks are and what they do is the game's (player/upgrades.ts); this only keeps their levels.
 */

export interface UpgradeTrack {
  readonly id: string
  /** Levels above 0 it has. */
  readonly levels: number
  /** Put its effect at `level` (0..levels) onto what it improves, freshly back at its base. */
  apply(level: number): void
}

/** Where every track is up to, by id: what is stored. */
export type UpgradeSave = Record<string, number>

export class Upgrades {
  private readonly tracks = new Map<string, UpgradeTrack>()
  private readonly at = new Map<string, number>()

  /** `base`: what the tracks improve put back as it is with no upgrades at all. */
  constructor(tracks: readonly UpgradeTrack[], private readonly base: () => void) {
    for (const t of tracks) {
      this.tracks.set(t.id, t)
      this.at.set(t.id, 0)
    }
    this.applyAll()
  }

  /** The level `id` is at (0: not upgraded, or no such track). */
  level(id: string): number {
    return this.at.get(id) ?? 0
  }

  /** The top level of `id`. */
  max(id: string): number {
    return this.tracks.get(id)?.levels ?? 0
  }

  /** Up one level, if it is not at its top. True if it went up. */
  raise(id: string): boolean {
    const level = this.level(id)
    if (!this.tracks.has(id) || level >= this.max(id)) return false
    return this.set(id, level + 1)
  }

  /** `id` put at `level` (held to 0..its top). True if that changed it. */
  set(id: string, level: number): boolean {
    if (!this.tracks.has(id)) return false
    const to = Math.max(0, Math.min(this.max(id), Math.floor(level)))
    if (to === this.level(id)) return false
    this.at.set(id, to)
    this.applyAll()
    return true
  }

  /** Every track's level, as plain data. */
  save(): UpgradeSave {
    const out: UpgradeSave = {}
    for (const [id, level] of this.at) out[id] = level
    return out
  }

  /** Every track put at the level `data` has for it (one it does not have: 0). */
  restore(data: UpgradeSave | null | undefined): void {
    for (const id of this.tracks.keys()) {
      const level = data?.[id]
      this.at.set(id, Math.max(0, Math.min(this.max(id), Math.floor(typeof level === 'number' && Number.isFinite(level) ? level : 0))))
    }
    this.applyAll()
  }

  /** Every track back to 0. */
  clear(): void {
    this.restore(null)
  }

  private applyAll(): void {
    this.base()
    for (const [id, track] of this.tracks) track.apply(this.at.get(id) ?? 0)
  }
}
