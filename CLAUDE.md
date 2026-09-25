# ConquerSpain — cómo se trabaja en este repositorio

Juego de estrategia por turnos ambientado en la península ibérica preindustrial, de espíritu
VGA Planets: se preparan órdenes con calma, un servidor las resuelve a su hora para todos a la
vez, y gana la estrategia, nunca el tiempo delante de la pantalla.

Este archivo es el contrato de trabajo. Si eres una IA (Claude Code, Codex, Cursor, Gemini o
cualquier otra) y acabas de llegar, lee esto entero y después [ESTADO.md](ESTADO.md).

---

## 1. Cómo continuar el trabajo (protocolo obligatorio)

1. Lee [ESTADO.md](ESTADO.md). Ahí está **la tarea en curso** y **la siguiente**.
2. Abre la ficha de esa tarea en [docs/plan/](docs/plan/). Cada ficha es autosuficiente:
   contexto, diseño detallado, archivos a tocar, criterios de aceptación y verificación.
3. Lee los documentos de diseño que la ficha referencie. No inventes reglas que ya están escritas.
4. Implementa **la tarea completa**. No se empieza otra sin terminar la anterior.
5. Verifica con los comandos que indica la ficha. Si algo falla, se arregla antes de cerrar.
6. Cierra la tarea:
   - marca la tarea como terminada en [docs/plan/00-indice.md](docs/plan/00-indice.md);
   - actualiza [ESTADO.md](ESTADO.md) (tarea en curso, siguiente, bitácora con fecha);
   - si el diseño ha cambiado durante el trabajo, actualiza el documento de diseño afectado;
   - deja el repositorio limpio: sin código muerto, sin ficheros a medias, sin `TODO` sueltos.
7. Haz un commit con el formato `T-0xx: resumen en una línea` y **súbelo** (`git push`): el
   remoto es la memoria compartida, y cualquier otra sesión u otra IA retoma desde ahí.

**Nunca** dejes una tarea a medias para empezar otra. **Nunca** cierres una tarea cuyos criterios
de aceptación no se cumplan de verdad: si no da tiempo, deja la tarea abierta y anota en ESTADO.md
exactamente por dónde va, con los archivos tocados y lo que falta, y haz commit y push igualmente.

Regla de oro del proyecto: **preferimos tardar y que quede perfecto**. No se aceptan atajos que
haya que rehacer después; si un atajo es inevitable, se documenta en la ficha de la tarea y se crea
una tarea nueva para eliminarlo.

## 2. Idioma y nomenclatura

- Todo se escribe en **español**: documentación, comentarios, mensajes de commit, textos de la
  interfaz y los identificadores del dominio.
- Los conceptos del juego se nombran en español y se escriben igual en todas partes:
  `comarca`, `recua`, `fuero`, `feria`, `cañada`, `bastimento`, `maravedí`, `concejo`, `puebla`.
  El glosario manda: [docs/09-glosario.md](docs/09-glosario.md).
- Los tecnicismos de programación se quedan como se escriben normalmente (`id`, `hash`, `commit`,
  `snapshot`, `seed` cuando es de una biblioteca externa). En el dominio, `semilla`.
- Sin tildes ni eñes en nombres de archivo ni en claves de datos; sí en todo el texto visible.

## 3. Estructura del repositorio

```
ConquerSpain/
├─ CLAUDE.md               este contrato
├─ AGENTS.md               puntero para otras IAs
├─ ESTADO.md               estado vivo del proyecto: qué está hecho y qué toca ahora
├─ docs/                   diseño del juego y plan de trabajo
│  ├─ 01-vision.md .. 09-glosario.md
│  └─ plan/                índice de tareas y una ficha por tarea (T-0xx-*.md)
├─ paquetes/
│  ├─ nucleo/              motor de reglas: puro, determinista, sin E/S ni navegador
│  ├─ mundo/               datos del mundo (comarcas, caminos, patrimonio) y su cargador
│  ├─ servidor/            autoridad: persistencia, reloj de turnos, API
│  └─ cliente/             interfaz de juego (atlas, panel de órdenes, crónica)
├─ herramientas/
│  ├─ atlas/               generación del mapa desde fuentes abiertas (Natural Earth)
│  └─ banco/               banco de pruebas: robots por casa, partidas automáticas e informes
└─ maqueta/                maqueta visual v0.1, congelada como referencia de dirección de arte
```

`maqueta/` no se sigue desarrollando: es la prueba de dirección artística del 17-09-2026 y se
conserva como referencia. La interfaz definitiva se construye en `paquetes/cliente/`.

## 4. Reglas técnicas que no se negocian

