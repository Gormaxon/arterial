/**
 * Procedural surface textures, generated on a canvas at load.
 *
 * No image assets and no WASM decoders (Basis/KTX2 are both off the table), so every
 * surface is drawn here instead. That also keeps the payload tiny — a few hundred
 * lines of code rather than a few megabytes of PNG.
 *
 * Art direction: near-white concrete and pale metal, dark recessed panel lines, one
 * saturated red. Lighting does the heavy lifting, so the albedo stays high-key and
 * the detail lives in the normal maps.
 */

import * as THREE from 'three'

/**
 * Texture resolution.
 *
 * 512 is a measured compromise: generating all nine surfaces takes ~100 ms at 256 and
 * ~330 ms at 512 on the dev laptop, against ~1.3 s at 1024 — and the Chromebook is
 * several times slower again, so 1024 would be a multi-second freeze before the first
 * frame, for 100 MB of texture on integrated graphics. 512 gives four times the
 * texels for about a second of startup there.
 */
const SIZE = 512
/**
 * Resolution the game boots at, and the one it upgrades to once you are playing.
 *
 * Generating all nine surfaces is pure per-pixel JavaScript, and it is quadratic:
 * measured here it is 0.4 s at 512 and 1.6 s at 1024, which on the Chromebook — the
 * reference device, and several times slower — means about 1.4 s against 5.6 s. Five
 * and a half seconds of black screen before the first frame is not a trade worth
 * making for sharper walls, so the game starts at 512 and rebuilds at 1024 in the
 * background, a slice at a time. See `upgradeTextures`.
 */
export const BASE_SIZE = 512
export const HI_SIZE = 1024
/**
 * The resolution the CURRENT pass is generating at.
 *
 * `band` divides by this to place its features, which is what makes a surface look
 * identical at any resolution instead of merely finer-grained. Painting at 1024 with
 * this left at 512 would halve every feature and the upgrade would change the art
 * rather than sharpen it.
 */
let renderSize = SIZE
/** Exported so tools and tests sample the whole map rather than a hardcoded corner. */
export const TEXTURE_SIZE = SIZE

// ---------------------------------------------------------------------------
// Tileable value noise
// ---------------------------------------------------------------------------

function hash2(x: number, y: number, seed: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1274126177)
  h = (h ^ (h >>> 13)) | 0
  h = Math.imul(h, 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

/** Value noise that wraps at `period`, so the result tiles seamlessly. */
function noise2(x: number, y: number, period: number, seed: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const wrap = (n: number) => ((n % period) + period) % period
  const x0 = wrap(xi)
  const x1 = wrap(xi + 1)
  const y0 = wrap(yi)
  const y1 = wrap(yi + 1)
  const a = hash2(x0, y0, seed)
  const b = hash2(x1, y0, seed)
  const c = hash2(x0, y1, seed)
  const d = hash2(x1, y1, seed)
  const top = a + (b - a) * u
  const bot = c + (d - c) * u
  return top + (bot - top) * v
}

export function fbm(x: number, y: number, octaves: number, period: number, seed: number): number {
  let sum = 0
  let amp = 0.5
  let freq = period
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += noise2((x * freq) / period, (y * freq) / period, freq, seed + i * 17) * amp
    norm += amp
    amp *= 0.5
    freq *= 2
  }
  return sum / norm
}

/**
 * Noise whose feature size is a fraction of the TEXTURE, not a number of pixels.
 *
 * `cells` is how many features span the map, so the look is identical at any
 * resolution and raising SIZE adds detail instead of just finer grain.
 *
 * This is the call every recipe wants. `fbm` takes raw coordinates and its lattice is
 * one unit wide, so passing pixel coordinates to it — as every recipe here used to —
 * produces features exactly ONE PIXEL across, with `period` controlling only where
 * the pattern repeats. That is why the surfaces read as noise rather than as
 * material: there was no structure at any scale to see.
 */
function band(x: number, y: number, octaves: number, cells: number, seed: number): number {
  return fbm((x * cells) / renderSize, (y * cells) / renderSize, octaves, cells, seed)
}

