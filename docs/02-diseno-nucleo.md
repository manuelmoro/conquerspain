# 02 · Diseño del núcleo: tiempo, órdenes y resolución

Este documento define el esqueleto del juego: cómo pasa el tiempo, qué puede ordenar un jugador y
cómo se resuelve un turno. Todo lo demás (economía, casas, mapa) cuelga de aquí.

---

## 2.1 El tiempo

### 2.1.1 Turno y calendario

- Un **turno** de juego es una **quincena**. Veinticuatro turnos son un año.
- El intervalo real entre resoluciones lo fija la partida al crearse (1 hora por defecto; también
  6 h o 24 h). El calendario del juego no depende del intervalo real.
- Cada turno tiene nombre: `primera quincena de marzo`, `segunda quincena de marzo`… Se muestra
  siempre junto al número de turno, porque las decisiones dependen del calendario.

| Estación | Turnos | Rasgos |
|---|---|---|
| Primavera | 5–10 (marzo–mayo) | Subida de ganado a los pastos de verano; siembra; caminos embarrados en marzo |
| Verano | 11–16 (junio–agosto) | Siega y era: la mayor cosecha del año; esquileo; máxima velocidad de viaje |
| Otoño | 17–22 (septiembre–noviembre) | Bajada del ganado; vendimia y matanza; ferias de octubre |
| Invierno | 23–4 (diciembre–febrero) | Puertos de montaña cerrados; consumo alto; obras lentas |

El año empieza en la primera quincena de enero (turno 1). Una partida puede empezar en cualquier
turno del calendario; la partida de referencia empieza en **la primera quincena de marzo**, con la
primavera por delante.

### 2.1.2 Qué cambia con la estación

Las estaciones son un calendario **conocido de antemano**: nadie se lleva sorpresas, pero quien no
planifique lo pagará.

- **Cosecha estacional.** La producción de pan de una comarca no es plana: se concentra en verano y
  principios de otoño. Ver [03-economia.md](03-economia.md) §3.4.
- **Pastos.** Los pastos de verano (sierra) solo rinden de mayo a septiembre; los de invierno
  (dehesa y vegas del sur) de octubre a abril. De ahí la trashumancia.
- **Caminos.** Cada tramo tiene un coste en jornadas que sube con el barro (marzo, noviembre) y
  puede ser **intransitable** si es un puerto de montaña en invierno.
- **Ferias.** Las ferias ocurren en fechas fijas del calendario (ver [05-geografia.md](05-geografia.md)
  §5.6). Llegar tarde a una feria es perder el año.
- **Obras.** Las obras de cantería avanzan a la mitad en invierno (las heladas estropean la cal).

## 2.2 Unidades móviles: las recuas

El equivalente a las naves de VGA Planets son las **recuas**: expediciones de acémilas y carros que
recorren el mapa de comarcas. Son la única forma de mover cosas, gente e influencia, y son lo que
convierte el mapa en un tablero.

Una recua tiene:

- **Casa y nombre** (`La Trashumante de Vinuesa`), generado del catálogo de nombres.
- **Posición**: comarca actual, o tramo de camino con la fracción de jornada recorrida.
- **Porte**: capacidad de carga en cargas (1 carga ≈ 100 arrobas). Se amplía con carros donde hay
  camino carretero.
- **Paso**: jornadas por turno, según acémilas, carga y estación.
- **Bastimento**: pan y sal que consume por jornada. Sin bastimento, la recua se detiene y pierde
  acémilas (nunca gente: los vecinos vuelven a casa).
- **Cometido**: explorar, portear, poblar, tratar (comerciar), establecer presencia.
- **Carga**: recursos y vecinos que transporta.

Las recuas no se «teletransportan»: salen, tardan y vuelven. Una orden de exploración lejana puede
costar seis turnos de ida y vuelta, y ese compromiso es la decisión.

Detalle completo de movimiento, porte y cometidos en [03-economia.md](03-economia.md) §3.7.

## 2.3 Las órdenes

### 2.3.1 Qué es una orden

Una orden es una intención registrada por un jugador para un turno concreto. Se valida al darla
(coste, requisitos, adyacencia) y **reserva** sus recursos; se ejecuta en la resolución.

