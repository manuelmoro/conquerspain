# T-120 · Milicia concejil y coste económico de la guerra

**Fase:** 6 · Conflicto · **Depende de:** T-106 · **Estado:** **hecha (10-11-2026)**

## 1. Contexto

El conflicto entra al final y con freno de mano: cuesta economía, se avisa y no borra el progreso de
nadie (docs/06 §6.6). Esta tarea pone la milicia y la hostilidad; los asedios y los bloqueos de paso son de
T-121.

## 2. La mesnada

Una **mesnada** es la milicia levada en una comarca propia: `EstadoPartida.mesnadas?: Record<IdMesnada,
Mesnada>` (opcional en el validador, para leer las partidas viejas con su huella).

```ts
interface Mesnada {
  id; jugador; nombre;
  origen: IdComarca;            // de donde salen los hombres y adonde vuelven
  hombres: number;
  situacion: { donde: 'comarca'; comarca } | { donde: 'marcha'; hacia; turnosQueFaltan };
  turnosFuera: number;          // seguidos fuera de tierra propia: el recargo del acoso
}
```

**Los hombres nunca mueren.** Salen de la población de su comarca al levarlos y vuelven a ella al
licenciarlos, al desertar o al caer derrotados. La milicia no arrasa, no derriba ni mata a nadie: lo que
cuesta es lo que esos vecinos dejan de producir mientras están fuera, el pan que comen y la soldada.

## 3. Las órdenes

| Orden | Qué hace | Condiciones |
|---|---|---|
| `levar` | Una mesnada nueva con `hombres` de la comarca | comarca propia, no desleal; como mucho el 20 % de su población (`levaMaximaMil`); la comarca pierde 5 de lealtad |
| `licenciar` | Los hombres vuelven a su origen (o a la capital si ya no es suya) | mesnada propia |
| `marchar` | Hacia una comarca: tarda las jornadas del camino más corto entre 2 por turno | destino propio, neutral o de una casa con hostilidad vigente; nunca tierra de quien está amparado |
| `hostilidad` | Declara la hostilidad a otra casa, o la retira | no contra uno mismo ni contra quien está amparado |

Todo en la fase 4 (movimiento), después de recuas y rebaños; las órdenes en orden de identificador.

## 4. El coste

Cada turno, por cada mesnada (tabla `milicia`):

- **pan:** 1 por cada 10 hombres (redondeando hacia arriba);
- **soldada:** 6 maravedís por cada 10 hombres (con 2, una comarca de 400 vecinos sostenía 80 hombres
  todo el año sin notarlo: un hombre en armas tiene que costar más de lo que rinde en el campo), con **recargo por estar lejos**: +10 % por cada turno seguido
  fuera de tierra propia, hasta el triple. Es el límite al acoso: mantener una mesnada en tierra ajena se
  encarece rápido;
- **sin con qué pagar:** deserta el 10 % (vuelven a casa) y la comarca de origen pierde 1 de lealtad. Una
  mesnada sin hombres se disuelve.

Además, la comarca de origen produce y paga impuestos con menos gente: ese es el coste grande.

## 5. La hostilidad

- **Preaviso público de un turno:** la orden `hostilidad` apunta `EstadoPartida.hostilidades` con
  `vigenteDesde = turno + 1` y lo anuncia a todos (`hostilidad.declarada`). Hasta ese turno no cuenta.
- Es **mutua**: los dos pueden entrar en la tierra del otro y enfrentarse.
- La retira quien la declaró (`hostilidad.retirada`, pública).

## 6. El enfrentamiento

Al acabar el movimiento, dos mesnadas de casas con hostilidad vigente en la misma comarca se enfrentan
(por parejas, en orden de identificador). Sin azar:

- **fuerza** = hombres × 1,5 si defiende su propia comarca × 2 más si esa comarca tiene muralla;
- gana la de más fuerza; con empate, el que defiende (o, en tierra de nadie, el de menor identificador);
- **el que pierde** vuelve a su origen y el 10 % de sus hombres se van a casa. No pierde nada más: ni
  comarcas ni edificios. Ganar una comarca es cosa del asedio (T-121).
- Se anuncia a todos (`milicia.enfrentamiento`).

## 7. Lo que se ve

- **Propio:** las mesnadas en la vista y en el mapa (🛡️), y una sección «Milicia y hostilidad» en «Tu casa»
  para levar, marchar, licenciar y declarar o retirar hostilidad.
- **Ajeno:** las hostilidades son públicas; una mesnada ajena se ve en las comarcas donde el jugador tiene
  tierra o gente, con sus hombres en tramos de 10.

## 8. Criterios de aceptación

1. Mantener milicia un año arruina a quien no tenga economía para ello (prueba de escenario).
2. Declarar hostilidad siempre avisa con un turno.
3. Perder un enfrentamiento nunca hace perder más de un objetivo concreto: aquí, solo la posición (y el
   10 % de los hombres, que vuelven a casa).
4. La milicia nunca reduce la población total ni destruye nada.

## 9. Verificación

`npm run verificar`, con `nucleo/pruebas/milicia.test.ts`: leva y licencia, el tope del 20 %, un año de 80
hombres apostados fuera (la mayoría deserta y el arca queda muy por debajo de la misma casa sin milicia), el
recargo con tope, el preaviso público, la tierra vedada sin hostilidad, el amparo, la ventaja del que defiende
y de la muralla, y que el enfrentamiento no reduce la gente total. Cliente: `milicia.test.ts`, la sección
«Milicia y hostilidad» en «Tu casa» y las mesnadas en el mapa (🛡️).

**Una marcha de dos jornadas llega el mismo turno:** el turno en que se da la orden cuenta como el primero de
marcha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-120: <resumen>`.
