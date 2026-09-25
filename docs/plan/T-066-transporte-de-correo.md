# T-066 · Transporte de correo real

**Fase:** 3 · Servidor · **Depende de:** T-064 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea.**

## 1. Contexto

T-063 y T-064 dejaron el correo tras la interfaz `EnviadorDeCorreo` (`enviarEnlace`, `enviarAviso`),
con una implementación en memoria. Todo lo demás —qué se manda, cuándo, una sola vez, reintentos,
preferencias— está hecho y probado. Falta el transporte real, que depende de decisiones de despliegue
(proveedor, dominio, credenciales) y que no se escribió a mano en T-064 por ser mucha superficie.

## 2. Objetivo

Una implementación de `EnviadorDeCorreo` que entregue de verdad, con su configuración y sus pruebas.

## 4. Puntos que hay que resolver al detallar

- SMTP con STARTTLS/TLS (a mano con `node:net`/`node:tls`, o una dependencia pequeña y auditada)
  frente a la API HTTP de un proveedor. Decidir con el despliegue.
- SPF, DKIM y DMARC del dominio remitente; dirección de respuesta; baja en un clic en los avisos.
- Que un fallo del transporte lance, para que el despachador de T-064 reintente.
- Secretos fuera del repositorio; `CorreoEnMemoria` sigue en desarrollo y pruebas.

## 5. Criterios de aceptación provisionales

1. Un aviso y un enlace llegan a una bandeja real en el entorno de preproducción.
2. Un fallo del servidor de correo deja el aviso pendiente y se reintenta (lo prueba T-064).
3. Ningún secreto en el repositorio ni en los registros.
