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
