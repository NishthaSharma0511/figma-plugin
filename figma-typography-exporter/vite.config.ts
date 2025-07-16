import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        code: resolve(__dirname, 'src/code.ts'),
        ui: resolve(__dirname, 'src/ui.ts')
      },
      output: {
        entryFileNames: '[name].js'
      }
    },
    emptyOutDir: true,
    target: 'esnext'
  }
});