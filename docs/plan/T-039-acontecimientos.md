# T-039 · Fase 10: acontecimientos anunciados

**Fase:** 2 · Motor · **Depende de:** T-030 · **Estado:** pendiente

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

### 4.1 Forma

```ts
export interface Acontecimiento {
  id: string;
  tipo: TipoAcontecimiento;
  region: string;                 // afecta a una región del catálogo
  turnoAnuncio: number;
  turnoInicio: number;            // turnoAnuncio + 2
  turnosDuracion: number;
  efectos: readonly EfectoAcontecimiento[];
  respuestas: readonly string[];  // qué puede hacer el jugador (texto de ayuda, no mecánica)
}
```

### 4.2 Catálogo inicial

| Acontecimiento | Efecto | Duración | Respuesta del jugador |
|---|---|---|---|
| **Año de buenas lluvias** | +25 % de pan en la región | 6 turnos | Vender excedente, crecer |
| **Sequía** | −30 % de pan | 6 turnos | Comprar pan, usar huertas y pesca |
| **Nieves tempranas** | Puertos de la región cerrados 2 turnos antes | 4 turnos | Adelantar la bajada de rebaños |
| **Riada** | Vados intransitables; −20 % de labor en vegas | 3 turnos | Rodear; el puente lo evita |
| **Peste de ganado** | −25 % de lana en el esquileo de la región | Hasta el esquileo | Mover rebaños fuera |
| **Buen año de feria** | +20 % de volumen y mejores precios | Los turnos de la feria | Llevar mercancía |
| **Carestía de sal** | Precio de la sal +50 % en la región | 5 turnos | Vender sal; comprar antes |
| **Romería** | +10 % de lealtad y de ingresos en la comarca | 2 turnos | Nada: es un regalo pequeño |
| **Incendio en el monte** | +20 de agotamiento de monte en una comarca | Inmediato | Dehesa como prevención |
| **Llegada de maestros** | Una obra mayor de la región avanza el doble | 4 turnos | Empezar obra antes |

Todos tienen **contrapartida o respuesta**: ninguno es un castigo puro sin nada que hacer.

### 4.3 Sorteo

- Al empezar cada año, con azar de ámbito `'acontecimientos'`, se eligen entre 2 y 4 acontecimientos
  para ese año, con sus regiones y turnos.
- Reglas: como mucho uno negativo por región y año; nunca dos negativos solapados en la misma región;
  al menos uno positivo por año.
- El calendario del año se publica **entero** en la crónica del primer turno del año: el jugador sabe
  que en septiembre habrá sequía en el Duero y puede prepararse desde marzo.

### 4.4 Aplicación

Los efectos se aplican como modificadores consultables por las demás fases (`modificadoresDe(region,
recurso, turno)`), nunca mutando directamente potenciales ni edificios.

## 5. Archivos

```
paquetes/nucleo/src/fases/10-acontecimientos.ts
paquetes/nucleo/src/reglas/acontecimientos.ts
paquetes/nucleo/src/reglas/acontecimientos.test.ts
paquetes/nucleo/datos/acontecimientos.json
```

## 6. Criterios de aceptación

1. Todo acontecimiento se anuncia exactamente dos turnos antes de empezar.
2. Las tres reglas de sorteo de §4.3 se cumplen en 500 años simulados (test de propiedad).
3. Los efectos se aplican solo en su región y solo durante su duración.
4. Ningún efecto se sale de la horquilla del catálogo.
5. La crónica del primer turno del año contiene el calendario completo de acontecimientos.
6. Reproducible por semilla.
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/acontecimientos.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-040). Commit: `T-039: acontecimientos anunciados`.
