# T-129 · La charla de la partida

**Fase:** 7 · Tras jugar de verdad · **Depende de:** T-124 · **Estado:** **hecha (11-11-2026)**

> Petición del usuario (11-11-2026): «estaría bien tener una sección de chat», sin recargar la pantalla.

## 1. Contexto

Los jugadores solo podían hablar fuera del juego. El servidor ya tiene un canal en vivo por partida (T-064,
T-124), así que la charla es una tabla, cuatro rutas y un evento más.

## 2. Diseño

### 2.1 Persistencia

Migración 9: `mensaje (id, partida, jugador, turno, texto, enviado_en)`, que solo crece, con índice por
partida; y `mensaje_leido (partida, jugador, ultimo)`, para que lo no leído se cuente igual en cualquier
dispositivo. `RepositorioDeCharla` (`persistencia/charla.ts`): `guardarMensaje` (con el turno en que está la
partida), `mensajes` (anteriores a un id, del más viejo al más nuevo), `ultimoLeido`, `marcarLeidos` (nunca
hacia atrás) y `sinLeer` (de otros, después del último leído).

### 2.2 API

- `GET /partidas/:id/charla` y `GET /partidas/:id/charla/antes/:mensaje`: de cien en cien, con autor (nombre y
  casa del estado), `hayMas`, `ultimoLeido` y `sinLeer`.
- `POST /partidas/:id/charla` con `{"texto"}`: sin caracteres de control, sin más de una línea en blanco
  seguida, de 1 a 500 caracteres; lo propio queda leído. Publica `mensaje` en el canal y el flujo SSE lo
  manda como `event: mensaje`.
- `PUT /partidas/:id/charla/leidos` con `{"hasta"}`.
- `GET /partidas/:id/estado` añade `charlaSinLeer`.
- Solo quien juega (no quien espera a entrar); el límite de peticiones por cuenta de siempre frena el abuso.

### 2.3 Cliente

- Una sexta pestaña, **💬 Charla**, con un numerito rojo de lo no leído; en el móvil, también en la barra de
  abajo. Nada más en pantalla: ni avisos flotantes ni correos.
- La pestaña: los mensajes por turno («Turno 12»), los propios a la derecha, «Nuevos» antes del primero sin
  leer, y «Ver mensajes anteriores» si hay más. El campo conserva lo escrito y el foco aunque la pantalla se
  repinte; Intro envía y Mayúsculas + Intro hace otra línea; contador de 500. Si se estaba abajo, baja con lo
  que llega.
- `Almacen`: `abrirCharla` (trae y da por leído), `escribirEnLaCharla`, `charlaAnterior`, `cerrarCharla` y
  `alMensaje`, que no duplica el mismo mensaje si llega por la respuesta y por el canal, y lo cuenta como no
  leído si la charla está cerrada y no es propio.
- Lo que se dice no obliga: la pantalla y la guía lo recuerdan y remiten a los contratos.

## 3. Criterios de aceptación

1. Los jugadores de una partida se escriben y se leen en vivo. ✔
2. Se sabe cuántos mensajes hay sin leer sin abrir la charla, y la cuenta sigue en otro dispositivo. ✔
3. La pantalla no se carga: una pestaña más y un número. ✔
4. Solo hablan quienes juegan; los mensajes vacíos, demasiado largos o con caracteres de control no pasan. ✔

## 4. Verificación

`npm run verificar`, con `servidor/src/api/charla.test.ts`, `cliente/src/charla.test.ts` y
`migraciones.test.ts`. Probado en el navegador con dos cuentas (`npm run guia:capturas`: `charla.jpg`,
`charla-aviso.jpg`).
