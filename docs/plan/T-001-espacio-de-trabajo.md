# T-001 · Espacio de trabajo, TypeScript y verificación

**Fase:** 0 · Cimientos · **Depende de:** nada · **Estado:** pendiente

## 1. Contexto

El repositorio solo contiene documentación y la maqueta visual congelada (`maqueta/`). Hay que
levantar el espacio de trabajo donde vivirá el juego, con las reglas técnicas de
[CLAUDE.md](../../CLAUDE.md) §4 aplicadas desde el primer commit, y con el comando de verificación
que cierra todas las tareas posteriores.

Lee antes: [CLAUDE.md](../../CLAUDE.md) §3 y §4, [docs/07-arquitectura.md](../07-arquitectura.md) §7.1.

## 2. Objetivo

Que `npm install && npm run verificar` funcione en limpio sobre un monorepo con los cuatro paquetes
y las dos herramientas vacíos pero bien configurados, y que las reglas de pureza del núcleo estén
vigiladas automáticamente.

## 3. Alcance

**Entra:** estructura de paquetes, TypeScript estricto, Vitest, ESLint, Prettier, scripts, guardas
de pureza del núcleo, `.gitignore`, `.editorconfig`, flujo de integración continua.

**No entra:** ninguna regla de juego, ningún tipo del dominio (eso es T-003), ninguna dependencia de
servidor ni de cliente más allá de lo necesario para compilar un módulo vacío.

## 4. Diseño detallado

### 4.1 Requisitos del entorno

- Node 22 LTS. Se declara en `package.json` (`engines`) y en `.nvmrc`.
- Módulos ES (`"type": "module"`) en todos los paquetes.
- npm workspaces (sin pnpm ni yarn, para no añadir requisitos a quien continúe el trabajo).

### 4.2 Estructura

```
package.json                  raíz, workspaces y scripts
tsconfig.base.json            opciones compartidas
vitest.config.ts              configuración de tests del monorepo
eslint.config.js              configuración plana de ESLint
.prettierrc.json              formato
.editorconfig
.nvmrc
.gitignore
paquetes/nucleo/{package.json,tsconfig.json,src/index.ts}
paquetes/mundo/{...}
paquetes/servidor/{...}
paquetes/cliente/{...}
herramientas/atlas/{...}
herramientas/banco/{...}
```

Cada paquete arranca con un `src/index.ts` que exporta su versión y nada más:

```ts
export const VERSION_NUCLEO = '0.1.0';
```

### 4.3 Nombres de los paquetes

`@conquer/nucleo`, `@conquer/mundo`, `@conquer/servidor`, `@conquer/cliente`,
`@conquer/atlas`, `@conquer/banco`. Todos `"private": true`.

### 4.4 `tsconfig.base.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "declaration": true,
    "sourceMap": true,
    "skipLibCheck": true
  }
}
```

`paquetes/nucleo/tsconfig.json` además pone `"types": []` y **no** incluye `@types/node`: si alguien
escribe `process.env` en el núcleo, no compila.

### 4.5 Scripts

En la raíz:

```jsonc
{
  "scripts": {
    "tipos": "tsc --build",
    "lint": "eslint .",
    "formato": "prettier --check .",
    "test": "vitest run",
    "verificar": "npm run tipos && npm run lint && npm run formato && npm run test"
  }
}
```

### 4.6 Guardas de pureza del núcleo

Dos capas, porque una sola se salta sin querer:

1. **ESLint** en `paquetes/nucleo/**`:
   - `no-restricted-imports`: `fs`, `node:fs`, `path`, `node:path`, `crypto`, `node:crypto`,
     `process`, cualquier `@conquer/*` que no sea tipos.
   - `no-restricted-globals`: `Date`, `Math.random` (mediante `no-restricted-properties`),
     `process`, `window`, `document`, `globalThis`.
   - `no-restricted-syntax`: `NewExpression[callee.name='Date']`,
     `CallExpression[callee.object.name='Math'][callee.property.name='random']`.
2. **Test de pureza** (`paquetes/nucleo/pruebas/pureza.test.ts`): recorre los archivos de
   `nucleo/src`, y falla si encuentra `Date`, `Math.random`, `require(`, `import(` dinámico o
   literales de coma flotante en contextos de cálculo (`/\d+\.\d+/` fuera de comentarios y de
   cadenas). El mensaje de error dice el archivo, la línea y por qué está prohibido.

El test se escribe ya en T-001 aunque el núcleo esté vacío: así nace vigilado.

### 4.7 ESLint y Prettier

- ESLint 9 con configuración plana y `typescript-eslint` en modo `strictTypeChecked`.
- Reglas propias: `@typescript-eslint/no-explicit-any` en error; `@typescript-eslint/consistent-type-imports`;
  `eqeqeq`; `prefer-const`; `no-console` en `nucleo` y `mundo` (en `servidor` y `atlas` se permite).
- Prettier: 100 columnas, comillas simples, sin punto y coma final **no** (se mantienen los puntos y
  coma), coma final en multilínea.

### 4.8 Vitest

- `environment: 'node'`, `include: ['paquetes/**/*.test.ts', 'herramientas/**/*.test.ts']`.
- Cobertura con `v8` y umbral informativo (no bloqueante todavía).
- Un test de humo por paquete que compruebe que su versión está exportada.

