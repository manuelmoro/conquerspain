# 03 · Economía

Las cifras de este documento son el punto de partida del equilibrio. Viven en tablas de datos
(`paquetes/nucleo/datos/`), nunca esparcidas por la lógica, para poder ajustarlas jugando sin tocar
el motor. Todo se calcula con enteros; las fracciones se guardan en milésimas.

---

## 3.1 Los recursos

Cuatro básicos, que todos manejan, y tres estratégicos, que solo existen donde los puso la
geografía. Esa asimetría es la que obliga a comerciar y a pelear por comarcas concretas.

| Recurso | Unidad | De dónde sale | Para qué |
|---|---|---|---|
| **Pan** | carga | Labor (granjas, huertas, molinos) | Comer, bastimento de recuas y cuadrillas |
| **Madera** | carga | Monte (aserraderos, carboneras) | Construir, carros, carbón de ferrería |
| **Piedra** | carga | Canteras | Obras duraderas, molinos, puentes, murallas |
| **Maravedís** | mrs | Mercados, portazgos, ventas | Salarios, administración, compras, fueros |
| **Sal** | carga | Salinas (marítimas o de interior) | Conservar el pan, salazón, ganado, curtidos |
| **Hierro** | carga | Ferrerías (potencial de hierro + carbón) | Aperos: suben la producción de toda comarca |
| **Lana** | saca | Rebaños trashumantes en el esquileo | Venta en ferias; el gran producto de exportación |

Notas de diseño:

- **El pan se pierde.** Sin sal ni granero, el almacén de pan mengua un 4 % por turno. Con granero
  −2 puntos; gastando 1 de sal por cada 50 de pan almacenado, −2 puntos más. La sal solo se gasta
  si alcanza para todo el pan, y el jugador puede desactivarlo con una orden de política. Acaparar
  pan sin logística no funciona: hay que producir, conservar o comprar a tiempo.
- **El hierro no se acumula por gusto**: mantener aperos consume hierro cada turno.
- **La lana no gotea**: se cobra de golpe en el esquileo (segunda quincena de mayo). Es una apuesta
  anual.
- **Los maravedís no se producen solos**: sin comercio, una casa rica en materias primas puede
  quedarse sin liquidez para pagar la administración. Ese es el freno del expansionista.

## 3.2 La comarca

```ts
interface EstadoComarca {
  id: IdComarca;
  duenyo: IdJugador | null;
  poblacion: number;             // vecinos (familias)
  capacidad: number;             // vecinos que caben
  lealtad: number;               // 0..100
  solares: number;               // huecos de edificación totales
  edificios: Record<TipoEdificio, number>;   // nivel por tipo
  aperos: 0 | 1 | 2 | 3;         // herramienta de hierro
  fuero: 'ninguno' | 'carta puebla' | 'fuero';
  cargaFiscal: 'ligera' | 'normal' | 'dura';
  agotamiento: Record<'monte' | 'piedra' | 'hierro' | 'sal', number>;  // 0..100
  influencias: Record<IdJugador, number>;    // solo si es neutral
}
```

Los **potenciales** no cambian nunca: son del mapa, no del estado. Cada comarca tiene siete
potenciales de 0 a 5: `labor`, `monte`, `pasto`, `piedra`, `hierro`, `sal`, `pesca`
(ver [05-geografia.md](05-geografia.md)).

Un potencial de 0 impide construir esa explotación. El potencial actúa como multiplicador:

| Potencial | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Rendimiento | 60 % | 80 % | 100 % | 125 % | 150 % |

### 3.2.1 Solares: por qué no se puede tener todo

Cada comarca tiene entre **4 y 8 solares** según su tamaño y su población. Cada nivel de edificio
ocupa un solar. No caben todas las explotaciones en la misma comarca: hay que elegir a qué se
dedica cada una y, si quieres hacerlo todo, expandirte. Es la regla que crea la especialización y,
con ella, el comercio.

## 3.3 Edificios

