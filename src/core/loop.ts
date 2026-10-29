/**
 * Fixed-timestep simulation with an interpolated render.
 *
 * Movement tech (dash distance, slide-hop height) must not vary with frame rate.
 * A 144 Hz desktop and a 60 Hz Chromebook have to produce identical jumps, so the
 * simulation always advances in whole SIM_HZ steps and the renderer interpolates
 * between the last two states.
 *
 * Frames are drawn once per display refresh (requestAnimationFrame), timed off the browser's own refresh
 * timestamps so a steady display gives steady steps. There is no "vsync off" or frame limit to choose: a page
 * cannot turn the display's sync off (the browser shows the newest frame at each refresh either way), so drawing
 * faster than the display only spent the processor on frames nobody saw, and a slow machine lost frames to it.
 */

/**
 * Simulation steps a second. 60, one a frame on a 60 Hz panel (frames are drawn between steps, interpolated): at 120 a
 * frame carried two whole steps — the player, every round in flight, the doors and triggers — and on the Chromebook,
 * which runs without the browser's optimising compiler, the second was over a millisecond of every frame.
 */
export const SIM_HZ = 60
export const SIM_DT = 1 / SIM_HZ

/**
 * Never simulate more than this many steps in one frame. A tab that was backgrounded
 * for 30 s must not try to catch up 3600 steps and lock the machine up.
 *
 * Raised from 5. A step is measured at ~25 µs on the dev laptop, so even several times
 * slower on the Chromebook eight of them are a fraction of a millisecond — there is
 * no spiral of death to guard against at that price. Five was low enough to trip on
 * any 42 ms frame, and every time it tripped the backlog was DROPPED, so the game
 * itself ran in slow motion through exactly the frames that were already stuttering.
 */
export const MAX_STEPS = 8

export interface LoopStats {
  /** Smoothed frames per second. */
  fps: number
  /** Whole-frame wall time in ms (includes browser compositing gaps). */
  frameMs: number
  /** Time spent inside fixed() this frame, in ms. */
  simMs: number
  /** Time spent inside render() this frame, in ms. */
  renderMs: number
  /** Fixed steps run this frame. Persistently > 1 means we are below SIM_HZ. */
  steps: number
  /** How long after the display's tick (the frame's timestamp) the frame was called, ms: the thread was busy before it. */
  lateMs: number
  /** The whole frame's work, ms: everything from being called to handing back, the simulation and render() included. */
  workMs: number
}

export class Loop {
  readonly stats: LoopStats = { fps: 0, frameMs: 0, simMs: 0, renderMs: 0, steps: 0, lateMs: 0, workMs: 0 }
  /** When this frame's work began (performance.now): what it has cost so far is the time since. */
  frameStart = 0
  /** Called at the very end of each displayed frame, its stats complete (the play benchmark's log). */
  afterFrame: (() => void) | null = null
  /**
   * Called once each simulated frame is drawn, still inside its work (stats.workMs) but outside its simulation and
   * drawing times: work that takes whatever the frame has left (World.navSlice).
   */
  endFrame: (() => void) | null = null

  /** False stops the simulation (and the per-frame input read) while frames carry on being drawn. */
  simulate = true
  /**
   * A hit-stop: until this moment (performance.now) the simulation runs at `holdScale` of real time. Frames are still
   * drawn and the per-frame input still read, so the view never locks — only the world stops on the blow for a beat.
   */
  private holdUntil = 0
  private holdScale = 1
  /**
   * A lasting slow-down of the world, 0..1 of real time (1: none), eased by whoever sets it, between frames. Unlike a
   * hit-stop, which spaces the steps out (a beat that short never shows it), this one SHRINKS each step: the world still
   * moves on every frame, so seconds of it at a quarter speed are as smooth as full speed — nothing stepping at 15 Hz.
   * The per-frame input still reads real time, so the view turns as fast as the hand does.
   */
  slow = 1
  /** This frame's real time, seconds (clamped as the simulation's is): what a per-frame reader that must not slow eases by. */
  realDt = 0

  private accumulator = 0
  private last = 0
  private running = false
  private token = 0
  private rafId = 0
  private fpsSmooth = 0

