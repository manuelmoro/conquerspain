# Bitácora de equilibrio

Registro permanente: fecha, hipótesis, cambio aislado, resultado y decisión. Los experimentos
rechazados también se guardan. Una ejecución exitosa del banco no significa equilibrio aprobado.

## 19-09-2026 · Revisión del plan solicitada por el usuario

**Encargo actualizado:** priorizar las correcciones del plan y el traspaso a otras sesiones,
no construir nuevas tareas. **Resultado:** T-047 queda bloqueada, sin cambios de reglas; la
siguiente tarea implementable es T-048. Esta revisión documental sí queda terminada.

### Orden para continuar sin volver a investigar lo mismo

| Orden | Tarea | Qué resuelve | Qué no debe hacer |
|---|---|---|---|
| 1 | [T-048](T-048-auditoria-del-banco.md) | Métricas, procedencia y criterios auditables | Equilibrar con los cinco semáforos antiguos |
| 2 | [T-049](T-049-preparacion-pura-de-partidas.md) | Recorte y arranque compartidos sin servidor | Recortar a posteriori lo que visitó un robot |
| 3 | [T-050](T-050-robots-viables.md) | Corregir planes y demostrar las vías | Compensar un robot roto con bonos a su casa |
| 4 | [T-051](T-051-ausencia-equivalente.md) | Comparar planes equivalentes y aislar divergencias | Ejecutar decisiones ocultas mientras el jugador está ausente |
| 5 | [T-047](T-047-equilibrio-v1.md) | Ajustar las tablas con una referencia fiable | Cambiar mapa, robots y valores en el mismo ensayo |

T-065 queda para integrar y persistir la preparación de T-049. T-060 sigue después del equilibrio.
No se construyen esas cuatro tareas en esta revisión. Sus fichas contienen alcance, archivos,
pruebas y criterios para trabajar una por sesión; T-049 declara las decisiones de algoritmo que
requieren medición antes de implementar, en vez de inventar cifras sin ensayo.

### Evidencia y grado de certeza

| Hallazgo | Evidencia observada | Conclusión y destino |
|---|---|---|
| Dependencia circular | T-047 necesita el recorte de T-065; T-065 depende de T-062 → T-061 → T-060 → T-047 | Confirmado en el plan. Extraer preparación pura a T-049 |
| El informe no verifica T-047 | `informe.ts:SALUD` usa 20 % y 20 turnos; faltan tiempos de hitos/obras en exportaciones; medias redondeadas | Confirmado. T-048 debe evaluar todos los criterios |
| Actividad confundida con utilidad | `Registro.anotar` hace `sinDecision: decision === 0`; la CLI valida estructura con `validarOrdenEntrante` | Confirmado. No prueba aceptación semántica ni una decisión útil |
| Arbitraje débilmente medido | `arbitrajesDe` cruza conjuntos de compras/ventas por recurso y plaza, sin orden temporal ni trazabilidad | Confirmado. Puede contar una venta anterior o producción propia; T-048 |
| Visitas intermedias potencialmente omitidas | `anotarTierra` mira dueño/influencia y posición final, no todos los pasos del turno | Riesgo de infracontar; escribir caso reducido en T-048 antes de corregir |
| Hortelano sin salida comercial en su plan | `robots/hortelanos.ts` pide tratar/vender, pero no mercado; referencia: comercio 0 e inactividad 54,5 % | Confirmado. Revisar solares y secuencia en T-050; no atribuir todo el paro a esto sin aislarlo |
| Viaje y retorno mal representados | `panDeViaje`/`panDeIda` aproximan paso y omiten modificador de bastimento; exploración admite malvivir | Confirmado en código. Su impacto exacto exige regresiones de T-050 |
| Recuperación de recua necesaria | En porte40, 1492, T200, exploradora de Mesta `recua-14`: una acémila, porte 4, en Cáceres | Observado en el snapshot; no prueba que todas las expediciones fallen por la misma causa |
| Mesta no demuestra ciclo completo | `conocePastos` acepta uno de los dos pastos; antelación fija de dos turnos; test preparado empieza en Zafra con feria | Confirmado. Prueba de capacidad no equivale a viabilidad normal; T-050 |
| Mercader probado en escenario favorable | `vias.test.ts` prepara dos plazas propias y carestía de sal durante 40 turnos | Confirmado. No demuestra negocio natural fuera del dominio; T-050 |
| Ausencia sin equivalencia de planes demostrada | Pedidos no programados, rutas no circulares por defecto y mayordomo común solo fiscal | Confirmado. La gran diferencia no puede atribuirse solo al motor; T-051 |
| T-045 tiene evidencia acotada | 175/175 se refiere a obras, tres exploraciones e impuestos, no a las ocho economías | Confirmado. Mantener test y ampliar, sin declarar el principio global resuelto |
| Semilla contradictoria | T-065 proponía hacerla visible; docs/02 §2.6 y T-044 la ocultan | Corregido T-065: conservar privacidad, sin nueva política de publicación |
| Intención pública y orden interna | T-062 habla de costes calculados por servidor, pero no separaba claramente su DTO | Añadida obligación explícita de fijar autor, coste, turno, estado y marcas internas en servidor |

**No demostrado:** que ampliar el porte arregle la Mesta; que reducir liquidez arregle el arbitraje;
que la ausencia requiera necesariamente ampliar el núcleo; que un prestigio bajo sea un problema
de multiplicadores de casa. Cada afirmación necesita aislamiento experimental.

### Experimentos ya ejecutados

Base de código: `8a30026894b8bb9aa432f4ffd9cf9391cfa2288f` (cierre de T-046).
Mundo: `v1`, 403 comarcas. Ocho casas, 200 turnos, semillas `1492`, `1492-2`, `1492-3`, cadencias
1 y 6. Solo cambian los campos indicados de `paquetes/nucleo/src/datos/movimiento.ts`.

| Ensayo | Hipótesis y cambio | Resultado | Decisión |
|---|---|---|---|
| Base | Reproducir la referencia sin cambios | CSV idéntico byte a byte al de T-046; 53,9 s | Referencia confirmada |
| porte40 | Más capacidad desbloquea las ferias: `portePorAcemila` 1 → 4; bastimento sigue en 2 | Mesta: ingresos de feria 0; mercader: arbitrajes 0. Monjes pasan de 167,6 % a 340,5 % de mediana. Tierra sin usar: 235 → 160 de 403; 57,7 s | Descartado: no cumple la hipótesis principal y agrava el desequilibrio |
| logistica30 | Menor consumo permite ida y vuelta: desde la base, `portePorAcemila` 1 → 3 y `bastimentoPorJornada` 2 → 1 | Mesta: feria 0; mercader: arbitrajes 0. Monjes 278,8 %; tierra sin usar 157 de 403; 58,9 s | Descartado: sigue sin resolver las vías; no adoptar por mejorar solo la exploración |

Los porcentajes de esta tabla son las **medias del informe antiguo**, no los criterios nuevos por
partida. Los cambios de logística pertenecen al mismo grupo; no se alteraron mercado, casas,
prestigio ni robots. **Las tablas finales son exactamente las anteriores a los experimentos.**

Informes y CSV:

- [Base histórica](../../herramientas/banco/informes/2026-09-19-1492.md).
- [porte40](../../herramientas/banco/informes/T-047-porte40-1492.md) y su manifiesto JSON adyacente.
- [logistica30](../../herramientas/banco/informes/T-047-logistica30-1492.md) y su manifiesto JSON adyacente.

Los informes experimentales llevan el encabezado automático «escenario normal», porque el banco
actual no registra cambios de tablas: **el manifiesto identifica las reglas reales de cada ensayo**.
La instrumentación permanente de procedencia se implementará en T-048.

### Reproducción de los ensayos

Usar un checkout desechable de la revisión indicada, sin modificar la rama de trabajo. Aplicar
solo los campos del manifiesto; los valores restantes proceden de esa revisión. Ejecutar:

```bash
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-047-porte40
# Restaurar movimiento.ts a la base y aplicar los dos campos de logistica30 antes del segundo.
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-047-logistica30
npm run banco:comparar -- herramientas/banco/informes/2026-09-19-1492.csv herramientas/banco/informes/T-047-porte40-1492.csv
npm run banco:comparar -- herramientas/banco/informes/2026-09-19-1492.csv herramientas/banco/informes/T-047-logistica30-1492.csv
```

Las dos comparaciones se ejecutaron con éxito. No se ensayó liquidez ni se lanzaron 1085/1212:
el usuario priorizó corregir el plan y no había candidato aceptable que confirmar.

### Repaso de aceptación de T-047 sobre la base

| Criterio | Evidencia disponible | Estado |
|---|---|---|
| Prestigio 80 %–120 % | Medias de casa entre 25,0 % y 167,6 % | Incumple incluso el agregado; falta exportación por partida |
| Ninguna casa gana las tres | Ganadores reales de 1492, 1492-2 y 1492-3: monjes, hortelanos, hortelanos | Cumple esta campaña; faltan 1085/1212 |
| Menos de 10 % sin decisión útil | Hortelanos 54,5 % sin órdenes; la utilidad no está medida | No permite aprobar; T-048/T-050 |
| Escasez 2 %–15 % | Hortelanos 0 % de media; ferrones 24,5 % en 1492-2 | Incumple; falta demostrar planes competentes |
| Precio extremo menos de 10 turnos | Solo hay alerta a más de 20 | No evaluable con el informe conservado |
| Menos de 5 % de mapa sin usar | 235/403 = 58,3 % incluso tras unir las tres partidas | Incumple; recorte T-049 y medición T-048 |
| Ausencia menor de 5 % | Todas las medias de casa superan 5 % (7,5 %–142,6 % en el informe antiguo) | Incumple la comparación actual; no aísla planes equivalentes |
| Primer pequeño dominio T60–T100 | Monjes lo logran en T34, T33 y T32 | Incumple en las tres repeticiones |
| Primera obra mayor T80–T130 | Canteros: hito `maestro-de-obra` en T88 en las tres; ningún otro lo registra | Cumple esta campaña; exportarlo en T-048 |
| Curva agrícola y tensión anual | Se leyeron las 200 filas por casa de 1492: canteros sufren inviernos iniciales con pan 0; hortelanos acumulan cientos | Insuficiente para validar todas las vías; respetar excepciones de acequia |
| Vías reconocibles | El informe marca seis de ocho; Mesta y mercader no cumplen su prueba de vía | Incumple; revisar los robots antes de atribuir causas |

Los turnos de hitos y ganadores se leyeron de los estados finales guardados cada diez turnos.
El registro conserva la fecha exacta del hito, por eso T88 no es una aproximación a T90.
Esos snapshots no se versionan; se regeneran con la base indicada. T-048 debe conservar estas
cifras directamente en los informes para evitar ese paso manual.

### Criterio de coste para las próximas sesiones

Empezar por el caso reducido de la ficha y ejecutar la campaña 1492 solo cuando pase. Confirmar
un candidato con 1085/1212 al final. No repetir estos dos experimentos descartados sin una nueva
razón (por ejemplo, robots corregidos); no explorar combinaciones de bonos antes de completar
las dependencias. Una tarea, una referencia medible y un commit por sesión.

