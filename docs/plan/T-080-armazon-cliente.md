# T-080 · Armazón del cliente y sincronización

**Fase:** 4 · Cliente · **Depende de:** T-062 (y usa T-063 a T-065) · **Estado:** **hecha (25-09-2026)**

## 1. Contexto

El cliente definitivo se construye sobre el motor real; la maqueta queda como referencia visual. El
servidor ya ofrece todo lo que el cliente necesita: enlace mágico y sesión (T-063), convocatorias
(T-065), vista por jugador, órdenes por intención, crónica (T-062) y eventos en vivo (T-064). Falta el
armazón: un cliente que arranque, hable con el servidor, guarde lo pendiente, prevea costes y no pierda
nada si se va la conexión. Y, para poder usarlo, **un servidor que se pueda arrancar** (`npm run dev`).

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.5 y [docs/08-interfaz.md](../08-interfaz.md) §8.1.

## 2. Objetivo

Un cliente con Vite y TypeScript, sin framework ni dependencias nuevas, con:

1. una capa de datos pura y probada: API, estado, órdenes pendientes que sobreviven a la desconexión,
   previsión de costes con el núcleo y reacción a los eventos;
2. un esqueleto de pantallas (entrar, mis partidas, partida con su bandeja) que ejercita esa capa;
3. `npm run dev`: servidor de desarrollo y cliente juntos.

## 3. Alcance

**Entra:** estructura del proyecto, la capa de datos, la sesión, la previsión, el canal de avisos, el
modo sin conexión, el esqueleto de pantallas, el programa principal del servidor y `npm run dev`.

**No entra:** el atlas (T-081), la ficha de comarca y la bandeja definitiva (T-082), el resto de
pantallas (T-083 a T-086) y la dirección de arte (se toma la de la maqueta en cuanto haya pantallas).

## 4. Decisiones

### 4.1 La previsión es de costes, no del turno entero

La ficha esbozada pedía «`preverTurno` con la vista y las pendientes». **No se puede**: la vista es la
niebla de T-044 (no lleva los almacenes ajenos, ni la semilla, ni lo que el jugador no conoce), y el turno
depende de todo eso. Lo que sí se puede prever **exactamente** es lo que docs/08 §8.1 pide de la bandeja:
**lo que reserva cada orden y si alcanza**. Para que sea exacto por construcción, `construirOrden` (T-062)
se parte: el coste sale de una función pura nueva del núcleo,
`costeDeIntencion(bosquejo, jugador, comarca, reglas)`, que usan **el servidor al construir la orden y el
cliente al preverla**. La vista trae el `EstadoJugador` propio y el `EstadoComarca` de las propias, que es
todo lo que el coste necesita (casa, tradiciones, dehesa, monasterio).

`preverBandeja(vista, pendientes, reglas)` → por orden: coste, y acumulado frente a lo `disponible`
(almacén − reservado); marca las que ya no caben. Es una previsión: el motor decide al resolver.

### 4.2 Estado del cliente

```ts
interface EstadoDelCliente {
  cuenta: { id, nombre } | null;
  partida: { id, vista, recibidaEn, desactualizada: boolean } | null;
  pendientes: IntencionLocal[];          // en la bandeja, aún sin confirmar por el servidor
  conexion: 'conectado' | 'sin-conexion';
  turnoNuevo: number | null;             // llegó un turno mientras se miraba: se ofrece recargar
  errores: { codigo, mensaje }[];        // los del servidor, tal cual (en español)
}
```

Un `Almacen` con `suscribir` y acciones; las pantallas solo leen y llaman acciones.

### 4.3 Órdenes pendientes que no se pierden

Cada intención recibe su `idCliente` al crearse (aleatorio) y se guarda **antes** de mandarla, en un
`Guardado` (interfaz; `localStorage` en el navegador, memoria en pruebas). `sincronizar()` manda las que
queden: si el servidor responde `201` o `200` (repetida: la idempotencia de T-062), sale de la bandeja; si
responde con un error de la orden (`4xx`), se queda marcada con su error para que el jugador la corrija o la
quite; si **no hay respuesta** (red caída), se queda tal cual y se reintenta al volver la conexión. Como la
clave va en la orden, reenviar nunca duplica. Si el turno cambió mientras tanto (`409 turno-cerrado`), la
intención se conserva y se reenvía al recargar: pertenece al turno que el jugador esté mirando.

### 4.4 Un turno nuevo nunca cambia la pantalla bajo los dedos

El evento `turno-resuelto` (T-064) solo pone `turnoNuevo`; la pantalla enseña «Se ha resuelto el turno N ·
Recargar» y es el jugador quien recarga. Si se corta el flujo de eventos, se reintenta con espera
creciente (1, 2, 4… hasta 30 s).

### 4.5 Sin conexión

La última vista buena se guarda con su hora. Al arrancar sin red, se enseña esa vista con
`desactualizada: true` y el aviso «Sin conexión: esto es de las HH:MM»; las órdenes que se den se
quedan en la bandeja (§4.3).

### 4.6 Sin framework, y medido

Vite 8 (ya instalado por Vitest) y DOM a mano: unas pocas pantallas no justifican una dependencia, y el
peso importa en móvil. **Presupuesto**: el JavaScript del cliente, núcleo incluido, **≤ 150 KB gzip**; una
comprobación (`npm run cliente:tamano`) construye y lo mide, y entra en `verificar`. El «1,5 s en un móvil
de gama media» no se puede medir en integración continua: el presupuesto de peso es su aproximación, y la
medida en un móvil real queda para el checkpoint J-01 (tras T-082).

