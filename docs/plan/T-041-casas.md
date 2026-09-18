# T-041 · Casas: privilegios y herramientas

**Fase:** 2 · Motor · **Depende de:** T-035, T-037 · **Estado:** hecha

## 1. Contexto

Aquí se juega la asimetría, que es lo que hace que una partida se parezca a VGA Planets y no a un
juego de construir pueblos. Cada casa tiene que cambiar **reglas**, no multiplicar números.

Lee antes: [docs/04-casas-y-tradiciones.md](../04-casas-y-tradiciones.md) entero.

## 2. Objetivo

Un sistema de modificadores de casa limpio, con las ocho casas implementadas, probadas una a una, y
sin que el motor se llene de condicionales por casa.

## 3. Alcance

**Entra:** infraestructura de modificadores, las ocho casas con su privilegio, su herramienta y su
límite, y la elección de casa al crear la partida.

**No entra:** tradiciones (T-042), equilibrio fino (T-047), lo que dependa de mecánicas de conflicto
(queda desactivado y documentado).

**Heredado de T-038.** La fuente de influencia por monasterio (`reglas/influencia.ts`) da hoy +2 solo
a quien tuvo la comarca (`EstadoComarca.exDuenyo`), porque una obra mayor no guarda quién la
levantó y solo se levanta en comarca propia. Si el contrato de obra de los canteros o los monjes
permite obras en comarca ajena o neutral, hay que guardar el autor de la obra y ampliar esa fuente.

**Heredado de T-040.** La Mesta ya tiene efecto de rebaños: `permisos.pasoFrancoPorCanyada` lo lee
`puedeEntrar` (`reglas/rebanyos.ts`) para cruzar comarcas ajenas por cañada, y
`modificadores.lanaEsquileoMil` lo multiplica el esquileo (`reglas/esquileo.ts`). Faltan en la tabla
real de la Mesta el `lanaEsquileoMil` de 1250 y el coste de rebaño a mitad de precio
(`costeRebanyoMil`, que hoy solo aplica el servidor al reservar el coste de `formar-rebanyo`).

**Heredado de T-034.** Los monjes fundan puebla con la mitad de gente: hoy
`cometidos.vecinosParaPuebla` (10) es igual para todas las casas y `impedimentoDePuebla`
(`reglas/poblar.ts`) no consulta la casa; hay que añadir el modificador. `pasoRecuaMil` es aditivo
(arrieros: +1000) y `porteExtra` ya entra en el porte de las recuas. **De T-035:** la fase de obras
ya aplica `solaresExtra`, `nivelMaximoEdificio`, `potencialMinimoEdificio`,
`obraSinFrenazoInvernal`, `obraMayorAvanceMil` y `obraMayorCosteMil`; falta darles valor por casa.

## 4. Diseño detallado

### 4.1 Cómo se modelan

Nada de `if (casa === …)` en el motor. Cada casa es **una fila de una tabla** (`src/datos/casas.ts`)
sobre puntos de extensión genéricos —números, permisos y prohibiciones— que las fases ya consultan a
través de `ctx.reglas.casas[casa]`. Los nombres de las casas solo aparecen en esa tabla y en la
enumeración de `tipos/reglas.ts`; lo que no es un número vive en `src/reglas/casas/`
(`origenes.ts`, `costes.ts`, `letra.ts`). La tabla de ejemplo de las pruebas (`tablasDeEjemplo`)
sigue con las ocho casas neutrales, para que los tests de cada fase no dependan del equilibrio real.

`Modificadores` (ya en `tipos/reglas.ts`) gana siete puntos de extensión:

| Campo | Qué cambia | Neutro |
|---|---|---|
| `produccionEdificioMil` | producción de un edificio concreto (la lonja) | 1000 |
| `produccionEdificioEnVegaMil` | producción de un edificio en comarca de vega | 1000 |
| `laborFueraDeVegaMil` | pan de la labor en comarcas sin vega ni río | 1000 |
| `edificiosPorRequisito` | niveles de un edificio que sostiene cada nivel de su requisito (la ferrería de la carbonera) | 1 |
| `costeObraMayorMil` | coste de una obra mayor concreta | 1000 |
| `capacidadPorCasasExtra` | vecinos que suma cada nivel de casas, además de los de la tabla | 0 |
| `vecinosParaPueblaMil` | gente que hace falta para fundar puebla | 1000 |

### 4.2 Las ocho casas

Privilegio (P), herramienta (H) y límite (L). ✔ = funciona hoy; ⏸ = desactivado y documentado.

