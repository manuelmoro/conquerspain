# 08 · Interfaz y dirección de arte

La maqueta `maqueta/` fijó el aspecto: atlas ilustrado en papel cálido, azul cobalto para lo propio,
tipografía de atlas antiguo. Este documento fija cómo se juega con esa piel.

---

## 8.1 El bucle de un turno

Una sesión típica dura cinco minutos y tiene tres pasos:

1. **Leer el parte.** Al abrir la partida, lo primero es la crónica del turno: qué pasó, qué se
   descubrió, qué quedó bloqueado y por qué. Con un botón para ir directamente a lo que hay que
   decidir.
2. **Decidir.** Cada aviso de la crónica lleva su acción al lado («el molino se paró por falta de
   piedra» → «comprar piedra en Soria» / «enviar recua a Berlanga»).
3. **Ordenar.** Las órdenes se acumulan en una bandeja visible, con su coste reservado y su fecha
   prevista. Hasta el corte se pueden cambiar.

Quien quiera más, tiene el plan de temporada y el mayordomo. Quien tenga prisa, con leer y confirmar
lo sugerido no pierde la partida.

## 8.2 Pantallas

### 8.2.1 Mis partidas
Tarjetas con capital, casa, turno y quincena del calendario, cuenta atrás a la próxima resolución,
estado de abastecimiento, prestigio y puesto. Distingue de un vistazo las partidas con ritmos
distintos y avisa de las que tienen órdenes sin dar.

**Hecho en T-086.** Cada partida va en una tarjeta con su casa, el turno, la quincena y el corte, el pan que le
queda (o «hambre», en rojo y con texto), su prestigio y su puesto, y «Sin órdenes este turno» si no has dado
ninguna. Las que esperan algo de ti van primero. Debajo van las convocatorias en marcha, con lo que toca en cada
una: compartir el código y sortear, esperar o elegir origen.

### 8.2.2 Crear partida y elegir casa
Elección de casa con su privilegio, su herramienta y su límite escritos sin marketing: lo que hace y
lo que te va a doler. Después, ritmo de turno y modo.

**Hecho en T-086.** Al convocar o al unirse, las ocho casas van en tarjetas con privilegio, herramienta y
límite, los tres con el mismo peso. Los textos que lee el jugador no nombran tareas del plan, y una prueba lo
vigila.

### 8.2.3 Elegir origen
Tres localidades reales sorteadas y filtradas por la casa. Cada tarjeta: ilustración del entorno,
situación en la península, potenciales de la comarca, producción inicial, ventaja y limitación en
términos de esa casa.

### 8.2.4 Atlas
El mapa es la pantalla principal. Capas:

| Capa | Contenido |
|---|---|
| Terreno | Ilustración por tipo de terreno, ríos, relieve |
| Comarcas | Límites de juego, tintado por dueño; neutral con trama |
| Niebla | Lo desconocido, con frontera explorable marcada |
| Caminos | Veredas, caminos, calzadas y cañadas, con su estado estacional |
| Movimiento | Recuas y rebaños propios en ruta, con su destino y turnos restantes |
| Rótulos | Comarcas, localidades, capital con su rango (aldea, villa, ciudad) |
| Avisos | Acontecimientos anunciados, puertos cerrados, ferias activas |

Un conmutador permite ver el mapa en **modo económico** (qué produce cada comarca), **modo
logístico** (jornadas y estado de caminos) y **modo político** (dueños e influencias conocidas).

**Hecho en T-081.** El cliente solo recibe el **atlas del jugador** (`atlasDeJugador`, construido desde su
vista): de lo desconocido, la silueta sin nombre ni id; de lo oído, el nombre; de lo visto, terreno,
potenciales y dueño conocido; y los tramos cuyas dos puntas conoce. En los tres modos hay niebla, recuas
propias con su ruta y las **jornadas** que les quedan, ferias y acontecimientos; el conmutador va abajo,
al alcance del pulgar. Moverse y hacer zoom solo cambian el `viewBox`; los rótulos se colocan por prioridad
(capital, propias, exploradas, oídas) sin solaparse al terminar el gesto. De momento, tintas planas y trazos
de la maqueta: la ilustración del terreno se afina con la dirección de arte.

