# Banco de pruebas · semilla 1212

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Mesta** va en cabeza con 1156 de prestigio (262,1 % de la mediana) y **Ferrones** cierra la clasificación con 40 (9,1 % de la mediana). La mediana de prestigio es 441. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `e018560be2e83bf93a8c749551dcb2a78384dc24` |
| Etiqueta del informe | E-pasoCanyada25-1212 |
| Cambios experimentales | ganaderia.pasoCanyadaMil=2500 (ensayo T-047) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1212, 1212-2, 1212-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `01333521e848aaca6ba1afa8ca1daf858662cbcd385ddadb4d07c997abeb150f` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 43 filas sin cerrar de 157.

114 cumplen, 40 incumplen y 3 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1212 | arrieros | — | 82,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 304 sobre una mediana exacta de 367 |
| prestigio | casa y partida | 1212 | canteros | — | 117,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 430 sobre una mediana exacta de 367 |
| prestigio | casa y partida | 1212 | ferrones | — | -2,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -9 sobre una mediana exacta de 367 |
| prestigio | casa y partida | 1212 | hortelanos | — | 270,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 991 sobre una mediana exacta de 367 |
| prestigio | casa y partida | 1212 | mercaderes | — | 42,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 154 sobre una mediana exacta de 367 |
| prestigio | casa y partida | 1212 | mesta | — | 334,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 1227 sobre una mediana exacta de 367 |
| prestigio | casa y partida | 1212 | monjes | — | 192,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 708 sobre una mediana exacta de 367 |
| prestigio | casa y partida | 1212 | salineros | — | 79,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 292 sobre una mediana exacta de 367 |
| actividad | casa y partida | 1212 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1212 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | canteros | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1212 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1212 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | mercaderes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1212 | mesta | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1212 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1212 | salineros | — | 10 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 20 de 200 turnos |
| precios | partida | 1212 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212 | — | — | 56,6 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 141 de 249 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1212 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 99 · a mano 99 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 139 · a mano 139 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 381 · a mano 381 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -57 · a mano -57 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -71 · a mano -71 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 430 · a mano 430 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 968 · a mano 968 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 61 · a mano 61 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 153 · a mano 153 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 227 · a mano 227 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 663 · a mano 663 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 284 · a mano 284 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 604 · a mano 604 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 165 · a mano 165 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 173 · a mano 173 · el dominio coincide turno a turno |
| dominio | partida | 1212 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 5 de 8 casas lo alcanzan; la primera en T109 |
| prestigio | casa y partida | 1212-2 | arrieros | — | 42,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 207 sobre una mediana exacta de 485 |
| prestigio | casa y partida | 1212-2 | canteros | — | 86,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 421 sobre una mediana exacta de 485 |
| prestigio | casa y partida | 1212-2 | ferrones | — | -3,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -17 sobre una mediana exacta de 485 |
| prestigio | casa y partida | 1212-2 | hortelanos | — | 174,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 847 sobre una mediana exacta de 485 |
| prestigio | casa y partida | 1212-2 | mercaderes | — | 35,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 171 sobre una mediana exacta de 485 |
| prestigio | casa y partida | 1212-2 | mesta | — | 247,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 1198 sobre una mediana exacta de 485 |
| prestigio | casa y partida | 1212-2 | monjes | — | 132,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 643 sobre una mediana exacta de 485 |
| prestigio | casa y partida | 1212-2 | salineros | — | 113,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 549 sobre una mediana exacta de 485 |
| actividad | casa y partida | 1212-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | canteros | — | 6 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 12 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | mesta | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | salineros | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1212-2 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | canteros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1212-2 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1212-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mesta | — | 10 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 20 de 200 turnos |
| escasez | casa y partida | 1212-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1212-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-2 | — | — | 61,4 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 153 de 249 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1212-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 127 · a mano 127 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 353 · a mano 353 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 510 · a mano 510 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -57 · a mano -57 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -71 · a mano -71 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 479 · a mano 479 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 772 · a mano 772 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 107 · a mano 107 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 147 · a mano 147 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 353 · a mano 353 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 893 · a mano 893 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 253 · a mano 253 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 542 · a mano 542 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 272 · a mano 272 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio coincide turno a turno |
| dominio | partida | 1212-2 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212-2 | — | — | 69 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T69 |
| prestigio | casa y partida | 1212-3 | arrieros | — | 50,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 242 sobre una mediana exacta de 477 |
| prestigio | casa y partida | 1212-3 | canteros | — | 80,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 384 sobre una mediana exacta de 477 |
| prestigio | casa y partida | 1212-3 | ferrones | — | 30,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 147 sobre una mediana exacta de 477 |
| prestigio | casa y partida | 1212-3 | hortelanos | — | 190,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 908 sobre una mediana exacta de 477 |
| prestigio | casa y partida | 1212-3 | mercaderes | — | 33,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 158 sobre una mediana exacta de 477 |
| prestigio | casa y partida | 1212-3 | mesta | — | 218,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 1044 sobre una mediana exacta de 477 |
| prestigio | casa y partida | 1212-3 | monjes | — | 171,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 817 sobre una mediana exacta de 477 |
| prestigio | casa y partida | 1212-3 | salineros | — | 119,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 570 sobre una mediana exacta de 477 |
| actividad | casa y partida | 1212-3 | arrieros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | salineros | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1212-3 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-3 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-3 | ferrones | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1212-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-3 | mercaderes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1212-3 | mesta | — | 15,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 31 de 200 turnos |
| escasez | casa y partida | 1212-3 | monjes | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1212-3 | salineros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| precios | partida | 1212-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-3 | — | — | 45,0 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 112 de 249 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1212-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 154 · a mano 154 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 219 · a mano 219 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 400 · a mano 400 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 40 · a mano 40 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 19 · a mano 19 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 383 · a mano 383 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 898 · a mano 898 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 83 · a mano 83 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 124 · a mano 124 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 272 · a mano 272 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 782 · a mano 782 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 442 · a mano 442 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 660 · a mano 660 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 284 · a mano 284 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 506 · a mano 506 · el dominio coincide turno a turno |
| dominio | partida | 1212-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1212-3 | — | — | 94 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T94 |
| ganadores | campaña | 1212 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan mesta, mesta, mesta |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 56,9 %
  - Ferrones: 9,1 %
  - Hortelanos: 207,5 %
  - Mercaderes: 36,5 %
  - Mesta: 262,1 %
  - Monjes: 163,9 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1212): 34,5 % de los turnos
  - Ferrones (semilla 1212-2): 34,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 182 de 403 comarcas
  - región 01-iberico-alto-duero: 3
  - región 02-meseta-norte: 7
  - región 03-cantabrico: 16
  - región 04-galicia-minho: 29
  - región 05-central-extremadura: 22
  - región 06-meseta-sur: 8
  - región 07-ebro-pirineo: 28
  - región 08-levante: 14
  - región 09-andalucia: 47
  - región 10-portugal-sur: 8

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mesta | 1156 | 262,1 % | 1 | 2 | 85 | 2 | 8005 | 8,5 % | 3,5 % |
| Hortelanos | 915 | 207,5 % | 2 | 3 | 1029 | 11 | 2956 | 0,0 % | 1,5 % |
| Monjes | 723 | 163,9 % | 3 | 1 | 1104 | 11 | 981 | 1,0 % | 2,0 % |
| Salineros | 470 | 106,6 % | 5 | 0 | 790 | 10 | 3962 | 4,0 % | 3,0 % |
| Canteros | 412 | 93,4 % | 5 | 1 | 137 | 2 | 511 | 1,5 % | 2,5 % |
| Arrieros | 251 | 56,9 % | 6 | 0 | 79 | 1 | 184 | 0,0 % | 1,5 % |
| Mercaderes | 161 | 36,5 % | 7 | 0 | 90 | 1 | 96 | 2,0 % | 0,0 % |
| Ferrones | 40 | 9,1 % | 8 | 0 | 28 | 1 | 128 | 23,5 % | 3,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 15 | 8 | 40 | 0 | 0 | 149 | 0 | 0 | 38 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 133 | 0 | 0 | 118 |
| Ferrones | 5 | 8 | 0 | 0 | 0 | 51 | 0 | 8 | 15 |
| Hortelanos | 206 | 91 | 160 | 0 | 0 | 211 | 0 | 0 | 248 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 115 | 0 | 0 | 25 |
| Mesta | 17 | 19 | 80 | 0 | 0 | 40 | 830 | 0 | 235 |
| Monjes | 220 | 91 | 80 | 0 | 0 | 165 | 0 | 0 | 168 |
| Salineros | 158 | 80 | 0 | 0 | 0 | 149 | 0 | 0 | 92 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1212 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 189 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 63 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 31 turnos) |
| Canteros | 1212 | termina obras mayores | sí |  |
| Ferrones | 1212 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1212 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1212 | funda pueblas | sí |  |
| Salineros | 1212 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-2 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1212-2 | termina obras mayores | sí |  |
| Ferrones | 1212-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 134 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 54 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 49 turnos) |
| Mesta | 1212-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1212-2 | funda pueblas | sí |  |
| Salineros | 1212-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 116 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 71 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 38 turnos) |
| Canteros | 1212-3 | termina obras mayores | sí |  |
| Ferrones | 1212-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1212-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 141 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 42 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 33 turnos) |
| Mesta | 1212-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1212-3 | funda pueblas | sí |  |
| Salineros | 1212-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 4532 | 777 | 0 | 0 | 0 | 8 | 0 | 0 | 500 | 2006 | 74 | 134 | 16 | 16 | 0 | 0 |
| Canteros | 0 | 0 | 0 | 5622 | 73 | 550 | 0 | 0 | 5 | 1 | 0 | 148 | 1285 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 1275 | 427 | 0 | 0 | 163 | 5 | 0 | 1 | 50 | 540 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 33388 | 1615 | 0 | 0 | 0 | 52 | 1 | 0 | 210 | 1885 | 0 | 0 | 0 | 0 | 0 | 10 |
| Mercaderes | 0 | 0 | 0 | 4385 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 167 | 1228 | 17 | 43 | 3 | 3 | 0 | 0 |
| Mesta | 339 | 11 | 0 | 2770 | 1258 | 0 | 0 | 0 | 8 | 1 | 0 | 51 | 1637 | 0 | 0 | 0 | 0 | 0 | 4 |
| Monjes | 0 | 0 | 0 | 30712 | 3673 | 0 | 0 | 0 | 53 | 1 | 0 | 205 | 1815 | 0 | 0 | 0 | 0 | 5 | 5 |
| Salineros | 0 | 0 | 0 | 19689 | 0 | 0 | 2027 | 0 | 32 | 0 | 0 | 162 | 1899 | 0 | 0 | 0 | 0 | 0 | 9 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1212 | T100 | arrieros | 99 | 99 | 0,0 % | igual turno a turno |
| 1212 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1212 | T100 | ferrones | -57 | -57 | 0,0 % | igual turno a turno |
| 1212 | T100 | hortelanos | 430 | 430 | 0,0 % | igual turno a turno |
| 1212 | T100 | mercaderes | 61 | 61 | 0,0 % | igual turno a turno |
| 1212 | T100 | mesta | 227 | 227 | 0,0 % | igual turno a turno |
| 1212 | T100 | monjes | 284 | 284 | 0,0 % | igual turno a turno |
| 1212 | T100 | salineros | 165 | 165 | 0,0 % | igual turno a turno |
| 1212 | T200 | arrieros | 139 | 139 | 0,0 % | igual turno a turno |
| 1212 | T200 | canteros | 381 | 381 | 0,0 % | igual turno a turno |
| 1212 | T200 | ferrones | -71 | -71 | 0,0 % | igual turno a turno |
| 1212 | T200 | hortelanos | 968 | 968 | 0,0 % | igual turno a turno |
| 1212 | T200 | mercaderes | 153 | 153 | 0,0 % | igual turno a turno |
| 1212 | T200 | mesta | 663 | 663 | 0,0 % | igual turno a turno |
| 1212 | T200 | monjes | 604 | 604 | 0,0 % | igual turno a turno |
| 1212 | T200 | salineros | 173 | 173 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | arrieros | 127 | 127 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | canteros | 321 | 321 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | ferrones | -57 | -57 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | hortelanos | 479 | 479 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | mercaderes | 107 | 107 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | mesta | 353 | 353 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | monjes | 253 | 253 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | salineros | 272 | 272 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | arrieros | 353 | 353 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | canteros | 510 | 510 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | ferrones | -71 | -71 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | hortelanos | 772 | 772 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | mercaderes | 147 | 147 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | mesta | 893 | 893 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | monjes | 542 | 542 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | salineros | 375 | 375 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | arrieros | 154 | 154 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | ferrones | 40 | 40 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | hortelanos | 383 | 383 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mercaderes | 83 | 83 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mesta | 272 | 272 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | monjes | 442 | 442 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | salineros | 284 | 284 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | arrieros | 219 | 219 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | canteros | 400 | 400 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | ferrones | 19 | 19 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | hortelanos | 898 | 898 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mercaderes | 124 | 124 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mesta | 782 | 782 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | monjes | 660 | 660 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | salineros | 506 | 506 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 251 | 237 | 5,6 % | mercado 1051, carga 897, ruta 222 |
| Canteros | 412 | 430 | 4,2 % | mercado 799, carga 573, ruta 92 |
| Ferrones | 40 | -41 | 197,6 % | mercado 610, carga 502, ruta 28 |
| Hortelanos | 915 | 879 | 3,9 % | mercado 1270, carga 671, ruta 188 |
| Mercaderes | 161 | 141 | 12,4 % | carga 800, mercado 775, ruta 82 |
| Mesta | 1156 | 779 | 32,6 % | mercado 1568, carga 494, ruta 228 |
| Monjes | 723 | 602 | 16,7 % | mercado 1175, carga 656, ruta 179 |
| Salineros | 470 | 351 | 25,3 % | mercado 1345, carga 593, ruta 116 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1212 | Arrieros | **no** | T167 | T167 | 3 |
| 1212 | Canteros | **no** | T109 | T109 | 4 |
| 1212 | Ferrones | **no** | **no** | **no** | 1 |
| 1212 | Hortelanos | T55 | T136 | T136 | 5 |
| 1212 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212 | Mesta | **no** | T190 | T190 | 6 |
| 1212 | Monjes | T54 | T138 | T138 | 5 |
| 1212 | Salineros | T86 | **no** | **no** | 4 |
| 1212-2 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-2 | Canteros | **no** | T69 | T69 | 4 |
| 1212-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1212-2 | Hortelanos | T62 | T112 | T112 | 5 |
| 1212-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-2 | Mesta | **no** | T192 | T192 | 5 |
| 1212-2 | Monjes | T54 | T137 | T137 | 5 |
| 1212-2 | Salineros | T64 | **no** | **no** | 4 |
| 1212-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-3 | Canteros | **no** | T106 | T106 | 4 |
| 1212-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1212-3 | Hortelanos | T62 | T94 | T94 | 5 |
| 1212-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-3 | Mesta | T79 | **no** | **no** | 6 |
| 1212-3 | Monjes | T43 | **no** | **no** | 4 |
| 1212-3 | Salineros | T64 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1212 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1027 | 1141 |
| 1212 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1214 |
| 1212 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 374 |
| 1212 | Hortelanos | 0 | 0 | 0 | 0 | 85 | 468 | 938 |
| 1212 | Mercaderes | 9 | 65 | 678 | 390 | 0 | 0 | 1139 |
| 1212 | Mesta | 0 | 0 | 0 | 0 | 0 | 940 | 633 |
| 1212 | Monjes | 0 | 0 | 0 | 0 | 101 | 470 | 798 |
| 1212 | Salineros | 0 | 0 | 0 | 0 | 37 | 662 | 1108 |
| 1212-2 | Arrieros | 48 | 248 | 2854 | 1957 | 0 | 661 | 1017 |
| 1212-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 110 | 1052 |
| 1212-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 376 |
| 1212-2 | Hortelanos | 0 | 0 | 0 | 0 | 67 | 492 | 956 |
| 1212-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1152 |
| 1212-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 843 | 885 |
| 1212-2 | Monjes | 0 | 0 | 0 | 0 | 96 | 582 | 741 |
| 1212-2 | Salineros | 0 | 0 | 0 | 0 | 47 | 864 | 879 |
| 1212-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 394 | 1247 |
| 1212-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 136 | 1193 |
| 1212-3 | Ferrones | 0 | 0 | 0 | 0 | 40 | 34 | 594 |
| 1212-3 | Hortelanos | 0 | 0 | 0 | 0 | 73 | 529 | 954 |
| 1212-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1245 |
| 1212-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 1026 | 577 |
| 1212-3 | Monjes | 0 | 0 | 0 | 0 | 81 | 652 | 676 |
| 1212-3 | Salineros | 0 | 0 | 0 | 0 | 32 | 703 | 1037 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 947 | 965 | 960 | 0 | 164 |
| Canteros | 633 | 651 | 650 | 0 | 82 |
| Ferrones | 483 | 499 | 498 | 0 | 30 |
| Hortelanos | 1008 | 1026 | 1017 | 5 | 214 |
| Mercaderes | 704 | 722 | 720 | 0 | 69 |
| Mesta | 985 | 1002 | 996 | 3 | 53 |
| Monjes | 947 | 965 | 959 | 3 | 201 |
| Salineros | 970 | 988 | 974 | 5 | 150 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 45
- incorporar: comarca-con-duenyo: 4
- construir: comarca-ajena: 2

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 67 | 93 | 111 | 125 | 138 | 149 | 162 | 170 | 240 | 251 |
| Canteros | 68 | 84 | 100 | 186 | 194 | 333 | 349 | 357 | 382 | 412 |
| Ferrones | 23 | 8 | 1 | -3 | 2 | 19 | 27 | 30 | 35 | 40 |
| Hortelanos | 174 | 246 | 320 | 408 | 518 | 624 | 717 | 776 | 836 | 915 |
| Mercaderes | 55 | 73 | 92 | 110 | 119 | 129 | 137 | 142 | 153 | 161 |
| Mesta | 34 | 81 | 210 | 246 | 400 | 508 | 670 | 831 | 979 | 1156 |
| Monjes | 77 | 126 | 279 | 345 | 386 | 450 | 625 | 657 | 681 | 723 |
| Salineros | 88 | 115 | 160 | 252 | 303 | 348 | 384 | 428 | 451 | 470 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1212`: `0c618464dd01d71f86e7d6679497c2b1f1ed36f7062cef93845641d3993ff499`
- semilla `1212-2`: `34a2edf5c69cc1b264f586b483f789e430a8013e7b5478e5a2245609bf496f16`
- semilla `1212-3`: `08daf9081cb2f9eee0971f9627dfaf178a2f4f89ec7f7e24889ccaaeb0de3ec9`
