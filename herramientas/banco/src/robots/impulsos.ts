// Lo que hace cualquier robot, sea de la casa que sea: comer, crecer, explorar, ganar tierra y
// comerciar. Cada casa lo combina con su via (los archivos de cada robot) y lo ajusta con su perfil.
//
// Los impulsos son reglas de prioridad simples y legibles, no una IA: miran el tablero y, si hay
// algo sensato que hacer, lo piden. Todo lo que es obra va a la cola de su comarca y todo lo que es
// de recua a la cola de la recua, como haria un jugador que entra poco: nada reserva hasta empezar.
import {
  costeDeObraMayor,
  costeDeRecua,
  idDeMercadoLocal,
  impedimentoDeConstruir,
  opcionesDeTradicion,
} from '@conquer/nucleo';
import { RONDAS_DE_TRADICION } from '@conquer/nucleo';
import type {
  Casa,
  ComarcaMundo,
  CriterioDeTradicion,
  EstadoComarca,
  IdComarca,
  Orden,
  Recua,
  Recurso,
  TipoEdificio,
  TipoObraMayor,
} from '@conquer/nucleo';

import type { Cantidades, Pedidos } from './pedidos.ts';
import type { PlazaConocida } from './tablero.ts';
import { Tablero } from './tablero.ts';

/** Lo que una recua hace para su casa. Cada robot dice cuantas tiene y en que orden las forma. */
export type Papel = 'explorar' | 'emisario' | 'tratar' | 'feriar' | 'poblar' | 'arbitraje';

/**
 * Edificios con el nivel que se quiere de cada uno, por orden de prioridad, y, si hace falta, la
 * condicion para pedirlo (la carbonera, cuando haya madera para ella y para la ferreria).
 */
export type Plan = readonly (
  readonly [TipoEdificio, number] | readonly [TipoEdificio, number, (t: Tablero) => boolean]
)[];

export interface Perfil {
  readonly casa: Casa;
  readonly nombre: string;
  /**
   * Lo que quiere en la capital, por orden: el primero que falte y quepa va a la cola. Los solares
   * son pocos (cinco o seis), asi que cada plan es la apuesta de la casa.
   */
  readonly capital: Plan;
  /** Lo que quiere en las demas comarcas propias. */
  readonly comarcas: Plan;
  /** Las obras mayores que persigue, por orden. */
  readonly obrasMayores: readonly TipoObraMayor[];
  /** Las recuas que quiere, por orden de formacion. */
  readonly recuas: readonly Papel[];
  /** Lo que vende cuando le sobra, y lo que se guarda de cada cosa. */
  readonly vende: Cantidades;
  /** El material que quiere tener en el almacen: si la tierra no lo da, lo compra. */
  readonly acopio?: Cantidades;
  /** Lo que lleva a las ferias. */
  readonly feria: readonly Recurso[];
  /** Que tradicion prefiere en cada ronda. */
  readonly criterio: CriterioDeTradicion;
  /** Lo que vale una comarca para hacerla suya (mas es mejor). */
  valorDe(geografia: ComarcaMundo): number;
}

/** Turnos de consumo que el robot quiere tener siempre en el granero. */
const TURNOS_DE_DESPENSA = 6;
/** Obras que deja esperando en la cola de cada comarca, como mucho. */
const OBRAS_EN_COLA = 1;
/** Maravedis que no gasta en regalos ni en recuas: son para la administracion. */
const COLCHON_DE_MARAVEDIS = 60;
/** Lo minimo que merece la pena llevar a vender a la plaza de casa. */
const LOTE_MINIMO = 3;
/** Lo minimo que merece la pena llevar a una feria: poco, porque la feria paga mejor. */
const LOTE_DE_FERIA = 2;

/** La cadencia con la que decide el robot: cada turno o como un jugador que entra poco. */
export interface Decision {
  readonly t: Tablero;
  readonly p: Pedidos;
  readonly perfil: Perfil;
  /** Turnos hasta que el robot vuelva a decidir: las ordenes de mercado duran eso. */
  readonly cadencia: number;
}

// ——— Tradiciones ——————————————————————————————————————————————————————————

/** En cada ronda abierta y sin elegir, la tradicion de su criterio. */
export function elegirTradiciones({ t, p, perfil }: Decision): void {
  for (const ronda of RONDAS_DE_TRADICION) {
    if (t.yo.rondas[ronda] === undefined) continue;
    const opciones = opcionesDeTradicion(t.yo.casa, ronda, t.reglas);
    if (opciones.some((id) => t.yo.tradiciones.includes(id))) continue;
    if (t.ordenes.some((o) => o.tipo === 'tradicion')) continue;
    const preferida =
      opciones.find((id) => t.reglas.tradiciones[id]?.criterio === perfil.criterio) ?? opciones[0];
    if (preferida !== undefined) p.tradicion(preferida);
  }
}

// ——— Obras ————————————————————————————————————————————————————————————————

