/**
 * The non-geometry entity types: spawn points, trigger volumes and lights.
 *
 * These are what turn a pile of boxes into a level — the things a designer places to
 * give the space behaviour.
 */

import * as THREE from 'three'
import { Entity, bool, num, str, vec3, type EntityDef } from '../engine/entity'
import { round } from './brush'
import type { PointSource } from '../engine/lightpool'

const _facing = new THREE.Vector3()

/** Where the player starts. `rot.y` is the facing yaw in degrees. */
export class SpawnPoint extends Entity {
  readonly type = 'spawn'

  /**
   * The facing, read off the orientation rather than `rotation.y`.
   *
   * Two quarter turns in the editor make a half turn, and a half turn about Y
   * decomposes to (180, 0, 180) in XYZ Euler order — so `rotation.y` read 0 and a spawn
   * turned to face the other way still started you facing the original direction.
   */
  get yaw(): number {
    _facing.set(0, 0, -1).applyQuaternion(this.object.quaternion)
    return Math.atan2(-_facing.x, -_facing.z)
  }
}

export interface TriggerEvent {
  trigger: TriggerVolume
  /** The event name the designer set, echoed for convenience. */
  event: string
}

/**
 * An invisible box that emits an event when the player enters or leaves it.
 * Emits `<event>` on enter and `<event>:exit` on leave.
 */
export class TriggerVolume extends Entity {
  readonly type = 'trigger'
  override readonly isStatic = false
  override readonly needsUpdate = true

  readonly size = new THREE.Vector3(4, 4, 4)
  /** Event name emitted on the world bus. Defaults to the entity name. */
  event = ''
  once = false

  private inside = false
  private spent = false
  private readonly aabb = new THREE.Box3()

  constructor(def: EntityDef) {
    super(def)
    const s = vec3(def.props, 'size', [4, 4, 4])
    this.size.set(s[0], s[1], s[2])
    this.event = str(def.props, 'event', '')
    this.once = bool(def.props, 'once', false)
  }

  private get eventName(): string {
    return this.event || this.name || `trigger:${this.id}`
  }

  override onUpdate(_dt: number): void {
    if (this.spent) return
    // Rebuilt every tick from the live position — six additions. Computed once at
    // spawn, a trigger moved in build mode kept firing at the spot it used to be.
    const p = this.object.position
    this.aabb.min.set(p.x - this.size.x / 2, p.y - this.size.y / 2, p.z - this.size.z / 2)
    this.aabb.max.set(p.x + this.size.x / 2, p.y + this.size.y / 2, p.z + this.size.z / 2)
    const now = this.aabb.containsPoint(this.world.playerPosition)
    if (now === this.inside) return
    this.inside = now

    const payload: TriggerEvent = { trigger: this, event: this.eventName }
    if (now) {
      this.world.events.emit(this.eventName, payload)
      if (this.once) this.spent = true
    } else {
      this.world.events.emit(`${this.eventName}:exit`, payload)
    }
  }

  protected override serializeProps(): Record<string, unknown> {
    const props: Record<string, unknown> = {
      size: [round(this.size.x), round(this.size.y), round(this.size.z)],
    }
    if (this.event) props.event = this.event
    if (this.once) props.once = true
    return props
  }
}

export type LightKind = 'point' | 'directional' | 'ambient'

export class LightEntity extends Entity {
  readonly type = 'light'

  kind: LightKind = 'point'
  color = 0xffffff
  intensity = 1
  distance = 0

  private light: THREE.Light | null = null
  private source: PointSource | null = null

  constructor(def: EntityDef) {
    super(def)
    this.kind = str<LightKind>(def.props, 'kind', 'point')
    this.color = num(def.props, 'color', 0xffffff)
    this.intensity = num(def.props, 'intensity', 1)
    this.distance = num(def.props, 'distance', 0)
  }

  override onSpawn(): void {
    switch (this.kind) {
      case 'ambient': {
        // Played as a sky/ground HEMISPHERE rather than a flat ambient, at the same
        // average brightness. Flat ambient lights every face identically, so a
        // platform's underside matched its top and the arena read as cardboard;
        // brighter from above and dimmer from below is the cheapest depth cue there
        // is — one dot product per pixel, no shadow maps.
        const sky = new THREE.Color(this.color).multiplyScalar(1.3)
        const ground = new THREE.Color(this.color).multiplyScalar(0.62)
        this.light = new THREE.HemisphereLight(sky, ground, this.intensity)
        break
      }
      case 'directional':
        this.light = new THREE.DirectionalLight(this.color, this.intensity)
        break
      default: {
        // A placed point light is a SOURCE: the world's pool lends real lights to the nearest ones.
        const self = this
        this.source = {
          position: this.object.position,
          get color() {
            return self.color
          },
          get intensity() {
            return self.intensity
          },
          get distance() {
            return self.distance
          },
        }
        this.world.lights.register(this.source)
        this.world.scene.add(this.object)
        return
      }
    }
    this.object.add(this.light)
    this.world.scene.add(this.object)
  }

  override onDestroy(): void {
    if (this.source) this.world.lights.unregister(this.source)
    this.world.scene.remove(this.object)
    this.light?.dispose()
  }

  protected override serializeProps(): Record<string, unknown> {
    const props: Record<string, unknown> = {
      kind: this.kind,
      color: this.color,
      intensity: round(this.intensity),
    }
    if (this.kind === 'point' && this.distance) props.distance = round(this.distance)
    return props
  }
}
