# T-038 · Fase 8: influencia e incorporación de comarcas

**Fase:** 2 · Motor · **Depende de:** T-034 · **Estado:** pendiente

## 1. Contexto

Así se consigue tierra sin guerra, y así se compite por ella cuando hay rivales. Es la mecánica que
sustituye al «pulsar antes» por «llevar meses cortejando al concejo».

Lee antes: [docs/06-competicion.md](../06-competicion.md) §6.2.

## 2. Objetivo

Calcular la influencia de cada jugador en cada comarca neutral que conoce, y resolver las órdenes de
incorporación con reglas explícitas de empate.

## 3. Alcance

**Entra:** acumulación y pérdida de influencia, orden `incorporar` con sus requisitos, resolución de
disputas, y el regreso a neutral de comarcas desleales (enganchado con T-036).

**No entra:** fundación de puebla (T-034), amparo del novato (T-105).

**Heredado de T-036.** La vuelta a neutral de la comarca desleal ya está hecha en la fase 8
(`volverANeutral` en `fases/08-territorio.ts`): el antiguo dueño se queda con influencia igual a la
lealtad que le quedaba. La influencia se añade a esa misma fase, después de la lealtad.

**Heredado de T-034.** Una recua cuenta como presente si `estaPresente(recua, comarca)`
(`reglas/presencia.ts`): quieta en una comarca neutral con cometido `presencia` y que ha podido
pagar su bastimento este turno. Esa es la condición de los +2 de influencia por presencia.

## 4. Diseño detallado

### 4.1 Cálculo por turno

Para cada comarca neutral y cada jugador que la conoce, se suman las fuentes de
[docs/06-competicion.md](../06-competicion.md) §6.2 y se resta el desgaste:

```
influencia = limitar(influencia + aportes − desgaste, 0, 100)
desgaste = 1 si no hay presencia ni comercio este turno
         + 5 si el jugador provocó escasez en la comarca (le vació el mercado de pan)
```

Los aportes se calculan sobre la **foto de inicio de fase**, igual que los cometidos.

### 4.2 Orden `incorporar`

Requisitos, comprobados al dar la orden y de nuevo al empezar:

1. `influencia >= 60`;
2. ser el jugador con más influencia, con ≥ 15 puntos sobre el segundo;
3. tener comarca propia a ≤ 6 jornadas por camino conocido;
4. recursos disponibles (40 pan, 30 mrs por defecto) y sin escasez.

Duración: 3 turnos. Al terminar: la comarca pasa a propia con lealtad 60, conserva su población, y su
producción y consumo entran en el balance del jugador desde el turno siguiente.

### 4.3 Disputa

Si dos o más jugadores tienen orden de incorporación sobre la misma comarca resuelta el mismo turno:

1. gana el de **mayor influencia**;
2. si empatan, el que lleve **más turnos consecutivos** con presencia allí;
3. si siguen empatados, `hash32(partida, turno, comarca, jugador)` menor.

Los perdedores recuperan **el coste íntegro** y conservan su influencia. Se les avisa en la crónica
con el nombre del rival (cortejar a un concejo es algo público).

### 4.4 Previsión para la interfaz

```ts
export function previsionIncorporar(estado, comarca, jugador, mundo, reglas): {
  costeTotal: Recursos;
  balancePanAntesMil: Milesimas;
  balancePanDespuesMil: Milesimas;
  turnosDeReservaDespues: number;
  administracionExtra: number;
};
```

Esta función es la que permite que el jugador vea, antes de confirmar, que incorporar esa comarca le
deja el balance en negativo. Va en el núcleo para que cliente y servidor calculen lo mismo.

## 5. Archivos

```
paquetes/nucleo/src/fases/08-territorio.ts        (se amplía: influencia + incorporación)
paquetes/nucleo/src/reglas/{influencia,incorporar}.ts
paquetes/nucleo/src/reglas/*.test.ts
paquetes/nucleo/datos/influencia.json
```

## 6. Criterios de aceptación

1. La influencia nunca sale de 0..100 y su cálculo es idéntico al barajar el orden de jugadores.
2. Las siete fuentes de influencia se aplican con sus topes (test por fuente).
3. Los cuatro requisitos de incorporación se comprueban y devuelven motivo legible cuando fallan.
4. La disputa se resuelve por los tres criterios en ese orden, con test de cada empate.
5. Los perdedores recuperan el coste íntegro y conservan influencia.
6. `previsionIncorporar` coincide exactamente con lo que ocurre al incorporar (test: previsión vs.
   resultado real tras resolver).
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/influencia.test.ts paquetes/nucleo/src/reglas/incorporar.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-039). Commit: `T-038: influencia e incorporacion de comarcas`.
