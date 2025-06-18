import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/hono-query-header-mapper.ts'],
  format: ['esm'],
  dts: true,
  minify: true,
  clean: true,
  outDir: 'dist'
})
