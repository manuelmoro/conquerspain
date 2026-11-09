# T-084 · Mercado, ferias y precios

**Fase:** 4 · Cliente · **Depende de:** T-082 · **Estado:** hecha (09-11-2026)

## 1. Contexto

El segundo tablero. Hay que poder leer de un vistazo dónde conviene vender y cuándo es la próxima feria. Desde
T-083 se trazan rutas; comprar y vender en sus paradas con precio límite se dejó para aquí.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.10; [docs/08-interfaz.md](../08-interfaz.md) §8.2.7 y
§8.3; [docs/02](../02-diseno-nucleo.md) §2.6 (precios fechados por plaza).

## 2. Objetivo

Pantalla de mercado con las plazas que conoce el jugador, sus precios **con su fecha y su fuente**, el calendario
de ferias y la serie de precios de cada plaza; órdenes de compra y venta con precio límite explicadas para quien
no sepa qué es un límite; y tratos con precio límite en las paradas de una ruta.

## 3. Alcance

**Entra:** panel de mercado (núcleo, servidor y cliente), ficha de plaza con su serie de precios, orden
`mercado` desde la ficha de la plaza, vender y comprar con límite en las paradas del editor de ruta.

**No entra:** contratos entre jugadores (T-103); la letra de cambio de los mercaderes (va con la pantalla de
gobierno de la casa, T-089: es un privilegio de casa, no del mercado).

## 4. Diseño detallado

### 4.1 El panel (núcleo, `prevision/mercado.ts`)

```ts
interface PrecioEnPlaza { readonly mil: number; readonly baseMil: number }  // base: el de esa comarca (§3.10.2)
interface PlazaEnPanel {
  readonly id: IdMercado; readonly comarca: IdComarca; readonly nombre: string;
  readonly tipo: 'local' | 'feria'; readonly volumen: VolumenFeria;
  readonly abierta: boolean; readonly abreEn: number;          // turnos (0 si abre este)
  readonly precios: Readonly<Record<Recurso, PrecioEnPlaza>> | null;  // null: nunca se supo nada
  readonly turnoDelPrecio: number | null; readonly fuente: FuenteDePrecios | null;
  readonly recuas: readonly { id: IdRecua; nombre: string; trata: boolean }[];  // propias quietas allí
}
interface PanelDeMercado { readonly turno: number; readonly plazas: readonly PlazaEnPanel[] }
function panelDeMercado(t: Tablero, mundo: Mundo): PanelDeMercado
```

Sale de `t.plazasConocidas()`, de `vista.jugador.plazas` y de las recuas de la vista: solo lo que el jugador
sabe. Nombre: el de la feria (`Feria.nombre`), «Mercado de X» o «Venta de X» según lo que se sepa de la comarca.
Orden: abiertas primero, después por lo que tarden en abrir y por nombre.

### 4.2 La serie de precios (servidor)

`GET /partidas/:id/mercado` devuelve `{ turno, panel, series }`. `series[plaza][recurso]` son los puntos
`{ turno, mil }` **que el jugador supo**: se leen sus `plazas` de los estados guardados de los últimos 24 turnos
(`repo.estado`) y se queda un punto por noticia distinta (por su `turno`). No cambia el estado ni filtra nada:
son sus propias noticias viejas.

### 4.3 Cliente

- **Mercado** (`pantallas/mercado.ts`): se abre desde la cabecera y ocupa el panel como la ficha. Una tarjeta
  por plaza con su estado («abierta», «abre en 3 turnos», «abre en la 2.ª quincena de mayo»), **la antigüedad del
  precio** («de hace 5 turnos, de oídas»; si pasa de 6 turnos, en gris y con «puede haber cambiado»; nunca un
  precio viejo con el aspecto de uno de hoy) y los seis precios como fichas marcadas **barato / caro** frente al
  base de esa comarca (±10 %). Tocar una plaza la abre.
- **Ficha de plaza:** cada recurso con su precio, su base y una **serie pequeña** (SVG de 120×28, puntos en los
  turnos sabidos, sin ejes, con el primero y el último rotulados). Las recuas propias que están allí y, si hay
  alguna, el formulario de orden: recua, comprar o vender, recurso, cantidad, **precio límite** (por defecto el
  sabido ±10 % a tu favor), turnos (1–24). Encima, una frase: «El precio límite es lo peor que aceptas: vendiendo,
  lo mínimo que quieres cobrar; comprando, lo máximo que quieres pagar. Si el precio de la plaza no llega, la
  orden espera.» Se manda el cometido `tratar` delante si la recua no lo tiene (`anyadirVarias`).
- **Editor de ruta (T-083):** en cada parada, además de cargar y descargar, «Vender» y «Comprar» con cantidad y
  precio límite por recurso (`ParadaDeRuta.vender/comprar`). `editor-de-ruta.ts` gana `fijarTrato`.
- `QUE_HACER` de `mercado` pasa a «desde el mercado».

## 5. Criterios de aceptación

1. Ningún precio se enseña sin su fecha y su fuente, y uno viejo se distingue de uno de hoy (probado en la función
   pura que lo describe).
2. El panel solo trae plazas y precios que el jugador conoce (prueba de fuga: una plaza de una comarca que no
   conoce no sale, ni sus precios).
3. La serie de una plaza son los precios que el jugador supo, turno a turno (probado contra los estados guardados).
4. Una orden de venta dada desde la ficha de la plaza la acepta el servidor y, con la recua tratando y el precio
   alcanzado, se casa (probado resolviendo un turno).
5. Una parada de ruta con venta y precio límite llega al motor tal cual (probado en el estado del editor).
6. `npm run verificar` en verde y el cliente por debajo de su presupuesto.

## 6. Verificación

```bash
npm run verificar
```

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-084: <resumen>`.

## 8. Cierre (09-11-2026)

Hecho todo lo de §4:

- **Núcleo:** `prevision/mercado.ts` (`panelDeMercado`, `RECURSOS_DE_MERCADO`); `Tablero.edificiosSabidos` pasa
  a ser pública, sin cambiar nada de los robots.
- **Servidor:** `GET /partidas/:id/mercado` (`servidor/src/api/mercado.ts`), con la serie leída de los estados
  guardados. Solo pide `Pick<Repositorio, 'estado'>`.
- **Cliente:** `mercado.ts` (puro: fecha y fuente, barato y caro, límite por defecto e intenciones),
  `pantallas/mercado.ts` y los tratos con precio límite en el editor de ruta (`fijarTrato`; las paradas guardan
  sus tratos en un solo objeto, `TratosDeParada`).

Los seis criterios están probados, la orden se casa con una partida de prueba real, y se ha visto en Chrome sin
cabeza. La letra de cambio pasa a T-089 (es un privilegio de casa).
