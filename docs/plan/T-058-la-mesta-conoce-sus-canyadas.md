# T-058 · La Mesta conoce sus cañadas

**Fase:** 2 · Motor · **Depende de:** T-049 · **Estado:** en curso

## 1. Contexto

Nace de [T-047](T-047-equilibrio-v1.md), por medición, el 24-09-2026. La Mesta es la casa más
descolgada del marcador: **21 % de la mediana** en las nueve partidas del banco (`T-057-*`), con 13
puntos de ganadería de media, es decir, menos de un año trashumante por partida. Los motivos de su
robot, en las nueve:

- «no conoce ningún invernadero al que pueda llegar el ganado» (entre 80 y 192 turnos de 200);
- «no tiene la gente, el pan o los maravedís para formar la recua que le falta» (159 a 198).

En la partida 1492 el retrato es completo: una sola comarca (Cameros) los 200 turnos, 26 a 49
vecinos, y **un rebaño que se muere de 573 cabezas a 13**, porque sin invernadero el ganado pierde
un 5 % cada turno de la otra estación. La exploradora que tendría que encontrar el invernadero no
llega a formarse nunca: la casa no tiene gente ni pan de sobra.

Y es un contrasentido de diseño. El lema de la casa en [docs/04 §4.1.1](../04-casas-y-tradiciones.md)
es *«ovejas que suben a Urbión en mayo y bajan a Extremadura por San Miguel»*, y su rasgo, *«la
partida se le juega en el calendario, no en el mapa»*. La Mesta **sabía** adónde bajar: las cañadas
reales eran suyas.

## 2. Objetivo

Que la Mesta empiece la partida conociendo su cañada real y el camino hasta ella, de modo que su
primera decisión sea **cuándo** mover el ganado y no **dónde está** el invernadero.

## 3. Alcance

**Entra:** un permiso de casa nuevo, `conoceLasCanyadas`, que da ese conocimiento al fundar la
partida; la Mesta lo tiene. Su documentación y sus pruebas.

**No entra:** los orígenes de la Mesta (siguen siendo pasto ≥ 3), el paso de los rebaños, el
robot de la Mesta y los datos de las cañadas, que se generan con el atlas (T-013 los ampliará).

## 4. Diseño

### 4.1 La regla

En una frase para el jugador: **«La Mesta conoce desde el principio la cañada real más cercana a su
capital, entera, y el camino hasta ella»**.

Al fundar la partida, para cada jugador cuya casa tiene `conoceLasCanyadas`:

1. **La cañada más cercana.** De las comarcas por las que pasa alguna cañada real (un tramo con
   `canyada` no nulo), la de menos jornadas base desde la capital; a igualdad, la de menor
   identificador. Se conocen **todas las cañadas que pasan por esa comarca**: donde se cruzan dos,
   se conocen las dos.
2. **Lo que se conoce.** Las comarcas de esas cañadas y las del camino más corto desde la capital
   hasta esa comarca, en jornadas base. Todas quedan **exploradas**, con la foto del turno 1 (la
   misma que tomaría una recua: `datosConocidosDe`), salvo la capital, que es propia.
3. **Lo que se oye.** Sus vecinas de las que no se sabía nada quedan **oídas**, como tras explorar.

Las jornadas son las base, sin estación ni obras, igual que el resto de la fundación: lo que sabe
la Mesta no puede depender del mes en que se crea la partida.

### 4.2 Por qué un permiso y no un rasgo de la Mesta

Ningún archivo del motor nombra una casa (lo vigila un test): lo que la Mesta tiene de propio va en
sus datos. Un permiso genérico se puede dar también por tradición, y se prueba aparte.

### 4.3 Piezas

- `paquetes/nucleo/src/tipos/reglas.ts`, `datos/casas.ts` y `validacion/validarTablas.ts`: el
  permiso, falso por defecto, verdadero para la Mesta.
- `paquetes/nucleo/src/partidas/canyadas.ts` (nuevo): `comarcasDeSuCanyada(mundo, capital)`, pura.
- `paquetes/nucleo/src/partidas/fundar.ts`: aplica el conocimiento al fundar.
- Pruebas: la regla sobre el mapa de prueba y sobre la península (Cameros conoce la Galiana hasta
  el Valle de Alcudia), y que una casa sin el permiso no sabe nada de más.
- Documentación: [docs/04 §4.1.1](../04-casas-y-tradiciones.md) y el texto del privilegio en los datos.

## 5. Criterios de aceptación

1. La regla de §4.1, probada: la cañada más cercana y el camino, el empate, el cruce de dos
   cañadas y una casa sin el permiso.
2. La Mesta hace años trashumantes en las tres campañas: `capitulo_ganaderia` sube de 13 de media.
3. El prestigio de la Mesta sube del 21 % de la mediana, y el recuento total no empeora respecto a
   `T-057-*` (341).
4. `npm run verificar` en verde.

## 6. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --evaluar --fecha T-058
npm run banco:comparar -- herramientas/banco/informes/T-057-1492.csv herramientas/banco/informes/T-058-1492.csv
```
