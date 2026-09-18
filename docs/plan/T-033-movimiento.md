# T-033 · Fase 4: movimiento de recuas por el grafo

**Fase:** 2 · Motor · **Depende de:** T-013 · **Estado:** **hecha** (18-09-2026)

## 1. Contexto

Las recuas son las «naves» del juego: lo que convierte el mapa en un tablero y las distancias en
decisiones. El movimiento tiene que ser predecible al turno, porque el jugador planifica con él.

Lee antes: [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.2,
[docs/03-economia.md](../03-economia.md) §3.7.

## 2. Objetivo

Mover todas las recuas de todos los jugadores de forma simultánea y determinista, consumiendo
bastimento, respetando puertos cerrados y dejando el estado listo para la fase de cometidos.

## 3. Alcance

**Entra:** cálculo de ruta, avance por jornadas, bastimento, bloqueos por cierre, llegada, y las
órdenes `formar`, `ruta`, `cargar`, `descargar`. Con escasez no sale ninguna expedición nueva
(`permiteIniciar` de `reglas/escasez.ts`, T-032); las que ya están en camino siguen.

**No entra:** lo que hace la recua al llegar (T-034), rebaños (T-040), portazgos (T-103).

## 4. Diseño detallado

### 4.1 Estado de una recua

```ts
export interface Recua {
  id: IdRecua;
  jugador: IdJugador;
  nombre: string;
  situacion:
    | { donde: 'comarca'; comarca: IdComarca }
    | { donde: 'camino'; desde: IdComarca; hasta: IdComarca; jornadasHechasMil: Milesimas };
  ruta: readonly IdComarca[];        // comarcas pendientes, en orden
  rutaCircular: boolean;
  porte: number;                     // cargas
  carga: Recursos;
  vecinos: number;
  acemilas: number;                  // determina el porte real
  cometido: Cometido | null;
  bastimentoAvisado: boolean;
}
```

### 4.2 Cálculo de ruta

```ts
export function rutaMasCorta(
  desde: IdComarca, hasta: IdComarca,
  mundo: Mundo, estacional: EstadoEstacional,
  conocidas: ReadonlySet<IdComarca>,
): { comarcas: IdComarca[]; jornadasMil: Milesimas } | null;
```

- Dijkstra sobre el grafo con coste en jornadas (milésimas), **solo por comarcas conocidas** por ese
  jugador: no se puede trazar ruta por donde no has estado.
- Tramos cerrados por nieve se excluyen.
- Empates de coste: gana la ruta cuya secuencia de identificadores sea menor (determinismo).
- Si no hay ruta, la orden queda `en espera` con motivo `sin-ruta-conocida`.

### 4.3 Avance

Por cada recua, en orden de identificador:

```
pasoMil = pasoBase(3000)
        − 1000 si carga ≥ 80 % del porte
        − 1000 si barro
        + 1000 si el tramo tiene calzada
        + modificadores de casa (arrieros: +1000)
pasoMil = max(1000, pasoMil)          // nunca menos de una jornada por turno
```

Se avanza `pasoMil` jornadas; al completar un tramo se entra en la comarca siguiente y, si sobra
paso, se continúa. Una recua puede cruzar varias comarcas en un turno si están cerca.

Bastimento: `2 pan por jornada` (más 1 sal por cada 4 jornadas en verano). Se cobra **del almacén del
jugador si la recua está en comarca propia**, y **de la carga de la recua** si está fuera. Si no hay:

1. primer turno: aviso `recua.sin-bastimento`, la recua se detiene;
2. segundo turno: pierde 1 acémila (−1 de porte) y sigue detenida;
3. la recua nunca desaparece: siempre puede recibir orden de volver.

### 4.4 Llegada

Al llegar a la comarca de destino, la recua queda disponible para su cometido (fase 5) **ese mismo
turno**. Si la ruta es circular, al terminar vuelve a empezar; si no, la recua queda parada en
destino.

### 4.5 Órdenes asociadas

| Orden | Efecto en esta fase |
|---|---|
| `formar` | Crea la recua en una comarca propia (coste: 20 mrs, 10 pan, 4 vecinos) |
| `ruta` | Fija destino y calcula la ruta; admite circular |
| `cargar` / `descargar` | Solo si la recua está en comarca propia o en mercado; se aplica antes de mover |
| `cometido` | Se guarda para la fase 5 |

## 5. Archivos

```
paquetes/nucleo/src/fases/04-movimiento.ts
paquetes/nucleo/src/reglas/{ruta,movimiento,bastimento}.ts
paquetes/nucleo/src/reglas/*.test.ts
```

## 6. Criterios de aceptación

1. `rutaMasCorta` da la ruta esperada en el mundo mini para al menos ocho pares, incluyendo un caso
   con puerto cerrado en invierno y otro sin ruta posible.
2. Dos recuas idénticas de jugadores distintos, con las mismas órdenes, avanzan exactamente igual.
3. El orden en que se procesan las recuas no altera ningún resultado (test: se resuelve el mismo
   turno con las órdenes barajadas y la huella coincide).
4. El bastimento se cobra de donde corresponde y la secuencia aviso → pérdida de acémila ocurre en los
   turnos correctos.
5. Una recua nunca avanza menos de una jornada por turno ni entra en un tramo cerrado.
6. Las recuas cruzan varias comarcas en un turno si el paso lo permite (test explícito).
7. `npm run verificar` pasa y las partidas de reproducción coinciden.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/ruta.test.ts paquetes/nucleo/src/reglas/movimiento.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-034). Commit: `T-033: movimiento de recuas`.

