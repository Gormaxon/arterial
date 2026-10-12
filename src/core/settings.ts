/** Player options, kept in localStorage. Read live each frame by whoever uses them. */
export interface Settings {
  /** Multiplier on the base mouse sensitivity. */
  sens: number
  /** Horizontal-look field of view in degrees, before aiming and sprint effects. */
  fov: number
  /** Master volume, 0..1. */
  volume: number
  /** Render scale: 0 lets the game choose from measured frame times (Auto), otherwise a fixed ratio of the screen's pixels. */
  resolution: number
  /** Anti-aliasing samples: 4, 2, or 0 for none. */
  aa: number
  /** Experimental: 1 makes every other frame from the last one rather than drawing it (render/framegen.ts). */
  frameGen: number
  /** Experimental: 1 upscales to the screen's full density with AMD FSR 1, EASU then RCAS (render/fsr1.ts). */
  fsr: number
  /** Frame generation's multiplier: frames shown per frame drawn, 2 to 6 (render/framegen.ts). */
  frameGenMult: number
  /** AMD FSR 1's quality mode: an index into FSR_MODES (render/fsr1.ts); 0 is Custom, 2 is Quality. */
  fsrMode: number
  /** With AMD FSR 1 on, what it upscales to: a multiple of the screen's own pixels (1 is native, up to 2). */
  fsrTarget: number
}

/** Settings that are a smooth range. */
export const SETTING_RANGE = {
  sens: { min: 0.25, max: 3, step: 0.05 },
  fov: { min: 70, max: 110, step: 1 },
  volume: { min: 0, max: 1, step: 0.05 },
  fsrTarget: { min: 1, max: 2, step: 0.05 },
} as const

/** Settings that pick from a short list; a stored value is snapped to the nearest. */
export const SETTING_CHOICES = {
  resolution: [0, 0.5, 0.66, 0.75, 0.9, 1, 1.25, 1.5],
  frameGen: [0, 1],
  fsr: [0, 1],
  fsrMode: [0, 1, 2, 3, 4],
  frameGenMult: [2, 3, 4, 5, 6],
  aa: [4, 2, 0],
} as const

export type RangeKey = keyof typeof SETTING_RANGE
export type ChoiceKey = keyof typeof SETTING_CHOICES

export const isChoice = (k: keyof Settings): k is ChoiceKey => k in SETTING_CHOICES

const DEFAULTS: Settings = { sens: 1, fov: 90, volume: 1, resolution: 1, frameGen: 0, aa: 4, fsr: 0, fsrMode: 2, fsrTarget: 1, frameGenMult: 2 }
const KEY = 'sanguine.settings'
/**
 * Which defaults stored settings were saved under. Saving writes every setting, so a player who had only ever
 * touched the volume has Auto stored for the resolution; from version 2 the default is 100%, and a resolution
 * saved under the old default is dropped so they get it.
 */
const VERSION = 2

export function clampSetting(v: unknown, k: keyof Settings): number {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : DEFAULTS[k]
  if (isChoice(k)) {
    const list = SETTING_CHOICES[k] as readonly number[]
    return list.reduce((best, c) => (Math.abs(c - n) < Math.abs(best - n) ? c : best), list[0]!)
  }
  const r = SETTING_RANGE[k as RangeKey]
  return Math.min(r.max, Math.max(r.min, n))
}

/** Settings that came from the player's saved choices rather than from the defaults. */
export const savedSettings = new Set<keyof Settings>()

function load(): Settings {
  const out = { ...DEFAULTS }
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Settings> & { v?: number }
    if (raw.v !== VERSION) delete raw.resolution
    for (const k of Object.keys(DEFAULTS) as (keyof Settings)[]) {
      if (typeof raw[k] === 'number') savedSettings.add(k)
      out[k] = clampSetting(raw[k], k)
    }
  } catch {
    // Storage blocked or corrupt: fall back to the defaults.
  }
  return out
}

export const settings: Settings = load()

export function setSetting(k: keyof Settings, v: number): void {
  settings[k] = clampSetting(v, k)
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...settings, v: VERSION }))
  } catch {
    // Not persisted; still applies for this session.
  }
}

export function resetSettings(): void {
  for (const k of Object.keys(DEFAULTS) as (keyof Settings)[]) setSetting(k, DEFAULTS[k])
}
