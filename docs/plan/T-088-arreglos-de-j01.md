# T-088 · Arreglos de J-01: entrar, pinchar el mapa, ficha a mano y resumen del turno

**Fase:** 4 · Cliente · **Depende de:** T-082 · **Estado:** en curso (abierta el 25-09-2026 tras J-01)

## 1. Contexto

La primera sesión de J-01 ([checkpoints-jugabilidad.md](checkpoints-jugabilidad.md)) no superó el checkpoint:
en escritorio el mapa no se deja pinchar, la ficha queda escondida, al resolver no se sabe qué ha pasado, la
entrada calla los errores y todo es poco amigable. Esta tarea arregla eso **antes** de T-083, y J-01 se repite.

## 2. Qué se hace

1. **Pinchar el mapa en escritorio y en móvil.** Sin captura del puntero al pulsar: solo se captura cuando el
   gesto pasa de 4 px (es un arrastre). El toque se detecta en `pointerup` con `elementFromPoint` y
   `closest('[data-comarca]')`, así sirve también sobre avisos y ferias (que pasan a llevar su comarca).
   Cursor de mano, resalte al pasar y la comarca abierta **seleccionada** en el mapa. La lógica de «es toque o
   arrastre» es pura y se prueba.
2. **La ficha, a mano.** En escritorio (≥ 900 px), mapa a la izquierda y panel lateral fijo con la ficha o la
   bandeja; en móvil, la ficha como hoja inferior sobre el mapa. «Cerrar» arriba a la derecha. La confirmación
   de una acción se abre dentro de la ficha, junto a la acción.
3. **Resumen del turno.** Al llegar un turno nuevo (recargar o «Resolver el turno ya»), un diálogo con: arriba,
   **cómo ha cambiado cada recurso** (antes → después, con signo y color) y la población; debajo, la crónica del
   turno agrupada por secciones, avisos primero, y las acciones sugeridas; si la entrada lleva comarca, se puede
   abrir. En la bandeja, una fila con **el cambio desde el turno anterior**. (Consumido aparte no se puede enseñar
   aún: la vista no lo trae; el cambio del almacén lo resume.)
4. **Entrar.** Un `<form>` de verdad (Enter envía, validación del navegador), con etiqueta, foco inicial, botón que
   se deshabilita mientras envía, campo de 16 px, y **los errores a la vista** (enlace usado o caducado con su
   explicación y la opción de pedir otro).
5. **Más amigable.** Nombres en castellano para tipos de orden, estados, potenciales, terrenos y recursos; recursos
   como fichas con icono de texto; listas como tarjetas; leyenda del modo del mapa; el conmutador con una línea que
   dice qué enseña cada modo; y ningún identificador interno ni «¿?» en pantalla.

## 3. Criterios de aceptación

1. En escritorio, pinchar una comarca (también sobre su feria o un aviso) abre su ficha y la resalta; arrastrar no
   la abre. Probado en la función pura de toque/arrastre y en el código de gestos.
2. Tras resolver, sale el resumen con los cambios de cada recurso (probado: el cambio calculado es después − antes
   del almacén, y la crónica del turno resuelto está en el resumen).
3. La entrada enseña el error de un enlace usado o caducado (probado en el almacén: el error queda y la pantalla de
   entrada lo lee).
4. Ningún texto de la interfaz enseña un identificador interno (probado: hay nombre en castellano para cada tipo de
   orden, estado, potencial, terreno y recurso).
5. `npm run verificar` en verde; el cliente sigue por debajo de su presupuesto.
6. **J-01 se repite** con el usuario.
