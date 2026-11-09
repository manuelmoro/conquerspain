# T-089 · Gobierno: fuero y carga, obra mayor, tradiciones, mayordomo y corte

**Fase:** 4 · Cliente · **Depende de:** T-082 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Abierta el 09-11-2026 desde T-088 §2.9. Al escribir la tabla de acciones sugeridas del cliente
(`QUE_HACER` en `paquetes/cliente/src/nombres.ts`), cinco tipos de orden del motor no tenían
ninguna tarea del plan que les diera pantalla: `politica` (fuero y carga fiscal), `obra-mayor`,
`tradicion`, `mayordomo` y `trasladar-corte`. Sin ellas, el jugador humano no puede tomar
decisiones que el motor y los robots ya toman: elegir una tradición cuando se abre una ronda,
dejar reglas al mayordomo para jugar sin estar, conceder un fuero o levantar un monasterio.

## 2. Objetivo

Que cada una de esas cinco órdenes se pueda dar desde el cliente con su coste, su efecto previsto
y sus bloqueos explicados, como las acciones de la ficha (T-082).

## 3. Alcance

**Entra:** fuero y carga fiscal en la ficha de una comarca propia; obras mayores con su avance;
elección de tradición cuando hay ronda abierta (con aviso en la crónica); editor de reglas del
mayordomo (condición y acción cerradas, 3 a 6 activas, docs/02 §2.5.3); traslado de la corte.

**No entra:** lo que necesite a otro jugador (fase 5).

## 4. Puntos que hay que resolver al detallar

- Dónde vive cada cosa: ficha de comarca (fuero, carga, obra mayor, corte) o pantalla de casa
  (tradiciones, mayordomo).
- El editor del mayordomo explicado para quien no programe: una frase por regla.
- Cuando se haga, `QUE_HACER` pasa de «llegará con la pantalla de gobierno» a su sitio real.
