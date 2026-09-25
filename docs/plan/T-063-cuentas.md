# T-063 · Cuentas, sesiones y seguridad

**Fase:** 3 · Servidor · **Depende de:** T-062 · **Estado:** en curso (ficha **detallada el 25-09-2026**)

## 1. Contexto

Para jugar partidas de meses hace falta identidad estable, y para multijugador, que nadie pueda
hacerse pasar por otro. T-062 dejó la API con una interfaz `Autenticador` (`identificar(peticion) →
cuenta | null`) y `participante.cuenta` como texto sin enlazar (T-060 §4.5). Esta tarea pone el
autenticador real detrás de esa interfaz: **quién eres** (cuentas y sesiones) y la superficie de
ataque que eso abre.

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.4 y [T-062](T-062-api.md) §4.2.

## 2. Objetivo

Alta de cuenta, inicio de sesión, sesiones seguras y borrado de cuenta, en
`paquetes/servidor/src/cuentas/`, sin dependencias nuevas, con un autenticador que enchufa en la API.

## 3. Alcance

**Entra:** enlace mágico por correo (a través de una interfaz de envío), sesiones con cookie firmada,
caducidad y revocación, límites contra fuerza bruta y enumeración, `GET /cuenta`, cierre de sesión (una
o todas), borrado de cuenta y la migración 2 del esquema.

**No entra:** el envío real de correo (T-064; aquí una interfaz y una implementación en memoria),
contraseñas, perfiles sociales, chat y amistades, y el reparto de la partida de una cuenta borrada
(T-105, el concejo). Tampoco enlazar una cuenta a un jugador de una partida: eso es el alta (T-065).

## 4. Decisiones

### 4.1 Solo enlace mágico, sin contraseñas

La propuesta de la ficha original. Razones: **no hay contraseñas que guardar**, así que el criterio «nunca
en claro ni en los registros» se cumple por construcción; se evita `argon2`, que exige una dependencia
nativa (Node solo trae `scrypt`, y bastaría, pero ya es superficie que auditar); y hay menos
fricción para quien juega una partida al mes. El coste: depende del correo, por eso el envío va tras la
interfaz `EnviadorDeCorreo` y T-064 le pone SMTP. Si algún día se quieren contraseñas, `scrypt` de
`node:crypto` es el camino.

### 4.2 Flujo

1. `POST /cuentas/enlace` `{ correo, nombre? }` → **siempre `202`** con el mismo cuerpo, exista o no
   la cuenta, sea o no válido el correo dentro de lo razonable (§4.5). Se crea un **enlace de
   acceso**: 32 bytes aleatorios (256 bits) en base64url; **solo se guarda su SHA-256**. Caduca a los
   **15 minutos**. Se manda al correo `…/entrar?token=<token>` a través de `EnviadorDeCorreo`.
2. `POST /sesion` `{ token }` → si el enlace existe, **no está usado** y no ha caducado, se **consume de
   forma atómica** (`UPDATE … WHERE usado_en IS NULL`), se busca o **se crea** la cuenta de ese correo (el
   primer enlace es el alta: nombre visible = el pedido o la parte local del correo) y se abre una
   sesión: `200` con `Set-Cookie`. Cualquier fallo (inexistente, usado, caducado) es el **mismo `401
   enlace-invalido`**: no se distingue por qué.
3. `GET /cuenta` (con sesión) → `{ id, nombre, correo }`.
4. `DELETE /sesion` cierra la sesión actual; `POST /sesion/cerrar-todas`, todas las de la cuenta.
5. `DELETE /cuenta` borra la cuenta (§4.7).

### 4.3 Sesiones y cookie

- La sesión es un token aleatorio de 256 bits; en la base **solo su SHA-256**. Un volcado de la base
  no sirve para entrar.
- La cookie es `sesion=<token>.<firma>` con `firma = HMAC-SHA256(clave del servidor, token)` en
  base64url, **comparada en tiempo constante**: lo que no viene firmado se rechaza sin tocar la base.
- Atributos: `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=<caducidad>`. (`Secure` se puede
  quitar solo en desarrollo con `cookieSegura: false`.)
