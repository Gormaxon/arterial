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
  /** The colour last given the light (setHex converts colour space each call: only on a change). */
  hex: number
}

/** How many point lights are ever live at once: every lit pixel pays for each, and a sealed room needs its own lamp or two. */
export const POINT_LIGHT_BUDGET = 3
/** Fades take about this long, seconds. */
const FADE = 0.25

export class LightPool {
  private readonly sources: PointSource[] = []
  private readonly slots: Slot[] = []
  /** Reused by update: the sources wanted this frame, nearest first, and how near. */
  private readonly wanted: PointSource[] = []
  private readonly scores: number[] = []

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
      this.slots.push({ light, source: null, level: 0, target: 0, hex: -1 })
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
    if (slot.hex !== s.color) {
      slot.hex = s.color
      slot.light.color.setHex(s.color)
    }
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
    // How far each source is from mattering: its distance, less half its reach. The nearest (as many as there are
    // slots) kept by insertion into a small fixed list — no arrays, sets or closures a frame.
    const n = this.slots.length
    const wanted = this.wanted
    const scores = this.scores
    wanted.length = 0
    scores.length = 0
    const sources = this.sources
    for (let i = 0; i < sources.length; i++) {
      const s = sources[i]!
      const score = s.position.distanceTo(camera) - (s.distance || 40) * 0.5
      if (wanted.length === n && score >= scores[n - 1]!) continue
      let j = wanted.length < n ? wanted.length : n - 1
      while (j > 0 && scores[j - 1]! > score) {
        scores[j] = scores[j - 1]!
        wanted[j] = wanted[j - 1]!
        j--
      }
      scores[j] = score
      wanted[j] = s
    }
    const slots = this.slots
    for (let i = 0; i < n; i++) {
      const slot = slots[i]!
      if (slot.source) slot.target = wanted.includes(slot.source) ? 1 : 0
    }
    for (let w = 0; w < wanted.length; w++) {
      const s = wanted[w]!
      let held = false
      for (let i = 0; i < n; i++) if (slots[i]!.source === s) held = true
      if (held) continue
      let free: Slot | null = null
      for (let i = 0; i < n && !free; i++) {
        const sl = slots[i]!
        if (sl.source === null || (sl.target === 0 && sl.level <= 0.02)) free = sl
      }
      if (!free) continue
      free.source = s
      free.level = 0
      free.target = 1
    }
    const step = dt / FADE
    for (let i = 0; i < n; i++) {
      const slot = slots[i]!
      slot.level += Math.max(-step, Math.min(step, slot.target - slot.level))
      if (slot.target === 0 && slot.level <= 0.02 && slot.source && !wanted.includes(slot.source)) {
        // Faded out and no longer wanted: free for the next source.
        slot.source = null
        slot.level = 0
      }
      this.apply(slot)
    }
  }
}
