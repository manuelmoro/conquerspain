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

- El tablero son **comarcas de juego**: **403** celdas cubren la península (la estimación inicial
  era de 320–360; el catálogo escrito región a región salió algo más fino, con una media de unos
  1 400 km² por comarca, dentro de la horquilla de superficie de más abajo). El atlas acepta entre
  340 y 420 con el catálogo completo, y hasta 430 mientras queden comarcas de relleno.
- Cada comarca agrupa una superficie de entre 1 000 y 3 000 km² y contiene entre una y seis
  localidades reales, situadas en sus coordenadas.
- Los límites son simplificados (polígonos generados a partir de puntos de referencia y recortados a
  la costa), no divisiones administrativas reales. Se documenta así en el propio juego.
- El nombre de cada comarca es **real** siempre que exista una denominación tradicional
  (Tierra de Campos, La Alcarria, Maestrazgo, Alto Alentejo, Baixo Minho, Las Hurdes, Priorat…).
  Cuando no hay nombre tradicional claro, se usa el de la cabecera comarcal («Tierra de Almazán»).

### 5.2.1 Ficha de comarca en el catálogo

Una región es un archivo `paquetes/mundo/catalogo/NN-region.jsonc` con una lista de fichas así
(el formato exacto y sus reglas están en la ficha de [T-010](plan/T-010-esquema-del-catalogo.md)):

```jsonc
{
  "id": "pinares",                    // minúsculas, sin tildes ni eñes
  "nombre": "Pinares",                // texto visible: con su ortografía
  "cabecera": "Covaleda",
  "region": "01-iberico-alto-duero",
  "centro": [-2900, 41920],           // milésimas de grado: [longitud, latitud]
  "terreno": "sierra",                // llano | ondulado | sierra | costa | vega
  "potenciales": { "labor": 1, "monte": 5, "pasto": 4, "piedra": 2, "hierro": 0, "sal": 0, "pesca": 0 },
  "solares": 6,
  "poblacionInicial": 35,
  "localidades": [
    { "nombre": "Covaleda", "coord": [-2879, 41934], "cabecera": true },
    { "nombre": "Duruelo de la Sierra", "coord": [-2931, 41955], "cabecera": null }
  ],
  "rasgos": ["pinar-maderable", "pasto-de-verano"],
  "esOrigen": false,
  "nota": "Pinar de Urbión: la madera fue su economía real durante siglos."
}
```

Las ferias (`catalogo/ferias.jsonc`) y la capa de caminos, puertos, vados y cañadas
(`catalogo/caminos.jsonc`) viven en sus propios archivos, no en la ficha de la comarca: el atlas
las une al generar el mundo.

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

El catálogo es **cerrado**: los diecisiete rasgos están en `paquetes/mundo/src/rasgos.ts` con su
efecto, y añadir uno obliga a tocar ese archivo, esta tabla y la tarea que lo use.

| Rasgo | Efecto | Comarcas |
|---|---|---|
| `salinas-historicas` | Permite salina de nivel alto; +1 al potencial efectivo de sal | 12 |
| `vena-de-hierro` | Permite ferrería de nivel alto; el hierro se agota la mitad de rápido | 9 |
| `ferreria-de-agua` | Las ferrerías cuestan un 25 % menos | 12 |
| `cantera-noble` | Obras mayores un 15 % más baratas y con más prestigio | 17 |
| `pinar-maderable` | Aserraderos con un nivel máximo más | 25 |
| `pasto-de-verano` | Válido para rebaños de mayo a septiembre | 75 |
| `pasto-de-invierno` | Válido para rebaños de octubre a abril | 28 |
| `dehesa` | Pasto de invierno; el monte se agota a la mitad y roturar cuesta el doble | 32 |
| `marisma` | Sal y pesca; la labor rinde menos | 27 |
| `vega-fluvial` | Permite acequia; la estación afecta la mitad al pan | 80 |
| `ciudad-episcopal` | Requisito de catedral; +10 de lealtad de partida | 59 |
| `villa-de-feria` | Tiene derecho de feria (§5.6) | 10 |
| `puerto-de-mar` | Requisito de atarazana y del comercio marítimo | 66 |
| `camino-de-santiago` | Ingresos por peregrinos y rumores más frecuentes | 23 |
| `calzada-romana` | Sus tramos empiezan con calidad de camino carretero | 43 |
| `vinyedo` | Permite bodega; pequeño ingreso en maravedís | 83 |
| `montado` | Dehesa alentejana: pasto de invierno y monte protegido | 14 |

