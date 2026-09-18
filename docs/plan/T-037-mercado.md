# T-037 · Fase 7: mercados, ferias y formación de precios

**Fase:** 2 · Motor · **Depende de:** T-032 · **Estado:** hecha

## 1. Contexto

El mercado es el segundo tablero del juego: donde el trashumante convierte lana en dinero, el ferrón
pone precio a los aperos y el mercader gana sin tener tierra. En multijugador es, además, la forma
de competir sin tocarse.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.10,
[docs/05-geografia.md](../05-geografia.md) §5.6 y [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md)
§2.4.4 (repartos y empates).

Ya existe: `EstadoMercado` en el estado, `OrdenMercado` y `ParadaDeRuta.vender/comprar` en las
órdenes, `Calendario.feriasActivas`, `repartoProporcional` y `hash32` en los útiles y la tabla
`mercado` (con cifras provisionales de T-003). Falta todo lo demás.

## 2. Objetivo

Casar las órdenes de compra y venta de cada plaza, formar precios de manera determinista y dejar
constancia de todo para la crónica.

## 3. Alcance

**Entra:** mercados locales y ferias, órdenes con precio límite, casación con reparto proporcional,
formación de precios, mercaderes menores, comisión y volumen máximo por plaza.

**No entra:** contratos entre jugadores (T-103), transporte (ya hecho en T-033), rumores y precios
conocidos de otras plazas (T-044), prestigio por volumen de feria (T-043) e influencia por comercio
(T-038; ambas leerán de los sucesos `mercado.trato`).

**Heredado de T-033 y T-034.** Una recua detenida en una parada de su ruta tiene
`Recua.enParada` con el índice de `Recua.paradas`: sus `vender` y `comprar` (con precio límite) son
órdenes de mercado de ese turno en esa plaza, y se pagan de la carga de la recua y entran en ella.
La fase 5 ya ha hecho antes su `cargar` y `descargar` si la parada es comarca propia. El cometido
`tratar` de una recua quieta también se cumple aquí (la fase 5 lo deja pasar).

## 4. Diseño detallado

### 4.1 Plazas

Una **plaza** es un mercado abierto este turno. Hay dos clases:

- **Local**: una comarca con edificio `mercado` (de cualquier dueño). Identificador
  `local-<comarca>`. Volumen `pequenya`, abierta todos los turnos mientras el edificio exista.
- **Feria**: cada feria del mundo, abierta solo los turnos de su calendario
  (`Calendario.feriasActivas`). Identificador `feria-<idFeria>` y el volumen que dice el mundo.

Los identificadores los construyen `idDeMercadoLocal` e `idDeMercadoDeFeria` (en `tipos/ids.ts`, el
único sitio donde un texto se convierte en identificador).

Un mercado **nace la primera vez que su plaza se abre**, con todos los recursos a su precio base
(cambio `mercado-alta`): no hace falta alta al crear la partida y un mercado recién construido
funciona el mismo turno. Una vez creado se queda en el estado; cerrada su plaza (una feria fuera de
fecha, un mercado derribado) sigue existiendo y **su precio vuelve al base**, pero no se casa nada.

Una comarca puede tener a la vez mercado local y feria. Una recua que se detiene en una parada
comercia en la **feria si la hay abierta** (con dos, la de mayor volumen y luego la de menor
identificador) y, si no, en el mercado local. Sin ninguna plaza abierta, la parada no vende ni
compra y el turno lo dice (`mercado.sin-plaza`).

Los maravedís son la moneda y **no se comercian**: no hay precio de maravedís.

### 4.2 Quién comercia y con qué

Toda la mercancía viaja en recuas (docs/02 §2.2): no se vende ni se compra desde el almacén.
Lo vendido sale de la **carga de la recua**, lo comprado entra en ella y los maravedís se cobran y se
pagan de la carga (los maravedís no ocupan porte). Para comprar hay que llevar maravedís cargados.

Hay dos maneras de entrar en el mercado, y las dos producen la misma **línea**: jugador, recua,
operación, cantidad, precio límite.

1. **Parada de ruta**: la recua detenida en una parada (`enParada`) comercia lo que dicen sus
   `vender` y `comprar`. Vale ese turno solo; lo que no se case se queda en la recua y se vuelve a
   intentar la próxima vez que pase.
