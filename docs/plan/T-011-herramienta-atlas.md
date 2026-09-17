# T-011 · Herramienta `atlas`: generación reproducible del mapa

**Fase:** 1 · El mundo · **Depende de:** T-010 · **Estado:** pendiente

## 1. Contexto

La maqueta v0.1 ya demostró el método (Natural Earth → proyección → Voronoi recortado a la costa →
grafo). Lo que existe es un script de Python de usar y tirar. Ahora hace falta la versión seria:
en TypeScript, reproducible, verificable y con validaciones geográficas de verdad.

Referencia del método probado: `maqueta/tools/build_atlas.py`.
Lee antes: [docs/05-geografia.md](../05-geografia.md) §5.8 y §5.3.

## 2. Objetivo

Un comando (`npm run atlas`) que, a partir del catálogo y de las fuentes abiertas, genere
`paquetes/mundo/datos/mundo.v1.json` de forma reproducible byte a byte, con un informe legible de lo
generado y validaciones que impidan publicar un mapa incoherente.

## 3. Alcance

**Entra:** descarga con caché verificada, proyección, polígonos, grafo de vecindad, terreno de los
tramos, informe, validaciones y salida versionada.

**No entra:** contenido del catálogo (T-012 y T-015), caminos históricos y cañadas (T-013), ferias y
patrimonio (T-014), dibujo en el cliente (T-081).

## 4. Diseño detallado

### 4.1 Fuentes

| Fuente | Uso | Licencia |
|---|---|---|
| Natural Earth 10m `admin_0_countries` | Costa de España, Portugal, Andorra, Gibraltar y tierra vecina | Dominio público |
| Natural Earth 10m `rivers_lake_centerlines` | Ríos principales (Duero, Ebro, Tajo, Guadiana, Guadalquivir, Miño, Segre) | Dominio público |
| Natural Earth 10m `geography_regions_elevation_points` (opcional) | Referencia de relieve para el dibujo | Dominio público |

Descarga a `herramientas/atlas/cache/` (ignorada por git), con **hash SHA-256 esperado** anotado en
`fuentes.json`. Si el hash no coincide, el proceso se detiene: el mapa no cambia por sorpresa porque
alguien haya actualizado un fichero río arriba.

Modo sin red: si la caché está completa, no se descarga nada. El proceso debe poder ejecutarse
entero sin conexión.

### 4.2 Proyección

La misma de la maqueta, documentada como parte del formato:

```
x = (lon − LON0) × cos(40,2°) × 100
y = (LAT1 − lat) × 100
LON0 = −9,6   LAT1 = 43,85
```

1 unidad ≈ 1,11 km. Las coordenadas de salida son **enteros** (se redondea al final, una sola vez).

### 4.3 Pasos

1. **Leer catálogo** con el cargador de T-010. Cada comarca aporta su semilla (su `centro`).
2. **Relleno automático**: donde no haya comarcas del catálogo, se colocan semillas en malla
   hexagonal de 40,5 unidades con perturbación determinista (semilla fija `1492`), descartando las
   que caigan en el mar o a menos de 27 unidades de una semilla del catálogo.
   Estas comarcas se marcan `provisional: true` y llevan nombre generado `sin-nombre-###`: son el
   relleno que las tareas de catálogo irán sustituyendo.
3. **Voronoi** recortado al polígono de tierra (España peninsular + Portugal continental + Andorra +
   Gibraltar).
4. **Simplificación** de los polígonos resultantes (Douglas-Peucker, tolerancia 0,7 unidades).
5. **Grafo de vecindad**: vecinos de Voronoi, filtrando los que solo se tocan por mar (se comprueba
   que el segmento que une los centros cruza tierra al menos un 60 % de su longitud).
6. **Terreno del tramo**: el más duro de las dos comarcas; los tramos que cruzan una divisoria
   marcada en `relieve.jsonc` se marcan como candidatos a puerto de montaña (los confirma T-013).
7. **Salida**: `mundo.v1.json` con claves ordenadas y sin espacios (mismo `canonico` del núcleo), más
   `informe-atlas.md` legible.

### 4.4 Validaciones que detienen el proceso

1. Ninguna comarca sin vecinos.
2. Ninguna comarca con polígono de área nula o menor de 200 unidades cuadradas.
3. Todas las localidades del catálogo dentro del polígono de su comarca (si una cae fuera, se dice
   cuál y a qué comarca ha ido a parar: casi siempre significa que el centro está mal puesto).
4. Grafo conexo: se puede ir andando de cualquier comarca peninsular a cualquier otra.
5. Sin identificadores duplicados.
6. El número total de comarcas está entre 300 y 380.

### 4.5 Informe

`informe-atlas.md` (se versiona en git) con: número de comarcas por región, cuántas son provisionales,
cobertura de recursos estratégicos, comarcas con más y menos vecinos, y la lista de tramos marcados
como candidatos a puerto. Es lo que se lee para saber cómo va el mapa sin abrir un JSON de 3 MB.

### 4.6 Reproducibilidad

```bash
npm run atlas          # genera
npm run atlas -- --comprobar   # genera en memoria y compara con el fichero; falla si difiere
```

El modo `--comprobar` se ejecuta en `npm run verificar` para que nadie edite el mundo a mano.

## 5. Archivos

```
herramientas/atlas/package.json, tsconfig.json
herramientas/atlas/src/{descargar,proyeccion,voronoi,recorte,grafo,terreno,informe,generar}.ts
herramientas/atlas/src/*.test.ts
herramientas/atlas/fuentes.json
herramientas/atlas/relieve.jsonc        (divisorias y sierras principales, a mano)
paquetes/mundo/datos/mundo.v1.json      (generado)
paquetes/mundo/datos/informe-atlas.md   (generado)
```

Dependencias permitidas en la herramienta (no en el núcleo): `d3-delaunay` para el Voronoi.

## 6. Criterios de aceptación

1. `npm run atlas` genera el mundo en menos de 60 segundos, sin red si la caché está presente.
2. Dos ejecuciones seguidas producen ficheros **idénticos** (comparación por hash).
3. `npm run atlas -- --comprobar` falla si se edita el JSON a mano (se prueba y se documenta).
4. Las seis validaciones de §4.4 tienen test con un caso que las dispara.
5. El informe se genera y contiene las secciones descritas.
6. El mundo generado carga con `cargarMundo` sin errores y el grafo es conexo.
7. Las coordenadas del JSON son todas enteras.
8. `npm run verificar` pasa (incluye `--comprobar`).

## 7. Verificación

```bash
npm run atlas
npm run atlas -- --comprobar
npm run verificar
```

## 8. Al terminar

1. Índice: T-011 `hecha`; `ESTADO.md`: siguiente T-012.
2. Anota en la bitácora el número de comarcas generadas y cuántas son provisionales.
3. Commit: `T-011: herramienta atlas y mundo v1 generado`.