/** Value noise that wraps at separate periods per axis — for stretched, directional features. */
function noise2p(x: number, y: number, periodX: number, periodY: number, seed: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const wx = (n: number) => ((n % periodX) + periodX) % periodX
  const wy = (n: number) => ((n % periodY) + periodY) % periodY
  const x0 = wx(xi)
  const x1 = wx(xi + 1)
  const y0 = wy(yi)
  const y1 = wy(yi + 1)
  const a = hash2(x0, y0, seed)
  const b = hash2(x1, y0, seed)
  const c = hash2(x0, y1, seed)
  const d = hash2(x1, y1, seed)
  const top = a + (b - a) * u
  const bot = c + (d - c) * u
  return top + (bot - top) * v
}

/**
 * `band`, but with a different feature count on each axis, and still seamless.
 *
 * Stretching one axis of ordinary `band` breaks the tiling — its lattice only wraps
 * when both axes share a period. Water streaks run down a wall and brushing runs
 * along a panel; both need noise that is long in one direction and tight in the other.
 */
function bandAniso(x: number, y: number, octaves: number, cellsX: number, cellsY: number, seed: number): number {
  let sum = 0
  let amp = 0.5
  let norm = 0
  let fx = cellsX
  let fy = cellsY
  for (let i = 0; i < octaves; i++) {
    sum += noise2p((x * fx) / renderSize, (y * fy) / renderSize, fx, fy, seed + i * 17) * amp
    norm += amp
    amp *= 0.5
    fx *= 2
    fy *= 2
  }
  return sum / norm
}

function smoothstep(a: number, b: number, t: number): number {
  const k = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return k * k * (3 - 2 * k)
}

// ---------------------------------------------------------------------------
// Canvas helpers
// ---------------------------------------------------------------------------

function canvas(size: number): { c: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')
  if (!ctx) return null
  return { c, ctx }
}

/** Per-pixel writer. `fn` returns [r,g,b] in 0..255 and a height in 0..1. */
function paint(
  fn: (x: number, y: number) => { rgb: [number, number, number]; h: number },
  size: number,
): { color: HTMLCanvasElement; height: Float32Array } | null {
  const made = canvas(size)
  if (!made) return null
  renderSize = size
  const img = made.ctx.createImageData(size, size)
  const height = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const { rgb, h } = fn(x, y)
      const i = (y * size + x) * 4
      img.data[i] = rgb[0]
      img.data[i + 1] = rgb[1]
      img.data[i + 2] = rgb[2]
      img.data[i + 3] = 255
      height[y * size + x] = h
    }
  }
  made.ctx.putImageData(img, 0, 0)
  renderSize = SIZE
  return { color: made.c, height }
}

/** Sobel the height field into a tangent-space normal map. */
function normalFromHeight(
  height: Float32Array,
  strength: number,
  size: number,
): HTMLCanvasElement | null {
  const made = canvas(size)
  if (!made) return null
  const img = made.ctx.createImageData(size, size)
  const at = (x: number, y: number) =>
    height[(((y % size) + size) % size) * size + (((x % size) + size) % size)] ?? 0

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx =
        at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1) -
        (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1))
      const dy =
        at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1) -
        (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1))
      let nx = dx * strength
      let ny = dy * strength
      const nz = 1
      const len = Math.hypot(nx, ny, nz) || 1
      nx /= len
      ny /= len
      const i = (y * size + x) * 4
      img.data[i] = (nx * 0.5 + 0.5) * 255
      img.data[i + 1] = (ny * 0.5 + 0.5) * 255
      img.data[i + 2] = (nz / len) * 0.5 * 255 + 128
      img.data[i + 3] = 255
    }
  }
  made.ctx.putImageData(img, 0, 0)
  return made.c
}

function toTexture(c: HTMLCanvasElement, srgb: boolean): THREE.Texture {
  const t = new THREE.CanvasTexture(c)
  t.wrapS = THREE.RepeatWrapping
  t.wrapT = THREE.RepeatWrapping
  // Floors are seen almost edge-on almost all the time, which is exactly where
  // bilinear filtering smears a texture into mush. three.js clamps this to whatever
  // the GPU supports, so asking for more than it has is safe.
  t.anisotropy = 16
  // Albedo is authored in sRGB; normal maps are raw vectors and must stay linear.
  // Getting this wrong washes every surface out until the detail is invisible.
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
  return t
}

// ---------------------------------------------------------------------------
// Surface recipes
// ---------------------------------------------------------------------------

function clamp255(n: number): number {
  return n < 0 ? 0 : n > 255 ? 255 : n
}

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n
}


/**
 * A length authored in pixels-at-512, scaled to the current pass.
 *
 * Grout lines, rivets and grating bars are all "about three pixels" ideas. Left as
 * literal pixel counts they halve in relative width when the map doubles, so the
 * upgraded texture is not the same surface with more detail — it is a different
 * surface with thinner seams. Everything denominated in pixels goes through here.
 */
