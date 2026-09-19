# T-043 · Fase 11: prestigio, hitos y clasificación

**Fase:** 2 · Motor · **Depende de:** T-036 · **Estado:** hecha

## 1. Contexto

El marcador del juego. Tiene que premiar **dejar cosas hechas** (población, obras, caminos, comercio)
y no acumular almacén, porque eso es lo que empuja a jugar hacia delante.

Lee antes: [docs/06-competicion.md](../06-competicion.md) §6.3.

## 2. Objetivo

Calcular el prestigio de cada jugador cada turno, con desglose por capítulos, registrar los hitos
—incluidos los «primero de la partida»— y producir la clasificación.

## 3. Alcance

**Entra:** cálculo de prestigio, catálogo de hitos, primicias, clasificación y su histórico.

**No entra:** presentación (T-085) ni temporadas (T-104).

**Heredado de T-035.** Al terminar una obra mayor la fase 6 emite `hito.obra-mayor` con el tipo;
las terminadas quedan en `EstadoComarca.obrasMayores` y, las de tramo, en `EstadoPartida.caminos`.

**Heredado de T-042.** La fase 11 ya existe y llama a `tradiciones(ctx)` (`fases/11-tradiciones.ts`):
elige las tradiciones pedidas y abre las rondas nuevas. Fama y Linaje miran `jugador.prestigio`, así
que el recuento de prestigio tiene que ir **antes** de `tradiciones(ctx)` dentro de la fase, para
que una ronda se abra el mismo turno en que se alcanza el umbral. Si se guarda el registro de obras
mayores terminadas por jugador, `logrosDe` (`reglas/tradiciones.ts`) puede leerlo en lugar de los
sucesos `hito.obra-mayor` del turno.

**Heredado de T-037.** El volumen propio en una feria (`porFeriaDestacada`) se suma de los sucesos
`mercado.trato` del turno cuyo `mercado` empieza por `feria-`: traen `cantidad` e `importe`, y cada
jugador aparece una vez por trato. `EstadoMercado.ultimoVolumen` es el volumen de la plaza, no el
de un jugador.

## 4. Diseño detallado

### 4.1 Prestigio por capítulos

```ts
export interface Prestigio {
  total: number;
  capitulos: {
    poblacion: number; territorio: number; obras: number; caminos: number;
    comercio: number; exploracion: number; ganaderia: number; industria: number;
  };
  penalizaciones: number;
}
```

Valores de [docs/06-competicion.md](../06-competicion.md) §6.3. El desglose es obligatorio: la
clasificación enseña **por qué** va primero cada uno, y eso es información que se juega.

### 4.2 Recalculado, no acumulado

El prestigio se **recalcula entero** cada turno a partir del estado, salvo los capítulos que son
históricos por naturaleza (obras terminadas, hitos, años trashumantes completados), que se guardan
como registro. Así nunca hay derivas por errores de acumulación.

### 4.3 Hitos

Catálogo inicial (`nucleo/datos/hitos.json`):

| Hito | Condición |
|---|---|
| Primer horizonte | Explorar la primera comarca |
| Despensa estable | Balance de pan ≥ 0 y ≥ 60 de reserva durante 3 turnos |
| Un pueblo que prospera | La capital llega a villa (150 vecinos) |
| Más allá del origen | Primera comarca incorporada o puebla fundada |
| Un pequeño dominio | Tres comarcas administradas |
| Año redondo | Un rebaño completa el ciclo trashumante con calidad ≥ 90 % |
| Maestro de obra | Primera obra mayor terminada |
| Camino abierto | Primer camino carretero o calzada |
| Buen nombre | Crédito ≥ 80 con al menos tres contratos cumplidos |
| Señor de ferias | 1 000 mrs de volumen propio en ferias en un año |
| Ciudad | La capital llega a 260 vecinos |
| Casa conocida | Alcanzar 1 000 de prestigio |

