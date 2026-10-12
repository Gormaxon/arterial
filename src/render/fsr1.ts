/**
 * AMD FidelityFX Super Resolution 1.0, EASU: the edge-adaptive spatial upscale, ported to WebGL 2.
 *
 * A port of `FsrEasuF` from AMD's ffx_fsr1.h (FidelityFX-FSR, v1.20210629), MIT licence:
 *
 *   Copyright (c) 2021 Advanced Micro Devices, Inc. All rights reserved.
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 *   documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 *   the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 *   permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright
 *   notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 *   THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 *   CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *   IN THE SOFTWARE.
 *
 * The maths is AMD's, unchanged: the same 12-tap kernel, the same direction and length analysis, the same lanczos-2
 * approximation and deringing clamp. Two things differ because WebGL 2 is not HLSL: there is no `textureGather`, so
 * the 12 taps are 12 `texelFetch`es of the same texels; and AMD's bit-trick reciprocal approximations are plain
 * divisions (guarded where the original relies on the approximation staying finite at zero).
 *
 * RCAS, the sharpening pass FSR 1 follows EASU with, lives in the present pass (upscale.ts), where it replaces the
 * contrast-adaptive sharpen when FSR is on.
 */

export const EASU_VERT = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`

export const EASU_FRAG = /* glsl */ `
uniform sampler2D tInput;
/** xy: input size / output size. zw: 0.5 * input / output - 0.5 (FsrEasuCon's con0). */
uniform vec4 con0;

vec3 tapAt(ivec2 p) {
  ivec2 size = textureSize(tInput, 0);
  return texelFetch(tInput, clamp(p, ivec2(0), size - 1), 0).rgb;
}

// FsrEasuSetF: accumulate direction and length, weighted for the bilinear position.
void easuSet(inout vec2 dir, inout float len, float w, float lA, float lB, float lC, float lD, float lE) {
  float dc = lD - lC;
  float cb = lC - lB;
  float lenX = 1.0 / max(max(abs(dc), abs(cb)), 1e-6);
  float dirX = lD - lB;
  dir.x += dirX * w;
  lenX = clamp(abs(dirX) * lenX, 0.0, 1.0);
  lenX *= lenX;
  len += lenX * w;
  float ec = lE - lC;
  float ca = lC - lA;
  float lenY = 1.0 / max(max(abs(ec), abs(ca)), 1e-6);
  float dirY = lE - lA;
  dir.y += dirY * w;
  lenY = clamp(abs(dirY) * lenY, 0.0, 1.0);
  lenY *= lenY;
  len += lenY * w;
}

// FsrEasuTapF: one tap of the rotated, stretched lanczos-2 approximation.
void easuTap(inout vec3 aC, inout float aW, vec2 off, vec2 dir, vec2 len, float lob, float clp, vec3 c) {
  vec2 v;
  v.x = off.x * dir.x + off.y * dir.y;
  v.y = off.x * (-dir.y) + off.y * dir.x;
  v *= len;
  float d2 = min(v.x * v.x + v.y * v.y, clp);
  float wB = (2.0 / 5.0) * d2 - 1.0;
  float wA = lob * d2 - 1.0;
  wB *= wB;
  wA *= wA;
  wB = (25.0 / 16.0) * wB - (25.0 / 16.0 - 1.0);
  float w = wB * wA;
  aC += c * w;
  aW += w;
}

float luma2(vec3 c) { return c.b * 0.5 + (c.r * 0.5 + c.g); }

