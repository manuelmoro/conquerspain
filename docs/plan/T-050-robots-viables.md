# T-050 · Robots que ejecutan sus vías

**Fase:** 2 · Motor · **Depende de:** T-048, T-049 · **Estado:** pendiente

## 1. Contexto

Los tests preparados de T-046 prueban que una rutina puede funcionar, pero no atribuyen la causa
cuando falla en la partida completa. Dos ensayos de logística siguieron sin activar las vías de
Mesta y mercaderes. No se deben equilibrar casas contra errores de sus representantes.

Lee [T-046](T-046-banco-de-pruebas.md), [la bitácora](bitacora-equilibrio.md),
[docs/04](../04-casas-y-tradiciones.md) y `herramientas/banco/src/robots/`.

## 2. Objetivo

Que las estrategias del banco ejecuten planes legales, sostenibles y propios de cada casa, y
expliquen cuándo una oportunidad no existe con las reglas actuales.

## 3. Alcance

**Entra:** robots y pruebas, diagnóstico de órdenes fallidas y oportunidades accesibles.
**No entra:** cambiar tablas del motor para favorecer robots, revelar información oculta ni
resolver la comparación de ausencia (T-051). No es una IA competitiva ni un optimizador de semillas.

## 4. Diseño detallado

### 4.1 Defectos y límites observados que deben cubrirse

1. **Hortelano sin mercado.** `hortelanos.ts` incluye papel `tratar` y venta de pan, pero ningún
   mercado en sus planes. El informe base muestra cero comercio y 54,5 % de turnos sin órdenes.
   Incorporar una salida comercial viable respetando solares y capacidad; no basta añadir un
   mercado al final de una cola que nunca cabe.
2. **Exploración que consume la recua.** `siguienteAExplorar` acepta un viaje de ida aunque la
   vuelta malviva; el robot no recupera su capacidad después. En porte40/1492/T200 la exploradora
   de la Mesta tiene una acémila y porte 4. Planificar bastimento de ida, regreso y estación,
   consultar modificadores efectivos y prever recuperación legal (disolver/formar si procede).
   Una expedición arriesgada deliberada puede existir; no debe ser un fallo perpetuo por defecto.
3. **Viajes calculados con aproximaciones.** `panDeViaje` y `panDeIda` usan paso base, sin el
   modificador de bastimento de la casa/tradición; feriar estima tres jornadas por turno. Usar las
   reglas disponibles para carga, barro, nieve, sal y tiempos de cola. Evitar una segunda fórmula
   divergente del núcleo. No dar una orden de carga imposible que bloquee toda la recua.
4. **Trashumancia insuficientemente probada.** La Mesta forma ganado si conoce cualquiera de los
   dos pastos y sale con antelación fija de dos turnos. Eso no demuestra ciclo anual sostenible.
   Planificar según trayecto y calendario conocidos, capacidad real del pasto y cierres; probar
   ambos pastos, supervivencia, calidad, esquileo y venta de esa lana. No cambiar su prestigio para
   compensar ganado que el robot deja sin alimento.
5. **Arbitraje sobreatribuido.** El caso existente del mercader prepara dos plazas propias y una
   carestía. Añadir viaje fuera del dominio, compra anterior a venta, carga trazable, ganancia neta
   y regreso. Revisar los márgenes de compra/venta y la reserva de dinero sin adivinar precios
   futuros. Si las tablas no ofrecen una oportunidad rentable, registrar la causa para T-047.
6. **Solvencia de planes.** Revisar para las ocho casas que cabe la cadena, se producen/compran
   sus insumos y se puede llegar a los materiales de obra mayor. No confundir una orden devuelta
   o permanentemente cancelada con una decisión útil. Repetir la prueba de información oculta.

### 4.2 Método de corrección

- Reproducir cada problema con un escenario pequeño antes de cambiar el robot.
- Corregir una rutina y ejecutar sus pruebas antes de medir campañas enteras.
- Separar tests preparados de capacidad y partidas normales de viabilidad. Mantener las ocho vías
  por casa y semilla en el informe, con razón trazable si alguna no ocurre.
- Guardar una revisión fija de robots para T-047. Cambiar robots durante un ensayo de tablas
  invalida la atribución y obliga a generar una nueva referencia.
- Si una vía exige un mecanismo ausente del motor, abrir una ficha con el caso mínimo y enlazarla
  como dependencia; no implementar una mecánica solo dentro del robot ni declarar que funciona.

## 5. Archivos

`herramientas/banco/src/robots/`, `vias.test.ts`, las pruebas de robots y los informes con manifiesto.
Cambios del núcleo solo en otra tarea justificada; no en esta.

## 6. Criterios de aceptación

1. Regresiones de los seis puntos anteriores, incluidas carga insuficiente, sal de verano y retorno.
2. Hortelanos pueden vender excedentes; Mesta puede completar ciclo y vender lana; mercaderes
   completan un negocio netamente rentable fuera de casa en escenarios legales y reproducibles.
3. La prueba de vía exige su acción distintiva, no solo producción o coincidencias de contadores.
4. Las campañas normales explican cada vía ausente como limitación de mapa, reglas, recursos o
   plan; los defectos conocidos del robot quedan corregidos y las hipótesis no se presentan como hechos.
5. No hay acceso a información oculta ni ajustes condicionados a las semillas de referencia.
6. `npm run verificar` pasa. No se exige todavía la horquilla final de prestigio.

## 7. Verificación

```bash
npm run verificar
npm run banco -- --semilla 1492 --turnos 200 --repeticiones 3 --fecha T-050
```

Antes del cierre, comprobar también orígenes de perfiles distintos a los tests preparados.

## 8. Al terminar

Marcar T-050 hecha, actualizar ESTADO y continuar con T-051. Commit y push:
`T-050: planes viables y diagnósticos de los robots`.