Las cifras son las del mapa generado el 18-09-2026 y las escribe `informe-atlas.md` en cada
generación; `puerto-de-mar` no exige terreno de costa, porque una huerta de vega puede tener puerto
(Valencia, Gandía, Sanlúcar).

## 5.6 Ferias

Las ferias son citas fijas del calendario. Llegar a tiempo es media estrategia. Y se saben: **todo
jugador empieza conociendo de oídas las comarcas con feria**, porque el calendario es público
(T-059). De oídas no se sabe su geografía; para llegar hay que ir abriendo camino.

| Feria | Comarca | Turnos | Volumen |
|---|---|---|---|
| Sevilla | Aljarafe y Sevilla | 6 | grande |
| València | L'Horta de València | 8 | mediana |
| Medina del Campo (mayo) | Tierra de Medina | 10–11 | grande |
| Villalón | Tierra de Villalón | 12 | mediana |
| Burgos | Alfoz de Burgos | 14 | mediana |
| Santiago | Terra de Santiago | 15 | mediana |
| Verín y Chaves | Val de Monterrei | 16 | pequeña |
| Lleida | Segrià | 18 | mediana |
| Medina del Campo (octubre) | Tierra de Medina | 19–20 | grande |
| Zafra (San Miguel) | Zafra y Río Bodión | 19 | mediana |
| Sevilla (San Miguel) | Aljarafe y Sevilla | 21 | mediana |

Solo hay **tres ferias grandes** y entre dos de ellas median al menos cuatro turnos, para que una
recua pueda encadenarlas. El volumen multiplica la liquidez del mercado: pequeña ×1, mediana ×3,
grande ×8. Una comarca puede tener más de una feria (Medina tenía dos).

Las ferias no solo compran y venden: ahí llegan los rumores, se ven los precios de otras plazas y se
cierran contratos entre jugadores.

## 5.7 Origen de la partida

- El catálogo marca qué comarcas pueden ser **origen** (cabecera con nombre reconocible, potenciales
  equilibrados para al menos una casa, y conexión a tres o más vecinas).
- El sorteo ofrece tres orígenes de **perfiles distintos**, filtrados por la casa elegida (§4.2), y
  queda guardado en la partida: recargar no vuelve a sortear.
- El origen determina la capital, y la capital da nombre al dominio en la crónica.

### 5.7.1 El recorte del mapa

Una partida no se juega en la península entera: se recorta un trozo del tamaño de los que juegan
(ficha T-049). El recorte se hace **antes de jugar**, con la semilla de la partida, y nunca mirando
por dónde anduvo nadie.

- Es **conexo** y conserva identificadores, geografía, tramos, puertos, cañadas y ferias: una
  comarca recortada es la misma comarca, no una copia distinta.
- Tiene que traer dentro **sal, hierro, tierra de pan y al menos una feria**, y los dos pastos
  —el de verano y el de invierno— cuando juegue una casa que busca su origen en el pasto.
- Crece desde un centro sorteado entre los orígenes de la casa que menos sitio tiene: recortar
  lejos de los seis orígenes de los canteros sería dejarlos fuera de su propio juego.
- Las distancias se miden en **jornadas base**, sin estación ni obras: el recorte no puede depender
  del mes en que se cree la partida.
- Si un recorte no cumple, se reintenta con otro centro y un objetivo mayor, un número fijo de
  veces; después se rechaza con un error que dice qué faltó. Nunca se recorta incumpliendo.

El tamaño está medido, no supuesto: **26 comarcas por jugador** dejan unas 210 para ocho casas, que
es lo que hace falta para que las ocho tengan tres ofertas separadas seis jornadas.

### 5.7.2 Las tres tarjetas y la separación

Las tres ofertas de un jugador están a **seis jornadas o más de las de cualquier otro**, así que
puede quedarse con cualquiera de las tres sin dejar a nadie sin sitio: entre dos casas siempre hay
seis jornadas de tierra de nadie. Elige primero quien menos donde elegir tiene, y los empates los
deshace la semilla, nunca el orden en que llegaron las peticiones.

Si en el recorte no caben tres ofertas para alguien, se le dan las que haya **y se dice**; si no
cabe ninguna, la partida no se prepara y el error lo explica. Cada tarjeta enseña el perfil de la
comarca, su ventaja y su limitación en términos de la casa: nada que el jugador no pueda ver en el
mapa antes de empezar.

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
