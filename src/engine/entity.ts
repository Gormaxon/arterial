/**
 * Entity base class.
 *
 * Every object in a level — geometry, lights, spawns, triggers, moving platforms —
 * is an Entity with a stable id, a transform, tags and a serialisable property bag.
 * Static geometry gets batched into one mesh for rendering, but the Entity remains
 * the authoritative object: batching is an optimisation, not the data model.
 */

import * as THREE from 'three'
import type { World } from './world'

const DEG = Math.PI / 180

/** The serialised form of an entity — this is what a level file contains. */
export interface EntityDef {
  type: string
  id?: string
  name?: string
  tags?: string[]
  /** World position. For brushes this is the CENTRE of the box. */
  pos?: [number, number, number]
  /** Euler XYZ in degrees. */
  rot?: [number, number, number]
  scale?: [number, number, number]
  props?: Record<string, unknown>
}

export abstract class Entity {
  /**
   * Unique within the owning World. Empty until World.add() assigns one, unless the
   * level file specified it. Ids are per-World, never global — a global counter
   * collides the moment two levels are loaded at once, or an entity is spawned at
   * runtime after a level load.
   */
  id: string
  name: string
  readonly tags = new Set<string>()
  /** Transform holder. Visual entities parent their meshes to this. */
  readonly object = new THREE.Object3D()
  enabled = true

  /** Set by World.add(). Entities may assume it exists from onSpawn() onward. */
  world!: World

  abstract readonly type: string

  /** Static entities are baked into the level mesh and BVH at load, and never move. */
  readonly isStatic: boolean = true
  /** Opt in to per-tick updates, so the update list stays as short as possible. */
  readonly needsUpdate: boolean = false

  constructor(def: EntityDef) {
    this.id = def.id ?? ''
    this.name = def.name ?? ''
    for (const t of def.tags ?? []) this.tags.add(t)
    if (def.pos) this.object.position.fromArray(def.pos)
    if (def.rot) {
      this.object.rotation.set(
        (def.rot[0] ?? 0) * DEG,
        (def.rot[1] ?? 0) * DEG,
        (def.rot[2] ?? 0) * DEG,
      )
    }
    if (def.scale) this.object.scale.fromArray(def.scale)
    this.object.updateMatrix()
    this.object.matrixAutoUpdate = !this.isStatic
  }

  onSpawn(): void {}
  onUpdate(_dt: number): void {}
  onDestroy(): void {}

  /** Subclass-specific fields. Merged into `props` on serialise. */
  protected serializeProps(): Record<string, unknown> {
    return {}
  }

  serialize(): EntityDef {
    const def: EntityDef = { type: this.type, id: this.id }
    if (this.name) def.name = this.name
    if (this.tags.size) def.tags = [...this.tags]

    const p = this.object.position
    if (p.x !== 0 || p.y !== 0 || p.z !== 0) def.pos = [r(p.x), r(p.y), r(p.z)]

    const e = this.object.rotation
    if (e.x !== 0 || e.y !== 0 || e.z !== 0) {
      def.rot = [r(e.x / DEG), r(e.y / DEG), r(e.z / DEG)]
    }

    const s = this.object.scale
    if (s.x !== 1 || s.y !== 1 || s.z !== 1) def.scale = [r(s.x), r(s.y), r(s.z)]

    const props = this.serializeProps()
    if (Object.keys(props).length) def.props = props
    return def
  }
}

/** Round to 4dp so serialise → load → serialise is byte-stable. */
function r(n: number): number {
  return Math.round(n * 1e4) / 1e4
}

/** Typed helpers for reading the untyped property bag out of a level file. */
export function num(props: Record<string, unknown> | undefined, key: string, fallback: number): number {
  const v = props?.[key]
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

export function str<T extends string>(
  props: Record<string, unknown> | undefined,
  key: string,
  fallback: T,
): T {
  const v = props?.[key]
  return typeof v === 'string' ? (v as T) : fallback
}

export function bool(props: Record<string, unknown> | undefined, key: string, fallback: boolean): boolean {
  const v = props?.[key]
  return typeof v === 'boolean' ? v : fallback
}

export function vec3(
  props: Record<string, unknown> | undefined,
  key: string,
  fallback: [number, number, number],
): [number, number, number] {
  const v = props?.[key]
  if (Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === 'number')) {
    return [v[0] as number, v[1] as number, v[2] as number]
  }
  return fallback
}

export function vec3List(
  props: Record<string, unknown> | undefined,
  key: string,
): [number, number, number][] {
  const v = props?.[key]
  if (!Array.isArray(v)) return []
  const out: [number, number, number][] = []
  for (const item of v) {
    if (Array.isArray(item) && item.length === 3 && item.every((n) => typeof n === 'number')) {
      out.push([item[0] as number, item[1] as number, item[2] as number])
    }
  }
  return out
}
