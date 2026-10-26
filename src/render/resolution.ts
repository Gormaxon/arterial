/**
 * Dynamic resolution — trade pixels for frame rate when the GPU cannot keep up.
 *
 * The game is FILL-bound on integrated graphics, not CPU-bound. Measured on the dev
 * laptop's Iris Xe at the Chromebook's own 1.36 device pixel ratio: the CPU sat 75%
 * idle (sim 0.6 ms, render 3 ms) while frames averaged 26 ms with 66 ms spikes. Drop
 * the same scene to a pixel ratio of 1.0 and it held a locked 16.7 ms. The Chromebook's
 * GPU is weaker still, so no single fixed ratio is right for every machine — this
 * watches the frame times and picks the sharpest ratio that still keeps up.
 *
 * Rules, all of them there to stop it hunting:
 *  - Judged over whole windows of frames, never single frames, so a GC pause or a
 *    texture upload cannot trigger a change.
 *  - Drops quickly (one bad window), climbs slowly (several good ones in a row).
 *  - A level that was tried and could not be held is not retried for a while, and the
 *    wait doubles each time it fails — so a borderline machine settles instead of
 *    bouncing between two levels forever.
 *  - A drop that did not buy frames is undone. Lowering the resolution only helps a GPU
 *    that is short of pixels; a machine held up by its CPU (a weak Chromebook running
 *    the sim, particles and draw calls) runs nearly as slowly at half resolution, so
 *    chasing the frame rate down the ladder just makes the picture blurry for nothing.
 *    If a drop recovers far less than the pixels it removed would predict, the level
 *    above is restored and held for a while.
 *  - Frames straight after a change are ignored: resizing the drawing buffer costs a
 *    frame of its own, and counting it would make every change look like a failure.
 */

/** Frames per judging window. About a second at 60 fps. */
const WINDOW = 60
/**
 * Right after climbing, the new level is judged on this many frames instead of a
 * whole window. A level that cannot be held shows it immediately, and every frame of
 * the probe is a frame of stutter the player sees.
 */
const PROBE_FRAMES = 15
/** Consecutive comfortable windows before trying a sharper level. */
const GOOD_WINDOWS_TO_CLIMB = 4
/** Comfortable windows at one level before its failure history is forgiven. */
const GOOD_WINDOWS_TO_FORGIVE = 20
/**
 * A drop must recover at least this fraction of the pixel reduction it made, as frame
 * time, to count as having helped. A purely fill-bound frame recovers all of it; one
 * that is half fill recovers half. Below this the CPU, not the GPU, is the limit.
 */
const MIN_GAIN_PER_PIXEL = 0.3
/** How long a level the drop could not improve on is held before another try. */
const CPU_BOUND_HOLD_MS = 90_000
/** The first seconds of play are ignored: first shots and first effects compile things. */
const OPENING_MS = 2500
/** Milliseconds of frames to discard after any change. */
const SETTLE_MS = 350
/**
 * Windows in a row with a single hitch each before that counts as over budget. One hitch is a passing GC pause or
 * upload; one every second, second after second, is a level the card cannot quite hold, and reads as stutter at
 * a frame rate that still averages 60.
 */
const HITCH_WINDOWS = 3
/** First retry delay for a level that failed; doubles per failure. */
const BACKOFF_MS = 10_000
const BACKOFF_MAX_MS = 90_000
/** Each level renders this fraction of the previous one's pixel ratio. */
const STEP = 0.87
/**
 * Never go softer than this. Below about two thirds the picture is plainly blurry, and a
 * lower frame rate is the better trade than a soft image: it is what players complain about.
 */
const FLOOR = 0.66
/**
 * The frame time chased. Never faster than ~75 fps: on a 120/144 Hz panel, running
 * the resolution down to chase the refresh rate would trade a sharp image for frames
 * nobody asked for.
 */
const MIN_TARGET_MS = 13.3
/** 48 Hz — the slowest refresh rate a real panel runs at. See `refreshMs`. */
const SLOWEST_PANEL_MS = 1000 / 48

export class DynamicResolution {
  /** Pixel ratios, sharpest first. */
  readonly levels: number[] = []
  private index = 0
  private readonly frames: number[] = []
  /** Wall time covered by `frames`. */
  private windowMs = 0
  private settleUntil = 0
  private goodWindows = 0
  /** Comfortable windows in a row at the current level, for forgiving old failures. */
  private heldWindows = 0
  /** When each level may next be tried, and how many times it has failed. */
  private readonly retryAt: number[] = []
  private readonly failures: number[] = []
  /** The last drop and the frame time it was made at, until its result has been judged. */
  private lastDrop: { from: number; to: number; avg: number } | null = null
  /** While `now < holdUntil`, the ladder is not descended past `holdIndex`. */
  private holdIndex = 0
  private holdUntil = 0
  private opened = false
  /** True from a climb until the new level has survived its first judgement. */
  private probing = false
  /** Windows in a row with exactly one hitch. */
  private hitchWindows = 0
  /**
   * Estimated display refresh interval, in ms — the fastest frames seen, see update().
   * Starts at the slowest plausible panel (48 Hz) and only ever comes down.
   */
  private refreshMs = SLOWEST_PANEL_MS

