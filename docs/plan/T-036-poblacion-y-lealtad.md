# T-036 · Fases 8–9: población, lealtad, fueros y administración

**Fase:** 2 · Motor · **Depende de:** T-032 · **Estado:** pendiente

## 1. Contexto

La población es el recurso que más tarda en crecer y el que más manda: sin vecinos no hay mano de
obra, ni cuadrillas, ni recuas. La lealtad es el freno del que se expande sin cuidar lo suyo.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.6 y §3.9.

## 2. Objetivo

Implementar crecimiento, migración, lealtad con todas sus fuentes, fueros, carga fiscal, coste de
administración y traslado de la corte.

## 3. Alcance

**Entra:** todo lo anterior y la orden `politica` (fuero, carga fiscal, dehesa, uso de sal).

**No entra:** influencia sobre comarcas neutrales (T-038), prestigio (T-043).

## 4. Diseño detallado

### 4.1 Crecimiento

Condiciones (todas):

1. no hubo escasez este turno;
2. `poblacion < capacidad`;
3. `almacen.pan − reservado.pan >= reservaMinima` (30 por defecto, configurable en la partida);
4. el balance de pan previsto con la población nueva sigue siendo ≥ 0.

Entonces:

```
crecimiento = min(2 + floor(lealtad / 25), porcentaje(poblacion, 50))    // 5 % máximo
```

Si no crece, se registra el **motivo** (uno solo, el primero que falla) para que la interfaz lo
enseñe junto a la comarca. Nada de «no crece» sin explicación.

### 4.2 Capacidad

```
capacidad = 60 + 30 × nivelCasas + 20 si hay muralla + modificadores de casa
```

### 4.3 Lealtad

Se aplica la tabla de [docs/03-economia.md](../03-economia.md) §3.6, sumando todas las fuentes del
turno y limitando a 0..100. Umbrales:

| Lealtad | Efecto |
|---|---|
| < 60 | Sin efecto negativo (solo menos crecimiento) |
| < 40 | Producción −25 % |
| < 20 | No se pueden formar recuas ni dar órdenes de leva; cuenta atrás de 6 turnos |
| 0 tras 6 turnos < 20 | La comarca vuelve a neutral conservando la influencia de quien la cuidó |

La cuenta atrás se avisa en la crónica desde el primer turno, con el número de turnos restantes.

### 4.4 Fueros

Orden `politica` con tres opciones (`ninguno`, `carta puebla`, `fuero`), aplicables una vez cada 10
turnos por comarca. Efectos de la tabla §3.9. Conceder fuero es irreversible durante 20 turnos:
quitarlo cuesta 20 de lealtad.

### 4.5 Administración

```
coste = Σ comarcas propias: (4 + 2 × jornadasALaCapital) × modificadorFuero
```

`jornadasALaCapital` se calcula con la ruta más corta **conocida** en verano (para que el coste no
oscile con la estación), y se recalcula cuando cambian los caminos o la capital.

Deuda: si no hay maravedís, se acumula deuda y la lealtad baja 2 por turno empezando por las comarcas
más lejanas, hasta saldarla.

### 4.6 Traslado de la corte

Orden especial: 10 turnos, coste 200 mrs y 50 piedra. Durante el traslado, el coste de administración
sube un 25 %. Al terminar, la capital cambia y todas las distancias se recalculan. Es la respuesta al
dominio alargado y una decisión estratégica de las gordas.

## 5. Archivos

```
paquetes/nucleo/src/fases/08-territorio.ts        (lealtad, fueros, comarcas que se van)
paquetes/nucleo/src/fases/09-poblacion.ts
paquetes/nucleo/src/reglas/{poblacion,lealtad,administracion,capital}.ts
paquetes/nucleo/src/reglas/*.test.ts
```

## 6. Criterios de aceptación

1. El crecimiento respeta las cuatro condiciones y el tope del 5 %; cada motivo de no crecimiento
   tiene su test.
2. La lealtad nunca sale de 0..100 y aplica los cuatro umbrales.
3. Una comarca con lealtad < 20 durante 6 turnos vuelve a neutral, con los avisos previos.
4. El coste de administración crece con la distancia y baja con los fueros, según la tabla.
5. La deuda de administración baja la lealtad empezando por las comarcas más lejanas (orden
   determinista y probado).
6. El traslado de corte recalcula todas las distancias y el coste sube durante la obra.
7. Simulación de 100 turnos: un dominio de 8 comarcas sin fueros ni caminos entra en deuda; el mismo
   con fueros y caminos, no. (Test de escenario, con cifras registradas.)
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/poblacion.test.ts paquetes/nucleo/src/reglas/lealtad.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-037). Commit: `T-036: poblacion, lealtad, fueros y administracion`.
