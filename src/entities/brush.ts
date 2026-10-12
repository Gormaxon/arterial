/**
 * Brush — a plain solid box.
 *
 * The simplest buildable: no decoration, one surface. Kept alongside Prefab so older
 * levels keep loading and so the editor has a primitive to fall back on.
 */

import { bool, str, vec3, type EntityDef } from '../engine/entity'
import { Buildable, round4 } from './buildable'
import { box, type BoxSpec, type Part } from '../prefabs/geometry'
import type { SurfaceKey } from '../render/materials'

/** Legacy role names, kept so existing level files load unchanged. */
export type Surface = 'floor' | 'wall' | 'chute' | 'platform' | 'accent' | 'hazard'

const SURFACE_TO_MATERIAL: Record<Surface, SurfaceKey> = {
  floor: 'tile',
  wall: 'concrete',
  chute: 'concrete',
  platform: 'panel',
  accent: 'accent',
  hazard: 'hazard',
}

export class Brush extends Buildable {
  readonly type: string = 'brush'
  surface: Surface = 'wall'

  constructor(def: EntityDef) {
    super(def)
    const s = vec3(def.props, 'size', [1, 1, 1])
    this.size.set(s[0], s[1], s[2])
    this.surface = str<Surface>(def.props, 'surface', 'wall')
    this.solid = bool(def.props, 'solid', true)
    this.visible = bool(def.props, 'visible', true)
  }

  get material(): SurfaceKey {
    return SURFACE_TO_MATERIAL[this.surface] ?? 'concrete'
  }

  /** One surface all over. */
  override surfaceAt(): SurfaceKey | null {
    return this.material
  }

  override bakeKey(): string | null {
    return `b|${this.surface}|${this.size.x}|${this.size.y}|${this.size.z}|${this.visible ? 1 : 0}`
  }

  buildParts(): Part[] {
    if (!this.visible) return []
    return [box({ x: 0, y: 0, z: 0, w: this.size.x, h: this.size.y, d: this.size.z }, this.material)]
  }

  collisionBoxes(): BoxSpec[] {
    if (!this.solid) return []
    return [{ x: 0, y: 0, z: 0, w: this.size.x, h: this.size.y, d: this.size.z }]
  }

  scalableAxes(): [boolean, boolean, boolean] {
    return [true, true, true]
  }

  minSize(): [number, number, number] {
    return [0.5, 0.5, 0.5]
  }

  override get displayName(): string {
    return this.name || `${this.surface} brush`
  }

  protected override serializeProps(): Record<string, unknown> {
    const props: Record<string, unknown> = {
      size: [round4(this.size.x), round4(this.size.y), round4(this.size.z)],
      surface: this.surface,
    }
    if (!this.solid) props.solid = false
    if (!this.visible) props.visible = false
    return props
  }
}

export const round = round4
