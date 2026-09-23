# T-047 · Ajuste de equilibrio v1

**Fase:** 2 · Motor · **Depende de:** T-048, T-049, T-050, T-051 · **Estado:** en curso

## 1. Contexto

El motor está completo y medible. Ahora toca lo que decide si el juego mola: que las ocho vías sean
viables, que el año agrícola apriete sin ahogar, que los precios respiren y que ningún turno sea
aburrido. Esta tarea es **iterativa por naturaleza**: se ajusta, se mide, se repite.

Lee antes: [docs/04-casas-y-tradiciones.md](../04-casas-y-tradiciones.md) §4.4,
[docs/06-competicion.md](../06-competicion.md) §6.8, informe de T-046.

### Revisión del 19-09-2026

**No empezar otra ronda de ajustes hasta completar las dependencias.** La revisión y dos ensayos
controlados están en [bitacora-equilibrio.md](bitacora-equilibrio.md). Las tablas originales se
conservan: ninguno de esos ensayos resolvió las vías pendientes.

Orden de desbloqueo: **T-048 (hecha el 21-09-2026) → T-049 → T-050 → T-051 → T-047**. Se corrigen primero el instrumento,
el escenario, los robots y la equivalencia de planes. No se intenta compensar sus defectos con
bonificaciones de prestigio. El recorte y arranque pasan de T-065 a T-049 para eliminar el ciclo
T-047 → T-065 → T-062 → T-061 → T-060 → T-047.

## 2. Objetivo

Dejar las tablas de datos en un estado que cumpla los criterios numéricos de salud del juego, con el
proceso documentado para poder repetirlo cada vez que se añada contenido.

## 3. Alcance

**Entra:** ajuste de `paquetes/nucleo/src/datos/*.ts` (edificios, casas, tradiciones, mercado, población,
movimiento, prestigio), y la documentación de cada cambio con su porqué.

**No entra:** tocar la lógica del motor. Si un ajuste **exige** cambiar lógica, se abre tarea aparte
(con el siguiente número libre de fase 2; T-048 a T-051 ya están asignadas) y se anota en el índice.

**Heredado de T-041.** Los números de las ocho casas (`datos/casas.ts`) son de partida, con una
sola regla de diseño: cada casa cambia reglas y no solo multiplica. Hay que mirar en especial el pan
de la Mesta y los mercaderes (−30 % y −25 %), el coste del monasterio de los monjes, la carta puebla
gratis (hoy un fuero no cuesta nada, así que ese privilegio no tiene efecto) y si los salineros
tierra adentro quedan de verdad «en el montón».

**Heredado de T-046.** El banco ya ha medido tres partidas de 200 turnos con las ocho casas
(`herramientas/banco/informes/2026-09-19-1492.md`). Lo que hay que atacar, por orden de tamaño, está
en [T-046 §8](T-046-banco-de-pruebas.md); en resumen:

1. **El porte manda sobre el mapa**: 10 cargas y 2 de pan por jornada dejan a una recua a tres o
   cuatro jornadas de casa, y las ferias están a 5–14 de casi todos los orígenes. Por eso la Mesta no
   lleva su lana a ninguna feria y el mercader no alcanza una segunda plaza: son dos de las ocho vías
   sin jugar. Mirar `movimiento.portePorAcemila`, `bastimentoPorJornada` y la densidad de ferias.
2. **Los mercaderes menores borran el arbitraje**: devuelven cualquier precio a su base en tres o
   cuatro turnos (`liquidezMercaderesMenoresMil`, `margenMercaderesMenoresMil`).
3. **Hay orígenes condenados**: con `labor 1`, dos granjas no alimentan a la población inicial y los
   seis solares no dan para la cadena de la casa y el mercado. El arranque tiene que depender del
   origen (T-049; T-065 lo persistirá).
4. **Tierra muerta**: 235 de 403 comarcas sin tocar en 200 turnos; el recorte de mapa pasa a T-049.
5. **Jugar sin estar** todavía cuesta más de un 5 % de prestigio en varias casas.

## 4. Procedimiento

