/**
 * Pointer lock and raw mouse input.
 *
 * Deliberately no smoothing, no acceleration, no per-frame averaging: every count of
 * travel the mouse reports is applied, once, unscaled. Filtering shows up as input lag
 * that makes precise flick shots impossible.
 *
 * What there IS is resampling, for slow input devices only. A touchpad or office mouse
 * reports about as often as the display refreshes but out of step with it, so one frame
 * gets two reports and the next gets none, and turning steps unevenly at a steady 60 fps.
 * Each report is kept with its time, and a frame takes the travel up to a moment one
 * report-interval in the past, splitting a report between frames where it falls across
 * them. Nothing is averaged or lost; the travel arrives evenly, at most one report late.
 * A gaming mouse (250 Hz and up) reports often enough to be passed straight through.
 */

/** A report this many counts or fewer is never taken for a warp spike. */
const SPIKE_MIN = 200
/** ...nor one less than this many times the biggest of the reports just before it... */
const SPIKE_RATIO = 6
/** ...which are those of the last this many milliseconds (continuous movement). */
const SPIKE_WINDOW_MS = 60

export class Input {
  readonly keys = new Set<string>()
  private readonly mouseButtons = new Set<number>()

  /** Keys/buttons that went down since the last endStep(). Edge-triggered actions
   *  (jump, dash) must read these — polling `keys` would fire them every step. */
  private readonly edges = new Set<string>()

  /** Travel not yet handed out, as [time, dx, dy] triples, oldest first. */
  private readonly motion: number[] = []
  /** The time up to which travel has been handed out. */
  private motionUntil = 0
  /** Smoothed interval between the device's reports, ms. */
  private reportMs = 8
  private lastReport = 0
  private locked = false

  onLockChange: ((locked: boolean) => void) | null = null

