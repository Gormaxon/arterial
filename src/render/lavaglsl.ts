/**
 * Molten rock, worked out per pixel: the one look of lava, shared by the level's lava surfaces (levelmaterial.ts) and
 * the melt closing over the screen when it takes you (fx/lavacover.ts), so going under looks like going into the same
 * stuff you fell in.
 *
 * It used to be a picture slid across a flat face, with box-shaped "crust plates" stood on top: a 2D texture with square
 * lumps on it. Here it is built the way lava is:
 *   - a skin of crust broken into irregular plates (cells of a jittered grid, warped so no edge is straight), each
 *     drifting on a slow current and slowly changing shape as the plates jostle;
 *   - the melt glowing up through the cracks between them, brightest where a crack is widest;
 *   - some plates still soft and hot, glowing through and pulsing, the rest cooled to black basalt that catches the light;
 *   - the melt itself churning BELOW the crust, read at a depth along the line of sight (`par`), so it shifts against the
 *     plates as you move: you see into it, not a print on the floor;
 *   - a height for each point (plates proud, cracks low, rounded at the edges) for the surface's relief.
 */
export const LAVA_GLSL = /* glsl */ `
vec2 lvHash2( vec2 p ) {
  p = vec2( dot( p, vec2( 127.1, 311.7 ) ), dot( p, vec2( 269.5, 183.3 ) ) );
  return fract( sin( p ) * 43758.5453 );
}
float lvHash( vec2 p ) { return fract( sin( dot( p, vec2( 41.3, 289.1 ) ) ) * 45758.5453 ); }
float lvNoise( vec2 p ) {
  vec2 i = floor( p ), f = fract( p );
  f = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( lvHash( i ), lvHash( i + vec2( 1.0, 0.0 ) ), f.x ), mix( lvHash( i + vec2( 0.0, 1.0 ) ), lvHash( i + vec2( 1.0, 1.0 ) ), f.x ), f.y );
}
float lvFbm( vec2 p ) { return 0.62 * lvNoise( p ) + 0.38 * lvNoise( p * 2.07 + 13.1 ); }
// The crust's cells: distance to the nearest plate centre, distance to the crack (second nearest minus nearest), the plate.
vec3 lvCells( vec2 p, float t ) {
  vec2 i = floor( p ), f = fract( p );
  float d1 = 8.0, d2 = 8.0, id = 0.0;
  for ( int y = -1; y <= 1; y ++ ) {
    for ( int x = -1; x <= 1; x ++ ) {
      vec2 g = vec2( float( x ), float( y ) );
      vec2 o = lvHash2( i + g );
      // Plates jostle: their centres wander a little, so the cracks open and close.
      o = 0.5 + 0.36 * sin( t * 0.3 + 6.2831 * o );
      vec2 r = g + o - f;
      float d = dot( r, r );
      if ( d < d1 ) { d2 = d1; d1 = d; id = lvHash( i + g ); } else if ( d < d2 ) { d2 = d; }
    }
  }
  return vec3( sqrt( d1 ), sqrt( d2 ) - sqrt( d1 ), id );
}
// p: metres on the surface. t: seconds. par: the line of sight's slant (how far it travels across per metre down).
void lvSurface( vec2 p, float t, vec2 par, out vec3 emis, out vec3 albedo, out float h ) {
  // The current: the whole skin drifts, warped so it moves like something thick rather than sliding as a sheet.
  vec2 warp = vec2( lvFbm( p * 0.19 + vec2( 0.0, t * 0.035 ) ), lvFbm( p * 0.19 + vec2( 5.2, -t * 0.03 ) ) );
  vec2 q = p * 0.55 + warp * 2.3 + vec2( t * 0.045, t * 0.028 );
  // Ragged edges: the cells are looked up through a fine jitter, so no crack runs straight.
  vec2 jag = vec2( lvNoise( q * 3.1 ), lvNoise( q * 3.1 + 7.7 ) ) - 0.5;
  vec3 c = lvCells( q + jag * 0.24, t );
  // Channels where the crust has torn open and the melt runs in rivers between broken bits of it.
  float chan = smoothstep( 0.56, 0.8, lvFbm( p * 0.11 + vec2( t * 0.018, -t * 0.011 ) ) );
  // The grain of the basalt: rough, pitted rock, not a smooth fill.
  float grain = lvFbm( q * 5.3 );
  // A few plates still soft, glowing through in patches, each on its own slow beat.
  float soft = smoothstep( 0.84, 1.0, c.z ) * ( 0.35 + 0.65 * lvNoise( q * 2.6 + t * 0.15 ) ) * ( 0.8 + 0.2 * sin( t * ( 0.6 + c.z ) + c.z * 40.0 ) );
  // The melt under the crust, seen at a depth along the view: it slides against the plates as you move.
  float m = lvFbm( q * 1.9 + par * 0.55 + vec2( t * 0.12, -t * 0.09 ) );
  // Cracks from hairlines to gaps, per plate and along their length; wide open in the channels.
  float crackW = ( 0.015 + 0.13 * lvNoise( q * 0.9 + c.z * 5.0 ) ) * ( 1.0 + 3.5 * chan );
  float crack = 1.0 - smoothstep( 0.0, crackW, c.y );
  // Just inside a plate's edge it is still red-hot.
  float rim = exp( -c.y * 13.0 ) * ( 1.0 - crack );
  vec3 melt = mix( vec3( 1.0, 0.2, 0.02 ), vec3( 1.0, 0.7, 0.22 ), m * m ) * ( 1.5 + 1.5 * m );
  emis = melt * ( crack * ( 0.7 + 0.6 * m ) + soft * 0.34 * ( 1.0 - crack ) ) + vec3( 0.9, 0.15, 0.02 ) * rim * 0.5;
  // Cooled basalt, a little warm where it is nearest the heat.
  albedo = mix( vec3( 0.03, 0.024, 0.022 ), vec3( 0.085, 0.065, 0.055 ), grain );
  albedo = mix( albedo, vec3( 0.16, 0.05, 0.02 ), max( rim, soft * 0.6 ) );
  // Plates proud, rounded off at their edges; soft ones sag; pitted all over; the cracks low.
  h = smoothstep( 0.0, 0.24, c.y ) * ( 1.0 - 0.6 * soft ) + 0.38 * grain;
}
// Relief from a height, per pixel, from the height's own screen derivatives (no tangents needed).
vec3 lvBump( vec3 surfPos, vec3 surfNorm, float height, float scale ) {
  vec3 sx = dFdx( surfPos ), sy = dFdy( surfPos );
  vec3 r1 = cross( sy, surfNorm ), r2 = cross( surfNorm, sx );
  float det = dot( sx, r1 );
  vec2 dh = vec2( dFdx( height ), dFdy( height ) ) * scale;
  vec3 grad = sign( det ) * ( dh.x * r1 + dh.y * r2 );
  return normalize( abs( det ) * surfNorm - grad );
}
`
