# T-032 · Fase 3: consumo, merma y escasez

**Fase:** 2 · Motor · **Depende de:** T-031 · **Estado:** **hecha** (18-09-2026)

## 1. Contexto

La presión del juego. Aquí se decide si tu gente come, si el granero aguanta el invierno y si este
turno se te paran las expediciones.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.1 y §3.6,
[docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.4.1.

## 2. Objetivo

Aplicar consumo de pan, salarios y mantenimientos; calcular la merma del almacén; determinar la
escasez y sus efectos, con avisos claros antes de que ocurra.

## 3. Alcance

**Entra:** consumo de población, cuadrillas y recuas; mantenimiento de aperos; administración en
maravedís; merma del pan; regla de escasez y sus consecuencias.

**No entra:** crecimiento y lealtad (T-036), mercado (T-037).

## 4. Diseño detallado

### 4.1 Consumo

| Concepto | Cantidad |
|---|---|
| Población | ¼ de pan por vecino y turno (250 milésimas; ver §9) |
| Cuadrilla ocupada en obra | 2 pan por turno |
| Recua en ruta | 2 pan por jornada recorrida (lo cobra la fase de movimiento, no esta) |
| Aperos | 1 hierro por nivel y comarca |
| Administración | maravedís según [docs/03-economia.md](../03-economia.md) §3.9 |

El consumo se cobra del **almacén disponible** (almacén menos lo reservado por órdenes pendientes):
lo reservado es intocable, porque el jugador ya contó con ello.

### 4.2 Orden de cobro

1. Pan de la población.
2. Pan de las cuadrillas.
3. Hierro de los aperos.
4. Maravedís de la administración.

Cada uno, si no se puede pagar, tiene su consecuencia propia (no se «toma prestado» de otro recurso):

| No se puede pagar | Consecuencia |
|---|---|
| Pan | **Escasez** (§4.4) |
| Hierro | Los aperos bajan un nivel tras dos turnos consecutivos sin pago; aviso desde el primero |
| Maravedís | Deuda de administración: la lealtad de las comarcas baja 2 por turno mientras dure, empezando por las más lejanas |

### 4.3 Merma

```
mermaMil = 40                                 // 4 % base
si hay granero en alguna comarca propia:  mermaMil −= 20 × min(1, graneros)
si se gasta sal: 1 sal por cada 50 de pan almacenado → mermaMil −= 20
mermaMil = limitar(mermaMil, 0, 40)
panPerdido = porcentaje(panAlmacenado, mermaMil)
```

La sal se gasta automáticamente si hay, salvo que el jugador lo desactive con una orden de política.
El gasto se anuncia en la crónica («se gastaron 3 cargas de sal en conservar el granero»).

### 4.4 Escasez

```
disponible = almacen.pan − reservado.pan
si disponible < consumoTotalDePan:
    almacen.pan -= disponible          // queda en cero; NUNCA negativo
    jugador.escasez = true
    faltante = consumoTotalDePan − disponible
```

Efectos mientras haya escasez:

- no se inician expediciones nuevas (las en curso continúan: su bastimento ya se pagó);
- no se inician obras nuevas;
- no hay crecimiento de población;
- la lealtad baja 5 por turno en todas las comarcas propias;
- a partir de la tercera escasez consecutiva, cada comarca pierde el 3 % de sus vecinos por
  emigración, con aviso en las dos anteriores.

Al recuperar el abastecimiento, todo se reanuda y las órdenes «en espera» vuelven a validarse.

### 4.5 Aviso anticipado

La fase calcula también la **previsión**: con el balance actual, cuántos turnos aguanta la reserva.
Si son menos de tres, emite `consumo.aviso-hambre` con la cifra, para que la crónica lo destaque.
El jugador nunca debe llegar a la escasez sin haber sido avisado.

### 4.6 Insumos de los edificios y economía de arranque

Añadido al implementar (T-031 dejó aquí el consumo de los edificios):

- La carbonera paga 4 madera por nivel y la lonja 2 sal por nivel **al empezar la fase 2**, de lo
  disponible al empezar el turno y de la comarca más cercana a la capital a la más lejana. El nivel
  que no paga se para (`produccion.sin-insumo`). La ferrería trabaja como mucho tantos niveles
  como carboneras encendidas haya en su comarca. Se cobra en la fase 2 y no en la 3 porque el
  insumo decide lo que se produce en el mismo turno; cobrarlo después daría un turno de desfase.
- La tabla `arranque` (almacén inicial y edificios de origen) define la «economía de partida» del
  criterio 7. La aplica el alta de partida (T-065).

## 5. Archivos

```
paquetes/nucleo/src/fases/03-consumo.ts
paquetes/nucleo/src/reglas/{consumo,merma,escasez}.ts
paquetes/nucleo/src/reglas/*.test.ts
```

## 6. Criterios de aceptación

1. El pan nunca queda negativo, en ninguna combinación (test de propiedad con 10 000 estados
   generados con semilla fija).
2. Lo reservado por órdenes pendientes no se toca jamás (test).
3. La merma se aplica con las tres combinaciones (sin granero, con granero, con granero y sal) y da
   los valores esperados escritos a mano.
4. La escasez activa exactamente los cinco efectos de §4.4 y los desactiva al recuperarse.
5. La emigración empieza en la tercera escasez consecutiva, ni antes ni después.
6. El aviso de hambre aparece cuando quedan menos de tres turnos de reserva.
7. Una partida de prueba de 24 turnos sin intervención muestra la tensión invernal esperada: reservas
   acumuladas en verano y descenso en invierno sin llegar a escasez con la economía de partida.
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/consumo.test.ts paquetes/nucleo/src/reglas/escasez.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-033). Commit: `T-032: consumo, merma y escasez`.

