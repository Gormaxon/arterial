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

export const SIM_HZ = 120
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
}

export class Loop {
  readonly stats: LoopStats = { fps: 0, frameMs: 0, simMs: 0, renderMs: 0, steps: 0 }

  /** False stops the simulation (and the per-frame input read) while frames carry on being drawn. */
  simulate = true

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
    this.step(frameMs)
  }

  /**
   * One frame of `frameMs`, driven by hand instead of by the display: a harness films the game frame by frame this
   * way with the loop stopped, at an exact frame rate a headless browser could never keep up with.
   */
  advance(frameMs: number): void {
    this.step(frameMs)
  }

  private step(frameMs: number): void {
    if (this.simulate) {
      // Clamp the delta itself as well: a single 5 s hitch should resume, not fast-forward.
      this.accumulator += Math.min(frameMs, 250) / 1000
      this.beginFrame?.()
    } else {
      this.accumulator = 0
    }

    const simStart = performance.now()
    let steps = 0
    while (this.simulate && this.accumulator >= SIM_DT && steps < MAX_STEPS) {
      this.fixed(SIM_DT)
      this.accumulator -= SIM_DT
      steps++
    }
    // Ran out of step budget: drop the backlog rather than carrying it into the next
    // frame, where it would compound into a spiral of death.
    if (steps === MAX_STEPS) this.accumulator = 0
    const simMs = performance.now() - simStart

    const renderStart = performance.now()
    this.render(this.accumulator / SIM_DT)
    const renderMs = performance.now() - renderStart

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
