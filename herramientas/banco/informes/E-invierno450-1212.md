# Banco de pruebas · semilla 1212

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Hortelanos** va en cabeza con 853 de prestigio (209,6 % de la mediana) y **Ferrones** cierra la clasificación con 36 (8,8 % de la mediana). La mediana de prestigio es 407. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `702fb5cd45e685534e9c7ff703e7c5ede73f1005` |
| Etiqueta del informe | E-invierno450-1212 |
| Cambios experimentales | estaciones.factorPanMil.invierno=450 (ensayo T-047) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1212, 1212-2, 1212-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `de017dc6f6406b3b06271fcf34cf2110b07e5e8f34af15e7f77667b049dc66e1` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 36 filas sin cerrar de 157.

121 cumplen, 34 incumplen y 2 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1212 | arrieros | — | 98,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 354 sobre una mediana exacta de 359 |
| prestigio | casa y partida | 1212 | canteros | — | 101,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 364 sobre una mediana exacta de 359 |
| prestigio | casa y partida | 1212 | ferrones | — | -2,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -9 sobre una mediana exacta de 359 |
| prestigio | casa y partida | 1212 | hortelanos | — | 332,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 1193 sobre una mediana exacta de 359 |
| prestigio | casa y partida | 1212 | mercaderes | — | 42,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 151 sobre una mediana exacta de 359 |
| prestigio | casa y partida | 1212 | mesta | — | 168,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 603 sobre una mediana exacta de 359 |
| prestigio | casa y partida | 1212 | monjes | — | 199,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 716 sobre una mediana exacta de 359 |
| prestigio | casa y partida | 1212 | salineros | — | 93,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 336 sobre una mediana exacta de 359 |
| actividad | casa y partida | 1212 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | hortelanos | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | monjes | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | monjes | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1212 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | canteros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1212 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1212 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | mercaderes | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1212 | mesta | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1212 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | salineros | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| precios | partida | 1212 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212 | — | — | 56,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 140 de 249 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1212 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 107 · a mano 107 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 147 · a mano 147 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 458 · a mano 458 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -51 · a mano -51 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -55 · a mano -55 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 425 · a mano 425 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 830 · a mano 830 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 60 · a mano 60 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 152 · a mano 152 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 141 · a mano 141 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 295 · a mano 295 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 307 · a mano 307 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 603 · a mano 603 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 252 · a mano 252 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 292 · a mano 292 · el dominio coincide turno a turno |
| dominio | partida | 1212 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212 | — | — | 105 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 5 de 8 casas lo alcanzan; la primera en T105 |
| prestigio | casa y partida | 1212-2 | arrieros | — | 56,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 207 sobre una mediana exacta de 368,5 |
| prestigio | casa y partida | 1212-2 | canteros | — | 113,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 418 sobre una mediana exacta de 368,5 |
| prestigio | casa y partida | 1212-2 | ferrones | — | -4,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -17 sobre una mediana exacta de 368,5 |
| prestigio | casa y partida | 1212-2 | hortelanos | — | 173,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 638 sobre una mediana exacta de 368,5 |
| prestigio | casa y partida | 1212-2 | mercaderes | — | 46,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 171 sobre una mediana exacta de 368,5 |
| prestigio | casa y partida | 1212-2 | mesta | — | 86,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 319 sobre una mediana exacta de 368,5 |
| prestigio | casa y partida | 1212-2 | monjes | — | 173,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 641 sobre una mediana exacta de 368,5 |
| prestigio | casa y partida | 1212-2 | salineros | — | 160,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 591 sobre una mediana exacta de 368,5 |
| actividad | casa y partida | 1212-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | canteros | — | 8 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 16 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | mesta | — | 5,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 11 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | salineros | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1212-2 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | canteros | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1212-2 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1212-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mesta | — | 9 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 18 de 200 turnos |
| escasez | casa y partida | 1212-2 | monjes | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1212-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1212-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-2 | — | — | 63,1 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 157 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1212-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 128 · a mano 128 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 361 · a mano 361 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 311 · a mano 311 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 499 · a mano 499 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -51 · a mano -51 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -55 · a mano -55 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 429 · a mano 429 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 723 · a mano 723 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 106 · a mano 106 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 138 · a mano 138 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 156 · a mano 156 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 416 · a mano 416 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 252 · a mano 252 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 519 · a mano 519 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 322 · a mano 322 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 428 · a mano 428 · el dominio coincide turno a turno |
| dominio | partida | 1212-2 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212-2 | — | — | 69 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 2 de 8 casas lo alcanzan; la primera en T69 |
| prestigio | casa y partida | 1212-3 | arrieros | — | 82,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 300 sobre una mediana exacta de 365,5 |
| prestigio | casa y partida | 1212-3 | canteros | — | 101,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 369 sobre una mediana exacta de 365,5 |
| prestigio | casa y partida | 1212-3 | ferrones | — | 36,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 133 sobre una mediana exacta de 365,5 |
| prestigio | casa y partida | 1212-3 | hortelanos | — | 198,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 727 sobre una mediana exacta de 365,5 |
| prestigio | casa y partida | 1212-3 | mercaderes | — | 41,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 152 sobre una mediana exacta de 365,5 |
| prestigio | casa y partida | 1212-3 | mesta | — | 131,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 481 sobre una mediana exacta de 365,5 |
| prestigio | casa y partida | 1212-3 | monjes | — | 203,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 742 sobre una mediana exacta de 365,5 |
| prestigio | casa y partida | 1212-3 | salineros | — | 99,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 362 sobre una mediana exacta de 365,5 |
| actividad | casa y partida | 1212-3 | arrieros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | ferrones | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | hortelanos | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | salineros | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1212-3 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-3 | canteros | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1212-3 | ferrones | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-3 | mercaderes | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| escasez | casa y partida | 1212-3 | mesta | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1212-3 | monjes | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| escasez | casa y partida | 1212-3 | salineros | — | 13,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 27 de 200 turnos |
| precios | partida | 1212-3 | — | — | 3 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-tierra-de-valladolid, sal: 3 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1212-3 | — | — | 49,0 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 122 de 249 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1212-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 146 · a mano 146 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 194 · a mano 194 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 405 · a mano 405 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 59 · a mano 59 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 28 · a mano 28 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 296 · a mano 296 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 681 · a mano 681 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 66 · a mano 66 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 113 · a mano 113 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 178 · a mano 178 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 362 · a mano 362 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 479 · a mano 479 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 761 · a mano 761 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 291 · a mano 291 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 511 · a mano 511 · el dominio coincide turno a turno |
| dominio | partida | 1212-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1212-3 | — | — | 98 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T98 |
| ganadores | campaña | 1212 | — | — | 0 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🟢 cumple | ganan hortelanos, monjes, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 70,5 %
  - Ferrones: 8,8 %
  - Hortelanos: 209,6 %
  - Mercaderes: 38,8 %
  - Monjes: 172,0 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1212): 34,5 % de los turnos
  - Ferrones (semilla 1212-2): 34,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 189 de 403 comarcas
  - región 01-iberico-alto-duero: 4
  - región 02-meseta-norte: 7
  - región 03-cantabrico: 16
  - región 04-galicia-minho: 31
  - región 05-central-extremadura: 23
  - región 06-meseta-sur: 9
  - región 07-ebro-pirineo: 28
  - región 08-levante: 14
  - región 09-andalucia: 47
  - región 10-portugal-sur: 10

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Hortelanos | 853 | 209,6 % | 2 | 2 | 904 | 10 | 2124 | 0,0 % | 2,0 % |
| Monjes | 700 | 172,0 % | 1 | 1 | 1028 | 12 | 817 | 2,5 % | 2,0 % |
| Mesta | 468 | 115,0 % | 4 | 1 | 96 | 2 | 8410 | 5,5 % | 5,0 % |
| Salineros | 430 | 105,7 % | 5 | 1 | 560 | 8 | 2748 | 5,5 % | 3,0 % |
| Canteros | 384 | 94,3 % | 4 | 0 | 138 | 2 | 519 | 3,0 % | 3,5 % |
| Arrieros | 287 | 70,5 % | 6 | 1 | 78 | 1 | 144 | 0,0 % | 1,5 % |
| Mercaderes | 158 | 38,8 % | 7 | 0 | 88 | 1 | 103 | 3,5 % | 0,0 % |
| Ferrones | 36 | 8,8 % | 8 | 0 | 28 | 1 | 194 | 23,0 % | 4,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 15 | 8 | 40 | 0 | 0 | 152 | 0 | 0 | 72 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 125 | 0 | 0 | 102 |
| Ferrones | 5 | 8 | 0 | 0 | 0 | 53 | 0 | 0 | 15 |
| Hortelanos | 180 | 80 | 160 | 0 | 0 | 197 | 0 | 0 | 235 |
| Mercaderes | 17 | 8 | 0 | 0 | 0 | 115 | 0 | 0 | 25 |
| Mesta | 19 | 16 | 40 | 0 | 0 | 45 | 257 | 0 | 115 |
| Monjes | 205 | 93 | 80 | 0 | 0 | 157 | 0 | 0 | 168 |
| Salineros | 111 | 64 | 40 | 0 | 0 | 144 | 0 | 0 | 122 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1212 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 192 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 54 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 29 turnos) |
| Canteros | 1212 | termina obras mayores | sí |  |
| Ferrones | 1212 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1212 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1212 | funda pueblas | sí |  |
| Salineros | 1212 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-2 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1212-2 | termina obras mayores | sí |  |
| Ferrones | 1212-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 136 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 56 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 47 turnos) |
| Mesta | 1212-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1212-2 | funda pueblas | sí |  |
| Salineros | 1212-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 116 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 69 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 39 turnos) |
| Canteros | 1212-3 | termina obras mayores | sí |  |
| Ferrones | 1212-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 33 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 123 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 47 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 37 turnos) |
| Mesta | 1212-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1212-3 | funda pueblas | sí |  |
| Salineros | 1212-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 4354 | 775 | 0 | 0 | 0 | 8 | 0 | 0 | 479 | 2026 | 60 | 110 | 13 | 13 | 0 | 0 |
| Canteros | 0 | 0 | 0 | 5371 | 65 | 540 | 0 | 0 | 5 | 1 | 0 | 137 | 1318 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 1386 | 331 | 0 | 0 | 1 | 4 | 0 | 0 | 55 | 657 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 29517 | 808 | 0 | 0 | 0 | 43 | 1 | 0 | 185 | 1886 | 0 | 0 | 0 | 0 | 0 | 9 |
| Mercaderes | 0 | 0 | 0 | 4206 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 188 | 1259 | 26 | 71 | 5 | 5 | 0 | 0 |
| Mesta | 319 | 10 | 0 | 2810 | 1197 | 0 | 0 | 0 | 6 | 0 | 0 | 59 | 1562 | 0 | 0 | 0 | 0 | 0 | 2 |
| Monjes | 0 | 0 | 0 | 28488 | 3617 | 0 | 0 | 0 | 53 | 1 | 0 | 188 | 1758 | 0 | 0 | 0 | 0 | 6 | 5 |
| Salineros | 0 | 0 | 0 | 13438 | 98 | 0 | 2056 | 0 | 20 | 0 | 0 | 168 | 1866 | 0 | 0 | 0 | 0 | 0 | 9 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1212 | T100 | arrieros | 107 | 107 | 0,0 % | igual turno a turno |
| 1212 | T100 | canteros | 321 | 321 | 0,0 % | igual turno a turno |
| 1212 | T100 | ferrones | -51 | -51 | 0,0 % | igual turno a turno |
| 1212 | T100 | hortelanos | 425 | 425 | 0,0 % | igual turno a turno |
| 1212 | T100 | mercaderes | 60 | 60 | 0,0 % | igual turno a turno |
| 1212 | T100 | mesta | 141 | 141 | 0,0 % | igual turno a turno |
| 1212 | T100 | monjes | 307 | 307 | 0,0 % | igual turno a turno |
| 1212 | T100 | salineros | 252 | 252 | 0,0 % | igual turno a turno |
| 1212 | T200 | arrieros | 147 | 147 | 0,0 % | igual turno a turno |
| 1212 | T200 | canteros | 458 | 458 | 0,0 % | igual turno a turno |
| 1212 | T200 | ferrones | -55 | -55 | 0,0 % | igual turno a turno |
| 1212 | T200 | hortelanos | 830 | 830 | 0,0 % | igual turno a turno |
| 1212 | T200 | mercaderes | 152 | 152 | 0,0 % | igual turno a turno |
| 1212 | T200 | mesta | 295 | 295 | 0,0 % | igual turno a turno |
| 1212 | T200 | monjes | 603 | 603 | 0,0 % | igual turno a turno |
| 1212 | T200 | salineros | 292 | 292 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | arrieros | 128 | 128 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | canteros | 311 | 311 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | ferrones | -51 | -51 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | hortelanos | 429 | 429 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | mercaderes | 106 | 106 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | mesta | 156 | 156 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | monjes | 252 | 252 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | salineros | 322 | 322 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | arrieros | 361 | 361 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | canteros | 499 | 499 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | ferrones | -55 | -55 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | hortelanos | 723 | 723 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | mercaderes | 138 | 138 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | mesta | 416 | 416 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | monjes | 519 | 519 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | salineros | 428 | 428 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | arrieros | 146 | 146 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | canteros | 321 | 321 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | ferrones | 59 | 59 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | hortelanos | 296 | 296 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mercaderes | 66 | 66 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mesta | 178 | 178 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | monjes | 479 | 479 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | salineros | 291 | 291 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | arrieros | 194 | 194 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | canteros | 405 | 405 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | ferrones | 28 | 28 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | hortelanos | 681 | 681 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mercaderes | 113 | 113 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mesta | 362 | 362 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | monjes | 761 | 761 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | salineros | 511 | 511 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 287 | 234 | 18,5 % | mercado 1041, carga 930, ruta 214 |
| Canteros | 384 | 454 | 15,4 % | mercado 794, carga 564, ruta 84 |
| Ferrones | 36 | -27 | 175,0 % | mercado 721, carga 503, ruta 30 |
| Hortelanos | 853 | 745 | 12,7 % | mercado 1214, carga 647, ruta 164 |
| Mercaderes | 158 | 134 | 15,2 % | carga 804, mercado 782, ruta 86 |
| Mesta | 468 | 358 | 23,5 % | mercado 1502, carga 489, ruta 223 |
| Monjes | 700 | 628 | 10,3 % | mercado 1148, carga 636, ruta 161 |
| Salineros | 430 | 410 | 4,7 % | mercado 1288, carga 601, ruta 124 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1212 | Arrieros | **no** | T180 | T180 | 3 |
| 1212 | Canteros | **no** | T107 | T107 | 4 |
| 1212 | Ferrones | **no** | **no** | **no** | 1 |
| 1212 | Hortelanos | T56 | T105 | T105 | 6 |
| 1212 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212 | Mesta | **no** | T190 | T190 | 5 |
| 1212 | Monjes | T54 | T143 | T143 | 5 |
| 1212 | Salineros | T109 | **no** | **no** | 4 |
| 1212-2 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-2 | Canteros | **no** | T69 | T69 | 4 |
| 1212-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1212-2 | Hortelanos | T62 | **no** | **no** | 4 |
| 1212-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-2 | Mesta | **no** | **no** | **no** | 2 |
| 1212-2 | Monjes | T54 | T137 | T137 | 5 |
| 1212-2 | Salineros | T65 | **no** | **no** | 4 |
| 1212-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1212-3 | Canteros | **no** | T108 | T108 | 4 |
| 1212-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1212-3 | Hortelanos | T67 | T98 | T98 | 5 |
| 1212-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-3 | Mesta | T79 | **no** | **no** | 5 |
| 1212-3 | Monjes | T43 | **no** | **no** | 4 |
| 1212-3 | Salineros | T65 | T198 | T198 | 5 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1212 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1037 | 1190 |
| 1212 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1281 |
| 1212 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 374 |
| 1212 | Hortelanos | 0 | 0 | 0 | 0 | 69 | 561 | 938 |
| 1212 | Mercaderes | 14 | 99 | 993 | 532 | 0 | 0 | 1078 |
| 1212 | Mesta | 0 | 0 | 0 | 0 | 0 | 919 | 646 |
| 1212 | Monjes | 0 | 0 | 0 | 0 | 103 | 500 | 723 |
| 1212 | Salineros | 0 | 0 | 0 | 0 | 50 | 643 | 1072 |
| 1212-2 | Arrieros | 40 | 199 | 2249 | 1571 | 0 | 661 | 1076 |
| 1212-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 102 | 1044 |
| 1212-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 376 |
| 1212-2 | Hortelanos | 0 | 0 | 0 | 0 | 115 | 264 | 905 |
| 1212-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1195 |
| 1212-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 713 | 813 |
| 1212-2 | Monjes | 0 | 0 | 0 | 0 | 84 | 557 | 771 |
| 1212-2 | Salineros | 0 | 0 | 0 | 0 | 38 | 839 | 912 |
| 1212-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 394 | 1287 |
| 1212-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1246 |
| 1212-3 | Ferrones | 0 | 0 | 0 | 0 | 111 | 57 | 488 |
| 1212-3 | Hortelanos | 0 | 0 | 0 | 0 | 9 | 809 | 1028 |
| 1212-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1276 |
| 1212-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 1001 | 588 |
| 1212-3 | Monjes | 0 | 0 | 0 | 0 | 87 | 511 | 763 |
| 1212-3 | Salineros | 0 | 0 | 0 | 0 | 39 | 545 | 1053 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 957 | 975 | 970 | 0 | 159 |
| Canteros | 622 | 640 | 639 | 0 | 77 |
| Ferrones | 528 | 543 | 543 | 0 | 31 |
| Hortelanos | 965 | 983 | 974 | 4 | 205 |
| Mercaderes | 713 | 731 | 728 | 0 | 69 |
| Mesta | 943 | 961 | 958 | 1 | 56 |
| Monjes | 907 | 925 | 921 | 3 | 181 |
| Salineros | 932 | 950 | 937 | 7 | 153 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 36
- construir: comarca-ajena: 5
- incorporar: comarca-con-duenyo: 5

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 100 | 126 | 147 | 163 | 177 | 187 | 201 | 209 | 276 | 287 |
| Canteros | 64 | 80 | 96 | 179 | 187 | 305 | 321 | 329 | 354 | 384 |
| Ferrones | 29 | 13 | 4 | -5 | 0 | 14 | 20 | 25 | 30 | 36 |
| Hortelanos | 113 | 175 | 265 | 329 | 439 | 547 | 597 | 638 | 715 | 853 |
| Mercaderes | 58 | 67 | 83 | 102 | 110 | 126 | 134 | 139 | 150 | 158 |
| Mesta | 39 | 54 | 131 | 171 | 223 | 254 | 311 | 363 | 415 | 468 |
| Monjes | 72 | 126 | 281 | 342 | 377 | 440 | 554 | 647 | 660 | 700 |
| Salineros | 104 | 132 | 177 | 268 | 215 | 247 | 294 | 341 | 352 | 430 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1212`: `61bac85a89dfc3a990fc192bfeafbde1df2c1cb23777c39457b30928ec0151d3`
- semilla `1212-2`: `987daa37acdc946fd90ee4a4fb45b7555b02eb728db056d4dc7a171f7d342117`
- semilla `1212-3`: `cbeb80c3f469dc425808178e1197e78c1a6de02f80c8e22bf95a027c6b116e06`
