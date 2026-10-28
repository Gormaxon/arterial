/**
 * World — the entity registry, scene owner and level (de)serialiser.
 *
 * Holds every object in the level, indexed by id, name, type and tag, so gameplay and
 * a future editor can both address objects directly. Static geometry is baked into a
 * single mesh and BVH on load; everything else lives as a real updating entity.
 */

import * as THREE from 'three'
import { walkShown } from '../render/walk'
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
import { NavGrid } from './navgrid'

/** Milliseconds a frame the crowd's pathfinding may take (World.navSlice → NavGrid.tick): its grid, its field. */
const NAV_BUDGET_MS = 1.5
/** Milliseconds the pathfinding may be put off by heavy frames (navSlice), at most; then it has NAV_MIN_MS regardless. */
const NAV_STARVE_MS = 250
const NAV_MIN_MS = 0.3
/**
 * Milliseconds a frame the once-a-frame entities (Entity.tickPerFrame: enemies, sentries, spawners) may take between
 * them (World.update). Past it the rest of them wait for the next frame, keeping the time they are owed — taken in turn,
 * so no one waits twice running while others go — and none waits longer than FRAME_DEFER_MAX_S. A room of riflemen all
 * thinking, posing and arriving on one frame was the slowest frames of a fight on the Chromebook: 10–19 ms of them.
 */
const FRAME_ENTITY_BUDGET_MS = 3
/**
 * Seconds a once-a-frame entity may be kept waiting by the budget, at most; and while the machine is well behind (no
 * longer: at a tenth of a second the riflemen were seen to move in jerks on the Chromebook).
 */
const FRAME_DEFER_MAX_S = 0.05
const FRAME_DEFER_LOW_S = 0.066

/** The material slots three.js places a texture in by its matrix (WebGLMaterials refreshTransformUniform): freezeStill. */
const TEXTURE_SLOTS = ['map', 'alphaMap', 'aoMap', 'bumpMap', 'displacementMap', 'emissiveMap', 'lightMap', 'metalnessMap', 'normalMap', 'roughnessMap', 'specularMap'] as const

/** The view of a type or tag no entity has (World.typeView). */
const NONE: ReadonlySet<Entity> = new Set()

export type EntityFactory = (def: EntityDef) => Entity

/** An enemy type, as the editor needs to know it: what to call it, how it gets about, how big it is, what it looks like. */
export interface EnemyInfo {
  name: string
  /** `fly`: its patrol points go anywhere. `ground`: they stand on the floor, and a point with no floor under it is refused. */
  moves: 'fly' | 'ground'
  /** Its bounds in metres (x, y, z), centred on where it is placed. */
  size: [number, number, number]
  /** Metres over a clicked floor a flyer's new patrol point goes. */
  hover?: number
  /** Its downloaded model (entities/enemymodels.ts), shown where it is placed in build mode. */
  model?: string
  /** Where the model's origin is: its middle (the default — a drone), or its feet (a man). */
  origin?: 'centre' | 'feet'
  /** Pose and equip the model for the editor's preview (a rifleman at the low ready with his rifle, not his bare A-pose). */
  dress?: (model: { root: THREE.Object3D }) => void
}

/** What else is known about an entity type. `enemy`: it is an enemy, offered by spawners and enemy placers. */
export interface EntityTypeInfo {
  enemy?: EnemyInfo
}

const factories = new Map<string, EntityFactory>()
const typeInfo = new Map<string, EntityTypeInfo>()

/** Register an entity type so level files can name it. */
export function registerEntity(type: string, factory: EntityFactory, info?: EntityTypeInfo): void {
  factories.set(type, factory)
  if (info) typeInfo.set(type, info)
}

export function knownEntityTypes(): string[] {
  return [...factories.keys()].sort()
}

/** The entity types registered as enemies — what a spawner can spawn and a placer can place — by type and display name. */
export function enemyTypes(): { type: string; name: string; moves?: 'fly' | 'ground' }[] {
  const out: { type: string; name: string; moves?: 'fly' | 'ground' }[] = []
  for (const [type, info] of typeInfo) if (info.enemy) out.push({ type, name: info.enemy.name, moves: info.enemy.moves })
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

/** Everything registered about one enemy type, or undefined if it is not one. */
export function enemyInfo(type: string): EnemyInfo | undefined {
  return typeInfo.get(type)?.enemy
}

export interface LevelFile {
  name: string
  version: 1
  fog?: { color: number; near: number; far: number }
  background?: number
  entities: EntityDef[]
}

/** Anything in `root` three.js would draw or light with: a mesh, sprite, points, line or light, shown or not. */
function drawsAnything(root: THREE.Object3D): boolean {
  let found = false
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh || (o as THREE.Sprite).isSprite || (o as THREE.Points).isPoints || (o as THREE.Line).isLine || (o as THREE.Light).isLight) found = true
  })
  return found
}

