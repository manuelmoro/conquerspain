# Banco de pruebas · semilla 1085

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 849 de prestigio (288,8 % de la mediana) y **Ferrones** cierra la clasificación con 73 (24,8 % de la mediana). La mediana de prestigio es 294. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `36514d5d236b3c95c87e32b8b89b1cf4cd4645d6` |
| Etiqueta del informe | E-exploraConBolsa-1085 |
| Cambios experimentales | robots 10: la exploradora lleva bolsa para las ventas |
| Versiones | banco 0.1.0 · métricas 5 · robots 10 · reglas 1 |
| Semillas | 1085, 1085-2, 1085-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `fea056aae1d16f6f1465a0628f25e179c432f8e84c7d4cf2ea9f43116ddcf113` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 40 filas sin cerrar de 157.

117 cumplen, 40 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1085 | arrieros | — | 54,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 164 sobre una mediana exacta de 303,5 |
| prestigio | casa y partida | 1085 | canteros | — | 126,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 385 sobre una mediana exacta de 303,5 |
| prestigio | casa y partida | 1085 | ferrones | — | 38,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 118 sobre una mediana exacta de 303,5 |
| prestigio | casa y partida | 1085 | hortelanos | — | 198,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 602 sobre una mediana exacta de 303,5 |
| prestigio | casa y partida | 1085 | mercaderes | — | 64,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 195 sobre una mediana exacta de 303,5 |
| prestigio | casa y partida | 1085 | mesta | — | 130,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 397 sobre una mediana exacta de 303,5 |
| prestigio | casa y partida | 1085 | monjes | — | 295,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 896 sobre una mediana exacta de 303,5 |
| prestigio | casa y partida | 1085 | salineros | — | 73,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 222 sobre una mediana exacta de 303,5 |
| actividad | casa y partida | 1085 | arrieros | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | canteros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085 | arrieros | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1085 | canteros | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1085 | ferrones | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mesta | — | 12 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 24 de 200 turnos |
| escasez | casa y partida | 1085 | monjes | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1085 | salineros | — | 10,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 21 de 200 turnos |
| precios | partida | 1085 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-bajo-aragon, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085 | — | — | 43,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 91 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 157 · a mano 157 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 253 · a mano 253 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 323 · a mano 323 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 510 · a mano 510 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 73 · a mano 73 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 89 · a mano 89 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 267 · a mano 267 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 617 · a mano 617 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 122 · a mano 122 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 162 · a mano 162 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 203 · a mano 203 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 288 · a mano 288 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 532 · a mano 532 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 754 · a mano 754 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 222 · a mano 222 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 280 · a mano 280 · el dominio coincide turno a turno |
| dominio | partida | 1085 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085 | — | — | 129 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T129 |
| prestigio | casa y partida | 1085-2 | arrieros | — | 70,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 241 sobre una mediana exacta de 342 |
| prestigio | casa y partida | 1085-2 | canteros | — | 118,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 405 sobre una mediana exacta de 342 |
| prestigio | casa y partida | 1085-2 | ferrones | — | -2,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -9 sobre una mediana exacta de 342 |
| prestigio | casa y partida | 1085-2 | hortelanos | — | 194,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 664 sobre una mediana exacta de 342 |
| prestigio | casa y partida | 1085-2 | mercaderes | — | 44,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 152 sobre una mediana exacta de 342 |
| prestigio | casa y partida | 1085-2 | mesta | — | 101,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 346 sobre una mediana exacta de 342 |
| prestigio | casa y partida | 1085-2 | monjes | — | 234,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 802 sobre una mediana exacta de 342 |
| prestigio | casa y partida | 1085-2 | salineros | — | 98,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 338 sobre una mediana exacta de 342 |
| actividad | casa y partida | 1085-2 | arrieros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | monjes | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | monjes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | salineros | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085-2 | arrieros | — | 17 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 34 de 200 turnos |
| escasez | casa y partida | 1085-2 | canteros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1085-2 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1085-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | mercaderes | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1085-2 | mesta | — | 17 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 34 de 200 turnos |
| escasez | casa y partida | 1085-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1085-2 | — | — | 3 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-campo-de-beja, sal: 3 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085-2 | — | — | 57,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 144 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1085-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 138 · a mano 138 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 187 · a mano 187 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 341 · a mano 341 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -61 · a mano -61 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -69 · a mano -69 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 376 · a mano 376 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 608 · a mano 608 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 93 · a mano 93 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 125 · a mano 125 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 218 · a mano 218 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 301 · a mano 301 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 322 · a mano 322 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 710 · a mano 710 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 216 · a mano 216 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 260 · a mano 260 · el dominio coincide turno a turno |
| dominio | partida | 1085-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 5 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-2 | — | — | 106 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T106 |
| prestigio | casa y partida | 1085-3 | arrieros | — | 82,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 304 sobre una mediana exacta de 369,5 |
| prestigio | casa y partida | 1085-3 | canteros | — | 118,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 438 sobre una mediana exacta de 369,5 |
| prestigio | casa y partida | 1085-3 | ferrones | — | 29,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 109 sobre una mediana exacta de 369,5 |
| prestigio | casa y partida | 1085-3 | hortelanos | — | 215,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 797 sobre una mediana exacta de 369,5 |
| prestigio | casa y partida | 1085-3 | mercaderes | — | 21,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 80 sobre una mediana exacta de 369,5 |
| prestigio | casa y partida | 1085-3 | mesta | — | 5,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 21 sobre una mediana exacta de 369,5 |
| prestigio | casa y partida | 1085-3 | monjes | — | 229,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 848 sobre una mediana exacta de 369,5 |
| prestigio | casa y partida | 1085-3 | salineros | — | 117,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 435 sobre una mediana exacta de 369,5 |
| actividad | casa y partida | 1085-3 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | canteros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | canteros | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | monjes | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | monjes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | salineros | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | ferrones | — | 4,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 9 de 200 turnos |
| escasez | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | mercaderes | — | 23 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 46 de 200 turnos |
| escasez | casa y partida | 1085-3 | mesta | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1085-3 | monjes | — | 6 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 12 de 200 turnos |
| escasez | casa y partida | 1085-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1085-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1085-3 | — | — | 42,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 89 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 106 · a mano 106 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 330 · a mano 330 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 406 · a mano 406 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 37 · a mano 37 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 16 · a mano 16 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 312 · a mano 312 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 739 · a mano 739 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -31 · a mano -31 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -33 · a mano -33 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 23 · a mano 23 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 6 · a mano 6 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 444 · a mano 444 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 896 · a mano 896 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 203 · a mano 203 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 114 · a mano 114 · el dominio coincide turno a turno |
| dominio | partida | 1085-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-3 | — | — | 114 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T114 |
| ganadores | campaña | 1085 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan monjes, monjes, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 139,1 %
  - Ferrones: 24,8 %
  - Hortelanos: 234,0 %
  - Mercaderes: 48,3 %
  - Monjes: 288,8 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1085-2): 34,5 % de los turnos
  - Mercaderes (semilla 1085-3): 23,0 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 157 de 403 comarcas
  - región 01-iberico-alto-duero: 4
  - región 02-meseta-norte: 8
  - región 03-cantabrico: 18
  - región 04-galicia-minho: 10
  - región 05-central-extremadura: 32
  - región 06-meseta-sur: 13
  - región 07-ebro-pirineo: 11
  - región 08-levante: 3
  - región 09-andalucia: 47
  - región 10-portugal-sur: 11

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 849 | 288,8 % | 1 | 2 | 1458 | 17 | 917 | 2,0 % | 2,5 % |
| Hortelanos | 688 | 234,0 % | 2 | 1 | 693 | 7 | 2859 | 0,0 % | 2,0 % |
| Canteros | 409 | 139,1 % | 3 | 1 | 126 | 2 | 445 | 2,5 % | 1,5 % |
| Salineros | 332 | 112,9 % | 5 | 1 | 416 | 5 | 4131 | 3,5 % | 4,0 % |
| Mesta | 255 | 86,7 % | 5 | 1 | 39 | 2 | 6106 | 12,5 % | 4,5 % |
| Arrieros | 236 | 80,3 % | 6 | 0 | 141 | 2 | 141 | 10,5 % | 2,5 % |
| Mercaderes | 142 | 48,3 % | 7 | 0 | 83 | 1 | 101 | 8,5 % | 0,0 % |
| Ferrones | 73 | 24,8 % | 7 | 0 | 43 | 1 | 214 | 13,0 % | 3,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 28 | 16 | 40 | 0 | 0 | 128 | 0 | 0 | 72 |
| Canteros | 25 | 16 | 120 | 0 | 0 | 125 | 0 | 0 | 135 |
| Ferrones | 9 | 8 | 0 | 0 | 0 | 45 | 0 | 17 | 20 |
| Hortelanos | 138 | 59 | 160 | 0 | 0 | 163 | 0 | 0 | 168 |
| Mercaderes | 16 | 8 | 0 | 0 | 0 | 115 | 0 | 0 | 20 |
| Mesta | 7 | 13 | 0 | 0 | 0 | 24 | 173 | 0 | 108 |
| Monjes | 291 | 133 | 40 | 0 | 0 | 200 | 0 | 0 | 188 |
| Salineros | 83 | 37 | 0 | 0 | 0 | 120 | 0 | 0 | 98 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1085 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1085 | termina obras mayores | sí |  |
| Ferrones | 1085 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 128 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 55 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 47 turnos) |
| Mesta | 1085 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1085 | funda pueblas | sí |  |
| Salineros | 1085 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 120 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 80 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 63 turnos) |
| Canteros | 1085-2 | termina obras mayores | sí |  |
| Ferrones | 1085-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1085-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1085-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1085-2 | funda pueblas | sí |  |
| Salineros | 1085-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 192 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 65 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 30 turnos) |
| Canteros | 1085-3 | termina obras mayores | sí |  |
| Ferrones | 1085-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 123 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 101 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 95 turnos) |
| Mesta | 1085-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no conoce ningún invernadero al que pueda llegar el ganado (mapa, 183 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 81 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 17 turnos) |
| Monjes | 1085-3 | funda pueblas | sí |  |
| Salineros | 1085-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5598 | 711 | 0 | 0 | 0 | 9 | 0 | 0 | 329 | 1708 | 2 | 23 | 1 | 1 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 5116 | 58 | 537 | 0 | 0 | 4 | 1 | 0 | 132 | 1186 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 2065 | 944 | 0 | 0 | 286 | 4 | 0 | 3 | 59 | 738 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 30014 | 1202 | 0 | 0 | 0 | 35 | 1 | 0 | 216 | 1798 | 0 | 0 | 0 | 0 | 0 | 6 |
| Mercaderes | 0 | 0 | 0 | 3636 | 197 | 0 | 0 | 0 | 6 | 0 | 0 | 150 | 1111 | 29 | 52 | 4 | 3 | 0 | 0 |
| Mesta | 276 | 13 | 0 | 1798 | 1047 | 0 | 0 | 0 | 5 | 0 | 0 | 26 | 1624 | 0 | 0 | 0 | 0 | 0 | 3 |
| Monjes | 0 | 0 | 0 | 36569 | 3453 | 0 | 0 | 0 | 75 | 0 | 0 | 258 | 1788 | 0 | 0 | 0 | 0 | 10 | 6 |
| Salineros | 0 | 0 | 0 | 10514 | 0 | 0 | 1968 | 0 | 18 | 0 | 0 | 154 | 1900 | 0 | 0 | 0 | 0 | 0 | 4 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1085 | T100 | arrieros | 157 | 157 | 0,0 % | igual turno a turno |
| 1085 | T100 | canteros | 323 | 323 | 0,0 % | igual turno a turno |
| 1085 | T100 | ferrones | 73 | 73 | 0,0 % | igual turno a turno |
| 1085 | T100 | hortelanos | 267 | 267 | 0,0 % | igual turno a turno |
| 1085 | T100 | mercaderes | 122 | 122 | 0,0 % | igual turno a turno |
| 1085 | T100 | mesta | 203 | 203 | 0,0 % | igual turno a turno |
| 1085 | T100 | monjes | 532 | 532 | 0,0 % | igual turno a turno |
| 1085 | T100 | salineros | 222 | 222 | 0,0 % | igual turno a turno |
| 1085 | T200 | arrieros | 253 | 253 | 0,0 % | igual turno a turno |
| 1085 | T200 | canteros | 510 | 510 | 0,0 % | igual turno a turno |
| 1085 | T200 | ferrones | 89 | 89 | 0,0 % | igual turno a turno |
| 1085 | T200 | hortelanos | 617 | 617 | 0,0 % | igual turno a turno |
| 1085 | T200 | mercaderes | 162 | 162 | 0,0 % | igual turno a turno |
| 1085 | T200 | mesta | 288 | 288 | 0,0 % | igual turno a turno |
| 1085 | T200 | monjes | 754 | 754 | 0,0 % | igual turno a turno |
| 1085 | T200 | salineros | 280 | 280 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | arrieros | 138 | 138 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | ferrones | -61 | -61 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | hortelanos | 376 | 376 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | mercaderes | 93 | 93 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | mesta | 218 | 218 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | monjes | 322 | 322 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | salineros | 216 | 216 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | arrieros | 187 | 187 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | canteros | 341 | 341 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | ferrones | -69 | -69 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | hortelanos | 608 | 608 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | mercaderes | 125 | 125 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | mesta | 301 | 301 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | monjes | 710 | 710 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | salineros | 260 | 260 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | arrieros | 106 | 106 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | canteros | 330 | 330 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | ferrones | 37 | 37 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | hortelanos | 312 | 312 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | mercaderes | -31 | -31 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | mesta | 23 | 23 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | monjes | 444 | 444 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | salineros | 203 | 203 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | arrieros | 123 | 123 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | canteros | 406 | 406 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | ferrones | 16 | 16 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | hortelanos | 739 | 739 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | mercaderes | -33 | -33 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | mesta | 6 | 6 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | monjes | 896 | 896 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | salineros | 114 | 114 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 236 | 188 | 20,3 % | carga 895, mercado 853, ruta 160 |
| Canteros | 409 | 419 | 2,4 % | mercado 772, carga 576, ruta 88 |
| Ferrones | 73 | 12 | 83,6 % | mercado 715, carga 498, cometido 26 |
| Hortelanos | 688 | 655 | 4,8 % | mercado 1231, carga 678, ruta 196 |
| Mercaderes | 142 | 85 | 40,1 % | carga 868, mercado 703, ruta 89 |
| Mesta | 255 | 198 | 22,4 % | mercado 1511, carga 477, ruta 132 |
| Monjes | 849 | 787 | 7,3 % | mercado 1119, carga 725, ruta 257 |
| Salineros | 332 | 218 | 34,3 % | mercado 1252, carga 557, regalo 95 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1085 | Arrieros | T93 | **no** | **no** | 4 |
| 1085 | Canteros | **no** | T129 | T129 | 4 |
| 1085 | Ferrones | **no** | **no** | **no** | 2 |
| 1085 | Hortelanos | T55 | **no** | **no** | 4 |
| 1085 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085 | Mesta | T95 | **no** | **no** | 5 |
| 1085 | Monjes | T43 | **no** | **no** | 4 |
| 1085 | Salineros | **no** | **no** | **no** | 3 |
| 1085-2 | Arrieros | T88 | **no** | **no** | 4 |
| 1085-2 | Canteros | **no** | T106 | T106 | 4 |
| 1085-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1085-2 | Hortelanos | T57 | T108 | T108 | 5 |
| 1085-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085-2 | Mesta | T118 | **no** | **no** | 5 |
| 1085-2 | Monjes | T43 | T161 | T161 | 5 |
| 1085-2 | Salineros | T130 | **no** | **no** | 4 |
| 1085-3 | Arrieros | **no** | T184 | T184 | 3 |
| 1085-3 | Canteros | **no** | T114 | T114 | 4 |
| 1085-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1085-3 | Hortelanos | T53 | T117 | T117 | 5 |
| 1085-3 | Mercaderes | **no** | **no** | **no** | 1 |
| 1085-3 | Mesta | **no** | **no** | **no** | 1 |
| 1085-3 | Monjes | T43 | **no** | **no** | 4 |
| 1085-3 | Salineros | T82 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1085 | Arrieros | 4 | 33 | 157 | 85 | 0 | 5 | 840 |
| 1085 | Canteros | 0 | 0 | 0 | 0 | 0 | 117 | 1045 |
| 1085 | Ferrones | 0 | 0 | 0 | 0 | 45 | 47 | 531 |
| 1085 | Hortelanos | 0 | 0 | 0 | 0 | 117 | 469 | 775 |
| 1085 | Mercaderes | 4 | 24 | 28 | -44 | 0 | 0 | 1194 |
| 1085 | Mesta | 0 | 0 | 0 | 0 | 0 | 951 | 636 |
| 1085 | Monjes | 0 | 0 | 0 | 0 | 67 | 703 | 677 |
| 1085 | Salineros | 0 | 0 | 0 | 0 | 14 | 609 | 1240 |
| 1085-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 787 | 1151 |
| 1085-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1285 |
| 1085-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 374 |
| 1085-2 | Hortelanos | 0 | 0 | 0 | 0 | 32 | 777 | 959 |
| 1085-2 | Mercaderes | 9 | 63 | 740 | 405 | 0 | 0 | 1221 |
| 1085-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 964 | 622 |
| 1085-2 | Monjes | 0 | 0 | 0 | 0 | 67 | 841 | 622 |
| 1085-2 | Salineros | 0 | 0 | 0 | 0 | 8 | 943 | 950 |
| 1085-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1045 | 1208 |
| 1085-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 830 |
| 1085-3 | Ferrones | 0 | 0 | 0 | 0 | 64 | 40 | 558 |
| 1085-3 | Hortelanos | 0 | 0 | 0 | 0 | 28 | 724 | 887 |
| 1085-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 722 |
| 1085-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 830 | 863 |
| 1085-3 | Monjes | 0 | 0 | 0 | 0 | 69 | 807 | 666 |
| 1085-3 | Salineros | 0 | 0 | 0 | 0 | 104 | 838 | 826 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 829 | 846 | 844 | 1 | 141 |
| Canteros | 614 | 632 | 630 | 0 | 79 |
| Ferrones | 524 | 541 | 540 | 0 | 27 |
| Hortelanos | 973 | 991 | 984 | 3 | 199 |
| Mercaderes | 702 | 719 | 718 | 0 | 69 |
| Mesta | 895 | 912 | 908 | 3 | 30 |
| Monjes | 1017 | 1035 | 1027 | 6 | 270 |
| Salineros | 861 | 879 | 873 | 3 | 111 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 35
- construir: comarca-ajena: 8
- incorporar: comarca-con-duenyo: 8

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 68 | 87 | 103 | 116 | 178 | 165 | 165 | 169 | 177 | 236 |
| Canteros | 67 | 81 | 105 | 121 | 139 | 275 | 355 | 366 | 379 | 409 |
| Ferrones | 35 | 27 | 41 | 51 | 56 | 65 | 67 | 67 | 70 | 73 |
| Hortelanos | 154 | 175 | 293 | 338 | 376 | 518 | 540 | 558 | 629 | 688 |
| Mercaderes | 55 | 71 | 89 | 103 | 109 | 118 | 127 | 127 | 135 | 142 |
| Mesta | 38 | 45 | 115 | 150 | 186 | 208 | 227 | 259 | 298 | 255 |
| Monjes | 83 | 187 | 332 | 392 | 447 | 536 | 611 | 688 | 785 | 849 |
| Salineros | 96 | 116 | 124 | 155 | 211 | 234 | 277 | 284 | 315 | 332 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1085`: `1eb73fed6ce2171d5c8cf2f8972d477c805f7b324e333b35279249400c6c9dac`
- semilla `1085-2`: `fddf4a3f5e9b1b0697f85360bc4ea6052489c0cbd1722f32980202150edf0620`
- semilla `1085-3`: `adc5ca540d344f779c954c1c08c73f78b686c9234f319a7b09b73f01fbfdbbc4`
