# T-040 · Rebaños, pastos y trashumancia

**Fase:** 2 · Motor · **Depende de:** T-033, T-037 · **Estado:** hecha

## 1. Contexto

La trashumancia es el guiño histórico mayor del juego y, a la vez, una estrategia completa: un plan
anual con dos viajes largos, un solo cobro y mucho que perder si sale mal.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.8,
[docs/05-geografia.md](../05-geografia.md) §5.4, [docs/04-casas-y-tradiciones.md](../04-casas-y-tradiciones.md) §4.1.1.

## 2. Objetivo

Implementar el rebaño como unidad móvil con su ciclo anual: pastos según estación, cañadas, esquileo
en mayo, calidad de la lana y aportes a la comarca donde inverna.

## 3. Alcance

**Entra:** unidad rebaño, movimiento por cañadas, pastos estacionales, calidad, esquileo, estiércol y
producción menor; privilegio de la Mesta enganchado (detalle en T-041).

**No entra:** venta de la lana (T-037, ya hecho), portazgos (T-103).

**Heredado de T-033.** La orden `ruta` con `rebanyo` no la atiende nadie todavía (la fase 4 solo
toma las de recua) y queda pendiente hasta esta tarea. Se reutilizan `rutaMasCorta`, `avanzar` y el
ciclo de vida de `src/ordenes.ts`.

**Heredado de T-037.** La lana del esquileo entra en el almacén, no en una recua: para venderla hay
que cargarla (`cargar` en una parada de comarca propia o la orden `carga`) y llevarla a una plaza.
Precio base de la lana: 50 mrs por saca (`src/datos/recursos.ts`).

**Heredado de T-039.** La peste de ganado dura hasta el turno del esquileo y trae un efecto `lana`
de ×750 en su región: el reparto de la lana tiene que multiplicar lo que da cada rebaño por
`factorDeAcontecimientos(estado.acontecimientos, turno, 'lana', { region, comarca }, 'lana')`
(`reglas/acontecimientos.ts`). Hoy nadie lo consulta porque todavía no hay esquileo.

## 4. Diseño detallado

### 4.1 Unidad y estado

`Rebanyo` (ya en el estado) cambia de campos, porque ninguna partida guarda todavía rebaños:

```ts
export interface Rebanyo {
  id: IdRebanyo; jugador: IdJugador; nombre: string;
  situacion: SituacionMovil;            // igual que la recua
  ruta: readonly IdComarca[];           // sin circular: la ida y la vuelta son dos órdenes al año
  cabezas: number;                      // 1000 por rebaño estándar
  pastoDelAnyoMil: number;              // suma de lo pastado cada turno (1000 = un turno entero)
  turnosSinPasto: number;               // turnos seguidos sin nada que comer
}
```

`EstadoComarca` gana `turnosDeAbono` (turnos de invernada de rebaños propios este año) y `estiercol`
(niveles de estiércol, de 0 a 3). Se migran los estados guardados de las partidas de reproducción.

### 4.2 Formar un rebaño (`formar-rebanyo`)

Cuesta 60 mrs (los reserva el alta) y 2 vecinos, que se van con el ganado y no vuelven (los
pastores). Solo en una comarca propia y no desleal, con más gente que pastores, y con exactamente
`cabezasPorRebanyo` (1000) cabezas. Nace quieto, con los contadores a cero. Se llama «Rebaño de
<comarca>» (y `2`, `3`… si ya hay).

### 4.3 Pasto correcto y capacidad

Una comarca es **pasto correcto** este turno si tiene `pasto ≥ 2` y, según la estación del pasto de
`EstadoEstacional` (verano: turnos 9–18; invierno: el resto):

- en **pasto de verano** (rasgo `pasto-de-verano`), solo en verano;
- en **pasto de invierno** (rasgos `pasto-de-invierno`, `dehesa` y `montado`), solo en invierno.

Su capacidad es `pasto × 1000` cabezas. Si los rebaños presentes (de cualquier jugador) suman más,
se reparte con `repartoProporcional` y cada uno pasta `alimentadas / cabezas` de ese turno. Un
rebaño **en camino** pasta entero si va por una cañada (el ganado come mientras anda) y nada si va
por otro camino; y un rebaño que sigue por una cañada pasta entero aunque el turno acabe en una
comarca del camino (sin repartirse la capacidad: la cañada es un corredor de pasto). Es la razón de
usar las cañadas.

### 4.4 Movimiento