  constructor(
    /** Advance the simulation by exactly SIM_DT seconds. */
    private readonly fixed: (dt: number) => void,
    /** Draw. `alpha` is 0..1 between the previous and current sim state. */
    private readonly render: (alpha: number) => void,
    /**
     * Once per frame, BEFORE any simulation step — where per-frame input such as mouse
     * look belongs, so every step of this frame and the render all see the same aim.
     */
    private readonly beginFrame?: () => void,
  ) {}

  start(): void {
    if (this.running) return
    this.running = true
    this.token++
    this.last = performance.now()
    this.schedule()
  }

  stop(): void {
    this.running = false
    this.token++
    cancelAnimationFrame(this.rafId)
  }

  /** Arrange for exactly one more frame, at the next display refresh. A hidden tab gets none, which pauses the game there. */
  private schedule(): void {
    if (!this.running) return
    const token = this.token
    this.rafId = requestAnimationFrame((t) => {
      if (token === this.token) this.frame(t)
    })
  }

  /** One frame, started at `now`. */
  private frame(now: number): void {
    if (!this.running) return
    // Scheduled first, so a render that throws does not stop the game.
    this.schedule()

    const frameMs = now - this.last
    this.last = now
    const start = performance.now()
    this.stats.lateMs = start - now
    this.step(frameMs)
    this.stats.workMs = performance.now() - start
    this.afterFrame?.()
  }

  /**
   * One frame of `frameMs`, driven by hand instead of by the display: a harness films the game frame by frame this
   * way with the loop stopped, at an exact frame rate a headless browser could never keep up with.
   */
  /**
   * Slow the world to `scale` of real time for `ms` milliseconds: the beat a heavy blow lands on, as slasher games do. A
   * hold already running is extended, never shortened, and the slower of the two wins.
   */
  hold(ms: number, scale = 0.05): void {
    const now = performance.now()
    if (now >= this.holdUntil) this.holdScale = scale
    else this.holdScale = Math.min(this.holdScale, scale)
    this.holdUntil = Math.max(this.holdUntil, now + ms)
  }

  /** Is a hit-stop holding the world right now? */
  get holding(): boolean {
    return performance.now() < this.holdUntil
  }

  /** How fast the world runs against real time right now: a hit-stop and the slow-down together. */
  get scale(): number {
    return (performance.now() < this.holdUntil ? this.holdScale : 1) * this.slow
  }

  advance(frameMs: number): void {
    this.step(frameMs)
  }

  private step(frameMs: number): void {
    this.frameStart = performance.now()
    this.realDt = Math.min(frameMs, 250) / 1000
    if (this.simulate) {
      // Clamp the delta itself as well: a single 5 s hitch should resume, not fast-forward.
      const scale = performance.now() < this.holdUntil ? this.holdScale : 1
      this.accumulator += (Math.min(frameMs, 250) / 1000) * scale
      this.beginFrame?.()
    } else {
      this.accumulator = 0
    }

    const simStart = performance.now()
    let steps = 0
    // Read after beginFrame, which is where the slow-down is eased: every step of a frame is the same length.
    const dt = SIM_DT * Math.max(0.01, Math.min(1, this.slow))
    while (this.simulate && this.accumulator >= SIM_DT && steps < MAX_STEPS) {
      this.fixed(dt)
      this.accumulator -= SIM_DT
      steps++
    }
    // Ran out of step budget: drop the backlog rather than carrying it into the next
    // frame, where it would compound into a spiral of death.
    if (steps === MAX_STEPS && this.accumulator >= SIM_DT) this.accumulator %= SIM_DT
    const simMs = performance.now() - simStart

    const renderStart = performance.now()
    this.render(this.accumulator / SIM_DT)
    const renderMs = performance.now() - renderStart
    if (this.simulate) this.endFrame?.()

    const s = this.stats
    const instantFps = frameMs > 0 ? 1000 / frameMs : 0
    // Exponential smoothing — a raw per-frame number is unreadable while playing.
    this.fpsSmooth = this.fpsSmooth === 0 ? instantFps : this.fpsSmooth * 0.9 + instantFps * 0.1
    s.fps = this.fpsSmooth
    s.frameMs = frameMs
    s.simMs = simMs
    s.renderMs = renderMs
    s.steps = steps
  }
}
