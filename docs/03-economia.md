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

### 3.1.1 Con qué se empieza

Nadie empieza condenado, pero tampoco empieza igual: el arranque lo decide la comarca (ficha
T-049). El orden es siempre el mismo y se puede explicar en una frase: **primero se come, después
se pone la primera piedra del oficio, y lo que la tierra no da se compra**.

1. **Comer.** Se levantan niveles de granja hasta que la comarca produzca el pan de su gente en la
   media del año. Con cubrir el 95 % basta: no se llenan los solares de granjas por el último
   puñado de pan, que vale más el solar. Donde la tierra no da y el mar sí —labor baja y pesca
   alta—, la primera plaza es una **lonja**, y el almacén trae la sal para salar la pesca.
2. **El oficio.** Un edificio de la casa, si la comarca lo admite: la salina del salinero, la
   cantera del cantero, la huerta del hortelano, el mercado del mercader, la majada de la Mesta,
   las casas del monje, la venta del arriero. Si no cabe, no se da, y el alta dice por qué. Nunca se
   regala un edificio que las reglas no dejarían construir ahí, ni uno que coma algo que el arranque
   no le da: por eso el ferrón no empieza con carbonera, que se comería su madera antes de que
   tenga con qué levantar la ferrería.
3. **Comprar.** El pan que falte en el año se compensa con maravedís, al precio base del pan y con
   un tope. Las casas que viven de comprar —la Mesta y los mercaderes, con su pan penalizado— no
   tienen que alimentarse de su tierra: siembran menos (les basta cubrir el 70 %) y salen con más
   dinero en la bolsa.

Un origen es **viable** cuando, con eso y sin dar una sola orden, aguanta el primer año: o no pasa
escasez, o con lo que recauda puede comprar el pan que le falta. Se comprueba con una muestra fija
—un origen por perfil y casa— y los resultados desfavorables se publican igual.

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
| Venta (posada) | **en tierra de nadie o propia** | 10 madera, 10 piedra | 2 | **abre plaza local**; recuas propias y ajenas reponen; +4 mrs por tránsito | 1 |
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

- cuesta 8 hierro al instalarse (con la orden `aperos`, de golpe) y **1 hierro por turno** de
  mantenimiento; el máximo es 3, o 4 para los ferrones;
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
  Entonces crece `2 + floor(lealtad / 25)` vecinos (+20 % con carta puebla o monasterio cerca),
  con un máximo del 5 % de la población —al menos uno— y sin pasar de la capacidad
  (`60 + 30 × casas + 20 con muralla`). Si no crece, la crónica dice por qué.
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

El fuero sube la lealtad solo hasta 90. «Sin atención» es sin edificios, sin obras y sin recuas
propias en la comarca.

Efectos: con lealtad < 40, la producción cae un 25 %; con < 20, la comarca no acepta órdenes de
formar recuas ni de leva, y tras seis turnos así **vuelve a ser neutral**, avisada en la crónica
cada turno con los que quedan. Quien la tenía conserva tanta influencia como lealtad le quedaba, y
pierde sus obras allí. La comarca de la corte no se va nunca. Exprimir territorio tiene precio.

**Política de la comarca.** El fuero se cambia como mucho una vez cada 10 turnos; el fuero pleno no
se puede quitar en 20, y quitarlo después cuesta 20 de lealtad. La carga fiscal y la dehesa se
cambian cuando se quiera.

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
| **Tratar** | Comprar o vender en el mercado o feria de destino, con precio límite | Comisión 2 % (1 % en feria) |
| **Poblar** | Deja vecinos en una comarca propia (sin pasar de la capacidad) o funda puebla en una neutral con influencia ≥ 40 y 10 vecinos | 2 turnos |
| **Estar presente** | Se queda: genera 2 de influencia por turno en una comarca neutral | Bastimento de una jornada por turno |
| **Disolver** | En comarca propia: devuelve la gente y los arrieros, la carga y la mitad de los maravedís de formarla | 1 turno |

Las **paradas** de una ruta son paradas de verdad: la recua se detiene en cada una donde haya algo
que hacer (cargar, descargar, vender o comprar) y lo hace ese mismo turno; cargar y descargar, solo
en comarca propia. Una exploración de cada cinco trae además un **hallazgo**: una aldea que no
figuraba en el mapa o noticias frescas de una comarca de un rival. Nunca un recurso.

## 3.8 Los rebaños (la vía trashumante)

Un **rebaño** es una unidad móvil como la recua, pero de ganado:

