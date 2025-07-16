import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    outDir: '.',  // ⬅️ Output directly to plugin root
    emptyOutDir: false,
    rollupOptions: {
      input: {
        code: 'src/code.ts',
        ui: 'src/ui.html'
      },
      output: {
        entryFileNames: '[name].js' // Produces `code.js`, `ui.js`
      }
    }
  }
});