function px(n: number): number {
  return (n * renderSize) / SIZE
}

/** Cell grid whose cell COUNT across the map is fixed, rather than its pixel size. */
function cells(count: number): number {
  return renderSize / count
}

/**
 * Architectural cast-in-place concrete.
 *
 * The old recipe was a mottled wash sprinkled with random pits, and up close the pits
 * — big, soft and everywhere — read as cottage cheese. Real board-formed concrete is
 * recognisable from its STRUCTURE: the grid of formwork panels it was poured against,
 * with a faint lip at every joint, a tie-rod hole at the panel's quarter points, fine
 * aggregate grain, the occasional tiny air void, and water staining run vertically
 * down the face. The map spans 4 m, so the panels here are 1 m wide by 2 m tall.
 */
function concrete(x: number, y: number): { rgb: [number, number, number]; h: number } {
  const S = renderSize
  const pw = S / 4
  const ph = S / 2
  const ix = Math.floor(x / pw)
  const iy = Math.floor(y / ph)
  const lx = x - ix * pw
  const ly = y - iy * ph

  // Each panel was its own pour against its own board: a slightly different tone.
  const panelTone = (hash2(ix & 3, iy & 1, 71) - 0.5) * 10
  const fine = band(x, y, 2, 96, 3)
  const med = band(x, y, 3, 20, 9)
  const blotch = band(x, y, 3, 5, 21)
  // Water staining: long vertical runs, tight across and slow down the face.
  const streak = bandAniso(x, y, 2, 40, 3, 33)
  let v = 190 + (fine - 0.5) * 14 + (med - 0.5) * 12 + (blotch - 0.5) * 16 + panelTone
  v -= Math.max(0, streak - 0.55) * 34
  // Relief kept gentle: strong fine-grain height is what read as cottage cheese under
  // a grazing light. The grain lives in the colour; the normal map carries the form.
  let h = 0.5 + (fine - 0.5) * 0.07 + (med - 0.5) * 0.12

  // Formwork joint: a crisp hairline with a slight lip where the boards met.
  const seam = Math.min(lx, pw - lx, ly, ph - ly)
  const seamW = px(1.6)
  if (seam < seamW) {
    const t = 1 - seam / seamW
    v -= 26 * t
    h += 0.22 * t
  }

  // Tie-rod holes at the panel's quarter points, a metre apart: a dark recess inside
  // a faint cone where the plug was pressed in.
  const hx = lx - pw * 0.5
  const hy = ly - ph * (ly < ph * 0.5 ? 0.25 : 0.75)
  const hd = Math.hypot(hx, hy)
  const hr = S * 0.0065
  if (hd < hr) {
    const t = Math.min(1, (1 - hd / hr) * 1.8)
    v -= 72 * t
    h -= 0.6 * t
  } else if (hd < hr * 1.7) {
    const t = 1 - (hd - hr) / (hr * 0.7)
    v += 7 * t
    h += 0.08 * t
  }

  // Bug holes — the small air voids of a real pour. Small and sparse, not a rash.
  const pit = band(x, y, 2, 64, 44)
  if (pit > 0.83) {
    const t = (pit - 0.83) * 6
    v -= 40 * t
    h -= 0.7 * t
  }
  return { rgb: [clamp255(v), clamp255(v * 0.995), clamp255(v * 0.982)], h }
}

/**
 * Wall plating: large staggered panels, bevelled grooves, rivet rows, and grime that
 * collects toward each panel's lower edge.
 *
 * It used to be the tile recipe in grey — a uniform 8x8 grid with a rivet in every
 * corner — so walls and floors read as the same bathroom. Big staggered panels have
 * a scale and a direction a floor tile does not.
 */
