# Banco de pruebas · semilla 1085

200 turnos · 3 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 200 turnos, **Monjes** va en cabeza con 860 de prestigio (301,8 % de la mediana) y **Mesta** cierra la clasificación con 57 (20,0 % de la mediana). La mediana de prestigio es 285. 3 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `bfcf751b6b84f17bb104ff27b853a18f2f561707` |
| Etiqueta del informe | E-recargo150-1085 |
| Cambios experimentales | mercado.recargoPorJornadaMil=150 (ensayo, revertido) |
| Versiones | banco 0.1.0 · métricas 4 · robots 8 · reglas 1 |
| Semillas | 1085, 1085-2, 1085-3 |
| Campaña | 200 turnos · 3 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `ab8c3cc711a45268bab8d87df3fe39d2df23f7e722abf25849c0141ce57f6a57` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 45 filas sin cerrar de 157.

112 cumplen, 45 incumplen y 0 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1085 | arrieros | — | 81,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 258 sobre una mediana exacta de 316 |
| prestigio | casa y partida | 1085 | canteros | — | 160,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 506 sobre una mediana exacta de 316 |
| prestigio | casa y partida | 1085 | ferrones | — | 47,5 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 150 sobre una mediana exacta de 316 |
| prestigio | casa y partida | 1085 | hortelanos | — | 200,6 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 634 sobre una mediana exacta de 316 |
| prestigio | casa y partida | 1085 | mercaderes | — | 66,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 211 sobre una mediana exacta de 316 |
| prestigio | casa y partida | 1085 | mesta | — | 15,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 50 sobre una mediana exacta de 316 |
| prestigio | casa y partida | 1085 | monjes | — | 280,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 885 sobre una mediana exacta de 316 |
| prestigio | casa y partida | 1085 | salineros | — | 118,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🟢 cumple | prestigio 374 sobre una mediana exacta de 316 |
| actividad | casa y partida | 1085 | arrieros | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 5 de 200 turnos en que entró el robot |
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
| escasez | casa y partida | 1085 | arrieros | — | 9,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 19 de 200 turnos |
| escasez | casa y partida | 1085 | canteros | — | 9 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 18 de 200 turnos |
| escasez | casa y partida | 1085 | ferrones | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mercaderes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085 | mesta | — | 11 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 22 de 200 turnos |
| escasez | casa y partida | 1085 | monjes | — | 0,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 1 de 200 turnos |
| escasez | casa y partida | 1085 | salineros | — | 5,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 11 de 200 turnos |
| precios | partida | 1085 | — | — | 5 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | local-horta-de-valencia, sal: 5 turnos en el techo; la plaza cerrada rompe la racha |
| tierra | partida | 1085 | — | — | 44,7 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 93 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 158 · a mano 158 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 343 · a mano 343 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 321 · a mano 321 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 387 · a mano 387 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 79 · a mano 79 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 112 · a mano 112 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 325 · a mano 325 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 656 · a mano 656 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 123 · a mano 123 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 163 · a mano 163 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 43 · a mano 43 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 21 · a mano 21 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 456 · a mano 456 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 678 · a mano 678 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 132 · a mano 132 · el dominio se separa en T92 |
| ausencia | casa y partida | 1085 | salineros | T200 | 0,9 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 204 · a mano 206 · el dominio se separa en T92 |
| dominio | partida | 1085 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085 | — | — | 148 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🔴 incumple | 1 de 8 casas lo alcanzan; la primera en T148 |
| prestigio | casa y partida | 1085-2 | arrieros | — | 75,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 253 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | canteros | — | 126,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 426 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | ferrones | — | -7,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio -26 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | hortelanos | — | 196,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 664 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | mercaderes | — | 51,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 172 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | mesta | — | 21,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 71 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | monjes | — | 236,4 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 798 sobre una mediana exacta de 337,5 |
| prestigio | casa y partida | 1085-2 | salineros | — | 125,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 422 sobre una mediana exacta de 337,5 |
| actividad | casa y partida | 1085-2 | arrieros | — | 5,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 11 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | arrieros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | canteros | — | 1 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1085-2 | ferrones | — | 3,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 7 de 200 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1085-2 | ferrones | — | 2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 200 turnos sin ninguna orden que trabajara ni plan en marcha |
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
| escasez | casa y partida | 1085-2 | ferrones | — | 39 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 78 de 200 turnos |
| escasez | casa y partida | 1085-2 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | mercaderes | — | 3,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 7 de 200 turnos |
| escasez | casa y partida | 1085-2 | mesta | — | 8,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 17 de 200 turnos |
| escasez | casa y partida | 1085-2 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| escasez | casa y partida | 1085-2 | salineros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 200 turnos |
| precios | partida | 1085-2 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1085-2 | — | — | 58,6 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 146 de 249 comarcas sin tocar |
| ausencia | casa y partida | 1085-2 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 122 · a mano 122 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 187 · a mano 187 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 384 · a mano 384 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -59 · a mano -59 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -64 · a mano -64 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 376 · a mano 376 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 579 · a mano 579 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 96 · a mano 96 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 136 · a mano 136 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 57 · a mano 57 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 37 · a mano 37 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 309 · a mano 309 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 661 · a mano 661 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 259 · a mano 259 · el dominio se separa en T67 |
| ausencia | casa y partida | 1085-2 | salineros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 333 · a mano 333 · el dominio se separa en T67 |
| dominio | partida | 1085-2 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 4 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-2 | — | — | 97 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T97 |
| prestigio | casa y partida | 1085-3 | arrieros | — | 131,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 304 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | canteros | — | 168,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 388 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | ferrones | — | 68,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 157 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | hortelanos | — | 402,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 927 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | mercaderes | — | 41,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 95 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | mesta | — | 22,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 51 sobre una mediana exacta de 230,5 |
| prestigio | casa y partida | 1085-3 | monjes | — | 389,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 897 sobre una mediana exacta de 230,5 |
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
| escasez | casa y partida | 1085-3 | mercaderes | — | 15,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 31 de 200 turnos |
| escasez | casa y partida | 1085-3 | mesta | — | 10,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 21 de 200 turnos |
| escasez | casa y partida | 1085-3 | monjes | — | 3 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 6 de 200 turnos |
| escasez | casa y partida | 1085-3 | salineros | — | 11,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 23 de 200 turnos |
| precios | partida | 1085-3 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1085-3 | — | — | 43,8 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 91 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1085-3 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 106 · a mano 106 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | arrieros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 139 · a mano 139 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 330 · a mano 330 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | canteros | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 406 · a mano 406 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 34 · a mano 34 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | ferrones | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 14 · a mano 14 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | hortelanos | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 729 · a mano 729 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -39 · a mano -39 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mercaderes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -38 · a mano -38 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 42 · a mano 42 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | mesta | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 24 · a mano 24 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 350 · a mano 350 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | monjes | T200 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 772 · a mano 772 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | salineros | T100 | 16,6 | % de diferencia de prestigio con el mismo plan | < 5 % | 🔴 incumple | por bloques 108 · a mano 90 · el dominio se separa en T97 |
| ausencia | casa y partida | 1085-3 | salineros | T200 | 8,8 | % de diferencia de prestigio con el mismo plan | < 5 % | 🔴 incumple | por bloques 217 · a mano 238 · el dominio se separa en T97 |
| dominio | partida | 1085-3 | — | — | 43 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T43 |
| obra mayor | partida | 1085-3 | — | — | 92 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 3 de 8 casas lo alcanzan; la primera en T92 |
| ganadores | campaña | 1085 | — | — | 0 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | 🟢 cumple | ganan monjes, monjes, hortelanos |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Canteros: 154,4 %
  - Ferrones: 33,0 %
  - Hortelanos: 260,4 %
  - Mercaderes: 55,8 %
  - Mesta: 20,0 %
  - Monjes: 301,8 %
