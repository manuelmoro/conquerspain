# T-031 · Fase 2: producción

**Fase:** 2 · Motor · **Depende de:** T-030, T-012 · **Estado:** pendiente

## 1. Contexto

El corazón económico: qué produce cada comarca cada quincena. Tiene que ser explicable hasta el
último punto, porque la interfaz debe poder desplegar la cuenta entera al jugador.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.2 a §3.5.

## 2. Objetivo

Calcular la producción de todas las comarcas propias con la cadena completa de factores, emitiendo
un suceso por explotación con el desglose, y aplicar el agotamiento y su regeneración.

## 3. Alcance

**Entra:** rendimiento por explotación, potencial, estación, aperos, lealtad, agotamiento, mano de
obra, y el ingreso de maravedís por mercados e impuestos.

**No entra:** consumo y merma (T-032), rebaños (T-040), privilegios de casa (T-041) más allá de dejar
los enganches preparados.

## 4. Diseño detallado

### 4.1 Cadena de cálculo

Por cada comarca propia y cada tipo de explotación con nivel > 0:

```
rendimientoBase = datosEdificio.basePorNivel × nivel
factores = [
  multiplicadorPotencial(potencial),          // 600 / 800 / 1000 / 1250 / 1500
  factorEstacion(recurso, estacion, clima),   // solo pan
  1000 + 100 × aperos,                        // 1000..1400
  factorLealtad(lealtad),                     // <20: 600 · <40: 750 · <60: 900 · resto: 1000
  factorAgotamiento(agotamiento),             // 1000 − agotamiento×10, suelo 400
  factorManoDeObra(comarca),                  // ver 4.2
]
rendimiento = multiplicarFactores(rendimientoBase, factores)
```

`multiplicarFactores` (T-002) garantiza que el truncado ocurre una sola vez.

### 4.2 Mano de obra

```
vecinosNecesarios = Σ (nivel de cada explotación) × 8
factorManoDeObraMil = min(1000, vecinos × 1000 / max(1, vecinosNecesarios))
```

Si falta gente, **todo** rinde proporcionalmente menos y se emite el suceso
`produccion.falta-mano-de-obra` con cuántos vecinos faltan. Es la señal que empuja a repoblar.

### 4.3 Maravedís

```
ingresoMercado   = 8 × nivelMercado × (1 + actividadComercialMil / 1000)
impuestos        = floor(vecinos / 10) × factorCargaFiscal   // ligera 1, normal 2, dura 3
ingresoCamino    = 4 × niveles de venta propios con tránsito este turno
```

Todo ello multiplicado por el modificador de fuero
([docs/03-economia.md](../03-economia.md) §3.9).

### 4.4 Agotamiento

Al final de la fase, por cada recurso agotable (`monte`, `piedra`, `hierro`, `sal`):

```
agotamiento += 2 × niveles que lo explotan        // antes de regenerar
agotamiento -= regeneracion del recurso           // monte 3, piedra 1, hierro 1, sal 2
agotamiento = limitar(agotamiento, 0, 60)
```

Con `dehesa`, el incremento del monte se reduce a la mitad y la producción de madera baja un 25 %.

### 4.5 Almacén

La producción entra en el **almacén común del jugador**, no en la comarca. La comarca solo guarda su
producción del turno para la crónica y para el cálculo de influencia y actividad.

### 4.6 Sucesos

Uno por explotación (`produccion.explotacion`) con: comarca, recurso, base, cada factor aplicado y
resultado. Esto es lo que permite que la interfaz enseñe «20 = 12 base × 125 % × 160 % × …».

## 5. Archivos

```
paquetes/nucleo/src/fases/02-produccion.ts
paquetes/nucleo/src/reglas/{produccion,agotamiento,manoDeObra}.ts
paquetes/nucleo/src/reglas/*.test.ts
paquetes/nucleo/datos/edificios.json
```

## 6. Criterios de aceptación

1. Tabla de casos escritos a mano (al menos 15) que cubre: potencial 1 y 5, verano e invierno,
   aperos 0 y 3, lealtad 15 y 100, agotamiento 0 y 60, falta de mano de obra al 50 %.
2. La suma de la producción de todas las comarcas coincide con lo que entra en el almacén (test de
   invariante).
3. Ningún recurso resulta negativo ni fraccionario.
4. El agotamiento nunca sale de 0..60 y la dehesa se comporta como dice §4.4.
5. Cada explotación emite su suceso con el desglose completo y reproducible.
6. Con las mismas entradas, dos ejecuciones dan el mismo resultado (reproducción).
7. Una partida de prueba de 24 turnos con una comarca muestra la curva estacional esperada: máximo
   en verano, mínimo en invierno, media anual ≈ 100 % del valor plano.
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/produccion.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-032). Si has ajustado cifras de `docs/03-economia.md`, actualiza el
documento. Commit: `T-031: fase de produccion`.
