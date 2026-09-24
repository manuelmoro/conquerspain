# Banco de pruebas · semilla 1085

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 843 de prestigio (309,9 % de la mediana) y **Mesta** cierra la clasificación con 57 (21,0 % de la mediana). La mediana de prestigio es 272. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `bfcf751b6b84f17bb104ff27b853a18f2f561707` |
| Etiqueta del informe | E-recargo250-1085 |
| Cambios experimentales | mercado.recargoPorJornadaMil=250 (ensayo, revertido) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1085, 1085-2, 1085-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `ff7fc640405667b82ad7432f76a9e060c0708965467e5f7042f44ea95a1954ab` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 48 filas sin cerrar de 157.

109 cumplen, 48 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1085 | arrieros | — | 60,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 178 sobre una mediana exacta de 292,5 |
| prestigio | casa y partida | 1085 | canteros | — | 173,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 506 sobre una mediana exacta de 292,5 |
| prestigio | casa y partida | 1085 | ferrones | — | 51,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 150 sobre una mediana exacta de 292,5 |
| prestigio | casa y partida | 1085 | hortelanos | — | 215,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 630 sobre una mediana exacta de 292,5 |
| prestigio | casa y partida | 1085 | mercaderes | — | 72,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 211 sobre una mediana exacta de 292,5 |
| prestigio | casa y partida | 1085 | mesta | — | 17,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 50 sobre una mediana exacta de 292,5 |
| prestigio | casa y partida | 1085 | monjes | — | 289,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 846 sobre una mediana exacta de 292,5 |
| prestigio | casa y partida | 1085 | salineros | — | 127,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 374 sobre una mediana exacta de 292,5 |
| actividad | casa y partida | 1085 | arrieros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | arrieros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | hortelanos | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | mercaderes | — | 0,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | mercaderes | — | 0,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | monjes | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | monjes | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085 | salineros | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085 | arrieros | — | 11,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 23 de 200 turnos |
| escasez | casa y partida | 1085 | canteros | — | 9 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 18 de 200 turnos |
| escasez | casa y partida | 1085 | ferrones | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mesta | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1085 | monjes | — | 1,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 3 de 200 turnos |
| escasez | casa y partida | 1085 | salineros | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| precios | partida | 1085 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-bajo-aragon, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085 | — | — | 44,2 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 92 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 158 · a mano 158 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 320 · a mano 320 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 387 · a mano 387 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 79 · a mano 79 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 112 · a mano 112 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 325 · a mano 325 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 625 · a mano 625 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 171 · a mano 171 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 43 · a mano 43 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 21 · a mano 21 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 448 · a mano 448 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 659 · a mano 659 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 132 · a mano 132 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | salineros | T200 | 0,9 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 204 · a mano 206 · el dominio se separa en T92 |
| dominio | partida | 1085 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085 | — | — | 148 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 1 de 8 casas lo alcanzan; la primera en T148 |
| prestigio | casa y partida | 1085-2 | arrieros | — | 75,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 253 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | canteros | — | 126,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 426 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | ferrones | — | -1,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -4 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | hortelanos | — | 160,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 541 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | mercaderes | — | 45,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 155 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | mesta | — | 21,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 71 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | monjes | — | 240,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 813 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | salineros | — | 125,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 422 sobre una mediana exacta de 337,5 |
| actividad | casa y partida | 1085-2 | arrieros | — | 5,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 11 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | ferrones | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | ferrones | — | 1,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | mesta | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | monjes | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | monjes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | salineros | — | 3 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 6 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085-2 | arrieros | — | 12 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 24 de 200 turnos |
| escasez | casa y partida | 1085-2 | canteros | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1085-2 | ferrones | — | 36,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 73 de 200 turnos |
| escasez | casa y partida | 1085-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | mercaderes | — | 4 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 8 de 200 turnos |
| escasez | casa y partida | 1085-2 | mesta | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1085-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1085-2 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-campo-de-beja, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085-2 | — | — | 59,0 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 147 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1085-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 122 · a mano 122 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 187 · a mano 187 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 384 · a mano 384 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -60 · a mano -60 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -69 · a mano -69 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 418 · a mano 418 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 656 · a mano 656 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 95 · a mano 95 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 135 · a mano 135 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 57 · a mano 57 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 37 · a mano 37 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 274 · a mano 274 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 633 · a mano 633 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 259 · a mano 259 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 333 · a mano 333 · el dominio se separa en T67 |
| dominio | partida | 1085-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-2 | — | — | 97 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T97 |
| prestigio | casa y partida | 1085-3 | arrieros | — | 131,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 304 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | canteros | — | 190,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 438 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | ferrones | — | 68,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 157 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | hortelanos | — | 368,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 849 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | mercaderes | — | 39,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 92 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | mesta | — | 22,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 51 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | monjes | — | 377,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 871 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | salineros | — | 42,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 98 sobre una mediana exacta de 230,5 |
| actividad | casa y partida | 1085-3 | arrieros | — | 1,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | canteros | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | canteros | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | ferrones | — | 4 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 8 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | hortelanos | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | mercaderes | — | 0 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 0 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | mercaderes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | mesta | — | 5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | monjes | — | 2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | monjes | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-3 | salineros | — | 4,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-3 | salineros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1085-3 | arrieros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | ferrones | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1085-3 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-3 | mercaderes | — | 17 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 34 de 200 turnos |
| escasez | casa y partida | 1085-3 | mesta | — | 10,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 21 de 200 turnos |
| escasez | casa y partida | 1085-3 | monjes | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1085-3 | salineros | — | 11,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 23 de 200 turnos |
| precios | partida | 1085-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1085-3 | — | — | 44,7 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 93 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 106 · a mano 106 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 139 · a mano 139 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 330 · a mano 330 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 406 · a mano 406 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 34 · a mano 34 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 14 · a mano 14 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 729 · a mano 729 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -28 · a mano -28 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -32 · a mano -32 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 24 · a mano 24 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 345 · a mano 345 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 860 · a mano 860 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | salineros | T100 | 16,6 | % de diferencia de prestigio con el mismo plan | < 5 % | 🔴 incumple | por bloques 108 · a mano 90 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | salineros | T200 | 8,8 | % de diferencia de prestigio con el mismo plan | < 5 % | 🔴 incumple | por bloques 217 · a mano 238 · el dominio se separa en T97 |
| dominio | partida | 1085-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-3 | — | — | 112 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T112 |
| ganadores | campaña | 1085 | — | — | 3 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🔴 incumple | ganan monjes, monjes, monjes |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 168,0 %
  - Ferrones: 37,1 %
  - Hortelanos: 247,4 %
  - Mercaderes: 56,3 %
  - Mesta: 21,0 %
  - Monjes: 309,9 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1085-2): 36,5 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 157 de 403 comarcas
  - región 01-iberico-alto-duero: 7
  - región 02-meseta-norte: 6
  - región 03-cantabrico: 18
  - región 04-galicia-minho: 10
  - región 05-central-extremadura: 32
  - región 06-meseta-sur: 13
  - región 07-ebro-pirineo: 11
  - región 08-levante: 3
  - región 09-andalucia: 46
  - región 10-portugal-sur: 11

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 843 | 309,9 % | 1 | 2 | 1452 | 16 | 1550 | 1,5 % | 2,5 % |
| Hortelanos | 673 | 247,4 % | 2 | 1 | 780 | 8 | 2853 | 0,0 % | 2,0 % |
| Canteros | 457 | 168,0 % | 3 | 1 | 135 | 2 | 410 | 3,0 % | 1,5 % |
| Salineros | 298 | 109,6 % | 5 | 1 | 355 | 4 | 5579 | 5,5 % | 4,0 % |
| Arrieros | 245 | 90,1 % | 5 | 0 | 147 | 2 | 170 | 8,0 % | 3,0 % |
| Mercaderes | 153 | 56,3 % | 6 | 0 | 81 | 1 | 100 | 7,0 % | 0,0 % |
| Ferrones | 101 | 37,1 % | 7 | 0 | 45 | 1 | 173 | 12,5 % | 3,5 % |
| Mesta | 57 | 21,0 % | 8 | 0 | 36 | 1 | 117 | 10,0 % | 5,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 29 | 16 | 40 | 0 | 0 | 131 | 0 | 0 | 72 |
| Canteros | 27 | 16 | 160 | 0 | 0 | 125 | 0 | 0 | 135 |
| Ferrones | 9 | 8 | 0 | 0 | 0 | 72 | 0 | 17 | 20 |
| Hortelanos | 156 | 64 | 120 | 0 | 0 | 165 | 0 | 0 | 168 |
| Mercaderes | 16 | 8 | 0 | 0 | 0 | 123 | 0 | 0 | 20 |
| Mesta | 7 | 8 | 0 | 0 | 0 | 37 | 0 | 0 | 25 |
| Monjes | 290 | 128 | 40 | 0 | 0 | 200 | 0 | 0 | 188 |
| Salineros | 70 | 29 | 0 | 0 | 0 | 128 | 0 | 0 | 108 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1085 | lleva mercancía por los caminos y la vende fuera de su tierra | sí |  |
| Canteros | 1085 | termina obras mayores | sí |  |
| Ferrones | 1085 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 130 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 55 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 46 turnos) |
| Mesta | 1085 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 178 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 22 turnos) |
| Monjes | 1085 | funda pueblas | sí |  |
| Salineros | 1085 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 125 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 92 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 57 turnos) |
| Canteros | 1085-2 | termina obras mayores | sí |  |
| Ferrones | 1085-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | **no** | hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 73 turnos); no tiene con qué levantar un edificio esencial de su vía (recursos, 12 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 4 turnos) |
| Hortelanos | 1085-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1085-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 193 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 183 turnos); aún no hay lana esquilada que llevar a la feria (plan, 135 turnos) |
| Monjes | 1085-2 | funda pueblas | sí |  |
| Salineros | 1085-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 189 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 68 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 31 turnos) |
| Canteros | 1085-3 | termina obras mayores | sí |  |
| Ferrones | 1085-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 138 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 113 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 94 turnos) |
| Mesta | 1085-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 179 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 21 turnos) |
| Monjes | 1085-3 | funda pueblas | sí |  |
| Salineros | 1085-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5750 | 707 | 0 | 0 | 0 | 9 | 0 | 0 | 348 | 1716 | 11 | 57 | 3 | 3 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 5309 | 70 | 544 | 0 | 0 | 5 | 1 | 0 | 131 | 1170 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 2130 | 938 | 0 | 0 | 286 | 4 | 0 | 3 | 93 | 680 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 30237 | 1387 | 0 | 0 | 0 | 39 | 1 | 0 | 220 | 1760 | 0 | 0 | 0 | 0 | 0 | 7 |
| Mercaderes | 0 | 0 | 0 | 3709 | 195 | 0 | 0 | 0 | 6 | 0 | 0 | 204 | 1212 | 17 | 155 | 12 | 10 | 0 | 0 |
| Mesta | 2 | 0 | 0 | 1594 | 1064 | 0 | 0 | 0 | 2 | 0 | 0 | 42 | 1702 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 36840 | 3400 | 0 | 0 | 0 | 75 | 0 | 0 | 259 | 1748 | 0 | 0 | 0 | 0 | 10 | 5 |
| Salineros | 0 | 0 | 0 | 13412 | 0 | 0 | 2264 | 0 | 25 | 0 | 0 | 134 | 1889 | 0 | 0 | 0 | 0 | 0 | 4 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1085 | T100 | arrieros | 158 | 158 | 0,0 % | se separa en T92 |
| 1085 | T100 | canteros | 321 | 321 | 0,0 % | se separa en T92 |
| 1085 | T100 | ferrones | 79 | 79 | 0,0 % | se separa en T92 |
| 1085 | T100 | hortelanos | 325 | 325 | 0,0 % | se separa en T92 |
| 1085 | T100 | mercaderes | 123 | 123 | 0,0 % | se separa en T92 |
| 1085 | T100 | mesta | 43 | 43 | 0,0 % | se separa en T92 |
| 1085 | T100 | monjes | 448 | 448 | 0,0 % | se separa en T92 |
| 1085 | T100 | salineros | 132 | 132 | 0,0 % | se separa en T92 |
| 1085 | T200 | arrieros | 320 | 320 | 0,0 % | se separa en T92 |
| 1085 | T200 | canteros | 387 | 387 | 0,0 % | se separa en T92 |
| 1085 | T200 | ferrones | 112 | 112 | 0,0 % | se separa en T92 |
| 1085 | T200 | hortelanos | 625 | 625 | 0,0 % | se separa en T92 |
| 1085 | T200 | mercaderes | 171 | 171 | 0,0 % | se separa en T92 |
| 1085 | T200 | mesta | 21 | 21 | 0,0 % | se separa en T92 |
| 1085 | T200 | monjes | 659 | 659 | 0,0 % | se separa en T92 |
| 1085 | T200 | salineros | 204 | 206 | 0,9 % | se separa en T92 |
| 1085-2 | T100 | arrieros | 122 | 122 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | ferrones | -60 | -60 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | hortelanos | 418 | 418 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | mercaderes | 95 | 95 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | mesta | 57 | 57 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | monjes | 274 | 274 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | salineros | 259 | 259 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | arrieros | 187 | 187 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | canteros | 384 | 384 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | ferrones | -69 | -69 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | hortelanos | 656 | 656 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | mercaderes | 135 | 135 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | mesta | 37 | 37 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | monjes | 633 | 633 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | salineros | 333 | 333 | 0,0 % | se separa en T67 |
| 1085-3 | T100 | arrieros | 106 | 106 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | canteros | 330 | 330 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | ferrones | 34 | 34 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | hortelanos | 451 | 451 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | mercaderes | -28 | -28 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | mesta | 42 | 42 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | monjes | 345 | 345 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | salineros | 108 | 90 | 16,6 % | se separa en T97 |
| 1085-3 | T200 | arrieros | 139 | 139 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | canteros | 406 | 406 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | ferrones | 14 | 14 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | hortelanos | 729 | 729 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | mercaderes | -32 | -32 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | mesta | 24 | 24 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | monjes | 860 | 860 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | salineros | 217 | 238 | 8,8 % | se separa en T97 |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 245 | 215 | 12,2 % | carga 891, mercado 856, ruta 170 |
| Canteros | 457 | 392 | 14,2 % | mercado 759, carga 571, ruta 84 |
| Ferrones | 101 | 19 | 81,2 % | mercado 677, carga 513, ruta 40 |
| Hortelanos | 673 | 670 | 0,4 % | mercado 1252, carga 672, ruta 190 |
| Mercaderes | 153 | 91 | 40,5 % | carga 883, mercado 692, ruta 113 |
| Mesta | 57 | 27 | 52,6 % | mercado 1395, carga 471, formar-recua 15 |
| Monjes | 843 | 717 | 14,9 % | mercado 1188, carga 728, ruta 258 |
| Salineros | 298 | 251 | 15,8 % | mercado 1426, carga 560, regalo 86 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1085 | Arrieros | T93 | **no** | **no** | 4 |
| 1085 | Canteros | **no** | T148 | T148 | 4 |
| 1085 | Ferrones | **no** | **no** | **no** | 2 |
| 1085 | Hortelanos | T54 | **no** | **no** | 4 |
| 1085 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085 | Mesta | **no** | **no** | **no** | 2 |
| 1085 | Monjes | T43 | **no** | **no** | 4 |
| 1085 | Salineros | T83 | **no** | **no** | 4 |
| 1085-2 | Arrieros | T88 | **no** | **no** | 4 |
| 1085-2 | Canteros | **no** | T97 | T97 | 4 |
| 1085-2 | Ferrones | **no** | **no** | **no** | 1 |
| 1085-2 | Hortelanos | T58 | T111 | T111 | 5 |
| 1085-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085-2 | Mesta | **no** | **no** | **no** | 2 |
| 1085-2 | Monjes | T43 | T157 | T157 | 5 |
| 1085-2 | Salineros | T91 | **no** | **no** | 4 |
| 1085-3 | Arrieros | **no** | T170 | T170 | 3 |
| 1085-3 | Canteros | **no** | T112 | T112 | 4 |
| 1085-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1085-3 | Hortelanos | T53 | T114 | T114 | 5 |
| 1085-3 | Mercaderes | **no** | **no** | **no** | 1 |
| 1085-3 | Mesta | **no** | **no** | **no** | 2 |
| 1085-3 | Monjes | T43 | **no** | **no** | 4 |
| 1085-3 | Salineros | T81 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1085 | Arrieros | 8 | 74 | 647 | 452 | 0 | 5 | 906 |
| 1085 | Canteros | 0 | 0 | 0 | 0 | 0 | 116 | 1033 |
| 1085 | Ferrones | 0 | 0 | 0 | 0 | 39 | 13 | 516 |
| 1085 | Hortelanos | 0 | 0 | 0 | 0 | 118 | 501 | 678 |
| 1085 | Mercaderes | 4 | 20 | -11 | -74 | 0 | 0 | 1163 |
| 1085 | Mesta | 0 | 0 | 0 | 0 | 0 | 855 | 843 |
| 1085 | Monjes | 0 | 0 | 0 | 0 | 80 | 716 | 609 |
| 1085 | Salineros | 0 | 0 | 0 | 0 | 63 | 700 | 1006 |
| 1085-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 714 | 1156 |
| 1085-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1252 |
| 1085-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 385 |
| 1085-2 | Hortelanos | 0 | 0 | 0 | 0 | 33 | 770 | 859 |
| 1085-2 | Mercaderes | 31 | 197 | 1450 | 810 | 0 | 0 | 1276 |
| 1085-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 856 | 848 |
| 1085-2 | Monjes | 0 | 0 | 0 | 0 | 74 | 840 | 614 |
| 1085-2 | Salineros | 0 | 0 | 0 | 0 | 71 | 916 | 815 |
| 1085-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1024 | 1173 |
| 1085-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 832 |
| 1085-3 | Ferrones | 0 | 0 | 0 | 0 | 41 | 42 | 593 |
| 1085-3 | Hortelanos | 0 | 0 | 0 | 0 | 19 | 768 | 890 |
| 1085-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 748 |
| 1085-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 817 | 876 |
| 1085-3 | Monjes | 0 | 0 | 0 | 0 | 69 | 863 | 607 |
| 1085-3 | Salineros | 0 | 0 | 0 | 0 | 34 | 663 | 1130 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 831 | 849 | 847 | 1 | 142 |
| Canteros | 610 | 628 | 627 | 0 | 80 |
| Ferrones | 529 | 545 | 545 | 0 | 44 |
| Hortelanos | 985 | 1003 | 997 | 4 | 205 |
| Mercaderes | 717 | 735 | 732 | 0 | 73 |
| Mesta | 781 | 799 | 799 | 0 | 21 |
| Monjes | 1041 | 1059 | 1050 | 8 | 267 |
| Salineros | 944 | 962 | 958 | 2 | 112 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 30
- incorporar: comarca-con-duenyo: 11
- construir: comarca-ajena: 3

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 69 | 87 | 104 | 117 | 180 | 166 | 169 | 176 | 239 | 245 |
| Canteros | 68 | 84 | 105 | 121 | 211 | 288 | 296 | 374 | 385 | 457 |
| Ferrones | 32 | 26 | 33 | 51 | 61 | 77 | 82 | 85 | 93 | 101 |
| Hortelanos | 157 | 175 | 293 | 347 | 375 | 523 | 544 | 591 | 652 | 673 |
| Mercaderes | 56 | 67 | 94 | 109 | 119 | 125 | 130 | 130 | 141 | 153 |
| Mesta | 38 | 38 | 64 | 73 | 76 | 74 | 66 | 54 | 54 | 57 |
| Monjes | 83 | 187 | 332 | 395 | 456 | 542 | 601 | 730 | 783 | 843 |
| Salineros | 99 | 124 | 153 | 193 | 278 | 314 | 347 | 368 | 349 | 298 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1085`: `0d5f5ab0d86fa0cecf83f493061fb80d640edcc42ef1bdbf4f1a0a86ad0667fb`
- semilla `1085-2`: `0bcec51a7373b7e3db749f59ec03a17b907ff1d4b4acd028a6f0b7425ec014b9`
- semilla `1085-3`: `0298ee6f23555400a9b114a462a7a6c274179062287c162af6b1a3c9f45bd08e`