**Retocado en T-088 (tras J-01).** Tocar y arrastrar se separan por un umbral de 4 px; el toque abre la
primera comarca de la pila bajo el puntero (caminos, rutas y rótulos no lo tapan). Cursor de mano, resalte al
pasar y la comarca abierta marcada. Cada modo lleva una línea que dice qué enseña y su leyenda de colores.

### 8.2.5 Ficha de comarca
Estado, potenciales, edificios con su nivel y su límite, población y capacidad, lealtad con su
tendencia, y las acciones posibles con su coste y su previsión. Cada acción bloqueada dice por qué
y ofrece el camino para desbloquearla.

**Hecho en T-082 y T-088.** En escritorio la ficha va en un panel lateral fijo junto al mapa; en móvil, como
hoja inferior. Las acciones son tarjetas con su coste en fichas y sus turnos; al elegir una, la confirmación
(efecto previsto, coste, turnos y cuándo) se abre dentro de la misma tarjeta.

**Gobierno (T-089).** La ficha de una comarca propia trae también:
- el fuero, la carga fiscal y la dehesa;
- las obras mayores (el puente y la calzada, por tramo hacia cada vecina);
- el traslado de la corte.

Cada una lleva su efecto en palabras y el mismo bloqueo que pondría la fase. «Tu casa», en la cabecera, abre en
el panel tres cosas:
- las tradiciones de cada ronda abierta, que se eligen para siempre;
- el mayordomo, con sus reglas en una frase («Si te quedan menos de 40 de pan para gastar, …»), las que
  quedan fuera del límite y un formulario cerrado de condición y acción;
- la sal de las conservas.

### 8.2.6 Recuas y rebaños
Lista y ficha: dónde están, qué llevan, qué jornadas les quedan, qué comen. Editor de ruta sobre el
mapa, con el coste en jornadas por tramo y el aviso si un puerto se cierra antes de que lleguen.

**Hecho en T-083.** En el panel, «Tus recuas y rebaños», cada una con «Darle ruta». Con el editor abierto, tocar
el mapa añade paradas (tocar la última la quita) y la ruta propuesta se dibuja en dorado. Cada cambio trae del
servidor la previsión, que sale de la vista del jugador con la misma cuenta que el motor: tramos con sus
jornadas, turno de llegada a cada parada, bastimento y avisos (puerto que se cierra, calor sin sal). También
trae la casilla «circular», la carga y descarga por parada, y la de cargar el bastimento antes de salir. Desde la
ficha de una comarca neutral, «Enviar una recua a estar presente» o «a explorar» lo hace todo de una vez
(cargar, ir, encargo y vuelta). Un aviso de la crónica sobre una recua o un rebaño lleva «Darle ruta».
Comprar y vender con precio límite en las paradas llega con el mercado (T-084).

### 8.2.7 Mercado y ferias
Precios conocidos por plaza, con su fecha. Órdenes con precio límite. Calendario de ferias.
Histórico de precios como gráfico pequeño (el precio de la lana es una historia).

**Hecho en T-084.** «Mercado», en la cabecera, abre en el panel las plazas que conoces: abiertas primero, con
cuándo abren las demás y **la fecha y la fuente de cada precio** («de hace 5 turnos, de oídas»). Un precio de
más de seis turnos sale apagado y avisa de que puede haber cambiado. Cada precio va con ↓ barato o ↑ caro frente
al base de esa comarca. La ficha de una plaza trae cada precio con su base y su serie pequeña (los precios que
supiste en el último año), y el formulario de orden, con una frase que explica el precio límite. La orden pone a
tratar a la recua si hace falta. En las paradas de una ruta se vende y se compra con precio límite.

### 8.2.8 Crónica, hitos y clasificación
El parte del turno, el archivo de turnos anteriores, los hitos conseguidos y la clasificación
pública con desglose por capítulos.

**Hecho en T-085.** «Crónica», en la cabecera, abre en el panel el último turno resuelto, con ← → y un selector
de año. Las entradas van por secciones, avisos primero y con su acción, con el mismo pintado que el resumen.
La pestaña «Clasificación» trae cada casa con su puesto y si sube o baja, y en «Por qué» el desglose por
capítulos en barras (es público) y sus primicias. Debajo van tus hitos con su fecha y los que te quedan, con lo
que da cada uno.

