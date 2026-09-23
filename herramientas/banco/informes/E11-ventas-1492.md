# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 989 de prestigio (492,0 % de la mediana) y **Mesta** cierra la clasificación con 48 (23,9 % de la mediana). La mediana de prestigio es 201. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `1e18b0369cf0a28f00f8870b56fef3f8ae0312f2` |
| Etiqueta del informe | E11-ventas-1492 |
| Cambios experimentales | venta = plaza en tierra de nadie; robots la plantan |
| Versiones | banco 0.1.0 · métricas 4 · robots 4 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `da44b47203a7e1dde312d2dfe88c682a51cd9628cc0179484602a9618c3e887c` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 46 filas sin cerrar de 157.

111 cumplen, 46 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 131,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 222 sobre una mediana exacta de 168,5 |
| prestigio | casa y partida | 1492 | canteros | — | 194,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 327 sobre una mediana exacta de 168,5 |
| prestigio | casa y partida | 1492 | ferrones | — | 65,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 110 sobre una mediana exacta de 168,5 |
| prestigio | casa y partida | 1492 | hortelanos | — | 385,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 649 sobre una mediana exacta de 168,5 |
| prestigio | casa y partida | 1492 | mercaderes | — | 68,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 115 sobre una mediana exacta de 168,5 |
| prestigio | casa y partida | 1492 | mesta | — | 22,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 38 sobre una mediana exacta de 168,5 |
| prestigio | casa y partida | 1492 | monjes | — | 557,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 940 sobre una mediana exacta de 168,5 |
| prestigio | casa y partida | 1492 | salineros | — | -13,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -22 sobre una mediana exacta de 168,5 |
| actividad | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | ferrones | — | 9,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 19 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | ferrones | — | 4,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 9 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mercaderes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | salineros | — | 94 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 188 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492 | arrieros | — | 4,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 9 de 200 turnos |
| escasez | casa y partida | 1492 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 39,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 79 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 45,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 94 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 195 · a mano 195 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 257 · a mano 257 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 294 · a mano 294 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 312 · a mano 312 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 34 · a mano 34 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 1 · a mano 1 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 469 · a mano 469 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 689 · a mano 689 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 87 · a mano 87 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 102 · a mano 102 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 31 · a mano 31 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 11 · a mano 11 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 395 · a mano 395 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 702 · a mano 702 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -5 · a mano -5 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -6 · a mano -6 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 111 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T111 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 62,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 148 sobre una mediana exacta de 237,5 |
| prestigio | casa y partida | 1492-2 | canteros | — | 137,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 327 sobre una mediana exacta de 237,5 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 18,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 45 sobre una mediana exacta de 237,5 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 310,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 737 sobre una mediana exacta de 237,5 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 47,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 112 sobre una mediana exacta de 237,5 |
| prestigio | casa y partida | 1492-2 | mesta | — | 21,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 52 sobre una mediana exacta de 237,5 |
| prestigio | casa y partida | 1492-2 | monjes | — | 497,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 1182 sobre una mediana exacta de 237,5 |
| prestigio | casa y partida | 1492-2 | salineros | — | 140,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 334 sobre una mediana exacta de 237,5 |
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
| escasez | casa y partida | 1492-2 | arrieros | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1492-2 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mercaderes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-2 | mesta | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1492-2 | monjes | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1492-2 | salineros | — | 16,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 33 de 200 turnos |
| precios | partida | 1492-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-2 | — | — | 36,1 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 75 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 136 · a mano 136 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 156 · a mano 156 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 297 · a mano 297 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 312 · a mano 312 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 38 · a mano 38 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 9 · a mano 9 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 436 · a mano 436 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 736 · a mano 736 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 73 · a mano 73 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 94 · a mano 94 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 44 · a mano 44 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 17 · a mano 17 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 403 · a mano 403 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 631 · a mano 631 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 318 · a mano 318 · el dominio se separa en T187 |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 276 · a mano 276 · el dominio se separa en T187 |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T109 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 54,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 122 sobre una mediana exacta de 225 |
| prestigio | casa y partida | 1492-3 | canteros | — | 145,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 327 sobre una mediana exacta de 225 |
| prestigio | casa y partida | 1492-3 | ferrones | — | 42,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 96 sobre una mediana exacta de 225 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 298,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 671 sobre una mediana exacta de 225 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 54,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 123 sobre una mediana exacta de 225 |
| prestigio | casa y partida | 1492-3 | mesta | — | 24,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 55 sobre una mediana exacta de 225 |
| prestigio | casa y partida | 1492-3 | monjes | — | 376 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 846 sobre una mediana exacta de 225 |
| prestigio | casa y partida | 1492-3 | salineros | — | 179,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 403 sobre una mediana exacta de 225 |
| actividad | casa y partida | 1492-3 | arrieros | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1492-3 | monjes | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1492-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-3 | — | — | 39,9 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 83 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 89 · a mano 89 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 119 · a mano 119 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 294 · a mano 294 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 312 · a mano 312 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 31 · a mano 31 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 3 · a mano 3 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 318 · a mano 318 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 616 · a mano 616 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 90 · a mano 90 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 104 · a mano 104 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 43 · a mano 43 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 18 · a mano 18 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 456 · a mano 456 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 757 · a mano 757 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 92 · a mano 92 · el dominio se separa en T97 |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 105 · a mano 105 · el dominio se separa en T97 |
| dominio | partida | 1492-3 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492-3 | — | — | 111 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T111 |
| ganadores | campaña | 1492 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan monjes, monjes, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 162,7 %
  - Ferrones: 41,8 %
  - Hortelanos: 341,3 %
  - Mercaderes: 58,2 %
  - Mesta: 23,9 %
  - Monjes: 492,0 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 33,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Salineros (semilla 1492): 39,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 243 de 403 comarcas
  - región 01-iberico-alto-duero: 7
  - región 02-meseta-norte: 31
  - región 03-cantabrico: 21
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 36
  - región 06-meseta-sur: 9
  - región 07-ebro-pirineo: 13
  - región 09-andalucia: 43
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 989 | 492,0 % | 1 | 2 | 1555 | 20 | 5474 | 3,0 % | 2,0 % |
| Hortelanos | 686 | 341,3 % | 2 | 2 | 840 | 11 | 1658 | 0,0 % | 2,5 % |
| Canteros | 327 | 162,7 % | 4 | 1 | 108 | 1 | 453 | 0,0 % | 1,0 % |
| Salineros | 238 | 118,4 % | 5 | 0 | 445 | 6 | 3290 | 18,5 % | 33,5 % |
| Arrieros | 164 | 81,6 % | 5 | 0 | 144 | 2 | 101 | 3,0 % | 2,0 % |
| Mercaderes | 117 | 58,2 % | 5 | 0 | 90 | 1 | 103 | 1,0 % | 0,5 % |
| Ferrones | 84 | 41,8 % | 7 | 0 | 68 | 1 | 94 | 10,0 % | 8,0 % |
| Mesta | 48 | 23,9 % | 7 | 0 | 34 | 1 | 110 | 8,0 % | 5,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 28 | 40 | 0 | 0 | 0 | 53 | 0 | 0 | 48 |
| Canteros | 21 | 20 | 120 | 0 | 0 | 51 | 0 | 0 | 115 |
| Ferrones | 13 | 27 | 0 | 0 | 0 | 27 | 0 | 10 | 33 |
| Hortelanos | 168 | 227 | 40 | 0 | 0 | 63 | 0 | 0 | 188 |
| Mercaderes | 18 | 20 | 0 | 0 | 0 | 56 | 0 | 0 | 25 |
| Mesta | 6 | 20 | 0 | 0 | 0 | 13 | 0 | 0 | 25 |
| Monjes | 311 | 400 | 0 | 0 | 0 | 76 | 0 | 0 | 208 |
| Salineros | 89 | 113 | 0 | 0 | 0 | 35 | 0 | 0 | 58 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 131 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 55 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 29 turnos) |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 144 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 40 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 27 turnos) |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 178 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 22 turnos) |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 199 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 79 turnos) |
| Arrieros | 1492-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 52 turnos); no sabe precios recientes de dos plazas a su alcance (mapa, 46 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 41 turnos) |
| Canteros | 1492-2 | termina obras mayores | sí |  |
| Ferrones | 1492-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 134 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 31 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 19 turnos) |
| Mesta | 1492-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 193 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 184 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 16 turnos) |
| Monjes | 1492-2 | funda pueblas | sí |  |
| Salineros | 1492-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 125 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 61 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 11 turnos) |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 149 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 26 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 20 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no conoce ningún invernadero al que pueda llegar el ganado (mapa, 192 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 180 turnos); no hay maravedís para formar un rebaño sin quedarse sin colchón (recursos, 12 turnos) |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 6281 | 240 | 0 | 0 | 0 | 4 | 0 | 0 | 350 | 1429 | 0 | 0 | 0 | 0 | 0 | 1 |
| Canteros | 0 | 0 | 0 | 5623 | 0 | 503 | 0 | 0 | 2 | 1 | 0 | 152 | 1361 | 0 | 0 | 0 | 0 | 0 | 0 |
| Ferrones | 0 | 0 | 0 | 3148 | 1004 | 0 | 0 | 483 | 5 | 0 | 4 | 97 | 578 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 28459 | 0 | 0 | 0 | 0 | 36 | 0 | 0 | 204 | 1896 | 0 | 0 | 0 | 0 | 0 | 10 |
| Mercaderes | 0 | 0 | 0 | 4408 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 143 | 1241 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 2 | 0 | 0 | 1552 | 1064 | 0 | 0 | 0 | 2 | 0 | 0 | 39 | 1740 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 39804 | 5219 | 0 | 0 | 0 | 89 | 0 | 0 | 223 | 1798 | 0 | 0 | 0 | 0 | 8 | 11 |
| Salineros | 0 | 0 | 0 | 11166 | 0 | 0 | 1807 | 0 | 22 | 0 | 0 | 94 | 1270 | 0 | 0 | 0 | 0 | 0 | 6 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 195 | 195 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 294 | 294 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | 34 | 34 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 469 | 469 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 87 | 87 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 31 | 31 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 395 | 395 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | -5 | -5 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 257 | 257 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 312 | 312 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | 1 | 1 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 689 | 689 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 102 | 102 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 11 | 11 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 702 | 702 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | -6 | -6 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 136 | 136 | 0,0 % | se separa en T187 |
| 1492-2 | T100 | canteros | 297 | 297 | 0,0 % | se separa en T187 |
| 1492-2 | T100 | ferrones | 38 | 38 | 0,0 % | se separa en T187 |
| 1492-2 | T100 | hortelanos | 436 | 436 | 0,0 % | se separa en T187 |
| 1492-2 | T100 | mercaderes | 73 | 73 | 0,0 % | se separa en T187 |
| 1492-2 | T100 | mesta | 44 | 44 | 0,0 % | se separa en T187 |
| 1492-2 | T100 | monjes | 403 | 403 | 0,0 % | se separa en T187 |
| 1492-2 | T100 | salineros | 318 | 318 | 0,0 % | se separa en T187 |
| 1492-2 | T200 | arrieros | 156 | 156 | 0,0 % | se separa en T187 |
| 1492-2 | T200 | canteros | 312 | 312 | 0,0 % | se separa en T187 |
| 1492-2 | T200 | ferrones | 9 | 9 | 0,0 % | se separa en T187 |
| 1492-2 | T200 | hortelanos | 736 | 736 | 0,0 % | se separa en T187 |
| 1492-2 | T200 | mercaderes | 94 | 94 | 0,0 % | se separa en T187 |
| 1492-2 | T200 | mesta | 17 | 17 | 0,0 % | se separa en T187 |
| 1492-2 | T200 | monjes | 631 | 631 | 0,0 % | se separa en T187 |
| 1492-2 | T200 | salineros | 276 | 276 | 0,0 % | se separa en T187 |
| 1492-3 | T100 | arrieros | 89 | 89 | 0,0 % | se separa en T97 |
| 1492-3 | T100 | canteros | 294 | 294 | 0,0 % | se separa en T97 |
| 1492-3 | T100 | ferrones | 31 | 31 | 0,0 % | se separa en T97 |
| 1492-3 | T100 | hortelanos | 318 | 318 | 0,0 % | se separa en T97 |
| 1492-3 | T100 | mercaderes | 90 | 90 | 0,0 % | se separa en T97 |
| 1492-3 | T100 | mesta | 43 | 43 | 0,0 % | se separa en T97 |
| 1492-3 | T100 | monjes | 456 | 456 | 0,0 % | se separa en T97 |
| 1492-3 | T100 | salineros | 92 | 92 | 0,0 % | se separa en T97 |
| 1492-3 | T200 | arrieros | 119 | 119 | 0,0 % | se separa en T97 |
| 1492-3 | T200 | canteros | 312 | 312 | 0,0 % | se separa en T97 |
| 1492-3 | T200 | ferrones | 3 | 3 | 0,0 % | se separa en T97 |
| 1492-3 | T200 | hortelanos | 616 | 616 | 0,0 % | se separa en T97 |
| 1492-3 | T200 | mercaderes | 104 | 104 | 0,0 % | se separa en T97 |
| 1492-3 | T200 | mesta | 18 | 18 | 0,0 % | se separa en T97 |
| 1492-3 | T200 | monjes | 757 | 757 | 0,0 % | se separa en T97 |
| 1492-3 | T200 | salineros | 105 | 105 | 0,0 % | se separa en T97 |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 164 | 177 | 7,3 % | mercado 737, carga 669, ruta 184 |
| Canteros | 327 | 312 | 4,6 % | mercado 810, carga 565, ruta 76 |
| Ferrones | 84 | 4 | 95,2 % | mercado 544, carga 480, cometido 40 |
| Hortelanos | 686 | 680 | 0,9 % | mercado 1192, carga 679, ruta 202 |
| Mercaderes | 117 | 100 | 14,5 % | mercado 834, carga 594, ruta 102 |
| Mesta | 48 | 15 | 68,8 % | mercado 1346, carga 479, cometido 18 |
| Monjes | 989 | 697 | 29,5 % | mercado 1174, carga 693, construir 232 |
| Salineros | 238 | 125 | 47,5 % | mercado 899, carga 377, construir 62 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | T120 | **no** | **no** | 4 |
| 1492 | Canteros | **no** | T111 | T111 | 3 |
| 1492 | Ferrones | **no** | **no** | **no** | 3 |
| 1492 | Hortelanos | T68 | **no** | **no** | 4 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | **no** | **no** | **no** | 2 |
| 1492 | Monjes | T48 | **no** | **no** | 4 |
| 1492 | Salineros | **no** | **no** | **no** | 2 |
| 1492-2 | Arrieros | **no** | **no** | **no** | 3 |
| 1492-2 | Canteros | **no** | T109 | T109 | 3 |
| 1492-2 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-2 | Hortelanos | T59 | **no** | **no** | 4 |
| 1492-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-2 | Mesta | **no** | **no** | **no** | 2 |
| 1492-2 | Monjes | T43 | **no** | **no** | 5 |
| 1492-2 | Salineros | T75 | **no** | **no** | 4 |
| 1492-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1492-3 | Canteros | **no** | T111 | T111 | 3 |
| 1492-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-3 | Hortelanos | T62 | T193 | T193 | 5 |
| 1492-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-3 | Mesta | **no** | **no** | **no** | 2 |
| 1492-3 | Monjes | T48 | **no** | **no** | 4 |
| 1492-3 | Salineros | T72 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 1180 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 131 | 1221 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 9 | 425 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 94 | 343 | 992 |
| 1492 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1165 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 897 | 840 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 104 | 407 | 817 |
| 1492-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 656 | 1479 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 1209 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 6 | 412 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 123 | 319 | 845 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1304 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 899 | 836 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 82 | 524 | 800 |
| 1492-2 | Salineros | 0 | 0 | 0 | 0 | 44 | 672 | 1097 |
| 1492-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 939 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 1238 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 39 | 38 | 595 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 36 | 708 | 965 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1235 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 898 | 837 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 88 | 364 | 916 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 46 | 758 | 984 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 720 | 738 | 735 | 0 | 171 |
| Canteros | 630 | 648 | 647 | 0 | 80 |
| Ferrones | 477 | 494 | 494 | 0 | 45 |
| Hortelanos | 967 | 985 | 968 | 4 | 218 |
| Mercaderes | 651 | 669 | 666 | 0 | 90 |
| Mesta | 762 | 780 | 780 | 0 | 19 |
| Monjes | 1058 | 1076 | 1059 | 12 | 293 |
| Salineros | 629 | 645 | 638 | 4 | 96 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 51
- incorporar: comarca-con-duenyo: 9
- construir: comarca-ajena: 1

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 67 | 79 | 85 | 105 | 109 | 151 | 159 | 161 | 166 | 164 |
| Canteros | 72 | 80 | 86 | 90 | 95 | 309 | 315 | 318 | 324 | 327 |
| Ferrones | 45 | 47 | 53 | 75 | 85 | 105 | 104 | 83 | 84 | 84 |
| Hortelanos | 174 | 180 | 264 | 380 | 421 | 512 | 556 | 587 | 613 | 686 |
| Mercaderes | 62 | 74 | 84 | 90 | 95 | 99 | 105 | 107 | 113 | 117 |
| Mesta | 45 | 45 | 56 | 62 | 62 | 64 | 64 | 54 | 51 | 48 |
| Monjes | 73 | 115 | 367 | 440 | 527 | 640 | 729 | 819 | 932 | 989 |
| Salineros | 56 | 56 | 53 | 142 | 162 | 192 | 213 | 205 | 226 | 238 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `028e3a4b64434574a7730bbe898b84c3714a2fc25508174893fc3b354ae6bdd8`
- semilla `1492-2`: `84639621621b4ca66fb6d2f503dd6b6ea69e30f356e7343fc51c617e5f547ce9`
- semilla `1492-3`: `02104f3c662515a894f99db15ba46ea812c97472aa3a4b393be6008d04b41317`
