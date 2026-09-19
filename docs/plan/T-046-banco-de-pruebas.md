# T-046 · Banco de pruebas: robots por casa e informes

**Fase:** 2 · Motor · **Depende de:** T-045 · **Estado:** **hecha** (19-09-2026)

## 1. Contexto

No se puede equilibrar ocho casas jugando a mano. Hace falta poder lanzar partidas completas,
medirlas y comparar versiones. Este es el instrumento con el que se afinará el juego durante años.

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.7,
[docs/06-competicion.md](../06-competicion.md) §6.8.

### Alcance de las pruebas tras la revisión del 19-09-2026

El cierre histórico demuestra determinismo, instrumentación inicial y capacidad de rutinas en
escenarios preparados. **No demuestra todavía** que las ocho vías sean viables en una partida
normal, que una orden propuesta sea una decisión útil ni que los planes de ambas cadencias sean
equivalentes. La afirmación de §6.3 y §8 de que los fallos «no son del robot» fue prematura:
T-050 debe discriminar causas. Las métricas se completan en T-048, el arranque en T-049 y la
comparación de ausencia en T-051. Véase [la revisión con evidencia](bitacora-equilibrio.md).

## 2. Objetivo

`herramientas/banco`: lanzar partidas automáticas deterministas con un robot por casa, recoger
métricas y emitir informes comparables entre versiones.

## 3. Alcance

**Heredado de T-045.** Ya existía un primer escenario en `herramientas/banco/src/escenarios/ausencia.ts`
(con su test): juega una estrategia a mano y la misma con colas y mayordomo, y compara el prestigio.
Los robots de esta tarea usan colas, plan y mayordomo como lo haría un jugador que entra poco, y el
informe repite esa comparación por casa. Para dar el coste de una orden, el núcleo exporta
`costeDeEdificio` y compañía y `modificadoresDe`.

**Entra:** robots (uno por casa), ejecutor de partidas, métricas, informes en Markdown y CSV,
comparación entre ejecuciones.

**No entra:** cambiar valores de equilibrio (eso es T-047), ni IA que juegue contra humanos.

## 4. Diseño detallado

### 4.1 Robots

Un robot es una **estrategia escrita a mano**, no una IA: una función pura que, dado el estado
visible, devuelve órdenes.

```ts
export interface Robot {
  readonly casa: Casa;
  readonly nombre: string;
  /** Cada cuántos turnos entra: 1 es el jugador diligente; 6, el que deja colas y mayordomo. */
  readonly cadencia: number;
  decidir(vista: VistaJugador, mundo: Mundo, reglas: TablasDeReglas): Orden[];
}
```

Cada robot juega su vía: el de la Mesta forma rebaños y hace el ciclo anual; el ferrón busca hierro y
monte; el cantero acumula piedra y encadena obras mayores; el mercader compra donde sobra y vende
donde falta, etc. Se escriben con prioridades simples y legibles, y **sin trampas**: solo usan la
vista filtrada.

Las tres piezas comunes:

- **`robots/tablero.ts`** · lo que el robot sabe. Recibe el mundo entero (el atlas lo tiene cualquier
  cliente) pero solo deja mirarlo por donde el jugador conoce: la geografía, solo de lo explorado y
  lo propio; las vecinas y los tramos, solo entre comarcas conocidas; las plazas, las de las comarcas
  que conoce, con los precios que sabe y su fecha. Calcula además lo que cualquier jugador calcularía:
  jornadas desde lo propio (Dijkstra), consumo de pan, capacidad, cuadrillas y niveles previstos.
- **`robots/pedidos.ts`** · la fábrica de órdenes, con el coste que reservará el servidor (T-062),
  calculado con las mismas funciones del núcleo (`costeDeEdificio`, `costeDeRecua`…). Los
  identificadores llevan jugador y turno, así que nunca chocan.