| Edificio | Potencial | Coste | Turnos | Efecto por nivel | Máx |
|---|---|---|---|---|---|
| Granja | labor | 20 madera, 10 mrs | 2 | +10 pan | 4 |
| Huerta | labor ≥2 | 10 madera, 15 mrs | 2 | +6 pan, no sufre estación | 2 |
| Molino | labor ≥1 y granja ≥1 | 30 madera, 10 piedra | 3 | +25 % del pan de las granjas | 2 |
| Granero | — | 15 madera, 20 piedra | 3 | −2 puntos de merma; +200 de cupo de almacén local | 1 |
| Aserradero | monte | 10 madera, 10 piedra, 10 mrs | 2 | +6 madera (agota el monte) | 4 |
| Carbonera | monte ≥2 | 15 madera, 10 mrs | 2 | convierte 4 madera en 2 carbón/turno | 2 |
| Cantera | piedra | 20 madera, 15 mrs | 3 | +6 piedra (agota) | 4 |
| Ferrería | hierro | 25 madera, 20 piedra, 30 mrs | 4 | +4 hierro; consume 2 carbón | 3 |
| Salina | sal | 20 madera, 25 mrs | 3 | +5 sal | 3 |
| Majada | pasto | 15 madera, 10 mrs | 2 | mantiene 1 rebaño invernando | 3 |
| Lonja de pescado | pesca | 20 madera, 15 mrs | 2 | +6 pan, +2 sal consumida | 2 |
| Mercado | — | 15 madera, 15 piedra, 20 mrs | 3 | +8 mrs y mercado local activo | 2 |
| Venta (posada) | en camino | 10 madera, 10 piedra | 2 | recuas propias y ajenas reponen; +4 mrs por tránsito | 1 |
| Casas | — | 25 madera, 10 piedra | 2 | +30 de capacidad | 3 |
| Cerca | — | 20 piedra | 3 | +10 lealtad, protege del bandidaje (fase posterior) | 1 |

Reglas comunes:

- Construir ocupa **una cuadrilla** de la comarca durante los turnos indicados. Cuadrillas
  disponibles: `1 + floor(vecinos / 40)`, máximo 4; una más con fuero y otra con monasterio. Si no
  hay cuadrilla libre, la orden espera y dice cuándo quedará una.
- En invierno las obras de piedra tardan el doble (heladas). Las de madera, un 50 % más.
- El edificio se paga entero al empezar. Un edificio en obra ya ocupa su solar.
- Derribar devuelve la mitad del material, redondeando a la baja, y libera el solar en 1 turno.
- Roturar pasa un punto de monte a labor en 3 turnos (10 pan y 20 mrs); en dehesa cuesta el doble
  y la comarca pierde 5 de lealtad; con monasterio es gratis.
- **Insumos.** La carbonera quema 4 madera por nivel y la lonja gasta 2 sal por nivel. Se pagan al
  empezar la producción, de lo que había en el almacén, de la comarca más cercana a la capital a la
  más lejana; el nivel que no puede pagar se para ese turno. La ferrería trabaja como mucho tantos
  niveles como carboneras encendidas haya en su comarca: el carbón no sale de ella.

### 3.3.1 Aperos (el producto del ferrón)

`aperos` es un nivel de comarca, de 0 a 3. Cada nivel:

- cuesta 8 hierro al instalarse y **1 hierro por turno** de mantenimiento;
- sube un 10 % la producción de **todas** las explotaciones de la comarca;
- si falta hierro para el mantenimiento, el nivel baja en 1 al cabo de dos turnos, con aviso.

Un jugador sin hierro propio depende del mercado. Un ferrón con tres comarcas de hierro puede
poner de rodillas a media partida subiendo el precio. Ese es el juego.

## 3.4 Producción, estación y trabajo

Producción de una explotación en un turno:

