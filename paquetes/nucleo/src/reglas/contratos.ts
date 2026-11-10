// Los contratos entre jugadores (ficha T-103 §3): quien hace que en cada tipo, y lo que se mira para
// firmar. Funciones puras; la fase 07 · contratos las aplica.
import type { Contrato, ContratoPaso } from '../tipos/contratos.ts';
import type { EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { IdJugador } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import { RECURSOS, recursosSegun } from '../tipos/recursos.ts';
import type { Recurso, Recursos } from '../tipos/recursos.ts';
import { OBRAS_MAYORES_DE_TRAMO } from '../tipos/reglas.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { idsEnOrden } from '../utiles/orden.ts';
import {
  modificadoresDelJugador,
  permisosDelJugador,
  prohibicionesDelJugador,
} from './casas/index.ts';
import { cuadrillasLibres } from './cuadrillas.ts';
import { impedimentoDeObraMayor } from './obras.ts';
import type { MotivoSinObraMayor } from './obras.ts';

/** La otra parte de un contrato. */
export function otraParte(contrato: Contrato, jugador: IdJugador): IdJugador {
  return contrato.propone === jugador ? contrato.recibe : contrato.propone;
}

/** La parte que hace algo distinto de pagar: entrega, presta, vende, construye o concede. */
export function parteActiva(contrato: Contrato): IdJugador {
  switch (contrato.tipo) {
    case 'entrega':
      return contrato.entrega;
    case 'prestamo':
      return contrato.presta;
    case 'aperos':
      return contrato.vende;
    case 'obra':
      return contrato.construye;
    case 'paso':
      return contrato.concede;
    case 'no-agresion':
    case 'no-cortejo':
    case 'exclusiva':
      return contrato.compromete;
  }
}

/** La parte que paga (o recibe el prestamo): la otra. */
export function partePasiva(contrato: Contrato): IdJugador {
  return otraParte(contrato, parteActiva(contrato));
}

/** Tiene poco credito: paga por adelantado, no pide prestado y su influencia vale menos. */
export function tienePocoCredito(jugador: EstadoJugador, reglas: TablasDeReglas): boolean {
  return jugador.credito < reglas.contratos.creditoBajo;
}

/** Los contratos de la partida, en orden de identificador. */
export function contratosEnOrden(estado: EstadoPartida): Contrato[] {
  const contratos = estado.contratos ?? {};
  return idsEnOrden(contratos).flatMap((id) => {
    const contrato = contratos[id];
    return contrato === undefined ? [] : [contrato];
  });
}

/** Hay un contrato de paso vigente: los rebanyos de `jugador` entran en tierra de `concede`. */
export function tienePasoEn(
  contratos: readonly Contrato[],
  concede: IdJugador,
  jugador: IdJugador,
): boolean {
  return contratos.some(
    (c): c is ContratoPaso =>
      c.tipo === 'paso' &&
      c.estado === 'vigente' &&
      c.concede === concede &&
      otraParte(c, concede) === jugador,
  );
}

/** Por que un contrato no se firma, se rechaza o se incumple (ademas de los de la obra mayor). */
export type MotivoDeContrato =
  | 'casa-desconocida'
  | 'comarca-ajena'
  | 'sin-fondos'
  | 'poco-credito'
  | 'sin-permiso'
  | 'nivel-maximo'
  | 'sin-recursos'
  | 'cliente-sin-catedral'
  | 'sin-cuadrilla'
  | 'contrato-rechazado'
  | 'sin-entrega'
  | 'obra-sin-terminar'
  | 'obra-perdida'
  | 'sin-respuesta'
  | 'demasiados-acuerdos'
  | 'demasiadas-comarcas'
  | 'acuerdo-roto';

/** Lo que el jugador tiene libre de un recurso, sin lo reservado para sus ordenes. */
export function libre(jugador: EstadoJugador, recurso: Recurso): number {
  return Math.max(0, jugador.almacen[recurso] - jugador.reservado[recurso]);
}

/** Lo que pone el ferron por un contrato de aperos: el coste de un nivel por cada nivel. */
export function costeDeAperosPorContrato(niveles: number, reglas: TablasDeReglas): Recursos {
  return recursosSegun((r) => reglas.obras.costeAperos[r] * niveles);
}

/**
 * Por que no se puede firmar un contrato que la otra parte acepta, o null si se puede (ficha
 * T-103 §3.3): se mira al firmar, con el estado de ese momento, porque de la propuesta a la firma
 * pueden cambiar los fondos, las comarcas y el credito.
 */
export function impedimentoDeFirma(
  contrato: Contrato,
  estado: EstadoPartida,
  mundo: Mundo,
  reglas: TablasDeReglas,
): MotivoDeContrato | MotivoSinObraMayor | null {
  const activa = estado.jugadores[parteActiva(contrato)];
  const pasiva = estado.jugadores[partePasiva(contrato)];
  if (activa === undefined || pasiva === undefined) return 'casa-desconocida';
  switch (contrato.tipo) {
    case 'entrega': {
      if (estado.comarcas[contrato.comarca]?.duenyo !== pasiva.id) return 'comarca-ajena';
      // Quien tiene poco credito paga al firmar: tiene que tenerlo ya.
      const adelantado = tienePocoCredito(pasiva, reglas);
      return adelantado && libre(pasiva, 'maravedis') < contrato.precio ? 'sin-fondos' : null;
    }
    case 'prestamo':
      if (tienePocoCredito(pasiva, reglas) && !permisosDelJugador(activa, reglas).banca)
        return 'poco-credito';
      return libre(activa, 'maravedis') < contrato.cantidad ? 'sin-fondos' : null;
    case 'aperos': {
      if (!permisosDelJugador(activa, reglas).venderAperos) return 'sin-permiso';
      const comarca = estado.comarcas[contrato.comarca];
      if (comarca?.duenyo !== pasiva.id) return 'comarca-ajena';
      if (comarca.aperos + contrato.niveles > modificadoresDelJugador(activa, reglas).aperosMaximo)
        return 'nivel-maximo';
      const coste = costeDeAperosPorContrato(contrato.niveles, reglas);
      if (RECURSOS.some((r) => libre(activa, r) < coste[r])) return 'sin-recursos';
      return libre(pasiva, 'maravedis') < contrato.precio ? 'sin-fondos' : null;
    }
    case 'obra': {
      if (!permisosDelJugador(activa, reglas).obraEnComarcaAjena) return 'sin-permiso';
      const comarca = estado.comarcas[contrato.comarca];
      if (comarca?.duenyo !== pasiva.id) return 'comarca-ajena';
      if (contrato.obra === 'catedral' && prohibicionesDelJugador(pasiva, reglas).catedral)
        return 'cliente-sin-catedral';
      const hacia = OBRAS_MAYORES_DE_TRAMO.includes(contrato.obra) ? contrato.hacia : null;
      const impedimento = impedimentoDeObraMayor(
        contrato.obra,
        { comarca, hacia },
        estado,
        mundo,
        reglas,
      );
      if (impedimento !== null) return impedimento;
      const extra = modificadoresDelJugador(activa, reglas).cuadrillasExtra;
      if (cuadrillasLibres(estado, comarca, reglas, extra) <= 0) return 'sin-cuadrilla';
      return libre(pasiva, 'maravedis') < contrato.precio ? 'sin-fondos' : null;
    }
    case 'paso':
    case 'exclusiva':
      return libre(pasiva, 'maravedis') < contrato.precio ? 'sin-fondos' : null;
    case 'no-agresion': {
      // Nadie se blinda contra todos: como mucho tres a la vez cada casa (T-123).
      const vigentes = (id: IdJugador): number =>
        Object.values(estado.contratos ?? {}).filter(
          (c) =>
            c.tipo === 'no-agresion' &&
            c.estado === 'vigente' &&
            (c.propone === id || c.recibe === id),
        ).length;
      const maximo = reglas.contratos.acuerdosMaximosNoAgresion;
      if (vigentes(activa.id) >= maximo || vigentes(pasiva.id) >= maximo)
        return 'demasiados-acuerdos';
      return libre(pasiva, 'maravedis') < contrato.precio ? 'sin-fondos' : null;
    }
    case 'no-cortejo':
      if (contrato.comarcas.length > reglas.contratos.comarcasMaximasNoCortejo)
        return 'demasiadas-comarcas';
      return libre(pasiva, 'maravedis') < contrato.precio ? 'sin-fondos' : null;
  }
}

/** El acuerdo vigente de no agresion entre las dos casas, si lo hay (T-123). */
export function hayNoAgresion(estado: EstadoPartida, una: IdJugador, otra: IdJugador): boolean {
  return Object.values(estado.contratos ?? {}).some(
    (c) =>
      c.tipo === 'no-agresion' &&
      c.estado === 'vigente' &&
      ((c.propone === una && c.recibe === otra) || (c.propone === otra && c.recibe === una)),
  );
}

/** El jugador se comprometio a no cortejar esa comarca (T-123). */
export function noPuedeCortejar(
  estado: EstadoPartida,
  jugador: IdJugador,
  comarca: string,
): boolean {
  return Object.values(estado.contratos ?? {}).some(
    (c) =>
      c.tipo === 'no-cortejo' &&
      c.estado === 'vigente' &&
      c.compromete === jugador &&
      c.comarcas.some((x) => x === comarca),
  );
}

/** El jugador se comprometio a no vender ese recurso en las plazas (T-123). */
export function tieneExclusiva(
  estado: EstadoPartida,
  jugador: IdJugador,
  recurso: string,
): boolean {
  return Object.values(estado.contratos ?? {}).some(
    (c) =>
      c.tipo === 'exclusiva' &&
      c.estado === 'vigente' &&
      c.compromete === jugador &&
      c.recurso === recurso,
  );
}
