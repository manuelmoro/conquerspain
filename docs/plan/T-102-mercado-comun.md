# T-102 · Mercado común, rumores e información entre jugadores

**Fase:** 5 · Multijugador · **Depende de:** T-100 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Con varios jugadores, los precios los mueven ellos. Es la competición más sana y la que más
juego da sin que nadie ataque a nadie.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.10 y [docs/06-competicion.md](../06-competicion.md) §6.5.3.

## 2. Objetivo

Mercado compartido de verdad, con mercaderes menores decreciendo, rumores entre jugadores y
el cometido de emisario.

## 3. Alcance

**Entra:** casación con varios jugadores, retirada progresiva de los mercaderes menores, rumores por feria, emisario y su informe con retraso.

**No entra:** contratos y portazgos (T-103).

## 4. Puntos que hay que resolver al detallar

- Curva de retirada de los mercaderes menores según volumen humano, sin que una plaza se quede seca de golpe.
- Qué información viaja por rumor y con cuánto retraso e imprecisión.
- Emisario: coste, retraso, y que el espiado se entere (es información pública que ha habido visita).
- Protección contra manipulación: límites de volumen por turno y por jugador en una plaza.

## 5. Criterios de aceptación provisionales

1. Un jugador puede mover el precio de un recurso, pero no llevarlo al suelo en un turno.
2. Los rumores llegan fechados y su imprecisión está acotada.
3. El emisario informa con retraso y deja rastro.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-102: <resumen>`.
