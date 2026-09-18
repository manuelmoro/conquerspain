# T-042 · Tradiciones y ramas de desarrollo

**Fase:** 2 · Motor · **Depende de:** T-041 · **Estado:** pendiente

## 1. Contexto

La segunda capa de asimetría: dos partidas con la misma casa no deben parecerse. Las tradiciones se
eligen al alcanzar hitos y no se pueden cambiar, así que son decisiones de las que se recuerdan.

Lee antes: [docs/04-casas-y-tradiciones.md](../04-casas-y-tradiciones.md) §4.3.

## 2. Objetivo

Implementar las tres rondas de elección (Renombre, Fama, Linaje), con tres tradiciones por casa y
ronda, usando el mismo sistema de modificadores de T-041.

## 3. Alcance

**Entra:** desbloqueo por hito, orden `tradicion`, efectos, y las 24 tradiciones de la primera ronda
más las de las otras dos rondas definidas en datos.

**No entra:** equilibrio fino (T-047), tradiciones que dependan del conflicto (se definen pero quedan
desactivadas).

**Heredado de T-041.** Una tradición es un `Modificadores` parcial (`DatosTradicion.modificadores`)
que se compone con el de su casa: hoy `modificadoresDe` (`reglas/casas/index.ts`) devuelve el de la
casa y hay que hacer que devuelva el compuesto con las tradiciones elegidas (`EstadoJugador.tradiciones`).
Los puntos de extensión son genéricos (producción por edificio, coste de obra mayor por tipo, gente
para fundar puebla…), y las prohibiciones y los permisos se comprueban en un solo sitio, así que una
tradición que quite una prohibición o dé un permiso no necesita tocar las fases.

## 4. Diseño detallado

### 4.1 Rondas

| Ronda | Condición de desbloqueo |
|---|---|
| Renombre | 3 comarcas propias **o** 150 vecinos |
| Fama | primera obra mayor terminada **o** 400 de prestigio |
| Linaje | turno 150 **o** 1 000 de prestigio |

Al desbloquearse, la crónica lo anuncia y la orden `tradicion` queda disponible con **tres opciones**
propias de la casa. Elegir es irreversible. Mientras no se elija, no se pierde nada: la elección
espera (no hay penalización por pensárselo, pero tampoco se acumulan).

### 4.2 Definición

```jsonc
{
  "id": "mesta-lanas-finas",
  "casa": "mesta",
  "ronda": "renombre",
  "nombre": "Lanas finas",
  "descripcion": "Merinas de vellón corto: menos cabezas, mejor lana.",
  "modificadores": { "lanaEsquileoMil": 1300, "costeRebanyoMil": 1200 },
  "desbloquea": ["orden:seleccion-de-vellon"],
  "nota": "La lana castellana se pagaba en Flandes por su finura, no por su cantidad."
}
```

Las tradiciones usan exactamente la misma estructura de modificadores que las casas, más la
posibilidad de desbloquear órdenes nuevas.

### 4.3 Catálogo

Las 24 tradiciones de la ronda Renombre (tres por casa) son las esbozadas en
[docs/04](../04-casas-y-tradiciones.md) §4.3. Para Fama y Linaje se define el mismo número, siguiendo
tres criterios:

1. **Profundizar** en lo que la casa ya hace (más de lo suyo, con un coste).
2. **Compensar** su límite (le abre una puerta que tenía cerrada, sin quitarle su identidad).
3. **Abrir** una vía inesperada (algo que cambia cómo juega esa casa el resto de la partida).

Ninguna tradición puede ser obviamente la mejor: si en las pruebas de T-047 una se elige más del
60 % de las veces, se ajusta.

### 4.4 Interfaz (lo que T-08x necesitará)

La elección se presenta como tres cartas con nombre, efecto en una frase, y una nota histórica. La
nota es contenido, no relleno: es lo que hace que el jugador recuerde qué es un vellón.

## 5. Archivos

```
paquetes/nucleo/src/reglas/tradiciones.ts
paquetes/nucleo/src/reglas/tradiciones.test.ts
paquetes/nucleo/datos/tradiciones.json
```

## 6. Criterios de aceptación

1. Las tres rondas se desbloquean exactamente con sus condiciones (test por condición).
2. Hay 3 tradiciones por casa y ronda (72 en total), todas con nota histórica.
3. Elegir es irreversible y la orden se rechaza si la ronda no está desbloqueada o ya se eligió.
4. Los modificadores de tradición se acumulan correctamente con los de casa (test de acumulación).
5. Ninguna tradición rompe un invariante del motor.
6. Las que dependen del conflicto están marcadas `desactivada: true` y no aparecen como opción.
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/tradiciones.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-043). Actualiza `docs/04` §4.3 con el catálogo definitivo.
Commit: `T-042: tradiciones y ramas de desarrollo`.