- 🟢 bien · Más de un 10 % de turnos sin proponer órdenes
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Ferrones (semilla 1085-2): 39,0 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 158 de 403 comarcas
  - región 01-iberico-alto-duero: 7
  - región 02-meseta-norte: 7
  - región 03-cantabrico: 18
  - región 04-galicia-minho: 10
  - región 05-central-extremadura: 31
  - región 06-meseta-sur: 13
  - región 07-ebro-pirineo: 11
  - región 08-levante: 4
  - región 09-andalucia: 46
  - región 10-portugal-sur: 11

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 860 | 301,8 % | 1 | 2 | 1518 | 17 | 1235 | 1,0 % | 2,5 % |
| Hortelanos | 742 | 260,4 % | 2 | 2 | 810 | 8 | 2808 | 0,0 % | 2,0 % |
| Canteros | 440 | 154,4 % | 3 | 1 | 135 | 2 | 410 | 3,0 % | 1,5 % |
| Salineros | 298 | 104,6 % | 5 | 1 | 355 | 4 | 5579 | 5,5 % | 4,0 % |
| Arrieros | 272 | 95,4 % | 5 | 0 | 168 | 3 | 154 | 7,0 % | 3,0 % |
| Mercaderes | 159 | 55,8 % | 6 | 0 | 82 | 1 | 122 | 6,5 % | 0,0 % |
| Ferrones | 94 | 33,0 % | 7 | 0 | 44 | 1 | 146 | 13,0 % | 4,0 % |
| Mesta | 57 | 20,0 % | 8 | 0 | 36 | 1 | 117 | 10,0 % | 5,0 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 33 | 21 | 40 | 0 | 0 | 133 | 0 | 0 | 72 |
| Canteros | 27 | 16 | 160 | 0 | 0 | 125 | 0 | 0 | 118 |
| Ferrones | 9 | 8 | 0 | 0 | 0 | 67 | 0 | 17 | 20 |
| Hortelanos | 162 | 64 | 160 | 0 | 0 | 171 | 0 | 0 | 185 |
| Mercaderes | 16 | 8 | 0 | 0 | 0 | 128 | 0 | 0 | 20 |
| Mesta | 7 | 8 | 0 | 0 | 0 | 37 | 0 | 0 | 25 |
| Monjes | 303 | 133 | 40 | 0 | 0 | 197 | 0 | 0 | 188 |
| Salineros | 70 | 29 | 0 | 0 | 0 | 128 | 0 | 0 | 108 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1085 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 169 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 132 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 48 turnos) |
| Canteros | 1085 | termina obras mayores | sí |  |
| Ferrones | 1085 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | sí |  |
| Mesta | 1085 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 178 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 22 turnos) |
| Monjes | 1085 | funda pueblas | sí |  |
| Salineros | 1085 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-2 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 125 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 92 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 57 turnos) |
| Canteros | 1085-2 | termina obras mayores | sí |  |
| Ferrones | 1085-2 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085-2 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-2 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 135 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 104 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 52 turnos) |
| Mesta | 1085-2 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 193 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 183 turnos); aún no hay lana esquilada que llevar a la feria (plan, 135 turnos) |
| Monjes | 1085-2 | funda pueblas | sí |  |
| Salineros | 1085-2 | saca sal o salazón y la vende | sí |  |
| Arrieros | 1085-3 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | no sabe precios recientes de dos plazas a su alcance (mapa, 189 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 68 turnos); ninguna comarca oída queda a la distancia que dejan recorrer el porte y el bastimento, ni siquiera malviviendo la vuelta (reglas, 31 turnos) |
| Canteros | 1085-3 | termina obras mayores | sí |  |
| Ferrones | 1085-3 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1085-3 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1085-3 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | no hay maravedís de sobra para comprar mercancía (recursos, 137 turnos); con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 113 turnos); no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 94 turnos) |
| Mesta | 1085-3 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 196 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 179 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 21 turnos) |
| Monjes | 1085-3 | funda pueblas | sí |  |
| Salineros | 1085-3 | saca sal o salazón y la vende | sí |  |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 6050 | 707 | 0 | 0 | 0 | 10 | 0 | 0 | 338 | 1670 | 0 | 7 | 0 | 0 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 5309 | 70 | 544 | 0 | 0 | 5 | 1 | 0 | 131 | 1170 | 0 | 0 | 0 | 0 | 0 | 1 |
| Ferrones | 0 | 0 | 0 | 2177 | 964 | 0 | 0 | 295 | 4 | 0 | 3 | 87 | 676 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hortelanos | 0 | 0 | 0 | 27524 | 1291 | 0 | 0 | 0 | 40 | 1 | 0 | 219 | 1801 | 0 | 0 | 0 | 0 | 0 | 7 |
| Mercaderes | 0 | 0 | 0 | 3715 | 195 | 0 | 0 | 0 | 7 | 0 | 0 | 124 | 1053 | 7 | 7 | 1 | 1 | 0 | 0 |
| Mesta | 2 | 0 | 0 | 1594 | 1064 | 0 | 0 | 0 | 2 | 0 | 0 | 42 | 1702 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 37402 | 3437 | 0 | 0 | 0 | 73 | 0 | 0 | 252 | 1826 | 0 | 0 | 0 | 0 | 10 | 6 |
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
| 1085 | T100 | monjes | 456 | 456 | 0,0 % | se separa en T92 |
| 1085 | T100 | salineros | 132 | 132 | 0,0 % | se separa en T92 |
| 1085 | T200 | arrieros | 343 | 343 | 0,0 % | se separa en T92 |
| 1085 | T200 | canteros | 387 | 387 | 0,0 % | se separa en T92 |
| 1085 | T200 | ferrones | 112 | 112 | 0,0 % | se separa en T92 |
| 1085 | T200 | hortelanos | 656 | 656 | 0,0 % | se separa en T92 |
| 1085 | T200 | mercaderes | 163 | 163 | 0,0 % | se separa en T92 |
| 1085 | T200 | mesta | 21 | 21 | 0,0 % | se separa en T92 |
| 1085 | T200 | monjes | 678 | 678 | 0,0 % | se separa en T92 |
| 1085 | T200 | salineros | 204 | 206 | 0,9 % | se separa en T92 |
| 1085-2 | T100 | arrieros | 122 | 122 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | canteros | 317 | 317 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | ferrones | -59 | -59 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | hortelanos | 376 | 376 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | mercaderes | 96 | 96 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | mesta | 57 | 57 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | monjes | 309 | 309 | 0,0 % | se separa en T67 |
| 1085-2 | T100 | salineros | 259 | 259 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | arrieros | 187 | 187 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | canteros | 384 | 384 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | ferrones | -64 | -64 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | hortelanos | 579 | 579 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | mercaderes | 136 | 136 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | mesta | 37 | 37 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | monjes | 661 | 661 | 0,0 % | se separa en T67 |
| 1085-2 | T200 | salineros | 333 | 333 | 0,0 % | se separa en T67 |
| 1085-3 | T100 | arrieros | 106 | 106 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | canteros | 330 | 330 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | ferrones | 34 | 34 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | hortelanos | 451 | 451 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | mercaderes | -39 | -39 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | mesta | 42 | 42 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | monjes | 350 | 350 | 0,0 % | se separa en T97 |
| 1085-3 | T100 | salineros | 108 | 90 | 16,6 % | se separa en T97 |
| 1085-3 | T200 | arrieros | 139 | 139 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | canteros | 406 | 406 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | ferrones | 14 | 14 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | hortelanos | 729 | 729 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | mercaderes | -38 | -38 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | mesta | 24 | 24 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | monjes | 772 | 772 | 0,0 % | se separa en T97 |
| 1085-3 | T200 | salineros | 217 | 238 | 8,8 % | se separa en T97 |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 272 | 223 | 18,0 % | carga 923, mercado 858, ruta 170 |
| Canteros | 440 | 392 | 10,9 % | mercado 759, carga 571, ruta 84 |
| Ferrones | 94 | 21 | 77,7 % | mercado 662, carga 508, ruta 36 |
| Hortelanos | 742 | 655 | 11,7 % | mercado 1226, carga 678, ruta 196 |
| Mercaderes | 159 | 87 | 45,3 % | carga 904, mercado 695, ruta 88 |
| Mesta | 57 | 27 | 52,6 % | mercado 1395, carga 471, formar-recua 15 |
| Monjes | 860 | 704 | 18,1 % | mercado 1111, carga 723, ruta 253 |
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
| 1085-2 | Hortelanos | T57 | T108 | T108 | 5 |
| 1085-2 | Mercaderes | **no** | **no** | **no** | 2 |
| 1085-2 | Mesta | **no** | **no** | **no** | 2 |
| 1085-2 | Monjes | T43 | T157 | T157 | 5 |
| 1085-2 | Salineros | T91 | **no** | **no** | 4 |
| 1085-3 | Arrieros | **no** | T170 | T170 | 3 |
| 1085-3 | Canteros | **no** | T112 | T112 | 4 |
| 1085-3 | Ferrones | **no** | **no** | **no** | 2 |
| 1085-3 | Hortelanos | T67 | T92 | T92 | 5 |
| 1085-3 | Mercaderes | **no** | **no** | **no** | 1 |
| 1085-3 | Mesta | **no** | **no** | **no** | 2 |
| 1085-3 | Monjes | T43 | **no** | **no** | 4 |
| 1085-3 | Salineros | T81 | **no** | **no** | 4 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1085 | Arrieros | 1 | 10 | 32 | 14 | 0 | 5 | 898 |
| 1085 | Canteros | 0 | 0 | 0 | 0 | 0 | 116 | 1033 |
| 1085 | Ferrones | 0 | 0 | 0 | 0 | 38 | 21 | 528 |
| 1085 | Hortelanos | 0 | 0 | 0 | 0 | 114 | 510 | 681 |
| 1085 | Mercaderes | 3 | 22 | 44 | -4 | 0 | 0 | 1184 |
| 1085 | Mesta | 0 | 0 | 0 | 0 | 0 | 855 | 843 |
| 1085 | Monjes | 0 | 0 | 0 | 0 | 82 | 623 | 672 |
| 1085 | Salineros | 0 | 0 | 0 | 0 | 63 | 700 | 1006 |
| 1085-2 | Arrieros | 0 | 0 | 0 | 0 | 0 | 714 | 1156 |
| 1085-2 | Canteros | 0 | 0 | 0 | 0 | 0 | 130 | 1252 |
| 1085-2 | Ferrones | 0 | 0 | 0 | 0 | 0 | 0 | 358 |
| 1085-2 | Hortelanos | 0 | 0 | 0 | 0 | 31 | 784 | 962 |
| 1085-2 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 1174 |
| 1085-2 | Mesta | 0 | 0 | 0 | 0 | 0 | 856 | 848 |
| 1085-2 | Monjes | 0 | 0 | 0 | 0 | 75 | 782 | 634 |
| 1085-2 | Salineros | 0 | 0 | 0 | 0 | 71 | 916 | 815 |
| 1085-3 | Arrieros | 0 | 0 | 0 | 0 | 0 | 1024 | 1173 |
| 1085-3 | Canteros | 0 | 0 | 0 | 0 | 0 | 132 | 832 |
| 1085-3 | Ferrones | 0 | 0 | 0 | 0 | 41 | 42 | 593 |
| 1085-3 | Hortelanos | 0 | 0 | 0 | 0 | 17 | 773 | 933 |
| 1085-3 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 741 |
| 1085-3 | Mesta | 0 | 0 | 0 | 0 | 0 | 817 | 876 |
| 1085-3 | Monjes | 0 | 0 | 0 | 0 | 66 | 870 | 674 |
| 1085-3 | Salineros | 0 | 0 | 0 | 0 | 34 | 663 | 1130 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 843 | 861 | 858 | 0 | 151 |
| Canteros | 610 | 628 | 627 | 0 | 80 |
| Ferrones | 519 | 535 | 535 | 0 | 40 |
| Hortelanos | 971 | 989 | 983 | 3 | 206 |
| Mercaderes | 716 | 734 | 731 | 0 | 76 |
| Mesta | 781 | 799 | 799 | 0 | 21 |
| Monjes | 1007 | 1025 | 1016 | 7 | 268 |
| Salineros | 944 | 962 | 958 | 2 | 112 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 27
- incorporar: comarca-con-duenyo: 9
- construir: comarca-ajena: 1

