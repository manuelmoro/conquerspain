# T-123 · Acuerdos, rupturas y reputación

**Fase:** 6 · Conflicto · **Depende de:** T-121 · **Estado:** **hecha (10-11-2026)**

## 1. Contexto

Cierre del círculo: si hay conflicto, tiene que haber forma de pactar, y el pacto tiene que valer algo. Los
contratos de T-103 ya dan la forma (propuesta, firma, plazo, crédito, crónica de las dos partes); el paso de
ganado ya es un acuerdo. Esta tarea añade los que faltan y la ruptura.

## 2. Los acuerdos

Cuatro tipos de contrato son **acuerdos**: duran hasta su plazo, se cumplen solos al llegar (+5 de crédito a
cada parte, como cualquier contrato) y se pueden **romper**.

| Acuerdo | Quién se compromete | Efecto mientras está vigente |
|---|---|---|
| **Paso de ganado** (T-103) | quien tiene la tierra | los rebaños de la otra casa entran por cualquier camino |
| **No agresión** | las dos | no se pueden declarar la hostilidad; al firmarlo se retira la que hubiera y se levantan los asedios entre ellas |
| **No cortejar** | la parte activa, sobre hasta 3 comarcas | no gana influencia en ellas, ni puede regalar a su concejo ni incorporarlas |
| **Exclusiva de venta** | la parte activa, de un recurso | no vende ese recurso en ninguna plaza (sus órdenes de venta se cancelan); se lo vende a la otra por contratos de entrega |

Cada acuerdo puede llevar un **precio**, que la otra parte paga al firmar.

## 3. La ruptura

Orden `romper-acuerdo` de cualquiera de las dos partes, con un acuerdo vigente: queda **roto**, quien lo
rompe pierde **25 de crédito** y **30 de prestigio**, y se anuncia **a todos** (`acuerdo.roto`). El prestigio
no se resta de golpe (se recalcula entero cada turno): la fase 11 cuenta las rupturas en
`registro.acuerdosRotos` y las pone entre las penalizaciones, así que pesan para siempre. Ni el precio
ni la penalización se devuelven: romper sale caro y se sabe.

## 4. Los límites

Para que ningún conjunto de acuerdos deje a nadie sin juego:

- un acuerdo de no cortejar cubre **como mucho 3 comarcas**;
- una casa tiene **como mucho 3 acuerdos de no agresión** vigentes: no se puede blindar contra todos;
- todo acuerdo tiene plazo (como mucho 48 turnos, el de los contratos).

## 5. Lo que se ve

En «Tus contratos», los tipos nuevos con sus campos, y «Romper el acuerdo» en los vigentes con lo que cuesta.
La crónica de todos cuenta las rupturas.

## 6. Criterios de aceptación

1. Todo acuerdo tiene efecto mecánico y caducidad.
2. Romper un acuerdo se anuncia a todos y cuesta crédito y prestigio.
3. Ningún conjunto de acuerdos puede dejar a un jugador sin ninguna opción de juego (los límites del §4).

## 7. Verificación

`npm run verificar`, con `nucleo/pruebas/acuerdos.test.ts` (no agresión que retira la hostilidad y la impide,
el tope de tres, no cortejar y su tope, exclusiva que cancela las ventas, ruptura pública con su crédito y su
prestigio, y que un contrato de entrega no se rompe) y `cliente/src/contratos.test.ts` (frases, «Romper el
acuerdo» y el formulario de no cortejar).

## 8. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-123: <resumen>`.
