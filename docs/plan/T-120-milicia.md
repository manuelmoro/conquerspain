# T-120 · Milicia concejil y coste económico de la guerra

**Fase:** 6 · Conflicto · **Depende de:** T-106 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

El conflicto entra al final y con freno de mano: tiene que costar economía, avisarse y no
borrar el progreso de nadie.

Lee antes: [docs/06-competicion.md](../06-competicion.md) §6.6.

## 2. Objetivo

Leva de milicia con coste real en producción y pan, y sin ejércitos permanentes baratos.

## 3. Alcance

**Entra:** leva, mantenimiento, desgaste, licenciamiento, y el preaviso público de hostilidad.

**No entra:** asedios (T-121) ni bandidaje (T-122).

## 4. Puntos que hay que resolver al detallar

- Coste de la leva: vecinos que dejan de trabajar, pan que comen, lealtad que baja.
- Preaviso de un turno y su publicidad.
- Límites al acoso: coste creciente de mantener milicia lejos de casa.
- Qué NO puede hacer la milicia: arrasar, destruir edificios, matar población.

## 5. Criterios de aceptación provisionales

1. Mantener milicia un año arruina a quien no tenga economía para ello (test de escenario).
2. Declarar hostilidad siempre avisa con un turno.
3. Perder un enfrentamiento nunca hace perder más de un objetivo concreto.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-120: <resumen>`.
