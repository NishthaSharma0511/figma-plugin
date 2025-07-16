import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        code: 'src/code.ts',
        ui: 'src/ui.html',
      },
      output: {
        entryFileNames: '[name].js'
      }
    },
    emptyOutDir: false,
  }
});