### Verificación de esta revisión

`npm run verificar` terminó con código 0: tipos, lint y formato correctos; **50 archivos de tests,
899 tests en verde**; el atlas coincide con el generado. `git diff --check` no detectó errores.
Los enlaces locales de las fichas revisadas existen y el grafo del índice (58 tareas) no tiene
ciclos. No hay cambios en `paquetes/` ni en el código de los robots; solo plan, estado y evidencia.

## 21-09-2026 · T-048: el instrumento ya dice la verdad

**Encargo:** que cada criterio de T-047 §5 tenga evidencia por partida y un veredicto reproducible.
**Resultado:** hecho. No se cambió ni una tabla del juego: la comparación del informe nuevo con el
de T-046 no mueve ni una cifra de la partida, solo aparecen y desaparecen métricas.

### Base nueva

| Dato | Valor |
|---|---|
| Informe | [`herramientas/banco/informes/T-048-1492.md`](../../herramientas/banco/informes/T-048-1492.md) |
| Revisión | `bf47da3327a9019ff05cad1717d6100118a5c7b9+T-048`: el cierre de T-047 más el código de esta tarea. Un informe no puede llevar la huella del commit que lo contiene, así que la revisión se pasó a mano con `--revision`; el juego no cambia entre las dos |
| Campaña | `1492`, `1492-2`, `1492-3`, 200 turnos, ocho casas, cadencias 1 y 6 |
| Huella de las tablas | `4814155cae6e8badfd6f9dc95336a8989f2f194c7fe20c9e2bc6546a3a893ef9` |
| Huella del mundo | `aaa0ece9063c47538dde5acc7961bec0eb150d5516805b08c2c4e7960f4b5550` |
| Veredicto | 46 filas cumplen, 87 incumplen, 24 no evaluables; 127 de 157 sin cerrar |

Los archivos `-evaluacion.csv` y `-manifiesto.json` acompañan al informe. A partir de ahora, un
ensayo se compara contra esta base con `npm run banco:comparar`, que avisa si ha cambiado algo más
que el grupo de valores ensayado.

### Lo que el instrumento corregido enseña

| Hallazgo | Antes (T-046) | Ahora |
|---|---|---|
| Ritmo | Se leía a mano de snapshots no versionados | En el informe: dominio T34/T33/T32 y primera obra mayor T88 en las tres; **coincide** con lo leído a mano el 19-09-2026 |
| Tierra | 235 de 403 sin tocar en la **unión** de las tres | 338, 327 y 324 de 403 **por partida** (80–84 %), con las visitas de paso contadas |
| Arbitraje | «arbitrajes» cruzaba conjuntos de compras y ventas | **Cero negocios con traza** en toda la campaña; y miles de cargas vendidas sin compra previa, que son producción propia |
| Precios | Solo había alerta pasados 20 turnos | Racha máxima 0 turnos con la plaza abierta: el precio guardado de una feria cerrada ya no cuenta |
| Actividad | Una media podía tapar una casa parada | Hortelanos 67 % de turnos sin proponer órdenes en `1492`; la utilidad de las órdenes sigue **no evaluable** hasta T-050 |
| Ausencia | Medias por casa | Pareja a pareja en T100 y T200: canteros 248 → 71 en `1492`. Solo 6 de 48 parejas bajan del 5 %, y esas seis quedan apoyadas en la precondición de T-051 |

### El recuento, criterio a criterio

| Criterio | Filas | Cumplen | Incumplen | No evaluables |
|---|---:|---:|---:|---:|
| prestigio | 24 | 4 | 20 | 0 |
| actividad | 24 | 19 | 5 | 0 |
| decisiones útiles | 24 | 0 | 0 | 24 |
| escasez | 24 | 10 | 14 | 0 |
| ausencia | 48 | 6 | 42 | 0 |
| precios | 3 | 3 | 0 | 0 |
| tierra | 3 | 0 | 3 | 0 |
| dominio | 3 | 0 | 3 | 0 |
| obra mayor | 3 | 3 | 0 | 0 |
| ganadores | 1 | 1 | 0 | 0 |

De los 46 «cumple», **16 se apoyan en una precondición pendiente** (10 de escasez, por T-050, y 6 de
ausencia, por T-051): no cierran su criterio.

### Lo que sigue sin poder afirmarse

«No evaluable» sigue siendo el estado de las decisiones útiles (T-050), y las filas de escasez,
tierra y ausencia que cumplen lo hacen apoyadas en precondiciones de T-049, T-050 y T-051. Por eso
`--evaluar` devuelve 2 y **el equilibrio sigue abierto**, como estaba previsto en T-048 §7.

## 21-09-2026 · T-049: el mapa que se juega y con qué se empieza

**Encargo:** un recorte y un arranque reproducibles, compartidos por banco y servidor, con orígenes
viables para cada casa. **Resultado:** hecho. Cambia el escenario de partida, no el balance de
ninguna casa: las tablas de producción, mercado, prestigio y movimiento están intactas.

### Base nueva

| Dato | Valor |
|---|---|
| Informe | [`herramientas/banco/informes/T-049-1492.md`](../../herramientas/banco/informes/T-049-1492.md) |
| Revisión | `fbf7a33+T-049` (el cierre de T-048 más esta tarea) |
| Mapa jugado | **208 comarcas** por partida, recortadas de las 403 del catálogo |
| Veredicto | 42 filas cumplen, 91 incumplen, 24 no evaluables (127 → 130 sin cerrar) |

**No se compara cifra a cifra con `T-048-1492`.** Ha cambiado el escenario entero —otro mapa, otros
orígenes, otro arranque—, así que una casa que sube o baja no dice nada sobre su balance. Lo que sí
se puede leer es el criterio de tierra, que es justo lo que esta tarea tenía que mover.

### Lo que mueve el recorte

| Criterio | T-048 (península entera) | T-049 (recorte) |
|---|---|---|
| Tierra sin usar | 82 % de 403 comarcas | **66 % de 208** |
| Prestigio dentro de la horquilla | 4 de 24 | **8 de 24** |
| Escasez dentro de la horquilla | 10 de 24 | 9 de 24 |
| Actividad (turnos sin proponer órdenes) | 19 de 24 cumplen | 15 de 24 |
| Primera obra mayor | T88 en las tres, cumple | **T61, T70 y T72: ahora llega demasiado pronto** |

### Lo que esto enseña, y para quién

1. **El recorte no puede cerrar el criterio de tierra.** Ocho capitales separadas seis jornadas
   necesitan unas 200 comarcas, y los ocho robots solo pisan unas 70 en 200 turnos. Para bajar del
   5 % hacen falta **robots que anden** (T-050), no un recorte más pequeño: no existe.
2. **El cantero llega demasiado pronto a su primera obra mayor** (T61–T72 frente al objetivo
   T80–T130) porque ahora empieza con su cantera. Es una cifra de equilibrio, para T-047.
3. **Los orígenes condenados dejan de estarlo.** Con el arranque por comarca, la muestra fija —un
   origen por perfil y casa, elegido por orden de identificador— aguanta el primer año entera,
   incluidos los `labor 1` que la bitácora señalaba (Molina, Bahía de Cádiz).
4. **Dejar sin granjas a quien «vive de comprar» lo condena.** El primer diseño le quitaba las
   granjas a la Mesta y a los mercaderes: con el tope entero de maravedís no llegaban al final del
   año (a los mercaderes les faltaban 546 de pan y solo podían comprar 338). Ahora siembran menos
   —les basta cubrir el 70 % del año— en vez de no sembrar.
5. **Un edificio regalado puede ser una trampa.** Al ferrón se le daba una carbonera de salida, y su
   consumo de 4 de madera por turno se comía los 60 del arranque antes de que pudiera levantar la
   ferrería: dejó de sacar hierro en 96 turnos. Hoy empieza sin ella y hay un test que impide dar
   ningún edificio que coma algo que el arranque no entrega.

## 22-09-2026 · T-050: robots que juegan su vía y dicen por qué no

**Encargo:** que los robots ejecuten planes legales, sostenibles y propios de su casa, y que cada
vía ausente tenga causa. **Resultado:** hecho. **Ninguna tabla del juego cambia**: el núcleo solo
exporta funciones que ya existían, para que los robots prevean los viajes con la misma fórmula.

### Base nueva

| Dato | Valor |
|---|---|
| Informe | [`herramientas/banco/informes/T-050-1492.md`](../../herramientas/banco/informes/T-050-1492.md) |
| Revisión | `9ce5572+T-050` (el checkpoint de T-050 más su cierre) |
| Versiones | métricas 3, robots 2 |
| Veredicto | 71 filas cumplen, 86 incumplen, **0 no evaluables** (T-049: 42 / 91 / 24) |

**No se compara cifra a cifra con `T-049-1492`**: cambian los robots, que es lo que se mide. Lo que
se lee es qué criterios pasan a medirse y qué vías aparecen.

### El recuento, criterio a criterio

| Criterio | T-049 | T-050 | Lectura |
|---|---|---|---|
| decisiones útiles | 24 no evaluables | **24 cumplen** (0–2 % de turnos sin orden útil ni plan en marcha) | Se mide por fin; ningún robot se queda parado |
| actividad | 15 cumplen, 9 incumplen | 23 cumplen, 1 incumple | Los hortelanos tienen mercado y venden |
| escasez | 9 cumplen, 15 incumplen | 12 cumplen, 12 incumplen | Ya sin precondición: los robots juegan su plan |
| obra mayor | 3 incumplen (T61, T70, T72) | 2 cumplen (primera en T69, T105 y T93) | El cantero vende piedra para pagar la madera de sus obras |
| tierra | 66 % sin usar | **38–50 %** sin usar | Exploración encadenada y arriesgada; y las visitas del ganado ya se reconstruyen |
| prestigio | 8 cumplen | 6 cumplen | Monjes y hortelanos se disparan (≈ 4 veces la mediana); la Mesta y los ferrones, abajo |
| ausencia | 6 cumplen | 1 cumple | El robot diligente juega mucho mejor que el de cada seis: es T-051 |
| ganadores | cumple | incumple | Monjes ganan las tres |
| dominio | 3 incumplen | 3 incumplen | Sin cambio |
| precios | 3 cumplen | 3 cumplen | Sin cambio |

### Las vías, partida a partida

Quince de veinticuatro. Las nueve que faltan tienen su motivo en el informe:

| Casa | Partidas sin vía | Motivo principal | Categoría |
|---|---|---|---|
| Mercaderes | 3 de 3 | Con los precios que sabe, ningún viaje deja ganancia después del bastimento | reglas |
| Arrieros | 3 de 3 | No sabe precios de dos plazas a su alcance, o no dejan ganancia | mapa / reglas |
| Mesta | 2 de 3 | No conoce uno de los dos pastos al que pueda llegar el ganado | mapa |
| Ferrones | 1 de 3 (Bilbao) | Escasez y un esencial sin recursos | recursos |

