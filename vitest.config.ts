import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['paquetes/**/*.test.ts', 'herramientas/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/dist-pruebas/**', 'maqueta/**'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'cobertura',
      include: ['paquetes/*/src/**/*.ts', 'herramientas/*/src/**/*.ts'],
      exclude: ['**/*.test.ts'],
      // Umbral informativo: todavia no bloquea la verificacion.
      thresholds: { lines: 0, functions: 0, branches: 0, statements: 0 },
    },
  },
});