```
rendimiento = base_por_nivel × nivel
            × multiplicador_potencial      (60 %…150 %)
            × factor_estacion              (solo pan y pasto)
            × factor_aperos                (100 % + 10 % × aperos)
            × factor_lealtad               (ver 3.6)
            × factor_agotamiento           (ver 3.5)
            × factor_mano_de_obra          (ver abajo)
```

**Factor de estación del pan:**

| Estación | Primavera | Verano | Otoño | Invierno |
|---|---|---|---|---|
| Pan | 80 % | 160 % | 100 % | 60 % |

La media anual es 100 %, pero el año tiene forma: el verano llena el granero y el invierno lo vacía.
La huerta y la lonja de pescado no sufren estación: son el seguro de los meses malos.

**Mano de obra.** Cada nivel de explotación necesita 8 vecinos trabajándolo. Si la comarca no tiene
suficientes vecinos para todos sus edificios, todos rinden proporcionalmente menos y la crónica lo
dice. Poblar es tan importante como construir, y por eso las recuas llevan gente.

## 3.5 Agotamiento y regeneración

Monte, piedra, hierro y sal se agotan si se explotan a tope:

- Cada turno de explotación sube el agotamiento del recurso en `2 × niveles_explotando`.
- Cada turno se regenera: monte 3, piedra 1, hierro 1, sal 2 (la sal y el monte se rehacen; la
  piedra buena y la vena de hierro, casi no).
- El factor de agotamiento es `100 % − agotamiento`, con suelo del 40 %.
- Una **dehesa** (política de comarca) reduce a la mitad el agotamiento del monte a cambio de un
  25 % menos de madera: la decisión entre talar hoy o tener bosque en veinte años.

## 3.6 Población, hambre y lealtad

- **Consumo**: un cuarto de pan por vecino y turno (250 milésimas, truncado sobre el total del
  jugador). El vecino es una familia que vive casi toda de lo suyo; el pan del almacén es el
  excedente que la sostiene en los malos meses. Con un pan entero por vecino, un origen típico
  (labor 3, 75 vecinos) no se alimentaba ni con todos sus solares en granjas. Las recuas y
  cuadrillas consumen aparte (§3.7): 2 pan por cuadrilla en obra y turno.
- **Economía de arranque**: la comarca de origen empieza con dos niveles de granja y 80 de pan,
  60 de madera, 20 de piedra y 60 maravedís. En un origen típico eso da la curva buscada: la
  reserva baja en invierno y primavera, se llena en verano y no llega a la escasez en el primer
  año si no se hace nada.
- **Crecimiento**: en la fase 9, una comarca gana vecinos si se cumple todo:
  1. hay abastecimiento (no hubo escasez este turno);
  2. hay capacidad libre;
  3. la reserva de pan del jugador supera el mínimo configurado (30 por defecto);
  4. el balance de pan previsto sigue siendo ≥ 0 con la población nueva.
  Entonces crece `2 + floor(lealtad / 25)` vecinos, con un máximo del 5 % de la población.
- **Escasez**: si el pan disponible no cubre el consumo, el disponible queda a cero (nunca hay deuda
  negativa), se marca escasez y: se detiene el crecimiento, no se pueden iniciar expediciones ni
  obras nuevas, y la lealtad baja 5 puntos. Las órdenes ya empezadas continúan.
- **Hambre prolongada**: a la tercera escasez consecutiva, la comarca pierde un 3 % de vecinos por
  turno (emigran, no mueren: el juego no hace morir gente en pantalla; al menos un vecino si queda
  alguno) y la lealtad cae 10 por turno en lugar de 5. Se avisa en las dos escaseces anteriores.
- **Aviso de hambre**: si con el balance de pan del turno la reserva aguanta menos de tres turnos,
  la crónica lo destaca con la cifra. Nadie llega a la escasez sin haber sido avisado.
- **Lealtad**: empieza en 60 en una comarca incorporada y en 100 en la de origen.

