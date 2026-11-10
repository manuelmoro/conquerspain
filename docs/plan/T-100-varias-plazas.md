# T-100 · Varias plazas por partida y reparto del mapa

**Fase:** 5 · Multijugador · **Depende de:** T-087 · **Estado:** en curso: trabajo terminado y verificado; se
cierra al cerrar T-087, que espera la medición con personas (ESTADO)

## 1. Contexto

Hasta aquí todo funcionaba con un jugador, o con varios de casas distintas: como mucho ocho. El modo
Temporada (docs/06 §6.1) pide de 6 a 12 plazas.

## 2. Lo que ya había (T-049, T-065)

- Convocatoria por invitación, con sorteo de origen y fundación cuando todos eligen.
- Recorte del mapa proporcional a los jugadores.
- Tres ofertas de origen por jugador, alejadas `jornadasEntreCapitales` (6) de las de todos los demás: así,
  cualquier combinación de elecciones respeta la distancia.
- Resolución simultánea, con el orden de las órdenes fijado por su identificador.

## 3. Lo que faltaba, y cómo se ha resuelto

### 3.1 Hasta doce plazas con ocho casas

- **Cada casa, como mucho dos veces.** Decidido aquí: el usuario delegó las decisiones mientras no estaba.
  Con dos por casa caben 12 y cada casa sigue siendo rara en la partida.
- **El segundo jugador de una casa** se identifica como «casa-2». El jugador se guarda en la plaza (migración
  6 de la base, que rehace `plaza_convocatoria` sin `UNIQUE (convocatoria, casa)`). Con él se reparten las
  ofertas y se funda la partida. Las plazas antiguas eran de casas únicas: su jugador es su casa.
- **El núcleo ya repartía por jugador**: el apaño de usar la casa como identificador solo estaba en el
  servidor de altas.

### 3.2 El reparto con muchos jugadores

Ensayos con 12 jugadores, cuatro de ellos de casas repetidas:

| Ensayo | Resultado |
|---|---|
| Recorte y tres ofertas | Falla 4 sorteos de 20, y a menudo alguien recibe una o dos ofertas |
| Península entera y tres ofertas | Peor: falla 8 de 20 |
| Recorte y dos ofertas | Salen los 40 sorteos, pero en 5 alguien recibe una sola oferta |
| Península entera y dos ofertas | Salen los 40, con dos ofertas para todos |

La causa: elige primero quien menos orígenes tiene (los ferrones tienen 4; los canteros, 6). Los monjes, con
26, eligen los últimos, cuando 11 jugadores con 3 ofertas cada uno ya han tapado 33 zonas de exclusión.

Con **9 jugadores o más** (`jugadoresParaPeninsulaEntera`) se juega en la península entera, con **2 ofertas
por cabeza** (`origenesConMuchosJugadores`).

### 3.3 La equidad del reparto (`partidas/equidad.ts`)

**Qué se mide desde cada origen.** Las comarcas a `jornadasDeAlcance` (6) jornadas o menos, por camino, y si
tienen lo básico:

| Lo básico | De qué potenciales sale |
|---|---|
| Pan | labor o pesca |
| Madera | monte |
| Piedra | piedra |
| Algo estratégico | hierro, sal o pasto |

**La calidad del comienzo:** la suma ponderada de esos potenciales (pan ×3, madera ×2, piedra ×1, estratégico
×2), cada uno con tope de 12.

**La medida:** cada jugador se queda con su mejor oferta, y se mira el peor comienzo frente al mejor, en
milésimas.

**Lo medido en 100 sorteos de cada tamaño:**

| Jugadores | Fallos | Sin lo básico | Peor comienzo frente al mejor |
|---|---|---|---|
| 2 | 0 | 0 | 614 milésimas |
| 4 | 0 | 0 | 947 |
| 8 | 0 | 0 | 875 |
| 12 | 0 | 0 | 875 |

El umbral (`equidadMinimaMil`) es 600, justo por debajo de lo medido, para que un cambio que empeore el
reparto se note.

### 3.4 Distancia entre capitales y anillo neutral

Se mantienen 6 jornadas entre orígenes de jugadores distintos. Con el alfoz de T-094, las vecinas de cada
capital empiezan siendo de quien está al lado. Si una vecina toca a dos capitales, las dos casas parten con lo
mismo y ninguna puede incorporarla sin ganar ventaja: la expansión temprana no choca, se disputa.

### 3.5 Salas de espera

Si alguien no elige su origen, la partida no se queda parada: quien convoca puede **«Fundar ya, sin esperar»**
(`POST /convocatorias/:id/fundar`), y a quien no eligió le toca su primera oferta. Cualquier combinación de
ofertas respeta la distancia entre capitales.

### 3.6 Fuera de esta tarea

- El modo de partida sigue siendo «vecindad» para más de un jugador. La temporada, con su número de turnos,
  su cierre y su clasificación, es T-104.
- La influencia disputada es T-101, y el mercado común, T-102.

## 4. Criterios de aceptación

1. En 100 repartos de 12 jugadores, nadie empieza sin lo básico y el peor comienzo vale al menos 600
   milésimas del mejor (`multijugador.test.ts`). ✔
2. Un turno con 12 jugadores, con 8 turnos jugados por robots, se resuelve en menos de 5 segundos. ✔
3. Barajar el orden de los jugadores en el estado y el de las órdenes no cambia la huella del estado ni la de
   los sucesos. ✔
4. Una convocatoria de 3 con dos jugadores de la Mesta: ofertas distintas para cada uno, y «fundar ya» con
   quien no eligió (`altas.test.ts`). ✔

## 5. Verificación

`npm run verificar` (incluye `herramientas/banco/src/multijugador.test.ts` y las pruebas de altas).
