import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: path.resolve(__dirname, 'ui'),
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'ui/src'),
      '@schemas': path.resolve(__dirname, 'schemas')
    }
  },
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: path.resolve(__dirname, 'ui/dist'),
    emptyOutDir: true,
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'ui/index.html'),
        app: path.resolve(__dirname, 'ui/src/main.ts')
      }
    }
  }
});
