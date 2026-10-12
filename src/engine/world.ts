/**
 * World — the entity registry, scene owner and level (de)serialiser.
 *
 * Holds every object in the level, indexed by id, name, type and tag, so gameplay and
 * a future editor can both address objects directly. Static geometry is baked into a
 * single mesh and BVH on load; everything else lives as a real updating entity.
 */

import * as THREE from 'three'
import { Entity, type EntityDef } from './entity'
import { EventBus } from './events'
import { StaticChunks, type SyncStats } from './chunks'
import { LightPool } from './lightpool'
import { ParticleWorld } from './particles'
import { StaticBatches } from './batches'
import { CollisionSystem, type DynamicBody } from '../physics/collision'
import type { SurfaceKey } from '../render/textures'
import { Buildable } from '../entities/buildable'
import { SpawnPoint } from '../entities/misc'

export type EntityFactory = (def: EntityDef) => Entity

const factories = new Map<string, EntityFactory>()

/** Register an entity type so level files can name it. */
export function registerEntity(type: string, factory: EntityFactory): void {
  factories.set(type, factory)
}

export function knownEntityTypes(): string[] {
  return [...factories.keys()].sort()
}

export interface LevelFile {
  name: string
  version: 1
  fog?: { color: number; near: number; far: number }
  background?: number
  entities: EntityDef[]
}

export class World {
  readonly scene = new THREE.Scene()
  readonly events = new EventBus()
  readonly collision = new CollisionSystem()

  readonly entities = new Map<string, Entity>()
  private readonly byType = new Map<string, Set<Entity>>()
  private readonly byTag = new Map<string, Set<Entity>>()
  private readonly updating: Entity[] = []

  /** Where the player is, for triggers and AI. Written by the game each tick. */
  readonly playerPosition = new THREE.Vector3()

  levelName = ''
  /** The level's static geometry: baked in cells, each with its own meshes and collision (see chunks.ts). */
  readonly statics = new StaticChunks(this.scene, this.collision)
  /** The pool that lends a few real lights to the nearest placed ones (see lightpool.ts). */
  readonly lights = new LightPool(this.scene)
  /**
   * Every particle in the level — dust, smoke, sparks, flame, tracers, rubble — drawn by the
   * engine in one draw call per style (see particles/system.ts). Effects are fired by name:
   * from code, from an `fx` event on the bus, or by an `emitter` entity placed in the level.
   */
  readonly particles = new ParticleWorld(this.scene, this.events)
  /** Small props (the breakables) drawn as one mesh per material rather than a few draw calls each (batches.ts). */
  readonly batches = new StaticBatches(this.scene)
  /** The level is being built (the editor is open): what only a builder should see is shown. */
  building = false
  /** What the last `bake()` did: how many cells it rebuilt and how long it took. */
  lastBake: SyncStats = { cells: 0, rebuilt: 0, removed: 0, ms: 0, slowestCell: 0 }

  // --- entity lifecycle ----------------------------------------------------

  private idCounter = 0

  /** Next free id in this World. Ids are per-World, never global. */
  private nextId(): string {
    let id: string
    do {
      id = `e${++this.idCounter}`
    } while (this.entities.has(id))
    return id
  }

  add<T extends Entity>(entity: T): T {
    if (!entity.id) {
      entity.id = this.nextId()
    } else if (this.entities.has(entity.id)) {
      throw new Error(`World: duplicate entity id "${entity.id}"`)
    } else {
      // Keep the counter ahead of explicitly-loaded ids, so a later runtime spawn
      // cannot collide with something the level file already named.
      const n = /^e(\d+)$/.exec(entity.id)
      if (n) this.idCounter = Math.max(this.idCounter, Number(n[1]))
    }
    entity.world = this
    this.entities.set(entity.id, entity)

    let types = this.byType.get(entity.type)
    if (!types) this.byType.set(entity.type, (types = new Set()))
    types.add(entity)

    for (const tag of entity.tags) {
      let set = this.byTag.get(tag)
      if (!set) this.byTag.set(tag, (set = new Set()))
      set.add(entity)
    }

    if (entity.needsUpdate) this.updating.push(entity)
    entity.onSpawn()
    return entity
  }