function panel(x: number, y: number): { rgb: [number, number, number]; h: number } {
  const S = renderSize
  const rowH = S / 4
  const row = Math.floor(y / rowH)
  const pw = S / 2
  // Alternate rows shift by half a panel. Still seamless: the shifted grid wraps at S.
  const xx = (x + (row % 2) * pw * 0.5) % S
  const col = Math.floor(xx / pw)
  const lx = xx - col * pw
  const ly = y - row * rowH

  const tone = hash2(col & 1, row & 3, 19) - 0.5
  const grain = band(x, y, 3, 32, 5)
  // Brushed along the panel, the way sheet steel comes off the roll.
  const brushed = bandAniso(x, y, 2, 4, 72, 15)
  let v = 178 + tone * 16 + (grain - 0.5) * 9 + (brushed - 0.5) * 12
  let h = 0.62 + (grain - 0.5) * 0.06

  // Groove between panels, with a bevel that catches the light on the way in.
  const edge = Math.min(lx, pw - lx, ly, rowH - ly)
  const gw = px(2.6)
  const bev = px(4)
  if (edge < gw) {
    const t = 1 - edge / gw
    v -= 62 * t
    h = 0.18
  } else if (edge < gw + bev) {
    const t = smoothstep(0, 1, (edge - gw) / bev)
    h = 0.18 + 0.44 * t
    v += 5 * (1 - t)
  }

  // Grime settles toward the bottom of each panel and along its lower groove.
  const drip = Math.max(0, (ly / rowH - 0.55) / 0.45) * (0.4 + band(x, y, 2, 24, 88))
  v -= drip * 16

  // Rivet rows along the top and bottom of every panel.
  const step = pw / 8
  const rx = (((lx % step) + step) % step) - step / 2
  const rr = px(3.2)
  for (const ry of [ly - px(10), ly - (rowH - px(10))]) {
    const d = Math.hypot(rx, ry)
    if (d < rr) {
      const t = 1 - d / rr
      v += 30 * t
      h += 0.34 * t
    }
  }
  return { rgb: [clamp255(v), clamp255(v * 0.99), clamp255(v * 0.968)], h }
}

/** Brushed metal: strong horizontal striation, cool tint. */
function metal(x: number, y: number): { rgb: [number, number, number]; h: number } {
  // Brushed lay, stretched hard along X. Uses `band` so the streaks keep their
  // width relative to the surface; the raw `noise2` this replaced had a one-pixel
  // lattice, so doubling the resolution only ever halved the streaks.
  const brush = band(x * 0.18, y * 1.8, 2, 128, 11)
  const broad = band(x, y, 3, 24, 31)
  const v = 176 + (brush - 0.5) * 26 + (broad - 0.5) * 26
  const h = 0.5 + (brush - 0.5) * 0.5
  return { rgb: [clamp255(v * 0.96), clamp255(v * 0.98), clamp255(v * 1.04)], h }
}

/** Industrial grating: deep square voids on a lattice. */
function grate(x: number, y: number): { rgb: [number, number, number]; h: number } {
  const CELL = cells(16)
  const gx = x % CELL
  const gy = y % CELL
  const bar = px(9)
  const inBar = gx < bar || gy < bar
  const grain = band(x, y, 3, 32, 7)
  if (inBar) {
    const v = 168 + (grain - 0.5) * 28
    return { rgb: [clamp255(v * 0.97), clamp255(v), clamp255(v * 1.03)], h: 0.95 }
  }
  const v = 28 + (grain - 0.5) * 16
  return { rgb: [clamp255(v), clamp255(v), clamp255(v * 1.1)], h: 0.05 }
}

/** Hazard chevrons — diagonal black on amber, scuffed. */
function hazard(x: number, y: number): { rgb: [number, number, number]; h: number } {
  // Stripe pitch as a share of the map, so the chevrons stay the same width on
  // screen when the resolution changes rather than doubling in number.
  const pitch = cells(10.67)
  const s = ((x + y) % pitch) / pitch
  // How dark this point is, 0..1, with an edge about a pixel wide. A hard edge made
  // the stripes crawl and shimmer at a distance — the highest-contrast pattern in the
  // game, repeated at a fixed pitch, is exactly what mipmapping handles worst.
  const e = px(1.1) / pitch
  const darkness = 0.5 + 0.5 * Math.max(-1, Math.min(1, Math.sin(2 * Math.PI * s) / (2 * Math.PI * e)))

  const wear = band(x, y, 3, 20, 13)
  const grime = band(x, y, 3, 6, 29)
  // Chips knocked through the paint to the grey primer underneath.
  const chip = band(x, y, 2, 56, 37)
  const chipped = chip > 0.79 ? Math.min(1, (chip - 0.79) * 12) : 0
  const scuff = wear > 0.64 ? (wear - 0.64) * 2.4 : 0

  const dv = 34 + (wear - 0.5) * 20 + scuff * 70
  const lv = (206 + (wear - 0.5) * 22) * (1 - scuff * 0.25)
  let r = lv + (dv - lv) * darkness
  let g = lv * 0.72 + (dv * 0.96 - lv * 0.72) * darkness
  let b = lv * 0.14 + (dv * 0.9 - lv * 0.14) * darkness
  // Grime darkens both colours evenly; chips go to primer whatever colour they were.
  const dim = 1 - Math.max(0, grime - 0.5) * 0.35
  r *= dim
  g *= dim
  b *= dim
  const primer = 96 + (wear - 0.5) * 20
  r += (primer - r) * chipped
  g += (primer - g) * chipped
  b += (primer * 1.02 - b) * chipped
  return {
    rgb: [clamp255(r), clamp255(g), clamp255(b)],
    h: 0.55 - darkness * 0.04 + scuff * 0.1 - chipped * 0.22,
  }
}

