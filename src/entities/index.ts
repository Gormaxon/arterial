/**
 * The engine's own entity types: level geometry (`brush`), where play starts (`spawn`), invisible event volumes
 * (`trigger`) and lights (`light`). A game registers its own types beside these with `registerEntity`.
 */

import { registerEntity } from '../engine/world'
import { Brush } from './brush'
import { LightEntity, SpawnPoint, TriggerVolume } from './misc'

export function registerCoreEntities(): void {
  registerEntity('brush', (def) => new Brush(def))
  registerEntity('spawn', (def) => new SpawnPoint(def))
  registerEntity('trigger', (def) => new TriggerVolume(def))
  registerEntity('light', (def) => new LightEntity(def))
}

export { Buildable } from './buildable'
export { Brush } from './brush'
export { LightEntity, SpawnPoint, TriggerVolume } from './misc'
