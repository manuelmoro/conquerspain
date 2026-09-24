# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 805 de prestigio (354,6 % de la mediana) y **Mesta** cierra la clasificación con 58 (25,6 % de la mediana). La mediana de prestigio es 227. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `bfcf751b6b84f17bb104ff27b853a18f2f561707` |
| Etiqueta del informe | E-recargo120-1492 |
| Cambios experimentales | PROVISIONAL: precio = min(2000, abundancia[fuente] + 120/jornada) + fondo de comercio (robots 7) |
| Versiones | banco 0.1.0 · métricas 4 · robots 7 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `daaf9e13fe7feaa2e1ac4cbb1b49e3f0530dd784ac7d3bb2c5131dc22f47c692` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 41 filas sin cerrar de 157.

116 cumplen, 41 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 125,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 324 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | canteros | — | 166,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 430 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | ferrones | — | 56,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 146 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | hortelanos | — | 233,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 603 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | mercaderes | — | 74,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 193 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | mesta | — | 12,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 33 sobre una mediana exacta de 258,5 |
| prestigio | casa y partida | 1492 | monjes | — | 342,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 886 sobre una mediana exacta de 258,5 |
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
| escasez | casa y partida | 1492 | canteros | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 39,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 79 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 45,7 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 95 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 168 · a mano 168 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 295 · a mano 295 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 384 · a mano 384 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 33 · a mano 33 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -7 · a mano -7 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 811 · a mano 811 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 120 · a mano 120 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 160 · a mano 160 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 24 · a mano 24 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 3 · a mano 3 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 331 · a mano 331 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 712 · a mano 712 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -12 · a mano -12 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 7 · a mano 7 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 87,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 223 sobre una mediana exacta de 255 |
| prestigio | casa y partida | 1492-2 | canteros | — | 169,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 433 sobre una mediana exacta de 255 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 32,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 83 sobre una mediana exacta de 255 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 265,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 678 sobre una mediana exacta de 255 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 71,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 182 sobre una mediana exacta de 255 |
| prestigio | casa y partida | 1492-2 | mesta | — | 26,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 67 sobre una mediana exacta de 255 |
| prestigio | casa y partida | 1492-2 | monjes | — | 319,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 815 sobre una mediana exacta de 255 |
| prestigio | casa y partida | 1492-2 | salineros | — | 112,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 287 sobre una mediana exacta de 255 |
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
| escasez | casa y partida | 1492-2 | canteros | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1492-2 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mercaderes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-2 | mesta | — | 6,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 13 de 200 turnos |
| escasez | casa y partida | 1492-2 | monjes | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1492-2 | salineros | — | 12 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 24 de 200 turnos |
| precios | partida | 1492-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-2 | — | — | 38,5 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 80 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 162 · a mano 162 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 192 · a mano 192 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 399 · a mano 399 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 39 · a mano 39 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 8 · a mano 8 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 456 · a mano 456 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 765 · a mano 765 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 82 · a mano 82 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 146 · a mano 146 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 43 · a mano 43 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -3 · a mano -3 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 361 · a mano 361 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 573 · a mano 573 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 279 · a mano 279 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 250 · a mano 250 · el dominio coincide turno a turno |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 104,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 229 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492-3 | canteros | — | 196,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 432 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492-3 | ferrones | — | 70 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 154 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 335 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 737 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 95,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 211 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492-3 | mesta | — | 33,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 73 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492-3 | monjes | — | 324,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 713 sobre una mediana exacta de 220 |
| prestigio | casa y partida | 1492-3 | salineros | — | 88,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 195 sobre una mediana exacta de 220 |
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
| escasez | casa y partida | 1492-3 | canteros | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1492-3 | ferrones | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mesta | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1492-3 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492-3 | — | — | 3 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-cameros, sal: 3 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1492-3 | — | — | 41,3 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 86 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 122 · a mano 122 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 202 · a mano 202 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 350 · a mano 350 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 54 · a mano 54 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 19 · a mano 19 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 413 · a mano 413 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 773 · a mano 773 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 154 · a mano 154 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 40 · a mano 40 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 25 · a mano 25 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 329 · a mano 329 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 683 · a mano 683 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio se separa en T175 |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 163 · a mano 163 · el dominio se separa en T175 |
| dominio | partida | 1492-3 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 2 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492-3 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T109 |
| ganadores | campaña | 1492 | — | — | 0 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🟢 cumple | ganan monjes, monjes, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 190,3 %
  - Ferrones: 56,4 %
  - Hortelanos: 296,5 %
  - Mesta: 25,6 %
  - Monjes: 354,6 %
  - Salineros: 67,8 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 33,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Salineros (semilla 1492): 39,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 248 de 403 comarcas
  - región 01-iberico-alto-duero: 7
  - región 02-meseta-norte: 31
  - región 03-cantabrico: 20
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 36
  - región 06-meseta-sur: 12
  - región 07-ebro-pirineo: 12
  - región 08-levante: 1
  - región 09-andalucia: 46
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 805 | 354,6 % | 1 | 2 | 1334 | 14 | 1642 | 1,0 % | 2,0 % |
| Hortelanos | 673 | 296,5 % | 2 | 2 | 757 | 10 | 1116 | 0,0 % | 2,5 % |
| Canteros | 432 | 190,3 % | 3 | 1 | 137 | 2 | 549 | 1,0 % | 1,0 % |
| Arrieros | 259 | 114,1 % | 4 | 0 | 147 | 2 | 99 | 1,5 % | 2,0 % |
| Mercaderes | 195 | 85,9 % | 5 | 0 | 90 | 1 | 102 | 1,0 % | 0,5 % |
| Salineros | 154 | 67,8 % | 6 | 0 | 263 | 3 | 1267 | 17,0 % | 33,5 % |
| Ferrones | 128 | 56,4 % | 7 | 0 | 68 | 1 | 85 | 10,0 % | 8,0 % |
| Mesta | 58 | 25,6 % | 8 | 0 | 35 | 1 | 111 | 7,0 % | 5,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 29 | 16 | 0 | 0 | 0 | 168 | 0 | 0 | 48 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 136 | 0 | 0 | 135 |
| Ferrones | 13 | 11 | 0 | 0 | 0 | 72 | 0 | 25 | 33 |
| Hortelanos | 151 | 83 | 80 | 0 | 0 | 171 | 0 | 0 | 188 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 147 | 0 | 0 | 25 |
| Mesta | 7 | 8 | 0 | 0 | 0 | 32 | 0 | 0 | 25 |
| Monjes | 267 | 112 | 40 | 0 | 0 | 200 | 0 | 0 | 188 |
| Salineros | 52 | 27 | 0 | 0 | 0 | 88 | 0 | 0 | 42 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 137 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 93 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 46 turnos) |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 141 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 53 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 41 turnos) |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 198 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 178 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 22 turnos) |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 199 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 79 turnos) |
| Arrieros | 1492-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 118 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 60 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 58 turnos) |
| Canteros | 1492-2 | termina obras mayores | sí |  |
| Ferrones | 1492-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 141 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 42 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 33 turnos) |
| Mesta | 1492-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 194 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 187 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 13 turnos) |
| Monjes | 1492-2 | funda pueblas | sí |  |
| Salineros | 1492-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 146 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 54 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 36 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 194 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 193 turnos); no hay maravedís para formar un rebaño sin quedarse sin colchón (recursos, 12 turnos) |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 6213 | 240 | 0 | 0 | 0 | 8 | 0 | 0 | 372 | 1320 | 3 | 13 | 1 | 1 | 0 | 1 |
| Canteros | 0 | 0 | 0 | 5633 | 16 | 521 | 0 | 0 | 5 | 1 | 0 | 151 | 1355 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 3148 | 1004 | 0 | 0 | 483 | 5 | 0 | 4 | 97 | 576 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 25992 | 439 | 0 | 0 | 0 | 35 | 1 | 0 | 218 | 1900 | 0 | 0 | 0 | 0 | 0 | 9 |
| Mercaderes | 0 | 0 | 0 | 4408 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 142 | 1213 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 2 | 0 | 0 | 1547 | 1059 | 0 | 0 | 0 | 2 | 0 | 0 | 35 | 1733 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 36628 | 4042 | 0 | 0 | 0 | 63 | 0 | 0 | 221 | 1739 | 0 | 0 | 0 | 0 | 7 | 6 |
| Salineros | 0 | 0 | 0 | 6499 | 0 | 0 | 1395 | 0 | 14 | 0 | 0 | 87 | 1265 | 0 | 0 | 0 | 0 | 0 | 3 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 168 | 168 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | 33 | 33 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 451 | 451 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 120 | 120 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 24 | 24 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 331 | 331 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | -12 | -12 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 295 | 295 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 384 | 384 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | -7 | -7 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 811 | 811 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 160 | 160 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 3 | 3 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 712 | 712 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | 7 | 7 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 162 | 162 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | ferrones | 39 | 39 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | hortelanos | 456 | 456 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mercaderes | 82 | 82 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mesta | 43 | 43 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | monjes | 361 | 361 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | salineros | 279 | 279 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | arrieros | 192 | 192 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | canteros | 399 | 399 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | ferrones | 8 | 8 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | hortelanos | 765 | 765 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mercaderes | 146 | 146 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mesta | -3 | -3 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | monjes | 573 | 573 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | salineros | 250 | 250 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | arrieros | 122 | 122 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | ferrones | 54 | 54 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | hortelanos | 413 | 413 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | mercaderes | 123 | 123 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | mesta | 40 | 40 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | monjes | 329 | 329 | 0,0 % | se separa en T175 |
| 1492-3 | T100 | salineros | 130 | 130 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | arrieros | 202 | 202 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | canteros | 350 | 350 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | ferrones | 19 | 19 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | hortelanos | 773 | 773 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | mercaderes | 154 | 154 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | mesta | 25 | 25 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | monjes | 683 | 683 | 0,0 % | se separa en T175 |
| 1492-3 | T200 | salineros | 163 | 163 | 0,0 % | se separa en T175 |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 259 | 230 | 11,2 % | carga 976, mercado 696, ruta 183 |
| Canteros | 432 | 378 | 12,5 % | mercado 849, carga 581, ruta 92 |
| Ferrones | 128 | 7 | 94,5 % | mercado 541, carga 480, cometido 40 |
| Hortelanos | 673 | 783 | 14,0 % | mercado 1094, carga 673, ruta 196 |
| Mercaderes | 195 | 153 | 21,5 % | mercado 802, carga 798, ruta 104 |
| Mesta | 58 | 8 | 86,2 % | mercado 1349, carga 477, cometido 16 |
| Monjes | 805 | 656 | 18,5 % | mercado 1231, carga 692, ruta 214 |
| Salineros | 154 | 140 | 9,1 % | mercado 831, carga 372, ruta 54 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | T143 | **no** | **no** | 4 |
| 1492 | Canteros | **no** | T107 | T107 | 4 |
| 1492 | Ferrones | **no** | **no** | **no** | 3 |
| 1492 | Hortelanos | T68 | **no** | **no** | 4 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | **no** | **no** | **no** | 2 |
| 1492 | Monjes | T48 | T184 | T184 | 5 |
| 1492 | Salineros | **no** | **no** | **no** | 2 |
| 1492-2 | Arrieros | **no** | **no** | **no** | 3 |
| 1492-2 | Canteros | **no** | T107 | T107 | 4 |
| 1492-2 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-2 | Hortelanos | T59 | **no** | **no** | 4 |
| 1492-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-2 | Mesta | **no** | **no** | **no** | 2 |
| 1492-2 | Monjes | T43 | **no** | **no** | 4 |
| 1492-2 | Salineros | T75 | **no** | **no** | 4 |
| 1492-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1492-3 | Canteros | **no** | T109 | T109 | 4 |
| 1492-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-3 | Hortelanos | T62 | T114 | T114 | 5 |
| 1492-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-3 | Mesta | **no** | **no** | **no** | 2 |
| 1492-3 | Monjes | T48 | **no** | **no** | 4 |
| 1492-3 | Salineros | **no** | **no** | **no** | 2 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 1087 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1214 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 9 | 424 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 131 | 367 | 750 |
| 1492 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1158 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 885 | 845 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 106 | 633 | 662 |
| 1492-2 | Arrieros | 2 | 12 | 144 | 78 | 0 | 631 | 1269 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1208 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 6 | 412 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 138 | 344 | 726 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1262 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 891 | 836 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 77 | 628 | 700 |
| 1492-2 | Salineros | 0 | 0 | 0 | 0 | 46 | 714 | 1067 |
| 1492-3 | Arrieros | 1 | 8 | 28 | -44 | 0 | 5 | 901 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1234 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 38 | 41 | 593 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 17 | 844 | 957 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1198 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 901 | 830 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 101 | 608 | 668 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 1 | 451 | 1428 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 827 | 845 | 844 | 0 | 167 |
| Canteros | 658 | 676 | 675 | 0 | 83 |
| Ferrones | 476 | 493 | 493 | 0 | 45 |
| Hortelanos | 918 | 936 | 922 | 4 | 213 |
| Mercaderes | 726 | 744 | 740 | 0 | 89 |
| Mesta | 758 | 776 | 776 | 0 | 17 |
| Monjes | 1027 | 1045 | 1037 | 5 | 242 |
| Salineros | 571 | 587 | 582 | 2 | 77 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 28
- incorporar: comarca-con-duenyo: 4
- construir: comarca-ajena: 1

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 65 | 97 | 118 | 143 | 155 | 187 | 206 | 227 | 244 | 259 |
| Canteros | 70 | 86 | 102 | 118 | 126 | 352 | 368 | 376 | 392 | 432 |
| Ferrones | 43 | 45 | 68 | 91 | 109 | 131 | 135 | 119 | 125 | 128 |
| Hortelanos | 187 | 200 | 280 | 380 | 410 | 493 | 533 | 578 | 652 | 673 |
| Mercaderes | 60 | 81 | 107 | 126 | 139 | 150 | 163 | 171 | 185 | 195 |
| Mesta | 38 | 38 | 55 | 65 | 67 | 70 | 71 | 59 | 58 | 58 |
| Monjes | 76 | 132 | 345 | 404 | 469 | 542 | 609 | 666 | 694 | 805 |
| Salineros | 60 | 70 | 74 | 110 | 114 | 138 | 150 | 141 | 145 | 154 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `b9638d8a2dbbe4df7de118921916c56e53fecbb27c2183ba7b40a05557c889ca`
- semilla `1492-2`: `cc8b1bbb8fe50346a9153eed41acc7797e99db849697fef5bec0599f936d53bb`
- semilla `1492-3`: `f7016a14073ac36bf538cabbfbc5dc833b56f4eaa55389946045c556b408106c`