/**
 * Molten rock: dark crust plates drifting on a white-hot melt.
 *
 * Two bands of noise at different scales rather than one. The coarse band decides
 * where crust has formed and where the melt shows through; the fine band breaks the
 * crust up so it reads as separate floating plates instead of one veined rock. The
 * ramp from melt to crust is deliberately sharp — real lava has no gentle midtone,
 * it is black or it is blinding, and a soft gradient is what made the old version
 * look like patterned stone.
 */
function lava(x: number, y: number): { rgb: [number, number, number]; h: number } {
  // Big plates, coarse tearing. The original used periods of 8 and 6, which at this
  // surface's UV scale is a few centimetres per feature — fine enough that the whole
  // pool averaged out to one flat colour and read as patterned stone.
  // Plates big enough to see. This was the first surface to use `band` — before it,
  // calling `fbm` with raw pixel coordinates gave one-pixel features and the pool
  // averaged out to a flat orange sheet no matter how its colours were tuned.
  const plates = band(x, y, 3, 8, 17) // 8 plates across the map
  const detail = band(x, y, 2, 16, 29) // finer tearing over the top
  // Crust where the coarse field is high, torn open by the fine one. The threshold
  // sits well below the noise's mean so crust WINS: a pool that is mostly glow reads
  // as a light source rather than as rock, and at arena scale it blew out to a flat
  // white sheet. The slope is gentle enough to leave a visible rind at each edge —
  // steepening it gains contrast but shatters the melt into dots.
  const crustness = clamp01((plates - 0.34) * 2.4 - (detail - 0.5) * 0.5)
  // Sharpen: mid values collapse toward one end or the other.
  const crust = crustness * crustness * (3 - 2 * crustness)
  const heat = 1 - crust

  // Deep red through orange, stopping short of yellow. Letting the melt reach white
  // is what made it look like stage lighting — real lava tops out around orange, and
  // the bloom of the emissive map takes it the rest of the way at render time.
  const glow = heat * heat
  const r = 40 + glow * 215
  const g = 12 + glow * glow * 138
  const b = 6 + glow * glow * glow * 34

  // Crust is near-black basalt with a faint warm cast from below.
  const rock = 16 + detail * 20
  const k = crust
  return {
    rgb: [
      clamp255(r * (1 - k) + rock * 1.25 * k),
      clamp255(g * (1 - k) + rock * 0.8 * k),
      clamp255(b * (1 - k) + rock * 0.85 * k),
    ],
    // Crust floats proud of the melt, so the normal map lifts the plates.
    h: 0.38 + crust * 0.42 + detail * 0.08,
  }
}

/**
 * The one saturated red, for accents and trim.
 *
 * Painted metal rather than flat colour: a brushed lay along X, broad mottling from
 * the spray, and sparse scuffs worn back to the primer underneath. Flat, it was the
 * cheapest-looking surface in the set — a solid fill reads as untextured no matter
 * how good the lighting is.
 */
function accent(x: number, y: number): { rgb: [number, number, number]; h: number } {
  // Stretched hard along X: brush marks run the length of a part, never in patches.
  const brush = band(x * 0.25, y * 4, 3, 16, 23)
  const mottle = band(x, y, 3, 6, 71)
  const scuff = band(x, y, 2, 40, 83)
  let v = 0.84 + (brush - 0.5) * 0.26 + (mottle - 0.5) * 0.16
  // Worn through to grey primer at the high points.
  const worn = scuff > 0.76 ? (scuff - 0.76) * 3.2 : 0
  const r = 196 * v
  const gg = 28 * v
  const b = 48 * v
  const prime = 112 * v
  return {
    rgb: [
      clamp255(r + (prime - r) * worn),
      clamp255(gg + (prime - gg) * worn),
      clamp255(b + (prime * 1.04 - b) * worn),
    ],
    h: 0.5 + (brush - 0.5) * 0.4 - worn * 0.25,
  }
}

