# T-012 · Catálogo · región 1: Sistema Ibérico y Alto Duero

**Fase:** 1 · El mundo · **Depende de:** T-011 · **Estado:** **hecha** (18-09-2026)

## 1. Contexto

Primera región real del catálogo. Es la zona que ya se dibujó en la maqueta (Pinares, Soria, El
Burgo, Demanda, Cameros…), así que sirve además de comparación directa con lo que ya se vio en
pantalla. Lo que se aprenda aquí fija el método para las otras nueve regiones.

Lee antes: [docs/05-geografia.md](../05-geografia.md), la ficha [T-010](T-010-esquema-del-catalogo.md)
§4.2 y §4.3.

## 2. Objetivo

`paquetes/mundo/catalogo/01-iberico-alto-duero.jsonc` completo, validado y revisado, con unas 34
comarcas reales que sustituyen a las provisionales generadas por el atlas en esa zona.

> Al generar el atlas quedó un hueco provisional rodeado por completo de comarcas de la región, y
> se escribió una comarca más para taparlo: **35 en total** (§4.1).

## 3. Alcance

**Entra:** las comarcas de la tabla §4.1, con nombre, cabecera, centro, terreno, potenciales,
solares, población inicial, localidades, rasgos y notas justificativas.

**No entra:** caminos, puertos y cañadas (T-013); ferias y patrimonio (T-014); otras regiones (T-015).

## 4. Diseño detallado

### 4.1 Comarcas de la región

| id | Nombre | Cabecera | Rasgos y criterio |
|---|---|---|---|
| `pinares` | Pinares | Covaleda | Pinar de Urbión: `monte 5`, `pasto 4` (pasto de verano), `labor 1` |
| `tierra-de-soria` | Tierra de Soria | Soria | Cabecera comarcal, mercado; `labor 2`, `pasto 3` |
| `tierra-del-burgo` | Tierra de El Burgo | El Burgo de Osma | Ciudad episcopal (catedral); `labor 3` |
| `demanda` | Sierra de la Demanda | Salas de los Infantes | `monte 4`, `piedra 3`, `pasto 4` |
| `cameros` | Cameros | Torrecilla en Cameros | Cuna trashumante; `pasto 5`, `labor 1` |
| `tierras-altas` | Tierras Altas | San Pedro Manrique | `pasto 4`, población baja, dura en invierno |
| `almazan` | Tierra de Almazán | Almazán | `labor 3`, vega del Duero |
| `moncayo` | Moncayo | Ágreda | `pasto 3`, `piedra 3`, puerto hacia el Ebro |
| `ribera-del-duero` | Ribera del Duero | Aranda de Duero | Vega y viñedo: `labor 4` |
| `arlanza` | Arlanza | Lerma | `monte 3`, `labor 3` |
| `alfoz-de-clunia` | Alfoz de Clunia | Huerta de Rey | Añadida al cerrar la tarea: tapaba el hueco entre la Demanda y la Ribera. `monte 4`, sabinares y la Clunia romana |
| `alfoz-de-burgos` | Alfoz de Burgos | Burgos | Gran plaza mercantil; `labor 3`, feria (T-014) |
| `bureba` | La Bureba | Briviesca | **Salinas de Poza de la Sal**: `sal 3` + rasgo `salinas-historicas` |
| `montes-de-oca` | Montes de Oca | Belorado | Camino de Santiago; `monte 3` |
| `valle-del-oja` | Valle del Oja | Santo Domingo de la Calzada | Camino de Santiago; `labor 3` |
| `najerilla` | Najerilla | Nájera | `labor 3`, `pasto 3` |
| `rioja-media` | Rioja Media | Logroño | `labor 4`, vega del Ebro |
| `rioja-baja` | Rioja Baja | Calahorra | `labor 4`, regadío |
| `rioja-alavesa` | Rioja Alavesa | Laguardia | `labor 4`, viñedo |
| `campo-de-gomara` | Campo de Gómara | Gómara | Cereal de secano: `labor 3` |
| `berlanga` | Tierra de Berlanga | Berlanga de Duero | `labor 3`, `piedra 2` |
| `medinaceli` | Tierra de Medinaceli | Medinaceli | Paso histórico entre mesetas; `pasto 3` |
| `siguenza` | Tierra de Sigüenza | Sigüenza | **Salinas de Imón y La Olmeda**: `sal 4`; ciudad episcopal |
| `ayllon` | Serranía de Ayllón | Ayllón | `monte 4` (hayedo), `pasto 3` |
| `sepulveda` | Tierra de Sepúlveda | Sepúlveda | `labor 3`, `piedra 3` (caliza) |
| `pedraza` | Tierra de Pedraza | Pedraza | `pasto 4`, lana fina segoviana |
| `senyorio-de-molina` | Señorío de Molina | Molina de Aragón | **Sierra Menera**: `hierro 4` + rasgo `vena-de-hierro` |
| `alto-tajo` | Alto Tajo | Peralejos de las Truchas | `monte 4`, `pasto 3`, aislada |
| `albarracin` | Sierra de Albarracín | Albarracín | `pasto 4`, `piedra 4`, `monte 3` |
| `jiloca` | Valle del Jiloca | Calamocha | **Ojos Negros**: `hierro 3`, `labor 3` |
| `daroca` | Campo de Daroca | Daroca | `labor 3`, mercado |
| `calatayud` | Comunidad de Calatayud | Calatayud | `labor 4`, regadío del Jalón |
| `campo-de-borja` | Campo de Borja | Borja | `labor 4` |
| `aranda-jalon` | Valle del Aranda | Illueca | `monte 3`, `hierro 2` (ferrerías menores) |
| `tierra-de-lara` | Tierra de Lara | Covarrubias | `piedra 4` (canteras), `monte 3` |

