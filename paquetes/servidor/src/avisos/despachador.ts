// El despachador de correos (ficha T-064 §4.3 y §4.4): agrupa los avisos pendientes por jugador y
// partida, respeta la preferencia, manda uno solo y reintenta con espera creciente si falla.
import type { IdJugador, IdPartida } from '@conquer/nucleo';

import type { EnviadorDeCorreo } from '../cuentas/correo.ts';
import type { AvisoPendiente, ClaveDeAviso, RepositorioDeAvisos } from '../persistencia/avisos.ts';
import type { Repositorio } from '../persistencia/repositorio.ts';
import type { Registro } from '../reloj/registro.ts';
import { modoPorDefecto } from './preferencias.ts';
import { asuntoDelAviso, cronicaEnTexto } from './texto.ts';

const MINUTO_MS = 60_000;
const DIA_MS = 24 * 60 * MINUTO_MS;
/** Lo que se aparta un aviso reclamado: si el proceso muere enviandolo, se reintenta pasado este rato. */
const RESERVA_MS = 10 * MINUTO_MS;
const ESPERA_MAXIMA_MS = 6 * 60 * MINUTO_MS;
export const INTENTOS_MAXIMOS = 8;

export interface DependenciasDelDespachador {
  readonly repo: Repositorio & RepositorioDeAvisos;
  readonly correo: EnviadorDeCorreo;
  readonly registro: Registro;
  readonly ahora: () => number;
}

export interface InformeDeDespacho {
  readonly enviados: number;
  readonly descartados: number;
  readonly fallidos: number;
  readonly reintentos: number;
}

/** Espera antes del intento siguiente: 2^intentos minutos, hasta 6 horas. */
export function esperaTrasFallo(intentos: number): number {
  return Math.min(2 ** intentos * MINUTO_MS, ESPERA_MAXIMA_MS);
}

function clave(a: ClaveDeAviso): ClaveDeAviso {
  return { partida: a.partida, turno: a.turno, jugador: a.jugador };
}

export class DespachadorDeCorreos {
  constructor(private readonly dep: DependenciasDelDespachador) {}

  async pasada(): Promise<InformeDeDespacho> {
    const { repo } = this.dep;
    const ahora = this.dep.ahora();
    const grupos = new Map<string, AvisoPendiente[]>();
    for (const aviso of await repo.avisosPendientes(ahora)) {
      const k = `${aviso.partida}|${aviso.jugador}`;
      grupos.set(k, [...(grupos.get(k) ?? []), aviso]);
    }
    const informe = { enviados: 0, descartados: 0, fallidos: 0, reintentos: 0 };
    for (const grupo of grupos.values()) {
      const primero = grupo[0];
      if (primero === undefined) continue;
      const { partida, jugador } = primero;
      const modo =
        (await repo.preferencia(partida, jugador)) ?? modoPorDefecto(primero.intervaloSegundos);
      if (modo === 'nada') {
        await repo.marcarAvisos(grupo.map(clave), 'descartado', ahora);
        informe.descartados += grupo.length;
        continue;
      }
      if (modo === 'diario') {
        const desde =
          (await repo.ultimoEnvio(partida, jugador)) ?? Math.min(...grupo.map((a) => a.creadoEn));
        if (ahora - desde < DIA_MS) continue;
      }
      const reclamados = await repo.reclamarAvisos(grupo.map(clave), ahora + RESERVA_MS, ahora);
      if (reclamados.length === 0) continue;
      const resultado = await this.mandar(partida, jugador, grupo, reclamados, ahora);
      informe[resultado] += resultado === 'enviados' ? 1 : reclamados.length;
    }
    return informe;
  }

  private async mandar(
    partida: IdPartida,
    jugador: IdJugador,
    grupo: readonly AvisoPendiente[],
    reclamados: readonly ClaveDeAviso[],
    ahora: number,
  ): Promise<'enviados' | 'fallidos' | 'reintentos'> {
    const { repo, registro } = this.dep;
    const primero = grupo[0];
    if (primero === undefined) return 'reintentos';
    const turnos = reclamados.map((r) => r.turno).sort((a, b) => a - b);
    const textos: string[] = [];
    for (const turno of turnos) {
      const cronica = await repo.cronica(partida, turno, jugador);
      if (cronica !== null) textos.push(cronicaEnTexto(cronica));
    }
    try {
      await this.dep.correo.enviarAviso({
        para: primero.correo,
        asunto: asuntoDelAviso(primero.nombrePartida, turnos),
        texto: textos.join('\n\n————————\n\n'),
      });
      await repo.marcarAvisos(reclamados, 'enviado', this.dep.ahora());
      registro.anotar('info', 'aviso-enviado', { partida, jugador, turnos: turnos.length });
      return 'enviados';
    } catch (error) {
      const intentos = Math.max(...grupo.map((a) => a.intentos)) + 1;
      const detalle = error instanceof Error ? error.message : 'error desconocido';
      if (intentos >= INTENTOS_MAXIMOS) {
        await repo.marcarAvisos(reclamados, 'fallido', ahora);
        registro.anotar('error', 'aviso-fallido', { partida, jugador, intentos, detalle });
        return 'fallidos';
      }
      await repo.reprogramarAvisos(reclamados, intentos, ahora + esperaTrasFallo(intentos));
      registro.anotar('aviso', 'aviso-reintento', { partida, jugador, intentos, detalle });
      return 'reintentos';
    }
  }
}
