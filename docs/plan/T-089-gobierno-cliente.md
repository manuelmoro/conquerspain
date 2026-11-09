# T-089 · Gobierno: fuero y carga, obra mayor, tradiciones, mayordomo y corte

**Fase:** 4 · Cliente · **Depende de:** T-082 · **Estado:** en curso (ficha **detallada** el 09-11-2026)

## 1. Contexto

Abierta el 09-11-2026 desde T-088 §2.9. Al escribir la tabla de acciones sugeridas del cliente
(`QUE_HACER` en `paquetes/cliente/src/nombres.ts`), cinco tipos de orden del motor no tenían ninguna tarea del
plan que les diera pantalla: `politica` (fuero y carga fiscal), `obra-mayor`, `tradicion`, `mayordomo` y
`trasladar-corte`. Se sumó la `letra-de-cambio` desde T-084. Sin ellas, el jugador humano no puede tomar
decisiones que el motor y los robots ya toman.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.6 (lealtad y política), §3.9 (administración, fueros y
traslado de la corte) y §3.11 (obras mayores); [docs/02](../02-diseno-nucleo.md) §2.5.3 (mayordomo);
[docs/04](../04-casas-y-tradiciones.md) (tradiciones).

## 2. Objetivo

Que cada una de esas órdenes se pueda dar desde el cliente con su coste, su efecto previsto y sus bloqueos
explicados, como las acciones de la ficha (T-082).

## 3. Alcance

**Entra:**
- En la ficha de una comarca propia: fuero, carga fiscal, dehesa, obras mayores (puente y calzada por tramo
  hacia cada vecina) y traslado de la corte.
- En una pantalla **«Tu casa»**: la tradición de cada ronda abierta, el mayordomo (sus reglas en castellano,
  alta y baja, con el límite), la sal de las conservas y la letra de cambio de los mercaderes.

**No entra:** lo que necesite a otro jugador (fase 5).

## 4. Diseño detallado

### 4.1 Una sola cuenta para la política (núcleo)

`impedimentoDePolitica(comarca, cambio, turno, prohibiciones, reglas)` en `reglas/politica.ts`, con lo que hoy
decide la fase 8 en línea (comarca ajena, carga dura prohibida por la casa, fuero reciente, fuero irreversible).
La fase pasa a llamarla, sin cambiar ninguna huella. Así la ficha bloquea exactamente lo que la fase dejaría en
espera.

### 4.2 Acciones de gobierno en la ficha (núcleo, `ficha-gobierno.ts`)

`accionesDeGobierno(...)` añade a la ficha propia, cada una con coste, turnos, efecto y bloqueo:

- **Fuero:** «Dar carta puebla», «Dar fuero», «Quitar el fuero». El efecto sale de una tabla de textos
  (`datos/gobierno.ts`) que dice lo de docs/03 §3.9: administración, impuestos y lealtad.
- **Carga fiscal:** ligera, normal y dura, con su efecto en la lealtad; la que ya rige no se ofrece.
- **Dehesa:** acotarla o levantarla.
- **Obras mayores:** monasterio, catedral, muralla, atarazana y acequia mayor en la comarca; puente y calzada
  hacia cada vecina conocida. Coste: `costeDeObraMayor`. Bloqueo: `impedimentoDeObraMayor`. Efecto: la tabla de
  textos, con lo de docs/03 §3.11.
- **Trasladar la corte**, en una propia que no es la capital: `impedimentoDeTraslado`, con su coste y sus 10
  turnos.

Los motivos nuevos tienen su causa y su salida en `BLOQUEOS`.

### 4.3 «Tu casa» (cliente, `casa.ts` puro y `pantallas/casa.ts`)

- **Tradiciones:** por cada ronda abierta y sin elegir, sus cartas (`opcionesDeTradicion`), con nombre,
  descripción y nota histórica, y «Elegir» (irreversible: confirmación con previsión, como pide §8.3.7). Debajo,
  las ya elegidas.
- **Mayordomo:** sus reglas en castellano (`describirRegla`: «Si el pan disponible baja de 40, comprar 80 de pan
  en el Mercado de X a no más de 3,5»), cuántas atiende (`limiteDeReglas` con la capital de la vista) y cuáles
  quedan fuera del límite. Hay un formulario de alta con las condiciones y acciones cerradas
  (`CONDICIONES_DE_MAYORDOMO`, `ACCIONES_DE_MAYORDOMO`), y «Quitar» por prioridad.
- **Sal de las conservas:** activarla o no (una orden `politica` sobre la capital con `conservarConSal`).
- **Letra de cambio:** no entra. Al detallar se vio que el servidor la rechaza («llegan con T-103»); se queda
  para T-103 y `QUE_HACER` lo dice.

Se abre con «Tu casa» en la cabecera, en el panel, como el mercado y la crónica. `QUE_HACER` lleva cada tipo a
su sitio y ya no queda ninguno «llegará con».

## 5. Criterios de aceptación

1. La ficha de una comarca propia ofrece fuero, carga, dehesa, obras mayores y traslado, cada uno con efecto, y
   su bloqueo coincide con lo que haría la fase (probado: una orden bloqueada en la ficha queda en espera o
   cancelada al resolver; una libre se aplica).
2. Las huellas de las partidas de reproducción no cambian al extraer `impedimentoDePolitica`.
3. Toda regla del mayordomo se describe en castellano sin identificadores (probado para cada condición y cada
   acción), y la que se compone en el formulario la acepta el servidor.
4. Ningún tipo de orden queda sin sitio en `QUE_HACER` (probado).
5. `npm run verificar` en verde y el cliente por debajo de su presupuesto.

## 6. Verificación

```bash
npm run verificar
```

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-089: <resumen>`.

## 8. Dónde va (09-11-2026)

- **Hecho y verificado (§4.1 y §4.2):** `reglas/politica.ts` (la fase 8 la usa, las huellas no cambian),
  `datos/gobierno.ts`, `ficha-gobierno.ts` y los bloqueos nuevos. Probado en `ficha.test.ts`: lo que la ficha
  bloquea, la fase lo deja en espera; lo libre se aplica.
- **Arreglado de paso (T-036):** el traslado de la corte no cobraba su coste (`costeTraslado` no se usaba en
  ninguna parte). Ahora la orden lo reserva y lo paga como cualquier otra (`costeDeIntencion` y
  `construirOrden`), con prueba en `intencion.test.ts`.
- **Falta (§4.3):** la pantalla «Tu casa» en el cliente: tradiciones, mayordomo y sal de las conservas;
  `QUE_HACER` sin ningún «llegará con» salvo la letra de cambio (T-103).
