# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 763 de prestigio (358,2 % de la mediana) y **Mesta** cierra la clasificación con 58 (27,2 % de la mediana). La mediana de prestigio es 213. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `bfcf751b6b84f17bb104ff27b853a18f2f561707` |
| Etiqueta del informe | E-recargo250-1492 |
| Cambios experimentales | mercado.recargoPorJornadaMil=250 (ensayo, revertido) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `ff7fc640405667b82ad7432f76a9e060c0708965467e5f7042f44ea95a1954ab` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 40 filas sin cerrar de 157.

117 cumplen, 40 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 119,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 284 sobre una mediana exacta de 238,5 |
| prestigio | casa y partida | 1492 | canteros | — | 180,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 430 sobre una mediana exacta de 238,5 |
| prestigio | casa y partida | 1492 | ferrones | — | 61,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 146 sobre una mediana exacta de 238,5 |
| prestigio | casa y partida | 1492 | hortelanos | — | 316,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 755 sobre una mediana exacta de 238,5 |
| prestigio | casa y partida | 1492 | mercaderes | — | 80,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 193 sobre una mediana exacta de 238,5 |
| prestigio | casa y partida | 1492 | mesta | — | 14,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 34 sobre una mediana exacta de 238,5 |
| prestigio | casa y partida | 1492 | monjes | — | 353,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 844 sobre una mediana exacta de 238,5 |
| prestigio | casa y partida | 1492 | salineros | — | -8,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -19 sobre una mediana exacta de 238,5 |
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
| escasez | casa y partida | 1492 | arrieros | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1492 | canteros | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 39,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 79 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 46,6 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 97 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 168 · a mano 168 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 231 · a mano 231 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 384 · a mano 384 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 23 · a mano 23 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 18 · a mano 18 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 816 · a mano 816 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 120 · a mano 120 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 168 · a mano 168 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 24 · a mano 24 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 3 · a mano 3 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 331 · a mano 331 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 723 · a mano 723 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -12 · a mano -12 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 7 · a mano 7 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 77,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 182 sobre una mediana exacta de 234,5 |
| prestigio | casa y partida | 1492-2 | canteros | — | 184,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 433 sobre una mediana exacta de 234,5 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 35,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 83 sobre una mediana exacta de 234,5 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 302,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 709 sobre una mediana exacta de 234,5 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 77,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 182 sobre una mediana exacta de 234,5 |
| prestigio | casa y partida | 1492-2 | mesta | — | 30,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 71 sobre una mediana exacta de 234,5 |
| prestigio | casa y partida | 1492-2 | monjes | — | 316,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 743 sobre una mediana exacta de 234,5 |
| prestigio | casa y partida | 1492-2 | salineros | — | 122,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 287 sobre una mediana exacta de 234,5 |
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
| escasez | casa y partida | 1492-2 | arrieros | — | 7,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 15 de 200 turnos |
| escasez | casa y partida | 1492-2 | canteros | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1492-2 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mercaderes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-2 | mesta | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1492-2 | monjes | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1492-2 | salineros | — | 12 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 24 de 200 turnos |
| precios | partida | 1492-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-2 | — | — | 41,3 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 86 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 162 · a mano 162 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 192 · a mano 192 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 399 · a mano 399 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 22 · a mano 22 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 443 · a mano 443 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 748 · a mano 748 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 82 · a mano 82 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 146 · a mano 146 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 43 · a mano 43 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -3 · a mano -3 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 349 · a mano 349 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 568 · a mano 568 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 279 · a mano 279 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 250 · a mano 250 · el dominio coincide turno a turno |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 103,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 228 sobre una mediana exacta de 219,5 |
| prestigio | casa y partida | 1492-3 | canteros | — | 196,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 432 sobre una mediana exacta de 219,5 |
| prestigio | casa y partida | 1492-3 | ferrones | — | 70,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 154 sobre una mediana exacta de 219,5 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 311,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 684 sobre una mediana exacta de 219,5 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 96,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 211 sobre una mediana exacta de 219,5 |
| prestigio | casa y partida | 1492-3 | mesta | — | 31,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 69 sobre una mediana exacta de 219,5 |
| prestigio | casa y partida | 1492-3 | monjes | — | 319,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 701 sobre una mediana exacta de 219,5 |
| prestigio | casa y partida | 1492-3 | salineros | — | 88,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 195 sobre una mediana exacta de 219,5 |
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
| escasez | casa y partida | 1492-3 | mesta | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1492-3 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492-3 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-cameros, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1492-3 | — | — | 40,4 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 84 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 122 · a mano 122 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 202 · a mano 202 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 350 · a mano 350 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 54 · a mano 54 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 33 · a mano 33 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 405 · a mano 405 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 765 · a mano 765 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 163 · a mano 163 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 41 · a mano 41 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 18 · a mano 18 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 329 · a mano 329 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 686 · a mano 686 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio se separa en T163 |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 163 · a mano 163 · el dominio se separa en T163 |
| dominio | partida | 1492-3 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 2 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492-3 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T109 |
| ganadores | campaña | 1492 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan monjes, monjes, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 202,8 %
  - Ferrones: 60,1 %
  - Hortelanos: 336,2 %
  - Mesta: 27,2 %
  - Monjes: 358,2 %
  - Salineros: 72,3 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 33,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Salineros (semilla 1492): 39,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 250 de 403 comarcas
  - región 01-iberico-alto-duero: 7
  - región 02-meseta-norte: 31
  - región 03-cantabrico: 21
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 36
  - región 06-meseta-sur: 12
  - región 07-ebro-pirineo: 13
  - región 08-levante: 1
  - región 09-andalucia: 46
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 763 | 358,2 % | 1 | 2 | 1219 | 13 | 1756 | 2,5 % | 2,0 % |
| Hortelanos | 716 | 336,2 % | 2 | 2 | 840 | 11 | 697 | 0,0 % | 2,5 % |
| Canteros | 432 | 202,8 % | 3 | 1 | 137 | 2 | 549 | 1,0 % | 1,0 % |
| Arrieros | 231 | 108,5 % | 4 | 0 | 139 | 2 | 85 | 3,5 % | 2,0 % |
| Mercaderes | 195 | 91,5 % | 5 | 0 | 90 | 1 | 102 | 1,0 % | 0,5 % |
| Salineros | 154 | 72,3 % | 6 | 0 | 263 | 3 | 1174 | 17,0 % | 33,5 % |
| Ferrones | 128 | 60,1 % | 7 | 0 | 68 | 1 | 128 | 10,0 % | 8,0 % |
| Mesta | 58 | 27,2 % | 8 | 0 | 34 | 1 | 112 | 6,5 % | 5,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 27 | 16 | 0 | 0 | 0 | 147 | 0 | 0 | 48 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 136 | 0 | 0 | 135 |
| Ferrones | 13 | 11 | 0 | 0 | 0 | 72 | 0 | 25 | 33 |
| Hortelanos | 168 | 91 | 80 | 0 | 0 | 176 | 0 | 0 | 202 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 147 | 0 | 0 | 25 |
| Mesta | 6 | 8 | 0 | 0 | 0 | 32 | 0 | 0 | 25 |
| Monjes | 243 | 104 | 40 | 0 | 0 | 192 | 0 | 0 | 188 |
| Salineros | 52 | 27 | 0 | 0 | 0 | 88 | 0 | 0 | 42 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 133 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 55 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 49 turnos) |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 198 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 178 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 22 turnos) |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 199 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 79 turnos) |
| Arrieros | 1492-2 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-2 | termina obras mayores | sí |  |
| Ferrones | 1492-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 141 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 42 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 33 turnos) |
| Mesta | 1492-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 194 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 192 turnos); no hay maravedís para formar un rebaño sin quedarse sin colchón (recursos, 12 turnos) |
| Monjes | 1492-2 | funda pueblas | sí |  |
| Salineros | 1492-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 136 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 56 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 47 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 194 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 190 turnos); no hay maravedís para formar un rebaño sin quedarse sin colchón (recursos, 12 turnos) |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 82 | 6067 | 240 | 0 | 0 | 0 | 9 | 0 | 0 | 710 | 2104 | 141 | 637 | 44 | 43 | 0 | 1 |
| Canteros | 0 | 0 | 0 | 5633 | 16 | 521 | 0 | 0 | 5 | 1 | 0 | 151 | 1355 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 3148 | 1004 | 0 | 0 | 483 | 5 | 0 | 4 | 97 | 571 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 27528 | 385 | 0 | 0 | 0 | 36 | 1 | 0 | 208 | 1808 | 0 | 0 | 0 | 0 | 0 | 10 |
| Mercaderes | 0 | 0 | 0 | 4408 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 142 | 1200 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 2 | 0 | 0 | 1549 | 1060 | 0 | 0 | 0 | 2 | 0 | 0 | 35 | 1705 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 34916 | 3931 | 0 | 0 | 0 | 60 | 0 | 0 | 212 | 1702 | 0 | 0 | 0 | 0 | 7 | 5 |
| Salineros | 0 | 0 | 0 | 6499 | 0 | 0 | 1395 | 0 | 14 | 0 | 0 | 85 | 1247 | 0 | 0 | 0 | 0 | 0 | 3 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 168 | 168 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | 23 | 23 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 451 | 451 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 120 | 120 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 24 | 24 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 331 | 331 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | -12 | -12 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 231 | 231 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 384 | 384 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | 18 | 18 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 816 | 816 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 168 | 168 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 3 | 3 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 723 | 723 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | 7 | 7 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 162 | 162 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | ferrones | 42 | 42 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | hortelanos | 443 | 443 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mercaderes | 82 | 82 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mesta | 43 | 43 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | monjes | 349 | 349 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | salineros | 279 | 279 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | arrieros | 192 | 192 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | canteros | 399 | 399 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | ferrones | 22 | 22 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | hortelanos | 748 | 748 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mercaderes | 146 | 146 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mesta | -3 | -3 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | monjes | 568 | 568 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | salineros | 250 | 250 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | arrieros | 122 | 122 | 0,0 % | se separa en T163 |
| 1492-3 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T163 |
| 1492-3 | T100 | ferrones | 54 | 54 | 0,0 % | se separa en T163 |
| 1492-3 | T100 | hortelanos | 405 | 405 | 0,0 % | se separa en T163 |
| 1492-3 | T100 | mercaderes | 123 | 123 | 0,0 % | se separa en T163 |
| 1492-3 | T100 | mesta | 41 | 41 | 0,0 % | se separa en T163 |
| 1492-3 | T100 | monjes | 329 | 329 | 0,0 % | se separa en T163 |
| 1492-3 | T100 | salineros | 130 | 130 | 0,0 % | se separa en T163 |
| 1492-3 | T200 | arrieros | 202 | 202 | 0,0 % | se separa en T163 |
| 1492-3 | T200 | canteros | 350 | 350 | 0,0 % | se separa en T163 |
| 1492-3 | T200 | ferrones | 33 | 33 | 0,0 % | se separa en T163 |
| 1492-3 | T200 | hortelanos | 765 | 765 | 0,0 % | se separa en T163 |
| 1492-3 | T200 | mercaderes | 163 | 163 | 0,0 % | se separa en T163 |
| 1492-3 | T200 | mesta | 18 | 18 | 0,0 % | se separa en T163 |
| 1492-3 | T200 | monjes | 686 | 686 | 0,0 % | se separa en T163 |
| 1492-3 | T200 | salineros | 163 | 163 | 0,0 % | se separa en T163 |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 231 | 208 | 10,0 % | carga 900, mercado 768, ruta 303 |
| Canteros | 432 | 378 | 12,5 % | mercado 849, carga 581, ruta 92 |
| Ferrones | 128 | 24 | 81,3 % | mercado 555, carga 480, cometido 40 |
| Hortelanos | 716 | 776 | 7,7 % | mercado 1173, carga 661, ruta 184 |
| Mercaderes | 195 | 159 | 18,5 % | carga 800, mercado 783, ruta 104 |
| Mesta | 58 | 6 | 89,7 % | mercado 1379, carga 477, cometido 16 |
| Monjes | 763 | 659 | 13,6 % | mercado 1244, carga 686, ruta 208 |
| Salineros | 154 | 140 | 9,1 % | mercado 831, carga 370, ruta 52 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | T183 | **no** | **no** | 4 |
| 1492 | Canteros | **no** | T107 | T107 | 4 |
| 1492 | Ferrones | **no** | **no** | **no** | 3 |
| 1492 | Hortelanos | T74 | T200 | T200 | 5 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | **no** | **no** | **no** | 2 |
| 1492 | Monjes | T48 | T177 | T177 | 5 |
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
| 1492-3 | Hortelanos | T62 | T115 | T115 | 5 |
| 1492-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-3 | Mesta | **no** | **no** | **no** | 2 |
| 1492-3 | Monjes | T48 | **no** | **no** | 4 |
| 1492-3 | Salineros | **no** | **no** | **no** | 2 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 46 | 427 | 3705 | 2400 | 0 | 5 | 1344 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1214 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 9 | 427 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 36 | 696 | 977 |
| 1492 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1142 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 847 | 854 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 98 | 629 | 680 |
| 1492-2 | Arrieros | 47 | 194 | 2164 | 1381 | 0 | 631 | 1269 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1208 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 6 | 412 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 139 | 417 | 552 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1260 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 856 | 844 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 76 | 703 | 634 |
| 1492-2 | Salineros | 0 | 0 | 0 | 0 | 46 | 714 | 1067 |
| 1492-3 | Arrieros | 38 | 377 | 3316 | 2252 | 0 | 5 | 1030 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1234 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 39 | 31 | 586 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 36 | 791 | 819 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1181 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 859 | 843 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 92 | 624 | 691 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 2 | 458 | 1364 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 879 | 896 | 894 | 0 | 160 |
| Canteros | 658 | 676 | 675 | 0 | 83 |
| Ferrones | 480 | 497 | 497 | 0 | 45 |
| Hortelanos | 946 | 964 | 949 | 3 | 211 |
| Mercaderes | 721 | 739 | 735 | 0 | 89 |
| Mesta | 771 | 789 | 789 | 0 | 17 |
| Monjes | 1017 | 1035 | 1028 | 5 | 232 |
| Salineros | 566 | 582 | 578 | 2 | 76 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 27
- incorporar: comarca-con-duenyo: 4
- construir: comarca-ajena: 1

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 65 | 97 | 118 | 143 | 152 | 181 | 198 | 200 | 209 | 231 |
| Canteros | 70 | 86 | 102 | 118 | 126 | 352 | 368 | 376 | 392 | 432 |
| Ferrones | 43 | 45 | 68 | 91 | 109 | 131 | 135 | 119 | 125 | 128 |
| Hortelanos | 187 | 200 | 265 | 368 | 397 | 476 | 519 | 572 | 617 | 716 |
| Mercaderes | 60 | 81 | 107 | 126 | 139 | 150 | 163 | 171 | 185 | 195 |
| Mesta | 38 | 38 | 55 | 65 | 67 | 70 | 71 | 58 | 58 | 58 |
| Monjes | 76 | 132 | 345 | 404 | 469 | 540 | 596 | 643 | 730 | 763 |
| Salineros | 60 | 70 | 74 | 110 | 114 | 138 | 150 | 141 | 145 | 154 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `d4f9a3c991ccc11f7b0ba18d171e5ac2ee7a5fa078fb42e7bb7aea24d19009f2`
- semilla `1492-2`: `df6d879b073bb1d75c70052a6f7022f7af1ed0bdc1f23e52a32179191ee7823c`
- semilla `1492-3`: `cab5679b69dcb261c2e5fdc89baf26ffc7927b9d442ea1ccc79f9450b55e2a96`
