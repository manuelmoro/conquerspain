# T-038 · Fase 8: influencia e incorporación de comarcas

**Fase:** 2 · Motor · **Depende de:** T-034 · **Estado:** hecha

## 1. Contexto

Así se consigue tierra sin guerra, y así se compite por ella cuando hay rivales. Es la mecánica que
sustituye al «pulsar antes» por «llevar meses cortejando al concejo».

Lee antes: [docs/06-competicion.md](../06-competicion.md) §6.2.

## 2. Objetivo

Calcular la influencia de cada jugador en cada comarca neutral que conoce, y resolver las órdenes de
incorporación con reglas explícitas de empate.

## 3. Alcance

**Entra:** acumulación y pérdida de influencia, orden `incorporar` con sus requisitos, resolución de
disputas, y el regreso a neutral de comarcas desleales (enganchado con T-036).

**No entra:** fundación de puebla (T-034), amparo del novato (T-105).

**Heredado de T-036.** La vuelta a neutral de la comarca desleal ya está hecha en la fase 8
(`volverANeutral` en `fases/08-territorio.ts`): el antiguo dueño se queda con influencia igual a la
lealtad que le quedaba. La influencia se añade a esa misma fase, después de la lealtad.

**Heredado de T-034.** Una recua cuenta como presente si `estaPresente(recua, comarca)`
(`reglas/presencia.ts`): quieta en una comarca neutral con cometido `presencia` y que ha podido
pagar su bastimento este turno. Esa es la condición de los +2 de influencia por presencia.

**Heredado de T-037.** La influencia por comercio (`porComercioPorCadaCincuenta`) se lee de los
sucesos `mercado.trato` del turno: cada uno trae el `jugador`, la `comarca` de la plaza y el
`importe` en maravedís. La fase 7 corre antes que la 8, así que ya están todos en `ctx.sucesos`.

## 4. Diseño detallado

Todo vive en la fase 8, **después de la lealtad** y por este orden: los regalos, la influencia de cada
comarca neutral y las incorporaciones. Así las incorporaciones se resuelven con la influencia ya
actualizada de ese turno (docs/02 §2.4.2) y con los sucesos de la fase 7 ya escritos.

### 4.1 Estado nuevo en la comarca

Solo tiene sentido mientras la comarca es neutral (se vacía cuando alguien la incorpora o la funda):

```ts
presenciaSeguida: Record<IdJugador, number>; // turnos seguidos con una recua presente (desempate)
ultimoRegalo: Record<IdJugador, number>;     // turno del último regalo al concejo
exDuenyo: IdJugador | null;                  // quien la tuvo antes de que se fuera (fase 8, T-036)
```

`exDuenyo` existe para la fuente de monasterio: una obra mayor no guarda quién la levantó, y hoy solo
se levanta en comarca propia, así que el único monasterio que puede haber en una comarca neutral es el
del que la perdió. Cuando T-041 permita obras en comarca ajena, se ampliará aquí.

### 4.2 Influencia por turno

Para cada comarca neutral y cada jugador que la conoce (`oida`, `explorada` o `propia`), sobre la
**foto de inicio del paso** (así el orden de comarcas y jugadores no cambia nada):

| Fuente | Cuánto | Cómo se mide |
|---|---|---|
| Presencia | +2 | una recua del jugador con `estaPresente(recua, comarca)`; varias cuentan una vez |
| Comarcas propias vecinas | +1 por cada una, máximo +3 | vecinas en el grafo del mundo |
| Mercado propio vecino | +1 | alguna vecina propia con edificio de mercado |
| Comercio | +1 por cada 50 mrs, máximo +3 | suma del `importe` de sus `mercado.trato` de este turno en una plaza de esa comarca |
| Monasterio | +2 | `exDuenyo` es el jugador y la comarca conserva su monasterio |
| Camino | +1 | algún tramo mejorado (`EstadoPartida.caminos`) entre la comarca y una vecina propia |
| Regalo | +5 inmediato | orden `regalo`, ver §4.3 |

Y se resta, con **un solo recorte a 0..100 al final** (no fuente a fuente):

- **−1** si no hubo presencia ni comercio del jugador en la comarca este turno;
- **−5** si provocó escasez ahí. Se entiende como *vaciar el mercado de pan*: una compra suya de pan
  en una plaza de la comarca que se queda sin casar por `volumen-de-plaza` (la plaza no da más).

Cada cambio deja un suceso `influencia.fuentes` con las siete fuentes, el desgaste, la escasez, el
cambio neto y el total, para poder explicar cualquier cifra. La **presencia seguida** sube un turno si
hubo presencia y se pone a cero si no.

### 4.3 Orden `regalo` (docs/06 §6.2)