| Sube | Puntos/turno | Baja | Puntos/turno |
|---|---|---|---|
| Fuero concedido | +3 (hasta 90) | Carga fiscal dura | −3 |
| Mercado activo | +1 | Escasez | −5 |
| Obra mayor en la comarca o vecina | +2 | Distancia > 4 jornadas de la capital | −1 |
| Carga fiscal ligera | +2 | Comarca sin edificios ni atención | −1 |

Efectos: con lealtad < 40, la producción cae un 25 %; con < 20, la comarca no acepta órdenes de
formar recuas ni de leva, y tras seis turnos así **vuelve a ser neutral**, con dos turnos de aviso
en la crónica. Exprimir territorio tiene precio.

## 3.7 Recuas, caminos y porte

### 3.7.1 La recua

| Atributo | Valor inicial | Notas |
|---|---|---|
| Coste de formar | 20 mrs, 10 pan, 4 vecinos | Los 4 arrieros salen de la comarca y vuelven al disolverla |
| Porte | 10 cargas | 10 acémilas de una carga cada una; +10 por cada nivel de carro (requiere camino carretero en toda la ruta). Los maravedís no ocupan porte |
| Paso | 3 jornadas por turno | −1 con la carga al 80 % del porte, −1 en barro, +1 si el primer tramo del turno tiene calzada; nunca menos de 1 |
| Bastimento | 2 pan por jornada andada | +1 sal por cada 4 jornadas o fracción en verano (conservas). Del almacén si la recua sale de comarca propia; de su carga si está fuera |
| Gente | hasta 20 vecinos | Además de los arrieros. Para repoblar o fundar puebla |

Sin bastimento, el primer turno la recua se para y la crónica lo avisa. Desde el segundo **malvive**:
anda al paso mínimo sin pagar y pierde una acémila por turno (una carga menos de porte), hasta
quedarse con una. Nunca desaparece sola y siempre puede volver a casa.

Las rutas se trazan por el camino más corto de la estación, **solo por comarcas exploradas o
propias** (el destino basta con conocerlo de oídas), sin tramos cerrados por nieve. Una ruta circular
es un circuito que empieza y acaba donde está la recua. Si la nieve la pilla a medio puerto, vuelve a
la comarca de la que salió y espera.

### 3.7.2 Jornadas entre comarcas

El mapa es un grafo de comarcas. Cada arista tiene un coste en jornadas:

```
jornadas = base_terreno × factor_camino × factor_estacion
```

| Terreno del tramo | Base |
|---|---|
| Llano | 2 |
| Ondulado | 3 |
| Sierra | 5 |
| Puerto de montaña | 7 (cerrado en invierno salvo calzada) |
| Vado de río | +2 (sin puente) |

| Camino | Factor |
|---|---|
| Vereda | 100 % |
| Camino de herradura (construido) | 80 % |
| Camino carretero | 65 % |
| Calzada (obra mayor) | 50 %, nunca se cierra |

Factor de estación: barro en marzo y noviembre +25 %; nieve en tramos de sierra en invierno +50 %;
verano −10 %.

Que un puerto se cierre en invierno **no es un castigo**: es el motivo por el que la trashumancia
existe, por el que hay que almacenar en otoño y por el que un puente o una calzada cambian la
partida.

### 3.7.3 Cometidos

| Cometido | Qué hace | Coste |
|---|---|---|
| **Explorar** | Revela terreno, población, potenciales y edificios de la comarca de destino, con fecha, y el nombre de las vecinas. Volver a explorar refresca la noticia | 1 turno en destino |
| **Portear** | Al llegar a una comarca propia descarga todo en el almacén | — |
| **Tratar** | Comprar o vender en el mercado o feria de destino, con precio límite | Comisión 2 % |
| **Poblar** | Deja vecinos en una comarca propia (sin pasar de la capacidad) o funda puebla en una neutral con influencia ≥ 40 y 10 vecinos | 2 turnos |
| **Estar presente** | Se queda: genera 2 de influencia por turno en una comarca neutral | Bastimento de una jornada por turno |
| **Disolver** | En comarca propia: devuelve la gente y los arrieros, la carga y la mitad de los maravedís de formarla | 1 turno |

