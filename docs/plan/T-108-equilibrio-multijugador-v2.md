# T-108 · Equilibrio multijugador v2: las vías rezagadas

**Fase:** 5 · Multijugador · **Depende de:** T-106 · **Estado:** pendiente (ficha **esbozada**)

> Abierta desde T-106, que dejó la medición (`npm run banco:salud`) y el diagnóstico. Conviene hacerla con
> datos de partidas reales: el usuario juega y corrige.

## 1. Contexto

Con ocho casas a 120 turnos (T-106 §3), el primero saca entre un 89 % y un 153 % a la mediana (objetivo,
menos del 60 %). Canteros gana dos de tres semillas. Cuatro casas se quedan con una o dos comarcas:
ferrones, salineros, mercaderes y, según la semilla, arrieros. Entrar más veces da algo más de
prestigio (correlación de 0,22; objetivo, menos de 0,15).

## 2. Puntos que hay que resolver al detallar

- Robots de ferrones, salineros y mercaderes que jueguen su vía con rivales: comercio entre casas,
  contratos (T-103), ferias destacadas.
- Por qué la Mesta y los salineros entran sin nada que mandar (un tercio de los turnos): ¿falta de
  decisiones del juego o robot pasivo?
- Si las primicias de hitos amplifican demasiado al que ya va delante, con datos de partidas reales.
- Contrastar el banco con las métricas de partidas de verdad.

## 3. Criterios de aceptación provisionales

Los de T-106: las seis métricas de docs/06 §6.8 en tres semillas, ninguna casa que gane dos, y la
correlación entre conexiones y prestigio por debajo de 0,15.

## 4. Verificación

`npm run verificar` y `npm run banco:salud`.
