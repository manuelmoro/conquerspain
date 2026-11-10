# T-107 · Entrar en una partida empezada

**Fase:** 5 · Multijugador · **Depende de:** T-105 · **Estado:** **hecha (10-11-2026)**

> Abierta desde T-105, que dejó el amparo hecho en el motor sin que nadie pudiera recibirlo.

## 1. Contexto

Hasta ahora las plazas se cerraban al fundar. Una partida larga necesita que alguien pueda entrar después,
con 20 turnos de amparo (T-105 §3).

## 2. Diseño

**Cómo se entra.** Con el código de la convocatoria. Si la partida ya empezó, «Unirme» enseña «Esta
partida ya ha empezado» y las ofertas de origen; al elegir una, la partida aparece en «Mis partidas» y se
juega desde que se resuelve el turno (hasta entonces, la API contesta `entrada-en-espera`).

**Las ofertas** (`ofertasDeEntrada`, en `nucleo/src/partidas/entrada.ts`): los orígenes de su casa que siguen
libres —sin dueño, sin venta de nadie, sin recuas, rebaños ni obras dentro— y a las jornadas de siempre
(`jornadasEntreCapitales`) de **cualquier** comarca con dueño, no solo de las capitales. Las elige el azar de
la partida con su turno y su jugador: las mismas si se pregunta dos veces el mismo turno. Si no queda
ninguna, `sin-sitio`: se prueba con otra casa.

**La orden `entrar`.** No la da el jugador (no está en el estado), sino el servidor, con su plaza
(`participante`) y el identificador que tendrá (la casa, o «casa-2»). El motor:

- la acepta aunque su jugador no esté aún en el estado (`comprobarEntrada` y `cabe`, solo para `entrar`);
- la resuelve **lo primero de la fase 0**, en orden de identificador, comprobando de nuevo con el estado de
  ese momento (`impedimentoDeEntrada`): si otro se quedó antes la comarca, se cancela con su motivo;
- da de alta al jugador (cambio `jugador-alta`) con el arranque de su casa, su capital con lealtad 100, su
  alfoz (las vecinas libres con la influencia de T-094), su cañada si es la Mesta y
  `amparoHasta = turno + 20`;
- lo anuncia a todos (`jugador.entra`, público, con la fecha en que acaba el amparo).

**Límites:** doce jugadores y cada casa como mucho dos veces, como en la convocatoria (T-100). Dos que
eligen la misma comarca el mismo turno: el servidor rechaza al segundo antes de guardar.

## 3. Criterios de aceptación

1. Un jugador nuevo entra en una partida empezada, elige origen y juega desde el turno siguiente. ✔
2. Entra con 20 turnos de amparo, público. ✔
3. Nadie de la partida ve alterado su estado por la entrada, salvo la comarca que el nuevo ocupa (y la
   influencia del alfoz en las vecinas libres). ✔

## 4. Verificación

`npm run verificar`, con `nucleo/pruebas/entrada.test.ts` (ofertas libres y lejanas, alta con arranque, alfoz
y amparo, estado ajeno intacto, origen no ofrecido) y la prueba de servidor de `altas.test.ts` (ofertas por
código, entrada, espera, `ya-dentro`, resolución y estado del nuevo). Probado en el navegador con una tercera
cuenta: ofertas, entrada, la partida en su lista y, tras avanzar el turno, su casa con el alfoz incorporable.
