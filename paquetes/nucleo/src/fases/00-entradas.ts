// Quien entra en la partida empezada (ficha T-107), lo primero del turno: la orden `entrar` que da
// el servidor se comprueba con el estado de ahora, en orden de identificador, y el que entra recibe
// su capital, su arranque, su alfoz y su amparo. Desde este mismo turno ya juega.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { cancelarOrden, empezarOrden, ordenesVivas } from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { entradaDe, impedimentoDeEntrada } from '../partidas/entrada.ts';
import { comparar } from '../utiles/orden.ts';

export function entradas(ctx: Contexto): void {
  for (const orden of ordenesVivas(ctx, 'entrar')) entrar(ctx, orden);
}

function entrar(ctx: Contexto, orden: OrdenDe<'entrar'>): void {
  const participante = { id: orden.jugador, nombre: orden.nombre, casa: orden.casa };
  const impedimento = impedimentoDeEntrada(
    ctx.estado,
    ctx.mundo,
    ctx.reglas,
    participante,
    orden.comarca,
  );
  if (impedimento !== null) {
    cancelarOrden(ctx, orden, impedimento);
    return;
  }
  const { jugador, arranque } = entradaDe(
    ctx.estado,
    ctx.mundo,
    ctx.reglas,
    participante,
    orden.comarca,
  );
  aplicar(ctx, { tipo: 'jugador-alta', jugador });
  aplicar(ctx, { tipo: 'duenyo', comarca: orden.comarca, jugador: jugador.id });
  const comarca = ctx.estado.comarcas[orden.comarca];
  if (comarca !== undefined && comarca.lealtad < 100) {
    aplicar(ctx, {
      tipo: 'lealtad',
      comarca: orden.comarca,
      delta: 100 - comarca.lealtad,
      motivo: 'llega su señor',
    });
  }
  for (const [edificio, nivel] of Object.entries(arranque.edificios).sort(([a], [b]) =>
    comparar(a, b),
  )) {
    if (nivel > 0)
      aplicar(ctx, { tipo: 'edificio', comarca: orden.comarca, edificio, delta: nivel });
  }
  // Su alfoz, como al fundar (T-094): las vecinas libres empiezan con su influencia.
  for (const vecina of [...(ctx.mundo.vecinos[orden.comarca] ?? [])].sort(comparar)) {
    const otra = ctx.estado.comarcas[vecina];
    if (otra?.duenyo !== null) continue;
    const falta = ctx.reglas.influencia.influenciaDelAlfoz - (otra.influencias[jugador.id] ?? 0);
    if (falta > 0) {
      aplicar(ctx, {
        tipo: 'influencia',
        comarca: vecina,
        jugador: jugador.id,
        delta: falta,
        motivo: 'su alfoz',
      });
    }
  }
  empezarOrden(ctx, orden, 'terminada');
}
