# T-034 · Fase 5: cometidos de las recuas

**Fase:** 2 · Motor · **Depende de:** T-033 · **Estado:** pendiente

## 1. Contexto

Lo que una recua hace al llegar: explorar, portear, poblar, quedarse ganándose al concejo o tratar en
el mercado. Es la fase que convierte el movimiento en juego.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.7.3,
[docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.6 (conocimiento).

## 2. Objetivo

Ejecutar los cometidos de todas las recuas sobre el mismo estado inicial de fase, sin que el orden
entre jugadores influya en el resultado.

## 3. Alcance

**Entra:** explorar, portear, poblar (incluida la fundación de puebla), estar presente y disolver.
El cometido «tratar» se ejecuta en la fase de mercado (T-037) pero se registra aquí.

**No entra:** influencia acumulada e incorporación (T-038), mercado (T-037).

## 4. Diseño detallado

### 4.1 Explorar

- Requisito: la comarca de destino no es `explorada` ni `propia` para ese jugador.
- Efecto: el conocimiento pasa a `explorada` con los datos completos (terreno, potenciales,
  localidades, rasgos, población estimada) y las comarcas vecinas pasan a `oida` (nombre y poco más).
- Hallazgo: con el azar de ámbito `'hallazgo'` y una horquilla estrecha, la exploración puede
  encontrar algo pequeño: una vereda mejor (−1 jornada en un tramo), una localidad olvidada, o
  noticias de un rival. Nunca un recurso caído del cielo.
- Duración: 1 turno en destino.

### 4.2 Portear

Cargar y descargar en almacén propio o mercado, hasta el porte de la recua. La carga de un jugador
solo sale de su almacén y solo entra en él (los intercambios entre jugadores son contratos, T-103).

### 4.3 Poblar

- En comarca **propia**: descarga vecinos, que se suman a su población (sin superar la capacidad).
- En comarca **neutral** con influencia ≥ 40 del jugador: **funda puebla**. Requiere 10 vecinos
  (5 para los monjes) y 2 turnos. Al terminar: la comarca pasa a propia con población inicial igual a
  los vecinos llevados, lealtad 50 y carta puebla automática. Es la vía «fundacional» de expansión,
  distinta de incorporar una comarca ya poblada.
- Si dos jugadores fundan puebla en la misma comarca el mismo turno, gana el de más influencia; el
  otro conserva sus vecinos y recibe aviso.

### 4.4 Estar presente

La recua se queda en la comarca y aporta **+2 de influencia por turno** (T-038). Sigue consumiendo
bastimento. Es la forma barata y lenta de preparar una expansión.

### 4.5 Disolver

Devuelve los vecinos a la comarca (si es propia) y la mitad del coste de formación en maravedís.

### 4.6 Simultaneidad

Todos los cometidos se calculan sobre una **foto** del estado tomada al empezar la fase. Los efectos
se aplican después, agrupados y en orden de identificador. Así, dos recuas que exploran la misma
comarca el mismo turno obtienen ambas la información, y dos que fundan puebla se resuelven por la
regla de §4.3, no por quién se procesó antes.

## 5. Archivos

```
paquetes/nucleo/src/fases/05-cometidos.ts
paquetes/nucleo/src/reglas/{explorar,poblar,presencia}.ts
paquetes/nucleo/src/reglas/*.test.ts
```

## 6. Criterios de aceptación

1. Explorar revela la comarca y deja las vecinas en `oida`, con la fecha correcta.
2. Los hallazgos son deterministas por semilla y están acotados (test de propiedad: 1 000
   exploraciones, ningún efecto fuera de la lista permitida).
3. Fundar puebla exige influencia y vecinos, y el empate se resuelve por influencia.
4. Barajar el orden de las órdenes no cambia la huella del turno.
5. Poblar nunca supera la capacidad de la comarca; el sobrante se queda en la recua.
6. Disolver devuelve exactamente lo estipulado.
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/explorar.test.ts paquetes/nucleo/src/reglas/poblar.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-035). Commit: `T-034: cometidos de recuas`.
