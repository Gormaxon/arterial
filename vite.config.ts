import { defineConfig } from 'vite'

// The procedural surface textures can be baked to files ahead of time and loaded by hash (render/textures.ts); with
// no hash defined they are generated at start-up instead, which is what the example does.
export default defineConfig({
  base: './',
  define: { __TEXTURE_HASH__: JSON.stringify('') },
  build: { target: 'es2022' },
})
