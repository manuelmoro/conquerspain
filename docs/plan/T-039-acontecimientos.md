# T-039 · Fase 10: acontecimientos anunciados

**Fase:** 2 · Motor · **Depende de:** T-030 · **Estado:** hecha

## 1. Contexto

El juego necesita que pasen cosas, pero no puede permitirse que el azar decida partidas. La solución
es el aviso: todo acontecimiento se anuncia antes de ocurrir, y prepararse es habilidad.

Lee antes: [docs/01-vision.md](../01-vision.md) §1.3 (principio 3),
[docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.4.5.

## 2. Objetivo

Un sistema de acontecimientos regionales, anunciados con dos turnos de antelación, acotados en
efecto y siempre con una respuesta posible por parte del jugador.

## 3. Alcance

**Entra:** catálogo de acontecimientos, sorteo determinista, anuncio, aplicación y caducidad.

**No entra:** el clima anual (ya en T-030), la guerra ni nada entre jugadores.

**Heredado de T-035.** Una crecida no cierra un vado con puente: `salvaCrecidas(estado.caminos,
claveDeTramo(a, b))` (`reglas/obras.ts`). La muralla protege del bandidaje:
`protegeDelBandidaje(comarca)`.

## 4. Diseño detallado

### 4.1 Dos niveles de aviso, y de dónde sale cada cosa

Hay dos avisos distintos, y los dos salen de una **función pura de la semilla y el año**
(`calendarioDeAcontecimientos`, como el clima de T-030):

- El **calendario del año** entero se publica el primer turno del año (y el primero de una partida
  que empieza a mitad de año): un suceso `acontecimiento.calendario` por acontecimiento, con región,
  comarca, turno de inicio y duración. Es el plan, para prepararse desde marzo.
- El **anuncio** ocurre **exactamente dos turnos antes** de que empiece: la fase 10 mete el
  acontecimiento en `EstadoPartida.acontecimientos` con `turnoAnuncio = turnoInicio − 2` y deja un
  suceso `acontecimiento.anuncia`. **Solo lo anunciado se aplica**: un acontecimiento que caería antes
  de poder anunciarse (partida que empieza en el turno 5 con uno previsto para el 6) no ocurre.

Todos empiezan a partir del turno 3 del año, para que el aviso caiga siempre dentro del mismo año, y
terminan antes de que acabe. Así ninguno cruza de año y no hace falta mirar el año anterior para
sortear el siguiente.

### 4.2 Forma

```ts
export interface Acontecimiento {
  id: IdAcontecimiento;          // ac-<año>-<n>, sin contador: sale del sorteo
  tipo: string;                  // clave del catálogo
  region: string;                // región del catálogo a la que afecta
  comarca: IdComarca | null;     // la comarca concreta (incendio, romería, feria) o null
  turnoAnuncio: number;
  turnoInicio: number;           // turnoAnuncio + 2
  turnosDuracion: number;
  efectos: readonly EfectoAcontecimiento[];   // copia del catálogo al anunciar
}

export interface EfectoAcontecimiento {
  que: 'pan' | 'labor' | 'lana' | 'precio' | 'volumen' | 'obra' | 'ingresos'   // multiplican (factorMil)
     | 'puertos' | 'vados' | 'lealtad' | 'monte';                             // suman o cambian (cantidad)
  recurso: Recurso | null;       // solo para 'precio' y 'lana'
  terreno: Terreno | null;       // filtra por terreno (la riada solo daña las vegas)
  factorMil: number;             // 1000 si no multiplica
  cantidad: number;              // turnos (puertos), puntos (lealtad, monte); 0 si no aplica
}
```

Los textos de ayuda («Vender excedente, crecer») viven en la tabla, no en el estado: los sucesos no
llevan texto redactado y la crónica los pone (T-044).

### 4.3 Catálogo (`src/datos/acontecimientos.ts`)

| Acontecimiento | Signo | Efecto | Empieza (turno del año) | Dura |
|---|---|---|---|---|
| `buenas-lluvias` | + | pan ×1250 | 5–18 | 6 |
| `sequia` | − | pan ×700 (no toca huertas ni pesca) | 9–16 | 6 |
| `nieves-tempranas` | − | puertos cerrados 2 turnos antes del invierno | 19–20 | 4 |
| `riada` | − | vados cerrados salvo con puente; labor ×800 en vegas | 6–9 | 3 |
| `peste-de-ganado` | − | lana ×750 | 3–9 | hasta el esquileo (turno 10) |
| `buen-ano-de-feria` | + | volumen ×1200 en la feria (una comarca de la región con feria) | la de la feria | los turnos de la feria |
| `carestia-de-sal` | − | precio base de la sal ×1500 | 13–19 | 5 |
| `romeria` | + | +10 de lealtad al empezar e ingresos ×1100 (una comarca) | 5–20 | 2 |
| `incendio` | − | +20 de agotamiento de monte (una comarca con monte ≥ 2) | 12–17 | 1 |
| `maestros` | + | obras mayores ×2000 | 3–19 | 4 |

Cada entrada lleva su `respuestas`, y ninguno es un castigo sin salida. Horquilla de efectos:
multiplicadores entre 700 y 2000, según la clase; puertos de 1 a 3 turnos; lealtad y monte hasta 30.

### 4.4 Sorteo (`calendarioDeAcontecimientos(semilla, anyo, mundo, reglas)`)

Con el azar de ámbito `'acontecimientos'`:

1. entre 2 y 4 acontecimientos por año;
2. **al menos uno positivo** (se sortea el primero entre los positivos);
3. **como mucho uno negativo por región y año**, y por tanto nunca dos negativos solapados;
4. un tipo no se repite en la misma región; cada uno solo donde es posible (la feria exige una feria
   en la región, el incendio una comarca con monte);
5. inicio dentro de su ventana; el resultado se ordena por inicio y tipo y se numera.

Las regiones son las del catálogo (se excluyen `00-` y `99-`, como en el clima). El resultado no
depende del orden de las claves de los objetos.

### 4.5 Aplicación: modificadores que consultan las demás fases

Un acontecimiento está **activo** en los turnos `turnoInicio ≤ turno < turnoInicio + turnosDuracion`.
`factorDeAcontecimientos(lista, turno, que, lugar, recurso)` multiplica los factores de los activos
que afectan a ese lugar (`region`, `comarca`, `terreno`); si el acontecimiento tiene comarca, solo a
esa. Nada muta potenciales ni edificios. Consumen ya:

| Efecto | Quién lo consulta |
|---|---|
| `pan` | producción (fase 2): un factor `acontecimiento` en la cadena, junto al clima |
| `labor` | producción: sobre la labor (granja, huerta) de las comarcas del terreno indicado |
| `ingresos` | producción: maravedís de la comarca |
| `obra` | obras (fase 6): avance de las obras mayores de la región |
| `precio` | mercado (fase 7): precio base efectivo de la plaza, hacia el que regresa el precio |
| `volumen` | mercado: tope de volumen de las ferias de la comarca |
| `puertos`, `vados` | estado estacional: movimiento, rutas y aviso de puertos |
| `lana` | **T-040** (esquileo): la fase que reparte la lana pedirá el factor |
| `lealtad`, `monte` | la propia fase 10, una vez, al empezar |

Al empezar (turno `turnoInicio`, en la fase 10) se aplican los efectos únicos: la lealtad de la
romería (solo si la comarca tiene dueño) y el agotamiento del incendio (la mitad si la comarca es
dehesa: esa es la prevención). Al acabar (`turnoInicio + duración − 1`) el acontecimiento sale del
estado con un suceso `acontecimiento.termina`.

### 4.6 Sucesos

`acontecimiento.calendario`, `acontecimiento.anuncia`, `acontecimiento.empieza`,
`acontecimiento.termina`, todos con `tipo`, `region`, `comarca`, `turnoInicio` y `turnosDuracion`.

## 5. Archivos

```
paquetes/nucleo/src/fases/10-acontecimientos.ts
paquetes/nucleo/src/reglas/acontecimientos.ts
paquetes/nucleo/src/datos/acontecimientos.ts
paquetes/nucleo/src/tipos/{estado,ids,reglas}.ts
paquetes/nucleo/src/validacion/{validarEstado,validarTablas}.ts
paquetes/nucleo/src/{cambios,contexto}.ts
paquetes/nucleo/src/reglas/{calendario,jornadas,ruta,produccion,obras}.ts   (consultan los modificadores)
paquetes/nucleo/src/fases/{01-calendario,02-produccion,06-obras,07-mercado}.ts
paquetes/nucleo/pruebas/acontecimientos.test.ts
```

## 6. Criterios de aceptación

1. Todo acontecimiento se anuncia exactamente dos turnos antes de empezar.
2. Las reglas de sorteo de §4.4 se cumplen en 500 años simulados (test de propiedad).
3. Los efectos se aplican solo en su región (o comarca) y solo durante su duración, en cada fase que
   los consulta.
4. Ningún efecto se sale de la horquilla del catálogo.
5. El primer turno del año deja el calendario completo de acontecimientos en los sucesos.
6. Reproducible por semilla y sin depender del orden de las claves.
7. Un acontecimiento que no llegó a anunciarse no se aplica.
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/pruebas/acontecimientos.test.ts
npm run partidas
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-040). Commit: `T-039: acontecimientos anunciados`.

