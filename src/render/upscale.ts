/**
 * Render low, present sharp — and put the suit's camera between you and the world.
 *
 * The dynamic resolution (resolution.ts) lowers the render resolution on a GPU that
 * cannot keep up, and on a Chromebook that is most of the time. That used to lower the
 * CANVAS: the browser then stretched a small image over a dense panel with plain
 * bilinear filtering, and the whole game looked soft and grainy — texture detail
 * smeared, edges stair-stepped a second time by the stretch.
 *
 * Now the frame is drawn into an offscreen buffer at the dynamic resolution (with its
 * own MSAA), and one cheap full-screen pass puts it on a canvas that always runs at the
 * panel's density. That pass is a contrast-adaptive sharpen (after AMD's CAS): it
 * restores edge and texture contrast the upscale softened, and backs off on edges that
 * are already hard, so it does not ring or crawl. The canvas itself has no MSAA — the
 * only thing ever drawn to it is this one quad.
 *
 * The same pass is the visor. You are looking through a camera in a suit, so the image
 * carries what a camera does: a little sensor grain, colour fringing that grows toward
 * the edges and is zero at the crosshair, a faint scan structure with a slow rolling
 * band, a cool cast, a touch more contrast and the corners dropping away. It all folds
 * into the pass that was already running, so it costs a few more texture taps and no
 * extra pass. A burst of static (`pulse`) plays when the optics come online.
 *
 * Colour is untouched apart from that. The buffer is flagged the way three flags an XR
 * framebuffer, so every material writes exactly the sRGB values it would have written to
 * the screen, into a plain RGBA8 buffer, and blending happens in the same space it
 * always did. The present pass copies those values straight through.
 */

import * as THREE from 'three'
import { EASU_FRAG, EASU_VERT, RCAS_STOPS, easuCon0 } from './fsr1'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`

const FRAG = /* glsl */ `
uniform sampler2D tFrame;
uniform vec2 texel;
uniform float sharpness;
uniform float uTime;
uniform float uPulse;
uniform float uStrength;
uniform float uAspect;
uniform float uRcas;
uniform float uConcuss;
uniform float uShock;
uniform vec2 uShockAt;
uniform float uSlow;
uniform float uGore;
uniform vec2 uAlarm;
// An overlay on the glass, drawn over everything here (Upscaler.overlay): what a game lays over the view — in SANGUINE the
// slam's (ui/slamfx.ts). A: the edges darkened, the streaks' strength, the two streak layers' phase. B: a ring's scale and
// strength, a flash's strength.
uniform vec4 uOverA;
uniform vec4 uOverB;
// The suit's moves on the glass (Upscaler.motion; ui/motionfx.ts). A: the speed streaks' strength, a dash's smear across
// and up the view, the streaks' phase. B: a landing's knock, a wall jump's flash (its sign the side), a slide's heat.
uniform vec4 uMoveA;
uniform vec4 uMoveB;
// The crosshair and the visor's compass tape, drawn here rather than as page elements over the canvas (Upscaler.hud).
uniform vec2 uRes;
uniform float uCss;
uniform vec4 uCh;
uniform float uVisorA;
uniform sampler2D tTape;
uniform vec4 uTape;
uniform vec3 uTapeTex;
#ifdef GLASS_GLITCH
// The suit's camera disrupted (Upscaler.glitch): x a burst's strength, y its seed, z the rows it tears the picture into.
uniform vec4 uGlitch;
#endif
varying vec2 vUv;

float sdBox(vec2 p, vec2 c, vec2 b) {
  vec2 q = abs(p - c) - b;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
}

// Hash without sin(): stable across GPUs, and cheap.
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  // --- a blast close by (see Upscaler.concuss) ---------------------------------------
  // The shock front: a ring of bent light racing out across the view from where it went off. Then the concussion: the
  // view swimming, doubled and smeared, settling over seconds.
  vec2 uv = vUv;
#ifdef GLASS_GLITCH
  // --- the suit's camera disrupted (see Upscaler.glitch) ---------------------------------------
  // Rows of the picture torn sideways, and blocks of it stuck, all dealt again from the seed many times a second.
  // Compiled only into the glitch's variant of this pass (Upscaler.glitchMaterial), drawn only on a burst's frames.
  float tear = 0.0;
  if (uGlitch.x > 0.0) {
    // The torn rows: some of the rows, each shifted its own way.
    float row = floor(vUv.y * uGlitch.z);
    tear = step(1.0 - 0.38 * uGlitch.x, hash(vec2(row, uGlitch.y)));
    uv.x += tear * (hash(vec2(row + 17.0, uGlitch.y)) - 0.5) * 0.09 * uGlitch.x;
    // The stuck blocks: in runs of four along a line, as a broken stream leaves them, each smeared down from the one line
    // of pixels through its middle.
    vec2 cells = vec2(uGlitch.z * uAspect, uGlitch.z) * 0.6;
    vec2 cell = floor(vUv * cells);
    if (hash(vec2(floor(cell.x * 0.25), cell.y) + uGlitch.y * 3.1) > 1.0 - 0.14 * uGlitch.x) uv.y = (cell.y + 0.5) / cells.y;
  }
#endif
  if (uConcuss > 0.0) {
    vec2 fromBlast = (vUv - uShockAt) * vec2(uAspect, 1.0);
    float rd = length(fromBlast);
    float front = uShock * 2.2;
    float ring = exp(-pow((rd - front) * 9.0, 2.0)) * (1.0 - smoothstep(0.0, 0.9, uShock));
    uv -= normalize(fromBlast + 1e-5) / vec2(uAspect, 1.0) * ring * 0.035 * uConcuss;
    float sway = uConcuss * uConcuss;
    uv += vec2(sin(vUv.y * 7.0 + uTime * 2.6), cos(vUv.x * 6.0 + uTime * 2.1)) * 0.01 * sway;
  }
