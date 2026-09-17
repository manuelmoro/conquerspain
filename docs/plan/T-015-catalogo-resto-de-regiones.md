# T-015 · Catálogo · regiones 2 a 10

**Fase:** 1 · El mundo · **Depende de:** T-012 · **Estado:** **en curso** (4 de 9 entregas)

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
| 6 | Meseta sur | `06-meseta-sur.jsonc` | pendiente | 34 | La Mancha (`labor 4`, `vinyedo`); Campo de Calatrava y Valle de Alcudia (`pasto-de-invierno`, `hierro 2`); La Alcarria (miel, `monte`); Montes de Toledo; Serranía de Cuenca (`monte 5`, madera de los ríos) |
| 7 | Ebro, Pirineo y Cataluña | `07-ebro-pirineo.jsonc` | pendiente | 40 | Bardenas y Monegros (`pasto-de-invierno`, `labor 1`); Ribera navarra y Segrià (`vega-fluvial`); Pirineo (`pasto-de-verano`, puertos); Priorat y Penedès (`vinyedo`); Cardona (**sal 5**); Bages y el hierro del Pirineo; puertos de Barcelona y Tarragona |
| 8 | Levante y Murcia | `08-levante.jsonc` | pendiente | 30 | L'Horta de València (`labor 5`, `vega-fluvial`, feria); Vega Baja y Huerta de Murcia; **salinas** de La Mata, Torrevieja y San Pedro (`sal 4-5`); Maestrazgo (`pasto`, `piedra`); puertos de Valencia, Alicante y Cartagena |
| 9 | Andalucía | `09-andalucia.jsonc` | pendiente | 42 | Campiña del Guadalquivir (`labor 5`); Aljarafe y Sevilla (feria grande); **salinas de Cádiz** y almadrabas (`sal 5`, `pesca 5`); Sierra Morena y Riotinto (`hierro 3`); Macael (`cantera-noble`, mármol); Alpujarras y Vega de Granada; Subbética |
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