Ciclo, repetido hasta cumplir los criterios:

1. Fijar y registrar revisión, tablas, robots, métricas y mapas. La campaña de exploración usa
   `1492`, `1492-2`, `1492-3` a 200 turnos con ocho casas y ambas cadencias. Los comandos de §7
   añaden las campañas 1085 y 1212: son **nueve partidas y sus nueve parejas ausentes**, no tres.
   Reservar 1085/1212 para confirmar un candidato; no afinarlas todas después de cada cifra.
2. Leer el informe y quedarse con **el problema más grande**, no con todos a la vez.
3. Formular la hipótesis en una frase («el ferrón gana siempre porque los aperos rinden más de lo que
   cuestan a partir del turno 60»).
4. Cambiar **un solo grupo de valores**.
5. Volver a medir con las mismas semillas y comparar informes. Rechazar comparaciones que cambien
   a la vez mapa, robot o definición de métrica. Si cambian en una tarea previa, generar una base
   nueva. Un candidato descartado se revierte antes del siguiente ensayo.
6. Anotar en `docs/plan/bitacora-equilibrio.md`: fecha, hipótesis, cambio, resultado, decisión.

Nunca se cambian cinco cosas a la vez: entonces no se sabe qué funcionó.

## 5. Criterios de aceptación

| Criterio | Objetivo |
|---|---|
| Prestigio de cada casa frente a la mediana | entre 80 % y 120 % |
| Casas que ganan en las tres semillas | ninguna |
| Turnos sin decisión útil | < 10 % |
| Turnos con escasez en una partida bien jugada | entre 2 % y 15 % (tiene que apretar, no ahogar) |
| Precios pegados al suelo o al techo | < 10 turnos seguidos |
| Comarcas nunca usadas por ningún robot | < 5 % del mapa |
| Diferencia entre jugar cada turno y jugar cada seis (T-045 §4.5) | < 5 % |
| Duración de una partida hasta «Un pequeño dominio» | entre 60 y 100 turnos |
| Tiempo hasta la primera obra mayor terminada | entre 80 y 130 turnos |

Además, dos comprobaciones cualitativas, hechas leyendo una partida completa:

1. **La curva del año se nota**: el granero sube en verano y baja en invierno, y hay al menos un
   momento de tensión al año.
2. **Las vías se distinguen**: leyendo el informe de un robot sin ver su nombre, se puede adivinar
   qué casa es.

### 5.1 Cómo se interpreta y se demuestra la tabla

Estas definiciones evitan cerrar con promedios que esconden fallos. **T-048 las implementa** en
`herramientas/banco/src/equilibrio.ts`: los umbrales están en `OBJETIVOS` (una sola tabla, la misma
que esta) y `evaluarEquilibrio` saca una fila por criterio, semilla y casa con su veredicto. Los
criterios se llaman `prestigio`, `ganadores`, `actividad`, `decisiones útiles`, `escasez`,
`precios`, `tierra`, `ausencia`, `dominio` y `obra mayor`. Si se cambia un umbral aquí, hay que
cambiarlo allí: la huella de `OBJETIVOS` va en el manifiesto de cada informe y delata el cambio.

Una fila que cumple **apoyada en una precondición** de otra tarea (T-049, T-050 o T-051) no cierra
el criterio: `codigoDeEvaluacion` la trata como pendiente.

- **Prestigio:** por casa en cada partida, frente a la mediana de las ocho casas de esa partida;
  publicar también medias por campaña. Ninguna casa gana las tres repeticiones de una campaña.
- **Actividad:** por casa y partida sobre 200 turnos. «El robot no propuso órdenes» se publica
  separado de «no había decisión útil» y de órdenes rechazadas o repetidas. Para la segunda
  afirmación hace falta el diagnóstico de T-050; si falta, el criterio es no evaluable.
- **Escasez:** por casa y partida, 2 %–15 % inclusivos; los escenarios deliberados de hambre son
  regresiones, no candidatos de equilibrio. La competencia de los planes se demuestra en T-050.
