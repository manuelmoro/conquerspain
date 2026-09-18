# T-035 · Fase 6: obras, cuadrillas y obras mayores

**Fase:** 2 · Motor · **Depende de:** T-031 · **Estado:** **hecha** (18-09-2026)

## 1. Contexto

Construir es la decisión más frecuente del juego y la que más se nota a largo plazo. Las obras
mayores, además, son el motor de la vía «cantero» y la fuente principal de prestigio.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.3 y §3.11.

## 2. Objetivo

Avanzar y terminar construcciones y obras mayores, gestionando cuadrillas, solares, requisitos,
frenazo invernal y abandono.

## 3. Alcance

**Entra:** órdenes `construir`, `derribar`, `obra mayor` y `roturar`; cuadrillas; solares; efectos al
terminar.

**No entra:** privilegios de casa sobre obras (T-041), prestigio (T-043).

**Heredado de T-033.** La calidad de cada tramo sale hoy de `calidadDeTramo` (`reglas/ruta.ts`):
calzada romana → carretero, lo demás vereda. Los caminos y puentes que se construyan tienen que
guardarse en el estado y entrar en esa función (y en la opción `puente` de `jornadasDeTramoMil`).
Las órdenes empiezan con `empezarOrden` y esperan con `dejarEnEspera` (`src/ordenes.ts`).
Cuando haya caminos en el estado, el hallazgo «una vereda mejor» de la exploración (ficha T-034
§4.1) puede entrar en `HALLAZGOS` (`reglas/explorar.ts`); hoy solo hay `localidad` y `noticias`.

## 4. Diseño detallado

### 4.1 Cuadrillas y solares

```
cuadrillas = 1 + floor(vecinos / 40)      // máximo 4; +1 con fuero; +1 con monasterio
solaresLibres = solares − Σ niveles de edificios
```

Una obra ocupa una cuadrilla desde que empieza hasta que termina. Una comarca sin cuadrilla libre no
puede empezar obra: la orden queda `en espera` con el motivo y el turno previsto de liberación.

### 4.2 Avance

```
avanceMil = 1000
si es obra de piedra y estación = invierno:  avanceMil = 500
si es obra de madera y estación = invierno:  avanceMil = 667
avanceMil × modificadores de casa y tradición
```

El progreso se guarda en milésimas de turno; una obra de 3 turnos necesita 3 000. Así el frenazo
invernal no pierde precisión.

### 4.3 Requisitos al empezar

Se comprueban al **dar la orden** y otra vez al **empezar**:

- solar libre, nivel por debajo del máximo, potencial suficiente;
- requisitos propios (molino exige granja; catedral exige ciudad y `ciudad-episcopal`; acequia exige
  `vega-fluvial`);
- recursos disponibles (se reservan al dar la orden);
- sin escasez (`permiteIniciar` de `reglas/escasez.ts`, T-032).

Si al empezar falla algo, la orden pasa a `en espera` con motivo, sin perder la reserva.

### 4.4 Obras mayores

- Duración larga (12 a 45 turnos) y consumo **repartido**: el coste total se divide entre los turnos
  y se cobra cada turno. Si un turno no se puede pagar, la obra se detiene (no se pierde) y avisa.
- Pueden **abandonarse** con una orden: liberan la cuadrilla y se deterioran un 1 % por turno.
- Al terminar aplican su efecto permanente (puente, calzada, monasterio, catedral, muralla,
  atarazana, acequia mayor) y emiten un suceso de hito.

### 4.5 Roturar

Convierte monte en labor: `monte −1`, `labor +1` en los potenciales **efectivos** de la comarca
(guardados en el estado, no en el mundo). Cuesta 3 turnos y una cuadrilla; en dehesa cuesta el doble
y penaliza la lealtad en 5. No se puede deshacer en menos de 20 turnos (el monte tarda en volver).

### 4.6 Derribar

Libera un solar en 1 turno y devuelve la mitad del material, truncando a la baja.

## 5. Archivos

```
paquetes/nucleo/src/fases/06-obras.ts
paquetes/nucleo/src/reglas/{obras,cuadrillas,roturar}.ts
paquetes/nucleo/src/reglas/*.test.ts
paquetes/nucleo/datos/obras-mayores.json
```

## 6. Criterios de aceptación