## Evolución del prestigio

| Casa | T20 | T40 | T60 | T80 | T100 | T120 | T140 | T160 | T180 | T200 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 69 | 87 | 104 | 117 | 178 | 181 | 186 | 194 | 261 | 272 |
| Canteros | 68 | 84 | 105 | 121 | 211 | 271 | 279 | 357 | 369 | 440 |
| Ferrones | 32 | 26 | 33 | 54 | 64 | 77 | 76 | 78 | 86 | 94 |
| Hortelanos | 157 | 189 | 276 | 340 | 444 | 523 | 552 | 607 | 636 | 742 |
| Mercaderes | 56 | 73 | 92 | 106 | 119 | 125 | 133 | 136 | 147 | 159 |
| Mesta | 38 | 38 | 64 | 73 | 76 | 74 | 66 | 54 | 54 | 57 |
| Monjes | 83 | 187 | 332 | 393 | 454 | 540 | 611 | 742 | 793 | 860 |
| Salineros | 99 | 124 | 153 | 193 | 278 | 314 | 347 | 368 | 349 | 298 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1085`: `9a887e079def68232d3169e028f5fe0081b05c70862a89df7a67663f692b27ba`
- semilla `1085-2`: `29f1637ac97cc8e525d81b34fa8a6c1670cacb04480893056ac07cce1443d386`
- semilla `1085-3`: `03a60be1e0fac7b5c5e50cded88489601e5e1ca8a08308a9449b9529364dcdf8`
