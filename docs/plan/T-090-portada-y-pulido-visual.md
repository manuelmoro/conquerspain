# T-090 · Portada, tipografía, emblemas, tutorial y pulido visual

**Fase:** 4 · Cliente · **Depende de:** T-086 · **Estado:** hecha (09-11-2026; abierta ese día a petición del usuario)

## 1. Contexto

Tras jugar la primera partida desde la portada, el usuario pide una entrada que **explique el juego e invite a
jugar de forma visual**, una tipografía más actual («como la de Instagram»), una **imagen para cada casa**, un
**tutorial** al entrar en una partida y un aspecto general más cuidado y usable. Además encontró un error: al
abrir la crónica en el turno 1 salía cinco veces «Vas demasiado deprisa».

Se descartó Higgsfield Katana: es de pago (suscripción y créditos) y solo hace vídeo. Todo el arte de esta tarea
es SVG propio o generado por script desde los datos del mundo, con la dirección de arte de la maqueta
(papel cálido, tinta, cobalto).

## 2. Qué se hace

1. **El error.** Al fallar una petición, la caché del cliente borraba la entrada, y la repintada siguiente volvía
   a pedirla, en bucle, hasta el límite del servidor (60 por minuto). En el turno 1 la crónica pedida no existe,
   así que fallaba siempre. Ahora hay una caché común (`cache.ts`): un fallo no se repite, se ofrece
   «Reintentar» y la crónica no se pide si aún no hay ninguna. Los errores no se apilan repetidos y se pueden
   cerrar.
2. **Tipografía.** «Instagram Sans» es propietaria y no se puede usar. Se usan **Plus Jakarta Sans** (texto, una
   grotesca geométrica del mismo estilo) y **Fraunces** (títulos, con aire de atlas), las dos OFL y alojadas en el
   propio cliente (`@fontsource-variable`), sin peticiones a terceros.
3. **Arte** (`cliente/src/arte/`):
   - un **emblema por casa**, en SVG hecho a mano: escudo con la pieza de su oficio (vellón, yunque, cincel,
     balanza, campanario, cristal de sal, herradura, espiga);
   - las **viñetas de entorno** de la maqueta, para las ofertas de origen;
   - la **península** de la portada, generada por script (`npm run portada`) desde `mundo.v1.json`, y comprobada
     en `verificar` como el atlas.
4. **Portada.** Antes de entrar y encima de «Mis partidas», arriba del todo: la península dibujada con recuas
   que van y vienen por sus caminos (quietas con «menos movimiento»), una frase de qué es el juego, **cómo se
   juega en tres pasos** (lee la crónica, da órdenes, la partida avanza sola a su hora) y las ocho casas con su
   emblema y una línea, con un botón para empezar.
5. **Casas con imagen.** Al elegir casa, cada tarjeta lleva su emblema; también la cabecera de la partida y la
   lista de partidas.
6. **Tutorial** (`tutorial.ts`, puro y probado). La primera vez que se entra en una partida, una tarjeta guía
   cinco pasos, y cada uno se da por hecho cuando el jugador lo hace:
   1. lo que tienes (los recursos);
   2. toca tu capital;
   3. da una obra;
   4. resuelve o espera el turno y lee qué pasó;
   5. cómo se gana tierra (la ficha de una vecina).

   Se puede saltar, y no vuelve a salir en esa partida (preferencia del navegador).
7. **Pulido y usabilidad.**
   - Barra superior con la marca y el emblema de tu casa.
   - Las secciones del panel (comarca, recuas, mercado, crónica, tu casa) como **pestañas con icono**, en lugar
     de cuatro botones sueltos.
   - Tarjetas, espaciados, radios y sombras coherentes, y botones con estado activo.

## 3. Criterios de aceptación

1. Abrir la crónica en el turno 1 no hace ninguna petición que falle, y una petición fallida no se repite
   (probado).
2. Las fuentes van incluidas en el cliente y no se pide nada a terceros. El JavaScript sigue bajo su
   presupuesto.
3. Hay emblema para cada casa (probado: uno por cada valor de `CASAS`) y viñeta para cada perfil de origen o un
   genérico.
4. La península de la portada se genera por script y `verificar` comprueba que está al día.
5. El tutorial avanza solo cuando el jugador hace cada paso y no vuelve a salir tras saltarlo (probado en lo
   puro).
6. Contraste AA y foco siguen vigilados (T-087). `npm run verificar` en verde.

## 4. Cierre (09-11-2026)

Los siete puntos de §2 están hechos y verificados.

- **Arreglo del error:** `cache.ts`, con su prueba.
- **Fuentes:** `@fontsource-variable/plus-jakarta-sans` y `@fontsource-variable/fraunces`.
- **Arte:** `src/arte/` (ocho emblemas, cinco viñetas y la península), con `npm run portada` y
  `portada:comprobar` dentro de `verificar`.
- **Pantallas:** `pantallas/portada.ts`, `tutorial.ts` y los cambios en las pantallas de entrada, partidas y
  partida (cabecera con emblema y vuelta, pestañas del panel, errores que se cierran, tutorial).

Visto en Chrome sin cabeza. 1295 pruebas y 59,5 KB gzip: el arte en línea de Vite suma unos 6 KB y la
portada otro poco.

**Pendiente para otra iteración, si el usuario la quiere:** más viñetas propias (hoy cinco entornos); y un vídeo
de portada, que se descartó porque las herramientas que lo generan son de pago.