`OrdenRegalo { comarca }`: cuesta 50 mrs (los reserva el alta) y da +5 de influencia inmediata al
concejo de una comarca neutral que el jugador conoce. Una vez cada 4 turnos por jugador y comarca; si
todavía no toca, la orden espera (`regalo-reciente`). Se cancela si la comarca tiene dueño
(`comarca-con-duenyo`) o el jugador no la conoce (`comarca-desconocida`).

### 4.4 Orden `incorporar`

Requisitos, comprobados **al empezar** (`impedimentoDeIncorporar`, con motivo legible) y, en la
interfaz, al dar la orden:

1. `comarca-con-duenyo`: la comarca es neutral (si no, la orden se cancela y se devuelve el coste);
2. `influencia-baja`: influencia ≥ 60;
3. `sin-ventaja`: es el jugador con más influencia y le saca ≥ 15 puntos al segundo;
4. `muy-lejos`: tiene comarca propia a ≤ 6 jornadas por camino **conocido** (en verano, con los
   puentes y calzadas construidos, como la administración);
5. `escasez`: no está en escasez. Los recursos (40 de pan y 30 mrs) los reserva el alta.

Si falla algo distinto de (1), la orden **espera** con ese motivo y se revalida cada turno. Al
empezar paga su coste y queda `en curso`; cada turno en curso, incluido el primero, suma un turno de
los tres. Una orden duplicada del mismo jugador sobre la misma comarca se cancela (`orden-duplicada`).
Si mientras corre la comarca deja de ser neutral, se cancela y se **devuelve el coste íntegro**.

Al terminar la comarca pasa a propia con lealtad 60, conserva su población y sus edificios, el
jugador la conoce como `propia` y su producción y consumo entran desde el turno siguiente.

### 4.5 Disputa

Las órdenes de distintos jugadores que terminan **el mismo turno** sobre la misma comarca compiten:

1. gana el de **mayor influencia**;
2. si empatan, el de **más presencia seguida**;
3. si siguen empatados, el menor `hash32(semilla | turno | incorporar:comarca | jugador)`.

Los perdedores **recuperan el coste íntegro**, no pierden influencia por la disputa y reciben
`incorporar.perdida` con el jugador que ganó y su nombre (cortejar a un concejo es público).

Con el requisito 3, dos jugadores no pueden *empezar* a la vez sobre la misma comarca, así que la
disputa es una red de seguridad para estados guardados y para los cambios de reglas de fases
posteriores (T-101); por eso se prueba con estados montados a mano, como las fundaciones de puebla.

### 4.6 Previsión para la interfaz

```ts
export function previsionIncorporar(estado, comarca, jugador, mundo, reglas): {
  costeTotal: Recursos;
  balancePanAntesMil: Milesimas;
  balancePanDespuesMil: Milesimas;
  turnosDeReservaDespues: number | null;   // null: la reserva no baja
  administracionExtra: number;             // mrs por turno
};
```

`balancePanMil(estado, jugador, reglas)` es `pan producido el último turno − pan de la gente − pan de
las cuadrillas`, en milésimas y **sin merma** (esa depende del granero y de la sal del momento). La
comarca incorporada aporta lo que produjo la última vez (`produccionUltimoTurno`, cero si nunca fue
de nadie) y la población que tiene. `administracionExtra` es la diferencia entre lo que cuesta
administrar el dominio con esa comarca y sin ella. La previsión calcula sobre `estadoTrasIncorporar`, una transformación pura del estado, y un test
corre la fase real y comprueba que hace exactamente lo mismo.

### 4.7 Tabla `influencia`

Las cifras que ya tenía la tabla de ejemplo pasan a `src/datos/influencia.ts`, más dos que estaban
escritas en la lógica: `desgastePorEscasez` (5) y `maravedisPorPuntoDeComercio` (50).

## 5. Archivos

```
paquetes/nucleo/src/fases/08-territorio.ts       (llama a los tres pasos nuevos)
paquetes/nucleo/src/fases/08-influencia.ts       (regalos, influencia e incorporaciones)
paquetes/nucleo/src/reglas/{influencia,incorporar}.ts
paquetes/nucleo/src/datos/influencia.ts
paquetes/nucleo/src/{cambios,ordenes}.ts
paquetes/nucleo/src/tipos/{estado,ordenes,reglas}.ts
paquetes/nucleo/src/validacion/{validarEstado,validarOrden,validarTablas}.ts
paquetes/nucleo/pruebas/{influencia,incorporar}.test.ts
paquetes/nucleo/pruebas/{ejemplos,mundo-mini}.ts
```

Los tests viven en `pruebas/` y las tablas en `src/datos/`, como en T-031 a T-037.

