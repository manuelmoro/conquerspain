# Banco de pruebas · semilla 1085

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 879 de prestigio (275,5 % de la mediana) y **Ferrones** cierra la clasificación con 100 (31,3 % de la mediana). La mediana de prestigio es 319. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `be2dbfd+T-059-9` |
| Etiqueta del informe | E-feria3-1085 |
| Cambios experimentales | la comarca con feria da de comer + robots 11 (T-059 §9) |
| Versiones | banco 0.1.0 · métricas 5 · robots 11 · reglas 1 |
| Semillas | 1085, 1085-2, 1085-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `a38ce4c04bba1ea63831be746057d7e4304afbdfa2e788174fa8fa6ed4aa3962` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 39 filas sin cerrar de 157.

118 cumplen, 39 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1085 | arrieros | — | 58,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 274 sobre una mediana exacta de 470 |
| prestigio | casa y partida | 1085 | canteros | — | 116,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 549 sobre una mediana exacta de 470 |
| prestigio | casa y partida | 1085 | ferrones | — | 33,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 158 sobre una mediana exacta de 470 |
| prestigio | casa y partida | 1085 | hortelanos | — | 145,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 685 sobre una mediana exacta de 470 |
| prestigio | casa y partida | 1085 | mercaderes | — | 53,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 251 sobre una mediana exacta de 470 |
| prestigio | casa y partida | 1085 | mesta | — | 109,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 514 sobre una mediana exacta de 470 |
| prestigio | casa y partida | 1085 | monjes | — | 188,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 885 sobre una mediana exacta de 470 |
| prestigio | casa y partida | 1085 | salineros | — | 90,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 426 sobre una mediana exacta de 470 |
| actividad | casa y partida | 1085 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | ferrones | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | mesta | — | 7,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 15 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085 | arrieros | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1085 | canteros | — | 10,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 21 de 200 turnos |
| escasez | casa y partida | 1085 | ferrones | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mesta | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1085 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1085 | salineros | — | 10 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 20 de 200 turnos |
| precios | partida | 1085 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-bajo-aragon, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085 | — | — | 34,1 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 71 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 165 · a mano 165 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 300 · a mano 300 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 374 · a mano 374 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 505 · a mano 505 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 116 · a mano 116 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 140 · a mano 140 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 354 · a mano 354 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 676 · a mano 676 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 131 · a mano 131 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 195 · a mano 195 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 189 · a mano 189 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 315 · a mano 315 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 495 · a mano 495 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 754 · a mano 754 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 210 · a mano 210 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 153 · a mano 153 · el dominio coincide turno a turno |
| dominio | partida | 1085 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085 | — | — | 129 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T129 |
| prestigio | casa y partida | 1085-2 | arrieros | — | 74,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 257 sobre una mediana exacta de 345,5 |
| prestigio | casa y partida | 1085-2 | canteros | — | 133,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 460 sobre una mediana exacta de 345,5 |
| prestigio | casa y partida | 1085-2 | ferrones | — | 2,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 7 sobre una mediana exacta de 345,5 |
| prestigio | casa y partida | 1085-2 | hortelanos | — | 132,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 459 sobre una mediana exacta de 345,5 |
| prestigio | casa y partida | 1085-2 | mercaderes | — | 66,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 231 sobre una mediana exacta de 345,5 |
| prestigio | casa y partida | 1085-2 | mesta | — | 113,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 391 sobre una mediana exacta de 345,5 |
| prestigio | casa y partida | 1085-2 | monjes | — | 237,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 820 sobre una mediana exacta de 345,5 |
| prestigio | casa y partida | 1085-2 | salineros | — | 86,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 300 sobre una mediana exacta de 345,5 |
| actividad | casa y partida | 1085-2 | arrieros | — | 6 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 12 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | mesta | — | 7,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 15 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | monjes | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | monjes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | salineros | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085-2 | arrieros | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1085-2 | canteros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1085-2 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1085-2 | hortelanos | — | 9 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 18 de 200 turnos |
| escasez | casa y partida | 1085-2 | mercaderes | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1085-2 | mesta | — | 21 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 42 de 200 turnos |
| escasez | casa y partida | 1085-2 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1085-2 | salineros | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| precios | partida | 1085-2 | — | — | 3 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-campo-de-beja, sal: 3 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085-2 | — | — | 46,6 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 116 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1085-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 138 · a mano 138 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 202 · a mano 202 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 340 · a mano 340 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 428 · a mano 428 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -61 · a mano -61 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -69 · a mano -69 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 397 · a mano 397 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 665 · a mano 665 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 109 · a mano 109 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 173 · a mano 173 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 189 · a mano 189 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 314 · a mano 314 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 314 · a mano 314 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 683 · a mano 683 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 212 · a mano 212 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 262 · a mano 262 · el dominio coincide turno a turno |
| dominio | partida | 1085-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 5 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-2 | — | — | 84 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T84 |
| prestigio | casa y partida | 1085-3 | arrieros | — | 123,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 369 sobre una mediana exacta de 299 |
| prestigio | casa y partida | 1085-3 | canteros | — | 165,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 494 sobre una mediana exacta de 299 |
| prestigio | casa y partida | 1085-3 | ferrones | — | 44,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 134 sobre una mediana exacta de 299 |
| prestigio | casa y partida | 1085-3 | hortelanos | — | 226,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 676 sobre una mediana exacta de 299 |
| prestigio | casa y partida | 1085-3 | mercaderes | — | 36,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 108 sobre una mediana exacta de 299 |
| prestigio | casa y partida | 1085-3 | mesta | — | 18,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 56 sobre una mediana exacta de 299 |
| prestigio | casa y partida | 1085-3 | monjes | — | 311,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 931 sobre una mediana exacta de 299 |
| prestigio | casa y partida | 1085-3 | salineros | — | 76,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 229 sobre una mediana exacta de 299 |
| actividad | casa y partida | 1085-3 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | canteros | — | 6 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 12 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | canteros | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | ferrones | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | mesta | — | 7,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 15 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | monjes | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | monjes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | salineros | — | 80 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 160 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | ferrones | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | mercaderes | — | 17 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 34 de 200 turnos |
| escasez | casa y partida | 1085-3 | mesta | — | 8 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 16 de 200 turnos |
| escasez | casa y partida | 1085-3 | monjes | — | 6 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 12 de 200 turnos |
| escasez | casa y partida | 1085-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1085-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1085-3 | — | — | 36,1 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 75 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 114 · a mano 114 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 154 · a mano 154 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 331 · a mano 331 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 429 · a mano 429 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 30 · a mano 30 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 420 · a mano 420 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 408 · a mano 408 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -31 · a mano -31 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 43 · a mano 43 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 58 · a mano 58 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 41 · a mano 41 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 411 · a mano 411 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 902 · a mano 902 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 219 · a mano 219 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 104 · a mano 104 · el dominio coincide turno a turno |
| dominio | partida | 1085-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 2 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-3 | — | — | 92 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T92 |
| ganadores | campaña | 1085 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan monjes, monjes, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 157,1 %
  - Ferrones: 31,3 %
  - Hortelanos: 190,3 %
  - Mercaderes: 61,8 %
  - Monjes: 275,5 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 29,0 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1085-2): 34,5 % de los turnos
  - Mesta (semilla 1085-2): 21,0 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 135 de 403 comarcas
  - región 01-iberico-alto-duero: 5
  - región 02-meseta-norte: 6
  - región 03-cantabrico: 10
  - región 04-galicia-minho: 6
  - región 05-central-extremadura: 28
  - región 06-meseta-sur: 10
  - región 07-ebro-pirineo: 12
  - región 08-levante: 2
  - región 09-andalucia: 47
  - región 10-portugal-sur: 9

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 879 | 275,5 % | 1 | 2 | 1406 | 17 | 768 | 3,5 % | 2,5 % |
| Hortelanos | 607 | 190,3 % | 2 | 1 | 696 | 7 | 3675 | 3,0 % | 2,0 % |
| Canteros | 501 | 157,1 % | 3 | 1 | 130 | 2 | 426 | 4,5 % | 2,5 % |
| Mesta | 320 | 100,3 % | 5 | 1 | 130 | 3 | 4544 | 13,5 % | 7,5 % |
| Salineros | 318 | 99,7 % | 5 | 0 | 322 | 4 | 3653 | 5,0 % | 29,0 % |
| Arrieros | 300 | 94,0 % | 5 | 0 | 146 | 2 | 225 | 2,5 % | 3,0 % |
| Mercaderes | 197 | 61,8 % | 7 | 0 | 81 | 1 | 94 | 6,5 % | 0,0 % |
| Ferrones | 100 | 31,3 % | 7 | 0 | 43 | 1 | 249 | 11,5 % | 4,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 29 | 16 | 40 | 0 | 0 | 179 | 0 | 0 | 62 |
| Canteros | 25 | 16 | 160 | 0 | 0 | 173 | 0 | 0 | 135 |
| Ferrones | 9 | 8 | 0 | 0 | 0 | 69 | 0 | 17 | 20 |
| Hortelanos | 139 | 59 | 80 | 0 | 0 | 200 | 0 | 0 | 168 |
| Mercaderes | 16 | 8 | 0 | 0 | 0 | 165 | 0 | 0 | 20 |
| Mesta | 26 | 24 | 0 | 0 | 0 | 77 | 140 | 0 | 107 |
| Monjes | 281 | 133 | 40 | 0 | 0 | 227 | 0 | 0 | 205 |
| Salineros | 64 | 29 | 0 | 0 | 0 | 160 | 0 | 0 | 75 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1085 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1085 | termina obras mayores | sí |  |
| Ferrones | 1085 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1085 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1085 | funda pueblas | sí |  |
| Salineros | 1085 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 164 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 92 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 54 turnos) |
| Canteros | 1085-2 | termina obras mayores | sí |  |
| Ferrones | 1085-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1085-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1085-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1085-2 | funda pueblas | sí |  |
| Salineros | 1085-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 189 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 55 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 3 turnos) |
| Canteros | 1085-3 | termina obras mayores | sí |  |
| Ferrones | 1085-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 139 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 102 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 89 turnos) |
| Mesta | 1085-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no conoce ningún invernadero al que pueda llegar el ganado (mapa, 185 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 109 turnos); aún no hay lana esquilada que llevar a la feria (plan, 72 turnos) |
| Monjes | 1085-3 | funda pueblas | sí |  |
| Salineros | 1085-3 | saca sal o salazón y la vende | **no** | aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); no conoce ninguna feria a la que llegar y volver con la mercancía (mapa, 81 turnos) |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5759 | 717 | 0 | 0 | 0 | 12 | 0 | 0 | 655 | 1817 | 37 | 141 | 8 | 8 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 5136 | 80 | 553 | 0 | 0 | 5 | 1 | 0 | 213 | 1158 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 2063 | 930 | 0 | 0 | 285 | 4 | 0 | 3 | 200 | 776 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 26478 | 1252 | 0 | 0 | 0 | 37 | 1 | 0 | 250 | 1764 | 0 | 0 | 0 | 0 | 0 | 8 |
| Mercaderes | 0 | 0 | 0 | 3602 | 196 | 0 | 0 | 0 | 7 | 0 | 0 | 273 | 1152 | 44 | 117 | 8 | 7 | 0 | 0 |
| Mesta | 216 | 9 | 0 | 2716 | 927 | 0 | 0 | 0 | 10 | 0 | 0 | 174 | 1464 | 0 | 0 | 0 | 0 | 0 | 3 |
| Monjes | 0 | 0 | 0 | 35681 | 3399 | 0 | 0 | 0 | 70 | 0 | 0 | 294 | 1805 | 0 | 0 | 0 | 0 | 9 | 6 |
| Salineros | 0 | 0 | 40 | 9467 | 0 | 0 | 2015 | 0 | 16 | 0 | 0 | 317 | 1267 | 7 | 7 | 0 | 0 | 0 | 3 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1085 | T100 | arrieros | 165 | 165 | 0,0 % | igual turno a turno |
| 1085 | T100 | canteros | 374 | 374 | 0,0 % | igual turno a turno |
| 1085 | T100 | ferrones | 116 | 116 | 0,0 % | igual turno a turno |
| 1085 | T100 | hortelanos | 354 | 354 | 0,0 % | igual turno a turno |
| 1085 | T100 | mercaderes | 131 | 131 | 0,0 % | igual turno a turno |
| 1085 | T100 | mesta | 189 | 189 | 0,0 % | igual turno a turno |
| 1085 | T100 | monjes | 495 | 495 | 0,0 % | igual turno a turno |
| 1085 | T100 | salineros | 210 | 210 | 0,0 % | igual turno a turno |
| 1085 | T200 | arrieros | 300 | 300 | 0,0 % | igual turno a turno |
| 1085 | T200 | canteros | 505 | 505 | 0,0 % | igual turno a turno |
| 1085 | T200 | ferrones | 140 | 140 | 0,0 % | igual turno a turno |
| 1085 | T200 | hortelanos | 676 | 676 | 0,0 % | igual turno a turno |
| 1085 | T200 | mercaderes | 195 | 195 | 0,0 % | igual turno a turno |
| 1085 | T200 | mesta | 315 | 315 | 0,0 % | igual turno a turno |
| 1085 | T200 | monjes | 754 | 754 | 0,0 % | igual turno a turno |
| 1085 | T200 | salineros | 153 | 153 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | arrieros | 138 | 138 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | canteros | 340 | 340 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | ferrones | -61 | -61 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | hortelanos | 397 | 397 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | mercaderes | 109 | 109 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | mesta | 189 | 189 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | monjes | 314 | 314 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | salineros | 212 | 212 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | arrieros | 202 | 202 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | canteros | 428 | 428 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | ferrones | -69 | -69 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | hortelanos | 665 | 665 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | mercaderes | 173 | 173 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | mesta | 314 | 314 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | monjes | 683 | 683 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | salineros | 262 | 262 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | arrieros | 114 | 114 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | canteros | 331 | 331 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | ferrones | 42 | 42 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | hortelanos | 420 | 420 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | mercaderes | -31 | -31 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | mesta | 58 | 58 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | monjes | 411 | 411 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | salineros | 219 | 219 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | arrieros | 154 | 154 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | canteros | 429 | 429 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | ferrones | 30 | 30 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | hortelanos | 408 | 408 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | mercaderes | 43 | 43 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | mesta | 41 | 41 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | monjes | 902 | 902 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | salineros | 104 | 104 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 300 | 219 | 27,0 % | carga 949, mercado 787, ruta 236 |
| Canteros | 501 | 454 | 9,4 % | mercado 755, carga 594, ruta 112 |
| Ferrones | 100 | 34 | 66,0 % | mercado 746, carga 518, ruta 48 |
| Hortelanos | 607 | 583 | 4,0 % | mercado 1347, carga 681, ruta 199 |
| Mercaderes | 197 | 137 | 30,5 % | carga 958, mercado 695, ruta 139 |
| Mesta | 320 | 223 | 30,3 % | mercado 1389, carga 500, ruta 150 |
| Monjes | 879 | 780 | 11,3 % | mercado 1098, carga 732, ruta 264 |
| Salineros | 318 | 173 | 45,6 % | mercado 956, carga 427, ruta 109 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1085 | Arrieros | **no** | **no** | **no** | 3 |
| 1085 | Canteros | **no** | T129 | T129 | 4 |
| 1085 | Ferrones | **no** | **no** | **no** | 2 |
| 1085 | Hortelanos | T55 | **no** | **no** | 4 |
| 1085 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085 | Mesta | T94 | **no** | **no** | 5 |
| 1085 | Monjes | T43 | **no** | **no** | 4 |
| 1085 | Salineros | T76 | **no** | **no** | 4 |
| 1085-2 | Arrieros | T88 | **no** | **no** | 4 |
| 1085-2 | Canteros | **no** | T84 | T84 | 4 |
| 1085-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1085-2 | Hortelanos | T57 | T157 | T157 | 5 |
| 1085-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085-2 | Mesta | T163 | **no** | **no** | 5 |
| 1085-2 | Monjes | T43 | T159 | T159 | 5 |
| 1085-2 | Salineros | T66 | **no** | **no** | 4 |
| 1085-3 | Arrieros | **no** | T164 | T164 | 3 |
| 1085-3 | Canteros | **no** | T92 | T92 | 4 |
| 1085-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1085-3 | Hortelanos | T48 | T166 | T166 | 5 |
| 1085-3 | Mercaderes | **no** | **no** | **no** | 1 |
| 1085-3 | Mesta | **no** | **no** | **no** | 1 |
| 1085-3 | Monjes | T43 | **no** | **no** | 4 |
| 1085-3 | Salineros | **no** | **no** | **no** | 2 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1085 | Arrieros | 24 | 215 | 2262 | 1329 | 0 | 5 | 1186 |
| 1085 | Canteros | 0 | 0 | 0 | 0 | 0 | 116 | 1018 |
| 1085 | Ferrones | 0 | 0 | 0 | 0 | 49 | 44 | 527 |
| 1085 | Hortelanos | 0 | 0 | 0 | 0 | 113 | 479 | 776 |
| 1085 | Mercaderes | 3 | 13 | 44 | -85 | 0 | 0 | 1143 |
| 1085 | Mesta | 0 | 0 | 0 | 0 | 0 | 852 | 577 |
| 1085 | Monjes | 0 | 0 | 0 | 0 | 69 | 717 | 667 |
| 1085 | Salineros | 0 | 0 | 0 | 0 | 51 | 715 | 1029 |
| 1085-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 695 | 918 |
| 1085-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 136 | 1255 |
| 1085-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 375 |
| 1085-2 | Hortelanos | 0 | 0 | 0 | 0 | 73 | 581 | 818 |
| 1085-2 | Mercaderes | 20 | 158 | 1522 | 842 | 0 | 0 | 1198 |
| 1085-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 783 | 663 |
| 1085-2 | Monjes | 0 | 0 | 0 | 0 | 56 | 847 | 665 |
| 1085-2 | Salineros | 0 | 0 | 0 | 0 | 89 | 768 | 853 |
| 1085-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1052 | 1133 |
| 1085-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 804 |
| 1085-3 | Ferrones | 0 | 0 | 0 | 0 | 76 | 63 | 583 |
| 1085-3 | Hortelanos | 0 | 0 | 0 | 0 | 122 | 445 | 728 |
| 1085-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 756 |
| 1085-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 712 | 800 |
| 1085-3 | Monjes | 0 | 0 | 0 | 0 | 69 | 872 | 664 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 845 | 862 | 859 | 0 | 196 |
| Canteros | 619 | 637 | 636 | 0 | 110 |
| Ferrones | 552 | 568 | 567 | 0 | 43 |
| Hortelanos | 1015 | 1033 | 1024 | 4 | 210 |
| Mercaderes | 741 | 758 | 756 | 0 | 101 |
| Mesta | 864 | 881 | 877 | 3 | 59 |
| Monjes | 1010 | 1028 | 1019 | 6 | 285 |
| Salineros | 687 | 705 | 701 | 3 | 124 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 36
- incorporar: comarca-con-duenyo: 8
- construir: comarca-ajena: 4

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 70 | 95 | 116 | 135 | 188 | 212 | 191 | 206 | 279 | 300 |
| Canteros | 67 | 94 | 118 | 153 | 306 | 314 | 397 | 409 | 426 | 501 |
| Ferrones | 40 | 39 | 46 | 59 | 64 | 76 | 84 | 92 | 97 | 100 |
| Hortelanos | 154 | 191 | 311 | 372 | 416 | 452 | 445 | 466 | 576 | 607 |
| Mercaderes | 54 | 66 | 96 | 117 | 132 | 145 | 161 | 166 | 180 | 197 |
| Mesta | 33 | 64 | 138 | 146 | 206 | 195 | 236 | 272 | 310 | 320 |
| Monjes | 99 | 206 | 354 | 416 | 479 | 571 | 640 | 761 | 812 | 879 |
| Salineros | 90 | 120 | 142 | 214 | 238 | 267 | 292 | 309 | 332 | 318 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1085`: `294022a836b6acf24070f5c6966bd1dac3f9ba462fe546cf1a58013274d6e65a`
- semilla `1085-2`: `d4808567bec068da6c822ffce76c5ba2dde404fb5effeba143f92c28703ee701`
- semilla `1085-3`: `5e5fc07dc9107cb5b495670361b862f691f5bd92ac0be581074945b4d0fbdecd`