1. **El núcleo es puro y determinista.** `paquetes/nucleo` no importa `fs`, `window`, `Date.now()`
   ni `Math.random()`. El tiempo y el azar entran como parámetros. Resolver el mismo turno con el
   mismo estado, las mismas órdenes y la misma semilla da exactamente el mismo resultado, byte a
   byte, en cualquier máquina.
2. **El servidor es la única autoridad.** El cliente puede calcular previsiones con el mismo
   núcleo, pero jamás decide el resultado de un turno.
3. **La resolución es simultánea y por fases fijas**, documentadas en
   [docs/02-diseno-nucleo.md](docs/02-diseno-nucleo.md). El orden de los jugadores dentro de una
   fase nunca puede alterar el resultado; los empates se resuelven con reglas explícitas y
   deterministas, nunca por orden de llegada de las órdenes.
4. **Ninguna mecánica puede premiar conectarse más veces.** Si una idea de diseño da ventaja a
   quien está más rato delante, se rechaza o se reformula con órdenes permanentes.
5. **TypeScript estricto.** `strict: true`, sin `any` implícitos ni `as` para tapar agujeros.
6. **Todo cambio de reglas lleva test.** El motor se prueba con casos concretos y con partidas de
   regresión completas (misma entrada, misma salida esperada).
7. **Los datos del mundo se generan con un script reproducible**, nunca a mano en el código.

## 5. Comandos

Node 22 (ver `.nvmrc`) y npm. Espacio de trabajo con npm workspaces.

```bash
npm install            # instala el espacio de trabajo entero
npm run verificar      # tipos + lint + formato + tests: lo que debe pasar para cerrar una tarea
npm run tipos          # tsc --build (solo declaraciones; el codigo se ejecuta desde las fuentes)
npm run lint           # ESLint, incluida la guarda de pureza del nucleo
npm run formato        # Prettier en modo comprobacion (formato:escribir para arreglar)
npm test               # Vitest sobre paquetes/ y herramientas/
npm run cobertura      # Vitest con cobertura (umbral informativo)
npm run partidas       # Recalcula las huellas de las partidas de reproduccion (escribe con --confirmo)
npm run banco          # Banco de pruebas: partidas automaticas con un robot por casa e informe
npm run banco:comparar # Compara dos informes del banco (sus .csv)
npm run atlas          # Genera paquetes/mundo/datos/mundo.v1.json desde el catalogo
npm run atlas:comprobar # Comprueba que el mundo generado sigue siendo el mismo (va en verificar)
npm run dev            # Servidor (puerto 8471, base desarrollo.sqlite) y cliente con Vite (5173)
npm run servidor       # Solo el servidor (PUERTO, BASE_DE_DATOS, CLAVE_DE_COOKIES, URL_PUBLICA)
npm run cliente:tamano # Construye el cliente y comprueba su peso (<= 150 KB gzip; va en verificar)
npm run partida:prueba -- correo [casa] # Deja lista una partida de prueba en la base de desarrollo
```

En desarrollo el correo va a la consola: el enlace para entrar sale en la salida de `npm run dev`.

Notas del montaje:

- Se emiten **solo declaraciones** (`emitDeclarationOnly`): el código se ejecuta siempre desde las
  fuentes, con Vitest, `tsx` o Vite. Por eso los imports relativos llevan su extensión real `.ts`.
- TypeScript 6 deprecó `baseUrl`; los alias `@conquer/*` se resuelven con `paths` relativos a
  `tsconfig.base.json`.
- `paquetes/nucleo/tsconfig.json` declara `"types": []`: si alguien escribe `process` en el núcleo,
  no compila. Sus pruebas viven aparte, en `tsconfig.pruebas.json`, y esas sí ven Node.

## 6. Estilo de código

- Módulos pequeños con una responsabilidad clara; funciones que caben en una pantalla.
- Tipos explícitos en los límites de los módulos; nada de estructuras anónimas compartidas.
- Comentarios solo donde explican un *porqué* (una regla histórica, una decisión de equilibrio),
  nunca para narrar lo que el código ya dice.
- Números de equilibrio en tablas de datos, nunca esparcidos por la lógica.
- Errores con mensaje en español que explique qué pasó y cómo arreglarlo.

## 7. Qué hace bueno a este juego (resumen para no perder el norte)

- Se juega leyendo la crónica del turno y preparando órdenes; la partida avanza sola a su hora.
- La geografía real manda: dónde hay sal, hierro, lana, pastos o piedra decide tu estrategia.
- Cada casa de oficio juega a un juego distinto, no a lo mismo con un bonus.
- Expandirse cuesta administración y lealtad: el líder no se dispara solo.
- La competición empieza por la economía, la influencia y los caminos; el conflicto llega después.
- Guiños históricos de verdad (la Mesta, las ferias de Medina, las salinas de Añana, las ferrerías
  vizcaínas, los fueros y las cartas pueblas), usados como mecánica y no como decorado.