## 9. Resultado (18-09-2026)

Tarea cerrada. 331 tests en verde; `humo-01` regenerada a propósito (el motor ya come).

- `paquetes/nucleo/src/fases/03-consumo.ts`: por jugador, pan de la gente y de las cuadrillas,
  hierro de los aperos, administración, merma, escasez y avisos (`consumo.pan`,
  `consumo.aviso-aperos`, `consumo.administracion`, `consumo.merma`, `escasez.empieza|sigue|termina`,
  `consumo.aviso-emigracion`, `consumo.aviso-hambre`).
- `paquetes/nucleo/src/reglas/consumo.ts` (consumo, jornadas a la capital por Dijkstra sobre lo
  conocido, orden de cercanía, costes de administración, turnos de reserva), `merma.ts`,
  `escasez.ts` (`permiteIniciar`, `permiteCrecer`, emigración) e `insumos.ts`.
- `paquetes/nucleo/src/datos/consumo.ts` y `arranque.ts`: tablas nuevas `consumo` y `arranque`.
- `paquetes/nucleo/pruebas/consumo.test.ts`: 24 casos, entre ellos la propiedad sobre 10 000
  estados generados con semilla fija, las tres combinaciones de merma, la emigración exacta en la
  tercera escasez y el año de arranque.

Decisiones tomadas al implementar:

- **Un cuarto de pan por vecino** (`consumoPorVecinoMil: 250`), no uno entero: con un pan por
  vecino, una comarca de origen típica (75 vecinos) no se alimentaba ni con todos sus solares en
  granjas, y el criterio 7 era imposible. `docs/03` §3.6 lo explica. Queda sujeto al ajuste de
  equilibrio de T-047.
- **Hambre prolongada**: desde la tercera escasez seguida la lealtad cae 10 y no 5 (lo dice
  `docs/03` §3.6) y emigra el 3 % de cada comarca, al menos un vecino.
- **La deuda de administración corta en seco**: se paga de la comarca más cercana a la más
  lejana y, en cuanto una no llega, esa y todas las más lejanas pierden 2 de lealtad.
- **La sal de las conservas es una política del jugador** (`EstadoJugador.conservarConSal`), porque
  el pan está en el almacén común; la orden `politica` que la cambia es de T-036.
- **Los aperos se pagan por comarca**, también por cercanía; el contador de turnos sin hierro
  vive en `EstadoComarca.turnosSinMantenimiento`.
- **Las tablas de fueros exigen las tres claves** (`registroCompleto(FUEROS, …)`): antes aceptaban
  cualquier clave y el motor tenía que suponer un valor por defecto.
- **Efectos de la escasez en otras fases**: esta fase marca la escasez y aplica lealtad y
  emigración; no iniciar expediciones ni obras ni crecer lo comprueban T-033, T-035 y T-036 con
  `permiteIniciar` y `permiteCrecer` (anotado en sus fichas). La revalidación de las órdenes «en
  espera» al levantarse la escasez es de T-034/T-045.
- El aviso de hambre usa el balance de este turno (producción − consumo − merma); no anticipa el
  cambio de estación. La crónica (T-044) puede afinarlo con la previsión del cliente.
- Las pruebas viven en `paquetes/nucleo/pruebas/consumo.test.ts` y no en `src/reglas/*.test.ts`:
  así lo exige el montaje (el núcleo no ve tipos de Node; sus pruebas, sí).
