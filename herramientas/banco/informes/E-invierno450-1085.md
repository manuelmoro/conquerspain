# Banco de pruebas · semilla 1085

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 854 de prestigio (311,7 % de la mediana) y **Ferrones** cierra la clasificación con 104 (38,0 % de la mediana). La mediana de prestigio es 274. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `702fb5cd45e685534e9c7ff703e7c5ede73f1005` |
| Etiqueta del informe | E-invierno450-1085 |
| Cambios experimentales | estaciones.factorPanMil.invierno=450 (ensayo T-047) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1085, 1085-2, 1085-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `de017dc6f6406b3b06271fcf34cf2110b07e5e8f34af15e7f77667b049dc66e1` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 43 filas sin cerrar de 157.

114 cumplen, 41 incumplen y 2 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1085 | arrieros | — | 58,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 195 sobre una mediana exacta de 332,5 |
| prestigio | casa y partida | 1085 | canteros | — | 115,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 384 sobre una mediana exacta de 332,5 |
| prestigio | casa y partida | 1085 | ferrones | — | 43,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 146 sobre una mediana exacta de 332,5 |
| prestigio | casa y partida | 1085 | hortelanos | — | 171,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 569 sobre una mediana exacta de 332,5 |
| prestigio | casa y partida | 1085 | mercaderes | — | 58,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 195 sobre una mediana exacta de 332,5 |
| prestigio | casa y partida | 1085 | mesta | — | 124,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 413 sobre una mediana exacta de 332,5 |
| prestigio | casa y partida | 1085 | monjes | — | 262,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 874 sobre una mediana exacta de 332,5 |
| prestigio | casa y partida | 1085 | salineros | — | 84,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 281 sobre una mediana exacta de 332,5 |
| actividad | casa y partida | 1085 | arrieros | — | 5,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 11 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1085 | arrieros | — | 21 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 42 de 200 turnos |
| escasez | casa y partida | 1085 | canteros | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| escasez | casa y partida | 1085 | ferrones | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1085 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mesta | — | 8 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 16 de 200 turnos |
| escasez | casa y partida | 1085 | monjes | — | 6,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 13 de 200 turnos |
| escasez | casa y partida | 1085 | salineros | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| precios | partida | 1085 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-bajo-aragon, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085 | — | — | 41,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 87 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1085 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 155 · a mano 155 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 300 · a mano 300 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 77 · a mano 77 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 109 · a mano 109 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 267 · a mano 267 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 624 · a mano 624 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 112 · a mano 112 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 152 · a mano 152 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 201 · a mano 201 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 284 · a mano 284 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 530 · a mano 530 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 746 · a mano 746 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 91 · a mano 91 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 129 · a mano 129 · el dominio coincide turno a turno |
| dominio | partida | 1085 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085 | — | — | 132 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 1 de 8 casas lo alcanzan; la primera en T132 |
| prestigio | casa y partida | 1085-2 | arrieros | — | 74,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 240 sobre una mediana exacta de 320,5 |
| prestigio | casa y partida | 1085-2 | canteros | — | 125,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 401 sobre una mediana exacta de 320,5 |
| prestigio | casa y partida | 1085-2 | ferrones | — | -2,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -9 sobre una mediana exacta de 320,5 |
| prestigio | casa y partida | 1085-2 | hortelanos | — | 207,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 664 sobre una mediana exacta de 320,5 |
| prestigio | casa y partida | 1085-2 | mercaderes | — | 49,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 159 sobre una mediana exacta de 320,5 |
| prestigio | casa y partida | 1085-2 | mesta | — | 134,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 432 sobre una mediana exacta de 320,5 |
| prestigio | casa y partida | 1085-2 | monjes | — | 252,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 810 sobre una mediana exacta de 320,5 |
| prestigio | casa y partida | 1085-2 | salineros | — | 72,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 233 sobre una mediana exacta de 320,5 |
| actividad | casa y partida | 1085-2 | arrieros | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1085-2 | arrieros | — | 17,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 35 de 200 turnos |
| escasez | casa y partida | 1085-2 | canteros | — | 4,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 9 de 200 turnos |
| escasez | casa y partida | 1085-2 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1085-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | mercaderes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1085-2 | mesta | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1085-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | salineros | — | 11,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 23 de 200 turnos |
| precios | partida | 1085-2 | — | — | 3 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-campo-de-beja, sal: 3 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085-2 | — | — | 58,6 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 146 de 249 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1085-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 138 · a mano 138 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 179 · a mano 179 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 397 · a mano 397 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -59 · a mano -59 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -64 · a mano -64 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 276 · a mano 276 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 479 · a mano 479 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 93 · a mano 93 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 125 · a mano 125 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 165 · a mano 165 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 296 · a mano 296 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 416 · a mano 416 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 785 · a mano 785 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 259 · a mano 259 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 327 · a mano 327 · el dominio coincide turno a turno |
| dominio | partida | 1085-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-2 | — | — | 106 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T106 |
| prestigio | casa y partida | 1085-3 | arrieros | — | 126,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 304 sobre una mediana exacta de 239,5 |
| prestigio | casa y partida | 1085-3 | canteros | — | 171,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 410 sobre una mediana exacta de 239,5 |
| prestigio | casa y partida | 1085-3 | ferrones | — | 73,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 175 sobre una mediana exacta de 239,5 |
| prestigio | casa y partida | 1085-3 | hortelanos | — | 299,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 717 sobre una mediana exacta de 239,5 |
| prestigio | casa y partida | 1085-3 | mercaderes | — | 33,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 79 sobre una mediana exacta de 239,5 |
| prestigio | casa y partida | 1085-3 | mesta | — | 24,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 58 sobre una mediana exacta de 239,5 |
| prestigio | casa y partida | 1085-3 | monjes | — | 366,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 877 sobre una mediana exacta de 239,5 |
| prestigio | casa y partida | 1085-3 | salineros | — | 43,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 105 sobre una mediana exacta de 239,5 |
| actividad | casa y partida | 1085-3 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | canteros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | canteros | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | ferrones | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | monjes | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | monjes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | salineros | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | ferrones | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | mercaderes | — | 23 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 46 de 200 turnos |
| escasez | casa y partida | 1085-3 | mesta | — | 7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 200 turnos |
| escasez | casa y partida | 1085-3 | monjes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1085-3 | salineros | — | 17 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 34 de 200 turnos |
| precios | partida | 1085-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1085-3 | — | — | 44,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 92 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 106 · a mano 106 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 330 · a mano 330 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 404 · a mano 404 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 60 · a mano 60 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 35 · a mano 35 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 312 · a mano 312 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 739 · a mano 739 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -32 · a mano -32 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -38 · a mano -38 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 40 · a mano 40 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 24 · a mano 24 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 444 · a mano 444 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 742 · a mano 742 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 227 · a mano 227 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1085-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 311 · a mano 311 · el dominio coincide turno a turno |
| dominio | partida | 1085-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-3 | — | — | 130 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T130 |
| ganadores | campaña | 1085 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan monjes, monjes, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 145,3 %
  - Ferrones: 38,0 %
  - Hortelanos: 237,2 %
  - Mercaderes: 52,6 %
  - Monjes: 311,7 %
  - Salineros: 75,2 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Arrieros (semilla 1085): 21,0 % de los turnos
  - Ferrones (semilla 1085-2): 34,5 % de los turnos
  - Mercaderes (semilla 1085-3): 23,0 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 159 de 403 comarcas
  - región 01-iberico-alto-duero: 6
  - región 02-meseta-norte: 8
  - región 03-cantabrico: 17
  - región 04-galicia-minho: 9
  - región 05-central-extremadura: 33
  - región 06-meseta-sur: 12
  - región 07-ebro-pirineo: 12
  - región 08-levante: 3
  - región 09-andalucia: 47
  - región 10-portugal-sur: 12

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 854 | 311,7 % | 1 | 3 | 1397 | 16 | 898 | 3,5 % | 2,5 % |
| Hortelanos | 650 | 237,2 % | 2 | 1 | 747 | 8 | 3651 | 0,0 % | 2,0 % |
| Canteros | 398 | 145,3 % | 4 | 1 | 113 | 2 | 439 | 3,5 % | 1,0 % |
| Mesta | 301 | 109,9 % | 5 | 1 | 59 | 2 | 5403 | 8,0 % | 4,5 % |
| Arrieros | 246 | 89,8 % | 5 | 0 | 149 | 2 | 123 | 13,0 % | 3,0 % |
| Salineros | 206 | 75,2 % | 6 | 0 | 261 | 3 | 2787 | 11,5 % | 4,0 % |
| Mercaderes | 144 | 52,6 % | 7 | 0 | 81 | 1 | 96 | 8,5 % | 0,0 % |
| Ferrones | 104 | 38,0 % | 7 | 0 | 54 | 1 | 86 | 12,0 % | 4,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 30 | 19 | 40 | 0 | 0 | 125 | 0 | 0 | 72 |
| Canteros | 22 | 13 | 120 | 0 | 0 | 128 | 0 | 0 | 128 |
| Ferrones | 11 | 11 | 0 | 0 | 0 | 72 | 0 | 8 | 27 |
| Hortelanos | 149 | 61 | 120 | 0 | 0 | 168 | 0 | 0 | 152 |
| Mercaderes | 16 | 8 | 0 | 0 | 0 | 117 | 0 | 0 | 20 |
| Mesta | 12 | 13 | 0 | 0 | 0 | 27 | 173 | 0 | 92 |
| Monjes | 279 | 131 | 40 | 0 | 0 | 189 | 0 | 0 | 222 |
| Salineros | 52 | 24 | 0 | 0 | 0 | 115 | 0 | 0 | 92 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1085 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1085 | termina obras mayores | sí |  |
| Ferrones | 1085 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 127 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 53 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 46 turnos) |
| Mesta | 1085 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1085 | funda pueblas | sí |  |
| Salineros | 1085 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 125 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 83 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 79 turnos) |
| Canteros | 1085-2 | termina obras mayores | sí |  |
| Ferrones | 1085-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1085-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1085-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1085-2 | funda pueblas | sí |  |
| Salineros | 1085-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 192 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 61 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 29 turnos) |
| Canteros | 1085-3 | termina obras mayores | sí |  |
| Ferrones | 1085-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 42 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1085-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 145 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 94 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 94 turnos) |
| Mesta | 1085-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 187 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 13 turnos) |
| Monjes | 1085-3 | funda pueblas | sí |  |
| Salineros | 1085-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5691 | 711 | 0 | 0 | 0 | 9 | 0 | 0 | 306 | 1677 | 3 | 27 | 1 | 1 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 5043 | 60 | 540 | 0 | 0 | 4 | 1 | 0 | 134 | 1196 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 2254 | 838 | 0 | 0 | 122 | 5 | 0 | 1 | 95 | 749 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 27455 | 933 | 0 | 0 | 0 | 35 | 1 | 0 | 194 | 1803 | 0 | 0 | 0 | 0 | 0 | 7 |
| Mercaderes | 0 | 0 | 0 | 3588 | 197 | 0 | 0 | 0 | 6 | 0 | 0 | 179 | 1166 | 36 | 94 | 7 | 6 | 0 | 0 |
| Mesta | 225 | 13 | 0 | 1785 | 1060 | 0 | 0 | 0 | 3 | 0 | 0 | 28 | 1616 | 0 | 0 | 0 | 0 | 0 | 1 |
| Monjes | 0 | 0 | 0 | 35178 | 3357 | 0 | 0 | 0 | 73 | 0 | 0 | 242 | 1766 | 0 | 0 | 0 | 0 | 10 | 6 |
| Salineros | 0 | 0 | 0 | 7836 | 0 | 0 | 1936 | 0 | 21 | 0 | 0 | 113 | 1896 | 0 | 0 | 0 | 0 | 0 | 5 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1085 | T100 | arrieros | 155 | 155 | 0,0 % | igual turno a turno |
| 1085 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1085 | T100 | ferrones | 77 | 77 | 0,0 % | igual turno a turno |
| 1085 | T100 | hortelanos | 267 | 267 | 0,0 % | igual turno a turno |
| 1085 | T100 | mercaderes | 112 | 112 | 0,0 % | igual turno a turno |
| 1085 | T100 | mesta | 201 | 201 | 0,0 % | igual turno a turno |
| 1085 | T100 | monjes | 530 | 530 | 0,0 % | igual turno a turno |
| 1085 | T100 | salineros | 91 | 91 | 0,0 % | igual turno a turno |
| 1085 | T200 | arrieros | 300 | 300 | 0,0 % | igual turno a turno |
| 1085 | T200 | canteros | 375 | 375 | 0,0 % | igual turno a turno |
| 1085 | T200 | ferrones | 109 | 109 | 0,0 % | igual turno a turno |
| 1085 | T200 | hortelanos | 624 | 624 | 0,0 % | igual turno a turno |
| 1085 | T200 | mercaderes | 152 | 152 | 0,0 % | igual turno a turno |
| 1085 | T200 | mesta | 284 | 284 | 0,0 % | igual turno a turno |
| 1085 | T200 | monjes | 746 | 746 | 0,0 % | igual turno a turno |
| 1085 | T200 | salineros | 129 | 129 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | arrieros | 138 | 138 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | canteros | 321 | 321 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | ferrones | -59 | -59 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | hortelanos | 276 | 276 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | mercaderes | 93 | 93 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | mesta | 165 | 165 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | monjes | 416 | 416 | 0,0 % | igual turno a turno |
| 1085-2 | T100 | salineros | 259 | 259 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | arrieros | 179 | 179 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | canteros | 397 | 397 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | ferrones | -64 | -64 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | hortelanos | 479 | 479 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | mercaderes | 125 | 125 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | mesta | 296 | 296 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | monjes | 785 | 785 | 0,0 % | igual turno a turno |
| 1085-2 | T200 | salineros | 327 | 327 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | arrieros | 106 | 106 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | canteros | 330 | 330 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | ferrones | 60 | 60 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | hortelanos | 312 | 312 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | mercaderes | -32 | -32 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | mesta | 40 | 40 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | monjes | 444 | 444 | 0,0 % | igual turno a turno |
| 1085-3 | T100 | salineros | 227 | 227 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | arrieros | 130 | 130 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | canteros | 404 | 404 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | ferrones | 35 | 35 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | hortelanos | 739 | 739 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | mercaderes | -38 | -38 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | mesta | 24 | 24 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | monjes | 742 | 742 | 0,0 % | igual turno a turno |
| 1085-3 | T200 | salineros | 311 | 311 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 246 | 203 | 17,5 % | carga 871, mercado 838, ruta 152 |
| Canteros | 398 | 392 | 1,5 % | mercado 769, carga 580, ruta 90 |
| Ferrones | 104 | 27 | 74,0 % | mercado 735, carga 507, cometido 37 |
| Hortelanos | 650 | 614 | 5,5 % | mercado 1330, carga 646, ruta 164 |
| Mercaderes | 144 | 80 | 44,4 % | carga 849, mercado 704, ruta 97 |
| Mesta | 301 | 201 | 33,2 % | mercado 1523, carga 477, ruta 132 |
| Monjes | 854 | 758 | 11,2 % | mercado 1108, carga 711, ruta 243 |
| Salineros | 206 | 256 | 19,5 % | mercado 1359, carga 540, regalo 73 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1085 | Arrieros | T93 | **no** | **no** | 4 |
| 1085 | Canteros | **no** | T132 | T132 | 4 |
| 1085 | Ferrones | **no** | **no** | **no** | 2 |
| 1085 | Hortelanos | T55 | **no** | **no** | 4 |
| 1085 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085 | Mesta | **no** | **no** | **no** | 4 |
| 1085 | Monjes | T43 | **no** | **no** | 4 |
| 1085 | Salineros | T76 | **no** | **no** | 4 |
| 1085-2 | Arrieros | T88 | **no** | **no** | 4 |
| 1085-2 | Canteros | **no** | T106 | T106 | 4 |
| 1085-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1085-2 | Hortelanos | T57 | T108 | T108 | 5 |
| 1085-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085-2 | Mesta | **no** | **no** | **no** | 4 |
| 1085-2 | Monjes | T43 | T165 | T165 | 5 |
| 1085-2 | Salineros | T76 | **no** | **no** | 4 |
| 1085-3 | Arrieros | **no** | T183 | T183 | 3 |
| 1085-3 | Canteros | **no** | T130 | T130 | 3 |
| 1085-3 | Ferrones | **no** | **no** | **no** | 3 |
| 1085-3 | Hortelanos | T53 | T174 | T174 | 5 |
| 1085-3 | Mercaderes | **no** | **no** | **no** | 1 |
| 1085-3 | Mesta | **no** | **no** | **no** | 2 |
| 1085-3 | Monjes | T43 | **no** | **no** | 4 |
| 1085-3 | Salineros | T85 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1085 | Arrieros | 4 | 35 | 225 | 135 | 0 | 5 | 782 |
| 1085 | Canteros | 0 | 0 | 0 | 0 | 0 | 117 | 1062 |
| 1085 | Ferrones | 0 | 0 | 0 | 0 | 5 | 20 | 583 |
| 1085 | Hortelanos | 0 | 0 | 0 | 0 | 125 | 455 | 759 |
| 1085 | Mercaderes | 4 | 24 | 36 | -48 | 0 | 0 | 1201 |
| 1085 | Mesta | 0 | 0 | 0 | 0 | 0 | 894 | 680 |
| 1085 | Monjes | 0 | 0 | 0 | 0 | 84 | 559 | 731 |
| 1085 | Salineros | 0 | 0 | 0 | 0 | 53 | 689 | 1076 |
| 1085-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 765 | 1134 |
| 1085-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1277 |
| 1085-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 374 |
| 1085-2 | Hortelanos | 0 | 0 | 0 | 0 | 33 | 775 | 960 |
| 1085-2 | Mercaderes | 17 | 122 | 1151 | 618 | 0 | 0 | 1247 |
| 1085-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 942 | 644 |
| 1085-2 | Monjes | 0 | 0 | 0 | 0 | 60 | 819 | 641 |
| 1085-2 | Salineros | 0 | 0 | 0 | 0 | 32 | 725 | 1113 |
| 1085-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1043 | 1211 |
| 1085-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 854 |
| 1085-3 | Ferrones | 0 | 0 | 0 | 0 | 96 | 91 | 585 |
| 1085-3 | Hortelanos | 0 | 0 | 0 | 0 | 129 | 442 | 681 |
| 1085-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 726 |
| 1085-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 807 | 872 |
| 1085-3 | Monjes | 0 | 0 | 0 | 0 | 61 | 819 | 679 |
| 1085-3 | Salineros | 0 | 0 | 0 | 0 | 13 | 624 | 1215 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 809 | 826 | 825 | 0 | 139 |
| Canteros | 617 | 635 | 633 | 0 | 79 |
| Ferrones | 554 | 570 | 570 | 0 | 43 |
| Hortelanos | 980 | 998 | 992 | 3 | 181 |
| Mercaderes | 700 | 718 | 716 | 0 | 71 |
| Mesta | 893 | 911 | 909 | 0 | 31 |
| Monjes | 994 | 1012 | 1004 | 7 | 256 |
| Salineros | 890 | 907 | 904 | 1 | 94 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 26
- incorporar: comarca-con-duenyo: 8
- construir: comarca-ajena: 2

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 67 | 86 | 102 | 115 | 177 | 195 | 182 | 181 | 189 | 246 |
| Canteros | 66 | 80 | 104 | 120 | 139 | 203 | 353 | 364 | 377 | 398 |
| Ferrones | 38 | 31 | 31 | 39 | 52 | 66 | 71 | 77 | 96 | 104 |
| Hortelanos | 132 | 156 | 278 | 328 | 364 | 452 | 481 | 503 | 589 | 650 |
| Mercaderes | 59 | 73 | 94 | 108 | 111 | 121 | 130 | 129 | 138 | 144 |
| Mesta | 38 | 45 | 121 | 159 | 181 | 213 | 242 | 271 | 301 | 301 |
| Monjes | 116 | 220 | 368 | 428 | 479 | 567 | 629 | 703 | 790 | 854 |
| Salineros | 82 | 107 | 123 | 204 | 219 | 249 | 268 | 169 | 184 | 206 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1085`: `4d6d54290d822ae278ec72c2cc3702dfa0ec96a25d8e0f6993629d98dd7cc76f`
- semilla `1085-2`: `2971efd9a67e99c86f4d9f64e26b5ec6c4f3e0cb840d952884177d0ba4e4a8ed`
- semilla `1085-3`: `067d4d99698423f8864fce72e570f99d74d28d97a2e9e7bfa538f10ef1c168a5`
