# T-010 · Esquema del catálogo y cargador validado

**Fase:** 1 · El mundo · **Depende de:** T-003 · **Estado:** pendiente

## 1. Contexto

El catálogo geográfico es la fuente de verdad del tablero y se escribe a mano, región por región.
Antes de escribir ni una comarca hay que fijar su formato y su validación: si el formato cambia a
mitad del catálogo, hay que revisar cientos de fichas.

Lee antes: [docs/05-geografia.md](../05-geografia.md) §5.2, §5.5 y §5.6,
[docs/07-arquitectura.md](../07-arquitectura.md) §7.3.

## 2. Objetivo

Definir el formato del catálogo (`.jsonc` por región), su validador y el cargador tipado del paquete
`@conquer/mundo`, con mensajes de error que señalen la comarca y el campo culpables.

## 3. Alcance

**Entra:** esquema, validador, cargador, informe de cobertura del catálogo, y una región de ejemplo
de tres comarcas **ficticias** para probar (las reales las escribe T-012).

**No entra:** generación del mapa (T-011), datos reales (T-012 y T-015), caminos (T-013).

## 4. Diseño detallado

### 4.1 Archivos del catálogo

```
paquetes/mundo/catalogo/
  00-ejemplo.jsonc          región de prueba, no entra en el mundo real
  01-iberico-alto-duero.jsonc
  02-meseta-norte.jsonc
  …
```

Se usa `.jsonc` **con comentarios**: cada decisión discutible (por qué esta comarca tiene `sal 3`)
lleva su comentario al lado. Es documentación viva del criterio geográfico.

### 4.2 Ficha de comarca

```jsonc
{
  "id": "pinares-soria",              // minúsculas, sin tildes, único en todo el catálogo
  "nombre": "Pinares",                // nombre tradicional; si no existe, "Tierra de <cabecera>"
  "cabecera": "Covaleda",
  "region": "01-iberico-alto-duero",
  "centro": [-2920, 41920],           // milésimas de grado (lon, lat)
  "terreno": "sierra",
  "potenciales": { "labor": 1, "monte": 5, "pasto": 4, "piedra": 2, "hierro": 0, "sal": 0, "pesca": 0 },
  "solares": 6,                       // 4..8
  "poblacionInicial": 40,             // 20..120
  "localidades": [
    { "nombre": "Covaleda", "coord": [-2879, 41934], "cabecera": true },
    { "nombre": "Duruelo de la Sierra", "coord": [-2931, 41955] }
  ],
  "rasgos": ["pinar-maderable", "pasto-de-verano"],
  "feria": null,
  "esOrigen": true,
  "nota": "Pinar de Urbión: la madera fue su economía real durante siglos."
}
```

### 4.3 Reglas del esquema (las comprueba el validador)

1. `id` único, en minúsculas, sin tildes ni eñes, formato `nombre-provincia` o `nombre`.
2. `centro` dentro del recuadro peninsular (lon −9600..3450, lat 35850..43900) y **dentro de tierra**
   (se comprueba contra la costa en T-011; aquí solo el recuadro).
3. Exactamente una localidad con `cabecera: true`, y su nombre coincide con el campo `cabecera`.
4. Entre 1 y 6 localidades; todas con coordenadas a menos de 60 km del centro.
5. Potenciales: enteros 0..5. Reglas de coherencia:
   - `sal >= 3` exige el rasgo `salinas-historicas`;
   - `hierro >= 3` exige el rasgo `vena-de-hierro`;
   - `pesca >= 1` exige `terreno: "costa"`;
   - `labor >= 4` exige `terreno` `llano` o `vega`;
   - suma de potenciales entre 6 y 18 (ninguna comarca es un paraíso ni un erial).
6. `solares` coherente con la suma de potenciales: `4 + floor(suma / 5)`, con ±1 de margen editorial.
7. `rasgos` del catálogo cerrado de rasgos (`paquetes/mundo/src/rasgos.ts`).
8. `feria`, si existe, con turnos válidos (1..24) y nombre único.
9. `nota` obligatoria si algún potencial se aparta de lo que sugiere el terreno: hay que justificar.

### 4.4 Cargador

```ts
export function cargarCatalogo(directorio: string): Resultado<ComarcaCatalogo[]>;
export function cargarMundo(ruta: string): Resultado<Mundo>;      // mundo.vN.json ya generado
export function informeCobertura(comarcas: ComarcaCatalogo[]): InformeCobertura;
```

`InformeCobertura` dice, por región: número de comarcas, media de potenciales, cuántas son origen,
cuántas tienen feria, y qué recursos estratégicos (sal, hierro, pesca) aparecen y dónde. Es la
herramienta para ver de un vistazo si una región ha quedado desequilibrada.

### 4.5 Errores legibles

```
catalogo/01-iberico-alto-duero.jsonc:
  · pinares-soria → potenciales.sal = 3 pero falta el rasgo "salinas-historicas"
  · tierra-de-soria → hay dos localidades marcadas como cabecera
  · almazan → nota obligatoria: labor 4 en terreno "ondulado"
```

## 5. Archivos

```
paquetes/mundo/package.json, tsconfig.json
paquetes/mundo/src/{tipos,rasgos,cargador,validarCatalogo,cobertura,index}.ts
paquetes/mundo/src/*.test.ts
paquetes/mundo/catalogo/00-ejemplo.jsonc
```

## 6. Criterios de aceptación

1. El catálogo de ejemplo (3 comarcas ficticias) carga y valida sin errores.
2. Hay un test por cada regla de §4.3 que comprueba que una ficha mal hecha **falla** con el mensaje
   correcto y señalando la comarca.
3. `informeCobertura` devuelve cifras correctas sobre el catálogo de ejemplo (test con valores
   esperados escritos a mano).
4. El cargador no acepta comentarios mal formados ni duplicados de `id`, y lo dice con la línea.
5. El paquete `@conquer/mundo` solo depende de `@conquer/nucleo` (tipos).
6. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/mundo
```

## 8. Al terminar

1. Índice: T-010 `hecha`; `ESTADO.md`: siguiente T-011.
2. Si has cambiado el formato respecto a `docs/05-geografia.md` §5.2.1, actualiza ese documento.
3. Commit: `T-010: esquema del catalogo y cargador validado`.
