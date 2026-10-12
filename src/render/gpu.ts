/**
 * Which graphics card frame generation runs on, and whether it is a dedicated one.
 *
 * A page cannot choose an adapter by name. It can ask for the fast one (`powerPreference: 'high-performance'`,
 * which the game's renderer already does) and read back which one the browser gave it. So the card is picked by
 * asking for the high-performance adapter and reading its name, and that name decides whether it is dedicated.
 */

/** The adapter's name without the driver wrapping ("ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x...) Direct3D11 ...)"). */
export function shortGpu(raw: string): string {
  const m = /^ANGLE \([^,]*, (.*?)(?: \(0x[0-9a-f]+\))?(?: Direct3D.*| vs_.*| OpenGL.*)?\)$/i.exec(raw)
  return (m?.[1] ?? raw).replace(/\(R\)|\(TM\)/g, '').replace(/\s+/g, ' ').replace(/,\s*$/, '').trim()
}

/** Dedicated cards by the names drivers report. Integrated Radeon ("Radeon(TM) Graphics", "Vega 8 Graphics") and Intel Arc iGPUs ("Arc(TM) Graphics") do not match. */
const DEDICATED = /nvidia|geforce|quadro|tesla|\brtx\b|\bgtx\b|radeon\s*(\(tm\)\s*)?(rx|pro|r9|r7|vii)|firepro|\barc(\(tm\))?\s*a\d{3}|\barc(\(tm\))?\s*b\d{3}/i
const SOFTWARE = /swiftshader|llvmpipe|software|basic render/i
/** APU graphics that borrow a dedicated card's branding: "RX Vega 11 Graphics", "Radeon 780M". */
const INTEGRATED = /vega\s*\d+\s*graphics|radeon\s*\d{3}m\b/i

export function isDedicatedGpu(name: string): boolean {
  return !SOFTWARE.test(name) && !INTEGRATED.test(name) && DEDICATED.test(name)
}

/** The adapter a high-performance context gets, read from a throwaway canvas; null where the browser hides it. */
function highPerformanceName(): string | null {
  try {
    const gl = document.createElement('canvas').getContext('webgl2', { powerPreference: 'high-performance' })
    if (!gl) return null
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const name = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : null
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return name
  } catch {
    return null
  }
}

export interface GpuPick {
  /** The card frame generation will run on, short name. */
  name: string
  dedicated: boolean
  /** A dedicated card the browser could have used but is not drawing on, if one was found. */
  unused: string | null
}

/** Pick the card for frame generation, given the one the game is drawing on now. */
export function pickFrameGenGpu(inUse: string): GpuPick {
  const fast = highPerformanceName()
  const dedicated = isDedicatedGpu(inUse)
  const unused = !dedicated && fast && isDedicatedGpu(fast) ? shortGpu(fast) : null
  return { name: shortGpu(inUse), dedicated, unused }
}
