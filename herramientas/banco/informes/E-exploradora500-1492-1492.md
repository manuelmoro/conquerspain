# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 778 de prestigio (245,4 % de la mediana) y **Ferrones** cierra la clasificación con 135 (42,6 % de la mediana). La mediana de prestigio es 317. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `9f67437+ensayo` |
| Etiqueta del informe | E-exploradora500-1492-1492 |
| Cambios experimentales | movimiento.bastimentoExploradoraMil=500 (ensayo T-059) |
| Versiones | banco 0.1.0 · métricas 5 · robots 10 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `af0dddb076525134606001e88613544f6c883c7d1db8e456ffe8808d921a6e8f` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 38 filas sin cerrar de 157.

119 cumplen, 38 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 68,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 174 sobre una mediana exacta de 253,5 |
| prestigio | casa y partida | 1492 | canteros | — | 169,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 430 sobre una mediana exacta de 253,5 |
| prestigio | casa y partida | 1492 | ferrones | — | 51,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 130 sobre una mediana exacta de 253,5 |
| prestigio | casa y partida | 1492 | hortelanos | — | 237,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 602 sobre una mediana exacta de 253,5 |
| prestigio | casa y partida | 1492 | mercaderes | — | 76,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 195 sobre una mediana exacta de 253,5 |
| prestigio | casa y partida | 1492 | mesta | — | 123,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 312 sobre una mediana exacta de 253,5 |
| prestigio | casa y partida | 1492 | monjes | — | 308,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 781 sobre una mediana exacta de 253,5 |
| prestigio | casa y partida | 1492 | salineros | — | -6,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -16 sobre una mediana exacta de 253,5 |
| actividad | casa y partida | 1492 | arrieros | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | ferrones | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mesta | — | 6,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 13 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | salineros | — | 95 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 190 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492 | arrieros | — | 9 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 18 de 200 turnos |
| escasez | casa y partida | 1492 | canteros | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 6 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 12 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 8 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 16 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 35 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 70 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 45,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 94 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 153 · a mano 153 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 248 · a mano 248 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 17 · a mano 17 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 12 · a mano 12 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 821 · a mano 821 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 110 · a mano 110 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 142 · a mano 142 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 148 · a mano 148 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 236 · a mano 236 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 338 · a mano 338 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 666 · a mano 666 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 4 · a mano 4 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 3 · a mano 3 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 110 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T110 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 54,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 181 sobre una mediana exacta de 333,5 |
| prestigio | casa y partida | 1492-2 | canteros | — | 128,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 427 sobre una mediana exacta de 333,5 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 39,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 133 sobre una mediana exacta de 333,5 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 209,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 700 sobre una mediana exacta de 333,5 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 51,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 171 sobre una mediana exacta de 333,5 |
| prestigio | casa y partida | 1492-2 | mesta | — | 134,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 448 sobre una mediana exacta de 333,5 |
| prestigio | casa y partida | 1492-2 | monjes | — | 219,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 731 sobre una mediana exacta de 333,5 |
| prestigio | casa y partida | 1492-2 | salineros | — | 72,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 240 sobre una mediana exacta de 333,5 |
| actividad | casa y partida | 1492-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mesta | — | 7,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 15 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-2 | arrieros | — | 8 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 16 de 200 turnos |
| escasez | casa y partida | 1492-2 | canteros | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1492-2 | ferrones | — | 4,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 9 de 200 turnos |
| escasez | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mercaderes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1492-2 | mesta | — | 9,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 19 de 200 turnos |
| escasez | casa y partida | 1492-2 | monjes | — | 6 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 12 de 200 turnos |
| escasez | casa y partida | 1492-2 | salineros | — | 10,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 21 de 200 turnos |
| precios | partida | 1492-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-2 | — | — | 38,0 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 79 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 152 · a mano 152 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 184 · a mano 184 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 349 · a mano 349 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 39 · a mano 39 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 19 · a mano 19 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 432 · a mano 432 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 716 · a mano 716 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 77 · a mano 77 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 134 · a mano 134 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 152 · a mano 152 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 301 · a mano 301 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 371 · a mano 371 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 586 · a mano 586 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 99 · a mano 99 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 251 · a mano 251 · el dominio coincide turno a turno |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 110 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T110 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 45,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 186 sobre una mediana exacta de 413,5 |
| prestigio | casa y partida | 1492-3 | canteros | — | 90,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 374 sobre una mediana exacta de 413,5 |
| prestigio | casa y partida | 1492-3 | ferrones | — | 34,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 142 sobre una mediana exacta de 413,5 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 180,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 746 sobre una mediana exacta de 413,5 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 47,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 195 sobre una mediana exacta de 413,5 |
| prestigio | casa y partida | 1492-3 | mesta | — | 111,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 462 sobre una mediana exacta de 413,5 |
| prestigio | casa y partida | 1492-3 | monjes | — | 198,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 821 sobre una mediana exacta de 413,5 |
| prestigio | casa y partida | 1492-3 | salineros | — | 109,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 453 sobre una mediana exacta de 413,5 |
| actividad | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | mesta | — | 7,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 15 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | salineros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-3 | arrieros | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1492-3 | canteros | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1492-3 | ferrones | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mesta | — | 7,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 15 de 200 turnos |
| escasez | casa y partida | 1492-3 | monjes | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1492-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492-3 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-cameros, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1492-3 | — | — | 41,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 87 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 128 · a mano 128 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 193 · a mano 193 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 348 · a mano 348 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 50 · a mano 50 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 27 · a mano 27 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 334 · a mano 334 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 576 · a mano 576 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 115 · a mano 115 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 137 · a mano 137 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 165 · a mano 165 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 386 · a mano 386 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 651 · a mano 651 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 115 · a mano 115 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 139 · a mano 139 · el dominio coincide turno a turno |
| dominio | partida | 1492-3 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492-3 | — | — | 110 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T110 |
| ganadores | campaña | 1492 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan monjes, monjes, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 56,8 %
  - Canteros: 129,3 %
  - Ferrones: 42,6 %
  - Hortelanos: 215,5 %
  - Mercaderes: 59,0 %
  - Mesta: 128,4 %
  - Monjes: 245,4 %
  - Salineros: 71,3 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 33,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Salineros (semilla 1492): 35,0 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 249 de 403 comarcas
  - región 01-iberico-alto-duero: 6
  - región 02-meseta-norte: 31
  - región 03-cantabrico: 23
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 36
  - región 06-meseta-sur: 11
  - región 07-ebro-pirineo: 13
  - región 09-andalucia: 46
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 778 | 245,4 % | 1 | 2 | 1192 | 13 | 1330 | 4,5 % | 2,0 % |
| Hortelanos | 683 | 215,5 % | 2 | 2 | 884 | 12 | 1372 | 0,0 % | 2,5 % |
| Canteros | 410 | 129,3 % | 4 | 1 | 137 | 2 | 542 | 2,0 % | 1,0 % |
| Mesta | 407 | 128,4 % | 3 | 1 | 230 | 4 | 5400 | 8,5 % | 7,0 % |
| Salineros | 226 | 71,3 % | 6 | 0 | 498 | 6 | 2620 | 15,0 % | 33,5 % |
| Mercaderes | 187 | 59,0 % | 6 | 0 | 91 | 1 | 104 | 1,5 % | 0,0 % |
| Arrieros | 180 | 56,8 % | 6 | 0 | 129 | 2 | 305 | 6,0 % | 2,0 % |
| Ferrones | 135 | 42,6 % | 8 | 0 | 60 | 1 | 241 | 5,0 % | 3,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 25 | 16 | 0 | 0 | 0 | 123 | 0 | 0 | 48 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 133 | 0 | 0 | 118 |
| Ferrones | 12 | 8 | 0 | 0 | 0 | 75 | 0 | 25 | 25 |
| Hortelanos | 176 | 93 | 40 | 0 | 0 | 168 | 0 | 0 | 205 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 139 | 0 | 0 | 25 |
| Mesta | 46 | 35 | 0 | 0 | 0 | 72 | 157 | 0 | 155 |
| Monjes | 238 | 104 | 80 | 0 | 0 | 163 | 0 | 0 | 202 |
| Salineros | 99 | 51 | 0 | 0 | 0 | 88 | 0 | 0 | 58 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 123 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 122 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 54 turnos) |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 199 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos) |
| Arrieros | 1492-2 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-2 | termina obras mayores | sí |  |
| Ferrones | 1492-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 123 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 49 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 40 turnos) |
| Mesta | 1492-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492-2 | funda pueblas | sí |  |
| Salineros | 1492-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 145 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 64 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 38 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5845 | 240 | 0 | 0 | 0 | 8 | 0 | 0 | 514 | 1570 | 92 | 268 | 22 | 22 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 5485 | 6 | 511 | 0 | 0 | 4 | 1 | 0 | 147 | 1390 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 2826 | 1015 | 0 | 0 | 478 | 4 | 0 | 4 | 141 | 812 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 27519 | 501 | 0 | 0 | 0 | 40 | 0 | 0 | 210 | 1863 | 0 | 0 | 0 | 0 | 0 | 11 |
| Mercaderes | 0 | 0 | 0 | 4290 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 134 | 1236 | 5 | 9 | 1 | 1 | 0 | 0 |
| Mesta | 279 | 12 | 0 | 3647 | 855 | 0 | 0 | 0 | 17 | 0 | 0 | 148 | 1383 | 0 | 0 | 0 | 0 | 0 | 5 |
| Monjes | 0 | 0 | 0 | 33426 | 3825 | 0 | 0 | 0 | 60 | 1 | 0 | 181 | 1729 | 0 | 0 | 0 | 0 | 6 | 6 |
| Salineros | 0 | 0 | 0 | 11754 | 0 | 0 | 1731 | 0 | 22 | 0 | 0 | 117 | 1273 | 0 | 0 | 0 | 0 | 0 | 7 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 153 | 153 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | 17 | 17 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 451 | 451 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 110 | 110 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 148 | 148 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 338 | 338 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | 4 | 4 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 248 | 248 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 375 | 375 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | 12 | 12 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 821 | 821 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 142 | 142 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 236 | 236 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 666 | 666 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | 3 | 3 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 152 | 152 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | ferrones | 39 | 39 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | hortelanos | 432 | 432 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mercaderes | 77 | 77 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mesta | 152 | 152 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | monjes | 371 | 371 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | salineros | 99 | 99 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | arrieros | 184 | 184 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | canteros | 349 | 349 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | ferrones | 19 | 19 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | hortelanos | 716 | 716 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mercaderes | 134 | 134 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mesta | 301 | 301 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | monjes | 586 | 586 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | salineros | 251 | 251 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | arrieros | 128 | 128 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | ferrones | 50 | 50 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | hortelanos | 334 | 334 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mercaderes | 115 | 115 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mesta | 165 | 165 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | monjes | 386 | 386 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | salineros | 115 | 115 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | arrieros | 193 | 193 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | canteros | 348 | 348 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | ferrones | 27 | 27 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | hortelanos | 576 | 576 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mercaderes | 137 | 137 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mesta | 321 | 321 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | monjes | 651 | 651 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | salineros | 139 | 139 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 180 | 208 | 13,5 % | carga 910, mercado 747, ruta 229 |
| Canteros | 410 | 357 | 12,9 % | mercado 859, carga 582, ruta 90 |
| Ferrones | 135 | 19 | 85,9 % | mercado 738, carga 523, ruta 52 |
| Hortelanos | 683 | 704 | 3,0 % | mercado 1123, carga 683, ruta 206 |
| Mercaderes | 187 | 138 | 26,2 % | carga 817, mercado 789, ruta 96 |
| Mesta | 407 | 286 | 29,7 % | mercado 1325, carga 495, ruta 176 |
| Monjes | 778 | 634 | 18,5 % | mercado 1230, carga 659, ruta 179 |
| Salineros | 226 | 131 | 42,0 % | mercado 919, carga 392, ruta 74 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | T110 | **no** | **no** | 4 |
| 1492 | Canteros | **no** | T110 | T110 | 4 |
| 1492 | Ferrones | **no** | **no** | **no** | 2 |
| 1492 | Hortelanos | T68 | **no** | **no** | 4 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | T142 | **no** | **no** | 5 |
| 1492 | Monjes | T48 | T175 | T175 | 5 |
| 1492 | Salineros | **no** | **no** | **no** | 2 |
| 1492-2 | Arrieros | **no** | **no** | **no** | 3 |
| 1492-2 | Canteros | **no** | T110 | T110 | 4 |
| 1492-2 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-2 | Hortelanos | T58 | **no** | **no** | 4 |
| 1492-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-2 | Mesta | T114 | **no** | **no** | 5 |
| 1492-2 | Monjes | T43 | **no** | **no** | 4 |
| 1492-2 | Salineros | T73 | **no** | **no** | 4 |
| 1492-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1492-3 | Canteros | **no** | T110 | T110 | 4 |
| 1492-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-3 | Hortelanos | T62 | T110 | T110 | 5 |
| 1492-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-3 | Mesta | T95 | **no** | **no** | 5 |
| 1492-3 | Monjes | T48 | T200 | T200 | 5 |
| 1492-3 | Salineros | T74 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 2 | 15 | 73 | 37 | 0 | 5 | 802 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 1258 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 1 | 13 | 518 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 130 | 361 | 762 |
| 1492 | Mercaderes | 2 | 14 | 78 | 30 | 0 | 0 | 1179 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 719 | 640 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 86 | 551 | 788 |
| 1492-2 | Arrieros | 34 | 168 | 2147 | 1454 | 0 | 613 | 1383 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1239 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 48 | 55 | 602 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 132 | 418 | 692 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1273 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 801 | 595 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 92 | 510 | 732 |
| 1492-2 | Salineros | 0 | 0 | 0 | 0 | 41 | 697 | 1105 |
| 1492-3 | Arrieros | 30 | 262 | 2442 | 1522 | 0 | 5 | 994 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1262 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 61 | 33 | 560 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 22 | 894 | 798 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1210 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 788 | 603 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 100 | 542 | 727 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 52 | 807 | 945 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 834 | 852 | 849 | 1 | 147 |
| Canteros | 656 | 674 | 673 | 0 | 82 |
| Ferrones | 563 | 581 | 579 | 0 | 48 |
| Hortelanos | 939 | 957 | 943 | 4 | 217 |
| Mercaderes | 726 | 744 | 741 | 0 | 84 |
| Mesta | 882 | 899 | 893 | 3 | 67 |
| Monjes | 978 | 996 | 990 | 2 | 206 |
| Salineros | 654 | 670 | 663 | 4 | 106 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 33
- construir: comarca-ajena: 7
- incorporar: comarca-con-duenyo: 2

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 63 | 82 | 104 | 138 | 147 | 184 | 159 | 160 | 170 | 180 |
| Canteros | 68 | 84 | 100 | 116 | 124 | 333 | 349 | 357 | 371 | 410 |
| Ferrones | 47 | 48 | 62 | 90 | 103 | 111 | 119 | 127 | 130 | 135 |
| Hortelanos | 184 | 202 | 280 | 374 | 403 | 511 | 546 | 603 | 643 | 683 |
| Mercaderes | 60 | 78 | 102 | 118 | 134 | 144 | 160 | 166 | 179 | 187 |
| Mesta | 46 | 55 | 68 | 82 | 185 | 214 | 274 | 332 | 398 | 407 |
| Monjes | 73 | 127 | 310 | 395 | 448 | 520 | 589 | 618 | 693 | 778 |
| Salineros | 58 | 65 | 86 | 143 | 159 | 203 | 165 | 173 | 214 | 226 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `38594f152453fb5c46bf568564778ae20327ff03d3c3dbf53717bd9389484370`
- semilla `1492-2`: `041a8defb5d4329b521b1406ffd4190e66828ad518449e4aabe8d06085aa75d6`
- semilla `1492-3`: `38124df928deb39f37e7e25ddff010d0e7a1412900b4eb186d9db8d0812a6248`
