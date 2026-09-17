# Para cualquier IA que trabaje en este repositorio

Este proyecto está pensado para poder continuarse con **cualquier** asistente (Claude Code, Codex,
Cursor, Gemini, Copilot…) sin perder el hilo. No hace falta contexto previo: está todo escrito.

## Empieza aquí, en este orden

1. **[CLAUDE.md](CLAUDE.md)** — el contrato de trabajo: protocolo, idioma, estructura y reglas
   técnicas que no se negocian. Aplica a todas las IAs, no solo a Claude.
2. **[ESTADO.md](ESTADO.md)** — dónde estamos ahora mismo: tarea en curso, siguiente tarea, bitácora.
3. **La ficha de la tarea** que toque, en [docs/plan/](docs/plan/).
4. Los **documentos de diseño** que esa ficha cite, en [docs/](docs/).

## Qué es el proyecto en una frase

Juego de estrategia por turnos en la península ibérica preindustrial, de espíritu VGA Planets: se
preparan órdenes, un servidor las resuelve a su hora para todos a la vez, y gana la estrategia, no
el tiempo delante de la pantalla.

## Las cinco cosas que más se rompen sin querer

1. **El núcleo tiene que ser puro y determinista.** Nada de `Date`, `Math.random`, `fs` ni coma
   flotante dentro de `paquetes/nucleo`.
2. **Una tarea se termina antes de empezar otra.** Si te quedas sin margen, deja `ESTADO.md` con el
   apartado «Dónde va» y un commit `T-0xx (en curso)`.
3. **Los números de equilibrio van en tablas de datos**, nunca dentro de la lógica.
4. **Todo en español**, incluidos los identificadores del dominio; el glosario
   ([docs/09-glosario.md](docs/09-glosario.md)) manda.
5. **Ninguna mecánica puede premiar conectarse más veces.** Es el principio fundacional del juego.

## Verificación

Antes de dar por cerrada cualquier tarea:

```bash
npm run verificar     # tipos + lint + tests unitarios + tests de reproducción
```

Y se repasan uno a uno los criterios de aceptación de la ficha. Si alguno no se cumple, la tarea
sigue abierta.