Probado también un origen por perfil y casa, en solitario y 96 turnos: ninguna vía ausente queda
sin motivo de su vía (ninguna aparece como «defecto del robot»).

### Hallazgos para T-047 (hechos medidos, no hipótesis)

1. **El arbitraje no paga el camino con porte 10.** Llevar sal a una vecina a tres jornadas deja
   dos cargas de hueco tras el pan de ida y vuelta, y el margen no cubre el bastimento. Con la
   tradición «Compañía» (porte 13) o con la recua maragata (porte 15, +1 jornada) sí sale: lo
   demuestran las pruebas de capacidad. Los mercaderes no tienen hoy vía en una partida normal.
2. **Desde la sierra no se explora.** Un tramo de sierra son 5 jornadas (7,5 en invierno): ni
   malviviendo la vuelta llega una recua de porte 10 más allá de las vecinas. Afecta a la Mesta del
   Pirineo y a cualquier capital de montaña.
3. **Bilbao no es un origen sostenible para los ferrones**, aunque aguante el primer año sin
   órdenes (T-049): la capital no se alimenta y la escasez bloquea sus obras.
4. **Monjes y hortelanos** llegan a unas cuatro veces la mediana; ferrones y Mesta, muy por debajo.
5. La primera obra mayor de cada partida cae ya en la horquilla T80–T130 en dos de tres (T105 y
   T93); en la tercera, T69.
6. **El primer «pequeño dominio» llega pronto** (T43, T48 y T43 frente a T60–T100): sin cambio
   respecto a T-049.

### Reproducción

```bash
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-050 --revision <sha>+T-050
```

## 23-09-2026 · T-051: el mismo plan, dicho antes

**Encargo:** demostrar que una misma estrategia se puede ejecutar sin conectarse más de una vez
cada seis turnos, y separar la ventaja de la información nueva del trámite automatizable.
**Resultado:** hecho, y con la medida fuerte: **igualdad exacta del dominio**. Ninguna tabla del
juego cambia; tampoco el motor.

### Base nueva

| Dato | Valor |
|---|---|
| Informes | [`T-051-1492`](../../herramientas/banco/informes/T-051-1492.md), `T-051-1085` y `T-051-1212` |
| Versiones | robots 3, métricas 4 |
| Veredicto | `1492` y `1085`: 113 cumplen, 44 incumplen; `1212`: 112 y 45. **0 no evaluables** |

### Las dos medidas, que no son la misma

| Medida | Qué compara | Resultado |
|---|---|---|
| **Equivalencia de ejecución** (obligatoria) | El **mismo plan**, dejado por bloques de seis turnos o entregado a mano día a día | **144 de 144 filas al 0,0 %**; el dominio coincide turno a turno en siete de las nueve partidas |
| **Sensibilidad a la frecuencia** (diagnóstico) | **Dos planes distintos**: decidir cada turno o cada seis | Sigue habiendo diferencia; lo que el diligente decide entre bloques es casi todo `mercado` y `carga` |

El criterio de ausencia de T-047 §5 pasa a juzgarse sobre la primera medida: **48 de 48 filas
cumplen en cada semilla** (antes, 1 de 48 en `T-050-1492`).

### El recuento, criterio a criterio (semilla 1492)

| Criterio | T-050 | T-051 | Lectura |
|---|---|---|---|
| ausencia | 1 cumple, 47 incumplen | **48 cumplen** | Se mide el mismo plan, no dos planes distintos |
| prestigio | 6 cumplen | 3 cumplen | Los robots que planean el bloque separan más a las casas: es trabajo de T-047 |
| escasez | 12 cumplen | 11 cumplen | Sin cambio apreciable |
| actividad | 23 cumplen | 22 cumplen | Sin cambio apreciable |
| decisiones útiles | 24 cumplen | 24 cumplen | Sin cambio |
| obra mayor | 2 cumplen | 2 cumplen | Sin cambio |
| tierra, dominio, ganadores | incumplen | incumplen | Sin cambio: son de T-047 |

### Lo que hizo falta para llegar al 0,0 %

Ninguna regla nueva: lo que faltaba era que los robots **dijeran el plan entero** con lo que el
motor ya daba.

1. La cola de cada comarca admite una obra por turno hasta la próxima decisión (antes, una sola).
2. El tratante deja dicho el trato de cada turno del bloque, con su fecha, descargando lo que trajo
   el turno anterior. Sin eso comerciaba la sexta parte.
3. Las recuas dejan viajes completos: ida, cometido y vuelta. Antes se quedaban paradas esperando a
   que alguien entrara a mandarlas a casa.
4. El emisario fecha su regreso para cuando se le acabe el pan de la presencia.

### Hallazgo de reglas (escrito en docs/02 §2.5.6)

Una orden **suelta** se paga al darla y se cancela con `sin-recursos` si el almacén no llega en ese
momento; la misma orden **en cola** no reserva nada y empieza en cuanto hay con qué, ya en la fase
de obras, después de la producción del turno. La cola es, por tanto, el sitio de lo que se hará «en
cuanto se pueda», y la tienen igual los dos jugadores. Medido: entregar el plan a mano **sin** las
colas retrasaba un turno cada obra apretada y hundía a los salineros de `1492` (250 → 106 de
prestigio en T100). Con las colas, igualdad exacta. El motor no necesita cambiar: quien juega cada
día tiene la misma herramienta.

### Divergencias que quedan, con su primera causa

En `1492-2` (T109) y en `1212` (T175 y T193) el dominio se separa tarde sin mover el prestigio en
T100 ni en T200. Causa: las órdenes que no llegaron a trabajar dentro de la ventana medida —una
`incorporar` esperando `sin-ventaja`, un `cometido` con la recua ocupada— no se entregan en la
variante a mano, y su hueco mueve un par de cargas de pan. Es un artefacto de la medida.

### Lo que sigue abierto para T-047

- **Prestigio**: solo 3 de 24 filas dentro de la horquilla en `1492` (2 de 24 en `1085` y `1212`).
  Monjes y hortelanos arriba; ferrones y Mesta abajo.
- **Sensibilidad a la frecuencia**: entrar cada turno sigue dando ventaja en casi todas las casas
  (entre el 3,6 % y el 30 %, y más en cifras pequeñas como las de los ferrones). Lo que se decide
  entre bloques es casi todo comercio: reaccionar a precios nuevos es **información**, no trámite.
  Los canteros y los monjes salen incluso mejor entrando cada seis turnos.
- Tierra, dominio y ganadores siguen igual que en T-050.

### Reproducción

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-051 --revision <sha>+T-051
npm run banco -- --semilla 1085 --turnos 200 --repeticiones 3 --fecha T-051 --revision <sha>+T-051
npm run banco -- --semilla 1212 --turnos 200 --repeticiones 3 --fecha T-051 --revision <sha>+T-051
```

## 23-09-2026 · T-047 (en curso): el marcador solo paga por crecer

**Encargo:** ajustar las tablas hasta cumplir los criterios de §5. **Estado:** abierto. Esta sesión
deja el diagnóstico medido, cinco ensayos aislados y **un cambio adoptado**.

### El diagnóstico, con cifras

Sobre la base de T-051 (robots 3, métricas 4, nueve partidas de las campañas 1492, 1085 y 1212):

| Capítulo del prestigio | Media de las ocho casas |
|---|---:|
| población | 71 |
| territorio | 92 |
| obras | 38 |
| hitos | 89 |
| exploración | 45 |
| **comercio, ganadería, industria, caminos** | **0, 1, 0 y 0** |

Cuatro de los nueve capítulos dan **cero a todo el mundo**, así que el prestigio de una casa es casi
exactamente su pan producido: monjes 28 376 y hortelanos 28 153 de pan frente a 1 125 de los
ferrones, y el prestigio va en el mismo orden (417 %, 379 % y 14 % de la mediana).

Una capa más abajo está la causa: **el comercio no existe**. En las nueve partidas,
`negociosRentables`, `ventasFuera` e `ingresosDeFeria` valen **0**. El precio base de cada recurso es
un número global —el mismo en Añana que en Sevilla— y lo único que lo mueve por regiones es la
carestía de sal, un acontecimiento de cinco turnos que cae como mucho una vez al año. Con los
mercaderes menores cubriendo el cupo entero de la plaza en los dos lados (`liquidez` 1000) y la
regresión devolviendo el precio al base, **todas las plazas cotizan lo mismo, siempre**. Por eso las
tres casas que viven de comerciar no tienen economía, y por eso ganar es producir pan.

Medido también, y descartado como explicación: **administrar no frena a nadie**. Al turno 200 la
deuda de administración es 0 en las ocho casas, incluidos los monjes con 16 comarcas.

### Los ensayos

Todos sobre la base `T-051-*`, un grupo de valores por ensayo, semilla 1492 con tres repeticiones
salvo donde se diga.

| Ensayo | Hipótesis y cambio | Resultado | Decisión |
|---|---|---|---|
| bastimento1 | Una recua se come su porte: `movimiento.bastimentoPorJornada` 2 → 1 | **Ni un negocio**: `negociosRentables` sigue en 0. Mesta 49 → 62 %, tierra pisada 239 → 266, pero los criterios bajan de 113 a 111 | Descartado: no es un problema de capacidad |
| colchon | El arranque topa en 400 maravedís lo que promete compensar del año: `arranque.ajuste.maravedisMaximos` 400 → 1200 | **Cero diferencia**, byte a byte: el tope no ataba. El almacén del ferrón al turno 10 es idéntico | Descartado |
| lonja | Una lonja gasta 28 maravedís de sal para salvar 18 de pan: `edificios.lonja.consumo.sal` 2 → 1 | Ferrones 14 → 12 %; el resto igual | Descartado: la sal no era lo que ataba |
| hierro | **La casa del hierro empieza donde no hay hierro**: su segunda tarjeta solo pedía que una *vecina* tuviera hierro 2 | Ferrones 14 → 59 % (1492), 5 → 57 % (1085), 5 → 49 % (1212); escasez 60 → 10 turnos; hierro producido 171 → 446 | **Adoptado**, y afinado abajo |
| ferron-compra | El ferrón vive de comprar el pan: `compraElPan` true | **Cero diferencia**: en una comarca de labor 1 da igual apuntar al 95 % del año que al 70 %, la tierra no llega a ninguno | Descartado |

### El cambio adoptado

`casas.ferrones.origenes`: una sola tarjeta, `hierro ≥ 1` **y** `monte ≥ 2` en la propia comarca.

Dos defectos en uno:

1. La tarjeta `vecinaConPotencial: hierro 2` hacía que en **cuatro de cada cinco semillas** el ferrón
   empezara con `hierro: 0` en su capital: su vía era imposible sin conquistar antes una vecina, y
   con una sola comarca en 200 turnos no la conquistaba nunca.
2. Al quitarla apareció el segundo: `campo-de-calatrava` tiene hierro pero no monte, y **sin
   carbonera no anda la ferrería**. Lo cazó `solvencia.test.ts` —el instrumento de T-050 funcionando
   como debía—, no una lectura a ojo. Por eso el origen pide la cadena entera.

Quedan cuatro orígenes posibles (Bilbao, Ripollés, Señorío de Molina y Valle de Alcudia), suficientes
para las tres tarjetas por casa.

**El recuento no mejora**: 109, 115 y 113 filas cumplen frente a 113, 113 y 112 de la base. Se adopta
igualmente porque es una corrección, no un ajuste: una casa no puede empezar sin el recurso que
define su oficio, y ahora hay una prueba que lo impide. Lo que el cambio no arregla —y por eso el
recuento no se mueve— es que **el hierro está en tierra pobre y el ferrón sigue sin poder venderlo**:
produce 446 cargas y vende 6. Su prestigio va de 9 % a 53 % según la tarjeta que le toque.

### Segunda iteración: la geografía de precios no es una cifra

Con la base `T-047-hierro-*`, dos ensayos más sobre el grupo del mercado, el primero de la lista.

| Ensayo | Hipótesis y cambio | Resultado | Decisión |
|---|---|---|---|
| liquidez300 | Los menores cubren el cupo entero por los dos lados y aplanan el precio: `mercado.liquidezMercaderesMenoresMil` 1000 → 300 | **Ni un negocio**; el prestigio pasa a 0 de 24 filas y la tierra pisada cae de 264 a 159 comarcas. En una partida donde cada casa comercia casi sola, **los menores son el mercado**: recortarlos no crea precios, quita el comprador | Descartado |
| margen20 | Con una horquilla estrecha el precio se escapa del base y las plazas se separan: `mercado.margenMercaderesMenoresMil` 100 → 20 | Dispersión de sal 0,5, hierro 0,2 y lana **0,0** puntos; `negociosRentables` sigue en 0 en las ocho casas; 107 filas cumplen frente a 109 | Descartado |

**La medición que cierra el asunto.** Al turno 100, entre las diez plazas de la partida:

| Recurso | Dispersión entre plazas |
|---|---:|
| lana | **0,0 puntos** |
| hierro | 0,4 |
| sal | 0,6 |
| madera | 1,6 |
| piedra | 8,6 |
| pan | 16,2 |

La sal, el hierro y la lana —lo que distingue una comarca de otra— cuestan lo mismo en las diez
plazas, y la comisión sola es un 2 % por lado. La razón se lee en el código: el precio de una plaza
solo se mueve si alguien compra o vende **allí**, y como esos tres recursos no se comercian en
ninguna parte, se quedan clavados en su único número global. `DATOS_DE_RECURSOS` tiene **un**
`precioBaseMil` por recurso para toda la península.

**Decisión: ninguna cifra puede abaratar la sal de Añana frente a la de Sevilla, porque solo hay un
número para la sal.** Eso es lógica del motor, no equilibrio, así que va en ficha aparte como manda
§3 de T-047: **[T-052 · Geografía de precios](T-052-geografia-de-precios.md)**, el precio base por
comarca derivado de sus potenciales. **T-047 se reanuda después**, con la base que deje T-052: no
tiene sentido repartir el prestigio de unas vías comerciales que todavía no existen.

Los siete ensayos de esta sesión dejan los valores del juego **exactamente como estaban**, salvo el
origen de los ferrones.

### Lo que esto deja claro para la próxima sesión

El orden de ataque ya no es una lista de sospechas, sino una cadena medida:

1. **Sin geografía de precios no hay comercio**, y sin comercio cuatro casas no convierten su oficio
   en comida. Medido y resuelto en la segunda iteración de esta misma sesión: hace falta lógica, y
   está en **[T-052](T-052-geografia-de-precios.md)**.
2. **Los monjes se disparan** (417–572 % de la mediana) y ganan las nueve repeticiones. Su
   `lealtadMinima: 50` está muy por encima de `lealtadDesleal: 20`, así que ninguna penalización
   territorial les llega nunca: ni la deuda de administración, ni la lejanía, ni el abandono.
3. **El marcador paga 20 por comarca y 1 por cada cinco vecinos, y 10 por un año trashumante o 30
   por una feria destacada.** Mientras los capítulos del oficio valgan un orden de magnitud menos que
   ocupar tierra, ninguna vía compite con crecer.

### Reproducción

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-047-hierro --revision <sha>+T-047
npm run banco -- --semilla 1085 --turnos 200 --repeticiones 3 --fecha T-047-hierro --revision <sha>+T-047
npm run banco -- --semilla 1212 --turnos 200 --repeticiones 3 --fecha T-047-hierro --revision <sha>+T-047
npm run banco:comparar -- herramientas/banco/informes/T-051-1492.csv herramientas/banco/informes/T-047-hierro-1492.csv
```