Las coordenadas de cada cabecera se toman de fuentes abiertas (Wikipedia/OpenStreetMap) con tres
decimales, y se convierten a milésimas de grado. Cada comarca lleva entre dos y cinco localidades
reales.

### 4.2 Criterio de potenciales (el que se seguirá en todas las regiones)

1. Partir del **uso histórico** documentado de la zona, no del paisaje actual.
2. `labor` alto solo en vegas y campiñas; la meseta seca alta rara vez pasa de 3.
3. `pasto` distingue **verano** (sierra, sobre 1 200 m) e **invierno** (dehesa, vega baja); se anota
   cuál en los rasgos (`pasto-de-verano`, `pasto-de-invierno`).
4. `hierro` y `sal` solo donde hubo explotación real y documentada. Son los recursos que crean
   monopolios: regalarlos arruina el equilibrio.
5. `piedra` alto donde hubo canteras de fama (caliza de Sepúlveda, piedra de Lara).
6. Si un potencial se aparta de lo que sugiere el terreno, `nota` obligatoria con el motivo.

### 4.3 Población inicial

Proporcional al `labor` y a la importancia histórica de la cabecera, entre 20 y 120 vecinos.
Las ciudades (Burgos, Logroño, Calatayud) arrancan en la horquilla alta; las sierras, en la baja.

### 4.4 Revisión humana

Antes de cerrar la tarea se imprime `informeCobertura` de la región y se comprueba:

- ninguna comarca con suma de potenciales fuera de 6..18;
- entre 3 y 6 comarcas marcadas como origen, de perfiles distintos;
- exactamente dos comarcas con sal (Bureba y Sigüenza) y dos con hierro (Molina y Jiloca);
- ninguna zona de más de tres comarcas seguidas sin `labor >= 3` (nadie debe quedarse sin pan cerca).

## 5. Archivos

```
paquetes/mundo/catalogo/01-iberico-alto-duero.jsonc     (nuevo)
paquetes/mundo/datos/mundo.v1.json                      (regenerado con npm run atlas)
paquetes/mundo/datos/informe-atlas.md                   (regenerado)
```

## 6. Criterios de aceptación

1. Las 34 comarcas están escritas, validan sin errores y todas tienen `nota` donde el criterio lo
   exige.