2. **Orden `mercado`** (`OrdenMercado`): una recua **quieta en la comarca de la plaza y con cometido
   `tratar`** comercia lo que dicen sus órdenes. La orden gana el campo `recua` (quién la ejecuta) y
   vale `turnosTotales` turnos (de 1 a 24), contados solo en los turnos en que se intenta. Lo que no
   se casa **queda vigente** con la cantidad que falta hasta que se acaba, caduca o se cancela.
   Una orden en espera lo dice: `plaza-cerrada` (la feria no está abierta), `recua-lejos`,
   `recua-en-ruta` o `recua-sin-cometido`. Se cancela si la recua no existe o no es del jugador
   (`recua-desconocida`), si el mercado no existe (`mercado-desconocido`) o si pide comerciar con
   maravedís (`no-se-comercia-con-maravedis`).

Si una recua tiene varias líneas para el mismo recurso y operación (una parada y una orden, o dos
órdenes), sus cantidades se acumulan en un orden fijo —la parada primero, luego las órdenes por
identificador—, de modo que nunca se prometa más de lo que lleva ni se compre más de lo que cabe
en su porte. En las compras, cada línea reserva además los maravedís de su cantidad al precio
límite, y las siguientes cuentan con lo que queda.

Un recurso tras otro, en el orden de `RECURSOS`, y una plaza tras otra, por identificador: lo que se
vende de un recurso puede pagar lo que se compra del siguiente. Ese orden es fijo, no el de llegada.

### 4.3 Formación del precio

Para cada plaza abierta y cada recurso, con `P0` el precio vigente:

1. **Demanda y oferta a `P0`**: `D` es lo que compran las líneas humanas con máximo ≥ `P0` más lo que
   compran los mercaderes menores; `S`, lo que venden las humanas con mínimo ≤ `P0` más lo que
   venden los menores. Las compras se limitan a lo que la recua puede pagar y cargar a ese precio.
2. **Desequilibrio**: `desMil = floor(1000 × (D − S) / max(1, D + S))`, de −1000 a 1000.
3. **Impulso**: `P0 × elasticidad × desMil / 1000²`, recortado a ±15 % de `P0`.
4. **Regresión**: se suma un 10 % de la distancia al precio base (siempre al menos 1 milésima, sin
   pasarse del base).
5. **Seguridad**: el resultado final nunca se aparta más de un 15 % de `P0` y se queda entre el 40 %
   y el 250 % del precio base.

El resultado es `P1`, **el precio al que se cierran los tratos de este turno**. Si nadie comercia,
solo actúa la regresión: los precios vuelven solos al base. Los mercaderes menores hacen de
colchón: cuanta más liquidez ponen, menos mueve el precio una orden pequeña.

Elasticidades: pan 400, sal 600, hierro 700, lana 500, madera 300, piedra 250.

### 4.4 Casación

Con `P1` ya calculado (§4.3), en este orden:

1. **Líneas elegibles**: compras con máximo ≥ `P1`, ventas con mínimo ≤ `P1`. Cada una con la
   cantidad que puede hacer a ese precio (carga, porte, maravedís).
2. **Entre jugadores**: se casan `Qhh = min(compras, ventas, topeDeVolumen)`. El lado que sobra se
   reparte **en proporción a lo pedido** con `repartoProporcional`; el lado corto lo cumple entero.
3. **Con los mercaderes menores**: lo que no casó entre jugadores se lo compran o se lo venden los
   menores, también a `P1` y por reparto proporcional, hasta su cupo (§4.5) y sin pasar del tope.
4. **Redondeo del reparto**: el sobrante de los redondeos va a quien tiene mayor resto y, a igualdad,
   al que ofrece mejor precio y luego al de menor `hash32(semilla | turno | plaza:recurso | jugador)`.
   Nunca decide el orden de llegada de las órdenes.
5. **Tope de volumen**: `topeDeVolumen = volumenBase × multiplicador` (pequeña 1, mediana 3,
   grande 8) por recurso y por turno. Los jugadores no compran ni venden en total más que eso.
6. **Importes y comisión**: el que vende cobra `floor(cantidad × P1 / 1000)`, el que compra paga
   `ceil(cantidad × P1 / 1000)` (el redondeo, a favor de la plaza: los maravedís no se crean con
   redondeos), y **ambos pagan la comisión** sobre el importe: la de su casa (`comisionMercadoMil`)
   en el mercado local, y en feria la menor entre esa y `comisionFeriaMil` (1 % frente a 2 %). La
   comisión se descuenta de la carga de la recua y desaparece: es un sumidero de maravedís.