Como la recua (`avanzar`, los mismos costes de tramo y los mismos puertos cerrados), con otro paso:
2 jornadas por turno, +1 si el primer tramo del turno es una cañada, −1 con barro, mínimo 1. No paga
bastimento. Las órdenes `ruta` de un rebaño siguen el ciclo de siempre; **no admiten `circular`**
(`ruta-circular-de-rebanyo`), y sus paradas solo dicen comarcas.

**Tierra ajena.** Hasta que T-103 traiga portazgos y acuerdos, un rebaño entra en una comarca
neutral o propia por cualquier camino; en la de **otro jugador**, solo por una cañada y solo si su
casa tiene `pasoFrancoPorCanyada` (la Mesta). Ese es el privilegio de la Mesta hecho mecánica. Al
trazar la ruta las cañadas cuestan la mitad, para que el camino más corto sea la cañada.

**Puertos.** Cada turno, un rebaño con ruta que tiene por delante un puerto que va a cerrar **dentro
de exactamente dos turnos** recibe `rebanyo.aviso-puerto`. Si llega y está cerrado, se detiene
(`rebanyo.detenido`); si la nieve lo pilla a medio puerto, vuelve (`rebanyo.vuelve-por-nieve`).

### 4.5 Ciclo anual y esquileo

Cada turno, después de moverse, el rebaño suma a `pastoDelAnyoMil` lo que ha pastado. En el turno 10
(segunda quincena de mayo), en la fase de producción:

```
calidadMil = pastoDelAnyoMil / 24
lana = 12 sacas × (cabezas / 1000) × calidad × lanaEsquileoMil de la casa × peste de la región
```

y `pastoDelAnyoMil` vuelve a 0. **La calidad se mide sobre el año entero (24 turnos), no sobre los
turnos que lleva el rebaño**: la ficha dividía por `turnosDelAnyo`, y comprar un rebaño el turno
antes del esquileo daría 12 sacas por 60 mrs. Un rebaño que hace el ciclo entero da 12; uno que se
queda todo el año en pasto de verano, 4.

### 4.6 Otros aportes y riesgos

- **Pan**: 2 al turno por cada 1000 cabezas, al almacén del dueño (fase 2).
- **Pérdida**: con `turnosSinPasto ≥ 2` (sin pasto en absoluto, no a medias) el rebaño pierde un 5 %
  de las cabezas en cada turno desde el segundo, como mínimo una. A cero cabezas desaparece.
- **Estiércol**: cada turno de invierno que un rebaño pasta en una comarca **propia** de su dueño
  suma uno a `turnosDeAbono`. En el esquileo, si son ≥ 10 la comarca gana un nivel de estiércol (tope
  3) y si no pierde uno; `turnosDeAbono` vuelve a 0. Cada nivel da +5 % a la producción de pan de la
  labor (granja y huerta). Es el motivo para invernar en casa.
- **Peste de ganado**: el esquileo pide a `factorDeAcontecimientos(..., 'lana', ...)` el de la
  región donde está el rebaño ese turno.

### 4.7 Tabla `ganaderia` (`src/datos/ganaderia.ts`)

`cabezasPorRebanyo` 1000, `vecinosPorRebanyo` 2, `pasoBaseMil` 2000, `pasoCanyadaMil` 1000,
`pastoMinimo` 2, `cabezasPorPuntoDePasto` 1000, `sacasPorRebanyo` 12, `panPorTurno` 2,
`turnosSinPastoParaPerder` 2, `perdidaPorSinPastoMil` 50, `turnosDeInvernadaParaAbono` 10,
`abonoPorNivelMil` 50, `nivelesDeAbono` 3, `avisoDePuertoTurnos` 2, `costeCanyadaMil` 500.

### 4.8 Sucesos

`rebanyo.forma`, `rebanyo.llega`, `rebanyo.detenido`, `rebanyo.vuelve-por-nieve`,
`rebanyo.aviso-puerto`, `rebanyo.sin-pasto` (con `motivo`: `estacion`, `sin-pasto`, `saturado`,
`camino`), `rebanyo.pierde-cabezas`, `rebanyo.esquileo`, `comarca.estiercol`.

## 5. Archivos

```
paquetes/nucleo/src/fases/04-movimiento.ts        (formar, ruta, mover y pastar rebaños)
paquetes/nucleo/src/fases/02-produccion.ts        (esquileo, pan y estiércol anual)
paquetes/nucleo/src/reglas/{pastos,rebanyos,esquileo}.ts
paquetes/nucleo/src/reglas/{ruta,produccion}.ts   (opciones de ruta y factor de estiércol)
paquetes/nucleo/src/datos/ganaderia.ts
paquetes/nucleo/src/{cambios,tipos/*,validacion/*}.ts
paquetes/nucleo/pruebas/rebanyos.test.ts
```