Las **paradas** de una ruta son paradas de verdad: la recua se detiene en cada una donde haya algo
que hacer (cargar, descargar, vender o comprar) y lo hace ese mismo turno; cargar y descargar, solo
en comarca propia. Una exploración de cada cinco trae además un **hallazgo**: una aldea que no
figuraba en el mapa o noticias frescas de una comarca de un rival. Nunca un recurso.

## 3.8 Los rebaños (la vía trashumante)

Un **rebaño** es una unidad móvil como la recua, pero de ganado:

- Coste: 60 mrs y 2 vecinos. Tamaño: 1 000 cabezas.
- Come pasto, no pan: necesita estar en una comarca con `pasto ≥ 2` **adecuada a la estación**
  (pastos de verano en sierra de mayo a septiembre; de invierno en dehesa y vega de octubre a abril).
- Si pasa un turno sin pasto adecuado, pierde el 10 % de su producción anual de lana.
- **Esquileo** en la segunda quincena de mayo: el rebaño entrega `12 sacas × calidad` de lana, donde
  la calidad es el porcentaje de turnos del año en pasto correcto.
- Además produce 2 pan por turno (queso, corderos) y 1 de estiércol equivalente a +5 % de labor en
  la comarca donde inverna.
- Moverse por **cañadas reales** (aristas marcadas en el mapa) no cuesta portazgo ni permiso; fuera
  de ellas, cruzar tierras ajenas exige pagar o tener acuerdo.

La trashumancia es un plan anual completo: subir en primavera, esquilar, bajar en otoño, invernar.
Quien lo borda tiene el mayor ingreso en metálico del juego; quien lo improvisa, pierde el año.

## 3.9 Administración: el freno del que crece

Cada turno, el jugador paga en maravedís:

```
administracion = Σ por comarca:  4 + 2 × jornadas_a_la_capital  (por el mejor camino conocido)
                 × modificador_de_fuero
```

| Fuero | Coste de administración | Impuestos que rinde | Lealtad |
|---|---|---|---|
| Ninguno | 100 % | 100 % | — |
| Carta puebla | 75 % | 70 % | +2/turno, +20 % de crecimiento |
| Fuero | 50 % | 50 % | +3/turno, +1 cuadrilla |

Si no puedes pagar la administración, las comarcas más lejanas pierden lealtad rápido. No hay
castigo repentino: hay una cuesta abajo visible y evitable.

**Traslado de la corte.** Puedes mover la capital a otra comarca propia (10 turnos, coste alto).
Es la respuesta histórica —la corte itinerante— al problema de un dominio alargado.

## 3.10 Mercado y precios

### 3.10.1 Dónde se comercia

- **Mercado local**: en comarcas con edificio de mercado. Volumen pequeño, precios peores.
- **Ferias**: en comarcas con derecho de feria, solo en sus turnos de calendario. Volumen grande,
  mejores precios, y son el punto de encuentro (y de rumores) entre jugadores.

### 3.10.2 Formación de precios

Cada mercado tiene un precio por recurso que se mueve por oferta y demanda de ese turno:

```
precio_nuevo = precio_base × (1000 + elasticidad × (demanda − oferta) / max(1, demanda + oferta)) / 1000
```

- El precio se mueve como mucho un 15 % por turno y vuelve poco a poco al base (10 % por turno).
- La elasticidad es propia de cada recurso: pan 400, sal 600, hierro 700, lana 500, madera 300,
  piedra 250 (en milésimas de punto porcentual).
- En partidas en solitario hay **mercaderes menores**: agentes sintéticos deterministas que dan
  liquidez y hacen que el mercado se comporte como si hubiera mundo alrededor.
- En multijugador, la oferta y la demanda son las órdenes reales de los jugadores más la de los
  mercaderes menores, cuya cuota baja a medida que crece el volumen humano.

