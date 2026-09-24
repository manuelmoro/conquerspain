# Banco de pruebas · semilla 1212

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Hortelanos** va en cabeza con 954 de prestigio (287,3 % de la mediana) y **Ferrones** cierra la clasificación con 30 (9,0 % de la mediana). La mediana de prestigio es 332. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `bfcf751b6b84f17bb104ff27b853a18f2f561707` |
| Etiqueta del informe | E-recargo150-1212 |
| Cambios experimentales | mercado.recargoPorJornadaMil=150 (ensayo, revertido) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1212, 1212-2, 1212-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `ab8c3cc711a45268bab8d87df3fe39d2df23f7e722abf25849c0141ce57f6a57` |
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
| prestigio | casa y partida | 1212 | ferrones | — | -10,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -31 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | hortelanos | — | 371,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 1107 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | mercaderes | — | 54,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 162 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | mesta | — | 19,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 58 sobre una mediana exacta de 298 |
| prestigio | casa y partida | 1212 | monjes | — | 246,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 733 sobre una mediana exacta de 298 |
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
| escasez | casa y partida | 1212 | ferrones | — | 37,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 75 de 200 turnos |
| escasez | casa y partida | 1212 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | mercaderes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1212 | mesta | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1212 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | salineros | — | 10 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 20 de 200 turnos |
| precios | partida | 1212 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212 | — | — | 59,0 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 147 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 99 · a mano 99 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 139 · a mano 139 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 381 · a mano 381 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -57 · a mano -57 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -77 · a mano -77 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 430 · a mano 430 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 968 · a mano 968 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 62 · a mano 62 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 154 · a mano 154 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 18 · a mano 18 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 308 · a mano 308 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 664 · a mano 664 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 165 · a mano 165 · el dominio se separa en T55 |
| ausencia | casa y partida | 1212 | salineros | T200 | 13 | % de diferencia de prestigio con el mismo plan | < 5 % | 🔴 incumple | por bloques 173 · a mano 199 · el dominio se separa en T55 |
| dominio | partida | 1212 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 4 de 8 casas lo alcanzan; la primera en T109 |
| prestigio | casa y partida | 1212-2 | arrieros | — | 65,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 207 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | canteros | — | 134,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 421 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | ferrones | — | -8,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -25 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | hortelanos | — | 269,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 847 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | mercaderes | — | 54,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 171 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | mesta | — | 57,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 179 sobre una mediana exacta de 314 |
| prestigio | casa y partida | 1212-2 | monjes | — | 207,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 650 sobre una mediana exacta de 314 |
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
| escasez | casa y partida | 1212-2 | ferrones | — | 38,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 77 de 200 turnos |
| escasez | casa y partida | 1212-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mesta | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1212-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1212-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-2 | — | — | 62,7 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 156 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 127 · a mano 127 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 353 · a mano 353 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 510 · a mano 510 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -57 · a mano -57 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -77 · a mano -77 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 483 · a mano 483 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 803 · a mano 803 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 107 · a mano 107 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 147 · a mano 147 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 44 · a mano 44 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 25 · a mano 25 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 252 · a mano 252 · el dominio se separa en T79 |
| ausencia | casa y partida | 1212-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 534 · a mano 534 · el dominio se separa en T79 |
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
| prestigio | casa y partida | 1212-3 | monjes | — | 234,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 735 sobre una mediana exacta de 313 |
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
| escasez | casa y partida | 1212-3 | monjes | — | 6 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 12 de 200 turnos |
| escasez | casa y partida | 1212-3 | salineros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| precios | partida | 1212-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-3 | — | — | 46,6 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 116 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 154 · a mano 154 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 219 · a mano 219 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 400 · a mano 400 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 40 · a mano 40 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 19 · a mano 19 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 430 · a mano 430 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 949 · a mano 949 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 83 · a mano 83 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 124 · a mano 124 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 28 · a mano 28 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 363 · a mano 363 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 564 · a mano 564 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 284 · a mano 284 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 506 · a mano 506 · el dominio coincide turno a turno |
| dominio | partida | 1212-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1212-3 | — | — | 93 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T93 |
| ganadores | campaña | 1212 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan hortelanos, hortelanos, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 75,6 %
  - Canteros: 124,1 %
  - Ferrones: 9,0 %
  - Hortelanos: 287,3 %
  - Mercaderes: 49,4 %
  - Mesta: 28,9 %
  - Monjes: 212,7 %
  - Salineros: 141,6 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1212): 37,5 % de los turnos
  - Ferrones (semilla 1212-2): 38,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 186 de 403 comarcas
  - región 01-iberico-alto-duero: 3
  - región 02-meseta-norte: 6
  - región 03-cantabrico: 17
  - región 04-galicia-minho: 28
  - región 05-central-extremadura: 22
  - región 06-meseta-sur: 10
  - región 07-ebro-pirineo: 29
  - región 08-levante: 16
  - región 09-andalucia: 47
  - región 10-portugal-sur: 8

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Hortelanos | 954 | 287,3 % | 1 | 3 | 1029 | 11 | 3109 | 0,0 % | 1,5 % |
| Monjes | 706 | 212,7 % | 2 | 1 | 1070 | 11 | 976 | 2,0 % | 2,0 % |
| Salineros | 470 | 141,6 % | 4 | 0 | 790 | 10 | 3973 | 4,0 % | 3,0 % |
| Canteros | 412 | 124,1 % | 4 | 1 | 137 | 2 | 511 | 1,5 % | 2,5 % |
| Arrieros | 251 | 75,6 % | 5 | 0 | 79 | 1 | 186 | 0,0 % | 1,5 % |
| Mercaderes | 164 | 49,4 % | 6 | 0 | 90 | 1 | 98 | 2,0 % | 0,0 % |
| Mesta | 96 | 28,9 % | 7 | 0 | 36 | 1 | 109 | 8,5 % | 4,0 % |
| Ferrones | 30 | 9,0 % | 8 | 0 | 27 | 1 | 126 | 26,0 % | 3,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 15 | 8 | 40 | 0 | 0 | 149 | 0 | 0 | 38 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 133 | 0 | 0 | 118 |
| Ferrones | 5 | 8 | 0 | 0 | 0 | 45 | 0 | 8 | 15 |
| Hortelanos | 206 | 91 | 160 | 0 | 0 | 216 | 0 | 0 | 282 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 117 | 0 | 0 | 25 |
| Mesta | 7 | 8 | 0 | 0 | 0 | 37 | 40 | 0 | 20 |
| Monjes | 214 | 88 | 80 | 0 | 0 | 160 | 0 | 0 | 168 |
| Salineros | 158 | 80 | 0 | 0 | 0 | 149 | 0 | 0 | 92 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1212 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 189 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 63 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 31 turnos) |
| Canteros | 1212 | termina obras mayores | sí |  |
| Ferrones | 1212 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1212 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 135 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 97 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 51 turnos) |
| Mesta | 1212 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 195 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 186 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 14 turnos) |
| Monjes | 1212 | funda pueblas | sí |  |
| Salineros | 1212 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 130 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 63 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 43 turnos) |
| Canteros | 1212-2 | termina obras mayores | sí |  |
| Ferrones | 1212-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1212-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 136 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 54 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 47 turnos) |
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
| Arrieros | 0 | 0 | 0 | 4532 | 777 | 0 | 0 | 0 | 8 | 0 | 0 | 371 | 1800 | 0 | 0 | 0 | 0 | 0 | 0 |
| Canteros | 0 | 0 | 0 | 5622 | 73 | 550 | 0 | 0 | 5 | 1 | 0 | 148 | 1285 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 1355 | 480 | 0 | 0 | 180 | 5 | 0 | 2 | 45 | 529 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 34404 | 1638 | 0 | 0 | 0 | 52 | 1 | 0 | 211 | 1876 | 0 | 0 | 0 | 0 | 0 | 10 |
| Mercaderes | 0 | 0 | 0 | 4385 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 139 | 1168 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 3 | 0 | 0 | 1578 | 1263 | 0 | 0 | 0 | 2 | 0 | 0 | 43 | 1758 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 29925 | 3710 | 0 | 0 | 0 | 54 | 1 | 0 | 197 | 1801 | 0 | 0 | 0 | 0 | 5 | 5 |
| Salineros | 0 | 0 | 0 | 19689 | 0 | 0 | 2027 | 0 | 32 | 0 | 0 | 162 | 1899 | 0 | 0 | 0 | 0 | 0 | 9 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1212 | T100 | arrieros | 99 | 99 | 0,0 % | se separa en T55 |
| 1212 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T55 |
| 1212 | T100 | ferrones | -57 | -57 | 0,0 % | se separa en T55 |
| 1212 | T100 | hortelanos | 430 | 430 | 0,0 % | se separa en T55 |
| 1212 | T100 | mercaderes | 62 | 62 | 0,0 % | se separa en T55 |
| 1212 | T100 | mesta | 42 | 42 | 0,0 % | se separa en T55 |
| 1212 | T100 | monjes | 308 | 308 | 0,0 % | se separa en T55 |
| 1212 | T100 | salineros | 165 | 165 | 0,0 % | se separa en T55 |
| 1212 | T200 | arrieros | 139 | 139 | 0,0 % | se separa en T55 |
| 1212 | T200 | canteros | 381 | 381 | 0,0 % | se separa en T55 |
| 1212 | T200 | ferrones | -77 | -77 | 0,0 % | se separa en T55 |
| 1212 | T200 | hortelanos | 968 | 968 | 0,0 % | se separa en T55 |
| 1212 | T200 | mercaderes | 154 | 154 | 0,0 % | se separa en T55 |
| 1212 | T200 | mesta | 18 | 18 | 0,0 % | se separa en T55 |
| 1212 | T200 | monjes | 664 | 664 | 0,0 % | se separa en T55 |
| 1212 | T200 | salineros | 173 | 199 | 13,0 % | se separa en T55 |
| 1212-2 | T100 | arrieros | 127 | 127 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | canteros | 321 | 321 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | ferrones | -57 | -57 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | hortelanos | 483 | 483 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | mercaderes | 107 | 107 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | mesta | 44 | 44 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | monjes | 252 | 252 | 0,0 % | se separa en T79 |
| 1212-2 | T100 | salineros | 272 | 272 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | arrieros | 353 | 353 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | canteros | 510 | 510 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | ferrones | -77 | -77 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | hortelanos | 803 | 803 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | mercaderes | 147 | 147 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | mesta | 25 | 25 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | monjes | 534 | 534 | 0,0 % | se separa en T79 |
| 1212-2 | T200 | salineros | 375 | 375 | 0,0 % | se separa en T79 |
| 1212-3 | T100 | arrieros | 154 | 154 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | ferrones | 40 | 40 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | hortelanos | 430 | 430 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mercaderes | 83 | 83 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mesta | 42 | 42 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | monjes | 363 | 363 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | salineros | 284 | 284 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | arrieros | 219 | 219 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | canteros | 400 | 400 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | ferrones | 19 | 19 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | hortelanos | 949 | 949 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mercaderes | 124 | 124 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mesta | 28 | 28 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | monjes | 564 | 564 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | salineros | 506 | 506 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 251 | 237 | 5,6 % | mercado 1027, carga 911, ruta 178 |
| Canteros | 412 | 430 | 4,2 % | mercado 799, carga 573, ruta 92 |
| Ferrones | 30 | -45 | 166,7 % | mercado 600, carga 500, ruta 24 |
| Hortelanos | 954 | 907 | 4,9 % | mercado 1266, carga 671, ruta 188 |
| Mercaderes | 164 | 142 | 13,4 % | carga 801, mercado 768, ruta 76 |
| Mesta | 96 | 24 | 75,0 % | mercado 1404, carga 486, ruta 26 |
| Monjes | 706 | 587 | 16,9 % | mercado 1157, carga 644, ruta 168 |
| Salineros | 470 | 351 | 25,3 % | mercado 1345, carga 593, ruta 116 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1212 | Arrieros | **no** | T167 | T167 | 3 |
| 1212 | Canteros | **no** | T109 | T109 | 4 |
| 1212 | Ferrones | **no** | **no** | **no** | 1 |
| 1212 | Hortelanos | T55 | T136 | T136 | 6 |
| 1212 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212 | Mesta | **no** | **no** | **no** | 2 |
| 1212 | Monjes | T54 | T140 | T140 | 5 |
| 1212 | Salineros | T86 | **no** | **no** | 4 |
| 1212-2 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-2 | Canteros | **no** | T69 | T69 | 4 |
| 1212-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1212-2 | Hortelanos | T67 | T111 | T111 | 5 |
| 1212-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-2 | Mesta | **no** | **no** | **no** | 1 |
| 1212-2 | Monjes | T54 | T136 | T136 | 5 |
| 1212-2 | Salineros | T64 | **no** | **no** | 4 |
| 1212-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-3 | Canteros | **no** | T106 | T106 | 4 |
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
| 1212 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1027 | 1141 |
| 1212 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1214 |
| 1212 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 357 |
| 1212 | Hortelanos | 0 | 0 | 0 | 0 | 82 | 471 | 957 |
| 1212 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1088 |
| 1212 | Mesta | 0 | 0 | 0 | 0 | 0 | 860 | 829 |
| 1212 | Monjes | 0 | 0 | 0 | 0 | 93 | 484 | 784 |
| 1212 | Salineros | 0 | 0 | 0 | 0 | 37 | 662 | 1108 |
| 1212-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 661 | 907 |
| 1212-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 110 | 1052 |
| 1212-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 357 |
| 1212-2 | Hortelanos | 0 | 0 | 0 | 0 | 51 | 537 | 995 |
| 1212-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1154 |
| 1212-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 860 | 976 |
| 1212-2 | Monjes | 0 | 0 | 0 | 0 | 93 | 567 | 791 |
| 1212-2 | Salineros | 0 | 0 | 0 | 0 | 47 | 864 | 879 |
| 1212-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 394 | 1247 |
| 1212-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 136 | 1193 |
| 1212-3 | Ferrones | 0 | 0 | 0 | 0 | 40 | 34 | 594 |
| 1212-3 | Hortelanos | 0 | 0 | 0 | 0 | 73 | 529 | 956 |
| 1212-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1245 |
| 1212-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 948 | 789 |
| 1212-3 | Monjes | 0 | 0 | 0 | 0 | 66 | 648 | 740 |
| 1212-3 | Salineros | 0 | 0 | 0 | 0 | 32 | 703 | 1037 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 925 | 943 | 938 | 0 | 164 |
| Canteros | 633 | 651 | 650 | 0 | 82 |
| Ferrones | 477 | 492 | 492 | 0 | 27 |
| Hortelanos | 1004 | 1022 | 1013 | 5 | 216 |
| Mercaderes | 701 | 719 | 716 | 0 | 71 |
| Mesta | 790 | 807 | 807 | 0 | 20 |
| Monjes | 926 | 944 | 941 | 2 | 190 |
| Salineros | 970 | 988 | 974 | 5 | 150 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 35
- incorporar: comarca-con-duenyo: 4

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 67 | 93 | 111 | 125 | 138 | 149 | 162 | 170 | 240 | 251 |
| Canteros | 68 | 84 | 100 | 186 | 194 | 333 | 349 | 357 | 382 | 412 |
| Ferrones | 23 | 8 | 1 | 2 | 7 | 12 | 8 | 6 | 21 | 30 |
| Hortelanos | 174 | 246 | 320 | 412 | 516 | 624 | 715 | 790 | 840 | 954 |
| Mercaderes | 55 | 73 | 92 | 110 | 119 | 129 | 137 | 145 | 156 | 164 |
| Mesta | 34 | 42 | 53 | 65 | 68 | 82 | 89 | 86 | 95 | 96 |
| Monjes | 77 | 126 | 279 | 346 | 386 | 447 | 619 | 650 | 668 | 706 |
| Salineros | 88 | 115 | 160 | 252 | 303 | 348 | 384 | 428 | 451 | 470 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1212`: `e63e082b7f7927f4994e95e8236eb6cce8ac277ca1d87ceb53d0a4f260713836`
- semilla `1212-2`: `90a550183b83ffd9f0257add0f97422805d9884d0086a67cf679035caac51609`
- semilla `1212-3`: `561f261dc360faee143d0cd8d264adc0522dcaa1444949c839aa6b6dfd81ab08`