- **`robots/impulsos.ts`** · lo que hace cualquier casa, en orden de prioridad: elegir tradición,
  dejar puesto el mayordomo, comer, la vía propia, el plan de edificios, la obra mayor, formar
  recuas, mover las recuas según su papel (explorar, emisario, tratar, feriar, poblar, arbitraje),
  ganar tierra (regalos e incorporación) y gobernar (carta puebla y carga fiscal donde la lealtad
  cae). Todo lo de obra va a la cola de su comarca y todo lo de recua a la cola de su recua: nada
  reserva hasta empezar, y por eso la misma estrategia vale entrando cada turno o cada seis.

Cada casa aporta un **perfil** (plan de edificios de la capital y de las demás comarcas, obras
mayores que persigue, papeles de sus recuas, qué vende y qué guarda, qué lleva a la feria, qué
tradición prefiere y qué valora en una comarca) y, si hace falta, su **vía** propia: la trashumancia
de la Mesta, los aperos del ferrón, los puentes del cantero, las cartas pueblas del monje y el
arbitraje del mercader y del arriero.

**Elección de origen.** El alta real ofrece tres orígenes sorteados y el jugador elige (docs/04 §4.2);
el banco elige con el mismo criterio con que el robot valora una comarca, así que el salinero sale
junto a la sal y el mercader en una villa de feria.

### 4.2 Ejecutor

```bash
npm run banco -- --semilla 1492 --turnos 200 --casas todas --repeticiones 3
```

- Determinista: misma semilla, misma partida (y mismo informe, byte a byte).
- Guarda el estado cada 10 turnos en `informes/estados/<informe>/` para poder inspeccionarlo (no se
  versiona).
- `--escenario hambre` cambia las reglas de arranque; `--sin-ausencia` se salta la segunda pasada;
  `--fecha` fija la fecha del nombre del archivo.
- Cada orden que da un robot pasa por `validarOrdenEntrante`: si el servidor la rechazaría, la
  partida se para con el error. Un robot que da órdenes inválidas es un robot roto.

La comparación de **jugar sin estar** (T-045 §4.5) se juega en cada repetición: la misma partida con
los robots entrando cada seis turnos.

### 4.3 Métricas

Por jugador y turno (`metricas.ts`): prestigio con sus nueve capítulos y sus penalizaciones,
población, comarcas, almacén, escasez, producción (por recurso y por clase de edificio), obras y
obras mayores terminadas, jornadas andadas, volumen comerciado (y cuánto de él en las paradas de una
ruta), ingresos de feria, lana esquilada, pueblas fundadas, comarcas incorporadas y **turnos sin
decisión útil** (turnos en que el robot entró y no encontró ninguna orden sensata que dar).

Por partida: puesto final, primicias, precios pegados al suelo o al techo, comarcas que alguien tocó
y la huella del último turno.

### 4.4 Informes

`informes/<fecha>-<semilla>.md` con tablas y un resumen legible, `informes/<fecha>-<semilla>.csv`
(formato largo `casa,metrica,valor`) y `-turnos.csv` con la serie turno a turno. La fecha va solo en
el nombre del archivo: el contenido no depende de la hora ni de la máquina.

`npm run banco:comparar -- a.csv b.csv` enseña qué cifras cambian, con su diferencia y su tanto por
ciento, para ver qué ha hecho un cambio de equilibrio.

### 4.5 Salud del juego

El informe marca en rojo:

- casas fuera de la horquilla 80 %–120 % de la mediana de prestigio;
- más de un 10 % de turnos sin decisión útil;
- partidas con escasez crónica (más del 20 % de los turnos);
- precios pegados al suelo o al techo más de 20 turnos;
- comarcas que nunca las toca nadie en ninguna partida (tierra muerta).

Y, además, una tabla **«¿juega su vía?»**: la cifra que prueba la vía de cada casa (lana e ingresos
de feria en la Mesta, ferrerías en el ferrón, obras mayores en el cantero, arbitraje en el mercader,
pueblas en el monje, sal o salazón en el salinero, caminos y comercio en el arriero, huertas en el
hortelano).

## 5. Archivos

