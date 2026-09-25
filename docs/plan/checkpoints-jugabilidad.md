# Checkpoints de jugabilidad

**19-09-2026 · Decisión del usuario:** esperar a la interfaz para jugar. No priorizar ni construir
una consola. Se conserva el orden T-048 → T-049 → T-050 → T-051 → T-047 → T-060.
Los tests comprueban reglas; las sesiones humanas comprobarán comprensión, decisiones y ganas de
continuar. Los checkpoints no obligan a desarrollar una interfaz provisional.

## Qué se puede probar hoy

El [informe existente](../../herramientas/banco/informes/2026-09-19-1492.md) permite observar una
partida de robots. Para simular un año con el motor actual:

```bash
npm run banco -- --semilla prueba-jugabilidad --turnos 24 --repeticiones 1 --sin-ausencia --fecha exploracion-local
```

Produce informes en `herramientas/banco/informes/exploracion-local-prueba-jugabilidad.*` y estados
cada diez turnos. No sobrescribe la referencia 1492. Es una simulación automática, no permite
introducir órdenes humanas y conserva las limitaciones del arranque provisional del banco.
La maqueta solo permite valorar dirección artística.

**Desde T-082 (25-09-2026) se puede hacer J-01.** Preparación:

```bash
npm run partida:prueba -- tu@correo.es hortelanos   # o cualquier otra casa
npm run dev                                         # servidor y cliente
```

Abrir `http://localhost:5173`, escribir el correo, copiar el enlace que sale en la consola y abrir la
partida. El turno se resuelve con «Resolver el turno ya» (solo en partidas de prueba).

## Puntos de control

| Checkpoint | Cuándo | Sesión | Pregunta principal | Estado |
|---|---|---|---|---|
| J-01 · Entender y ordenar | Al terminar T-082, antes de continuar con T-083 | Usuario y facilitador, 20–30 minutos con una partida preparada | ¿Entiendo mis recursos y puedo elegir, enviar y cancelar una obra sin editar archivos? | **hecha la primera sesión (25-09-2026): no supera**; arreglos en T-088 y se repite |
| J-02 · El ciclo completo | Tras T-083, T-084 y T-085, antes de cerrar T-087 | Dos sesiones con casas distintas; al menos una comercial o trashumante; preparar seis turnos sin intervenir | ¿La crónica explica consecuencias, las casas cambian mis decisiones y puedo dejar un plan? | pendiente |
| J-03 · Jugar sin ayuda del autor | Tras T-086, antes de cerrar T-087 | Dos personas ajenas al desarrollo, 20–30 minutos cada una | ¿Pueden empezar, leer, dar órdenes y entender un resultado sin que alguien traduzca los controles? | pendiente |
| J-04 · Volver a una partida compartida | Tras T-103, antes de cerrar T-106 y empezar T-120 | Piloto con 3–4 personas durante varios días y horario de resolución acordado | ¿El comercio genera decisiones y apetece volver sin vigilar continuamente? | pendiente |

J-01 evalúa solo lo disponible: la crónica completa y el mercado llegan después. Puede usar una
partida preparada mediante las herramientas de desarrollo del servidor; no requiere adelantar
el alta de T-065 ni crear otra aplicación. Si no se puede completar el recorrido, se registra
el bloqueo, no se declara éxito por haber visto una pantalla.

J-02 puede empezar en un turno intermedio preparado para observar feria, invierno o trashumancia
sin jugar 200 turnos a mano. Declarar los recursos y ayudas iniciales. En J-04 se observa el ritmo
real: resolver cien turnos seguidos en una tarde no sustituye varios días de partida.

## Protocolo de sesión

1. Registrar revisión, escenario, casa, turno inicial y duración. Guardar la reproducción de
   diagnóstico aparte de la pantalla del jugador; no revelar la semilla ni información oculta.
2. Dar un objetivo breve y explicar controles. No revelar la opción óptima. Anotar cuándo el
   facilitador debe traducir una regla, un bloqueo o un resultado.
3. Antes de una decisión relevante, preguntar qué pretende conseguir y qué alternativa descarta;
   después, preguntar qué ocurrió y por qué. Registrar palabras y turno, no solo una puntuación.
4. En J-02 buscar al menos dos decisiones con coste de oportunidad: reservar pan o invertir,
   transportar material o venderlo, explorar o sostener presencia. Una opción imposible o siempre
   inferior no demuestra una elección interesante.
5. Preguntar qué haría después y si quiere continuar. Distinguir comprensión, disfrute, tedio,
   espera y trabajo repetitivo. La ausencia se contrasta también con las pruebas de T-051.
6. Guardar acta en `docs/plan/pruebas-jugabilidad/J-0x-fecha.md`. Un asistente puede resumir una
   sesión real, pero no inventar participantes, observaciones ni valoraciones humanas.

## Acta y decisión

El acta lleva participantes por alias, versión/escenario, duración/turnos, expectativas y
resultados, bloqueos concretos, intervenciones del facilitador y deseo de continuar. Referenciar
la reproducción sin versionar datos personales. Terminar con una decisión:

- **Continuar:** se entiende el recorrido y no hay bloqueos observados que impidan jugarlo.
- **Corregir y repetir:** elegir como máximo tres problemas prioritarios con evidencia, tipo
  (regla, equilibrio, interfaz o herramienta) y ficha responsable; repetir el recorrido afectado.
