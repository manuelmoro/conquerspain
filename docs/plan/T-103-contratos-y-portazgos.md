# T-103 · Contratos, portazgos y crédito

**Fase:** 5 · Multijugador · **Depende de:** T-102 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

La interacción directa entre jugadores sin violencia: acuerdos que el motor verifica y caminos
que se pagan.

Lee antes: [docs/06-competicion.md](../06-competicion.md) §6.5.

## 2. Objetivo

Contratos verificables, portazgos sobre caminos propios y una reputación mecánica que importe.

## 3. Alcance

**Entra:** contratos de entrega, de obra (canteros), de aperos (ferrones) y de préstamo (mercaderes); portazgos; crédito y sus efectos.

**No entra:** diplomacia formal (T-123).

**Heredado de T-041.** Tres mecánicas de casa esperan a esta tarea y tienen ya su permiso en
`datos/casas.ts` (que ninguna fase lee todavía; un test lo vigila): **vender aperos instalados** de
los ferrones (`venderAperos`), el **contrato de obra** de los canteros en comarca ajena
(`obraEnComarcaAjena`; si permite obras en comarca ajena hay que guardar el autor de la obra, ver T-038)
y el **portazgo** de los arrieros (`cobrarPortazgo`, prohibido a los monjes).

**Heredado de T-040.** Hoy un rebaño entra en tierra ajena solo por cañada y solo con el paso franco de
la Mesta (`puedeEntrar`, `reglas/rebanyos.ts`), porque no hay portazgos ni acuerdos. Esta tarea
debe sustituir esa prohibición por el pago o el acuerdo, sin quitarle a la Mesta su privilegio.

## 4. Puntos que hay que resolver al detallar

- Forma de un contrato: partes, entrega, plazo, pago, penalización. Todo verificable por el motor.
- Qué pasa si una parte no puede cumplir: penalización automática y pérdida de crédito, sin bloquear la partida.
- Portazgo: cómo se fija, cómo se cobra, cómo se ve desde fuera y cómo se rodea.
- Efectos del crédito bajo: pago por adelantado, peores condiciones, menos influencia en concejos.

## 5. Criterios de aceptación provisionales

1. Un contrato incumplido penaliza automáticamente y queda registrado.
2. El portazgo se cobra al pasar y aparece en la crónica de ambos.
3. Existe siempre una ruta alternativa (aunque sea peor) a un camino de peaje.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-103: <resumen>`.
