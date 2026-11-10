// Como se gana una comarca neutral (ficha T-088 §2.7): la influencia de hoy frente a la que pide
// incorporarla, cuanto cambia este turno y por que, y que lo aceleraria. La cuenta es la misma
// funcion que usa la fase 8 (`fuentesDeInfluencia`), sobre el estado de antes de resolver y sin el
// comercio del turno, que aun no ha pasado. Solo mira lo propio: recuas, comarcas, mercados y
// caminos del jugador, asi que no revela nada de las demas casas.
import type { EstadoComarca, EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { multiplicarFactores } from '../utiles/enteros.ts';
import { modificadoresDelJugador } from './casas/index.ts';
import { fuentesDeInfluencia } from './influencia.ts';

export interface PartidaDeInfluencia {
  readonly texto: string;
  /** Con signo: lo que suma o resta por turno. */
  readonly puntos: number;
}

export interface ComoGanarLa {
  readonly actual: number;
  /** La influencia que pide la orden `incorporar`. */
  readonly necesaria: number;
  /** La ventaja sobre la segunda casa que pide tambien. */
  readonly ventaja: number;
  /** Lo que cambiara este turno, ya recortado a 0..100 como hace la fase. */
  readonly cambio: number;
  /** De donde sale ese cambio, fuente a fuente; vacio si no se mueve nada. */
  readonly motivos: readonly PartidaDeInfluencia[];
  /** Lo que la haria subir mas deprisa, con lo que sumaria. */
  readonly aceleraria: readonly PartidaDeInfluencia[];
  /** Turnos hasta la necesaria al ritmo de ahora, o null si a este ritmo no se llega. */
  readonly turnosHastaLaNecesaria: number | null;
}

/** El cambio de un turno, recortado a 0..100 una sola vez, como en `influenciaDelTurno`. */
export function cambioRecortado(actual: number, neto: number): number {
  if (neto === 0 || (actual === 0 && neto < 0)) return 0;
  return Math.min(100, Math.max(0, actual + neto)) - actual;
}

export function comoGanarLa(
  comarca: EstadoComarca,
  jugador: EstadoJugador,
  estado: EstadoPartida,
  mundo: Mundo,
  reglas: TablasDeReglas,
): ComoGanarLa {
  const t = reglas.influencia;
  const actividad = { importe: new Map<string, number>(), vaciaronElPan: new Set<string>() };
  // Sin gente propia alli no se sabe si otra casa esta presente: la prevision no lo cuenta (T-101).
  const f = fuentesDeInfluencia({ comarca, jugador, actividad }, estado, mundo, reglas, false);
  const actual = comarca.influencias[jugador.id] ?? 0;
  const cambio = cambioRecortado(actual, f.neto);

  const motivos: PartidaDeInfluencia[] = [
    { texto: 'una recua tuya presente', puntos: f.presencia },
    { texto: 'comarcas tuyas vecinas', puntos: f.vecinas },
    { texto: 'un mercado tuyo en una vecina', puntos: f.mercado },
    { texto: 'el monasterio que levantaste', puntos: f.monasterio },
    { texto: 'un camino mejorado hasta tu tierra', puntos: f.camino },
    {
      texto: 'el concejo, dividido con otra casa presente, se queda la mitad',
      puntos: -f.concejoDividido,
    },
    { texto: 'nadie tuyo está ni comercia allí', puntos: -f.desgaste },
  ].filter((m) => m.puntos !== 0);

  const casaMil = modificadoresDelJugador(jugador, reglas).influenciaMil;
  const escalar = (puntos: number): number => multiplicarFactores(puntos, [casaMil]);
  const ultimo = comarca.ultimoRegalo[jugador.id];
  const regaloListo = ultimo === undefined || estado.turno - ultimo >= t.turnosEntreRegalos;
  const aceleraria: PartidaDeInfluencia[] = [];
  if (!f.presente) {
    aceleraria.push({
      texto: 'una recua presente (y deja de perderse el punto de desgaste)',
      puntos: escalar(t.porPresencia) + f.desgaste,
    });
  }
  if (regaloListo) {
    aceleraria.push({
      texto: `un regalo al concejo, de golpe y una vez cada ${String(t.turnosEntreRegalos)} turnos`,
      puntos: escalar(t.porRegalo),
    });
  }
  if (f.vecinas === 0) {
    aceleraria.push({
      texto: 'una comarca tuya vecina, cada una',
      puntos: escalar(t.porComarcaVecina),
    });
  } else {
    if (f.mercado === 0)
      aceleraria.push({
        texto: 'un mercado en una vecina tuya',
        puntos: escalar(t.porMercadoVecino),
      });
    if (f.camino === 0)
      aceleraria.push({ texto: 'mejorar el camino hasta ella', puntos: escalar(t.porCamino) });
  }
  aceleraria.push({
    texto: `comerciar en sus plazas, cada ${String(t.maravedisPorBloqueDeComercio)} maravedís (y deja de perderse el desgaste)`,
    puntos: escalar(t.porBloqueDeComercio),
  });

  const falta = t.minimaParaIncorporar - actual;
  const turnosHastaLaNecesaria = falta <= 0 ? 0 : cambio > 0 ? Math.ceil(falta / cambio) : null;
  return {
    actual,
    necesaria: t.minimaParaIncorporar,
    ventaja: t.ventajaSobreElSegundo,
    cambio,
    motivos,
    aceleraria,
    turnosHastaLaNecesaria,
  };
}
