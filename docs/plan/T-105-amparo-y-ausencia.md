# T-105 · Amparo del novato, ausencia y administración del concejo

**Fase:** 5 · Multijugador · **Depende de:** T-101 · **Estado:** pendiente (ficha **esbozada**)

> Esta ficha está esbozada a propósito. **Detallarla es la primera mitad de la tarea**: antes de
> escribir código, complétala al nivel de las fichas de las fases 0 a 2 (diseño detallado con
> firmas, fórmulas y casos límite) y anota en `ESTADO.md` que ya está detallada.

## 1. Contexto

Las reglas que hacen que una partida larga sea habitable: que entrar tarde no sea un suicidio y
que irse de vacaciones no arruine a nadie.

Lee antes: [docs/06-competicion.md](../06-competicion.md) §6.4.

## 2. Objetivo

Amparo temporal para quien entra, y degradación lenta, avisada y reversible para quien falta.

## 3. Alcance

**Entra:** amparo de 20 turnos, estados de ausencia, administración del concejo, reingreso.

**No entra:** sustitución por otro jugador (se estudiará después).

## 4. Puntos que hay que resolver al detallar

- Qué impide exactamente el amparo y cómo se ve desde fuera (tiene que ser público para que nadie pierda el tiempo).
- Escala de ausencia: 5 turnos sin órdenes, 15, 30. Qué pasa en cada escalón.
- Administración del concejo: produce, no expande, y sus comarcas se pueden cortejar.
- Reingreso: el jugador vuelve y recupera el mando sin penalización adicional.

## 5. Criterios de aceptación provisionales

1. Un jugador ausente 30 turnos conserva su dominio pero deja de expandirse.
2. Nadie puede aprovecharse de un jugador amparado.
3. El reingreso devuelve el control íntegro y lo anuncia la crónica.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-105: <resumen>`.
