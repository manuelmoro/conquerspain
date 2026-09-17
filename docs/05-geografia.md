# 05 · Geografía: el tablero

El mapa no es un decorado: es la fuente de casi toda la decisión del juego. Por eso se construye con
datos reales, con un proceso reproducible, y se revisa a mano comarca por comarca.

---

## 5.1 Alcance

- España peninsular, Portugal y Andorra. Sin islas en la v1 (las Baleares y los archipiélagos
  entran cuando exista el comercio marítimo).
- Las fronteras políticas actuales solo se usan como referencia visual discreta. No definen
  facciones ni reglas.
- El norte de África y el sur de Francia se dibujan como tierra vecina, fuera de juego.

## 5.2 Comarcas de juego

- El tablero son **comarcas de juego**: unas 320–380 celdas que cubren la península. Mientras el
  catálogo se escribe región a región conviven comarcas reales y de relleno, y el total puede
  subir hasta 430 antes de volver a bajar.
- Cada comarca agrupa una superficie de entre 1 000 y 3 000 km² y contiene entre una y seis
  localidades reales, situadas en sus coordenadas.
- Los límites son simplificados (polígonos generados a partir de puntos de referencia y recortados a
  la costa), no divisiones administrativas reales. Se documenta así en el propio juego.
- El nombre de cada comarca es **real** siempre que exista una denominación tradicional
  (Tierra de Campos, La Alcarria, Maestrazgo, Alto Alentejo, Baixo Minho, Las Hurdes, Priorat…).
  Cuando no hay nombre tradicional claro, se usa el de la cabecera comarcal («Tierra de Almazán»).

### 5.2.1 Ficha de comarca en el catálogo

```jsonc
{
  "id": "pinares-soria",
  "nombre": "Pinares",
  "cabecera": "Covaleda",
  "region": "Sistema Ibérico norte",
  "centro": [-2.92, 41.92],
  "terreno": "sierra",              // llano | ondulado | sierra | costa | vega
  "potenciales": { "labor": 1, "monte": 5, "pasto": 4, "piedra": 2, "hierro": 0, "sal": 0, "pesca": 0 },
  "solares": 6,
  "poblacionInicial": 40,
  "localidades": [
    { "nombre": "Covaleda", "coord": [-2.879, 41.934], "cabecera": true },
    { "nombre": "Duruelo de la Sierra", "coord": [-2.931, 41.955] }
  ],
  "rasgos": ["pastos de verano", "pinar maderable"],
  "patrimonio": [],
  "feria": null,
  "canyada": "Soriana Occidental"
}
```

### 5.2.2 De dónde salen los potenciales

No se inventan: se derivan de criterios geográficos documentados y luego se revisan a mano.

| Potencial | Criterio principal |
|---|---|
| `labor` | Llanura sedimentaria, vega fluvial, clima; penaliza altitud y pendiente |
| `monte` | Masa forestal real (pinares, robledales, castañares, montado alentejano) |
| `pasto` | Altitud y uso ganadero tradicional; distingue pasto de verano y de invierno |
| `piedra` | Canteras históricas y litología (granito, caliza, mármol, pizarra) |
| `hierro` | Cuencas ferríferas reales: Vizcaya, Cantabria, Sierra Menera, Ojos Negros, Riotinto |
| `sal` | Salinas de interior (Añana, Imón, Poza, Rio Maior) y marítimas (Cádiz, Levante, Aveiro) |
| `pesca` | Costa con puerto histórico; distingue cantábrica, atlántica y mediterránea |

Cada asignación que no sea evidente lleva una nota en el catálogo explicando por qué. Es contenido:
un jugador que reconoce su tierra y ve que el juego «sabe» lo que allí se hacía, se queda.

## 5.3 Terreno y relieve

El terreno de la comarca fija la base de jornadas de sus tramos y el aspecto del atlas. Los tramos
entre comarcas heredan el terreno más duro de las dos, y se marcan aparte los **puertos de montaña**
históricos (Piqueras, Somosierra, Pajares, Despeñaperros, Portillo de Padornelo…), que son los que
se cierran en invierno.

## 5.4 Caminos y cañadas

- **Grafo de caminos**: aristas entre comarcas vecinas, con terreno, vados y puertos.
- **Cañadas reales**: nueve rutas trashumantes históricas (Soriana Occidental y Oriental, Segoviana,
  Leonesa Occidental y Oriental, Galiana, Riojana, Conquense, de la Plata) trazadas como caminos
  especiales. Los rebaños las usan con ventaja; la Mesta, con privilegio.
