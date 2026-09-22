# T-051 · Ausencia con planes equivalentes

**Fase:** 2 · Motor · **Depende de:** T-050 · **Estado:** hecha (23-09-2026)

## 1. Contexto

El test de T-045 dio 175/175 en un escenario concreto. El banco de T-046 compara el mismo código
invocado cada uno o seis turnos, pero `Pedidos.base` deja siempre `turnoProgramado: null`, las
rutas de los robots usan por defecto `circular: false` y el mayordomo común solo cambia impuestos.
Eso mide también la calidad de dos planes distintos. No identifica por sí solo una carencia del
motor ni demuestra el principio fundacional para las ocho casas.

Lee [T-045 §4.5](T-045-mayordomo-y-colas.md), [docs/02 §2.5](../02-diseno-nucleo.md),
[T-048](T-048-auditoria-del-banco.md), [T-050](T-050-robots-viables.md) y
`herramientas/banco/src/escenarios/ausencia.ts`.

## 2. Objetivo

Demostrar que una misma estrategia puede ejecutarse sin conectarse más de una vez cada seis
turnos y separar ventajas de información nueva de trabajo repetitivo automatizable.

## 3. Alcance

**Entra:** planes equivalentes por vía, programación de los robots, pruebas diferenciales y
correcciones mínimas del motor únicamente cuando un caso reducido demuestra su necesidad.
**No entra:** bajar el prestigio de quien entra cada turno, simular su conexión en secreto durante
la ausencia, regalar información futura ni quitar decisiones territoriales al jugador.

## 4. Diseño detallado

### 4.1 Dos pruebas diferentes

1. **Equivalencia de ejecución (obligatoria):** fijar decisiones estratégicas y la información
   disponible al principio de cada bloque de seis turnos. La variante diaria entrega manualmente
   el plan y la ausente usa colas, órdenes fechadas, rutas y mayordomo. No reoptimizar solo la diaria
   al conocer un resultado nuevo. Publicar las órdenes previstas y lo que ejecutó cada variante.
2. **Sensibilidad a la frecuencia (diagnóstico):** conservar las partidas adaptativas de robots
   entrando cada uno o seis turnos. Si divergen, clasificar la primera diferencia causal: reacción
   a noticia nueva, trámite no automatizado, error de plan o error del motor. No esconder esta
   medida aunque pase la primera.

### 4.2 Escenarios mínimos

- Obras sucesivas con recursos disponibles en distinto turno; reservas y costes al empezar.
- Compra recurrente de pan, venta de excedentes y parada de ruta con precio límite.
- Viaje de feria que atraviesa un bloque de ausencia, con carga, venta, bastimento y regreso.
- Trashumancia preparada con fecha, calendario y puertos anunciados.
- Incorporación y gobierno: la decisión sigue siendo del jugador; ejecutar fechas/colas legales,
  sin hacer que el mayordomo elija nuevas conquistas.
- Hambre, mercado sin contraparte, cambio de estación y orden que deja de ser válida: ambos planes
  deben detenerse con causas explicables, sin repetir cargos ni eludir validaciones.

### 4.3 Si falta capacidad del motor

Primero escribir el fallo reproducible y la regla en docs/02; después implementar el cambio
mínimo con tipos, validación, fase, crónica, datos y reproducción. Una extensión grande se divide
antes de implementarla y queda como dependencia explícita. No dar al robot una acción que un
jugador humano no pueda expresar en el protocolo de órdenes.

### 4.4 Medición

Usar la fórmula y casos límite de T-048. Medir parejas por casa y semilla en T100 y T200; comparar
además recursos, territorio, hitos y acciones distintivas para que un empate en prestigio no tape
una divergencia importante. En los casos sin decisiones contingentes nuevas se espera igualdad
exacta del resultado de dominio, excluyendo identificadores de órdenes y sus marcas de origen.

## 5. Archivos

- `herramientas/banco/src/escenarios/ausencia*`, robots y pedidos; informes de T-048.
- Solo si un caso lo requiere: órdenes, mayordomo, rutas, validación y crónica del núcleo, con tests.
- `docs/02-diseno-nucleo.md` y T-045: alcance probado y cualquier capacidad nueva.

## 6. Criterios de aceptación

1. Los seis escenarios mínimos se prueban con órdenes que un humano podría enviar.
2. Las ocho vías tienen planes equivalentes y diferencias inferiores al 5 % en T100 y T200 para
   las semillas de referencia; no se decide ni se consulta nueva información durante la ausencia.
3. Toda divergencia importante tiene primera causa trazada. La comparación adaptativa se publica
   aparte y sus problemas pendientes no desaparecen del estado del proyecto.