  /** Instantiate from a level-file definition. */
  spawn(def: EntityDef): Entity {
    const factory = factories.get(def.type)
    if (!factory) throw new Error(`World: unknown entity type "${def.type}"`)
    return this.add(factory(def))
  }

  remove(entity: Entity): void {
    if (!this.entities.delete(entity.id)) return
    entity.onDestroy()
    this.byType.get(entity.type)?.delete(entity)
    for (const tag of entity.tags) this.byTag.get(tag)?.delete(entity)
    const i = this.updating.indexOf(entity)
    if (i >= 0) this.updating.splice(i, 1)
  }

  // --- lookup --------------------------------------------------------------

  byId(id: string): Entity | undefined {
    return this.entities.get(id)
  }

  byName(name: string): Entity | undefined {
    for (const e of this.entities.values()) if (e.name === name) return e
    return undefined
  }

  ofType<T extends Entity>(type: string): T[] {
    return [...(this.byType.get(type) ?? [])] as T[]
  }

  tagged<T extends Entity>(tag: string): T[] {
    return [...(this.byTag.get(tag) ?? [])] as T[]
  }

  /**
   * The object a raycast hit belongs to — pass `intersection.faceIndex`.
   * Goes through the collision system's index mapping, because MeshBVH permutes
   * triangle order while building.
   */
  brushAtTriangle(faceIndex: number): Buildable | null {
    return this.brushByIndex(this.collision.brushForTriangle(faceIndex))
  }

  /**
   * The surface where a ray met something: on a moving body (a breakable, a mover, a door) its owner's part there, on
   * the level the baked object's. Null when it is not a buildable at all.
   */
  surfaceAt(body: DynamicBody | null, faceIndex: number, point: THREE.Vector3): SurfaceKey | null {
    const owner = body ? body.owner : faceIndex >= 0 ? this.brushAtTriangle(faceIndex) : null
    return owner instanceof Buildable ? owner.surfaceAt(point) : null
  }

  /** The object for a bake index, as reported in Contacts.brushIndex. */
  brushByIndex(bakeIndex: number): Buildable | null {
    return this.statics.entityAt(bakeIndex)
  }

  /** Collision triangles in the whole level. */
  get triangleCount(): number {
    return this.collision.triangleCount
  }

  /** Triangles of the static render geometry that is built right now (see chunks.ts: only what is near is). */
  get renderTriangles(): number {
    return this.statics.renderTriangles
  }

  /** How many cells have render geometry built at the moment. */
  get builtCellCount(): number {
    return this.statics.builtCellCount
  }

  /**
   * How far the camera sees, metres: just past where the level's fog hides everything, or far if there is no
   * fog. The camera's far plane and the streaming of cells both follow it, so nothing is built or drawn
   * beyond what could be seen.
   */
  get drawDistance(): number {
    const fog = this.scene.fog as THREE.Fog | null
    return fog && fog.far > 0 ? Math.max(60, fog.far * 1.1 + 12) : 600
  }

  /** How many cells the static level is cut into. */
  get cellCount(): number {
    return this.statics.cellCount
  }

  /** Triangles never emitted because a neighbouring part covers their face. */
  get culledTriangles(): number {
    return this.statics.culledTriangles
  }

  /** Of the render triangles, the fine detail that far cells do not draw. */
  get detailTriangles(): number {
    return this.statics.detailTriangles
  }

  /** Every static buildable, in a stable order. */
  buildables(): Buildable[] {
    const out: Buildable[] = []
    for (const e of this.entities.values()) if (e instanceof Buildable) out.push(e)
    out.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    return out
  }

  // --- level ---------------------------------------------------------------

  /** The start of a load: clear, and set the scene's background and fog. Returns the entities to spawn. */
  private beginLevel(file: LevelFile): EntityDef[] {
    this.clear()
    this.levelName = typeof file?.name === 'string' ? file.name : ''

    if (file.background !== undefined) this.scene.background = new THREE.Color(file.background)
    if (file.fog) this.scene.fog = new THREE.Fog(file.fog.color, file.fog.near, file.fog.far)
    return Array.isArray(file?.entities) ? file.entities : []
  }

  /**
   * One bad entity must not take the level down with it. A throw here used to abort the load after `clear()`
   * but before `bake()` — no collision at all — so an unknown type or a duplicated id in the saved level
   * dropped every player through the floor forever. The bad entity is skipped and everything else loads.
   */
  private spawnOne(def: EntityDef): void {
    try {
      this.spawn(def)
    } catch (err) {
      console.warn('World: skipped an entity that failed to load', def, err)
    }
  }

