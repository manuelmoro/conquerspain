# T-086 · Mis partidas, crear partida, elegir casa y origen

**Fase:** 4 · Cliente · **Depende de:** T-085 · **Estado:** hecha (09-11-2026)

## 1. Contexto

La entrada al juego. La maqueta ya fijó el aspecto de estas pantallas; ahora se conectan al
servidor y se añade la elección de casa.

## 2. Objetivo

Pantallas de partidas, creación, elección de casa y elección de origen, funcionando contra la
API real.

## 3. Alcance

**Entra:** lista de partidas, creación con ritmo y modo, elección de casa con su privilegio y su límite, sorteo de tres orígenes y fundación.

**No entra:** partidas públicas ni emparejamiento.

## 4. Diseño detallado

### 4.1 La lista, con lo que importa (núcleo y servidor)

`resumenParaLaLista(estado, jugador, mundo, reglas)` en `nucleo/src/partidas/lista.ts` devuelve:

- `fecha`: «segunda quincena de mayo del año 2»;
- `prestigio`, `puesto` y `casas`;
- `pan`, `turnosDePan` (pan disponible entre lo que se come por turno, con `Tablero.consumoDePan`; null si no
  se come nada) y `escasez`.

Todo es del propio jugador o público. `GET /partidas/mias` lo añade a cada partida, junto con `ordenesDadas`
(sus órdenes recibidas y aún sin resolver este turno). Así la lista avisa de **las que esperan órdenes**.

### 4.2 Cliente (`inicio.ts` puro y `pantallas/partidas.ts`)

- **Mis partidas.** Una tarjeta por partida con:
  - casa y nombre;
  - turno y quincena, y la cuenta atrás al corte;
  - el abastecimiento: «pan para 5 turnos», o «hambre» en rojo y con texto;
  - prestigio y puesto;
  - una etiqueta **«sin órdenes este turno»** si no ha dado ninguna.

  Debajo, las convocatorias en marcha (`GET /convocatorias/mias`) con su estado y lo que toca: compartir el
  código, sortear (solo quien convoca) o elegir origen.
- **Convocar.** Nombre, ritmo (cada hora, cada 6 horas, cada día: `INTERVALOS_ADMITIDOS`), plazas (1 a 8) y la
  casa. Cada casa es una tarjeta con su **privilegio, su herramienta y su límite**, que van en tres renglones del
  mismo peso: el límite no se esconde (criterio 2). **Unirse:** código y casa.
- **Elegir origen.** Las tres ofertas en tarjetas compactas, una por fila: nombre, perfil, ventaja y limitación.
  Al elegir la última, la partida se funda y se abre.

`inicio.ts` lleva lo puro: el texto del abastecimiento, el aviso de órdenes, el ritmo en palabras y lo que toca
hacer en cada convocatoria.

## 5. Criterios de aceptación

1. Se puede convocar, sortear, elegir origen y abrir la partida desde el cliente (probado de punta a punta
   contra el servidor con una partida de una plaza). La medida de dos minutos en móvil se hace en J-03.
2. La elección de casa enseña su límite con el mismo peso que su privilegio (los tres textos en cada tarjeta).
3. La lista avisa de las partidas que esperan órdenes y del hambre (probado en las funciones puras y en la API).
4. `npm run verificar` en verde y el cliente por debajo de su presupuesto.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-086: <resumen>`.

## 8. Cierre (09-11-2026)

- **Núcleo:** `partidas/lista.ts` (`resumenParaLaLista`).
- **Servidor:** `GET /partidas/mias` trae `resumen` y `ordenesDadas`.
- **Cliente:** `inicio.ts` (puro) y la pantalla de partidas reescrita: lista, convocatorias, convocar, unirse y
  elegir origen. El recorrido de alta ya probado en `cliente.test.ts` comprueba ahora también el paso de cada
  convocatoria y el aviso de órdenes.
- **De paso:** se quitan de los textos de casas y tradiciones las referencias a tareas del plan («con T-103»), y
  una prueba lo vigila.
- La medida de dos minutos en un móvil de verdad se hace en J-03. Visto en Chrome sin cabeza.