### 4.5 Mercaderes menores

Agentes sintéticos deterministas que dan liquidez. En cada plaza y recurso ponen **dos líneas**:
compran hasta `base × (1 + margen)` y venden desde `base × (1 − margen)`, con `margen = 10 %`.
Dentro de esa banda son contraparte de los dos lados; fuera, solo del que sujeta el precio (con el
precio por debajo del base, solo compran; por encima, solo venden), así que las plazas nunca se
hunden ni se disparan por mucho tiempo sin jugadores que las empujen.

Su cupo por turno y lado es `topeDeVolumen × liquidez − volumen entre jugadores a P0`: **decrece a
medida que los jugadores comercian entre sí** y con mucho comercio humano casi desaparece. No
tienen almacén ni memoria, no se pisan entre sí (un menor nunca casa con otro menor) y nunca
comercian entre ellos. Con `liquidez = 0` no hay menores (partida solo de jugadores).

### 4.6 Sucesos (lo que leen la crónica, T-038 y T-043)

| Suceso | Cuándo | Datos |
|---|---|---|
| `mercado.abre` | nace un mercado | mercado, clase (`local` o `feria`), volumen |
| `mercado.trato` | una línea casa algo | mercado, recurso, operación, cantidad, precioMil, importe, comision, conJugadores, conMenores, via |
| `mercado.precio` | cambia el precio de una plaza abierta | mercado, recurso, antes, despues, demanda, oferta, volumen |
| `mercado.sin-casar` | una línea no casa todo lo que podía | mercado, recurso, operación, pedido, casado, motivo |
| `mercado.sin-plaza` | una parada quiere comerciar donde no hay plaza | recua, comarca |
| `mercado.orden-caduca` | la orden se acaba con cantidad sin casar | orden, sobra |

Motivos de `sin-casar`: `precio-limite`, `sin-fondos`, `volumen-de-plaza`, `sin-contraparte` y, si
la recua no podía ni prometerlo, `sin-carga` (vende más de lo que lleva) o `sin-espacio` (compra más
de lo que le cabe en el porte).
Además, cada cambio de carga sale como `recua.carga` con su motivo (`venta`, `compra`, `comision`).

### 4.7 Tabla de datos y cambios de tipos

- Tabla `mercado` (`src/datos/mercado.ts`): se **quita** `comisionMil` (la comisión local es la de
  cada casa) y se **añade** `margenMercaderesMenoresMil`. Valores de arranque de equilibrio: los de
  §4.3 a §4.5.
- Tabla `recursos` (`src/datos/recursos.ts`), hasta ahora solo de ejemplo: precio base en
  maravedís por carga —pan 3, madera 4, piedra 6, sal 14, hierro 24, lana 50— y elasticidad. Son
  cifras de partida; el ajuste es de T-047.
- Cambios nuevos: `mercado-alta`, `mercado-precio` y `orden-cantidad` (lo que falta por casar de una
  orden vigente).

## 5. Archivos

```
paquetes/nucleo/src/fases/07-mercado.ts
paquetes/nucleo/src/reglas/{precios,mercaderesMenores,mercado,plazas,solicitudes}.ts
paquetes/nucleo/src/datos/{mercado,recursos}.ts
paquetes/nucleo/src/{cambios.ts,index.ts}
paquetes/nucleo/src/tipos/{ids,ordenes,recursos,reglas}.ts
paquetes/nucleo/src/validacion/{validarOrden,validarTablas}.ts
paquetes/nucleo/pruebas/{precios,mercado}.test.ts
paquetes/nucleo/pruebas/ejemplos.ts
```

Los tests viven en `pruebas/`, como los de las demás tareas, y las tablas en `src/datos/*.ts` (no en
un JSON aparte): así lo hacen T-031 a T-036.

## 6. Criterios de aceptación

1. La casación respeta los precios límite: nadie compra por encima de su máximo ni vende por debajo
   de su mínimo (test de propiedad con 5 000 casaciones).
2. El reparto proporcional conserva las cantidades (nada se crea ni se pierde) y es determinista.
3. Los precios no se mueven más de un 15 % por turno ni salen de la horquilla 40 %–250 %.
4. Sin actividad humana, los precios tienden al base en 10 turnos.
5. Con una venta masiva de lana en una feria, el precio cae y se recupera en los turnos siguientes
   (test de escenario con cifras esperadas).
