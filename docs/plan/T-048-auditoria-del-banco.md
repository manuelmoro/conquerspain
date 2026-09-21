# T-048 · Métricas auditables del banco

**Fase:** 2 · Motor · **Depende de:** T-046 · **Estado:** **hecha** (21-09-2026)

## 1. Contexto

La revisión del 19-09-2026 encontró que el informe de T-046 no verifica todos los criterios de
T-047. Sus alertas admiten un 20 % de escasez y 20 turnos de precio extremo, frente al 2 %–15 % y
menos de 10 turnos exigidos. Además, resume medias redondeadas: pueden ocultar una partida mala.

Lee [T-047 §5](T-047-equilibrio-v1.md), [T-046](T-046-banco-de-pruebas.md),
[la bitácora](bitacora-equilibrio.md) y `herramientas/banco/src/{metricas,informe,ejecutar}.ts`.

## 2. Objetivo

Que cada criterio numérico tenga evidencia por partida y un resultado reproducible: cumple,
incumple o no evaluable. «No evaluable» nunca permite cerrar el equilibrio.

## 3. Alcance

**Entra:** recogida, exportación, evaluación y pruebas de métricas; procedencia de los informes.
**No entra:** mejorar robots, cambiar tablas del juego, recortar mapas ni ampliar el motor.
Los informes históricos se conservan: no se reescriben con el nuevo significado de una métrica.

## 4. Diseño detallado

### 4.1 Datos y procedencia

- Añadir al resultado por jugador el turno de cada hito (el estado ya conserva `hitos`) y de la
  primera obra mayor terminada; `null` significa «no alcanzado», nunca turno cero ni dato omitido.
- Exportar series de ambas cadencias, producción, almacenes, obras e hitos. Actualmente el CSV de
  turnos solo lleva la cadencia diaria y no permite revisar la primera obra mayor.
- Guardar un manifiesto con revisión del código, semillas efectivas, turnos, cadencias, escenario,
  identidad y huella del mundo, huella de las tablas completas, versión de métricas y cambios
  experimentales exactos. `VERSION_REGLAS = 1` por sí sola no identifica las tablas ensayadas.
  Pasar la procedencia como dato; la fecha de ejecución no entra en el resultado determinista.
- Conservar las cifras sin redondear al evaluar; redondear solo al presentar. La comparación avisa
  si cambia algo además del grupo de valores ensayado (robots, mapa, métricas o escenario).

### 4.2 Evaluador

Crear `equilibrio.ts`, separado del informe visual, con una función pura que reciba el resultado
completo y devuelva filas identificadas por criterio, semilla y casa, con observado, objetivo y
estado. Los objetivos viven en una tabla única del banco y reproducen T-047 §5.

- Prestigio: mostrar cada partida y las medias de campaña; calcular la mediana exacta. Si la mediana
  es cero o negativa, marcar no evaluable y explicar el caso; no dividir ni declarar éxito.
- Ganadores: leer el puesto real de cada partida, nunca el puesto medio redondeado.
- Ausencia: comparar cada pareja de la misma semilla y casa en T100 y T200. Mostrar diferencia
  absoluta y `100 × abs(a-b) / max(1, abs(a), abs(b))`; distinguir ambos ceros. El agregado no
  sustituye estas parejas. Separar «mismo robot con distinta frecuencia» de «planes equivalentes».
- Precios: guardar la racha máxima de cada recurso/plaza por turnos consecutivos. Si una feria no
  abre, interrumpir la racha de turnos de mercado; no contar como comercio su precio almacenado.
  Verificar cómo se representan apertura y cierre antes de modificar `Registro.anotarPrecios`.
- Tierra: medir sobre el mapa realmente jugado, por partida. Una visita de paso cuenta aunque una
  unidad cruce varias comarcas en un turno; usar los sucesos de movimiento, no solo la posición
  final. Publicar además unión por campaña como diagnóstico, sin esconder mapas individuales.
- Registrar órdenes propuestas, aceptadas, canceladas y ejecutadas por motivo. Hoy `sinDecision`
  solo comprueba que el robot devolvió cero órdenes: es un indicador de actividad, no una prueba
  de que todas las órdenes propuestas sean útiles. Mantener ambos conceptos separados.
- Arbitraje: las compras y ventas del mismo recurso en plazas distintas no prueban por sí solas
  una operación rentable. Añadir trazabilidad por recua, orden temporal, cantidades e importes,
  comisiones y bastimento atribuible; identificar lo no atribuible. No atribuir a una compra una
  venta anterior o mercancía producida por la casa. Un caso preparado sigue siendo test de
  capacidad, no evidencia de viabilidad en las partidas de referencia.