  constructor(
    maxRatio: number,
    private readonly apply: (ratio: number) => void,
  ) {
    const max = Math.max(FLOOR, maxRatio)
    // The ladder is anchored on exactly 1.0 (one render pixel per CSS pixel) when the
    // panel is denser than that, so the rung a machine most often settles on is a
    // clean 1:1 rather than whatever fraction the steps happened to land on.
    const rungs: number[] = []
    if (max > 1) {
      for (let r = 1; r < max * 0.95; r /= STEP) rungs.push(r)
      rungs.push(max)
      rungs.reverse()
      for (let r = STEP; r >= FLOOR - 1e-6; r *= STEP) rungs.push(r)
    } else {
      for (let r = max; r >= FLOOR - 1e-6; r *= STEP) rungs.push(r)
    }
    if (rungs[rungs.length - 1]! > FLOOR + 0.02) rungs.push(FLOOR)
    for (const r of rungs) this.levels.push(Math.round(r * 1000) / 1000)
    for (let i = 0; i < this.levels.length; i++) {
      this.retryAt.push(0)
      this.failures.push(0)
    }
    // Start at 1:1 CSS pixels (or the panel's own density, if that is lower).
    // Starting at full density means the first second on a Chromebook is the jankiest
    // second of the session; starting here, a machine with headroom climbs to sharp
    // within a few seconds and one without never shows the stutter at all.
    this.index = this.levels.findIndex((l) => l <= 1.001)
    if (this.index < 0) this.index = this.levels.length - 1
  }

  /** A ratio the player has fixed, or null while the controller chooses. */
  private fixedRatio: number | null = null

  get ratio(): number {
    return this.fixedRatio !== null ? this.fixedRatio : this.levels[this.index]!
  }

  /** True while a ratio is fixed and the controller is standing aside. */
  get isFixed(): boolean {
    return this.fixedRatio !== null
  }

  /**
   * Hold the ratio at `ratio`, or give the choice back to the controller with null. Either way the new ratio is
   * handed to `apply` at once.
   */
  setFixed(ratio: number | null): void {
    this.fixedRatio = ratio
    this.frames.length = 0
    this.windowMs = 0
    this.apply(this.ratio)
  }

  /** 0..1 where 1 is the sharpest level, for the HUD. */
  get level(): number {
    return this.levels.length > 1 ? 1 - this.index / (this.levels.length - 1) : 1
  }

