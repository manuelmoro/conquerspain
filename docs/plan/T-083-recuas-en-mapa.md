# T-083 · Recuas y rebaños: rutas sobre el mapa

**Fase:** 4 · Cliente · **Depende de:** T-082 · **Estado:** hecha (09-11-2026)

## 1. Contexto

Planificar un viaje de seis jornadas por un puerto que se cierra en dos turnos es una de las
decisiones más bonitas del juego. La interfaz tiene que hacerla fácil.

**Lo que añadió J-01 (25-09-2026, hallazgos 8 y 11 de su segunda sesión).** Sin mover recuas no hay forma
práctica de expandirse: la presencia (+2 de influencia por turno) y la exploración de las vecinas —que al empezar
solo se conocen de oídas— necesitan una recua, y los rebaños reciben avisos («no encuentra pasto», «pierde
cabezas») que el jugador no puede atender. Esta tarea es la que hace **jugable la expansión**: tiene que poder
hacerse desde la ficha de la comarca de destino, en pocos toques, «mandar una recua a estar presente» y
«mandar una recua a explorar», y mover un rebaño desde el aviso que lo pide.

Lee antes: [docs/08-interfaz.md](../08-interfaz.md) §8.2.6 y §8.3; [docs/02](../02-diseno-nucleo.md) §2.5.1 y
§2.5.2; [docs/06](../06-competicion.md) §6.2.

## 2. Objetivo

Que el jugador vea sus recuas y rebaños, les trace una ruta tocando el mapa con el turno de llegada y los avisos
exactos antes de confirmar, y que desde la ficha de una comarca neutral pueda mandar una recua a estar presente
o a explorar con una sola confirmación.

## 3. Alcance

**Entra:** la previsión de viajes compartida en el núcleo; misiones de presencia y exploración desde la ficha;
lista y ficha de unidades; editor de ruta (recua y rebaño) con paradas, carga y descarga, circular y bastimento;
avisos estacionales antes de confirmar; desde un aviso de la crónica, abrir la unidad; ruta nueva que releva una
circular.

**No entra (y a dónde va):** comprar y vender con precio límite en las paradas → **T-084** (es la pantalla del
mercado, con la que comparte el explicar qué es un límite); contratos y portazgos → fase 5.

## 4. Diseño detallado

### 4.1 La previsión, una sola cuenta (núcleo)

`Tablero` y la previsión de viajes (`preverViaje`, `provisionPara`, `preverRebanyo`, `leLlega`,
`panDePresencia`) pasan de `herramientas/banco/src/robots/` a `paquetes/nucleo/src/prevision/`, sin cambiar una
línea de lógica, y se exportan. Los robots las importan del núcleo; el servidor las usa para el cliente. Así el
turno de llegada que ve el jugador es **la misma función** que ya se prueba contra el motor (T-050). La prueba de
que el banco no cambia: sus pruebas y huellas siguen iguales.

### 4.2 Misiones desde la ficha (núcleo, `prevision/misiones.ts`)

```ts
type Mision = 'presencia' | 'explorar';
interface PlanDeMision {
  readonly recua: IdRecua;
  readonly desde: IdComarca;          // donde está la recua
  readonly intenciones: readonly Record<string, unknown>[]; // en el orden en que se dan
  readonly llegada: number;           // turnos hasta llegar (1 = este)
  readonly pan: number; readonly sal: number; // lo que carga del almacén
  readonly turnosPresente: number | null;     // solo presencia: cuántos aguanta antes de volver
}
function planDeMision(t: Tablero, destino: IdComarca, mision: Mision):
  ResultadoDeViaje<PlanDeMision> | { ok: false; motivo: 'sin-recua-libre' }
```

