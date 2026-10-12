/**
 * A fixed pool of real point lights, lent to whichever placed lights are nearest the camera.
 *
 * Every point light in the scene is paid for by every pixel of every lit surface, and adding or removing one
 * recompiles the shaders. A big level wants dozens of lights, so a level's point lights are only SOURCES here:
 * `max` real lights live in the scene for good, and each frame they are handed to the nearest sources. A
 * light changing hands fades out where it was, then in where it is wanted, so nothing pops. A level with
 * no more point lights than the pool holds never swaps anything: each simply keeps its own.
 */

import * as THREE from 'three'

export interface PointSource {
  readonly position: THREE.Vector3
  color: number
  intensity: number
  /** Range, metres; 0 for unlimited. */
  distance: number
}

interface Slot {
  light: THREE.PointLight
  source: PointSource | null
  level: number
  target: number
}

/** How many point lights are ever live at once. */
export const POINT_LIGHT_BUDGET = 6
/** Fades take about this long, seconds. */
const FADE = 0.25

export class LightPool {
  private readonly sources: PointSource[] = []
  private readonly slots: Slot[] = []

  constructor(
    private readonly scene: THREE.Scene,
    readonly max = POINT_LIGHT_BUDGET,
  ) {}

  get sourceCount(): number {
    return this.sources.length
  }

  /** Real lights currently in the scene, however many sources there are. */
  get liveCount(): number {
    return this.slots.length
  }

  register(source: PointSource): void {
    this.sources.push(source)
    // Only when there is no slot for it. Reloading a level registers its lights again after the old ones have gone,
    // and a slot made for each of those grew the pool past what the level needs, and recompiled every shader.
    if (this.slots.length < this.max && this.sources.length > this.slots.length) {
      const light = new THREE.PointLight(0xffffff, 0, 0)
      this.scene.add(light)
      this.slots.push({ light, source: null, level: 0, target: 0 })
    }
    // While everything fits, each source takes a slot at once, fully lit.
    if (this.sources.length <= this.slots.length) this.assignDirect()
  }

  unregister(source: PointSource): void {
    const i = this.sources.indexOf(source)
    if (i < 0) return
    this.sources.splice(i, 1)
    for (const slot of this.slots) {
      if (slot.source === source) {
        slot.source = null
        slot.level = 0
        slot.target = 0
        slot.light.intensity = 0
      }
    }
    // Fewer sources than slots: park the spare lights rather than delete them (deleting recompiles shaders).
    if (this.sources.length <= this.slots.length) this.assignDirect()
  }

  private assignDirect(): void {
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i]!
      const source = this.sources[i] ?? null
      if (slot.source !== source) {
        slot.source = source
        slot.level = source ? 1 : 0
        slot.target = source ? 1 : 0
      }
      this.apply(slot)
    }
  }

  private apply(slot: Slot): void {
    const s = slot.source
    if (!s) {
      slot.light.intensity = 0
      return
    }
    slot.light.position.copy(s.position)
    slot.light.color.setHex(s.color)
    slot.light.distance = s.distance
    slot.light.intensity = s.intensity * slot.level
  }

  /** Hand the lights to the sources nearest `camera`. Call once a frame. */
  update(camera: THREE.Vector3, dt = 1 / 60): void {
    if (this.sources.length <= this.slots.length) {
      // Fixed assignment: only keep the values in step with the sources, which an editor may change.
      for (const slot of this.slots) this.apply(slot)
      return
    }
    // How far each source is from mattering: its distance, less half its reach.
    const wanted = this.sources
      .map((s) => ({ s, score: s.position.distanceTo(camera) - (s.distance || 40) * 0.5 }))
      .sort((a, b) => a.score - b.score)
      .slice(0, this.slots.length)
      .map((w) => w.s)
    const want = new Set(wanted)
    for (const slot of this.slots) {
      if (slot.source && !want.has(slot.source)) slot.target = 0
      else if (slot.source) slot.target = 1
    }
    const held = new Set(this.slots.map((sl) => sl.source))
    for (const s of wanted) {
      if (held.has(s)) continue
      const free = this.slots.find((sl) => sl.source === null || (sl.target === 0 && sl.level <= 0.02))
      if (!free) continue
      free.source = s
      free.level = 0
      free.target = 1
      held.add(s)
    }
    const step = dt / FADE
    for (const slot of this.slots) {
      slot.level += Math.max(-step, Math.min(step, slot.target - slot.level))
      if (slot.target === 0 && slot.level <= 0.02 && slot.source && !want.has(slot.source)) {
        // Faded out and no longer wanted: free for the next source.
        slot.source = null
        slot.level = 0
      }
      this.apply(slot)
    }
  }
}
