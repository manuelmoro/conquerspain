# T-088 · Arreglos de J-01: entrar, pinchar el mapa, ficha a mano y resumen del turno

**Fase:** 4 · Cliente · **Depende de:** T-082 · **Estado:** en curso (abierta el 25-09-2026 tras J-01)

## 1. Contexto

La primera sesión de J-01 ([checkpoints-jugabilidad.md](checkpoints-jugabilidad.md)) no superó el checkpoint:
en escritorio el mapa no se deja pinchar, la ficha queda escondida, al resolver no se sabe qué ha pasado, la
entrada calla los errores y todo es poco amigable. Esta tarea arregla eso **antes** de T-083, y J-01 se repite.

## 2. Qué se hace

1. **Pinchar el mapa en escritorio y en móvil.** Sin captura del puntero al pulsar: solo se captura cuando el
   gesto pasa de 4 px (es un arrastre). El toque se detecta en `pointerup` buscando
   el primer elemento con comarca de **toda la pila** bajo el puntero (`elementsFromPoint`), así sirve también sobre avisos y ferias (que pasan a llevar su comarca).
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

### Añadido tras la segunda sesión de J-01 (hallazgos 6 a 11)

6. **Tu influencia, también en las comarcas oídas.** La regla ya la acumula en ellas (docs/06 §6.2: basta conocer
   la comarca de oídas); la vista (`vistaDeJugador`) no la daba. Pasa a darla para las neutrales oídas y
   exploradas, y la ficha y el modo Dominios la enseñan («Rioja Alavesa · 12»). Es un dato del propio jugador:
   no revela nada de las demás casas (prueba de fuga como la de T-044).
7. **Cómo se gana una comarca, explicado en su ficha.** En toda comarca neutral conocida: la influencia actual
   frente a los 60 que pide incorporarla, **cuánto sube o baja por turno ahora y por qué** (vecina +1, sin
   presencia −1…), calculado con la misma función que la fase de influencia, y qué lo aceleraría (una recua
   presente +2, un regalo +5, un mercado vecino +1). En una comarca oída, además: «Explórala con una recua para
   saber qué tiene».
8. **La crónica sin huecos.** `rebanyo.sin-pasto` lleva la comarca en la que pasta (y la plantilla la calla si
   está de camino). Prueba general: en una partida larga de todas las casas, **ningún texto de ninguna crónica
   deja un hueco `{…}` sin rellenar** (`rellenar` ya devuelve `faltan`; la prueba exige que esté vacío).
9. **Acción sugerida legible.** «Qué hacer: ruta» pasa a un texto en castellano por cada acción sugerida
   (tabla completa por tipo, como `nombres.ts`); si la acción aún no tiene pantalla, se dice cuándo llega en vez
   de ofrecer un botón que no lleva a nada.

**Pendiente de decisión del usuario:** permitir el **regalo al concejo** también en comarcas oídas (el concejo
existe aunque no se hayan visto sus tierras). Si se acepta, es un cambio de regla: docs/06 §6.2, `validarOrden`,
la ficha y su prueba. Si no, se queda solo para las exploradas.

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
7. (Segunda sesión) La influencia propia sale en la ficha y en el modo Dominios para toda comarca neutral
   conocida, y la vista no da ninguna influencia ajena que antes no diera (prueba de fuga).
8. (Segunda sesión) La ficha de una comarca neutral explica cuánto cambia la influencia este turno y por qué, con
   la misma cuenta que la fase 8 (probado: lo previsto coincide con lo que da la fase al resolver).
9. (Segunda sesión) Ninguna crónica de una partida larga de todas las casas deja un hueco sin rellenar, y
   ninguna acción sugerida se enseña con su identificador.

## 4. Dónde va (25-09-2026)

**Hecho lo de la primera sesión (§2, puntos 1 a 5). Falta lo de la segunda (§2, puntos 6 a 9, criterios 7 a 9) y
que el usuario termine J-01.** Por eso la tarea sigue abierta.

- **Mapa:** gestos reescritos en `atlas/svg.ts` con `atlas/gestos.ts` (umbral de 4 px, puro y probado). La causa
  de fondo del fallo en escritorio era doble: la captura del puntero al pulsar, y que **un camino pasa por encima
  de la capital** y tapaba el polígono (el toque solo miraba el elemento de arriba). Ahora se recorre toda la pila
  bajo el puntero y caminos y rutas no reciben eventos. Mano, resalte al pasar y la comarca abierta seleccionada.
  Colores por modo desde `atlas/paleta.ts` y leyenda de cada modo (`atlas/leyenda.ts`) con su explicación.
- **Disposición:** `estilo.css` (fuera del HTML): a partir de 900 px, mapa y panel lateral fijo; en móvil la
  ficha es una hoja inferior; «✕» arriba a la derecha; la confirmación de una acción, dentro de su tarjeta; el
  desplazamiento del panel se conserva entre repintadas (`data-conservar-scroll`).
- **Resumen del turno:** `resumen.ts` (puro) y `pantallas/resumen.ts`: al recargar tras resolver, un diálogo con
  una tabla por recurso —tenías, producido (lo de tus comarcas), otros (comida, obras, insumos, derribos,
  comercio), tienes y el cambio en verde o rojo—, los vecinos, y la crónica del turno por secciones con avisos
  primero, qué hacer y «Ver comarca». Al cerrarlo, la bandeja sigue enseñando el cambio y deja reabrirlo.
- **Entrar:** formulario de verdad con etiqueta, Enter, botón que se deshabilita y errores a la vista.
- **Amigable:** `nombres.ts` (tipos de orden, estados, potenciales, terrenos y recursos en castellano, completos
  por tipo), recursos como fichas, listas como tarjetas; ningún identificador ni «¿?» en pantalla.
- **Comprobado en navegador** (Chrome sin cabeza, escritorio 1366×800 y Pixel 7 táctil, servidor aparte): entrar,
  abrir la partida, pinchar la capital, elegir y dar una obra, resolver y ver el resumen.
- **Pruebas:** `amigable.test.ts` (nombres, resumen, toque/arrastre) y en `cliente.test.ts` el resumen tras
  recargar y el error de un enlace ya usado. `npm run verificar` en verde; 38,5 KB gzip.

**Siguiente paso:** implementar §2, puntos 6 a 9 (y el regalo en oídas si el usuario lo acepta); después el usuario
termina J-01 (`npm run dev`, su partida de prueba sigue en `desarrollo.sqlite`).
Si supera, se cierra T-088 y se marca J-01; si no, sus hallazgos se anotan aquí y se arreglan.