- **Recua:** la libre (`t.libre`) quieta en comarca propia que llegue antes al destino; empate, la más antigua.
- **Explorar** (destino oído o explorado): `provisionPara(t, recua, [ida, vuelta])` con vuelta a
  `t.casaMasCercana(destino)`; intenciones: `carga` (pan y sal que falten, descarga el resto),
  `ruta` a destino con `expedicion: true`, `cometido explorar`, `ruta` de vuelta. Como hace el robot.
- **Presencia** (neutral explorada u oída): provisión de ida y vuelta, más todo el pan que quepa en el porte;
  `turnosPresente = floor((pan − pan de la vuelta) / pan de un turno presente)` (`panDePresencia`), al menos 1;
  intenciones: `carga`, `ruta` a destino, `cometido presencia`, y `ruta` de vuelta **programada** para el turno
  `turno + llegada + turnosPresente` (`turnoProgramado`, plan de temporada; tope `turnosDePlan`, se recorta).
- Si la previsión falla, el motivo es el de `ViajeImposible` (sin ruta, puerto cerrado, no cabe, sin pan…).

`fichaDeComarca` añade, en toda neutral conocida, las acciones `mision-presencia` (no en las oídas: hay que
saber dónde se está) y `mision-explorar`, con su efecto previsto («llega en 2 turnos; +2 de influencia por turno
durante 5 turnos» / «llega en 2 turnos y vuelve a Burgos»), su coste (lo que carga) y sus bloqueos con causa y
salida (`sin-recua-libre` → «forma una recua en una comarca tuya»; los de viaje, con su texto). `AccionDeFicha`
gana `intenciones: readonly Record<string, unknown>[]` (para las demás, la suya sola) y el cliente las manda
todas, en orden.

### 4.3 Previsión de una ruta a mano (servidor)

`POST /partidas/:id/prevision-de-ruta` con `{ recua | rebanyo, paradas: IdComarca[], circular }` devuelve, con el
`Tablero` de la vista del jugador:

```ts
interface PrevisionDeRuta {
  readonly ok: boolean;
  readonly motivo: ViajeImposible | null;    // con su texto en BLOQUEOS
  readonly tramos: readonly { desde; hasta; jornadas; puerto: string | null; cierraEnInvierno: boolean }[];
  readonly llegadas: readonly number[];      // turno de llegada a cada parada (1 = este)
  readonly pan: number; readonly sal: number; // bastimento del viaje (recua)
  readonly avisos: readonly string[];         // puertos que cierran durante el viaje, verano sin sal…
}
```

Para un rebaño, `preverRebanyo` hasta su única parada. Los tramos salen de la ruta conocida (`t.rutaDeRecua` /
`t.rutaDeRebanyo`), con las jornadas de este turno. El aviso del puerto: si algún tramo de la ruta tiene puerto
que cierra en invierno y el calendario dice que el invierno empieza antes de la llegada, se avisa aunque la
previsión pase («Pajares cierra en 2 turnos y llegas en 3»); si se cierra antes de cruzarlo, `puerto-cerrado`.

### 4.4 Una ruta nueva releva una circular (núcleo)

`leTocaEnSuCola` deja empezar una orden `ruta` aunque la recua no esté libre si va en ruta circular
(`recua.rutaCircular`); `fijarRuta` ya termina el tramo en curso. Regla escrita en docs/02 §2.5.2.

### 4.5 Cliente

- **Unidades** (`pantallas/unidades.ts`): pestaña junto a la bandeja con recuas y rebaños: dónde están (o de
  camino entre A y B), qué llevan con su porte, ruta que les queda, cometido, y «Darle ruta».
- **Editor de ruta** (`editor-de-ruta.ts`, estado puro y probado; `pantallas/ruta.ts`): mientras está abierto,
  tocar una comarca del mapa añade una parada (tocar la última la quita). Lista de paradas con ↑↓ y quitar; para
  recuas, cargar y descargar por parada y «circular». Cada cambio pide la previsión (§4.3) y enseña tramo a tramo
  las jornadas, el turno de llegada a cada parada, el bastimento y los avisos, **antes** de confirmar. Si sale de
  casa, ofrece cargar el bastimento previsto (una intención `carga` delante de la ruta).
