import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import * as compiler from 'vue/compiler-sfc'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: rootDir,
  plugins: [Vue({ compiler })],
  resolve: {
    alias: {
      '@': path.join(rootDir, 'src'),
      '@img': path.join(rootDir, 'src/static/images'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/tests/setup.ts'],
  },
})
