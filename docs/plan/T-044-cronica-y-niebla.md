# T-044 · Fase 12: crónica, niebla e información fechada

**Fase:** 2 · Motor · **Depende de:** T-034 · **Estado:** pendiente

## 1. Contexto

La crónica es el equivalente al parte de VGA Planets y donde se juega medio juego: es lo primero que
lee el jugador y lo que le dice qué decidir. Y la niebla es lo que hace que la información valga
dinero.

Lee antes: [docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.6 y §2.7,
[docs/08-interfaz.md](../08-interfaz.md) §8.1 y §8.6.

## 2. Objetivo

Componer, a partir de los sucesos del turno, la crónica de cada jugador con lo que ese jugador puede
saber, y producir la vista filtrada del estado que se le enviará.

## 3. Alcance

**Entra:** `vistaDeJugador`, composición de la crónica, rumores, caducidad de la información y los
textos (plantillas) de los sucesos.

**No entra:** la presentación (T-085), el espionaje entre jugadores (T-102).

**Heredado de T-037.** Los sucesos del mercado son `mercado.abre`, `mercado.trato`,
`mercado.precio`, `mercado.sin-casar` (con su `motivo`), `mercado.sin-plaza` y
`mercado.orden-caduca`; las órdenes de mercado que esperan traen su `motivoEspera`. Los rumores de
feria y los precios conocidos de otras plazas (`DatosConocidos.preciosMil`) los pone esta tarea:
la fase 7 solo actualiza `EstadoMercado`, no toca el conocimiento de nadie.

**Heredado de T-038.** Los sucesos de la influencia son `influencia.fuentes` (con el desglose:
presencia, vecinas, mercado, comercio, monasterio, camino, desgaste, escasez, neto y total),
`influencia.regalo`, `incorporar.empieza`, `incorporar.completa` e `incorporar.perdida` (con el
`ganador` y su `nombre`: cortejar a un concejo es público). Las órdenes de `regalo` y de
`incorporar` que esperan traen su `motivoEspera` (`regalo-reciente`, `influencia-baja`,
`sin-ventaja`, `muy-lejos`, `escasez`).

**Heredado de T-039.** Los sucesos de los acontecimientos son `acontecimiento.calendario` (el
calendario del año entero, el primer turno del año), `acontecimiento.anuncia` (dos turnos antes),
`acontecimiento.empieza` y `acontecimiento.termina`, todos con `tipo`, `region`, `turnoInicio` y
`turnosDuracion`, y la `comarca` del suceso si el acontecimiento es de una comarca. Las respuestas
sugeridas («Vender el excedente de pan») son texto de la tabla (`ACONTECIMIENTOS.catalogo[tipo]`),
no de los sucesos: la crónica las pone.

**Heredado de T-040.** Los sucesos de los rebaños son `rebanyo.forma`, `rebanyo.llega`,
`rebanyo.detenido` (con `motivo`: `camino-cerrado` o `tierra-ajena`), `rebanyo.vuelve-por-nieve`,
`rebanyo.aviso-puerto` (dos turnos antes), `rebanyo.sin-pasto` (con `motivo`: `estacion`,
`sin-pasto`, `saturado`, `camino`), `rebanyo.cabezas` (pérdidas por falta de pasto),
`rebanyo.desaparece`, `rebanyo.esquileo` (con `lana`, `calidadMil` y el factor de acontecimientos) y
`comarca.estiercol`.

## 4. Diseño detallado

### 4.1 Vista de jugador

```ts
export function vistaDeJugador(estado: EstadoPartida, jugador: IdJugador, mundo: Mundo): VistaJugador;
```

Reglas de filtrado, sin excepciones:

| Dato | Se ve si… |
|---|---|
| Comarca propia | siempre, completa |
| Comarca explorada | datos de la fecha en que se supieron (`turnoUltimaNoticia`) |
| Comarca oída | solo nombre y región |
| Comarca desconocida | nada, ni siquiera que existe |
| Recua propia | siempre |
| Recua ajena | solo si está en comarca propia o explorada con presencia; de forma imprecisa |
| Almacén ajeno | nunca |
| Precios de una plaza | los de la última vez que se estuvo o se recibió rumor |
| Prestigio y clasificación | siempre (son públicos) |
| Influencia ajena en comarca neutral | solo si tienes presencia allí, y redondeada a tramos de 10 |

El servidor **solo** envía `VistaJugador`. Nunca el estado completo (T-062 lo verificará con un test
que intente encontrar datos ajenos en la respuesta).

### 4.2 Caducidad

Cada dato conocido guarda el turno en que se supo. La interfaz lo muestra siempre («según se supo en
la segunda quincena de mayo»). La información no se actualiza sola: hay que volver, comerciar o
recibir rumores.

### 4.3 Rumores

Fuentes: ferias (a más volumen, más rumores), `camino-de-santiago`, ventas propias y el cometido de
emisario (T-102). Un rumor es un dato fechado y **puede ser impreciso**: cantidades redondeadas y, en
ocasiones, desactualizadas. Nunca es falso a propósito: el juego no miente al jugador.

### 4.4 Composición de la crónica

Los sucesos no llevan texto; la crónica se compone con plantillas:

```jsonc
{
  "produccion.resumen": "Este turno entraron {pan} de pan, {madera} de madera, {piedra} de piedra y {maravedis} maravedís. Se consumieron {consumo} de pan.",
  "recua.llegada": "La recua {recua} llegó a {comarca} tras {jornadas} jornadas de camino.",
  "obra.detenida": "La obra de {obra} en {comarca} se detuvo: falta {recurso}.",
  "calendario.puerto-cerrado": "El {puerto} quedó cerrado por la nieve."
}
```

Estructura de la crónica (el orden importa: primero lo que exige decisión):

1. **Avisos** (escasez inminente, obras detenidas, órdenes en espera, puertos que se cierran).
2. **Sucesos propios** (obras terminadas, llegadas, descubrimientos, esquileo).
3. **Resumen económico**.
4. **Rumores**.
5. **Hitos y clasificación**.

Cada entrada lleva, cuando procede, una **acción sugerida** (identificador de la orden que
resolvería el problema), que la interfaz convierte en un botón.

### 4.5 Voz

Frases cortas, concretas, con nombres propios y fechas del calendario del juego. Sin emojis, sin
jerga de sistema, sin exclamaciones. Las plantillas se revisan leyéndolas en voz alta.

## 5. Archivos

```
paquetes/nucleo/src/fases/12-cronica.ts
paquetes/nucleo/src/reglas/{vista,cronica,rumores}.ts
paquetes/nucleo/src/reglas/*.test.ts
paquetes/nucleo/datos/plantillas-cronica.json
```

## 6. Criterios de aceptación

1. `vistaDeJugador` no filtra nada de más ni de menos: test que, para un estado con dos jugadores,
   comprueba las diez reglas de §4.1 una a una.
2. Un test de «fuga de información» recorre la vista serializada y falla si aparece cualquier
   identificador o cifra que el jugador no debería conocer.
3. La información fechada conserva el turno correcto y no se actualiza sola.
4. La crónica de un turno con escasez, obra detenida y recua llegada contiene las tres entradas, en
   el orden de §4.4, y con acción sugerida donde corresponde.
5. Todas las plantillas usadas existen y no queda ningún hueco `{campo}` sin sustituir (test que
   recorre todos los tipos de suceso).
6. Los rumores son deterministas y su imprecisión está acotada.
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/vista.test.ts paquetes/nucleo/src/reglas/cronica.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-045). Commit: `T-044: cronica, niebla e informacion fechada`.
