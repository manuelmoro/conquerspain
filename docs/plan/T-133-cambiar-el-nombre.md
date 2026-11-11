# T-133 · Cambiar el nombre de una partida antes de empezar

**Fase:** 7 · Tras jugar de verdad · **Depende de:** T-065 · **Estado:** **hecha (11-11-2026)**

> Petición del usuario (11-11-2026): renombrar «Prueba con Rodri y Mike» a «Prueba con Rodri, Mike y Jorge»
> sin tocar la base de datos de producción a mano.

## 1. Diseño

- `PUT /convocatorias/:id/nombre` con `{"nombre"}`: solo quien convocó (`solo-quien-convoca`), con las mismas
  reglas que al convocar (1 a 60 caracteres, sin espacios a los lados) y mientras la partida no esté fundada,
  también ya sorteada; si no, `convocatoria-cerrada`. `renombrarConvocatoria` en el repositorio comprueba lo
  de fundada dentro de la propia orden SQL.
- Al fundar, el nombre se lee de la convocatoria: llega a la partida, a su estado
  (`configuracion.nombre`) y a la crónica sin más.
- Una partida ya empezada **no** se renombra: su nombre está en el estado de cada turno, firmado con su huella.
- Cliente: «✎ Cambiar el nombre» junto al nombre de la convocatoria, solo para quien la convocó; abre un campo
  con «Guardar» y «Cancelar», que conserva lo escrito aunque la pantalla se repinte.

## 2. Criterios de aceptación

1. Quien convoca cambia el nombre antes de empezar, y el nuevo es el de la partida al fundarla. ✔
2. Nadie más puede, ni nadie con la partida ya empezada. ✔

## 3. Verificación

`npm run verificar`, con «cambiar el nombre antes de empezar» en `altas.test.ts`. Probado en el navegador:
Bruno renombra su convocatoria y Carmen, que no la convocó, no ve el botón.
