// Fase 11 · Prestigio y hitos (docs/06-competicion.md §6.3; ficha T-043).
//
// En este orden, y por que:
// 1. Se apunta en el registro de cada jugador lo que este turno ha dejado hecho y que despues no se
//    podria deducir del estado: obras terminadas, anyos trashumantes, ferias, perdidas, escasez y
//    despensa. Se lee de los sucesos de las fases anteriores.
// 2. Hitos y primicias, con el prestigio medido con los hitos que ya se tenian.
// 3. Recuento: el prestigio se recalcula entero, ya con los hitos nuevos, y se guarda el total.
// 4. Clasificacion.
// 5. Tradiciones: Fama y Linaje se abren por prestigio, asi que van despues del recuento.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { turnoDelAnyo } from '../reglas/calendario.ts';
import { clasificar } from '../reglas/clasificacion.ts';
import type { AspiranteAPrimicia } from '../reglas/hitos.ts';
import { ganadorDePrimicia, hitosNuevos } from '../reglas/hitos.ts';
import { prestigioDe } from '../reglas/prestigio.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { EstadoJugador, RegistroDeJugador } from '../tipos/estado.ts';
import type { Hito } from '../tipos/reglas.ts';
import { HITOS, esTipoDeObraMayor } from '../tipos/reglas.ts';
import { idsEnOrden } from '../utiles/orden.ts';
import { tradiciones } from './11-tradiciones.ts';

export function fasePrestigio(ctx: Contexto): void {
  for (const jugador of jugadores(ctx)) apuntarElTurno(ctx, jugador);
  hitosYPrimicias(ctx);
  recuento(ctx);
  aplicar(ctx, { tipo: 'clasificacion', puestos: clasificar(ctx.estado, ctx.reglas) });
  tradiciones(ctx);
}

function jugadores(ctx: Contexto): EstadoJugador[] {
  return idsEnOrden(ctx.estado.jugadores).flatMap((id) => {
    const jugador = ctx.estado.jugadores[id];
    return jugador === undefined ? [] : [jugador];
  });
}

/** Los sucesos del turno de un jugador y un tipo. */
function delTurno(ctx: Contexto, jugador: EstadoJugador, tipo: string) {
  return ctx.sucesos.filter((s) => s.tipo === tipo && s.jugador === jugador.id);
}

const numero = (valor: number | string | undefined): number =>
  typeof valor === 'number' ? valor : 0;

function apuntarElTurno(ctx: Contexto, jugador: EstadoJugador): void {
  const t = ctx.reglas.prestigio;
  const antes = jugador.registro;

  const obrasMayores = { ...antes.obrasMayores };
  for (const suceso of delTurno(ctx, jugador, 'hito.obra-mayor')) {
    const obra = String(suceso.datos['obra']);
    if (esTipoDeObraMayor(obra)) obrasMayores[obra] = (obrasMayores[obra] ?? 0) + 1;
  }

  const anyosTrashumantes =
    antes.anyosTrashumantes +
    delTurno(ctx, jugador, 'rebanyo.esquileo').filter(
      (s) => numero(s.datos['calidadMil']) >= t.calidadDeAnyoTrashumanteMil,
    ).length;

  // El volumen de feria se cuenta por anyo: el primer turno del anyo empieza de cero.
  const volumenEnFerias: Record<string, number> =
    turnoDelAnyo(ctx.turno) === 1 ? {} : { ...antes.volumenEnFerias };
  let feriasDestacadas = antes.feriasDestacadas;
  const tratos = delTurno(ctx, jugador, 'mercado.trato').filter((s) =>
    String(s.datos['mercado']).startsWith('feria-'),
  );
  const tocadas = new Set<string>();
  const previo = new Map<string, number>();
  for (const trato of tratos) {
    const feria = String(trato.datos['mercado']);
    if (!previo.has(feria)) previo.set(feria, volumenEnFerias[feria] ?? 0);
    volumenEnFerias[feria] = (volumenEnFerias[feria] ?? 0) + numero(trato.datos['importe']);
    tocadas.add(feria);
  }
  for (const feria of tocadas) {
    const umbral = t.volumenDeFeriaDestacada;
    if ((previo.get(feria) ?? 0) < umbral && (volumenEnFerias[feria] ?? 0) >= umbral) {
      feriasDestacadas += 1;
    }
  }

  const balanceDePan = delTurno(ctx, jugador, 'almacen.cambio')
    .filter((s) => s.datos['recurso'] === 'pan')
    .reduce((total, s) => total + numero(s.datos['delta']), 0);
  const despensaEstable = balanceDePan >= 0 && jugador.almacen.pan >= t.reservaDeDespensaEstable;

  const registro: RegistroDeJugador = {
    obrasMayores,
    anyosTrashumantes,
    feriasDestacadas,
    volumenEnFerias,
    comarcasPerdidas:
      antes.comarcasPerdidas + delTurno(ctx, jugador, 'comarca.vuelve-neutral').length,
    turnosConEscasez: antes.turnosConEscasez + (jugador.escasez ? 1 : 0),
    turnosDeDespensaEstable: despensaEstable ? antes.turnosDeDespensaEstable + 1 : 0,
  };
  aplicar(ctx, { tipo: 'registro', jugador: jugador.id, registro });
}

function hitosYPrimicias(ctx: Contexto): void {
  const logrados = new Map<Hito, AspiranteAPrimicia[]>();
  for (const jugador of jugadores(ctx)) {
    const mejorEsquileoMil = Math.max(
      0,
      ...delTurno(ctx, jugador, 'rebanyo.esquileo').map((s) => numero(s.datos['calidadMil'])),
    );
    const prestigio = prestigioDe(ctx.estado, jugador, ctx.reglas).total;
    for (const hito of hitosNuevos(
      ctx.estado,
      jugador,
      { mejorEsquileoMil, prestigio },
      ctx.reglas,
    )) {
      aplicar(ctx, { tipo: 'hito', jugador: jugador.id, hito });
      // El merito de la primicia es el prestigio con que se empezo el turno: el recuento va despues.
      logrados.set(hito, [
        ...(logrados.get(hito) ?? []),
        { jugador: jugador.id, prestigio: jugador.prestigio },
      ]);
    }
  }
  for (const hito of HITOS) {
    const aspirantes = logrados.get(hito);
    if (aspirantes === undefined || ctx.estado.primicias[hito] !== undefined) continue;
    const ganador = ganadorDePrimicia(aspirantes, hito, ctx.semilla, ctx.turno);
    if (ganador !== null) aplicar(ctx, { tipo: 'primicia', jugador: ganador, hito });
  }
}

function recuento(ctx: Contexto): void {
  for (const jugador of jugadores(ctx)) {
    const prestigio = prestigioDe(ctx.estado, jugador, ctx.reglas);
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      'prestigio.desglose',
      { ...prestigio.capitulos, penalizaciones: prestigio.penalizaciones, total: prestigio.total },
      { jugador: jugador.id },
    );
    const delta = prestigio.total - jugador.prestigio;
    if (delta !== 0) {
      aplicar(ctx, { tipo: 'prestigio', jugador: jugador.id, delta, motivo: 'recuento' });
    }
  }
}
