# T-016 · Ortografía de las notas del catálogo

**Fase:** 1 · El mundo · **Depende de:** T-014 · **Estado:** **hecha** (18-09-2026)

## 1. Contexto

Las notas del catálogo (`nota` en cada comarca, feria, puerto y ruta) se escribieron en ASCII,
igual que el código del repositorio: «La vega del Nalon es la unica tierra de labor de verdad…».
Son texto visible —el jugador las lee en la ficha de la comarca— y CLAUDE.md §2 pide tildes y eñes
en todo el texto visible. T-014 corrigió los nombres; esta tarea corrige las notas.

Lee antes: [T-014](T-014-ferias-y-patrimonio.md) §9 (por qué se separó) y
[docs/09-glosario.md](../09-glosario.md).

## 2. Objetivo

Todas las notas de `paquetes/mundo/catalogo/*.jsonc` con la ortografía correcta del español (y del
catalán, gallego, portugués o vasco en los nombres propios que citen), sin cambiar su contenido.

## 3. Alcance

**Entra:** el campo `nota` de las diez regiones, `ferias.jsonc` y `caminos.jsonc`.

**No entra:** los comentarios `//` de los archivos (siguen el estilo ASCII del código), los `id` ni
los rasgos, que son claves de datos.

## 4. Diseño detallado

1. Primera pasada automática solo para lo inequívoco: la ñ escrita como `ny` en palabras
   castellanas (`anyo`, `montanya`, `canyada`, `senyorio`, `Espanya`) y las palabras que no
   existen sin tilde (`economia`, `historico`, `romanico`), contrastadas con el diccionario
   `es_ES` de hunspell que hay en `/usr/share/hunspell/`.
2. Segunda pasada **a mano, nota por nota**: pretéritos (`fundó`, `bajó`, `llegó`), `más`/`mas`,
   `sí`/`si`, y los nombres propios citados dentro de la nota con la misma ortografía que ya tienen
   en el catálogo tras T-014.
3. Una prueba que impida volver atrás: ninguna nota puede contener las secuencias ASCII más
   delatoras (`anyo`, `montanya`, `canyada`, `senyor`, `historic`), y ningún nombre de comarca
   citado en una nota puede aparecer sin su tilde.

## 5. Archivos

```
paquetes/mundo/catalogo/*.jsonc     (solo el campo nota)
paquetes/mundo/src/catalogo.test.ts (la prueba de §4.3)
```

## 6. Criterios de aceptación

1. Ninguna nota contiene palabras castellanas con la ñ escrita como `ny` ni sin su tilde.
2. La prueba de §4.3 pasa y falla si se reintroduce una nota en ASCII.
3. `npm run atlas` regenera el mundo y `npm run verificar` pasa.

## 7. Verificación

```bash
npm run atlas
npm run verificar
```

## 8. Al terminar

1. Índice: T-016 `hecha`; `ESTADO.md`: fase 1 cerrada, siguiente T-030.
2. Commit: `T-016: ortografia de las notas del catalogo`.

---

## 9. Resultado (18-09-2026)

Tarea cerrada. 264 tests en verde. Las **451 notas** del catálogo están escritas con su ortografía
—tildes, eñes y los nombres propios en la lengua de su tierra— y una prueba impide volver atrás.

Cómo se hizo:

1. **Pasada automática conservadora** (352 notas): la ñ escrita como `ny` con una lista explícita
   de 81 palabras —dejando intactas las catalanas que la llevan de verdad (Cerdanya, Matarranya,
   Ontinyent, Penyagolosa)— y las palabras que el diccionario `es_ES` de hunspell solo conoce con
   tilde. Solo se cambiaba una palabra si no existía sin tilde y tenía un único candidato.
2. **Dos pasadas a mano sobre las 451 notas leídas enteras**: pretéritos (`fundó`, `mandó`,
   `entró`, `trabajó`, `cambió`), imperfectos (`vendía`, `salía`, `surtían`), `él` pronombre,
   `está` verbo, `sí` enfático, `aún` por «todavía», y nombres propios (Ávila, Júcar, Setúbal,
   São Mamede, Marão). Tres correcciones del automático se deshicieron a mano: `Rio Maior` es
   portugués y no lleva tilde, y `Ria Formosa` tampoco.
3. **Guarda en `catalogo.test.ts`**: ninguna nota ni nombre visible puede contener las formas
   ASCII delatoras (`anyo`, `montanya`, `canyada`, `historico`, `aqui`, `Avila`…), con límites de
   palabra Unicode porque en JavaScript `\b` corta en cada letra acentuada.

Los comentarios `//` de los archivos siguen en ASCII, como el resto del código del repositorio.
