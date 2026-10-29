/**
 * Checkpoints: the mission as it stood when one was reached, kept so a death can bring it back rather than start the
 * mission over.
 *
 * Reaching one is an EVENT, as everything a level does is: `checkpoint:reached` (`CheckpointReached`: which one, where
 * you come back, facing which way) — said by a checkpoint placed in the level as you walk into it, or by anything else
 * that wants the mission kept there (a cutscene's end, a boss's fall). The system hears it through the bus's tap (so a
 * level load does not deafen it) and takes the mission state there and then (`MissionState`):
 *
 *   quests     every quest's state and progress, sub-objectives too (QuestSystem.serialize).
 *   entities   what play has done to the level, from every entity that keeps any (Entity.saveState): a fight won, a door
 *              opened, a pickup taken. By entity id: a level's ids are its own and outlive its being loaded again.
 *   parts      whatever else the game keeps for a mission, each under its own name (`part`): its clock and its kills,
 *              what the player carries, upgrades. Plain data from each, back to each.
 *
 * Bringing it back (`restore`) is onto the level as it starts — loaded afresh, the player put back — so what an entity
 * did not keep is simply as the level starts it. Nothing is announced by being put back (no quest starts, no fight is
 * cleared again) but `checkpoint:restored` itself. The state is plain data throughout, so the game may store it too.
 *
 * Said on the bus: `checkpoint:saved` { checkpoint } once one is taken, `checkpoint:restored` { checkpoint } once one is
 * back. It is forgotten (`clear`) by the game when the mission starts again from nothing (it is done, or played anew),
 * and on its own when another level is loaded (`level:loading` for a level other than its own).
 */

import type { World } from './world'
import type { QuestSave, QuestSystem } from './quests'

export const CHECKPOINT_REACHED = 'checkpoint:reached'
export const CHECKPOINT_SAVED = 'checkpoint:saved'
export const CHECKPOINT_RESTORED = 'checkpoint:restored'

/** What `checkpoint:reached` carries. */
export interface CheckpointReached {
  /** Which checkpoint: its entity id (or any name the sayer gives it). */
  id: string
  name: string
  /** Where the player comes back: the floor under it, in world space. */
  at: [number, number, number]
  /** The way the player faces coming back (radians, about the up axis). */
  yaw: number
}

/** Something more of a mission to keep at a checkpoint: plain data out, the same back. */
export interface MissionPart {
  save(): unknown
  load(state: unknown): void
}

export interface MissionState {
  checkpoint: CheckpointReached
  /** The level it was taken in (whatever `level` says), so it is never put onto another. */
  level: string | null
  quests: QuestSave
  /** Entity id to what it kept (Entity.saveState). */
  entities: Record<string, unknown>
  /** Part name to what it kept. */
  parts: Record<string, unknown>
}

/** Plain data, copied: a state kept is not changed by what is done with it, nor by what it was taken from. */
function copy<T>(v: T): T {
  return v === undefined ? v : (JSON.parse(JSON.stringify(v)) as T)
}

export class CheckpointSystem {
  /** The mission as the last checkpoint left it. Null: none reached since the mission started. */
  state: MissionState | null = null
  /** Which level is loaded, by the game's id for it (LevelSet.current): what a state is taken for. */
  level: () => string | null = () => null
  private readonly parts = new Map<string, MissionPart>()

  constructor(
    private readonly world: World,
    private readonly quests: QuestSystem | null = null,
  ) {
    world.events.tap((name, payload) => {
      if (name === CHECKPOINT_REACHED) this.save(payload as CheckpointReached)
      else if (name === 'level:loading' && this.state && (payload as { level?: unknown } | null)?.level !== this.state.level) this.clear()
    })
  }

  /** Keep `part` with every checkpoint, under `name` (one of the same name is replaced). */
  part(name: string, part: MissionPart): this {
    this.parts.set(name, part)
    return this
  }

  /** The mission as it stands, kept as reached at `at`. Announces `checkpoint:saved`. */
  save(at: CheckpointReached): MissionState {
    const entities: Record<string, unknown> = {}
    for (const e of this.world.entities.values()) {
      // What the game made while it runs (a spawner's enemies) is not the level's: its maker keeps what matters of it.
      if (e.transient || e.removed) continue
      const s = e.saveState()
      if (s !== undefined) entities[e.id] = copy(s)
    }
    const parts: Record<string, unknown> = {}
    for (const [name, p] of this.parts) parts[name] = copy(p.save())
    this.state = {
      checkpoint: copy(at),
      level: this.level(),
      quests: this.quests ? copy(this.quests.serialize()) : {},
      entities,
      parts,
    }
    this.world.events.emit(CHECKPOINT_SAVED, { checkpoint: this.state.checkpoint })
    return this.state
  }

  /**
   * The last checkpoint's mission put back, onto the level as it starts (loaded afresh, the player put back: the
   * game's part). False, and nothing done, with none kept, or one kept for another level.
   */
  restore(): boolean {
    const s = this.state
    if (!s || s.level !== this.level()) return false
    this.quests?.restore(copy(s.quests))
    for (const id in s.entities) this.world.entities.get(id)?.loadState(copy(s.entities[id]))
    for (const [name, p] of this.parts) if (name in s.parts) p.load(copy(s.parts[name]))
    this.world.events.emit(CHECKPOINT_RESTORED, { checkpoint: s.checkpoint })
    return true
  }

  /** None kept: a death from here starts the mission over. */
  clear(): void {
    this.state = null
  }
}