/**
 * Por que no cabria el edificio contando lo que ya espera en la cola y lo que el robot acaba de
 * pedir este turno; null si cabe.
 */
export function impedimentoPrevisto(
  t: Tablero,
  comarca: EstadoComarca,
  edificio: TipoEdificio,
  nuevas: readonly Orden[] = [],
): string | null {
  const geografia = t.geografia(comarca.id);
  if (geografia === null) return 'sin-geografia';
  const previstos: Record<string, number> = {};
  for (const tipo of Object.keys(t.reglas.edificios)) {
    const pedidas = nuevas.filter(
      (o) => o.tipo === 'construir' && o.comarca === comarca.id && o.edificio === tipo,
    ).length;
    const nivel = t.nivelPrevisto(comarca, tipo) + pedidas;
    if (nivel > 0) previstos[tipo] = nivel;
  }
  return impedimentoDeConstruir(
    { ...comarca, edificios: previstos },
    edificio,
    [],
    geografia.solares,
    t.casa,
    t.reglas,
    t.permisos,
  );
}

/** Hay pan de sobra para mas gente: si no, mas casas solo traen hambre. */
function hayPanParaMas(t: Tablero): boolean {
  const vecinosDeUnNivel = t.reglas.poblacion.capacidadPorCasas + t.casa.capacidadPorCasasExtra;
  const masConsumo = Math.ceil((vecinosDeUnNivel * t.reglas.poblacion.consumoPorVecinoMil) / 1000);
  return t.turno === 1 || panDeUnAnyoCorriente(t) >= t.consumoDePan() + masConsumo;
}

/** Obras esperando en la cola de la comarca, contando las que el robot acaba de pedir. */
function enCola(d: Decision, comarca: IdComarca): number {
  const nuevas = d.p.ordenes.filter(
    (o) => (o.tipo === 'construir' || o.tipo === 'aperos') && o.comarca === comarca,
  ).length;
  return d.t.obrasEnCola(comarca) + nuevas;
}

function pedirSiCabe(d: Decision, comarca: EstadoComarca, edificio: TipoEdificio): boolean {
  if (impedimentoPrevisto(d.t, comarca, edificio, d.p.ordenes) !== null) return false;
  if (edificio === 'casas' && !hayPanParaMas(d.t)) return false;
  d.p.construir(comarca.id, edificio);
  return true;
}

const DE_COMER: readonly TipoEdificio[] = ['granja', 'huerta', 'lonja'];

/**
 * El pan de un anyo corriente: lo que dieron las comarcas el turno pasado, sin el factor de su
 * estacion. Asi el invierno no hace creer que falta pan ni el verano que sobra.
 */
function panDeUnAnyoCorriente(t: Tablero): number {
  const e = t.reglas.estaciones;
  const pasado =
    e.estacionPorTurno[(t.calendario.turnoDelAnyo + e.turnosPorAnyo - 2) % e.turnosPorAnyo];
  const factor = pasado === undefined ? 1000 : e.factorPanMil[pasado];
  return Math.floor((t.produccion('pan') * 1000) / Math.max(factor, 1));
}

/** Potencial minimo para que una explotacion de pan merezca un solar. */
const POTENCIAL_QUE_MERECE = 2;

/** Todo lo del plan de la capital esta hecho o pedido. */
function planCumplido(t: Tablero, perfil: Perfil): boolean {
  const sede = t.sede;
  return sede !== null && perfil.capital.every(([e, nivel]) => t.nivelPrevisto(sede, e) >= nivel);
}

/**
 * Si el pan no llega, una explotacion de pan donde la tierra la aproveche. En la capital no le
 * quita el solar al plan de la casa salvo con hambre: alli se compra el pan que falte.
 */
export function alimentar(d: Decision): void {
  const { t, perfil } = d;
  if (t.turno === 1) return;
  const consumo = t.consumoDePan();
  const margen = panDeUnAnyoCorriente(t) - consumo;
  const sobra = t.disponible('pan') >= consumo * TURNOS_DE_DESPENSA;
  if (margen >= 0 || sobra) return;
  const yaPedida = t.ordenes.some(
    (o) => o.tipo === 'construir' && DE_COMER.includes(o.edificio) && o.estado !== 'en curso',
  );
  if (yaPedida) return;
  const capitalLibre = t.yo.escasez || planCumplido(t, perfil);
  for (const comarca of t.propias) {
    if (comarca.id === t.capital && !capitalLibre) continue;
    for (const edificio of DE_COMER) {
      const potencial = t.reglas.edificios[edificio].potencial;
      if (potencial !== null && comarca.potenciales[potencial] < POTENCIAL_QUE_MERECE) continue;
      if (pedirSiCabe(d, comarca, edificio)) return;
    }
  }
}