### 3.10.3 Órdenes de mercado

Se envían con **precio límite** y cantidad: «vender hasta 40 de lana a no menos de 55 mrs». Se casan
en la fase 7 con reparto proporcional (§2.4.4). Lo que no se casa, se anuncia en la crónica y puede
quedar vigente los turnos siguientes.

## 3.11 Obras mayores

Proyectos de decenas de turnos que marcan la partida. Ocupan cuadrillas, consumen material a lo
largo de la obra y dan prestigio y efectos permanentes.

| Obra | Turnos | Coste total | Requisitos | Efecto |
|---|---|---|---|---|
| **Puente** | 12 | 120 piedra, 40 madera, 60 mrs | Vado en el tramo | Elimina el +2 del vado; el tramo no se cierra por crecida |
| **Calzada** | 20 | 200 piedra, 100 mrs | Camino carretero en el tramo | Factor 50 %, nunca se cierra por nieve |
| **Monasterio** | 25 | 150 piedra, 100 madera, 150 mrs | Lealtad ≥ 60 | +20 % de crecimiento en la comarca y las vecinas; roturación gratuita; +1 cuadrilla |
| **Catedral** | 45 | 1 200 piedra, 300 madera, 800 mrs | Ciudad, sede episcopal (`ciudad-episcopal`), cantera propia | Prestigio alto; +2 de lealtad por turno a las comarcas propias de la región; 12 mrs de peregrinos por turno |
| **Muralla** | 18 | 250 piedra, 80 mrs | — | Protege del bandidaje; +15 de lealtad; hace falta para ser ciudad |
| **Atarazana** | 30 | 250 madera, 100 piedra, 200 mrs | Comarca costera | Habilita el comercio marítimo de larga distancia (fase posterior) |
| **Acequia mayor** | 22 | 120 piedra, 60 madera, 150 mrs | Vega con río (`vega-fluvial`) | +50 % de labor en la comarca y elimina la penalización estacional |

Una **ciudad** es una comarca con al menos 200 vecinos y muralla. El puente y la calzada se levantan
en un tramo que sale de una comarca propia; las demás, en la comarca. Todas son de piedra salvo la
atarazana, así que el invierno las frena.

El coste se **paga a plazos**: cada turno se entrega lo que corresponde al avance de ese turno, y al
terminar se ha pagado exactamente el total. Si un turno no hay material, la obra se detiene (no se
pierde) y sigue sola en cuanto lo haya. Una obra mayor puede **abandonarse** y retomarse: libera la
cuadrilla y lo construido no se pierde, pero se deteriora un 1 % por turno de abandono.

## 3.12 Por qué hay muchas estrategias

Cada vía tiene su motor económico, su ritmo y su punto débil. Todas deben poder ganar una partida.

| Vía | Motor | Ritmo | Punto débil |
|---|---|---|---|
| **Trashumante** | Lana vendida en ferias | Anual, a golpes | Depende del precio y de tener pastos en las dos estaciones |
| **Ferrón** | Hierro y aperos | Sostenido y creciente | Devora monte; necesita comprar pan |
| **Cantero** | Obras mayores y prestigio | Lento, imparable al final | Frágil los primeros 50 turnos |
| **Mercader de ferias** | Arbitraje entre mercados | Rápido y flexible | Necesita caminos y liquidez; sufre si otros cierran rutas |
| **Repoblador** | Población y volumen | Constante | Hambrunas y administración |
| **Salinero** | Monopolio de la sal | Medio, con picos | Pocas comarcas: si te las quitan, se acabó |
| **Caminero** | Caminos, ventas y portazgos | Medio | Solo brilla si hay tráfico ajeno; muy dependiente del multijugador |

El diseño se considera equilibrado cuando, en partidas de prueba automatizadas de 200 turnos, las
siete vías quedan dentro de una horquilla del 20 % de prestigio final y ninguna gana siempre en
mapas distintos.
