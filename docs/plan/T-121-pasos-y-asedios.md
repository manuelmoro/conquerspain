# T-121 · Disputa de pasos y asedios negociables

**Fase:** 6 · Conflicto · **Depende de:** T-120 · **Estado:** **hecha (10-11-2026)**

## 1. Contexto

Con la milicia de T-120 ya hay hostilidad, marchas y enfrentamientos que solo cuestan la posición. Esta
tarea pone lo que se disputa de verdad: **el paso** (por dónde se viaja) y **la comarca** (con un asedio
largo, visible y negociable). Sin batallas tácticas ni azar: reglas económicas.

## 2. El bloqueo de un paso

Una mesnada en una comarca **cierra la entrada** en ella a las recuas y los rebaños de las casas con las que
hay hostilidad vigente: para ellos, todo tramo que llega allí está cerrado, como un puerto nevado. Rodean
si hay otro camino; si no, esperan. Las posiciones que cuentan son las del principio del turno (las recuas
andan antes que las mesnadas).

## 3. El asedio

**Empezar.** Orden `asediar` con una mesnada que está en una comarca de una casa con hostilidad vigente.
Nunca la capital (el vencido sigue jugando) ni la tierra de quien está amparado. Queda un asedio público:
`EstadoPartida.asedios?: Record<IdAsedio, Asedio>` con la comarca, el sitiador, su mesnada, el turno en que
empezó y el rescate que se haya ofrecido.

**Cada turno**, después de marchas y enfrentamientos:

- si la mesnada sitiadora ya no está allí (se fue, la derrotaron o se licenció) o se retiró la hostilidad,
  el asedio **se levanta**;
- durante los **6 primeros turnos** (`turnosMinimosAsedio`) no pasa nada más: es el tiempo del defensor
  para levar, marchar o negociar;
- desde el sexto, si la **fuerza** del sitiador supera la **defensa**, la comarca **se rinde**: pasa al
  sitiador con 40 de lealtad (`lealtadTrasRendicion`) y su mesnada se queda de guarnición.

**La defensa** = la guarnición (el 10 % de la población, `guarnicionMil`) × 1,5 si su casa no pasa hambre
(`ventajaAbastecidaMil`) × 2 con muralla, más la fuerza de las mesnadas del dueño que estén allí (que ya
cuentan su ventaja en casa y la muralla, T-120). Defender con muralla y bien abastecido es claramente
más fácil.

## 4. Negociar

En cualquier turno del asedio:

- el defensor ofrece un **rescate** (orden `tregua` con los maravedís), que el sitiador ve en su crónica;
- el sitiador lo **acepta** (`aceptar-tregua`): se pagan los maravedís (si el defensor ya no los tiene, no
  hay trato), el asedio se levanta y la mesnada vuelve a su casa.

El sitiador también puede irse sin más: con `marchar` o `licenciar`.

## 5. Lo que se ve

Los asedios son públicos (vista `asedios`). En «Milicia y hostilidad»: «Asediar» en las mesnadas que están en
tierra hostil; y en cada asedio en el que se es parte, ofrecer o aceptar el rescate.

## 6. Criterios de aceptación

1. Un asedio dura al menos 6 turnos y se puede negociar en cada uno.
2. El defensor con abastecimiento y muralla tiene ventaja clara.
3. El vencedor obtiene el objetivo; el vencido conserva su dominio (la capital no se asedia) y sigue jugando.
4. Una mesnada cierra el paso a las recuas y rebaños de casas hostiles, que rodean o esperan.

## 7. Verificación

`npm run verificar`, con `nucleo/pruebas/asedios.test.ts`: el bloqueo con y sin hostilidad, el asedio que no
rinde antes del sexto turno y después sí (la capital del vencido sigue suya), la muralla con pan que aguanta,
el rescate ofrecido y aceptado, la capital que no se asedia y el asedio que se levanta si el sitiador se va. En el
cliente, «Poner asedio» en las mesnadas en tierra hostil y la lista de asedios con rescate (`milicia.test.ts`).

**La lealtad tras la rendición** se pone a 40 en la fase 4, y la fase de territorio del mismo turno le aplica
después sus fuentes de siempre.

## 8. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-121: <resumen>`.
