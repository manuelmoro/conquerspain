# Banco de pruebas · semilla 1085

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 864 de prestigio (253,4 % de la mediana) y **Ferrones** cierra la clasificación con 68 (19,9 % de la mediana). La mediana de prestigio es 341. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `6b0fdd9f89101a7ab87c37b728a3c044f5db2ce5` |
| Etiqueta del informe | E-seSostiene-1085 |
| Cambios experimentales | robots 9: crece donde la comarca nueva se sostiene sola |
| Versiones | banco 0.1.0 · métricas 4 · robots 9 · reglas 1 |
| Semillas | 1085, 1085-2, 1085-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `fea056aae1d16f6f1465a0628f25e179c432f8e84c7d4cf2ea9f43116ddcf113` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 41 filas sin cerrar de 157.

116 cumplen, 39 incumplen y 2 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1085 | arrieros | — | 52,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 167 sobre una mediana exacta de 321 |
| prestigio | casa y partida | 1085 | canteros | — | 119,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 385 sobre una mediana exacta de 321 |
| prestigio | casa y partida | 1085 | ferrones | — | 46,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 150 sobre una mediana exacta de 321 |
| prestigio | casa y partida | 1085 | hortelanos | — | 187,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 602 sobre una mediana exacta de 321 |
| prestigio | casa y partida | 1085 | mercaderes | — | 80,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 257 sobre una mediana exacta de 321 |
| prestigio | casa y partida | 1085 | mesta | — | 130,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 420 sobre una mediana exacta de 321 |
| prestigio | casa y partida | 1085 | monjes | — | 279,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 896 sobre una mediana exacta de 321 |
| prestigio | casa y partida | 1085 | salineros | — | 71,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 230 sobre una mediana exacta de 321 |
| actividad | casa y partida | 1085 | arrieros | — | 15 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 30 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | canteros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085 | arrieros | — | 27 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 54 de 200 turnos |
| escasez | casa y partida | 1085 | canteros | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1085 | ferrones | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mercaderes | — | 11,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 23 de 200 turnos |
| escasez | casa y partida | 1085 | mesta | — | 4,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 9 de 200 turnos |
| escasez | casa y partida | 1085 | monjes | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1085 | salineros | — | 18,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 37 de 200 turnos |
| precios | partida | 1085 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-horta-de-valencia, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085 | — | — | 43,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 91 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1085 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 205 · a mano 205 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 287 · a mano 287 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 323 · a mano 323 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 510 · a mano 510 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 73 · a mano 73 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 97 · a mano 97 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 267 · a mano 267 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 617 · a mano 617 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 144 · a mano 144 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 132 · a mano 132 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 203 · a mano 203 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 288 · a mano 288 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 509 · a mano 509 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 729 · a mano 729 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 140 · a mano 140 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 196 · a mano 196 · el dominio coincide turno a turno |
| dominio | partida | 1085 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 5 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085 | — | — | 129 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T129 |
| prestigio | casa y partida | 1085-2 | arrieros | — | 59,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 241 sobre una mediana exacta de 406 |
| prestigio | casa y partida | 1085-2 | canteros | — | 99,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 405 sobre una mediana exacta de 406 |
| prestigio | casa y partida | 1085-2 | ferrones | — | -2,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -9 sobre una mediana exacta de 406 |
| prestigio | casa y partida | 1085-2 | hortelanos | — | 163,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 664 sobre una mediana exacta de 406 |
| prestigio | casa y partida | 1085-2 | mercaderes | — | 32,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 130 sobre una mediana exacta de 406 |
| prestigio | casa y partida | 1085-2 | mesta | — | 108,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 439 sobre una mediana exacta de 406 |
| prestigio | casa y partida | 1085-2 | monjes | — | 201,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 816 sobre una mediana exacta de 406 |
| prestigio | casa y partida | 1085-2 | salineros | — | 100,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 407 sobre una mediana exacta de 406 |
| actividad | casa y partida | 1085-2 | arrieros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | mercaderes | — | 6,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 13 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1085-2 | mercaderes | — | 19 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 38 de 200 turnos |
| escasez | casa y partida | 1085-2 | mesta | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1085-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | salineros | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| precios | partida | 1085-2 | — | — | 3 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-campo-de-beja, sal: 3 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085-2 | — | — | 57,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 144 de 249 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1085-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 138 · a mano 138 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 187 · a mano 187 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 341 · a mano 341 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -61 · a mano -61 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -69 · a mano -69 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 376 · a mano 376 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 579 · a mano 579 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 116 · a mano 116 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 119 · a mano 119 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 218 · a mano 218 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 301 · a mano 301 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 306 · a mano 306 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 661 · a mano 661 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 259 · a mano 259 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 333 · a mano 333 · el dominio coincide turno a turno |
| dominio | partida | 1085-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 5 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-2 | — | — | 106 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T106 |
| prestigio | casa y partida | 1085-3 | arrieros | — | 81,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 304 sobre una mediana exacta de 371 |
| prestigio | casa y partida | 1085-3 | canteros | — | 118,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 438 sobre una mediana exacta de 371 |
| prestigio | casa y partida | 1085-3 | ferrones | — | 16,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 62 sobre una mediana exacta de 371 |
| prestigio | casa y partida | 1085-3 | hortelanos | — | 221,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 822 sobre una mediana exacta de 371 |
| prestigio | casa y partida | 1085-3 | mercaderes | — | 21,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 80 sobre una mediana exacta de 371 |
| prestigio | casa y partida | 1085-3 | mesta | — | 15,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 59 sobre una mediana exacta de 371 |
| prestigio | casa y partida | 1085-3 | monjes | — | 237,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 880 sobre una mediana exacta de 371 |
| prestigio | casa y partida | 1085-3 | salineros | — | 132,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 490 sobre una mediana exacta de 371 |
| actividad | casa y partida | 1085-3 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | canteros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | canteros | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | ferrones | — | 26,5 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 53 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | ferrones | — | 12 | % de turnos sin decisión útil | < 10 % | 🔴 incumple | 24 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
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
| escasez | casa y partida | 1085-3 | ferrones | — | 13,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 27 de 200 turnos |
| escasez | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | mercaderes | — | 23 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 46 de 200 turnos |
| escasez | casa y partida | 1085-3 | mesta | — | 6,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 13 de 200 turnos |
| escasez | casa y partida | 1085-3 | monjes | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| escasez | casa y partida | 1085-3 | salineros | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| precios | partida | 1085-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1085-3 | — | — | 42,3 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 88 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 106 · a mano 106 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 330 · a mano 330 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 406 · a mano 406 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 37 · a mano 37 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 16 · a mano 16 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 312 · a mano 312 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 628 · a mano 628 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -31 · a mano -31 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -33 · a mano -33 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 31 · a mano 31 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 444 · a mano 444 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 896 · a mano 896 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 119 · a mano 119 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 196 · a mano 196 · el dominio coincide turno a turno |
| dominio | partida | 1085-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-3 | — | — | 114 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T114 |
| ganadores | campaña | 1085 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan monjes, monjes, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 69,5 %
  - Ferrones: 19,9 %
  - Hortelanos: 204,1 %
  - Mercaderes: 45,7 %
  - Monjes: 253,4 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Ferrones: 11,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Arrieros (semilla 1085): 27,0 % de los turnos
  - Ferrones (semilla 1085-2): 34,5 % de los turnos
  - Mercaderes (semilla 1085-3): 23,0 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 156 de 403 comarcas
  - región 01-iberico-alto-duero: 7
  - región 02-meseta-norte: 9
  - región 03-cantabrico: 16
  - región 04-galicia-minho: 10
  - región 05-central-extremadura: 32
  - región 06-meseta-sur: 12
  - región 07-ebro-pirineo: 9
  - región 08-levante: 3
  - región 09-andalucia: 47
  - región 10-portugal-sur: 11

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 864 | 253,4 % | 1 | 2 | 1480 | 17 | 904 | 2,0 % | 2,5 % |
| Hortelanos | 696 | 204,1 % | 2 | 1 | 721 | 8 | 3114 | 0,0 % | 2,0 % |
| Canteros | 409 | 119,9 % | 4 | 1 | 126 | 2 | 445 | 2,5 % | 1,5 % |
| Salineros | 376 | 110,3 % | 4 | 1 | 545 | 7 | 2914 | 8,0 % | 4,0 % |
| Mesta | 306 | 89,7 % | 5 | 1 | 60 | 2 | 5398 | 5,5 % | 4,5 % |
| Arrieros | 237 | 69,5 % | 6 | 0 | 150 | 3 | 114 | 14,5 % | 7,0 % |
| Mercaderes | 156 | 45,7 % | 6 | 0 | 178 | 3 | 104 | 18,0 % | 2,5 % |
| Ferrones | 68 | 19,9 % | 8 | 0 | 45 | 1 | 98 | 16,0 % | 11,5 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 30 | 21 | 40 | 0 | 0 | 117 | 0 | 0 | 72 |
| Canteros | 25 | 16 | 120 | 0 | 0 | 125 | 0 | 0 | 135 |
| Ferrones | 9 | 8 | 0 | 0 | 0 | 61 | 0 | 17 | 32 |
| Hortelanos | 144 | 61 | 160 | 0 | 0 | 163 | 0 | 0 | 168 |
| Mercaderes | 35 | 27 | 0 | 0 | 0 | 109 | 0 | 0 | 53 |
| Mesta | 12 | 13 | 0 | 0 | 0 | 27 | 173 | 0 | 92 |
| Monjes | 296 | 136 | 40 | 0 | 0 | 208 | 0 | 0 | 188 |
| Salineros | 109 | 53 | 0 | 0 | 0 | 141 | 0 | 0 | 108 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1085 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 145 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 84 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 77 turnos) |
| Canteros | 1085 | termina obras mayores | sí |  |
| Ferrones | 1085 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 160 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 126 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 55 turnos) |
| Mesta | 1085 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1085 | funda pueblas | sí |  |
| Salineros | 1085 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 120 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 80 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 63 turnos) |
| Canteros | 1085-2 | termina obras mayores | sí |  |
| Ferrones | 1085-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1085-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 160 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 91 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 72 turnos) |
| Mesta | 1085-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1085-2 | funda pueblas | sí |  |
| Salineros | 1085-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 192 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 65 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 30 turnos) |
| Canteros | 1085-3 | termina obras mayores | sí |  |
| Ferrones | 1085-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 123 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 101 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 95 turnos) |
| Mesta | 1085-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 195 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 187 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 13 turnos) |
| Monjes | 1085-3 | funda pueblas | sí |  |
| Salineros | 1085-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5930 | 711 | 0 | 0 | 0 | 8 | 0 | 0 | 278 | 1608 | 0 | 0 | 0 | 0 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 5116 | 58 | 537 | 0 | 0 | 4 | 1 | 0 | 132 | 1186 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 2334 | 967 | 0 | 0 | 292 | 6 | 0 | 3 | 77 | 456 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 29769 | 1264 | 0 | 0 | 0 | 37 | 1 | 0 | 212 | 1798 | 0 | 0 | 0 | 0 | 0 | 7 |
| Mercaderes | 0 | 0 | 0 | 5063 | 197 | 0 | 0 | 0 | 7 | 0 | 0 | 90 | 905 | 0 | 0 | 0 | 0 | 0 | 4 |
| Mesta | 225 | 13 | 0 | 1856 | 1068 | 0 | 0 | 0 | 3 | 0 | 0 | 29 | 1623 | 0 | 0 | 0 | 0 | 0 | 1 |
| Monjes | 0 | 0 | 0 | 36722 | 3481 | 0 | 0 | 0 | 76 | 0 | 0 | 268 | 1788 | 0 | 0 | 0 | 0 | 10 | 6 |
| Salineros | 0 | 0 | 0 | 15513 | 0 | 0 | 2012 | 0 | 28 | 0 | 0 | 153 | 1897 | 0 | 0 | 0 | 0 | 0 | 7 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1085 | T100 | arrieros | 205 | 205 | 0,0 % | igual turno a turno |
| 1085 | T100 | canteros | 323 | 323 | 0,0 % | igual turno a turno |
| 1085 | T100 | ferrones | 73 | 73 | 0,0 % | igual turno a turno |
| 1085 | T100 | hortelanos | 267 | 267 | 0,0 % | igual turno a turno |
| 1085 | T100 | mercaderes | 144 | 144 | 0,0 % | igual turno a turno |
| 1085 | T100 | mesta | 203 | 203 | 0,0 % | igual turno a turno |
| 1085 | T100 | monjes | 509 | 509 | 0,0 % | igual turno a turno |
| 1085 | T100 | salineros | 140 | 140 | 0,0 % | igual turno a turno |
| 1085 | T200 | arrieros | 287 | 287 | 0,0 % | igual turno a turno |
| 1085 | T200 | canteros | 510 | 510 | 0,0 % | igual turno a turno |
| 1085 | T200 | ferrones | 97 | 97 | 0,0 % | igual turno a turno |
| 1085 | T200 | hortelanos | 617 | 617 | 0,0 % | igual turno a turno |
| 1085 | T200 | mercaderes | 132 | 132 | 0,0 % | igual turno a turno |
| 1085 | T200 | mesta | 288 | 288 | 0,0 % | igual turno a turno |
| 1085 | T200 | monjes | 729 | 729 | 0,0 % | igual turno a turno |
| 1085 | T200 | salineros | 196 | 196 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | arrieros | 138 | 138 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | ferrones | -61 | -61 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | hortelanos | 376 | 376 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | mercaderes | 116 | 116 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | mesta | 218 | 218 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | monjes | 306 | 306 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | salineros | 259 | 259 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | arrieros | 187 | 187 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | canteros | 341 | 341 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | ferrones | -69 | -69 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | hortelanos | 579 | 579 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | mercaderes | 119 | 119 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | mesta | 301 | 301 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | monjes | 661 | 661 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | salineros | 333 | 333 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | arrieros | 106 | 106 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | canteros | 330 | 330 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | ferrones | 37 | 37 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | hortelanos | 312 | 312 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | mercaderes | -31 | -31 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | mesta | 42 | 42 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | monjes | 444 | 444 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | salineros | 119 | 119 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | arrieros | 123 | 123 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | canteros | 406 | 406 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | ferrones | 16 | 16 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | hortelanos | 628 | 628 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | mercaderes | -33 | -33 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | mesta | 31 | 31 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | monjes | 896 | 896 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | salineros | 196 | 196 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 237 | 199 | 16,0 % | carga 826, mercado 808, ruta 143 |
| Canteros | 409 | 419 | 2,4 % | mercado 772, carga 576, ruta 88 |
| Ferrones | 68 | 15 | 77,9 % | mercado 483, carga 460, ruta 36 |
| Hortelanos | 696 | 608 | 12,6 % | mercado 1248, carga 668, ruta 186 |
| Mercaderes | 156 | 73 | 53,2 % | carga 848, mercado 610, ruta 72 |
| Mesta | 306 | 207 | 32,4 % | mercado 1530, carga 479, ruta 134 |
| Monjes | 864 | 762 | 11,8 % | mercado 1117, carga 729, ruta 261 |
| Salineros | 376 | 242 | 35,6 % | mercado 1442, carga 571, ruta 97 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1085 | Arrieros | T67 | **no** | **no** | 4 |
| 1085 | Canteros | **no** | T129 | T129 | 4 |
| 1085 | Ferrones | **no** | **no** | **no** | 2 |
| 1085 | Hortelanos | T55 | **no** | **no** | 4 |
| 1085 | Mercaderes | T90 | **no** | **no** | 4 |
| 1085 | Mesta | **no** | **no** | **no** | 4 |
| 1085 | Monjes | T43 | **no** | **no** | 4 |
| 1085 | Salineros | T77 | **no** | **no** | 4 |
| 1085-2 | Arrieros | T88 | **no** | **no** | 4 |
| 1085-2 | Canteros | **no** | T106 | T106 | 4 |
| 1085-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1085-2 | Hortelanos | T57 | T108 | T108 | 5 |
| 1085-2 | Mercaderes | T90 | **no** | **no** | 4 |
| 1085-2 | Mesta | **no** | **no** | **no** | 4 |
| 1085-2 | Monjes | T43 | T162 | T162 | 5 |
| 1085-2 | Salineros | T74 | **no** | **no** | 4 |
| 1085-3 | Arrieros | **no** | T184 | T184 | 3 |
| 1085-3 | Canteros | **no** | T114 | T114 | 4 |
| 1085-3 | Ferrones | T134 | **no** | **no** | 3 |
| 1085-3 | Hortelanos | T53 | T126 | T126 | 5 |
| 1085-3 | Mercaderes | **no** | **no** | **no** | 1 |
| 1085-3 | Mesta | **no** | **no** | **no** | 2 |
| 1085-3 | Monjes | T43 | **no** | **no** | 4 |
| 1085-3 | Salineros | T58 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1085 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 612 |
| 1085 | Canteros | 0 | 0 | 0 | 0 | 0 | 117 | 1045 |
| 1085 | Ferrones | 0 | 0 | 0 | 0 | 17 | 20 | 557 |
| 1085 | Hortelanos | 0 | 0 | 0 | 0 | 117 | 469 | 775 |
| 1085 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1133 |
| 1085 | Mesta | 0 | 0 | 0 | 0 | 0 | 906 | 678 |
| 1085 | Monjes | 0 | 0 | 0 | 0 | 67 | 703 | 677 |
| 1085 | Salineros | 0 | 0 | 0 | 0 | 28 | 660 | 1158 |
| 1085-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 787 | 1151 |
| 1085-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1285 |
| 1085-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 374 |
| 1085-2 | Hortelanos | 0 | 0 | 0 | 0 | 32 | 777 | 959 |
| 1085-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 841 |
| 1085-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 943 | 643 |
| 1085-2 | Monjes | 0 | 0 | 0 | 0 | 65 | 852 | 624 |
| 1085-2 | Salineros | 0 | 0 | 0 | 0 | 74 | 694 | 909 |
| 1085-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1045 | 1208 |
| 1085-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 830 |
| 1085-3 | Ferrones | 0 | 0 | 0 | 0 | 0 | 3 | 300 |
| 1085-3 | Hortelanos | 0 | 0 | 0 | 0 | 43 | 677 | 848 |
| 1085-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 722 |
| 1085-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 822 | 868 |
| 1085-3 | Monjes | 0 | 0 | 0 | 0 | 70 | 828 | 667 |
| 1085-3 | Salineros | 0 | 0 | 0 | 0 | 83 | 846 | 846 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 776 | 792 | 790 | 0 | 138 |
| Canteros | 614 | 632 | 630 | 0 | 79 |
| Ferrones | 430 | 446 | 446 | 0 | 39 |
| Hortelanos | 971 | 989 | 982 | 4 | 194 |
| Mercaderes | 659 | 676 | 671 | 2 | 80 |
| Mesta | 895 | 913 | 911 | 0 | 32 |
| Monjes | 1023 | 1041 | 1033 | 6 | 278 |
| Salineros | 982 | 999 | 989 | 3 | 133 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 31
- incorporar: comarca-con-duenyo: 9
- construir: comarca-ajena: 8

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 68 | 87 | 103 | 138 | 174 | 177 | 175 | 177 | 183 | 237 |
| Canteros | 67 | 81 | 105 | 121 | 139 | 275 | 355 | 366 | 379 | 409 |
| Ferrones | 35 | 27 | 41 | 54 | 51 | 67 | 89 | 54 | 60 | 68 |
| Hortelanos | 154 | 175 | 293 | 338 | 382 | 469 | 548 | 567 | 637 | 696 |
| Mercaderes | 55 | 71 | 89 | 120 | 158 | 137 | 157 | 116 | 134 | 156 |
| Mesta | 38 | 45 | 121 | 159 | 184 | 217 | 247 | 273 | 306 | 306 |
| Monjes | 83 | 187 | 332 | 393 | 448 | 536 | 612 | 690 | 788 | 864 |
| Salineros | 99 | 124 | 169 | 260 | 275 | 326 | 349 | 350 | 358 | 376 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1085`: `a00666a9d6c2607d475265f6e4a12893a07798bea6d52388d3265dabef9f8ed1`
- semilla `1085-2`: `015db541c38ac06990b9f3b21bf0dba0182674403d3ff0dffc4a7dd9956570a0`
- semilla `1085-3`: `837cabd70e47a0f5d4f1c06792ae54def533be4ed5e7ed8b61d422f6207d0c32`
