# Banco de pruebas · semilla 1212

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Hortelanos** va en cabeza con 813 de prestigio (198,8 % de la mediana) y **Ferrones** cierra la clasificación con 29 (7,1 % de la mediana). La mediana de prestigio es 409. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `6b0fdd9f89101a7ab87c37b728a3c044f5db2ce5` |
| Etiqueta del informe | E-seSostiene-1212 |
| Cambios experimentales | robots 9: crece donde la comarca nueva se sostiene sola |
| Versiones | banco 0.1.0 · métricas 4 · robots 9 · reglas 1 |
| Semillas | 1212, 1212-2, 1212-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `fea056aae1d16f6f1465a0628f25e179c432f8e84c7d4cf2ea9f43116ddcf113` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 39 filas sin cerrar de 157.

118 cumplen, 36 incumplen y 3 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1212 | arrieros | — | 90,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 354 sobre una mediana exacta de 390,5 |
| prestigio | casa y partida | 1212 | canteros | — | 109,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 427 sobre una mediana exacta de 390,5 |
| prestigio | casa y partida | 1212 | ferrones | — | -2,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -9 sobre una mediana exacta de 390,5 |
| prestigio | casa y partida | 1212 | hortelanos | — | 243,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 950 sobre una mediana exacta de 390,5 |
| prestigio | casa y partida | 1212 | mercaderes | — | 25,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 98 sobre una mediana exacta de 390,5 |
| prestigio | casa y partida | 1212 | mesta | — | 167,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 654 sobre una mediana exacta de 390,5 |
| prestigio | casa y partida | 1212 | monjes | — | 177,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 692 sobre una mediana exacta de 390,5 |
| prestigio | casa y partida | 1212 | salineros | — | 28,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 113 sobre una mediana exacta de 390,5 |
| actividad | casa y partida | 1212 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | hortelanos | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | mercaderes | — | 8,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 17 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1212 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | canteros | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1212 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1212 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212 | mercaderes | — | 26,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 53 de 200 turnos |
| escasez | casa y partida | 1212 | mesta | — | 7,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 15 de 200 turnos |
| escasez | casa y partida | 1212 | monjes | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1212 | salineros | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| precios | partida | 1212 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212 | — | — | 54,6 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 136 de 249 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1212 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 107 · a mano 107 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 122 · a mano 122 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 375 · a mano 375 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -51 · a mano -51 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -55 · a mano -55 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 383 · a mano 383 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 926 · a mano 926 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 61 · a mano 61 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 132 · a mano 132 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 167 · a mano 167 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 334 · a mano 334 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 307 · a mano 307 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 640 · a mano 640 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 257 · a mano 257 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 194 · a mano 194 · el dominio coincide turno a turno |
| dominio | partida | 1212 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 5 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212 | — | — | 110 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 5 de 8 casas lo alcanzan; la primera en T110 |
| prestigio | casa y partida | 1212-2 | arrieros | — | 35,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 152 sobre una mediana exacta de 430 |
| prestigio | casa y partida | 1212-2 | canteros | — | 97,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 420 sobre una mediana exacta de 430 |
| prestigio | casa y partida | 1212-2 | ferrones | — | -4,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -17 sobre una mediana exacta de 430 |
| prestigio | casa y partida | 1212-2 | hortelanos | — | 175,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 755 sobre una mediana exacta de 430 |
| prestigio | casa y partida | 1212-2 | mercaderes | — | 39,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 169 sobre una mediana exacta de 430 |
| prestigio | casa y partida | 1212-2 | mesta | — | 102,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 440 sobre una mediana exacta de 430 |
| prestigio | casa y partida | 1212-2 | monjes | — | 150,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 646 sobre una mediana exacta de 430 |
| prestigio | casa y partida | 1212-2 | salineros | — | 129,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 555 sobre una mediana exacta de 430 |
| actividad | casa y partida | 1212-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | canteros | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | mesta | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-2 | salineros | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1212-2 | arrieros | — | 9,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 19 de 200 turnos |
| escasez | casa y partida | 1212-2 | canteros | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1212-2 | ferrones | — | 34,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 69 de 200 turnos |
| escasez | casa y partida | 1212-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | mercaderes | — | 12 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 24 de 200 turnos |
| escasez | casa y partida | 1212-2 | mesta | — | 20,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 41 de 200 turnos |
| escasez | casa y partida | 1212-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1212-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1212-2 | — | — | 61,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 154 de 249 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1212-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 128 · a mano 128 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 359 · a mano 359 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 320 · a mano 320 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 432 · a mano 432 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -51 · a mano -51 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -55 · a mano -55 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 434 · a mano 434 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 709 · a mano 709 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 89 · a mano 89 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 193 · a mano 193 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 332 · a mano 332 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 252 · a mano 252 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 526 · a mano 526 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 322 · a mano 322 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 429 · a mano 429 · el dominio coincide turno a turno |
| dominio | partida | 1212-2 | — | — | 54 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 5 de 8 casas lo alcanzan; la primera en T54 |
| obra mayor | partida | 1212-2 | — | — | 70 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T70 |
| prestigio | casa y partida | 1212-3 | arrieros | — | 69,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 221 sobre una mediana exacta de 318 |
| prestigio | casa y partida | 1212-3 | canteros | — | 117,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 374 sobre una mediana exacta de 318 |
| prestigio | casa y partida | 1212-3 | ferrones | — | 35,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 112 sobre una mediana exacta de 318 |
| prestigio | casa y partida | 1212-3 | hortelanos | — | 231,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 735 sobre una mediana exacta de 318 |
| prestigio | casa y partida | 1212-3 | mercaderes | — | 48,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 155 sobre una mediana exacta de 318 |
| prestigio | casa y partida | 1212-3 | mesta | — | 82,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 262 sobre una mediana exacta de 318 |
| prestigio | casa y partida | 1212-3 | monjes | — | 243,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 774 sobre una mediana exacta de 318 |
| prestigio | casa y partida | 1212-3 | salineros | — | 177,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 565 sobre una mediana exacta de 318 |
| actividad | casa y partida | 1212-3 | arrieros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | ferrones | — | 28,5 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 57 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | ferrones | — | 2,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 5 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | hortelanos | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1212-3 | salineros | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1212-3 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1212-3 | arrieros | — | 6,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 13 de 200 turnos |
| escasez | casa y partida | 1212-3 | canteros | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1212-3 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1212-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1212-3 | mercaderes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1212-3 | mesta | — | 18 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 36 de 200 turnos |
| escasez | casa y partida | 1212-3 | monjes | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1212-3 | salineros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| precios | partida | 1212-3 | — | — | 3 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-tierra-de-valladolid, sal: 3 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1212-3 | — | — | 49,4 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 123 de 249 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1212-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 242 · a mano 242 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 139 · a mano 139 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 316 · a mano 316 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 384 · a mano 384 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 36 · a mano 36 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 15 · a mano 15 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 296 · a mano 296 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 701 · a mano 701 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 80 · a mano 80 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 121 · a mano 121 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 219 · a mano 219 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 411 · a mano 411 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 455 · a mano 455 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 703 · a mano 703 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 330 · a mano 330 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1212-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 293 · a mano 293 · el dominio coincide turno a turno |
| dominio | partida | 1212-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 6 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1212-3 | — | — | 98 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T98 |
| ganadores | campaña | 1212 | — | — | 0 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🟢 cumple | ganan hortelanos, hortelanos, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 59,2 %
  - Ferrones: 7,1 %
  - Hortelanos: 198,8 %
  - Mercaderes: 34,5 %
  - Monjes: 172,1 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Ferrones: 12,0 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1212): 34,5 % de los turnos
  - Mercaderes (semilla 1212): 26,5 % de los turnos
  - Ferrones (semilla 1212-2): 34,5 % de los turnos
  - Mesta (semilla 1212-2): 20,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 189 de 403 comarcas
  - región 01-iberico-alto-duero: 4
  - región 02-meseta-norte: 5
  - región 03-cantabrico: 16
  - región 04-galicia-minho: 27
  - región 05-central-extremadura: 29
  - región 06-meseta-sur: 9
  - región 07-ebro-pirineo: 28
  - región 08-levante: 15
  - región 09-andalucia: 47
  - región 10-portugal-sur: 9

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Hortelanos | 813 | 198,8 % | 1 | 2 | 795 | 9 | 2129 | 0,0 % | 2,0 % |
| Monjes | 704 | 172,1 % | 2 | 1 | 1020 | 12 | 786 | 2,0 % | 2,0 % |
| Mesta | 452 | 110,5 % | 4 | 1 | 153 | 3 | 8059 | 15,5 % | 3,5 % |
| Salineros | 411 | 100,5 % | 4 | 0 | 661 | 9 | 3931 | 3,5 % | 3,0 % |
| Canteros | 407 | 99,5 % | 4 | 1 | 136 | 2 | 500 | 2,5 % | 2,0 % |
| Arrieros | 242 | 59,2 % | 6 | 1 | 102 | 2 | 141 | 5,5 % | 1,5 % |
| Mercaderes | 141 | 34,5 % | 7 | 0 | 125 | 2 | 147 | 14,0 % | 3,0 % |
| Ferrones | 29 | 7,1 % | 8 | 0 | 28 | 1 | 73 | 27,5 % | 12,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 20 | 13 | 40 | 0 | 0 | 128 | 0 | 0 | 105 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 131 | 0 | 0 | 118 |
| Ferrones | 5 | 8 | 0 | 0 | 0 | 51 | 0 | 8 | 32 |
| Hortelanos | 158 | 75 | 160 | 0 | 0 | 205 | 0 | 0 | 215 |
| Mercaderes | 25 | 19 | 0 | 0 | 0 | 104 | 0 | 0 | 48 |
| Mesta | 30 | 24 | 40 | 0 | 0 | 40 | 273 | 0 | 142 |
| Monjes | 204 | 93 | 80 | 0 | 0 | 163 | 0 | 0 | 168 |
| Salineros | 132 | 75 | 0 | 0 | 0 | 147 | 0 | 0 | 92 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1212 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 192 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 59 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 30 turnos) |
| Canteros | 1212 | termina obras mayores | sí |  |
| Ferrones | 1212 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 139 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 82 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 81 turnos) |
| Mesta | 1212 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1212 | funda pueblas | sí |  |
| Salineros | 1212 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-2 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1212-2 | termina obras mayores | sí |  |
| Ferrones | 1212-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 69 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1212-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 117 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 98 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 65 turnos) |
| Mesta | 1212-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1212-2 | funda pueblas | sí |  |
| Salineros | 1212-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1212-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 129 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 100 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 55 turnos) |
| Canteros | 1212-3 | termina obras mayores | sí |  |
| Ferrones | 1212-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1212-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1212-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 123 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 48 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 37 turnos) |
| Mesta | 1212-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1212-3 | funda pueblas | sí |  |
| Salineros | 1212-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5449 | 775 | 0 | 0 | 0 | 15 | 0 | 0 | 413 | 1794 | 26 | 49 | 7 | 7 | 0 | 3 |
| Canteros | 0 | 0 | 0 | 5458 | 65 | 546 | 0 | 0 | 5 | 1 | 0 | 144 | 1321 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 2186 | 433 | 0 | 0 | 163 | 7 | 0 | 2 | 43 | 363 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 30161 | 1424 | 0 | 0 | 0 | 43 | 1 | 0 | 193 | 1903 | 0 | 0 | 0 | 0 | 0 | 8 |
| Mercaderes | 0 | 0 | 0 | 5208 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 103 | 1018 | 0 | 0 | 0 | 0 | 0 | 3 |
| Mesta | 332 | 11 | 0 | 4809 | 1233 | 0 | 0 | 0 | 14 | 0 | 0 | 45 | 1636 | 0 | 0 | 0 | 0 | 0 | 5 |
| Monjes | 0 | 0 | 0 | 29092 | 3532 | 0 | 0 | 0 | 53 | 1 | 0 | 199 | 1753 | 0 | 0 | 0 | 0 | 6 | 5 |
| Salineros | 0 | 0 | 0 | 18916 | 0 | 0 | 2073 | 0 | 31 | 0 | 0 | 159 | 1903 | 0 | 0 | 0 | 0 | 0 | 10 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1212 | T100 | arrieros | 107 | 107 | 0,0 % | igual turno a turno |
| 1212 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1212 | T100 | ferrones | -51 | -51 | 0,0 % | igual turno a turno |
| 1212 | T100 | hortelanos | 383 | 383 | 0,0 % | igual turno a turno |
| 1212 | T100 | mercaderes | 61 | 61 | 0,0 % | igual turno a turno |
| 1212 | T100 | mesta | 167 | 167 | 0,0 % | igual turno a turno |
| 1212 | T100 | monjes | 307 | 307 | 0,0 % | igual turno a turno |
| 1212 | T100 | salineros | 257 | 257 | 0,0 % | igual turno a turno |
| 1212 | T200 | arrieros | 122 | 122 | 0,0 % | igual turno a turno |
| 1212 | T200 | canteros | 375 | 375 | 0,0 % | igual turno a turno |
| 1212 | T200 | ferrones | -55 | -55 | 0,0 % | igual turno a turno |
| 1212 | T200 | hortelanos | 926 | 926 | 0,0 % | igual turno a turno |
| 1212 | T200 | mercaderes | 132 | 132 | 0,0 % | igual turno a turno |
| 1212 | T200 | mesta | 334 | 334 | 0,0 % | igual turno a turno |
| 1212 | T200 | monjes | 640 | 640 | 0,0 % | igual turno a turno |
| 1212 | T200 | salineros | 194 | 194 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | arrieros | 128 | 128 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | canteros | 320 | 320 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | ferrones | -51 | -51 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | hortelanos | 434 | 434 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | mercaderes | 89 | 89 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | mesta | 193 | 193 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | monjes | 252 | 252 | 0,0 % | igual turno a turno |
| 1212-2 | T100 | salineros | 322 | 322 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | arrieros | 359 | 359 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | canteros | 432 | 432 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | ferrones | -55 | -55 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | hortelanos | 709 | 709 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | mercaderes | 130 | 130 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | mesta | 332 | 332 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | monjes | 526 | 526 | 0,0 % | igual turno a turno |
| 1212-2 | T200 | salineros | 429 | 429 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | arrieros | 242 | 242 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | canteros | 316 | 316 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | ferrones | 36 | 36 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | hortelanos | 296 | 296 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mercaderes | 80 | 80 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | mesta | 219 | 219 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | monjes | 455 | 455 | 0,0 % | igual turno a turno |
| 1212-3 | T100 | salineros | 330 | 330 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | arrieros | 139 | 139 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | canteros | 384 | 384 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | ferrones | 15 | 15 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | hortelanos | 701 | 701 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mercaderes | 121 | 121 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | mesta | 411 | 411 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | monjes | 703 | 703 | 0,0 % | igual turno a turno |
| 1212-3 | T200 | salineros | 293 | 293 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 242 | 207 | 14,5 % | carga 947, mercado 927, ruta 208 |
| Canteros | 407 | 397 | 2,5 % | mercado 814, carga 574, ruta 88 |
| Ferrones | 29 | -32 | 190,6 % | mercado 464, carga 447, ruta 26 |
| Hortelanos | 813 | 779 | 4,2 % | mercado 1279, carga 635, ruta 152 |
| Mercaderes | 141 | 128 | 9,2 % | carga 808, mercado 708, ruta 68 |
| Mesta | 452 | 359 | 20,6 % | mercado 1553, carga 489, ruta 222 |
| Monjes | 704 | 623 | 11,5 % | mercado 1164, carga 654, ruta 178 |
| Salineros | 411 | 305 | 25,8 % | mercado 1411, carga 587, regalo 112 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1212 | Arrieros | **no** | T179 | T179 | 3 |
| 1212 | Canteros | **no** | T110 | T110 | 4 |
| 1212 | Ferrones | **no** | **no** | **no** | 1 |
| 1212 | Hortelanos | T56 | T200 | T200 | 5 |
| 1212 | Mercaderes | T86 | **no** | **no** | 4 |
| 1212 | Mesta | T191 | T188 | T188 | 6 |
| 1212 | Monjes | T54 | T142 | T142 | 5 |
| 1212 | Salineros | T91 | **no** | **no** | 4 |
| 1212-2 | Arrieros | T115 | **no** | **no** | 4 |
| 1212-2 | Canteros | **no** | T70 | T70 | 4 |
| 1212-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1212-2 | Hortelanos | T61 | T136 | T136 | 5 |
| 1212-2 | Mercaderes | **no** | **no** | **no** | 3 |
| 1212-2 | Mesta | T89 | **no** | **no** | 4 |
| 1212-2 | Monjes | T54 | T137 | T137 | 5 |
| 1212-2 | Salineros | T65 | **no** | **no** | 4 |
| 1212-3 | Arrieros | T67 | **no** | **no** | 4 |
| 1212-3 | Canteros | **no** | T106 | T106 | 4 |
| 1212-3 | Ferrones | T106 | **no** | **no** | 4 |
| 1212-3 | Hortelanos | T67 | T98 | T98 | 5 |
| 1212-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1212-3 | Mesta | T67 | **no** | **no** | 5 |
| 1212-3 | Monjes | T43 | **no** | **no** | 4 |
| 1212-3 | Salineros | T65 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1212 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1040 | 1199 |
| 1212 | Canteros | 0 | 0 | 0 | 0 | 0 | 136 | 1251 |
| 1212 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 374 |
| 1212 | Hortelanos | 0 | 0 | 0 | 0 | 144 | 292 | 761 |
| 1212 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 557 |
| 1212 | Mesta | 0 | 0 | 0 | 0 | 0 | 930 | 644 |
| 1212 | Monjes | 0 | 0 | 0 | 0 | 88 | 475 | 799 |
| 1212 | Salineros | 0 | 0 | 0 | 0 | 39 | 669 | 1110 |
| 1212-2 | Arrieros | 20 | 101 | 1390 | 904 | 0 | 430 | 1065 |
| 1212-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 106 | 1088 |
| 1212-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 376 |
| 1212-2 | Hortelanos | 0 | 0 | 0 | 0 | 97 | 429 | 873 |
| 1212-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1220 |
| 1212-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 763 | 960 |
| 1212-2 | Monjes | 0 | 0 | 0 | 0 | 86 | 574 | 738 |
| 1212-2 | Salineros | 0 | 0 | 0 | 0 | 73 | 854 | 809 |
| 1212-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 215 | 1207 |
| 1212-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1233 |
| 1212-3 | Ferrones | 0 | 0 | 0 | 0 | 0 | 9 | 323 |
| 1212-3 | Hortelanos | 0 | 0 | 0 | 0 | 11 | 811 | 1021 |
| 1212-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1265 |
| 1212-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 1034 | 570 |
| 1212-3 | Monjes | 0 | 0 | 0 | 0 | 101 | 550 | 663 |
| 1212-3 | Salineros | 0 | 0 | 0 | 0 | 67 | 620 | 966 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 910 | 928 | 923 | 1 | 158 |
| Canteros | 635 | 653 | 652 | 0 | 80 |
| Ferrones | 414 | 429 | 426 | 2 | 37 |
| Hortelanos | 985 | 1003 | 997 | 4 | 196 |
| Mercaderes | 676 | 692 | 687 | 1 | 72 |
| Mesta | 990 | 1007 | 1001 | 5 | 52 |
| Monjes | 925 | 943 | 938 | 2 | 192 |
| Salineros | 995 | 1013 | 996 | 7 | 146 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 48
- construir: comarca-ajena: 12
- incorporar: comarca-con-duenyo: 6

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 100 | 126 | 147 | 186 | 215 | 189 | 207 | 181 | 239 | 242 |
| Canteros | 66 | 82 | 98 | 184 | 192 | 331 | 345 | 353 | 378 | 407 |
| Ferrones | 26 | 9 | 2 | -2 | 14 | 53 | 65 | 53 | 36 | 29 |
| Hortelanos | 130 | 192 | 281 | 358 | 469 | 508 | 604 | 647 | 728 | 813 |
| Mercaderes | 53 | 62 | 78 | 117 | 148 | 133 | 151 | 125 | 131 | 141 |
| Mesta | 34 | 55 | 148 | 174 | 274 | 287 | 346 | 402 | 381 | 452 |
| Monjes | 77 | 126 | 281 | 343 | 376 | 445 | 555 | 640 | 666 | 704 |
| Salineros | 88 | 115 | 160 | 245 | 301 | 346 | 375 | 424 | 381 | 411 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1212`: `2ab6fe7b8d811be0dc8914241b468c71c2370a20a18fcac0eaef28c6307c0e32`
- semilla `1212-2`: `90b95f7157e8cab039233c6f14f43deae60b0370e27c31ed8a238b6a4e213dbf`
- semilla `1212-3`: `e07e2fb382d83c46d2f2b15a8bb6346764b006d80576a350764c6e1fa8f1e098`