  constructor(private readonly target: HTMLElement) {
    addEventListener('keydown', this.onKeyDown)
    addEventListener('keyup', this.onKeyUp)
    document.addEventListener('pointerlockchange', this.onPointerLockChange)
    // Pointer events carry the device's individual reports (getCoalescedEvents) with their own times.
    addEventListener('pointermove', this.onPointerMove)
    addEventListener('mousedown', this.onMouseDown)
    addEventListener('mouseup', this.onMouseUp)
    // Right mouse is the dash; without this the browser context menu eats it.
    target.addEventListener('contextmenu', (e) => e.preventDefault())
    // Dropping focus while keys are held otherwise leaves the player running forever.
    // visibilitychange covers the cases blur misses — switching desktops, locking
    // the screen — where a key is released while the page is not listening at all.
    const release = (): void => {
      this.keys.clear()
      this.mouseButtons.clear()
      this.edges.clear()
    }
    addEventListener('blur', release)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) release()
    })
  }

  /** A script is playing: the game behaves as if the mouse were captured, though the browser has not captured it. */
  scripted = false

  get isLocked(): boolean {
    return this.locked || this.scripted
  }

  /** Press or release a key as the keyboard would, edge and all. For the play benchmark's bot. */
  scriptKey(code: string, down: boolean): void {
    if (down) {
      if (!this.keys.has(code)) this.edges.add(code)
      this.keys.add(code)
    } else {
      this.keys.delete(code)
    }
  }

  /** Press or release a mouse button as the mouse would. */
  scriptButton(button: number, down: boolean): void {
    if (down) {
      if (!this.mouseButtons.has(button)) this.edges.add(`Mouse${button}`)
      this.mouseButtons.add(button)
    } else {
      this.mouseButtons.delete(button)
    }
  }

  /** Move the mouse by `dx`, `dy` counts, as a report arriving now. */
  scriptMouse(dx: number, dy: number): void {
    this.motion.push(performance.now(), dx, dy)
  }

  /** Let go of everything a script was holding. */
  scriptRelease(): void {
    this.keys.clear()
    this.mouseButtons.clear()
    this.edges.clear()
    this.motion.length = 0
    this.scripted = false
  }

  requestLock(): void {
    // Chrome rejects this outside a user gesture and in a non-secure context. Both
    // are surfaced to the player in main.ts rather than failing mute.
    //
    // Newer Chrome returns a promise and rejects rather than throwing — notably when
    // the lock was released less than about a second ago, which is exactly what a
    // quick trip in and out of build mode looks like. An unhandled rejection there
    // would show up in the console as an error for something that is not one: the
    // click-to-play overlay is still on screen, so the player can always take the
    // lock by hand.
    //
    // Raw input where the browser has it (`unadjustedMovement`): the device's own counts, no OS acceleration, and no
    // hidden cursor. Without it Chrome keeps a hidden cursor and warps it back to the middle as it nears an edge, and
    // on Windows that warp sometimes leaks into one report as a huge false movement — the view jerks as if flicked,
    // most often turning steadily one way. Where raw input is refused (not supported), the plain lock is taken.
    if (this.rawRefused) {
      const plain = this.target.requestPointerLock() as unknown
      if (plain instanceof Promise) plain.catch(() => {})
      return
    }
    let raw: unknown
    try {
      raw = (this.target.requestPointerLock as (o?: { unadjustedMovement: boolean }) => unknown).call(this.target, { unadjustedMovement: true })
    } catch {
      raw = undefined
    }
    if (raw instanceof Promise) {
      raw.catch((err: unknown) => {
        if ((err as { name?: string })?.name !== 'NotSupportedError') return
        this.rawRefused = true
        const plain = this.target.requestPointerLock() as unknown
        if (plain instanceof Promise) plain.catch(() => {})
      })
    }
  }

  /** The browser refused raw input once: every later lock is the plain one. */
  private rawRefused = false
  /** The sizes of the last few reports, for telling a warp spike from real movement (`onPointerMove`). */
  private readonly recent: { t: number; size: number }[] = []

  isDown(code: string): boolean {
    return this.keys.has(code)
  }

  mouseDown(button: number): boolean {
    return this.mouseButtons.has(button)
  }

  /** True if this key/button went down during the step being simulated. */
  justPressed(code: string): boolean {
    return this.edges.has(code)
  }

  /** The mouse travel this frame should apply. Call once per frame. */
  consumeMouse(out: { x: number; y: number }, now = performance.now()): void {
    // A report every 4 ms or less is fine-grained already; anything coarser is resampled one interval behind.
    const lag = this.reportMs <= 4 ? 0 : Math.min(this.reportMs, 12)
    const until = now - lag
    const m = this.motion
    let x = 0
    let y = 0
    let used = 0
    while (used < m.length) {
      const t = m[used]!
      if (t <= until || t < now - 100) {
        x += m[used + 1]!
        y += m[used + 2]!
        this.motionUntil = Math.max(this.motionUntil, t)
        used += 3
        continue
      }
      // This report falls across the frame: hand out the share of it that lies before `until`.
      const from = Math.max(this.motionUntil, t - this.reportMs)
      const share = until > from ? (until - from) / (t - from) : 0
      if (share > 0) {
        const dx = m[used + 1]! * share
        const dy = m[used + 2]! * share
        x += dx
        y += dy
        m[used + 1] = m[used + 1]! - dx
        m[used + 2] = m[used + 2]! - dy
        this.motionUntil = until
      }
      break
    }
    if (used > 0) m.splice(0, used)
    out.x = x
    out.y = y
  }

  /** Drop any travel not yet applied. */
  clearMouse(): void {
    this.motion.length = 0
  }

  /** Call at the end of every simulation step, after all justPressed() reads. */
  endStep(): void {
    this.edges.clear()
  }

  // --- diagnostics ---------------------------------------------------------
  // These separate three very different failures that all look like "jump is
  // broken": the event never arrives (OS or hardware), it arrives but the edge is
  // suppressed (a key stuck down in our own state), or it arrives and fires but the
  // controller ignores it.
  /** Every keydown the browser delivers, repeats included. */
  rawKeyDowns = 0
  /** Every Space keydown, BEFORE the auto-repeat guard. */
  spaceDownRaw = 0
  /** Space keyups. If this trails spaceDownRaw, a release was missed. */
  spaceUpRaw = 0
  /** Space edges that actually reached the game. */
  spacePresses = 0
  /** Last key the browser delivered, with its modifier flags. */
  lastKeyLabel = '—'

  private onKeyDown = (e: KeyboardEvent): void => {
    this.rawKeyDowns++
    this.lastKeyLabel =
      `${e.code}${e.shiftKey ? '+S' : ''}${e.ctrlKey ? '+C' : ''}` +
      `${e.altKey ? '+A' : ''}${e.repeat ? ' rep' : ''}`
    if (e.code === 'Space') this.spaceDownRaw++

    this.reconcileModifiers(e)

    // Browser auto-repeat would re-fire the edge while a key is merely held.
    if (!this.keys.has(e.code)) {
      this.edges.add(e.code)
      if (e.code === 'Space') this.spacePresses++
    }
    this.keys.add(e.code)
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'F3'].includes(e.code)) {
      e.preventDefault()
    }
  }

  private onKeyUp = (e: KeyboardEvent): void => {
    if (e.code === 'Space') this.spaceUpRaw++
    this.reconcileModifiers(e)
    this.keys.delete(e.code)
  }

  /**
   * Trust the event's modifier flags over our own bookkeeping.
   *
   * A modifier keyup is easy to miss — released while another window has focus, or
   * across a pointer-lock transition — and a stuck modifier is invisible and
   * permanent: the player sprints forever, and the stuck key's edge never fires
   * again because the auto-repeat guard sees it as already down. Every event carries
   * the true state, so reconciling costs nothing and closes the hole.
   */
  private reconcileModifiers(e: KeyboardEvent): void {
    if (!e.shiftKey) {
      this.keys.delete('ShiftLeft')
      this.keys.delete('ShiftRight')
    }
    if (!e.ctrlKey) {
      this.keys.delete('ControlLeft')
      this.keys.delete('ControlRight')
    }
    if (!e.altKey) {
      this.keys.delete('AltLeft')
      this.keys.delete('AltRight')
    }
  }

  private onMouseDown = (e: MouseEvent): void => {
    if (!this.locked) return
    if (!this.mouseButtons.has(e.button)) this.edges.add(`Mouse${e.button}`)
    this.mouseButtons.add(e.button)
  }

  private onMouseUp = (e: MouseEvent): void => {
    this.mouseButtons.delete(e.button)
  }

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.locked) return
    const reports = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : []
    for (const r of reports.length > 0 ? reports : [e]) {
      if (r.movementX === 0 && r.movementY === 0) continue
      if (this.isSpike(r.timeStamp, Math.hypot(r.movementX, r.movementY))) continue
      const t = r.timeStamp
      const gap = t - this.lastReport
      if (this.lastReport > 0 && gap > 0 && gap < 50) this.reportMs = this.reportMs * 0.9 + gap * 0.1
      this.lastReport = t
      this.motion.push(t, r.movementX, r.movementY)
    }
  }

  /**
   * A warp spike (see `requestLock`): in the middle of continuous movement, one report far bigger than SPIKE_MIN and
   * SPIKE_RATIO times the ones just before it. A real flick builds over several reports and is never one of these; a
   * report after the mouse was still is always believed.
   */
  private isSpike(t: number, size: number): boolean {
    const r = this.recent
    while (r.length > 0 && t - r[0]!.t > SPIKE_WINDOW_MS) r.shift()
    let spike = false
    if (size > SPIKE_MIN && r.length >= 3) {
      let biggest = 0
      for (const p of r) biggest = Math.max(biggest, p.size)
      spike = size > biggest * SPIKE_RATIO
    }
    if (!spike) {
      r.push({ t, size })
      if (r.length > 6) r.shift()
    }
    return spike
  }

  private onPointerLockChange = (): void => {
    this.locked = document.pointerLockElement === this.target
    if (!this.locked) {
      this.keys.clear()
      this.mouseButtons.clear()
      this.edges.clear()
      this.motion.length = 0
      this.recent.length = 0
    }
    this.onLockChange?.(this.locked)
  }
}
