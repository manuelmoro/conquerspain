# T-003 · Tipos del estado, las órdenes y el mundo

**Fase:** 0 · Cimientos · **Depende de:** T-001 · **Estado:** pendiente

## 1. Contexto

Antes de escribir una sola regla hay que fijar la forma de los datos: qué es una partida, un
jugador, una comarca, una recua, una orden y el mundo. Estos tipos los comparten núcleo, servidor y
cliente, así que cambiarlos después es caro. Se escriben con calma y sin lógica dentro.

Lee antes: [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.2, §2.3 y §2.8,
[docs/03-economia.md](../03-economia.md) §3.1 y §3.2, [docs/09-glosario.md](../09-glosario.md).

## 2. Objetivo

Entregar `paquetes/nucleo/src/tipos/` completo, con validadores en tiempo de ejecución para lo que
entra de fuera (estado guardado, órdenes recibidas, datos del mundo), y sin ninguna lógica de juego.

## 3. Alcance

**Entra:** tipos del estado, de las órdenes, del mundo y de las tablas de reglas; identificadores
con marca de tipo; validadores; versionado de reglas.

**No entra:** valores concretos de equilibrio (los pone T-031 y siguientes), catálogo geográfico
(T-010), ninguna función que calcule nada.

## 4. Diseño detallado

### 4.1 Identificadores con marca

```ts
export type Id<Marca extends string> = string & { readonly __marca: Marca };
export type IdPartida = Id<'partida'>;
export type IdJugador = Id<'jugador'>;
export type IdComarca = Id<'comarca'>;
export type IdRecua = Id<'recua'>;
export type IdRebanyo = Id<'rebanyo'>;
export type IdObra = Id<'obra'>;
export type IdOrden = Id<'orden'>;
export type IdMercado = Id<'mercado'>;
```

Un identificador de comarca es siempre el del catálogo (`pinares-soria`), en minúsculas, sin tildes.

### 4.2 Recursos

```ts
export const RECURSOS = ['pan', 'madera', 'piedra', 'maravedis', 'sal', 'hierro', 'lana'] as const;
export type Recurso = (typeof RECURSOS)[number];
export type Recursos = Readonly<Record<Recurso, number>>;   // enteros, nunca negativos
```

### 4.3 El mundo (datos fijos)

```ts
export type Terreno = 'llano' | 'ondulado' | 'sierra' | 'costa' | 'vega';
export type Potencial = 'labor' | 'monte' | 'pasto' | 'piedra' | 'hierro' | 'sal' | 'pesca';

export interface ComarcaMundo {
  id: IdComarca;
  nombre: string;
  cabecera: string;
  region: string;
  centro: readonly [number, number];          // lon, lat en milésimas de grado
  poligono: readonly (readonly [number, number])[];   // unidades de mapa, enteras
  terreno: Terreno;
  potenciales: Readonly<Record<Potencial, 0 | 1 | 2 | 3 | 4 | 5>>;
  solares: number;
  poblacionInicial: number;
  localidades: readonly Localidad[];
  rasgos: readonly Rasgo[];
  feria: Feria | null;
  esOrigen: boolean;
}

export interface Camino {
  desde: IdComarca;
  hasta: IdComarca;
  terreno: Terreno;
  jornadasBase: number;
  vado: boolean;
  puertoDeMontanya: string | null;     // nombre histórico, o null
  canyada: string | null;              // nombre de la cañada real que lo usa
  calzadaRomana: boolean;
}

export interface Mundo {
  version: string;                      // 'v1'
  comarcas: Readonly<Record<IdComarca, ComarcaMundo>>;
  caminos: readonly Camino[];
  vecinos: Readonly<Record<IdComarca, readonly IdComarca[]>>;   // derivado, ordenado
}
```

El mundo es **inmutable durante la partida**. Nada del estado lo modifica.

### 4.4 Estado

```ts
export interface EstadoPartida {
  version: number;                       // VERSION_REGLAS con la que se creó
  id: IdPartida;
  semilla: string;
  turno: number;                         // 1..
  configuracion: ConfiguracionPartida;
  jugadores: Readonly<Record<IdJugador, EstadoJugador>>;
  comarcas: Readonly<Record<IdComarca, EstadoComarca>>;
  recuas: Readonly<Record<IdRecua, Recua>>;
  rebanyos: Readonly<Record<IdRebanyo, Rebanyo>>;
  obras: Readonly<Record<IdObra, Obra>>;
  mercados: Readonly<Record<IdMercado, EstadoMercado>>;
  acontecimientos: readonly Acontecimiento[];
  siguienteId: number;                   // contador para identificadores nuevos, determinista
}

export interface EstadoJugador {
  id: IdJugador;
  nombre: string;
  casa: Casa;
  tradiciones: readonly Tradicion[];
  capital: IdComarca;
  almacen: Recursos;
  reservado: Recursos;                   // comprometido por órdenes pendientes
  prestigio: number;
  credito: number;                       // reputación mecánica (0..100)
  hitos: Readonly<Record<string, number>>;   // hito -> turno en que se logró
  conocimiento: Readonly<Record<IdComarca, Conocimiento>>;
  escasez: boolean;
  turnosSinOrdenes: number;
}

export interface Conocimiento {
  nivel: 'desconocida' | 'oida' | 'explorada' | 'propia';
  turnoUltimaNoticia: number;
  datos: DatosConocidos | null;          // foto fechada de lo que se supo
}
```

`EstadoComarca`, `Recua`, `Rebanyo`, `Obra` y `EstadoMercado` siguen lo descrito en
[docs/03-economia.md](../03-economia.md). Todos los campos numéricos son enteros; los que sean
fracciones llevan sufijo `Mil`.

### 4.5 Órdenes

Unión discriminada por `tipo`, con parámetros propios de cada una:

```ts
export type Orden =
  | OrdenConstruir | OrdenDerribar | OrdenPolitica | OrdenRoturar
  | OrdenFormarRecua | OrdenRuta | OrdenCargar | OrdenDescargar | OrdenCometido
  | OrdenIncorporar | OrdenMercado | OrdenObraMayor | OrdenTradicion | OrdenMayordomo;

export interface OrdenBase {
  id: IdOrden;
  jugador: IdJugador;
  turnoAlta: number;
  estado: 'pendiente' | 'en curso' | 'terminada' | 'cancelada' | 'en espera';
  coste: Recursos;
  turnosTotales: number;
  turnosHechos: number;
}
```

Cada variante añade solo lo suyo (`comarca`, `edificio`, `recua`, `destino`, `precioLimiteMil`…).
Ninguna orden guarda texto libre.

### 4.6 Tablas de reglas

```ts
export interface TablasDeReglas {
  version: number;
  recursos: Record<Recurso, DatosRecurso>;
  edificios: Record<TipoEdificio, DatosEdificio>;
  casas: Record<Casa, DatosCasa>;
  tradiciones: Record<Tradicion, DatosTradicion>;
  estaciones: DatosEstaciones;
  movimiento: DatosMovimiento;
  poblacion: DatosPoblacion;
  mercado: DatosMercado;
  influencia: DatosInfluencia;
  prestigio: DatosPrestigio;
}
```

Las tablas se cargan de `nucleo/datos/*.json` y se validan igual que el mundo. **Ningún número de
equilibrio vive en el código.**

### 4.7 Validación en tiempo de ejecución

Validador propio, sin dependencias, con mensajes en español y ruta del campo:

```ts
export type Resultado<T> = { ok: true; valor: T } | { ok: false; errores: ErrorValidacion[] };
export interface ErrorValidacion { ruta: string; mensaje: string; }

export function validarEstado(dato: unknown): Resultado<EstadoPartida>;
export function validarOrdenEntrante(dato: unknown): Resultado<Orden>;
export function validarMundo(dato: unknown): Resultado<Mundo>;
export function validarTablas(dato: unknown): Resultado<TablasDeReglas>;
```

Reglas de validación que hay que comprobar sí o sí: enteros (nunca decimales), no negativos donde
corresponda, identificadores existentes (una orden no puede citar una comarca que no está en el
mundo), y coherencia de versión de reglas.

### 4.8 Versionado

```ts
export const VERSION_REGLAS = 1;
```

Sube con cada cambio que altere resultados. `validarEstado` rechaza un estado de versión distinta
con un mensaje que explica que hace falta migración.

## 5. Archivos

```
paquetes/nucleo/src/tipos/{ids,recursos,mundo,estado,ordenes,reglas,cronica}.ts
paquetes/nucleo/src/tipos/index.ts
paquetes/nucleo/src/validacion/{validador,validarEstado,validarMundo,validarOrden,validarTablas}.ts
paquetes/nucleo/src/validacion/*.test.ts
```

## 6. Criterios de aceptación

1. Los tipos compilan con `strict` y `exactOptionalPropertyTypes`, sin ningún `any`.
2. Un estado de ejemplo mínimo (una partida, un jugador, una comarca) valida correctamente.
3. Cada validador rechaza, con la ruta exacta del campo: decimales, negativos indebidos, campos que
   faltan, identificadores inexistentes y versiones de reglas incompatibles. Hay un test por caso.
4. Todos los tipos del glosario están representados y se llaman igual que en él.
5. `validarOrdenEntrante` rechaza cualquier campo extra no declarado (para que un cliente manipulado
   no pueda colar datos).
6. Ningún archivo de `tipos/` contiene lógica: solo `interface`, `type` y `const` de listas.
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/validacion
```

## 8. Al terminar

1. Índice: T-003 `hecha`.
2. `ESTADO.md`: siguiente T-004; anota en la bitácora cualquier tipo que hayas añadido y no estuviera
   previsto en el diseño, y actualiza `docs/03-economia.md` si has ajustado alguna estructura.
3. Commit: `T-003: tipos del dominio y validacion`.
