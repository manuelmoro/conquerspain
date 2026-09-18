# T-014 · Ferias, patrimonio y rasgos de comarca

**Fase:** 1 · El mundo · **Depende de:** T-015 · **Estado:** **hecha** (18-09-2026)

> **Dependencia corregida el 18-09-2026.** De las diez ferias de `docs/05` §5.6, nueve están en
> comarcas que escribe T-015 (Medina, Villalón, Sevilla, Zafra, Verín, Lleida, Valencia, Santiago).
> Se hace después del catálogo completo.

## 1. Contexto

Las ferias son el calendario económico del juego y el punto de encuentro entre jugadores; los rasgos
son lo que hace que una comarca no sea intercambiable con otra. Ambos son contenido histórico con
efecto mecánico directo.

Lee antes: [docs/05-geografia.md](../05-geografia.md) §5.5 y §5.6,
[docs/03-economia.md](../03-economia.md) §3.10.

## 2. Objetivo

Cerrar el catálogo de rasgos, asignarlos a las comarcas ya escritas y definir las ferias con su
calendario, su volumen y sus recursos de referencia.

> **Pendiente heredado del catálogo (18-09-2026).** Los nombres del catálogo se escriben en ASCII
> (`Logronyo`, `Penyafiel`, `Corunya del Conde`), igual que el resto del código del repositorio,
> pero son **texto visible** y la interfaz tiene que enseñarlos con tildes y eñes. Esta tarea, que
> ya recorre comarca por comarca, hace esa pasada de ortografía sobre `nombre`, `cabecera`,
> `localidades[].nombre` y `nota`, y deja los `id` como están.

## 3. Alcance

**Entra:** catálogo cerrado de rasgos con su efecto, ferias del mapa con su calendario, validación y
asignación a las comarcas de la región 1 (las demás regiones los asignan en T-015).

**No entra:** la mecánica de mercado (T-037) ni la interfaz de ferias (T-084).

> **Heredado de T-015 §5 (18-09-2026).** La comprobación global «exactamente 3 ferias grandes»
> se mide en esta tarea, que es la que escribe las ferias, y se deja como test.

## 4. Diseño detallado

### 4.1 Catálogo de rasgos

| Rasgo | Efecto mecánico |
|---|---|
| `salinas-historicas` | Permite salina de nivel 3; +1 al potencial efectivo de sal |
| `vena-de-hierro` | Permite ferrería de nivel 3; el agotamiento del hierro baja a la mitad |
| `ferreria-de-agua` | Ferrerías un 25 % más baratas |
| `cantera-noble` | Obras mayores un 15 % más baratas y +20 % de prestigio al terminarlas |
| `pinar-maderable` | Aserraderos +1 de nivel máximo |
| `pasto-de-verano` | Válido para rebaños de mayo a septiembre |
| `pasto-de-invierno` | Válido para rebaños de octubre a abril |
| `dehesa` | `pasto-de-invierno` + el monte se agota a la mitad; roturar cuesta el doble |
| `marisma` | Sal y pesca; `labor` efectivo −1 |
| `vega-fluvial` | Permite acequia; la estación afecta un 50 % menos al pan |
| `ciudad-episcopal` | Requisito de catedral; +10 de lealtad de partida |
| `villa-de-feria` | Tiene feria (ver §4.2) |
| `puerto-de-mar` | Requisito de atarazana y de comercio marítimo |
| `camino-de-santiago` | +2 maravedís por turno y rumores más frecuentes |
| `calzada-romana` | Sus tramos empiezan con calidad de camino carretero |
| `vinyedo` | Permite bodega (futuro bien de lujo); +1 maravedí por turno |
| `montado` | Equivalente portugués de la dehesa (Alentejo) |

El catálogo es **cerrado**: añadir un rasgo nuevo exige apuntarlo aquí, en `rasgos.ts` y en
`docs/05-geografia.md`.

### 4.2 Ferias

```jsonc
{
  "id": "medina-mayo",
  "nombre": "Feria de Mayo de Medina del Campo",
  "comarca": "tierra-de-medina",
  "turnos": [10, 11],
  "volumen": "grande",           // pequena | mediana | grande
  "recursosDestacados": ["lana", "pan", "hierro"],
  "nota": "La mayor plaza de cambio de Castilla en el siglo XV."
}
```

Ferias iniciales: las diez de [docs/05-geografia.md](../05-geografia.md) §5.6. Cada una en una
comarca que exista y tenga el rasgo `villa-de-feria`.

Efecto del volumen: multiplica la liquidez de los mercaderes menores y el tope de casación por turno
(pequeña ×1, mediana ×3, grande ×8 sobre el mercado local).

### 4.3 Reglas de validación

1. Toda feria apunta a una comarca existente con `villa-de-feria`.
2. Los turnos están entre 1 y 24 y ninguna feria dura más de 2 turnos.
3. No hay más de tres ferias grandes en todo el mapa (si no, ninguna es importante).
4. Entre dos ferias grandes hay al menos 4 turnos de separación (para que se puedan encadenar rutas).
5. Todo rasgo asignado existe en el catálogo cerrado.
6. `salinas-historicas` y `vena-de-hierro` solo en comarcas con el potencial correspondiente ≥ 2.

