# Banco de pruebas · semilla 1492

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Mesta** va en cabeza con 975 de prestigio (298,2 % de la mediana) y **Ferrones** cierra la clasificación con 128 (39,1 % de la mediana). La mediana de prestigio es 327. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `e018560be2e83bf93a8c749551dcb2a78384dc24` |
| Etiqueta del informe | E-pasoCanyada25-1492 |
| Cambios experimentales | ganaderia.pasoCanyadaMil=2500 (ensayo T-047) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1492, 1492-2, 1492-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `01333521e848aaca6ba1afa8ca1daf858662cbcd385ddadb4d07c997abeb150f` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 46 filas sin cerrar de 157.

111 cumplen, 43 incumplen y 3 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 71,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 240 sobre una mediana exacta de 335 |
| prestigio | casa y partida | 1492 | canteros | — | 128,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 430 sobre una mediana exacta de 335 |
| prestigio | casa y partida | 1492 | ferrones | — | 43,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 146 sobre una mediana exacta de 335 |
| prestigio | casa y partida | 1492 | hortelanos | — | 181,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 607 sobre una mediana exacta de 335 |
| prestigio | casa y partida | 1492 | mercaderes | — | 57,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 193 sobre una mediana exacta de 335 |
| prestigio | casa y partida | 1492 | mesta | — | 259,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 870 sobre una mediana exacta de 335 |
| prestigio | casa y partida | 1492 | monjes | — | 258,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 866 sobre una mediana exacta de 335 |
| prestigio | casa y partida | 1492 | salineros | — | -5,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -19 sobre una mediana exacta de 335 |
| actividad | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | ferrones | — | 9,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 19 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | ferrones | — | 4,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 9 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | salineros | — | 94 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 188 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492 | arrieros | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1492 | canteros | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1492 | mesta | — | 10 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 20 de 200 turnos |
| escasez | casa y partida | 1492 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492 | salineros | — | 39,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 79 de 200 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 45,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 94 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 168 · a mano 168 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 265 · a mano 265 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 384 · a mano 384 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 23 · a mano 23 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 18 · a mano 18 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 816 · a mano 816 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 112 · a mano 112 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 152 · a mano 152 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 227 · a mano 227 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 632 · a mano 632 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 331 · a mano 331 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 723 · a mano 723 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -12 · a mano -12 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 7 · a mano 7 · el dominio coincide turno a turno |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 2 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-2 | arrieros | — | 54,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 197 sobre una mediana exacta de 360 |
| prestigio | casa y partida | 1492-2 | canteros | — | 120,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 433 sobre una mediana exacta de 360 |
| prestigio | casa y partida | 1492-2 | ferrones | — | 23,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 83 sobre una mediana exacta de 360 |
| prestigio | casa y partida | 1492-2 | hortelanos | — | 202,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 729 sobre una mediana exacta de 360 |
| prestigio | casa y partida | 1492-2 | mercaderes | — | 50,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 182 sobre una mediana exacta de 360 |
| prestigio | casa y partida | 1492-2 | mesta | — | 326,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 1176 sobre una mediana exacta de 360 |
| prestigio | casa y partida | 1492-2 | monjes | — | 213,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 768 sobre una mediana exacta de 360 |
| prestigio | casa y partida | 1492-2 | salineros | — | 79,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 287 sobre una mediana exacta de 360 |
| actividad | casa y partida | 1492-2 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | ferrones | — | 10,5 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 21 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | ferrones | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-2 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-2 | arrieros | — | 5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 10 de 200 turnos |
| escasez | casa y partida | 1492-2 | canteros | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1492-2 | ferrones | — | 14 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 28 de 200 turnos |
| escasez | casa y partida | 1492-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-2 | mercaderes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-2 | mesta | — | 6,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 13 de 200 turnos |
| escasez | casa y partida | 1492-2 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-2 | salineros | — | 12 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 24 de 200 turnos |
| precios | partida | 1492-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492-2 | — | — | 38,0 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 79 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1492-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 162 · a mano 162 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 192 · a mano 192 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 399 · a mano 399 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 22 · a mano 22 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 456 · a mano 456 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 765 · a mano 765 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 82 · a mano 82 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 146 · a mano 146 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 278 · a mano 278 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 602 · a mano 602 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 392 · a mano 392 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 608 · a mano 608 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 279 · a mano 279 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 250 · a mano 250 · el dominio coincide turno a turno |
| dominio | partida | 1492-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1492-2 | — | — | 107 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T107 |
| prestigio | casa y partida | 1492-3 | arrieros | — | 69,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 229 sobre una mediana exacta de 330,5 |
| prestigio | casa y partida | 1492-3 | canteros | — | 130,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 432 sobre una mediana exacta de 330,5 |
| prestigio | casa y partida | 1492-3 | ferrones | — | 46,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 154 sobre una mediana exacta de 330,5 |
| prestigio | casa y partida | 1492-3 | hortelanos | — | 239,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 792 sobre una mediana exacta de 330,5 |
| prestigio | casa y partida | 1492-3 | mercaderes | — | 63,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 211 sobre una mediana exacta de 330,5 |
| prestigio | casa y partida | 1492-3 | mesta | — | 266,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 879 sobre una mediana exacta de 330,5 |
| prestigio | casa y partida | 1492-3 | monjes | — | 212,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 701 sobre una mediana exacta de 330,5 |
| prestigio | casa y partida | 1492-3 | salineros | — | 59,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 195 sobre una mediana exacta de 330,5 |
| actividad | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | monjes | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | monjes | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492-3 | salineros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492-3 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492-3 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | canteros | — | 1 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 200 turnos |
| escasez | casa y partida | 1492-3 | ferrones | — | 2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 200 turnos |
| escasez | casa y partida | 1492-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1492-3 | mesta | — | 15,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 31 de 200 turnos |
| escasez | casa y partida | 1492-3 | monjes | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 5 de 200 turnos |
| escasez | casa y partida | 1492-3 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1492-3 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-arlanza, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1492-3 | — | — | 38,5 | % de comarcas del mapa jugado que no toca nadie | < 5 % | ⚪ no evaluable | 80 de 208 comarcas sin tocar; hay pasos sin reconstruir, así que es una cota superior |
| ausencia | casa y partida | 1492-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 122 · a mano 122 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 202 · a mano 202 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 350 · a mano 350 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 54 · a mano 54 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 33 · a mano 33 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 405 · a mano 405 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 765 · a mano 765 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 154 · a mano 154 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 254 · a mano 254 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 606 · a mano 606 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 329 · a mano 329 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 686 · a mano 686 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 130 · a mano 130 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492-3 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 163 · a mano 163 · el dominio coincide turno a turno |
| dominio | partida | 1492-3 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492-3 | — | — | 109 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 2 de 8 casas lo alcanzan; la primera en T109 |
| ganadores | campaña | 1492 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan mesta, mesta, mesta |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 67,9 %
  - Canteros: 132,1 %
  - Ferrones: 39,1 %
  - Hortelanos: 216,8 %
  - Mercaderes: 59,6 %
  - Mesta: 298,2 %
  - Monjes: 237,9 %
  - Salineros: 47,1 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 33,5 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Salineros (semilla 1492): 39,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 245 de 403 comarcas
  - región 01-iberico-alto-duero: 5
  - región 02-meseta-norte: 31
  - región 03-cantabrico: 21
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 36
  - región 06-meseta-sur: 10
  - región 07-ebro-pirineo: 13
  - región 09-andalucia: 46
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mesta | 975 | 298,2 % | 1 | 1 | 81 | 3 | 8309 | 10,5 % | 5,0 % |
| Monjes | 778 | 237,9 % | 2 | 2 | 1236 | 13 | 1775 | 1,5 % | 2,0 % |
| Hortelanos | 709 | 216,8 % | 3 | 2 | 834 | 11 | 1279 | 0,0 % | 2,5 % |
| Canteros | 432 | 132,1 % | 4 | 1 | 137 | 2 | 549 | 1,0 % | 1,0 % |
| Arrieros | 222 | 67,9 % | 5 | 0 | 131 | 2 | 103 | 2,5 % | 2,0 % |
| Mercaderes | 195 | 59,6 % | 6 | 0 | 90 | 1 | 103 | 1,0 % | 0,5 % |
| Salineros | 154 | 47,1 % | 7 | 0 | 263 | 3 | 1175 | 17,0 % | 33,5 % |
| Ferrones | 128 | 39,1 % | 8 | 0 | 68 | 1 | 128 | 10,0 % | 8,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 26 | 13 | 0 | 0 | 0 | 149 | 0 | 0 | 38 |
| Canteros | 27 | 16 | 120 | 0 | 0 | 136 | 0 | 0 | 135 |
| Ferrones | 13 | 11 | 0 | 0 | 0 | 72 | 0 | 25 | 33 |
| Hortelanos | 166 | 88 | 80 | 0 | 0 | 187 | 0 | 0 | 188 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 147 | 0 | 0 | 25 |
| Mesta | 16 | 21 | 40 | 0 | 0 | 24 | 740 | 0 | 182 |
| Monjes | 247 | 107 | 40 | 0 | 0 | 200 | 0 | 0 | 188 |
| Salineros | 52 | 27 | 0 | 0 | 0 | 88 | 0 | 0 | 42 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 199 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 199 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 79 turnos) |
| Arrieros | 1492-2 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-2 | termina obras mayores | sí |  |
| Ferrones | 1492-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 141 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 42 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 33 turnos) |
| Mesta | 1492-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492-2 | funda pueblas | sí |  |
| Salineros | 1492-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1492-3 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1492-3 | termina obras mayores | sí |  |
| Ferrones | 1492-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 136 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 57 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 47 turnos) |
| Mesta | 1492-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | sí |  |
| Monjes | 1492-3 | funda pueblas | sí |  |
| Salineros | 1492-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 6006 | 240 | 0 | 0 | 0 | 8 | 0 | 0 | 654 | 1836 | 113 | 437 | 31 | 30 | 0 | 1 |
| Canteros | 0 | 0 | 0 | 5633 | 16 | 521 | 0 | 0 | 5 | 1 | 0 | 151 | 1355 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 3148 | 1004 | 0 | 0 | 483 | 5 | 0 | 4 | 97 | 571 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 26848 | 487 | 0 | 0 | 0 | 38 | 1 | 0 | 219 | 1861 | 0 | 0 | 0 | 0 | 0 | 10 |
| Mercaderes | 0 | 0 | 0 | 4408 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 148 | 1213 | 5 | 9 | 1 | 1 | 0 | 0 |
| Mesta | 370 | 18 | 0 | 1994 | 1050 | 0 | 0 | 0 | 7 | 0 | 0 | 22 | 1585 | 0 | 0 | 0 | 0 | 0 | 3 |
| Monjes | 0 | 0 | 0 | 35558 | 3971 | 0 | 0 | 0 | 61 | 0 | 0 | 221 | 1737 | 0 | 0 | 0 | 0 | 8 | 5 |
| Salineros | 0 | 0 | 0 | 6499 | 0 | 0 | 1395 | 0 | 14 | 0 | 0 | 85 | 1258 | 0 | 0 | 0 | 0 | 0 | 3 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 168 | 168 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | 23 | 23 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 451 | 451 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 112 | 112 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 227 | 227 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 331 | 331 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | -12 | -12 | 0,0 % | igual turno a turno |
| 1492 | T200 | arrieros | 265 | 265 | 0,0 % | igual turno a turno |
| 1492 | T200 | canteros | 384 | 384 | 0,0 % | igual turno a turno |
| 1492 | T200 | ferrones | 18 | 18 | 0,0 % | igual turno a turno |
| 1492 | T200 | hortelanos | 816 | 816 | 0,0 % | igual turno a turno |
| 1492 | T200 | mercaderes | 152 | 152 | 0,0 % | igual turno a turno |
| 1492 | T200 | mesta | 632 | 632 | 0,0 % | igual turno a turno |
| 1492 | T200 | monjes | 723 | 723 | 0,0 % | igual turno a turno |
| 1492 | T200 | salineros | 7 | 7 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | arrieros | 162 | 162 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | ferrones | 42 | 42 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | hortelanos | 456 | 456 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mercaderes | 82 | 82 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | mesta | 278 | 278 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | monjes | 392 | 392 | 0,0 % | igual turno a turno |
| 1492-2 | T100 | salineros | 279 | 279 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | arrieros | 192 | 192 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | canteros | 399 | 399 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | ferrones | 22 | 22 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | hortelanos | 765 | 765 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mercaderes | 146 | 146 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | mesta | 602 | 602 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | monjes | 608 | 608 | 0,0 % | igual turno a turno |
| 1492-2 | T200 | salineros | 250 | 250 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | arrieros | 122 | 122 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | ferrones | 54 | 54 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | hortelanos | 405 | 405 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mercaderes | 123 | 123 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | mesta | 254 | 254 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | monjes | 329 | 329 | 0,0 % | igual turno a turno |
| 1492-3 | T100 | salineros | 130 | 130 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | arrieros | 202 | 202 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | canteros | 350 | 350 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | ferrones | 33 | 33 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | hortelanos | 765 | 765 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mercaderes | 154 | 154 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | mesta | 606 | 606 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | monjes | 686 | 686 | 0,0 % | igual turno a turno |
| 1492-3 | T200 | salineros | 163 | 163 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 222 | 220 | 0,9 % | carga 924, mercado 733, ruta 264 |
| Canteros | 432 | 378 | 12,5 % | mercado 849, carga 581, ruta 92 |
| Ferrones | 128 | 24 | 81,3 % | mercado 555, carga 480, cometido 40 |
| Hortelanos | 709 | 782 | 9,3 % | mercado 1156, carga 667, ruta 190 |
| Mercaderes | 195 | 151 | 22,6 % | carga 802, mercado 790, ruta 106 |
| Mesta | 975 | 613 | 37,1 % | mercado 1571, carga 473, ruta 184 |
| Monjes | 778 | 672 | 13,6 % | mercado 1223, carga 689, ruta 211 |
| Salineros | 154 | 140 | 9,1 % | mercado 833, carga 370, ruta 52 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | **no** | **no** | **no** | 3 |
| 1492 | Canteros | **no** | T107 | T107 | 4 |
| 1492 | Ferrones | **no** | **no** | **no** | 3 |
| 1492 | Hortelanos | T68 | **no** | **no** | 4 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | **no** | **no** | **no** | 4 |
| 1492 | Monjes | T48 | T189 | T189 | 5 |
| 1492 | Salineros | **no** | **no** | **no** | 2 |
| 1492-2 | Arrieros | **no** | **no** | **no** | 3 |
| 1492-2 | Canteros | **no** | T107 | T107 | 4 |
| 1492-2 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-2 | Hortelanos | T59 | **no** | **no** | 4 |
| 1492-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-2 | Mesta | **no** | T188 | T188 | 6 |
| 1492-2 | Monjes | T43 | **no** | **no** | 4 |
| 1492-2 | Salineros | T75 | **no** | **no** | 4 |
| 1492-3 | Arrieros | **no** | **no** | **no** | 2 |
| 1492-3 | Canteros | **no** | T109 | T109 | 4 |
| 1492-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1492-3 | Hortelanos | T62 | T114 | T114 | 5 |
| 1492-3 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492-3 | Mesta | T90 | **no** | **no** | 5 |
| 1492-3 | Monjes | T48 | **no** | **no** | 4 |
| 1492-3 | Salineros | **no** | **no** | **no** | 2 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 29 | 265 | 2239 | 1199 | 0 | 5 | 1134 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1214 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 9 | 427 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 131 | 368 | 739 |
| 1492 | Mercaderes | 2 | 14 | 78 | 30 | 0 | 0 | 1144 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 907 | 673 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 101 | 635 | 667 |
| 1492-2 | Arrieros | 35 | 174 | 2334 | 1549 | 0 | 631 | 1316 |
| 1492-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 134 | 1208 |
| 1492-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 6 | 412 |
| 1492-2 | Hortelanos | 0 | 0 | 0 | 0 | 139 | 363 | 721 |
| 1492-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1261 |
| 1492-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 914 | 672 |
| 1492-2 | Monjes | 0 | 0 | 0 | 0 | 80 | 649 | 683 |
| 1492-2 | Salineros | 0 | 0 | 0 | 0 | 46 | 714 | 1067 |
| 1492-3 | Arrieros | 29 | 250 | 2061 | 1242 | 0 | 5 | 972 |
| 1492-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1234 |
| 1492-3 | Ferrones | 0 | 0 | 0 | 0 | 39 | 31 | 586 |
| 1492-3 | Hortelanos | 0 | 0 | 0 | 0 | 34 | 794 | 825 |
| 1492-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1188 |
| 1492-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 971 | 614 |
| 1492-3 | Monjes | 0 | 0 | 0 | 0 | 92 | 622 | 693 |
| 1492-3 | Salineros | 0 | 0 | 0 | 0 | 2 | 457 | 1397 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 855 | 873 | 873 | 0 | 156 |
| Canteros | 658 | 676 | 675 | 0 | 83 |
| Ferrones | 480 | 497 | 497 | 0 | 45 |
| Hortelanos | 952 | 970 | 955 | 4 | 222 |
| Mercaderes | 725 | 743 | 739 | 0 | 89 |
| Mesta | 948 | 966 | 961 | 4 | 37 |
| Monjes | 1018 | 1036 | 1029 | 5 | 244 |
| Salineros | 569 | 585 | 581 | 2 | 76 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 37
- construir: comarca-ajena: 3
- incorporar: comarca-con-duenyo: 3

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 65 | 97 | 118 | 143 | 157 | 189 | 203 | 203 | 213 | 222 |
| Canteros | 70 | 86 | 102 | 118 | 126 | 352 | 368 | 376 | 392 | 432 |
| Ferrones | 43 | 45 | 68 | 91 | 109 | 131 | 135 | 119 | 125 | 128 |
| Hortelanos | 187 | 200 | 280 | 380 | 409 | 507 | 543 | 595 | 635 | 709 |
| Mercaderes | 60 | 81 | 107 | 126 | 139 | 150 | 163 | 171 | 185 | 195 |
| Mesta | 38 | 58 | 207 | 243 | 358 | 454 | 602 | 729 | 883 | 975 |
| Monjes | 76 | 132 | 345 | 402 | 467 | 541 | 601 | 654 | 695 | 778 |
| Salineros | 60 | 70 | 74 | 110 | 114 | 138 | 150 | 141 | 145 | 154 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `10fd62420f201662afe62c1fd54351acd8f7874084dab261e8c04a89a4c27c63`
- semilla `1492-2`: `4a7755cb13b495e9fb45a6befb04ae5af663efed8543dcaee1246e5d25961fc6`
- semilla `1492-3`: `314b37f46fba295e3c5f2b1e42a55b7ff94965504d897ef5791bb6427b8e4da3`