- **Caducidad absoluta de 30 días** y revocación explícita (`revocada_en`). Una sesión caducada o
  revocada no autentica. No hay caducidad deslizante: es más simple de razonar y de probar.
- **CSRF:** `SameSite=Lax` no envía la cookie en un `POST` desde otro sitio; además las rutas que
  cambian algo exigen `content-type: application/json`, que un formulario cruzado no puede mandar.
- La clave de firma sale de la configuración (`claveDeCookies`, mínimo 32 bytes); si falta o es corta,
  el servidor **no arranca**.

### 4.4 Datos personales al mínimo

Correo (en minúsculas) y nombre visible. Nada más: ni IP ni agente de usuario se guardan. El registro
(`Registro`) **nunca** lleva el token, el enlace ni el correo entero: solo el id de la cuenta.

### 4.5 Fuerza bruta y enumeración

- Mismo `202` para cualquier correo; **el trabajo es el mismo** exista o no la cuenta (no se consulta
  hasta entrar), así que tampoco hay diferencia de tiempo apreciable.
- Un token de 256 bits no se adivina; aun así, `POST /sesion` limita **10 intentos por minuto por
  origen**.
- `POST /cuentas/enlace`: **5 enlaces por hora y correo** y **20 por hora y origen**; pasado el límite,
  `429` con `retry-after` (el límite por correo revela poco: no dice si la cuenta existe).
- Un correo con forma imposible (sin `@`, más de 254 caracteres) da `400 correo-invalido`; es lo único
  que se distingue, y es información que el cliente ya tiene.
- El «origen» es la dirección del cliente (`PeticionHttp.origen`, que el adaptador rellena con la del
  socket; tras un proxy habría que confiar en `x-forwarded-for` **solo** desde proxies conocidos, y
  eso queda para el despliegue).

### 4.6 Control de acceso

`autenticadorDeSesiones(servicio)` implementa `Autenticador` de T-062: lee la cookie, comprueba la
firma, busca el hash, mira caducidad y revocación y devuelve el id de la cuenta. La API de T-062 ya
resuelve «qué jugador soy en esta partida» con `participante.cuenta`; un token robado a medias, una
cookie sin firmar o una cuenta ajena dan `401` o `404` sin revelar nada.

### 4.7 Borrado de cuenta

`DELETE /cuenta` (con sesión, y el cuerpo `{ "confirmo": true }` para evitar un borrado por descuido):

- **se anonimiza** la cuenta (`correo` y `nombre` se sustituyen por marcas y `borrada_en` se rellena;
  el id se conserva para que las claves foráneas sigan valiendo);
- se **revocan todas sus sesiones** y se **invalidan sus enlaces**;
- en cada partida donde jugaba, `participante.cuenta` pasa a `NULL`: el **jugador sigue existiendo**, con
  su dominio y sus órdenes en marcha, gobernado por su plan y su mayordomo hasta que T-105 (el concejo)
  decida qué hacer con él. **No se borra ni se toca ninguna partida.**

### 4.8 Esquema (migración 2, `0002-cuentas`)

```sql
CREATE TABLE cuenta (
  id         TEXT PRIMARY KEY,
  correo     TEXT NOT NULL UNIQUE,     -- minusculas; tras borrar, 'borrada-<id>'
  nombre     TEXT NOT NULL,
  creada_en  INTEGER NOT NULL,
  borrada_en INTEGER
) STRICT;
CREATE TABLE enlace_de_acceso (
  hash       TEXT PRIMARY KEY,         -- SHA-256 del token
  correo     TEXT NOT NULL,
  nombre     TEXT,
  creado_en  INTEGER NOT NULL,
  expira_en  INTEGER NOT NULL,
  usado_en   INTEGER
) STRICT;
CREATE INDEX enlace_por_correo ON enlace_de_acceso (correo, creado_en);
CREATE TABLE sesion (
  hash        TEXT PRIMARY KEY,        -- SHA-256 del token
  cuenta      TEXT NOT NULL REFERENCES cuenta(id),
  creada_en   INTEGER NOT NULL,
  expira_en   INTEGER NOT NULL,
  revocada_en INTEGER
) STRICT;
CREATE INDEX sesion_por_cuenta ON sesion (cuenta);
```

