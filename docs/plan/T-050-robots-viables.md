# T-050 · Robots que ejecutan sus vías

**Fase:** 2 · Motor · **Depende de:** T-048, T-049 · **Estado:** hecha (22-09-2026)

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

## 9. Resultado (22-09-2026)

Hecha. Informe de referencia: [`T-050-1492`](../../herramientas/banco/informes/T-050-1492.md),
con su manifiesto. Evidencia y lectura en la [bitácora de equilibrio](bitacora-equilibrio.md).

### Lo que se hizo, defecto a defecto

| Defecto (§4.1) | Corrección | Prueba |
|---|---|---|
| 1. Hortelano sin mercado | Mercado antes de la acequia (con la piedra del arranque cabe uno de los dos); el tratante compra la piedra y vende el pan que sobra | `vias.test.ts`: hortelanos en la Vega de Granada venden pan |
| 2. Exploración que consume la recua | Ir y volver con la previsión exacta; exploración encadenada mientras llega para volver; recua mermada (<75 % de acémilas) que vuelve y se disuelve, con papeles **por hueco** (el nombre «Recua de X N») que no cambian al rehacerla; **expedición arriesgada deliberada** con carga ligera solo si ninguna oída cabe y la casa puede rehacer la recua | `robots/viaje.test.ts` |
| 3. Viajes aproximados | `robots/viaje.ts`: previsión turno a turno con `rutaPorParadas`, `pasoDeRecua`, `avanzar` y `bastimentoDe` del núcleo (paso de la casa, carga pesada, barro, calzadas, sal de verano, primer turno del almacén, pan y sal que paga el almacén, turno de salida). `panDeViaje` y `panDeIda` eliminados | `robots/viaje.test.ts`: bastimento de la casa, carga que frena, `no-cabe`, `sin-sal`, `sin-pan` |
| 4. Trashumancia sin probar | Ciclo `completo`, `a-medias` o `ninguno`; salida calculada para llegar al cambio de pasto; ningún trayecto de más de seis turnos; capacidad con el ganado propio y el ajeno que se ve; rebaño detenido que se replanifica; tratante el primero | `vias.test.ts`: Mesta en Sayago (Aliste ↔ Bragança, calidad ≥ 700, supervivencia, lana vendida) y en Zafra (un rebaño a medias, con motivo) |
| 5. Arbitraje sobreatribuido | Ganancia neta con las comisiones de la casa y el bastimento valorado, comprobada con la carga encima; nunca revende en su propia plaza; motivos cuando no hay negocio | `vias.test.ts`: mercader y arriero compran en casa, venden en una vecina **neutral** con margen neto positivo y vuelven |
| 6. Solvencia de planes | `solvencia.ts`: el plan de la capital sobre el arranque real, con esenciales que caben, insumos con fuente y material de la primera obra mayor. Perfil con `esenciales`; `hacerSitio` derriba lo que no puede trabajar (la lonja sin sal); el tratante compra por urgencia y guarda un lote por cosa pendiente | `solvencia.test.ts`, con control negativo |

Además: `Robot.decidir` devuelve `{ ordenes, motivos }` con un catálogo cerrado de motivos por
categoría (`robots/motivos.ts`); `PRUEBA_DE_VIA` exige la acción distintiva de cada casa y declara
qué motivos la explican; el informe enseña la vía **partida a partida** con su «por qué no»; el
criterio de **decisiones útiles** ya se evalúa (turno sin orden que trabaje ni plan en marcha); y la
reconstrucción de visitas de `visitas.ts` sabe por dónde pasa un rebaño con ruta nueva si acaba en
una vecina. `VERSION_METRICAS = 3`, `VERSION_ROBOTS = 2`.

### Decisiones tomadas durante la tarea

- **El núcleo solo exporta más, no cambia**: `avanzar`, `pasoDeRecua`, `pesoDeLaCarga`, `porteDe`,
  `rutaPorParadas`, `costeDeTramoMil`, `tieneCalzada`, `tramoEntre`, `comarcasTransitables`,
  `bastimentoDePresencia`, `capacidadDePasto`, `esPastoCorrecto`, `opcionesDeRutaDeRebanyo`,
  `pasoDeRebanyo` y `puedeEntrar`. Es lo que el cliente necesitará para sus previsiones; ninguna
  regla ni tabla cambia.
- La expedición arriesgada es una apuesta legal que un jugador haría (docs/03 §3.7.1: la recua
  malvive y siempre puede volver); se permite solo cuando no hay nada seguro y se paga rehaciendo
  la recua.
- Un rebaño con un solo pasto conocido rinde más que no criar: se permite uno solo, con motivo.
- Solo compra sal para lonjas quien las tiene en su plan (los salineros): a los demás, dos de sal
  dan seis de pan que sale más barato comprado.
- Para la prueba de capacidad del mercader se usa su tradición «Compañía» (porte 13): con porte 10
  la sal a una vecina a tres jornadas no paga el camino. Es un hallazgo para T-047, no un ajuste.

### Lo que no se ha podido cerrar aquí, y dónde queda

- Mercaderes y arrieros no hacen negocio en ninguna partida normal: con porte 10 y dos panes por
  jornada, las diferencias de precio que dejan los mercaderes menores no pagan el bastimento
  (motivo `sin-negocio-rentable`, categoría reglas) o no conocen una segunda plaza. Es de T-047.
- La exploración desde la sierra no llega más allá de las vecinas ni con expediciones arriesgadas
  (`sin-oida-al-alcance`, reglas). Es de T-047.
- Los ferrones de Bilbao aguantan el primer año (T-049) pero no son sostenibles: escasez casi
  permanente. Origen o arranque, para T-047.
- La diferencia entre jugar cada turno y cada seis crece, porque el robot diligente juega mucho
  mejor: es exactamente el trabajo de T-051.
