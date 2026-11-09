# T-085 · Crónica, hitos y clasificación

**Fase:** 4 · Cliente · **Depende de:** T-082 · **Estado:** hecha (09-11-2026)

## 1. Contexto

La crónica es lo primero que se lee cada turno y el hilo narrativo de la partida. Desde T-088 el resumen del
turno la enseña al resolverse, pero no hay forma de volver a un turno pasado, de ver los hitos con su fecha ni de
entender por qué va primero cada uno.

Lee antes: [docs/08-interfaz.md](../08-interfaz.md) §8.1 y §8.6; [docs/06-competicion.md](../06-competicion.md)
§6.3.1 (el prestigio y su desglose son **públicos**).

## 2. Objetivo

Pantalla de crónica con acciones sugeridas y archivo de turnos, hitos con su fecha y clasificación pública con
desglose por capítulos.

## 3. Alcance

**Entra:** archivo de crónicas navegable por turno y por año; avisos primero con su botón de acción (los mismos
que el resumen); hitos propios con fecha y primicias de todos; clasificación con el desglose de cada casa.

**No entra:** temporadas (T-104).

## 4. Diseño detallado

### 4.1 La clasificación pública (núcleo, `reglas/clasificacion-publica.ts`)

```ts
interface FilaDeClasificacion {
  readonly jugador: IdJugador; readonly nombre: string; readonly casa: Casa;
  readonly puesto: number; readonly puestoAnterior: number | null; readonly prestigio: number;
  readonly capitulos: Readonly<Record<CapituloDePrestigio, number>>; readonly penalizaciones: number;
  readonly primicias: readonly Hito[];          // públicas: la crónica las anuncia a todos
}
interface HitoLogrado { readonly hito: Hito; readonly nombre: string; readonly prestigio: number;
  readonly turno: number; readonly fecha: string; readonly primicia: boolean }
interface ClasificacionPublica {
  readonly turno: number; readonly filas: readonly FilaDeClasificacion[];   // en orden de puesto
  readonly misHitos: readonly HitoLogrado[];                               // por turno
  readonly porLograr: readonly { hito: Hito; nombre: string; prestigio: number }[];  // activos y sin lograr
}
function clasificacionPublica(estado, jugador, mundo, reglas): ClasificacionPublica
```

El desglose sale de `prestigioDe`, la misma cuenta de la fase 11, así que suma lo que dice la clasificación
(probado). De las demás casas solo se da lo público (§6.3.1): prestigio, capítulos, penalizaciones y primicias;
los hitos con fecha, solo los propios.

### 4.2 Servidor

`GET /partidas/:id/clasificacion` devuelve, además de lo que ya daba, `publica: ClasificacionPublica`. La
crónica de un turno ya se sirve (`GET /partidas/:id/cronica/:turno`).

### 4.3 Cliente

- **Crónica** (`pantallas/cronica.ts`), desde la cabecera, en el panel: el turno elegido (por defecto el último
  resuelto) con ← y →, y un selector de año que salta a su primer turno; las entradas por secciones, avisos
  primero, con «Qué hacer», «Ver comarca» y «Darle ruta» (el mismo pintado que el resumen, extraído a
  `pantallas/entradas.ts`). Las crónicas traídas se guardan por turno.
- **Clasificación**: una fila por casa con puesto, cambio (↑ ↓), prestigio, y desplegado su desglose en barras
  por capítulo, y las primicias. Debajo, **tus hitos** con su fecha y los que te quedan por lograr con lo que dan.
- La bandeja enlaza «Ver la crónica».

## 5. Criterios de aceptación

1. El desglose de cada casa suma su prestigio, y de las demás no sale ningún hito con fecha (probado).
2. El archivo trae la crónica de cualquier turno pasado y navega por turno y por año (probado en la función pura
   de navegación y contra el servidor).
3. Los avisos van primero y llevan su acción, también en el archivo (mismo pintado que el resumen).
4. `npm run verificar` en verde y el cliente por debajo de su presupuesto.

## 6. Verificación

```bash
npm run verificar
```

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-085: <resumen>`.

## 8. Cierre (09-11-2026)

Hecho todo lo de §4:

- **Núcleo:** `reglas/clasificacion-publica.ts`.
- **Servidor:** la ruta de clasificación devuelve también `publica`.
- **Cliente:** `archivo.ts` (navegación pura), `pantallas/entradas.ts` (pintado común de la crónica, extraído
  del resumen), `pantallas/cronica.ts`, y «Ver la crónica» en la bandeja.

Los cuatro criterios están probados y se ha visto en Chrome sin cabeza.
