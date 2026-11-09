# T-087 · Móvil, accesibilidad y rendimiento

**Fase:** 4 · Cliente · **Depende de:** T-086 · **Estado:** en curso (ficha **detallada** el 09-11-2026)

## 1. Contexto

Pasada final de calidad sobre todo el cliente: que se juegue con una mano, que se entienda sin
color y que vaya fino en un móvil normal.

Lee antes: [docs/08-interfaz.md](../08-interfaz.md) §8.4 y §8.5.

## 2. Objetivo

Cumplir los criterios de móvil, accesibilidad y rendimiento en todas las pantallas.

## 3. Alcance

**Entra:** revisión completa, correcciones, pruebas en dispositivos reales y medición.

**No entra:** funcionalidad nueva.

## 4. Diseño detallado

1. **Contraste AA, vigilado.** `accesibilidad.test.ts` lee los colores de `estilo.css` y comprueba cada par de
   texto y fondo que usa el cliente: tinta, tinta suave, cobalto, rojo y verde sobre papel, papel claro,
   blanco, etiqueta, aviso y error. Todos tienen que llegar a 4,5:1, y el botón (blanco sobre cobalto) también.
   Ningún texto se apaga con `opacity`: lo viejo se marca con un borde discontinuo y la palabra que lo dice.
2. **Foco y movimiento.** Foco visible en todo lo que se pulsa (`:focus-visible`, contorno cobalto de 3 px,
   6,8:1 sobre papel). Con `prefers-reduced-motion`, nada se anima.
3. **Lectores de pantalla.** Los botones de solo icono (✕, ↑, ↓, ←, →) llevan su nombre en `aria-label`: lo
   pone `boton` con una tabla (`etiquetaDeIcono`, pura y probada). Los diálogos ya llevan `role="dialog"`.
4. **Todo lo del mapa, sin el mapa.** Bajo el mapa, «Las comarcas en lista» (`comarcasEnLista`, pura): las
   conocidas, propias primero, después exploradas y oídas, y cada grupo por nombre. Cada una tiene un botón que
   hace lo mismo que tocarla: abrir su ficha o, con el editor abierto, añadirla como parada. Con eso se hace sin
   tocar el mapa todo lo que el mapa permite.
5. **Móvil con una mano.** Por debajo de 900 px, una barra fija abajo con las órdenes de este turno y el tiempo
   hasta el corte («3 órdenes · faltan 5 h»), que lleva a la bandeja (`textoDeLaBarra`, puro).
6. **Rendimiento, medido.** El atlas más grande de una partida de ocho casas (el de la península entera) se
   compone en menos de 250 ms (prueba de tiempo con margen), y el paquete sigue bajo su presupuesto de 150 KB
   gzip. Los 60 fps al desplazar y el arranque en gama media se miden en dispositivo real en J-02 y J-03.

## 5. Criterios de aceptación

1. Contraste AA en todos los textos y estados (probado sobre la hoja de estilos).
2. Todo lo que se puede hacer en el mapa se puede hacer sin el mapa (lista de comarcas, probada en lo puro).
3. Foco visible, sin animaciones con «menos movimiento», y ningún botón de icono sin nombre.
4. Composición del atlas por debajo de 250 ms y paquete bajo presupuesto. 60 fps y arranque en J-02/J-03.
5. El recorrido crítico con una mano en menos de dos minutos: se mide en J-03.

### Checkpoint humano

Para cerrar, realizar **J-02 y J-03** de [checkpoints-jugabilidad.md](checkpoints-jugabilidad.md):
ciclo completo con casas distintas y prueba con personas ajenas al desarrollo. Requieren T-083,
T-084 y T-085 terminadas, además del alta de T-086. Conservar actas y corregir los bloqueos del
recorrido; los tests automáticos no sustituyen esas sesiones.

## 6. Verificación

```bash
npm run verificar
```

Más las comprobaciones propias que se añadan al detallar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-087: <resumen>`.

## 8. Dónde va (09-11-2026)

- **Hecho y verificado (§4, puntos 1 a 6):**
  - `accesibilidad.ts` y `accesibilidad.test.ts`: contraste AA de 18 pares sobre la hoja, sin `opacity`, foco y
    «menos movimiento»;
  - `boton` pone `aria-label` a los iconos;
  - «Las comarcas en lista» bajo el mapa;
  - la barra de abajo en móvil;
  - el atlas del peor caso, compuesto en menos de 250 ms (`atlas.test.ts`);
  - 53,1 KB gzip.

  Visto en Chrome sin cabeza en móvil.
- **Falta, y no lo puede hacer una IA:** J-02 y J-03 con personas, que miden los 60 fps, el arranque en gama
  media y el recorrido con una mano en menos de dos minutos (criterios 4 y 5). Con sus actas, se corrige lo que
  salga y se cierra la tarea.