Los informes de los ensayos descartados que cambiaron alguna cifra se conservan
(`E1-bastimento1-1492`, con su manifiesto); los que salieron idénticos a la base no, porque su resultado es esta
tabla.

## 23-09-2026 · T-052: la geografía en el precio, y lo que quedó debajo

**Encargo:** que el precio base deje de ser un número para toda la península. **Resultado:** hecho.
Y al medirlo apareció la causa de verdad de que no haya comercio, que no era ni el precio ni el
porte.

### Lo que cambia

El precio base de un recurso en una comarca es el del catálogo por la abundancia del potencial que
lo produce (`abundanciaMil: [1200, 1100, 1000, 900, 800, 700]`, indexada por el potencial 0–5). El
catálogo es el precio de una **comarca corriente**: desde ahí la escasez encarece poco y la
abundancia abarata mucho, porque lo que mueve el comercio es de dónde *sale* la mercancía. Escrito
en [docs/03-economia.md §3.10.2](../03-economia.md).

| Dispersión entre las diez plazas de la partida, turno 100 | Antes | Después |
|---|---:|---:|
| lana | 0,0 pts | **30,0** |
| hierro | 0,4 | **40,3** |
| sal | 0,6 | **40,4** |
| madera | 1,6 | 35,3 |
| piedra | 8,6 | 27,0 |
| pan | 16,2 | 49,3 |

Veredicto del banco: 112, 111 y 109 filas cumplen en `1492`, `1085` y `1212`, frente a 109, 115 y
113 de `T-047-hierro`. **Plano, y era de esperar**: esta ficha no ajusta, pone geografía donde no la
había. `ganadores` pasa a cumplir en `1492`.

### El hallazgo grande: no hay dónde comerciar

`negociosRentables` sigue en **0** en las nueve partidas. La cadena de descartes, cada uno medido:

| Sospecha | Ensayo | Resultado |
|---|---|---|
| El precio es plano | T-052: precio base por comarca | Dispersión de 0,6 → 40,4 en la sal. **Cero negocios** |
| El porte no da para el viaje | Con T-052 puesto, `portePorAcemila` 1 → 2 | Mercaderes 59 → 73 % y Mesta 24 → 48 % de la mediana, pero **cero negocios**; los criterios bajan de 112 a 107 |
| Los menores aplanan el mercado | liquidez a 300 y margen al 2 % | Los dos descartados el mismo día, arriba |

La causa está en el estado guardado del turno 100 de `T-052-1492`: **hay diez plazas para 208
comarcas**, siete mercados locales —uno por capital, y las capitales se reparten a seis jornadas
unas de otras por diseño— y tres ferias. Un robot casi nunca conoce **dos** plazas a su alcance, así
que no hay entre qué negociar. Por eso `arbitraje.ts` anota `sin-precios-sabidos`.

Eso abre **[T-053 · Plazas donde comerciar](T-053-plazas-donde-comerciar.md)**, que hereda el
criterio de `negociosRentables` con toda esta medida detrás.

### Tres defectos de los robots que solo se ven con precios distintos

`VERSION_ROBOTS` pasa a 4. Estaban desde antes; con un precio único no se notaban.

1. Los límites de precio se medían contra el catálogo: el robot habría vendido sal al 60 % de 14 000
   en una plaza donde vale 16 800, y no la habría comprado nunca donde sí la hay.
2. `paradasDe` repetía la capital cuando la venta era en casa —lo normal ahora, con la mercancía
   barata en la vecina y cara en la propia comarca—, y una ruta con la misma comarca dos veces
   seguidas no es un viaje.
3. El bastimento se valoraba al precio del catálogo, cuando sale del almacén de casa.

### Y una prueba que decía medir otra cosa

La prueba de vía del mercader fabricaba una carestía de sal **en la vecina que tiene salinas** (la
Bureba, la de Poza de la Sal), donde una carestía no encarece nada. Ahora la sal va a la vecina que
no tiene, y el tramo lleva calzada: sin ella la ida y vuelta se come el porte entero en pan, y la
prueba medía el camino en vez de medir al robot.

### Dos criterios rectificados con la medida delante

La ficha de T-052 pedía además que el pan y la lana se quedaran por debajo de 20 puntos de
dispersión y que `negociosRentables` dejara de ser 0. Las dos estaban mal planteadas y se rectifican
en [T-052 §9](T-052-geografia-de-precios.md), no en silencio: el pan varía 49 puntos porque la
`labor` del catálogo va de 1 a 5 y está repartida —y eso **es** el juego, es lo que hace real el
problema del ferrón—, y el segundo confundía el entregable con un efecto que depende de las plazas.