- **Desde la crónica:** `EntradaDeCronica` gana `unidad: { clase: 'recua' | 'rebanyo'; id } | null` (sale de
  los datos del suceso); en el resumen, una entrada con unidad y acción `ruta` lleva «Darle ruta», que abre el
  editor con esa unidad. `QUE_HACER` de `ruta`, `carga` y `cometido` pasa a decir dónde se hace.
- **En el mapa:** las paradas del editor se dibujan como ruta propuesta (capa de movimiento, trazo discontinuo).

## 5. Archivos

- `paquetes/nucleo/src/prevision/{tablero,viaje,misiones,ruta}.ts`, `index.ts`, `ficha.ts`,
  `fases/04-movimiento.ts`, `reglas/cronica.ts`, `tipos/cronica.ts`, `datos/bloqueos.ts`.
- `paquetes/servidor/src/api/manejadores.ts` y su prueba.
- `paquetes/cliente/src/{editor-de-ruta.ts,nombres.ts,almacen.ts,api.ts}`, `pantallas/{unidades,ruta,ficha,resumen,partida}.ts`, `atlas/componer.ts`.
- `herramientas/banco/src/robots/*` (solo imports).

## 6. Criterios de aceptación

1. El turno de llegada que muestra la interfaz coincide con el real: probado dando la ruta prevista y resolviendo
   hasta que llega (servidor y núcleo).
2. Se puede montar una ruta circular completa en móvil en pocos toques: tocar paradas, «circular», confirmar
   (probado en el estado puro del editor; la medida de un minuto se hace en J-02).
3. Los avisos estacionales (puerto que cierra, verano sin sal) aparecen antes de confirmar: probado en la
   previsión.
4. Desde la ficha de una comarca vecina neutral se deja una recua presente o se manda a explorar sin salir de la
   ficha, y el turno en que llega y se queda la influencia sube lo previsto: probado resolviendo turnos.
5. Un aviso de rebaño sin pasto lleva al editor de ese rebaño: probado (la entrada lleva la unidad).
6. Una ruta nueva releva una circular sin pararla antes: probado en el motor.
7. El banco da las mismas huellas tras mover la previsión al núcleo; `npm run verificar` en verde y el cliente
   por debajo de su presupuesto.

## 7. Verificación

```bash
npm run verificar
```

## 8. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-083: <resumen>`.

## 9. Cierre (09-11-2026)

Todo lo de §4, hecho y verificado:

- **Núcleo:** `prevision/` (tablero, viajes, misiones, ruta) y el relevo de la circular.
- **Servidor:** `POST /partidas/:id/prevision-de-ruta`.
- **Crónica:** `EntradaDeCronica.unidad`; las crónicas antiguas se leen con unidad nula.
- **Cliente:** `editor-de-ruta.ts`, `pantallas/{unidades,ruta}.ts`, la ruta propuesta en el atlas, las
  misiones en la ficha y «Darle ruta» en el resumen.

Probado en Chrome sin cabeza (escritorio): formar una recua, abrirle el editor, tocar dos comarcas con su
llegada prevista y mandar una misión de exploración desde la ficha de una comarca oída.

**Lo que encontró la prueba en navegador.** Las órdenes de una misión entraban en la cola de la recua en
cualquier orden. El servidor da de alta las órdenes por su identificador, que lleva la clave del cliente, y el
cliente generaba claves al azar. Ahora las órdenes que van juntas comparten clave con un sufijo creciente
(`anyadirVarias`), y las claves sueltas empiezan por el instante en que se crean (`claveOrdenada`). Una prueba
con claves decrecientes lo vigila: falla sin el arreglo.

Criterios: 1, 3, 4, 5, 6 y 7 probados con pruebas automáticas. El 2 está probado en el estado puro; la medida
de un minuto en un móvil de verdad se hace en J-02.
