# T-065 · Alta de partida: casa, sorteo de orígenes y recorte de mapa

**Fase:** 3 · Servidor · **Depende de:** T-062 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Crear una partida es elegir mundo, ritmo, casa y capital. El sorteo de orígenes tiene que ser
justo, reproducible y guardado.

Lee antes: [docs/04-casas-y-tradiciones.md](../04-casas-y-tradiciones.md) §4.2 y [docs/05-geografia.md](../05-geografia.md) §5.7.

## 2. Objetivo

Crear partidas con su semilla, su recorte de mapa, su casa elegida y sus tres orígenes
sorteados y persistidos.

## 3. Alcance

**Entra:** creación, recorte del mapa según número de plazas, sorteo filtrado por casa, elección y fundación de la capital, unión de jugadores a una partida.

**No entra:** emparejamiento automático ni partidas públicas (más adelante).

## 4. Puntos que hay que resolver al detallar

- Algoritmo de recorte: región contigua de tamaño proporcional a las plazas, con recursos estratégicos repartidos y sin dejar a nadie sin sal ni hierro alcanzables.
- Sorteo: tres orígenes de perfiles distintos, filtrados por las necesidades de la casa, separados entre sí una distancia mínima si hay varios jugadores.
- Persistencia del sorteo: recargar no vuelve a sortear.
- Distancia mínima entre capitales de jugadores distintos (propuesta: 6 jornadas) y comprobación de que todos tienen espacio neutral alrededor.
- Semilla de partida visible: parte de la transparencia competitiva.
- **Economía de arranque** (añadido al cerrar T-032): la tabla `arranque` de las reglas
  (`paquetes/nucleo/src/datos/arranque.ts`: almacén inicial y edificios de origen) la aplica el
  alta. Dos granjas alimentan un origen típico (labor 3, 75 vecinos) sin escasez el primer año;
  un origen de 100 vecinos, o de labor 1–2, pasa hambre en la primavera. El alta tiene que
  ajustar los edificios de origen a la población y a la labor (o a la vía de la casa, como la
  lonja del pescador) y comprobarlo con el banco de pruebas: nadie empieza condenado.

- **Sustituir el alta provisional del banco** (añadido al cerrar T-046):
  `herramientas/banco/src/partida.ts` reparte hoy las capitales por la península entera con el sorteo
  por casa, la elección entre los tres orígenes y seis jornadas entre capitales, pero no recorta el
  mapa ni ajusta el arranque al origen. El banco tiene que pasar a usar el alta de verdad, y el
  informe de T-046 dice por qué hace falta: 235 de 403 comarcas no las toca nadie en 200 turnos, y
  los orígenes de `labor 1` (Molina, Bilbao) empiezan condenados al hambre con dos granjas.

## 5. Criterios de aceptación provisionales

1. Con la misma semilla, el recorte y el sorteo son idénticos.
2. Ningún jugador empieza a menos de la distancia mínima de otro.
3. Cada casa recibe orígenes viables para su vía (test por casa).
4. El sorteo persiste y no cambia al recargar.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-065: <resumen>`.