- Coste: 60 mrs y 2 vecinos (los pastores, que se van con él). Tamaño: 1 000 cabezas.
- Come pasto, no pan: necesita estar en una comarca con `pasto ≥ 2` **adecuada a la estación**.
  Los pastos de verano (rasgo `pasto-de-verano`, sierra) valen del turno 9 al 18; los de invierno
  (`pasto-de-invierno`, `dehesa` y `montado`, vegas y dehesas del sur) el resto del año.
- Cada comarca mantiene `pasto × 1 000` cabezas; si hay más ganado, de quien sea, se reparte la
  hierba **en proporción a las cabezas** y todos pastan a medias ese turno.
- **Esquileo** en la segunda quincena de mayo (turno 10): `12 sacas × (cabezas / 1 000) × calidad`,
  donde la calidad es lo pastado desde el esquileo anterior sobre el año entero de 24 turnos. Un
  rebaño que hace el ciclo entero da 12 sacas; uno que se queda quieto en la sierra, unas 4. La lana
  entra en el almacén: para venderla hay que cargarla y llevarla a una plaza.
- Sin pasto en absoluto **dos turnos seguidos**, pierde un 5 % de las cabezas cada turno desde el
  segundo (y desaparece si se queda sin ninguna).
- Además produce 2 pan por turno por cada mil cabezas (queso y corderos) y **estiércol**: cada
  invierno que pasta en una comarca propia suma turnos de abono; si llegan a 10 el esquileo sube un
  nivel de estiércol (hasta 3) y cada nivel da +5 % al pan de la labor; sin invernada, baja uno.
- Anda **2 jornadas por turno**, una más por cañada. En camino pasta entero si va por una **cañada**
  (también si el turno acaba en una comarca del camino) y nada si va por otro camino.
- Su ruta **no es circular**: la subida y la bajada son dos órdenes al año.
- **Tierra ajena.** Un rebaño entra por cualquier camino en comarcas propias o neutrales; en la de
  otro jugador, solo por una cañada real y solo si su casa tiene **paso franco** (la Mesta). Hasta
  que haya portazgos y acuerdos entre jugadores esa es toda la regla; al trazar la ruta las
  cañadas pesan la mitad.
- Un puerto que va a cerrar **dentro de exactamente dos turnos** se avisa a los rebaños que lo
  tienen por delante; si llegan y está cerrado, esperan; si la nieve los pilla a medio puerto,
  vuelven.

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

Las jornadas a la capital se miden por el mejor camino **conocido** y **en verano** (para que el
coste no oscile con la estación), con los puentes y calzadas construidos: un buen camino abarata
gobernar lo lejano.

Si no puedes pagar la administración, las comarcas que quedan sin pagar —las más lejanas— pierden
2 de lealtad y lo debido se **acumula como deuda**, que se salda con lo que sobre los turnos
siguientes; mientras quede deuda, la comarca más lejana sigue perdiendo lealtad. No hay castigo
repentino: hay una cuesta abajo visible y evitable.

El fuero rebaja a la vez la administración y los impuestos, así que por sí solo no arregla las
cuentas: lo que hace sostenible un dominio largo son los caminos. En un escenario de prueba de
ocho comarcas en fila, sin fueros ni caminos el jugador pasa 98 de 100 turnos en deuda y el dominio
se deshace hasta quedarse en dos comarcas; con fueros y calzadas, no se endeuda nunca.

**Traslado de la corte.** Puedes mover la capital a otra comarca propia: 10 turnos, 200 mrs y
50 de piedra, y mientras dura la administración cuesta un 25 % más. Es la respuesta histórica —la
corte itinerante— al problema de un dominio alargado.

## 3.10 Mercado y precios

### 3.10.1 Dónde se comercia

Una **plaza** es un mercado abierto este turno:

- **Mercado local**: en comarcas con edificio de mercado, de cualquier dueño y abierto todos los
  turnos. Volumen pequeño, precios peores.
- **Venta**: la posada del camino abre plaza igual que un mercado, y es **el único edificio que se
  levanta en tierra de nadie** —una comarca explorada y sin dueño—, porque las ventas se hacían
  fuera de poblado. Lo que se levanta allí no pasa a ser tuyo: si alguien incorpora la comarca, se
  queda con ella y con lo que haya dentro. A diferencia del mercado, la venta no da sus maravedís
  ni su lealtad: **el mercado es el pueblo, la venta es el camino**.
