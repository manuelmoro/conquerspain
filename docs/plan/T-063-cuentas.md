# T-063 · Cuentas, sesiones y seguridad

**Fase:** 3 · Servidor · **Depende de:** T-062 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Para jugar partidas de meses hace falta identidad estable, y para multijugador, que nadie
pueda hacerse pasar por otro.

## 2. Objetivo

Alta de cuenta, inicio de sesión, sesiones seguras y control de acceso a partidas.

## 3. Alcance

**Entra:** registro, inicio de sesión (contraseña con argon2 o enlace mágico por correo), sesiones con cookie firmada, control de acceso, borrado de cuenta.

**No entra:** perfiles sociales, chat, amistades.

## 4. Puntos que hay que resolver al detallar

- Elegir entre contraseña y enlace mágico (propuesta: enlace mágico, menos fricción y menos riesgo).
- Datos personales al mínimo: correo y nombre visible. Nada más.
- Sesiones con caducidad y revocación; cookies `HttpOnly`, `SameSite=Lax`, `Secure`.
- Protección contra fuerza bruta y contra enumeración de correos.
- Borrado de cuenta: qué pasa con sus partidas en curso (propuesta: el dominio pasa a administración del concejo, T-105).

## 5. Criterios de aceptación provisionales

1. No se puede acceder a una partida en la que no se participa, ni siquiera conociendo su identificador.
2. Las contraseñas, si las hay, nunca se guardan en claro ni se registran en los registros.
3. Las sesiones caducan y se pueden revocar.
4. Hay test de los tres ataques básicos: sesión ajena, suplantación de participante y reenvío de enlace mágico usado.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-063: <resumen>`.