## 9. Resultado (18-09-2026)

Tarea cerrada. 372 tests en verde; `humo-01` no cambia y hay una partida de reproducción nueva,
`humo-02` («arrieros»: formar, cargar, ruta circular, hambre y acémilas perdidas durante doce turnos).

- `paquetes/nucleo/src/reglas/ruta.ts`: `rutaMasCorta` (Dijkstra en milésimas, solo por comarcas
  exploradas o propias, sin tramos cerrados, desempate por la secuencia de identificadores),
  `rutaPorParadas`, `calidadDeTramo`, `tramoEntre`, `comarcasTransitables`.
- `paquetes/nucleo/src/reglas/movimiento.ts` (`pasoDeRecua`, `avanzar`, `porteDe`,
  `pesoDeLaCarga`) y `bastimento.ts`; `jornadas.ts` gana `jornadasDeTramoMil` y la versión entera
  sale de ella con los mismos resultados.
- `paquetes/nucleo/src/fases/04-movimiento.ts`: órdenes `formar-recua`, `carga`, `cometido` y
  `ruta` (de recua) y el avance de todas las recuas, con sucesos `recua.formada`, `recua.ruta`,
  `recua.avanza`, `recua.entra`, `recua.llega`, `recua.detenida`, `recua.vuelve-por-nieve`,
  `recua.sin-bastimento`, `recua.acemilas` y `recua.carga-recortada`.
- `paquetes/nucleo/src/ordenes.ts`: **el ciclo de vida de las órdenes, que no existía**. Las nuevas
  se dan de alta al empezar el turno y reservan su coste (si ya no cabe, se cancelan con
  `sin-recursos`); cada fase las empieza (`empezarOrden` paga lo reservado), las deja en espera con
  motivo o las cancela; al acabar el turno se retiran las terminadas y canceladas.
- `paquetes/nucleo/src/datos/movimiento.ts`: tabla real de movimiento; diez cambios nuevos en
  `cambios.ts` (recuas, `siguiente-id`, `orden-retirar`) y `nuevoId` en `tipos/ids.ts`.
- Pruebas: `pruebas/ruta.test.ts` (ocho pares a mano, nieve, conocimiento, empate) y
  `pruebas/movimiento.test.ts` (paso, avance por varias comarcas, nieve, bastimento y su secuencia,
  órdenes, dos jugadores iguales y órdenes barajadas con la misma huella).

Decisiones tomadas al implementar:

- **Sin bastimento, la recua malvive en vez de quedarse parada para siempre.** El primer turno se
  para y avisa; desde el segundo anda al paso mínimo sin pagar y pierde una acémila por turno, hasta
  quedarse con una. Con la regla literal («sigue detenida») una recua sin pan fuera de casa no podría
  volver nunca, y el diseño exige que siempre pueda.
- **Porte = acémilas × 1 carga** (`portePorAcemila`) más lo que dé la casa; se quitó `porteBase`,
  que duplicaba el dato. Perder una acémila es −1 de porte (la ficha; `docs/03` decía −2).
- **Los maravedís no ocupan porte** ni cuentan para ir cargada.
- **La calzada suma paso si la tiene el primer tramo del turno**; el paso se fija una vez por turno.
- **La sal de conservas se redondea hacia arriba** (una carga por cada cuatro jornadas o fracción):
  si no, una recua de tres jornadas por turno no gastaría nunca sal.
- **Una ruta circular empieza y acaba donde está la recua**, y cada comarca en la que entra vuelve al
  final de la lista: no hace falta guardar el circuito aparte.
- **Si la nieve pilla a una recua a medio puerto, vuelve** a la comarca de la que salió y espera.
- **Con escasez no sale ninguna expedición**: se bloquea la orden `ruta` de una recua parada; la que
  va de camino puede cambiar de rumbo.
- **Rutas solo por comarcas exploradas o propias**; el destino basta con conocerlo de oídas. La
  distancia administrativa de T-032 usa ahora el mismo criterio.
- `pasoRecuaMil` de las casas es **aditivo** (arrieros: +1000), no un factor.
- Quedan anotados en sus fichas: acciones de las paradas y carga en mercado (T-034), reponer
  bastimento en ruta permanente (T-045), rutas de rebaños (T-040) y caminos construidos (T-035).
- Las pruebas viven en `paquetes/nucleo/pruebas/` y no en `src/reglas/*.test.ts`, como exige el
  montaje.
