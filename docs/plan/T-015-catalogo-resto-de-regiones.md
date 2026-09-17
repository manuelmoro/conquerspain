# T-015 · Catálogo · regiones 2 a 10

**Fase:** 1 · El mundo · **Depende de:** T-012 · **Estado:** **en curso** (8 de 9 entregas)

## 1. Contexto

Con el método validado en la región 1, queda cubrir el resto de la península. Es la tarea más larga
del plan y la que más beneficia al juego: cada comarca bien puesta es una decisión más.

**Esta tarea son nueve entregas independientes.** Cada región se hace entera, se valida y se cierra
por separado; se puede parar entre regiones sin dejar nada a medias.

Lee antes: [T-012](T-012-catalogo-region-01.md) (método completo y criterio de potenciales) y
[T-014](T-014-ferias-y-patrimonio.md) (rasgos y ferias).

## 2. Objetivo

Sustituir todas las comarcas provisionales del mundo por comarcas reales, con nombre tradicional,
cabecera, potenciales justificados, rasgos y ferias.

## 3. Entregas

| # | Región | Archivo | Estado | Comarcas aprox. | Lo que no puede faltar |
|---|---|---|---|---|---|
| 2 | Meseta norte | `02-meseta-norte.jsonc` | **hecha** (36) | 38 | Tierra de Campos (`labor 5`), Tierra de Medina (feria grande, mayo y octubre), Villalón (feria), Cerrato, Páramos, Tierra de Pinares de Valladolid, Tierra de Segovia (`pasto`, lana fina) |
| 3 | Cornisa cantábrica y País Vasco | `03-cantabrico.jsonc` | **hecha** (35) | 30 | **Ferrerías**: Encartaciones, Somorrostro, Oiartzun, Mena (`hierro 4-5`, `ferreria-de-agua`); **salinas de Añana** (`sal 5`); puertos de mar (Bilbao, Santander, San Sebastián, Castro); `monte 5` en los valles; pasos de la Cantábrica |
| 4 | Galicia y norte de Portugal | `04-galicia-minho.jsonc` | **hecha** (38) | 34 | Rías con `pesca 5`; Terra de Santiago (feria, `camino-de-santiago`); Ribeira Sacra (`vinyedo`); Baixo Minho y Douro Litoral; Trás-os-Montes (`pasto`, `monte`) |
| 5 | Sistema Central y Extremadura | `05-central-extremadura.jsonc` | **hecha** (37) | 36 | Dehesas de Badajoz y Cáceres (`dehesa`, `pasto-de-invierno`); Vera y Jerte (`vega-fluvial`); Sierra de Gata, Béjar, Gredos (`pasto-de-verano`); Zafra (feria); Mérida y la Vía de la Plata |
| 6 | Meseta sur | `06-meseta-sur.jsonc` | **hecha** (35) | 34 | La Mancha (`labor 4`, `vinyedo`); Campo de Calatrava y Valle de Alcudia (`pasto-de-invierno`, `hierro 2`); La Alcarria (miel, `monte`); Montes de Toledo; Serranía de Cuenca (`monte 5`, madera de los ríos) |
| 7 | Ebro, Pirineo y Cataluña | `07-ebro-pirineo.jsonc` | **hecha** (42) | 40 | Bardenas y Monegros (`pasto-de-invierno`, `labor 1`); Ribera navarra y Segrià (`vega-fluvial`); Pirineo (`pasto-de-verano`, puertos); Priorat y Penedès (`vinyedo`); Cardona (**sal 5**); Bages y el hierro del Pirineo; puertos de Barcelona y Tarragona |
| 8 | Levante y Murcia | `08-levante.jsonc` | **hecha** (31) | 30 | L'Horta de València (`labor 5`, `vega-fluvial`, feria); Vega Baja y Huerta de Murcia; **salinas** de La Mata, Torrevieja y San Pedro (`sal 4-5`); Maestrazgo (`pasto`, `piedra`); puertos de Valencia, Alicante y Cartagena |
| 9 | Andalucía | `09-andalucia.jsonc` | **hecha** (43) | 42 | Campiña del Guadalquivir (`labor 5`); Aljarafe y Sevilla (feria grande); **salinas de Cádiz** y almadrabas (`sal 5`, `pesca 5`); Sierra Morena y Riotinto (`hierro 3`); Macael (`cantera-noble`, mármol); Alpujarras y Vega de Granada; Subbética |
| 10 | Centro y sur de Portugal | `10-portugal-sur.jsonc` | pendiente | 32 | Beira Alta y Serra da Estrela (`pasto-de-verano`, `monte`); Rio Maior (**sal**); Lezíria do Tejo (`labor 5`); Alentejo (`montado`, `dehesa`); Algarve (`pesca 5`, `sal 4`); puertos de Lisboa, Setúbal y Porto |

