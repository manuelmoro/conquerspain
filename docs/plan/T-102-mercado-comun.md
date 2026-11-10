# T-102 · Mercado común, rumores e información entre jugadores

**Fase:** 5 · Multijugador · **Depende de:** T-100 · **Estado:** **hecha (10-11-2026)**; el checkpoint de personas se omite por decisión del usuario, que corregirá jugando

## 1. Contexto

Con varios jugadores, los precios los mueven ellos. Al detallar esta ficha se vio que casi todo el mercado
común ya estaba hecho desde T-037, T-044, T-054 y T-057:

- **La casación entre jugadores** va primero, al precio de la plaza, con el sobrante repartido en proporción a
  lo pedido (docs/03 §3.10.4).
- **Los mercaderes menores** se retiran según el comercio humano, sin que la plaza se quede seca de golpe: su
  cupo es el tope de la plaza por su liquidez, menos lo que los jugadores ya se comercian entre sí.
  `cupoDeMenores` es una resta lineal: a más comercio humano, menos menores, sin saltos.
- **La protección contra la manipulación:**
  - el precio no se mueve más de un 15 % por turno y nunca baja del 40 % del base (docs/03 §3.10.3);
  - ninguna plaza mueve más de su tope de volumen por recurso y turno.

  Así, un jugador puede empujar el precio, pero no llevarlo al suelo en un turno. Un tope por jugador no
  añadiría nada que no hagan ya estos dos: el que vende mucho se hunde a sí mismo el precio.
- **Los rumores:** llegan fechados, con su fuente, a dos cifras significativas y sin apartarse más de un 5 %
  (T-044, `rumores.test.ts`). Llegan por ferias, ventas propias y el Camino de Santiago.

Lo que faltaba era **el emisario** (docs/06 §6.5.3).

## 2. El emisario

- **El cometido `emisario`:** con una recua quieta en una comarca de otra casa.
  - Pasa `turnosDeEmisario` (2) reuniendo un informe: ese es su retraso.
  - Al acabar, el jugador pasa a conocer **todas las comarcas del dominio de esa casa** tal como están, como
    exploradas y fechadas: su gente y sus edificios.
  - Un suceso cuenta las comarcas, los vecinos y las obras en marcha. El cometido termina.
- **Deja rastro:** el espiado recibe el primer turno el aviso «Un emisario de X anda por Y: en dos turnos sabrá
  cómo está tu dominio».
- **Cuesta lo que cuesta una recua fuera:** su provisión y su tiempo. Ni dinero ni orden aparte.
- **En tierra de nadie o propia** no hace nada: se avisa y el cometido termina.
- **Desde la ficha** de una comarca de otra casa, ya explorada: «Enviar un emisario». Como las demás
  misiones, carga la provisión, va, toma el encargo y vuelve sola cuando acaba el informe.

## 3. Fuera de esta tarea

- **El correo de los arrieros** (vender información a otro jugador) va con los contratos entre jugadores
  (T-103).
- **Los portazgos y el crédito** son T-103.

## 4. Criterios de aceptación

1. Un jugador puede mover el precio de un recurso, pero no llevarlo al suelo en un turno: tope del 15 % por
   turno y suelo del 40 %, ya probados en `precios.test.ts`. ✔
2. Los rumores llegan fechados y su imprecisión está acotada a un 5 % (`rumores.test.ts`). ✔
3. El emisario informa con retraso y deja rastro (`emisario.test.ts`). ✔

## 5. Verificación

`npm run verificar`.
