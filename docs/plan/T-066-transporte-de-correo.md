# T-066 · Transporte de correo real

**Fase:** 3 · Servidor · **Depende de:** T-064 · **Estado:** en curso: todo hecho salvo la prueba con un
buzón real, que necesita una cuenta de correo y un dominio del usuario

## 1. Contexto

T-063 y T-064 dejaron el correo tras la interfaz `EnviadorDeCorreo` (`enviarEnlace`, `enviarAviso`), con una
implementación en memoria y otra por consola. Todo lo demás estaba hecho y probado: qué se manda, cuándo, una
sola vez, reintentos y preferencias. Faltaba el transporte real.

## 2. Decisiones

- **SMTP escrito a mano con `node:net` y `node:tls`**, sin dependencias ni proveedor con API propia:
  - sirve con cualquier proveedor (el del dominio, uno gratuito para empezar o uno de pago después);
  - no ata el despliegue a nadie;
  - la superficie es pequeña: una conexión por mensaje, EHLO, STARTTLS o TLS directo, AUTH PLAIN, MAIL,
    RCPT, DATA y QUIT.
- **Texto plano en UTF-8**, con el cuerpo en base64 (sin problemas de acentos ni de líneas que empiezan por
  punto) y el asunto en RFC 2047.
- **Un fallo lanza `ErrorDeSmtp`**, con el código SMTP si lo hubo y sin la clave ni el contenido: el
  despachador de T-064 reintenta.
- **Sin cifrar, solo contra la propia máquina** (las pruebas): la clave nunca viaja en claro por la red.
- **La configuración, del entorno** (`configuracion-de-correo.ts`): con `SMTP_HOST`, SMTP; sin él, la consola
  en desarrollo. En producción no arranca sin SMTP. El registro dice el servidor, el puerto y la seguridad,
  nunca las credenciales.
- **Los textos de cada correo** (`textos-de-correo.ts`): entrar, confirmar, restablecer y ya registrado,
  cada uno con su asunto, para qué es, cuánto dura el enlace y qué hacer si no lo pediste.
- **La baja de los avisos:**
  - cabecera `List-Unsubscribe` y un pie que dice dónde se cambian;
  - se cambian en la partida, en «Tu casa» → «Avisos por correo» (cada turno, uno al día o ninguno). Esa
    pantalla no existía, aunque el servidor ya tenía la ruta desde T-064: se añadió aquí;
  - la baja en un clic sin entrar (RFC 8058) necesita un enlace firmado por jugador; queda para cuando el
    volumen de avisos lo pida (docs/07 §7.8.1).
- **SPF, DKIM y DMARC** son registros DNS del dominio que da el proveedor: documentados en docs/07 §7.8.1.

## 3. Criterios de aceptación

1. Un aviso y un enlace llegan a una bandeja real en el entorno de preproducción. **10-11-2026:** desplegado con
   Brevo; el primer enlace salió de https://conquerspain.com hacia el buzón del usuario y Brevo lo aceptó.
   Falta que el usuario confirme que llegó (y no a spam). Antes decía: **Pendiente del usuario:**
   hace falta una cuenta SMTP y un dominio (o la cuenta de un proveedor gratuito). Con `SMTP_HOST`,
   `SMTP_USUARIO`, `SMTP_CLAVE` y `CORREO_REMITENTE` en el entorno, se lanza `npm run servidor` y se pide un
   enlace desde la portada.
2. Un fallo del servidor de correo deja el aviso pendiente y se reintenta: lo prueba T-064, y `smtp.test.ts`
   prueba que el transporte lanza ante un 550 y ante un servidor que no contesta. ✔
3. Ningún secreto en el repositorio ni en los registros: las credenciales solo en el entorno; las pruebas
   comprueban que la clave no sale en los errores ni en la descripción del registro. ✔

## 4. Verificación

`npm run verificar`. `smtp.test.ts` habla con un servidor SMTP falso local, con STARTTLS y con TLS directo
(certificado autofirmado de prueba, solo para `localhost`); `configuracion-de-correo.test.ts` prueba la
elección del transporte; y en el navegador se probó «Tu casa» → «Avisos por correo».
