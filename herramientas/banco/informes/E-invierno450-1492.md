# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 695 de prestigio (227,9 % de la mediana) y **Ferrones** cierra la clasificación con 123 (40,3 % de la mediana). La mediana de prestigio es 305. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `702fb5cd45e685534e9c7ff703e7c5ede73f1005` |
| Etiqueta del informe | E-invierno450-1492 |
| Cambios experimentales | estaciones.factorPanMil.invierno=450 (ensayo T-047) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `de017dc6f6406b3b06271fcf34cf2110b07e5e8f34af15e7f77667b049dc66e1` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 40 filas sin cerrar de 157.

117 cumplen, 37 incumplen y 3 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 74,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 232 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1492 | canteros | — | 131,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 413 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1492 | ferrones | — | 35,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 111 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1492 | hortelanos | — | 190,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 595 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1492 | mercaderes | — | 62,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 195 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1492 | mesta | — | 125,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 394 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1492 | monjes | — | 219,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 686 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1492 | salineros | — | -5,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -18 sobre una mediana exacta de 313 |
| actividad | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | ferrones | — | 13 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 26 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | ferrones | — | 6,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 13 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | salineros | — | 94 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 188 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492 | arrieros | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1492 | canteros | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 11,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 23 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 39 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 78 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 44,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 92 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 155 · a mano 155 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 152 · a mano 152 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 459 · a mano 459 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 54 · a mano 54 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 24 · a mano 24 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 810 · a mano 810 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 110 · a mano 110 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 149 · a mano 149 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 148 · a mano 148 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 325 · a mano 325 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 328 · a mano 328 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 687 · a mano 687 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -13 · a mano -13 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -32 · a mano -32 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 2 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 52,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 164 sobre una mediana exacta de 311 |
| prestigio | casa y partida | 1492-2 | canteros | — | 133,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 416 sobre una mediana exacta de 311 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 27,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 86 sobre una mediana exacta de 311 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 203,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 634 sobre una mediana exacta de 311 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 54,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 168 sobre una mediana exacta de 311 |
| prestigio | casa y partida | 1492-2 | mesta | — | 137,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 428 sobre una mediana exacta de 311 |
| prestigio | casa y partida | 1492-2 | monjes | — | 245,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 764 sobre una mediana exacta de 311 |
| prestigio | casa y partida | 1492-2 | salineros | — | 66,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 206 sobre una mediana exacta de 311 |
| actividad | casa y partida | 1492-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | ferrones | — | 11 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 22 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | ferrones | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-2 | arrieros | — | 12,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 25 de 200 turnos |
| escasez | casa y partida | 1492-2 | canteros | — | 4,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 9 de 200 turnos |
| escasez | casa y partida | 1492-2 | ferrones | — | 15,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 31 de 200 turnos |
| escasez | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mercaderes | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| escasez | casa y partida | 1492-2 | mesta | — | 9,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 19 de 200 turnos |
| escasez | casa y partida | 1492-2 | monjes | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1492-2 | salineros | — | 14,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 29 de 200 turnos |
| precios | partida | 1492-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-2 | — | — | 39,4 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 82 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1492-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 162 · a mano 162 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 209 · a mano 209 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 397 · a mano 397 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 59 · a mano 59 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 29 · a mano 29 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 456 · a mano 456 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 748 · a mano 748 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 60 · a mano 60 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 139 · a mano 139 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 201 · a mano 201 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 285 · a mano 285 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 379 · a mano 379 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 659 · a mano 659 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 277 · a mano 277 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 218 · a mano 218 · el dominio coincide turno a turno |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T109 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 49,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 202 sobre una mediana exacta de 404,5 |
| prestigio | casa y partida | 1492-3 | canteros | — | 98,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 400 sobre una mediana exacta de 404,5 |
| prestigio | casa y partida | 1492-3 | ferrones | — | 42,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 173 sobre una mediana exacta de 404,5 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 195,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 792 sobre una mediana exacta de 404,5 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 48,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 195 sobre una mediana exacta de 404,5 |
| prestigio | casa y partida | 1492-3 | mesta | — | 107,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 435 sobre una mediana exacta de 404,5 |
| prestigio | casa y partida | 1492-3 | monjes | — | 156,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 634 sobre una mediana exacta de 404,5 |
| prestigio | casa y partida | 1492-3 | salineros | — | 101,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 409 sobre una mediana exacta de 404,5 |
| actividad | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | ferrones | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1492-3 | arrieros | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1492-3 | canteros | — | 4,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 9 de 200 turnos |
| escasez | casa y partida | 1492-3 | ferrones | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mesta | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1492-3 | monjes | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1492-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492-3 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-arlanza, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1492-3 | — | — | 40,9 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 85 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1492-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 119 · a mano 119 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 199 · a mano 199 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 314 · a mano 314 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 496 · a mano 496 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 57 · a mano 57 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 35 · a mano 35 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 405 · a mano 405 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 765 · a mano 765 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 115 · a mano 115 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 147 · a mano 147 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 160 · a mano 160 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 312 · a mano 312 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 327 · a mano 327 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 619 · a mano 619 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 163 · a mano 163 · el dominio coincide turno a turno |
| dominio | partida | 1492-3 | — | — | 49 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T49 |
| obra mayor | partida | 1492-3 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T107 |
| ganadores | campaña | 1492 | — | — | 0 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🟢 cumple | ganan monjes, monjes, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 65,2 %
  - Canteros: 134,4 %
  - Ferrones: 40,3 %
  - Hortelanos: 221,0 %
  - Mercaderes: 61,0 %
  - Mesta: 137,4 %
  - Monjes: 227,9 %
  - Salineros: 65,2 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 33,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Salineros (semilla 1492): 39,0 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 247 de 403 comarcas
  - región 01-iberico-alto-duero: 6
  - región 02-meseta-norte: 31
  - región 03-cantabrico: 21
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 36
  - región 06-meseta-sur: 11
  - región 07-ebro-pirineo: 14
  - región 09-andalucia: 45
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 695 | 227,9 % | 1 | 2 | 1208 | 14 | 1560 | 5,0 % | 2,0 % |
| Hortelanos | 674 | 221,0 % | 2 | 2 | 762 | 10 | 1739 | 0,0 % | 2,0 % |
| Mesta | 419 | 137,4 % | 3 | 1 | 66 | 2 | 8139 | 9,5 % | 4,5 % |
| Canteros | 410 | 134,4 % | 4 | 1 | 134 | 2 | 570 | 4,0 % | 1,0 % |
| Arrieros | 199 | 65,2 % | 6 | 0 | 122 | 2 | 223 | 6,5 % | 2,0 % |
| Salineros | 199 | 65,2 % | 6 | 0 | 403 | 5 | 2827 | 18,0 % | 33,5 % |
| Mercaderes | 186 | 61,0 % | 6 | 0 | 90 | 1 | 108 | 2,0 % | 0,0 % |
| Ferrones | 123 | 40,3 % | 8 | 0 | 67 | 1 | 158 | 9,0 % | 9,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 24 | 13 | 0 | 0 | 0 | 136 | 0 | 0 | 38 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 120 | 0 | 0 | 135 |
| Ferrones | 13 | 11 | 0 | 0 | 0 | 85 | 0 | 0 | 45 |
| Hortelanos | 152 | 77 | 80 | 0 | 0 | 176 | 0 | 0 | 188 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 139 | 0 | 0 | 25 |
| Mesta | 13 | 16 | 0 | 0 | 0 | 24 | 260 | 0 | 125 |
| Monjes | 241 | 109 | 0 | 0 | 0 | 179 | 0 | 0 | 175 |
| Salineros | 80 | 40 | 0 | 0 | 0 | 96 | 0 | 0 | 58 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 105 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 22 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 199 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 77 turnos) |
| Arrieros | 1492-2 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-2 | termina obras mayores | sí |  |
| Ferrones | 1492-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 122 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 31 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1492-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 123 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 49 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 38 turnos) |
| Mesta | 1492-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492-2 | funda pueblas | sí |  |
| Salineros | 1492-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 33 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 136 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 53 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 47 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5715 | 238 | 0 | 0 | 0 | 8 | 0 | 0 | 638 | 1920 | 144 | 445 | 33 | 32 | 0 | 1 |
| Canteros | 0 | 0 | 0 | 5395 | 0 | 514 | 0 | 0 | 4 | 1 | 0 | 128 | 1408 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 3481 | 718 | 0 | 0 | 0 | 5 | 0 | 0 | 118 | 657 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 26856 | 488 | 0 | 0 | 0 | 37 | 1 | 0 | 214 | 1860 | 0 | 0 | 0 | 0 | 0 | 9 |
| Mercaderes | 0 | 0 | 0 | 4236 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 131 | 1247 | 5 | 9 | 1 | 1 | 0 | 0 |
| Mesta | 337 | 19 | 0 | 1874 | 1056 | 0 | 0 | 0 | 4 | 0 | 0 | 24 | 1576 | 0 | 0 | 0 | 0 | 0 | 1 |
| Monjes | 0 | 0 | 0 | 33826 | 3845 | 0 | 0 | 0 | 60 | 0 | 0 | 200 | 1706 | 0 | 0 | 0 | 0 | 6 | 6 |
| Salineros | 0 | 0 | 0 | 9988 | 0 | 0 | 1690 | 0 | 21 | 0 | 0 | 101 | 1273 | 0 | 0 | 0 | 0 | 0 | 6 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 155 | 155 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 321 | 321 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | 54 | 54 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 451 | 451 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 110 | 110 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 148 | 148 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 328 | 328 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | -13 | -13 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 152 | 152 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 459 | 459 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | 24 | 24 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 810 | 810 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 149 | 149 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 325 | 325 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 687 | 687 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | -32 | -32 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 162 | 162 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | canteros | 321 | 321 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | ferrones | 59 | 59 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | hortelanos | 456 | 456 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mercaderes | 60 | 60 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mesta | 201 | 201 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | monjes | 379 | 379 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | salineros | 277 | 277 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | arrieros | 209 | 209 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | canteros | 397 | 397 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | ferrones | 29 | 29 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | hortelanos | 748 | 748 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mercaderes | 139 | 139 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mesta | 285 | 285 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | monjes | 659 | 659 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | salineros | 218 | 218 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | arrieros | 119 | 119 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | canteros | 314 | 314 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | ferrones | 57 | 57 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | hortelanos | 405 | 405 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mercaderes | 115 | 115 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mesta | 160 | 160 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | monjes | 327 | 327 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | salineros | 130 | 130 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | arrieros | 199 | 199 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | canteros | 496 | 496 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | ferrones | 35 | 35 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | hortelanos | 765 | 765 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mercaderes | 147 | 147 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mesta | 312 | 312 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | monjes | 619 | 619 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | salineros | 163 | 163 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 199 | 187 | 6,0 % | carga 908, mercado 761, ruta 275 |
| Canteros | 410 | 451 | 9,1 % | mercado 853, carga 574, ruta 82 |
| Ferrones | 123 | 29 | 76,4 % | mercado 658, carga 476, cometido 43 |
| Hortelanos | 674 | 774 | 12,9 % | mercado 1134, carga 659, ruta 182 |
| Mercaderes | 186 | 145 | 22,0 % | carga 811, mercado 798, ruta 94 |
| Mesta | 419 | 307 | 26,7 % | mercado 1581, carga 475, ruta 192 |
| Monjes | 695 | 655 | 5,8 % | mercado 1231, carga 656, ruta 177 |
| Salineros | 199 | 116 | 41,7 % | mercado 933, carga 384, ruta 66 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | **no** | **no** | **no** | 3 |
| 1492 | Canteros | **no** | T107 | T107 | 4 |
| 1492 | Ferrones | **no** | **no** | **no** | 3 |
| 1492 | Hortelanos | T68 | **no** | **no** | 4 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | **no** | **no** | **no** | 4 |
| 1492 | Monjes | T48 | **no** | **no** | 4 |
| 1492 | Salineros | **no** | **no** | **no** | 2 |
| 1492-2 | Arrieros | **no** | **no** | **no** | 3 |
| 1492-2 | Canteros | **no** | T109 | T109 | 4 |
| 1492-2 | Ferrones | **no** | **no** | **no** | 3 |
| 1492-2 | Hortelanos | T59 | **no** | **no** | 4 |
| 1492-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-2 | Mesta | **no** | **no** | **no** | 4 |
| 1492-2 | Monjes | T43 | **no** | **no** | 4 |
| 1492-2 | Salineros | T76 | **no** | **no** | 4 |
| 1492-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1492-3 | Canteros | **no** | T107 | T107 | 4 |
| 1492-3 | Ferrones | **no** | **no** | **no** | 3 |
| 1492-3 | Hortelanos | T62 | T114 | T114 | 5 |
| 1492-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-3 | Mesta | **no** | **no** | **no** | 4 |
| 1492-3 | Monjes | T49 | **no** | **no** | 4 |
| 1492-3 | Salineros | T60 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 28 | 268 | 1864 | 1147 | 0 | 5 | 1191 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1278 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 398 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 130 | 363 | 756 |
| 1492 | Mercaderes | 2 | 14 | 78 | 30 | 0 | 0 | 1190 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 883 | 682 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 91 | 545 | 765 |
| 1492-2 | Arrieros | 35 | 174 | 1969 | 1273 | 0 | 626 | 1384 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 139 | 1249 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 350 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 124 | 505 | 681 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1287 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 922 | 656 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 95 | 517 | 712 |
| 1492-2 | Salineros | 0 | 0 | 0 | 0 | 10 | 631 | 1238 |
| 1492-3 | Arrieros | 36 | 302 | 2502 | 1438 | 0 | 5 | 1000 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1278 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 104 | 76 | 517 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 35 | 794 | 825 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1218 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 937 | 641 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 93 | 480 | 763 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 71 | 880 | 885 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 850 | 867 | 866 | 0 | 154 |
| Canteros | 643 | 661 | 660 | 0 | 74 |
| Ferrones | 521 | 538 | 538 | 0 | 50 |
| Hortelanos | 930 | 948 | 936 | 3 | 213 |
| Mercaderes | 723 | 741 | 739 | 0 | 83 |
| Mesta | 949 | 967 | 965 | 1 | 39 |
| Monjes | 994 | 1012 | 1005 | 5 | 213 |
| Salineros | 650 | 666 | 659 | 5 | 99 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 34
- construir: comarca-ajena: 3
- incorporar: comarca-con-duenyo: 2

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 63 | 95 | 117 | 142 | 151 | 177 | 188 | 188 | 193 | 199 |
| Canteros | 66 | 79 | 98 | 109 | 117 | 335 | 351 | 359 | 372 | 410 |
| Ferrones | 60 | 64 | 80 | 97 | 107 | 124 | 125 | 113 | 115 | 123 |
| Hortelanos | 187 | 200 | 280 | 380 | 409 | 510 | 532 | 591 | 613 | 674 |
| Mercaderes | 60 | 74 | 95 | 114 | 127 | 141 | 157 | 162 | 175 | 186 |
| Mesta | 38 | 45 | 151 | 204 | 232 | 281 | 330 | 373 | 421 | 419 |
| Monjes | 72 | 132 | 316 | 398 | 454 | 531 | 585 | 636 | 667 | 695 |
| Salineros | 60 | 71 | 107 | 160 | 176 | 208 | 199 | 164 | 167 | 199 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `2690090e75ce80e511870f98218fd4eac45f14fcf0a5770e54ef6a18d9d5665c`
- semilla `1492-2`: `abffba84db99853f428db8eb5c5d10c303d3403734e3acd965161be1e10de610`
- semilla `1492-3`: `c50e465947c307fc60f2694c564a7def6ceee4d383a6a2cc73234368efed1cff`
