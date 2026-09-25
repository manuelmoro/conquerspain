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

### 8.2.2 Crear partida y elegir casa
Elección de casa con su privilegio, su herramienta y su límite escritos sin marketing: lo que hace y
lo que te va a doler. Después, ritmo de turno y modo.

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

### 8.2.5 Ficha de comarca
Estado, potenciales, edificios con su nivel y su límite, población y capacidad, lealtad con su
tendencia, y las acciones posibles con su coste y su previsión. Cada acción bloqueada dice por qué
y ofrece el camino para desbloquearla.

### 8.2.6 Recuas y rebaños
Lista y ficha: dónde están, qué llevan, qué jornadas les quedan, qué comen. Editor de ruta sobre el
mapa, con el coste en jornadas por tramo y el aviso si un puerto se cierra antes de que lleguen.

### 8.2.7 Mercado y ferias
Precios conocidos por plaza, con su fecha. Órdenes con precio límite. Calendario de ferias.
Histórico de precios como gráfico pequeño (el precio de la lana es una historia).

### 8.2.8 Crónica, hitos y clasificación
El parte del turno, el archivo de turnos anteriores, los hitos conseguidos y la clasificación
pública con desglose por capítulos.

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

## 8.5 Accesibilidad

- Contraste AA en todos los textos y estados.
- Navegación completa por teclado; foco visible; orden de tabulación lógico.
- Respeto a `prefers-reduced-motion` (sin animaciones de camino ni de niebla).
- Textos alternativos para los iconos, y el mapa con una vista de lista equivalente para todo lo que
  se pueda hacer en él.

## 8.6 La voz

La crónica y los textos hablan como un cronista: frases cortas, concretas y con nombres propios.
Nada de jerga de sistema.

> «Segunda quincena de mayo. Se esquilaron mil doscientas cabezas en los pastos de Urbión: ciento
> cuarenta sacas cargadas hacia Medina. El puerto de Piqueras quedó abierto el día de la Cruz.»

No se usan emojis en la crónica. Los iconos son dibujo, no tipografía.

## 8.7 Dirección de arte

- Paleta y tipografía de la maqueta (papel cálido, tinta sepia, cobalto de Talavera, agua verdosa).
- Ilustración propia por tipo de terreno y por edificio, dibujada como grabado de atlas.
- Progreso visible: la capital cambia de aldea a villa y a ciudad; aparecen molinos, canteras,
  ferrerías, puentes; las cañadas se dibujan con su trazo propio.
- Un único aspecto, deliberadamente claro. Si algún día hay modo nocturno, será un atlas de noche
  dibujado aparte, no una inversión automática de colores.