| Casa | Qué hace | Estado |
|---|---|---|
| **Mesta** | P: paso franco por cañada en tierra ajena. H: rebaño a mitad de precio y +25 % de lana. L: no rotura y su pan es un 30 % menor | ✔ |
| **Ferrones** | P: ferrería con hierro ≥ 1 y una carbonera sostiene dos niveles. H: aperos de nivel 4. L: el monte se agota un 50 % más rápido. Vender aperos a otro jugador | ✔ · venta ⏸ (T-103) |
| **Canteros** | H: obras mayores −25 % de coste, +30 % de avance y sin frenazo de invierno. L: un solar menos. Contrato de obra en comarca ajena | ✔ · contrato ⏸ (T-103) |
| **Mercaderes** | P: letra de cambio (3 % y un turno). L: un solar menos y el pan un 25 % menor. Corresponsales y rumores | ✔ · corresponsales ⏸ (T-044) |
| **Monjes** | P: puebla con la mitad de gente y lealtad mínima 50. H: monasterio un 30 % más barato. L: sin carga fiscal dura ni portazgos. Carta puebla gratis | ✔ · portazgo ⏸ (T-103) · carta gratis ⏸ (T-047, hoy no cuesta nada) |
| **Salineros** | P: salinas +50 % y pan sin merma. H: lonja +50 %. L: sus explotaciones de tierra rinden poco (niveles máximos menores) | ✔ |
| **Arrieros** | H: recua −40 % de coste, +1 jornada y +5 de porte. L: −1 vecino por nivel de casas y sin catedral. Portazgo propio | ✔ · portazgo ⏸ (T-103) |
| **Hortelanos** | P: acequia menor (el pan sin factor de estación). H: huerta de nivel 4 y +50 % en vega. L: labor −25 % fuera de vega o río | ✔ |

Lo que exige a otro jugador (contratos de aperos y de obra, portazgo) queda **desactivado hasta
T-103**, cuando exista el contrato entre jugadores; los permisos que lo habilitan ya están en la
tabla (`venderAperos`, `obraEnComarcaAjena`, `cobrarPortazgo`) pero ninguna fase los lee.

### 4.3 Lo que faltaba en el motor

1. **Aperos.** Nadie los instalaba (solo se pagaba su mantenimiento). Orden nueva `aperos`: sube un
   nivel de aperos en una comarca propia, hasta `aperosMaximo` de la casa (3 de partida, 4 los
   ferrones); cuesta lo que reserva la orden (8 de hierro) y es inmediata.
2. **Edificio `acequia`** (la acequia menor): obra corta de un nivel, que solo pueden levantar las
   casas con `acequiaMenor` (`DatosEdificio.exigePermiso`). En una comarca con acequia, el pan de las
   explotaciones estacionales no sufre el factor de estación (sin el +50 % de la acequia mayor).
3. **Letra de cambio.** Orden `letra-de-cambio { recua, cantidad }`, solo con `letraDeCambio`: pasa
   maravedís del almacén a la carga de una recua que esté en una comarca con plaza, con un 3 % de
   comisión y **un turno de demora**; si la recua ya no existe o no está en una plaza, se devuelve
   entera.
4. **Prohibiciones** que se comprueban al empezar la orden, con motivo `prohibido-por-la-casa`:
   `roturar`, `cargaFiscalDura` (la política) y `catedral` (la obra mayor).
5. **`lealtadMinima`** como suelo de la lealtad de sus comarcas (el cambio `lealtad` no baja de ahí).
6. **Costes.** `costeDeEdificio`, `costeDeObraMayor`, `costeDeRecua` y `costeDeRebanyo` (funciones
   puras en `reglas/casas/costes.ts`) dicen lo que cuesta cada cosa a cada casa: es lo que reservará
   el servidor al dar la orden (T-062) y lo que muestra la interfaz.

### 4.4 Elección de casa y sorteo de orígenes

La casa se fija al crear la partida. `DatosCasa.potencialesDeOrigen` se sustituye por
`origenes: readonly CriterioDeOrigen[]` (basta con cumplir uno): potenciales mínimos, un rasgo de
una lista, un terreno o un potencial en una vecina. `sortearOrigenes(mundo, casa, semilla, reglas)`
filtra las comarcas `esOrigen` por esos criterios y elige **tres de perfiles distintos** (el
potencial que más destaca; si no bastan, otra región; y si tampoco, las que haya), con azar de
ámbito `'origen'`, sin depender del orden de las claves.

### 4.5 Reglas transversales

- Un modificador **nunca** salta un invariante: producción ×0, coste ×0 o merma 0 no dejan
  almacenes negativos ni estados inválidos (hay test con una casa que lo pone todo a cero).
- Ningún archivo de `src/` fuera de `datos/casas.ts`, `tipos/reglas.ts` y `reglas/casas/` nombra una
  casa en el código (test que lo busca, sin contar comentarios).

## 5. Archivos

```
paquetes/nucleo/src/datos/casas.ts
paquetes/nucleo/src/reglas/casas/{origenes,costes,letra}.ts
paquetes/nucleo/src/fases/{02-produccion,03-consumo,05-cometidos,06-obras,07-mercado,08-territorio}.ts
paquetes/nucleo/src/reglas/{produccion,insumos,obras,poblar,roturar}.ts
paquetes/nucleo/src/{cambios,ordenes}.ts   src/tipos/{ordenes,reglas}.ts   src/datos/edificios.ts
paquetes/nucleo/src/validacion/{validarOrden,validarTablas}.ts
paquetes/nucleo/pruebas/{casas,origenes}.test.ts   pruebas/ejemplos.ts
```