/** Casas donde la gente ya roza el techo: sin sitio no se crece. */
export function crecer(d: Decision): void {
  const { t } = d;
  for (const comarca of t.propias) {
    if (enCola(d, comarca.id) >= OBRAS_EN_COLA) continue;
    if (comarca.poblacion + 10 < t.capacidad(comarca)) continue;
    if (
      t.ordenes.some(
        (o) =>
          o.tipo === 'construir' &&
          o.comarca === comarca.id &&
          o.edificio === 'casas' &&
          o.estado !== 'en curso',
      )
    ) {
      continue;
    }
    pedirSiCabe(d, comarca, 'casas');
  }
}

/** El plan de edificios de la casa, comarca a comarca, sin llenar las colas de mas. */
export function edificar(d: Decision): void {
  const { t, perfil } = d;
  for (const comarca of t.propias) {
    if (enCola(d, comarca.id) >= OBRAS_EN_COLA) continue;
    const plan = comarca.id === t.capital ? perfil.capital : perfil.comarcas;
    for (const [edificio, nivel, condicion] of plan) {
      if (t.nivelPrevisto(comarca, edificio) >= nivel) continue;
      if (condicion !== undefined && !condicion(t)) break;
      if (pedirSiCabe(d, comarca, edificio)) break;
    }
  }
}

/** La siguiente obra mayor de la casa, en la capital, si no hay otra a medias. */
export function obraMayor(d: Decision): void {
  const { t, p, perfil } = d;
  const sede = t.sede;
  if (sede === null) return;
  const aMedias =
    t.vista.obras.some((o) => o.tipo === 'obra mayor' && !o.abandonada) ||
    t.ordenes.some((o) => o.tipo === 'obra-mayor');
  if (aMedias) return;
  for (const obra of perfil.obrasMayores) {
    for (const comarca of t.propias) {
      if (comarca.obrasMayores.includes(obra)) continue;
      if (!puedeLevantar(t, comarca, obra)) continue;
      // Se pide cuando se puede pagar: esperando en la cola no hace nada y confunde al que la lee.
      if (!p.alcanza(costeDeObraMayor(obra, t.casa, t.reglas))) return;
      p.obraMayor(comarca.id, obra);
      return;
    }
  }
}

/** Lo que el robot sabe de si una obra mayor cabe en una comarca propia (el motor lo confirma). */
function puedeLevantar(t: Tablero, comarca: EstadoComarca, obra: TipoObraMayor): boolean {
  const geografia = t.geografia(comarca.id);
  if (geografia === null) return false;
  switch (obra) {
    case 'monasterio':
      return comarca.lealtad >= t.reglas.obras.lealtadParaMonasterio;
    case 'muralla':
      return true;
    case 'atarazana':
      return geografia.terreno === 'costa';
    case 'acequia-mayor':
      return geografia.terreno === 'vega' && geografia.rasgos.includes('vega-fluvial');
    case 'catedral':
      return (
        !t.prohibiciones.catedral &&
        comarca.obrasMayores.includes('muralla') &&
        comarca.poblacion >= t.reglas.obras.vecinosDeCiudad &&
        geografia.rasgos.includes('ciudad-episcopal') &&
        (comarca.edificios['cantera'] ?? 0) > 0
      );
    case 'puente':
    case 'calzada':
      // Van entre dos comarcas: las pide cada robot que las quiere, con su tramo.
      return false;
  }
}

// ——— Recuas ———————————————————————————————————————————————————————————————

/**
 * Forma la siguiente recua de su lista si hay con que y la gente de la capital lo aguanta. El
 * tratante se forma aunque falte pan: es quien lo compra.
 */
export function formarRecuas(d: Decision): void {
  const { t, p, perfil } = d;
  const sede = t.sede;
  const papel = perfil.recuas[t.recuas.length];
  if (sede === null || papel === undefined) return;
  if (t.ordenes.some((o) => o.tipo === 'formar-recua')) return;
  const comprador = papel === 'tratar' && (sede.edificios['mercado'] ?? 0) > 0;
  if (sede.poblacion < (comprador ? 10 : 40)) return;
  const coste = costeDeRecua(t.casa, t.reglas);
  const holgado = !t.yo.escasez && t.disponible('pan') >= coste.pan + t.consumoDePan() * 2;
  if (!comprador && !holgado) return;
  if (!p.alcanza(coste)) return;
  p.formarRecua(sede.id);
}

/** El papel de cada recua: por orden de antiguedad, el de la lista del perfil. */
export function papelDe(t: Tablero, perfil: Perfil, recua: Recua): Papel | null {
  const indice = t.recuas.findIndex((r) => r.id === recua.id);
  return perfil.recuas[indice] ?? null;
}

/**
 * Pan que saca de su carga una recua para ir y volver a `jornadas` de casa, con un poco de sobra.
 * El primer turno sale de comarca propia y come del almacen (docs/03 §3.7.1): solo lo demas va a
 * cuenta de la carga.
 */
export function panDeViaje(t: Tablero, jornadas: number): number {
  const m = t.reglas.movimiento;
  const fuera = Math.max(0, 2 * jornadas - Math.floor(m.pasoBaseMil / 1000));
  return fuera * m.bastimentoPorJornada + 2;
}

