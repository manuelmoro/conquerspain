// Lo que hace cualquier robot, sea de la casa que sea: comer, crecer, explorar, ganar tierra y
// comerciar. Cada casa lo combina con su via (los archivos de cada robot) y lo ajusta con su perfil.
//
// Los impulsos son reglas de prioridad simples y legibles, no una IA: miran el tablero y, si hay
// algo sensato que hacer, lo piden. Todo lo que es obra va a la cola de su comarca y todo lo que es
// de recua a la cola de la recua, como haria un jugador que entra poco: nada reserva hasta empezar.
import {
  comparar,
  costeDeEdificio,
  costeDeObraMayor,
  costeDeRecua,
  idDeMercadoLocal,
  impedimentoDeConstruir,
  opcionesDeTradicion,
} from '@conquer/nucleo';
import { RECURSOS, RONDAS_DE_TRADICION } from '@conquer/nucleo';
import type {
  Casa,
  ComarcaMundo,
  CriterioDeTradicion,
  EstadoComarca,
  IdComarca,
  Orden,
  Recua,
  Recurso,
  Recursos,
  TipoEdificio,
  TipoObraMayor,
} from '@conquer/nucleo';

import type { Motivo, Motivos } from './motivos.ts';
import type { Cantidades, Pedidos } from './pedidos.ts';
import { parada } from './pedidos.ts';
import type { PlazaConocida } from './tablero.ts';
import { Tablero } from './tablero.ts';
import type { Parada, Provision, ViajeImposible } from './viaje.ts';
import { leLlega, margenDePan, panDePresencia, preverViaje, provisionPara } from './viaje.ts';

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
  /**
   * Los edificios de la capital sin los que su via no existe: tienen que caber desde el arranque
   * (lo comprueba `solvencia.test.ts`). Lo demas del plan se pide si cabe.
   */
  readonly esenciales: readonly TipoEdificio[];
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
/**
 * Obras que deja esperando en la cola de cada comarca: una por turno hasta la proxima decision. El
 * que entra cada turno pide una cada vez; el que entra cada seis deja seis dichas, que es lo mismo
 * dicho antes. La cola no reserva nada hasta que empieza la obra (T-045).
 */
function obrasEnCola(d: Decision): number {
  return Math.max(1, d.cadencia);
}
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
  /** Por que la via no avanza este turno, para el informe. */
  readonly m: Motivos;
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

/** El nivel que tendra el edificio contando tambien lo que el robot acaba de pedir este turno. */
function nivelPedido(d: Decision, comarca: EstadoComarca, edificio: TipoEdificio): number {
  const nuevas = d.p.ordenes.filter(
    (o) => o.tipo === 'construir' && o.comarca === comarca.id && o.edificio === edificio,
  ).length;
  return d.t.nivelPrevisto(comarca, edificio) + nuevas;
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
  // Una explotacion de pan por turno hasta la proxima decision: el que entra cada seis deja seis
  // dichas en la cola, como el que entra cada dia pide una cada vez.
  for (let k = 0; k < Math.max(1, d.cadencia); k += 1) {
    if (!unaDeComer(d)) return;
  }
}

/** Pide una explotacion de pan si hace falta y cabe; dice si la pidio. */
function unaDeComer(d: Decision): boolean {
  const { t, perfil } = d;
  if (t.turno === 1) return false;
  const consumo = t.consumoDePan();
  const margen = panDeUnAnyoCorriente(t) - consumo;
  const sobra = t.disponible('pan') >= consumo * TURNOS_DE_DESPENSA;
  if (margen >= 0 || sobra) return false;
  const yaPedida = t.ordenes.some(
    (o) => o.tipo === 'construir' && DE_COMER.includes(o.edificio) && o.estado !== 'en curso',
  );
  if (yaPedida) return false;
  const capitalLibre = t.yo.escasez || planCumplido(t, perfil);
  for (const comarca of t.propias) {
    if (comarca.id === t.capital && !capitalLibre) continue;
    for (const edificio of DE_COMER) {
      const potencial = t.reglas.edificios[edificio].potencial;
      if (potencial !== null && comarca.potenciales[potencial] < POTENCIAL_QUE_MERECE) continue;
      if (pedirSiCabe(d, comarca, edificio)) return true;
    }
  }
  return false;
}

/** Casas donde la gente ya roza el techo: sin sitio no se crece. */
export function crecer(d: Decision): void {
  const { t } = d;
  for (const comarca of t.propias) {
    while (enCola(d, comarca.id) < obrasEnCola(d) && unaDeCasas(d, comarca)) continue;
  }
}

/** Una casa mas en la comarca si la gente roza el techo y cabe; dice si la pidio. */
function unaDeCasas(d: Decision, comarca: EstadoComarca): boolean {
  const { t } = d;
  if (comarca.poblacion + 10 < t.capacidad(comarca)) return false;
  const yaPedida = t.ordenes.some(
    (o) =>
      o.tipo === 'construir' &&
      o.comarca === comarca.id &&
      o.edificio === 'casas' &&
      o.estado !== 'en curso',
  );
  if (yaPedida) return false;
  return pedirSiCabe(d, comarca, 'casas');
}

/** El plan de edificios de la casa, comarca a comarca, sin llenar las colas de mas. */
export function edificar(d: Decision): void {
  const { t, perfil } = d;
  if (t.yo.escasez) d.m.anotar('escasez');
  const sede = t.sede;
  const esencialPendiente =
    sede !== null &&
    perfil.esenciales.some(
      (e) => t.nivelPrevisto(sede, e) === 0 && !d.p.alcanza(costeDeEdificio(e, t.casa, t.reglas)),
    );
  if (esencialPendiente) d.m.anotar('esencial-sin-recursos');
  for (const comarca of t.propias) {
    const plan = comarca.id === t.capital ? perfil.capital : perfil.comarcas;
    // Se llena la cola de la comarca hasta la proxima decision: una obra por turno, dichas hoy.
    while (enCola(d, comarca.id) < obrasEnCola(d)) {
      let pedida = false;
      for (const [edificio, nivel, condicion] of plan) {
        if (nivelPedido(d, comarca, edificio) >= nivel) continue;
        if (condicion !== undefined && !condicion(t)) break;
        if (pedirSiCabe(d, comarca, edificio)) pedida = true;
        break;
      }
      if (!pedida) break;
    }
  }
}