## 6. Criterios de aceptación

1. La influencia nunca sale de 0..100 y su cálculo es idéntico al barajar el orden de jugadores.
2. Las siete fuentes de influencia se aplican con sus topes (test por fuente).
3. Los requisitos de incorporación se comprueban y devuelven motivo legible cuando fallan (los
   cuatro de la ficha original, más la comarca con dueño).
4. La disputa se resuelve por los tres criterios en ese orden, con test de cada empate.
5. Los perdedores recuperan el coste íntegro y la disputa no les resta influencia (con la comarca
   ya propia de otro, la cuenta del concejo se cierra para todos, como al fundar una puebla).
6. `previsionIncorporar` coincide exactamente con lo que ocurre al incorporar (test: previsión vs.
   resultado real tras correr la fase).
7. Un regalo da +5, cuesta 50 mrs y no se repite antes de 4 turnos.
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/pruebas/influencia.test.ts paquetes/nucleo/pruebas/incorporar.test.ts
npm run partidas
```

Las partidas de reproducción cambian de huella a propósito: `EstadoComarca` gana tres campos.
Se regeneran con `npm run partidas -- --confirmo` tras comprobar que solo cambia eso.

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-039). Commit: `T-038: influencia e incorporacion de comarcas`.

## 9. Resultado (18-09-2026)

Tarea cerrada. 557 tests en verde (58 nuevos); las partidas de reproducción `humo-01` y `humo-02`
cambian de huella a propósito, porque el estado guardado gana tres campos por comarca.

- `fases/08-influencia.ts` (regalos, influencia de cada comarca neutral e incorporaciones), llamada
  por `08-territorio.ts` después de la lealtad.
- `reglas/influencia.ts` (las fuentes, el desgaste y la actividad de la fase 7),
  `reglas/incorporar.ts` (requisitos, ganador de la disputa, `estadoTrasIncorporar`,
  `balancePanMil` y `previsionIncorporar`) y `datos/influencia.ts` (la tabla real).
- Orden nueva `regalo`; `ordenesEnCurso` en `src/ordenes.ts`; cambios `presencia-seguida` y `regalo`,
  y `duenyo` ahora apunta el `exDuenyo` y borra las cuentas del concejo al incorporarse.
- `EstadoComarca` gana `presenciaSeguida`, `ultimoRegalo` y `exDuenyo` (validados: solo las neutrales
  los llevan). Los estados guardados de `humo-01` y `humo-02` se migraron añadiéndolos, y se comprobó
  con un `worktree` del commit anterior que, salvo esos campos, los quince turnos dan estados idénticos.
- `DatosInfluencia` renombra `porComercioPorCadaCincuenta` a `porBloqueDeComercio` y gana
  `maravedisPorBloqueDeComercio` y `desgastePorEscasez`, que estaban escritos en la lógica.
- Pruebas en `pruebas/influencia.test.ts` y `pruebas/incorporar.test.ts`, y una comprobación de que
  cuatro mutaciones del código —quitar la ventaja de 15, ignorar la presencia en el desempate,
  no devolver el coste a los perdedores y contar desgaste con presencia— las hacen fallar.

Decisiones tomadas al implementar (escritas en docs/06 §6.2):

- **El estado guarda tres cosas nuevas** porque tres fuentes no se pueden derivar: la racha de
  presencia (desempate), el último regalo (enfriamiento) y el antiguo dueño (monasterio).
- **Escasez provocada** = una compra de pan que se queda sin casar por `volumen-de-plaza`. El diseño
  decía «vaciar su mercado de pan» sin definirlo; esta es la única señal que el motor tiene.
- **Monasterio**: hoy solo se levanta en comarca propia, así que el único que puede haber en una
  neutral es el del que la perdió; la fuente le da +2 a él. T-041 la ampliará si permite obras
  en comarca ajena.
- **Camino**: cuenta cualquier tramo mejorado entre la comarca y una vecina propia (el estado no
  guarda de quién es un tramo, y las obras de tramo salen siempre de una comarca propia).
- **Duración**: el turno en que empieza ya cuenta como el primero de los tres.
- **La disputa** es una red de seguridad: con el requisito de 15 puntos, dos jugadores no pueden
  empezar a la vez sobre una comarca. Se prueba con estados montados a mano, como las pueblas. La
  influencia ya está actualizada cuando se resuelve, y con ella la racha de presencia.
- **Los perdedores** no pierden influencia por la disputa, pero con la comarca propia de otro su
  cuenta desaparece como la de todos; la de quien la perdió por deslealtad sí se conserva.
- **La previsión** usa lo producido el último turno (`produccionUltimoTurno`) de todo el dominio,
  incluida la comarca que se incorpora, y no cuenta la merma.

