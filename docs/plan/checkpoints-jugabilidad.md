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
La maqueta solo permite valorar dirección artística. Cliente y servidor todavía no permiten
jugar; `npm run dev` se añadirá en T-080. No se anuncia ningún comando de juego local adicional.

## Puntos de control

| Checkpoint | Cuándo | Sesión | Pregunta principal | Estado |
|---|---|---|---|---|
| J-01 · Entender y ordenar | Al terminar T-082, antes de continuar con T-083 | Usuario y facilitador, 20–30 minutos con una partida preparada | ¿Entiendo mis recursos y puedo elegir, enviar y cancelar una obra sin editar archivos? | pendiente |
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
