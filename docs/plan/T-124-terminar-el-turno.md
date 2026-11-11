# T-124 · Terminar el turno

**Fase:** 7 · Tras jugar de verdad · **Depende de:** T-061 · **Estado:** **hecha (11-11-2026)**

> Petición del usuario (11-11-2026): «para agilizar una partida, que los jugadores puedan marcar que han
> finalizado el turno; cuando todos lo hayan marcado, se avanza. Se sigue avanzando solo con la
> periodicidad marcada, pero esa periodicidad se reinicia cada vez que se avanza un turno».

## 1. Contexto

El reloj (T-061) resolvía cada turno a una hora anclada en la fundación (`ancla + N·intervalo`), y solo
quien administra podía adelantarlo (T-090). En una partida de amigos con un turno al día, si todos han
mandado sus órdenes a media mañana, nadie quiere esperar a la noche. Es el «todos han mandado su turno» de
VGA Planets.

No choca con la regla 4 de CLAUDE.md (nada premia estar conectado): terminar el turno no da ventaja
ninguna, solo acorta la espera, y quien no lo marca no pierde nada: el turno se resuelve a su hora igual.

## 2. Diseño

### 2.1 Persistencia

Migración 8, tabla `turno_terminado (partida, turno, jugador, marcado_en)`, clave `(partida, turno,
jugador)`. `marcarTurnoTerminado(id, jugador, turno, terminado, ahora)` comprueba **dentro de la
transacción** que la partida sigue en ese turno (si no, `turno-cerrado`) y añade (idempotente) o borra la
fila. `turnoTerminadoPor(id, turno)` da los jugadores, en orden de identificador. Las filas de turnos ya
resueltos se quedan como historia; el turno nuevo empieza sin ninguna.

### 2.2 Quién cuenta

`finDeTurno(repo, id)` (`servidor/src/reloj/fin-de-turno.ts`): los participantes **con cuenta** y **ya dados
de alta en el estado**. Quien acaba de pedir entrar (T-107) aún no tiene casa que mandar, y las plazas sin
cuenta (herramientas) no pueden pulsar nada: ninguno de los dos frena. `todos` exige al menos uno.

### 2.3 El plazo se reinicia en cada avance

`vencimientoDesde(desde, intervalo) = desde + intervalo` sustituye al calendario anclado. El primer turno
vence un intervalo después de fundar; cada turno siguiente, un intervalo después de resolverse el anterior,
**sea cual sea la causa**: a su hora, porque todos terminaron o porque lo avanzó quien administra. Así
nadie recibe un turno recortado.

Consecuencia buscada: tras una caída del servidor ya no se encadenan turnos atrasados que nadie ha podido
jugar; el atrasado se resuelve al despertar y el siguiente tiene su plazo entero. Desaparecen
`maximoDeTurnosPorPasada`, `porPartida` y `turnosDebidos`, que solo servían a la cadena. La columna
`ancla` se conserva como fecha de fundación.

### 2.4 API y reloj

- `PUT /partidas/:id/fin-de-turno` con `{"terminado": true|false}`. Errores: `cuerpo-invalido` si no es un
  booleano, `partida-detenida` si la partida no está activa, `turno-cerrado` si el turno se resolvió entre
  medias, `entrada-en-espera` si quien llama aún no ha entrado. Responde `{resultado, finDeTurno}`.
- Tras marcar, publica `fin-de-turno` en el canal y, si se ha marcado (no al reabrir), llama a
  `alTerminarElTurno(id)` → `Reloj.resolverSiTodosHanTerminado(id)`, que respeta el cerrojo por partida del
  reloj y resuelve con `ignorarHora` solo si `todos`.
- `GET /partidas/:id/estado` añade `finDeTurno: [{jugador, nombre, terminado}]`.
- El flujo SSE manda `event: fin-de-turno` con `{turno, quienes}` a cada conexión.

### 2.5 Cliente

- `resumenDelFinDeTurno(quienes, yo)` (`cliente/src/fin-de-turno.ts`, puro): cuántos han terminado, a quién
  se espera («Faltan: Luis y Eva») y qué pasará al pulsar («Eres el último: se resuelve ahora»).
- Botón compacto «✓ He terminado el turno» / «↺ Reabrir» en la cabecera, con el contador «2/3 listos», y el
  bloque completo al principio de la bandeja de órdenes. No aparece en partidas terminadas, detenidas o
  sin conexión.
- `Almacen.terminarTurno` manda antes lo que quede en la bandeja (terminar con órdenes sin enviar sería
  perderlas) y, si el turno se ha resuelto, trae el nuevo con su resumen. `alFinDeTurno` pone al día la
  lista al llegar el evento.
- Tras terminar se pueden seguir dando órdenes: entran igual en el turno.

## 3. Archivos

Nuevos: `servidor/herramientas/partida-de-muestra.ts`, `servidor/src/persistencia/migraciones/0008-fin-de-turno.ts`, `servidor/src/reloj/fin-de-turno.ts`
(+ test), `cliente/src/fin-de-turno.ts` (+ test). Tocados: `persistencia/{repositorio,sqlite}.ts`,
`reloj/{calendario,reloj,resolucion}.ts` y sus pruebas, `avisos/canal.ts`, `api/manejadores.ts`,
`altas/servicio.ts`, `principal.ts`, `cliente/src/{api,almacen,eventos,main}.ts`,
`pantallas/partida.ts`, `estilo.css`, `docs/07-arquitectura.md`.

## 4. Criterios de aceptación

1. Un jugador marca y desmarca su turno; marcar dos veces no cuenta doble. ✔
2. Cuando todos los que juegan lo han marcado, el turno se resuelve en el acto. ✔
3. El turno siguiente vence un intervalo después de ese avance; lo mismo tras el avance del administrador
   y tras resolverse a su hora con retraso. ✔
4. Quien entra con la partida empezada y aún espera, o una plaza sin cuenta, no frena. ✔
5. Los demás ven en vivo quién ha terminado. ✔
6. Una marca de un turno ya resuelto se rechaza sin guardar. ✔

## 5. Verificación

`npm run verificar`, con `servidor/src/reloj/fin-de-turno.test.ts`, `reloj.test.ts` (plazo desde el último
avance, caída sin cadena, avance manual que reinicia), `calendario.test.ts`, `migraciones.test.ts` y
`cliente/src/fin-de-turno.test.ts`. Probado en el navegador con dos cuentas sobre la partida de
`npm run partida:muestra` (herramienta nueva de esta tarea: varias cuentas con contraseña en una base
aparte): Ana termina, Bruno ve al momento «solo faltas tú», termina, y el turno se resuelve para los dos.
