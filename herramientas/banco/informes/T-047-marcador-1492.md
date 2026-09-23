# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 804 de prestigio (357,3 % de la mediana) y **Mesta** cierra la clasificación con 58 (25,8 % de la mediana). La mediana de prestigio es 225. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `42976fd04ac48dfd3557b0480186a1eec27cd84d` |
| Etiqueta del informe | E24-marcador2-1492 |
| Cambios experimentales | marcador: territorio 8/12, explorada 8, trashumante 30, aperos 25, feria 60 |
| Versiones | banco 0.1.0 · métricas 4 · robots 4 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `21d39c1fcdaedef952e8a708ebde3d292dc933bf80386ac9065ceb6a1bd31701` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 41 filas sin cerrar de 157.

116 cumplen, 41 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 112,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 247 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492 | canteros | — | 181,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 400 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492 | ferrones | — | 66,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 146 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492 | hortelanos | — | 272,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 599 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492 | mercaderes | — | 87,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 193 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492 | mesta | — | 18,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 41 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492 | monjes | — | 406,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 894 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492 | salineros | — | -8,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -19 sobre una mediana exacta de 220 |
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
| escasez | casa y partida | 1492 | arrieros | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1492 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 39,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 79 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 46,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 96 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 168 · a mano 168 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 295 · a mano 295 · el dominio coincide turno a turno |
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
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 354 · a mano 354 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 693 · a mano 693 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -12 · a mano -12 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 7 · a mano 7 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 2 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 111 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T111 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 85,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 215 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | canteros | — | 159,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 400 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 33,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 83 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 268,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 673 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 75,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 190 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | mesta | — | 27,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 70 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | monjes | — | 324,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 815 sobre una mediana exacta de 251 |
| prestigio | casa y partida | 1492-2 | salineros | — | 114,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 287 sobre una mediana exacta de 251 |
| actividad | casa y partida | 1492-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | ferrones | — | 10,5 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 21 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | ferrones | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mercaderes | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1492-2 | monjes | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
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
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 152 · a mano 152 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 15 · a mano 15 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 348 · a mano 348 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 563 · a mano 563 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 279 · a mano 279 · el dominio se separa en T193 |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 250 · a mano 250 · el dominio se separa en T193 |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T109 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 73,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 205 sobre una mediana exacta de 280,5 |
| prestigio | casa y partida | 1492-3 | canteros | — | 124,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 350 sobre una mediana exacta de 280,5 |
| prestigio | casa y partida | 1492-3 | ferrones | — | 54,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 154 sobre una mediana exacta de 280,5 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 300,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 842 sobre una mediana exacta de 280,5 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 75,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 211 sobre una mediana exacta de 280,5 |
| prestigio | casa y partida | 1492-3 | mesta | — | 22,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 63 sobre una mediana exacta de 280,5 |
| prestigio | casa y partida | 1492-3 | monjes | — | 250,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 702 sobre una mediana exacta de 280,5 |
| prestigio | casa y partida | 1492-3 | salineros | — | 147,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 413 sobre una mediana exacta de 280,5 |
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
| tierra | partida | 1492-3 | — | — | 41,3 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 86 de 208 comarcas sin tocar |
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
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 403 · a mano 403 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 800 · a mano 800 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 163 · a mano 163 · el dominio se separa en T175 |
| dominio | partida | 1492-3 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492-3 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T109 |
| ganadores | campaña | 1492 | — | — | 0 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🟢 cumple | ganan monjes, monjes, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 170,2 %
  - Ferrones: 56,9 %
  - Hortelanos: 313,3 %
  - Mesta: 25,8 %
  - Monjes: 357,3 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 33,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Salineros (semilla 1492): 39,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 249 de 403 comarcas
  - región 01-iberico-alto-duero: 7
  - región 02-meseta-norte: 31
  - región 03-cantabrico: 21
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 36
  - región 06-meseta-sur: 12
  - región 07-ebro-pirineo: 13
  - región 08-levante: 1
  - región 09-andalucia: 45
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 804 | 357,3 % | 1 | 2 | 1326 | 14 | 1689 | 2,0 % | 2,0 % |
| Hortelanos | 705 | 313,3 % | 2 | 2 | 822 | 11 | 1151 | 0,0 % | 2,5 % |
| Canteros | 383 | 170,2 % | 3 | 1 | 108 | 1 | 453 | 0,0 % | 1,0 % |
| Salineros | 227 | 100,9 % | 5 | 0 | 449 | 5 | 3187 | 17,0 % | 33,5 % |
| Arrieros | 222 | 98,7 % | 5 | 0 | 128 | 2 | 102 | 0,5 % | 2,0 % |
| Mercaderes | 198 | 88,0 % | 5 | 0 | 90 | 1 | 101 | 1,0 % | 0,5 % |
| Ferrones | 128 | 56,9 % | 7 | 0 | 68 | 1 | 94 | 10,0 % | 8,0 % |
| Mesta | 58 | 25,8 % | 8 | 0 | 34 | 1 | 110 | 8,0 % | 5,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 25 | 13 | 0 | 0 | 0 | 147 | 0 | 0 | 38 |
| Canteros | 21 | 8 | 120 | 0 | 0 | 136 | 0 | 0 | 98 |
| Ferrones | 13 | 11 | 0 | 0 | 0 | 72 | 0 | 25 | 33 |
| Hortelanos | 164 | 88 | 80 | 0 | 0 | 168 | 0 | 0 | 205 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 149 | 0 | 0 | 25 |
| Mesta | 6 | 8 | 0 | 0 | 0 | 35 | 0 | 0 | 25 |
| Monjes | 265 | 109 | 40 | 0 | 0 | 205 | 0 | 0 | 188 |
| Salineros | 90 | 43 | 0 | 0 | 0 | 91 | 0 | 0 | 58 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 70 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 55 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 49 turnos) |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 86 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 74 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 27 turnos) |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 178 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 22 turnos) |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 199 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 79 turnos) |
| Arrieros | 1492-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 89 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 44 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 41 turnos) |
| Canteros | 1492-2 | termina obras mayores | sí |  |
| Ferrones | 1492-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 153 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 28 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 17 turnos) |
| Mesta | 1492-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 193 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 184 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 16 turnos) |
| Monjes | 1492-2 | funda pueblas | sí |  |
| Salineros | 1492-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 87 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 60 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 39 turnos) |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 101 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 51 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 32 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no conoce ningún invernadero al que pueda llegar el ganado (mapa, 192 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 180 turnos); no hay maravedís para formar un rebaño sin quedarse sin colchón (recursos, 12 turnos) |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 6023 | 240 | 0 | 0 | 0 | 9 | 0 | 0 | 362 | 1384 | 0 | 0 | 0 | 0 | 0 | 1 |
| Canteros | 0 | 0 | 0 | 5623 | 0 | 503 | 0 | 0 | 2 | 1 | 0 | 152 | 1361 | 0 | 0 | 0 | 0 | 0 | 0 |
| Ferrones | 0 | 0 | 0 | 3148 | 1004 | 0 | 0 | 483 | 5 | 0 | 4 | 97 | 578 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 26039 | 573 | 0 | 0 | 0 | 39 | 1 | 0 | 205 | 1899 | 0 | 0 | 0 | 0 | 0 | 10 |
| Mercaderes | 0 | 0 | 0 | 4408 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 145 | 1273 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 2 | 0 | 0 | 1552 | 1064 | 0 | 0 | 0 | 2 | 0 | 0 | 39 | 1740 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 36454 | 4116 | 0 | 0 | 0 | 62 | 0 | 0 | 229 | 1802 | 0 | 0 | 0 | 0 | 7 | 5 |
| Salineros | 0 | 0 | 0 | 11063 | 0 | 0 | 1808 | 0 | 22 | 0 | 0 | 86 | 1270 | 0 | 0 | 0 | 0 | 0 | 5 |

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
| 1492 | T100 | monjes | 354 | 354 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | -12 | -12 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 295 | 295 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 365 | 365 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | -1 | -1 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 811 | 811 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 168 | 168 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 4 | 4 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 693 | 693 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | 7 | 7 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 162 | 162 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | canteros | 325 | 325 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | ferrones | 41 | 41 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | hortelanos | 456 | 456 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | mercaderes | 96 | 96 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | mesta | 42 | 42 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | monjes | 348 | 348 | 0,0 % | se separa en T193 |
| 1492-2 | T100 | salineros | 279 | 279 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | arrieros | 187 | 187 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | canteros | 365 | 365 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | ferrones | 12 | 12 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | hortelanos | 765 | 765 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | mercaderes | 152 | 152 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | mesta | 15 | 15 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | monjes | 563 | 563 | 0,0 % | se separa en T193 |
| 1492-2 | T200 | salineros | 250 | 250 | 0,0 % | se separa en T193 |
| 1492-3 | T100 | arrieros | 122 | 122 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | ferrones | 34 | 34 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | hortelanos | 363 | 363 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | mercaderes | 123 | 123 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | mesta | 41 | 41 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | monjes | 403 | 403 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | salineros | 130 | 130 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | arrieros | 202 | 202 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | canteros | 365 | 365 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | ferrones | 6 | 6 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | hortelanos | 723 | 723 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | mercaderes | 162 | 162 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | mesta | 16 | 16 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | monjes | 800 | 800 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | salineros | 163 | 163 | 0,0 % | se separa en T175 |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 222 | 228 | 2,6 % | mercado 716, carga 674, ruta 188 |
| Canteros | 383 | 365 | 4,7 % | mercado 810, carga 565, ruta 76 |
| Ferrones | 128 | 6 | 95,3 % | mercado 544, carga 480, cometido 40 |
| Hortelanos | 705 | 766 | 8,0 % | mercado 1094, carga 665, ruta 188 |
| Mercaderes | 198 | 161 | 18,7 % | mercado 849, carga 595, ruta 102 |
| Mesta | 58 | 12 | 79,3 % | mercado 1346, carga 479, cometido 18 |
| Monjes | 804 | 685 | 14,8 % | mercado 1168, carga 691, ruta 213 |
| Salineros | 227 | 140 | 38,3 % | mercado 909, carga 374, construir 60 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | **no** | **no** | **no** | 3 |
| 1492 | Canteros | **no** | T111 | T111 | 3 |
| 1492 | Ferrones | **no** | **no** | **no** | 3 |
| 1492 | Hortelanos | T68 | **no** | **no** | 4 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | **no** | **no** | **no** | 2 |
| 1492 | Monjes | T48 | T198 | T198 | 5 |
| 1492 | Salineros | **no** | **no** | **no** | 2 |
| 1492-2 | Arrieros | **no** | **no** | **no** | 3 |
| 1492-2 | Canteros | **no** | T109 | T109 | 3 |
| 1492-2 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-2 | Hortelanos | T59 | **no** | **no** | 4 |
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
| 1492 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 1173 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 131 | 1221 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 9 | 425 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 124 | 357 | 794 |
| 1492 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1230 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 897 | 840 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 107 | 527 | 716 |
| 1492-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 631 | 1339 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 1209 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 6 | 412 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 137 | 337 | 731 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1308 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 899 | 836 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 78 | 625 | 698 |
| 1492-2 | Salineros | 0 | 0 | 0 | 0 | 46 | 714 | 1067 |
| 1492-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 979 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 1238 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 39 | 38 | 595 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 30 | 771 | 948 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1263 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 898 | 837 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 98 | 514 | 752 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 46 | 755 | 983 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 719 | 737 | 736 | 0 | 169 |
| Canteros | 630 | 648 | 647 | 0 | 80 |
| Ferrones | 477 | 494 | 494 | 0 | 45 |
| Hortelanos | 918 | 936 | 922 | 4 | 210 |
| Mercaderes | 664 | 682 | 679 | 0 | 90 |
| Mesta | 762 | 780 | 780 | 0 | 19 |
| Monjes | 1003 | 1021 | 1013 | 4 | 243 |
| Salineros | 627 | 643 | 637 | 3 | 93 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 31
- incorporar: comarca-con-duenyo: 3
- construir: comarca-ajena: 1

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 65 | 97 | 113 | 138 | 147 | 176 | 195 | 204 | 214 | 222 |
| Canteros | 70 | 91 | 107 | 118 | 131 | 335 | 351 | 359 | 375 | 383 |
| Ferrones | 43 | 45 | 68 | 91 | 109 | 131 | 135 | 119 | 125 | 128 |
| Hortelanos | 187 | 200 | 280 | 382 | 412 | 522 | 560 | 588 | 674 | 705 |
| Mercaderes | 60 | 83 | 110 | 126 | 139 | 150 | 166 | 171 | 187 | 198 |
| Mesta | 38 | 38 | 55 | 65 | 67 | 72 | 72 | 62 | 61 | 58 |
| Monjes | 76 | 132 | 345 | 404 | 469 | 544 | 600 | 664 | 699 | 804 |
| Salineros | 60 | 70 | 74 | 150 | 164 | 191 | 206 | 200 | 208 | 227 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `41c817d462a175879259155fd0e6315756686658d1f14c9bd76209c69c0db434`
- semilla `1492-2`: `103518594e957db6f7fd4320e8cf4837c4f937c9c102b92479d219bb9b84d34e`
- semilla `1492-3`: `50600c5cc44600af29ad052aa12e66b33c198196e517cfe6405068c883348486`