## 6. Criterios de aceptación

1. Las ocho casas están en la tabla real con su privilegio, su herramienta y su límite, y la tabla
   valida.
2. Cada casa tiene un test de escenario que demuestra que su mecánica funciona y que su límite duele.
3. Ningún archivo del motor fuera de `datos/casas.ts`, `tipos/reglas.ts` y `reglas/casas/` nombra una
   casa (test de código).
4. Un modificador mal puesto (producción ×0, costes ×0) no rompe invariantes.
5. El sorteo de orígenes filtra por casa, ofrece tres perfiles distintos y es reproducible; se prueba
   con el mundo real.
6. Lo que depende de otro jugador queda documentado como desactivado, con el permiso en la tabla.
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/pruebas/casas.test.ts paquetes/nucleo/pruebas/origenes.test.ts
npm run partidas
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-042). Si alguna casa ha cambiado respecto al diseño, actualiza
`docs/04-casas-y-tradiciones.md`. Commit: `T-041: casas de oficio con sus privilegios`.

## 9. Resultado (19-09-2026)

Tarea cerrada. 706 tests en verde (62 nuevos); las partidas de reproducción no cambian de huella.

- `datos/casas.ts`: las ocho casas con su privilegio, su herramienta y su límite sobre una base
  neutra; `reglas/casas/index.ts` (`modificadoresDe`, `permisosDe`, `prohibicionesDe`),
  `costes.ts` (lo que reserva el servidor) y `origenes.ts` (el sorteo de origen).
- `Modificadores` gana siete puntos de extensión genéricos; `DatosCasa.potencialesDeOrigen` se
  sustituye por `origenes` (criterios alternativos); `DatosEdificio` gana `exigePermiso`.
- Mecánicas nuevas en el motor: orden `aperos` (que nadie instalaba), edificio `acequia`, orden
  `letra-de-cambio` (fase 7, con un turno de demora) y las prohibiciones de roturar, de carga fiscal
  dura y de catedral.
- Enganches genéricos: producción (por edificio, por vega y sed de la labor, acequia menor), insumos
  (`edificiosPorRequisito`), suelo de lealtad, capacidad por casas, gente para fundar puebla, coste
  de obra mayor por tipo y agotamiento del monte.
- Pruebas en `pruebas/casas.test.ts` (una por privilegio, herramienta y límite de cada casa, más la
  tabla, los invariantes, el test de código y el de lo desactivado) y `pruebas/origenes.test.ts`
  (con el mundo real). Seis mutaciones del código —nombrar una casa en una fase, leer un permiso
  desactivado, quitar el suelo de lealtad, quitar la prohibición de roturar, ignorar el perfil o el
  filtro del sorteo— hacen fallar los tests.

Defectos que los tests destaparon y se corrigieron aquí:

- **El límite de los ferrones no existía**: el modificador `agotamientoMonteMil` de la casa no lo
  leía nadie (solo el de la dehesa). Ahora lo lee `siguienteAgotamiento`.
- **Nadie instalaba aperos**: solo se pagaba su mantenimiento. Nace la orden `aperos`.
- **La ferrería costaba hierro 1 a todas las casas**, con lo que el privilegio de los ferrones no
  existía: la tabla pasa a hierro 2, como dice el diseño.

Decisiones tomadas al implementar (escritas en docs/04 §4.1.9):

- **Las casas son datos, no código**: el motor solo consulta números, permisos y prohibiciones, y un
  test impide nombrar una casa fuera de `datos/casas.ts`, `tipos/reglas.ts` y `reglas/casas/`.
- **Lo que necesita a otro jugador queda desactivado hasta T-103** (vender aperos, contrato de obra,
  portazgo), con el permiso en la tabla y un test que garantiza que ninguna fase lo lee. La ficha
  pedía «contratos internos» ya aquí; sin contrato entre jugadores no había nada verificable.
- **La carta puebla gratis no tiene efecto**: en el motor un fuero no cuesta nada. Se queda anotado
  para el equilibrio (T-047).
- **La tabla de las pruebas sigue con casas neutrales** (`tablasDeEjemplo`): los tests de cada fase no
  dependen del equilibrio real, y las casas de verdad se prueban con `{ ...reglas, casas: CASAS_DE_OFICIO }`.
- **Salineros**: «atado al agua» se traduce en niveles máximos menores de las explotaciones de
  tierra; el transporte sin bastimento extra no se modela.
- **Orígenes**: cada casa pide una o varias condiciones alternativas sobre potenciales, rasgos,
  terreno o una vecina (los ferrones, hierro aquí o cerca). Hay entre 6 y 26 orígenes posibles por
  casa en el mundo real.

