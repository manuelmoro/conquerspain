# T-094 · Crecer hacia dentro: niveles sin solar, villas y el alfoz

**Fase:** 5 · Reglas · **Depende de:** T-092, T-093 · **Estado:** hecha (10-11-2026)

## 1. Contexto

Tras jugar, el usuario ve el arranque lento y pesado:

- ampliar un edificio gasta un solar;
- una comarca grande no se distingue de una despoblada;
- las comarcas pegadas a la capital tardan decenas de turnos en ganarse.

Quiere poder hacerse fuerte en su tierra antes de ir a por los vecinos. Además, en su partida, los mercaderes
pasaron hambre muchos turnos y su recua perdió casi todas las acémilas.

## 2. Diseño (decidido por el usuario el 09-11-2026: «hazlo así»)

1. **Ampliar no ocupa solar.** Un solar es un edificio distinto, levantado o en obra; sus niveles van en
   la misma parcela (`solaresOcupados`, `impedimentoDeConstruir`). El límite de los niveles es la gente:
   cada nivel pide sus vecinos (`vecinosPorNivel`) y, sin brazos, todo rinde menos.
2. **Aldea → villa → ciudad** (`rangoDe`):
   - villa a los 120 vecinos (+1 solar), ciudad a los 200 (+2), la misma cifra que ya usaban las obras
     mayores (`vecinosDeCiudad`);
   - sube y baja solo, y la crónica lo cuenta (`comarca.rango`);
   - si baja de rango, lo levantado sigue en pie.
3. **El alfoz:** al fundar la partida, las neutrales vecinas de cada capital empiezan con 65 de
   influencia de esa casa (`influenciaDelAlfoz`), por encima de los 60 que pide incorporar. Se pueden
   incorporar desde el primer turno y son tuyas en tres. Si una vecina toca a dos capitales, ninguna saca
   ventaja.

**Descartado tras medirlo:** encarecer cada nivel un 50 % (y un 25 %). Lo propuse yo para frenar los
niveles, y el banco mostró que ahogaba a las casas que viven de construir: canteros −25 % de prestigio,
monjes −24 %. La gente ya hace de freno.

## 3. Cliente

- **El plano** da una parcela por edificio, con su nivel en una insignia (dorada al máximo). Una
  ampliación en obras sale con andamios, y una pedida, con ⏳.
- **La plaza** se dibuja según el rango: una casa más en la villa, y además muralla en la ciudad. La
  cabecera dice el rango y lo que falta para el siguiente.
- **En un solar libre** solo se ofrecen edificios nuevos; ampliar se hace desde la parcela de cada uno.
- **Textos:** ficha, Ayuda, glosario («Alfoz») y bloqueo «sin solar» dicen la regla nueva.

## 4. Robots del banco (adaptados a la regla)

- **Brazos:** no piden un nivel sin gente para trabajarlo (`sin-brazos`).
- **Ahorro para la obra mayor:** con la capital hecha, solo levantan lo esencial, y lo de comer si falta
  pan (`ahorra-para-obra-mayor`).
- **Compras:** con la capital hecha, el material de la obra va antes que llenar la despensa.
- **Qué obra toca:** de su lista, la primera que ya pueden pagar o la que menos les falta. Antes, un
  monasterio que pide madera bloqueaba la muralla de piedra de los canteros de Toledo.
- **Pruebas de viaje:** comprobaban la vuelta de una expedición como viaje normal, y su partida base se
  quedaba sin destinos cercanos con el alfoz. Se corrigieron.

## 5. Verificación

`npm run verificar` (pruebas de rango, solares, alfoz, aviso de rango, plano y robots) y dos campañas del
banco con la semilla 1492, 200 turnos y 3 repeticiones: `T-094-sin` (alfoz y rangos a cero) y `T-094`.

## 6. Lo que dice el banco

Con la semilla 1492, 200 turnos y 3 repeticiones, `T-094` frente a `T-094-sin`, que es el mismo código con
alfoz y solares por rango a cero:

| Casa | Prestigio | Población | Turnos con hambre |
|---|---|---|---|
| Canteros | +51 % | +227 % | −43 % |
| Hortelanos | +12 % | −1 % | = |
| Salineros | +4 % | −7 % | = |
| Mesta | −1 % | −4 % | +11 % |
| Mercaderes | = | = | = |
| Monjes | −10 % | +8 % | −40 % |
| Arrieros | −11 % | +89 % | +55 % |

- **El primer dominio** llega en el turno 12 o 13, en vez del 43. Es lo que pidió el usuario. La vara del
  equilibrio para ese ritmo pasa de T60–T100 a T8–T40 (`OBJETIVOS.dominioTurnos`, T-047 §5).
- **Arrieros y monjes** pierden un 10 % de prestigio:
  - los arrieros ganan comarcas y gente, pero pasan más hambre y ya no terminan su muralla en 200 turnos;
  - los monjes crecen y comen mejor, pero puntúan algo menos.

  Queda anotado para la revisión del equilibrio, que se reabre tras T-103 (ESTADO, «Lo que T-047 v1 deja
  abierto»).
- **La base `T-094-sin` se evaluó con la vara vieja del dominio:** sirve para comparar cifras, no
  criterios.