4. El test original de T-045 y las guardas de determinismo, validación y niebla siguen pasando.
5. Ninguna ampliación premia la conexión frecuente ni automatiza decisiones prohibidas.
6. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-051
```

Usar también 1085 y 1212 para la validación final de equivalencia. Las pruebas rápidas deben
permitir depurar un caso sin lanzar las nueve partidas completas en cada cambio.

## 8. Al terminar

Marcar T-051 hecha, actualizar ESTADO y desbloquear T-047 si sus otras dependencias están hechas.
Commit y push: `T-051: ausencia verificada con planes equivalentes`.

## 9. Resultado (23-09-2026)

Hecha. Informes: [`T-051-1492`](../../herramientas/banco/informes/T-051-1492.md), `T-051-1085` y
`T-051-1212`, con sus manifiestos. Lectura y cifras en la
[bitácora de equilibrio](bitacora-equilibrio.md).

### Las dos medidas, separadas

1. **Equivalencia de ejecución (obligatoria).** El mismo plan, jugado de dos maneras: dejado por
   bloques de seis turnos (colas, órdenes fechadas, rutas y mayordomo) o entregado día a día, cada
   orden el turno en que empieza a trabajar. Las mismas decisiones y la misma información.
   **Resultado: el dominio sale exactamente igual, turno a turno**, y el prestigio con un 0,0 % de
   diferencia en las 144 filas (8 casas × 3 semillas × T100 y T200 de `1492`, `1085` y `1212`).
2. **Sensibilidad a la frecuencia (diagnóstico).** Dos planes distintos: un robot que decide cada
   turno y otro cada seis. Se publica aparte en el informe, con lo que el diligente decide entre
   bloques (mercado y carga, sobre todo): es lo que se gana mirando el tablero más veces, no una
   carencia del motor.

### Lo que se hizo

- `escenarios/equivalencia.ts` (nuevo): el arnés. Un guion dice qué órdenes daría el jugador cada
  turno; `compararGuion` lo juega de las dos maneras y compara el **dominio** (todo menos la lista
  de órdenes, la huella del turno, las colas y lo reservado, que son el espejo de las órdenes en
  vuelo). `planDeRobot` + `jugarPlanAMano` hacen lo mismo con el plan que deja un robot.
- `escenarios/equivalencia.test.ts` (nuevo): los seis escenarios mínimos de §4.2 —obras sucesivas
  (fechadas y en cola), comercio con compra recurrente y parada con precio límite, trashumancia con
  fecha, gobierno con mayordomo, regalos fechados, casos que se tuercen (hambre, plaza que no
  existe, obra en comarca ajena) y un viaje de feria que cruza el bloque— más las ocho vías con el
  plan de sus robots. Todas las órdenes pasan `validarOrdenEntrante`.
- Robots que planean el bloque entero, con lo que el motor ya daba: la cola de cada comarca admite
  una obra por turno hasta la próxima decisión; `alimentar` y `crecer` la llenan; el tratante deja
  dicho el trato de cada turno con su fecha, descargando lo que trajo el turno anterior; la
  exploradora deja viajes completos (ida, explorar y vuelta); el feriante vuelve sin que nadie lo
  mande; el emisario fecha su regreso para cuando se le acabe el pan de la presencia.
- El criterio de ausencia de T-047 §5 se juzga ahora sobre la equivalencia, no sobre dos planes
  distintos; el informe enseña las dos tablas. `VERSION_ROBOTS = 3`, `VERSION_METRICAS = 4`.
- [docs/02 §2.5.6](../02-diseno-nucleo.md): queda escrita la diferencia entre una orden suelta (se
  cancela si al darla no hay con qué pagarla) y la misma orden en cola (espera y empieza cuando lo
  hay, después de la producción). No hizo falta cambiar el motor: la cola es de los dos jugadores.

### Divergencias que quedan, con su causa

En dos de las nueve partidas el dominio se separa muy tarde (T109 en `1492-2`; T175 y T193 en
`1212`) sin mover el prestigio en T100 ni en T200. **Primera causa trazada:** las órdenes que no
llegaron a trabajar dentro de la ventana —una `incorporar` esperando `sin-ventaja` y un `cometido`
con la recua ocupada— no se entregan en la variante a mano, y su hueco mueve un par de cargas de
pan en el almacén. Es un artefacto de la medida, no una ventaja de conectarse más.

### Lo que este trabajo **no** arregla (y no le toca)

La diferencia entre el robot que decide cada turno y el que decide cada seis sigue existiendo
(diagnóstico): está en reaccionar a precios nuevos y en las decisiones de territorio, que el
mayordomo no automatiza a propósito (docs/02 §2.5.3). Los números y su reparto, en la bitácora.
