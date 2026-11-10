# T-105 · Amparo del novato, ausencia y administración del concejo

**Fase:** 5 · Multijugador · **Depende de:** T-101 · **Estado:** en curso (ficha **detallada** el## 1. Contexto

Las reglas que hacen habitable una partida larga: que entrar tarde no sea un suicidio y que irse de
vacaciones no arruine a nadie (docs/06 §6.4.3 y §6.4.4). El mayordomo (T-045) ya mantiene la economía
de quien no da órdenes; faltaba qué pasa con su dominio y qué ven los demás.

## 2. La ausencia

**Qué cuenta como estar.** Dar cualquier orden ese turno (la del mayordomo no cuenta: es automática).
El motor lo sabe por las órdenes nuevas del turno, sin mirar conexiones: un dato que el servidor no
tiene por qué guardar. `EstadoJugador.turnosSinOrdenes` (opcional; sin poner, 0) se pone a 0 con una
orden y si no, suma uno, al empezar la fase 0.

**Los escalones** (tabla `ausencia`, todo en turnos):

| Turnos sin órdenes | Qué pasa | Quién lo ve |
|---|---|---|
| 5 (`turnosParaAvisar`) | Aviso: «el mayordomo lleva la casa» | el jugador (y por correo, con los avisos de T-064) |
| 15 (`turnosParaAusente`) | **Ausente.** La lealtad de sus comarcas baja 1 por turno, pero nunca de 50 (`lealtadMinimaAusente`): ninguna se va por eso | todos (`ausencia.ausente`, público) |
| 30 (`turnosParaConcejo`) | **Administración del concejo.** Sigue produciendo con su mayordomo; no puede incorporar; y sus comarcas, **salvo la capital**, se pueden cortejar e incorporar como si fueran neutrales | todos (`ausencia.concejo`, público) |

**El reingreso.** La primera orden del ausente le devuelve el mando entero en ese mismo turno: el
contador vuelve a 0, la lealtad deja de bajar, y la influencia que otros hubieran ganado en sus comarcas
se borra (`ausencia.vuelve`, público). Lo que otro ya incorporó mientras tanto no vuelve: se perdió como
se pierde cualquier comarca.

## 3. El amparo

`EstadoJugador.amparoHasta` (opcional): el último turno de amparo. Mientras dura:

- **No paga portazgo** a nadie.
- **Sus comarcas no se pueden cortejar** aunque esté en administración del concejo.
- **Es público:** la vista de las casas dice `amparada` y el turno en que acaba.

**Quién lo tiene.** Quien entra en una partida ya empezada, 20 turnos (`turnosDeAmparo`). Hoy no hay
forma de entrar en una partida empezada: las plazas se cierran al fundar. **Atajo documentado:** el motor
y la vista ya tratan el amparo, pero nadie lo recibe hasta que exista la entrada tardía, que va en
[T-107](T-107-entrar-en-partida-empezada.md).

## 4. Lo que se ve

`CasaPublica` lleva `ausencia: 'presente' | 'ausente' | 'concejo'` y `amparoHasta: number | null`. En el
cliente, la ficha de una comarca de una casa en administración dice que se puede cortejar, y «Tus
contratos» marca a las casas ausentes.

## 5. Criterios de aceptación

1. Un jugador ausente 30 turnos conserva su dominio (ninguna comarca baja de 50 de lealtad) pero no se
   expande, y sus comarcas salvo la capital se pueden cortejar e incorporar.
2. Nadie puede aprovecharse de un jugador amparado: ni portazgo ni cortejo.
3. El reingreso devuelve el control íntegro, borra la influencia ajena y lo anuncia la crónica.

## 6. Verificación

`npm run verificar`, con `nucleo/pruebas/ausencia.test.ts` (contador, escalones, lealtad con suelo,
cortejo e incorporación en concejo, capital a salvo, reingreso, amparo frente a portazgo y cortejo).

ar la ficha.

## 7. Al terminar

Marca la tarea como `hecha` en `00-indice.md`, actualiza `ESTADO.md` (siguiente tarea y bitácora) y
haz commit con `T-105: <resumen>`.