- **Ferias**: en comarcas con derecho de feria, solo en sus turnos de calendario. Volumen grande,
  mejores precios, y son el punto de encuentro (y de rumores) entre jugadores. Hay once en toda la
  península y cada una abre uno o dos turnos al año: son el acontecimiento anual, no el mercado de
  cada quincena.

Esto es lo que da un mapa donde comerciar. Sin ventas, una partida de ocho casas tiene **diez
plazas para unas 208 comarcas** —un mercado por capital, y las capitales se reparten a seis
jornadas unas de otras—, así que llevar mercancía de una plaza a otra no es una decisión: no hay
adónde ir.

Toda la mercancía viaja en recuas: **no se compra ni se vende desde el almacén**. Lo vendido sale de
la carga de la recua, lo comprado entra en ella y los maravedís se cobran y se pagan de la carga (no
ocupan porte). Para comprar hay que llevar los maravedís cargados. Una comarca con mercado local y
feria a la vez comercia en la feria mientras esté abierta. Los maravedís son la moneda y no se
comercian.

### 3.10.2 El precio base de cada comarca

**Lo que sobra en una comarca vale menos allí, y lo que no hay cuesta más traerlo.** El precio base
de un recurso no es un número para toda la península: es el del catálogo multiplicado por la
abundancia del potencial que lo produce.

| Recurso | Potencial que lo abarata |
|---|---|
| pan | labor |
| madera | monte |
| piedra | piedra |
| sal | sal |
| hierro | hierro |
| lana | pasto |
| maravedís | ninguno: es la moneda y vale igual en todas partes |

| Potencial | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---:|---:|---:|---:|---:|---:|
| Factor sobre el precio base | 1,20 | 1,10 | **1,00** | 0,90 | 0,80 | 0,70 |

El precio del catálogo es el de una **comarca corriente** (potencial 2). Desde ahí, la escasez
encarece poco y la abundancia abarata mucho, porque lo que mueve el comercio es de dónde *sale* la
mercancía. Un puerto de mar come pescado, pero su pan sigue mirando a la labor: Bilbao importaba
grano y lo pagaba caro, y esa es justo la decisión que se quiere.

Esto es lo que hace que la geografía mande en el comercio. La sal está en 12 comarcas de 403 y el
hierro en 17: entre una salina y el secano hay un 70 % de diferencia de precio, mientras que el pan
y la lana, que se dan en casi todas partes, apenas se mueven. Medido en una partida de 200 turnos,
la diferencia entre la plaza más barata y la más cara pasó de **0,6 puntos a 40,4 en la sal** y de
0,4 a 40,3 en el hierro.

El factor se toma del potencial **del mundo**, no del agotamiento de la comarca: el precio base no
oscila turno a turno con la explotación, igual que la administración se mide siempre en verano.
Sobre este base se montan después los acontecimientos (una carestía de sal sube el base **de esa
región**), el suelo y el techo, y los límites de los mercaderes menores.

### 3.10.3 Formación de precios

Cada mercado guarda un precio por recurso. Cada turno, y para cada recurso de cada plaza abierta:

```
desequilibrio = 1000 × (demanda − oferta) / max(1, demanda + oferta)      (de −1000 a 1000)
impulso       = elasticidad × desequilibrio, recortado al 15 % del precio de partida
precio_nuevo  = precio + impulso + 10 % de la distancia al precio base,
                sin moverse más del 15 % en el turno
                y siempre entre el 40 % y el 250 % del precio base
```

- La **demanda** y la **oferta** son las líneas de compra y de venta cuyo precio límite admite el
  precio de hoy, más las de los mercaderes menores.
- El precio nuevo es **el precio al que se cierran los tratos de ese turno**: quien vende mucho lo
  hunde antes de cobrar. Con la plaza cerrada (una feria fuera de fecha, un mercado derribado) solo
  actúa la vuelta al base, así que los precios se recuperan solos.
- La elasticidad es propia de cada recurso: pan 400, sal 600, hierro 700, lana 500, madera 300,
  piedra 250 (milésimas del desequilibrio).
- Precios base de partida, en maravedís por carga **en una comarca corriente**: pan 3, madera 4,
  piedra 6, sal 14, hierro 24, lana 50. Cada comarca los corrige con su abundancia (§3.10.2). Son
  cifras de arranque para el banco de pruebas (T-046).
