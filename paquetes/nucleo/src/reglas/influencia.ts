// Influencia en las comarcas neutrales (docs/06-competicion.md §6.2; ficha T-038 §4.2).
//
// Funciones puras: dicen de donde sale la influencia de un jugador en una comarca neutral este
// turno y cuanta se pierde. Quien la apunta y en que orden es cosa de la fase 8.
import type { Suceso } from '../tipos/cronica.ts';
import type { EstadoComarca, EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { multiplicarFactores } from '../utiles/enteros.ts';
import { modificadoresDelJugador } from './casas/index.ts';
import { claveDeTramo } from './ruta.ts';
import { estaPresente } from './presencia.ts';

/** Lo que paso en las plazas este turno, por comarca y jugador (clave `comarca|jugador`). */
export interface ActividadDeMercado {
  /** Maravedis comerciados en plazas de la comarca. */
  readonly importe: ReadonlyMap<string, number>;
  /** Jugadores que se quedaron sin pan en una plaza de la comarca por agotar su volumen. */
  readonly vaciaronElPan: ReadonlySet<string>;
}

export function claveDeActividad(comarca: string, jugador: string): string {
  return `${comarca}|${jugador}`;
}

/** Resume los sucesos de la fase 7: quien comercio cuanto y donde, y quien vacio el pan. */
export function actividadDeMercado(sucesos: readonly Suceso[]): ActividadDeMercado {
  const importe = new Map<string, number>();
  const vaciaronElPan = new Set<string>();
  for (const suceso of sucesos) {
    if (suceso.comarca === null || suceso.jugador === null) continue;
    const clave = claveDeActividad(suceso.comarca, suceso.jugador);
    if (suceso.tipo === 'mercado.trato') {
      const cantidad = suceso.datos['importe'];
      if (typeof cantidad === 'number') importe.set(clave, (importe.get(clave) ?? 0) + cantidad);
    } else if (
      suceso.tipo === 'mercado.sin-casar' &&
      suceso.datos['recurso'] === 'pan' &&
      suceso.datos['operacion'] === 'comprar' &&
      suceso.datos['motivo'] === 'volumen-de-plaza'
    ) {
      vaciaronElPan.add(clave);
    }
  }
  return { importe, vaciaronElPan };
}

export interface FuentesDeInfluencia {
  /** Hay una recua presente: cuenta como actividad y para el desempate. */
  readonly presente: boolean;
  readonly presencia: number;
  readonly vecinas: number;
  readonly mercado: number;
  readonly comercio: number;
  readonly monasterio: number;
  readonly camino: number;
  /** Lo que se resta: por turno sin actividad y por vaciar el pan. */
  readonly desgaste: number;
  readonly escasez: number;
  /** Aportes menos desgaste: lo que se suma antes de recortar a 0..100. */
  readonly neto: number;
}

export interface SituacionDeInfluencia {
  readonly comarca: EstadoComarca;
  readonly jugador: EstadoJugador;
  readonly actividad: ActividadDeMercado;
}

/** Las seis fuentes de un turno y el desgaste, sobre una foto del estado (el regalo va aparte). */
export function fuentesDeInfluencia(
  situacion: SituacionDeInfluencia,
  foto: EstadoPartida,
  mundo: Mundo,
  reglas: TablasDeReglas,
): FuentesDeInfluencia {
  const { comarca, jugador, actividad } = situacion;
  const t = reglas.influencia;
  const clave = claveDeActividad(comarca.id, jugador.id);

  const presente = Object.values(foto.recuas).some(
    (recua) =>
      recua.jugador === jugador.id &&
      recua.situacion.donde === 'comarca' &&
      recua.situacion.comarca === comarca.id &&
      estaPresente(recua, comarca),
  );

  const vecinasPropias = (mundo.vecinos[comarca.id] ?? []).filter(
    (vecina) => foto.comarcas[vecina]?.duenyo === jugador.id,
  );
  const importe = actividad.importe.get(clave) ?? 0;

  const presencia = presente ? t.porPresencia : 0;
  const vecinas = Math.min(vecinasPropias.length * t.porComarcaVecina, t.maximoPorComarcasVecinas);
  const mercado = vecinasPropias.some(
    (vecina) => (foto.comarcas[vecina]?.edificios['mercado'] ?? 0) > 0,
  )
    ? t.porMercadoVecino
    : 0;
  const comercio = Math.min(
    Math.floor(importe / t.maravedisPorBloqueDeComercio) * t.porBloqueDeComercio,
    t.maximoPorComercio,
  );
  const monasterio =
    comarca.exDuenyo === jugador.id && comarca.obrasMayores.includes('monasterio')
      ? t.porMonasterio
      : 0;
  const camino = vecinasPropias.some(
    (vecina) => foto.caminos[claveDeTramo(comarca.id, vecina)] !== undefined,
  )
    ? t.porCamino
    : 0;

  const desgaste = !presente && importe === 0 ? t.desgastePorTurno : 0;
  const escasez = actividad.vaciaronElPan.has(clave) ? t.desgastePorEscasez : 0;
  // La casa escala cada fuente por separado, para que el desglose siga sumando lo que se aporta.
  const casaMil = modificadoresDelJugador(jugador, reglas).influenciaMil;
  const escalar = (puntos: number): number => multiplicarFactores(puntos, [casaMil]);
  const fuentes = {
    presencia: escalar(presencia),
    vecinas: escalar(vecinas),
    mercado: escalar(mercado),
    comercio: escalar(comercio),
    monasterio: escalar(monasterio),
    camino: escalar(camino),
  };
  const aportes = Object.values(fuentes).reduce((total, puntos) => total + puntos, 0);
  return {
    presente,
    ...fuentes,
    desgaste,
    escasez,
    neto: aportes - desgaste - escasez,
  };
}