## 6. Criterios de aceptación

1. Un rebaño que hace el ciclo completo (pasto de verano en verano, dehesa en invierno) entrega 12
   sacas por cada 1 000 cabezas; uno que se queda quieto todo el año en pasto de verano entrega menos
   de 7 (test de escenario con cifras).
2. El reparto de pasto entre varios rebaños es proporcional y determinista.
3. Un rebaño atrapado por un puerto cerrado se detiene y se avisa dos turnos antes.
4. La pérdida de cabezas ocurre exactamente al segundo turno sin pasto.
5. El estiércol se acumula hasta el tope, se aplica desde el esquileo y se pierde sin invernada.
6. El esquileo ocurre solo en el turno 10 y reinicia el contador.
7. La peste de ganado reduce el esquileo solo en su región.
8. La Mesta cruza tierra ajena por cañada; otra casa, no.
9. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/pruebas/rebanyos.test.ts
npm run partidas
```

Las partidas de reproducción cambian de huella a propósito (`EstadoComarca` gana dos campos):
`npm run partidas -- --confirmo` tras comprobar que solo cambia eso.

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-041). Commit: `T-040: rebanyos, pastos y trashumancia`.

## 9. Resultado (19-09-2026)

Tarea cerrada. 644 tests en verde (45 nuevos); las partidas de reproducción `humo-01` y `humo-02`
cambian de huella a propósito (`EstadoComarca` gana `turnosDeAbono` y `estiercol`), y se comprobó
con un `worktree` del commit anterior que, salvo esos campos, los quince turnos dan estados idénticos.

- `fases/04-rebanyos.ts` (formar, ruta, movimiento, aviso de puertos y pasto) llamada por la fase de
  movimiento después de las recuas; `fases/02-rebanyos.ts` (pan, esquileo y estiércol anual) llamada
  al final de la producción.
- `reglas/pastos.ts` (pasto correcto, capacidad y reparto), `reglas/rebanyos.ts` (paso, tierra ajena,
  pérdidas, puertos por cerrar) y `reglas/esquileo.ts` (calidad, lana, estiércol).
- `reglas/ruta.ts` gana `OpcionesDeRuta` (`permite` y `pesoMil`) sin cambiar lo que hace para las
  recuas; `reglas/produccion.ts`, un factor `estiercol` en el desglose de la labor.
- `Rebanyo` se rehace (`pastoDelAnyoMil`, sin ruta circular ni `turnosDelAnyo`), cambios
  `rebanyo-alta/baja/mover/cuentas/cabezas` y `abono`, y la tabla `ganaderia`.
- Pruebas en `pruebas/rebanyos.test.ts`, entre ellas el año entero de un rebaño y 5 000 repartos de
  pasto al azar, y cinco mutaciones del código (perder un turno tarde, medir la calidad sobre medio
  año, permitir tierra ajena sin cañada, avisar del puerto todos los turnos y esquilar siempre) que
  hacen fallar los tests.

Decisiones tomadas al implementar (escritas en docs/03 §3.8):

- **La calidad se mide sobre 24 turnos**, no sobre `turnosDelAnyo`: si no, comprar un rebaño el
  turno antes del esquileo daría 12 sacas por 60 mrs. Por eso `turnosDelAnyo` desaparece del estado.
- **La cañada es un corredor de pasto**: la primera versión solo contaba los tramos, y un rebaño que
  acababa el turno en una comarca intermedia perdía un turno de pasto; el ciclo perfecto daba 11
  sacas y no 12. Lo destapó el test del año entero.
- **Sin ruta circular**: la trashumancia son dos órdenes al año (las programará el plan de temporada
  de T-045), no un vaivén sin fin.
- **Tierra ajena**: el privilegio de la Mesta se hace mecánica ahora —cruzar comarcas de otro por la
  cañada— porque los portazgos son de T-103. Las cañadas pesan la mitad al elegir camino.
- **El turno en que se forma, el rebaño ya pasta** (o no): si nace en primavera en un llano sin
  pasto, ya lleva un turno sin comer.
- **Pérdida desde el segundo turno, cada turno**, con un mínimo de una cabeza; no basta con un pasto
  a medias para librarse, pero tampoco cuenta como falta.
- **Estiércol con desgaste**: sube con la invernada y baja sin ella, para que sea una decisión
  seguir invernando en casa y no un premio permanente.