export class World {
  readonly scene = World.walkedScene()
  readonly events = new EventBus()

  /**
   * The scene, with drawing's walk over it done here rather than by three.js. Its walk visits every object in the scene
   * every time it is drawn, even those marked out of it (matrixWorldAutoUpdate off: frozen props, spawners' markers,
   * rifles at rest) — the flag only stops their own matrix being worked out, and the walk still goes through all their
   * nodes. This one leaves such an object, and everything under it, out; everything else is walked as before, just
   * before the scene is drawn (its onBeforeRender, which comes ahead of anything drawn).
   */
  private static walkedScene(): THREE.Scene {
    const scene = new THREE.Scene()
    scene.matrixWorldAutoUpdate = false
    scene.onBeforeRender = () => {
      const kids = scene.children
      for (let i = 0; i < kids.length; i++) {
        const o = kids[i]!
        if (!(o.matrixWorldAutoUpdate || o.matrixWorldNeedsUpdate)) continue
        // Hidden (a sentry in another room, a medkit taken, a pool's spares): nothing under it is drawn, so its own
        // transform only — for what reads it (a mine's blast) — not its every part. Without the browser's optimising
        // compiler (the school Chromebook runs without it) each part walked costs a couple of microseconds for nothing.
        // Shown again, it is walked whole before anything is drawn; what it is made of brings itself up to date when
        // read (getWorldPosition, humanrig.refresh).
        if (!o.visible) {
          if (o.matrixAutoUpdate) o.updateWorldMatrix(false, false)
          continue
        }
        walkShown(o, false)
      }
    }
    return scene
  }
  readonly collision = new CollisionSystem()

  readonly entities = new Map<string, Entity>()
  private readonly byType = new Map<string, Set<Entity>>()
  private readonly byTag = new Map<string, Set<Entity>>()
  private readonly updating: Entity[] = []

  /** Where the player is, for triggers and AI. Written by the game each tick. */
  readonly playerPosition = new THREE.Vector3()
  /** Where the view is drawn from (the camera), as of the last `updateLod`; null until then (headless: the player). */
  viewPosition: THREE.Vector3 | null = null
  /**
   * How much detail the world can afford, 1 (all of it) down to MIN_DETAIL: set by the game from how long a frame's work
   * is taking (main.ts governor). Enemies read it — they animate and think less often at range, and drop to simpler
   * models sooner, as it falls — so a slow machine sheds the detail nobody looks at before it drops a frame.
   */
  detail = 1

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
  /**
   * The level is being built (the editor is open): what only a builder should see is shown; what is frozen
   * (freezeStill) is thawed for it to move, and frozen again when it closes.
   */
  get building(): boolean {
    return this.buildingNow
  }
  set building(on: boolean) {
    if (on === this.buildingNow) return
    this.buildingNow = on
    this.statics.mergeAllowed = !on
    if (on) this.thawStill()
    else this.freezeStill()
  }
  private buildingNow = false
  /** Objects whose matrices are frozen (freezeStill). */
  private frozen: THREE.Object3D[] = []
  /** Frozen entities' own objects, also left out of the renderer's walk (matrixWorldAutoUpdate off). */
  private frozenRoots: THREE.Object3D[] = []
  /** Frozen entities with nothing to draw, out of the scene until build mode thaws them (freezeStill). */
  private undrawn: THREE.Object3D[] = []