6. Barajar el orden de las órdenes no cambia el resultado.
7. La comisión se cobra correctamente y aparece en los sucesos.
8. Una orden `mercado` que no casa entera queda vigente con lo que falta, caduca al terminar sus
   turnos y explica en un suceso por qué no casó.
9. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/pruebas/mercado.test.ts paquetes/nucleo/pruebas/precios.test.ts
npm run partidas
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-038). Commit: `T-037: mercados, ferias y precios`.

## 9. Resultado (18-09-2026)

Tarea cerrada. 499 tests en verde (71 nuevos); las partidas de reproducción `humo-01` y `humo-02`
no cambian de huella (ninguna tiene mercados ni ferias).

- `fases/07-mercado.ts`: crea los mercados la primera vez que se abre su plaza, reúne las
  solicitudes (paradas y órdenes `mercado`), casa cada plaza y recurso, cobra y paga sobre la carga
  de la recua y deja que los precios de las plazas cerradas vuelvan al base.
- `reglas/mercado.ts` (casación pura: elegibilidad, reparto, menores, importes y motivos),
  `reglas/precios.ts` (desequilibrio, impulso, regresión y recortes), `reglas/mercaderesMenores.ts`,
  `reglas/plazas.ts` (qué está abierto y dónde comercia una parada) y `reglas/solicitudes.ts`
  (de solicitud a línea, con lo que la recua puede entregar, cargar y pagar).
- Tablas reales nuevas: `datos/recursos.ts` (precio base y elasticidad, hasta ahora solo de ejemplo)
  y `datos/mercado.ts`. `DatosMercado` pierde `comisionMil` y gana `margenMercaderesMenoresMil`.
- `OrdenMercado` gana `recua`; `RECURSOS_COMERCIABLES` deja a los maravedís fuera de las órdenes y de
  las paradas (el validador lo rechaza y el motor, que no se fía, también). Cambios nuevos:
  `mercado-alta`, `mercado-precio` y `orden-cantidad`.
- Pruebas en `pruebas/precios.test.ts` y `pruebas/mercado.test.ts`, entre ellas la propiedad de
  5 000 casaciones al azar (con la mitad de los precios cerca del base, para ejercitar la banda de
  los menores) y una comprobación de que tres mutaciones del código —ignorar el mínimo de las ventas,
  quitar el recorte del 15 %, desempatar por orden de llegada— hacen fallar los tests.

Decisiones tomadas al implementar (todas escritas en docs/03 §3.10):

- **El precio de cierre es el precio nuevo**, no el vigente. La ficha decía «el precio vigente,
  ajustado según §4.3»; se ha entendido así porque es lo único que hace que vender mucho duela en el
  mismo turno. Consecuencia para el jugador: su propia venta baja el precio bajo su mínimo si este era
  el precio de hoy, y no vende. El límite es una decisión, no un trámite; la previsión de la
  interfaz (T-082) usará la misma `casarPlaza` del núcleo.
- **Los menores son dos líneas del libro** (compran hasta base +10 %, venden desde base −10 %) y no
  un caso aparte. Eso los hace estabilizadores fuera de la banda y da profundidad dentro de ella; el
  desequilibrio queda amortiguado por su cupo sin necesitar un término propio.
- **Orden del recorte del 15 %**: impulso recortado, regresión y un último recorte, porque la ficha
  (recortar y luego regresar) permitía pasar del 15 % cuando el impulso y la regresión tiran en el
  mismo sentido, y el criterio 3 lo prohíbe.
- **La comisión es un sumidero** de maravedís (no va al dueño del mercado); los portazgos y el
  cobro por plaza ajena son de T-103. La local es la de la casa y la de feria, la menor entre esa y
  `comisionFeriaMil`.
- **Las plazas cerradas regresan al base cada turno**, sin esperar a la próxima feria, para que el
  precio de Medina de mayo no arrastre el hundimiento de un jugador hasta octubre.
- Las solicitudes de una recua se acumulan en orden fijo (parada primero, luego órdenes por
  identificador) y los recursos se procesan en el orden de `RECURSOS`: lo que se vende de un recurso
  puede pagar el siguiente.

Queda a la vista de T-046 y T-047: con `liquidezMercaderesMenoresMil = 1000` (solitario) los menores
absorben cualquier venta hasta el tope de la plaza y el precio se recupera en un turno; el banco de
pruebas dirá si eso deja el mercado demasiado blando para el mercader de ferias. Los precios base son
cifras de arranque.
