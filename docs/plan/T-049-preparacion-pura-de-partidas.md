# T-049 · Preparación de partidas sin servidor

**Fase:** 2 · Motor · **Depende de:** T-048 · **Estado:** pendiente

## 1. Contexto

T-047 pide menos del 5 % de tierra sin usar y orígenes viables, pero T-065 reservaba el recorte y
el arranque para después de T-062, que depende de T-047. Se extrae aquí la preparación sin E/S;
T-065 conserva la API, persistencia y unión de participantes.

Lee [docs/05 §5.7](../05-geografia.md), [docs/04 §4.2](../04-casas-y-tradiciones.md),
[T-065](T-065-alta-de-partida.md), [la bitácora](bitacora-equilibrio.md) y
`herramientas/banco/src/partida.ts`.

## 2. Objetivo

Compartir entre banco y futuro servidor un recorte y un arranque reproducibles, con orígenes
viables para cada casa, sin depender de cuentas, reloj, HTTP ni base de datos.

## 3. Alcance

**Entra:** selección de subgrafo, orígenes y estado inicial; tablas de configuración; integración
en el banco y pruebas de viabilidad inicial. **No entra:** generar otro atlas, renumerar comarcas,
inventar ferias, cambiar el equilibrio global ni implementar el servidor.

## 4. Diseño detallado

### 4.1 Contrato compartido

Situar las funciones puras en `paquetes/nucleo/src/partidas/` y las cifras en `src/datos/arranque.ts`
o una tabla específica. Reciben `Mundo`, reglas, semilla y participantes; devuelven mundo recortado,
ofertas de origen y estado inicial, o un error de dominio explicable. Separar preparar ofertas de
confirmar elecciones para que el servidor pueda persistir el sorteo antes de fundar capitales.
Los robots eligen entre ofertas usando su vista y perfil; no consultan resultados futuros.

Antes de implementar, completar en esta ficha las firmas y la política exacta de desempate y
reintentos. Una misma entrada debe producir el mismo resultado; permutar el listado de entrada
no debe dar prioridad accidental a una casa. El orden estable deriva de identificadores y semilla,
no de la llegada de una petición HTTP.

### 4.2 Recorte

- Subgrafo conexo que conserva identificadores, geografía, tramos, cañadas y ferias existentes.
  Quitar referencias a comarcas excluidas y pasar `validarMundo`.
- Tamaño proporcional a participantes, separado de la extensión total del catálogo. Medir y
  documentar la horquilla antes de fijarla; no escoger el recorte mirando qué casillas tocaron
  los robots en una partida ya resuelta.
- Exigir oportunidades de sal, hierro, pan, comercio y ambos pastos cuando participe la Mesta;
  medir acceso por caminos y estaciones, no por distancia en línea recta. No regalar conocimiento
  oculto al robot para que encuentre esos recursos.
- Mantener la separación propuesta de seis jornadas entre capitales, con la fórmula y estación
  escritas. Si un tamaño no permite las restricciones, ampliar o rechazar con límite de intentos;
  nunca bucle ilimitado ni sorteo que silenciosamente incumpla.
- Probar pocas plazas y ocho casas. Documentar tamaños soportados; no prometer todavía doce casas
  distintas (el banco actual usa una instancia por oficio).

### 4.3 Arranque por origen

Hoy `comarcaInicial` copia `{ granja: 2 }` a todas las capitales y toma su población del catálogo.
Eso no asegura pan con labor 1 ni espacio para la cadena productiva y el mercado.

- Definir perfiles por potencial y vía económica, con costes y reservas en tablas. Validar solares,
  límites de casa, insumos, capacidad y población; no otorgar edificios imposibles o descuentos
  particulares dentro de la lógica.
- Probar el primer año con órdenes competentes y reproducibles: alimentación propia o compra
  sostenible con ingresos reales. Dar una despensa enorme que solo aplaza la quiebra no demuestra
  viabilidad. Incluir un segundo año de diagnóstico y las reservas/materiales de la vía propia.
- Cubrir explícitamente labor 1, costa pesquera, salina interior, vega, ferrería y pastos opuestos.
  No exigir autosuficiencia agrícola a Mesta y mercaderes: su diseño exige comprar.
- Enumerar todos los orígenes elegibles con comprobaciones estructurales baratas y elegir una
  muestra fija por perfil para las simulaciones; no limitar la prueba a un origen favorable.
- Reutilizar costes, capacidad y modificadores efectivos del núcleo. Mantener casos de hambre
  deliberada como escenarios de prueba separados.

## 5. Archivos

- `paquetes/nucleo/src/partidas/`, tablas de arranque, exports y pruebas.
- `herramientas/banco/src/partida.ts` y pruebas: adaptador del mismo preparador, sin copia paralela.
- `docs/05-geografia.md` y `docs/03-economia.md`: reglas de recorte y arranque definitivas.
- T-065: sustituir los puntos transferidos por el contrato que debe consumir el servidor.

## 6. Criterios de aceptación

1. Misma semilla, elecciones y reglas → mismo mundo y estado byte a byte; permutaciones estables.
2. Mundo conexo, referencias válidas, separación y recursos verificables; error explicable cuando
   la configuración sea imposible.
3. Ningún origen ofrecido incumple requisitos estructurales de la casa ni del arranque.
4. La muestra fija por perfil supera el escenario de viabilidad inicial documentado, con costes
   reales y sin privilegios del robot. Se publican también los resultados desfavorables.
5. Banco y servidor tienen un único contrato de preparación. No se incorpora E/S al núcleo.
6. `npm run verificar` pasa. El uso del mapa en T200 se mide después; no se cierra el equilibrio aquí.

## 7. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-049
```

Guardar el manifiesto de T-048 y explicar que cambió el escenario de partida: no atribuir su
resultado a un cambio de balance de una casa.

## 8. Al terminar

Marcar T-049 hecha, actualizar ESTADO y continuar con T-050. Commit y push:
`T-049: preparación pura con recortes y orígenes viables`.