```ts
interface Orden {
  id: IdOrden;
  partida: IdPartida;
  jugador: IdJugador;
  turnoAlta: number;          // turno en que se dio
  tipo: TipoOrden;
  objetivo: ObjetivoOrden;    // comarca, recua, obra, mercado…
  parametros: Record<string, number | string>;
  coste: Recursos;            // reservado hasta que empieza
  estado: 'pendiente' | 'en curso' | 'terminada' | 'cancelada' | 'en espera';
}
```

### 2.3.2 Catálogo de órdenes (v1)

| Familia | Orden | Resumen |
|---|---|---|
| Comarca | `construir` | Levantar o mejorar una explotación o edificio |
| Comarca | `derribar` | Liberar un solar ocupado (devuelve parte del material) |
| Comarca | `politica` | Fijar la política de la comarca: fuero, carga fiscal, reparto de trabajo |
| Comarca | `roturar` | Convertir monte en tierra de labor (irreversible a corto plazo) |
| Recua | `formar` | Crear una recua en una comarca propia, con acémilas y gente |
| Recua | `ruta` | Fijar destino y camino; admite ruta circular permanente |
| Recua | `cargar` / `descargar` | Mover recursos y vecinos entre almacén y recua |
| Recua | `cometido` | Explorar, poblar, tratar, establecer presencia, disolver |
| Territorio | `incorporar` | Sumar al dominio una comarca donde ya tienes influencia mayoritaria |
| Comarca | `aperos` | Instalar un nivel de aperos en una comarca propia (hasta el máximo de la casa) |
| Mercado | `letra-de-cambio` | Pasar maravedís del almacén a una recua que está en una plaza (mercaderes: 3 % y un turno) |
| Territorio | `regalo` | 50 mrs al concejo de una comarca neutral: +5 de influencia, una vez cada 4 turnos |
| Mercado | `vender` / `comprar` | Órdenes con precio límite, ejecutables en feria o mercado local por una recua quieta que trata |
| Obra | `obra mayor` | Iniciar o financiar una obra monumental de varias decenas de turnos |
| Casa | `tradicion` | Elegir una tradición en una ronda abierta: gratis, irreversible y vigente desde el turno siguiente (docs/04 §4.3) |
| Gestión | `mayordomo` | Alta o baja de una regla permanente (ver §2.5) |

Cada familia se detalla en el documento de la mecánica correspondiente. El catálogo crece con las
fases; lo que no cambia es la forma de la orden ni su ciclo de vida.

### 2.3.3 Ciclo de vida

```
dar orden ──► pendiente ──(resolución: empieza)──► en curso ──► terminada
                 │                                     │
                 └── cancelar (devuelve reserva)        └── en espera (si deja de cumplir requisitos)
```

- Una orden **pendiente** se puede cancelar sin coste: devuelve la reserva íntegra.
- Una orden **en curso** ya ha consumido su coste. Cancelarla devuelve, como mucho, el material no
  gastado (la mitad, redondeando a la baja).
- Una orden pasa a **en espera** si al ir a empezar no cumple sus condiciones (por ejemplo, escasez
  de pan bloquea nuevas expediciones). Vuelve a validarse cada turno y arranca en cuanto pueda.
- Las órdenes se muestran siempre con **coste, duración y turno previsto de finalización**.

### 2.3.4 Límites de acción

No hay «puntos de acción» artificiales. Los límites son materiales y se entienden solos:

- Las obras compiten por **cuadrillas**: cada comarca tiene un número de cuadrillas según su
  población y sus mejoras; una obra ocupa una cuadrilla.
- Las expediciones compiten por **recuas**: hay tantas recuas como hayas formado y puedas mantener.
- Todo cuesta recursos, y el almacén es común al jugador dentro de la partida.

## 2.4 La resolución del turno

### 2.4.1 Fases

La resolución es una secuencia fija de fases. Dentro de cada fase, el resultado no puede depender
del orden en que se recibieron las órdenes ni del orden de los jugadores.