**Resumen del turno (T-088).** Al ver un turno nuevo sale un diálogo: por recurso, lo que tenías, lo producido
por tus comarcas, lo demás (comida, obras, insumos, comercio), lo que tienes y el cambio en verde o rojo; los
vecinos; y la crónica del turno por secciones, avisos primero, con qué hacer y un botón para ver la comarca.
La bandeja conserva la fila del cambio y deja reabrir el resumen.

## 8.3 Reglas de interfaz que no se rompen

1. **Nunca un número sin su causa.** Todo valor importante se puede desplegar para ver de dónde sale
   (producción = base × potencial × estación × aperos…).
2. **Nunca un bloqueo sin salida.** Si algo no se puede hacer, se dice el motivo y se ofrece la
   acción que lo arregla.
3. **Reservado, disponible y producido son tres cosas distintas** y se muestran distintas.
4. **El calendario siempre visible.** Turno, quincena, estación y próxima resolución.
5. **Color con refuerzo.** Todo estado va con icono y texto además del color.
6. **Todo lo importante cabe en un móvil**, sin pasar el ratón por encima de nada.
7. **Ninguna acción crítica sin confirmación con previsión** (incorporar, traslado de corte, romper
   un acuerdo).

## 8.4 Móvil

- Mapa a pantalla completa con panel inferior desplegable (como en la maqueta).
- Gestos: desplazar, pellizcar, tocar comarca. Nada que requiera precisión fina.
- La bandeja de órdenes es una barra inferior con el número de órdenes pendientes y el tiempo que
  queda para el corte.
- Objetivo: poder leer la crónica y dar tres órdenes en el autobús, con una mano.

**Hecho en T-087.** Por debajo de 900 px, una barra fija abajo dice cuántas órdenes hay y lo que falta para el
corte, y lleva a la bandeja.

## 8.5 Accesibilidad

- Contraste AA en todos los textos y estados.
- Navegación completa por teclado; foco visible; orden de tabulación lógico.
- Respeto a `prefers-reduced-motion` (sin animaciones de camino ni de niebla).
- Textos alternativos para los iconos, y el mapa con una vista de lista equivalente para todo lo que
  se pueda hacer en él.

**Hecho en T-087.**
- Una prueba lee la hoja de estilos y exige AA (4,5:1) a cada par de texto y fondo.
- Nada se apaga con `opacity`: lo viejo va con borde discontinuo y lo desactivado con sus propios colores.
- El foco se ve (contorno cobalto de 3 px).
- Con «menos movimiento» no hay animaciones.
- Los botones de icono llevan su nombre.
- Bajo el mapa, «Las comarcas en lista» hace sin mapa lo mismo que tocarlo: ver la ficha o, con el editor
  abierto, añadir una parada.

## 8.6 La voz

La crónica y los textos hablan como un cronista: frases cortas, concretas y con nombres propios.
Nada de jerga de sistema.

> «Segunda quincena de mayo. Se esquilaron mil doscientas cabezas en los pastos de Urbión: ciento
> cuarenta sacas cargadas hacia Medina. El puerto de Piqueras quedó abierto el día de la Cruz.»

No se usan emojis en la crónica. Los iconos son dibujo, no tipografía.

## 8.7 Dirección de arte

**Desde T-090.**
- Tipografía: Plus Jakarta Sans para el texto y Fraunces para los títulos, las dos libres y alojadas en el
  cliente. La de Instagram es propietaria.
- Cada casa tiene su emblema: un escudo con la pieza de su oficio. Cada origen, su viñeta de entorno.
- La portada enseña la península, generada desde los datos, con las cañadas reales y recuas que las recorren,
  tres pasos de cómo se juega y las ocho casas.
- Al entrar en una partida, un tutorial de cinco pasos acompaña las primeras acciones.
- El panel se recorre con pestañas: órdenes, crónica, mercado y tu casa.


- Paleta y tipografía de la maqueta (papel cálido, tinta sepia, cobalto de Talavera, agua verdosa).
- Ilustración propia por tipo de terreno y por edificio, dibujada como grabado de atlas.
- Progreso visible: la capital cambia de aldea a villa y a ciudad; aparecen molinos, canteras,
  ferrerías, puentes; las cañadas se dibujan con su trazo propio.
- Un único aspecto, deliberadamente claro. Si algún día hay modo nocturno, será un atlas de noche
  dibujado aparte, no una inversión automática de colores.
