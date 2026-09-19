# T-045 · Colas, rutas permanentes, mayordomo y plan de temporada

**Fase:** 2 · Motor · **Depende de:** T-044 · **Estado:** hecha

## 1. Contexto

Esta es **la tarea que garantiza el principio fundacional**: conectarse más veces no puede dar
ventaja. Sin mayordomo ni órdenes permanentes, quien entre cada hora gana; con ellos, quien piense
mejor gana.

Lee antes: [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.5,
[docs/06-competicion.md](../06-competicion.md) §6.4.

## 2. Objetivo

Que un jugador pueda dejar programada su economía durante días: colas de obras, rutas circulares,
reglas de mayordomo y plan de temporada, todo determinista y todo visible.

## 3. Alcance

**Entra:** colas por comarca y por recua, rutas circulares con precios límite, mayordomo con reglas
condicionales, plan de temporada de hasta seis turnos y su interacción con la validación.

**No entra:** interfaz (T-082) ni notificaciones (T-064).

**Heredado de T-044.** Cada entrada de la crónica trae `accionSugerida` (un `TipoDeOrden`): es el
enganche natural para las reglas del mayordomo («si falta pan, comprar»). Los avisos que exigen
decisión van en la sección `avisos`, primero.

**Heredado de T-040.** Las rutas de un rebaño **no son circulares** (la orden se cancela con
`ruta-circular-de-rebanyo`): la trashumancia son dos órdenes al año, subir en primavera y bajar en
otoño. Programarlas es tarea del plan de temporada y del mayordomo de esta tarea, con la fecha
adecuada (el último turno de verano para bajar; el último de invierno para subir) y con el aviso de
puertos (`rebanyo.aviso-puerto`, dos turnos antes) como condición natural.

**Heredado de T-033.** Las rutas circulares ya existen (un circuito que empieza y acaba donde está
la recua; al entrar en cada comarca, esta vuelve al final de `Recua.ruta`). Falta que una recua en
ruta permanente reponga su bastimento al pasar por comarca propia: hoy solo come del almacén si
**empieza** el turno en comarca propia, y una ruta larga sin carga de pan acaba malviviendo.

## 4. Diseño detallado

### 4.1 Colas

- **Por comarca**: lista ordenada de obras. Al liberarse una cuadrilla, empieza la siguiente que
  cumpla requisitos; si ninguna los cumple, se anota el motivo en la crónica y la cola espera.
- **Por recua**: lista de destinos y cometidos. Al terminar uno, empieza el siguiente.
- Las colas se editan en cualquier momento; lo que ya empezó no se deshace.

### 4.2 Rutas circulares

```jsonc
{
  "tipo": "ruta",
  "recua": "recua-3",
  "circular": true,
  "paradas": [
    { "comarca": "pinares", "descargar": ["madera"], "cargar": [] },
    { "comarca": "tierra-de-soria", "vender": { "madera": { "cantidad": 10, "precioMinimoMil": 9000 } },
      "comprar": { "pan": { "cantidad": 20, "precioMaximoMil": 12000 } } }
  ]
}
```

La ruta se repite indefinidamente. Se detiene sola si: falta bastimento, una parada deja de ser
alcanzable, o un precio límite no se cumple **tres veces seguidas** (para no quedarse dando vueltas
en balde). Siempre lo dice la crónica, con el motivo.

### 4.3 Mayordomo

Reglas condicionales, evaluadas en una **fase fija** (al principio del turno, antes de producción) y
en orden de prioridad declarado por el jugador:

```
CUANDO  <condición>   ENTONCES  <orden>
```

Condiciones disponibles (cerradas, no es un lenguaje libre):

| Condición | Parámetros |
|---|---|
| `pan-disponible-menor-que` | cantidad |
| `recurso-almacenado-mayor-que` | recurso, cantidad |
| `precio-en-plaza-menor-que` | plaza, recurso, precio |
| `precio-en-plaza-mayor-que` | plaza, recurso, precio |
| `obra-terminada-en` | comarca |
| `escasez` | — |
| `estacion-empieza` | estación |
| `rebanyo-sin-pasto` | — |

Órdenes que puede dar (subconjunto seguro):

| Orden | Límites |
|---|---|
| `comprar` / `vender` en plaza | con precio límite obligatorio |
| `empezar siguiente obra de la cola` | — |
| `enviar recua a` | comarca conocida |
| `mover rebaño al pasto de la estación` | por cañada si es posible |
| `cambiar carga fiscal` | — |

Límites del mayordomo:

- 3 reglas activas al principio; +1 por nivel de mercado en la capital, hasta 6.
- **Nunca** puede hacer algo que el jugador no pudiera ordenar, ni saltarse validaciones.
- Nunca inicia expediciones de incorporación (las decisiones territoriales son del jugador).
- Todo lo que hace aparece en la crónica marcado como «por orden del mayordomo».

### 4.4 Plan de temporada

Hasta seis turnos programados por adelantado, con órdenes fechadas. Se muestran en un calendario y se
pueden modificar hasta el corte del turno correspondiente. Si una orden programada deja de ser válida
al llegar su turno, queda `en espera` y lo dice la crónica.

### 4.5 Comprobación del principio

Test de sistema obligatorio: se simula la misma partida dos veces, con la misma estrategia,
(a) dando órdenes cada turno y (b) dando órdenes cada seis turnos con colas, rutas y mayordomo
equivalentes. La diferencia de prestigio al turno 100 debe ser **menor del 5 %**. Si no, la
automatización no es suficiente y hay que ampliarla.

## 5. Archivos

```
paquetes/nucleo/src/ordenes.ts                   ciclo de vida: plan, colas y reservas
paquetes/nucleo/src/fases/00-mayordomo.ts        fase 0: plan, reglas, colas y mayordomo
paquetes/nucleo/src/fases/04-rutas.ts            detener una ruta permanente
paquetes/nucleo/src/reglas/mayordomo.ts          condiciones, limites y ordenes del mayordomo
paquetes/nucleo/src/datos/mayordomo.ts           limites (reglas, plan, repuesto, fallos)
paquetes/nucleo/pruebas/mayordomo.test.ts
herramientas/banco/src/escenarios/ausencia.ts    (+ ausencia.test.ts)
```

## 5.1 Lo que cambió al implementarla

- **Plan y colas son campos de toda orden**, no mecanismos aparte: `turnoProgramado` (el plan) y
  `cola` (`comarca:<id>` o `recua:<id>`), con dos estados nuevos, `programada` y `en cola`. Ninguno
  de los dos reserva nada: solo reserva lo que está `pendiente` o `en espera`.
- **Cola de obras:** las fases atienden primero las órdenes sueltas y después las de cola, en su
  orden. Una de cola empieza cuando hay cuadrilla, cumple sus requisitos y el almacén da para ella
  en ese momento (`puedePagarse`); si no, espera en su cola con el motivo y la siguiente puede
  empezar. **Cola de recua:** de una en una, cuando la recua ha llegado y no tiene nada a medias.
  La orden nueva `cola` reordena una cola; una lista que no sea la de la cola se rechaza.
- **Plan de temporada:** la orden espera `programada` hasta su turno (como mucho seis por delante;
  más allá se cancela `fuera-de-temporada`). Al llegar entra como si se diera entonces: reserva o se
  cancela `sin-recursos`, y así «caduca» con constancia en la crónica. Editar el plan es cancelar y
  volver a dar la orden, cosa del servidor (T-062).
- **Rutas permanentes:** se detienen solas al faltar bastimento o tras tres paradas seguidas sin
  cumplir un precio límite (`Recua.fallosDePrecio`); al pasar por comarca propia comen del almacén
  y reponen pan y la sal del verano para doce jornadas. La partida `humo-02` recorre ahora su medio
  año entero.
- **Mayordomo:** condiciones y acciones con tipos cerrados. «Empezar la siguiente obra de la cola»
  no es acción: la cola ya lo hace sola. «Obra terminada en» se lee como «no queda obra en marcha en
  la comarca». Los precios de sus condiciones son los que el jugador sabe. Una regla no repite lo que
  ya está en marcha. Sus órdenes pasan por la misma alta y las mismas validaciones.
- **La fase 0** va antes del calendario: plan, reglas, colas y mayordomo.
- **Crónica:** `plan.entra`, `cola.empieza`, `mayordomo.ordena` y `recua.ruta-detenida` tienen
  plantilla, y lo que hacen las órdenes del mayordomo va marcado «Por orden del mayordomo».
- **Test de ausencia (§4.5):** la misma estrategia (obras en la capital, explorar tres comarcas y
  cambiar la carga fiscal con las estaciones) jugada cada turno y cada seis turnos con colas y
  mayordomo da **175 y 175 de prestigio al turno 100 (0,0 %)**. El jugador diligente sigue la misma
  regla que la cola: la primera obra que puede pagar.

### Alcance de la evidencia (revisión del 19-09-2026)

El 175/175 anterior corresponde solo al escenario descrito, no a las ocho vías ni a la economía
completa. [T-051](T-051-ausencia-equivalente.md) ampliará la prueba con planes equivalentes;
comparar el mismo robot consultado cada uno o seis turnos sin programar lo mismo no aísla una
carencia de automatización. Se conserva esta regresión y no se generaliza su resultado.

## 6. Criterios de aceptación

1. Colas de obra y de recua funcionan y explican por qué esperan cuando esperan.
2. Una ruta circular con precios límite compra y vende correctamente y se detiene con motivo tras
   tres fallos seguidos.
3. El mayordomo respeta sus límites (número de reglas, órdenes permitidas, validaciones).
4. El orden de evaluación de las reglas es el declarado y es determinista.
5. El plan de temporada admite seis turnos, se puede editar y deja constancia de lo que caduca.
6. **El test de §4.5 pasa con menos del 5 % de diferencia.**
7. Todo lo automático aparece marcado en la crónica.
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/mayordomo.test.ts
npx tsx herramientas/banco/src/escenarios/ausencia.ts     # informe de la comparación
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-046). Anota en la bitácora el resultado del test de ausencia.
Commit: `T-045: colas, rutas permanentes, mayordomo y plan de temporada`.