#ifdef SLAM_GLASS
  // A hard landing knocks the picture down a touch; a slide's heat shimmers along the bottom of the view.
  uv.y += uMoveB.x * 0.014;
  if (uMoveB.z > 0.0) {
    float low = smoothstep(0.1, 0.5, 0.5 - vUv.y) * uMoveB.z;
    uv.x += sin(vUv.y * 90.0 + uTime * 38.0) * 0.0022 * low;
  }
#endif
  // A cross of five taps one SOURCE texel apart.
  vec3 c = texture2D(tFrame, uv).rgb;
  vec3 n = texture2D(tFrame, uv + vec2(0.0, texel.y)).rgb;
  vec3 s = texture2D(tFrame, uv - vec2(0.0, texel.y)).rgb;
  vec3 e = texture2D(tFrame, uv + vec2(texel.x, 0.0)).rgb;
  vec3 w = texture2D(tFrame, uv - vec2(texel.x, 0.0)).rgb;
#ifdef FSR_RCAS
  // AMD FSR 1 RCAS (FsrRcasF, ffx_fsr1.h, MIT): the sharpening FSR follows its upscale with. The lobe is the
  // largest negative weight that cannot push any channel past black or white, capped at FSR_RCAS_LIMIT.
  vec3 mn4 = min(min(n, s), min(e, w));
  vec3 mx4 = max(max(n, s), max(e, w));
  vec3 hitMin = min(mn4, c) / max(4.0 * mx4, vec3(1e-5));
  vec3 hitMax = (1.0 - max(mx4, c)) / min(4.0 * mn4 - 4.0, vec3(-1e-5));
  vec3 lobeRGB = max(-hitMin, hitMax);
  float lobe = max(-(0.25 - 1.0 / 16.0), min(max(lobeRGB.r, max(lobeRGB.g, lobeRGB.b)), 0.0)) * uRcas;
  vec3 outc = (lobe * (n + s + e + w) + c) / (4.0 * lobe + 1.0);
#else
  vec3 mn = min(c, min(min(n, s), min(e, w)));
  vec3 mx = max(c, max(max(n, s), max(e, w)));
  // CAS: the headroom left in the local range decides how hard to sharpen, so flat
  // areas and soft detail get it and edges already at full contrast do not.
  vec3 amp = sqrt(clamp(min(mn, 1.0 - mx) / max(mx, 1e-4), 0.0, 1.0));
  vec3 wgt = -amp * mix(0.125, 0.2, sharpness);
  vec3 outc = (c + (n + s + e + w) * wgt) / (1.0 + 4.0 * wgt);
#endif

  // --- the camera ---------------------------------------------------------------
  vec2 d = vUv - 0.5;
  vec2 da = d * vec2(uAspect, 1.0);
  float r2 = dot(da, da); // 0 at the centre, about 0.4 in the corners of a 16:9 frame

  // Colour fringing: red pushed out, blue pulled in, growing with the square of the
  // distance from the middle, so the crosshair sits on a clean image. The sharpening
  // delta rides along on each shifted channel, so the detail is not lost to the shift.
  vec2 shift = d * (0.0055 * r2 + 0.012 * uPulse + 0.03 * uConcuss + 0.022 * r2 * uSlow) * uStrength;
  vec3 detail = outc - c;
  float rr = texture2D(tFrame, uv + shift).r;
  float bb = texture2D(tFrame, uv - shift).b;
  outc = vec3(rr + detail.r, outc.g, bb + detail.b);
#ifdef GLASS_GLITCH
  if (tear > 0.0) {
    // A torn row's colours pulled apart, red one way and blue the other, and the row a touch brighter.
    vec2 apart = vec2(0.012 * uGlitch.x, 0.0);
    outc.r += texture2D(tFrame, uv + apart).r - c.r;
    outc.b += texture2D(tFrame, uv - apart).b - c.b;
    outc *= 1.04;
  }
#endif
  if (uConcuss > 0.0) {
    // Seeing double, the second image drifting off and back; and smeared, as if the eyes will not focus.
    float k = uConcuss;
    vec2 ghost = vec2(sin(uTime * 1.7), cos(uTime * 1.3)) * 0.024 * k;
    vec3 doubled = texture2D(tFrame, uv + ghost).rgb;
    vec2 br = texel * (2.0 + 14.0 * k);
    vec3 smear = (texture2D(tFrame, uv + vec2(br.x, br.y)).rgb + texture2D(tFrame, uv - vec2(br.x, br.y)).rgb
      + texture2D(tFrame, uv + vec2(br.x, -br.y)).rgb + texture2D(tFrame, uv - vec2(br.x, -br.y)).rgb) * 0.25;
    outc = mix(outc, smear, min(1.0, 0.85 * k));
    outc = mix(outc, doubled, 0.4 * k);
    // The colour knocked out of it, and the edges closing in.
    outc = mix(outc, vec3(dot(outc, vec3(0.299, 0.587, 0.114))), 0.45 * k);
    outc *= 1.0 - 0.5 * smoothstep(0.05, 0.4, r2) * k;
  }
  if (uSlow > 0.0) {
    // Time slowed (see Upscaler.slowTime). Fine uneven streaks drawn in toward the middle from the edges, as if the
    // light were being dragged along behind the view; the middle, where the shot is lined up, left sharp.
    float k = uSlow;
    float edge = smoothstep(0.02, 0.38, r2) * k;
    float ang = atan(da.y, da.x);
    float rays = 0.55 + 0.45 * sin(ang * 29.0 + sin(ang * 11.0 + uTime * 0.35) * 2.4);
    vec2 pull = d * 0.065 * edge * rays;
    vec3 streak = (texture2D(tFrame, uv - pull * 0.33).rgb + texture2D(tFrame, uv - pull * 0.66).rgb + texture2D(tFrame, uv - pull).rgb) * (1.0 / 3.0);
    outc = mix(outc, streak, 0.7 * edge);
    // The colour drained toward a cold steel blue — except what burns bright and coloured (a tracer, a muzzle flash, a
    // blast), which keeps its colour and stands out of the grey: the things worth timing a shot by.
    float l = dot(outc, vec3(0.299, 0.587, 0.114));
    float hi = max(outc.r, max(outc.g, outc.b));
    float keep = smoothstep(0.5, 0.9, hi) * smoothstep(0.12, 0.4, hi - min(outc.r, min(outc.g, outc.b)));
    vec3 cold = l * vec3(0.8, 0.93, 1.1) + vec3(0.0, 0.008, 0.03);
    outc = mix(outc, cold, 0.78 * k * (1.0 - keep));
    // A touch more contrast so the grey still reads crisp, and the edges closing in toward a deep blue-black.
    outc = mix(outc, (outc - 0.45) * 1.08 + 0.45, k);
    float rim = smoothstep(0.06, 0.42, r2) * k;
    outc = outc * (1.0 - 0.34 * rim) + vec3(0.0, 0.006, 0.022) * rim;
  }

