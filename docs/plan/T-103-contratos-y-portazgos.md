# T-103 · Contratos, portazgos y crédito

**Fase:** 5 · Multijugador · **Depende de:** T-102 · **Estado:** **hecha (10-11-2026)**; el checkpoint de personas se omite por decisión del usuario, que corregirá jugando

## 1. Contexto

La interacción directa entre jugadores sin violencia: acuerdos que el motor verifica y ejecuta, caminos que se
pagan y una reputación mecánica que importa (docs/06 §6.4.5 y §6.5).

Lo que esperaba a esta tarea:

- **De T-041,** tres privilegios de casa con su permiso en `datos/casas.ts` y sin fase que los lea:
  - vender aperos instalados (ferrones);
  - el contrato de obra en comarca ajena (canteros);
  - el portazgo (arrieros; prohibido a los monjes).
- **De T-041 también,** la letra de cambio de los mercaderes: el motor la emite y la cobra (`fases/07-letras.ts`,
  probado), pero la validación de órdenes la rechazaba «hasta T-103».
- **De T-040,** el rebaño solo entra en tierra ajena por cañada y con el paso franco de la Mesta
  (`puedeEntrar`). Esta tarea añade el acuerdo.
- **De T-053,** lo que cobra una venta a las recuas que comen en ella «no es de nadie hasta que haya portazgos».

## 2. El crédito

`EstadoJugador.credito`, de 0 a 100. Empieza en 50 y es **público**: sale en la clasificación y en las
propuestas de contrato.

| Hecho | Crédito |
|---|---|
| Cumplir un contrato (cada parte que cumple) | +5, hasta 100 |
| Incumplir un contrato | −20, hasta 0 |

**Con crédito bajo (`creditoBajo`, menos de 30):**

- quien paga en un contrato de entrega tiene que **depositar el pago al aceptar** (pago por adelantado);
- no puede pedir préstamos;
- sus fuentes de influencia en los concejos valen un 20 % menos (`influenciaConCreditoBajoMil`, 800): el
  concejo desconfía del mal pagador.

**El hito «Buen nombre»** (docs/06 §6.3: crédito de 80 o más y tres contratos cumplidos) deja de estar
pausado.

## 3. Los contratos

### 3.1 Forma

`EstadoPartida.contratos: Record<IdContrato, Contrato>`.

**Cada contrato lleva:**

- su tipo: `entrega`, `prestamo`, `aperos`, `obra` o `paso`;
- las dos partes: quien propone y quien recibe la propuesta;
- su estado: `propuesto`, `vigente`, `cumplido`, `incumplido`, `rechazado` o `caducado`;
- el turno en que se propuso y el plazo;
- lo propio de su tipo (§3.3).

**Dos órdenes nuevas:**

- **`contrato`** propone, con las condiciones.
- **`responder-contrato`** acepta o rechaza; solo la puede dar la otra parte.

**El ciclo:**

- una propuesta se ve en la vista de las dos partes;
- si no se responde en `turnosParaResponder` (2), caduca;
- al aceptarla se comprueba que se puede firmar (fondos, permisos, crédito); si no, se rechaza con su motivo.

Todo se resuelve en una fase nueva, **07 · contratos** (`fases/07-contratos.ts`): después del mercado,
antes del territorio. Dentro de la fase, por este orden:

1. salen del estado los contratos cerrados el turno anterior (se vieron un turno y quedan en la crónica);
2. las respuestas, en orden de contrato;
3. las propuestas nuevas y los portazgos, en orden de orden;
4. cada contrato vivo, en orden de identificador: caduca, se cumple o se incumple.

El orden de llegada no cuenta (probado barajando las órdenes). Las comarcas que cita una propuesta las
conocen las dos partes, al menos de oídas: no se firma una entrega en un sitio del que no se sabe ni el
nombre.

### 3.2 Cumplir e incumplir

- **Sin bloquear la partida:** un contrato que no se cumple a tiempo se da por **incumplido** al pasar su
  plazo. La parte que falla paga la **penalización** pactada (de su almacén, hasta lo que tenga) a la otra y
  pierde 20 de crédito.
