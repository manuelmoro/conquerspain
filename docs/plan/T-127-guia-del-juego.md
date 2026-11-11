# T-127 · Guía del juego completa, con capturas

**Fase:** 7 · Tras jugar de verdad · **Depende de:** T-124 · **Estado:** **hecha (11-11-2026)**

> Petición del usuario (11-11-2026): «una sección de ayuda disponible desde la home y desde la partida, muy
> completa. Utiliza Playwright para sacar capturas y explica toda la dinámica de una partida, estrategia para
> jugar, qué hacer en los primeros turnos, etc.».

## 1. Contexto

La ayuda de la partida (T-090) es una lista de temas cortos con botones que llevan a hacerlos: útil mientras
se juega, pero no explica la partida entera ni la estrategia, y no se ve desde la portada.

## 2. Diseño

### 2.1 La página

`paquetes/cliente/guia/index.html`, segunda entrada de Vite (`build.rolldownOptions.input`), servida en
`/guia/`. No carga el juego: su script (`src/guia/guia.ts`, 2 KB) pone fuentes y estilos (`guia.css`, el
mismo papel y tinta que el juego) y pinta las ocho casas. El servidor sirve ahora la `index.html` de una
carpeta para una ruta sin extensión (`estaticos.ts`); si no la hay, la del juego, como antes.

Diecinueve secciones con índice fijo en escritorio (marca la que se lee) y arriba en el móvil: qué es,
empezar (cuenta, convocar, origen, invitación), cómo va un turno (quincenas, corte, terminar el turno, plazo
reiniciado, resumen y crónica, estaciones), la pantalla, el mapa (tres vistas, niebla, plano), los recursos
(con el desglose), las comarcas (vecinos, solares, rango, cuadrillas, edificios, lealtad, fueros,
administración), dar órdenes, recuas y rebaños, ganar tierra (influencia, alfoz, concejo dividido,
pueblas), comerciar, tu casa (mayordomo, tradiciones, contratos y crédito), los demás jugadores (portazgos,
información, conflicto), prestigio, las ocho casas, **tus primeros turnos** (turno 1, turnos 2 a 6 y el
primer año), **estrategia**, errores típicos y glosario. Los números citados son los de las tablas y los
documentos de diseño (`docs/03`, `docs/04`, `docs/06`).

### 2.2 Las casas, de las tablas

Cada casa sale de `TABLAS_DEL_JUEGO.casas` (privilegio, herramienta y límite) con su emblema, y su consejo
de juego de `src/guia/consejos.ts`, completo por tipo: si se añade una casa, no compila hasta escribirlo.

### 2.3 Las capturas

`npm run guia:capturas` (`cliente/herramientas/guia.ts`): siembra una partida de muestra en una base
temporal (`npm run partida:muestra -- base --json`), arranca servidor y Vite en puertos aparte y la recorre
con Chrome mediante `playwright-core` (sin descargar navegadores; `CHROME=` si no lo encuentra): portada,
invitación sin cuenta, unirse, convocar, elegir origen, mis partidas, tutorial, partida, los tres modos del
mapa, ficha y plano de la capital, confirmar una orden, bandeja, ficha de una vecina, desglose, invitar,
terminar el turno con dos cuentas, resumen, crónica, mercado, tu casa, ayuda, la ruta de una recua y el
móvil. 27 imágenes JPEG en `public/guia/` (1,7 MB, fuera del presupuesto de JavaScript).

### 2.4 Enlaces

«📖 Guía» en la barra de la portada y de «Mis partidas»; «Lee la guía completa…» en «Cómo se juega» de la
portada; y en la pestaña Ayuda de la partida, en otra pestaña del navegador para no salir de la partida.

### 2.5 Arreglo encontrado al sacar las capturas

El mapa se recomponía a veces con el `<svg>` aún fuera de la página (al llegar un turno nuevo): con ancho 0
la escala salía minúscula y las ferias, las torres y los rótulos se pintaban enormes, tapando los toques
hasta el siguiente zoom. Ahora `montarAtlas` repinta en cuanto el mapa tiene tamaño (`ResizeObserver`), y
también al cambiar el ancho de la ventana.

## 3. Archivos

Nuevos: `cliente/guia/index.html`, `cliente/src/guia/{guia.ts,guia.css,consejos.ts,guia.test.ts}`,
`cliente/herramientas/guia.ts`, `cliente/public/guia/*.jpg`. Tocados: `cliente/vite.config.ts`,
`servidor/src/api/estaticos.ts` (+ test), `servidor/herramientas/partida-de-muestra.ts` (`--json`),
`cliente/src/atlas/svg.ts`, `pantallas/{cuenta,portada,ayuda}.ts`, `estilo.css`, `package.json`
(`guia:capturas`, `playwright-core`), `CLAUDE.md`, `docs/08-interfaz.md`.

## 4. Criterios de aceptación

1. Hay una guía completa en `/guia/`, accesible desde la portada, desde «Mis partidas» y desde la partida. ✔
2. Explica la dinámica entera de una partida, la estrategia, cada casa y los primeros turnos. ✔
3. Las capturas son del juego real y se rehacen con un comando. ✔
4. Cada imagen citada existe y se usa, el índice lleva a secciones reales y ningún id se repite. ✔
5. Se lee bien en el móvil, sin desplazamiento horizontal. ✔
6. La guía no pesa en el juego: el presupuesto de 150 KB se cumple (97,6 KB). ✔

## 5. Verificación

`npm run verificar`, con `src/guia/guia.test.ts` y `estaticos.test.ts`. `npm run guia:capturas` recorre la
partida de principio a fin sin errores. Probado en el navegador: la guía en escritorio y en 390 px (sin
desplazamiento horizontal, sin imágenes rotas ni errores de consola) y servida por el servidor de producción
desde lo compilado (`/guia/`, `/guia` y las imágenes).
