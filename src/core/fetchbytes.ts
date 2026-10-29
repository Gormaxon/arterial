/**
 * Downloads that cannot hang the loading screen.
 *
 * The school's link drops and stalls. A plain `fetch` has no timeout at all: a connection
 * that stops sending mid-file leaves `reader.read()` waiting for good, and the boot was
 * awaiting it — the bar stopped where it was and never moved again. Here a download that
 * has received nothing for `stallMs` (the first byte included) is aborted and asked for
 * again, a few times, a little later each time; only then does it fail, and the caller's
 * own fallback takes over (a built-in model, generated textures).
 *
 * A slow download that keeps arriving is never cut off: the clock is reset by every chunk.
 */

export interface FetchOpts {
  /** Bytes in so far, and the file's size (0 if the server did not say). Starts again from 0 on a retry. */
  onProgress?: (loaded: number, total: number) => void
  /** Nothing received for this long, and the attempt is given up. */
  stallMs?: number
  /** Attempts in all. */
  tries?: number
  init?: RequestInit
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))

/** One attempt, aborted if it goes quiet. Resolves to the body's bytes and its content type. */
async function attempt(url: string, o: FetchOpts, stallMs: number): Promise<{ bytes: Uint8Array; type: string | null }> {
  const ctl = typeof AbortController === 'function' ? new AbortController() : null
  let timer: ReturnType<typeof setTimeout> | undefined
  let stalled = false
  const arm = (): void => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      stalled = true
      ctl?.abort()
    }, stallMs)
  }
  arm()
  try {
    const r = await fetch(url, { ...o.init, signal: ctl?.signal })
    if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`)
    const total = Number(r.headers.get('content-length')) || 0
    const type = r.headers.get('content-type')
    if (!r.body) {
      arm()
      return { bytes: new Uint8Array(await r.arrayBuffer()), type }
    }
    const reader = r.body.getReader()
    const chunks: Uint8Array[] = []
    let loaded = 0
    for (;;) {
      arm()
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      loaded += value.length
      o.onProgress?.(loaded, total)
    }
    if (chunks.length === 1) return { bytes: chunks[0]!, type }
    const out = new Uint8Array(loaded)
    let at = 0
    for (const c of chunks) {
      out.set(c, at)
      at += c.length
    }
    return { bytes: out, type }
  } catch (err) {
    throw stalled ? new Error(`${url}: nothing received for ${Math.round(stallMs / 1000)} s`) : err
  } finally {
    clearTimeout(timer)
  }
}

/** The file's bytes, retried through stalls and dropped connections. Rejects only once every attempt has failed. */
export async function fetchBytes(url: string, o: FetchOpts = {}): Promise<{ bytes: Uint8Array; type: string | null }> {
  const tries = Math.max(1, o.tries ?? 3)
  const stallMs = o.stallMs ?? 15000
  let last: unknown
  for (let i = 0; i < tries; i++) {
    try {
      return await attempt(url, o, stallMs)
    } catch (err) {
      last = err
      // A file the server says is not there will not appear on a second asking.
      if (err instanceof Error && / HTTP 4\d\d$/.test(err.message)) break
      if (i + 1 < tries) {
        console.warn(`download failed, asking again: ${url}`, err)
        await sleep(600 * (i + 1))
      }
    }
  }
  throw last
}

/** As `fetchBytes`, as an ArrayBuffer of exactly the file (what GLTFLoader.parseAsync takes). */
export async function fetchArrayBuffer(url: string, o?: FetchOpts): Promise<ArrayBuffer> {
  const { bytes } = await fetchBytes(url, o)
  return bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength ? (bytes.buffer as ArrayBuffer) : (bytes.slice().buffer as ArrayBuffer)
}
