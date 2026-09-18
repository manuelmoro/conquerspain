# T-101 · Influencia disputada y comarcas que vuelven a neutral

**Fase:** 5 · Multijugador · **Depende de:** T-100 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

La competición por la tierra, ya con rivales de verdad. El motor ya sabe calcular influencia
(T-038); ahora hay que probarla en disputa y darle su lectura en la interfaz.

Lee antes: [docs/06-competicion.md](../06-competicion.md) §6.2.

## 2. Objetivo

Que dos jugadores puedan cortejar la misma comarca durante turnos, con información parcial,
y que el desenlace sea justo y legible.

## 3. Alcance

**Entra:** disputa real, información parcial de la influencia ajena, avisos de cortejo, comarcas que se van por deslealtad y quién las recoge.

**No entra:** conflicto armado (fase 6).

**Heredado de T-038.** Ya están hechos el cálculo de influencia, la orden `incorporar` y la disputa
por tres criterios (`reglas/incorporar.ts`, `fases/08-influencia.ts`). Con el requisito de 15 puntos
de ventaja dos jugadores no pueden *empezar* a la vez sobre una comarca, así que la disputa solo se
da si las órdenes terminan el mismo turno tras empezar en turnos distintos; esta tarea decide si eso
basta o si hay que permitir ofertas simultáneas. La racha de presencia
(`EstadoComarca.presenciaSeguida`) y el regalo (`ultimoRegalo`) ya viven en el estado.

## 4. Puntos que hay que resolver al detallar

- Cuánta influencia ajena se ve y con qué precisión (propuesta de T-044: tramos de 10, solo con presencia).
- Avisos: cuándo se entera un jugador de que le están cortejando una comarca vecina.
- Equilibrio del ritmo: cuántos turnos cuesta ganar una comarca disputada frente a una libre.
- Qué pasa si el segundo abandona: ¿se acelera la incorporación del primero?

## 5. Criterios de aceptación provisionales

1. Una comarca disputada tarda al menos el doble en incorporarse que una libre.
2. El perdedor de una disputa recupera su coste íntegro y conserva influencia.
3. Ningún jugador ve la influencia exacta de otro sin presencia.
4. Una comarca abandonada por deslealtad puede ser recogida por un vecino atento.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-101: <resumen>`.