### 4.4 Asignación en la región 1

Ferias: Burgos (turno 14) y, provisionalmente, Medina del Campo queda pendiente hasta que se escriba
la región 2. Rasgos que hay que asignar sí o sí en la región 1:

- `salinas-historicas`: Bureba (Poza de la Sal), Sigüenza (Imón).
- `vena-de-hierro`: Señorío de Molina (Sierra Menera), Jiloca (Ojos Negros).
- `ferreria-de-agua`: Valle del Aranda.
- `pinar-maderable`: Pinares, Alto Tajo, Ayllón.
- `pasto-de-verano`: Pinares, Cameros, Demanda, Albarracín, Tierras Altas, Pedraza.
- `cantera-noble`: Tierra de Lara, Sepúlveda.
- `ciudad-episcopal`: El Burgo de Osma, Sigüenza, Burgos, Calahorra.
- `camino-de-santiago`: Montes de Oca, Valle del Oja, Najerilla, Rioja Media.
- `vega-fluvial`: Rioja Media, Rioja Baja, Calatayud, Ribera del Duero.
- `vinyedo`: Ribera del Duero, Rioja Alavesa, Rioja Media.

## 5. Archivos

```
paquetes/mundo/src/rasgos.ts                       (catálogo cerrado con sus efectos)
paquetes/mundo/catalogo/ferias.jsonc               (nuevo)
paquetes/mundo/catalogo/01-iberico-alto-duero.jsonc (se completan los rasgos)
paquetes/mundo/src/validarFerias.ts                (nuevo)
```

## 6. Criterios de aceptación

1. Los 17 rasgos están definidos con su efecto y todos se usan al menos una vez en el mapa o quedan
   justificados como pendientes de otras regiones.
2. Las ferias de la región y el calendario validan las cinco reglas de §4.3 (test por regla).
3. Las asignaciones de §4.4 están hechas y validadas.
4. El informe de cobertura muestra las ferias por región y los rasgos por tipo.
5. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run atlas
npm run verificar
npx vitest run paquetes/mundo
```

## 8. Al terminar

1. Índice: T-014 `hecha`; `ESTADO.md`: siguiente T-015.
2. Actualiza `docs/05-geografia.md` §5.5 con el catálogo definitivo de rasgos si ha cambiado.
3. Commit: `T-014: rasgos de comarca y ferias`.

---

## 9. Resultado (18-09-2026)

Tarea cerrada. 262 tests en verde. El mapa tiene sus **once ferias** —tres grandes: las dos de
Medina del Campo y la de Sevilla— repartidas por nueve comarcas y ocho regiones, y los
**diecisiete rasgos** del catálogo cerrado están todos en uso.

Entregado:

- `paquetes/mundo/catalogo/ferias.jsonc` y `paquetes/mundo/src/validarFerias.ts`: las ferias con
  su calendario, su volumen y su nota, y las seis reglas de §4.3 con un test cada una
  (`paquetes/mundo/src/ferias.test.ts`).
- Rasgo `villa-de-feria` en las nueve comarcas con feria y `pinar-maderable` en la Serranía de
  Ayllón, que faltaba de §4.4.
- El informe del atlas lista las ferias y cuenta los rasgos por tipo; `docs/05` §5.5 y §5.6
  recogen las tablas definitivas.
- **Pasada de ortografía de los nombres visibles**: 598 sustituciones en nombres de comarca,
  cabeceras, localidades, ferias, puertos, calzadas y cañadas (Logroño, Sigüenza, Ávila, Àger,
  Guimarães, Setúbal…), cada una en la lengua de su tierra. Los `id` siguen en ASCII.

Decisiones tomadas al implementar:

- **Las ferias salen de la ficha de la comarca** a su propio archivo. `ComarcaCatalogo` pierde el
  campo `feria`, y en el mundo generado `ComarcaMundo.feria` pasa a ser `ferias`, una lista: Medina
  del Campo y Sevilla tuvieron dos ferias al año, y con un solo hueco una de ellas se perdía.
- **Sevilla se parte en dos ferias** (primavera, grande; San Miguel, mediana), porque la regla 2
  impide que una feria dure más de dos turnos seguidos y los turnos 6 y 21 no lo son.
- **`puerto-de-mar` no exige terreno de costa**: es la solución que se dio en T-015 a las huertas
  con puerto (València, Gandia, Sanlúcar), y la regla 6 no la contradice.
- **Las notas del catálogo quedan en ASCII** y pasan a una tarea propia,
  [T-016](T-016-ortografia-de-las-notas.md). Son unas 450 notas en prosa, y una corrección
  automática deja errores sistemáticos (los pretéritos: «fundo» por «fundó», «bajo» por «bajó»)
  que solo se evitan revisándolas una a una. Los nombres, que son lo que la interfaz enseña en el
  atlas, sí quedan corregidos.