#ifdef SLAM_GLASS
  // --- the suit's moves (Upscaler.motion; ui/motionfx.ts) ----------------------------------------------------
  if (uMoveA.x > 0.0) {
    // Speed: the edges dragged out into streaks round the middle, uneven, with thin bright lines in them; the middle,
    // where you aim, left sharp.
    float k = uMoveA.x;
    float edge = smoothstep(0.03, 0.42, r2) * k;
    float ang = atan(da.y, da.x);
    float lines = 0.5 + 0.5 * sin(ang * 41.0 + sin(ang * 7.0 + uMoveA.w) * 3.0 + uMoveA.w * 2.0);
    lines *= lines;
    vec2 pull = d * 0.11 * edge * (0.3 + 0.7 * lines);
    vec3 streak = (texture2D(tFrame, uv - pull * 0.5).rgb + texture2D(tFrame, uv - pull).rgb) * 0.5;
    outc = mix(outc, streak, 0.8 * edge);
    outc += vec3(0.8, 0.92, 1.0) * pow(lines, 8.0) * edge * 0.1;
  }
  if (uMoveA.y != 0.0 || uMoveA.z != 0.0) {
    // A dash: the picture smeared along it, red and blue pulled apart either way, more toward the edges.
    vec2 sm = uMoveA.yz * (0.012 + 0.03 * r2);
    vec3 ahead = texture2D(tFrame, uv + sm).rgb;
    vec3 behind = texture2D(tFrame, uv - sm).rgb;
    float k = min(1.0, length(uMoveA.yz));
    outc = mix(outc, vec3(behind.r, (ahead.g + behind.g + outc.g) / 3.0, ahead.b), 0.75 * k);
  }
  // The landing's knock: the edges dark for a moment.
  if (uMoveB.x > 0.0) outc *= 1.0 - 0.4 * smoothstep(0.04, 0.4, r2) * uMoveB.x;
  if (uMoveB.y != 0.0) {
    // A wall jump: a cold flash on the side you kicked off, its red fringed off toward that edge.
    float sgn = sign(uMoveB.y);
    float side = smoothstep(0.12, 0.5, d.x * sgn) * abs(uMoveB.y);
    outc.r = mix(outc.r, texture2D(tFrame, uv + vec2(0.008 * sgn, 0.0)).r, side);
    outc += vec3(0.62, 0.82, 1.0) * side * 0.22;
  }
  if (uMoveB.z > 0.0) {
    // A slide: the bottom of the view warmed, as the boots scrape.
    float low = smoothstep(0.18, 0.5, 0.5 - vUv.y) * uMoveB.z;
    outc = mix(outc, outc * vec3(1.1, 0.97, 0.88), low);
  }
