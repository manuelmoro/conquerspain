# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 721 de prestigio (231,8 % de la mediana) y **Ferrones** cierra la clasificación con 147 (47,3 % de la mediana). La mediana de prestigio es 311. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `dc159e6929d174d34e8e7f06b86f433821d0981c` |
| Etiqueta del informe | T-047-metricas5-1492 |
| Cambios experimentales | ninguno |
| Versiones | banco 0.1.0 · métricas 5 · robots 8 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `fea056aae1d16f6f1465a0628f25e179c432f8e84c7d4cf2ea9f43116ddcf113` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 39 filas sin cerrar de 157.

118 cumplen, 39 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 71,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 231 sobre una mediana exacta de 321,5 |
| prestigio | casa y partida | 1492 | canteros | — | 130,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 418 sobre una mediana exacta de 321,5 |
| prestigio | casa y partida | 1492 | ferrones | — | 45,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 147 sobre una mediana exacta de 321,5 |
| prestigio | casa y partida | 1492 | hortelanos | — | 192,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 619 sobre una mediana exacta de 321,5 |
| prestigio | casa y partida | 1492 | mercaderes | — | 60,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 195 sobre una mediana exacta de 321,5 |
| prestigio | casa y partida | 1492 | mesta | — | 128,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 412 sobre una mediana exacta de 321,5 |
| prestigio | casa y partida | 1492 | monjes | — | 214,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 688 sobre una mediana exacta de 321,5 |
| prestigio | casa y partida | 1492 | salineros | — | -6,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -22 sobre una mediana exacta de 321,5 |
| actividad | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | ferrones | — | 5,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 11 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | salineros | — | 94,5 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 189 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492 | arrieros | — | 13,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 27 de 200 turnos |
| escasez | casa y partida | 1492 | canteros | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 41 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 82 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 44,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 92 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 168 · a mano 168 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 235 · a mano 235 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 17 · a mano 17 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 12 · a mano 12 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 816 · a mano 816 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 117 · a mano 117 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 157 · a mano 157 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 186 · a mano 186 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 266 · a mano 266 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 331 · a mano 331 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 714 · a mano 714 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -13 · a mano -13 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -3 · a mano -3 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 58,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 174 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | canteros | — | 141,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 419 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 45,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 136 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 242,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 720 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 57,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 171 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | mesta | — | 194,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 578 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | monjes | — | 260,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 772 sobre una mediana exacta de 296,5 |
| prestigio | casa y partida | 1492-2 | salineros | — | 25,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 76 sobre una mediana exacta de 296,5 |
| actividad | casa y partida | 1492-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | ferrones | — | 5,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 11 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | ferrones | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
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
| escasez | casa y partida | 1492-2 | ferrones | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mercaderes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1492-2 | mesta | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| escasez | casa y partida | 1492-2 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-2 | salineros | — | 23 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 46 de 200 turnos |
| precios | partida | 1492-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-2 | — | — | 38,9 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 81 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 162 · a mano 162 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 209 · a mano 209 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 39 · a mano 39 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 19 · a mano 19 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 456 · a mano 456 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 748 · a mano 748 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 78 · a mano 78 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 142 · a mano 142 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 182 · a mano 182 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 298 · a mano 298 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 357 · a mano 357 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 547 · a mano 547 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 276 · a mano 276 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 211 · a mano 211 · el dominio coincide turno a turno |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 44,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 203 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | canteros | — | 90,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 419 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | ferrones | — | 34,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 158 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 171,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 792 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 42,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 195 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | mesta | — | 113,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 524 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | monjes | — | 152,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 702 sobre una mediana exacta de 461,5 |
| prestigio | casa y partida | 1492-3 | salineros | — | 109,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 504 sobre una mediana exacta de 461,5 |
| actividad | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
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
| escasez | casa y partida | 1492-3 | arrieros | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1492-3 | canteros | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1492-3 | ferrones | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mesta | — | 16 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 32 de 200 turnos |
| escasez | casa y partida | 1492-3 | monjes | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1492-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492-3 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-cameros, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1492-3 | — | — | 38,5 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 80 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 120 · a mano 120 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 200 · a mano 200 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 308 · a mano 308 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 374 · a mano 374 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 50 · a mano 50 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 27 · a mano 27 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 405 · a mano 405 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 765 · a mano 765 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 152 · a mano 152 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 161 · a mano 161 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 306 · a mano 306 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 328 · a mano 328 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 577 · a mano 577 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 163 · a mano 163 · el dominio coincide turno a turno |
| dominio | partida | 1492-3 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492-3 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T109 |
| ganadores | campaña | 1492 | — | — | 0 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🟢 cumple | ganan monjes, monjes, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 65,3 %
  - Canteros: 134,7 %
  - Ferrones: 47,3 %
  - Hortelanos: 228,3 %
  - Mercaderes: 60,1 %
  - Mesta: 162,4 %
  - Monjes: 231,8 %
  - Salineros: 59,8 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 33,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Salineros (semilla 1492): 41,0 % de los turnos
  - Salineros (semilla 1492-2): 23,0 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 247 de 403 comarcas
  - región 01-iberico-alto-duero: 5
  - región 02-meseta-norte: 31
  - región 03-cantabrico: 22
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 36
  - región 06-meseta-sur: 11
  - región 07-ebro-pirineo: 13
  - región 08-levante: 1
  - región 09-andalucia: 45
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 721 | 231,8 % | 1 | 2 | 1259 | 14 | 1631 | 2,0 % | 2,0 % |
| Hortelanos | 710 | 228,3 % | 2 | 2 | 851 | 12 | 494 | 0,0 % | 2,5 % |
| Mesta | 505 | 162,4 % | 3 | 1 | 152 | 3 | 7949 | 10,0 % | 4,5 % |
| Canteros | 419 | 134,7 % | 4 | 1 | 133 | 2 | 577 | 3,0 % | 1,0 % |
| Arrieros | 203 | 65,3 % | 5 | 0 | 133 | 2 | 114 | 8,5 % | 2,0 % |
| Mercaderes | 187 | 60,1 % | 6 | 0 | 90 | 1 | 101 | 1,5 % | 0,0 % |
| Salineros | 186 | 59,8 % | 7 | 0 | 373 | 5 | 2653 | 21,5 % | 33,5 % |
| Ferrones | 147 | 47,3 % | 7 | 0 | 61 | 1 | 112 | 5,5 % | 5,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 26 | 16 | 0 | 0 | 0 | 136 | 0 | 0 | 48 |
| Canteros | 26 | 16 | 120 | 0 | 0 | 128 | 0 | 0 | 135 |
| Ferrones | 12 | 8 | 0 | 0 | 0 | 88 | 0 | 25 | 38 |
| Hortelanos | 170 | 93 | 80 | 0 | 0 | 179 | 0 | 0 | 188 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 139 | 0 | 0 | 25 |
| Mesta | 30 | 24 | 40 | 0 | 0 | 32 | 250 | 0 | 148 |
| Monjes | 251 | 115 | 0 | 0 | 0 | 184 | 0 | 0 | 175 |
| Salineros | 74 | 43 | 0 | 0 | 0 | 93 | 0 | 0 | 58 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
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
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 137 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 54 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 45 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5945 | 238 | 0 | 0 | 0 | 8 | 0 | 0 | 578 | 1830 | 109 | 434 | 30 | 29 | 0 | 1 |
| Canteros | 0 | 0 | 0 | 5478 | 6 | 519 | 0 | 0 | 4 | 1 | 0 | 139 | 1390 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 2866 | 1026 | 0 | 0 | 483 | 5 | 0 | 4 | 123 | 669 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 26601 | 344 | 0 | 0 | 0 | 33 | 1 | 0 | 210 | 1856 | 0 | 0 | 0 | 0 | 0 | 11 |
| Mercaderes | 0 | 0 | 0 | 4290 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 134 | 1236 | 5 | 9 | 1 | 1 | 0 | 0 |
| Mesta | 353 | 20 | 0 | 3642 | 1063 | 0 | 0 | 0 | 10 | 0 | 0 | 31 | 1582 | 0 | 0 | 0 | 0 | 0 | 2 |
| Monjes | 0 | 0 | 0 | 35080 | 3873 | 0 | 0 | 0 | 61 | 0 | 0 | 203 | 1727 | 0 | 0 | 0 | 0 | 7 | 7 |
| Salineros | 0 | 0 | 0 | 9683 | 0 | 0 | 1739 | 0 | 21 | 0 | 0 | 115 | 1273 | 0 | 0 | 0 | 0 | 0 | 6 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 168 | 168 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | 17 | 17 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 451 | 451 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 117 | 117 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 186 | 186 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 331 | 331 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | -13 | -13 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 235 | 235 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 375 | 375 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | 12 | 12 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 816 | 816 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 157 | 157 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 266 | 266 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 714 | 714 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | -3 | -3 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 162 | 162 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | ferrones | 39 | 39 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | hortelanos | 456 | 456 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mercaderes | 78 | 78 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mesta | 182 | 182 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | monjes | 357 | 357 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | salineros | 276 | 276 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | arrieros | 209 | 209 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | canteros | 375 | 375 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | ferrones | 19 | 19 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | hortelanos | 748 | 748 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mercaderes | 142 | 142 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mesta | 298 | 298 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | monjes | 547 | 547 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | salineros | 211 | 211 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | arrieros | 120 | 120 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | canteros | 308 | 308 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | ferrones | 50 | 50 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | hortelanos | 405 | 405 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mercaderes | 123 | 123 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mesta | 161 | 161 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | monjes | 328 | 328 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | salineros | 130 | 130 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | arrieros | 200 | 200 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | canteros | 374 | 374 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | ferrones | 27 | 27 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | hortelanos | 765 | 765 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mercaderes | 152 | 152 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mesta | 306 | 306 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | monjes | 577 | 577 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | salineros | 163 | 163 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 203 | 215 | 5,6 % | carga 945, mercado 745, ruta 267 |
| Canteros | 419 | 375 | 10,5 % | mercado 864, carga 578, ruta 86 |
| Ferrones | 147 | 19 | 87,1 % | mercado 573, carga 511, ruta 52 |
| Hortelanos | 710 | 776 | 8,5 % | mercado 1159, carga 661, ruta 184 |
| Mercaderes | 187 | 150 | 19,8 % | carga 809, mercado 790, ruta 96 |
| Mesta | 505 | 290 | 42,6 % | mercado 1580, carga 481, ruta 193 |
| Monjes | 721 | 613 | 15,0 % | mercado 1262, carga 664, ruta 184 |
| Salineros | 186 | 124 | 33,3 % | mercado 927, carga 410, ruta 92 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | T111 | **no** | **no** | 4 |
| 1492 | Canteros | **no** | T107 | T107 | 4 |
| 1492 | Ferrones | **no** | **no** | **no** | 3 |
| 1492 | Hortelanos | T74 | **no** | **no** | 4 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | **no** | **no** | **no** | 4 |
| 1492 | Monjes | T48 | **no** | **no** | 4 |
| 1492 | Salineros | **no** | **no** | **no** | 2 |
| 1492-2 | Arrieros | **no** | **no** | **no** | 3 |
| 1492-2 | Canteros | **no** | T107 | T107 | 4 |
| 1492-2 | Ferrones | **no** | **no** | **no** | 3 |
| 1492-2 | Hortelanos | T58 | **no** | **no** | 4 |
| 1492-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-2 | Mesta | **no** | T187 | T187 | 5 |
| 1492-2 | Monjes | T43 | **no** | **no** | 4 |
| 1492-2 | Salineros | T74 | **no** | **no** | 4 |
| 1492-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1492-3 | Canteros | **no** | T109 | T109 | 4 |
| 1492-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-3 | Hortelanos | T62 | T114 | T114 | 5 |
| 1492-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-3 | Mesta | T90 | **no** | **no** | 5 |
| 1492-3 | Monjes | T48 | **no** | **no** | 4 |
| 1492-3 | Salineros | T62 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 25 | 243 | 1680 | 1024 | 0 | 5 | 1063 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 140 | 1248 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 9 | 588 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 61 | 611 | 916 |
| 1492 | Mercaderes | 2 | 14 | 78 | 30 | 0 | 0 | 1180 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 913 | 656 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 100 | 586 | 726 |
| 1492-2 | Arrieros | 34 | 171 | 1837 | 1070 | 0 | 626 | 1352 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1242 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 3 | 583 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 142 | 341 | 729 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1283 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 894 | 691 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 95 | 527 | 708 |
| 1492-2 | Salineros | 0 | 0 | 0 | 0 | 12 | 634 | 1223 |
| 1492-3 | Arrieros | 31 | 285 | 2468 | 1572 | 0 | 5 | 1005 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1261 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 23 | 49 | 637 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 35 | 793 | 824 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1197 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 911 | 675 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 102 | 531 | 720 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 73 | 830 | 882 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 848 | 865 | 864 | 0 | 157 |
| Canteros | 652 | 670 | 670 | 0 | 79 |
| Ferrones | 502 | 520 | 520 | 0 | 55 |
| Hortelanos | 938 | 956 | 940 | 5 | 210 |
| Mercaderes | 721 | 739 | 738 | 0 | 83 |
| Mesta | 962 | 980 | 977 | 2 | 45 |
| Monjes | 1017 | 1035 | 1026 | 5 | 220 |
| Salineros | 667 | 683 | 674 | 7 | 115 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 51
- construir: comarca-ajena: 4
- incorporar: comarca-con-duenyo: 3

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 63 | 93 | 112 | 146 | 158 | 187 | 186 | 191 | 197 | 203 |
| Canteros | 68 | 81 | 100 | 116 | 124 | 350 | 361 | 369 | 382 | 419 |
| Ferrones | 50 | 48 | 74 | 102 | 104 | 131 | 126 | 131 | 139 | 147 |
| Hortelanos | 187 | 200 | 265 | 372 | 401 | 481 | 540 | 576 | 635 | 710 |
| Mercaderes | 60 | 75 | 99 | 118 | 128 | 144 | 158 | 163 | 176 | 187 |
| Mesta | 38 | 45 | 153 | 189 | 245 | 301 | 358 | 407 | 454 | 505 |
| Monjes | 73 | 132 | 320 | 402 | 459 | 534 | 598 | 642 | 683 | 721 |
| Salineros | 60 | 70 | 88 | 158 | 185 | 212 | 197 | 159 | 154 | 186 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `53bf3830b83c1d0870a610a308ae7ed648afb42ff05c33e5bd2205f64532decd`
- semilla `1492-2`: `6160ed1eb8b25fa9c2e88150751eee75158f3921c5ade95f932a24afbd5198dd`
- semilla `1492-3`: `ce777a9dab43c53e93c494f8e3737a54d2a48856433fe270f3b5d6e9cb48565b`