### Reproducción

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-052 --revision <sha>+T-052
npm run banco:comparar -- herramientas/banco/informes/T-047-hierro-1492.csv herramientas/banco/informes/T-052-1492.csv
```

## 23-09-2026 · T-053 (en curso): la venta, plaza del camino

**Encargo:** que haya plazas suficientes y repartidas para que llevar mercancía de una a otra sea
una decisión. **Estado:** abierto, con una pieza hecha y verificada y el siguiente paso medido.

### Lo primero: las ferias no son plazas

El catálogo entero tiene **9 comarcas con feria de 403**, once ferias, y **cada una abre uno o dos
turnos al año** de veinticuatro. Las ferias son el acontecimiento anual, no el mercado de cada
quincena, y no se les toca el calendario porque es histórico. Eso descarta el camino más barato
(subir `recorte.feriasMinimas`): no se puede repartir lo que no existe.

### La decisión de diseño: la venta abre plaza, y se levanta en tierra de nadie

Escrito en [docs/03-economia.md §3.3 y §3.10.1](../03-economia.md). Una venta vale como plaza y es
el único edificio que cabe en una comarca **explorada y sin dueño**, porque las ventas se hacían
fuera de poblado. No da los maravedís ni la lealtad del mercado: **el mercado es el pueblo, la venta
es el camino**. Lo que se levanta allí no pasa a ser tuyo: si alguien incorpora la comarca, se queda
con ella y con lo que haya dentro.

Medido: los robots las plantan de verdad (Arlanza, Monegros y Montes de Oca en `1492`) y las plazas
de una partida suben de **10 a 13**. El veredicto del banco queda en 112 filas que cumplen, las
mismas que la base `T-052`: la venta abre el sitio, todavía no el negocio.

### Cuatro sospechas descartadas, cada una con su medida

| Sospecha | Ensayo | Resultado |
|---|---|---|
| Faltan mercados | Un mercado en cada comarca propia (robots) | Plazas de 10 a 17. **Cero negocios**: el mercader tiene **una sola comarca** toda la partida. Revertido |
| Falta porte | `portePorAcemila` 1 → 2, con ventas y sin ellas | **Cero negocios** en los dos casos |
| Falta dinero | `COLCHON_DE_MARAVEDIS` 60 → 20 | **Cero negocios**. La casa tiene unos 65 maravedís, así que la bolsa de comercio era de **cinco** |
| Faltan ferias | Recuento del catálogo | 9 de 403 comarcas, abiertas 1–2 turnos al año |

### El eslabón que quedaba, y cómo se cerró (24-09-2026)

**Un jugador no se enteraba de lo que él mismo había construido fuera de su dominio.** El robot
plantaba su venta en Arlanza y en el turno 100 su rutina de arbitraje seguía diciendo `conocidas=2`:
las dos plazas de su propia capital. La causa estaba en `fases/12-cronica.ts`: el conocimiento de
una comarca ajena es una **foto** que solo se refrescaba donde el jugador tiene una recua.

Cerrado: `EstadoComarca.ventaDe` guarda quién la levantó —se borra al derribarla y al incorporar la
comarca, porque quien se queda la tierra se queda la venta— y la crónica refresca cada turno el
conocimiento y los precios de su plaza para el ventero. Cinco pruebas nuevas en `obras.test.ts`. Las
huellas de reproducción cambian, como debe ser cuando el estado gana un campo, y se regeneraron.

**Lo que enseña la medida.** El motivo dominante del mercader deja de ser «no sé precios» y pasa a
ser **«hay diferencia de precio, pero comprar, vender y volver no cabe en el porte con su
bastimento»**: 74 turnos de 200 en el mercader y 49 en el arriero. El robot **ve por fin un negocio
de verdad**, y lo único que lo frena es la logística.

`negociosRentables` sigue en 0 y el recuento queda plano (114, 109 y 109 filas cumplen, frente a
112, 111 y 109 de la base `T-052`). Quedan dos paredes, las dos **tablas de T-047**: el porte manda
sobre el mapa (con porte 10 y dos panes por jornada, la ida y vuelta a tres jornadas pide 12 de pan
y no cabe), y **doblar el porte no basta por sí solo** —medido, cero negocios—, porque la otra mitad
es el margen contra lo que cuesta el bastimento. Se miden juntas.

### Reproducción

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-053 --revision <sha>+T-053
```

## 24-09-2026 · Por qué no hay comercio: el precio no sabe de distancias

**Encargo:** medir juntos el porte y el bastimento, que era lo que T-053 y T-047 se señalaban.
**Resultado:** no era eso, y ahora hay diagnóstico cerrado. Ninguna tabla cambia.

### Cinco ensayos, cinco ceros

Todos sobre la base `T-053-*`, semilla 1492 con tres repeticiones.

| Ensayo | Hipótesis | Resultado |
|---|---|---|
| sal12 | La sal del camino cuesta más que el pan que conserva: `jornadasPorSalEnVerano` 4 → 12 | **Cero efecto**, cifra a cifra. No ataba |
| logistica | El porte manda sobre el mapa: porte 2, bastimento 1, sal cada 12 jornadas | **Cero negocios** con una recua generosísima |
| ventas lejos | Las ventas se plantan a 4 jornadas y ahí todo es igual: hasta 12 | **Cero negocios** |
| colchón (impulsos) | El robot guarda 60 maravedís y le quedan 2 para comerciar | **Cero efecto**: el arbitraje tiene **su propio** colchón, que era el que mandaba |
| colchón (arbitraje) | Ese, entonces: 60 → 10, bolsa de 2 a ~52 | **Cero negocios** |

La cuenta de la sal merece quedar escrita aunque no atara: una recua gasta una carga de sal por cada
cuatro jornadas **sea cual sea el pan que lleve**, así que en un viaje de ida y vuelta de tres
jornadas la sal cuesta unos 34 maravedís y el pan unos 32. Y la propia tabla del juego dice que
**una carga de sal conserva cincuenta de pan** (`consumo.panPorSal`). Está ocho veces fuera de
escala con su propia regla; no cambia nada hoy, pero es una incoherencia que conviene arreglar
cuando se toque el bastimento.

### El volcado que lo explica

Rutina de arbitraje del mercader en el turno 120, ya con nueve plazas conocidas:

```
T120 plazas=9 parejas=1 bolsa=2 porte=20
  segria(f)          sal=16800 pan=2100 hierro=28800
  bajo-aragon        sal=16800 pan=2700 hierro=28800
  campo-de-belchite  sal=16800 pan=3000 hierro=28800
  monegros           sal=16800 pan=3000 hierro=28800
  … las nueve, sal=16800 y hierro=28800
  pallars-jussa -> segria  margen=180   (0,18 maravedis por carga)
```

**La sal cuesta lo mismo en las nueve plazas, y el hierro también.** Solo varía el pan, y la mejor
diferencia de toda la partida son 0,18 maravedís por carga.

### El hallazgo: el precio no sabe de distancias

T-052 hace depender el precio del **potencial de la propia comarca**. Ninguna de esas nueve tiene
sal ni hierro, así que todas valen exactamente `base × 1,2`: **una comarca sin sal pegada a una
salina cotiza igual que otra a trescientos kilómetros**. Es lo contrario de cómo funcionaba: la sal
era cara tierra adentro **porque había que llevarla hasta allí**.

Mientras el precio no dependa de lo lejos que esté la comarca de donde se produce, no hay gradiente
que recorrer, y el comercio no puede existir por mucho porte, dinero o plazas que se le den. Eso
amplía T-052 y toca lógica (hace falta el grafo de caminos), así que **es una decisión de diseño que
el usuario debe ver antes de implementarse**; queda anotada en
[T-053 §8](T-053-plazas-donde-comerciar.md) y no se ha abierto ficha por cuenta propia.

## 24-09-2026 · T-047: el marcador deja de pagar solo por ocupar tierra

**Encargo:** atacar lo de T-047 que **no** depende de la decisión pendiente sobre los precios: el
ritmo (el primer «pequeño dominio» llegaba en T43 y el objetivo es T60–T100) y los monjes, que se
disparan. **Resultado:** primera ganancia de equilibrio de la tarea, confirmada en las tres campañas.

### Lo que se ensayó y por qué se descartó

El diseño promete que «expandirse cuesta administración y lealtad: el líder no se dispara solo», así
que se atacó primero por ahí. Tres ensayos sobre el grupo de la administración:

| Ensayo | Resultado |
|---|---|
| `administracionBase` 4 → 10 y `porJornada` 2 → 5 | Frena de verdad (los monjes bajan de 14 comarcas a 6) y el prestigio sube a **7 de 24**, pero arrasa: la actividad cae de 22 a 14 y **nadie termina una obra mayor**. 103 filas cumplen |
| `administracionBase` 4 → 6 y `porJornada` 2 → 3 | 113 filas; prestigio 5; obra mayor sigue en **0** |
| `administracionBase` 4 → 8, dejando la distancia quieta | 112 filas; prestigio 5; obra mayor **0** |

**El patrón es el hallazgo:** cualquier subida de la administración mata las obras mayores, porque
se pagan de lo mismo y las casas no tienen maravedís para las dos cosas. Es la tercera confirmación
de que la economía está sin dinero, y no se arregla desde la administración. Los tres, descartados.

### El cambio adoptado: la tabla de prestigio

Con una comarca a 20 y una feria a 30, **ocupar tierra pesaba unas cuatro veces más que cualquier
oficio**, y el marcador se reducía a quien producía más pan. La tabla nueva paga lo que cuesta
lograr cada cosa:

| Concepto | Antes | Ahora |
|---|---:|---:|
| Comarca propia | 20 (+10 con fuero) | **8** (+4 con fuero) |
| Comarca explorada | 3 | **8** |
| Año trashumante completo | 10 | **30** |
| Feria destacada | 30 | **60** |
| Aperos de nivel 3 o más | 10 | **25** |

Escrito en [docs/06-competicion.md §6.3](../06-competicion.md) con su porqué.

| Campaña | Base `T-053` | Con el marcador nuevo |
|---|---:|---:|
| 1492 | 114 | **116** |
| 1085 | 109 | **112** |
| 1212 | 109 | **113** |

La horquilla se estrecha en lo que mide el criterio: monjes de 457 % a 327 % de la mediana,
hortelanos de 385 % a 280 %, mercaderes de 63 % a 80 % y ferrones de 48 % a 51 %. Las obras mayores
siguen cumpliendo 3 de 3, la actividad 22 de 24 y `ganadores` cumple.

Se ajustaron a mano los tres escenarios de `prestigio.test.ts` (49 → 72, 853 → 931 y −45 → −52) y se
regeneraron las huellas de reproducción, que cambian porque el prestigio entra en el estado.

### Lo que sigue sin moverse

`dominio` y `tierra` siguen incumpliendo 3 de 3, y el prestigio va por 4 filas de 24: la horquilla
80–120 % pide que **todas** las casas compitan, y cuatro de ellas siguen sin economía mientras el
comercio no exista. Eso depende de la decisión pendiente sobre los precios y la distancia.

## 24-09-2026 · El ritmo del primer dominio choca con la vía de los monjes

**Encargo:** que el primer «pequeño dominio» de la partida deje de llegar en T43 y caiga entre T60 y
T100. **Resultado:** no se adopta nada, pero queda medido por qué y con una decisión para el usuario.
Ninguna tabla cambia.

### Lo que se midió

Cuatro ensayos sobre el grupo de «lo que cuesta ganarse un concejo», con la base `T-047-marcador`
(116, 112 y 113 filas cumplen):

| Ensayo | Primer dominio | Recuento (1492 / 1085 / 1212) | Decisión |
|---|---|---|---|
| `influenciaParaPuebla` 60 y `minimaParaIncorporar` 85 | T54–T56 | 117 / – / – | Se queda corto |
| **70 y 90** | **T67, cumple 3 de 3** | **122 / 114 / 114** | Mejor de todos, pero rompe la vía del monje en solitario |
| 70 y 100 | T67, cumple | 121 / 117 / 114 | El mínimo quedaría justo en el tope de la influencia (100), sin margen para la regla de la ventaja |
| Solo `minimaParaIncorporar` 90 | T43–T48, incumple | 117 / 111 / 111 | **Descartado**: net peor y rompe `ganadores` en dos campañas |

### El choque, y es de diseño

El primer dominio de la partida lo marcan **los monjes, fundando pueblas**, no incorporando. Y el
umbral de la puebla (40 de influencia) está calibrado **justo en el techo de lo que una casa sola
alcanza**: subirlo a 50 ya deja al monje de Évora sin fundar ni una en 96 turnos. La razón es que
mantener presencia cuesta pan, la recua no puede quedarse quieta indefinidamente y la influencia se
desgasta un punto por turno sin presencia.

**En campaña, en cambio, el umbral alto no les molesta**: con 70 siguen fundando siete pueblas,
porque tienen comarcas propias vecinas que aportan influencia. Lo que falla es el escenario de
`vias.test.ts`, que juega la casa **sola en la península entera**.

