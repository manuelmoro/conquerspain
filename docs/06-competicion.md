# 06 · Competición y multijugador

Este documento define cómo compiten los jugadores. El orden importa: primero se compite por la
tierra y por los precios; el conflicto armado llega al final y con reglas que impidan que arruine la
partida de nadie.

---

## 6.1 Modos de partida

| Modo | Plazas | Duración | Para qué |
|---|---|---|---|
| **Solitario** | 1 | Abierta | Aprender, probar estrategias, jugar tranquilo. Con mercaderes menores y comarcas neutrales |
| **Vecindad** | 2–4 | Abierta | Partida entre conocidos, sin corte final, con clasificación viva |
| **Temporada** | 6–12 | 240 turnos (10 años) | Competitiva de verdad: al terminar hay clasificación y se cierra |
| **Comarcal** | 2 | 120 turnos | Duelo corto en un mapa reducido |

El mapa de una partida es un **recorte** de la península proporcional al número de jugadores, de
manera que siempre haya tierra que repartirse, pero no tanta que nadie se encuentre nunca.

## 6.2 Influencia: cómo se consigue tierra

Las comarcas neutrales no se toman: se ganan. Cada jugador acumula **influencia** (0–100) en cada
comarca neutral que conoce.

| Fuente | Influencia por turno |
|---|---|
| Recua con cometido «estar presente» | +2 |
| Comarca propia adyacente | +1 (por cada una, máximo +3) |
| Mercado propio en comarca adyacente | +1 |
| Comercio hecho en su mercado local este turno | +1 por cada 50 mrs, máximo +3 |
| Monasterio o iglesia propia en la comarca | +2 |
| Regalo al concejo (orden, 50 mrs) | +5 inmediato, una vez cada 4 turnos |
| Caminos propios que la conectan | +1 |

Y se pierde influencia: −1 por turno sin presencia ni comercio, y −5 si el jugador provoca escasez
ahí (por ejemplo, vaciando su mercado de pan).

**Incorporar** una comarca exige:

1. tener **influencia ≥ 60** y ser el jugador con más influencia, con al menos **15 puntos de
   ventaja** sobre el segundo;
2. tener una comarca propia a una distancia razonable (≤ 6 jornadas por camino conocido);
3. pagar el coste de la orden y esperar sus turnos.

Si dos jugadores piden incorporar la misma comarca el mismo turno, **gana el de más influencia**;
el otro recupera su coste íntegro y su influencia queda intacta. No hay carrera de clics: hay una
carrera de meses de presencia, visible para todos los implicados en la crónica («los canteros llevan
seis quincenas cortejando al concejo de Berlanga»).

### 6.2.1 Comarcas que se van

Una comarca propia con lealtad < 20 durante seis turnos vuelve a neutral conservando la influencia
acumulada de quien la cuidó. Esto abre la puerta a **ganar tierra sin guerra**: si tu vecino
descuida una comarca, puedes cortejarla.

## 6.3 Prestigio: el marcador

El prestigio es la puntuación pública y el criterio de clasificación. Mide **lo que dejas hecho**,
no lo que acumulas en el almacén.

| Concepto | Prestigio |
|---|---|
| Vecino en tu dominio | 1 por cada 5 vecinos |
| Comarca propia | 20, +10 si tiene fuero |
| Obra mayor terminada | 120 (catedral 250, calzada 150) |
| Camino carretero o calzada construida | 15 por tramo |
| Feria con más de 500 mrs de volumen propio en el año | 30 |
| Hito alcanzado el primero de la partida | 50 |
| Comarca explorada | 3 |
| Rebaño que completa un año trashumante | 10 |
| Aperos de nivel 3 o más instalados | 10 por comarca |

Penalizaciones: −20 por comarca perdida por deslealtad; −1 por turno con escasez.

El prestigio es **público**: todos ven la clasificación y el desglose por capítulos. Ver quién sube
por obras y quién por comercio es parte de la información que se juega.

## 6.4 Equidad: reglas que protegen la competición

1. **Ventana de órdenes.** Las órdenes de un turno se aceptan hasta el corte. Da igual si llegan al
   principio o al final: se resuelven juntas.
2. **Nada de reflejos.** No existe ninguna acción que se resuelva por orden de llegada. Los empates
   se deshacen por mérito y luego por hash (ver [02-diseno-nucleo.md](02-diseno-nucleo.md) §2.4.4).
3. **Amparo del novato.** Un jugador nuevo en una partida en curso entra con amparo durante 20
   turnos: nadie puede cortejar sus comarcas ni cobrarle portazgo.
