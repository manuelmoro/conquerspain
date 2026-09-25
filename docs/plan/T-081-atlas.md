# T-081 · Atlas: capas, zoom y modos de lectura

**Fase:** 4 · Cliente · **Depende de:** T-080 · **Estado:** **hecha (25-09-2026)**

## 1. Contexto

El mapa es la pantalla principal (docs/08 §8.2.4). La maqueta v0.1 validó el aspecto (papel cálido,
cobalto para lo propio, niebla rayada) con D3 y un Voronoi propio; el juego real ya tiene su mapa
generado (`mundo.v1.json`: polígonos en unidades de atlas, con la y hacia abajo, 3011 vértices para 403
comarcas) y su niebla (`vistaDeJugador`, T-044). Falta llevar al cliente **la parte del mapa que el jugador
puede ver** y dibujarla con sus capas y sus modos.

Lee antes: [docs/08-interfaz.md](../08-interfaz.md) §8.2.4 y `maqueta/mapa.js`.

## 2. Objetivo

Un atlas en SVG, sin dependencias, con las capas de docs/08, los tres modos de lectura, zoom y
desplazamiento táctiles, y la niebla coincidiendo **exactamente** con la vista del jugador.

## 3. Alcance

**Entra:** el atlas del jugador (núcleo y ruta de la API), la composición de capas y modos (pura), la
colocación de rótulos, el encuadre (zoom y desplazamiento), el pintado en SVG y el conmutador de modos.

**No entra:** editar rutas (T-083), la ficha de comarca (T-082), la ilustración fina del terreno (se
empieza por tintas planas y tramas de la maqueta; la ilustración se afina con la dirección de arte).

## 4. Decisiones

### 4.1 El atlas del jugador sale del núcleo, a partir de su vista

`atlasDeJugador(vista, mundo)` (núcleo, puro) construye lo que el cliente puede dibujar **a partir de la
vista** (T-044), así que no puede enseñar más que ella:

- **Propias y exploradas:** polígono, nombre, terreno, potenciales (lo que un jugador sabe de una comarca que
  ha visto), si tiene feria, y el dueño que conoce (el suyo, o la foto de `datos.duenyo`).
- **Oídas:** polígono y nombre (el atlas es público, T-059), sin terreno ni potenciales ni dueño.
- **Desconocidas:** **solo el polígono, sin id ni nombre**, ordenadas por su primer vértice (para que ni el
  orden delate el id). Es la niebla: se ve que hay tierra, no qué hay. El contorno del tablero es público,
  como el de un tablero de mesa; lo que se esconde es su contenido.
- **Tramos:** solo los que tienen **las dos puntas conocidas** (oída o mejor), con sus jornadas base, vado,
  puerto, cierre invernal y cañada, y la calidad que el jugador conoce (`vista.caminos`, o la base si no hay
  mejora conocida).

Ruta `GET /partidas/:id/atlas` → `{ turno, atlas }`. El cliente lo guarda por turno: cambia poco.

### 4.2 Composición pura, pintado aparte

`componerAtlas(atlas, vista, modo, estacion) → Dibujo`: una lista de figuras por capa (`terreno`,
`comarcas`, `niebla`, `caminos`, `movimiento`, `rotulos`, `avisos`), cada una con su geometría, su clase
CSS y, si es texto, su prioridad. Es una función pura y se prueba en Node. `pintarAtlas(svg, dibujo)` la
convierte en SVG (un `<g>` por capa). **Cambiar de modo recompone y repinta; desplazar y hacer zoom solo
cambia el `viewBox`**: el DOM no se toca al moverse, que es lo que da fluidez en móvil.

### 4.3 Los tres modos

| Modo | Relleno de las comarcas | Rótulos y trazos |
|---|---|---|
| **Económico** (por defecto) | Propias y exploradas por su potencial más alto (paleta por potencial) | Nombre y su potencial principal |
| **Logístico** | Tinta neutra | Caminos por calidad (grosor) con sus jornadas; puertos cerrados en invierno en rojo; cañadas discontinuas |
| **Político** | Por dueño: propio en cobalto, ajeno por casa, neutral con trama | Influencia propia conocida en las neutrales |

En los tres: niebla sobre las desconocidas, niebla ligera sobre las oídas, recuas propias con su ruta y
avisos de acontecimientos anunciados. El conmutador va **abajo**, al alcance del pulgar.

### 4.4 Rótulos que no se amontonan

`colocarRotulos(rotulos, escala)` coloca por prioridad (capital 100 > propias 80 > exploradas 50 > oídas 20;
dentro, por nombre) y descarta el que se solaparía con uno ya puesto, estimando la caja por el número de
caracteres y la escala. Se recalcula al terminar el zoom, no durante.

### 4.5 Movimiento