- **Precios y tierra:** racha máxima menor de 10 turnos efectivos de mercado; menos de 5 % de
  comarcas sin usar en el recorte de cada partida, no la unión de visitas de mapas distintos.
- **Ausencia:** parejas por casa y semilla en T100 y T200 con planes equivalentes de T-051;
  `100 × abs(a-b) / max(1, abs(a), abs(b)) < 5`. Publicar además la sensibilidad adaptativa a la
  frecuencia; no usar la media para ocultar una pareja mala.
- **Ritmo:** primer «Un pequeño dominio» de la partida entre T60 y T100; primera obra mayor de la
  partida entre T80 y T130 (extremos incluidos). Publicar también los tiempos por casa y los no
  alcanzados. No exigir que todas las vías terminen su primera obra en el mismo turno.
- **Lectura cualitativa:** guardar la partida elegida y la evidencia de sus ocho casas. La curva
  agrícola se comprueba donde rige la estación; las acequias de los hortelanos la anulan por diseño.
  No quitar ese privilegio para forzar una gráfica. Identificar decisiones de reserva o tensión
  económica, no exigir hambre artificial a una estrategia bien preparada.

Repasar los nueve criterios y las dos lecturas uno por uno en la bitácora del candidato final.
Si falla cualquiera o falta evidencia, T-047 sigue abierta. No usar las cinco alertas antiguas de
T-046 como sustituto. Si un objetivo resulta incompatible con una vía por diseño, documentar el
caso y resolver expresamente el diseño antes de alterar el criterio; no mover el umbral a escondidas.

### 5.2 Asuntos de diseño que no se arreglan cambiando una cifra

- **Carta puebla gratuita:** el fuero ya es gratis para todos. No inventar un coste general solo
  para justificar el texto de los monjes. Mantener el privilegio sin efecto señalado en docs/04;
  decidir entre corregir la descripción o diseñar una nueva decisión en ficha independiente.
- **Privilegios futuros:** contratos de ferrones/canteros y portazgos de arrieros siguen desactivados
  hasta T-103. Equilibrar las vías actuales y repetir después; no anticipar ingresos inexistentes.
- **Arbitraje:** bajar liquidez o regresión es una hipótesis, no una solución demostrada. Medir
  oportunidades netas, abastecimiento y duración de diferencias, no solo dispersión de precios.
- **Porte y sal:** evaluar recorrido completo, calendario, ida/regreso y modificadores efectivos;
  más cargas no arreglan por sí solas una rutina de viaje o un origen sin salida comercial.

## 6. Archivos

```
paquetes/nucleo/src/datos/*.ts            (ajustes)
docs/plan/bitacora-equilibrio.md        (nuevo, se mantiene para siempre)
herramientas/banco/informes/            (informes de referencia)
```

## 7. Verificación

```bash
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --evaluar --cambios "<lo ensayado>"
npm run banco -- --semilla 1085 --turnos 200 --repeticiones 3 --evaluar
npm run banco -- --semilla 1212 --turnos 200 --repeticiones 3 --evaluar
npm run banco:comparar -- informes/<antes>.csv informes/<despues>.csv
npm run verificar
```

Los tres informes deben cumplir la tabla de §5: `--evaluar` termina con código 0 solo cuando no
queda ni un incumplimiento, ni un «no evaluable», ni una precondición pendiente. El manifiesto que
acompaña a cada informe fija con qué se midió, y `banco:comparar` avisa si entre los dos informes
ha cambiado algo más que el grupo de valores ensayado.

## 8. Al terminar

1. Índice: T-047 `hecha`, solo con todas sus dependencias terminadas. **Fase 2 completa**: el juego ya existe como motor, aunque no se vea.
2. `ESTADO.md`: fase actual → «Fase 3 · Servidor autoritativo»; siguiente T-060.
3. Actualiza `docs/03-economia.md` y `docs/04-casas-y-tradiciones.md` con las cifras finales.
4. Commit: `T-047: equilibrio v1 del motor`.

> Esta tarea se **reabre** cada vez que se añada contenido nuevo (casas, obras, recursos). El
> procedimiento y los criterios se quedan; se repite el ciclo.