  /**
   * Freeze what never moves: every entity that does not update itself (a crate, a wall, a light, a prop) has its
   * object's matrices worked out once, here, and not again every frame — drawing walks the whole scene working out every
   * object's every frame, and most of the level never moves. Build mode thaws them (it moves things); closing it, and
   * loading a level, freeze them again.
   */
  freezeStill(): void {
    this.thawStill()
    this.scene.matrixAutoUpdate = false
    this.scene.updateMatrix()
    // And the textures' own placing (offset, repeat, turn): three.js works each one's matrix out again every time a
    // material of it is drawn, and none changes in play but the lava's, which says so itself (render/materials.ts).
    this.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material
      if (!m) return
      for (const mat of Array.isArray(m) ? m : [m]) {
        for (const slot of TEXTURE_SLOTS) {
          const t = (mat as unknown as Record<string, THREE.Texture | null | undefined>)[slot]
          if (!t || !t.isTexture || !t.matrixAutoUpdate) continue
          t.updateMatrix()
          t.matrixAutoUpdate = false
          this.heldTextures.push(t)
        }
      }
    })
    for (const e of this.entities.values()) {
      if (e.needsUpdate) continue
      e.object.updateMatrixWorld(true)
      e.object.traverse((o) => {
        if (!o.matrixAutoUpdate) return
        o.matrixAutoUpdate = false
        this.frozen.push(o)
      })
      // And left out of drawing's walk altogether: frozen, nothing in it changes, yet the renderer still visited every
      // one of its nodes every frame (some four hundred in the facility) to find nothing to do.
      if (e.object.parent === this.scene && e.object.matrixWorldAutoUpdate) {
        e.object.matrixWorldAutoUpdate = false
        this.frozenRoots.push(e.object)
      }
      // And one with nothing in it to draw at all (a breakable drawn by the batches, a light's marker) out of the scene
      // altogether, as a baked prop is: drawing still visited it, every frame, to find nothing. Its matrices are worked
      // out above and stay right; its `visible` (a breakable's "not smashed", which the batches read) is its own.
      if (e.object.parent === this.scene && !drawsAnything(e.object)) {
        this.scene.remove(e.object)
        this.undrawn.push(e.object)
      }
      // And inside one that does draw (a suit on its rack), the parts with nothing drawable under them — a skeleton's
      // bones, a few dozen — hidden: drawing visits every shown node to look for something to draw, and a skin reads its
      // bones whether they are shown or not.
      else if (e.object.parent === this.scene) this.hideBare(e.object)
    }
  }

  /** Hide `root`'s descendants with nothing drawable under them (freezeStill); undone by thawStill. */
  private hideBare(root: THREE.Object3D): void {
    for (const c of root.children) {
      if (!c.visible) continue
      if (drawsAnything(c)) this.hideBare(c)
      else {
        c.visible = false
        this.bare.push(c)
      }
    }
  }
  /** Nodes hidden by hideBare, to show again when build mode thaws the world. */
  private bare: THREE.Object3D[] = []
  /** Textures whose matrices freezeStill worked out once and holds. */
  private readonly heldTextures: THREE.Texture[] = []

  /** Undo freezeStill: every frozen object's matrices worked out every frame again. */
  thawStill(): void {
    for (const t of this.heldTextures) t.matrixAutoUpdate = true
    this.heldTextures.length = 0
    for (const o of this.frozen) o.matrixAutoUpdate = true
    this.frozen.length = 0
    for (const o of this.frozenRoots) o.matrixWorldAutoUpdate = true
    this.frozenRoots.length = 0
    for (const o of this.undrawn) if (!o.parent) this.scene.add(o)
    this.undrawn.length = 0
    for (const o of this.bare) o.visible = true
    this.bare.length = 0
  }
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
    entity.removed = false
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
    const t = performance.now()
    const e = this.add(factory(def))
    this.time('spawn', performance.now() - t)
    return e
  }

  remove(entity: Entity): void {
    if (!this.entities.delete(entity.id)) return
    entity.removed = true
    entity.onDestroy()
    this.byType.get(entity.type)?.delete(entity)
    for (const tag of entity.tags) this.byTag.get(tag)?.delete(entity)
    const i = this.updating.indexOf(entity)
    if (i >= 0) this.updating.splice(i, 1)
    // Gone for good: not put back in the scene when build mode thaws the rest (freezeStill).
    const u = this.undrawn.indexOf(entity.object)
    if (u >= 0) this.undrawn.splice(u, 1)
    const r = this.frozenRoots.indexOf(entity.object)
    if (r >= 0) this.frozenRoots.splice(r, 1)
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
   * The entities of a type, or with a tag, as the world's own live set: for a loop that only reads, where `ofType` and
   * `tagged` would copy them into a new array on every call (every enemy's every thought, every round's every step).
   * Nothing may be spawned or removed while iterating one.
   */
  typeView<T extends Entity>(type: string): ReadonlySet<T> {
    return (this.byType.get(type) ?? NONE) as ReadonlySet<T>
  }

  tagView<T extends Entity>(tag: string): ReadonlySet<T> {
    return (this.byTag.get(tag) ?? NONE) as ReadonlySet<T>
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
    this.thawStill()
    for (const def of this.beginLevel(file)) this.spawnOne(def)
    this.bake()
    if (!this.building) this.freezeStill()
  }

  /**
   * The same load, a few milliseconds at a time, so the page can paint and a loading bar can move while a
   * big level is spawned and baked. `onProgress` is given 0..1 over both.
   */
  async loadAsync(file: LevelFile, onProgress?: (done: number) => void, yieldFn: () => Promise<void> = () => new Promise((r) => setTimeout(r, 0)), sliceMs = 14): Promise<void> {
    this.thawStill()
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
    if (!this.building) this.freezeStill()
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
    ;(this.viewPosition ??= new THREE.Vector3()).copy(camera)
    // Well behind (the detail at the bottom of its range), each every third frame: what streams in over metres, lights
    // that fade over a quarter second and breakables shown or hidden do not need doing sixty times a second.
    // One of the three each frame, in turn — not all three on one frame and none on the next two, which made that frame
    // the one that missed.
    this.lodOwed += dt
    if (this.detail <= 0.5 && !this.building) {
      const turn = this.lodSkip++ % 3
      if (turn === 0) {
        this.statics.drawDistance = distance
        this.statics.update(camera)
      } else if (turn === 1) {
        this.lights.update(camera, this.lodOwed)
        this.lodOwed = 0
      } else this.batches.tick(this.building)
      return
    }
    this.lodOwed = 0
    this.statics.drawDistance = distance
    this.statics.update(camera)
    this.lights.update(camera, dt)
    this.batches.tick(this.building)
  }
  private lodSkip = 0
  private lodOwed = 0

  /** Reused snapshot of `updating`, so a tick allocates nothing. */
  private readonly tickList: Entity[] = []

  /**
   * A new frame is about to be simulated and drawn: the next step updates every per-frame entity (Entity.tickPerFrame)
   * with the time it is owed. Called by the game's loop; a world nobody calls it on updates everything every step.
   */
  beginFrame(): void {
    this.framed = true
    this.frameOpen = true
    this.frameEntityMs = 0
    this.stepEntityMs = 0
    const tm = this.timings
    for (const k in tm) tm[k] = 0
    // The crowd's way to you (engine/navgrid.ts): a slice of it a frame — here, before the steps, unless the game
    // gives it the end of its frames instead (navSlice).
    if (!this.navAtFrameEnd) this.navTick(Infinity)
  }

  /**
   * A slice of the crowd's way to you, at the end of a frame (Loop.endFrame), of no more than `spareMs`: what the frame
   * has left. A frame already heavy — a man arriving, a man dying, a room of them posing — is not given its slice on top
   * (as it was, before the steps, when its cost was not yet known: half a millisecond more on the frames of a fight that
   * were over already); the field is worked out on the lighter frames after. Put off for NAV_STARVE_MS, it has its
   * NAV_MIN_MS whatever the frame has left. A game that calls this no longer has the slice in beginFrame.
   */
  navSlice(spareMs: number): void {
    this.navAtFrameEnd = true
    this.navTick(spareMs)
  }
  private navAtFrameEnd = false
  /** The last slice's milliseconds (0 for a frame put off): the play recording's, read before this frame's is taken. */
  navMsLast = 0

  private navTick(spareMs: number): void {
    if (this.building) return
    const now = performance.now()
    // Well behind (the detail at the bottom of its range), a third of the slice: the same way worked out over more
    // frames, and no frame of a fight given a millisecond and a half of it on top of everything else.
    let budget = Math.min(this.detail <= 0.5 ? NAV_BUDGET_MS / 3 : NAV_BUDGET_MS, spareMs)
    if (budget < 0.1) {
      if (this.lastFrameAt && now - this.lastFrameAt < NAV_STARVE_MS) {
        this.navMsLast = 0
        return
      }
      budget = NAV_MIN_MS
    }
    const dt = this.lastFrameAt ? Math.min(0.25, (now - this.lastFrameAt) / 1000) : 0
    this.lastFrameAt = now
    if (!this.nav.current) this.nav.ground = this.spawnPoint()?.object.position.y ?? 0
    const t = performance.now()
    this.nav.tick(this.playerPosition, dt, budget, this.collision.dynamics)
    this.navMsLast = performance.now() - t
    this.time('nav', this.navMsLast)
  }
  /**
   * This frame's milliseconds by what they went on, as entities report them (`time`): an enemy's posing, its deciding,
   * its falling body; spawning; the crowd's pathfinding. For the play recording (diag.ts).
   */
  readonly timings: Record<string, number> = { pose: 0, decide: 0, wreck: 0, spawn: 0, nav: 0 }
  /** Add `ms` to this frame's `key` (timings). */
  time(key: string, ms: number): void {
    this.timings[key] = (this.timings[key] ?? 0) + ms
  }
  /** The level as enemies walk it, and the way to you from all of it (engine/navgrid.ts). */
  readonly nav: NavGrid = new NavGrid(this.collision)
  private lastFrameAt = 0
  /**
   * This frame's milliseconds in entity updates: those updated once a frame (enemies, sentries, stands...), and those
   * updated every step (doors, triggers, movers...), all steps together. For the play recording (diag.ts): what the
   * simulation's time went on.
   */
  frameEntityMs = 0
  stepEntityMs = 0
  private framed = false
  private frameOpen = false

  /** Steps taken, so what is worked out once a step (which rooms can be seen) is not worked out again for every entity. */
  ticks = 0

  /** The once-a-frame entities' budget (FRAME_ENTITY_BUDGET_MS); Infinity for none. */
  frameBudgetMs = FRAME_ENTITY_BUDGET_MS
  /** The longest a once-a-frame entity waits for its turn while the detail is at the bottom of its range (seconds). */
  frameDeferLowS = FRAME_DEFER_LOW_S
  /** Where in the once-a-frame entities the next frame starts (update): the budget's turn order. */
  private frameTurn = 0
  /** Reused: this step's once-a-frame entities (update). */
  private readonly frameList: Entity[] = []

  update(dt: number): void {
    this.ticks++
    // Iterate a copy: an entity may spawn or destroy others from its update. The copy
    // goes into a reused array — a fresh spread 120 times a second is steady garbage
    // for the collector to stop the frame over on a Chromebook.
    const list = this.tickList
    list.length = 0
    const updating = this.updating
    for (let i = 0; i < updating.length; i++) list.push(updating[i]!)
    const open = this.frameOpen || !this.framed
    this.frameOpen = false
    const t0 = performance.now()
    let framed = 0
    const frame = this.frameList
    frame.length = 0
    for (let i = 0; i < list.length; i++) {
      const e = list[i]!
      if (!e.enabled || e.removed) continue
      if (e.tickPerFrame) {
        e.frameOwed += dt
        if (open) frame.push(e)
      } else e.onUpdate(dt)
    }
    // The once-a-frame ones, from where the last frame's budget ran out, while the budget lasts (FRAME_ENTITY_BUDGET_MS).
    const n = frame.length
    if (n > 0) {
      const start = this.frameTurn % n
      let next = -1
      // Well behind (the detail at the bottom of its range), half the budget, and a wait of up to FRAME_DEFER_LOW_S: the
      // frames that missed in a fight were the ones a room's enemies all landed on. (Riflemen are drawn between their
      // thoughts, so thinking less often does not show as jerks: soldier.ts crowdPlace.)
      const low = this.detail <= 0.5
      const budget = low ? this.frameBudgetMs / 2 : this.frameBudgetMs
      const maxWait = low ? this.frameDeferLowS : FRAME_DEFER_MAX_S
      for (let k = 0; k < n; k++) {
        const e = frame[(start + k) % n]!
        if (e.removed) continue
        if (framed >= budget && e.frameOwed < maxWait && !e.frameUrgent) {
          if (next < 0) next = (start + k) % n
          continue
        }
        const owed = e.frameOwed
        e.frameOwed = 0
        const t = performance.now()
        e.onUpdate(owed)
        framed += performance.now() - t
      }
      this.frameTurn = next < 0 ? start : next
      frame.length = 0
    }
    list.length = 0
    this.frameEntityMs += framed
    this.stepEntityMs += performance.now() - t0 - framed
  }

  spawnPoint(): SpawnPoint | null {
    for (const e of this.typeView('spawn')) return e as SpawnPoint
    return null
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
    for (const e of all) if (!e.transient) file.entities.push(e.serialize())
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
    this.nav.forget()
    // The pool's lights are kept for reuse; only the placed sources went with their entities.
  }
}