  load(file: LevelFile): void {
    for (const def of this.beginLevel(file)) this.spawnOne(def)
    this.bake()
  }

  /**
   * The same load, a few milliseconds at a time, so the page can paint and a loading bar can move while a
   * big level is spawned and baked. `onProgress` is given 0..1 over both.
   */
  async loadAsync(file: LevelFile, onProgress?: (done: number) => void, yieldFn: () => Promise<void> = () => new Promise((r) => setTimeout(r, 0)), sliceMs = 14): Promise<void> {
    const defs = this.beginLevel(file)
    const SPAWN_SHARE = 0.25
    let t = performance.now()
    for (let i = 0; i < defs.length; i++) {
      this.spawnOne(defs[i]!)
      if (performance.now() - t > sliceMs) {
        onProgress?.((SPAWN_SHARE * (i + 1)) / defs.length)
        await yieldFn()
        t = performance.now()
      }
    }
    onProgress?.(SPAWN_SHARE)
    this.aimStatics()
    this.lastBake = await this.statics.syncAsync(this.staticBuildables(), (p) => onProgress?.(SPAWN_SHARE + (1 - SPAWN_SHARE) * p), yieldFn, sliceMs)
  }

  /** Tell the cells where the view is and how far it reaches, before they are baked. */
  private aimStatics(): void {
    this.statics.drawDistance = this.drawDistance
    // Before the camera has been anywhere, the view is the level's start.
    if (!this.statics.hasCamera) {
      const spawn = this.spawnPoint()
      if (spawn) this.statics.focus.copy(spawn.object.position)
      else this.statics.focus.set(0, 0, 0)
    }
  }

  private staticBuildables(): Buildable[] {
    return this.buildables().filter((b) => b.isStatic)
  }

  /**
   * Bring the static level's meshes and collision up to date. Only the cells whose buildables changed are
   * baked again, so calling this after every edit costs the cell that was edited, not the level.
   */
  bake(): void {
    this.aimStatics()
    this.lastBake = this.statics.sync(this.staticBuildables())
  }

  /**
   * Once a frame, before drawing: stream the level's cells to where the camera is (built as it nears them, let
   * go as it leaves; see chunks.ts), and lend the real point lights to the nearest placed ones.
   */
  updateLod(camera: THREE.Vector3, dt = 1 / 60, distance: number = this.drawDistance): void {
    this.statics.drawDistance = distance
    this.statics.update(camera)
    this.lights.update(camera, dt)
    this.batches.update()
  }

  /** Reused snapshot of `updating`, so a tick allocates nothing. */
  private readonly tickList: Entity[] = []

  update(dt: number): void {
    // Iterate a copy: an entity may spawn or destroy others from its update. The copy
    // goes into a reused array — a fresh spread 120 times a second is steady garbage
    // for the collector to stop the frame over on a Chromebook.
    const list = this.tickList
    list.length = 0
    for (const e of this.updating) list.push(e)
    for (let i = 0; i < list.length; i++) {
      const e = list[i]!
      if (e.enabled) e.onUpdate(dt)
    }
    list.length = 0
  }

  spawnPoint(): SpawnPoint | null {
    return this.ofType<SpawnPoint>('spawn')[0] ?? null
  }

  serialize(): LevelFile {
    const file: LevelFile = { name: this.levelName, version: 1, entities: [] }
    const bg = this.scene.background
    if (bg instanceof THREE.Color) file.background = bg.getHex()
    const fog = this.scene.fog
    if (fog instanceof THREE.Fog) {
      file.fog = { color: fog.color.getHex(), near: fog.near, far: fog.far }
    }
    // Stable order so two serialises of the same level compare equal.
    const all = [...this.entities.values()].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    for (const e of all) file.entities.push(e.serialize())
    return file
  }

  clear(): void {
    for (const e of [...this.entities.values()]) this.remove(e)
    this.entities.clear()
    this.byType.clear()
    this.byTag.clear()
    this.updating.length = 0
    this.events.clear()
    this.statics.clear()
    this.particles.clear()
    // The pool's lights are kept for reuse; only the placed sources went with their entities.
  }
}
