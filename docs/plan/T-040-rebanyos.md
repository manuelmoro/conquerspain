# T-040 · Rebaños, pastos y trashumancia

**Fase:** 2 · Motor · **Depende de:** T-033, T-037 · **Estado:** pendiente

## 1. Contexto

La trashumancia es el guiño histórico mayor del juego y, a la vez, una estrategia completa: un plan
anual con dos viajes largos, un solo cobro y mucho que perder si sale mal.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.8,
[docs/05-geografia.md](../05-geografia.md) §5.4, [docs/04-casas-y-tradiciones.md](../04-casas-y-tradiciones.md) §4.1.1.

## 2. Objetivo

Implementar el rebaño como unidad móvil con su ciclo anual: pastos según estación, cañadas, esquileo
en mayo, calidad de la lana y aportes a la comarca donde inverna.

## 3. Alcance

**Entra:** unidad rebaño, movimiento por cañadas, pastos estacionales, calidad, esquileo, estiércol y
producción menor; privilegio de la Mesta enganchado (detalle en T-041).

**No entra:** venta de la lana (T-037, ya hecho), portazgos (T-103).

**Heredado de T-033.** La orden `ruta` con `rebanyo` no la atiende nadie todavía (la fase 4 solo
toma las de recua) y queda pendiente hasta esta tarea. Se reutilizan `rutaMasCorta`, `avanzar` y el
ciclo de vida de `src/ordenes.ts`.

**Heredado de T-037.** La lana del esquileo entra en el almacén, no en una recua: para venderla hay
que cargarla (`cargar` en una parada de comarca propia o la orden `carga`) y llevarla a una plaza.
Precio base de la lana: 50 mrs por saca (`src/datos/recursos.ts`).

**Heredado de T-039.** La peste de ganado dura hasta el turno del esquileo y trae un efecto `lana`
de ×750 en su región: el reparto de la lana tiene que multiplicar lo que da cada rebaño por
`factorDeAcontecimientos(estado.acontecimientos, turno, 'lana', { region, comarca }, 'lana')`
(`reglas/acontecimientos.ts`). Hoy nadie lo consulta porque todavía no hay esquileo.

## 4. Diseño detallado

### 4.1 Unidad

```ts
export interface Rebanyo {
  id: IdRebanyo;
  jugador: IdJugador;
  cabezas: number;                  // 1000 por rebaño estándar
  situacion: SituacionMovil;        // igual que la recua
  ruta: readonly IdComarca[];
  rutaCircular: boolean;
  turnosEnPastoCorrecto: number;    // en el año en curso
  turnosDelAnyo: number;
  lanaPendiente: number;            // se cobra en el esquileo
}
```

### 4.2 Pasto correcto

Una comarca es pasto correcto para un rebaño si:

- tiene `pasto >= 2`, **y**
- el rasgo corresponde a la estación: `pasto-de-verano` de mayo a septiembre (turnos 9–18),
  `pasto-de-invierno` de octubre a abril (turnos 19–24 y 1–8).

Estar en comarca ajena sin acuerdo cuesta portazgo (o está prohibido), salvo por cañada y salvo la
Mesta.

### 4.3 Movimiento

Igual que la recua, pero:

- `paso` base 2 jornadas por turno (el ganado va despacio);
- por cañada, +1 jornada y sin coste de permiso;
- no consume pan: consume pasto (si la comarca no tiene pasto suficiente para todos los rebaños
  presentes, se reparte y todos pierden calidad ese turno).

Capacidad de pasto: `pasto × 1000 cabezas` por comarca. El exceso se reparte proporcionalmente.

### 4.4 Ciclo anual y esquileo

```
calidadMil = 1000 × turnosEnPastoCorrecto / max(1, turnosDelAnyo)
```

En el turno 10 (segunda quincena de mayo), cada rebaño entrega:

```
lana = porcentaje(12 × (cabezas / 1000), calidadMil) × modificadores de casa
```

y reinicia sus contadores anuales. Un rebaño que ha pasado el año entero en pastos correctos entrega
12 sacas; uno que ha ido de mala manera, 6 o 7.

### 4.5 Otros aportes

- 2 pan por turno al almacén del dueño (queso, corderos).
- Si inverna en una comarca propia, +5 % de `labor` efectiva el año siguiente (estiércol), acumulable
  hasta +15 %.

### 4.6 Riesgos

- Un rebaño sin pasto correcto dos turnos seguidos pierde un 5 % de cabezas.
- El acontecimiento «peste de ganado» reduce el esquileo de la región.
- Un puerto cerrado puede dejar al rebaño **al otro lado**: es la razón por la que la bajada de otoño
  no se improvisa. La crónica avisa dos turnos antes del cierre.

## 5. Archivos

```
paquetes/nucleo/src/fases/04-movimiento.ts        (se amplía con rebaños)
paquetes/nucleo/src/reglas/{rebanyos,pastos,esquileo}.ts
paquetes/nucleo/src/reglas/*.test.ts
paquetes/nucleo/datos/ganaderia.json
```

## 6. Criterios de aceptación

1. Un rebaño que hace el ciclo completo (Urbión en verano, dehesa en invierno) entrega 12 sacas por
   cada 1 000 cabezas; uno que se queda quieto en la sierra todo el año entrega menos de 7 (test de
   escenario con cifras).
2. El reparto de pasto entre varios rebaños es proporcional y determinista.
3. Un rebaño atrapado por un puerto cerrado se detiene y se avisa dos turnos antes.
4. La pérdida de cabezas ocurre exactamente al segundo turno sin pasto correcto.
5. El estiércol se acumula hasta el tope y se aplica al año siguiente.
6. El esquileo ocurre solo en el turno 10 y reinicia los contadores.
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/rebanyos.test.ts paquetes/nucleo/src/reglas/esquileo.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-041). Commit: `T-040: rebanyos, pastos y trashumancia`.