/** Sal que pide el verano para ese viaje. */
function salDeViaje(t: Tablero, jornadas: number): number {
  if (t.calendario.estacion !== 'verano') return 0;
  return Math.ceil((2 * jornadas) / t.reglas.movimiento.jornadasPorSalEnVerano);
}

/** Lo que se quiere tener de un material para las obras, como poco. */
const MATERIAL_MINIMO = 30;
const MATERIALES: readonly Recurso[] = ['madera', 'piedra'];

/** Lo que pide de un material la primera obra mayor que la casa persigue y aun no tiene. */
function materialDeLaSiguienteObra(t: Tablero, perfil: Perfil, recurso: Recurso): number {
  const hechas = new Set(t.propias.flatMap((c) => c.obrasMayores));
  const siguiente = perfil.obrasMayores.find((obra) => !hechas.has(obra));
  return siguiente === undefined ? 0 : costeDeObraMayor(siguiente, t.casa, t.reglas)[recurso];
}

/** Lo que pide de un material la obra mas cara de las que esperan en la cola. */
function materialDeLaCola(t: Tablero, recurso: Recurso): number {
  return Math.max(
    0,
    ...t.ordenes.filter((o) => o.estado === 'en cola').map((o) => o.coste[recurso]),
  );
}

/** El material que falta para las obras y que la tierra no da: se compra en la plaza. */
function materialQueFalta(t: Tablero, perfil: Perfil): Recurso | null {
  for (const recurso of MATERIALES) {
    const objetivo = Math.max(
      MATERIAL_MINIMO,
      perfil.acopio?.[recurso] ?? 0,
      materialDeLaSiguienteObra(t, perfil, recurso),
      materialDeLaCola(t, recurso),
    );
    const insuficiente = t.produccion(recurso) <= t.consumoDe(recurso);
    if (insuficiente && t.disponible(recurso) < objetivo) return recurso;
  }
  return null;
}

/** Lo que lleva una recua, salvo lo que se quiere quedar: para descargarlo en casa. */
function todoMenos(recua: Recua, quedarse: readonly Recurso[]): Cantidades {
  const fuera: Partial<Record<Recurso, number>> = {};
  for (const [recurso, cantidad] of Object.entries(recua.carga) as [Recurso, number][]) {
    if (cantidad > 0 && !quedarse.includes(recurso)) fuera[recurso] = cantidad;
  }
  return fuera;
}

/** Vuelve a la capital a descargar. */
export function volverACasa(d: Decision, recua: Recua): void {
  const { t, p } = d;
  if (Tablero.donde(recua) !== t.capital) p.ir(recua.id, t.capital);
  p.carga(recua.id, {}, todoMenos(recua, ['pan', 'sal']));
}

/** Las recuas hacen lo suyo: cada papel tiene su rutina, y solo se mira la recua que esta libre. */
export function moverRecuas(d: Decision, rutinas: Partial<Record<Papel, Rutina>> = {}): void {
  const { t, perfil } = d;
  for (const recua of t.recuas) {
    if (!t.libre(recua)) continue;
    const papel = papelDe(t, perfil, recua);
    if (papel === null) continue;
    const rutina = rutinas[papel] ?? RUTINAS[papel];
    rutina(d, recua);
  }
}

export type Rutina = (d: Decision, recua: Recua) => void;

/**
 * La comarca oida mas cercana a la que la recua llega con su porte lleno de pan. La vuelta puede
 * acabar malviviendo (docs/03 §3.7.1): un jugador tambien lo aceptaria, porque sin explorar no hay
 * partida.
 */
function siguienteAExplorar(t: Tablero, recua: Recua): { id: IdComarca; jornadas: number } | null {
  const distancias = t.jornadasDesdeLoPropio();
  let mejor: { id: IdComarca; jornadas: number } | null = null;
  for (const [id, jornadas] of distancias) {
    if (t.nivel(id) !== 'oida') continue;
    if (panDeIda(t, jornadas) > recua.porte) continue;
    if (mejor === null || jornadas < mejor.jornadas) mejor = { id, jornadas };
  }
  return mejor;
}

/** Explorar: la oida mas cercana, con todo el pan que quepa. */
const explorar: Rutina = (d, recua) => {
  const { t, p } = d;
  const destino = siguienteAExplorar(t, recua);
  const enCasa = t.esPropia(Tablero.donde(recua));
  if (destino === null) {
    if (!enCasa) volverACasa(d, recua);
    return;
  }
  if (!enCasa && recua.carga.pan < panDeIda(t, destino.jornadas)) {
    volverACasa(d, recua);
    return;
  }
  if (enCasa) {
    const pan = recua.porte - recua.carga.pan - recua.carga.sal;
    const sal = Math.max(
      0,
      Math.min(salDeViaje(t, destino.jornadas), t.disponible('sal')) - recua.carga.sal,
    );
    if (t.disponible('pan') < pan + t.consumoDePan() * 2) return;
    if (pan > 0 || sal > 0) {
      p.carga(
        recua.id,
        { pan: Math.max(0, pan - sal), ...(sal > 0 ? { sal } : {}) },
        todoMenos(recua, ['pan', 'sal']),
      );
    }
  }
  p.ir(recua.id, destino.id);
  p.cometido(recua.id, 'explorar');
};