- **En la crónica de las dos partes** quedan la propuesta, la firma, el cumplimiento o el incumplimiento, y
  quién falló.

### 3.3 Los cinco tipos

| Tipo | Quién | Se firma con | Se cumple cuando | Si falla |
|---|---|---|---|---|
| **entrega** | cualquiera | recurso, cantidad, comarca de entrega (del que recibe), precio, plazo y penalización | una recua del que entrega está quieta en la comarca de entrega con la mercancía: pasa al almacén del que recibe, y el precio al del que entrega | al pasar el plazo sin entrega, falla quien entrega; si al entregar el que paga no tiene el precio y no lo depositó, falla él |
| **préstamo** | cualquiera presta; pide quien tenga crédito de 30 o más | cantidad, devolución y plazo | al firmar pasa la cantidad; al llegar el plazo se cobra la devolución | si no hay bastante, se cobra lo que haya y falla quien pidió |
| **aperos** | vende un ferrón (`venderAperos`) | comarca del comprador, niveles y precio | al firmar: el ferrón pone el hierro, la comarca sube sus aperos y el comprador paga | no se firma si falta hierro, dinero o margen de aperos |
| **obra** | construye un cantero (`obraEnComarcaAjena`) | comarca del cliente, obra mayor (y su tramo), precio y plazo | al firmar, el cliente paga y empieza la obra en su comarca; el cantero pone el material a plazos, con sus ventajas de casa; se cumple al terminarla | si no está terminada al pasar el plazo, falla el cantero (la obra sigue) |
| **paso** | concede quien tiene la tierra | a qué casa, hasta qué turno y precio | al firmar, se paga; hasta el plazo, los rebaños de esa casa entran en las comarcas del que concede por cualquier camino | no se incumple: se cumple al llegar el plazo |

**La obra del cantero** guarda su constructor (`Obra.porContrato`: `constructor` no puede ser nombre de campo
en JavaScript). Las ventajas de coste, avance e invierno, la cuadrilla extra del *Gremio* y el material salen
de él. La obra, sus efectos y su prestigio son del dueño de la comarca, como cualquier obra suya. Si falla al
plazo, la obra sigue **como obra propia del cliente**, que pone ya su material. Si la obra se pierde sin
terminar (la comarca cambia de manos), el contrato se cierra sin culpa de nadie.

**Lo que se mira al firmar** (`impedimentoDeFirma`): la comarca es de quien paga; fondos libres (sin lo
reservado); el permiso de la casa; margen de aperos del ferrón; la obra mayor posible con cuadrilla libre; y
que la casa del cliente pueda levantar esa obra (los arrieros no levantan catedral, ni por encargo).

**La Banca** (tradición de los mercaderes, que esperaba a esta tarea) presta aunque quien pide tenga poco
crédito, y al plazo cobra también de lo que lleven las recuas del deudor.

## 4. La letra de cambio

Se activa la que ya estaba hecha: una casa con el permiso (los mercaderes) pasa maravedís de su almacén a una
recua que está en una plaza. Paga un 3 %, llega un turno después y, si la recua ya no está en una plaza, se
devuelve.

En el cliente: si la recua de un mercader está fuera y no lleva con qué pagar, el formulario de compra ofrece
«Mandarle dinero por letra».

## 5. Portazgos

**Qué se puede cobrar.** Una casa con el permiso de portazgo (los arrieros) cobra por:

- **los tramos que mejoró** con una obra mayor, puente o calzada. El tramo guarda quién lo mejoró
  (`EstadoTramo.duenyo`) y su portazgo (`EstadoTramo.portazgo`, de 0 a 20 maravedís, 0 al terminarlo). Solo
  se apunta el dueño si puede cobrar: así los estados de las demás casas no cambian y las partidas de
  reproducción guardan su huella;
- **sus ventas:** lo que una recua ajena paga por comer en ella va al dueño de la venta, en vez de
  desaparecer.

**El cobro:**

