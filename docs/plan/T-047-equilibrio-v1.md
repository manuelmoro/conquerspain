# T-047 · Ajuste de equilibrio v1

**Fase:** 2 · Motor · **Depende de:** T-046 · **Estado:** pendiente

## 1. Contexto

El motor está completo y medible. Ahora toca lo que decide si el juego mola: que las ocho vías sean
viables, que el año agrícola apriete sin ahogar, que los precios respiren y que ningún turno sea
aburrido. Esta tarea es **iterativa por naturaleza**: se ajusta, se mide, se repite.

Lee antes: [docs/04-casas-y-tradiciones.md](../04-casas-y-tradiciones.md) §4.4,
[docs/06-competicion.md](../06-competicion.md) §6.8, informe de T-046.

## 2. Objetivo

Dejar las tablas de datos en un estado que cumpla los criterios numéricos de salud del juego, con el
proceso documentado para poder repetirlo cada vez que se añada contenido.

## 3. Alcance

**Entra:** ajuste de `nucleo/datos/*.json` (edificios, casas, tradiciones, mercado, población,
movimiento, prestigio), y la documentación de cada cambio con su porqué.

**No entra:** tocar la lógica del motor. Si un ajuste **exige** cambiar lógica, se abre tarea aparte
(T-048, T-049…) y se anota en el índice.

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
   origen (T-065 §4).
4. **Tierra muerta**: 235 de 403 comarcas sin tocar en 200 turnos; el recorte de mapa es de T-065.
5. **Jugar sin estar** todavía cuesta más de un 5 % de prestigio en varias casas.

## 4. Procedimiento

Ciclo, repetido hasta cumplir los criterios:

1. Ejecutar el banco: 3 semillas × 200 turnos × 8 casas (`npm run banco`).
2. Leer el informe y quedarse con **el problema más grande**, no con todos a la vez.
3. Formular la hipótesis en una frase («el ferrón gana siempre porque los aperos rinden más de lo que
   cuestan a partir del turno 60»).
4. Cambiar **un solo grupo de valores**.
5. Volver a medir con las mismas semillas y comparar informes.
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

## 6. Archivos

```
paquetes/nucleo/datos/*.json            (ajustes)
docs/plan/bitacora-equilibrio.md        (nuevo, se mantiene para siempre)
herramientas/banco/informes/            (informes de referencia)
```

## 7. Verificación

```bash
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3
npm run banco -- --semilla 1085 --turnos 200 --repeticiones 3
npm run banco -- --semilla 1212 --turnos 200 --repeticiones 3
npm run banco:comparar -- informes/<antes>.csv informes/<despues>.csv
npm run verificar
```

Los tres informes deben cumplir la tabla de §5.

## 8. Al terminar

1. Índice: T-047 `hecha`. **Fase 2 completa**: el juego ya existe como motor, aunque no se vea.
2. `ESTADO.md`: fase actual → «Fase 3 · Servidor autoritativo»; siguiente T-060.
3. Actualiza `docs/03-economia.md` y `docs/04-casas-y-tradiciones.md` con las cifras finales.
4. Commit: `T-047: equilibrio v1 del motor`.

> Esta tarea se **reabre** cada vez que se añada contenido nuevo (casas, obras, recursos). El
> procedimiento y los criterios se quedan; se repite el ciclo.
