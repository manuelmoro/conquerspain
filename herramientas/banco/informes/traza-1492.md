# Banco de pruebas · semilla 1492

161 turnos · 1 partida(s) · casas: Mesta, Ferrones, Canteros, Mercaderes, Monjes, Salineros, Arrieros, Hortelanos · escenario **normal** (Las reglas del juego tal cual.) · mundo `v1`

## Resumen

Tras 161 turnos, **Monjes** va en cabeza con 646 de prestigio (295,0 % de la mediana) y **Salineros** cierra la clasificación con 7 (3,2 % de la mediana). La mediana de prestigio es 219. 4 de las 5 alertas de salud están en rojo.

## Procedencia

Con qué se sacó este informe. Dos informes con distinta procedencia no se comparan sin más (ficha T-048 §4.1).

| Dato | Valor |
| --- | --- |
| Revisión del código | `bfcf751b6b84f17bb104ff27b853a18f2f561707` |
| Etiqueta del informe | traza-1492 |
| Cambios experimentales | ninguno |
| Versiones | banco 0.1.0 · métricas 4 · robots 7 · reglas 1 |
| Semillas | 1492 |
| Campaña | 161 turnos · 1 repetición(es) · cadencias 1 y 6 · escenario normal |
| Mundo | v1, 403 comarcas, huella `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Tablas del juego | huella `d7f79e6ba4f07f4859c83228a86a8d1881c5567e83eff86511711ca4768c0d54` |
| Objetivos de T-047 | huella `534f0cfdeb4085a7dff3b0269fc93f80a8866c1c3d1ed3ea6385b5aa1bf7a989` |

## Evaluación de los criterios de T-047

El juicio, criterio a criterio y partida a partida. Un «no evaluable» impide cerrar el equilibrio igual que un «incumple».

Quedan 25 filas sin cerrar de 53.

28 cumplen, 16 incumplen y 9 no se pueden evaluar.
Ninguna fila depende de una tarea sin terminar.

| Criterio | Ámbito | Semilla | Casa | Turno | Observado | Unidad | Objetivo | Estado | Evidencia |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| prestigio | casa y partida | 1492 | arrieros | — | 122,8 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 269 sobre una mediana exacta de 219 |
| prestigio | casa y partida | 1492 | canteros | — | 171,7 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 376 sobre una mediana exacta de 219 |
| prestigio | casa y partida | 1492 | ferrones | — | 70,3 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 154 sobre una mediana exacta de 219 |
| prestigio | casa y partida | 1492 | hortelanos | — | 241,1 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 528 sobre una mediana exacta de 219 |
| prestigio | casa y partida | 1492 | mercaderes | — | 77,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 169 sobre una mediana exacta de 219 |
| prestigio | casa y partida | 1492 | mesta | — | 21,9 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 48 sobre una mediana exacta de 219 |
| prestigio | casa y partida | 1492 | monjes | — | 295,0 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 646 sobre una mediana exacta de 219 |
| prestigio | casa y partida | 1492 | salineros | — | 3,2 | % de la mediana | 80–120 % de la mediana (extremos incluidos) | 🔴 incumple | prestigio 7 sobre una mediana exacta de 219 |
| actividad | casa y partida | 1492 | arrieros | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 161 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | arrieros | — | 2,5 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 4 de 161 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | canteros | — | 1,2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 2 de 161 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | canteros | — | 1,2 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 2 de 161 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | ferrones | — | 6,2 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 10 de 161 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | ferrones | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 161 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | hortelanos | — | 2,5 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 4 de 161 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | hortelanos | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 161 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mercaderes | — | 0,6 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 1 de 161 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mercaderes | — | 0,6 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 1 de 161 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | mesta | — | 5,6 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 9 de 161 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | mesta | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 161 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | monjes | — | 1,9 | % de turnos sin proponer órdenes | < 10 % | 🟢 cumple | 3 de 161 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | monjes | — | 1,9 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 3 de 161 turnos sin ninguna orden que trabajara ni plan en marcha |
| actividad | casa y partida | 1492 | salineros | — | 93,8 | % de turnos sin proponer órdenes | < 10 % | 🔴 incumple | 151 de 161 turnos en que entró el robot |
| decisiones útiles | casa y partida | 1492 | salineros | — | 0 | % de turnos sin decisión útil | < 10 % | 🟢 cumple | 0 de 161 turnos sin ninguna orden que trabajara ni plan en marcha |
| escasez | casa y partida | 1492 | arrieros | — | 2,5 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 4 de 161 turnos |
| escasez | casa y partida | 1492 | canteros | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 161 turnos |
| escasez | casa y partida | 1492 | ferrones | — | 8,7 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 14 de 161 turnos |
| escasez | casa y partida | 1492 | hortelanos | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 161 turnos |
| escasez | casa y partida | 1492 | mercaderes | — | 1,2 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 2 de 161 turnos |
| escasez | casa y partida | 1492 | mesta | — | 9,9 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🟢 cumple | 16 de 161 turnos |
| escasez | casa y partida | 1492 | monjes | — | 0 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 0 de 161 turnos |
| escasez | casa y partida | 1492 | salineros | — | 34,8 | % de turnos con escasez | 2–15 % (extremos incluidos) | 🔴 incumple | 56 de 161 turnos |
| precios | partida | 1492 | — | — | 0 | turnos seguidos de mercado abierto en un extremo | < 10 turnos | 🟢 cumple | ningún precio se quedó más de un turno en un extremo |
| tierra | partida | 1492 | — | — | 52,4 | % de comarcas del mapa jugado que no toca nadie | < 5 % | 🔴 incumple | 109 de 208 comarcas sin tocar |
| ausencia | casa y partida | 1492 | arrieros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 168 · a mano 168 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | arrieros | T200 | — | % de diferencia de prestigio con el mismo plan | < 5 % | ⚪ no evaluable | falta la medida de esta casa en T200 (¿se jugó sin ausencia o con menos turnos?) |
| ausencia | casa y partida | 1492 | canteros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 317 · a mano 317 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | canteros | T200 | — | % de diferencia de prestigio con el mismo plan | < 5 % | ⚪ no evaluable | falta la medida de esta casa en T200 (¿se jugó sin ausencia o con menos turnos?) |
| ausencia | casa y partida | 1492 | ferrones | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 32 · a mano 32 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | ferrones | T200 | — | % de diferencia de prestigio con el mismo plan | < 5 % | ⚪ no evaluable | falta la medida de esta casa en T200 (¿se jugó sin ausencia o con menos turnos?) |
| ausencia | casa y partida | 1492 | hortelanos | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 451 · a mano 451 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | hortelanos | T200 | — | % de diferencia de prestigio con el mismo plan | < 5 % | ⚪ no evaluable | falta la medida de esta casa en T200 (¿se jugó sin ausencia o con menos turnos?) |
| ausencia | casa y partida | 1492 | mercaderes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 120 · a mano 120 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mercaderes | T200 | — | % de diferencia de prestigio con el mismo plan | < 5 % | ⚪ no evaluable | falta la medida de esta casa en T200 (¿se jugó sin ausencia o con menos turnos?) |
| ausencia | casa y partida | 1492 | mesta | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 24 · a mano 24 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | mesta | T200 | — | % de diferencia de prestigio con el mismo plan | < 5 % | ⚪ no evaluable | falta la medida de esta casa en T200 (¿se jugó sin ausencia o con menos turnos?) |
| ausencia | casa y partida | 1492 | monjes | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques 355 · a mano 355 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | monjes | T200 | — | % de diferencia de prestigio con el mismo plan | < 5 % | ⚪ no evaluable | falta la medida de esta casa en T200 (¿se jugó sin ausencia o con menos turnos?) |
| ausencia | casa y partida | 1492 | salineros | T100 | 0 | % de diferencia de prestigio con el mismo plan | < 5 % | 🟢 cumple | por bloques -12 · a mano -12 · el dominio coincide turno a turno |
| ausencia | casa y partida | 1492 | salineros | T200 | — | % de diferencia de prestigio con el mismo plan | < 5 % | ⚪ no evaluable | falta la medida de esta casa en T200 (¿se jugó sin ausencia o con menos turnos?) |
| dominio | partida | 1492 | — | — | 48 | turno del primer «Un pequeño dominio» | 60–100 turnos (extremos incluidos) | 🔴 incumple | 3 de 8 casas lo alcanzan; la primera en T48 |
| obra mayor | partida | 1492 | — | — | 111 | turno de la primera obra mayor terminada | 80–130 turnos (extremos incluidos) | 🟢 cumple | 1 de 8 casas lo alcanzan; la primera en T111 |
| ganadores | campaña | 1492 | — | — | 1 | repeticiones ganadas por la misma casa | ninguna casa gana las 3 | ⚪ no evaluable | hacen falta 3 partidas con un ganador cada una; hay 1 |

## Salud del juego (diagnóstico antiguo)

Las cinco alertas de T-046 §4.5. Son más flojas que los criterios de T-047 y **no sirven para cerrar el equilibrio**: se conservan porque señalan de un vistazo dónde mirar.

- 🔴 **EN ROJO** · Casas fuera de la horquilla 80 %–120 % de la mediana de prestigio
  - Arrieros: 122,8 %
  - Canteros: 171,7 %
  - Ferrones: 70,3 %
  - Hortelanos: 241,1 %
  - Mercaderes: 77,2 %
  - Mesta: 21,9 %
  - Monjes: 295,0 %
  - Salineros: 3,2 %
- 🔴 **EN ROJO** · Más de un 10 % de turnos sin proponer órdenes
  - Salineros: 93,8 %
- 🔴 **EN ROJO** · Partidas con escasez crónica (más del 20 % de los turnos)
  - Salineros (semilla 1492): 34,8 % de los turnos
- 🟢 bien · Precios pegados al suelo o al techo más de 20 turnos
- 🔴 **EN ROJO** · Comarcas que no toca nadie en ninguna partida (tierra muerta)
  - 304 de 403 comarcas
  - región 01-iberico-alto-duero: 13
  - región 02-meseta-norte: 31
  - región 03-cantabrico: 33
  - región 04-galicia-minho: 42
  - región 05-central-extremadura: 37
  - región 06-meseta-sur: 24
  - región 07-ebro-pirineo: 33
  - región 08-levante: 3
  - región 09-andalucia: 47
  - región 10-portugal-sur: 41

## Clasificación final

Media de las partidas. La escasez, sobre los turnos jugados; los turnos sin órdenes, sobre los turnos en que el robot entró.

| Casa | Prestigio | % mediana | Puesto | Primicias | Población | Comarcas | Maravedís | Escasez | Sin órdenes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Monjes | 646 | 295,0 % | 1 | 2 | 1118 | 11 | 454 | 0,0 % | 1,9 % |
| Hortelanos | 528 | 241,1 % | 2 | 2 | 766 | 10 | 1560 | 0,0 % | 2,5 % |
| Canteros | 376 | 171,7 % | 3 | 1 | 108 | 1 | 194 | 0,0 % | 1,2 % |
| Arrieros | 269 | 122,8 % | 4 | 0 | 194 | 3 | 89 | 2,5 % | 2,5 % |
| Mercaderes | 169 | 77,2 % | 5 | 0 | 90 | 1 | 109 | 1,2 % | 0,6 % |
| Ferrones | 154 | 70,3 % | 6 | 0 | 93 | 2 | 67 | 8,7 % | 6,2 % |
| Mesta | 48 | 21,9 % | 7 | 0 | 37 | 1 | 98 | 9,9 % | 5,6 % |
| Salineros | 7 | 3,2 % | 8 | 0 | 34 | 1 | 0 | 34,8 % | 93,8 % |

## Capítulos de prestigio

| Casa | Población | Territorio | Obras | Caminos | Comercio | Exploración | Ganadería | Industria | Hitos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 38 | 24 | 0 | 0 | 0 | 136 | 0 | 0 | 75 |
| Canteros | 21 | 8 | 120 | 0 | 0 | 112 | 0 | 0 | 115 |
| Ferrones | 18 | 16 | 0 | 0 | 0 | 64 | 0 | 25 | 45 |
| Hortelanos | 153 | 80 | 0 | 0 | 0 | 120 | 0 | 0 | 175 |
| Mercaderes | 18 | 8 | 0 | 0 | 0 | 120 | 0 | 0 | 25 |
| Mesta | 7 | 8 | 0 | 0 | 0 | 24 | 0 | 0 | 25 |
| Monjes | 223 | 88 | 0 | 0 | 0 | 160 | 0 | 0 | 175 |
| Salineros | 6 | 8 | 0 | 0 | 0 | 24 | 0 | 0 | 25 |

## La vía de cada casa

Partida a partida: cada robot tiene que hacer lo que distingue a su casa. Cuando no lo hace, el motivo que dio el robot (mapa, reglas, recursos o plan) dice por qué.

| Casa | Semilla | Su vía | ¿La juega? | Por qué no |
| --- | --- | --- | --- | --- |
| Arrieros | 1492 | lleva mercancía por los caminos y la vende fuera de su tierra | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 107 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 93 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 37 turnos) |
| Canteros | 1492 | termina obras mayores | sí |  |
| Ferrones | 1492 | saca hierro en sus ferrerías y lo vende o lo pone en aperos | sí |  |
| Hortelanos | 1492 | vive del pan de sus huertas y vende el que sobra | sí |  |
| Mercaderes | 1492 | compra en una plaza y vende esa misma mercancía en otra con ganancia neta | **no** | con los precios que sabe, ningún viaje deja ganancia después del bastimento (reglas, 106 turnos); no hay maravedís de sobra para comprar mercancía (recursos, 50 turnos); hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su bastimento (reglas, 37 turnos) |
| Mesta | 1492 | lleva el ganado de un pasto al otro, esquila y vende la lana | **no** | no tiene la gente, el pan o los maravedís para formar la recua que le falta (recursos, 157 turnos); no conoce ningún invernadero al que pueda llegar el ganado (mapa, 145 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 16 turnos) |
| Monjes | 1492 | funda pueblas | sí |  |
| Salineros | 1492 | saca sal o salazón y la vende | **no** | no tiene con qué levantar un edificio esencial de su vía (recursos, 160 turnos); aún no tiene mercado en la capital donde vender lo que sobra (plan, 160 turnos); hay escasez: el motor no empieza obras ni expediciones nuevas hasta que haya pan (recursos, 56 turnos) |

Medias de las partidas:

| Casa | Lana esquilada | Trashumancias | Ingresos de feria | Pan producido | Madera producido | Piedra producido | Sal producido | Hierro producido | Obras | Obras mayores | Aperos | Jornadas | Comerciado | Vendido fuera | En ruta | Negocios | Con ganancia | Pueblas | Incorporadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 0 | 0 | 0 | 5444 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 271 | 814 | 0 | 0 | 0 | 0 | 0 | 2 |
| Canteros | 0 | 0 | 0 | 4671 | 0 | 425 | 0 | 0 | 2 | 1 | 0 | 117 | 1023 | 0 | 0 | 0 | 0 | 0 | 0 |
| Ferrones | 0 | 0 | 0 | 2582 | 770 | 0 | 0 | 362 | 6 | 0 | 4 | 81 | 393 | 0 | 0 | 0 | 0 | 0 | 1 |
| Hortelanos | 0 | 0 | 0 | 17895 | 315 | 0 | 0 | 0 | 35 | 0 | 0 | 119 | 1518 | 0 | 0 | 0 | 0 | 0 | 9 |
| Mercaderes | 0 | 0 | 0 | 3656 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 103 | 880 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mesta | 2 | 0 | 0 | 1259 | 826 | 0 | 0 | 0 | 2 | 0 | 0 | 25 | 1351 | 0 | 0 | 0 | 0 | 0 | 0 |
| Monjes | 0 | 0 | 0 | 23931 | 2466 | 0 | 0 | 0 | 58 | 0 | 0 | 188 | 1441 | 0 | 0 | 0 | 0 | 6 | 4 |
| Salineros | 0 | 0 | 0 | 1022 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Jugar sin estar: el mismo plan, dicho antes

La medida que cuenta (ficha T-051 §4.1.1): el plan que deja quien entra cada seis turnos —colas, órdenes fechadas, rutas y mayordomo— jugado también a mano, día a día. Las mismas decisiones y la misma información; solo cambia cuándo se dicen las órdenes.

| Semilla | Turno | Casa | Plan por bloques | El mismo plan a mano | Diferencia | Dominio |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1492 | T100 | arrieros | 168 | 168 | 0,0 % | igual turno a turno |
| 1492 | T100 | canteros | 317 | 317 | 0,0 % | igual turno a turno |
| 1492 | T100 | ferrones | 32 | 32 | 0,0 % | igual turno a turno |
| 1492 | T100 | hortelanos | 451 | 451 | 0,0 % | igual turno a turno |
| 1492 | T100 | mercaderes | 120 | 120 | 0,0 % | igual turno a turno |
| 1492 | T100 | mesta | 24 | 24 | 0,0 % | igual turno a turno |
| 1492 | T100 | monjes | 355 | 355 | 0,0 % | igual turno a turno |
| 1492 | T100 | salineros | -12 | -12 | 0,0 % | igual turno a turno |

## Sensibilidad a la frecuencia (diagnóstico)

Aquí se comparan **dos planes distintos**: un robot que decide cada turno y otro que decide cada seis. No mide el motor, sino lo que se gana mirando el tablero más veces; la última columna dice qué decide el diligente entre bloques.

| Casa | Entrando cada turno | Entrando cada seis | Diferencia | Lo que decide entre bloques |
| --- | ---: | ---: | ---: | ---: |
| Arrieros | 269 | 225 | 16,4 % | carga 273, mercado 134, ruta 56 |
| Canteros | 376 | 349 | 7,2 % | mercado 212, carga 151, ruta 20 |
| Ferrones | 154 | 22 | 85,7 % | carga 133, mercado 132, cometido 12 |
| Hortelanos | 528 | 589 | 10,4 % | mercado 301, carga 167, ruta 40 |
| Mercaderes | 169 | 152 | 10,1 % | carga 233, mercado 202, ruta 30 |
| Mesta | 48 | 25 | 47,9 % | mercado 355, carga 127, cometido 4 |
| Monjes | 646 | 481 | 25,5 % | mercado 306, carga 191, ruta 62 |
| Salineros | 7 | -10 | 170,0 % | carga 4, politica 4, ruta 4 |

## Ritmo: hitos y primera obra mayor

Turno exacto de cada uno, por partida y casa. «no» es «no lo alcanzó», nunca un cero.

| Semilla | Casa | Pequeño dominio | Primera obra mayor | Maestro de obra | Hitos |
| --- | --- | --- | --- | --- | ---: |
| 1492 | Arrieros | T143 | **no** | **no** | 4 |
| 1492 | Canteros | **no** | T111 | T111 | 3 |
| 1492 | Ferrones | **no** | **no** | **no** | 3 |
| 1492 | Hortelanos | T68 | **no** | **no** | 4 |
| 1492 | Mercaderes | **no** | **no** | **no** | 2 |
| 1492 | Mesta | **no** | **no** | **no** | 2 |
| 1492 | Monjes | T48 | **no** | **no** | 4 |
| 1492 | Salineros | **no** | **no** | **no** | 2 |

## Arbitraje con traza

Solo cuenta la mercancía comprada en una plaza y vendida en otra, seguida carga a carga. Lo que se vende sin haberlo comprado se publica aparte: es producción propia o carga de casa.

| Semilla | Casa | Negocios | Cargas | Margen | Margen neto | Reventas en la misma plaza | Cargas vendidas sin compra | Cargas descargadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1492 | Arrieros | 0 | 0 | 0 | 0 | 0 | 5 | 802 |
| 1492 | Canteros | 0 | 0 | 0 | 0 | 0 | 52 | 971 |
| 1492 | Ferrones | 0 | 0 | 0 | 0 | 0 | 9 | 384 |
| 1492 | Hortelanos | 0 | 0 | 0 | 0 | 85 | 356 | 641 |
| 1492 | Mercaderes | 0 | 0 | 0 | 0 | 0 | 0 | 874 |
| 1492 | Mesta | 0 | 0 | 0 | 0 | 0 | 695 | 650 |
| 1492 | Monjes | 0 | 0 | 0 | 0 | 67 | 520 | 564 |

## Órdenes

Lo que propone cada robot y lo que pasa con ello. Proponer cero órdenes es un dato de actividad, no una prueba de que no hubiera nada útil que hacer.

| Casa | Propuestas | De alta | Terminadas | Canceladas | En espera o en cola |
| --- | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 631 | 645 | 637 | 0 | 159 |
| Canteros | 508 | 522 | 519 | 0 | 68 |
| Ferrones | 383 | 397 | 394 | 0 | 43 |
| Hortelanos | 715 | 729 | 717 | 2 | 143 |
| Mercaderes | 595 | 609 | 605 | 0 | 74 |
| Mesta | 598 | 612 | 612 | 0 | 12 |
| Monjes | 807 | 821 | 817 | 4 | 188 |
| Salineros | 24 | 35 | 33 | 0 | 24 |

Por qué se cancelan las órdenes:

- regalo: comarca-con-duenyo: 5
- incorporar: comarca-con-duenyo: 1

## Evolución del prestigio

| Casa | T17 | T34 | T51 | T68 | T85 | T102 | T119 | T136 | T153 | T161 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrieros | 45 | 87 | 111 | 119 | 127 | 135 | 190 | 207 | 268 | 269 |
| Canteros | 52 | 86 | 102 | 110 | 126 | 134 | 352 | 360 | 376 | 376 |
| Ferrones | 24 | 44 | 40 | 71 | 81 | 104 | 153 | 151 | 155 | 154 |
| Hortelanos | 177 | 198 | 257 | 335 | 410 | 426 | 457 | 500 | 528 | 528 |
| Mercaderes | 47 | 81 | 97 | 113 | 121 | 137 | 145 | 153 | 169 | 169 |
| Mesta | 22 | 38 | 38 | 56 | 57 | 65 | 64 | 62 | 49 | 48 |
| Monjes | 69 | 101 | 285 | 359 | 407 | 464 | 524 | 567 | 613 | 646 |
| Salineros | 33 | 12 | -4 | -4 | -3 | 14 | 15 | 15 | 9 | 7 |

## Huellas

La huella del último turno de cada partida: otra ejecución con la misma semilla tiene que dar la misma.

- semilla `1492`: `c407944e636adf9199ba73584e13bcbb41f70f8a9d438ee56e942c3c6f0b5209`