### 4.7 El servidor se puede arrancar

`paquetes/servidor/src/principal.ts` monta la base (fichero), el reloj con el despachador, la API y el
HTTP con la configuración del entorno (`PUERTO`, `BASE_DE_DATOS`, `CLAVE_DE_COOKIES`, `URL_PUBLICA`,
`COOKIE_SEGURA`). En desarrollo, el correo va a la consola (`CorreoPorConsola`: escribe el enlace de
acceso para poder entrar sin SMTP, T-066). `npm run dev` arranca servidor y Vite, con el proxy de Vite
hacia la API (misma origen para la cookie).

## 5. Piezas

```
paquetes/nucleo/src/ordenes/intencion.ts   costeDeIntencion (y construirOrden la usa)
paquetes/cliente/
  index.html, vite.config.ts
  src/api.ts            ClienteApi: fetch con credenciales, errores tipados, sin respuesta = red caída
  src/guardado.ts       Guardado (localStorage / memoria)
  src/prevision.ts      preverBandeja
  src/almacen.ts        EstadoDelCliente y acciones (entrar, cargar, anyadir, quitar, sincronizar, recargar)
  src/eventos.ts        canal de eventos con reintento (EventSource en el navegador)
  src/pantallas/*.ts    entrar, mis partidas, partida (esqueleto)
  src/main.ts
paquetes/servidor/src/principal.ts, cuentas/correo.ts (CorreoPorConsola)
herramientas/tamano-cliente.ts               construye y mide el paquete
```

## 6. Criterios de aceptación

1. **Previsión exacta:** para cada tipo de intención con coste, `costeDeIntencion` con los datos de la vista
   da el mismo coste que la orden que construye el servidor (prueba comparativa sobre una partida real).
2. **Sin pérdidas:** con la red caída, las intenciones quedan en la bandeja y en el guardado; al volver,
   `sincronizar` las manda y el servidor no duplica ninguna (también si la respuesta se perdió tras guardarse);
   un error de la orden la deja marcada con su mensaje.
3. **Turno nuevo:** un `turno-resuelto` no cambia la vista; pone el aviso y `recargar` la cambia.
4. **Sin conexión:** arrancar sin red enseña la última vista con su hora y la marca desactualizada.
5. **Peso:** el cliente construido pesa ≤ 150 KB gzip, medido por `npm run cliente:tamano`.
6. **De punta a punta:** con el servidor real en un puerto y la capa de datos del cliente (sin navegador):
   pedir enlace, entrar, convocar en solitario, sortear, elegir, cargar la vista, dar una orden y verla en la
   bandeja del servidor.
7. `npm run dev` arranca los dos (comprobado a mano; se deja descrito en ESTADO) y `npm run verificar` en verde.

## 7. Verificación

```bash
npm run verificar
npm run cliente:tamano
npm run dev   # a mano: abrir el navegador, pedir enlace (sale en la consola), entrar
```

## 8. Al terminar

1. Índice: T-080 `hecha`. 2. `ESTADO.md` y bitácora. 3. `docs/07` §7.5 y CLAUDE.md §5 (`npm run dev`).
4. Commit: `T-080: armazón del cliente y sincronización`.

## 9. Cierre (25-09-2026)

**Hecha.** `costeDeIntencion` en el núcleo (y `construirOrden` la usa); `paquetes/cliente/` con `api`,
`guardado`, `prevision`, `almacen`, `eventos`, tres pantallas de esqueleto (entrar, mis partidas, partida con
su bandeja) y `main.ts`; `paquetes/servidor/src/principal.ts` y `CorreoPorConsola`; `npm run dev`,
`npm run servidor` y `npm run cliente:tamano` (este último, en `verificar`). 9 pruebas nuevas (y una vieja retirada); 1206 en total.

**Criterios:**

1. **Previsión exacta:** para construir, roturar, aperos, formar recua, formar rebaño y obra mayor, el coste
   que prevé el cliente con su vista es el de la orden que guarda el servidor; y marca lo que ya no alcanza.
2. **Sin pérdidas:** con la red caída, las intenciones quedan en la bandeja y en el guardado; con la respuesta
   perdida después de guardarse, el reenvío no duplica (el servidor tiene 2, no 4); un rechazo queda marcado con
   su mensaje; una bandeja guardada mal formada no rompe.
3. **Turno nuevo:** el evento solo pone el aviso; `recargar` trae el turno siguiente.
4. **Sin conexión:** otro cliente sin red abre la última vista guardada con su hora y marcada como vieja.
5. **Peso:** **30,4 KB gzip** (presupuesto 150).
6. **De punta a punta:** con el servidor real (cuentas, altas y API por HTTP): enlace, entrar (cookie en el
   tarro), convocar en solitario, sortear, elegir, ver la partida y dar una orden que llega al servidor.
7. `npm run dev` comprobado a mano: Vite en 5173 sirve el cliente y el proxy lleva `/api` al servidor (401 sin
   sesión, 202 al pedir enlace). `npm run verificar` en verde.

**Decisiones no escritas antes:** el puerto por defecto del servidor es **8471** (el 8080 estaba ocupado en la
máquina de desarrollo); la vista cacheada y las respuestas del servidor se toman con su forma declarada tras
comprobar la versión de reglas (el servidor es del mismo repositorio); la bandeja guardada sí se valida al
leerla. El «1,5 s en un móvil» se medirá en el checkpoint J-01 (tras T-082): aquí queda el presupuesto de peso.
