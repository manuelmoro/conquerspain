# T-131 · Unirse sin tropiezos: códigos legibles, errores a la vista y quien entra tarde

**Fase:** 7 · Tras jugar de verdad · **Depende de:** T-125 · **Estado:** **hecha (11-11-2026)**

> Avisos del usuario (11-11-2026), en una partida real: «no pueden unirse con el código en un iPhone con
> Safari»; «mi amigo no puede dar al botón Abrir de la partida: se ha unido más tarde, con la partida ya
> iniciada»; y «no me queda claro si puedo empezar ya la partida o tengo que esperar a que estén todos».

## 1. Lo que pasaba

Probado con WebKit 26 (el motor de Safari) en un iPhone emulado: el flujo de unirse funciona y el juego no
usa nada que Safari no tenga desde iOS 15.4. Los fallos eran otros, y no solo del iPhone:

1. **El error se borraba solo.** Tras cualquier acción de «Mis partidas» (unirse, convocar, sortear) la
   lista se recargaba y ponía `error = null`: el «ese código no es de ninguna partida» desaparecía a los
   pocos milisegundos. Con un código mal escrito, no pasaba nada visible.
2. **El código escrito se borraba** al elegir casa (la pantalla se repinta entera), y «Unirme» con el campo
   obligatorio vacío solo avisaba arriba del todo, fuera de la pantalla del móvil.
3. **Los códigos eran fáciles de copiar mal**: `G_VuKtIFiG91cfUpVB48vA` mezcla I, l y 1, O y 0, mayúsculas y
   minúsculas, y el teclado de iOS podía autocorregirlo.
4. **Quien entra tarde** (T-107) aparecía en «Mis partidas» con «Abrir», pero hasta resolverse el turno no
   tiene casa: el servidor contestaba `entrada-en-espera`, el cliente lo anotaba como error y la lista no
   enseñaba los errores del almacén. El botón no hacía nada.
5. **Cerrar la lista** no decía qué pasaba con quien aún no había llegado.

## 2. Diseño

### 2.1 Códigos legibles (`servidor/src/altas/codigos.ts`)

Los nuevos son 12 símbolos del alfabeto de Crockford (sin I, L, O ni U), 60 bits, guardados sin guiones y
mostrados en tres grupos («K7QD-3MX9-P2RT», `codigoLegible` en el cliente, con letra de ancho fijo). Al
buscar (`convocatoriaDelCodigo`, que usan unirse, entrar e invitación) se prueba primero tal cual —los
códigos antiguos siguen valiendo— y luego normalizado: sin espacios ni guiones, en mayúsculas, O→0, I/L→1,
U→V.

### 2.2 El formulario de unirse

El código escrito vive en el estado de la pantalla y sobrevive a las repintadas. El campo no tiene
autocorrección, mayúsculas automáticas ni sugerencias, y recuerda que es mejor el enlace. El error sale
junto al botón (no arriba), el botón dice «Uniéndote…» mientras espera, y un código vacío avisa con
palabras. La recarga de la lista ya no borra el error de la acción que la provocó.

### 2.3 Quien entra tarde

- `GET /partidas/mias` dice `enEspera` de cada partida; la lista, en vez de «Abrir», explica «⏳ Entras en la
  partida al resolverse este turno (faltan…). Si no quieres esperar tanto, pide a quien la convocó que
  resuelva el turno ahora».
- `finDeTurno` y `GET /partidas/:id/estado` añaden `entrando` (nombre y casa, de su orden `entrar`): en la
  lista «n/m listos», «⏳ Espera a entrar: Carmen (Salineros…)», justo encima de «Resolver el turno ahora
  para todos».
- «Mis partidas» enseña también los errores del almacén (lo que falle al abrir una partida), con ✕.

### 2.4 ¿Hay que esperar a todos?

Bajo «Cerrar la lista y sortear los orígenes», si quedan plazas: no hace falta esperar; quien falte entra
luego con el mismo enlace, ya empezada, en una comarca libre y con veinte turnos de amparo; quien está dentro
elige entre tres orígenes, quien llega tarde entre lo que quede. Lo mismo en la guía, que además explica los
códigos nuevos y la espera de quien entra tarde. Los mensajes de error de las altas recuperan sus tildes.

## 3. Criterios de aceptación

1. Un código mal escrito se ve rechazado junto al botón, en el móvil. ✔
2. Elegir casa después de escribir el código no lo borra. ✔
3. Un código nuevo vale en minúsculas, con o sin guiones y con O/0 o I/1 confundidos; los antiguos siguen
   valiendo. ✔
4. Quien entra tarde sabe que espera y hasta cuándo; quien convocó sabe que alguien espera. ✔
5. Quien convoca sabe que puede cerrar la lista sin esperar a todos. ✔

## 4. Verificación

`npm run verificar`, con `altas/codigos.test.ts` e `invitacion.test.ts`. Probado con WebKit 26 en un
iPhone 13 emulado: código equivocado (error a la vista junto al botón), código en minúsculas con guiones y
cambio de casa (se une), entrada tardía (sin «Abrir», con la espera explicada) y, en el ordenador de quien
convocó, «Espera a entrar: Carmen (Salineros y almadraberos)».
