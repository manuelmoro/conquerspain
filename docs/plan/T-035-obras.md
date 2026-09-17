# T-035 · Fase 6: obras, cuadrillas y obras mayores

**Fase:** 2 · Motor · **Depende de:** T-031 · **Estado:** pendiente

## 1. Contexto

Construir es la decisión más frecuente del juego y la que más se nota a largo plazo. Las obras
mayores, además, son el motor de la vía «cantero» y la fuente principal de prestigio.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.3 y §3.11.

## 2. Objetivo

Avanzar y terminar construcciones y obras mayores, gestionando cuadrillas, solares, requisitos,
frenazo invernal y abandono.

## 3. Alcance

**Entra:** órdenes `construir`, `derribar`, `obra mayor` y `roturar`; cuadrillas; solares; efectos al
terminar.

**No entra:** privilegios de casa sobre obras (T-041), prestigio (T-043).

## 4. Diseño detallado

### 4.1 Cuadrillas y solares

```
cuadrillas = 1 + floor(vecinos / 40)      // máximo 4; +1 con fuero; +1 con monasterio
solaresLibres = solares − Σ niveles de edificios
```

Una obra ocupa una cuadrilla desde que empieza hasta que termina. Una comarca sin cuadrilla libre no
puede empezar obra: la orden queda `en espera` con el motivo y el turno previsto de liberación.

### 4.2 Avance

```
avanceMil = 1000
si es obra de piedra y estación = invierno:  avanceMil = 500
si es obra de madera y estación = invierno:  avanceMil = 667
avanceMil × modificadores de casa y tradición
```

El progreso se guarda en milésimas de turno; una obra de 3 turnos necesita 3 000. Así el frenazo
invernal no pierde precisión.

### 4.3 Requisitos al empezar

Se comprueban al **dar la orden** y otra vez al **empezar**:

- solar libre, nivel por debajo del máximo, potencial suficiente;
- requisitos propios (molino exige granja; catedral exige ciudad y `ciudad-episcopal`; acequia exige
  `vega-fluvial`);
- recursos disponibles (se reservan al dar la orden);
- sin escasez.

Si al empezar falla algo, la orden pasa a `en espera` con motivo, sin perder la reserva.

### 4.4 Obras mayores

- Duración larga (12 a 45 turnos) y consumo **repartido**: el coste total se divide entre los turnos
  y se cobra cada turno. Si un turno no se puede pagar, la obra se detiene (no se pierde) y avisa.
- Pueden **abandonarse** con una orden: liberan la cuadrilla y se deterioran un 1 % por turno.
- Al terminar aplican su efecto permanente (puente, calzada, monasterio, catedral, muralla,
  atarazana, acequia mayor) y emiten un suceso de hito.

### 4.5 Roturar

Convierte monte en labor: `monte −1`, `labor +1` en los potenciales **efectivos** de la comarca
(guardados en el estado, no en el mundo). Cuesta 3 turnos y una cuadrilla; en dehesa cuesta el doble
y penaliza la lealtad en 5. No se puede deshacer en menos de 20 turnos (el monte tarda en volver).

### 4.6 Derribar

Libera un solar en 1 turno y devuelve la mitad del material, truncando a la baja.

## 5. Archivos

```
paquetes/nucleo/src/fases/06-obras.ts
paquetes/nucleo/src/reglas/{obras,cuadrillas,roturar}.ts
paquetes/nucleo/src/reglas/*.test.ts
paquetes/nucleo/datos/obras-mayores.json
```

## 6. Criterios de aceptación

1. Una obra de 3 turnos empezada en verano termina en 3; empezada en invierno (piedra), en 6.
2. Las cuadrillas se ocupan y se liberan correctamente; una tercera obra en una comarca con 2
   cuadrillas queda `en espera` con motivo legible.
3. No se puede superar el máximo de nivel ni los solares, en ninguna combinación (test de propiedad).
4. Una obra mayor detenida por falta de material se reanuda sola en cuanto hay material.
5. El abandono deteriora al 1 % por turno y se puede retomar.
6. Roturar cambia los potenciales efectivos y respeta la penalización de dehesa.
7. Los efectos permanentes de las siete obras mayores están implementados y probados uno a uno.
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/obras.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-036). Commit: `T-035: obras, cuadrillas y obras mayores`.
