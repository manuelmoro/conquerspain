# T-128 · Quién ha terminado el turno

**Fase:** 7 · Tras jugar de verdad · **Depende de:** T-124 · **Estado:** **hecha (11-11-2026)**

> Petición del usuario (11-11-2026): «¿se puede ver qué jugadores han avanzado turno y cuáles no? Sin que sea
> muy llamativo, pero que se pueda ver para decir algo a esos jugadores».

## 1. Contexto

T-124 dejó el contador «n/m listos» en la cabecera, con los que faltan solo en un `title` (invisible en el
móvil) y en el bloque de debajo de las órdenes.

## 2. Diseño

- El contador pasa a ser un botón discreto («1/3 listos ▾»). Al pulsarlo despliega, sin mover la cabecera,
  una lista flotante: primero quien falta y luego quien ha terminado, cada uno con su nombre, su casa, si ha
  terminado y, si lleva dos o más turnos sin dar órdenes (`turnosSinOrdenes`, público desde T-105), cuántos.
  De uno mismo no se dice. Vuelve a pulsarse para plegarla.
- `filasDeQuienJuega` (`cliente/src/fin-de-turno.ts`, pura) compone las filas; la pantalla le pasa el nombre
  de cada casa desde las tablas del juego.
- Sin cambios en el servidor: el estado ya trae `finDeTurno`, y el canal en vivo la mantiene al día.

## 3. Criterios de aceptación

1. Desde la cabecera, con un toque, se ve quién ha terminado y quién no, también en el móvil. ✔
2. Plegada, la cabecera queda igual que antes. ✔
3. Se ve a quién lleva turnos sin dar órdenes, para saber a quién escribir. ✔

## 4. Verificación

`npm run verificar`, con `fin-de-turno.test.ts`. Probado en el navegador con `npm run guia:capturas`
(captura `lista-de-listos.jpg`).