Las cifras de comarcas son orientativas (±20 %); manda el mapa generado.

## 4. Procedimiento por región (repetir para cada una)

1. Listar las comarcas de la región con nombre tradicional y cabecera. Fuentes: comarcalización
   tradicional, mancomunidades históricas, denominaciones de origen, nombres de partidos judiciales
   antiguos. Ante duda entre dos nombres, el más reconocible para un lector actual.
2. Coordenadas de la cabecera en milésimas de grado.
3. Potenciales según §4.2 de [T-012](T-012-catalogo-region-01.md), con nota donde haga falta.
4. Rasgos del catálogo cerrado; ferias si corresponde.
5. `npm run atlas` y revisión del informe.
6. Comprobaciones de la región (escritas como test en `paquetes/mundo/src/regiones.test.ts`):
   - ninguna comarca provisional rodeada solo por comarcas de la región, es decir, sin huecos
     dentro (el recuadro de una región siempre pisa las vecinas, por eso se mide así);
   - al menos una comarca con `labor >= 4` por cada cinco comarcas, **en las regiones donde la
     geografía lo permita**: en la cornisa, Galicia o el Pirineo manda la regla de T-012 (nadie
     a más de tres jornadas de una comarca con `labor >= 3`), y se anota en la entrega;
   - los recursos estratégicos aparecen solo donde hubo explotación histórica;
   - entre 3 y 8 orígenes por región, de perfiles distintos;
   - ninguna comarca aislada ni con menos de dos vecinos.
7. Actualizar la tabla de §3 con el estado de la entrega y cerrar con commit propio.

## 5. Equilibrio del mapa completo (al terminar las nueve)

Comprobaciones globales, con test automático:

| Comprobación | Objetivo |
|---|---|
| Comarcas con `sal >= 3` | entre 10 y 16, repartidas por interior y costa |
| Comarcas con `hierro >= 3` | entre 8 y 14, agrupadas en 4 o 5 focos |
| Comarcas con `pasto-de-verano` | ≥ 30, y cada una con al menos una cañada a un pasto de invierno |
| Comarcas con `labor >= 4` | entre 45 y 70 |
| Ferias grandes | exactamente 3 |
| Comarcas de origen | ≥ 60, con al menos 4 por región |
| Distancia media entre comarcas vecinas | 3 a 4 jornadas |

Si alguna se sale, se ajusta el catálogo, no el motor.

## 6. Criterios de aceptación (de la tarea completa)

