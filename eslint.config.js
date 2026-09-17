import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const MENSAJE_PUREZA =
  'El nucleo es puro y determinista (CLAUDE.md §4): el tiempo, el azar y la entrada y salida entran por parametro.';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-pruebas/**',
      'cobertura/**',
      // La maqueta v0.1 esta congelada como referencia de direccion de arte.
      'maqueta/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js', 'vitest.config.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node },
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    // Primera guarda de pureza del nucleo. La segunda es paquetes/nucleo/pruebas/pureza.test.ts.
    files: ['paquetes/nucleo/src/**/*.ts'],
    rules: {
      'no-console': 'error',
      'no-restricted-globals': [
        'error',
        { name: 'Date', message: MENSAJE_PUREZA },
        { name: 'process', message: MENSAJE_PUREZA },
        { name: 'globalThis', message: MENSAJE_PUREZA },
        { name: 'window', message: MENSAJE_PUREZA },
        { name: 'document', message: MENSAJE_PUREZA },
        { name: 'performance', message: MENSAJE_PUREZA },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: MENSAJE_PUREZA },
        { object: 'Date', property: 'now', message: MENSAJE_PUREZA },
      ],
      'no-restricted-syntax': [
        'error',
        { selector: "NewExpression[callee.name='Date']", message: MENSAJE_PUREZA },
        { selector: "Identifier[name='Date']", message: MENSAJE_PUREZA },
        {
          selector: "CallExpression[callee.object.name='Math'][callee.property.name='random']",
          message: MENSAJE_PUREZA,
        },
        { selector: 'ImportExpression', message: MENSAJE_PUREZA },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'node:*',
                'fs',
                'fs/*',
                'path',
                'os',
                'crypto',
                'url',
                'process',
                'child_process',
                'worker_threads',
              ],
              message: MENSAJE_PUREZA,
            },
            {
              group: ['@conquer/mundo', '@conquer/servidor', '@conquer/cliente'],
              message:
                'El nucleo no depende de ningun otro paquete (docs/07-arquitectura.md §7.1).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['paquetes/mundo/src/**/*.ts'],
    rules: { 'no-console': 'error' },
  },
  {
    files: ['eslint.config.js', 'vitest.config.ts'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