/**
 * Un edificio de la capital que no esta en el plan y no puede trabajar: consume algo que la casa ni
 * produce ni tiene para un turno (la lonja sin sal de quien no la saca). Ocupa un solar para nada.
 */
function edificioInutil(t: Tablero, perfil: Perfil, sede: EstadoComarca): TipoEdificio | null {
  const enElPlan = new Set<TipoEdificio>(perfil.capital.map(([e]) => e));
  for (const [nombre, nivel] of Object.entries(sede.edificios)) {
    const edificio = nombre as TipoEdificio;
    if (nivel <= 0 || enElPlan.has(edificio)) continue;
    const consumo = Object.entries(t.reglas.edificios[edificio].consumo) as [Recurso, number][];
    const sinInsumo = consumo.some(
      ([recurso, cantidad]) =>
        cantidad > 0 && t.produccion(recurso) <= 0 && t.disponible(recurso) < cantidad * nivel,
    );
    if (sinInsumo) return edificio;
  }
  return null;
}

/**
 * Si un esencial de la via no cabe en la capital, se derriba un nivel de lo que ocupa un solar sin
 * poder trabajar. Uno cada vez: el derribo devuelve la mitad del material y deja sitio.
 */
export function hacerSitio(d: Decision): void {
  const { t, p, perfil } = d;
  const sede = t.sede;
  if (sede === null) return;
  const derribando =
    t.vista.obras.some((o) => o.comarca === sede.id && o.tipo === 'derribo') ||
    t.ordenes.some((o) => o.tipo === 'derribar');
  if (derribando) return;
  const bloqueado = perfil.esenciales.some(
    (e) =>
      t.nivelPrevisto(sede, e) === 0 && impedimentoPrevisto(t, sede, e, p.ordenes) === 'sin-solar',
  );
  if (!bloqueado) return;
  const inutil = edificioInutil(t, perfil, sede);
  if (inutil !== null) p.derribar(sede.id, inutil);
}