/**
 * Se puede crecer si el pan de un anyo corriente da para la gente que traeria la comarca, si no hay
 * escasez ni deuda de administracion y si ninguna comarca propia esta a punto de irse.
 */
function puedeCrecer(t: Tablero, vecinos: number): boolean {
  if (t.yo.escasez || t.yo.deudaAdministracion > 0) return false;
  if (t.propias.some((c) => c.lealtad < LEALTAD_PREOCUPANTE)) return false;
  const consumoNuevo = Math.ceil((vecinos * t.reglas.poblacion.consumoPorVecinoMil) / 1000);
  const sobra = panDeUnAnyoCorriente(t) - t.consumoDePan();
  const despensa =
    t.disponible('pan') >= (t.consumoDePan() + consumoNuevo) * TURNOS_DE_DESPENSA * 2;
  // Quien compra su pan en la plaza de casa crece si tiene con que pagar un anyo de pan a la gente
  // nueva: es la via de la Mesta y de los mercaderes.
  const compra = (t.sede?.edificios['mercado'] ?? 0) > 0;
  const anyoDePan = Math.ceil(
    (consumoNuevo * t.reglas.estaciones.turnosPorAnyo * t.reglas.recursos.pan.precioBaseMil) / 1000,
  );
  const bolsa = compra && t.disponible('maravedis') >= anyoDePan + COLCHON_DE_MARAVEDIS;
  return sobra >= consumoNuevo || despensa || bolsa;
}

/** Lo que suma a una comarca acercar lo propio a una feria, para la casa que vive de feriar. */
const VALOR_DE_ACERCARSE_A_FERIA = 6;

/** Jornadas desde una comarca a la feria conocida mas cercana. */
function jornadasAFeria(t: Tablero, desde: IdComarca, ferias: readonly IdComarca[]): number {
  const distancias = t.jornadasDesde(desde);
  return Math.min(...ferias.map((f) => distancias.get(f) ?? Number.POSITIVE_INFINITY));
}

/** La mejor comarca neutral para hacerla propia: explorada, vecina de lo propio y cerca. */
export function objetivoDeTierra(t: Tablero, perfil: Perfil): IdComarca | null {
  const cerca = new Set<string>(t.propias.flatMap((c) => t.vecinas(c.id)));
  const ferias =
    perfil.feria.length === 0
      ? []
      : t
          .plazasConocidas()
          .filter((pl) => pl.tipo === 'feria')
          .map((pl) => pl.comarca);
  const desdeLoPropio = t.jornadasDesdeLoPropio();
  const hastaLaFeria = Math.min(
    ...ferias.map((f) => desdeLoPropio.get(f) ?? Number.POSITIVE_INFINITY),
  );
  let mejor: { id: IdComarca; valor: number } | null = null;
  for (const id of [...cerca].sort()) {
    const sabido = t.explorada(id);
    const geografia = t.geografia(id);
    if (sabido === null || geografia === null || sabido.influenciaPropia === null) continue;
    if (!puedeCrecer(t, sabido.datos?.poblacion ?? geografia.poblacionInicial)) continue;
    const acerca = ferias.length > 0 && jornadasAFeria(t, id as IdComarca, ferias) < hastaLaFeria;
    const valor =
      (perfil.valorDe(geografia) + (acerca ? VALOR_DE_ACERCARSE_A_FERIA : 0)) * 10 +
      sabido.influenciaPropia;
    if (mejor === null || valor > mejor.valor) mejor = { id: id as IdComarca, valor };
  }
  return mejor?.id ?? null;
}

/** El emisario: presencia en la comarca que se quiere, con regalos, hasta poder incorporarla. */
const emisario: Rutina = (d, recua) => {
  const { t, p, perfil } = d;
  const objetivo = objetivoDeTierra(t, perfil);
  const aqui = Tablero.donde(recua);
  if (objetivo === null) {
    if (!t.esPropia(aqui)) volverACasa(d, recua);
    return;
  }
  const distancia = t.jornadasDesde(aqui).get(objetivo) ?? 99;
  if (aqui === objetivo && recua.cometido === 'presencia' && recua.carga.pan >= 2 * distancia + 2) {
    return;
  }
  if (!t.esPropia(aqui)) {
    if (aqui === objetivo && recua.carga.pan >= 4) {
      p.cometido(recua.id, 'presencia');
      return;
    }
    volverACasa(d, recua);
    return;
  }
  const pan = recua.porte - recua.carga.pan - recua.carga.sal;
  if (pan > 0) {
    if (t.disponible('pan') < pan + t.consumoDePan() * TURNOS_DE_DESPENSA) return;
    p.carga(recua.id, { pan }, todoMenos(recua, ['pan', 'sal']));
  }
  p.ir(recua.id, objetivo);
  p.cometido(recua.id, 'presencia');
};

