# Banco de pruebas · semilla 1212

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Hortelanos** va en cabeza con 971 de prestigio (285,6 % de la mediana) y **Ferrones** cierra la clasificación con 44 (12,9 % de la mediana). La mediana de prestigio es 340. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `bfcf751b6b84f17bb104ff27b853a18f2f561707` |
| Etiqueta del informe | E-recargo250-1212 |
| Cambios experimentales | mercado.recargoPorJornadaMil=250 (ensayo, revertido) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1212, 1212-2, 1212-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `ff7fc640405667b82ad7432f76a9e060c0708965467e5f7042f44ea95a1954ab` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 46 filas sin cerrar de 157.

111 cumplen, 46 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1212 | arrieros | — | 102,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 304 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | canteros | — | 144,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 430 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | ferrones | — | -3,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -9 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | hortelanos | — | 315,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 941 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | mercaderes | — | 46,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 139 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | mesta | — | 19,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 58 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | monjes | — | 244,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 728 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | salineros | — | 98,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 292 sobre una mediana exacta de 298 |
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
| escasez | casa y partida | 1212 | canteros | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1212 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1212 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | mercaderes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1212 | mesta | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1212 | monjes | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1212 | salineros | — | 10 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 20 de 200 turnos |
| precios | partida | 1212 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212 | — | — | 59,4 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 148 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 99 · a mano 99 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 139 · a mano 139 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 381 · a mano 381 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -57 · a mano -57 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -67 · a mano -67 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 452 · a mano 452 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 881 · a mano 881 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 61 · a mano 61 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 152 · a mano 152 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 18 · a mano 18 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 308 · a mano 308 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 659 · a mano 659 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 165 · a mano 165 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | salineros | T200 | 13 | % de diferencia de prestigio con el mismo plan | < 5 % | 🔴 incumple | por bloques 173 · a mano 199 · el dominio se separa en T55 |
| dominio | partida | 1212 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 4 de 8 casas lo alcanzan; la primera en T109 |
| prestigio | casa y partida | 1212-2 | arrieros | — | 65,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 207 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | canteros | — | 134,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 421 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | ferrones | — | -1,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -5 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | hortelanos | — | 270,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 848 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | mercaderes | — | 54,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 171 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | mesta | — | 57,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 179 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | monjes | — | 203,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 639 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | salineros | — | 174,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 549 sobre una mediana exacta de 314 |
| actividad | casa y partida | 1212-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | canteros | — | 6 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 12 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | ferrones | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1212-2 | ferrones | — | 36,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 73 de 200 turnos |
| escasez | casa y partida | 1212-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mesta | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1212-2 | monjes | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1212-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1212-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-2 | — | — | 62,7 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 156 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 127 · a mano 127 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 353 · a mano 353 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 510 · a mano 510 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -57 · a mano -57 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -67 · a mano -67 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 479 · a mano 479 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 776 · a mano 776 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 107 · a mano 107 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 147 · a mano 147 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 44 · a mano 44 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 25 · a mano 25 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 252 · a mano 252 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 546 · a mano 546 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 272 · a mano 272 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio se separa en T79 |
| dominio | partida | 1212-2 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212-2 | — | — | 69 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T69 |
| prestigio | casa y partida | 1212-3 | arrieros | — | 71,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 242 sobre una mediana exacta de 338 |
| prestigio | casa y partida | 1212-3 | canteros | — | 128,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 434 sobre una mediana exacta de 338 |
| prestigio | casa y partida | 1212-3 | ferrones | — | 43,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 147 sobre una mediana exacta de 338 |
| prestigio | casa y partida | 1212-3 | hortelanos | — | 332,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 1124 sobre una mediana exacta de 338 |
| prestigio | casa y partida | 1212-3 | mercaderes | — | 46,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 158 sobre una mediana exacta de 338 |
| prestigio | casa y partida | 1212-3 | mesta | — | 14,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 50 sobre una mediana exacta de 338 |
| prestigio | casa y partida | 1212-3 | monjes | — | 237,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 801 sobre una mediana exacta de 338 |
| prestigio | casa y partida | 1212-3 | salineros | — | 168,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 570 sobre una mediana exacta de 338 |
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
| escasez | casa y partida | 1212-3 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1212-3 | salineros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| precios | partida | 1212-3 | — | — | 4 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-tierra-de-valladolid, sal: 4 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1212-3 | — | — | 45,4 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 113 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 154 · a mano 154 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 219 · a mano 219 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 400 · a mano 400 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 40 · a mano 40 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 19 · a mano 19 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 452 · a mano 452 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 881 · a mano 881 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 83 · a mano 83 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 124 · a mano 124 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 28 · a mano 28 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 349 · a mano 349 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 562 · a mano 562 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 284 · a mano 284 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 506 · a mano 506 · el dominio coincide turno a turno |
| dominio | partida | 1212-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1212-3 | — | — | 106 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T106 |
| ganadores | campaña | 1212 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan hortelanos, hortelanos, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 73,8 %
  - Canteros: 125,9 %
  - Ferrones: 12,9 %
  - Hortelanos: 285,6 %
  - Mercaderes: 45,9 %
  - Mesta: 28,2 %
  - Monjes: 212,6 %
  - Salineros: 138,2 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1212): 34,5 % de los turnos
  - Ferrones (semilla 1212-2): 36,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 185 de 403 comarcas
  - región 01-iberico-alto-duero: 4
  - región 02-meseta-norte: 7
  - región 03-cantabrico: 16
  - región 04-galicia-minho: 28
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
| Hortelanos | 971 | 285,6 % | 1 | 3 | 1197 | 13 | 4444 | 0,0 % | 1,5 % |
| Monjes | 723 | 212,6 % | 2 | 1 | 1110 | 12 | 1269 | 1,5 % | 2,0 % |
| Salineros | 470 | 138,2 % | 4 | 0 | 790 | 10 | 3952 | 4,0 % | 3,0 % |
| Canteros | 428 | 125,9 % | 4 | 1 | 137 | 2 | 511 | 1,5 % | 2,5 % |
| Arrieros | 251 | 73,8 % | 5 | 0 | 79 | 1 | 184 | 0,0 % | 1,5 % |
| Mercaderes | 156 | 45,9 % | 6 | 0 | 91 | 1 | 95 | 2,0 % | 0,0 % |
| Mesta | 96 | 28,2 % | 7 | 0 | 36 | 1 | 109 | 8,5 % | 4,0 % |
| Ferrones | 44 | 12,9 % | 8 | 0 | 27 | 1 | 126 | 24,0 % | 3,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 15 | 8 | 40 | 0 | 0 | 149 | 0 | 0 | 38 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 133 | 0 | 0 | 135 |
| Ferrones | 5 | 8 | 0 | 0 | 0 | 56 | 0 | 8 | 15 |
| Hortelanos | 239 | 107 | 160 | 0 | 0 | 200 | 0 | 0 | 265 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 109 | 0 | 0 | 25 |
| Mesta | 7 | 8 | 0 | 0 | 0 | 37 | 40 | 0 | 20 |
| Monjes | 221 | 93 | 80 | 0 | 0 | 163 | 0 | 0 | 168 |
| Salineros | 158 | 80 | 0 | 0 | 0 | 149 | 0 | 0 | 92 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1212 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 189 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 63 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 31 turnos) |
| Canteros | 1212 | termina obras mayores | sí |  |
| Ferrones | 1212 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1212 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 195 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 186 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 14 turnos) |
| Monjes | 1212 | funda pueblas | sí |  |
| Salineros | 1212 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-2 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1212-2 | termina obras mayores | sí |  |
| Ferrones | 1212-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 73 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 134 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 56 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 49 turnos) |
| Mesta | 1212-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | aún no hay lana esquilada que llevar a la feria (plan, 160 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 159 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 80 turnos) |
| Monjes | 1212-2 | funda pueblas | sí |  |
| Salineros | 1212-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 116 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 71 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 38 turnos) |
| Canteros | 1212-3 | termina obras mayores | sí |  |
| Ferrones | 1212-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1212-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 141 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 42 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 33 turnos) |
| Mesta | 1212-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 178 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 22 turnos) |
| Monjes | 1212-3 | funda pueblas | sí |  |
| Salineros | 1212-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 4532 | 777 | 0 | 0 | 0 | 8 | 0 | 0 | 503 | 2032 | 83 | 115 | 20 | 20 | 0 | 0 |
| Canteros | 0 | 0 | 0 | 5622 | 73 | 550 | 0 | 0 | 5 | 1 | 0 | 148 | 1285 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 1259 | 427 | 0 | 0 | 163 | 5 | 0 | 1 | 54 | 545 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 38316 | 1772 | 0 | 0 | 0 | 61 | 1 | 0 | 205 | 1753 | 0 | 0 | 0 | 0 | 0 | 12 |
| Mercaderes | 0 | 0 | 0 | 4385 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 197 | 1311 | 8 | 126 | 9 | 9 | 0 | 0 |
| Mesta | 3 | 0 | 0 | 1578 | 1263 | 0 | 0 | 0 | 2 | 0 | 0 | 43 | 1758 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 30664 | 3745 | 0 | 0 | 0 | 55 | 1 | 0 | 196 | 1731 | 0 | 0 | 0 | 0 | 6 | 5 |
| Salineros | 0 | 0 | 0 | 19689 | 0 | 0 | 2027 | 0 | 32 | 0 | 0 | 162 | 1899 | 0 | 0 | 0 | 0 | 0 | 9 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1212 | T100 | arrieros | 99 | 99 | 0,0 % | se separa en T55 |
| 1212 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T55 |
| 1212 | T100 | ferrones | -57 | -57 | 0,0 % | se separa en T55 |
| 1212 | T100 | hortelanos | 452 | 452 | 0,0 % | se separa en T55 |
| 1212 | T100 | mercaderes | 61 | 61 | 0,0 % | se separa en T55 |
| 1212 | T100 | mesta | 42 | 42 | 0,0 % | se separa en T55 |
| 1212 | T100 | monjes | 308 | 308 | 0,0 % | se separa en T55 |
| 1212 | T100 | salineros | 165 | 165 | 0,0 % | se separa en T55 |
| 1212 | T200 | arrieros | 139 | 139 | 0,0 % | se separa en T55 |
| 1212 | T200 | canteros | 381 | 381 | 0,0 % | se separa en T55 |
| 1212 | T200 | ferrones | -67 | -67 | 0,0 % | se separa en T55 |
| 1212 | T200 | hortelanos | 881 | 881 | 0,0 % | se separa en T55 |
| 1212 | T200 | mercaderes | 152 | 152 | 0,0 % | se separa en T55 |
| 1212 | T200 | mesta | 18 | 18 | 0,0 % | se separa en T55 |
| 1212 | T200 | monjes | 659 | 659 | 0,0 % | se separa en T55 |
| 1212 | T200 | salineros | 173 | 199 | 13,0 % | se separa en T55 |
| 1212-2 | T100 | arrieros | 127 | 127 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | canteros | 321 | 321 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | ferrones | -57 | -57 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | hortelanos | 479 | 479 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | mercaderes | 107 | 107 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | mesta | 44 | 44 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | monjes | 252 | 252 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | salineros | 272 | 272 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | arrieros | 353 | 353 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | canteros | 510 | 510 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | ferrones | -67 | -67 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | hortelanos | 776 | 776 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | mercaderes | 147 | 147 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | mesta | 25 | 25 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | monjes | 546 | 546 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | salineros | 375 | 375 | 0,0 % | se separa en T79 |
| 1212-3 | T100 | arrieros | 154 | 154 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | ferrones | 40 | 40 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | hortelanos | 452 | 452 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mercaderes | 83 | 83 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mesta | 42 | 42 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | monjes | 349 | 349 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | salineros | 284 | 284 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | arrieros | 219 | 219 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | canteros | 400 | 400 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | ferrones | 19 | 19 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | hortelanos | 881 | 881 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mercaderes | 124 | 124 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mesta | 28 | 28 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | monjes | 562 | 562 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | salineros | 506 | 506 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 251 | 237 | 5,6 % | mercado 1073, carga 887, ruta 236 |
| Canteros | 428 | 430 | 0,5 % | mercado 799, carga 573, ruta 92 |
| Ferrones | 44 | -38 | 186,4 % | mercado 617, carga 508, ruta 32 |
| Hortelanos | 971 | 846 | 12,9 % | mercado 1394, carga 683, ruta 200 |
| Mercaderes | 156 | 141 | 9,6 % | carga 812, mercado 766, ruta 96 |
| Mesta | 96 | 24 | 75,0 % | mercado 1404, carga 486, ruta 26 |
| Monjes | 723 | 589 | 18,5 % | mercado 1244, carga 656, ruta 180 |
| Salineros | 470 | 351 | 25,3 % | mercado 1345, carga 593, ruta 116 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1212 | Arrieros | **no** | T167 | T167 | 3 |
| 1212 | Canteros | **no** | T109 | T109 | 4 |
| 1212 | Ferrones | **no** | **no** | **no** | 1 |
| 1212 | Hortelanos | T55 | T149 | T149 | 5 |
| 1212 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212 | Mesta | **no** | **no** | **no** | 2 |
| 1212 | Monjes | T54 | T133 | T133 | 5 |
| 1212 | Salineros | T86 | **no** | **no** | 4 |
| 1212-2 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-2 | Canteros | **no** | T69 | T69 | 4 |
| 1212-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1212-2 | Hortelanos | T61 | T107 | T107 | 5 |
| 1212-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-2 | Mesta | **no** | **no** | **no** | 1 |
| 1212-2 | Monjes | T54 | T133 | T133 | 5 |
| 1212-2 | Salineros | T64 | **no** | **no** | 4 |
| 1212-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-3 | Canteros | **no** | T106 | T106 | 4 |
| 1212-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1212-3 | Hortelanos | T53 | T134 | T134 | 6 |
| 1212-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-3 | Mesta | **no** | **no** | **no** | 2 |
| 1212-3 | Monjes | T43 | **no** | **no** | 4 |
| 1212-3 | Salineros | T64 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1212 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1027 | 1141 |
| 1212 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1214 |
| 1212 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 382 |
| 1212 | Hortelanos | 0 | 0 | 0 | 0 | 93 | 499 | 761 |
| 1212 | Mercaderes | 26 | 166 | 1227 | 709 | 0 | 0 | 1182 |
| 1212 | Mesta | 0 | 0 | 0 | 0 | 0 | 860 | 829 |
| 1212 | Monjes | 0 | 0 | 0 | 0 | 101 | 540 | 738 |
| 1212 | Salineros | 0 | 0 | 0 | 0 | 37 | 662 | 1108 |
| 1212-2 | Arrieros | 60 | 269 | 3134 | 2291 | 0 | 661 | 1064 |
| 1212-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 110 | 1052 |
| 1212-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 382 |
| 1212-2 | Hortelanos | 0 | 0 | 0 | 0 | 75 | 571 | 793 |
| 1212-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1145 |
| 1212-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 860 | 976 |
| 1212-2 | Monjes | 0 | 0 | 0 | 0 | 86 | 558 | 781 |
| 1212-2 | Salineros | 0 | 0 | 0 | 0 | 47 | 864 | 879 |
| 1212-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 394 | 1247 |
| 1212-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 136 | 1193 |
| 1212-3 | Ferrones | 0 | 0 | 0 | 0 | 40 | 34 | 594 |
| 1212-3 | Hortelanos | 0 | 0 | 0 | 0 | 65 | 615 | 782 |
| 1212-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1245 |
| 1212-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 948 | 789 |
| 1212-3 | Monjes | 0 | 0 | 0 | 0 | 76 | 722 | 620 |
| 1212-3 | Salineros | 0 | 0 | 0 | 0 | 32 | 703 | 1037 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 956 | 974 | 969 | 0 | 164 |
| Canteros | 633 | 651 | 650 | 0 | 82 |
| Ferrones | 490 | 505 | 505 | 0 | 33 |
| Hortelanos | 1087 | 1105 | 1093 | 6 | 228 |
| Mercaderes | 710 | 728 | 726 | 0 | 65 |
| Mesta | 790 | 807 | 807 | 0 | 20 |
| Monjes | 968 | 986 | 981 | 4 | 201 |
| Salineros | 970 | 988 | 974 | 5 | 150 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 42
- incorporar: comarca-con-duenyo: 5

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 67 | 93 | 111 | 125 | 138 | 149 | 162 | 170 | 240 | 251 |
| Canteros | 68 | 84 | 100 | 186 | 194 | 350 | 366 | 374 | 399 | 428 |
| Ferrones | 23 | 8 | 1 | -3 | 2 | 19 | 27 | 29 | 36 | 44 |
| Hortelanos | 174 | 239 | 339 | 400 | 455 | 574 | 666 | 779 | 832 | 971 |
| Mercaderes | 55 | 73 | 92 | 110 | 119 | 126 | 134 | 140 | 148 | 156 |
| Mesta | 34 | 42 | 53 | 65 | 68 | 82 | 89 | 86 | 95 | 96 |
| Monjes | 77 | 126 | 279 | 346 | 386 | 443 | 627 | 654 | 684 | 723 |
| Salineros | 88 | 115 | 160 | 252 | 303 | 348 | 384 | 428 | 451 | 470 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1212`: `d0a403a789cb8f362e0ce687489eb88066712414c3d8270702913d2da4728d87`
- semilla `1212-2`: `25bc3257648ca21c48ad908245e7442ca82ecce7b097ed354008a10ef2f9a28e`
- semilla `1212-3`: `48397ade1d3ba7b05c0494cf90344ff197693576f46811fcd6ccb3cecbb3a021`