1. Las nueve regiones están escritas, validadas y con su commit.
2. El mundo generado no tiene ninguna comarca provisional.
3. Las siete comprobaciones globales de §5 pasan como test automático.
4. `informe-atlas.md` refleja el mapa completo y se lee sin sorpresas.
5. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run atlas
npm run verificar
npx vitest run paquetes/mundo
```

## 8. Al terminar

1. Índice: T-015 `hecha`; `ESTADO.md`: fase actual → «Fase 2 · Motor de reglas», siguiente T-030.
2. Bitácora: número final de comarcas, orígenes y recursos estratégicos.
3. Commit final: `T-015: catalogo geografico completo de la peninsula`.

> Mientras esta tarea esté en curso, `ESTADO.md` debe indicar **qué región toca**, para que
> cualquiera pueda continuar por la siguiente sin releer todo el catálogo.

---

## 9. Bitácora de entregas

### Entrega 2 · Meseta norte (18-09-2026)

`02-meseta-norte.jsonc`: **36 comarcas**, de León a Segovia y de la Maragatería a los arribes de
Salamanca. El mundo pasa a 349 comarcas, 71 reales y 278 provisionales.

Lo que define a la región: es el granero. Diecisiete comarcas con `labor >= 4` y dos con `labor 5`
(Tierra de Campos palentina y Campos de Rioseco), medias de `labor 3,3` frente a `monte 1,5` y
`hierro 0`. Quien empiece aquí tendrá pan de sobra y tendrá que comprar todo lo demás, que es
justo la tensión comercial que el diseño busca.

Decisiones de la entrega:

- **Las salinas de Villafáfila** son la única sal de la meseta (`sal 3` en `campos-de-villalpando`,
  con el rasgo `salinas-historicas`). Las lagunas salobres se explotaron por evaporación durante
  toda la Edad Media, y ponen un recurso estratégico en mitad del mar de trigo.
- **Ocho orígenes**: León, Campos de Villalpando, Campos palentinos, Valladolid, Medina del Campo,
  Segovia, Sayago y la Armuña. Zamora quedaba de noveno y se dejó fuera por no pasar del máximo.
- **La proporción de pan de §4.6 se acota**: se exige donde la geografía la permite. La región 01
  (sierra y páramo alto) cumple la regla de T-012, no esta, y se anotó así en el test.
- **Ocho localidades se cambiaron por vecinas** porque caían en el polígono de al lado; es el mismo
  ajuste que en T-012 y lo detecta el atlas solo.

### Entrega 3 · Cornisa cantábrica y País Vasco (18-09-2026)

`03-cantabrico.jsonc`: **35 comarcas**, de Luarca a Hondarribia y de los Picos de Europa a la
Llanada alavesa. El mundo va por 367 comarcas, 106 reales y 261 provisionales.

Lo que define a la región: es la contraria de la Meseta. Una sola comarca llega a `labor 4` (la
Llanada alavesa) y quince pescan; el hierro se concentra en cinco comarcas —Encartaciones con la
vena de Somorrostro, la ría de Bilbao, el Duranguesado, Oiartzun con las minas de Arditurri y el
valle de Mena— y la sal es una sola, la de Añana, con `sal 5`, la más alta escrita hasta ahora.
Quien empiece aquí vende hierro, sal y pescado, y compra pan todos los turnos.

Decisiones de la entrega:

- **La proporción de pan de §4.6 no se le exige**: es el caso que la regla ya preveía. Cumple la de
  T-012 (ninguna comarca a más de tres jornadas de una con `labor >= 3`) gracias a la Llanada, la
  tierra de Grado y el Duero de la región 02.
- **Ocho localidades costeras se movieron tierra adentro** entre uno y tres kilómetros (Santander,
  Santoña, Noja, San Vicente, Mundaka…, esta última sustituida por Muxika): la costa de Natural
  Earth está simplificada a 0,7 unidades y deja fuera penínsulas y rías enteras. Es una decisión
  consciente: preferimos mover el punto a falsear la línea de costa, y se nota solo en el atlas.
- **Diecisiete localidades más se cambiaron por otras de la misma tierra** porque caían en el
  polígono vecino. Con comarcas tan pequeñas y juntas, el Voronoi es implacable.
- **Somorrostro se queda en las Encartaciones** aunque su celda toque la de Castro Urdiales: la
  merindad histórica incluía el valle, y el hierro es de la comarca, no del punto.

### Entrega 4 · Galicia y norte de Portugal (18-09-2026)

`04-galicia-minho.jsonc`: **38 comarcas**, de la Costa da Morte a Miranda do Douro y de Ribadeo a
Porto. El mundo va por 375 comarcas, 144 reales y 231 provisionales.

Lo que define a la región: la mar y la viña. Trece comarcas pescan, diez de ellas a 4 o más, y
once tienen `vinyedo` (Ribeiro, Ribeira Sacra, Douro, Baixo Miño, Valdeorras, Bierzo…). No hay una
sola comarca con `labor >= 4` ni un gramo de sal o de hierro: el noroeste vende pescado, vino y
madera, y compra pan y hierro. Siete orígenes, todos de ciudad o de puerto.

Decisiones de la entrega:

- **Veintisiete localidades se movieron o se cambiaron**, la mayoría en las rías: la costa de
  Natural Earth simplificada a 0,7 unidades se come las bocas de las rías enteras, así que Vigo,
  Ferrol, Viana do Castelo o Corcubión llevan su punto uno o tres kilómetros tierra adentro.
- **El Bierzo entra en esta región**, no en la 02: hoya cerrada entre montañas, con clima, vino y
  camino gallegos. Nadie más lo iba a escribir.
- **La horquilla de comarcas del atlas se hizo adaptativa** (T-011 §4.4, regla 6): con el catálogo
  a medias el mapa llegó a 375 y la barrera de 380 iba a saltar en la entrega siguiente. Mientras
  queden comarcas provisionales se admiten 300–430; cuando no quede ninguna, vuelve a exigirse la
  horquilla de diseño, 320–380. `docs/05` §5.2 dice ahora lo mismo.

### Entrega 5 · Sistema Central y Extremadura (18-09-2026)

`05-central-extremadura.jsonc`: **37 comarcas**, de la sierra del Lozoya a Tentudía y de Ciudad
Rodrigo a La Siberia. El mundo va por 377 comarcas, 181 reales y 196 provisionales.

Lo que define a la región: es **las dos mitades de la trashumancia en el mismo archivo**. Arriba,
nueve comarcas con `pasto-de-verano` (Gredos, Guadarrama, Lozoya, Béjar, Francia, Gata, Jerte,
Villuercas, Ávila); abajo, catorce con `dehesa` o `pasto-de-invierno` (Cáceres, Trujillo, La
Serena, Llerena, Azuaga, Jerez de los Caballeros, La Siberia…). Cuando T-013 trace las cañadas,
las Soriana Occidental, Segoviana y Leonesas terminan aquí.

Decisiones de la entrega:

- **La proporción de pan de §4.6 tampoco se le exige**: seis comarcas con `labor >= 4` de 37. No es
  sierra, es dehesa: tierra de encina y ganado, con el pan en las vegas del Guadiana, el Alagón y
  el Tajo. Cumple de sobra la regla de T-012 (nadie a más de tres jornadas).
- **Solo Vegas del Guadiana llega a `labor 5`**, junto con la Tierra de Campos y Campos de Rioseco
  de la región 02. Son los tres graneros del mapa hasta ahora.
- **La sierra de Madrid entra aquí** y no en la Meseta sur: el Guadarrama y el Lozoya son Sistema
  Central. Madrid y el Jarama los escribirá la entrega 6.
- El validador **rechazó un rasgo inventado** (`castanyar-de-hervas`) en cuanto se generó el atlas:
  el catálogo cerrado de rasgos hizo exactamente su trabajo.

### Entrega 6 · Meseta sur (18-09-2026)

`06-meseta-sur.jsonc`: **35 comarcas**, de la serranía de Guadalajara a la sierra del Segura y de
la Jara a la Manchuela. El mundo va por 377 comarcas, 216 reales y 161 provisionales.

Lo que define a la región: el llano y la viña. Dieciocho comarcas labran a 4 o más y once tienen
`vinyedo`; no hay sal, ni pesca, ni una sola vena de hierro (el Campo de Calatrava y el valle de
Alcudia se quedan en `hierro 2`, la mena pobre que trabajaban las herrerías de la orden). Las dos
capitales del mapa, Toledo y Madrid, están aquí.

Decisiones de la entrega:

- **Almadén no tiene recurso propio.** Las minas de azogue mayores del mundo no se pueden jugar
  porque el mercurio no es uno de los siete recursos; queda contado en su `nota` y con `piedra 3`.
  Si algún día hay bienes de lujo, esa comarca es la primera candidata.
- **Madrid y el Jarama entran en la Meseta sur** y la sierra de Guadarrama en la región 05: la
  divisoria del plan es geográfica, no administrativa.
- **La Mancha se reparte en seis comarcas** (Quintanar, Alcázar, Consuegra, Belmonte, La Roda y
  Daimiel) en vez de una sola grande: son seis encomiendas distintas, y el jugador nota la
  diferencia entre el azafrán de Consuegra y el vino de Valdepeñas.
- Esta región **sí cumple la proporción de pan de §4.6**, como la 02: es la segunda `REGION_DE_LLANO`
  del test.

### Entrega 7 · Valle del Ebro, Pirineo y Cataluña (18-09-2026)

`07-ebro-pirineo.jsonc`: **42 comarcas**, del Baztán al Empordà y de Jaca al delta del Ebro. El
mundo va por 386 comarcas, 258 reales y 128 provisionales.

Lo que define a la región: tres paisajes de golpe. El Pirineo (once comarcas con `pasto-de-verano`
y el hierro del Ripollès, el de la farga catalana, `hierro 3`), el valle del Ebro con sus vegas de
regadío andalusí —Tudela y Lleida son las únicas comarcas con `labor 5` fuera de Castilla— y su
revés seco, las Bardenas y los Monegros, que son `pasto-de-invierno` puro. Y **Cardona**, con
`sal 5`: una montaña de sal gema a cielo abierto.

Decisiones de la entrega:

- **Las Bardenas llevan `labor 1` en terreno llano**, fuera de la horquilla, con su nota: es el
  primer caso del catálogo donde la regla del validador obliga a justificar un desierto.
- **Berguedà se añadió al cerrar**, igual que Alfoz de Clunia en T-012: quedaba un hueco
  provisional rodeado de comarcas de la región, entre el Cadí, Cardona, Osona y el Ripollès.
- **Llívia se quedó fuera**: es un exclave dentro de Francia y el polígono de Natural Earth no lo
  recoge. Su comarca, la Cerdaña, se queda con Ger, Bellver y Alp.
- **La proporción de pan de §4.6 no se le exige**: siete comarcas con `labor >= 4` de 42, porque
  media región es alta montaña y estepa. Nadie queda a más de tres jornadas del pan.

### Entrega 8 · Levante y Murcia (18-09-2026)

`08-levante.jsonc`: **31 comarcas**, de Morella a Águilas. El mundo va por 398 comarcas, 289 reales
y 109 provisionales.

Lo que define a la región: las huertas de regadío andalusí. Cuatro comarcas llegan a `labor 5`
—l'Horta de València, la Ribera, la Vega Baja y la huerta de Murcia— y las cuatro van como `vega`.
Diez tienen `puerto-de-mar` y nueve pescan. La sal está donde estuvo: La Mata y Torrevieja en la
Vega Baja (`sal 4`) y San Pedro del Pinatar en el Campo de Cartagena (`sal 3`).

Decisiones de la entrega:

- **La regla de `labor >= 4` solo en llano o vega mordió tres veces** (Plana de Castelló, Plana
  Baixa y la Safor, todas huertas litorales). Se resolvió bajando a `labor 3` las dos primeras, que
  conservan `pesca`, y pasando la Safor a `vega` sin pesca, con su puerto marcado como rasgo. Es la
  misma solución que ya se le dio a València: en el catálogo, una comarca es huerta **o** pesquera,
  y el puerto es un rasgo.
- **Alicante, Villajoyosa y Águilas llevan el punto tierra adentro**, como los puertos cantábricos:
  la costa simplificada se come los cabos.
- **La Marina Alta se quedó sin vecinos** en la primera generación, aislada en el cabo de la Nao;
  se movió su centro tierra adentro hasta que el grafo volvió a conectarla.
- Esta región **sí cumple la proporción de pan de §4.6**: siete comarcas con `labor >= 4` de 31,
  justo en el límite.

### Entrega 9 · Andalucía (18-09-2026)

`09-andalucia.jsonc`: **43 comarcas**, de Aracena a Vera y de los Pedroches al Estrecho. El mundo
va por 398 comarcas, 332 reales y 66 provisionales.

Lo que define a la región: el valle. Cinco comarcas con `labor 5` (Sevilla y su Aljarafe, Écija,
Carmona, Córdoba y la vega de Granada), doce con `labor >= 4`, diez que pescan y la sal de la
bahía de Cádiz con `sal 5`. El hierro y el cobre están donde estuvieron desde Tartessos, en
Riotinto, y el mármol de Macael es la única comarca del mapa con `piedra 5`.

Decisiones de la entrega:

- **Los Alcornocales se añadió al cerrar**, como Alfoz de Clunia y Berguedà: quedaba un hueco entre
  Ronda, la sierra de Cádiz y el Estrecho, y el mayor alcornocal de la península merecía comarca.
- **Almería y Granada quedan en esta región** y no en una «Levante» extendida: el reino nazarí es
  Andalucía, y sus serranías (Alpujarras, Gádor, Almanzora) forman un bloque con la vega.
- **Veintitrés localidades se cambiaron** por otras de su misma comarca. Es la región con más
  ajustes, porque las campiñas del Guadalquivir son enormes y las sierras del sur, muy troceadas.
- Esta región **cumple la proporción de pan de §4.6** con holgura: es la cuarta `REGION_DE_LLANO`.
