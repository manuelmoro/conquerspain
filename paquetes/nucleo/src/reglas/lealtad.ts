// Lealtad de las comarcas propias (docs/03-economia.md §3.6; ficha T-036 §4.3).
//
// Cada turno se suman las fuentes de la tabla del diseno. La escasez (fase 3), la deuda de
// administracion (fase 3), la catedral y la muralla (fase 6) ya se aplican en su fase.
import type { EstadoComarca, EstadoPartida } from '../tipos/estado.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import type { Milesimas } from '../utiles/enteros.ts';
import { MIL } from '../utiles/enteros.ts';

export interface FuenteDeLealtad {
  readonly motivo:
    | 'fuero'
    | 'mercado'
    | 'obra-mayor-cerca'
    | 'carga-ligera'
    | 'carga-dura'
    | 'lejania'
    | 'abandono';
  readonly delta: number;
}

export interface SituacionDeComarca {
  readonly comarca: EstadoComarca;
  readonly esCapital: boolean;
  readonly jornadasALaCapitalMil: Milesimas;
}

/** Hay una obra mayor en marcha en la comarca o en una vecina. */
function obraMayorCerca(comarca: string, estado: EstadoPartida, mundo: Mundo): boolean {
  const cerca = new Set([comarca, ...(mundo.vecinos[comarca] ?? [])]);
  return Object.values(estado.obras).some(
    (o) => o.tipo === 'obra mayor' && !o.abandonada && cerca.has(o.comarca),
  );
}

/** Nadie se ocupa de ella: ni edificios, ni obras, ni recuas propias paradas alli. */
function abandonada(comarca: EstadoComarca, estado: EstadoPartida): boolean {
  if (Object.values(comarca.edificios).some((nivel) => nivel > 0)) return false;
  if (Object.values(estado.obras).some((o) => o.comarca === comarca.id)) return false;
  return !Object.values(estado.recuas).some(
    (r) =>
      r.jugador === comarca.duenyo &&
      r.situacion.donde === 'comarca' &&
      r.situacion.comarca === comarca.id,
  );
}

/** Las fuentes de lealtad de una comarca propia este turno, sin las que valen cero. */
export function fuentesDeLealtad(
  situacion: SituacionDeComarca,
  estado: EstadoPartida,
  mundo: Mundo,
  reglas: TablasDeReglas,
): FuenteDeLealtad[] {
  const t = reglas.territorio;
  const { comarca } = situacion;
  const fuentes: FuenteDeLealtad[] = [];

  // El fuero sube la lealtad, pero solo hasta su tope: no compra la devocion entera.
  const porFuero = reglas.poblacion.fueros[comarca.fuero].lealtadPorTurno;
  const fuero =
    porFuero > 0
      ? Math.min(porFuero, Math.max(0, t.lealtadMaximaPorFuero - comarca.lealtad))
      : porFuero;
  fuentes.push({ motivo: 'fuero', delta: fuero });
  if ((comarca.edificios['mercado'] ?? 0) > 0) {
    fuentes.push({ motivo: 'mercado', delta: t.lealtadPorMercado });
  }
  if (obraMayorCerca(comarca.id, estado, mundo)) {
    fuentes.push({ motivo: 'obra-mayor-cerca', delta: t.lealtadPorObraMayorCerca });
  }
  if (comarca.cargaFiscal === 'ligera') {
    fuentes.push({ motivo: 'carga-ligera', delta: t.lealtadPorCargaLigera });
  }
  if (comarca.cargaFiscal === 'dura') {
    fuentes.push({ motivo: 'carga-dura', delta: -t.lealtadPorCargaDura });
  }
  if (!situacion.esCapital && situacion.jornadasALaCapitalMil > t.jornadasDeLejania * MIL) {
    fuentes.push({ motivo: 'lejania', delta: -t.lealtadPorLejania });
  }
  if (abandonada(comarca, estado)) {
    fuentes.push({ motivo: 'abandono', delta: -t.lealtadPorAbandono });
  }
  return fuentes.filter((f) => f.delta !== 0);
}

/** La comarca es desleal: no forma recuas y corre su cuenta atras. */
export function esDesleal(comarca: EstadoComarca, reglas: TablasDeReglas): boolean {
  return comarca.lealtad < reglas.territorio.lealtadDesleal;
}
