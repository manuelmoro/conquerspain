# T-107 · Entrar en una partida empezada

**Fase:** 5 · Multijugador · **Depende de:** T-105 · **Estado:** pendiente (ficha **esbozada**)

> Abierta desde T-105, que deja el amparo hecho en el motor sin que nadie pueda recibirlo todavía.

## 1. Contexto

Hoy las plazas se cierran al fundar. Una partida larga necesita que alguien pueda entrar después, en
una plaza libre o en la de un jugador que se fue, con 20 turnos de amparo (T-105 §3).

## 2. Puntos que hay que resolver al detallar

- Cómo se ofrece un origen libre en un mapa ya repartido (las ofertas de `prepararPartida`, sobre las
  comarcas neutrales y lejos de los dominios).
- Cómo entra el jugador en el estado sin romper el determinismo: una orden de alta que resuelve la fase 0,
  con su `amparoHasta`.
- Cuántas plazas puede tener una partida en curso (el tope de T-100).

## 3. Criterios de aceptación provisionales

1. Un jugador nuevo entra en una partida empezada, elige origen y juega desde el turno siguiente.
2. Entra con 20 turnos de amparo, público.
3. Nadie de la partida ve alterado su estado por la entrada, salvo la comarca que el nuevo ocupa.

## 4. Verificación

`npm run verificar`, con la entrada probada en el motor y en el servidor.