## 9. Resultado (18-09-2026)

Tarea cerrada. 599 tests en verde (42 nuevos); las partidas de reproducción `humo-01` y `humo-02` no
cambian de huella (su mundo no tiene regiones del catálogo, así que no sortea nada).

- `fases/10-acontecimientos.ts`: publica el calendario el primer turno del año, anuncia cada
  acontecimiento dos turnos antes, aplica sus efectos únicos al empezar y lo retira al acabar.
- `reglas/calendarioDeAcontecimientos.ts` (el sorteo, función pura de la semilla y el año) y
  `reglas/acontecimientos.ts` (activos, alcance por región o comarca y `factorDeAcontecimientos`).
- `datos/acontecimientos.ts`: el catálogo de diez, sus ventanas, sus respuestas y la horquilla de
  cada clase de efecto, validado en `validarTablas` (horquilla, aviso, que no cruce de año, feria y
  esquileo).
- `Acontecimiento` gana `comarca`; `EfectoAcontecimiento` se rehace (`que`, `recurso`, `terreno`,
  `factorMil`, `cantidad`); cambios `acontecimiento-alta` (comprueba el aviso exacto) y `-baja`.
- Consumidores enchufados: producción (pan, labor por terreno e ingresos, con un factor
  `acontecimiento` en el desglose), obras mayores, mercado (precio base efectivo y volumen de las
  ferias, incluido el invariante del suelo y el techo) y calendario/movimiento (`EstadoEstacional`
  gana los tramos con nieve temprana y en crecida, y `jornadasDeTramoMil` los cierra).