```
herramientas/banco/src/{ejecutar,metricas,informe,comparar,partida}.ts
herramientas/banco/src/robots/{tablero,pedidos,impulsos,arbitraje,robot,index}.ts
herramientas/banco/src/robots/{mesta,ferrones,canteros,mercaderes,monjes,salineros,arrieros,hortelanos}.ts
herramientas/banco/src/escenarios/{index,ausencia,hambre}.ts
herramientas/banco/src/{robots/robots,vias,ejecutar,informe}.test.ts
herramientas/banco/informes/2026-09-19-1492.{md,csv}      informe de referencia
paquetes/nucleo/src/datos/{estaciones,index}.ts           las tablas reales del juego
```

**El alta del banco es provisional.** `partida.ts` reparte las capitales por la península entera con
las reglas que tendrá el alta de verdad (sorteo por casa, elección entre los tres y seis jornadas
entre capitales), pero no recorta el mapa ni ajusta el arranque a cada origen: eso pasa a **T-049**; T-065 persistirá su resultado.

## 6. Criterios de aceptación

1. ✔ Una partida de 200 turnos con 8 robots se ejecuta en menos de 2 minutos (tarda unos 8 s; hay un
   test que lo vigila).
2. ✔ Misma semilla → mismo informe, byte a byte (test).
3. ✔ Los ocho robots juegan su vía de verdad. Se comprueba de dos maneras: el informe trae la tabla
   «¿juega su vía?» y `vias.test.ts` juega cada casa sola en un origen donde su vía es posible y
   exige la cifra que la prueba. En el informe de referencia salen seis de ocho: la Mesta y el
   mercader no, y **la causa no está aislada** (véase la revisión anterior).
4. ✔ Ningún robot usa información que su jugador no ve: `robots/robots.test.ts` les pasa el mundo y
   el estado manipulados justo donde el jugador no mira y exige las mismas órdenes; un robot tramposo
   de control demuestra que la prueba sabe ver una trampa.
5. ✔ El informe incluye las cinco alertas de §4.5 (cada una con su test) y funciona `comparar`.
6. ✔ `npm run verificar` pasa: 899 tests.

## 7. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3
npm run banco:comparar -- herramientas/banco/informes/a.csv herramientas/banco/informes/b.csv
```

## 8. Lo que ha encontrado el banco (entra en T-047)

El instrumento ya está haciendo su trabajo. Lo que sale del informe de referencia, por orden de
tamaño:

1. **El porte manda sobre el mapa.** Una recua lleva 10 cargas y come 2 de pan por jornada, así que
   no se aleja más de tres o cuatro jornadas de tierra propia. Las ferias quedan a 5–14 jornadas de
   casi todos los orígenes: la Mesta no puede llevar su lana a ninguna feria y el mercader no alcanza
   una segunda plaza. Es la causa de las dos vías que no salen.
2. **Sin comercio humano no hay arbitraje.** Los mercaderes menores devuelven cualquier precio a su
   base en tres o cuatro turnos (era un riesgo apuntado en ESTADO y el banco lo confirma), así que la
   vía del mercader depende por completo de que haya otras plazas cerca y movimiento en ellas.
3. **Hay orígenes condenados.** Con `labor 1` (Molina, Bilbao) dos granjas no dan de comer a la
   población inicial, y los seis solares de la capital no llegan para la cadena de la casa (carbonera
   + ferrería + madera + piedra) *y* el mercado con el que comprar el pan. El arranque tiene que
   depender del origen: pasa a **T-049**; T-065 lo integrará, y el banco lo comprueba.
4. **Tierra muerta:** 235 de 403 comarcas no las toca nadie en 200 turnos. Ocho casas no llenan la
   península: el recorte de mapa pasa a T-049, con su horquilla de comarcas por jugador.
5. **Jugar sin estar todavía cuesta.** La diferencia entre entrar cada turno y cada seis es grande en
   varias casas. Parte es del robot (decide menos veces) y parte del juego; hay que mirarlo con el
   criterio de T-047 (< 5 %).

## 9. Al terminar

Índice y `ESTADO.md` (siguiente T-047). El primer informe queda en el repositorio como referencia.
Commit: `T-046: banco de pruebas con robots por casa`.