- **Mercaderes menores**: agentes sintéticos deterministas que dan liquidez y hacen que el mercado
  se comporte como si hubiera mundo alrededor. Compran hasta un 10 % por encima del precio base de
  esa plaza y
  venden desde un 10 % por debajo: dentro de esa banda son contraparte de los dos lados; fuera, solo
  del que sujeta el precio. Su cupo por turno es el tope de la plaza menos lo que los jugadores ya se
  comercian entre sí, así que en multijugador, con mucho comercio entre jugadores, casi desaparecen.
  No tienen almacén ni memoria y nunca casan entre ellos.

### 3.10.4 Órdenes de mercado

Se envían con **precio límite** y cantidad: «vender hasta 40 de lana a no menos de 55 mrs». Las
ejecuta una recua **quieta en la comarca de la plaza y con el cometido `tratar`**, y valen de 1 a 24
turnos. Las recuas detenidas en una parada de su ruta comercian además lo que dice la parada, ese
turno solo. Se casan en la fase 7:

1. Entre jugadores primero, al precio de la plaza. El lado que sobra se reparte **en proporción a lo
   pedido**; el sobrante de los redondeos va al que ofrece mejor precio y, a igualdad, al de menor
   `hash(partida, turno, plaza, jugador)`.
2. Lo que queda se lo compran o se lo venden los mercaderes menores, dentro de su cupo.
3. Ninguna plaza mueve más de su **tope de volumen** por recurso y turno: la base de 40 cargas por
   el volumen de la plaza (pequeña ×1, mediana ×3, grande ×8).

**Comisión**: la paga quien vende y quien compra, sobre el importe, y desaparece. En el mercado
local es la de la casa (2 % de partida); en feria, como mucho el 1 %. El que vende cobra el importe
redondeado a la baja y el que compra paga redondeado al alza.

Lo que no se casa, se anuncia en la crónica con su motivo (precio límite, fondos, volumen de la plaza,
sin contraparte, sin carga o sin espacio) y una orden puede quedar vigente los turnos siguientes con
lo que falta. Si su recua no puede comerciar, la orden espera (la feria no está abierta, la recua está
lejos o de ruta o no trata) y arranca sola en cuanto pueda.

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

## 3.13 Acontecimientos

Pasan cosas, pero nunca por sorpresa: cada año sale, de la semilla, un calendario de **2 a 4
acontecimientos**, con al menos uno bueno y como mucho uno malo por región, y **todos tienen una
respuesta posible**. El primer turno del año se publica el calendario entero («en septiembre habrá
sequía en el Duero»), y cada acontecimiento se anuncia otra vez **exactamente dos turnos antes** de
empezar. Solo ocurre lo que llegó a anunciarse: en una partida que empieza en marzo no cae nada que
no se pudiera avisar. Empiezan a partir del turno 3 y terminan antes de acabar el año.

| Acontecimiento | Efecto | Empieza (turno) | Dura | Respuesta |
|---|---|---|---|---|
| Año de buenas lluvias | +25 % de pan en la región | 5–18 | 6 | Vender el excedente, crecer |
| Sequía | −30 % de pan (no toca huertas ni pesca) | 9–16 | 6 | Comprar pan, huertas y pesca |
| Nieves tempranas | Puertos de la región cerrados 2 turnos antes del invierno | 19–20 | 4 | Adelantar la bajada de rebaños |
| Riada | Vados cortados salvo con puente; −20 % de labor en vegas | 6–9 | 3 | Rodear; el puente lo evita |
| Peste de ganado | −25 % de lana en el esquileo de la región | 3–9 | hasta el esquileo | Mover los rebaños fuera |
| Buen año de feria | +20 % de volumen en una feria de la región | con la feria | sus turnos | Llevar mercancía |
| Carestía de sal | Precio base de la sal +50 % en la región | 13–19 | 5 | Vender sal, comprar antes |
| Romería | +10 de lealtad al empezar e ingresos +10 % en una comarca | 5–20 | 2 | Nada: es un regalo |
| Incendio en el monte | +20 de agotamiento de monte en una comarca (la mitad en dehesa) | 12–17 | 1 | Dehesa como prevención |
| Llegada de maestros | Obras mayores de la región al doble de ritmo | 3–19 | 4 | Empezar la obra antes |

Los efectos son **modificadores**: ninguna fase toca potenciales ni edificios, todas preguntan cuánto
vale un efecto en su lugar y su turno. La carestía cambia el precio base hacia el que regresa la
plaza, así que el precio sube en unos turnos y no de golpe; el buen año de feria da profundidad
(más volumen), no un precio regalado. El efecto sobre la lana lo consulta el esquileo de los rebaños.

