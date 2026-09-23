# Banco de pruebas · semilla 1085

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 857 de prestigio (324,6 % de la mediana) y **Mesta** cierra la clasificación con 69 (26,1 % de la mediana). La mediana de prestigio es 264. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `42976fd04ac48dfd3557b0480186a1eec27cd84d` |
| Etiqueta del informe | E24-marcador2-1085 |
| Cambios experimentales | marcador reequilibrado |
| Versiones | banco 0.1.0 · métricas 4 · robots 4 · reglas 1 |
| Semillas | 1085, 1085-2, 1085-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `21d39c1fcdaedef952e8a708ebde3d292dc933bf80386ac9065ceb6a1bd31701` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 45 filas sin cerrar de 157.

112 cumplen, 45 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1085 | arrieros | — | 57,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 157 sobre una mediana exacta de 271,5 |
| prestigio | casa y partida | 1085 | canteros | — | 140,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 381 sobre una mediana exacta de 271,5 |
| prestigio | casa y partida | 1085 | ferrones | — | 55,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 150 sobre una mediana exacta de 271,5 |
| prestigio | casa y partida | 1085 | hortelanos | — | 223,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 606 sobre una mediana exacta de 271,5 |
| prestigio | casa y partida | 1085 | mercaderes | — | 77,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 211 sobre una mediana exacta de 271,5 |
| prestigio | casa y partida | 1085 | mesta | — | 26,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 72 sobre una mediana exacta de 271,5 |
| prestigio | casa y partida | 1085 | monjes | — | 319,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 867 sobre una mediana exacta de 271,5 |
| prestigio | casa y partida | 1085 | salineros | — | 122,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 332 sobre una mediana exacta de 271,5 |
| actividad | casa y partida | 1085 | arrieros | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | arrieros | — | 2,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 5 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085 | arrieros | — | 13 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 26 de 200 turnos |
| escasez | casa y partida | 1085 | canteros | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1085 | ferrones | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mesta | — | 8 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 16 de 200 turnos |
| escasez | casa y partida | 1085 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | salineros | — | 10,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 21 de 200 turnos |
| precios | partida | 1085 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1085 | — | — | 43,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 91 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 158 · a mano 158 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 330 · a mano 330 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 368 · a mano 368 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 69 · a mano 69 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 102 · a mano 102 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 325 · a mano 325 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 648 · a mano 648 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 171 · a mano 171 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 20 · a mano 20 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 457 · a mano 457 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 679 · a mano 679 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 132 · a mano 132 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | salineros | T200 | 3,1 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 186 · a mano 192 · el dominio se separa en T92 |
| dominio | partida | 1085 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085 | — | — | 144 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 1 de 8 casas lo alcanzan; la primera en T144 |
| prestigio | casa y partida | 1085-2 | arrieros | — | 80,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 269 sobre una mediana exacta de 334,5 |
| prestigio | casa y partida | 1085-2 | canteros | — | 119,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 400 sobre una mediana exacta de 334,5 |
| prestigio | casa y partida | 1085-2 | ferrones | — | -6,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -22 sobre una mediana exacta de 334,5 |
| prestigio | casa y partida | 1085-2 | hortelanos | — | 198,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 664 sobre una mediana exacta de 334,5 |
| prestigio | casa y partida | 1085-2 | mercaderes | — | 42,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 143 sobre una mediana exacta de 334,5 |
| prestigio | casa y partida | 1085-2 | mesta | — | 21,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 71 sobre una mediana exacta de 334,5 |
| prestigio | casa y partida | 1085-2 | monjes | — | 237,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 794 sobre una mediana exacta de 334,5 |
| prestigio | casa y partida | 1085-2 | salineros | — | 126,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 422 sobre una mediana exacta de 334,5 |
| actividad | casa y partida | 1085-2 | arrieros | — | 8 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 16 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | arrieros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | ferrones | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | monjes | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | monjes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | salineros | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085-2 | arrieros | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1085-2 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | ferrones | — | 41 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 82 de 200 turnos |
| escasez | casa y partida | 1085-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | mercaderes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1085-2 | mesta | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1085-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1085-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1085-2 | — | — | 59,0 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 147 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1085-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 113 · a mano 113 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 170 · a mano 170 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 365 · a mano 365 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -59 · a mano -59 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -64 · a mano -64 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 376 · a mano 376 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 579 · a mano 579 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 98 · a mano 98 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 57 · a mano 57 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 48 · a mano 48 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 309 · a mano 309 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 661 · a mano 661 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 259 · a mano 259 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 333 · a mano 333 · el dominio se separa en T67 |
| dominio | partida | 1085-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-2 | — | — | 105 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T105 |
| prestigio | casa y partida | 1085-3 | arrieros | — | 132,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 305 sobre una mediana exacta de 231 |
| prestigio | casa y partida | 1085-3 | canteros | — | 152,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 352 sobre una mediana exacta de 231 |
| prestigio | casa y partida | 1085-3 | ferrones | — | 68,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 157 sobre una mediana exacta de 231 |
| prestigio | casa y partida | 1085-3 | hortelanos | — | 402,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 929 sobre una mediana exacta de 231 |
| prestigio | casa y partida | 1085-3 | mercaderes | — | 50,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 116 sobre una mediana exacta de 231 |
| prestigio | casa y partida | 1085-3 | mesta | — | 27,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 63 sobre una mediana exacta de 231 |
| prestigio | casa y partida | 1085-3 | monjes | — | 393,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 909 sobre una mediana exacta de 231 |
| prestigio | casa y partida | 1085-3 | salineros | — | 42,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 98 sobre una mediana exacta de 231 |
| actividad | casa y partida | 1085-3 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | canteros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | canteros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | monjes | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | monjes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | salineros | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | ferrones | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | mercaderes | — | 9 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 18 de 200 turnos |
| escasez | casa y partida | 1085-3 | mesta | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1085-3 | monjes | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1085-3 | salineros | — | 11,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 23 de 200 turnos |
| precios | partida | 1085-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1085-3 | — | — | 42,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 89 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 106 · a mano 106 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 139 · a mano 139 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 330 · a mano 330 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 370 · a mano 370 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 37 · a mano 37 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 18 · a mano 18 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 865 · a mano 865 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -36 · a mano -36 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -37 · a mano -37 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 26 · a mano 26 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 350 · a mano 350 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 800 · a mano 800 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | salineros | T100 | 16,6 | % de diferencia de prestigio con el mismo plan | < 5 % | 🔴 incumple | por bloques 108 · a mano 90 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | salineros | T200 | 8,8 | % de diferencia de prestigio con el mismo plan | < 5 % | 🔴 incumple | por bloques 217 · a mano 238 · el dominio se separa en T97 |
| dominio | partida | 1085-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-3 | — | — | 94 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T94 |
| ganadores | campaña | 1085 | — | — | 0 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🟢 cumple | ganan monjes, monjes, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 143,2 %
  - Ferrones: 36,0 %
  - Hortelanos: 277,7 %
  - Mercaderes: 59,5 %
  - Mesta: 26,1 %
  - Monjes: 324,6 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1085-2): 41,0 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 152 de 403 comarcas
  - región 01-iberico-alto-duero: 7
  - región 02-meseta-norte: 6
  - región 03-cantabrico: 16
  - región 04-galicia-minho: 8
  - región 05-central-extremadura: 31
  - región 06-meseta-sur: 12
  - región 07-ebro-pirineo: 12
  - región 08-levante: 3
  - región 09-andalucia: 46
  - región 10-portugal-sur: 11

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 857 | 324,6 % | 1 | 2 | 1480 | 17 | 1249 | 0,5 % | 2,5 % |
| Hortelanos | 733 | 277,7 % | 2 | 2 | 754 | 8 | 2137 | 0,0 % | 2,0 % |
| Canteros | 378 | 143,2 % | 3 | 1 | 109 | 1 | 333 | 3,5 % | 1,5 % |
| Salineros | 284 | 107,6 % | 5 | 1 | 320 | 3 | 4936 | 7,5 % | 4,0 % |
| Arrieros | 244 | 92,4 % | 5 | 0 | 146 | 2 | 194 | 7,0 % | 4,0 % |
| Mercaderes | 157 | 59,5 % | 6 | 0 | 84 | 1 | 103 | 4,0 % | 0,0 % |
| Ferrones | 95 | 36,0 % | 7 | 0 | 44 | 1 | 107 | 14,0 % | 3,5 % |
| Mesta | 69 | 26,1 % | 8 | 0 | 36 | 1 | 110 | 8,5 % | 5,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 29 | 16 | 40 | 0 | 0 | 128 | 0 | 0 | 72 |
| Canteros | 21 | 11 | 120 | 0 | 0 | 128 | 0 | 0 | 105 |
| Ferrones | 9 | 8 | 0 | 0 | 0 | 69 | 0 | 17 | 20 |
| Hortelanos | 151 | 64 | 160 | 0 | 0 | 173 | 0 | 0 | 185 |
| Mercaderes | 16 | 8 | 0 | 0 | 0 | 120 | 0 | 0 | 20 |
| Mesta | 7 | 8 | 0 | 0 | 0 | 45 | 0 | 0 | 25 |
| Monjes | 296 | 133 | 40 | 0 | 0 | 200 | 0 | 0 | 188 |
| Salineros | 64 | 27 | 0 | 0 | 0 | 133 | 0 | 0 | 108 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1085 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 72 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 47 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 41 turnos) |
| Canteros | 1085 | termina obras mayores | sí |  |
| Ferrones | 1085 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 96 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 54 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 34 turnos) |
| Mesta | 1085 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 193 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 185 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 15 turnos) |
| Monjes | 1085 | funda pueblas | sí |  |
| Salineros | 1085 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 121 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 59 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 44 turnos) |
| Canteros | 1085-2 | termina obras mayores | sí |  |
| Ferrones | 1085-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 142 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 51 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 22 turnos) |
| Mesta | 1085-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 193 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 184 turnos); aún no hay lana esquilada que llevar a la feria (plan, 135 turnos) |
| Monjes | 1085-2 | funda pueblas | sí |  |
| Salineros | 1085-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 162 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 35 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 30 turnos) |
| Canteros | 1085-3 | termina obras mayores | sí |  |
| Ferrones | 1085-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 146 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 81 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 49 turnos) |
| Mesta | 1085-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 194 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 183 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 17 turnos) |
| Monjes | 1085-3 | funda pueblas | sí |  |
| Salineros | 1085-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5730 | 718 | 0 | 0 | 0 | 9 | 0 | 0 | 346 | 1707 | 0 | 0 | 0 | 0 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 5280 | 58 | 539 | 0 | 0 | 3 | 1 | 0 | 138 | 1162 | 0 | 0 | 0 | 0 | 0 | 0 |
| Ferrones | 0 | 0 | 0 | 2203 | 972 | 0 | 0 | 302 | 4 | 0 | 3 | 90 | 688 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 27863 | 1143 | 0 | 0 | 0 | 36 | 1 | 0 | 210 | 1897 | 0 | 0 | 0 | 0 | 0 | 7 |
| Mercaderes | 0 | 0 | 0 | 3728 | 197 | 0 | 0 | 0 | 7 | 0 | 0 | 109 | 1138 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 2 | 0 | 0 | 1597 | 1068 | 0 | 0 | 0 | 2 | 0 | 0 | 51 | 1746 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 37200 | 3393 | 0 | 0 | 0 | 74 | 0 | 0 | 256 | 1828 | 0 | 0 | 0 | 0 | 10 | 6 |
| Salineros | 0 | 0 | 0 | 12317 | 0 | 0 | 2227 | 0 | 24 | 0 | 0 | 143 | 1899 | 0 | 0 | 0 | 0 | 0 | 4 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1085 | T100 | arrieros | 158 | 158 | 0,0 % | se separa en T92 |
| 1085 | T100 | canteros | 321 | 321 | 0,0 % | se separa en T92 |
| 1085 | T100 | ferrones | 69 | 69 | 0,0 % | se separa en T92 |
| 1085 | T100 | hortelanos | 325 | 325 | 0,0 % | se separa en T92 |
| 1085 | T100 | mercaderes | 123 | 123 | 0,0 % | se separa en T92 |
| 1085 | T100 | mesta | 42 | 42 | 0,0 % | se separa en T92 |
| 1085 | T100 | monjes | 457 | 457 | 0,0 % | se separa en T92 |
| 1085 | T100 | salineros | 132 | 132 | 0,0 % | se separa en T92 |
| 1085 | T200 | arrieros | 330 | 330 | 0,0 % | se separa en T92 |
| 1085 | T200 | canteros | 368 | 368 | 0,0 % | se separa en T92 |
| 1085 | T200 | ferrones | 102 | 102 | 0,0 % | se separa en T92 |
| 1085 | T200 | hortelanos | 648 | 648 | 0,0 % | se separa en T92 |
| 1085 | T200 | mercaderes | 171 | 171 | 0,0 % | se separa en T92 |
| 1085 | T200 | mesta | 20 | 20 | 0,0 % | se separa en T92 |
| 1085 | T200 | monjes | 679 | 679 | 0,0 % | se separa en T92 |
| 1085 | T200 | salineros | 186 | 192 | 3,1 % | se separa en T92 |
| 1085-2 | T100 | arrieros | 113 | 113 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | ferrones | -59 | -59 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | hortelanos | 376 | 376 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | mercaderes | 98 | 98 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | mesta | 57 | 57 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | monjes | 309 | 309 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | salineros | 259 | 259 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | arrieros | 170 | 170 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | canteros | 365 | 365 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | ferrones | -64 | -64 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | hortelanos | 579 | 579 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | mercaderes | 130 | 130 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | mesta | 48 | 48 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | monjes | 661 | 661 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | salineros | 333 | 333 | 0,0 % | se separa en T67 |
| 1085-3 | T100 | arrieros | 106 | 106 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | canteros | 330 | 330 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | ferrones | 37 | 37 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | hortelanos | 451 | 451 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | mercaderes | -36 | -36 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | mesta | 42 | 42 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | monjes | 350 | 350 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | salineros | 108 | 90 | 16,6 % | se separa en T97 |
| 1085-3 | T200 | arrieros | 139 | 139 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | canteros | 370 | 370 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | ferrones | 18 | 18 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | hortelanos | 865 | 865 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | mercaderes | -37 | -37 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | mesta | 26 | 26 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | monjes | 800 | 800 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | salineros | 217 | 238 | 8,8 % | se separa en T97 |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 244 | 213 | 12,7 % | mercado 834, carga 631, ruta 173 |
| Canteros | 378 | 368 | 2,6 % | mercado 738, carga 559, ruta 72 |
| Ferrones | 95 | 19 | 80,0 % | mercado 650, carga 510, ruta 38 |
| Hortelanos | 733 | 697 | 4,9 % | mercado 1128, carga 652, ruta 170 |
| Mercaderes | 157 | 88 | 43,9 % | mercado 742, carga 580, ruta 84 |
| Mesta | 69 | 31 | 55,1 % | mercado 1361, carga 481, cometido 21 |
| Monjes | 857 | 713 | 16,8 % | mercado 1125, carga 728, ruta 258 |
| Salineros | 284 | 245 | 13,7 % | mercado 1428, carga 562, ruta 88 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1085 | Arrieros | T93 | **no** | **no** | 4 |
| 1085 | Canteros | **no** | T144 | T144 | 4 |
| 1085 | Ferrones | **no** | **no** | **no** | 2 |
| 1085 | Hortelanos | T54 | **no** | **no** | 4 |
| 1085 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085 | Mesta | **no** | **no** | **no** | 2 |
| 1085 | Monjes | T43 | **no** | **no** | 4 |
| 1085 | Salineros | T73 | **no** | **no** | 4 |
| 1085-2 | Arrieros | T88 | **no** | **no** | 4 |
| 1085-2 | Canteros | **no** | T105 | T105 | 3 |
| 1085-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1085-2 | Hortelanos | T57 | T108 | T108 | 5 |
| 1085-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085-2 | Mesta | **no** | **no** | **no** | 2 |
| 1085-2 | Monjes | T43 | T145 | T145 | 5 |
| 1085-2 | Salineros | T91 | **no** | **no** | 4 |
| 1085-3 | Arrieros | **no** | T160 | T160 | 3 |
| 1085-3 | Canteros | **no** | T112 | T112 | 3 |
| 1085-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1085-3 | Hortelanos | T67 | T94 | T94 | 5 |
| 1085-3 | Mercaderes | **no** | **no** | **no** | 1 |
| 1085-3 | Mesta | **no** | **no** | **no** | 2 |
| 1085-3 | Monjes | T43 | **no** | **no** | 4 |
| 1085-3 | Salineros | T81 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1085 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 829 |
| 1085 | Canteros | 0 | 0 | 0 | 0 | 0 | 127 | 1007 |
| 1085 | Ferrones | 0 | 0 | 0 | 0 | 39 | 20 | 526 |
| 1085 | Hortelanos | 0 | 0 | 0 | 0 | 108 | 444 | 774 |
| 1085 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1260 |
| 1085 | Mesta | 0 | 0 | 0 | 0 | 0 | 905 | 830 |
| 1085 | Monjes | 0 | 0 | 0 | 0 | 79 | 620 | 690 |
| 1085 | Salineros | 0 | 0 | 0 | 0 | 56 | 726 | 1044 |
| 1085-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 754 | 1182 |
| 1085-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 1253 |
| 1085-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 366 |
| 1085-2 | Hortelanos | 0 | 0 | 0 | 0 | 31 | 785 | 959 |
| 1085-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1264 |
| 1085-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 901 | 843 |
| 1085-2 | Monjes | 0 | 0 | 0 | 0 | 77 | 782 | 621 |
| 1085-2 | Salineros | 0 | 0 | 0 | 0 | 71 | 916 | 815 |
| 1085-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1052 | 1272 |
| 1085-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 131 | 819 |
| 1085-3 | Ferrones | 0 | 0 | 0 | 0 | 41 | 49 | 600 |
| 1085-3 | Hortelanos | 0 | 0 | 0 | 0 | 38 | 668 | 1006 |
| 1085-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 875 |
| 1085-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 882 | 863 |
| 1085-3 | Monjes | 0 | 0 | 0 | 0 | 77 | 818 | 646 |
| 1085-3 | Salineros | 0 | 0 | 0 | 0 | 34 | 663 | 1130 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 719 | 737 | 734 | 1 | 143 |
| Canteros | 598 | 616 | 615 | 0 | 80 |
| Ferrones | 517 | 534 | 534 | 0 | 42 |
| Hortelanos | 906 | 924 | 918 | 2 | 184 |
| Mercaderes | 595 | 613 | 612 | 0 | 70 |
| Mesta | 774 | 791 | 791 | 0 | 25 |
| Monjes | 1018 | 1036 | 1026 | 7 | 268 |
| Salineros | 945 | 962 | 958 | 2 | 114 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 24
- incorporar: comarca-con-duenyo: 8
- construir: comarca-ajena: 3

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 69 | 87 | 104 | 117 | 181 | 169 | 166 | 222 | 233 | 244 |
| Canteros | 68 | 89 | 111 | 133 | 143 | 274 | 282 | 359 | 370 | 378 |
| Ferrones | 32 | 26 | 33 | 54 | 70 | 79 | 81 | 82 | 89 | 95 |
| Hortelanos | 157 | 191 | 276 | 343 | 449 | 533 | 558 | 600 | 635 | 733 |
| Mercaderes | 57 | 74 | 93 | 109 | 119 | 125 | 134 | 135 | 146 | 157 |
| Mesta | 38 | 38 | 64 | 73 | 80 | 83 | 85 | 73 | 69 | 69 |
| Monjes | 83 | 187 | 332 | 395 | 457 | 543 | 608 | 733 | 792 | 857 |
| Salineros | 99 | 124 | 153 | 206 | 263 | 298 | 330 | 353 | 333 | 284 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1085`: `e5fe76c293e15d73f6dbcc9be95ad11f715be0141d6bd2b1d86d84ce34d00862`
- semilla `1085-2`: `435114181cc6487994d38824001c18ff1465878ca2078ddc5d7538d59966d41b`
- semilla `1085-3`: `5f601e5cc358689444124f6daeadea42eb588d31fb9810b239b2444c51b2392c`