### 4.3 Límites de interpretación

Las comprobaciones cualitativas requieren leer una partida y justificar el resultado. No se
convierten en verde por un contador arbitrario. La escasez de un robot defectuoso se informa,
pero no demuestra cómo juega una estrategia competente: T-050 resolverá esa precondición.

## 5. Archivos

- `herramientas/banco/src/{metricas,informe,comparar,ejecutar,equilibrio}.ts` y sus pruebas.
- `herramientas/banco/informes/`: informe nuevo, series y manifiesto.
- T-047 §5: mantener sincronizadas las definiciones, sin relajar sus umbrales.

## 6. Criterios de aceptación

1. Cada criterio numérico de T-047 aparece, con su unidad y ámbito de agregación.
2. Casos de frontera: 80 % y 120 % inclusivos; 10 % de inactividad y 10 turnos de precio fallan;
   escasez 2 % y 15 % inclusivos; ausencia exactamente 5 % falla.
3. Una semilla mala no desaparece dentro de la media. Hito ausente, prestigio negativo, ambas
   cadencias a cero y feria cerrada tienen tests explícitos.
4. Visita intermedia y falso arbitraje (venta anterior/producción propia) tienen regresiones.
5. Misma entrada y procedencia producen los mismos informes y manifiesto byte a byte.
6. Los nueve criterios son auditables sin abrir los snapshots ignorados por Git.
7. `npm run verificar` pasa. No se exige todavía que el equilibrio pase.

## 7. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-048
```

Añadir a la CLI un modo de evaluación con código de salida distinto de cero cuando incumple o
no puede evaluar. En esta tarea ese resultado negativo es esperado y queda documentado.

## 8. Al terminar

Marcar T-048 hecha, actualizar ESTADO y continuar con T-049. Commit y push:
`T-048: métricas auditables y procedencia del banco`.

## 9. Lo que se entregó (21-09-2026)

**Piezas nuevas del banco.** `equilibrio.ts` es el juez: una función pura que recibe el resultado
completo y devuelve una fila por criterio, semilla y casa, con observado sin redondear, objetivo,
unidad, ámbito, veredicto y evidencia. Los objetivos viven en `OBJETIVOS`, una tabla única que
reproduce T-047 §5. `procedencia.ts` compone el manifiesto (revisión, versiones, semillas, turnos,
cadencias, escenario, huella del mundo, huella de **las tablas completas** y huella de los propios
objetivos) y compara dos manifiestos. `negocios.ts` sigue cada carga comprada hasta que se vende.
`visitas.ts` reconstruye el paso de cada turno. `version.ts` guarda las versiones para que el
manifiesto no dependa del ejecutor.

**Lo que se corrigió del instrumento.**

- La racha de precio solo cuenta turnos con la plaza abierta: el precio guardado de una feria
  cerrada ya no suma.
- Las visitas incluyen las comarcas de paso (sucesos `recua.entra` y consumo de ruta de los
  rebaños), y la partida dice si alguna no se pudo reconstruir; si no se pudo, un mapa mal usado
  se declara **no evaluable** en vez de incumplido, porque la cifra es una cota superior.
- El arbitraje exige traza: compra, venta posterior en otra plaza, cantidades, importes, comisiones
  y bastimento atribuido. Lo que se vende sin haberlo comprado se publica aparte.
- «No propuso órdenes» (medible) y «no hubo decisión útil» (no evaluable hasta T-050) son dos
  criterios distintos, con dos filas distintas.
- Una fila que cumple **apoyada en una precondición de otra tarea** no cierra el equilibrio:
  `codigoDeEvaluacion` devuelve 2 igual que con un incumplimiento.

**Lo que dice la campaña de referencia** (`informes/T-048-1492.*`, 1492 ×3, 200 turnos): 46 filas
cumplen, 87 incumplen y 24 no se pueden evaluar; quedan 127 de 157 sin cerrar. Coincide con lo que
la bitácora había recogido a mano leyendo snapshots: primer «Un pequeño dominio» en T34/T33/T32 y
primera obra mayor en T88 en las tres. **Ningún negocio de arbitraje con traza en toda la campaña**,
aunque el indicio antiguo tampoco los veía. La comparación con el informe de T-046 no cambia ni una
cifra del juego: solo aparecen y desaparecen métricas.