2. `npm run atlas` regenera el mundo y **ninguna** comarca provisional queda rodeada solo por
   comarcas de la región: dentro de la región no quedan huecos. (La primera redacción hablaba del
   recuadro lon −4,2..−1,0; lat 40,5..42,8, pero ese rectángulo abarca también Navarra, la
   Alcarria, la sierra de Madrid y las Merindades, que son de otras regiones. Lo exigible es que
   no haya huecos, no que el recuadro esté lleno.)
3. Todas las localidades caen dentro del polígono de su comarca.
4. El informe de cobertura de la región cumple las cuatro comprobaciones de §4.4.
5. El grafo sigue conexo y ninguna comarca de la región queda con menos de dos vecinos.
6. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run atlas
npm run verificar
npx vitest run paquetes/mundo
```

Además, revisión visual: abrir el informe y comprobar que los nombres y cabeceras son correctos. Si
hay dudas sobre una comarca, es preferible dejarla con potenciales moderados y una nota que inventar
un dato.

## 8. Al terminar

1. Índice: T-012 `hecha`; `ESTADO.md`: siguiente T-013.
2. Anota en la bitácora cuántas comarcas reales lleva el catálogo y cuántas quedan provisionales.
3. Commit: `T-012: catalogo region 1, Sistema Iberico y Alto Duero`.

---

## 9. Resultado (18-09-2026)

Tarea cerrada. 151 tests en verde; el mundo pasa de 334 a **339 comarcas**, de las cuales **35 son
reales** (las 34 de la tabla más `alfoz-de-clunia`) y 304 siguen provisionales.

Entregado:

- `paquetes/mundo/catalogo/01-iberico-alto-duero.jsonc`: las 35 fichas, cada una con su `nota`
  explicando de dónde sale su potencial (Poza de la Sal, Imón, Sierra Menera, Ojos Negros, la
  caliza de Lara, la merina de Pedraza, el pinar de Urbión…). Ninguna comarca es un paraíso: las
  sumas de potencial van de 8 a 12.
- `paquetes/mundo/src/region-01.test.ts`: la revisión de §4.4 escrita como test, para que siga
  haciéndose sola cuando lleguen las regiones 2 a 10. Comprueba sal y hierro, orígenes, sumas de
  potencial, vecindades mínimas, ausencia de huecos provisionales y que nadie quede a más de tres
  jornadas de una comarca con pan.
- `paquetes/mundo/datos/mundo.v1.json` e `informe-atlas.md` regenerados.

Decisiones tomadas al escribir la región:

- **Una comarca más que la tabla**: `alfoz-de-clunia` (Huerta de Rey, Coruña del Conde, Caleruega,
  Hontoria del Pinar). Sin ella quedaba una comarca provisional rodeada por completo de comarcas
  reales, que es exactamente lo que la tarea quería evitar.
- **Seis orígenes con oficio distinto**: Alfoz de Burgos (plaza mercantil), La Bureba (sal),
  Señorío de Molina (hierro), Cameros (lana), Calatayud (huerta de regadío) y Tierra de Soria
  (mixta). Rioja Media y Sigüenza se dejaron fuera por repetir perfil con Calatayud y con la
  Bureba.
- **Seis localidades se cambiaron por otras vecinas** (Quintanar de la Sierra, Barbadillo,
  Anguiano, Peñaranda de Duero, Prádena, Magaña y Oyón) porque caían en el polígono de la comarca
  de al lado. El atlas lo detecta y lo dice con nombre y apellidos, que era justo para lo que se
  escribió esa comprobación en T-011.
- **`labor 4` solo en vega o llano**, que obliga a declarar como vega Ribera del Duero, Rioja Media,
  Rioja Baja y Calatayud, y como llano Rioja Alavesa y Campo de Borja. Es la regla del validador y
  coincide con la realidad: el pan bueno está en las vegas del Duero, el Ebro y el Jalón.

Lo que queda para las tareas siguientes: las ferias (Burgos) y el patrimonio son T-014; los caminos,
los puertos (Piqueras ya sale marcado como candidato) y las cañadas Soriana Occidental y Oriental
son T-013.
