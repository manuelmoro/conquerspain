# T-122 · Bandidaje y seguridad de caminos

**Fase:** 6 · Conflicto · **Depende de:** T-120 · **Estado:** **hecha (10-11-2026)**

## 1. Contexto

Un riesgo moderado, previsible y evitable en los caminos, que haga interesante invertir en seguridad. Nadie
dirige a los bandidos: es un riesgo del mundo (docs/06 §6.6).

## 2. El riesgo de un tramo

`riesgoDeTramoMil` (`reglas/bandidaje.ts`), en milésimas, con las cifras de la tabla `bandidaje`:

| Qué | Riesgo |
|---|---|
| Base de cualquier tramo | +40 |
| Cruza un puerto de montaña | +30 |
| Terreno de sierra | +20 |
| Por cada punta sin dueño | +10 |
| Por cada punta desleal | +20 |
| Por cada punta con venta | −15 |
| Por cada punta con dueño y lealtad de 70 o más | −10 |
| Calzada | −20 |

Se recorta entre 0 y **100** (`riesgoMaximoMil`): nunca más de un 10 % por tramo. **La escolta:** si la casa de
la recua tiene una mesnada (T-120) en una de las dos puntas, el riesgo es 0. Así siempre se puede bajar a casi
nada invirtiendo: ventas, calzada, comarcas leales o una escolta.

## 3. El asalto

Al **entrar** una recua en un tramo (los mismos tramos que pagan portazgo, T-103), el azar determinista de la
partida (`azarDe(semilla, turno, 'bandidaje', recua|tramo)`) decide si hay asalto con esa probabilidad.

- Se pierde el **25 %** (`perdidaMil`) de cada cosa que lleva, redondeando hacia abajo. **Nunca las acémilas:
  la recua sigue entera** y sigue su camino.
- La crónica lo cuenta (`bandidaje.asalto`).
- Los rebaños no sufren asaltos: andan con sus pastores y sus perros.

## 4. Lo que se ve antes

El atlas, en el modo de caminos, marca los tramos con riesgo de 50 o más con «⚠» y un trazo de aviso, con el
riesgo **estimado** con lo que el jugador sabe (de las comarcas ajenas no se conoce la lealtad: cuenta como
neutra).

## 5. Criterios de aceptación

1. El riesgo nunca supera el máximo y siempre se puede reducir a casi cero invirtiendo.
2. Un asalto jamás destruye una recua: se lleva una parte de la carga y nada más.
3. El mapa muestra los tramos peligrosos antes de enviar la recua.

## 6. Verificación

`npm run verificar`, con `nucleo/pruebas/bandidaje.test.ts` (techo del riesgo, bajarlo invirtiendo, escolta,
botín, asalto que deja la recua entera y en camino) y la prueba del atlas (cada tramo trae su riesgo estimado y
el modo de caminos marca los peligrosos con «⚠»). El riesgo estimado lo calcula `atlasDeJugador`, que ahora
recibe las tablas.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-122: <resumen>`.
