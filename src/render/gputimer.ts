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

interface Pending {
  queries: { pass: GpuPass; q: WebGLQuery }[]
}

export class GpuTimer {
  /** Smoothed GPU milliseconds per frame, or null if it cannot be measured here. */
  ms: number | null = null
  /** Smoothed milliseconds per pass. */
  readonly passMs: Record<GpuPass, number | null> = { world: null, hands: null, fx: null, post: null }
  private readonly ext: { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number } | null
  private readonly pending: Pending[] = []
  private frame: Pending | null = null
  private open: WebGLQuery | null = null

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') as GpuTimer['ext']
  }

  /** Start timing a frame. Skipped while too many earlier frames are still waiting for their results. */
  begin(): void {
    if (!this.ext || this.frame || this.pending.length > 3) return
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
    this.frame.queries.push({ pass, q })
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
      for (const { pass, q } of f.queries) {
        sums[pass] += (gl.getQueryParameter(q, gl.QUERY_RESULT) as number) / 1e6
        gl.deleteQuery(q)
      }
      if (disjoint) continue
      let total = 0
      for (const p of PASSES) {
        total += sums[p]
        const prev = this.passMs[p]
        this.passMs[p] = prev === null ? sums[p] : prev * 0.9 + sums[p] * 0.1
      }
      this.ms = this.ms === null ? total : this.ms * 0.9 + total * 0.1
    }
  }
}