/** La siguiente obra mayor de la casa, en la capital, si no hay otra a medias. */
export function obraMayor(d: Decision): void {
  const { t, p, perfil } = d;
  const sede = t.sede;
  if (sede === null) return;
  const aMedias =
    t.vista.obras.some((o) => o.tipo === 'obra mayor' && !o.abandonada) ||
    t.ordenes.some((o) => o.tipo === 'obra-mayor');
  if (aMedias) {
    d.m.anotar('obra-mayor-en-marcha');
    return;
  }
  for (const obra of perfil.obrasMayores) {
    for (const comarca of t.propias) {
      if (comarca.obrasMayores.includes(obra)) continue;
      if (!puedeLevantar(t, comarca, obra)) continue;
      // Se pide cuando se puede pagar: esperando en la cola no hace nada y confunde al que la lee.
      if (!p.alcanza(costeDeObraMayor(obra, t.casa, t.reglas))) {
        d.m.anotar('obra-mayor-sin-recursos');
        return;
      }
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
 * El nombre que el motor da a la recua formada en la capital para el hueco `i` de la lista de
 * papeles: «Recua de Vinuesa», «Recua de Vinuesa 2»… siempre el primer nombre libre. Por eso una
 * recua que se disuelve deja libre su nombre, y la que se forma despues lo hereda con su papel.
 */
function nombreDeHueco(t: Tablero, hueco: number): string | null {
  const nombre = t.sede === null ? undefined : t.geografia(t.sede.id)?.nombre;
  if (nombre === undefined) return null;
  const base = `Recua de ${nombre}`.slice(0, 55);
  return hueco === 0 ? base : `${base} ${String(hueco + 1)}`;
}

/**
 * El hueco de cada recua en la lista de papeles del perfil. Va por su nombre: asi disolver una
 * recua mermada y formar otra no cambia el oficio de las demas. Las que no llevan un nombre de
 * hueco (formadas fuera de la capital) toman los huecos libres por antiguedad.
 */
function huecos(t: Tablero, perfil: Perfil): Map<string, number> {
  const porNombre = new Map<string, number>();
  perfil.recuas.forEach((_, i) => {
    const nombre = nombreDeHueco(t, i);
    if (nombre !== null) porNombre.set(nombre, i);
  });
  const asignados = new Map<string, number>();
  const ocupados = new Set<number>();
  const sinHueco: Recua[] = [];
  for (const recua of t.recuas) {
    const hueco = porNombre.get(recua.nombre);
    if (hueco === undefined || ocupados.has(hueco)) {
      sinHueco.push(recua);
      continue;
    }
    ocupados.add(hueco);
    asignados.set(recua.id, hueco);
  }
  let hueco = 0;
  for (const recua of sinHueco) {
    while (ocupados.has(hueco)) hueco += 1;
    if (hueco >= perfil.recuas.length) break;
    ocupados.add(hueco);
    asignados.set(recua.id, hueco);
  }
  return asignados;
}

/** El papel de cada recua, por su hueco. */
export function papeles(t: Tablero, perfil: Perfil): Map<string, Papel> {
  const suyos = new Map<string, Papel>();
  for (const [recua, hueco] of huecos(t, perfil)) {
    const papel = perfil.recuas[hueco];
    if (papel !== undefined) suyos.set(recua, papel);
  }
  return suyos;
}

/** El papel de una recua, o null si sobra en la lista del perfil. */
export function papelDe(t: Tablero, perfil: Perfil, recua: Recua): Papel | null {
  return papeles(t, perfil).get(recua.id) ?? null;
}

/** El papel del primer hueco sin recua: el de la que se forme ahora, que heredara ese nombre. */
function huecoLibre(t: Tablero, perfil: Perfil): Papel | null {
  const ocupados = new Set(huecos(t, perfil).values());
  for (let i = 0; i < perfil.recuas.length; i += 1) {
    if (!ocupados.has(i)) return perfil.recuas[i] ?? null;
  }
  return null;
}

/**
 * Forma la recua del primer hueco libre si hay con que y la gente de la capital lo aguanta. El
 * tratante se forma aunque falte pan: es quien lo compra.
 */
export function formarRecuas(d: Decision): void {
  const { t, p, perfil } = d;
  const sede = t.sede;
  if (sede === null || t.recuas.length >= perfil.recuas.length) return;
  const papel = huecoLibre(t, perfil);
  if (papel === null) return;
  if (t.ordenes.some((o) => o.tipo === 'formar-recua')) return;
  const comprador = papel === 'tratar' && (sede.edificios['mercado'] ?? 0) > 0;
  const coste = costeDeRecua(t.casa, t.reglas);
  const holgado = !t.yo.escasez && t.disponible('pan') >= coste.pan + t.consumoDePan() * 2;
  const puede =
    sede.poblacion >= (comprador ? 10 : 25) && (comprador || holgado) && p.alcanza(coste);
  if (!puede) {
    d.m.anotar('recua-sin-formar');
    return;
  }
  p.formarRecua(sede.id);
}

/** Lo que se quiere tener de un material para las obras, como poco. */
const MATERIAL_MINIMO = 30;
const MATERIALES: readonly Recurso[] = ['madera', 'piedra'];
/** Lo que el tratante sabe comprar en la plaza de casa (ver `compras`): de ahi salen los insumos. */
export const LO_QUE_COMPRA_EL_TRATANTE: readonly Recurso[] = ['pan', 'sal', ...MATERIALES];

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
function materialQueFalta(t: Tablero, perfil: Perfil): [Recurso, number] | null {
  for (const recurso of MATERIALES) {
    const objetivo = Math.max(
      MATERIAL_MINIMO,
      perfil.acopio?.[recurso] ?? 0,
      materialDeLaSiguienteObra(t, perfil, recurso),
      materialDeLaCola(t, recurso),
    );
    const insuficiente = t.produccion(recurso) <= t.consumoDe(recurso);
    const falta = objetivo - t.disponible(recurso);
    if (insuficiente && falta > 0) return [recurso, falta];
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

/** Vuelve a la comarca propia mas cercana: alli ya carga y descarga del almacen. */
function volverAlDominio(d: Decision, recua: Recua): void {
  const { t, p } = d;
  const aqui = Tablero.donde(recua);
  if (!t.esPropia(aqui)) p.ir(recua.id, t.casaMasCercana(aqui), recua.enExpedicion);
  p.carga(recua.id, {}, todoMenos(recua, ['pan', 'sal']));
}

/** Por que no se puede un viaje, en los motivos del informe. */
function anotarImposible(d: Decision, motivo: ViajeImposible, sinDestino: Motivo): void {
  d.m.anotar(
    motivo === 'sin-sal'
      ? 'sin-sal-de-verano'
      : motivo === 'sin-pan'
        ? 'sin-pan-para-el-viaje'
        : sinDestino,
  );
}

/**
 * Parte de las acemilas por debajo de la cual una recua que anda vuelve a casa, se disuelve y se
 * forma de nuevo: con la mitad del porte ya no llega a ninguna parte (en milesimas).
 */
const ACEMILAS_PARA_SEGUIR_MIL = 750;

function mermada(t: Tablero, recua: Recua): boolean {
  return recua.acemilas * 1000 < t.reglas.movimiento.acemilasPorRecua * ACEMILAS_PARA_SEGUIR_MIL;
}

/** La recua mermada vuelve a casa y se disuelve: el primer hueco libre la vuelve a formar entera. */
const retirar: Rutina = (d, recua) => {
  d.m.anotar('recua-mermada');
  if (!d.t.esPropia(Tablero.donde(recua))) {
    volverAlDominio(d, recua);
    return;
  }
  d.p.cometido(recua.id, 'disolver');
};

/** Las recuas hacen lo suyo: cada papel tiene su rutina, y solo se mira la recua que esta libre. */
export function moverRecuas(d: Decision, rutinas: Partial<Record<Papel, Rutina>> = {}): void {
  const { t, perfil } = d;
  const suyos = papeles(t, perfil);
  for (const recua of t.recuas) {
    if (!t.libre(recua)) continue;
    const papel = suyos.get(recua.id);
    if (papel === undefined) continue;
    if (papel !== 'tratar' && mermada(t, recua)) {
      retirar(d, recua);
      continue;
    }
    const rutina = rutinas[papel] ?? RUTINAS[papel];
    rutina(d, recua);
  }
}

export type Rutina = (d: Decision, recua: Recua) => void;

/** Oidas que se miran como mucho cada vez: las mas cercanas, que son las que se alcanzan. */
const OIDAS_QUE_SE_MIRAN = 6;

/** Ir a una comarca y volver a la propia mas cercana a ella: la cuenta de todo viaje de ida. */
function idaYVuelta(t: Tablero, destino: IdComarca): Parada[] {
  return [
    { comarca: destino, detiene: true },
    { comarca: t.casaMasCercana(destino), detiene: false },
  ];
}

/** Distancia en el mapa entre dos puntos: basta para ordenar, no para medir jornadas. */
function lejania(a: readonly [number, number], b: readonly [number, number]): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

/**
 * Hacia donde explora una casa con mercancia de feria que no alcanza ninguna: la feria que sabe
 * (de oidas basta) mas cercana a su capital en el mapa. Null si no busca feria (T-059).
 */
function feriaQueBuscar(d: Decision, recua: Recua): readonly [number, number] | null {
  const { t, perfil } = d;
  if (perfil.feria.length === 0 || feriaAlAlcance(d, recua, {}) !== null) return null;
  const capital = t.centroDe(t.capital);
  if (capital === null) return null;
  let mejor: { centro: readonly [number, number]; lejos: number } | null = null;
  for (const plaza of t.plazasConocidas().filter((pl) => pl.tipo === 'feria')) {
    const centro = t.centroDe(plaza.comarca);
    if (centro === null) continue;
    const lejos = lejania(capital, centro);
    if (mejor === null || lejos < mejor.lejos) mejor = { centro, lejos };
  }
  return mejor?.centro ?? null;
}

/**
 * La comarca oida mas cercana a la que la recua llega **y desde la que vuelve** a lo propio: en
 * casa, con el pan que cabe; fuera, con el que lleva. Una exploradora no sale a malvivir. La de una
 * casa que busca feria elige, de las que alcanza, la que mas se acerca a ella (T-059).
 */
function siguienteAExplorar(
  d: Decision,
  parada: Recua,
  /** Las que ya van en el plan de este turno: no se manda dos veces a la misma. */
  planeadas: ReadonlySet<string> = new Set(),
): { id: IdComarca; provision: Provision | null; arriesgada: boolean } | null {
  const { t } = d;
  // Se cuenta con lo que comera de expedicion, que es lo que le cobrara el motor al salir.
  const recua: Recua = { ...parada, enExpedicion: true };
  const aqui = Tablero.donde(recua);
  const enCasa = t.esPropia(aqui);
  const distancias = t.jornadasDesde(aqui);
  const hacia = feriaQueBuscar(d, recua);
  const acercaA = (id: string): number => {
    const centro = hacia === null ? null : t.centroDe(id as IdComarca);
    return hacia === null || centro === null ? 0 : lejania(centro, hacia);
  };
  const oidas = [...distancias]
    .filter(([id]) => t.nivel(id) === 'oida' && !planeadas.has(id))
    .sort((a, b) => acercaA(a[0]) - acercaA(b[0]) || a[1] - b[1] || comparar(a[0], b[0]))
    .slice(0, OIDAS_QUE_SE_MIRAN);
  let imposible: ViajeImposible = 'sin-ruta';
  for (const [id] of oidas) {
    const paradas = idaYVuelta(t, id);
    if (!enCasa) {
      if (leLlega(t, recua, paradas)) return { id, provision: null, arriesgada: false };
      continue;
    }
    const provision = provisionPara(t, recua, paradas);
    if (provision.ok) return { id, provision: provision.valor, arriesgada: false };
    imposible = provision.motivo;
  }
  if (!enCasa) return null;
  const arriesgada = expedicionArriesgada(d, recua, oidas);
  if (arriesgada !== null) return arriesgada;
  anotarImposible(d, imposible, 'sin-oida-al-alcance');
  return null;
}

/**
 * Cuando ninguna oida deja volver con el pan que cabe (una capital de sierra, donde un solo tramo
 * son cinco jornadas), se puede salir igual: la recua llega con pan, explora y vuelve malviviendo,
 * perdiendo acemilas, y en casa se disuelve y se forma otra. Es una apuesta deliberada, no un
 * descuido: solo se hace si la casa puede pagar hoy esa recua nueva.
 */
function expedicionArriesgada(
  d: Decision,
  recua: Recua,
  oidas: readonly (readonly [IdComarca, number])[],
): { id: IdComarca; provision: Provision; arriesgada: true } | null {
  const { t, p } = d;
  const repuesto = costeDeRecua(t.casa, t.reglas);
  const puedeRehacerla = p.alcanza(repuesto);
  if (!puedeRehacerla || mermada(t, recua)) return null;
  // Sale con el pan que no la frena (una recua cargada anda una jornada menos) y acepta malvivir
  // como mucho dos jornadas antes de llegar.
  const m = t.reglas.movimiento;
  const ligera = Math.ceil((recua.porte * m.cargaPesadaMil) / 1000) - 1 - recua.carga.sal;
  const aguanta = ligera + 2 * m.bastimentoPorJornada;
  for (const [id] of oidas) {
    const ida = preverViaje(t, recua, [{ comarca: id, detiene: true }], {
      ...recua.carga,
      pan: ligera,
    });
    if (!ida.ok || ida.valor.pan > aguanta) continue;
    // La apuesta es el pan de la vuelta; la sal del verano y lo que paga el almacen, no.
    const sal = Math.max(recua.carga.sal, ida.valor.sal);
    if (sal - recua.carga.sal + ida.valor.salDeCasa > t.disponible('sal')) continue;
    if (ligera - recua.carga.pan + ida.valor.panDeCasa > t.disponible('pan')) continue;
    return {
      id,
      provision: { pan: ligera, sal, maravedis: 0, prevision: ida.valor },
      arriesgada: true,
    };
  }
  return null;
}

/**
 * Explorar: la oida mas cercana a la que se puede ir y volver. Sale con todo el pan que quepa si el
 * granero lo permite, y desde cada comarca explorada sigue a la siguiente mientras le llegue para
 * volver; cuando no, vuelve a la comarca propia mas cercana.
 */
/**
 * Un viaje de exploracion entero, dejado en la cola de la recua: carga el pan y la sal del camino,
 * va, explora y vuelve a lo propio a descargar. Devuelve los turnos que ocupa, o 0 si no se puede.
 */
function viajeDeExploracion(d: Decision, recua: Recua, planeadas: Set<string>): number {
  const { t, p } = d;
  const destino = siguienteAExplorar(d, recua, planeadas);
  if (destino === null || destino.provision === null) return 0;
  const { pan, sal, prevision } = destino.provision;
  const cargarPan = pan - recua.carga.pan;
  const cargarSal = sal - recua.carga.sal;
  // No se saca del granero el pan de la gente: `disponible` ya descuenta lo que se han llevado los
  // viajes dichos antes en este mismo turno.
  if (t.disponible('pan') < cargarPan + t.consumoDePan() * 2) {
    d.m.anotar('sin-pan-para-el-viaje');
    return 0;
  }
  const cargar: Partial<Record<Recurso, number>> = {
    ...(cargarPan > 0 ? { pan: cargarPan } : {}),
    ...(cargarSal > 0 ? { sal: cargarSal } : {}),
  };
  p.carga(recua.id, cargar, todoMenos(recua, ['pan', 'sal']));
  p.ir(recua.id, destino.id, true);
  p.cometido(recua.id, 'explorar');
  planeadas.add(destino.id);
  // La vuelta va dicha desde ya: una recua no se queda parada esperando a que alguien entre.
  p.ir(recua.id, t.casaMasCercana(destino.id), true);
  p.carga(recua.id, {}, {});
  return prevision.turnos;
}

/**
 * Explorar: ir a la oida mas cercana a la que se pueda ir y volver, explorarla y volver a casa.
 * El plan cubre hasta la proxima decision: quien entra cada seis turnos deja dichos los viajes de
 * esos seis turnos, que son los mismos que haria entrando cada dia.
 */
const explorar: Rutina = (d, recua) => {
  const { t, p } = d;
  if (!t.esPropia(Tablero.donde(recua))) {
    // Fuera de casa solo se decide una cosa: seguir a la siguiente si le llega, o volver.
    const siguiente = siguienteAExplorar(d, recua);
    if (siguiente === null) {
      volverAlDominio(d, recua);
      return;
    }
    p.ir(recua.id, siguiente.id, true);
    p.cometido(recua.id, 'explorar');
    return;
  }
  const planeadas = new Set<string>();
  let turnos = 0;
  while (turnos < Math.max(1, d.cadencia)) {
    const viaje = viajeDeExploracion(d, recua, planeadas);
    if (viaje === 0) return;
    // Ida y vuelta: el viaje previsto cuenta la ida, y la vuelta cuesta otro tanto.
    turnos += viaje * 2;
  }
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
/** Todo lo que se puede comerciar: los maravedis son la moneda, no mercancia. */
export const COMERCIABLES: readonly Recurso[] = RECURSOS.filter((r) => r !== 'maravedis');

/** Ventas que llega a sostener una casa: una por cada dos recuas, y nunca mas de tres. */
const VENTAS_POR_RECUA = 2;
const VENTAS_MAXIMAS = 3;

/** Jornadas hasta la venta mas lejana que merece la pena: mas alla no se va a comerciar. */
const JORNADAS_DE_VENTA = 4;

/**
 * La venta es la plaza del camino (ficha T-053): se levanta en tierra de nadie y abre mercado
 * alli. Se planta donde la mercancia vale **distinto** que en casa, que es donde hay negocio: de
 * poco sirve una posada en una comarca que cotiza lo mismo que la propia.
 */
export function plantarVentas(d: Decision): void {
  const { t, p, perfil } = d;
  // Solo las casas que viven del camino: quien no manda una recua a arbitrar no necesita plaza
  // fuera de su tierra, y una posada vacia es madera y piedra tiradas.
  if (!perfil.recuas.includes('arbitraje')) return;
  const sede = t.sede;
  if (sede === null) return;
  const mias = t.propias.filter((c) => (c.edificios['venta'] ?? 0) > 0).length;
  const enMarcha = t.ordenes.filter((o) => o.tipo === 'construir' && o.edificio === 'venta').length;
  const tope = Math.min(VENTAS_MAXIMAS, Math.floor(t.recuas.length / VENTAS_POR_RECUA));
  if (mias + enMarcha >= tope) return;
  if (!p.alcanza(costeDeEdificio('venta', t.casa, t.reglas))) return;

  const jornadas = t.jornadasDesdeLoPropio();
  let mejor: { id: IdComarca; diferencia: number } | null = null;
  for (const [id, lejos] of [...jornadas].sort((a, b) => comparar(a[0], b[0]))) {
    if (lejos > JORNADAS_DE_VENTA || t.esPropia(id)) continue;
    const sabido = t.explorada(id);
    if (sabido === null || sabido.datos === null || sabido.datos.duenyo !== null) continue;
    if ((sabido.datos.edificios['venta'] ?? 0) > 0) continue;
    // Lo que mas se separa del precio de casa: ahi es donde un viaje deja algo.
    const diferencia = Math.max(
      ...COMERCIABLES.map((r) => Math.abs(t.baseEn(id, r) - t.baseEn(sede.id, r))),
    );
    if (mejor === null || diferencia > mejor.diferencia) mejor = { id, diferencia };
  }
  if (mejor === null || mejor.diferencia <= 0) {
    d.m.anotar('sin-sitio-para-venta');
    return;
  }
  p.construir(mejor.id, 'venta');
}

/** Lo que mas lleva un feriante en maravedis para comer en las ventas del camino. */
const BOLSA_DE_FERIA_MAXIMA = 120;

/** La bolsa del viaje de feria: lo que sobra del colchon, con tope, y lo que ya lleva. */
function bolsaDeFeria(d: Decision, recua: Recua): number {
  const { t, p } = d;
  const sobra = t.disponible('maravedis') - p.reservado('maravedis') - COLCHON_DE_MARAVEDIS;
  return Math.min(Math.max(0, sobra) + recua.carga.maravedis, BOLSA_DE_FERIA_MAXIMA);
}

/** Jornadas entre posadas en el camino de la feria: lo que aguanta una recua con su pan. */
const JORNADAS_ENTRE_POSADAS = 4;
/** Ventas que una casa levanta hacia su feria, como mucho. */
const VENTAS_DE_FERIA_MAXIMAS = 4;

/**
 * Las ventas del camino de la lana (T-059 §9): quien vive de feriar levanta, en comarcas de nadie
 * ya exploradas de la ruta a su feria, una posada cada `JORNADAS_ENTRE_POSADAS` desde la ultima.
 * Es de quien pase (T-055); el coste es de quien madruga. Una a la vez. No se mira si alcanza hoy:
 * la obra espera en su cola y el tratante compra los materiales que le falten.
 */
export function plantarVentasDeFeria(d: Decision): void {
  const { t, p, perfil } = d;
  if (perfil.feria.length === 0) return;
  const enMarcha = t.ordenes.filter((o) => o.tipo === 'construir' && o.edificio === 'venta').length;
  const mias = t.propias.filter((c) => (c.edificios['venta'] ?? 0) > 0).length;
  if (enMarcha > 0 || mias >= VENTAS_DE_FERIA_MAXIMAS) return;
  const propias = t.jornadasDesdeLoPropio();
  const feria = t
    .plazasConocidas()
    .filter((pl) => pl.tipo === 'feria' && propias.has(pl.comarca))
    .sort(
      (a, b) =>
        (propias.get(a.comarca) ?? 0) - (propias.get(b.comarca) ?? 0) || comparar(a.id, b.id),
    )[0];
  if (feria === undefined) return;
  const ruta = t.rutaDeRecua(t.capital, [feria.comarca]);
  if (ruta === null) return;
  // La ultima posada de la ruta que ya esta en pie: de ahi se cuentan las cuatro jornadas.
  let posada: IdComarca = t.capital;
  for (const comarca of ruta.comarcas) {
    if (t.esPropia(comarca) || t.hayVentaEn(comarca)) posada = comarca;
  }
  const desdeLaPosada = t.jornadasDesde(posada);
  if ((desdeLaPosada.get(feria.comarca) ?? Number.POSITIVE_INFINITY) <= JORNADAS_ENTRE_POSADAS) {
    return;
  }
  let sitio: IdComarca | null = null;
  for (const comarca of ruta.comarcas) {
    const lejos = desdeLaPosada.get(comarca) ?? Number.POSITIVE_INFINITY;
    if (lejos <= 0 || lejos > JORNADAS_ENTRE_POSADAS || comarca === feria.comarca) continue;
    const sabido = t.explorada(comarca);
    if (sabido === null || sabido.datos === null || sabido.datos.duenyo !== null) continue;
    if ((sabido.datos.edificios['venta'] ?? 0) > 0) continue;
    sitio = comarca;
  }
  if (sitio === null) {
    d.m.anotar('sin-sitio-para-venta');
    return;
  }
  p.construir(sitio, 'venta');
}

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

/**
 * La recua presente aguanta hasta la proxima decision (`cadencia` turnos comiendo alli) y aun le
 * llega para volver: si no, se va ya, antes de quedarse sin pan.
 */
function aguantaPresente(d: Decision, recua: Recua, vuelta: readonly Parada[]): boolean {
  const come = panDePresencia(d.t, d.cadencia);
  const queda = {
    ...recua.carga,
    pan: recua.carga.pan - come.pan,
    sal: recua.carga.sal - come.sal,
  };
  return queda.pan >= 0 && queda.sal >= 0 && leLlega(d.t, recua, vuelta, queda);
}

/** El emisario: presencia en la comarca que se quiere, con regalos, hasta poder incorporarla. */
const emisario: Rutina = (d, recua) => {
  const { t, p, perfil } = d;
  const objetivo = objetivoDeTierra(t, perfil);
  const aqui = Tablero.donde(recua);
  if (objetivo === null) {
    d.m.anotar('sin-tierra-que-ganar');
    if (!t.esPropia(aqui)) volverAlDominio(d, recua);
    return;
  }
  const [ida, vuelta] = idaYVuelta(t, objetivo);
  if (ida === undefined || vuelta === undefined) return;
  if (!t.esPropia(aqui)) {
    if (aqui === objetivo && aguantaPresente(d, recua, [vuelta])) {
      if (recua.cometido !== 'presencia') p.cometido(recua.id, 'presencia');
      return;
    }
    volverAlDominio(d, recua);
    return;
  }
  const provision = provisionPara(t, recua, [ida, vuelta]);
  if (!provision.ok) {
    anotarImposible(d, provision.motivo, 'sin-tierra-que-ganar');
    return;
  }
  // Todo el pan que quepa: lo que no se coma en el camino lo come estando presente.
  const { sal } = provision.valor;
  const pan = recua.porte - sal;
  const unTurno = panDePresencia(t, 1).pan;
  if (pan < provision.valor.pan + unTurno) {
    d.m.anotar('sin-tierra-que-ganar');
    return;
  }
  const cargarPan = pan - recua.carga.pan;
  if (t.disponible('pan') < cargarPan + t.consumoDePan() * TURNOS_DE_DESPENSA) {
    d.m.anotar('sin-pan-para-el-viaje');
    return;
  }
  const cargarSal = sal - recua.carga.sal;
  p.carga(
    recua.id,
    { ...(cargarPan > 0 ? { pan: cargarPan } : {}), ...(cargarSal > 0 ? { sal: cargarSal } : {}) },
    todoMenos(recua, ['pan', 'sal']),
  );
  p.ir(recua.id, objetivo);
  p.cometido(recua.id, 'presencia');
  // Y la vuelta, fechada: estara presente mientras le dure el pan y volvera sola. Sin esto, quien
  // entra cada seis turnos deja la recua parada o sin bastimento en tierra ajena.
  const come = panDePresencia(t, 1);
  const paraLaVuelta = provision.valor.pan;
  const turnosDePresencia =
    come.pan <= 0 ? d.cadencia : Math.floor((pan - paraLaVuelta) / Math.max(1, come.pan));
  const vuelveEn = provision.valor.prevision.llegadas[0] ?? 1;
  const cuando = t.turno + vuelveEn + Math.max(1, Math.min(turnosDePresencia, d.cadencia));
  p.ruta(recua.id, [parada(t.casaMasCercana(objetivo))], false, cuando);
  p.carga(recua.id, {}, {}, 0, cuando);
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

/** Turnos de consumo de pan que se compran antes que nada: lo que no puede esperar. */
const TURNOS_DE_URGENCIA = 2;

/**
 * El material que falta para los esenciales de la via que aun no tiene la capital, sumados: una
 * cadena (carbonera y ferreria) se paga entera, o la primera se come lo de la segunda.
 */
function materialDelEsencial(t: Tablero, perfil: Perfil): [Recurso, number] | null {
  const sede = t.sede;
  if (sede === null) return null;
  const pendientes = perfil.esenciales.filter((e) => t.nivelPrevisto(sede, e) === 0);
  for (const recurso of MATERIALES) {
    const coste = pendientes.reduce(
      (total, e) => total + costeDeEdificio(e, t.casa, t.reglas)[recurso],
      0,
    );
    const falta = coste - t.disponible(recurso);
    if (falta > 0) return [recurso, falta];
  }
  return null;
}

/**
 * Sal que se guarda para las conservas de los viajes de verano. Para las lonjas solo la compra
 * quien las tiene en su plan: a los demas, dos de sal dan seis de pan que sale mas barato comprado.
 */
const SAL_DE_VIAJE = 2;

/**
 * Lo que hace falta comprar y cuanto, por orden de urgencia: el pan de dos turnos, el material de
 * los esenciales que faltan (lo que saca a la casa de pobre: la ferreria antes que la despensa
 * llena), el pan hasta la despensa, el material que la tierra no da y la sal de los viajes. El dinero va en ese
 * orden, no a partes iguales: una casa con hambre no ahorra piedra para la muralla.
 */
function compras(t: Tablero, perfil: Perfil): [Recurso, number][] {
  const falta: [Recurso, number][] = [];
  const consumo = t.consumoDePan();
  const urgente = consumo * TURNOS_DE_URGENCIA - t.disponible('pan');
  if (urgente > 0) falta.push(['pan', urgente]);
  const esencial = materialDelEsencial(t, perfil);
  if (esencial !== null) falta.push(esencial);
  // La sal de las lonjas, solo para quien las tiene en su plan: a los salineros la salazon les rinde
  // mas y es su via; a los demas, el pan sale mas barato comprado (ver `SAL_DE_VIAJE`).
  const deSuPlan = [...perfil.capital, ...perfil.comarcas].some(([e]) => e === 'lonja');
  const salDeLonjas = deSuPlan ? t.consumoDe('sal') * TURNOS_DE_URGENCIA - t.disponible('sal') : 0;
  if (salDeLonjas > 0) falta.push(['sal', salDeLonjas]);
  const despensa = consumo * TURNOS_DE_DESPENSA - t.disponible('pan') - Math.max(0, urgente);
  if (despensa > 0) falta.push(['pan', despensa]);
  const material = materialQueFalta(t, perfil);
  if (material !== null && material[0] !== esencial?.[0]) falta.push(material);
  // La sal solo la piden los caminos de verano: se compra en primavera y verano, y lo ultimo.
  const estacion = t.calendario.estacion;
  const sal = SAL_DE_VIAJE - t.disponible('sal');
  if (sal > 0 && (estacion === 'primavera' || estacion === 'verano')) falta.push(['sal', sal]);
  return falta;
}

/** El tratante: quieto en la plaza de la capital, vende lo que sobra y compra lo que falta. */
/**
 * Un turno de plaza: lo que falta y lo que sobra, con el porte de la recua como medida. `enTurno`
 * es el turno en que tiene que hacerse, o null para hoy mismo.
 */
function tratarUnTurno(
  d: Decision,
  recua: Recua,
  enTurno: number | null,
  /** Lo que la recua tendra encima ese turno segun el plan: se descarga antes de cargar. */
  encima: Cantidades,
): { hizo: boolean; encima: Cantidades } {
  const { t, p, perfil } = d;
  const sede = t.sede;
  if (sede === null) return { hizo: false, encima };
  const plaza = idDeMercadoLocal(sede.id);
  // Lo que puede ir a una feria no se malvende en casa.
  const aLaFeria = perfil.recuas.includes('feriar') && feriaAlAlcance(d, recua, {}) !== null;
  const vendibles = (Object.keys(perfil.vende) as Recurso[]).filter(
    (r) => !(aLaFeria && perfil.feria.includes(r)) && sobrante(t, perfil, r) >= LOTE_MINIMO,
  );
  const faltan = compras(t, perfil);
  // El porte del tratante es lo que se mueve por la plaza cada turno. Va primero lo que falta, por
  // urgencia (el pan, sobre todo), y despues lo que sobra; pero a cada cosa pendiente se le guarda
  // un lote: si el pan se lo come todo, la casa no compra nunca la madera de su ferreria ni vende
  // lo que la sacaria de pobre.
  const pendientes = faltan.length + vendibles.length;
  const cargar: Partial<Record<Recurso, number>> = {};
  let hueco = recua.porte;
  let turno = 0;
  const cabe = (): number => Math.max(0, hueco - LOTE_MINIMO * (pendientes - turno - 1));
  const bolsa = Math.min(t.disponible('maravedis') - COLCHON_DE_MARAVEDIS, 120);
  const compra: [Recurso, number, number][] = [];
  let queda = bolsa;
  for (const [recurso, falta] of faltan) {
    const maximo = Math.floor((t.baseEn(t.capital, recurso) * 15) / 10);
    const cantidad = Math.min(cabe(), falta, Math.floor((queda * 1000) / maximo));
    turno += 1;
    if (cantidad <= 0) continue;
    // El pan puede venir dos veces (el urgente y el de la despensa): va en una sola orden.
    const ya = compra.findIndex(([r]) => r === recurso);
    const antes = compra[ya];
    if (antes === undefined) compra.push([recurso, cantidad, maximo]);
    else compra[ya] = [recurso, antes[1] + cantidad, maximo];
    hueco -= cantidad;
    queda -= Math.ceil((cantidad * maximo) / 1000);
  }
  if (compra.length > 0) cargar.maravedis = bolsa - queda;
  const ventas: [Recurso, number][] = [];
  for (const recurso of vendibles) {
    const lote = Math.min(sobrante(t, perfil, recurso), cabe());
    turno += 1;
    if (lote < LOTE_MINIMO) continue;
    cargar[recurso] = lote;
    ventas.push([recurso, lote]);
    hueco -= lote;
  }
  // Lo que la recua trae del turno anterior se descarga antes de cargar lo de hoy: si no, el pan
  // comprado se quedaria en la recua y la gente pasaria hambre con el granero lleno.
  const descargar = { ...encima };
  const nada = ventas.length === 0 && compra.length === 0 && Object.keys(descargar).length === 0;
  if (!nada) p.carga(recua.id, cargar, descargar, 0, enTurno);
  for (const [recurso, lote] of ventas) {
    const minimo = Math.floor((t.baseEn(t.comarcaDePlaza(plaza), recurso) * 6) / 10);
    p.mercado(recua.id, plaza, recurso, 'vender', lote, minimo, 1, enTurno);
  }
  for (const [recurso, cantidad, maximo] of compra) {
    p.mercado(recua.id, plaza, recurso, 'comprar', cantidad, maximo, 1, enTurno);
  }
  // Lo comprado llega a la recua al cerrar la plaza; lo vendido sale. Con eso se planea el turno
  // siguiente: lo comprado es justo lo que habra que descargar.
  const trae: Partial<Record<Recurso, number>> = {};
  for (const [recurso, cantidad] of compra) trae[recurso] = cantidad;
  return { hizo: ventas.length > 0 || compra.length > 0, encima: trae };
}

/**
 * El tratante: quieto en la plaza de la capital, vende lo que sobra y compra lo que falta. Con la
 * cadencia del que entra poco, deja dicho el trato de cada turno del bloque con su fecha: es el
 * mismo plan, dicho antes, y no la mitad de comercio por no estar delante.
 */
export const rutinaDeTratar: Rutina = (d, recua) => {
  const { t, p, cadencia } = d;
  const sede = t.sede;
  if (sede === null || (sede.edificios['mercado'] ?? 0) === 0) {
    d.m.anotar('sin-mercado-propio');
    return;
  }
  if (Tablero.donde(recua) !== sede.id) {
    p.ir(recua.id, sede.id);
    return;
  }
  if (recua.cometido !== 'tratar') p.cometido(recua.id, 'tratar');
  let encima: Cantidades = todoMenos(recua, []);
  for (let k = 0; k < Math.max(1, cadencia); k += 1) {
    const turno = tratarUnTurno(d, recua, k === 0 ? null : t.turno + k, encima);
    encima = turno.encima;
    if (!turno.hizo) break;
  }
};

/** Ferias que se miran como mucho cada vez, de la mas cercana a la mas lejana. */
const FERIAS_QUE_SE_MIRAN = 4;

/** Una feria a la que la recua llega con su mercancia y desde la que vuelve a la capital. */
export interface PlanDeFeria {
  readonly plaza: PlazaConocida;
  readonly provision: Provision;
}

/**
 * La feria mas cercana a la que la recua, quieta en casa, llega con esta mercancia y vuelve a la
 * capital con el pan que lleva. Null si no hay ninguna.
 */
export function feriaAlAlcance(
  d: Decision,
  recua: Recua,
  mercancia: Partial<Recursos>,
  /** Maravedis de mas que puede llevar para comer en las ventas del camino (T-055). */
  bolsa = 0,
): PlanDeFeria | null {
  const { t } = d;
  const distancias = t.jornadasDesdeLoPropio();
  const ferias = t
    .plazasConocidas()
    .filter((pl) => pl.tipo === 'feria' && distancias.has(pl.comarca))
    .sort(
      (a, b) =>
        (distancias.get(a.comarca) ?? 0) - (distancias.get(b.comarca) ?? 0) || comparar(a.id, b.id),
    )
    .slice(0, FERIAS_QUE_SE_MIRAN);
  for (const plaza of ferias) {
    const provision = provisionPara(
      t,
      recua,
      [
        { comarca: plaza.comarca, detiene: true },
        { comarca: t.capital, detiene: false },
      ],
      mercancia,
      0,
      bolsa,
    );
    if (provision.ok) return { plaza, provision: provision.valor };
  }
  return null;
}

/** En la feria: vende lo que lleva y, cuando ya lo ha vendido, compra el pan de la vuelta. */
function enLaFeria(d: Decision, recua: Recua, plaza: PlazaConocida): void {
  const { t, p, perfil, cadencia } = d;
  const mercancia = perfil.feria.filter((r) => recua.carga[r] > 0);
  if (recua.cometido !== 'tratar') p.cometido(recua.id, 'tratar');
  const turnos = Math.max(cadencia, t.turnosHastaQueAbra(plaza) + 1);
  if (mercancia.length > 0) {
    for (const recurso of mercancia) {
      const minimo = Math.floor((t.baseEn(plaza.comarca, recurso) * 6) / 10);
      p.mercado(recua.id, plaza.id, recurso, 'vender', recua.carga[recurso], minimo, turnos);
    }
    return;
  }
  const vuelta = preverViaje(t, recua, [{ comarca: t.capital, detiene: false }], recua.carga);
  const falta = vuelta.ok ? vuelta.valor.pan + margenDePan(t) - recua.carga.pan : 0;
  const maximo = Math.floor((t.baseEn(plaza.comarca, 'pan') * 15) / 10);
  const puede = Math.floor((recua.carga.maravedis * 1000) / maximo);
  if (falta > 0 && puede > 0 && t.turnosHastaQueAbra(plaza) === 0) {
    p.mercado(recua.id, plaza.id, 'pan', 'comprar', Math.min(falta, puede), maximo, 1);
    return;
  }
  volverACasa(d, recua);
}

/**
 * Turnos que puede esperar una recua en la feria antes de que abra: esperar alli no come, asi que
 * se sale con holgura; y con la cadencia del jugador, porque no vuelve a mirar hasta entonces.
 */
const ESPERA_EN_FERIA = 4;

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
  if (lote < LOTE_DE_FERIA) {
    if (perfil.feria.includes('lana')) d.m.anotar('sin-lana-que-vender');
    const descargar = todoMenos(recua, ['pan', 'sal']);
    if (Object.keys(descargar).length > 0) p.carga(recua.id, {}, descargar);
    return;
  }
  const bolsa = bolsaDeFeria(d, recua);
  const vacia = feriaAlAlcance(d, recua, {}, bolsa);
  if (vacia === null) {
    d.m.anotar('sin-feria-al-alcance');
    return;
  }
  // La mercancia cabe en lo que dejan el pan y la sal del viaje; con ella a cuestas se anda menos,
  // asi que se prevé otra vez.
  let hueco = recua.porte - vacia.provision.pan - vacia.provision.sal;
  const mercancia: Partial<Record<Recurso, number>> = {};
  for (const recurso of perfil.feria) {
    const cantidad = Math.min(sobrante(t, perfil, recurso) + recua.carga[recurso], hueco);
    if (cantidad <= 0) continue;
    mercancia[recurso] = cantidad;
    hueco -= cantidad;
  }
  const plan = feriaAlAlcance(d, recua, mercancia, bolsa);
  if (plan === null) {
    d.m.anotar('sin-feria-al-alcance');
    return;
  }
  const llegada = plan.provision.prevision.llegadas[0] ?? 1;
  const espera = t.turnosHastaQueAbraEn(plan.plaza, t.turno + llegada - 1);
  if (espera > Math.max(ESPERA_EN_FERIA, d.cadencia)) {
    d.m.anotar('esperando-a-la-feria');
    return;
  }
  const cargar: Partial<Record<Recurso, number>> = {};
  const pan = plan.provision.pan - recua.carga.pan;
  const sal = plan.provision.sal - recua.carga.sal;
  if (pan > 0) cargar.pan = pan;
  if (sal > 0) cargar.sal = sal;
  const maravedis = plan.provision.maravedis - recua.carga.maravedis;
  if (maravedis > 0) cargar.maravedis = maravedis;
  const vender: Partial<Record<Recurso, { cantidad: number; precioMinimoMil: number }>> = {};
  for (const [recurso, cantidad] of Object.entries(mercancia) as [Recurso, number][]) {
    const falta = cantidad - recua.carga[recurso];
    if (falta > 0) cargar[recurso] = falta;
    vender[recurso] = {
      cantidad,
      precioMinimoMil: Math.floor((t.baseEn(plan.plaza.comarca, recurso) * 6) / 10),
    };
  }
  p.carga(recua.id, cargar, todoMenos(recua, ['pan', 'sal', 'maravedis', ...perfil.feria]));
  // La vuelta va dicha: el feriante no espera en la feria a que alguien entre a mandarlo a casa.
  p.ruta(recua.id, [parada(plan.plaza.comarca, { vender }), parada(t.capital)]);
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
    d.m.anotar('sin-tierra-que-ganar');
    if (!t.esPropia(aqui)) volverAlDominio(d, recua);
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
    volverAlDominio(d, recua);
    return;
  }
  const sede = t.sede;
  if (sede === null || sede.poblacion < 50 + necesarios) return;
  const provision = provisionPara(t, recua, idaYVuelta(t, objetivo));
  if (!provision.ok) {
    anotarImposible(d, provision.motivo, 'sin-tierra-que-ganar');
    return;
  }
  const faltan = Math.max(0, necesarios - recua.vecinos);
  const pan = provision.valor.pan - recua.carga.pan;
  const sal = provision.valor.sal - recua.carga.sal;
  p.carga(
    recua.id,
    { ...(pan > 0 ? { pan } : {}), ...(sal > 0 ? { sal } : {}) },
    todoMenos(recua, ['pan', 'sal']),
    faltan,
  );
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
  hacerSitio(d);
  edificar(d);
  plantarVentas(d);
  plantarVentasDeFeria(d);
  crecer(d);
  obraMayor(d);
  formarRecuas(d);
  moverRecuas(d, rutinas);
  ganarTierra(d);
  gobernar(d);
  return d.p.ordenes;
}
