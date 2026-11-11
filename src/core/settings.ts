/** Player options, kept in localStorage. Read live each frame by whoever uses them. */
export interface Settings {
  /** Multiplier on the base mouse sensitivity. */
  sens: number
  /** Horizontal-look field of view in degrees, before aiming and sprint effects. */
  fov: number
  /** Master volume, 0..1. */
  volume: number
  /** Graphics preset: 1 low, 2 medium, 3 high, 4 ultra; 0 custom (a setting changed by hand from one). */
  preset: number
  /** Render scale: 0 lets the game choose from measured frame times (Auto), otherwise a fixed ratio of the screen's pixels. */
  resolution: number
  /** Anti-aliasing samples: 4, 2, or 0 for none. */
  aa: number
  /** Experimental: 1 makes every other frame from the last one rather than drawing it (render/framegen.ts). */
  frameGen: number
  /** 1 upscales to the screen's full density with AMD FSR 1, EASU then RCAS (render/fsr1.ts). */
  fsr: number
  /** Frame generation's multiplier: frames shown per frame drawn, 2 to 6 (render/framegen.ts). */
  frameGenMult: number
  /** AMD FSR 1's quality mode: an index into FSR_MODES (render/fsr1.ts); 0 is Custom, 2 is Quality. */
  fsrMode: number
  /** With AMD FSR 1 on, what it upscales to: a multiple of the screen's own pixels (1 is native, up to 2). */
  fsrTarget: number
  /** How much is thrown about by shots, hits and blasts: 0 low to 3 ultra (particles, decals, blood, cases). */
  effects: number
  /** The HUD's size: a multiple of its own (1). */
  hud: number
  /** NIKOLAI GRAPHICS quality, 0 low to 3 ultra (render/rt/bake/tier.ts NIKOLAI_QUALITY); 2, HIGH, is his look as it stood. Not part of the presets. */
  nikolai: number
}

/** Settings that are a smooth range. */
export const SETTING_RANGE = {
  sens: { min: 0.25, max: 3, step: 0.05 },
  fov: { min: 70, max: 110, step: 1 },
  volume: { min: 0, max: 1, step: 0.05 },
  fsrTarget: { min: 1, max: 2, step: 0.05 },
  hud: { min: 0.7, max: 1.4, step: 0.05 },
} as const

/** Settings that pick from a short list; a stored value is snapped to the nearest. */
export const SETTING_CHOICES = {
  preset: [0, 1, 2, 3, 4],
  resolution: [0, 0.5, 0.6, 0.75, 0.9, 1, 1.25, 1.5],
  frameGen: [0, 1],
  fsr: [0, 1],
  fsrMode: [0, 1, 2, 3, 4],
  frameGenMult: [2, 3, 4, 5, 6],
  aa: [4, 2, 0],
  effects: [0, 1, 2, 3],
  nikolai: [0, 1, 2, 3],
} as const

export type RangeKey = keyof typeof SETTING_RANGE
export type ChoiceKey = keyof typeof SETTING_CHOICES

export const isChoice = (k: keyof Settings): k is ChoiceKey => k in SETTING_CHOICES

const DEFAULTS: Settings = {
  sens: 1, fov: 90, volume: 1, hud: 1,
  preset: 3, resolution: 1, frameGen: 0, aa: 2, fsr: 0, fsrMode: 2, fsrTarget: 1, frameGenMult: 2, effects: 2, nikolai: 2,
}
/** The settings a graphics preset is made of: choosing a preset writes them all, changing one by hand makes it custom. */
export const GRAPHICS_KEYS = ['resolution', 'aa', 'fsr', 'fsrMode', 'fsrTarget', 'frameGen', 'frameGenMult', 'effects'] as const satisfies readonly (keyof Settings)[]
const KEY = 'sanguine.settings'
/**
 * Which defaults stored settings were saved under. Saving writes every setting, so a player who had only ever
 * touched the volume has Auto stored for the resolution; from version 2 the default is 100%, and a resolution
 * saved under the old default is dropped so they get it. (Version 3 carried a graphics preset, since removed.) From
 * version 4 graphics are presets that apply to every look: the graphics saved before are dropped, for a preset. From
 * version 5 every preset draws at 100% and nothing changes the look's shading: dropped again, for the new presets.
 */
const VERSION = 5

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
    const v = typeof raw.v === 'number' ? raw.v : 0
    if (v < 2) delete raw.resolution
    if (v < 5) for (const k of [...GRAPHICS_KEYS, 'preset'] as const) delete raw[k]
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
