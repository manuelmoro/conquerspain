# T-130 · Resolver el turno para todos, separado de terminar el tuyo (y los enlaces de la guía)

**Fase:** 7 · Tras jugar de verdad · **Depende de:** T-128 · **Estado:** **hecha (11-11-2026)**

> Peticiones del usuario (11-11-2026): «el botón avanzar turno despista: no sé si avanzo yo solo o fuerzo el
> avance de toda la comunidad», y «en la guía los hipervínculos no llevan bien a la subsección».

## 1. Contexto

Desde T-090, quien convocó tenía «⏭ Avanzar turno» en la cabecera. Al llegar «✓ He terminado el turno»
(T-124), los dos quedaron juntos y el primero parecía la versión individual del segundo, cuando resuelve el
turno de todas las casas.

## 2. Diseño

- La cabecera solo tiene lo individual: «✓ He terminado el turno» y el contador «n/m listos ▾».
- Resolver para todos va al pie de la lista que despliega el contador (T-128), con el texto «Como convocaste
  la partida, puedes no esperar a nadie» y el botón «⏭ Resolver el turno ahora para todos». Siempre pide
  confirmación (antes, en las partidas de prueba, no), diciendo a cuántas de las demás casas se les corta el
  turno y que lo que no hayan ordenado se queda sin hacer.
- Lo ven los mismos que antes: quien convocó, o cualquiera en una partida de prueba. El servidor no cambia
  (`POST /partidas/:id/avanzar`). Jugando solo no hace falta: terminar el turno ya lo resuelve en el acto.
- El paso «El turno se resuelve a su hora» del tutorial señala ahora «He terminado el turno»; la guía, la
  herramienta `partida:prueba` y el protocolo de checkpoints dejan de nombrar el botón viejo.

### 2.2 Los enlaces de la guía

Las capturas de la guía cargaban perezosas y sin tamaño: al saltar a una sección, las de encima se cargaban
después, crecían y la empujaban hacia abajo (medido: «Las ocho casas» acababa a más de 4 000 px de donde
paraba la página). Ahora cada `<img>` lleva el ancho y el alto de su captura, y el navegador reserva el hueco
antes de cargarla. Como las capturas cambian de tamaño en cada tirada, `npm run guia:capturas` los escribe
en `guia/index.html` al terminar (`herramientas/jpeg.ts`: lee la cabecera SOF del JPEG y los sustituye), y
`guia.test.ts` comprueba que cada imagen declara el tamaño de su fichero.

## 3. Criterios de aceptación

1. En la cabecera no queda nada que resuelva el turno de los demás. ✔
2. Quien convocó puede resolverlo para todos desde «n/m listos», con confirmación que dice a quién afecta. ✔
3. Cada enlace del índice de la guía deja su sección arriba, en escritorio y en el móvil. ✔

## 4. Verificación

`npm run verificar`. Probado en el navegador con la partida de muestra: Ana despliega la lista, pide resolver,
lee «se corta el turno a la otra casa que no ha terminado», confirma y la partida pasa al turno siguiente. En
la guía, cinco enlaces del índice en 1440 px y en 390 px: cada sección queda a 16 px de arriba (el margen de
`scroll-padding`), cuando antes acababa miles de píxeles más abajo.
