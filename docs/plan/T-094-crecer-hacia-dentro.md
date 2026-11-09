# T-094 · Crecer hacia dentro: niveles sin solar, villas y el alfoz

**Fase:** 5 · Reglas · **Depende de:** T-092, T-093 · **Estado:** propuesta, pendiente de que el usuario decida

## 1. Contexto

Tras jugar, el usuario ve el arranque lento y pesado:

- ampliar un edificio gasta un solar;
- una comarca grande no se distingue de una despoblada;
- las comarcas pegadas a la capital tardan decenas de turnos en ganarse.

Quiere poder hacerse fuerte en su tierra antes de ir a por los vecinos. Además, en su partida, los mercaderes
pasaron hambre muchos turnos y su recua perdió casi todas las acémilas.

## 2. Propuesta (a confirmar)

1. **Ampliar no ocupa solar.** El solar limita cuántos edificios distintos hay, no sus niveles. El límite de los
   niveles pasa a ser la gente que los trabaja (`vecinosPorNivel`) y un coste que sube con cada nivel.
2. **Aldea → villa → ciudad** según los vecinos (por ejemplo, 150 y 300). Cada rango da +1 solar, sin orden, y se
   ve en el plano.
3. **El alfoz de la capital:** las comarcas vecinas de la capital empiezan con mucha influencia propia; con
   presencia o un regalo se ganan en 2 o 3 turnos.

Las tres aceleran la partida: hay que ajustar las cifras con el banco de pruebas y documentarlo en docs/03 y
docs/06.