#endif

  float luma = dot(outc, vec3(0.299, 0.587, 0.114));
  // Sensor grain: heavier in the dark where a sensor is noisiest, redrawn every frame.
  float g = hash(gl_FragCoord.xy + vec2(fract(uTime * 7.31) * 173.0, fract(uTime * 3.17) * 129.0)) - 0.5;
  outc += g * (0.032 + 0.2 * uPulse) * (1.15 - luma) * uStrength;

  // Faint scan structure, and a slow soft band rolling down the frame.
  outc *= 1.0 - 0.035 * (0.5 + 0.5 * sin(gl_FragCoord.y * 2.094)) * uStrength;
  float band = fract(vUv.y + uTime * 0.045) - 0.5;
  outc *= 1.0 + 0.04 * exp(-band * band * 90.0) * uStrength;

  // Grade: a faint cool-green cast, a touch more contrast, corners falling away.
  outc = mix(outc, outc * vec3(0.965, 1.0, 0.985), uStrength);
  outc = mix(outc, (outc - 0.5) * 1.05 + 0.5, uStrength);
  outc *= 1.0 - 0.15 * smoothstep(0.1, 0.4, r2) * uStrength;
  // The optics coming online: a flash of brightness with the static.
  outc += uPulse * 0.09 * uStrength;

  // A kill (Upscaler.gore): the edges of the view flushed blood red for a moment, the middle left clear to aim by.
  if (uGore > 0.0) {
    float ring = smoothstep(0.03, 0.36, r2) * uGore;
    outc = mix(outc, outc * vec3(1.35, 0.42, 0.38) + vec3(0.11, 0.0, 0.0), ring);
  }

  // A level's alarm (Upscaler.alarm): every light gone red — the picture's colour drawn into red by its brightness — and
  // brighter each time a beacon's turn comes round (uAlarm.y, 0..1).
  if (uAlarm.x > 0.0) {
    float l = dot(outc, vec3(0.299, 0.587, 0.114));
    vec3 red = vec3(l * 1.3 + 0.025, l * 0.17, l * 0.14);
    outc = mix(outc, red, 0.74 * uAlarm.x) * (1.0 + 0.4 * uAlarm.y * uAlarm.x);
  }

  // --- the HUD's moving parts (Upscaler.hud), in CSS pixels from the top left ---------------------------------
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uCss;
  float aa = 0.75 / uCss;
  // The compass tape: its strip of ticks and labels (drawn once, Visor.tapeCanvas), slid to the heading, fading at
  // both ends as the page's mask did.
  if (uVisorA > 0.0 && px.x >= uTape.x && px.x < uTape.x + uTape.z && px.y >= uTape.y && px.y < uTape.y + uTape.w) {
    vec2 q = px - uTape.xy;
    float tx = (uTapeTex.z + q.x - uTape.z * 0.5) / uTapeTex.x;
    vec4 tc = texture2D(tTape, vec2(tx, 1.0 - q.y / uTapeTex.y));
    float u = q.x / uTape.z;
    float fade = clamp(min(u, 1.0 - u) / 0.2, 0.0, 1.0);
    outc = mix(outc, tc.rgb, tc.a * fade * uVisorA);
  }
  // The crosshair: four thin ticks (their gap uCh.x: the spread) round a small dot, all one pale green, each with a
  // crisp dark edge so it reads on a bright wall and a dark one alike. A hit (uCh.z) puts a small white X round them; a
  // blow a shield took (uCh.w), the same X in azure.
  if (uCh.y > 0.0) {
    vec2 p = px - uRes * 0.5 / uCss;
    float gap = uCh.x;
    float len = 7.0;
    float w = 0.85;
    float ticks = min(min(sdBox(p, vec2(0.0, -gap - len * 0.5), vec2(w, len * 0.5)), sdBox(p, vec2(0.0, gap + len * 0.5), vec2(w, len * 0.5))),
      min(sdBox(p, vec2(-gap - len * 0.5, 0.0), vec2(len * 0.5, w)), sdBox(p, vec2(gap + len * 0.5, 0.0), vec2(len * 0.5, w))));
    float dot = length(p) - 1.1;
    // The hit X: four short strokes on the diagonals, clear of the ticks.
    vec2 r = abs(p);
    vec2 d = vec2(r.x + r.y, r.x - r.y) * 0.70710678;
    float xr0 = gap * 0.6 + 6.0;
    float hit = uCh.z > 0.0 || uCh.w > 0.0 ? sdBox(d, vec2(xr0 + 3.0, 0.0), vec2(3.0, 0.75)) : 1e3;
    float shape = min(min(ticks, dot), hit);
    // The edge: a dark line a pixel wide round every piece, falling off quickly (no haze).
    float edge = 1.0 - smoothstep(0.0, 1.25, shape);
    outc = mix(outc, vec3(0.0), edge * 0.7 * uCh.y);
    vec3 col = vec3(0.86, 1.0, 0.9);
    outc = mix(outc, col, (1.0 - smoothstep(-aa, aa, min(ticks, dot))) * uCh.y);
    outc = mix(outc, uCh.z > 0.0 ? vec3(1.0) : vec3(0.42, 0.78, 1.0), (1.0 - smoothstep(-aa, aa, hit)) * max(uCh.z, uCh.w) * uCh.y);
  }

  // --- the overlay (Upscaler.overlay): over everything above, as a page layer over the canvas was ------------------
  // In CSS pixels from the top left, with the gradients the page drew it with (their stops, sizes and timings), blended in
  // the screen's own values as the page composited them. Drawn here, none of it is a page layer built, painted and torn
  // down each time (megapixels painted again on the Chromebook's graphics process, on every slam). Compiled only into the
  // glass variant of this pass (SLAM_GLASS: Upscaler.glassMaterial), drawn only on the frames it shows: in the one pass
  // every frame, even untaken behind its test, it cost the pass 8% (2.14 -> 2.32 ms on the stand-in, 2026-11-07).
#ifdef SLAM_GLASS
  if (uOverA.x + uOverA.y + uOverB.y + uOverB.z > 0.0) {
    vec2 vp = uRes / uCss;
    vec2 q = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uCss;
    // The edges: an ellipse at 50% 55% out to the farthest corner, clear to 46%, rgba(4,10,14,.7) at 100%.
    if (uOverA.x > 0.0) {
      vec2 c = vp * vec2(0.5, 0.55);
      float t = length((q - c) / (c * 1.41421356));
      outc = mix(outc, vec3(4.0, 10.0, 14.0) / 255.0, 0.7 * clamp((t - 0.46) / 0.54, 0.0, 1.0) * uOverA.x);
    }
    // The streaks: two layers of thin bright lines (every 99 px: 3 px at 41, 2 px at 97), cut into 70 px dashes every
    // 190 px that rush up the view, the second 23 px over and at 70%; seen only towards the edges (a mask clear to 34%,
    // full from 70%, of the ellipse at the middle out to the farthest corner).
    if (uOverA.y > 0.0) {
      vec2 c = vp * 0.5;
      float m = clamp((length((q - c) / (c * 1.41421356)) - 0.34) / 0.36, 0.0, 1.0) * uOverA.y;
      for (int k = 0; k < 2; k++) {
        float x0 = k == 0 ? q.x : q.x - 23.0;
        if (x0 < 0.0) continue;
        float x = mod(x0, 99.0);
        float a = x >= 41.0 && x < 44.0 ? 0.55 : (x >= 97.0 ? 0.38 : 0.0);
        float y = mod(q.y + 190.0 * (k == 0 ? uOverA.z : uOverA.w), 190.0);
        if (y >= 70.0) a = 0.0;
        outc = mix(outc, vec3(230.0, 245.0, 255.0) / 255.0, a * m * (k == 0 ? 1.0 : 0.7));
      }
    }
    // The ring: a circle 70vmax across on the bottom edge's middle, scaled from there, its colour a band of its radial
    // gradient (clear to 54%, rgba(255,226,180,.5) at 63%, rgba(255,196,130,.18) at 68%, clear at 72% of the farthest
    // corner, cut at the circle).
    if (uOverB.y > 0.0) {
      float r = 0.7 * max(vp.x, vp.y);
      float d = length(q - vec2(vp.x * 0.5, vp.y)) / max(uOverB.x, 1e-3);
      if (d <= r) {
        float u = d / (r * 1.41421356);
        vec4 c1 = vec4(vec3(255.0, 226.0, 180.0) / 255.0 * 0.5, 0.5);
        vec4 c2 = vec4(vec3(255.0, 196.0, 130.0) / 255.0 * 0.18, 0.18);
        vec4 c = u < 0.54 ? vec4(0.0) : u < 0.63 ? c1 * ((u - 0.54) / 0.09) : u < 0.68 ? mix(c1, c2, (u - 0.63) / 0.05) : c2 * clamp(1.0 - (u - 0.68) / 0.04, 0.0, 1.0);
        c *= uOverB.y;
        outc = outc * (1.0 - c.a) + c.rgb;
      }
    }
    // The flash: an ellipse at 50% 100% out to the farthest corner, rgba(255,236,206,.75) going clear at 75%.
    if (uOverB.z > 0.0) {
      vec2 c = vec2(vp.x * 0.5, vp.y);
      float t = length((q - c) / (vec2(vp.x * 0.5, vp.y) * 1.41421356));
      outc = mix(outc, vec3(255.0, 236.0, 206.0) / 255.0, 0.75 * clamp(1.0 - t / 0.75, 0.0, 1.0) * uOverB.z);
    }
  }
