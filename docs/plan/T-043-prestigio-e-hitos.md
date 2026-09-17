# T-043 · Fase 11: prestigio, hitos y clasificación

**Fase:** 2 · Motor · **Depende de:** T-036 · **Estado:** pendiente

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
paquetes/nucleo/src/fases/11-prestigio.ts
paquetes/nucleo/src/reglas/{prestigio,hitos,clasificacion}.ts
paquetes/nucleo/src/reglas/*.test.ts
paquetes/nucleo/datos/{prestigio,hitos}.json
```

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
