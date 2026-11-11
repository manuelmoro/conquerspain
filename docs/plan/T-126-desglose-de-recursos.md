# T-126 · En qué se gasta y de dónde viene cada recurso

**Fase:** 7 · Tras jugar de verdad · **Depende de:** T-090 · **Estado:** **hecha (11-11-2026)**

> Petición del usuario (11-11-2026): «quiero saber en qué se gasta el pan, los maravedís, etc.: cuando
> pincho en el recurso arriba, que me aparezca el desglose, no solo el total gastado o ingresado».

## 1. Contexto

T-090 dejó el histórico de cada recurso al pulsarlo en «Tienes»: lo que entró, salió y quedó por turno.
Cada cambio del almacén ya se guardaba con su **motivo** (`almacen.cambio`, escrito por la fase que lo
causa: «produccion de c-12», «pan de la poblacion», «orden o-3-mesta-a1»…), pero nadie lo leía.

## 2. Diseño

### 2.1 Núcleo: el concepto de cada motivo

`conceptoDeMovimiento(motivo)` (`nucleo/src/reglas/conceptos.ts`) devuelve `{clase, ref}`: una de las 30
`CLASES_DE_CONCEPTO` (producción, insumos, comida, cuadrillas, conservar, merma, aperos, administración,
deuda, orden, devolución, obra, derribo, peregrinos, carga, descarga, repuesto, bastimento, venta,
disolver, queso, esquileo, contrato, depósito, devolución del depósito, préstamo, portazgo, soldada,
rescate y `otro`) y a qué se refiere (comarca, orden, obra, unidad, contrato…). Vive junto al motor
porque los motivos los escribe el motor. Dos guardas: la tabla de motivos de `pruebas/conceptos.test.ts`
y la partida de 72 turnos de las ocho casas del banco (`cronica.test.ts`), donde **ningún** movimiento
real puede quedar como `otro`.

### 2.2 Servidor

`GET /partidas/:id/historial-de-recursos` añade a cada recurso y turno su `desglose`: los movimientos
sumados por concepto y referencia, de mayor a menor (desempate estable), y a la respuesta `referencias`:
las órdenes propias que nombra el desglose (de la tabla de órdenes o, las del mayordomo, del estado) y las
obras propias en marcha (qué y dónde). Nada de otras casas.

### 2.3 Cliente

- `textoDeConcepto` y `desgloseDe` (`cliente/src/desglose.ts`, puros): cada concepto en una frase
  («Producción de Burgos», «Lo que come tu gente», «Formar una recua en Burgos» con la frase de la bandeja,
  «Cargado en Recua 1», «Portazgos que pagas»…), sin identificadores internos aunque la cosa ya no exista;
  y la suma de varios turnos en dos listas, lo que entró y lo que salió.
- El diálogo del recurso empieza por **«En qué se fue y de dónde vino»**, del último turno por defecto;
  un desplegable elige otro turno o los últimos 24 juntos, y tocar un turno de la tabla también lo elige.
  Cada concepto lleva su cantidad y una barra de lo que pesa. Debajo siguen la gráfica y la tabla.

## 3. Archivos

Nuevos: `nucleo/src/reglas/conceptos.ts`, `nucleo/pruebas/conceptos.test.ts`, `cliente/src/desglose.ts`
(+ test). Tocados: `nucleo/src/index.ts`, `banco/src/cronica.test.ts`, `servidor/src/api/{historial,
manejadores}.ts`, `historial.test.ts`, `cliente/src/{api,almacen}.ts`, `pantallas/{historial,partida}.ts`,
`estilo.css`.

## 4. Criterios de aceptación

1. Al pulsar un recurso se ve, concepto por concepto, de dónde vino y en qué se fue el último turno. ✔
2. Se puede mirar cualquier turno del histórico, o todos juntos. ✔
3. El desglose suma exactamente lo que entró y salió. ✔
4. Ningún movimiento de una partida real queda sin concepto; ningún texto enseña un identificador. ✔

## 5. Verificación

`npm run verificar`, con `conceptos.test.ts`, `cronica.test.ts` del banco, `historial.test.ts` (cuadre del
desglose, orden, orden nombrada) y `desglose.test.ts`. Probado en el navegador sobre la partida de muestra:
el pan del último turno dice «Producción de Córdoba y su Campiña +28 · Lo que come tu gente −27 · Pan que
se echa a perder −3».