/**
 * Near-black structural trim.
 *
 * The most-used surface in the set — every frame, base and cap is made of it — and
 * the easiest to get wrong, because at this value there is almost no room for
 * contrast before it stops being black. The relief carries it instead: the albedo
 * barely moves, but the height field has real cast texture and scratches in it, so
 * the normal map gives the lighting something to catch. A flat near-black surface
 * reads as an untextured polygon, which is exactly what it looked like.
 */
function dark(x: number, y: number): { rgb: [number, number, number]; h: number } {
  const cast = band(x, y, 4, 20, 37)
  const coarse = band(x, y, 2, 5, 91)
  const scratch = band(x * 0.3, y * 3.2, 2, 32, 101)
  const v = 46 + (cast - 0.5) * 26 + (coarse - 0.5) * 12
  // Height swings much wider than colour: this surface is felt, not seen.
  const h = 0.5 + (cast - 0.5) * 0.7 + (coarse - 0.5) * 0.25 + (scratch - 0.5) * 0.3
  return { rgb: [clamp255(v), clamp255(v), clamp255(v * 1.14)], h }
}

/**
 * Terrazzo floor tile: each tile its own slightly different stone, bevelled edges,
 * mid-grey grout, flecks of aggregate and patches of wear.
 *
 * Every tile used to be the same tile, with near-black grout — which laid a harsh
 * uniform grid across the whole floor and made the arena read as a bathroom. The
 * per-tile tone is what breaks the grid up, the bevel is what gives each tile an edge
 * to catch the light, and the lighter grout keeps the lines from dominating.
 */
function tile(x: number, y: number): { rgb: [number, number, number]; h: number } {
  // Eight tiles across the map, whatever the map's resolution is. Fixed in pixels,
  // the cell halves in relative size whenever the resolution doubles — so upgrading
  // re-laid the floor at twice the tile count instead of sharpening the one it had.
  const CELL = cells(8)
  const ix = Math.floor(x / CELL)
  const iy = Math.floor(y / CELL)
  const gx = x - ix * CELL
  const gy = y - iy * CELL
  // Symmetric in the cell, with no one-pixel offset: a pixel is a different share of a
  // tile at every resolution, and that offset alone moved grout lines between 512
  // and 1024 — the upgrade would have re-laid the floor instead of sharpening it.
  const edge = Math.min(gx, CELL - gx, gy, CELL - gy)
  // The grout and bevel keep their share of the tile too, or they thin to a
  // hairline at 1024.
  const grout = Math.max(1.5, CELL * 0.032)
  const bevel = CELL * 0.055
  const grain = band(x, y, 3, 48, 41)
  if (edge < grout) {
    const v = 116 + (grain - 0.5) * 18
    return { rgb: [clamp255(v), clamp255(v * 0.99), clamp255(v * 0.97)], h: 0.1 }
  }

  const tone = hash2(ix & 7, iy & 7, 53) - 0.5
  // Aggregate flecks: small dark and light chips set into the stone.
  const fleck = band(x, y, 2, 150, 61)
  const wear = band(x, y, 3, 4, 77)
  let v = 205 + tone * 18 + (grain - 0.5) * 7 - (wear - 0.5) * 12
  if (fleck > 0.7) v -= (fleck - 0.7) * 150
  else if (fleck < 0.28) v += (0.28 - fleck) * 55

  // The bevel: height ramps up from the grout, so the normal map gives every tile a
  // lit edge on one side and a shadowed one on the other.
  const b = smoothstep(0, 1, (edge - grout) / bevel)
  const h = 0.1 + 0.7 * b + (grain - 0.5) * 0.03
  return {
    rgb: [clamp255(v * (1 + tone * 0.018)), clamp255(v * 0.992), clamp255(v * (0.978 - tone * 0.018))],
    h,
  }
}

// ---------------------------------------------------------------------------

export type SurfaceKey =
  | 'concrete'
  | 'panel'
  | 'metal'
  | 'grate'
  | 'hazard'
  | 'lava'
  | 'accent'
  | 'dark'
  | 'tile'
  | 'padglow'