#endif

  gl_FragColor = vec4(clamp(outc, 0.0, 1.0), 1.0);
}`

/** A colour buffer for the passes to draw into, the screen's way: values written as they will be shown. */
function screenTarget(depth: boolean): THREE.WebGLRenderTarget {
  const t = new THREE.WebGLRenderTarget(1, 1, {
    samples: 0,
    depthBuffer: depth,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: false,
  })
  // Screen-space sRGB in a plain RGBA8 buffer: the shaders encode, the hardware does
  // not. See the note at the top.
  t.texture.colorSpace = THREE.SRGBColorSpace
  t.texture.internalFormat = 'RGBA8'
  ;(t as unknown as { isXRRenderTarget: boolean }).isXRRenderTarget = true
  return t
}

/** The multisampled storage put under `Upscaler.draw`. */
interface Msaa {
  fb: WebGLFramebuffer
  color: WebGLRenderbuffer
  depth: WebGLRenderbuffer
  w: number
  h: number
}

/**
 * HOW THE ANTI-ALIASING IS DONE. three.js resolves a multisampled target (copies it, colour and depth, into a
 * plain texture) at the end of EVERY render call into it. A frame here is three or four calls into the same buffer
 * (world, hands, streaks), so the whole buffer was copied three or four times a frame, depth included, though only
 * the last copy of the colour is ever looked at. On integrated graphics those copies were a third of the frame.
 *
 * So the passes draw into `draw`, a plain target whose attachments are swapped for multisampled renderbuffers of
 * our own: three draws into it as into any plain target and never resolves, and `present` resolves the colour,
 * once, into `target`. A driver that will not have it gets plain drawing, without anti-aliasing, rather than none.
 */
export class Upscaler {
  /** What every pass of a frame draws into. */
  readonly draw: THREE.WebGLRenderTarget
  /** The finished frame, resolved, for the present pass to read. */
  readonly target: THREE.WebGLRenderTarget
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private readonly material: THREE.ShaderMaterial
  /**
   * The same pass with the glass's overlay compiled in (SLAM_GLASS), every uniform shared: drawn instead only on the frames
   * the overlay shows (overlay). Built from the pass as it stands (`glass()`), not as written: a look patches the pass's
   * text after it is made (the baked tier adds its glow and its cuts), and a variant built from the text as written lost
   * them — the glow went out on every frame of a slam. Rebuilt when the pass's text or defines change, and drawn once
   * then (`glassWarm`, under the loading screen at the first frame), so its first real draw — on the Chromebook a pipeline
   * made, 100-200 ms — is never in play.
   */
  private glassMaterial: THREE.ShaderMaterial | null = null
  /** The pass's text the glass was built from ('' when it must be built again). */
  private glassFrom = ''
  private glassWarm = false
  /**
   * The same pass with the glitch compiled in as well (GLASS_GLITCH, and SLAM_GLASS with it), every uniform shared: drawn
   * instead only on the frames a burst of it shows (`glitch`). Built from the pass as it stands, as the glass is (see
   * glassMaterial), so the look's patches are in it, and drawn once whenever it is built, so its first real draw is never
   * in play.
   */
  private glitchMaterial: THREE.ShaderMaterial | null = null
  /** The pass's text the glitch's variant was built from ('' when it must be built again). */
  private glitchFrom = ''
  private glitchWarm = false
  private readonly presentQuad: THREE.Mesh
  private pulseAmount = 0
  private goreAmount = 0
  /** How concussed the view is, 0..1, settling back on its own (see `concuss`). */
  private concussion = 0
  /** Seconds since the last blast's shock front set out across the view, and where on screen it set out from. */
  private shockT = 9
  private readonly shockAt = new THREE.Vector2(0.5, 0.5)
  private strength = 1
  /**
   * AMD FSR 1 (experimental): the frame is upscaled to the canvas by EASU into `easu`, and the present pass
   * sharpens it with RCAS instead of CAS. Off, the present pass reads `target` directly, as before.
   */
  private fsr = false
  private readonly easu = screenTarget(false)
  private readonly easuScene = new THREE.Scene()
  private readonly easuMaterial: THREE.ShaderMaterial
  private readonly outSize = new THREE.Vector2()
  private msaa: Msaa | null = null
  /** Samples the anti-aliasing uses now: 0 or 1 is none. */
  private samples: number
  /** The most this GPU can do, and the most the game asks for. */
  private readonly maxSamples: number

  constructor(private readonly renderer: THREE.WebGLRenderer) {
    this.draw = screenTarget(true)
    this.target = screenTarget(false)
    const gl = renderer.getContext() as WebGL2RenderingContext
    this.maxSamples = Math.min(4, Number(gl.getParameter(gl.MAX_SAMPLES)) || 0)
    this.samples = this.maxSamples

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        tFrame: { value: this.target.texture },
        texel: { value: new THREE.Vector2(1, 1) },
        sharpness: { value: 0.5 },
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uGore: { value: 0 },
        uAlarm: { value: new THREE.Vector2(0, 0) },
        uOverA: { value: new THREE.Vector4() },
        uOverB: { value: new THREE.Vector4() },
        uMoveA: { value: new THREE.Vector4() },
        uMoveB: { value: new THREE.Vector4() },
        uConcuss: { value: 0 },
        uShock: { value: 1 },
        uShockAt: { value: new THREE.Vector2(0.5, 0.5) },
        uSlow: { value: 0 },
        uStrength: { value: 1 },
        uAspect: { value: 16 / 9 },
        uRcas: { value: Math.pow(2, -RCAS_STOPS) },
        uRes: { value: new THREE.Vector2(1, 1) },
        uCss: { value: 1 },
        uCh: { value: new THREE.Vector4(5, 0, 0, 0) },
        uVisorA: { value: 0 },
        tTape: { value: null },
        uTape: { value: new THREE.Vector4() },
        uTapeTex: { value: new THREE.Vector3(1, 1, 0) },
        uGlitch: { value: new THREE.Vector4() },
      },
      depthTest: false,
      depthWrite: false,
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material)
    quad.frustumCulled = false
    this.scene.add(quad)
    this.presentQuad = quad
    this.easuMaterial = new THREE.ShaderMaterial({
      vertexShader: EASU_VERT,
      fragmentShader: EASU_FRAG,
      uniforms: { tInput: { value: this.target.texture }, con0: { value: new THREE.Vector4() } },
      depthTest: false,
      depthWrite: false,
    })
    const easuQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.easuMaterial)
    easuQuad.frustumCulled = false
    this.easuScene.add(easuQuad)
  }

  /** Turn AMD FSR 1 on or off. The present pass is rebuilt with RCAS in place of CAS (one shader compile). */
  setFsr(on: boolean): void {
    if (on === this.fsr) return
    this.fsr = on
    const m = this.material
    if (on) m.defines = { ...m.defines, FSR_RCAS: 1 }
    else delete (m.defines as Record<string, unknown>).FSR_RCAS
    m.needsUpdate = true
    // The glass's variant is built again with them (glass()): drawn once at the next frame, not first on a slam. So is
    // the glitch's.
    this.glassFrom = ''
    this.glitchFrom = ''
  }

  /** The glass's variant of the pass as it stands now (see glassMaterial). */
  private glass(): THREE.ShaderMaterial {
    const m = this.material
    if (!this.glassMaterial || this.glassFrom !== m.fragmentShader) {
      this.glassMaterial?.dispose()
      this.glassMaterial = new THREE.ShaderMaterial({
        vertexShader: m.vertexShader,
        fragmentShader: m.fragmentShader,
        uniforms: m.uniforms,
        defines: { ...m.defines, SLAM_GLASS: 1 },
        depthTest: false,
        depthWrite: false,
      })
      this.glassFrom = m.fragmentShader
      this.glassWarm = false
    }
    return this.glassMaterial
  }

  /** The glitch's variant of the pass as it stands now (see glitchMaterial): the glass's, with the glitch as well. */
  private glitchy(): THREE.ShaderMaterial {
    const m = this.material
    if (!this.glitchMaterial || this.glitchFrom !== m.fragmentShader) {
      this.glitchMaterial?.dispose()
      this.glitchMaterial = new THREE.ShaderMaterial({
        vertexShader: m.vertexShader,
        fragmentShader: m.fragmentShader,
        uniforms: m.uniforms,
        defines: { ...m.defines, SLAM_GLASS: 1, GLASS_GLITCH: 1 },
        depthTest: false,
        depthWrite: false,
      })
      this.glitchFrom = m.fragmentShader
      this.glitchWarm = false
    }
    return this.glitchMaterial
  }

  /** Anti-aliasing samples in use now: 0 for none. Frame generation draws its real frames with the same. */
  get sampleCount(): number {
    return this.samples >= 2 ? this.samples : 0
  }

  get fsrOn(): boolean {
    return this.fsr
  }

  /** Size the offscreen buffer: CSS size times the dynamic render ratio. */
  setSize(cssWidth: number, cssHeight: number, ratio: number): void {
    const w = Math.max(1, Math.round(cssWidth * ratio))
    const h = Math.max(1, Math.round(cssHeight * ratio))
    if (this.target.width !== w || this.target.height !== h) {
      this.draw.setSize(w, h)
      this.target.setSize(w, h)
    }
    this.material.uniforms.texel!.value.set(1 / w, 1 / h)
    this.material.uniforms.uAspect!.value = cssWidth / Math.max(1, cssHeight)
  }

  /**
   * How many samples the anti-aliasing takes: 4, 2, or 0 for none. Every sample is a full copy of the frame
   * written and resolved, so on a graphics chip short of memory bandwidth it is one of the dearest things drawn.
   */
  setSamples(n: number): void {
    const want = n >= 2 ? Math.min(n, this.maxSamples) : 0
    if (want === this.samples) return
    this.samples = want
    if (this.msaa) {
      const gl = this.renderer.getContext()
      gl.deleteRenderbuffer(this.msaa.color)
      gl.deleteRenderbuffer(this.msaa.depth)
      this.msaa = null
    }
    // Three remakes the target with its own plain attachments the next time it is drawn into; `begin` puts
    // multisampled ones under it again if anti-aliasing is still wanted.
    this.draw.dispose()
  }

  /** The framebuffer three made for a target, made now if it has not been yet. */
  private framebufferOf(t: THREE.WebGLRenderTarget): WebGLFramebuffer {
    // Already made (the usual case): read, not set — setting a render target is a good deal of three.js's work for a
    // handle it already has, three times a frame, on a machine without the browser's optimising compiler.
    const made = (this.renderer.properties.get(t) as { __webglFramebuffer?: WebGLFramebuffer }).__webglFramebuffer
    if (made) return made
    this.renderer.setRenderTarget(t)
    return (this.renderer.properties.get(t) as { __webglFramebuffer: WebGLFramebuffer }).__webglFramebuffer
  }

  /** Put multisampled storage under `draw`, again whenever three has remade its framebuffer (a resize does). */
  private ensureMsaa(): void {
    if (this.samples < 2) return
    const fb = this.framebufferOf(this.draw)
    const { width: w, height: h } = this.draw
    const m = this.msaa
    if (m && m.fb === fb && m.w === w && m.h === h) return
    const gl = this.renderer.getContext() as WebGL2RenderingContext
    if (m) {
      gl.deleteRenderbuffer(m.color)
      gl.deleteRenderbuffer(m.depth)
      this.msaa = null
    }
    const color = gl.createRenderbuffer()
    const depth = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, color)
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.samples, gl.RGBA8, w, h)
    gl.bindRenderbuffer(gl.RENDERBUFFER, depth)
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.samples, gl.DEPTH_COMPONENT24, w, h)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    this.renderer.state.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, color)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth)
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      // Not this driver: have three remake the target with its own plain attachments, and draw without.
      gl.deleteRenderbuffer(color)
      gl.deleteRenderbuffer(depth)
      this.samples = 0
      this.draw.dispose()
      this.renderer.setRenderTarget(this.draw)
      return
    }
    this.msaa = { fb, color, depth, w, h }
  }

  /** How much of the camera look to apply: 1 in the suit, 0 for a clean image (build mode). */
  setStrength(s: number): void {
    this.strength = Math.max(0, Math.min(1, s))
  }

  /** A burst of static and a flash, for the optics coming online. It decays on its own. */
  /**
   * The overlay on the glass this frame (see the shader's overlay): `a` the edges' darkening, the streaks' strength and
   * the two streak layers' phase (0..1 of their 190 px); `b` the ring's scale and strength, and the flash's strength.
   * All 0: nothing drawn. Set by whoever owns it, every frame it changes.
   */
  overlay(a: THREE.Vector4Like, b: THREE.Vector4Like): void {
    const u = this.material.uniforms
    ;(u.uOverA!.value as THREE.Vector4).copy(a)
    ;(u.uOverB!.value as THREE.Vector4).copy(b)
  }

  /**
   * The suit's moves on the glass this frame (see the shader's; ui/motionfx.ts): `a` the speed streaks, a dash's smear
   * (across, up), the streaks' phase; `b` a landing's knock, a wall jump's flash (signed: its side), a slide's heat. All
   * 0: nothing drawn. Set by whoever owns it, every frame it changes.
   */
  motion(a: THREE.Vector4Like, b: THREE.Vector4Like): void {
    const u = this.material.uniforms
    ;(u.uMoveA!.value as THREE.Vector4).copy(a)
    ;(u.uMoveB!.value as THREE.Vector4).copy(b)
  }

  /** A kill's flush of red at the edges, 0..1: the strongest wins, gone in about a third of a second. */
  gore(amount: number): void {
    this.goreAmount = Math.min(1, Math.max(this.goreAmount, amount))
  }

  /**
   * A level's alarm (the user, 2026-11-14: "then everything goes red, all lights go red, alarms start blaring"): `amount`
   * 0..1 how far the picture is drawn into red, `beat` 0..1 a beacon's light coming round. Set every frame it changes;
   * 0 is the plain pass.
   */
  alarm(amount: number, beat = 0): void {
    ;(this.material.uniforms.uAlarm!.value as THREE.Vector2).set(Math.max(0, Math.min(1, amount)), Math.max(0, Math.min(1, beat)))
  }

  pulse(amount = 1): void {
    this.pulseAmount = Math.max(this.pulseAmount, amount)
  }

  /**
   * The suit's camera disrupted (player/disruption.ts): a burst of artifacting this frame, `strength` 0..1 — rows of the
   * picture torn sideways (up to 38% of them, by up to 4.5% of the width) with their colours split, and up to 14% of it in
   * blocks stuck, each smeared down from a line of its pixels — dealt from `seed` into `bands` rows. 0: none, and the plain
   * pass is drawn. Set by whoever owns it, every frame it changes. Not scaled by the camera look's strength, as a kill's
   * flush and a blast's are not.
   */
  glitch(strength: number, seed = 0, bands = 24): void {
    ;(this.material.uniforms.uGlitch!.value as THREE.Vector4).set(Math.max(0, Math.min(1, strength)), seed, bands, 0)
  }

  /**
   * A blast close by: the shock front racing out across the view from where it went off (`at`, 0..1 across and up the
   * screen; the middle if it was behind you), then the view swimming — doubled, smeared, drained of colour, closed in —
   * and settling over a few seconds. `amount` 0..1: the nearer the blast, the harder and longer.
   */
  concuss(amount: number, at?: { x: number; y: number }): void {
    this.concussion = Math.max(this.concussion, Math.min(1, amount))
    this.shockT = 0
    this.shockAt.set(at?.x ?? 0.5, at?.y ?? 0.5)
  }

  /** The view clear of any blast at once: no shock front, no swimming. For a fresh life — none of the last one's blast carries into it. */
  clearConcussion(): void {
    this.concussion = 0
    this.shockT = 9
  }

  /**
   * How far time has been slowed, 0..1, eased by the caller: the colour drained cold (all but what burns bright), the
   * edges pulled in, streaked and fringed toward the middle. Three more taps a pixel while it is above 0, none at 0.
   */
  slowTime = 0

  /** Start drawing a frame into the offscreen buffer. */
  begin(): void {
    this.ensureMsaa()
    this.renderer.setRenderTarget(this.draw)
    this.renderer.clear()
  }

  /** Copy the frame out of the draw buffer into `target`: the one resolve a frame costs. */
  private resolve(): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext
    const state = this.renderer.state
    const from = this.framebufferOf(this.draw)
    const to = this.framebufferOf(this.target)
    const { width: w, height: h } = this.draw
    state.bindFramebuffer(gl.READ_FRAMEBUFFER, from)
    state.bindFramebuffer(gl.DRAW_FRAMEBUFFER, to)
    gl.blitFramebuffer(0, 0, w, h, 0, 0, w, h, gl.COLOR_BUFFER_BIT, gl.NEAREST)
    // The next frame starts with a clear, so none of this needs keeping: telling the driver saves it the writes.
    gl.invalidateFramebuffer(gl.READ_FRAMEBUFFER, [gl.COLOR_ATTACHMENT0, gl.DEPTH_ATTACHMENT])
    state.bindFramebuffer(gl.READ_FRAMEBUFFER, null)
    state.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null)
  }

  /**
   * Put the frame on the canvas. `upscale` is how far it is being stretched (canvas
   * pixels per buffer pixel): at 1:1 there is nothing to restore and only a touch of
   * sharpening is applied; the more it is stretched, the more it gets. `dt` is seconds
   * since the last frame, for the static's decay.
   */
  /**
   * The HUD's moving parts, drawn by the present pass: the crosshair (its gap in CSS px, its opacity, white for a hit,
   * azure for a blow a shield took) and the visor's compass tape (shown or not, and how far along its strip the
   * heading is, CSS px). On a page they were the elements changing every frame over the canvas, and every change cost
   * the page a restyle and a repaint.
   */
  readonly hud = { gap: 5, crosshair: 0, hit: 0, blocked: 0, visor: 0, tapeX: 0 }
  private tapeTexture: THREE.CanvasTexture | null = null

  /** The compass tape's strip (drawn once, Visor.tapeCanvas), where the tape stands on the page (CSS px). */
  setTape(canvas: HTMLCanvasElement, cssWidth: number, cssHeight: number, rect: { x: number; y: number; width: number; height: number }): void {
    this.tapeTexture?.dispose()
    const t = new THREE.CanvasTexture(canvas)
    t.minFilter = THREE.LinearFilter
    t.generateMipmaps = false
    t.colorSpace = THREE.NoColorSpace
    this.tapeTexture = t
    const u = this.material.uniforms
    u.tTape!.value = t
    ;(u.uTapeTex!.value as THREE.Vector3).set(cssWidth, cssHeight, 0)
    ;(u.uTape!.value as THREE.Vector4).set(rect.x, rect.y, rect.width, rect.height)
  }

  present(upscale: number, dt = 1 / 60): void {
    const u = this.material.uniforms
    const out = this.renderer.getDrawingBufferSize(this.outSize)
    ;(u.uRes!.value as THREE.Vector2).copy(out)
    // Canvas pixels per CSS pixel (read from the page it would make the page lay itself out).
    u.uCss!.value = this.renderer.getPixelRatio()
    ;(u.uCh!.value as THREE.Vector4).set(this.hud.gap, this.hud.crosshair, this.hud.hit, this.hud.blocked)
    u.uVisorA!.value = this.tapeTexture ? this.hud.visor : 0
    ;(u.uTapeTex!.value as THREE.Vector3).z = this.hud.tapeX
    u.sharpness!.value = Math.max(0, Math.min(1, (upscale - 1) * 1.6 + 0.2))
    this.pulseAmount = Math.max(0, this.pulseAmount - dt * 1.7)
    u.uPulse!.value = this.pulseAmount
    this.goreAmount = Math.max(0, this.goreAmount - dt * 3)
    u.uGore!.value = this.goreAmount * this.goreAmount
    // Settles over about four seconds from the worst; the shock front is gone in under one.
    this.concussion = Math.max(0, this.concussion - dt * 0.24)
    this.shockT += dt
    u.uConcuss!.value = this.concussion
    u.uShock!.value = Math.min(1, this.shockT / 0.6)
    ;(u.uShockAt!.value as THREE.Vector2).copy(this.shockAt)
    u.uStrength!.value = this.strength
    u.uSlow!.value = Math.max(0, Math.min(1, this.slowTime)) * this.strength
    // Wrapped so the float stays precise over a long session.
    u.uTime!.value = (performance.now() / 1000) % 600
    this.resolve()
    if (this.fsr) {
      // EASU: the frame, upscaled to the canvas's own pixels.
      const out = this.renderer.getDrawingBufferSize(this.outSize)
      if (this.easu.width !== out.x || this.easu.height !== out.y) this.easu.setSize(out.x, out.y)
      const con = easuCon0(this.target.width, this.target.height, out.x, out.y)
      ;(this.easuMaterial.uniforms.con0!.value as THREE.Vector4).set(...con)
      this.renderer.setRenderTarget(this.easu)
      this.renderer.render(this.easuScene, this.camera)
      u.tFrame!.value = this.easu.texture
      u.texel!.value.set(1 / out.x, 1 / out.y)
    } else {
      u.tFrame!.value = this.target.texture
      u.texel!.value.set(1 / this.target.width, 1 / this.target.height)
    }
    this.renderer.setRenderTarget(null)
    const glass = this.glass()
    const glitchy = this.glitchy()
    if (!this.glassWarm) {
      // The glass's variant, drawn once (with nothing on the glass it draws what the plain one does, which draws over it).
      this.presentQuad.material = glass
      this.renderer.render(this.scene, this.camera)
      this.glassWarm = true
    }
    if (!this.glitchWarm) {
      // The glitch's, the same way (drawn over by the real draw below, whatever it showed).
      this.presentQuad.material = glitchy
      this.renderer.render(this.scene, this.camera)
      this.glitchWarm = true
    }
    const a = u.uOverA!.value as THREE.Vector4
    const b = u.uOverB!.value as THREE.Vector4
    const g = u.uGlitch!.value as THREE.Vector4
    const ma = u.uMoveA!.value as THREE.Vector4
    const mb = u.uMoveB!.value as THREE.Vector4
    const moving = ma.x > 0 || ma.y !== 0 || ma.z !== 0 || mb.x > 0 || mb.y !== 0 || mb.z > 0
    this.presentQuad.material = g.x > 0 ? glitchy : a.x + a.y + b.y + b.z > 0 || moving ? glass : this.material
    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    const gl = this.renderer.getContext()
    if (this.msaa) {
      gl.deleteRenderbuffer(this.msaa.color)
      gl.deleteRenderbuffer(this.msaa.depth)
    }
    this.draw.dispose()
    this.target.dispose()
    this.easu.dispose()
    this.material.dispose()
    this.glassMaterial?.dispose()
    this.glitchMaterial?.dispose()
    this.easuMaterial.dispose()
  }
}