- Pruebas en `pruebas/acontecimientos.test.ts`, entre ellas la propiedad de 500 años y cuatro
  mutaciones del código —anunciar tarde, ignorar la región, permitir dos negativos por región y
  desplazar el último turno activo— que hacen fallar los tests.

Decisiones tomadas al implementar (escritas en docs/03 §3.13 y en la ficha):

- **Dos avisos**: el calendario del año entero el primer turno y el anuncio exacto a dos turnos.
  La ficha pedía las dos cosas y no decía cómo casaban; se resuelve con un sorteo puro que empieza
  a partir del turno 3 y acaba dentro del año.
- **Solo lo anunciado ocurre.** Una partida que empieza a mitad de año pierde lo que caía antes de
  poder avisarse, en vez de sorprender.
- **El calendario no vive en el estado**: sale de la semilla, como el clima. El estado guarda solo
  lo anunciado y lo activo, con una copia del catálogo del momento.
- **La carestía mueve el precio base, no el precio**: el precio sube en unos turnos (15 % por turno)
  hacia el nuevo base, lo sobrepasa un poco y regresa; al acabar vuelve solo. El suelo y el techo se
  miden sobre el base efectivo.
- **«Mejores precios» del buen año de feria** se traduce en más volumen (más profundidad, el precio
  se mueve menos), no en un descuento aparte.
- **Sequía y huertas**: la sequía usa el mismo alcance que el clima (granjas y demás explotaciones
  estacionales), así que huertas y pesca son de verdad la respuesta.
- **La peste de ganado** ya está en el estado y en `factorDeAcontecimientos`, pero nadie la consulta
  hasta que T-040 tenga esquileo (anotado en su ficha).
- Las tablas y los tests usan `src/datos/` y `pruebas/`, no `datos/*.json` ni `src/reglas/*.test.ts`,
  como el resto de tareas.

