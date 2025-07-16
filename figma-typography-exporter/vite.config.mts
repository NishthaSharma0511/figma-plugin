import { defineConfig } from 'vite';
import { Crypto } from '@peculiar/webcrypto';

if (!globalThis.crypto) {
  globalThis.crypto = new Crypto();
}

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        code: 'src/code.ts',
        ui: 'src/ui.html'
      },
      output: {
        entryFileNames: '[name].js'
      }
    },
    emptyOutDir: false
  }
});