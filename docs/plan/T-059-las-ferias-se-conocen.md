# T-059 · Las ferias se conocen y se buscan

**Fase:** 2 · Motor y banco · **Depende de:** T-053 · **Estado:** en curso

## 1. Contexto

Nace de [T-047](T-047-equilibrio-v1.md) y del criterio 3 de [T-053](T-053-plazas-donde-comerciar.md),
por medición, el 24-09-2026. **Ningún robot pisa una feria en doscientos turnos**: el capítulo de
comercio del prestigio, que cuenta ferias destacadas, vale 0 para las ocho casas en las nueve
partidas. La Mesta, que es quien tiene mercancía de feria, vende sus 434 sacas de lana en el mercado
de su capital: no conoce ninguna feria, y su robot solo las busca entre las comarcas ya exploradas.

Es un contrasentido de diseño. Las ferias son *«citas fijas del calendario»* ([docs/05 §5.6](../05-geografia.md)),
*«el acontecimiento anual, el punto de encuentro»* ([docs/03 §3.10.1](../03-economia.md)), y la
interfaz enseña a todos el calendario de ferias ([docs/08 §8.2.7](../08-interfaz.md)). Medina del
Campo no era un secreto.

Medido antes de escribir esta ficha: dar las ferias de oídas **sin más** no cambia nada (ensayo
`E-feriasOidas`, 118 filas igual, cero ingresos de feria). Para llegar hay que ir por comarcas
exploradas, y ningún explorador abre camino hacia una feria.

## 2. Objetivo

Que todo jugador sepa desde el principio dónde están las ferias del reino, y que el robot de una
casa con mercancía de feria explore hacia la más cercana cuando no alcance ninguna.

## 3. Alcance

**Entra:** el conocimiento inicial de las ferias (motor), lo que el tablero del robot sabe de una
comarca oída y la elección del explorador (banco).

**No entra:** el calendario, el volumen de las ferias ni el umbral de la feria destacada.

## 4. Diseño

### 4.1 Las ferias se saben de oídas

Al fundar la partida, cada jugador conoce **de oídas** todas las comarcas con feria (las que no
conozca ya mejor). De oídas no se sabe su geografía, solo que está ahí y cuándo abre: el calendario
es público.

### 4.2 Lo que sabe el robot de una comarca oída

Su nombre, **dónde está en el mapa** (su centro, que el atlas dibuja para todos) y, si tiene feria,
la feria con su calendario. Nada de su geografía económica. El tablero lo documenta en su cabecera
y `robots.test.ts` sigue vigilando que no se filtren potenciales ni rasgos.

### 4.3 El explorador que busca feria

Una casa con mercancía de feria (`perfil.feria` no vacío) cuyo feriante no alcanza ninguna feria
elige, entre las oídas a las que puede ir y volver, **la más cercana en el mapa a la feria oída más
próxima**, en vez de la más cercana a la recua. Así cada salida abre camino hacia la feria.

### 4.4 Piezas

- `paquetes/nucleo/src/partidas/fundar.ts`: las comarcas con feria, de oídas.
- `herramientas/banco/src/robots/tablero.ts`: `centroDe` y las ferias de las comarcas oídas.
- `herramientas/banco/src/robots/impulsos.ts`: la elección del explorador.
- Documentación: docs/03 §3.10.1 y docs/05 §5.6.

## 5. Criterios de aceptación

1. Al fundar, todo jugador conoce de oídas las comarcas con feria (probado).
2. El tablero da el centro y la feria de una comarca oída, y ni un potencial (probado).
3. Alguna casa hace ventas en feria en las tres campañas, y el capítulo de comercio deja de ser 0.
4. El recuento no empeora respecto a `T-047-metricas5` (353).
5. `npm run verificar` en verde.

## 6. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --evaluar --fecha T-059
```