Cada recua propia se dibuja donde está (en su comarca, o en el tramo según `jornadasHechasMil`) con una línea
por los centros de su ruta hasta el destino y un rótulo con las **jornadas** que le quedan (suma de
`jornadasBase` de los tramos pendientes menos lo andado). Jornadas y no turnos: los turnos dependen del paso,
la carga y el barro, y eso es la previsión de T-083.

### 4.6 Rendimiento

El atlas del mayor recorte (8 casas) son unas 210 comarcas: cientos de nodos SVG, no miles. Presupuesto
comprobable: **menos de 2 000 figuras** en el mayor dibujo, y desplazar no crea nodos. Los 60 fps en un móvil
se miden en el checkpoint J-01 (tras T-082), como el tiempo de arranque de T-080.

## 5. Piezas

```
paquetes/nucleo/src/reglas/atlas.ts           atlasDeJugador (y su prueba de fuga)
paquetes/servidor/src/api/manejadores.ts      GET /partidas/:id/atlas
paquetes/cliente/src/atlas/componer.ts        componerAtlas y los modos
paquetes/cliente/src/atlas/rotulos.ts         colocarRotulos
paquetes/cliente/src/atlas/encuadre.ts        zoom y desplazamiento (puro)
paquetes/cliente/src/atlas/svg.ts             pintado y gestos
paquetes/cliente/src/pantallas/partida.ts     el atlas con su conmutador
```

## 6. Criterios de aceptación

1. **Niebla exacta:** en el atlas de un jugador no aparece el id ni el nombre de ninguna comarca desconocida;
   las oídas no llevan terreno ni potenciales ni dueño; ningún tramo toca una desconocida; y el conjunto de
   comarcas con id es exactamente el de la vista (prueba sobre una partida real de tres casas).
2. **Los tres modos** dibujan lo que dice §4.3 (pruebas sobre el dibujo: rellenos por potencial, por dueño,
   jornadas en los caminos, puertos cerrados solo en invierno).
3. **Rótulos:** nunca se solapan dos colocados; la capital siempre está; al alejar se quitan antes los de menos
   prioridad.
4. **Encuadre:** el zoom conserva el punto bajo el dedo, tiene límites y el desplazamiento no se sale del mapa.
5. **Rendimiento:** el mayor dibujo tiene menos de 2 000 figuras; desplazar y hacer zoom solo cambian el
   `viewBox`.
6. **Movimiento:** una recua en camino aparece entre sus dos comarcas con las jornadas que le quedan.
7. `npm run verificar` en verde (incluido el peso del cliente).

## 7. Verificación

```bash
npm run verificar
npm run dev   # a mano: los tres modos, zoom y desplazamiento
```

## 8. Al terminar

1. Índice: T-081 `hecha`. 2. `ESTADO.md` y bitácora. 3. `docs/08` §8.2.4 con lo decidido.
4. Commit: `T-081: atlas con capas, modos y niebla exacta`.

## 9. Cierre (25-09-2026)

**Hecha.** `atlasDeJugador` en el núcleo, `GET /partidas/:id/atlas`, y en el cliente `atlas/componer.ts`,
`rotulos.ts`, `encuadre.ts`, `svg.ts` y `atlas.css`, con el atlas y su conmutador en la pantalla de la partida
(el mismo `<svg>` se reutiliza entre repintadas, así no se pierde el encuadre). 11 pruebas nuevas; el cliente
pesa 33,6 KB gzip.

**Criterios:**

1. **Niebla exacta:** para cada una de las tres casas de una partida real, las comarcas con id son exactamente las
   de su vista, ninguna desconocida aparece por id ni por nombre, las oídas no llevan terreno, potenciales ni dueño
   y ningún tramo toca una desconocida; el dibujo tampoco los contiene.
2. **Modos:** económico tinta por potencial principal y rotula con él; político pinta lo propio en cobalto y lo
   neutral aparte; logístico destaca los caminos con sus jornadas, marca las cañadas y cierra **en invierno y solo en
   invierno** exactamente los puertos que cierran sin calzada.
3. **Rótulos:** nunca se solapan a tres escalas, la capital siempre está, al alejar caben menos y el resultado no
   depende del orden de llegada.
4. **Encuadre:** el zoom conserva el punto bajo el dedo, se queda entre el zoom máximo y 1,2 veces el mapa, y
   desplazar no saca el centro del mapa.
5. **Presupuesto:** el mayor dibujo (el mapa entero de ocho casas, todo explorado, modo logístico) tiene menos de
   2 000 figuras. Moverse solo cambia el `viewBox` (por construcción en `svg.ts`).
6. **Movimiento:** una recua a mitad de tramo aparece entre sus dos comarcas con las jornadas que le quedan.
7. `npm run verificar` en verde.

**Queda para el checkpoint J-01 (tras T-082):** mirar el atlas con ojos humanos en un móvil (fluidez, legibilidad
de los tres modos sin leyenda). Aquí no hay navegador en la integración continua; el pintado en SVG se ha escrito
pero solo se ha comprobado su composición.