| # | Fase | Qué hace |
|---|---|---|
| 1 | **Calendario** | Avanza el turno, fija estación y meteorología anunciada, abre y cierra puertos de montaña |
| 2 | **Producción** | Cada comarca produce según potencial, edificios, población ocupada, estación y agotamiento |
| 3 | **Consumo** | Pan de la población, sal de las conservas, salarios de cuadrillas y recuas; se determina la escasez |
| 4 | **Movimiento** | Las recuas avanzan sus jornadas; se resuelven llegadas y tramos cerrados |
| 5 | **Cometidos** | Exploración, porte, repoblación, presencia e influencia en destino |
| 6 | **Obras** | Avance y finalización de construcciones y obras mayores |
| 7 | **Mercado** | Casación de ferias y mercados locales; formación de precios |
| 8 | **Territorio** | Incorporaciones, cambios de lealtad, fueros que entran en vigor |
| 9 | **Población** | Crecimiento, mermas por hambre prolongada, migraciones internas |
| 10 | **Acontecimientos** | Se aplican los anunciados y se anuncian los de los turnos siguientes |
| 11 | **Prestigio y hitos** | Tradiciones (se elige y luego se abren rondas), recuento de prestigio, hitos alcanzados, clasificación |
| 12 | **Crónica** | Se compone el parte del turno de cada jugador con lo que ese jugador puede saber |

### 2.4.2 Reglas de simultaneidad

- **Producción antes que consumo**: lo producido este turno sirve para comer este turno.
- **Movimiento antes que cometidos**: llegar y actuar el mismo turno es posible, pero la acción
  sucede después de que todo el mundo haya movido.
- **Los cometidos de todos los jugadores se calculan sobre el mismo estado inicial de la fase.**
  Si dos recuas compran el último grano de un mercado, ninguna «llega antes»: se reparte según la
  regla de casación (§2.4.4).
- **Las incorporaciones se resuelven después del mercado y de la influencia** de ese mismo turno,
  con la influencia ya actualizada.

### 2.4.3 Aritmética y redondeo

Para que el determinismo sea real y no una intención:

- Todo se calcula con **enteros**. Las cantidades fraccionarias se representan en **milésimas**
  (`1 pan = 1000 milésimas`) y se documenta la unidad en cada campo.
- El redondeo por defecto es **hacia abajo**; las excepciones se escriben en la ficha de la regla.
- Prohibido `Math.random()`, `Date.now()` y los números en coma flotante en el núcleo.

### 2.4.4 Empates y repartos

Cuando varios jugadores compiten por lo mismo en la misma fase:

1. **Reparto proporcional primero.** Mercado, pastos y cupos se reparten en proporción a lo pedido,
   redondeando a la baja.
2. **Sobrante por orden de mérito.** Lo que queda tras el reparto va a quien tenga mayor mérito en
   ese contexto (mayor influencia en la comarca; mejor precio ofrecido en el mercado).
3. **Desempate determinista final.** Si persiste el empate, gana el menor valor de
   `hash(partida, turno, contexto, jugador)`. Es estable, reproducible y no depende de cuándo se
   enviaron las órdenes.

### 2.4.5 Azar determinista

El azar existe (rendimiento de una cosecha, hallazgos de una exploración), pero:

- Procede de un generador con semilla: `semilla = hash(semillaPartida, turno, ambito, id)`.
- Su horquilla es **estrecha** (típicamente ±10 %) y siempre está acotada y visible en la interfaz.
- Ningún acontecimiento grave (sequía, peste, incendio) es sorpresa: se **anuncia con dos turnos**
  de antelación en la crónica y el mapa, y el **calendario del año entero** se publica el primer
  turno del año (ver [03-economia.md](03-economia.md) §3.13).

## 2.5 Jugar sin estar: mayordomo y planes

Esta es la pieza que garantiza el principio de «conectarse más no es ventaja».

### 2.5.1 Colas

Toda orden repetible admite cola: obras encadenadas en una comarca, rutas encadenadas de una recua.
La cola se ejecuta sola mientras haya recursos.

### 2.5.2 Rutas permanentes

Una recua puede fijar una **ruta circular**: `Covaleda → Soria (descargar madera, cargar pan) →
Covaleda`, repetida indefinidamente, con precios límite para las compras y ventas. Se detiene sola
si falta bastimento o si el precio límite no se cumple, y lo dice en la crónica.

