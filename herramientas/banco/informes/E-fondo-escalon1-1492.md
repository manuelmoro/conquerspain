# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 789 de prestigio (323,4 % de la mediana) y **Mesta** cierra la clasificación con 58 (23,8 % de la mediana). La mediana de prestigio es 244. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `bfcf751b6b84f17bb104ff27b853a18f2f561707` |
| Etiqueta del informe | E-fondo-escalon1-1492 |
| Cambios experimentales | fondo de comercio (robots 7) + mercado.jornadasPorEscalonDeAbundancia=1 |
| Versiones | banco 0.1.0 · métricas 4 · robots 7 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `d7f79e6ba4f07f4859c83228a86a8d1881c5567e83eff86511711ca4768c0d54` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 42 filas sin cerrar de 157.

115 cumplen, 42 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 125,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 324 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | canteros | — | 154,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 400 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | ferrones | — | 56,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 146 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | hortelanos | — | 231,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 599 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | mercaderes | — | 74,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 193 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | mesta | — | 15,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 41 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | monjes | — | 345,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 894 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | salineros | — | -7,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -19 sobre una mediana exacta de 258,5 |
| actividad | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | ferrones | — | 9,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 19 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | ferrones | — | 4,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 9 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | salineros | — | 94 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 188 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492 | arrieros | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1492 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 39,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 79 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 45,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 94 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 168 · a mano 168 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 273 · a mano 273 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 365 · a mano 365 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 32 · a mano 32 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -1 · a mano -1 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 811 · a mano 811 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 120 · a mano 120 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 168 · a mano 168 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 24 · a mano 24 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 4 · a mano 4 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 355 · a mano 355 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 607 · a mano 607 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -12 · a mano -12 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 7 · a mano 7 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 111 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T111 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 85,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 215 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | canteros | — | 159,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 400 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 33,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 83 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 268,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 674 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 75,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 190 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | mesta | — | 27,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 70 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | monjes | — | 306,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 770 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | salineros | — | 114,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 287 sobre una mediana exacta de 251 |
| actividad | casa y partida | 1492-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | ferrones | — | 10,5 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 21 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | ferrones | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-2 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mercaderes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-2 | mesta | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1492-2 | monjes | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1492-2 | salineros | — | 12 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 24 de 200 turnos |
| precios | partida | 1492-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-2 | — | — | 39,9 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 83 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 162 · a mano 162 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 187 · a mano 187 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 325 · a mano 325 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 365 · a mano 365 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 41 · a mano 41 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 12 · a mano 12 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 456 · a mano 456 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 765 · a mano 765 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 96 · a mano 96 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 151 · a mano 151 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 15 · a mano 15 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 349 · a mano 349 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 562 · a mano 562 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 279 · a mano 279 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 250 · a mano 250 · el dominio se separa en T193 |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T109 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 82,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 245 sobre una mediana exacta de 297,5 |
| prestigio | casa y partida | 1492-3 | canteros | — | 117,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 350 sobre una mediana exacta de 297,5 |
| prestigio | casa y partida | 1492-3 | ferrones | — | 51,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 154 sobre una mediana exacta de 297,5 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 283,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 842 sobre una mediana exacta de 297,5 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 70,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 211 sobre una mediana exacta de 297,5 |
| prestigio | casa y partida | 1492-3 | mesta | — | 21,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 63 sobre una mediana exacta de 297,5 |
| prestigio | casa y partida | 1492-3 | monjes | — | 236,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 702 sobre una mediana exacta de 297,5 |
| prestigio | casa y partida | 1492-3 | salineros | — | 137,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 409 sobre una mediana exacta de 297,5 |
| actividad | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | salineros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-3 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | ferrones | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mesta | — | 4,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 9 de 200 turnos |
| escasez | casa y partida | 1492-3 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-3 | — | — | 39,9 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 83 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 122 · a mano 122 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 202 · a mano 202 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 365 · a mano 365 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 34 · a mano 34 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 6 · a mano 6 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 363 · a mano 363 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 723 · a mano 723 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 162 · a mano 162 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 41 · a mano 41 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 16 · a mano 16 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 402 · a mano 402 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 797 · a mano 797 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 163 · a mano 163 · el dominio se separa en T175 |
| dominio | partida | 1492-3 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492-3 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T109 |
| ganadores | campaña | 1492 | — | — | 0 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🟢 cumple | ganan monjes, monjes, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 157,0 %
  - Ferrones: 52,5 %
  - Hortelanos: 288,9 %
  - Mesta: 23,8 %
  - Monjes: 323,4 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 33,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Salineros (semilla 1492): 39,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 247 de 403 comarcas
  - región 01-iberico-alto-duero: 6
  - región 02-meseta-norte: 31
  - región 03-cantabrico: 21
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 36
  - región 06-meseta-sur: 12
  - región 07-ebro-pirineo: 13
  - región 09-andalucia: 45
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 789 | 323,4 % | 1 | 2 | 1282 | 13 | 1647 | 1,0 % | 2,0 % |
| Hortelanos | 705 | 288,9 % | 2 | 2 | 783 | 10 | 1157 | 0,0 % | 2,5 % |
| Canteros | 383 | 157,0 % | 3 | 1 | 108 | 1 | 453 | 0,0 % | 1,0 % |
| Arrieros | 261 | 107,0 % | 5 | 0 | 146 | 2 | 97 | 1,5 % | 2,0 % |
| Salineros | 226 | 92,6 % | 5 | 0 | 442 | 5 | 3455 | 17,0 % | 33,5 % |
| Mercaderes | 198 | 81,1 % | 6 | 0 | 90 | 1 | 109 | 1,0 % | 0,5 % |
| Ferrones | 128 | 52,5 % | 7 | 0 | 68 | 1 | 94 | 10,0 % | 8,0 % |
| Mesta | 58 | 23,8 % | 8 | 0 | 34 | 1 | 110 | 8,0 % | 5,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 29 | 16 | 0 | 0 | 0 | 171 | 0 | 0 | 48 |
| Canteros | 21 | 8 | 120 | 0 | 0 | 136 | 0 | 0 | 98 |
| Ferrones | 13 | 11 | 0 | 0 | 0 | 72 | 0 | 25 | 33 |
| Hortelanos | 156 | 83 | 80 | 0 | 0 | 181 | 0 | 0 | 205 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 149 | 0 | 0 | 25 |
| Mesta | 6 | 8 | 0 | 0 | 0 | 35 | 0 | 0 | 25 |
| Monjes | 256 | 107 | 40 | 0 | 0 | 200 | 0 | 0 | 188 |
| Salineros | 88 | 43 | 0 | 0 | 0 | 91 | 0 | 0 | 58 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 137 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 93 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 46 turnos) |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 145 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 50 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 37 turnos) |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 178 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 22 turnos) |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 199 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 79 turnos) |
| Arrieros | 1492-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 125 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 60 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 57 turnos) |
| Canteros | 1492-2 | termina obras mayores | sí |  |
| Ferrones | 1492-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 140 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 47 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 42 turnos) |
| Mesta | 1492-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 193 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 184 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 16 turnos) |
| Monjes | 1492-2 | funda pueblas | sí |  |
| Salineros | 1492-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 155 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 82 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 35 turnos) |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 145 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 50 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 37 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no conoce ningún invernadero al que pueda llegar el ganado (mapa, 192 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 180 turnos); no hay maravedís para formar un rebaño sin quedarse sin colchón (recursos, 12 turnos) |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 6213 | 240 | 0 | 0 | 0 | 8 | 0 | 0 | 364 | 1309 | 0 | 3 | 0 | 0 | 0 | 1 |
| Canteros | 0 | 0 | 0 | 5623 | 0 | 503 | 0 | 0 | 2 | 1 | 0 | 152 | 1361 | 0 | 0 | 0 | 0 | 0 | 0 |
| Ferrones | 0 | 0 | 0 | 3148 | 1004 | 0 | 0 | 483 | 5 | 0 | 4 | 97 | 578 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 26413 | 574 | 0 | 0 | 0 | 39 | 1 | 0 | 217 | 1899 | 0 | 0 | 0 | 0 | 0 | 9 |
| Mercaderes | 0 | 0 | 0 | 4408 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 145 | 1219 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 2 | 0 | 0 | 1552 | 1064 | 0 | 0 | 0 | 2 | 0 | 0 | 39 | 1740 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 36269 | 4088 | 0 | 0 | 0 | 61 | 0 | 0 | 224 | 1804 | 0 | 0 | 0 | 0 | 7 | 5 |
| Salineros | 0 | 0 | 0 | 11502 | 0 | 0 | 1808 | 0 | 22 | 0 | 0 | 86 | 1271 | 0 | 0 | 0 | 0 | 0 | 5 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 168 | 168 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | 32 | 32 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 451 | 451 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 120 | 120 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 24 | 24 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 355 | 355 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | -12 | -12 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 273 | 273 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 365 | 365 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | -1 | -1 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 811 | 811 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 168 | 168 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 4 | 4 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 607 | 607 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | 7 | 7 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 162 | 162 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | canteros | 325 | 325 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | ferrones | 41 | 41 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | hortelanos | 456 | 456 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | mercaderes | 96 | 96 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | mesta | 42 | 42 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | monjes | 349 | 349 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | salineros | 279 | 279 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | arrieros | 187 | 187 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | canteros | 365 | 365 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | ferrones | 12 | 12 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | hortelanos | 765 | 765 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | mercaderes | 151 | 151 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | mesta | 15 | 15 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | monjes | 562 | 562 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | salineros | 250 | 250 | 0,0 % | se separa en T193 |
| 1492-3 | T100 | arrieros | 122 | 122 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | ferrones | 34 | 34 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | hortelanos | 363 | 363 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | mercaderes | 123 | 123 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | mesta | 41 | 41 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | monjes | 402 | 402 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | salineros | 130 | 130 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | arrieros | 202 | 202 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | canteros | 365 | 365 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | ferrones | 6 | 6 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | hortelanos | 723 | 723 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | mercaderes | 162 | 162 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | mesta | 16 | 16 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | monjes | 797 | 797 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | salineros | 163 | 163 | 0,0 % | se separa en T175 |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 261 | 221 | 15,3 % | carga 975, mercado 696, ruta 184 |
| Canteros | 383 | 365 | 4,7 % | mercado 810, carga 565, ruta 76 |
| Ferrones | 128 | 6 | 95,3 % | mercado 544, carga 480, cometido 40 |
| Hortelanos | 705 | 766 | 8,0 % | mercado 1108, carga 677, ruta 200 |
| Mercaderes | 198 | 160 | 19,2 % | carga 816, mercado 787, ruta 102 |
| Mesta | 58 | 12 | 79,3 % | mercado 1346, carga 479, cometido 18 |
| Monjes | 789 | 655 | 17,0 % | mercado 1179, carga 684, ruta 206 |
| Salineros | 226 | 140 | 38,1 % | mercado 906, carga 374, construir 60 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | T143 | **no** | **no** | 4 |
| 1492 | Canteros | **no** | T111 | T111 | 3 |
| 1492 | Ferrones | **no** | **no** | **no** | 3 |
| 1492 | Hortelanos | T68 | **no** | **no** | 4 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | **no** | **no** | **no** | 2 |
| 1492 | Monjes | T48 | T200 | T200 | 5 |
| 1492 | Salineros | **no** | **no** | **no** | 2 |
| 1492-2 | Arrieros | **no** | **no** | **no** | 3 |
| 1492-2 | Canteros | **no** | T109 | T109 | 3 |
| 1492-2 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-2 | Hortelanos | T58 | **no** | **no** | 4 |
| 1492-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-2 | Mesta | **no** | **no** | **no** | 2 |
| 1492-2 | Monjes | T43 | **no** | **no** | 4 |
| 1492-2 | Salineros | T75 | **no** | **no** | 4 |
| 1492-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1492-3 | Canteros | **no** | T111 | T111 | 3 |
| 1492-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-3 | Hortelanos | T62 | T109 | T109 | 5 |
| 1492-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-3 | Mesta | **no** | **no** | **no** | 2 |
| 1492-3 | Monjes | T48 | **no** | **no** | 4 |
| 1492-3 | Salineros | T72 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 1087 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 131 | 1221 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 9 | 425 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 124 | 357 | 794 |
| 1492 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1169 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 897 | 840 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 106 | 525 | 721 |
| 1492-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 631 | 1269 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 1209 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 6 | 412 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 141 | 328 | 724 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1264 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 899 | 836 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 83 | 631 | 686 |
| 1492-2 | Salineros | 0 | 0 | 0 | 0 | 46 | 714 | 1067 |
| 1492-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 908 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 1238 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 39 | 38 | 595 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 30 | 771 | 948 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1206 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 898 | 837 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 99 | 515 | 756 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 30 | 852 | 986 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 827 | 845 | 843 | 0 | 169 |
| Canteros | 630 | 648 | 647 | 0 | 80 |
| Ferrones | 477 | 494 | 494 | 0 | 45 |
| Hortelanos | 936 | 954 | 941 | 4 | 221 |
| Mercaderes | 731 | 749 | 746 | 0 | 90 |
| Mesta | 762 | 780 | 780 | 0 | 19 |
| Monjes | 1000 | 1018 | 1010 | 4 | 239 |
| Salineros | 625 | 641 | 636 | 3 | 92 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 27
- incorporar: comarca-con-duenyo: 3
- construir: comarca-ajena: 1

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 65 | 97 | 118 | 143 | 155 | 187 | 206 | 227 | 244 | 261 |
| Canteros | 70 | 91 | 107 | 118 | 131 | 335 | 351 | 359 | 375 | 383 |
| Ferrones | 43 | 45 | 68 | 91 | 109 | 131 | 135 | 119 | 125 | 128 |
| Hortelanos | 187 | 200 | 280 | 383 | 413 | 520 | 568 | 591 | 678 | 705 |
| Mercaderes | 60 | 83 | 110 | 126 | 139 | 150 | 166 | 171 | 187 | 198 |
| Mesta | 38 | 38 | 55 | 65 | 67 | 72 | 72 | 62 | 61 | 58 |
| Monjes | 76 | 132 | 345 | 403 | 469 | 545 | 598 | 655 | 694 | 789 |
| Salineros | 60 | 70 | 74 | 151 | 165 | 192 | 206 | 201 | 209 | 226 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `29f53b4fc2b1f74f6e81c923ad49abfb8bf66fc210443d63ea79e3d8ba6c332b`
- semilla `1492-2`: `95028cce8582a1ca7e77da53303679eb96ac6680e7f89bea14c667608870eb62`
- semilla `1492-3`: `584ae4a716753e12329e4aacd5604ed13dba242f92562160bcaec39289ddec26`
