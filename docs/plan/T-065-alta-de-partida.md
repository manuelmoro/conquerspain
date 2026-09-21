# T-065 · Alta de partida: casa, sorteo de orígenes y recorte de mapa

**Fase:** 3 · Servidor · **Depende de:** T-062, T-049 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Crear una partida es elegir mundo, ritmo, casa y capital. El sorteo de orígenes tiene que ser
justo, reproducible y guardado.

Lee antes: [docs/04-casas-y-tradiciones.md](../04-casas-y-tradiciones.md) §4.2 y [docs/05-geografia.md](../05-geografia.md) §5.7.

### Separación de responsabilidades (19-09-2026; T-049 hecha el 21-09-2026)

El recorte, las ofertas de origen y el arranque puro **ya están hechos** en
[T-049](T-049-preparacion-pura-de-partidas.md). Esta ficha consume ese contrato, persiste las
ofertas y elecciones y permite crear/unirse a partidas. No debe mantener otro algoritmo de
recorte ni una copia de las tablas de arranque.

**El contrato que hay que consumir** (`paquetes/nucleo/src/partidas/`):

```ts
prepararPartida({ mundo, reglas, semilla, participantes, recortar?, origenesFijos? })
  → Resultado<{ mundo, ofertas, avisos, comarcas, intentos }>
fundarPartida({ preparada, reglas, semilla, participantes, elecciones, configuracion, id })
  → Resultado<EstadoPartida>
```

Lo que le toca al servidor, y que T-049 deja fuera a propósito:

- **Persistir** el mundo recortado y las ofertas antes de preguntar. `prepararPartida` sortea y no
  funda justamente para eso: recargar no vuelve a sortear.
- Enseñar las tarjetas (`ventaja`, `limitacion`, `perfil`) y recoger la elección de cada jugador.
- Llamar a `fundarPartida` cuando estén todas; sus errores ya vienen con ruta y mensaje en español
  (elección que no estaba entre las ofertas, jugador sin elegir, capitales demasiado cerca).
- Publicar los `avisos` (a alguien le cupieron menos de tres ofertas) en el alta, no esconderlos.
- No tocar `origenesFijos` salvo para escenarios declarados: en una partida normal se sortea.

Los puntos heredados de abajo explican los requisitos que motivaron la extracción; **ya resueltos
en T-049**: algoritmo de recorte, sorteo con separación, distancia mínima entre capitales y
economía de arranque por origen. Aquí quedan la persistencia, la unión de participantes y la API.

## 2. Objetivo

Crear partidas con su semilla, su recorte de mapa, su casa elegida y sus tres orígenes
sorteados y persistidos.

## 3. Alcance

**Entra:** creación y unión de participantes, persistencia de ofertas y elecciones, y consumo del preparador de T-049 para recorte y fundación de capitales.

**No entra:** emparejamiento automático ni partidas públicas (más adelante).

## 4. Puntos que hay que resolver al detallar

- ~~Algoritmo de recorte~~ **hecho en T-049** (`recortarMundo`): región contigua con sal, hierro,
  pan, feria y pastos dentro, y su horquilla medida.
- ~~Sorteo de tres orígenes de perfiles distintos con separación~~ **hecho en T-049**
  (`ofertasDeOrigen`): cualquier combinación de elecciones respeta las seis jornadas.
- **Persistencia del sorteo: recargar no vuelve a sortear.** Esto sigue siendo de esta ficha.
- ~~Distancia mínima entre capitales~~ **hecha en T-049**: 6 jornadas base, en la tabla `recorte`.
- **Semilla privada:** no sale por la API ni por las ofertas de origen, como exige docs/02 §2.6
  y prueba T-044. La antigua propuesta de hacerla visible contradecía la niebla. Cualquier
  publicación posterior requerirá una política de final de partida explícita; no se añade aquí.
- ~~**Economía de arranque**~~ **hecha en T-049** (`arranqueDe`): los edificios se ajustan a la
  población, a la labor y a la vía de la casa, y hay una prueba de viabilidad por perfil de origen.
  El alta solo tiene que llamarla a través de `fundarPartida`.

- ~~**Sustituir el alta provisional del banco**~~ **hecho en T-049**: `herramientas/banco/src/partida.ts`
  es ya un adaptador de `prepararPartida`/`fundarPartida`, con recorte y arranque por origen. El
  servidor tiene que usar el mismo contrato, no copiarlo.

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
