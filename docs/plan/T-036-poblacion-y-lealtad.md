# T-036 · Fases 8–9: población, lealtad, fueros y administración

**Fase:** 2 · Motor · **Depende de:** T-032 · **Estado:** **hecha** (18-09-2026)

## 1. Contexto

La población es el recurso que más tarda en crecer y el que más manda: sin vecinos no hay mano de
obra, ni cuadrillas, ni recuas. La lealtad es el freno del que se expande sin cuidar lo suyo.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.6 y §3.9.

## 2. Objetivo

Implementar crecimiento, migración, lealtad con todas sus fuentes, fueros, carga fiscal, coste de
administración y traslado de la corte.

## 3. Alcance

**Entra:** todo lo anterior y la orden `politica` (fuero, carga fiscal, dehesa, uso de sal). El uso
de sal es del jugador, no de la comarca, porque el pan está en el almacén común: la orden cambia
`EstadoJugador.conservarConSal`, que la fase 3 ya respeta (T-032).

**No entra:** influencia sobre comarcas neutrales (T-038), prestigio (T-043).

**Heredado de T-034 y T-035.** Ya existen `capacidadDe` (`reglas/poblar.ts`, base + casas) y
`factorCrecimientoPorObrasMil` (`reglas/obras.ts`, +20 % con monasterio en la comarca o una
vecina); el crecimiento tiene que usarlos. La catedral ya da +2 de lealtad por turno a las comarcas
propias de su región (fase 6) y la muralla +15 al terminarse: no hay que repetirlo aquí.

## 4. Diseño detallado

### 4.1 Crecimiento

Condiciones (todas):

1. no hubo escasez este turno (`permiteCrecer` de `reglas/escasez.ts`, T-032);
2. `poblacion < capacidad`;
3. `almacen.pan − reservado.pan >= reservaMinima` (30 por defecto, configurable en la partida);
4. el balance de pan previsto con la población nueva sigue siendo ≥ 0.

Entonces:

```
crecimiento = min(2 + floor(lealtad / 25), porcentaje(poblacion, 50))    // 5 % máximo
```

Si no crece, se registra el **motivo** (uno solo, el primero que falla) para que la interfaz lo
enseñe junto a la comarca. Nada de «no crece» sin explicación.

### 4.2 Capacidad

```
capacidad = 60 + 30 × nivelCasas + 20 si hay muralla + modificadores de casa
```

### 4.3 Lealtad

Se aplica la tabla de [docs/03-economia.md](../03-economia.md) §3.6, sumando todas las fuentes del
turno y limitando a 0..100. Umbrales:

| Lealtad | Efecto |
|---|---|
| < 60 | Sin efecto negativo (solo menos crecimiento) |
| < 40 | Producción −25 % |
| < 20 | No se pueden formar recuas ni dar órdenes de leva; cuenta atrás de 6 turnos |
| 0 tras 6 turnos < 20 | La comarca vuelve a neutral conservando la influencia de quien la cuidó |

La cuenta atrás se avisa en la crónica desde el primer turno, con el número de turnos restantes.

### 4.4 Fueros

Orden `politica` con tres opciones (`ninguno`, `carta puebla`, `fuero`), aplicables una vez cada 10
turnos por comarca. Efectos de la tabla §3.9. Conceder fuero es irreversible durante 20 turnos:
quitarlo cuesta 20 de lealtad.

### 4.5 Administración

```
coste = Σ comarcas propias: (4 + 2 × jornadasALaCapital) × modificadorFuero
```

`jornadasALaCapital` se calcula con la ruta más corta **conocida** en verano (para que el coste no
oscile con la estación), y se recalcula cuando cambian los caminos o la capital.

Deuda: si no hay maravedís, se acumula deuda y la lealtad baja 2 por turno empezando por las comarcas
más lejanas, hasta saldarla.

### 4.6 Traslado de la corte

Orden especial: 10 turnos, coste 200 mrs y 50 piedra. Durante el traslado, el coste de administración
sube un 25 %. Al terminar, la capital cambia y todas las distancias se recalculan. Es la respuesta al
dominio alargado y una decisión estratégica de las gordas.

## 5. Archivos

```
paquetes/nucleo/src/fases/08-territorio.ts        (lealtad, fueros, comarcas que se van)
paquetes/nucleo/src/fases/09-poblacion.ts
paquetes/nucleo/src/reglas/{poblacion,lealtad,administracion,capital}.ts
paquetes/nucleo/src/reglas/*.test.ts
```

## 6. Criterios de aceptación