/** Regalos al concejo de la comarca que se quiere, y la incorporacion en cuanto se pueda. */
export function ganarTierra(d: Decision): void {
  const { t, p, perfil } = d;
  const objetivo = objetivoDeTierra(t, perfil);
  if (objetivo === null) return;
  const sabido = t.explorada(objetivo);
  if (sabido === null || sabido.influenciaPropia === null) return;
  const i = t.reglas.influencia;
  const incorporando = t.ordenes.some((o) => o.tipo === 'incorporar' && o.comarca === objetivo);
  if (!incorporando && sabido.influenciaPropia >= i.minimaParaIncorporar) {
    if (p.alcanza(i.costeIncorporar)) p.incorporar(objetivo);
    return;
  }
  const regalo = {
    pan: 0,
    madera: 0,
    piedra: 0,
    maravedis: i.costeRegalo,
    sal: 0,
    hierro: 0,
    lana: 0,
  };
  const sobra =
    t.disponible('maravedis') - p.reservado('maravedis') >= i.costeRegalo + COLCHON_DE_MARAVEDIS;
  const yaPedido = t.ordenes.some((o) => o.tipo === 'regalo');
  if (sobra && !yaPedido && p.alcanza(regalo)) p.regalo(objetivo);
}

// ——— Comercio —————————————————————————————————————————————————————————————

/** Lo que el robot tiene de sobra para vender, lote a lote. */
function sobrante(t: Tablero, perfil: Perfil, recurso: Recurso): number {
  const guarda = perfil.vende[recurso];
  if (guarda === undefined) return 0;
  return Math.max(0, t.disponible(recurso) - guarda);
}

/** Lo que hace falta comprar: el pan que no llega, el material que la tierra no da y la sal. */
function compras(t: Tablero, perfil: Perfil): Recurso[] {
  const falta: Recurso[] = [];
  if (t.disponible('pan') < t.consumoDePan() * TURNOS_DE_DESPENSA) falta.push('pan');
  const material = materialQueFalta(t, perfil);
  if (material !== null) falta.push(material);
  const salNecesaria = t.propias.some((c) => (c.edificios['lonja'] ?? 0) > 0) ? 6 : 0;
  if (t.disponible('sal') < salNecesaria) falta.push('sal');
  return falta;
}

/** El tratante: quieto en la plaza de la capital, vende lo que sobra y compra lo que falta. */
export const rutinaDeTratar: Rutina = (d, recua) => {
  const { t, p, perfil, cadencia } = d;
  const sede = t.sede;
  if (sede === null || (sede.edificios['mercado'] ?? 0) === 0) return;
  if (Tablero.donde(recua) !== sede.id) {
    p.ir(recua.id, sede.id);
    return;
  }
  const plaza = idDeMercadoLocal(sede.id);
  const cargar: Partial<Record<Recurso, number>> = {};
  const ventas: [Recurso, number][] = [];
  let hueco = recua.porte;
  // Lo que puede ir a una feria no se malvende en casa.
  const aLaFeria =
    perfil.recuas.includes('feriar') && feriaAlAlcance(t, recua, LOTE_DE_FERIA) !== null;
  for (const recurso of Object.keys(perfil.vende) as Recurso[]) {
    if (aLaFeria && perfil.feria.includes(recurso)) continue;
    const lote = Math.min(sobrante(t, perfil, recurso), hueco);
    if (lote < LOTE_MINIMO) continue;
    cargar[recurso] = lote;
    ventas.push([recurso, lote]);
    hueco -= lote;
  }
  const faltan = compras(t, perfil);
  const bolsa = Math.min(t.disponible('maravedis') - COLCHON_DE_MARAVEDIS, 120);
  const compra: [Recurso, number, number][] = [];
  if (bolsa >= 10 && faltan.length > 0) {
    const porCosa = Math.floor(bolsa / faltan.length);
    for (const recurso of faltan) {
      const maximo = Math.floor((t.reglas.recursos[recurso].precioBaseMil * 15) / 10);
      const cantidad = Math.min(hueco, Math.floor((porCosa * 1000) / maximo));
      if (cantidad <= 0) continue;
      compra.push([recurso, cantidad, maximo]);
      hueco -= cantidad;
    }
    if (compra.length > 0) cargar.maravedis = bolsa;
  }
  const descargar = todoMenos(recua, []);
  const nada = ventas.length === 0 && compra.length === 0 && Object.keys(descargar).length === 0;
  if (!nada) p.carga(recua.id, cargar, descargar);
  if (recua.cometido !== 'tratar') p.cometido(recua.id, 'tratar');
  for (const [recurso, lote] of ventas) {
    const minimo = Math.floor((t.reglas.recursos[recurso].precioBaseMil * 6) / 10);
    p.mercado(recua.id, plaza, recurso, 'vender', lote, minimo, cadencia);
  }
  for (const [recurso, cantidad, maximo] of compra) {
    p.mercado(recua.id, plaza, recurso, 'comprar', cantidad, maximo, cadencia);
  }
};