void main() {
  vec2 pp = floor(gl_FragCoord.xy) * con0.xy + con0.zw;
  vec2 fp = floor(pp);
  pp -= fp;
  ivec2 f0 = ivec2(fp);
  //    b c
  //  e f g h
  //  i j k l
  //    n o
  vec3 b = tapAt(f0 + ivec2(0, -1));
  vec3 c = tapAt(f0 + ivec2(1, -1));
  vec3 e = tapAt(f0 + ivec2(-1, 0));
  vec3 f = tapAt(f0);
  vec3 g = tapAt(f0 + ivec2(1, 0));
  vec3 h = tapAt(f0 + ivec2(2, 0));
  vec3 i = tapAt(f0 + ivec2(-1, 1));
  vec3 j = tapAt(f0 + ivec2(0, 1));
  vec3 k = tapAt(f0 + ivec2(1, 1));
  vec3 l = tapAt(f0 + ivec2(2, 1));
  vec3 n = tapAt(f0 + ivec2(0, 2));
  vec3 o = tapAt(f0 + ivec2(1, 2));
  float bL = luma2(b), cL = luma2(c), eL = luma2(e), fL = luma2(f), gL = luma2(g), hL = luma2(h);
  float iL = luma2(i), jL = luma2(j), kL = luma2(k), lL = luma2(l), nL = luma2(n), oL = luma2(o);

  vec2 dir = vec2(0.0);
  float len = 0.0;
  easuSet(dir, len, (1.0 - pp.x) * (1.0 - pp.y), bL, eL, fL, gL, jL);
  easuSet(dir, len, pp.x * (1.0 - pp.y), cL, fL, gL, hL, kL);
  easuSet(dir, len, (1.0 - pp.x) * pp.y, fL, iL, jL, kL, nL);
  easuSet(dir, len, pp.x * pp.y, gL, jL, kL, lL, oL);

  vec2 dir2 = dir * dir;
  float dirR = dir2.x + dir2.y;
  bool zro = dirR < 1.0 / 32768.0;
  dirR = zro ? 1.0 : inversesqrt(dirR);
  dir.x = zro ? 1.0 : dir.x;
  dir *= dirR;
  len = len * 0.5;
  len *= len;
  float stretch = (dir.x * dir.x + dir.y * dir.y) / max(max(abs(dir.x), abs(dir.y)), 1e-6);
  vec2 len2 = vec2(1.0 + (stretch - 1.0) * len, 1.0 - 0.5 * len);
  float lob = 0.5 + ((1.0 / 4.0 - 0.04) - 0.5) * len;
  float clp = 1.0 / lob;

  vec3 min4 = min(min(f, g), min(j, k));
  vec3 max4 = max(max(f, g), max(j, k));
  vec3 aC = vec3(0.0);
  float aW = 0.0;
  easuTap(aC, aW, vec2(0.0, -1.0) - pp, dir, len2, lob, clp, b);
  easuTap(aC, aW, vec2(1.0, -1.0) - pp, dir, len2, lob, clp, c);
  easuTap(aC, aW, vec2(-1.0, 1.0) - pp, dir, len2, lob, clp, i);
  easuTap(aC, aW, vec2(0.0, 1.0) - pp, dir, len2, lob, clp, j);
  easuTap(aC, aW, vec2(0.0, 0.0) - pp, dir, len2, lob, clp, f);
  easuTap(aC, aW, vec2(-1.0, 0.0) - pp, dir, len2, lob, clp, e);
  easuTap(aC, aW, vec2(1.0, 1.0) - pp, dir, len2, lob, clp, k);
  easuTap(aC, aW, vec2(2.0, 1.0) - pp, dir, len2, lob, clp, l);
  easuTap(aC, aW, vec2(2.0, 0.0) - pp, dir, len2, lob, clp, h);
  easuTap(aC, aW, vec2(1.0, 0.0) - pp, dir, len2, lob, clp, g);
  easuTap(aC, aW, vec2(1.0, 2.0) - pp, dir, len2, lob, clp, o);
  easuTap(aC, aW, vec2(0.0, 2.0) - pp, dir, len2, lob, clp, n);
  gl_FragColor = vec4(min(max4, max(min4, aC / aW)), 1.0);
}`

/** FsrEasuCon's con0 for an input `inW`x`inH` upscaled to `outW`x`outH`. */
export function easuCon0(inW: number, inH: number, outW: number, outH: number): [number, number, number, number] {
  return [inW / outW, inH / outH, (0.5 * inW) / outW - 0.5, (0.5 * inH) / outH - 0.5]
}

/**
 * FSR 1's quality modes: how much smaller than the output the frame is drawn, per side, as AMD defines them
 * (Ultra Quality 1.3x, Quality 1.5x, Balanced 1.7x, Performance 2.0x). Custom draws at the game's own resolution
 * setting instead. They are an upscaling setting: AMD's frame generation has none.
 */
export const FSR_MODES = [
  { name: 'CUSTOM', scale: 0 },
  { name: 'ULTRA QUALITY', scale: 1.3 },
  { name: 'QUALITY', scale: 1.5 },
  { name: 'BALANCED', scale: 1.7 },
  { name: 'PERFORMANCE', scale: 2.0 },
] as const

/** RCAS sharpness, FsrRcasCon: 0 stops is the most, each stop halves it. AMD's samples use 0.2. */
export const RCAS_STOPS = 0.2
