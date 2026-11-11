# T-132 · Un arranque más generoso

**Fase:** 7 · Tras jugar de verdad · **Depende de:** T-049 · **Estado:** **hecha (11-11-2026)**

> Petición del usuario (11-11-2026), tras jugar: «creo que los recursos con los que se empieza son muy
> limitados. Estúdialo y auméntalo».

## 1. Estudio

El almacén de arranque era 80 de pan, 60 de madera, 20 de piedra y 60 maravedís, más lo que el ajuste de
T-049 da en maravedís a quien no se alimenta de su tierra. Con eso, el primer turno da para una recua
(20 mrs y 10 de pan) y una incorporación del alfoz (40 de pan y 30 mrs); la piedra solo llega para un
mercado. Se jugaron las ocho casas con los robots del banco, tres semillas y 72 turnos, con tres variantes:

| Variante (pan · madera · piedra · mrs · sal) | Comarcas t72 | Vecinos t72 | Prestigio t72 | Turnos de hambre | Más fuerte / más débil |
|---|---|---|---|---|---|
| Actual (80 · 60 · 20 · 60 · 0) | 3,1 | 209 | 232 | 6,4 | 7,8× |
| Doble (160 · 120 · 40 · 120 · 0) | 3,4 | 246 | 271 | 5,0 | 6,5× |
| **Elegida (150 · 150 · 80 · 200 · 10)** | **3,5** | **262** | **276** | 6,1 | **6,6×** |

Lo que se ve: con el arranque viejo, ferrones, mercaderes, Mesta y salineros seguían con una sola comarca a
los tres años. El nuevo sube el prestigio medio un 19 % y estrecha algo la distancia entre casas sin disparar
a ninguna. **No** arregla el hambre de los ferrones (unos 20 de 72 turnos) ni de los salineros (unos 15):
viene de lo que producen, no del arranque, y queda para T-108.

Se eligió la variante con más piedra y maravedís, aunque la doble da números parecidos a los robots, porque
lo que pedía el usuario es poder **hacer varias cosas en los primeros turnos**: 150 de madera y 80 de piedra
dan para un mercado, unas casas y una granja; 200 maravedís, para una recua, dos incorporaciones y un regalo.
Los 10 de sal enseñan desde el principio para qué sirve (conservar el pan).

## 2. Cambio

`ARRANQUE.almacen` en `nucleo/src/datos/arranque.ts`: 150 de pan, 150 de madera, 80 de piedra, 200
maravedís y 10 de sal. El ajuste por comarca (granjas y compensación) no cambia.

**Las partidas en marcha no cambian.** El arranque solo se usa al fundar una partida y al entrar en una
empezada, y la versión de reglas (`VERSION_REGLAS`) no se toca: subirla detendría las partidas que se juegan
en producción. Lo nuevo vale para las partidas que se funden desde ahora y para quien entre en una empezada.

## 3. Criterios de aceptación

1. Se empieza con bastante para varias acciones en el primer turno. ✔
2. Ninguna casa se dispara: la distancia entre la más fuerte y la más débil no crece. ✔
3. Las partidas en marcha siguen igual. ✔

## 4. Verificación

`npm run verificar` (incluida la viabilidad de los orígenes) y `npm run partidas` sin cambios en las
huellas. El estudio se hizo con un guion temporal sobre `jugarTurno` del banco, como el de
`cronica.test.ts`; sus números están en la tabla de §1.