4. **Ausencia protegida.** Si un jugador no da órdenes, el mayordomo mantiene su economía. Su
   dominio no se deshace solo: la lealtad baja despacio y con avisos. Tras 30 turnos sin conectarse,
   su casa pasa a «administración del concejo»: sigue produciendo, deja de expandirse y sus comarcas
   pueden ser cortejadas.
5. **Sin pactos ocultos que el juego no vea.** Los acuerdos entre jugadores que tengan efecto
   mecánico (portazgo, préstamo, contrato de obra) se firman **dentro del juego**, con condiciones
   que el motor puede verificar.
6. **Rendición de cuentas.** Toda partida guarda el registro de órdenes y resoluciones. Cualquier
   turno se puede reproducir y explicar. Si alguien discute un resultado, se enseña la cuenta.

## 6.5 Interacción entre jugadores

### 6.5.1 Comercio directo

Contratos con condiciones verificables: «te entrego 40 de hierro en Soria en el turno 61 y me pagas
600 mrs al recibirlo». El motor ejecuta el contrato; nadie puede incumplir sin que se note. Un
contrato incumplido resta **crédito** (reputación mecánica, visible), y con poco crédito los demás
te exigen pago por adelantado.

### 6.5.2 Portazgos y caminos

Los caminos y ventas son propiedad de quien los construyó. Otro jugador puede usarlos:

- pagando el portazgo que fije el dueño (0–20 mrs por tramo);
- o rodeando, con el coste en jornadas que eso suponga.

Un portazgo abusivo empuja a los demás a abrir una ruta alternativa: el mercado corrige al que se
pasa de listo. Esta es la interacción hostil más sana del juego y llega mucho antes que la guerra.

### 6.5.3 Información

- **Rumores** por ferias y caminos: información fechada y a veces imprecisa.
- **Correo** (tradición de arrieros): vender información a otro jugador, con precio.
- **Emisario**: cometido de recua que, en una comarca ajena, devuelve un informe del dominio vecino
  (población, obras, precios) con dos turnos de retraso. Es visible para el espiado.

### 6.5.4 Diplomacia ligera

Acuerdos con efecto mecánico y duración pactada: paso franco, exclusiva de compra, no cortejar
comarcas concretas. Romper un acuerdo antes de tiempo cuesta crédito y prestigio.

## 6.6 El conflicto, cuando llegue

No entra hasta que las fases anteriores estén equilibradas. Cuando entre, así:

- **Milicia concejil**, no ejércitos: se leva de la población, come pan, y mientras esté levantada la
  comarca produce menos. La guerra **cuesta economía**, que es de lo que trata el juego.
- **Nada de sorpresas**: declarar hostilidad tiene un turno de preaviso público.
- **Objetivos, no aniquilación**: se disputa el control de un paso, una cantera o un mercado. Perder
  una batalla no borra tu dominio.
- **Asedios largos y visibles**, con posibilidad de negociar cada turno.
- **Sin acoso**: no se puede hostigar al mismo jugador más de X turnos seguidos sin alcanzar un
  objetivo; el coste de mantener tropas lejos crece rápido.
- **Bandidaje** como riesgo ambiental (no entre jugadores) en caminos sin ventas ni cercas.

Regla de oro: **un jugador que pierde una guerra debe seguir teniendo una partida que jugar**.

## 6.7 Temporadas y clasificación

- Una temporada dura 240 turnos (diez años de juego). Al terminar:
  - se congela el estado y se publica la clasificación por prestigio;
  - se reconoce el primero de cada capítulo (mayor población, mayor obra, mejor comerciante, mayor
    red de caminos, mejor año trashumante);
  - la partida queda consultable como archivo histórico, con su crónica completa.
- Las partidas abiertas no terminan: siguen con hitos y clasificación viva.

## 6.8 Lo que hay que medir para saber si funciona

Métricas que se recogen en partidas de prueba automatizadas y en partidas reales:

| Métrica | Objetivo |
|---|---|
| Diferencia de prestigio entre el 1.º y la mediana al turno 120 | < 60 % |
| Número de casas distintas entre los tres primeros (en 20 partidas) | ≥ 5 |
| Correlación entre número de conexiones y prestigio final | ≈ 0 |
| Partidas donde alguien abandona antes del turno 60 | < 15 % |
| Comarcas que cambian de dueño por deslealtad | > 0 y < 10 % del total |
| Turnos donde un jugador no tiene ninguna decisión interesante | < 10 % |

La última es la más importante de todas: si un turno no da nada que decidir, algo está mal en el
diseño, no en el jugador.