/** Pan para llegar a `jornadas` de lo propio: el primer turno lo paga el almacen. */
function panDeIda(t: Tablero, jornadas: number): number {
  const m = t.reglas.movimiento;
  const fuera = Math.max(0, jornadas - Math.floor(m.pasoBaseMil / 1000));
  return fuera * m.bastimentoPorJornada + 2;
}

/**
 * La feria mas cercana a lo propio que la recua alcanza llevando al menos un lote: va con el pan de
 * ida y compra en la feria el de la vuelta con lo que cobre.
 */
export function feriaAlAlcance(
  t: Tablero,
  recua: Recua,
  lote: number,
): { plaza: PlazaConocida; jornadas: number } | null {
  const distancias = t.jornadasDesdeLoPropio();
  let mejor: { plaza: PlazaConocida; jornadas: number } | null = null;
  for (const plaza of t.plazasConocidas()) {
    if (plaza.tipo !== 'feria') continue;
    const jornadas = distancias.get(plaza.comarca);
    if (jornadas === undefined || panDeIda(t, jornadas) + lote > recua.porte) continue;
    if (mejor === null || jornadas < mejor.jornadas) mejor = { plaza, jornadas };
  }
  return mejor;
}

/** En la feria: vende lo que lleva y, cuando ya lo ha vendido, compra el pan de la vuelta. */
function enLaFeria(d: Decision, recua: Recua, plaza: PlazaConocida): void {
  const { t, p, perfil, cadencia } = d;
  const mercancia = perfil.feria.filter((r) => recua.carga[r] > 0);
  if (recua.cometido !== 'tratar') p.cometido(recua.id, 'tratar');
  const turnos = Math.max(cadencia, t.turnosHastaQueAbra(plaza) + 1);
  if (mercancia.length > 0) {
    for (const recurso of mercancia) {
      const minimo = Math.floor((t.reglas.recursos[recurso].precioBaseMil * 6) / 10);
      p.mercado(recua.id, plaza.id, recurso, 'vender', recua.carga[recurso], minimo, turnos);
    }
    return;
  }
  const vuelta = t.jornadasDesdeLoPropio().get(plaza.comarca) ?? 0;
  const falta = panDeViaje(t, vuelta) - recua.carga.pan;
  const maximo = Math.floor((t.reglas.recursos.pan.precioBaseMil * 15) / 10);
  const puede = Math.floor((recua.carga.maravedis * 1000) / maximo);
  if (falta > 0 && puede > 0 && t.turnosHastaQueAbra(plaza) === 0) {
    p.mercado(recua.id, plaza.id, 'pan', 'comprar', Math.min(falta, puede), maximo, 1);
    return;
  }
  volverACasa(d, recua);
}

/** El feriante: lleva lo que la casa produce a la feria mas cercana, lo vende y vuelve. */
const feriar: Rutina = (d, recua) => {
  const { t, p, perfil } = d;
  const aqui = Tablero.donde(recua);
  const feriaAqui = t.plazasConocidas().find((pl) => pl.comarca === aqui && pl.tipo === 'feria');
  const lleva = perfil.feria.some((r) => recua.carga[r] > 0);
  if (feriaAqui !== undefined && (lleva || !t.esPropia(aqui))) {
    enLaFeria(d, recua, feriaAqui);
    return;
  }
  if (!t.esPropia(aqui)) {
    volverACasa(d, recua);
    return;
  }
  const lote = perfil.feria.reduce((total, r) => total + sobrante(t, perfil, r), 0);
  const destino = feriaAlAlcance(t, recua, LOTE_DE_FERIA);
  if (destino === null || lote < LOTE_DE_FERIA) {
    const descargar = todoMenos(recua, ['pan', 'sal']);
    if (Object.keys(descargar).length > 0) p.carga(recua.id, {}, descargar);
    return;
  }
  // Sale cuando llegaria con la feria abierta: tres jornadas por turno.
  const viaje = Math.ceil(destino.jornadas / 3);
  if (t.turnosHastaQueAbra(destino.plaza) > viaje + 1) return;
  const pan = Math.max(0, panDeIda(t, destino.jornadas) - recua.carga.pan);
  const sal = Math.max(
    0,
    Math.min(salDeViaje(t, destino.jornadas), t.disponible('sal')) - recua.carga.sal,
  );
  const cargar: Partial<Record<Recurso, number>> = {
    ...(pan > 0 ? { pan } : {}),
    ...(sal > 0 ? { sal } : {}),
  };
  let hueco = recua.porte - recua.carga.pan - pan - recua.carga.sal - sal;
  for (const recurso of perfil.feria) {
    const cantidad = Math.min(sobrante(t, perfil, recurso), hueco);
    if (cantidad <= 0) continue;
    cargar[recurso] = cantidad;
    hueco -= cantidad;
  }
  p.carga(recua.id, cargar, todoMenos(recua, ['pan', 'sal']));
  if (destino.plaza.comarca !== aqui) p.ir(recua.id, destino.plaza.comarca);
  p.cometido(recua.id, 'tratar');
};