Reversible (`bajar` las borra). Los identificadores de cuenta son `c-<16 hex aleatorios>`.

## 5. Piezas

```
paquetes/servidor/src/persistencia/migraciones/0002-cuentas.ts
paquetes/servidor/src/persistencia/cuentas.ts    interfaz RepositorioDeCuentas; la implementa RepositorioSqlite
paquetes/servidor/src/cuentas/
  tokens.ts       aleatorio, sha256, firma HMAC de la cookie, construir y leer la cookie
  correo.ts       EnviadorDeCorreo y CorreoEnMemoria
  servicio.ts     ServicioDeCuentas: pedirEnlace, entrar, autenticar, cerrarSesion, cerrarTodas, borrar
  autenticador.ts autenticadorDeSesiones (implementa el de T-062)
  *.test.ts
paquetes/servidor/src/api/manejadores.ts          rutas publicas y de cuenta; `origen` en PeticionHttp
paquetes/servidor/src/api/http.ts                 rellena `origen` con la direccion del socket
```

Dependencias inyectadas: `ahora()`, la clave de cookies, `EnviadorDeCorreo`, la URL pública, `Registro`.

## 6. Criterios de aceptación

1. **Sin acceso a lo ajeno:** una cuenta no puede ver, ni dar órdenes en, una partida en la que no juega,
   aunque conozca su identificador (`404`), ni con la cookie de otra cuenta manipulada.
2. **Nada en claro:** en la base no hay ningún token ni contraseña, solo hashes (se recorre la base entera
   buscando el token); y el `Registro` no contiene tokens, enlaces ni correos.
3. **Sesiones que caducan y se revocan:** una sesión caduca a los 30 días exactos; `DELETE /sesion` y
   `cerrar-todas` la invalidan al instante; una revocada o caducada da `401`.
4. **Los tres ataques:** (a) **sesión ajena**: una cookie con la firma de otra, sin firma, con el token
   cambiado o firmada con otra clave no autentica; (b) **suplantación de participante**: un cliente que
   manda `jugador` o cambia cabeceras no se hace pasar por otro (el jugador sale de la cuenta); (c)
   **enlace usado**: usarlo dos veces, o pasados 15 minutos, da el mismo `401 enlace-invalido`; y con
   dos usos a la vez solo uno abre sesión.
5. **Enumeración:** la respuesta de `POST /cuentas/enlace` es idéntica (estado y cuerpo) para un correo
   con cuenta y otro sin ella; `POST /sesion` da el mismo error por token inexistente, usado o caducado.
6. **Límites:** 5 enlaces por hora y correo, 20 por hora y origen y 10 entradas por minuto y origen, con
   `429` y `retry-after`.
7. **Cookie:** `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/` y `Max-Age`; y las rutas que cambian algo
   exigen `content-type: application/json`.
8. **Borrado:** anonimiza, revoca las sesiones, deja el jugador vivo en sus partidas con `cuenta = NULL` y
   no toca las partidas; sin `confirmo: true` no hace nada.
9. **Migración 2:** se aplica, es idempotente y se revierte, sobre base vacía y con datos.
10. **De punta a punta por HTTP real:** pedir enlace → leer el correo en memoria → entrar → llamar a
    `GET /partidas/mias` con la cookie → cerrar sesión.
11. `npm run verificar` en verde.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/servidor
```

## 8. Al terminar

1. Índice: T-063 `hecha`.
2. `ESTADO.md`: siguiente tarea T-064; bitácora.
3. `docs/07-arquitectura.md` §7.4: cuentas, sesiones y decisiones (enlace mágico, sin argon2).
4. Commit: `T-063: cuentas, sesiones y seguridad`.

## 9. Dónde va

Ficha detallada el 25-09-2026. **Nada implementado todavía.** Orden: migración 2 y repositorio de cuentas;
tokens y servicio; rutas y autenticador; pruebas de los ataques y HTTP real.
