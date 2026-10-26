/**
 * Arterial — the public face of the engine. Everything a game builds on is exported from here; the folders below
 * are the engine itself:
 *
 *   engine/     the world (entities, events, the level format), the baked streaming level, point-light pool,
 *               static batching, the particle engine, cutscenes, quests, boss fights, what surfaces
 *               are made of
 *   physics/    the collision system (BVH-backed static level plus moving bodies) and capsule tests
 *   core/       the fixed-step loop, input (pointer lock, keys, mouse), persisted settings
 *   render/     procedural materials and textures, the level material, sky, FSR 1 upscaling, frame generation,
 *               dynamic resolution, a GPU timer, mesh decimation, the live layer
 *   entities/   the engine's own entity types: brush, spawn, trigger, light
 *   prefabs/    geometry helpers for building placeable pieces out of parts
 */

// The world and its pieces.
export { World, registerEntity, knownEntityTypes, type LevelFile, type EntityFactory } from './engine/world'
export { Entity, num, str, bool, vec3, vec3List, type EntityDef } from './engine/entity'
export { EventBus, type Listener } from './engine/events'
export { StaticChunks, CELL_SIZE, DETAIL_RANGE, type SyncStats } from './engine/chunks'
export { LightPool, POINT_LIGHT_BUDGET, type PointSource } from './engine/lightpool'
export { StaticBatches, BatchSlot } from './engine/batches'
export { CutsceneSystem, PLAY_PREFIX, type CutsceneDef, type CutsceneStep, type Caption } from './engine/cutscene'
export { QuestSystem, START_PREFIX, type QuestDef, type ObjectiveDef, type QuestNotice } from './engine/quests'
export { BossEncounter, type BossDef, type BossPhaseDef, type BossState, type BossHealth } from './engine/boss'
export { SURFACE_CLASS, surfaceClass, RICOCHET, type SurfaceClass } from './engine/surfaces'
export * from './engine/particles'

// Physics.
export { CollisionSystem, createContacts, type DynamicBody, type RayHit, type Contacts } from './physics/collision'
export { resolveCapsuleBox, type BoxHit } from './physics/capsule'

// The loop, input and settings.
export { Loop, SIM_HZ, SIM_DT, MAX_STEPS, type LoopStats } from './core/loop'
export { Input } from './core/input'
export { settings, setSetting, resetSettings, savedSettings, type Settings } from './core/settings'

// Rendering.
export { getMaterial, animateSurfaces, surfaceScale, disposeMaterials, SURFACE_LOOKS, type SurfaceKey } from './render/materials'
export { surfaceMaps, surfaceSampler, fbm, TEXTURE_SIZE } from './render/textures'
export { getLevelMaterial, prepareLevelMaterial, animateLevelMaterial, rebuildLevelTextures } from './render/levelmaterial'
export { applySky, buildSkyTexture } from './render/sky'
export { Upscaler } from './render/upscale'
export { FSR_MODES } from './render/fsr1'
export { FrameGen } from './render/framegen'
export { DynamicResolution } from './render/resolution'
export { GpuTimer } from './render/gputimer'
export { decimate, coarseCopy, triangles } from './render/decimate'
export { addLive, removeLive, LIVE_LAYER } from './render/live'

// Entities and geometry.
export * from './entities'
export { placer, cylPlacer, box, boxAt, leaf, repeatsFor, type Part, type Place, type BoxSpec } from './prefabs/geometry'