interface Recipe {
  fn: (x: number, y: number) => { rgb: [number, number, number]; h: number }
  /** Texture repeats per world unit. Bigger = finer detail. */
  scale: number
  normalStrength: number
}

const RECIPES: Record<SurfaceKey, Recipe> = {
  concrete: { fn: concrete, scale: 0.25, normalStrength: 1.3 },
  panel: { fn: panel, scale: 0.18, normalStrength: 2.6 },
  metal: { fn: metal, scale: 0.3, normalStrength: 1.2 },
  grate: { fn: grate, scale: 0.4, normalStrength: 3.4 },
  hazard: { fn: hazard, scale: 0.25, normalStrength: 1.2 },
  lava: { fn: lava, scale: 0.16, normalStrength: 2.2 },
  accent: { fn: accent, scale: 0.3, normalStrength: 1.0 },
  dark: { fn: dark, scale: 0.3, normalStrength: 1.2 },
  tile: { fn: tile, scale: 0.2, normalStrength: 2.4 },
  // Brushed metal underneath; all of its character comes from the emissive in
  // `LOOKS`. Reusing the metal painter keeps this to one more baked texture rather
  // than a whole new recipe for what is, visually, a light.
  padglow: { fn: metal, scale: 0.3, normalStrength: 1.0 },
}

/**
 * The raw pixel function for a surface, without a canvas.
 *
 * Texture baking needs a DOM canvas, so none of this can be inspected from a Node
 * test. This gives the tools a way to sample a surface directly and check what it
 * actually looks like.
 */
export function surfaceSampler(key: SurfaceKey, size: number = SIZE): Recipe['fn'] {
  // `band` reads the module-level pass size, so a caller sampling at 1024 has to say
  // so — otherwise every feature comes out half the size it should be, and the
  // "upgrade" changes the art instead of sharpening it.
  renderSize = size
  return RECIPES[key].fn
}

export interface SurfaceMaps {
  map: THREE.Texture | null
  normalMap: THREE.Texture | null
  /** Texture repeats per world unit, for per-mesh UV scaling. */
  scale: number
}

const cache = new Map<SurfaceKey, SurfaceMaps>()

// ---------------------------------------------------------------------------
// Baked textures
// ---------------------------------------------------------------------------

/**
 * A hash of THIS FILE, injected by the build (vite.config.ts) and also computed by the bake
 * (tools/bake-textures.mjs): the baked images live under a directory named after it, so a
 * changed recipe can never be paired with stale pictures — the URL simply does not exist
 * and the game falls back to generating them. Empty when not built by Vite (tests).
 */
declare const __TEXTURE_HASH__: string | undefined
export const TEXTURE_HASH: string = typeof __TEXTURE_HASH__ !== 'undefined' ? __TEXTURE_HASH__ : ''

/** The baked sky, once loaded. `buildSkyTexture` (sky.ts) hands it out instead of painting one. */
let bakedSky: THREE.Texture | null = null
export function takeBakedSky(): THREE.Texture | null {
  const t = bakedSky
  bakedSky = null
  return t
}

/** One file of the baked set, as reported while loading. */
export interface BakedProgress {
  file: string
  loaded: number
  total: number
}