1. El crecimiento respeta las cuatro condiciones y el tope del 5 %; cada motivo de no crecimiento
   tiene su test.
2. La lealtad nunca sale de 0..100 y aplica los cuatro umbrales.
3. Una comarca con lealtad < 20 durante 6 turnos vuelve a neutral, con los avisos previos.
4. El coste de administración crece con la distancia y baja con los fueros, según la tabla.
5. La deuda de administración baja la lealtad empezando por las comarcas más lejanas (orden
   determinista y probado).
6. El traslado de corte recalcula todas las distancias y el coste sube durante la obra.
7. Simulación de 100 turnos: un dominio de 8 comarcas sin fueros ni caminos entra en deuda; el mismo
   con fueros y caminos, no. (Test de escenario, con cifras registradas.)
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/poblacion.test.ts paquetes/nucleo/src/reglas/lealtad.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-037). Commit: `T-036: poblacion, lealtad, fueros y administracion`.

## 9. Resultado (18-09-2026)

Tarea cerrada. 428 tests en verde; `humo-01` y `humo-02` regeneradas a propósito.

- `paquetes/nucleo/src/fases/08-territorio.ts`: órdenes `politica` y `trasladar-corte`, avance del
  traslado, lealtad con todas sus fuentes, cuenta atrás de la comarca desleal y vuelta a neutral.
- `paquetes/nucleo/src/fases/09-poblacion.ts`: crecimiento con sus cuatro condiciones y el motivo
  cuando no se crece (`poblacion.no-crece`).
- `paquetes/nucleo/src/reglas/administracion.ts` (nuevo: distancias en verano por lo conocido,
  costes, orden de cercanía), `lealtad.ts`, `poblacion.ts` y `capital.ts`; `capacidadDe` suma la
  muralla. La fase 3 acumula la deuda de administración y aplica el recargo del traslado; la fase 4
  no forma recuas en comarcas desleales.
- Tablas `territorio` (`src/datos/territorio.ts`) y `poblacion` (`src/datos/poblacion.ts`, antes
  solo en los ejemplos de prueba). Estado nuevo: `EstadoComarca.turnoFuero`,
  `EstadoJugador.deudaAdministracion` y `EstadoJugador.traslado`.
- Pruebas en `pruebas/territorio.test.ts` (17 casos) y administración en `pruebas/consumo.test.ts`.

Cifras del escenario de cien turnos (criterio 7), ocho comarcas en fila de llano, 60 vecinos y
cuatro granjas cada una, sin mercados:

| | Turnos con deuda | Deuda máxima | Comarcas al final |
|---|---|---|---|
| Sin fueros ni caminos | 98 | 899 mrs | 2 |
| Con fuero pleno y calzadas | 0 | 0 | 8 |

Decisiones tomadas al implementar:

- **Distancia administrativa en milésimas**, por la ruta más corta conocida en verano y con las
  mejoras de los caminos; un tramo nunca cuesta menos de una jornada. Cambia las cifras de T-032
  (la costa del mundo de prueba pasa de 12 a 11 maravedís).
- **Deuda acumulada**: primero se paga lo del turno de cerca a lejos; lo que no llega pierde lealtad
  y pasa a la deuda; lo que sobra la salda; mientras quede, la comarca más lejana sigue perdiendo.
- **Tope de crecimiento de al menos un vecino**: con el 5 % a secas, una puebla de 10 no crecería.
- **El fuero sube la lealtad hasta 90**; la carta puebla da +20 % de crecimiento (campo
  `crecimientoMil` de cada fuero).
- **La comarca de la corte no se va nunca**, aunque sea desleal.
- **Vuelta a neutral**: el antiguo dueño conserva influencia igual a la lealtad que quedaba (una
  comarca con dueño no guarda influencias, así que «quien la cuidó» solo puede ser él), sabe cómo
  quedó la comarca y pierde sus obras allí.
- **La orden de política no se aplica a medias**: si el fuero aún no puede cambiar, espera entera.
- **Traslado**: la orden paga su coste (lo calcula el servidor con `territorio.costeTraslado`) y
  cuenta diez fases de territorio; si el destino se pierde, el traslado se deshace.
- Las «migraciones internas» de la tabla de fases no tienen regla escrita: no se implementan. La
  emigración por hambre ya la hace la fase 3.
- La producción mantiene sus tramos de lealtad de T-031 (< 60 rinde el 90 %), aunque esta ficha
  diga «< 60 sin efecto negativo»: se revisará en el equilibrio (T-047).