1. Una obra de 3 turnos empezada en verano termina en 3; empezada en invierno (piedra), en 6.
2. Las cuadrillas se ocupan y se liberan correctamente; una tercera obra en una comarca con 2
   cuadrillas queda `en espera` con motivo legible.
3. No se puede superar el máximo de nivel ni los solares, en ninguna combinación (test de propiedad).
4. Una obra mayor detenida por falta de material se reanuda sola en cuanto hay material.
5. El abandono deteriora al 1 % por turno y se puede retomar.
6. Roturar cambia los potenciales efectivos y respeta la penalización de dehesa.
7. Los efectos permanentes de las siete obras mayores están implementados y probados uno a uno.
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/obras.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-036). Commit: `T-035: obras, cuadrillas y obras mayores`.

## 9. Resultado (18-09-2026)

Tarea cerrada. 410 tests en verde; `humo-01` y `humo-02` regeneradas a propósito (el estado gana
`caminos` y `obrasMayores`).

- `paquetes/nucleo/src/fases/06-obras.ts`: órdenes `construir`, `derribar`, `roturar` y
  `obra-mayor` (empezar, abandonar y retomar) en orden de identificador; avance de cada obra con el
  frenazo invernal; efectos al terminar y efectos de cada turno de la catedral.
- `paquetes/nucleo/src/reglas/obras.ts` (avance, solares, requisitos de edificios y de obras
  mayores, ciudad, cuotas a plazos, deterioro y las consultas de efectos que usarán otras fases),
  `cuadrillas.ts` y `roturar.ts`.
- `paquetes/nucleo/src/datos/obras.ts`: tablas `obras` y `obrasMayores` (los costes de las obras
  mayores no estaban en el diseño y se fijan aquí; están en `docs/03` §3.11).
- Estado: `EstadoPartida.caminos` (tramos con puente o calzada, con `claveDeTramo`),
  `EstadoComarca.obrasMayores` y `Obra.hacia`. La calidad de un tramo sale ya del estado
  (`calidadDeTramo(camino, mejoras)`) y las rutas lo tienen en cuenta.
- La acequia mayor entra en la cadena de producción (factor `acequia`, sin estación).
- Pruebas en `pruebas/obras.test.ts` (21 casos): duración en verano e invierno, cuadrillas con su
  previsión, la propiedad de niveles y solares, pagos exactos a plazos, parada y reanudación,
  abandono, requisitos, roturar, derribar y los efectos de las siete obras mayores uno a uno.

Decisiones tomadas al implementar:

- **Los datos van en `src/datos/obras.ts` y no en `nucleo/datos/obras-mayores.json`**, como el resto
  de tablas desde T-031: el núcleo no lee archivos y el compilador comprueba la forma.
- **La orden de obra mayor gana `hacia` y `abandonar`**: el puente y la calzada necesitan el tramo,
  y abandonar o retomar se hace con la misma orden sobre la obra (`continuar`).
- **La orden de obra acaba al empezar la obra**: la obra es la entidad viva (como la recua) y lleva
  su avance; la orden solo la pone en marcha.
- **El pago a plazos es proporcional al avance**, no al turno: así el frenazo invernal no adelanta
  pagos y al final se ha pagado exactamente el total.
- **El deterioro del abandono es el 1 % de lo construido**; al retomar, rehacerlo cuesta tiempo pero
  no material (ya se entregó).
- **El avance de madera en invierno se redondea hacia arriba** (667): con 666, una obra de dos
  turnos tardaría cuatro en lugar de tres.
- **Derribar y roturar no dependen de la estación**, y ocupan cuadrilla como cualquier obra.
- **La muralla no pide nada más que su material**; «Piedra» en el diseño era el material. Ciudad =
  200 vecinos y muralla.
- **Roturar en dehesa cuesta el doble de material, no de tiempo.** «No se puede deshacer en menos de
  20 turnos» no tiene regla: no hay orden que devuelva la labor a monte.
- Enganches anotados en sus fichas: crecimiento y capacidad (T-036), crecidas y bandidaje (T-039),
  hitos (T-043), modificadores de casa (T-041) y el cálculo de costes del servidor (T-062).
- Las pruebas viven en `paquetes/nucleo/pruebas/`, como exige el montaje.
