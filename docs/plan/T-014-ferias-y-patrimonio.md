# T-014 · Ferias, patrimonio y rasgos de comarca

**Fase:** 1 · El mundo · **Depende de:** T-015 · **Estado:** pendiente

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

## 3. Alcance

**Entra:** catálogo cerrado de rasgos con su efecto, ferias del mapa con su calendario, validación y
asignación a las comarcas de la región 1 (las demás regiones los asignan en T-015).

**No entra:** la mecánica de mercado (T-037) ni la interfaz de ferias (T-084).

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
