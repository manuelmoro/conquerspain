# T-004 · Armazón del resolutor: fases, contexto y sucesos

**Fase:** 0 · Cimientos · **Depende de:** T-002, T-003 · **Estado:** **hecha** (17-09-2026)

## 1. Contexto

Con los útiles y los tipos ya hechos, toca el esqueleto que ejecutará las doce fases del turno. En
esta tarea **no se implementa ninguna regla de juego**: se monta la tubería, el registro de sucesos,
la huella por turno y el mecanismo de partidas de reproducción, que es lo que permitirá cambiar
reglas los próximos meses sin miedo.

Lee antes: [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.4,
[docs/07-arquitectura.md](../07-arquitectura.md) §7.2.

## 2. Objetivo

Que `resolverTurno` exista, recorra las doce fases en orden, produzca sucesos y crónica vacía,
avance el turno, calcule la huella del estado resultante, y que exista un mecanismo de partidas
guardadas que se reproducen en los tests.

## 3. Alcance

**Entra:** contexto de resolución, registro de sucesos, orquestador, huella por turno, utilidades de
mutación controlada del estado, y el arnés de reproducción.

**No entra:** producción, consumo, movimiento… (fases 2 en adelante). Cada fase queda como función
identidad documentada con un `// implementa T-0xx`.

## 4. Diseño detallado

### 4.1 Contexto de resolución

```ts
export interface Contexto {
  readonly mundo: Mundo;
  readonly reglas: TablasDeReglas;
  readonly turno: number;             // el turno que se está resolviendo
  readonly semilla: string;
  estado: EstadoPartida;              // mutable solo a través de `aplicar`
  readonly ordenes: readonly Orden[]; // ya validadas y ordenadas por id
  readonly sucesos: Suceso[];
}

export type Fase = (ctx: Contexto) => void;
```

El estado de entrada **no se muta**: `resolverTurno` trabaja sobre una copia profunda congelada por
fase (`Object.freeze` en desarrollo, comprobado con un test), y las fases lo modifican mediante
funciones de mutación explícitas:

```ts
export function aplicar(ctx: Contexto, cambio: Cambio): void;
```

`Cambio` es una unión discriminada (`'recurso'`, `'poblacion'`, `'lealtad'`, `'edificio'`,
`'influencia'`, `'orden'`, `'recua'`…). Cada cambio:

1. comprueba sus invariantes (no deja recursos negativos, no supera capacidades);
2. aplica la mutación;
3. registra un `Suceso`.

Que todo cambio pase por aquí es lo que permite explicar cualquier cifra al jugador y depurar un
turno entero leyendo la lista de sucesos.

### 4.2 Sucesos

```ts
export interface Suceso {
  orden: number;                  // secuencial dentro del turno
  fase: NombreFase;
  tipo: string;                   // 'produccion.explotacion', 'recua.llegada'…
  jugador: IdJugador | null;
  comarca: IdComarca | null;
  datos: Readonly<Record<string, number | string>>;
}
```

Los sucesos son la materia prima de la crónica (T-044) y del registro de auditoría del servidor.
No llevan texto redactado: el texto se compone después, para poder cambiar la redacción sin tocar el
motor.

### 4.3 Orquestador

```ts
const FASES: readonly [NombreFase, Fase][] = [
  ['calendario', faseCalendario],
  ['produccion', faseProduccion],
  ['consumo', faseConsumo],
  ['movimiento', faseMovimiento],
  ['cometidos', faseCometidos],
  ['obras', faseObras],
  ['mercado', faseMercado],
  ['territorio', faseTerritorio],
  ['poblacion', fasePoblacion],
  ['acontecimientos', faseAcontecimientos],
  ['prestigio', fasePrestigio],
  ['cronica', faseCronica],
];

export function resolverTurno(estado, ordenes, mundo, reglas): ResultadoTurno;
```

- Valida la entrada (versión de reglas, órdenes del turno correcto) y lanza error claro si no cuadra.
- Ordena las órdenes por `id` antes de empezar (orden estable).
- Ejecuta las fases en orden, sin excepción ni atajos.
- Al final incrementa el turno, calcula `huella(estado)` y la guarda en `estado.huellaTurno`.

### 4.4 Partidas de reproducción

Formato de una partida guardada (`paquetes/nucleo/pruebas/partidas/*.json`):

```jsonc
{
  "nombre": "humo-01",
  "descripcion": "Partida vacía de tres turnos; sirve para detectar cambios no intencionados",
  "versionReglas": 1,
  "mundo": "mini",                  // mundo de pruebas, no el real
  "estadoInicial": { },
  "turnos": [
    { "turno": 1, "ordenes": [], "huellaEsperada": "…" },
    { "turno": 2, "ordenes": [], "huellaEsperada": "…" }
  ]
}
```

Y el arnés:

```bash
npx vitest run paquetes/nucleo/pruebas/reproduccion    # comprueba todas las partidas
npm run regenerar-partidas                             # recalcula huellas (solo si el cambio es intencionado)
```

`regenerar-partidas` pide confirmación explícita por argumento (`--confirmo`) y escribe en la salida
qué huellas cambian, para que nadie regenere sin mirar.

### 4.5 Mundo de pruebas

Un mundo mínimo `mini` de 7 comarcas inventadas (con nombres claramente de prueba: `prueba-llano`,
`prueba-sierra`…) definido en `paquetes/nucleo/pruebas/mundo-mini.ts`. No depende del catálogo real,
para que los tests del motor no se rompan cuando el mapa crezca.

### 4.6 Errores

```ts
export class ErrorDeMotor extends Error {
  constructor(public readonly codigo: string, mensaje: string, public readonly datos?: unknown);
}
```

Códigos como `version-incompatible`, `orden-de-otro-turno`, `invariante-rota`. Los mensajes van en
español y dicen qué hacer.

## 5. Archivos

```
paquetes/nucleo/src/resolver.ts
paquetes/nucleo/src/contexto.ts
paquetes/nucleo/src/cambios.ts
paquetes/nucleo/src/sucesos.ts
paquetes/nucleo/src/errores.ts
paquetes/nucleo/src/fases/01-calendario.ts … 12-cronica.ts   (todas identidad, documentadas)
paquetes/nucleo/pruebas/mundo-mini.ts
paquetes/nucleo/pruebas/reproduccion.test.ts
paquetes/nucleo/pruebas/partidas/humo-01.json
herramientas/banco/src/regenerar-partidas.ts
```

## 6. Criterios de aceptación

1. `resolverTurno` con órdenes vacías avanza el turno y **no cambia nada más** del estado.
2. El estado de entrada no se modifica (test que compara su huella antes y después).
3. Ejecutar el mismo turno dos veces produce la misma huella y la misma lista de sucesos.
4. La partida `humo-01` se reproduce y todas sus huellas coinciden.
5. Un cambio deliberado en una fase hace fallar la reproducción (se comprueba a mano y se documenta).
6. `aplicar` rechaza con `invariante-rota` un cambio que dejaría recursos negativos, y hay test.
7. Las doce fases están presentes, en el orden del diseño, y cada una cita en un comentario la tarea
   que la implementará.
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/pruebas
```

## 8. Al terminar

1. Índice: T-004 `hecha`. Fase 0 completa.
2. `ESTADO.md`: fase actual → «Fase 1 · El mundo»; siguiente tarea T-010.
3. Commit: `T-004: armazon del resolutor y partidas de reproduccion`.

---

## 9. Resultado (17-09-2026)

Tarea cerrada y **fase 0 completa**. 111 tests en verde (17 archivos).

Entregado:

- `contexto.ts`, `cambios.ts`, `sucesos.ts`, `errores.ts`, `resolver.ts` y las doce fases vacías,
  cada una citando la tarea que la implementará.
- `pruebas/mundo-mini.ts`: siete comarcas de prueba (vega, llano, monte, sierra, mina, río y costa)
  con potenciales pensados para que luego haya algo que decidir, validadas al construirlas.
- `pruebas/partidas/humo-01.json` y `pruebas/reproduccion.test.ts`, más
  `herramientas/banco/src/regenerar-partidas.ts` (`npm run partidas`), que enseña qué huellas
  cambian y solo escribe con `--confirmo`.

Decisiones tomadas al implementar:

- **Borrador mutable con tipos.** Las fases trabajan sobre `EstadoBorrador`, una versión mutable del
  estado generada con un tipo `Mutable<T>` que **para la recursión en los primitivos**: los
  identificadores del dominio son cadenas con marca de tipo y recorrerlos como objetos la destruía.
- **La huella se encadena.** `huellaTurnoAnterior` se calcula sobre el estado completo, que ya
  incluye la huella del turno anterior: cada turno firma toda la historia de la partida.
- **Sin borrar claves dinámicas.** Cuando un edificio baja a nivel cero se rehace el registro sin esa
  clave, para que la forma canónica no dependa del orden de inserción.
- `aplicar` cubre ya once clases de cambio (recursos, reserva, prestigio, escasez, población,
  lealtad, edificios, influencia, dueño y las tres de órdenes), cada una con sus invariantes.
- Se añadió `tsx` como dependencia de desarrollo para poder ejecutar los scripts del banco.

Comprobación del criterio 5, hecha a mano: al hacer que la fase de producción repartiera un pan, la
reproducción de `humo-01` falló en el turno 1 señalando la huella esperada y la obtenida, y
recordando que se regenera con `npm run partidas -- --confirmo`. Después se restauró la fase y todo
volvió a verde.