> **Decisión para el usuario.** El ensayo de 70 y 90 es, con diferencia, el mejor (122 / 114 / 114,
> con `dominio` y `ganadores` cumpliendo). Adoptarlo exige decidir si el escenario en solitario —una
> casa sin rivales y sin comarcas propias vecinas— es la vara correcta para calibrar un umbral que
> en partida real se cumple de sobra. No se ha tocado por cuenta propia: es una garantía de T-050.

### Lo que sí queda aprendido

- La influencia está **topada en 100**, así que un mínimo para incorporar cerca de ese tope deja sin
  efecto la regla de «sacarle 15 puntos al segundo». 90 es el techo práctico.
- Subir solo la incorporación no sirve: los monjes crecen por puebla.
- Una casa sola no pasa de unos 45 de influencia en una comarca ajena. Es un dato a tener presente
  para cualquier umbral que se toque: presencia, puebla, incorporación o regalo.

## 24-09-2026 · T-054: el precio mira la distancia a donde se produce

**Encargo:** la primera de las dos decisiones que quedaban pendientes del usuario, tomada al volver
a invocar la skill sin responderlas. **Resultado:** hecha, y el gradiente aparece.

### La regla

El nivel que manda en el precio ya no es el potencial de la propia comarca, sino el mejor del mapa
descontando **un escalón por cada tres jornadas** que haya que andar hasta él:

```
nivel que alcanza = máx sobre las comarcas c de:  potencial(c) − ⌊jornadas hasta c / 3⌋
```

Las jornadas se miden en verano y sin mejoras, igual que la administración, para que el precio base
no oscile con la estación ni con un puente nuevo. Solo las **plazas** necesitan precio —diez o
veinte por partida—, así que se mide desde cada una y no desde las doscientas comarcas del mapa,
con una memoria por turno en el `Contexto` que es solo velocidad.

### El gradiente, medido

Al turno 100 de una partida de 200:

| Recurso | Antes | Ahora |
|---|---|---|
| sal | 120 % en **21 de 23** plazas: un muro plano | **70, 80, 90, 100 y 120 %** |
| hierro | 120 % en 22 de 23 | 80, 100, 110 y 120 % |
| pan | 52,4 puntos de dispersión | 26,5, y mucho más repartida |

| Campaña | Base `T-047-marcador` | Con la distancia |
|---|---:|---:|
| 1492 | 116 | 116 |
| 1085 | 112 | **118** |
| 1212 | 113 | 112 |

Lo que más se mueve es el **prestigio**, que es el criterio que mide si todas las casas compiten: de
4 a 7 filas dentro de la horquilla en `1492`, con los mercaderes al 87 % de la mediana (antes 63 %),
los arrieros al 102 % (antes 90 %) y los ferrones al 64 % (antes 45 %).

### Lo que sigue sin cumplirse

`negociosRentables` sigue en 0, **y ya no es por el precio**. Lo que queda está medido en
[T-053 §8](T-053-plazas-donde-comerciar.md): la bolsa de comercio del robot son **dos maravedís**
—la casa tiene unos 62 y el arbitraje guarda 60 de colchón— y las plazas que alcanza siguen siendo
pocas y cercanas entre sí, así que el escalón que *ve* es pequeño aunque el del mapa sea grande.

Las huellas de reproducción **no cambian**: esas partidas no abren plaza.

## 24-09-2026 · La aritmética del comercio, hasta el fondo

**Encargo:** «haz lo que creas más adecuado para el juego, aunque sea más complejo». Elegí que el
comercio exista de verdad, que es lo que llevaban cuatro iteraciones señalando las mediciones.
**Resultado:** una corrección adoptada, cuatro caminos medidos y descartados, y la causa última
localizada con números. Ninguna tabla cambia.

### Lo adoptado: el arbitraje veía cero parejas por un filtro absurdo

El robot ordenaba las parejas de plazas con los precios **acolchados** —puja un 20 % por encima del
precio sabido y rebaja un 10 % por debajo—, de modo que necesitaba una diferencia bruta **del 33 %**
antes de considerar siquiera una pareja. Con la sal a 9800 en una plaza suya y a 12600 en otra (un
28 %), no veía **ni una en toda la partida**.

Ahora ordena por la diferencia que sabe y el acolchado se queda donde corresponde: en los **límites
de la orden**, que tienen que ser holgados o la compra se cae por precio en cuanto la plaza se mueve
(medido: con un 5 % se rompe la prueba de vía del arriero). De 0 parejas a **106**, y el recuento sin
moverse: 116 / 118 / 112, igual que la base.

### La causa última, con el volcado delante

Con el precio ya con geografía (T-054), las plazas del camino (T-053), la bolsa resuelta y el filtro
corregido:

```
T160 parejas=106 bolsa=200 porte=10
  pallars-jussa->segria       margen=5000 hueco=0 bast=41
  pallars-jussa->bajo-aragon  margen=5000 VIAJE=no-cabe
```

**106 parejas, doscientos maravedís y `hueco = 0`.** No falta ocasión, ni dinero, ni plazas, ni
precio: **falta sitio en la recua**. Con dos panes por jornada y porte 10, una ida y vuelta de tres
jornadas pide 12 cargas de pan de un porte de 10. Es aritmética, no equilibrio.

### Los cuatro caminos medidos

| Camino | Resultado | Decisión |
|---|---|---|
| `portePorAcemila` 1 → 2 | Cero negocios, y la **escasez cae de 11 a 4 filas**: las recuas acarrean pan a casa | Descartado |
| Porte 2 + bastimento 1 + escalón de abundancia 2 | **El primer negocio rentable de toda la investigación**: 2 negocios, 12 cargas arbitradas, margen neto **+51**. Pero la escasez se hunde a 3 y el recuento cae a 109 | Descartado, con pena |
| Escalón 2 + abundancia más ancha, sin tocar las recuas | 118 / 114 / 114 —el mejor recuento visto— pero **cero negocios** y el prestigio peor (12 filas frente a 14) | Descartado: es lateral |
| Fondo de comercio para mercaderes y arrieros | Funciona: el mercader pasa de 95 a **343 maravedís** en vez de quedarse clavado 200 turnos. Pero el recuento cae a 338: **ahorrar para un comercio que aún no existe es peor que construir** | Descartado **por ahora**; vuelve cuando el comercio funcione |

### La salida que propongo, y ya está en el diseño

Agrandar las recuas o abaratar el bastimento arreglan el comercio y **rompen la escasez**, porque
una recua con hueco acaba acarreando pan a casa. La salida que no tiene ese efecto la tiene escrito
el propio diseño desde T-035 y nunca se implementó: [docs/03 §3.3](../03-economia.md) dice de la
venta que **«recuas propias y ajenas reponen»**.

Una venta cada pocas jornadas convierte un viaje largo en varios tramos cortos: la recua no tiene
que cargar la comida de todo el camino, solo la del tramo. No toca el porte ni el bastimento, así
que la escasez no se entera; y convierte la venta —la plaza del camino que T-053 acaba de traer— en
la pieza que hace posible una ruta de comercio. Es lo que era una venta.

Queda en [T-055](T-055-la-venta-da-de-comer.md), con el diseño por detallar y los cuatro caminos de
arriba anotados para que nadie los repita.

## 24-09-2026 · La venta da de comer (T-055), y el muro siguiente

**Hipótesis:** si una recua come en las ventas del camino en vez de cargar su pan, los viajes que
«no cabían» caben y aparece el comercio. **Cambio:** la regla de [T-055 §4](T-055-la-venta-da-de-comer.md)
—fuera de casa, la recua que pisa una venta paga allí su bastimento del turno con los maravedís que
lleva, a los precios de esa plaza— y la previsión de los robots que la cuenta (robots 5). Ninguna
tabla de equilibrio cambia; entra una nueva, `movimiento.ventaCobraMil: 1000`.

**Resultado:**

| Campaña | Base `T-055` | Con la venta (`T-055b`) | Escasez (filas que cumplen) |
|---|---:|---:|---|
| 1492 | 116 | 116 | 9 → 9 |
| 1085 | 118 | 118 | 11 → 11 |
| 1212 | 112 | **114** | 8 → 8 |

El sitio deja de ser el muro: en el volcado del turno 160 del mercader, **todas** las parejas que
daban `no-cabe` caben ahora con hueco 6. La escasez no se entera, que era lo que hundían los caminos
descartados. Pero **cero negocios**.

**Cota medida y revertida:** `ventaCobraMil: 0`, la venta no cobra. **Cero negocios igualmente**; el
motivo dominante del mercader pasa a «ningún viaje deja ganancia después del bastimento» (134
turnos). El volcado:

```
T160 segria  maravedis 107  bolsa 47
urgell-i-segarra -> monegros  sal  pa=9800 pb=12600  hueco=8  n=3  bruto=22  bast=8  neto=-10
```

La mejor diferencia de la partida es un 28 % en la sal, y el robot cuenta la ganancia comprando al
límite de la orden (+20 %) y vendiendo al suyo (−10 %): un 30 % de colchón que se la come entera.
Encima la bolsa son 47 maravedís, tres cargas. **No es la venta ni su tarifa**: es cómo valora el
robot un negocio, y eso es lógica del banco. Sale a [T-056](T-056-el-negocio-en-limpio.md).

**Decisión:** adoptada la venta con `ventaCobraMil: 1000` (cambia porte por dinero, sin pan que
salga de la nada). No se prueban tarifas intermedias: la cota ya demuestra que la tarifa no es el
cuello de botella.

## 24-09-2026 · T-056: el robot cuenta bien, y aun así no hay negocio

**Cambio adoptado** (robots 6): el arbitraje cuenta la ganancia con lo que la plaza cobraría y
pagaría de verdad por su orden —`casarPlaza` con la línea del robot sola y el precio sabido como
equilibrio—, no comprando al límite de la puja (+20 %) y vendiendo al de la rebaja (−10 %). Se
adopta aunque no mueva el recuento: contar con el peor precio posible era un 30 % de lastre
indefendible, y queda una prueba (`arbitraje.test.ts`) que lo impide.

**Resultado:** 116 / 118 / 114, **las mismas cifras** que `T-055b` en las tres campañas.

**Por qué, con la traza de la rutina** (semilla 1492, turnos 80 a 140):

1. La bolsa del mercader y del arriero en los turnos en que deciden es de **1 a 9 maravedís**: viven
   en el colchón de 60 y no compran ni una carga.
2. Ni con 150 maravedís hay un viaje con ganancia: el mejor pierde 18. La sal de Bureba a
   Odra-Pisuerga, con su 28 %, pierde 53: nueve cargas ganan 25 en bruto y el viaje come 43 de pan
   del almacén y 40 en las ventas.

**La aritmética de las tablas:**

| Por carga y jornada | Maravedís |
|---|---:|
| Lo que gana la sal (un escalón del 10 % cada 3 jornadas sobre 14) | 0,47 |
| Lo que gana el hierro (sobre 24) | 0,80 |
| Lo que come la recua (2 panes a ~2,4, entre 8 cargas útiles) | 0,60 |
| … contando la vuelta en vacío | 1,20 |