  /**
   * Feed one frame. `active` should be false whenever the frame time says nothing
   * about the game's own cost — menus with a blurred backdrop, build mode, a hidden
   * tab — and those frames are simply not counted.
   */
  update(frameMs: number, now: number, active: boolean): void {
    if (this.fixedRatio !== null) return
    if (!active || now < this.settleUntil) {
      this.frames.length = 0
      this.windowMs = 0
      return
    }
    if (!this.opened) {
      this.opened = true
      this.settleUntil = now + OPENING_MS
      return
    }
    // A frame this long is a hitch (tab switch, GC, shader compile), not a verdict.
    if (frameMs > 250) return
    this.frames.push(frameMs)
    const target = Math.max(this.refreshMs, MIN_TARGET_MS)

    // A fresh climb gets an early verdict: plainly over budget after a third of a
    // second means drop now rather than stutter out the rest of a full window.
    if (this.probing && this.frames.length === PROBE_FRAMES) {
      const avg = this.frames.reduce((s, v) => s + v, 0) / PROBE_FRAMES
      if (avg > target * 1.25) {
        this.overBudget(now, 1, avg)
        return
      }
    }
    // A window is a second of play OR sixty frames, whichever comes first — counted
    // in frames alone, a machine running at 30 fps took two full seconds of stutter
    // to reach each verdict.
    this.windowMs += frameMs
    if (this.frames.length < WINDOW && (this.windowMs < 1000 || this.frames.length < 20)) return

    // Dropped frames are the thing a player actually sees, so they are counted
    // directly. Averages hide them: a GPU slightly too slow for the panel misses a
    // vsync only every tenth frame or so, which barely moves the average or even the
    // 90th percentile — and is a visible hitch five or six times a second.
    //
    // Counted as EVENTS — runs of consecutive long frames — not as frames. One GC
    // pause or texture upload can straddle two vsyncs and come out as two long frames
    // in a row; that is still one hitch, and not a verdict on the resolution.
    let drops = 0
    let inRun = false
    for (const ms of this.frames) {
      const long = ms > target * 1.5
      if (long && !inRun) drops++
      inRun = long
    }

    const sorted = this.frames.slice().sort((a, b) => a - b)
    this.frames.length = 0
    this.windowMs = 0
    const avg = sorted.reduce((s, v) => s + v, 0) / sorted.length
    const p10 = sorted[Math.floor(sorted.length * 0.1)]!

    // The refresh interval is read off the FASTEST tenth of frames. An overloaded
    // GPU on a 60 Hz panel does not run at a steady 30 — frames land on alternate
    // vsyncs, a mix of 16.7 and 33.3 — so its quickest frames still show the panel's
    // true rate. A fixed 60 Hz assumption would instead read a 50 Hz or 48 Hz panel
    // (common in laptop power-saving modes) as permanently over budget and run it
    // at the blurriest level for no reason. The estimate never exceeds 48 Hz, so a
    // machine that is somehow a perfectly steady 30 fps from the first frame still
    // registers as over budget rather than as a 30 Hz display.
    if (p10 < this.refreshMs) this.refreshMs = Math.max(5, p10)

    // One hitch in a window is a GC pause or a texture upload; two separate ones is
    // the machine telling you it cannot keep up.
    if (drops >= 2 || avg > target * 1.15) {
      // Grossly over — running at half rate or worse — is two rungs, not one: the
      // pixel count falls with the SQUARE of the ratio, so a single step barely
      // dents a load that large.
      this.overBudget(now, avg > target * 1.7 ? 2 : 1, avg)
      return
    }
    this.hitchWindows = drops === 1 ? this.hitchWindows + 1 : 0
    if (this.hitchWindows >= HITCH_WINDOWS) {
      this.hitchWindows = 0
      this.overBudget(now, 1, avg)
      return
    }
    this.probing = false
    // Under budget at the level a drop led to: the drop worked, nothing to judge.
    this.lastDrop = null

    // Only a clean window counts toward climbing: climbing out of a window with a hitch in it climbs into more.
    if (drops === 0 && avg < target * 1.05) {
      this.goodWindows++
      // Held comfortably for long enough: whatever went wrong here before was a
      // passing scene, not the machine, so the next drop starts its backoff afresh.
      if (++this.heldWindows >= GOOD_WINDOWS_TO_FORGIVE) this.failures[this.index] = 0
      const up = this.index - 1
      if (up >= 0 && this.goodWindows >= GOOD_WINDOWS_TO_CLIMB && now >= this.retryAt[up]!) {
        this.set(up, now)
        this.probing = true
      }
    } else {
      this.goodWindows = 0
    }
  }

  /**
   * The current level could not be held. It is marked so that climbing back to it
   * waits out a backoff — whether it was reached by climbing or by dropping through
   * it, a level measured as too slow is not worth an immediate second look.
   */
  private overBudget(now: number, rungs: number, avg: number): void {
    // Still over budget after the last drop: did the drop buy anything?
    const d = this.lastDrop
    if (d && d.to === this.index) {
      this.lastDrop = null
      const removed = 1 - (this.levels[d.to]! / this.levels[d.from]!) ** 2
      const gain = (d.avg - avg) / d.avg
      if (gain < removed * MIN_GAIN_PER_PIXEL) {
        this.holdIndex = d.from
        this.holdUntil = now + CPU_BOUND_HOLD_MS
        this.set(d.from, now)
        return
      }
    }
    // Held at a level the CPU, not the pixels, is limiting: nothing below it is worth it.
    if (now < this.holdUntil && this.index >= this.holdIndex) {
      this.frames.length = 0
      this.windowMs = 0
      return
    }
    const n = ++this.failures[this.index]!
    this.retryAt[this.index] = now + Math.min(BACKOFF_MAX_MS, BACKOFF_MS * 2 ** (n - 1))
    const next = Math.min(this.levels.length - 1, this.index + rungs)
    if (next !== this.index) {
      const from = this.index
      this.set(next, now)
      this.lastDrop = { from, to: next, avg }
    } else {
      this.frames.length = 0
      this.windowMs = 0
    }
  }

  private set(index: number, now: number): void {
    this.index = index
    this.lastDrop = null
    this.settleUntil = now + SETTLE_MS
    this.frames.length = 0
    this.windowMs = 0
    this.goodWindows = 0
    this.heldWindows = 0
    this.hitchWindows = 0
    this.probing = false
    this.apply(this.ratio)
  }
}