Cada hito guarda el turno en que se logró. Los hitos **no** dan recursos: dan prestigio y aparecen en
la crónica. No se pueden repetir.

### 4.4 Primicias

El primer jugador de la partida en lograr un hito recibe **50 de prestigio adicional** y la crónica
lo anuncia a todos («los canteros de Lara han sido los primeros en abrir camino carretero»). Es
competición pura y no cuesta nada al que llega segundo, salvo el orgullo.

### 4.5 Clasificación

```ts
export function clasificacion(estado: EstadoPartida): readonly {
  jugador: IdJugador; puesto: number; prestigio: Prestigio; variacion: number;
}[];
```

Ordenada por prestigio; empates por población, luego por comarcas, luego por `hash32`. Se guarda la
variación respecto al turno anterior para poder mostrar quién sube.

## 5. Archivos

```
paquetes/nucleo/src/fases/11-prestigio.ts          registro del turno, hitos, recuento, clasificacion
paquetes/nucleo/src/reglas/{prestigio,hitos,clasificacion}.ts
paquetes/nucleo/src/datos/prestigio.ts             tabla de prestigio y catalogo de hitos
paquetes/nucleo/pruebas/prestigio.test.ts
```

## 5.1 Lo que cambió al implementarla

- **Datos en TypeScript** (`src/datos/prestigio.ts`) y pruebas en `pruebas/`, como el resto del
  paquete.
- **Registro del jugador** (`EstadoJugador.registro`): obras mayores por tipo, años trashumantes,
  ferias destacadas y volumen del año por feria, comarcas perdidas, turnos con escasez y turnos de
  despensa estable. La fase 11 lo apunta leyendo los sucesos del turno (`hito.obra-mayor`,
  `rebanyo.esquileo`, `mercado.trato`, `comarca.vuelve-neutral`, `almacen.cambio`) y el estado.
  `EstadoPartida` gana `primicias` y `clasificacion`. Las huellas de `humo-01` y `humo-02` cambian:
  comprobado con el commit anterior que los sucesos de las fases 1 a 10 son idénticos y que solo se
  añaden los de la fase 11.
- **Capítulo `hitos`** además de los ocho de §4.1: cada hito da su prestigio (tabla en docs/06
  §6.3.1) y cada primicia, 50. La ficha no decía cuánto daba un hito.
- **Condiciones concretadas:** «Más allá del origen» es tener dos comarcas; «Camino abierto», la
  primera calzada (la única obra que mejora un tramo); «Año trashumante», esquilar con calidad del
  año ≥ 750 milésimas (quieto en la sierra se queda en unas 580); «Despensa estable», no perder pan
  en el turno según los `almacen.cambio` y tener 60 de reserva. «Buen nombre» queda desactivado hasta
  T-103 (contratos).
- **Primicias simultáneas:** mérito (prestigio al empezar el turno) y luego hash; nunca el orden.
- **Clasificación:** se guarda la del último turno con el puesto anterior; `clasificacion()` la
  devuelve con el desglose y la variación de puestos. El histórico largo es el de los estados.
- **Orden dentro de la fase 11:** registro, hitos y primicias, recuento, clasificación y, al final,
  tradiciones. `logrosDe` lee ya la obra mayor del registro.

## 6. Criterios de aceptación

1. El prestigio de un estado dado coincide con el calculado a mano en al menos tres escenarios
   completos (test con cifras escritas).
2. Recalcular dos veces da el mismo total (no hay acumulación oculta).
3. Los doce hitos se disparan con sus condiciones exactas, ni antes ni después.
4. La primicia se otorga una sola vez por hito y partida.
5. La clasificación es estable y sus desempates son deterministas.
6. Las penalizaciones (comarca perdida, escasez) restan lo estipulado.
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/prestigio.test.ts paquetes/nucleo/src/reglas/hitos.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-044). Commit: `T-043: prestigio, hitos y clasificacion`.
