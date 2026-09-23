# Banco de pruebas · semilla 1212

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Hortelanos** va en cabeza con 905 de prestigio (281,9 % de la mediana) y **Ferrones** cierra la clasificación con 33 (10,3 % de la mediana). La mediana de prestigio es 321. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `42976fd04ac48dfd3557b0480186a1eec27cd84d` |
| Etiqueta del informe | E24-marcador2-1212 |
| Cambios experimentales | marcador reequilibrado |
| Versiones | banco 0.1.0 · métricas 4 · robots 4 · reglas 1 |
| Semillas | 1212, 1212-2, 1212-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `21d39c1fcdaedef952e8a708ebde3d292dc933bf80386ac9065ceb6a1bd31701` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 44 filas sin cerrar de 157.

113 cumplen, 44 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1212 | arrieros | — | 119,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 305 sobre una mediana exacta de 254,5 |
| prestigio | casa y partida | 1212 | canteros | — | 157,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 400 sobre una mediana exacta de 254,5 |
| prestigio | casa y partida | 1212 | ferrones | — | -8,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -21 sobre una mediana exacta de 254,5 |
| prestigio | casa y partida | 1212 | hortelanos | — | 378,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 963 sobre una mediana exacta de 254,5 |
| prestigio | casa y partida | 1212 | mercaderes | — | 64,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 164 sobre una mediana exacta de 254,5 |
| prestigio | casa y partida | 1212 | mesta | — | 24,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 63 sobre una mediana exacta de 254,5 |
| prestigio | casa y partida | 1212 | monjes | — | 287,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 731 sobre una mediana exacta de 254,5 |
| prestigio | casa y partida | 1212 | salineros | — | 80,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 204 sobre una mediana exacta de 254,5 |
| actividad | casa y partida | 1212 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | ferrones | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1212 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | ferrones | — | 41 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 82 de 200 turnos |
| escasez | casa y partida | 1212 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | mercaderes | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1212 | mesta | — | 4,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 9 de 200 turnos |
| escasez | casa y partida | 1212 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | salineros | — | 10 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 20 de 200 turnos |
| precios | partida | 1212 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212 | — | — | 59,0 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 147 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 99 · a mano 99 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 131 · a mano 131 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 399 · a mano 399 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -57 · a mano -57 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -77 · a mano -77 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 430 · a mano 430 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 968 · a mano 968 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 63 · a mano 63 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 155 · a mano 155 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 24 · a mano 24 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 16 · a mano 16 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 308 · a mano 308 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 649 · a mano 649 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 165 · a mano 165 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | salineros | T200 | 13,9 | % de diferencia de prestigio con el mismo plan | < 5 % | 🔴 incumple | por bloques 173 · a mano 201 · el dominio se separa en T55 |
| dominio | partida | 1212 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 2 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212 | — | — | 110 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 4 de 8 casas lo alcanzan; la primera en T110 |
| prestigio | casa y partida | 1212-2 | arrieros | — | 66,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 207 sobre una mediana exacta de 313,5 |
| prestigio | casa y partida | 1212-2 | canteros | — | 134,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 420 sobre una mediana exacta de 313,5 |
| prestigio | casa y partida | 1212-2 | ferrones | — | -8,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -27 sobre una mediana exacta de 313,5 |
| prestigio | casa y partida | 1212-2 | hortelanos | — | 269,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 845 sobre una mediana exacta de 313,5 |
| prestigio | casa y partida | 1212-2 | mercaderes | — | 54,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 171 sobre una mediana exacta de 313,5 |
| prestigio | casa y partida | 1212-2 | mesta | — | 51,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 162 sobre una mediana exacta de 313,5 |
| prestigio | casa y partida | 1212-2 | monjes | — | 207,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 651 sobre una mediana exacta de 313,5 |
| prestigio | casa y partida | 1212-2 | salineros | — | 175,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 549 sobre una mediana exacta de 313,5 |
| actividad | casa y partida | 1212-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | canteros | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | ferrones | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | mesta | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | salineros | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1212-2 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | canteros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1212-2 | ferrones | — | 39,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 79 de 200 turnos |
| escasez | casa y partida | 1212-2 | hortelanos | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1212-2 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mesta | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1212-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1212-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-2 | — | — | 63,1 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 157 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 127 · a mano 127 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 191 · a mano 191 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 395 · a mano 395 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -57 · a mano -57 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -77 · a mano -77 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 491 · a mano 491 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 813 · a mano 813 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 107 · a mano 107 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 147 · a mano 147 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 45 · a mano 45 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 26 · a mano 26 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 231 · a mano 231 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 555 · a mano 555 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 272 · a mano 272 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio se separa en T79 |
| dominio | partida | 1212-2 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212-2 | — | — | 71 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T71 |
| prestigio | casa y partida | 1212-3 | arrieros | — | 81,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 242 sobre una mediana exacta de 296 |
| prestigio | casa y partida | 1212-3 | canteros | — | 118,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 350 sobre una mediana exacta de 296 |
| prestigio | casa y partida | 1212-3 | ferrones | — | 49,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 147 sobre una mediana exacta de 296 |
| prestigio | casa y partida | 1212-3 | hortelanos | — | 306,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 908 sobre una mediana exacta de 296 |
| prestigio | casa y partida | 1212-3 | mercaderes | — | 56,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 166 sobre una mediana exacta de 296 |
| prestigio | casa y partida | 1212-3 | mesta | — | 17,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 51 sobre una mediana exacta de 296 |
| prestigio | casa y partida | 1212-3 | monjes | — | 254,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 753 sobre una mediana exacta de 296 |
| prestigio | casa y partida | 1212-3 | salineros | — | 192,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 570 sobre una mediana exacta de 296 |
| actividad | casa y partida | 1212-3 | arrieros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | mesta | — | 5,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 11 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1212-3 | mesta | — | 10,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 21 de 200 turnos |
| escasez | casa y partida | 1212-3 | monjes | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1212-3 | salineros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| precios | partida | 1212-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-3 | — | — | 46,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 115 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 146 · a mano 146 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 203 · a mano 203 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 325 · a mano 325 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 399 · a mano 399 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 40 · a mano 40 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 23 · a mano 23 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 433 · a mano 433 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 949 · a mano 949 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 99 · a mano 99 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 36 · a mano 36 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 348 · a mano 348 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 564 · a mano 564 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 284 · a mano 284 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 506 · a mano 506 · el dominio coincide turno a turno |
| dominio | partida | 1212-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1212-3 | — | — | 93 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T93 |
| ganadores | campaña | 1212 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan hortelanos, hortelanos, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 78,2 %
  - Canteros: 121,5 %
  - Ferrones: 10,3 %
  - Hortelanos: 281,9 %
  - Mercaderes: 52,0 %
  - Mesta: 28,7 %
  - Monjes: 221,8 %
  - Salineros: 137,4 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1212): 41,0 % de los turnos
  - Ferrones (semilla 1212-2): 39,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 187 de 403 comarcas
  - región 01-iberico-alto-duero: 4
  - región 02-meseta-norte: 7
  - región 03-cantabrico: 17
  - región 04-galicia-minho: 28
  - región 05-central-extremadura: 22
  - región 06-meseta-sur: 10
  - región 07-ebro-pirineo: 29
  - región 08-levante: 15
  - región 09-andalucia: 47
  - región 10-portugal-sur: 8

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Hortelanos | 905 | 281,9 % | 1 | 3 | 1010 | 11 | 3276 | 0,5 % | 1,5 % |
| Monjes | 712 | 221,8 % | 2 | 1 | 1081 | 11 | 1022 | 1,5 % | 2,0 % |
| Salineros | 441 | 137,4 % | 4 | 0 | 706 | 9 | 3705 | 4,0 % | 3,0 % |
| Canteros | 390 | 121,5 % | 4 | 1 | 116 | 1 | 468 | 1,0 % | 2,0 % |
| Arrieros | 251 | 78,2 % | 5 | 0 | 80 | 1 | 202 | 0,0 % | 1,5 % |
| Mercaderes | 167 | 52,0 % | 6 | 0 | 91 | 1 | 104 | 2,0 % | 0,5 % |
| Mesta | 92 | 28,7 % | 7 | 0 | 36 | 1 | 110 | 8,5 % | 4,0 % |
| Ferrones | 33 | 10,3 % | 8 | 0 | 30 | 1 | 95 | 27,5 % | 3,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 16 | 8 | 40 | 0 | 0 | 149 | 0 | 0 | 38 |
| Canteros | 23 | 11 | 120 | 0 | 0 | 133 | 0 | 0 | 105 |
| Ferrones | 6 | 8 | 0 | 0 | 0 | 51 | 0 | 8 | 15 |
| Hortelanos | 202 | 88 | 160 | 0 | 0 | 208 | 0 | 0 | 248 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 120 | 0 | 0 | 25 |
| Mesta | 7 | 8 | 0 | 0 | 0 | 35 | 40 | 0 | 20 |
| Monjes | 216 | 88 | 80 | 0 | 0 | 163 | 0 | 0 | 168 |
| Salineros | 141 | 72 | 0 | 0 | 0 | 155 | 0 | 0 | 82 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1212 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 166 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 31 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 30 turnos) |
| Canteros | 1212 | termina obras mayores | sí |  |
| Ferrones | 1212 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1212 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 140 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 37 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 35 turnos) |
| Mesta | 1212 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 195 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 191 turnos); no hay maravedís para formar un rebaño sin quedarse sin colchón (recursos, 12 turnos) |
| Monjes | 1212 | funda pueblas | sí |  |
| Salineros | 1212 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 91 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 46 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 43 turnos) |
| Canteros | 1212-2 | termina obras mayores | sí |  |
| Ferrones | 1212-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1212-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 98 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 44 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 42 turnos) |
| Mesta | 1212-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1212-2 | funda pueblas | sí |  |
| Salineros | 1212-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 92 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 48 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 36 turnos) |
| Canteros | 1212-3 | termina obras mayores | sí |  |
| Ferrones | 1212-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1212-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 126 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 31 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 27 turnos) |
| Mesta | 1212-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 179 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 21 turnos) |
| Monjes | 1212-3 | funda pueblas | sí |  |
| Salineros | 1212-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 4524 | 783 | 0 | 0 | 0 | 8 | 0 | 0 | 362 | 1892 | 0 | 0 | 0 | 0 | 0 | 0 |
| Canteros | 0 | 0 | 0 | 5573 | 2 | 507 | 0 | 0 | 3 | 1 | 0 | 150 | 1270 | 0 | 0 | 0 | 0 | 0 | 0 |
| Ferrones | 0 | 0 | 0 | 1403 | 497 | 0 | 0 | 193 | 5 | 0 | 2 | 50 | 542 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 34308 | 1634 | 0 | 0 | 0 | 53 | 1 | 0 | 190 | 1879 | 0 | 0 | 0 | 0 | 0 | 10 |
| Mercaderes | 0 | 0 | 0 | 4385 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 144 | 1248 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 4 | 0 | 0 | 1578 | 1263 | 0 | 0 | 0 | 2 | 0 | 0 | 38 | 1791 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 30426 | 3834 | 0 | 0 | 0 | 54 | 1 | 0 | 199 | 1804 | 0 | 0 | 0 | 0 | 5 | 5 |
| Salineros | 0 | 0 | 0 | 17463 | 0 | 0 | 2025 | 0 | 26 | 0 | 0 | 170 | 1907 | 0 | 0 | 0 | 0 | 0 | 8 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1212 | T100 | arrieros | 99 | 99 | 0,0 % | se separa en T55 |
| 1212 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T55 |
| 1212 | T100 | ferrones | -57 | -57 | 0,0 % | se separa en T55 |
| 1212 | T100 | hortelanos | 430 | 430 | 0,0 % | se separa en T55 |
| 1212 | T100 | mercaderes | 63 | 63 | 0,0 % | se separa en T55 |
| 1212 | T100 | mesta | 24 | 24 | 0,0 % | se separa en T55 |
| 1212 | T100 | monjes | 308 | 308 | 0,0 % | se separa en T55 |
| 1212 | T100 | salineros | 165 | 165 | 0,0 % | se separa en T55 |
| 1212 | T200 | arrieros | 131 | 131 | 0,0 % | se separa en T55 |
| 1212 | T200 | canteros | 399 | 399 | 0,0 % | se separa en T55 |
| 1212 | T200 | ferrones | -77 | -77 | 0,0 % | se separa en T55 |
| 1212 | T200 | hortelanos | 968 | 968 | 0,0 % | se separa en T55 |
| 1212 | T200 | mercaderes | 155 | 155 | 0,0 % | se separa en T55 |
| 1212 | T200 | mesta | 16 | 16 | 0,0 % | se separa en T55 |
| 1212 | T200 | monjes | 649 | 649 | 0,0 % | se separa en T55 |
| 1212 | T200 | salineros | 173 | 201 | 13,9 % | se separa en T55 |
| 1212-2 | T100 | arrieros | 127 | 127 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | canteros | 321 | 321 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | ferrones | -57 | -57 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | hortelanos | 491 | 491 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | mercaderes | 107 | 107 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | mesta | 45 | 45 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | monjes | 231 | 231 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | salineros | 272 | 272 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | arrieros | 191 | 191 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | canteros | 395 | 395 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | ferrones | -77 | -77 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | hortelanos | 813 | 813 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | mercaderes | 147 | 147 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | mesta | 26 | 26 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | monjes | 555 | 555 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | salineros | 375 | 375 | 0,0 % | se separa en T79 |
| 1212-3 | T100 | arrieros | 146 | 146 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | canteros | 325 | 325 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | ferrones | 40 | 40 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | hortelanos | 433 | 433 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mercaderes | 99 | 99 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mesta | 42 | 42 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | monjes | 348 | 348 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | salineros | 284 | 284 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | arrieros | 203 | 203 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | canteros | 399 | 399 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | ferrones | 23 | 23 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | hortelanos | 949 | 949 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mercaderes | 123 | 123 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mesta | 36 | 36 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | monjes | 564 | 564 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | salineros | 506 | 506 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 251 | 175 | 30,3 % | mercado 1043, carga 659, ruta 176 |
| Canteros | 390 | 398 | 2,0 % | mercado 753, carga 551, ruta 70 |
| Ferrones | 33 | -44 | 175,0 % | mercado 588, carga 502, ruta 28 |
| Hortelanos | 905 | 910 | 0,5 % | mercado 1267, carga 655, ruta 172 |
| Mercaderes | 167 | 142 | 15,0 % | mercado 815, carga 576, ruta 82 |
| Mesta | 92 | 26 | 71,7 % | mercado 1369, carga 480, ruta 22 |
| Monjes | 712 | 589 | 17,3 % | mercado 1171, carga 647, ruta 171 |
| Salineros | 441 | 351 | 20,4 % | mercado 1272, carga 595, ruta 118 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1212 | Arrieros | **no** | T157 | T157 | 3 |
| 1212 | Canteros | **no** | T110 | T110 | 3 |
| 1212 | Ferrones | **no** | **no** | **no** | 1 |
| 1212 | Hortelanos | T55 | T139 | T139 | 5 |
| 1212 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212 | Mesta | **no** | **no** | **no** | 2 |
| 1212 | Monjes | T54 | T140 | T140 | 5 |
| 1212 | Salineros | **no** | **no** | **no** | 3 |
| 1212-2 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-2 | Canteros | **no** | T71 | T71 | 4 |
| 1212-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1212-2 | Hortelanos | T62 | T112 | T112 | 5 |
| 1212-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-2 | Mesta | **no** | **no** | **no** | 1 |
| 1212-2 | Monjes | T54 | T134 | T134 | 5 |
| 1212-2 | Salineros | T64 | **no** | **no** | 4 |
| 1212-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-3 | Canteros | **no** | T109 | T109 | 3 |
| 1212-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1212-3 | Hortelanos | T62 | T93 | T93 | 5 |
| 1212-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-3 | Mesta | **no** | **no** | **no** | 2 |
| 1212-3 | Monjes | T43 | **no** | **no** | 4 |
| 1212-3 | Salineros | T64 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1212 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1052 | 1258 |
| 1212 | Canteros | 0 | 0 | 0 | 0 | 0 | 131 | 1223 |
| 1212 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 366 |
| 1212 | Hortelanos | 0 | 0 | 0 | 0 | 90 | 418 | 942 |
| 1212 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1220 |
| 1212 | Mesta | 0 | 0 | 0 | 0 | 0 | 893 | 827 |
| 1212 | Monjes | 0 | 0 | 0 | 0 | 94 | 519 | 782 |
| 1212 | Salineros | 0 | 0 | 0 | 0 | 20 | 677 | 1168 |
| 1212-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 661 | 983 |
| 1212-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 129 | 986 |
| 1212-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 367 |
| 1212-2 | Hortelanos | 0 | 0 | 0 | 0 | 54 | 515 | 997 |
| 1212-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1229 |
| 1212-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 920 | 972 |
| 1212-2 | Monjes | 0 | 0 | 0 | 0 | 98 | 557 | 772 |
| 1212-2 | Salineros | 0 | 0 | 0 | 0 | 47 | 864 | 879 |
| 1212-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 400 | 1296 |
| 1212-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 131 | 1190 |
| 1212-3 | Ferrones | 0 | 0 | 0 | 0 | 40 | 41 | 604 |
| 1212-3 | Hortelanos | 0 | 0 | 0 | 0 | 73 | 536 | 949 |
| 1212-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1280 |
| 1212-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 955 | 793 |
| 1212-3 | Monjes | 0 | 0 | 0 | 0 | 73 | 636 | 717 |
| 1212-3 | Salineros | 0 | 0 | 0 | 0 | 32 | 703 | 1037 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 832 | 850 | 845 | 0 | 164 |
| Canteros | 602 | 620 | 620 | 0 | 79 |
| Ferrones | 476 | 492 | 492 | 0 | 31 |
| Hortelanos | 984 | 1002 | 994 | 4 | 203 |
| Mercaderes | 630 | 648 | 644 | 0 | 73 |
| Mesta | 774 | 792 | 792 | 0 | 19 |
| Monjes | 936 | 954 | 950 | 3 | 190 |
| Salineros | 936 | 953 | 939 | 6 | 154 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 34
- incorporar: comarca-con-duenyo: 4

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 67 | 93 | 111 | 125 | 138 | 149 | 162 | 224 | 241 | 251 |
| Canteros | 68 | 92 | 108 | 186 | 202 | 336 | 349 | 357 | 370 | 390 |
| Ferrones | 23 | 8 | 1 | 3 | 20 | 30 | 34 | 27 | 29 | 33 |
| Hortelanos | 174 | 246 | 320 | 413 | 513 | 621 | 706 | 780 | 832 | 905 |
| Mercaderes | 55 | 76 | 95 | 111 | 122 | 132 | 140 | 148 | 159 | 167 |
| Mesta | 34 | 42 | 53 | 65 | 68 | 78 | 85 | 84 | 92 | 92 |
| Monjes | 77 | 126 | 279 | 346 | 385 | 448 | 618 | 650 | 682 | 712 |
| Salineros | 88 | 115 | 160 | 243 | 286 | 321 | 354 | 395 | 420 | 441 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1212`: `502c9460610549afefcfeead128502a981783cb8dbefac353717437515ce4188`
- semilla `1212-2`: `697a35e5850fbc8d1646181610246caa72b6f2a21ec9a66f1a270d9f7270db58`
- semilla `1212-3`: `70e5799c3dc139d07bbfe8f52a6d1db5c6a53958d28b5104638f2940ff848d80`
