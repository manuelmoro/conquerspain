# T-030 · Fase 1: calendario, estaciones y clima conocido

**Fase:** 2 · Motor · **Depende de:** T-004 · **Estado:** pendiente

## 1. Contexto

Primera fase real del turno y base de casi todas las demás: el calendario decide cosechas, pastos,
puertos abiertos, ferias y ritmo de obras.

Lee antes: [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.1.

## 2. Objetivo

Que el motor sepa en qué quincena, mes y estación está, qué puertos se cierran, qué ferias se abren y
qué clima anunciado se aplica, todo de forma pura y consultable desde cualquier fase.

## 3. Alcance

**Entra:** derivación del calendario a partir del número de turno, estados estacionales del mapa,
apertura y cierre de puertos, activación de ferias, y el clima anunciado.

**No entra:** los efectos (los aplican producción, movimiento y obras), ni los acontecimientos
extraordinarios (T-039).

## 4. Diseño detallado

### 4.1 Calendario

```ts
export type Estacion = 'primavera' | 'verano' | 'otonyo' | 'invierno';

export interface Calendario {
  turno: number;
  anyo: number;            // 1, 2, 3… desde el inicio de la partida
  mes: 1..12;
  quincena: 1 | 2;
  estacion: Estacion;
  nombre: string;          // 'segunda quincena de mayo'
  esEsquileo: boolean;     // turno 10
  feriasActivas: readonly IdFeria[];
}

export function calendarioDe(turno: number, mundo: Mundo): Calendario;
```

Turno 1 = primera quincena de enero. `mes = floor(((turno − 1) mod 24) / 2) + 1`.

Estaciones según la tabla de [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.1.1.

### 4.2 Estado estacional del mapa

En cada resolución, la fase escribe en el estado un resumen consultable:

```ts
export interface EstadoEstacional {
  estacion: Estacion;
  barro: boolean;                              // marzo y noviembre
  puertosCerrados: readonly string[];          // nombres de puerto
  pastosDeVerano: boolean;                     // mayo a septiembre
  pastosDeInvierno: boolean;                   // octubre a abril
  factorPanMil: Milesimas;                     // 800 / 1600 / 1000 / 600
  factorObraPiedraMil: Milesimas;              // 2000 en invierno, 1000 el resto
}
```

Se recalcula entero cada turno: nunca se guarda información derivada que pueda quedar desfasada.

### 4.3 Clima anunciado

El clima del año se decide al empezar cada **año de juego** (turno impar múltiplo de 24 + 1) con el
azar de ámbito `'clima'`, y se **publica entero** en la crónica: «este año se espera una primavera
seca en el valle del Duero».

```ts
export interface ClimaAnual {
  anyo: number;
  modificadores: readonly {
    region: string;
    estacion: Estacion;
    efecto: 'seco' | 'lluvioso' | 'duro' | 'benigno';
    factorPanMil: Milesimas;      // 700..1300
  }[];
}
```

Reglas: como mucho tres modificadores por año, ninguno afecta a más de dos regiones, y la horquilla
está acotada (±30 %). Nunca hay un año catastrófico global: eso sería azar que decide partidas.

### 4.4 Sucesos emitidos

`calendario.estacion`, `calendario.puerto-cerrado`, `calendario.puerto-abierto`,
`calendario.feria-abierta`, `calendario.clima-anunciado`.

## 5. Archivos

```
paquetes/nucleo/src/fases/01-calendario.ts
paquetes/nucleo/src/reglas/calendario.ts
paquetes/nucleo/src/reglas/calendario.test.ts
paquetes/nucleo/datos/estaciones.json
```

## 6. Criterios de aceptación

1. `calendarioDe` devuelve el nombre correcto para los turnos 1, 10, 24, 25 y 240 (test con valores
   escritos a mano).
2. Los puertos con `cierre: 'invierno'` figuran en `puertosCerrados` exactamente en los turnos 23–24
   y 1–4, y no en el resto.
3. Las ferias se activan solo en sus turnos.
4. El clima del año es el mismo al reproducir la partida, y distinto al cambiar la semilla.
5. Ningún modificador de clima se sale de la horquilla ±30 % ni afecta a más de dos regiones (test de
   propiedad sobre 500 años simulados).
6. El clima del año N se anuncia en la crónica del último turno del año N−1.
7. `npm run verificar` pasa y las partidas de reproducción siguen coincidiendo.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/calendario.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-031). Commit: `T-030: fase de calendario, estaciones y clima`.
