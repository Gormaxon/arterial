/**
 * The engine's particle system. See system.ts for how it is used and why it is cheap,
 * effects.ts for what an effect is, curves.ts for the motion and the looks.
 */
export { ParticleWorld, ParticleEmitter, type FireOptions, type ParticleCapacity } from './system'
export { PARTICLE_STYLES, type EffectDef, type LayerDef, type ParticleStyle, type Range } from './effects'
export { ChunkPool, type ChunkBurst } from './chunks'
export { flameColour, trajectory, velocity, floorHitTime } from './curves'
