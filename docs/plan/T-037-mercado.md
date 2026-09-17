# T-037 · Fase 7: mercados, ferias y formación de precios

**Fase:** 2 · Motor · **Depende de:** T-032 · **Estado:** pendiente

## 1. Contexto

El mercado es el segundo tablero del juego: donde el trashumante convierte lana en dinero, el ferrón
pone precio a los aperos y el mercader gana sin tener tierra. En multijugador es, además, la forma
de competir sin tocarse.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.10,
[docs/05-geografia.md](../05-geografia.md) §5.6.

## 2. Objetivo

Casar las órdenes de compra y venta de cada plaza, formar precios de manera determinista y dejar
constancia de todo para la crónica.

## 3. Alcance

**Entra:** mercados locales y ferias, órdenes con precio límite, casación con reparto proporcional,
formación de precios, mercaderes menores, comisión y volumen máximo por plaza.

**No entra:** contratos entre jugadores (T-103), transporte (ya hecho en T-033).

## 4. Diseño detallado

### 4.1 Estado de un mercado

```ts
export interface EstadoMercado {
  id: IdMercado;
  comarca: IdComarca;
  tipo: 'local' | 'feria';
  volumen: 'pequenya' | 'mediana' | 'grande';
  preciosMil: Readonly<Record<Recurso, Milesimas>>;   // maravedís × 1000 por carga
  ultimoVolumen: Readonly<Record<Recurso, number>>;
}
```

### 4.2 Casación

Para cada mercado activo y cada recurso, en orden de identificador:

1. Reunir las órdenes de venta (precio mínimo) y de compra (precio máximo) de recuas presentes con
   cometido `tratar`, más las de los **mercaderes menores**.
2. Precio de casación: el precio vigente de la plaza, ajustado según §4.3. Se casan las ventas con
   mínimo ≤ precio y las compras con máximo ≥ precio.
3. La cantidad casada es `min(ofrecido, demandado, topeDeVolumen)`.
   `topeDeVolumen = base × multiplicador de volumen (local 1, pequeña 1, mediana 3, grande 8)`.
4. Si hay más oferta que demanda (o al revés), se reparte con `repartoProporcional` (T-002) y el
   sobrante se resuelve por mejor precio ofrecido y, en último extremo, por `hash32`.
5. Comisión del 2 % en maravedís, a cargo del que compra y del que vende.

### 4.3 Formación de precios

```
desequilibrioMil = 1000 × (demanda − oferta) / max(1, demanda + oferta)
precioNuevoMil = precioMil + porcentaje(precioMil, elasticidad × desequilibrioMil / 1000)
precioNuevoMil = limitar al ±15 % del precio anterior
// y, además, regresión al precio base:
precioNuevoMil += (precioBaseMil − precioNuevoMil) / 10
```

Elasticidades: pan 400, sal 600, hierro 700, lana 500, madera 300, piedra 250, maravedís n/a.

Suelo y techo absolutos por recurso (para que nadie arruine una plaza para siempre): entre el 40 % y
el 250 % del precio base.

### 4.4 Mercaderes menores

Agentes sintéticos deterministas que dan liquidez:

- Compran y venden en torno al precio base con un margen del 10 %.
- Su volumen es proporcional al tamaño de la plaza y **decrece** a medida que crece el volumen humano
  (en una partida con mucho comercio entre jugadores, casi desaparecen).
- No acumulan: no tienen almacén ni memoria. Son mercado de fondo, no un rival.

### 4.5 Ferias

Solo activas en sus turnos. Además de volumen, dan:

- **precios mejores** (comisión 1 % en vez de 2 %);
- **rumores**: quien comercia en una feria recibe información fechada de otras plazas y de otros
  jugadores presentes (T-044);
- prestigio si el volumen propio del año supera el umbral (T-043).

## 5. Archivos

```
paquetes/nucleo/src/fases/07-mercado.ts
paquetes/nucleo/src/reglas/{mercado,precios,mercaderesMenores}.ts
paquetes/nucleo/src/reglas/*.test.ts
paquetes/nucleo/datos/mercado.json
```

## 6. Criterios de aceptación

1. La casación respeta los precios límite: nadie compra por encima de su máximo ni vende por debajo
   de su mínimo (test de propiedad con 5 000 casaciones).
2. El reparto proporcional conserva las cantidades (nada se crea ni se pierde) y es determinista.
3. Los precios no se mueven más de un 15 % por turno ni salen de la horquilla 40 %–250 %.
4. Sin actividad humana, los precios tienden al base en 10 turnos.
5. Con una venta masiva de lana en una feria, el precio cae y se recupera en los turnos siguientes
   (test de escenario con cifras esperadas).
6. Barajar el orden de las órdenes no cambia el resultado.
7. La comisión se cobra correctamente y aparece en los sucesos.
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/mercado.test.ts paquetes/nucleo/src/reglas/precios.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-038). Commit: `T-037: mercados, ferias y precios`.