/** Poblar: lleva vecinos de la capital a la comarca que se quiere, para fundar puebla. */
const poblar: Rutina = (d, recua) => {
  const { t, p, perfil } = d;
  const aqui = Tablero.donde(recua);
  const objetivo = objetivoDeTierra(t, perfil);
  const necesarios = Math.max(
    1,
    Math.ceil((t.reglas.cometidos.vecinosParaPuebla * t.casa.vecinosParaPueblaMil) / 1000),
  );
  if (objetivo === null) {
    if (!t.esPropia(aqui)) volverACasa(d, recua);
    return;
  }
  const sabido = t.explorada(objetivo);
  const influencia = sabido?.influenciaPropia ?? 0;
  if (influencia < t.reglas.cometidos.influenciaParaPuebla) return;
  if (!t.esPropia(aqui)) {
    if (aqui === objetivo && recua.vecinos >= necesarios) {
      p.cometido(recua.id, 'poblar');
      return;
    }
    volverACasa(d, recua);
    return;
  }
  const sede = t.sede;
  if (sede === null || sede.poblacion < 50 + necesarios) return;
  const faltan = Math.max(0, necesarios - recua.vecinos);
  const pan = Math.max(0, 6 - recua.carga.pan);
  p.carga(recua.id, pan > 0 ? { pan } : {}, todoMenos(recua, ['pan', 'sal']), faltan);
  p.ir(recua.id, objetivo);
  p.cometido(recua.id, 'poblar');
};

const RUTINAS: Readonly<Record<Papel, Rutina>> = {
  explorar,
  emisario,
  tratar: rutinaDeTratar,
  feriar,
  poblar,
  // El arbitraje es del mercader: sin su rutina, la recua trata en casa.
  arbitraje: rutinaDeTratar,
};

// ——— Gobierno ——————————————————————————————————————————————————————————————

/** Lealtad por debajo de la cual el robot da carta puebla o aligera la carga. */
const LEALTAD_PREOCUPANTE = 45;

/**
 * Donde la lealtad cae, carta puebla (si la comarca no tiene fuero y se puede cambiar) y carga
 * ligera; donde se ha recuperado, carga normal otra vez.
 */
export function gobernar({ t, p }: Decision): void {
  if (t.ordenes.some((o) => o.tipo === 'politica')) return;
  for (const comarca of t.propias) {
    const puedeFuero =
      comarca.fuero === 'ninguno' &&
      t.turno - comarca.turnoFuero >= t.reglas.territorio.turnosEntreCambiosDeFuero;
    if (comarca.lealtad < LEALTAD_PREOCUPANTE) {
      const carga = comarca.cargaFiscal === 'ligera' ? null : 'ligera';
      const fuero = puedeFuero ? 'carta puebla' : null;
      if (carga !== null || fuero !== null) {
        p.politica(comarca.id, fuero, carga);
        return;
      }
    } else if (
      comarca.lealtad >= 70 &&
      comarca.cargaFiscal === 'ligera' &&
      comarca.id !== t.capital
    ) {
      p.politica(comarca.id, null, 'normal');
      return;
    }
  }
}

// ——— El mayordomo ——————————————————————————————————————————————————————————

/**
 * Las reglas de gobierno que deja cualquier robot: carga fiscal ligera en invierno y normal en
 * primavera, en la capital. Es lo que haria a mano cada cambio de estacion un jugador diligente.
 */
export function ponerMayordomo({ t, p }: Decision): void {
  if (t.yo.mayordomo.length > 0 || t.ordenes.some((o) => o.tipo === 'mayordomo')) return;
  p.mayordomo(
    1,
    { tipo: 'estacion-empieza', estacion: 'invierno' },
    { tipo: 'carga-fiscal', comarca: t.capital, carga: 'ligera' },
  );
  p.mayordomo(
    2,
    { tipo: 'estacion-empieza', estacion: 'primavera' },
    { tipo: 'carga-fiscal', comarca: t.capital, carga: 'normal' },
  );
}

// ——— El robot entero ——————————————————————————————————————————————————————

/** El orden de siempre: tradiciones, comer, crecer, lo de la casa, obras, recuas y tierra. */
export function decidirComoSiempre(
  d: Decision,
  via: (d: Decision) => void,
  rutinas: Partial<Record<Papel, Rutina>> = {},
): readonly Orden[] {
  elegirTradiciones(d);
  ponerMayordomo(d);
  alimentar(d);
  via(d);
  edificar(d);
  crecer(d);
  obraMayor(d);
  formarRecuas(d);
  moverRecuas(d, rutinas);
  ganarTierra(d);
  gobernar(d);
  return d.p.ordenes;
}