### 4.9 Integración continua

`.github/workflows/verificar.yml`: en cada push y cada pull request, Node 22, `npm ci`,
`npm run verificar`. Aunque todavía no haya remoto configurado, el flujo queda escrito.

### 4.10 `.gitignore`

`node_modules/`, `dist/`, `*.tsbuildinfo`, `.env*`, `cobertura/`, `herramientas/atlas/cache/`,
`*.sqlite`.

## 5. Archivos

**Se crean:** todos los listados en §4.2, más `.github/workflows/verificar.yml` y
`paquetes/nucleo/pruebas/pureza.test.ts`.

**Se tocan:** `CLAUDE.md` §5 (rellenar la tabla de comandos con los reales), `ESTADO.md`,
`docs/plan/00-indice.md`.

**No se toca:** `maqueta/` (congelada).

## 6. Criterios de aceptación

1. `npm install` termina sin avisos de dependencias no resueltas.
2. `npm run verificar` pasa en limpio, con los seis paquetes compilando.
3. Añadir `const x = new Date();` en `paquetes/nucleo/src/index.ts` hace fallar **tanto** el lint
   **como** el test de pureza (se comprueba a mano durante la tarea y se documenta en el commit).
4. `paquetes/nucleo` no tiene ninguna dependencia en su `package.json`.
5. `tsc --build` no emite ningún error con `strict` y `noUncheckedIndexedAccess` activos.
6. El árbol de carpetas coincide exactamente con [CLAUDE.md](../../CLAUDE.md) §3.
7. `maqueta/` sigue funcionando tal cual (no se ha movido ni modificado nada dentro).

## 7. Verificación

```bash
npm install
npm run verificar
npx tsc --build --dry     # sin errores
git status --short        # sin archivos sueltos inesperados
```

## 8. Al terminar

1. Rellena la tabla de comandos de `CLAUDE.md` §5 con los comandos reales.
2. Marca T-001 como `hecha` en `docs/plan/00-indice.md`.
3. Actualiza `ESTADO.md`: siguiente tarea T-002, bitácora y «Qué existe hoy».
4. Commit: `T-001: espacio de trabajo, TypeScript estricto y verificación`.

---

## 9. Resultado (17-09-2026)

Tarea cerrada. Diferencias respecto a lo previsto, todas anotadas también en `CLAUDE.md` §5:

- **TypeScript 6.0.3** (la 7 todavía no la admite `typescript-eslint`). La 6 deprecó `baseUrl`, así
  que los alias `@conquer/*` se resuelven con `paths` relativos a `tsconfig.base.json`.
- **`emitDeclarationOnly`**: `tsc --build` solo emite declaraciones; el código se ejecuta siempre
  desde las fuentes (Vitest, `tsx`, Vite). Por eso `allowImportingTsExtensions` y los imports
  relativos con extensión `.ts`, y por eso se quitó `sourceMap`.
- Versiones finales: Node 22, ESLint 10, `typescript-eslint` 8, Vitest 5, Prettier 3. Instalación
  limpia sin vulnerabilidades.
- Las pruebas del núcleo viven en `paquetes/nucleo/tsconfig.pruebas.json`, un proyecto aparte que sí
  ve los tipos de Node (la guarda de pureza necesita leer archivos).
- Comprobación del criterio 3 hecha a mano: al añadir `new Date()`, `Math.random()` y `1.25` a
  `paquetes/nucleo/src/index.ts`, ESLint dio 5 errores y la prueba de pureza señaló las tres líneas
  con su motivo. Después se restauró el archivo y `npm run verificar` volvió a pasar.