- **Inconcluso:** faltaron recorrido, participantes o evidencia. Sigue pendiente.

Una muestra pequeña detecta fallos concretos; no garantiza éxito comercial. No abrir nuevas
mecánicas para tapar falta de claridad. Los resultados negativos se conservan y no se sustituyen
por un contador de tests en verde.

## Cómo encaja en el plan

Son revisiones humanas, no dependencias circulares de código. T-082 puede cerrar su implementación,
pero deja J-01 pendiente hasta la sesión del usuario. J-02 y J-03 forman parte del cierre de T-087;
J-04, del cierre de T-106. No dar un checkpoint por realizado sin acta real. Si hay que esperar
participantes, dejarlo explícito en ESTADO, sin inventar aprobación ni construir una consola.

T-047 sigue siendo una validación técnica y de equilibrio por banco; su cierre **no certifica
jugabilidad humana**. Las sesiones posteriores pueden reabrir ajustes con evidencia. El usuario
acepta esperar al cliente para esa primera prueba.


## J-01 · Primera sesión (25-09-2026)

**Quién:** el usuario, con la partida de prueba `p-06e17876b00c` (hortelanos en la Llanada Alavesa), en
escritorio y en el modo móvil de las herramientas del navegador; y, aparte, otra IA que intentó el
recorrido en un navegador y revisó el código.

**Resultado: no supera.** Entender los recursos, sí («el punto 1 está claro»). Elegir y enviar una obra,
con dificultad. Saber qué ha pasado al resolver, no.

**Hallazgos, por gravedad:**

1. **En escritorio, pinchar la capital en el mapa no abre nada**; en el modo móvil sí. Causa comprobada:
   `setPointerCapture` en cada `pointerdown` hace que, con ratón, el `click` llegue al `<svg>` y no a la comarca.
   Tampoco hay nada que diga que el mapa se puede pinchar (cursor, resalte, comarca seleccionada).
2. **Al resolver el turno no se sabe qué ha pasado.** El usuario pide un resumen emergente con lo ocurrido y el
   aumento o la bajada de cada recurso, para saber si crece. La crónica existe en el servidor y
   `ClienteApi.cronica` también, pero nadie la llama.
3. **La ficha aparece abajo del todo**, bajo un mapa de 60vh, y el árbol entero se reconstruye en cada cambio
   (se pierde el desplazamiento). «Cerrar» está en mal sitio.
4. **La entrada calla los errores**: un enlace usado o caducado devuelve al formulario sin decir nada (el error se
   guarda pero esa pantalla no lo pinta). Sin `<form>` (Enter no envía, no hay validación), sin etiqueta, sin foco,
   el botón no se deshabilita y el campo es tan pequeño que iOS hace zoom.
5. **Poco amigable en general**: estilos por defecto, recursos como texto plano, tipos y estados de orden con sus
   identificadores internos (y un «¿?» posible), potenciales sin traducir, colores sin leyenda y el conmutador de
   modos sin explicar.

**Lo que se hace:** tarea [T-088](T-088-arreglos-de-j01.md) antes de T-083; después se repite J-01.

## J-01 · Segunda sesión (25-09-2026, en curso)

**Quién:** el usuario, con la misma partida, en escritorio, tras los arreglos de T-088.

Pinchar el mapa, la ficha en el panel lateral y el resumen del turno ya funcionan. (El mapa se vio negro una vez:
Vite había leído `atlas.css` vacío mientras se reescribía; no es un fallo del juego y se arregla recargando.)

**Hallazgos nuevos:**

6. **No se sabe cómo ganar una comarca vecina.** El usuario pregunta si tiene que «evolucionar la capital
   primero». La regla es la influencia (docs/06 §6.2), pero nada en la interfaz lo explica.
7. **La influencia no se ve.** Solo se enseña en las comarcas **exploradas**; al empezar, todas las vecinas se
   conocen **de oídas**, así que no sale en ningún sitio, aunque la regla dice que se acumula también en las
   oídas. La ficha de una comarca oída dice solo «de esta comarca solo conoces el nombre».
8. **Hoy no hay forma práctica de expandirse.** Ser vecina (+1) y no tener presencia (−1) se anulan; solo quedan
   los regalos (+5 cada 4 turnos), que son unos 48 turnos hasta 60. Presencia y exploración necesitan recuas, y
   moverlas no tiene interfaz hasta T-083.
9. **La crónica deja un hueco sin rellenar**: «El rebaño de Llanada Alavesa no encuentra pasto en {comarca}»
   (el suceso `rebanyo.sin-pasto` no lleva la comarca).
10. **«Qué hacer: ruta»**: la acción sugerida de la crónica sale con su identificador interno.
11. **Avisos sin salida**: el rebaño pierde cabezas cada turno sin pasto y el jugador no puede moverlo (T-083).
12. **En la ficha se mezclan lo que se puede y lo que no**: mejor arriba lo posible y debajo lo bloqueado.
13. **Costó encontrar los recursos**: estaban dentro del panel, debajo de la ficha.

**Lo que se hace:** 12 y 13 se arreglan en el acto (T-088 §2, punto 10); 7, 9, 10 y la explicación de 6 entran
en T-088 (§2, puntos 6 a 9); 8 y 11 en T-083, que
además pasa a ser la tarea que hace jugable la expansión.