### 2.5.3 Mayordomo

El mayordomo es un conjunto pequeño de reglas condicionales, con un número limitado de reglas
activas (arranca en tres y sube con las mejoras de la capital):

```
si el pan disponible < 40  entonces  comprar pan hasta 80 al precio máximo de 12 maravedís
si la lana almacenada > 30 entonces  enviar recua a la feria más próxima
si una obra termina        entonces  empezar la siguiente de la cola
```

Las reglas son deterministas, se evalúan en una fase fija y **nunca pueden hacer algo que el
jugador no pudiera ordenar**. No es una IA: es un capataz con instrucciones.

### 2.5.4 Plan de temporada

El jugador puede programar hasta seis turnos por adelantado (una temporada). El plan se muestra en
un calendario y se puede reajustar en cualquier momento antes de su resolución.

## 2.6 Lo que se sabe: conocimiento y niebla

- El conocimiento es **por jugador**: cada uno tiene su propio mapa de lo que ha visto.
- Una comarca puede estar: `desconocida`, `oída` (sabes que existe y su nombre, por rumores),
  `explorada` (conoces terreno, localidades y potenciales) o `propia`.
- La información **caduca**: lo que sabes de una comarca ajena lleva fecha («según se supo en la
  segunda quincena de mayo»). Los precios, la población y las obras de terceros que ves son los del
  momento en que los supiste, no los de ahora.
- Las recuas ajenas solo se ven si pasan por comarcas donde tienes presencia, y se ven de forma
  imprecisa («una recua con los colores de los ferrones, camino del norte»).
- Los **rumores** llegan por las ferias: cuanto más comercias, más te enteras. Es la manera barata
  de tener información, y una razón más para ir a la feria.

## 2.7 El parte del turno (la crónica)

Es el equivalente al RST de VGA Planets, y es donde se juega medio juego. Cada turno, cada jugador
recibe una crónica compuesta por:

1. **Resumen económico**: qué entró, qué salió, qué falta y cuánto duran las reservas.
2. **Sucesos propios**: obras terminadas, recuas llegadas, descubrimientos, nacimientos de pueblas.
3. **Avisos**: acontecimientos anunciados, puertos que se cierran, órdenes que quedaron en espera y
   por qué, contratos de mercado sin casar.
4. **Rumores**: lo que traen los arrieros de otras tierras, fechado y con su fuente.
5. **Hitos y prestigio**: qué has conseguido y cómo va la clasificación pública.

La crónica se escribe con voz de cronista, breve y concreta, y siempre explica la causa:
«La obra del molino se detuvo: no llegó la piedra de Berlanga porque el puerto de Piqueras cerró el
día de San Andrés.»

## 2.8 Estado de la partida (visión de alto nivel)

```ts
interface EstadoPartida {
  version: number;              // versión de reglas con la que se creó
  id: IdPartida;
  semilla: string;              // fija el mundo y el azar de toda la partida
  turno: number;                // 1.. ; el calendario se deriva de aquí
  configuracion: ConfiguracionPartida;   // intervalo, modo (abierta o temporada), ritmo de prueba
  jugadores: Record<IdJugador, EstadoJugador>;
  comarcas: Record<IdComarca, EstadoComarca>;
  recuas: Record<IdRecua, Recua>;
  rebanyos: Record<IdRebanyo, Rebanyo>;
  obras: Record<IdObra, Obra>;
  mercados: Record<IdMercado, EstadoMercado>;
  acontecimientos: Acontecimiento[];     // anunciados y activos
  ordenes: Orden[];             // las que siguen vivas: pendientes, en curso o en espera
  siguienteId: number;          // contador para crear identificadores sin azar
  huellaTurnoAnterior: string | null;
}
```

Las órdenes **viven en el estado**: una obra de tres turnos o una expedición de seis tienen que
sobrevivir a la resolución. `resolverTurno` recibe aparte las órdenes **nuevas** de ese turno, las
valida y las incorpora; las que ya estaban siguen su curso.

El estado es **serializable, comparable y versionado**: dos ejecuciones del mismo turno deben
producir estados idénticos al compararlos campo a campo. De ahí salen los tests de regresión de
partidas completas.
