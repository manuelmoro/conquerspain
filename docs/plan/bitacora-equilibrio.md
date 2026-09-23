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
de una partida suben de **10 a 20**.

### Cuatro sospechas descartadas, cada una con su medida

| Sospecha | Ensayo | Resultado |
|---|---|---|
| Faltan mercados | Un mercado en cada comarca propia (robots) | Plazas de 10 a 17. **Cero negocios**: el mercader tiene **una sola comarca** toda la partida |
| Falta porte | `portePorAcemila` 1 → 2, con ventas y sin ellas | **Cero negocios** en los dos casos |
| Falta dinero | `COLCHON_DE_MARAVEDIS` 60 → 20 | **Cero negocios**. La casa tiene unos 65 maravedís, así que la bolsa de comercio era de **cinco** |
| Faltan ferias | Recuento del catálogo | 9 de 403 comarcas, abiertas 1–2 turnos al año |

### El eslabón que queda, localizado con un volcado

**Un jugador no se entera de lo que él mismo ha construido fuera de su dominio.** El robot planta su
venta en Arlanza y en el turno 100 su rutina de arbitraje sigue diciendo `conocidas=2`: las dos
plazas de su propia capital. La causa está en `fases/12-cronica.ts`: el conocimiento de una comarca
ajena es una **foto** que solo se refresca donde el jugador tiene una recua.

Falta, por ese orden: guardar de quién es la venta (`EstadoComarca.ventaDe`, que además deja
preparado el portazgo del arriero que docs/03 ya promete), que la venta informe a su dueño cada
turno como hace la recua presente, y volver a medir. El detalle está en
[T-053 §8](T-053-plazas-donde-comerciar.md).

### Reproducción

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-053 --revision <sha>+T-053
```
