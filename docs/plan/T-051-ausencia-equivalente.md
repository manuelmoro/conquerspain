# T-051 · Ausencia con planes equivalentes

**Fase:** 2 · Motor · **Depende de:** T-050 · **Estado:** pendiente

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