/** Fetch a file as a Blob, reporting bytes as they arrive. */
async function fetchBlob(url: string, onChunk: (loaded: number, total: number) => void): Promise<Blob> {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`)
  const total = Number(r.headers.get('content-length')) || 0
  if (!r.body) return r.blob()
  const reader = r.body.getReader()
  const parts: Uint8Array[] = []
  let loaded = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    parts.push(value)
    loaded += value.length
    onChunk(loaded, total)
  }
  return new Blob(parts as BlobPart[], { type: r.headers.get('content-type') ?? 'image/webp' })
}

/** A texture over an already-decoded bitmap. Same settings as `toTexture`. */
function bitmapTexture(bm: ImageBitmap, srgb: boolean): THREE.Texture {
  const t = new THREE.Texture(bm)
  // Decoded with `imageOrientation: 'flipY'`, because WebGL ignores flipY for bitmaps: the
  // picture is already the way up a canvas texture would have uploaded it.
  t.flipY = false
  t.wrapS = THREE.RepeatWrapping
  t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 16
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
  t.needsUpdate = true
  return t
}

/**
 * Load every surface from the baked images instead of generating it.
 *
 * Generating the nine surfaces is pure per-pixel JavaScript on the main thread: about a
 * second on a fast laptop and, scaled to a Chromebook, most of the 30-odd seconds the arena
 * took to appear. The pictures are deterministic, so they are made once at build time
 * (`npm run bake`) and the browser decodes them natively, off the main thread.
 *
 * All-or-nothing: returns true only if every file loaded, and only then fills the cache.
 * On false (not baked, a stale hash, a network failure) `surfaceMaps` generates as before.
 */
export async function loadBakedSurfaces(onProgress?: (p: BakedProgress) => void): Promise<boolean> {
  if (!TEXTURE_HASH || typeof createImageBitmap !== 'function' || typeof fetch !== 'function') return false
  const dir = `textures/${TEXTURE_HASH}/`
  try {
    const jobs = SURFACE_KEYS.flatMap((k) => [`${k}-c`, `${k}-n`].map((name) => ({ key: k as SurfaceKey | 'sky', name, srgb: name.endsWith('-c') })))
    // The sky is baked alongside: 1024x512 pixels of two noise passes each, and as
    // deterministic as the surfaces.
    jobs.push({ key: 'sky', name: 'sky', srgb: true })
    const bitmaps = await Promise.all(
      jobs.map(async (j) => {
        const blob = await fetchBlob(`${dir}${j.name}.webp`, (loaded, total) => onProgress?.({ file: j.name, loaded, total }))
        return createImageBitmap(blob, { imageOrientation: 'flipY' })
      }),
    )
    jobs.forEach((j, i) => {
      if (j.key === 'sky') {
        bakedSky = bitmapTexture(bitmaps[i]!, true)
        return
      }
      let m = cache.get(j.key)
      if (!m) cache.set(j.key, (m = { map: null, normalMap: null, scale: RECIPES[j.key].scale }))
      if (j.srgb) m.map = bitmapTexture(bitmaps[i]!, true)
      else m.normalMap = bitmapTexture(bitmaps[i]!, false)
    })
    return true
  } catch (err) {
    console.warn('baked textures unavailable; generating them instead', err)
    for (const k of SURFACE_KEYS) cache.delete(k)
    bakedSky = null
    return false
  }
}

/** Build (once) and return the texture set for a surface. Headless-safe. */
export function surfaceMaps(key: SurfaceKey): SurfaceMaps {
  const hit = cache.get(key)
  if (hit) return hit

  const recipe = RECIPES[key]
  const built = paint(recipe.fn, SIZE)
  const result: SurfaceMaps = { map: null, normalMap: null, scale: recipe.scale }

  if (built) {
    result.map = toTexture(built.color, true)
    const n = normalFromHeight(built.height, recipe.normalStrength, SIZE)
    if (n) result.normalMap = toTexture(n, false)
  }

  cache.set(key, result)
  return result
}

export const SURFACE_KEYS = Object.keys(RECIPES) as SurfaceKey[]

/**
 * Rebuild every surface at a higher resolution, without stalling the game.
 *
 * Returns a `tick` to call once a frame with a millisecond budget. It does at most
 * that much work per call, one surface at a time, and swaps each finished pair of
 * maps into the live textures — so the level sharpens up a surface at a time while
 * you play instead of costing five seconds of black screen before you can move.
 *
 * Swapping by mutating `texture.image` matters: the materials already hold references
 * to these texture objects, and handing them a new object would mean walking every
 * material to re-point it. Setting `needsUpdate` re-uploads and regenerates mipmaps.
 *
 * `tick` returns true while there is work left.
 */
export function upgradeTextures(target: number): (budgetMs: number) => boolean {
  const queue = SURFACE_KEYS.filter((k) => cache.get(k)?.map)
  let i = 0

  return (budgetMs: number): boolean => {
    const deadline = performance.now() + budgetMs
    // One surface per slice at most. A single 1024 surface is ~180 ms of work here,
    // which is far more than a frame — but it is the smallest unit that can be
    // swapped in coherently, so the budget governs how often we start one rather
    // than how far through one we get.
    while (i < queue.length && performance.now() < deadline) {
      const key = queue[i]!
      i++
      const maps = cache.get(key)
      const recipe = RECIPES[key]
      if (!maps?.map) continue

      const built = paint(recipe.fn, target)
      if (!built) continue
      maps.map.image = built.color
      maps.map.needsUpdate = true

      if (maps.normalMap) {
        const n = normalFromHeight(built.height, recipe.normalStrength, target)
        if (n) {
          maps.normalMap.image = n
          maps.normalMap.needsUpdate = true
        }
      }
    }
    return i < queue.length
  }
}