- **Cómo se fija:** con la orden `portazgo` (el tramo y la cantidad), solo en tramos propios.
- **Cuándo se cobra:** al entrar una recua o un rebaño de otra casa en un tramo con portazgo. Paga con los
  maravedís que lleva y, si no le llegan, de su almacén.
- **Lo ve todo el mundo:** el atlas lo muestra en el tramo («peaje 5»), y el cobro sale en la crónica de las
  dos partes.
- **Quién no paga:** las recuas de los arrieros, que «nunca pagan portazgo ajeno».

**Cómo se decide** (`reglas/portazgos.ts`). Antes de andar, quien viaja repasa los peajes de su ruta en orden
con lo que lleva más lo libre del almacén: los que le llegan los hace mejorados y los paga al entrar; los que no,
por el camino viejo. El tramo en el que ya estaba al empezar el turno se pagó al entrar en él.

**Siempre hay alternativa.** Quien no puede pagar va por **el camino viejo**: el tramo sin la mejora, con sus
jornadas de antes (un vado sin puente, una vereda sin calzada), y no paga nada. Así la ruta alternativa existe
siempre, aunque sea peor: es la misma comarca a la que se llega, más despacio.

## 6. Rebaños en tierra ajena

Un rebaño entra en la comarca de otra casa:

- por una cañada, si su casa tiene paso franco (la Mesta, como hasta ahora);
- por cualquier camino, si hay un **contrato de paso** vigente con el dueño de esa comarca.

Sin eso, no entra, y la ruta lo rodea.

## 7. Criterios de aceptación

1. Un contrato incumplido penaliza automáticamente, resta crédito y queda en la crónica de las dos partes. ✔
2. El portazgo se cobra al pasar y aparece en la crónica de ambos. ✔
3. Siempre hay una ruta alternativa a un camino de peaje: el camino viejo, sin la mejora. ✔ (más despacio:
   la vega a dos jornadas en vez de una)
4. Con crédito bajo, el pago de una entrega se deposita al firmar y no se puede pedir prestado. ✔ Y la
   influencia baja un 20 %.
5. Cada tipo de contrato se firma, se cumple y se incumple como dice §3.3, probado en el motor. ✔
6. La letra de cambio se da desde el cliente y llega a la recua al turno siguiente. ✔ La tarjeta de compra de
   un mercader con la recua fuera ofrece «Mandarle N maravedís por letra», con la comisión ya contada.
7. Barajar el orden de las órdenes de contrato no cambia el resultado. ✔

## 8. Fuera de esta tarea

- La diplomacia formal: acuerdos de no agresión, rupturas y reputación de guerra (T-123).
- El correo de los arrieros (vender información) queda para cuando haya un mercado de información: no tiene
  efecto mecánico que el motor pueda verificar.
- El amparo del novato frente a portazgos es de T-105.

## 9. Verificación

`npm run verificar`, con pruebas del motor por tipo de contrato, crédito, portazgos, letra y rebaños, y con la
interfaz probada en el navegador con dos cuentas.

**Hecho:**

- Motor: `pruebas/contratos.test.ts` (18 pruebas: ciclo, cinco tipos, crédito bajo, banca, influencia,
  barajado) y `pruebas/portazgos.test.ts` (7: cobro de la carga y del almacén, exenciones, camino viejo,
  dueño del tramo, orden `portazgo`, venta de arrieros). Las pruebas que decían «desactivado hasta T-103»
  (buen nombre, banca, permisos de casa, crédito en la vista) dicen ya lo que hay.
- Cliente: «Tus contratos» en «Tu casa» (crédito propio y ajeno, lista con aceptar y rechazar, por qué acabó
  cada uno, formulario para proponer y «Tus portazgos» para quien los cobra), el peaje rotulado en el atlas y
  la letra en la tarjeta de compra (`contratos.test.ts`, `mercado.test.ts`).
- En el navegador, con dos cuentas (canteros y ferrones): un contrato de aperos propuesto, aceptado y no
  firmado por falta de hierro, con su motivo; y uno de paso propuesto, aceptado y firmado.
