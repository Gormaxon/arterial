/**
 * How long the graphics chip spends on a frame, measured on the chip itself (EXT_disjoint_timer_query_webgl2),
 * in total and pass by pass.
 *
 * Shown beside the frame rate so a slow frame can be told apart: a GPU time near the frame time means the
 * graphics chip is the limit; a GPU time well under it means the processor is. The passes (the world, the hands,
 * the effects, the final screen pass) say where on the chip the time goes. Where the browser does not offer the
 * timer, everything stays null.
 */

/** The parts of a frame that are timed, in the order they are drawn. */
export type GpuPass = 'world' | 'hands' | 'fx' | 'post'
const PASSES: readonly GpuPass[] = ['world', 'hands', 'fx', 'post']
/** The ray traced mode's stretches of the world pass (render/rt/stage.ts). */
export type RtPassName = 'rtg' | 'rtdirect' | 'rtrefl' | 'rtgi' | 'rtdenoise' | 'rtcomp' | 'rtfx' | 'rtvis' | 'rtlook' | 'rtlit' | 'rtresolve' | 'rtbloom' | 'rthaze' | 'rtatmos' | 'rtout' | 'bkz' | 'bkroom' | 'bkprops' | 'bkresolve' | 'bkglow' | 'bkpresent'

interface Pending {
  queries: { pass: GpuPass; rt: RtPassName | null; q: WebGLQuery }[]
}

export class GpuTimer {
  /** Smoothed GPU milliseconds per frame, or null if it cannot be measured here. */
  ms: number | null = null
  /** Smoothed milliseconds per pass. */
  readonly passMs: Record<GpuPass, number | null> = { world: null, hands: null, fx: null, post: null }
  /** The last frame's own reading, unsmoothed, and a count that goes up with each one (the play benchmark's log). */
  readonly lastPassMs: Record<GpuPass, number> = { world: 0, hands: 0, fx: 0, post: 0 }
  /** Smoothed milliseconds per stretch of the ray traced frame; they count towards `world` as well. Empty out of that mode. */
  readonly rtPassMs: Partial<Record<RtPassName, number>> = {}
  /** One frame timed in this many. */
  sampleEvery = 16
  lastMs = 0
  readings = 0
  private readonly ext: { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number } | null
  private readonly pending: Pending[] = []
  private frame: Pending | null = null
  private open: WebGLQuery | null = null
  private tick = 0

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') as GpuTimer['ext']
  }

  /** Start timing a frame. Skipped while too many earlier frames are still waiting for their results. */
  begin(): void {
    if (!this.ext || this.frame || this.pending.length > 3) return
    // One frame in sixteen: the queries are calls to the graphics process (four a frame, made and read back, and a
    // synchronous one when a frame's results come in — most of a millisecond each on the Chromebook), and the figure is
    // a smoothed average either way: four readings a second are plenty for it.
    if (++this.tick % this.sampleEvery !== 0) return
    this.frame = { queries: [] }
  }

  /** Everything drawn from here until the next `pass` (or the end of the frame) counts towards `pass`. */
  pass(pass: GpuPass): void {
    if (!this.ext || !this.frame) return
    this.close()
    const q = this.gl.createQuery()
    if (!q) return
    this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, q)
    this.open = q
    this.frame.queries.push({ pass, rt: null, q })
  }

  /** As `pass`, for a stretch of the ray traced frame: everything drawn from here on is that stretch of the world pass. */
  rtPass(name: RtPassName, parent: GpuPass = 'world'): void {
    if (!this.ext || !this.frame) return
    this.close()
    const q = this.gl.createQuery()
    if (!q) return
    this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, q)
    this.open = q
    this.frame.queries.push({ pass: parent, rt: name, q })
  }

  private close(): void {
    if (this.open && this.ext) {
      this.gl.endQuery(this.ext.TIME_ELAPSED_EXT)
      this.open = null
    }
  }

  end(): void {
    if (!this.ext) return
    this.close()
    if (this.frame) {
      if (this.frame.queries.length > 0) this.pending.push(this.frame)
      this.frame = null
    }
    // Results arrive a frame or two later; take whatever frames have all of theirs.
    const gl = this.gl
    while (this.pending.length > 0) {
      const f = this.pending[0]!
      if (!f.queries.every(({ q }) => gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE))) break
      this.pending.shift()
      // A disjoint period (the GPU was reset or switched clocks) makes the results meaningless.
      const disjoint = gl.getParameter(this.ext.GPU_DISJOINT_EXT) as boolean
      const sums: Record<GpuPass, number> = { world: 0, hands: 0, fx: 0, post: 0 }
      let rtSums: Partial<Record<RtPassName, number>> | null = null
      for (const { pass, rt, q } of f.queries) {
        const ms = (gl.getQueryParameter(q, gl.QUERY_RESULT) as number) / 1e6
        sums[pass] += ms
        if (rt) (rtSums ??= {})[rt] = (rtSums[rt] ?? 0) + ms
        gl.deleteQuery(q)
      }
      if (disjoint) continue
      if (rtSums) {
        for (const name of Object.keys(rtSums) as RtPassName[]) {
          const prev = this.rtPassMs[name]
          const ms = rtSums[name]!
          this.rtPassMs[name] = prev === undefined ? ms : prev * 0.9 + ms * 0.1
        }
      }
      let total = 0
      for (const p of PASSES) {
        total += sums[p]
        const prev = this.passMs[p]
        this.passMs[p] = prev === null ? sums[p] : prev * 0.9 + sums[p] * 0.1
      }
      this.ms = this.ms === null ? total : this.ms * 0.9 + total * 0.1
      for (const p of PASSES) this.lastPassMs[p] = sums[p]
      this.lastMs = total
      this.readings++
    }
  }
}
