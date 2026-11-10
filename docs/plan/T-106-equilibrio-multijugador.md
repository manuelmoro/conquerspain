# T-106 · Equilibrio multijugador y métricas de salud

**Fase:** 5 · Multijugador · **Depende de:** T-104 · **Estado:** **hecha (v1, con excepciones medidas), 10-11-2026**. La segunda ronda va en
[T-108](T-108-equilibrio-multijugador-v2.md).

## 1. Contexto

Segunda ronda de equilibrio, ahora con interacción entre jugadores (docs/06 §6.8 y
[T-047](T-047-equilibrio-v1.md)). Los checkpoints humanos (J-04) se omiten por decisión del usuario: el
equilibrio fino se hará con partidas de verdad.

## 2. La herramienta: `npm run banco:salud`

`herramientas/banco/src/salud.ts` juega cada semilla dos veces con las ocho casas:

- **diligentes:** todos los robots entran cada turno;
- **mezcladas:** cada casa entra cada 1, 2, 3 o 6 turnos, rotando por semilla. No pasa de seis porque
  el plan de temporada llega hasta seis turnos (docs/02 §2.5.4): más allá el juego no promete
  equivalencia, y medirlo castigaría algo que el diseño no ofrece.

**Las seis métricas** (`OBJETIVOS`), sobre las semillas 1492, 1212 y 1808 a 120 turnos:

| Métrica | Cómo se mide | Objetivo |
|---|---|---|
| Primero sobre la mediana | (máximo − mediana) / mediana del prestigio, en cada semilla | < 60 % |
| Casas en el podio | casas distintas entre los tres primeros de todas las semillas | ≥ 5 |
| Ninguna gana dos veces | ganador de cada semilla | ninguna repite |
| Conexiones y prestigio | Pearson entre las entradas de cada casa en la mezclada y su prestigio sobre el de la diligente | < 0,15 |
| Abandonos | casas que pasan a manos del concejo (T-105) antes del turno 60 | < 15 % |
| Deslealtad | comarcas perdidas por deslealtad sobre las que llegaron a tener dueño | > 0 y < 10 % |
| Turnos sin decisión | entradas del robot sin ninguna orden | < 10 % por casa |

## 3. Lo medido (10-11-2026)

| Métrica | Medido | |
|---|---|---|
| Primero sobre la mediana | 143 % · 153 % · 89 % | ✘ |
| Casas en el podio | 4 (canteros, hortelanos, monjes, salineros) | ✘ |
| Ninguna gana dos veces | hortelanos, canteros, canteros | ✘ |
| Conexiones y prestigio | 0,22 | ✘ |
| Abandonos | 0 % | ✔ |
| Deslealtad | 6,5 % | ✔ |
| Turnos sin decisión | mesta 32 %, salineros 33 % | ✘ |

**Por qué** (desglose del prestigio por capítulos, semillas 1492 y 1212):

- **Cuatro casas se quedan abajo** con una o dos comarcas a T120: ferrones (−12 a 171), salineros (36 a
  432), mercaderes (142 a 178) y, según la semilla, arrieros. Ni crecen en población ni en territorio, y
  la mercantil no cobra el capítulo de comercio (0 en todas las semillas): los robots no llegan a ferias
  destacadas.
- **Los hitos y sus primicias** (+50 al primero) separan a quien ya va delante: hortelanos y canteros
  suman 225–275 en hitos, ferrones y salineros 10–45.
- **Los turnos sin decisión** de la Mesta y los salineros son de sus robots, que entran y no tienen nada
  que mandar mientras los rebaños y las salinas trabajan solos.

**Ensayado y descartado:** bajar la primicia de 50 a 15. Comprime arriba (1492: de 143 % a 103 %) pero
también baja la mediana, y en 1212 y 1808 empeora (160 % y 106 %). Se deja en 50.

**Por qué no se sigue tocando cifras aquí.** Lo que falla no es una cifra, sino que cuatro vías no
despegan con los robots de ahora (lo mismo que T-047 dejó anotado para el juego en solitario) y que hay
casas que con robots no tienen decisiones. Cambiar números a ciegas desharía el equilibrio en solitario
sin arreglar la causa. **Atajo documentado:** T-106 entrega la medición, el diagnóstico y los dos criterios
que ya se cumplen; la segunda ronda, con robots que jueguen esas vías y con datos de partidas reales, va
en [T-108](T-108-equilibrio-multijugador-v2.md).

## 4. Criterios de aceptación

1. Las seis métricas de docs/06 §6.8 se miden con una orden y quedan en esta ficha. ✔ (se cumplen
   abandonos y deslealtad; el resto pasa a T-108)
2. Ninguna casa gana en más de una de las tres semillas. ✘ (canteros gana dos: T-108)
3. La correlación entre conexiones y prestigio, por debajo de 0,15. ✘ (0,22: T-108)

## 5. Verificación

`npm run verificar` (con `herramientas/banco/src/salud.test.ts`) y `npm run banco:salud` (unos 45 s).

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-106: <resumen>`.
