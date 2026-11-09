# T-091 · Cuentas con contraseña: registro, entrar, recordarme y restablecer

**Fase:** 4 · Cliente · **Depende de:** T-063, T-090 · **Estado:** en curso (abierta el 09-11-2026 a petición del
usuario)

## 1. Contexto

T-063 decidió entrar **solo con enlace mágico**. El usuario pide cuentas de las de siempre:
- registro;
- entrar con correo y contraseña;
- «recordarme»;
- «olvidé la contraseña»;
- todo desde el menú de la portada, con seguridad para que no le roben la cuenta.

Pide también quitar de la portada el bloque «Empieza a jugar»: al entrar se ve directamente «Mis partidas», con
unirse o convocar.

La decisión de T-063 se revisa así: **la contraseña se añade**, y el enlace mágico se queda como forma de
confirmar el correo y como alternativa para entrar.

## 2. Diseño de seguridad

- **Contraseñas con scrypt** (`node:crypto`, sin dependencias): N = 2^15, r = 8, p = 1, sal de 16 bytes y clave
  de 64. Se guarda `scrypt$15$8$1$<sal>$<hash>` en base64url y se compara en tiempo constante. La contraseña
  nunca se guarda ni se registra.
- **Política:** de 10 a 200 caracteres, distinta del correo y fuera de una lista corta de contraseñas comunes.
  El cliente enseña lo que falta antes de enviar.
- **Sin enumerar cuentas:**
  - registrarse con un correo que ya tiene contraseña responde lo mismo y manda a ese correo un aviso;
  - «olvidé la contraseña» responde lo mismo exista o no la cuenta;
  - entrar con un correo que no existe hace también una cuenta scrypt, para que el tiempo no lo delate;
  - el error de entrar es siempre «correo o contraseña incorrectos».
- **Confirmar el correo:** la cuenta nueva no puede entrar con contraseña hasta abrir el enlace que se le manda
  (el enlace mágico de T-063, que al usarse confirma el correo).
- **Fuerza bruta:**
  - límite por origen (10 intentos por minuto, como `entrar`);
  - **bloqueo por cuenta**: 5 fallos seguidos bloquean 15 minutos, aunque luego se acierte;
  - el acierto pone los fallos a cero.
- **Recordarme:**
  - con él, la sesión dura 30 días y la cookie lleva `Max-Age`;
  - sin él, la cookie es de sesión del navegador y el servidor la da por caducada a las 12 horas.

  La cookie sigue siendo `HttpOnly; Secure; SameSite=Lax` y va firmada (T-063).
- **Restablecer:**
  - token de 256 bits, del que solo se guarda el SHA-256;
  - dura 30 minutos y es de un solo uso, consumido de forma atómica;
  - al cambiar la contraseña se **revocan todas las sesiones**, se ponen los fallos a cero, se da el correo por
    confirmado y se abre una sesión nueva.

## 3. Qué se hace

1. **Migración 5:**
   - `cuenta` gana `clave`, `confirmada_en`, `fallos` y `bloqueada_hasta`;
   - tabla nueva `restablecimiento`, con hash, cuenta, creado, expira y usado.
2. **Servidor:**
   - `cuentas/contrasenyas.ts` (hash, verificación y política), con pruebas;
   - en el servicio: `registrar`, `entrarConClave`, `pedirRestablecimiento` y `restablecer`;
   - rutas `POST /cuentas/registro`, `POST /sesion/clave`, `POST /cuentas/olvido` y
     `POST /cuentas/restablecer`;
   - los correos llevan su motivo: entrar, confirmar, restablecer o aviso de registro repetido.
3. **Cliente:**
   - un menú arriba en la portada, con «Entrar» y «Crear cuenta»; al entrar, tu nombre y «Salir»;
   - un diálogo con los formularios «Entrar» (correo, contraseña, recordarme, ¿olvidaste la contraseña?, o
     entrar con un enlace), «Crear cuenta» (nombre, correo, contraseña dos veces, con su política a la vista) y
     «Restablecer» (`?restablecer=<token>`);
   - la portada pierde «Empieza a jugar» y lleva botones que abren el diálogo;
   - con sesión abierta se ve «Mis partidas», con unirse o convocar, y nunca la portada.

## 4. Criterios de aceptación

1. Probado:
   - una contraseña no se guarda en claro;
   - una correcta entra y una incorrecta no;
   - el hash no se repite entre dos cuentas con la misma contraseña.
2. Probado: registrarse con un correo ya registrado y pedir restablecer un correo inexistente dan la misma
   respuesta que el caso normal.
3. Probado: sin confirmar el correo no se entra con contraseña, y tras abrir el enlace sí.
4. Probado: cinco fallos bloquean la cuenta aunque el sexto intento sea correcto, y pasados 15 minutos se entra.
5. Probado: «recordarme» da cookie con `Max-Age` y sin él no; la sesión sin recordar caduca a las 12 horas.
6. Probado:
   - el enlace de restablecer vale una sola vez y caduca;
   - al restablecer, las sesiones anteriores dejan de valer;
   - la contraseña antigua ya no entra.
7. Con sesión abierta, la pantalla principal es «Mis partidas». `npm run verificar` en verde.
