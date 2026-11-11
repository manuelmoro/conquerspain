# T-125 · Invitar a una partida con un enlace

**Fase:** 7 · Tras jugar de verdad · **Depende de:** T-107 · **Estado:** **hecha (11-11-2026)**

> Petición del usuario (11-11-2026): «que sea sencillo invitar a otro jugador a que se sume a una partida
> ya iniciada».

## 1. Contexto

T-107 dejó la entrada en una partida empezada, pero solo con el código de la convocatoria: quien convocó
tenía que encontrarlo (solo se veía mientras la convocatoria estaba abierta), dictarlo, y el invitado tenía
que crear su cuenta, ir a «Unirme con un código», pegarlo, elegir casa a ciegas y, al fallar el alta
normal, ver las ofertas. Demasiados pasos.

## 2. Diseño

### 2.1 Servidor

- `GET /invitaciones/:codigo`, **pública** (quien abre el enlace puede no tener cuenta aún):
  `verInvitacion` (`servidor/src/altas/invitacion.ts`) da el nombre de la partida, quién la convocó, en qué
  momento está (`apuntandose`, `sorteando`, `empezada`, `cerrada`), el turno, el ritmo, las casas que ya
  juegan con cuántas veces, las **llenas** (dos veces) y las plazas libres (hasta doce en una empezada).
  Nada más: ni orígenes ni estado de nadie. Un código desconocido da `convocatoria-desconocida`.
- `GET /partidas/:id/estado` añade `codigoDeInvitacion`: el código, **solo para quien convocó** y solo
  mientras la partida está activa (`codigoParaInvitar`); para los demás, `null`. Se mantiene la decisión de
  T-065: las plazas las reparte quien convoca.
- Repositorio: `convocatoriaDePartida(partida)`.

### 2.2 El enlace

`https://…/?unirse=CÓDIGO` (`enlaceDeInvitacion`, `codigoDeLaDireccion` en `cliente/src/invitacion.ts`,
que solo acepta códigos `[A-Za-z0-9_-]{4,64}`). Al abrirlo, `main.ts` guarda el código en el navegador
(`conquer:invitacion`) y limpia la dirección: sobrevive a crear la cuenta, a confirmar el correo y al enlace
mágico, que vuelven a la portada.

### 2.3 Pantallas

- **Partida**, cabecera: «✉ Invitar» para quien convocó. Abre un diálogo con el enlace (se selecciona al
  enfocarlo), «Copiar el enlace», «Compartir…» donde el navegador lo permite (Web Share, en móviles) y el
  código por si alguien prefiere escribirlo.
- **Convocatoria abierta** (en «Mis partidas»): junto al código, «Copiar el enlace».
- **Portada sin sesión** con invitación pendiente: tarjeta «Ana te invita a «La Meseta en 1492»» con el
  ritmo, el turno, el amparo y las casas que juegan, y «Crea tu cuenta o entra: te llevamos a la partida».
- **Mis partidas** con invitación pendiente: va derecho a «Unirse», con el código puesto (sin campo), la
  tarjeta de la invitación y las casas llenas marcadas «ya la llevan dos» y sin botón. Si la partida ya
  empezó, «Unirme» enseña las ofertas de origen (T-107). Al entrar, o con «Volver», la invitación se olvida.

## 3. Archivos

Nuevos: `servidor/src/altas/invitacion.ts`, `cliente/src/invitacion.ts` (+ test),
`cliente/src/pantallas/invitacion.ts`. Tocados: `altas/{servicio,entrada}.ts`, `altas/altas.test.ts`,
`persistencia/{convocatorias,sqlite}.ts`, `api/manejadores.ts`, `cliente/src/{api,almacen,main}.ts`,
`pantallas/{entrar,partidas,partida}.ts`, `estilo.css`.

## 4. Criterios de aceptación

1. Quien convocó una partida empezada tiene un enlace para copiar o compartir desde la propia partida. ✔
2. Quien abre el enlace sin cuenta ve a qué partida le invitan y de quién. ✔
3. Tras entrar o crear la cuenta llega a «Unirse» con el código puesto y las casas llenas descartadas, y si
   la partida ya empezó, a las ofertas de origen. ✔
4. Solo quien convocó ve el código en la partida; en una partida terminada no hay invitación. ✔

## 5. Verificación

`npm run verificar`, con `altas.test.ts` («invitar con un enlace») y `cliente/src/invitacion.test.ts`.
Probado en el navegador sobre `npm run partida:muestra`: Ana copia el enlace; Carmen lo abre sin sesión, ve
la invitación, entra con su contraseña, cae en «Unirse», elige los Arrieros y una comarca, y la partida
aparece en su lista.
