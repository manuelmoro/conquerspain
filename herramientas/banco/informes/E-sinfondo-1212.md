# Banco de pruebas · semilla 1212

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Hortelanos** va en cabeza con 915 de prestigio (275,6 % de la mediana) y **Ferrones** cierra la clasificación con 40 (12,0 % de la mediana). La mediana de prestigio es 332. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `e99a7f5+ensayo` |
| Etiqueta del informe | E-sinfondo-1212 |
| Cambios experimentales | arbitraje.BOLSA_MAXIMA=0 (ensayo T-047) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1212, 1212-2, 1212-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `23d84e7ff0edf76c47cb79da2641dafa5044acf57e25009f74f41cd32b90a23f` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 46 filas sin cerrar de 157.

111 cumplen, 46 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1212 | arrieros | — | 102,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 305 sobre una mediana exacta de 298,5 |
| prestigio | casa y partida | 1212 | canteros | — | 144,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 430 sobre una mediana exacta de 298,5 |
| prestigio | casa y partida | 1212 | ferrones | — | -3,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -9 sobre una mediana exacta de 298,5 |
| prestigio | casa y partida | 1212 | hortelanos | — | 332,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 991 sobre una mediana exacta de 298,5 |
| prestigio | casa y partida | 1212 | mercaderes | — | 54,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 164 sobre una mediana exacta de 298,5 |
| prestigio | casa y partida | 1212 | mesta | — | 19,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 58 sobre una mediana exacta de 298,5 |
| prestigio | casa y partida | 1212 | monjes | — | 237,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 708 sobre una mediana exacta de 298,5 |
| prestigio | casa y partida | 1212 | salineros | — | 97,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 292 sobre una mediana exacta de 298,5 |
| actividad | casa y partida | 1212 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1212 | canteros | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1212 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1212 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | mercaderes | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1212 | mesta | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1212 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1212 | salineros | — | 10 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 20 de 200 turnos |
| precios | partida | 1212 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212 | — | — | 59,4 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 148 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 99 · a mano 99 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 146 · a mano 146 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 381 · a mano 381 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -57 · a mano -57 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -71 · a mano -71 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 430 · a mano 430 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 968 · a mano 968 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 61 · a mano 61 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 153 · a mano 153 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 18 · a mano 18 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 284 · a mano 284 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 604 · a mano 604 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 165 · a mano 165 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | salineros | T200 | 13 | % de diferencia de prestigio con el mismo plan | < 5 % | 🔴 incumple | por bloques 173 · a mano 199 · el dominio se separa en T55 |
| dominio | partida | 1212 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 4 de 8 casas lo alcanzan; la primera en T109 |
| prestigio | casa y partida | 1212-2 | arrieros | — | 65,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 207 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | canteros | — | 134,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 421 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | ferrones | — | -5,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -17 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | hortelanos | — | 269,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 847 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | mercaderes | — | 54,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 171 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | mesta | — | 57,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 179 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | monjes | — | 204,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 643 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | salineros | — | 174,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 549 sobre una mediana exacta de 314 |
| actividad | casa y partida | 1212-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | canteros | — | 6 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 12 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
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
| escasez | casa y partida | 1212-2 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1212-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mesta | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1212-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1212-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-2 | — | — | 62,7 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 156 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 127 · a mano 127 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 351 · a mano 351 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 510 · a mano 510 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -57 · a mano -57 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -71 · a mano -71 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 479 · a mano 479 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 772 · a mano 772 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 107 · a mano 107 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 147 · a mano 147 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 44 · a mano 44 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 25 · a mano 25 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 253 · a mano 253 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 542 · a mano 542 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 272 · a mano 272 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio se separa en T79 |
| dominio | partida | 1212-2 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212-2 | — | — | 69 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T69 |
| prestigio | casa y partida | 1212-3 | arrieros | — | 77,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 242 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1212-3 | canteros | — | 122,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 384 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1212-3 | ferrones | — | 47,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 147 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1212-3 | hortelanos | — | 290,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 908 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1212-3 | mercaderes | — | 50,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 158 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1212-3 | mesta | — | 16,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 50 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1212-3 | monjes | — | 261,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 817 sobre una mediana exacta de 313 |
| prestigio | casa y partida | 1212-3 | salineros | — | 182,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 570 sobre una mediana exacta de 313 |
| actividad | casa y partida | 1212-3 | arrieros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1212-3 | mesta | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1212-3 | monjes | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1212-3 | salineros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| precios | partida | 1212-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-3 | — | — | 45,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 114 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 154 · a mano 154 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 219 · a mano 219 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 400 · a mano 400 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 40 · a mano 40 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 19 · a mano 19 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 383 · a mano 383 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 898 · a mano 898 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 83 · a mano 83 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 124 · a mano 124 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 28 · a mano 28 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 442 · a mano 442 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 660 · a mano 660 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 284 · a mano 284 · el dominio se separa en T169 |
| ausencia | casa y partida | 1212-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 506 · a mano 506 · el dominio se separa en T169 |
| dominio | partida | 1212-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1212-3 | — | — | 94 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T94 |
| ganadores | campaña | 1212 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan hortelanos, hortelanos, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 75,6 %
  - Canteros: 124,1 %
  - Ferrones: 12,0 %
  - Hortelanos: 275,6 %
  - Mercaderes: 49,4 %
  - Mesta: 28,9 %
  - Monjes: 217,8 %
  - Salineros: 141,6 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1212): 34,5 % de los turnos
  - Ferrones (semilla 1212-2): 34,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 185 de 403 comarcas
  - región 01-iberico-alto-duero: 3
  - región 02-meseta-norte: 7
  - región 03-cantabrico: 16
  - región 04-galicia-minho: 29
  - región 05-central-extremadura: 22
  - región 06-meseta-sur: 10
  - región 07-ebro-pirineo: 29
  - región 08-levante: 14
  - región 09-andalucia: 47
  - región 10-portugal-sur: 8

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Hortelanos | 915 | 275,6 % | 1 | 3 | 1029 | 11 | 2956 | 0,0 % | 1,5 % |
| Monjes | 723 | 217,8 % | 2 | 1 | 1104 | 11 | 981 | 1,0 % | 2,0 % |
| Salineros | 470 | 141,6 % | 4 | 0 | 790 | 10 | 3962 | 4,0 % | 3,0 % |
| Canteros | 412 | 124,1 % | 4 | 1 | 137 | 2 | 511 | 1,5 % | 2,5 % |
| Arrieros | 251 | 75,6 % | 5 | 0 | 80 | 1 | 237 | 0,0 % | 1,5 % |
| Mercaderes | 164 | 49,4 % | 6 | 0 | 91 | 1 | 97 | 2,0 % | 0,0 % |
| Mesta | 96 | 28,9 % | 7 | 0 | 36 | 1 | 109 | 8,5 % | 4,0 % |
| Ferrones | 40 | 12,0 % | 8 | 0 | 28 | 1 | 128 | 23,5 % | 3,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 16 | 8 | 40 | 0 | 0 | 149 | 0 | 0 | 38 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 133 | 0 | 0 | 118 |
| Ferrones | 5 | 8 | 0 | 0 | 0 | 51 | 0 | 8 | 15 |
| Hortelanos | 206 | 91 | 160 | 0 | 0 | 211 | 0 | 0 | 248 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 117 | 0 | 0 | 25 |
| Mesta | 7 | 8 | 0 | 0 | 0 | 37 | 40 | 0 | 20 |
| Monjes | 220 | 91 | 80 | 0 | 0 | 165 | 0 | 0 | 168 |
| Salineros | 158 | 80 | 0 | 0 | 0 | 149 | 0 | 0 | 92 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1212 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 197 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 31 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 5 turnos) |
| Canteros | 1212 | termina obras mayores | sí |  |
| Ferrones | 1212 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 184 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 35 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 27 turnos) |
| Mesta | 1212 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 195 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 186 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 14 turnos) |
| Monjes | 1212 | funda pueblas | sí |  |
| Salineros | 1212 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 188 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 21 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 9 turnos) |
| Canteros | 1212-2 | termina obras mayores | sí |  |
| Ferrones | 1212-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 187 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 19 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 11 turnos) |
| Mesta | 1212-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | aún no hay lana esquilada que llevar a la feria (plan, 160 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 159 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 80 turnos) |
| Monjes | 1212-2 | funda pueblas | sí |  |
| Salineros | 1212-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 197 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 25 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 8 turnos) |
| Canteros | 1212-3 | termina obras mayores | sí |  |
| Ferrones | 1212-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1212-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 183 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 33 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 28 turnos) |
| Mesta | 1212-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 178 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 22 turnos) |
| Monjes | 1212-3 | funda pueblas | sí |  |
| Salineros | 1212-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 4524 | 783 | 0 | 0 | 0 | 8 | 0 | 0 | 362 | 1887 | 0 | 0 | 0 | 0 | 0 | 0 |
| Canteros | 0 | 0 | 0 | 5622 | 73 | 550 | 0 | 0 | 5 | 1 | 0 | 148 | 1285 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 1275 | 427 | 0 | 0 | 163 | 5 | 0 | 1 | 50 | 540 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 33388 | 1615 | 0 | 0 | 0 | 52 | 1 | 0 | 210 | 1885 | 0 | 0 | 0 | 0 | 0 | 10 |
| Mercaderes | 0 | 0 | 0 | 4385 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 139 | 1255 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 3 | 0 | 0 | 1578 | 1263 | 0 | 0 | 0 | 2 | 0 | 0 | 43 | 1758 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 30712 | 3673 | 0 | 0 | 0 | 53 | 1 | 0 | 205 | 1815 | 0 | 0 | 0 | 0 | 5 | 5 |
| Salineros | 0 | 0 | 0 | 19689 | 0 | 0 | 2027 | 0 | 32 | 0 | 0 | 162 | 1899 | 0 | 0 | 0 | 0 | 0 | 9 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1212 | T100 | arrieros | 99 | 99 | 0,0 % | se separa en T55 |
| 1212 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T55 |
| 1212 | T100 | ferrones | -57 | -57 | 0,0 % | se separa en T55 |
| 1212 | T100 | hortelanos | 430 | 430 | 0,0 % | se separa en T55 |
| 1212 | T100 | mercaderes | 61 | 61 | 0,0 % | se separa en T55 |
| 1212 | T100 | mesta | 42 | 42 | 0,0 % | se separa en T55 |
| 1212 | T100 | monjes | 284 | 284 | 0,0 % | se separa en T55 |
| 1212 | T100 | salineros | 165 | 165 | 0,0 % | se separa en T55 |
| 1212 | T200 | arrieros | 146 | 146 | 0,0 % | se separa en T55 |
| 1212 | T200 | canteros | 381 | 381 | 0,0 % | se separa en T55 |
| 1212 | T200 | ferrones | -71 | -71 | 0,0 % | se separa en T55 |
| 1212 | T200 | hortelanos | 968 | 968 | 0,0 % | se separa en T55 |
| 1212 | T200 | mercaderes | 153 | 153 | 0,0 % | se separa en T55 |
| 1212 | T200 | mesta | 18 | 18 | 0,0 % | se separa en T55 |
| 1212 | T200 | monjes | 604 | 604 | 0,0 % | se separa en T55 |
| 1212 | T200 | salineros | 173 | 199 | 13,0 % | se separa en T55 |
| 1212-2 | T100 | arrieros | 127 | 127 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | canteros | 321 | 321 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | ferrones | -57 | -57 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | hortelanos | 479 | 479 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | mercaderes | 107 | 107 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | mesta | 44 | 44 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | monjes | 253 | 253 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | salineros | 272 | 272 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | arrieros | 351 | 351 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | canteros | 510 | 510 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | ferrones | -71 | -71 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | hortelanos | 772 | 772 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | mercaderes | 147 | 147 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | mesta | 25 | 25 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | monjes | 542 | 542 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | salineros | 375 | 375 | 0,0 % | se separa en T79 |
| 1212-3 | T100 | arrieros | 154 | 154 | 0,0 % | se separa en T169 |
| 1212-3 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T169 |
| 1212-3 | T100 | ferrones | 40 | 40 | 0,0 % | se separa en T169 |
| 1212-3 | T100 | hortelanos | 383 | 383 | 0,0 % | se separa en T169 |
| 1212-3 | T100 | mercaderes | 83 | 83 | 0,0 % | se separa en T169 |
| 1212-3 | T100 | mesta | 42 | 42 | 0,0 % | se separa en T169 |
| 1212-3 | T100 | monjes | 442 | 442 | 0,0 % | se separa en T169 |
| 1212-3 | T100 | salineros | 284 | 284 | 0,0 % | se separa en T169 |
| 1212-3 | T200 | arrieros | 219 | 219 | 0,0 % | se separa en T169 |
| 1212-3 | T200 | canteros | 400 | 400 | 0,0 % | se separa en T169 |
| 1212-3 | T200 | ferrones | 19 | 19 | 0,0 % | se separa en T169 |
| 1212-3 | T200 | hortelanos | 898 | 898 | 0,0 % | se separa en T169 |
| 1212-3 | T200 | mercaderes | 124 | 124 | 0,0 % | se separa en T169 |
| 1212-3 | T200 | mesta | 28 | 28 | 0,0 % | se separa en T169 |
| 1212-3 | T200 | monjes | 660 | 660 | 0,0 % | se separa en T169 |
| 1212-3 | T200 | salineros | 506 | 506 | 0,0 % | se separa en T169 |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 251 | 239 | 4,8 % | mercado 1047, carga 659, ruta 176 |
| Canteros | 412 | 430 | 4,2 % | mercado 799, carga 573, ruta 92 |
| Ferrones | 40 | -41 | 197,6 % | mercado 610, carga 502, ruta 28 |
| Hortelanos | 915 | 879 | 3,9 % | mercado 1270, carga 671, ruta 188 |
| Mercaderes | 164 | 141 | 14,0 % | mercado 832, carga 572, ruta 76 |
| Mesta | 96 | 24 | 75,0 % | mercado 1404, carga 486, ruta 26 |
| Monjes | 723 | 602 | 16,7 % | mercado 1175, carga 656, ruta 179 |
| Salineros | 470 | 351 | 25,3 % | mercado 1345, carga 593, ruta 116 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1212 | Arrieros | **no** | T157 | T157 | 3 |
| 1212 | Canteros | **no** | T109 | T109 | 4 |
| 1212 | Ferrones | **no** | **no** | **no** | 1 |
| 1212 | Hortelanos | T55 | T136 | T136 | 5 |
| 1212 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212 | Mesta | **no** | **no** | **no** | 2 |
| 1212 | Monjes | T54 | T138 | T138 | 5 |
| 1212 | Salineros | T86 | **no** | **no** | 4 |
| 1212-2 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-2 | Canteros | **no** | T69 | T69 | 4 |
| 1212-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1212-2 | Hortelanos | T62 | T112 | T112 | 5 |
| 1212-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-2 | Mesta | **no** | **no** | **no** | 1 |
| 1212-2 | Monjes | T54 | T137 | T137 | 5 |
| 1212-2 | Salineros | T64 | **no** | **no** | 4 |
| 1212-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-3 | Canteros | **no** | T106 | T106 | 4 |
| 1212-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1212-3 | Hortelanos | T62 | T94 | T94 | 5 |
| 1212-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-3 | Mesta | **no** | **no** | **no** | 2 |
| 1212-3 | Monjes | T43 | **no** | **no** | 4 |
| 1212-3 | Salineros | T64 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1212 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1036 | 1260 |
| 1212 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1214 |
| 1212 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 374 |
| 1212 | Hortelanos | 0 | 0 | 0 | 0 | 85 | 468 | 938 |
| 1212 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1218 |
| 1212 | Mesta | 0 | 0 | 0 | 0 | 0 | 860 | 829 |
| 1212 | Monjes | 0 | 0 | 0 | 0 | 101 | 470 | 798 |
| 1212 | Salineros | 0 | 0 | 0 | 0 | 37 | 662 | 1108 |
| 1212-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 661 | 983 |
| 1212-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 110 | 1052 |
| 1212-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 376 |
| 1212-2 | Hortelanos | 0 | 0 | 0 | 0 | 67 | 492 | 956 |
| 1212-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1218 |
| 1212-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 860 | 976 |
| 1212-2 | Monjes | 0 | 0 | 0 | 0 | 96 | 582 | 741 |
| 1212-2 | Salineros | 0 | 0 | 0 | 0 | 47 | 864 | 879 |
| 1212-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 400 | 1296 |
| 1212-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 136 | 1193 |
| 1212-3 | Ferrones | 0 | 0 | 0 | 0 | 40 | 34 | 594 |
| 1212-3 | Hortelanos | 0 | 0 | 0 | 0 | 73 | 529 | 954 |
| 1212-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1311 |
| 1212-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 948 | 789 |
| 1212-3 | Monjes | 0 | 0 | 0 | 0 | 81 | 652 | 676 |
| 1212-3 | Salineros | 0 | 0 | 0 | 0 | 32 | 703 | 1037 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 834 | 852 | 847 | 0 | 164 |
| Canteros | 633 | 651 | 650 | 0 | 82 |
| Ferrones | 483 | 499 | 498 | 0 | 30 |
| Hortelanos | 1008 | 1026 | 1017 | 5 | 214 |
| Mercaderes | 632 | 650 | 647 | 0 | 71 |
| Mesta | 790 | 807 | 807 | 0 | 20 |
| Monjes | 947 | 965 | 959 | 3 | 201 |
| Salineros | 970 | 988 | 974 | 5 | 150 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 38
- incorporar: comarca-con-duenyo: 4

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 67 | 93 | 111 | 125 | 138 | 149 | 162 | 224 | 241 | 251 |
| Canteros | 68 | 84 | 100 | 186 | 194 | 333 | 349 | 357 | 382 | 412 |
| Ferrones | 23 | 8 | 1 | -3 | 2 | 19 | 27 | 30 | 35 | 40 |
| Hortelanos | 174 | 246 | 320 | 408 | 518 | 624 | 717 | 776 | 836 | 915 |
| Mercaderes | 55 | 74 | 92 | 111 | 119 | 130 | 138 | 146 | 156 | 164 |
| Mesta | 34 | 42 | 53 | 65 | 68 | 82 | 89 | 86 | 95 | 96 |
| Monjes | 77 | 126 | 279 | 345 | 386 | 450 | 625 | 657 | 681 | 723 |
| Salineros | 88 | 115 | 160 | 252 | 303 | 348 | 384 | 428 | 451 | 470 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1212`: `229a88a6b087496d979eb65d30b45004eb7e47847b75b0f3f34088c74274a5d6`
- semilla `1212-2`: `2ab94f32a4cdba33971d580a20e2feb71d0a43f23fddce42c6ca95de944b8d3a`
- semilla `1212-3`: `0ec1bc3be9d95cf877d0df0c43e6277e0d97b869128d5d4f9cec6eaf3d66b8b2`
