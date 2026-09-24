# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 721 de prestigio (235,6 % de la mediana) y **Ferrones** cierra la clasificación con 85 (27,8 % de la mediana). La mediana de prestigio es 306. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `6b0fdd9f89101a7ab87c37b728a3c044f5db2ce5` |
| Etiqueta del informe | E-seSostiene-1492 |
| Cambios experimentales | robots 9: crece donde la comarca nueva se sostiene sola |
| Versiones | banco 0.1.0 · métricas 4 · robots 9 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `fea056aae1d16f6f1465a0628f25e179c432f8e84c7d4cf2ea9f43116ddcf113` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 45 filas sin cerrar de 157.

112 cumplen, 42 incumplen y 3 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 57,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 176 sobre una mediana exacta de 306 |
| prestigio | casa y partida | 1492 | canteros | — | 136,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 418 sobre una mediana exacta de 306 |
| prestigio | casa y partida | 1492 | ferrones | — | 57,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 177 sobre una mediana exacta de 306 |
| prestigio | casa y partida | 1492 | hortelanos | — | 197,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 604 sobre una mediana exacta de 306 |
| prestigio | casa y partida | 1492 | mercaderes | — | 65,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 200 sobre una mediana exacta de 306 |
| prestigio | casa y partida | 1492 | mesta | — | 134,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 412 sobre una mediana exacta de 306 |
| prestigio | casa y partida | 1492 | monjes | — | 224,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 688 sobre una mediana exacta de 306 |
| prestigio | casa y partida | 1492 | salineros | — | -7,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -22 sobre una mediana exacta de 306 |
| actividad | casa y partida | 1492 | arrieros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | ferrones | — | 39,5 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 79 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | ferrones | — | 4 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 8 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mercaderes | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | salineros | — | 94,5 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 189 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492 | arrieros | — | 24 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 48 de 200 turnos |
| escasez | casa y partida | 1492 | canteros | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 15 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 30 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 6,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 13 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 41 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 82 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 48,1 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 100 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 212 · a mano 212 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 270 · a mano 270 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 17 · a mano 17 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 12 · a mano 12 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 816 · a mano 816 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 92 · a mano 92 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 93 · a mano 93 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 186 · a mano 186 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 266 · a mano 266 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 331 · a mano 331 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 714 · a mano 714 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -13 · a mano -13 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -3 · a mano -3 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 5 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 58,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 174 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | canteros | — | 141,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 419 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 6,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 18 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 226,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 670 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 57,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 171 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | mesta | — | 194,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 578 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | monjes | — | 260,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 772 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | salineros | — | 25,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 76 sobre una mediana exacta de 296,5 |
| actividad | casa y partida | 1492-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | ferrones | — | 33,5 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 67 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | ferrones | — | 11,5 | % de turnos sin decisión útil | < 10 % | 🔴 incumple | 23 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-2 | arrieros | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1492-2 | canteros | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1492-2 | ferrones | — | 25 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 50 de 200 turnos |
| escasez | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mercaderes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1492-2 | mesta | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| escasez | casa y partida | 1492-2 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-2 | salineros | — | 23 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 46 de 200 turnos |
| precios | partida | 1492-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-2 | — | — | 38,9 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 81 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1492-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 162 · a mano 162 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 209 · a mano 209 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 39 · a mano 39 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 19 · a mano 19 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 456 · a mano 456 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 765 · a mano 765 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 78 · a mano 78 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 142 · a mano 142 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 182 · a mano 182 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 298 · a mano 298 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 356 · a mano 356 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 624 · a mano 624 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 276 · a mano 276 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 211 · a mano 211 · el dominio coincide turno a turno |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 39,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 181 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | canteros | — | 90,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 419 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | ferrones | — | 12,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 59 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 171,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 790 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 45,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 209 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | mesta | — | 128,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 592 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | monjes | — | 152,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 702 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | salineros | — | 109,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 504 sobre una mediana exacta de 461,5 |
| actividad | casa y partida | 1492-3 | arrieros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | ferrones | — | 28 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 56 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | ferrones | — | 12 | % de turnos sin decisión útil | < 10 % | 🔴 incumple | 24 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | salineros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-3 | arrieros | — | 24,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 49 de 200 turnos |
| escasez | casa y partida | 1492-3 | canteros | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1492-3 | ferrones | — | 15 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 30 de 200 turnos |
| escasez | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mercaderes | — | 15,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 31 de 200 turnos |
| escasez | casa y partida | 1492-3 | mesta | — | 15 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 30 de 200 turnos |
| escasez | casa y partida | 1492-3 | monjes | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1492-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492-3 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-arlanza, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1492-3 | — | — | 38,9 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 81 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1492-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 204 · a mano 204 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 224 · a mano 224 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 308 · a mano 308 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 374 · a mano 374 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 50 · a mano 50 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 27 · a mano 27 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 405 · a mano 405 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 765 · a mano 765 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 96 · a mano 96 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 125 · a mano 125 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 161 · a mano 161 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 306 · a mano 306 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 328 · a mano 328 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 577 · a mano 577 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 163 · a mano 163 · el dominio coincide turno a turno |
| dominio | partida | 1492-3 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 7 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492-3 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T109 |
| ganadores | campaña | 1492 | — | — | 0 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🟢 cumple | ganan monjes, monjes, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 57,8 %
  - Canteros: 136,9 %
  - Ferrones: 27,8 %
  - Hortelanos: 224,8 %
  - Mercaderes: 63,1 %
  - Mesta: 172,2 %
  - Monjes: 235,6 %
  - Salineros: 60,8 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Ferrones: 33,5 %
  - Salineros: 33,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Arrieros (semilla 1492): 24,0 % de los turnos
  - Salineros (semilla 1492): 41,0 % de los turnos
  - Ferrones (semilla 1492-2): 25,0 % de los turnos
  - Salineros (semilla 1492-2): 23,0 % de los turnos
  - Arrieros (semilla 1492-3): 24,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 248 de 403 comarcas
  - región 01-iberico-alto-duero: 6
  - región 02-meseta-norte: 32
  - región 03-cantabrico: 22
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 36
  - región 06-meseta-sur: 10
  - región 07-ebro-pirineo: 13
  - región 08-levante: 1
  - región 09-andalucia: 45
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 721 | 235,6 % | 1 | 2 | 1259 | 14 | 1631 | 2,0 % | 2,0 % |
| Hortelanos | 688 | 224,8 % | 2 | 2 | 914 | 12 | 587 | 0,0 % | 2,5 % |
| Mesta | 527 | 172,2 % | 3 | 1 | 209 | 4 | 7706 | 9,5 % | 4,5 % |
| Canteros | 419 | 136,9 % | 4 | 1 | 133 | 2 | 577 | 3,0 % | 1,0 % |
| Mercaderes | 193 | 63,1 % | 6 | 0 | 171 | 3 | 96 | 8,5 % | 0,5 % |
| Salineros | 186 | 60,8 % | 6 | 0 | 373 | 5 | 2653 | 21,5 % | 33,5 % |
| Arrieros | 177 | 57,8 % | 6 | 0 | 147 | 3 | 106 | 20,0 % | 3,0 % |
| Ferrones | 85 | 27,8 % | 7 | 0 | 101 | 2 | 32 | 18,5 % | 33,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 29 | 21 | 0 | 0 | 0 | 115 | 0 | 0 | 65 |
| Canteros | 26 | 16 | 120 | 0 | 0 | 128 | 0 | 0 | 135 |
| Ferrones | 19 | 16 | 0 | 0 | 0 | 56 | 0 | 25 | 65 |
| Hortelanos | 182 | 99 | 40 | 0 | 0 | 179 | 0 | 0 | 188 |
| Mercaderes | 34 | 21 | 0 | 0 | 0 | 117 | 0 | 0 | 58 |
| Mesta | 42 | 29 | 40 | 0 | 0 | 37 | 250 | 0 | 148 |
| Monjes | 251 | 115 | 0 | 0 | 0 | 184 | 0 | 0 | 175 |
| Salineros | 74 | 43 | 0 | 0 | 0 | 93 | 0 | 0 | 58 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 154 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 95 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 78 turnos) |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 173 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 127 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 54 turnos) |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 199 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 81 turnos) |
| Arrieros | 1492-2 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-2 | termina obras mayores | sí |  |
| Ferrones | 1492-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 123 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 49 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 36 turnos) |
| Mesta | 1492-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492-2 | funda pueblas | sí |  |
| Salineros | 1492-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 152 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 90 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 82 turnos) |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 150 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 119 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 64 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 6244 | 238 | 0 | 0 | 0 | 6 | 0 | 0 | 331 | 1294 | 25 | 69 | 11 | 11 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 5478 | 6 | 519 | 0 | 0 | 4 | 1 | 0 | 139 | 1390 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 4277 | 1065 | 0 | 0 | 488 | 12 | 0 | 5 | 73 | 277 | 0 | 0 | 0 | 0 | 0 | 4 |
| Hortelanos | 0 | 0 | 0 | 27285 | 387 | 0 | 0 | 0 | 40 | 0 | 0 | 200 | 1855 | 0 | 0 | 0 | 0 | 0 | 11 |
| Mercaderes | 0 | 0 | 0 | 5378 | 0 | 0 | 0 | 0 | 6 | 0 | 0 | 101 | 1168 | 0 | 0 | 0 | 0 | 0 | 3 |
| Mesta | 353 | 20 | 0 | 4295 | 1063 | 0 | 0 | 0 | 13 | 0 | 0 | 34 | 1582 | 0 | 0 | 0 | 0 | 0 | 3 |
| Monjes | 0 | 0 | 0 | 35080 | 3873 | 0 | 0 | 0 | 61 | 0 | 0 | 203 | 1727 | 0 | 0 | 0 | 0 | 7 | 7 |
| Salineros | 0 | 0 | 0 | 9683 | 0 | 0 | 1739 | 0 | 21 | 0 | 0 | 115 | 1273 | 0 | 0 | 0 | 0 | 0 | 6 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 212 | 212 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | 17 | 17 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 451 | 451 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 92 | 92 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 186 | 186 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 331 | 331 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | -13 | -13 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 270 | 270 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 375 | 375 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | 12 | 12 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 816 | 816 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 93 | 93 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 266 | 266 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 714 | 714 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | -3 | -3 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 162 | 162 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | ferrones | 39 | 39 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | hortelanos | 456 | 456 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mercaderes | 78 | 78 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mesta | 182 | 182 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | monjes | 356 | 356 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | salineros | 276 | 276 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | arrieros | 209 | 209 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | canteros | 375 | 375 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | ferrones | 19 | 19 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | hortelanos | 765 | 765 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mercaderes | 142 | 142 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mesta | 298 | 298 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | monjes | 624 | 624 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | salineros | 211 | 211 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | arrieros | 204 | 204 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | canteros | 308 | 308 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | ferrones | 50 | 50 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | hortelanos | 405 | 405 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mercaderes | 96 | 96 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mesta | 161 | 161 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | monjes | 328 | 328 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | salineros | 130 | 130 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | arrieros | 224 | 224 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | canteros | 374 | 374 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | ferrones | 27 | 27 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | hortelanos | 765 | 765 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mercaderes | 125 | 125 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mesta | 306 | 306 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | monjes | 577 | 577 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | salineros | 163 | 163 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 177 | 234 | 24,4 % | carga 880, mercado 687, ruta 191 |
| Canteros | 419 | 375 | 10,5 % | mercado 864, carga 578, ruta 86 |
| Ferrones | 85 | 19 | 77,6 % | carga 321, mercado 298, cometido 39 |
| Hortelanos | 688 | 782 | 12,0 % | mercado 1156, carga 661, ruta 184 |
| Mercaderes | 193 | 120 | 37,8 % | carga 868, mercado 742, ruta 81 |
| Mesta | 527 | 290 | 45,0 % | mercado 1568, carga 485, ruta 197 |
| Monjes | 721 | 638 | 11,5 % | mercado 1262, carga 664, ruta 184 |
| Salineros | 186 | 124 | 33,3 % | mercado 927, carga 410, ruta 92 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | T67 | **no** | **no** | 4 |
| 1492 | Canteros | **no** | T107 | T107 | 4 |
| 1492 | Ferrones | T127 | **no** | **no** | 4 |
| 1492 | Hortelanos | T74 | **no** | **no** | 4 |
| 1492 | Mercaderes | T64 | **no** | **no** | 4 |
| 1492 | Mesta | **no** | **no** | **no** | 4 |
| 1492 | Monjes | T48 | **no** | **no** | 4 |
| 1492 | Salineros | **no** | **no** | **no** | 2 |
| 1492-2 | Arrieros | **no** | **no** | **no** | 3 |
| 1492-2 | Canteros | **no** | T107 | T107 | 4 |
| 1492-2 | Ferrones | T133 | **no** | **no** | 3 |
| 1492-2 | Hortelanos | T56 | **no** | **no** | 4 |
| 1492-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-2 | Mesta | **no** | T187 | T187 | 5 |
| 1492-2 | Monjes | T43 | **no** | **no** | 4 |
| 1492-2 | Salineros | T74 | **no** | **no** | 4 |
| 1492-3 | Arrieros | T66 | **no** | **no** | 4 |
| 1492-3 | Canteros | **no** | T109 | T109 | 4 |
| 1492-3 | Ferrones | T134 | **no** | **no** | 3 |
| 1492-3 | Hortelanos | T62 | T114 | T114 | 5 |
| 1492-3 | Mercaderes | T90 | **no** | **no** | 4 |
| 1492-3 | Mesta | T90 | **no** | **no** | 5 |
| 1492-3 | Monjes | T48 | **no** | **no** | 4 |
| 1492-3 | Salineros | T62 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 807 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 140 | 1248 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 3 | 225 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 59 | 618 | 921 |
| 1492 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1051 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 913 | 656 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 100 | 586 | 726 |
| 1492-2 | Arrieros | 34 | 171 | 1837 | 1070 | 0 | 626 | 1352 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1242 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 3 | 293 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 127 | 341 | 815 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1283 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 894 | 691 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 95 | 527 | 708 |
| 1492-2 | Salineros | 0 | 0 | 0 | 0 | 12 | 634 | 1223 |
| 1492-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 723 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1261 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 0 | 3 | 300 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 45 | 766 | 797 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1149 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 844 | 741 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 102 | 531 | 720 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 73 | 830 | 882 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 762 | 779 | 777 | 1 | 161 |
| Canteros | 652 | 670 | 670 | 0 | 79 |
| Ferrones | 316 | 333 | 332 | 1 | 45 |
| Hortelanos | 940 | 958 | 943 | 6 | 213 |
| Mercaderes | 719 | 736 | 733 | 1 | 79 |
| Mesta | 968 | 986 | 982 | 3 | 49 |
| Monjes | 1017 | 1035 | 1026 | 5 | 220 |
| Salineros | 667 | 683 | 674 | 7 | 115 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 56
- construir: comarca-ajena: 9
- incorporar: comarca-con-duenyo: 4

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 63 | 93 | 112 | 181 | 191 | 190 | 197 | 176 | 176 | 177 |
| Canteros | 68 | 81 | 100 | 116 | 124 | 350 | 361 | 369 | 382 | 419 |
| Ferrones | 50 | 48 | 74 | 111 | 87 | 106 | 161 | 112 | 102 | 85 |
| Hortelanos | 187 | 200 | 265 | 370 | 393 | 468 | 512 | 575 | 636 | 688 |
| Mercaderes | 60 | 75 | 99 | 148 | 151 | 148 | 165 | 168 | 183 | 193 |
| Mesta | 38 | 45 | 153 | 189 | 245 | 301 | 358 | 411 | 469 | 527 |
| Monjes | 73 | 132 | 320 | 402 | 459 | 534 | 598 | 642 | 683 | 721 |
| Salineros | 60 | 70 | 88 | 158 | 185 | 212 | 197 | 159 | 154 | 186 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `c53d30440942bae122b5587ff5f75ea4396d3dd37a25dc8556ff731bf85582d4`
- semilla `1492-2`: `c3a0cf768391fa4a24815bf3a17d538e7a2da9dee4313d7151662c95051a3bd2`
- semilla `1492-3`: `ecdaf8614cb8dd84457c81c18181429b051e298edc6f3c46cc9af1ed6350345d`
