// Vite para el cliente (ficha T-080 §4.6 y §4.7). En desarrollo, `/api` va al servidor por el proxy:
// la misma origen hace que la cookie de sesion funcione sin CORS.
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const PUERTO_DEL_SERVIDOR = Number(process.env['PUERTO'] ?? 8471);

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  resolve: {
    alias: {
      '@conquer/nucleo': fileURLToPath(new URL('../nucleo/src/index.ts', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist-web',
    emptyOutDir: true,
    target: 'es2022',
    // Dos paginas: el juego y la guia (T-127), que se sirve en /guia/ y no carga el juego.
    rolldownOptions: {
      input: {
        juego: fileURLToPath(new URL('index.html', import.meta.url)),
        guia: fileURLToPath(new URL('guia/index.html', import.meta.url)),
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${String(PUERTO_DEL_SERVIDOR)}`,
        rewrite: (ruta) => ruta.replace(/^\/api/, ''),
      },
    },
  },
});
