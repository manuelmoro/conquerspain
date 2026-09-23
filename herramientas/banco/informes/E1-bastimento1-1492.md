# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 1006 de prestigio (399,2 % de la mediana) y **Ferrones** cierra la clasificación con 15 (6,0 % de la mediana). La mediana de prestigio es 252. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `e6447fd65077e24df8e5a0e1e8de20bd5879f7e7` |
| Etiqueta del informe | E1-bastimento1-1492 |
| Cambios experimentales | bastimentoPorJornada 2 -> 1 |
| Versiones | banco 0.1.0 · métricas 4 · robots 3 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `e1300faf87751c3c8e941d8b46785e4b5eef0aed932439d1766f04d58d4057af` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 46 filas sin cerrar de 157.

111 cumplen, 46 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 43,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 90 sobre una mediana exacta de 205 |
| prestigio | casa y partida | 1492 | canteros | — | 145,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 298 sobre una mediana exacta de 205 |
| prestigio | casa y partida | 1492 | ferrones | — | -24,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -51 sobre una mediana exacta de 205 |
| prestigio | casa y partida | 1492 | hortelanos | — | 316,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 649 sobre una mediana exacta de 205 |
| prestigio | casa y partida | 1492 | mercaderes | — | 54,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 112 sobre una mediana exacta de 205 |
| prestigio | casa y partida | 1492 | mesta | — | 24,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 50 sobre una mediana exacta de 205 |
| prestigio | casa y partida | 1492 | monjes | — | 450,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 924 sobre una mediana exacta de 205 |
| prestigio | casa y partida | 1492 | salineros | — | 285,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 586 sobre una mediana exacta de 205 |
| actividad | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | canteros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | canteros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | ferrones | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | ferrones | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mesta | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | monjes | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | salineros | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492 | arrieros | — | 9 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 18 de 200 turnos |
| escasez | casa y partida | 1492 | canteros | — | 10 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 20 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 44,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 89 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 11,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 23 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 6,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 13 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 40,9 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 85 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 87 · a mano 87 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 101 · a mano 101 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 294 · a mano 294 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 483 · a mano 483 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -43 · a mano -43 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -49 · a mano -49 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 505 · a mano 505 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 789 · a mano 789 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 53 · a mano 53 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 76 · a mano 76 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 43 · a mano 43 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 23 · a mano 23 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 383 · a mano 383 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 825 · a mano 825 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 255 · a mano 255 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 382 · a mano 382 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 69 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 2 de 8 casas lo alcanzan; la primera en T69 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 123,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 218 sobre una mediana exacta de 176,5 |
| prestigio | casa y partida | 1492-2 | canteros | — | 162,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 286 sobre una mediana exacta de 176,5 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 62,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 111 sobre una mediana exacta de 176,5 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 444,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 785 sobre una mediana exacta de 176,5 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 76,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 135 sobre una mediana exacta de 176,5 |
| prestigio | casa y partida | 1492-2 | mesta | — | 34,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 60 sobre una mediana exacta de 176,5 |
| prestigio | casa y partida | 1492-2 | monjes | — | 644,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 1138 sobre una mediana exacta de 176,5 |
| prestigio | casa y partida | 1492-2 | salineros | — | 2,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 4 sobre una mediana exacta de 176,5 |
| actividad | casa y partida | 1492-2 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | ferrones | — | 14 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 28 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | salineros | — | 92 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 184 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-2 | arrieros | — | 7,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 15 de 200 turnos |
| escasez | casa y partida | 1492-2 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | ferrones | — | 20 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 40 de 200 turnos |
| escasez | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mesta | — | 6,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 13 de 200 turnos |
| escasez | casa y partida | 1492-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | salineros | — | 33 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 66 de 200 turnos |
| precios | partida | 1492-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-2 | — | — | 38,0 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 79 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 95 · a mano 95 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 233 · a mano 233 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 297 · a mano 297 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 318 · a mano 318 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 36 · a mano 36 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 10 · a mano 10 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 377 · a mano 377 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 845 · a mano 845 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 93 · a mano 93 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 108 · a mano 108 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 48 · a mano 48 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 26 · a mano 26 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 433 · a mano 433 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 776 · a mano 776 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -21 · a mano -21 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -42 · a mano -42 · el dominio coincide turno a turno |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 96 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T96 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 63,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 241 sobre una mediana exacta de 378 |
| prestigio | casa y partida | 1492-3 | canteros | — | 88,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 333 sobre una mediana exacta de 378 |
| prestigio | casa y partida | 1492-3 | ferrones | — | -4,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -16 sobre una mediana exacta de 378 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 183,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 695 sobre una mediana exacta de 378 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 28,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 108 sobre una mediana exacta de 378 |
| prestigio | casa y partida | 1492-3 | mesta | — | 127,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 483 sobre una mediana exacta de 378 |
| prestigio | casa y partida | 1492-3 | monjes | — | 253,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 957 sobre una mediana exacta de 378 |
| prestigio | casa y partida | 1492-3 | salineros | — | 111,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 423 sobre una mediana exacta de 378 |
| actividad | casa y partida | 1492-3 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | arrieros | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | canteros | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | canteros | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | ferrones | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | mesta | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | monjes | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | monjes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | salineros | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-3 | arrieros | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1492-3 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | ferrones | — | 36 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 72 de 200 turnos |
| escasez | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mercaderes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1492-3 | mesta | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1492-3 | monjes | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1492-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-3 | — | — | 34,1 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 71 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 247 · a mano 247 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 275 · a mano 275 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 298 · a mano 298 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -50 · a mano -50 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -65 · a mano -65 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 455 · a mano 455 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 794 · a mano 794 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 61 · a mano 61 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 79 · a mano 79 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 29 · a mano 29 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 18 · a mano 18 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 425 · a mano 425 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 873 · a mano 873 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 258 · a mano 258 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 224 · a mano 224 · el dominio coincide turno a turno |
| dominio | partida | 1492-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 5 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-3 | — | — | 89 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T89 |
| ganadores | campaña | 1492 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan monjes, monjes, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 72,6 %
  - Canteros: 121,4 %
  - Ferrones: 6,0 %
  - Hortelanos: 281,7 %
  - Mercaderes: 46,8 %
  - Mesta: 78,6 %
  - Monjes: 399,2 %
  - Salineros: 134,1 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 32,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1492): 44,5 % de los turnos
  - Salineros (semilla 1492-2): 33,0 % de los turnos
  - Ferrones (semilla 1492-3): 36,0 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 137 de 403 comarcas
  - región 01-iberico-alto-duero: 5
  - región 02-meseta-norte: 6
  - región 03-cantabrico: 16
  - región 04-galicia-minho: 9
  - región 05-central-extremadura: 16
  - región 06-meseta-sur: 14
  - región 07-ebro-pirineo: 17
  - región 08-levante: 9
  - región 09-andalucia: 43
  - región 10-portugal-sur: 2

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 1006 | 399,2 % | 1 | 2 | 1187 | 16 | 84 | 2,5 % | 2,5 % |
| Hortelanos | 710 | 281,7 % | 2 | 2 | 836 | 11 | 997 | 0,0 % | 2,0 % |
| Salineros | 338 | 134,1 % | 5 | 0 | 540 | 6 | 3458 | 11,0 % | 32,5 % |
| Canteros | 306 | 121,4 % | 4 | 1 | 82 | 1 | 489 | 3,5 % | 3,5 % |
| Mesta | 198 | 78,6 % | 6 | 0 | 81 | 2 | 1443 | 8,5 % | 2,5 % |
| Arrieros | 183 | 72,6 % | 5 | 0 | 150 | 2 | 100 | 6,5 % | 2,0 % |
| Mercaderes | 118 | 46,8 % | 6 | 0 | 90 | 1 | 102 | 2,0 % | 0,0 % |
| Ferrones | 15 | 6,0 % | 7 | 0 | 37 | 1 | 71 | 33,5 % | 6,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 30 | 47 | 0 | 0 | 0 | 61 | 0 | 0 | 65 |
| Canteros | 16 | 20 | 120 | 0 | 0 | 58 | 0 | 0 | 105 |
| Ferrones | 7 | 27 | 0 | 0 | 0 | 23 | 0 | 3 | 22 |
| Hortelanos | 167 | 220 | 40 | 0 | 0 | 78 | 0 | 0 | 205 |
| Mercaderes | 18 | 20 | 0 | 0 | 0 | 60 | 0 | 0 | 25 |
| Mesta | 16 | 33 | 40 | 0 | 0 | 30 | 27 | 0 | 82 |
| Monjes | 237 | 327 | 120 | 0 | 0 | 80 | 0 | 0 | 248 |
| Salineros | 107 | 120 | 0 | 0 | 0 | 74 | 0 | 0 | 58 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 163 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 34 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 34 turnos) |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 88 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 63 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 158 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 28 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 26 turnos) |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1492-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 149 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 37 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 15 turnos) |
| Canteros | 1492-2 | termina obras mayores | sí |  |
| Ferrones | 1492-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 159 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 26 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 12 turnos) |
| Mesta | 1492-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 195 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 188 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 12 turnos) |
| Monjes | 1492-2 | funda pueblas | sí |  |
| Salineros | 1492-2 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 199 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 66 turnos) |
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 123 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 48 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 17 turnos) |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 72 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 42 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 158 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 35 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 34 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 6911 | 362 | 0 | 0 | 0 | 4 | 0 | 0 | 430 | 1552 | 0 | 0 | 0 | 0 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 4742 | 0 | 503 | 0 | 0 | 2 | 1 | 0 | 179 | 952 | 0 | 0 | 0 | 0 | 0 | 0 |
| Ferrones | 0 | 0 | 0 | 1434 | 451 | 0 | 0 | 163 | 5 | 0 | 1 | 69 | 370 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 27996 | 234 | 0 | 0 | 0 | 34 | 0 | 0 | 270 | 1895 | 0 | 0 | 0 | 0 | 0 | 10 |
| Mercaderes | 0 | 0 | 0 | 4366 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 179 | 1117 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 52 | 2 | 0 | 2152 | 984 | 0 | 0 | 0 | 5 | 0 | 0 | 103 | 1847 | 0 | 0 | 0 | 0 | 0 | 1 |
| Monjes | 0 | 0 | 0 | 34150 | 3679 | 0 | 0 | 0 | 64 | 1 | 0 | 333 | 1781 | 0 | 0 | 0 | 0 | 10 | 5 |
| Salineros | 0 | 0 | 0 | 14464 | 105 | 0 | 984 | 0 | 23 | 0 | 0 | 248 | 1272 | 0 | 0 | 0 | 0 | 0 | 5 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 87 | 87 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 294 | 294 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | -43 | -43 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 505 | 505 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 53 | 53 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 43 | 43 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 383 | 383 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | 255 | 255 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 101 | 101 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 483 | 483 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | -49 | -49 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 789 | 789 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 76 | 76 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 23 | 23 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 825 | 825 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | 382 | 382 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 95 | 95 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | canteros | 297 | 297 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | ferrones | 36 | 36 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | hortelanos | 377 | 377 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mercaderes | 93 | 93 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mesta | 48 | 48 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | monjes | 433 | 433 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | salineros | -21 | -21 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | arrieros | 233 | 233 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | canteros | 318 | 318 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | ferrones | 10 | 10 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | hortelanos | 845 | 845 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mercaderes | 108 | 108 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mesta | 26 | 26 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | monjes | 776 | 776 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | salineros | -42 | -42 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | arrieros | 247 | 247 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | canteros | 298 | 298 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | ferrones | -50 | -50 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | hortelanos | 455 | 455 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mercaderes | 61 | 61 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mesta | 29 | 29 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | monjes | 425 | 425 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | salineros | 258 | 258 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | arrieros | 275 | 275 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | ferrones | -65 | -65 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | hortelanos | 794 | 794 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mercaderes | 79 | 79 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mesta | 18 | 18 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | monjes | 873 | 873 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | salineros | 224 | 224 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 183 | 203 | 9,9 % | carga 708, mercado 699, ruta 226 |
| Canteros | 306 | 372 | 17,7 % | mercado 644, carga 578, ruta 106 |
| Ferrones | 15 | -35 | 142,9 % | carga 493, mercado 477, ruta 40 |
| Hortelanos | 710 | 809 | 12,2 % | mercado 1161, carga 683, ruta 206 |
| Mercaderes | 118 | 88 | 25,4 % | mercado 740, carga 602, ruta 106 |
| Mesta | 198 | 22 | 88,9 % | mercado 1469, carga 530, ruta 71 |
| Monjes | 1006 | 825 | 18,0 % | mercado 1065, carga 757, ruta 285 |
| Salineros | 338 | 188 | 44,4 % | mercado 836, carga 520, ruta 202 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | **no** | **no** | **no** | 3 |
| 1492 | Canteros | **no** | T69 | T69 | 4 |
| 1492 | Ferrones | **no** | **no** | **no** | 1 |
| 1492 | Hortelanos | T68 | **no** | **no** | 4 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | **no** | **no** | **no** | 2 |
| 1492 | Monjes | T48 | T139 | T139 | 5 |
| 1492 | Salineros | T60 | **no** | **no** | 4 |
| 1492-2 | Arrieros | T107 | **no** | **no** | 4 |
| 1492-2 | Canteros | **no** | T109 | T109 | 3 |
| 1492-2 | Ferrones | **no** | **no** | **no** | 3 |
| 1492-2 | Hortelanos | T62 | T96 | T96 | 5 |
| 1492-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-2 | Mesta | **no** | **no** | **no** | 2 |
| 1492-2 | Monjes | T43 | T155 | T155 | 6 |
| 1492-2 | Salineros | **no** | **no** | **no** | 2 |
| 1492-3 | Arrieros | T58 | **no** | **no** | 4 |
| 1492-3 | Canteros | **no** | T89 | T89 | 3 |
| 1492-3 | Ferrones | **no** | **no** | **no** | 1 |
| 1492-3 | Hortelanos | T68 | **no** | **no** | 4 |
| 1492-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-3 | Mesta | T164 | T196 | T196 | 6 |
| 1492-3 | Monjes | T43 | T125 | T125 | 5 |
| 1492-3 | Salineros | T60 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1021 | 1414 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 459 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 385 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 87 | 534 | 848 |
| 1492 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1162 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 885 | 1002 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 62 | 790 | 587 |
| 1492 | Salineros | 0 | 0 | 0 | 0 | 43 | 669 | 1016 |
| 1492-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 1082 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 1171 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 6 | 329 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 48 | 734 | 880 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1052 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 858 | 877 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 72 | 614 | 804 |
| 1492-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 1109 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 816 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 387 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 111 | 448 | 804 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1119 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 741 | 1160 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 60 | 882 | 597 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 24 | 734 | 1054 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 705 | 723 | 720 | 0 | 206 |
| Canteros | 559 | 577 | 575 | 0 | 95 |
| Ferrones | 433 | 448 | 448 | 0 | 38 |
| Hortelanos | 944 | 962 | 949 | 2 | 212 |
| Mercaderes | 609 | 627 | 626 | 0 | 95 |
| Mesta | 871 | 889 | 887 | 1 | 53 |
| Monjes | 982 | 1000 | 993 | 2 | 296 |
| Salineros | 731 | 748 | 741 | 4 | 222 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 21
- construir: comarca-ajena: 3
- incorporar: comarca-con-duenyo: 3

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 68 | 78 | 125 | 132 | 170 | 197 | 206 | 202 | 181 | 183 |
| Canteros | 69 | 79 | 87 | 178 | 254 | 310 | 312 | 295 | 301 | 306 |
| Ferrones | 29 | 15 | -2 | -5 | 18 | 20 | 18 | 16 | 16 | 15 |
| Hortelanos | 173 | 182 | 245 | 407 | 498 | 541 | 604 | 635 | 668 | 710 |
| Mercaderes | 57 | 70 | 80 | 87 | 93 | 97 | 103 | 107 | 114 | 118 |
| Mesta | 52 | 56 | 70 | 74 | 77 | 77 | 112 | 113 | 134 | 198 |
| Monjes | 73 | 144 | 343 | 405 | 482 | 549 | 740 | 857 | 930 | 1006 |
| Salineros | 59 | 60 | 134 | 183 | 217 | 242 | 271 | 305 | 320 | 338 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `c8ecee9aa3671fd07a0368c4c369fd73c5b7f67327bb9ee8973b12508b373e66`
- semilla `1492-2`: `1f5636109d9d0365b1d758c520cde48d452152eb8b1ae86f35417ef5d4fc39a8`
- semilla `1492-3`: `1b228033c0c022df84302de46ba41192fcab6b98e2f78432203376f7de9a3476`