Llevar sal o hierro **pierde dinero por construcción**, antes de comisiones y deslizamiento.

**Ensayo descartado:** `jornadasPorEscalonDeAbundancia` 3 → 1 (`E-escalon1-1492`). Cero negocios,
115 filas, escasez 10 (antes 9): con más margen, sigue sin haber bolsa. **Dos muros a la vez**, el
margen y el dinero; arreglar uno solo no enseña nada, y arreglar los dos es decidir cuánto debe
valer el comercio en el juego. **Decisión pendiente del usuario.**

## 24-09-2026 · La distancia paga el camino (T-057), y el comercio existe

**Decisión del usuario:** que la distancia pague el camino, con un fondo de comercio.

**Lo que descubrió la medición antes de elegir cifra.** Con los seis niveles de abundancia no hay a
la vez un gradiente empinado y largo: con un escalón por jornada (`E-fondo-escalon1`, ya con el
fondo lleno a 200 maravedís en dos recuas) el precio se **satura en el 120 % a cinco jornadas**, las
plazas del mercader vuelven a cotizar casi igual y no sale un negocio. El techo del 120 % limita la
diferencia de la sal a unos 7 maravedís por carga en cualquier distancia.

**Cambio adoptado** (T-057): el factor de una plaza es el de la fuente más barata puesta allí,
`abundancia(fuente) + 20 % × jornadas`, hasta el 200 %. Probado primero con una versión provisional
(`E-recargo120`, `E-recargo200`) y después con el código definitivo en las tres campañas:

| Recargo | Filas (1492 / 1085 / 1212) | Total | Negocios | Margen neto |
|---:|---|---:|---:|---:|
| Base `T-056` | 116 / 118 / 114 | 348 | 0 | 0 |
| 150 (`E-recargo150`) | 117 / 112 / 111 | 340 | 29 | +647 |
| **200 (`T-057`)** | **120 / 110 / 111** | **341** | **181** | **+7209** |
| 250 (`E-recargo250`) | 117 / 109 / 111 | 337 | 260 | +10 221 |

**Primer comercio de verdad de toda la investigación**: arrieros en las tres campañas (hasta 48
negocios y +1957 en una partida) y mercaderes en las tres. La escasez mejora (12 / 11 / 9 frente a
9 / 11 / 8).

**Lo que cuesta:** el recuento baja de 348 a 341 **con cualquier recargo**. No es el comercio: es
que lejos de la fuente la sal y el hierro valen el doble (mediana de 1085 al turno 100: sal de
12 600 a 27 110, hierro de 26 400 a 48 000, pan +12 %, madera +18 %). Se pierden `ganadores` y `obra
mayor` en 1085 (los monjes ganan las tres), cinco horquillas de prestigio y dos filas de ausencia de
los salineros. **Adoptado igualmente**: el comercio era imposible por construcción, y queda una
prueba sobre las tablas que impide que vuelva a serlo. Recuperar el recuento es lo siguiente.

**Fondo de comercio** (T-056, robots 8): dos reglas descartadas antes de la buena —guardar siempre
mata de hambre a los arrieros de Lugo; devolverla con el almacén bajo el colchón deja 1492 sin un
negocio—. La adoptada: la bolsa viaja cargada y solo vuelve a casa si hay escasez.

**Aparte:** el capítulo de comercio del prestigio sigue a 0 en todas las casas, porque solo cuenta
**ferias destacadas**, no negocios. Es el criterio 3 de T-053.

## 24-09-2026 · T-047 se reanuda: de dónde salen las 7 filas que costó T-057

Base `T-057-*` (120 / 110 / 111, total 341; antes de T-057, 348). La pérdida está en el prestigio
(7 horquillas más fuera), la ausencia de los salineros (+3), `ganadores` y `obra mayor` en 1085. La
escasez mejora (−4 filas en incumplimiento).

**Ensayo descartado: `techoDeLejaniaMil` 2000 → 1500** (`E-techo1500`). Hipótesis: lo que cuesta
filas es lo caro que se pone lo lejano, no el comercio. Resultado: 118 / 111 / 112, **341 igual**, y
el comercio cae a menos de la mitad (127 negocios y +2720, frente a 181 y +7209). Refutada.

**Lo que dicen los cuatro ensayos juntos.** Recargo 150, 200 y 250 y techo 1500 se quedan todos en
337–341: la pérdida no depende de las cifras, sino de **la forma de la regla**.

**Diagnóstico (provisional, revertido): el pan.** Con los escalones de T-054, una comarca de labor 5
a menos de tres jornadas dejaba el pan al 70 % en toda su zona; con T-057 cada plaza paga el camino
desde ella. Aplicando T-057 a todo **salvo al pan** (`E-panT054`, solo 1085): **114** filas, frente
a 110 con T-057 y 118 antes. **El pan explica la mitad** de lo perdido en esa campaña.

**Siguiente paso:** decidir cómo viaja el pan. No es un recurso como la sal: es perecedero, se da en
casi todas partes y es la columna de la escasez. Lo natural es un recargo **por recurso**
(`recargoPorJornadaMil` como tabla por recurso, el pan más bajo), que se explica en una frase —«el
pan se hace en todas partes y no compensa acarrearlo lejos»— y se mide con las tres campañas.
Después, lo que quede (la otra mitad en 1085) con su propio diagnóstico.

## 24-09-2026 · Recargo por recurso: el pan más barato de camino no recupera el recuento

**Cambio de estructura (adoptado, neutro).** `recargoPorJornadaMil` pasa de un número a una tabla por
recurso (`Partial<Record<Recurso, number>>`), y `factorAlcanzadoMil` recibe el recurso en vez del
potencial; devuelve `undefined` para un recurso sin potencial y falla en castellano si a un recurso
con potencial le falta su recargo. Con los seis a 200 el resultado es **idéntico** a T-057 (341;
las huellas de reproducción no se mueven). Tests nuevos en `precios-locales.test.ts`.

**Ensayos descartados** (tres campañas, base `T-057`: 120 / 110 / 111 = 341):

| Ensayo | Pan | 1492 | 1085 | 1212 | Total |
|---|---|---|---|---|---|
| `E-pan100` | 100 | 118 | 110 | 111 | **339** |
| `E-pan50` | 50 | 118 | 111 | 111 | **340** |

Hipótesis: con el pan más barato de acarrear, 1085 se acerca a los 114 de `E-panT054`. Refutada: el
recargo del pan **no** reproduce lo que daba la regla de T-054, y en 1492 pierde dos filas. La
diferencia de T-054 no venía de «el pan cuesta poco de acarrear», sino de que **una comarca de labor
5 dejaba el pan al 70 % en toda su zona** (escalones de tres jornadas), sin recargo alguno.
Los valores vuelven a 200 en todos los recursos.

**Lo siguiente:** el pan no necesita un recargo distinto, necesita **una fuente que abarate una
zona**, y eso es otra forma de regla (el escalón de T-054 solo para el pan). Antes de tocar lógica,
medir qué filas de 1085 recupera exactamente `E-panT054` y si son las mismas que pierden los
monjes.

## 24-09-2026 · Dónde están de verdad las filas que costó T-057

**Lo que recupera `E-panT054` en 1085** (comparando fila a fila con `T-057`): cinco cambios de estado,
cuatro a mejor y uno a peor, **ninguno de prestigio**: escasez de tres casas, ausencia de los
salineros y la obra mayor. Es ruido de reparto, no una causa. «El pan explica la mitad» era una
lectura del total; **queda corregida**: no hay que dar al pan una regla propia.

**Lo que se perdió de T-056 a T-057, fila a fila.** El grueso es prestigio y tiene un patrón:
**los arrieros caen** (82→65, 80→75 en 1085; 93→66 en 1212-2) y salineros, canteros y monjes suben
(monjes de 107 a 205 en 1212-2). En 1212-2 los arrieros pasan de 368 a 207 de prestigio con **la
misma tierra** (1 comarca) y una población parecida; solo se pierde un hito (3 → 2).

**Ensayo descartado: el fondo de comercio** (`BOLSA_MAXIMA` 200 → 0, solo 1212). Hipótesis: la bolsa
ahorrada frena a los arrieros. Resultado: 111 filas, **igual que la base**, arrieros de 1212-2 en
65,9 igual que antes. Refutada; la causa está en el precio, no en el robot. Revertido.

**Siguiente:** el prestigio de los arrieros por capítulos, T-056 contra T-057, para ver qué capítulo
pierden (los informes solo guardan el total).

## 24-09-2026 · El pan no era, y la Mesta sí (T-058)

**Ensayos descartados: recargo por jornada por recurso, con el pan más bajo.** Pan a 100: 339; pan a
50: 340 (base `T-057`, 341). El diagnóstico anterior (`E-panT054`, 114 en 1085) fue una sola
campaña, y todas las variantes dan en esa semilla entre 109 y 112: era ruido. El código del recargo
por recurso se revirtió, porque con todos los valores iguales era complejidad sin motivo.

**El problema más grande del marcador, visto por capítulos.** Hortelanos y monjes (~780 de
prestigio) viven de población, territorio e hitos; los capítulos de oficio (ganadería, industria,
comercio, caminos) están casi a cero en todas las casas. La más descolgada, la Mesta (21 %), no
trashumaba: no conocía ningún invernadero y no podía formar la recua que lo buscara. **Eso no es una
cifra, es una regla**: sale T-058, la Mesta conoce su cañada desde el principio.

**Lo que midió T-058, con sus dos cifras de T-047:**

| Cambio | Recuento | Vía de la Mesta | Mesta (% mediana) |
|---|---:|---|---|
| Base `T-057` | 341 | 0 de 9 | 15–57 |
| Conoce su cañada (con el prestigio regalado todavía) | 349 | 2 de 9 | 61–273 |
| … sin el prestigio regalado | 348 | 2 de 9 | 15–31, 169–246 en 1212 |
| + `pasoCanyadaMil` 1000 → 2000 | 348 | 2 de 9 | igual |
| + `pasoCanyadaMil` → **2500** | 342 | **8 de 9** | 209–334 |
| + `pasoCanyadaMil` → 3000 | 343 | 8 de 9 | 169–337 |
| **2500 + `porAnyoTrashumante` 30 → 10** | **345** | **8 de 9** | **103–165** |

Adoptados: la regla de T-058, `pasoCanyadaMil: 2500` (el más bajo con el que trashuma Cameros; tres
quincenas hasta Alcudia, como en la historia) y `porAnyoTrashumante: 10` (a 30 por rebaño, con cinco
rebaños, la ganadería era tres cuartas partes del prestigio de la Mesta).

**El marcador después** (mediana de % sobre la mediana, nueve partidas): hortelanos 202, monjes
205, Mesta 124, canteros 117, salineros 79, arrieros 60, mercaderes 41, ferrones 34. Antes de T-057:
hortelanos 300, monjes 296, canteros 135, salineros 110, arrieros 93, mercaderes 58, ferrones 46,
Mesta 21. **Lo siguiente, por tamaño:** ferrones y mercaderes, los dos por debajo del 50 %.

