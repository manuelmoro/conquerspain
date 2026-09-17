# T-002 · Útiles deterministas: enteros, orden, azar y huella

**Fase:** 0 · Cimientos · **Depende de:** T-001 · **Estado:** pendiente

## 1. Contexto

Todo el motor descansa en cuatro piezas: aritmética entera con milésimas, recorrido en orden
estable, azar con semilla y huella canónica del estado. Si estas cuatro están bien, el determinismo
está resuelto para siempre; si están mal, se descubre tarde y duele.

Lee antes: [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.4.3 a §2.4.5 y
[docs/07-arquitectura.md](../07-arquitectura.md) §7.2.2.

## 2. Objetivo

Entregar `paquetes/nucleo/src/utiles/` con aritmética, orden, azar y huella, probados con vectores
conocidos, sin ninguna dependencia externa y sin coma flotante.

## 3. Alcance

**Entra:** `enteros.ts`, `orden.ts`, `azar.ts`, `huella.ts`, `serializacion.ts` y sus tests.

**No entra:** tipos del dominio (T-003), fases (T-004), nada de reglas de juego.

## 4. Diseño detallado

### 4.1 `enteros.ts` — aritmética en milésimas

Las magnitudes fraccionarias se guardan en **milésimas** (`1000` = 1,000). Convenio: una variable en
milésimas lleva el sufijo `Mil` (`rendimientoMil`).

```ts
export type Milesimas = number;           // entero
export const MIL = 1000;

export function aMilesimas(entero: number): Milesimas;
export function aEntero(m: Milesimas): number;              // trunca hacia abajo
export function porcentaje(valor: number, porcentajeMil: Milesimas): number;
// porcentaje(100, 1250) === 125   (125,0 %)

export function multiplicarFactores(base: number, factoresMil: readonly Milesimas[]): number;
// Aplica factores en cadena SIN perder precisión intermedia:
// acumula en milésimas y trunca una sola vez al final.

export function repartoProporcional(
  disponible: number,
  peticiones: readonly { id: string; cantidad: number }[],
): Map<string, number>;
// Reparte proporcionalmente, trunca hacia abajo y asigna el resto por mayor parte fraccionaria;
// los empates de resto se deshacen por orden de `id` (comparación de cadenas, no de locale).

export function limitar(valor: number, minimo: number, maximo: number): number;
```

Reglas:

- **Nunca** se devuelve un número con decimales. Si una función pudiera hacerlo, devuelve milésimas.
- `multiplicarFactores` es la única forma permitida de encadenar multiplicadores en el motor, para
  que el redondeo ocurra exactamente una vez y siempre en el mismo sitio.
- El reparto debe cumplir el invariante `suma(resultado) === min(disponible, suma(peticiones))`.

### 4.2 `orden.ts` — recorrido estable

```ts
export function enOrden<T>(registro: Readonly<Record<string, T>>): [string, T][];
export function idsEnOrden(registro: Readonly<Record<string, unknown>>): string[];
export function ordenarPor<T>(lista: readonly T[], clave: (x: T) => string): T[];
export function comparar(a: string, b: string): -1 | 0 | 1;   // por punto de código, sin locale
```

`comparar` no usa `localeCompare` (depende del entorno). Se compara carácter a carácter por punto de
código Unicode.

### 4.3 `azar.ts` — generador con semilla

Generador **xoshiro128\*\*** sobre enteros de 32 bits sin signo, alimentado por una función de
mezcla de la semilla:

```ts
export interface Azar {
  entero(maximoExclusivo: number): number;         // [0, max)
  entreInclusive(min: number, max: number): number;
  milesimas(min: Milesimas, max: Milesimas): Milesimas;
  elegir<T>(lista: readonly T[]): T;               // lista no vacía
  barajar<T>(lista: readonly T[]): T[];            // Fisher-Yates determinista
}

export function azarDe(semillaPartida: string, turno: number, ambito: string, id: string): Azar;
```

- `azarDe` deriva el estado inicial con la huella de `${semillaPartida}|${turno}|${ambito}|${id}`.
- **Cada uso declara su ámbito** (`'cosecha'`, `'hallazgo'`, `'rumor'`). Así, añadir una tirada nueva
  en una fase no desplaza las tiradas de otra fase, que es el fallo clásico que rompe las partidas
  guardadas.
- Prohibido reutilizar un `Azar` entre entidades distintas: uno por entidad y ámbito.

### 4.4 `serializacion.ts` — forma canónica

```ts
export function canonico(valor: unknown): string;
```

- Objetos con claves ordenadas por `comparar`, sin espacios.
- Números: solo enteros; si aparece un no entero, **lanza error** con la ruta del campo culpable
  (es la red de seguridad contra la coma flotante).
- `undefined` se omite; `null` se serializa.
- Arrays conservan su orden.

### 4.5 `huella.ts` — SHA-256 en TypeScript puro

El núcleo no puede importar `node:crypto`, así que se implementa SHA-256 sobre `Uint32Array`
(implementación de referencia, ~80 líneas) y:

```ts
export function sha256Hex(texto: string): string;
export function huella(valor: unknown): string;   // sha256Hex(canonico(valor))
export function hash32(texto: string): number;    // 32 bits, para desempates deterministas
```

`hash32` es el que usa la regla de desempate de
[docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.4.4.

## 5. Archivos

**Se crean:**

```
paquetes/nucleo/src/utiles/{enteros,orden,azar,serializacion,huella}.ts
paquetes/nucleo/src/utiles/index.ts
paquetes/nucleo/src/utiles/*.test.ts
```

**Se tocan:** `paquetes/nucleo/src/index.ts` (reexporta `utiles`), índice y `ESTADO.md`.

## 6. Criterios de aceptación

1. `sha256Hex('')` devuelve
   `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`, y `sha256Hex('abc')`
   devuelve `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad` (vectores oficiales).
2. `canonico` produce la misma cadena para dos objetos con las mismas claves en distinto orden, y
   lanza error ante `1.5`.
3. `repartoProporcional(10, [{a,7},{b,7}])` reparte `5` y `5`; con `disponible 11` reparte `6` y `5`,
   y el `6` va siempre al mismo identificador en 1 000 ejecuciones.
4. Dos llamadas a `azarDe` con los mismos argumentos producen **la misma secuencia** de 100 valores;
   cambiar solo el ámbito produce una secuencia distinta.
5. `barajar` con la misma semilla da siempre la misma permutación, y no altera la lista de entrada.
6. `multiplicarFactores(100, [1250, 800])` devuelve `100` (125 % × 80 %), y
   `multiplicarFactores(7, [1250])` devuelve `8` (8,75 truncado a 8) — el truncado ocurre una sola vez.
7. Test de propiedad: para 10 000 repartos aleatorios (con semilla fija), la suma repartida nunca
   supera lo disponible ni la suma de peticiones.
8. `npm run verificar` pasa, incluido el test de pureza de T-001.
9. Ningún archivo de `utiles/` importa nada fuera de `utiles/`.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/utiles
```

## 8. Al terminar

1. Marca T-002 como `hecha` en el índice.
2. `ESTADO.md`: siguiente tarea T-003, bitácora.
3. Commit: `T-002: utiles deterministas (enteros, orden, azar, huella)`.