- **Camino de Santiago**: ruta con efecto propio (peregrinos: ingresos y difusión de rumores) para
  las comarcas que atraviesa.
- **Calzadas romanas** (Vía de la Plata, Vía Augusta): tramos que empiezan la partida con mejor
  factor de camino. Un guiño que además explica por qué ciertas rutas eran las buenas.

## 5.5 Patrimonio y rasgos

Cada comarca puede tener rasgos que dan color y efecto:

| Rasgo | Efecto |
|---|---|
| Salinas históricas | Habilita salina de nivel alto |
| Ferrería de agua | Ferrerías más baratas |
| Cantera noble (mármol de Macael, piedra de Villamayor) | Obras mayores más baratas y más prestigio |
| Dehesa | Pasto de invierno de calidad; penaliza roturar |
| Marisma | Pesca y sal; labor mala |
| Ciudad episcopal | Requisito de catedral; +prestigio |
| Villa de feria | Derecho de feria (§5.6) |
| Puerto de mar | Requisito de atarazana y comercio marítimo |

## 5.6 Ferias

Las ferias son citas fijas del calendario. Llegar a tiempo es media estrategia.

| Feria | Comarca | Turnos |
|---|---|---|
| Medina del Campo (mayo) | Tierra de Medina | 10–11 |
| Medina del Campo (octubre) | Tierra de Medina | 19–20 |
| Villalón | Tierra de Campos | 12 |
| Burgos | Alfoz de Burgos | 14 |
| Sevilla | Aljarafe | 6 y 21 |
| Zafra | Tierra de Barros | 19 |
| Verín / Chaves | Támega | 16 |
| Lérida / Lleida | Segrià | 18 |
| Valencia | L'Horta | 8 |
| Santiago | Terra de Santiago | 15 |

Las ferias no solo compran y venden: ahí llegan los rumores, se ven los precios de otras plazas y se
cierran contratos entre jugadores.

## 5.7 Origen de la partida

- El catálogo marca qué comarcas pueden ser **origen** (cabecera con nombre reconocible, potenciales
  equilibrados para al menos una casa, y conexión a tres o más vecinas).
- El sorteo ofrece tres orígenes de **perfiles distintos**, filtrados por la casa elegida (§4.2), y
  queda guardado en la partida: recargar no vuelve a sortear.
- El origen determina la capital, y la capital da nombre al dominio en la crónica.

## 5.8 Generación del mapa (proceso reproducible)

`herramientas/atlas/` contiene el proceso completo, ejecutable con un solo comando:

1. **Descarga** de fuentes abiertas: Natural Earth (costas, ríos, relieve), con licencia de dominio
   público. Las descargas se guardan en caché y se verifican por hash.
2. **Proyección** equirectangular ajustada a 40,2° N (la que ya usa la maqueta), en unidades de mapa
   donde 1 unidad ≈ 1,11 km.
3. **Semillas de comarca**: puntos de referencia del catálogo (uno por comarca) más relleno
   automático donde falte, con separación mínima.
4. **Polígonos**: diagrama de Voronoi recortado a la línea de costa.
5. **Grafo**: vecindad de Voronoi filtrada (se eliminan vecindades a través del mar salvo estrechos
   documentados), con terreno, vados y puertos.
6. **Validación**: comprueba que no hay comarcas sin vecinos, sin nombre, con potenciales
   imposibles (sal en el interior seco sin salina histórica), ni localidades fuera de su polígono.
7. **Salida**: `paquetes/mundo/datos/mundo.json` + un resumen legible para revisión humana.

El resultado se versiona: `mundo.v1.json`. Un cambio en el mapa es un cambio de versión, porque
puede alterar partidas en curso.

## 5.9 Trabajo pendiente del catálogo

El catálogo completo no se escribe de una sentada. Se construye por regiones, y cada región se da
por terminada cuando pasa la validación y una lectura humana:

1. Sistema Ibérico y Alto Duero (incluye la zona de la maqueta actual).
2. Meseta norte: Tierra de Campos, Cerrato, Páramos, Alfoz de Burgos.
3. Cornisa cantábrica y País Vasco (hierro y pesca).
4. Galicia y norte de Portugal.
5. Sistema Central y Extremadura (dehesas y cañadas).
6. Meseta sur: La Mancha, Alcarria, Montes de Toledo.
7. Valle del Ebro, Pirineo y Cataluña.
8. Levante y Murcia (vegas y salinas).
9. Andalucía: valle del Guadalquivir, Subbética, costa.
10. Centro y sur de Portugal: Beiras, Alentejo, Algarve.

Cada bloque es una tarea del plan con su ficha propia.