## 24-09-2026 · Los ferrones, y un invierno que aprieta

**Los ferrones (34 % de la mediana), diagnosticados antes de tocar nada.** Dos retratos distintos:

- Donde producen (1492, Molina): 483 de hierro que **no se pierden, se los comen los aperos** (4
  niveles × 1 por turno). Su vía se juega en 7 de 9 partidas; su prestigio es bajo porque su forma de
  ganar —vender aperos a los demás— llega con **T-103**, y T-047 §5.2 dice que no se anticipan
  ingresos inexistentes.
- Donde se hunden (Bilbao, labor 1): 76 vecinos que caen a 10, dos lonjas paradas sin sal y un
  colchón que no deja comprar pan. Una trampa de pobreza desde el arranque.

**Dos arreglos del robot medidos y descartados** (cifras idénticas, revertidos): que el tratante
solo guarde para la feria si hay feriante (`E-feriante`) y que compre sal para las lonjas que tiene
aunque no estén en su plan (`E-salLonjas`). Ninguno era el cuello de botella.

**La escasez, mirada por dentro.** De las 41 filas que incumplen, **36 son por falta de hambre**:
seis turnos de despensa absorben el invierno al 60 %, y los hortelanos no pasan un turno de hambre
en nueve partidas. El criterio y la primera lectura cualitativa piden lo mismo: que el año apriete.

| `factorPanMil.invierno` | Filas (1492 / 1085 / 1212) | Total | Escasez: cumple / poca / mucha |
|---:|---|---:|---|
| 600 (`T-058`) | 113 / 116 / 116 | 345 | 31 / 36 / 5 |
| **500** (`E-invierno500`) | **118 / 116 / 119** | **353** | **35 / 27 / 10** |
| 450 (`E-invierno450`) | 117 / 114 / 121 | 352 | 36 / 27 / 9 |

**Adoptado 500**: el mejor recuento y ninguna semilla por debajo de `T-058`. Las nuevas filas de
«mucha» escasez son moderadas (15–23 %: arrieros, mercaderes y salineros de 1085); las extremas
(salineros al 39 %, ferrones de Bilbao al 34,5 %) ya estaban. Con esto **T-056 y T-057 se cierran**:
353 frente a los 348 de antes del comercio.

## 24-09-2026 · Por qué no crecen las casas pequeñas (dos ensayos descartados)

Base `E-invierno500` (353). Cinco de las ocho casas acaban la partida con **1 o 2 comarcas**;
hortelanos y monjes, con 7 a 17. El prestigio sigue a la tierra y a la gente.

**Ensayo descartado: el concejo a 70 y 90** (`E-concejo70-90`, repetido sobre la base de hoy): 353
igual. El ritmo pasa a cumplir en 8 de 9 partidas, pero la escasez pierde 7 filas. Un empate que no
justifica romper la garantía en solitario del monje (T-050); la decisión sigue pendiente.

**Lo que no era:** la influencia. A partir del turno 100, arrieros, canteros, ferrones, mercaderes y
la Mesta tienen **100** (el tope) en tres comarcas neutrales vecinas, frente a los 60 que pide
incorporar. Lo que les frena es su robot (`puedeCrecer`): solo gana tierra si puede alimentar a la
gente nueva con el pan que ya le sobra, y no cuenta que la comarca nueva también produce.

**Ensayo descartado: crecer donde la comarca nueva se sostiene sola** (`E-seSostiene`, robots 9):
mercaderes y arrieros pasan a 3 comarcas, pero el recuento baja a **346**, se pierden 6 filas de
actividad y 3 de decisiones útiles, y los ferrones caen al 12 %. Los mercaderes con tres comarcas
siguen al 45 % de la mediana: **la tierra no es lo que les falta**, y crecer sin economía que lo
sostenga atasca a los robots. Revertido.

**Conclusión provisional:** la parte baja del marcador (ferrones, mercaderes, arrieros) depende de
lo que T-047 §5.2 manda no anticipar —aperos vendidos, letras, portazgos (T-103)— y del capítulo
de comercio, que solo cuenta ferias destacadas (T-053). La parte alta (hortelanos y monjes, ~200 %)
es población, que el marcador paga a 1 por cada 5 vecinos.

**La Mesta no pisa una feria** (por eso el capítulo de comercio sigue a 0 en todas las casas, el
criterio 3 de T-053). Traza de una partida de 1492: sus 434 sacas de lana se venden **todas en el
mercado de su capital** (Llanos de Albacete), por el tratante. El tratante solo guarda la lana para
la feria si `feriaAlAlcance` encuentra una, y esa función solo mira ferias en comarcas **ya
exploradas**; la Mesta no conoce ninguna y su exploradora no está formada. Con 45 maravedís la saca,
una sola feria al año pasaría de los 500 de volumen propio y contaría como destacada.

## 24-09-2026 · La tierra se mide de verdad (métricas 5)

El criterio `tierra` era «no evaluable»: el paso de los rebaños se adivinaba de lo que se les
consumía de la ruta, y la cifra era una cota superior. Con la trashumancia larga de T-058 pesaba
más. Ahora el motor emite `rebanyo.entra` por comarca, como `recua.entra`, y el banco cuenta exacto
(`visitas.ts` queda en unas líneas; fuera la reconstrucción y `visitasCompletas`). Base nueva
`T-047-metricas5`: el mismo recuento, **353**, y la tierra ya firme: **entre el 38 % y el 62 % del
mapa jugado sin tocar** en 200 turnos, frente a un objetivo de menos del 5 %. Es de lo que más lejos
queda de cumplir.

## 24-09-2026 · Los arrieros por capítulos: la pérdida es de umbral, no de precio

Medias por casa, T-056 → T-057, capítulo a capítulo (`capitulo_*` de los CSV de campaña):

- **1212 arrieros:** 305 → 251. `obras` 80 → 40 (**una obra mayor menos**: vale 40) y `hitos` 52 → 38.
- **1085 arrieros:** 274 → 249, repartido en exploración (−5), población (−2) y el total; sin obra ni hito.
- **1492 arrieros:** 234 → 222 (hitos 48 → 38).
- **Monjes 1212:** 680 → 723 por población (+46), sin relación con el comercio.

Lectura: el prestigio de una casa que no crece por tierra depende de **pocos bultos de 30–40
puntos** (obra mayor, hito), y una obra terminada o no por un turno de diferencia mueve más que la
distancia en el precio. La pérdida de T-057 en las horquillas de prestigio es **ruido de umbral en
una casa de 250–300 puntos**, no un efecto sistemático del precio: en 1085 y 1492 la caída es de
5–10 % sin ningún bulto perdido. No hay nada que corregir en la regla; se documenta y se sigue.

**Decisión:** el recuento de T-057 se acepta como **nueva base (341)**, por lo ya adoptado el
mismo día (el comercio era imposible por construcción). No se cierran T-056/T-057 hasta que el
prestigio cuente comercio (T-053, criterio 3): el orden pasa a **T-053 → T-047 (monjes, ritmo)**.

## 24-09-2026 · T-053, criterio 3: nadie vende en feria, y la Mesta ni arranca

Base `T-057`, 1492: `ingresosDeFeria` vale **0 en las ocho casas** y `capitulo_comercio` también; el
umbral de feria destacada es de 500 maravedís de volumen propio en una feria y un año. El origen de
esto no está en el motor: la casa que vive de feriar, **la Mesta, esquila 2 de lana de media en 200
turnos**. Sus tres semillas se quedan en **1 comarca, 33–47 vecinos y unos 95–115 maravedís** desde
el turno 50 al 200, con el pan cayendo de 49 a 10–16. Los motivos: «no tiene la gente, el pan o los
maravedís para formar la recua que le falta» (194–198 turnos de 200) y «no conoce ningún invernadero
al que pueda llegar el ganado» (178–192).

En `formarRecuas` la recua de tratante exige 10 vecinos y mercado en la sede, y las demás 40
vecinos **y despensa holgada**; con el pan de la Mesta bajo el coste de la recua más dos turnos de
consumo, nunca se forma. Es un problema del robot y de la vía de la Mesta, no del precio: la cifra
de esquileo ya estaba así en `T-050`. **No se ha ensayado nada todavía.**

**Siguiente:** un volcado de la Mesta en los turnos 20, 50 y 100 (vecinos, pan, maravedís, coste de
la recua, mercado en la sede, recuas formadas y motivo por turno) para ver **qué condición** de
`formarRecuas` falla, antes de tocar una sola cifra.

## 24-09-2026 · El alcance de la exploración (T-059)

Con T-059 las ferias se saben de oídas y el explorador de una casa con mercancía de feria abre
camino hacia la más cercana: recuento **355** (base `T-059`), pero ninguna venta en feria. Los
motivos de una partida: la Mesta sin exploradora (se merma y no se rehace), ferrones y salineros
con «ninguna oída al alcance» más de cien turnos.

**Ensayo descartado: la exploradora lleva bolsa para comer en las ventas** (`E-exploraConBolsa`,
robots 10): cifras idénticas. Las ventas las plantan las casas comerciantes cerca de su tierra, y
en el camino de una exploradora no hay ninguna. Revertido.

**Lo que queda claro:** con diez cargas y dos panes por jornada, una recua tiene cinco jornadas de
autonomía, y el primer anillo alrededor de lo propio es todo lo que explora una casa que no crece.
Es la causa común de la `tierra` (38–64 % del mapa sin tocar) y de que nadie llegue a una feria. No
se arregla con una cifra sin romper otra cosa (el bastimento de las recuas ya se ensayó y hunde la
escasez): pide decidir cómo explora una casa pequeña.

## 24-09-2026 · Ensayo descartado: la exploradora come la mitad (T-059)

Hipótesis: con diez cargas y dos panes por jornada una exploradora no pasa del primer anillo, así que
una avanzada ligera («vive de lo que encuentra») que coma la mitad debería llegar el doble de lejos.
Implementado como `movimiento.bastimentoExploradoraMil: 500` aplicado por cometido en el motor y en
la previsión del robot (`E-exploradora500`, robots 10, solo 1492): **119 filas frente a 120, la
tierra sin tocar idéntica** (38 % y 42 % en dos semillas, a la décima) y ningún ingreso de feria.
Refutada: **el pan no es lo que frena la exploración.** Revertido entero.

**Lo que enseña el volcado** (100 turnos, 1492, motivos por casa): los mercaderes y los ferrones dan
`sin-tierra-que-ganar` **84 y 86 turnos de 100**, y `sin-oida-al-alcance` solo 2 y 3. Es decir, el
robot no está quedándose sin pan para explorar: **no encuentra un objetivo de tierra** en `objetivoDeTierra`
(la elección de a qué comarca ir a ganar presencia o incorporar). Mercaderes con 90 vecinos, pan y
maravedís, y una sola comarca durante toda la partida.

**Siguiente:** leer `objetivoDeTierra` y medir por qué devuelve `null` con comarcas exploradas
alrededor (qué filtro las descarta: valor, influencia, distancia, conocimiento), antes de tocar nada.
