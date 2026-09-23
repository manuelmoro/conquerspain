// Lo que un robot sabe al decidir: su vista, y lo que de ella se deduce. Nada mas.
//
// El robot recibe el mundo entero porque es el atlas que tiene cualquier cliente, pero solo puede
// mirarlo a traves de este tablero, que lo filtra por lo que el jugador conoce: de una comarca oida
// sabe el nombre; de una explorada o propia, su geografia; de una desconocida, nada. Asi un robot no
// puede hacer trampas aunque quiera (lo vigila `robots.test.ts` con vistas manipuladas).
import {
  calendarioDe,
  capacidadDe,
  comarcasTransitables,
  comparar,
  costeDeTramoMil,
  cuadrillasDe,
  estadoEstacionalDe,
  idDeMercadoDeFeria,
  idDeMercadoLocal,
  modificadoresDelJugador,
  opcionesDeRutaDeRebanyo,
  permisosDelJugador,
  precioBaseLocalMil,
  prohibicionesDelJugador,
  rutaPorParadas,
  tieneCalzada,
  tramoEntre,
} from '@conquer/nucleo';
import type {
  Calendario,
  Camino,
  EstadoEstacional,
  ComarcaMundo,
  EstadoComarca,
  EstadoJugador,
  IdComarca,
  IdMercado,
  Modificadores,
  Mundo,
  Orden,
  Permisos,
  Prohibiciones,
  Rebanyo,
  Recua,
  Recurso,
  Ruta,
  TablasDeReglas,
  TipoEdificio,
  VistaComarca,
  VistaJugador,
} from '@conquer/nucleo';

/** Una plaza que el jugador conoce: donde esta, si es de feria y cuando abre. */
export interface PlazaConocida {
  readonly id: IdMercado;
  readonly comarca: IdComarca;
  readonly tipo: 'local' | 'feria';
  /** Turnos del anyo en que abre; vacio si es local (abre siempre). */
  readonly turnos: readonly number[];
}

const VIVAS: readonly Orden['estado'][] = [
  'pendiente',
  'en espera',
  'en curso',
  'programada',
  'en cola',
];

/** El numero de una unidad (`recua-12` → 12), para ordenarlas por antiguedad. */
function numeroDe(id: string): number {
  return Number(id.slice(id.lastIndexOf('-') + 1));
}

export class Tablero {
  readonly yo: EstadoJugador;
  readonly turno: number;
  readonly calendario: Calendario;
  readonly casa: Modificadores;
  readonly permisos: Permisos;
  readonly prohibiciones: Prohibiciones;
  /** Las comarcas propias, en orden de identificador y con la capital la primera. */
  readonly propias: readonly EstadoComarca[];
  /** Recuas y rebanyos propios, de la mas antigua a la mas nueva. */
  readonly recuas: readonly Recua[];
  readonly rebanyos: readonly Rebanyo[];
  readonly ordenes: readonly Orden[];
  /** Lo que las cargas de esta decision sacan del almacen. */
  private readonly apartado = new Map<Recurso, number>();
  /** Las distancias ya calculadas en esta decision, por comarca de salida. */
  private readonly distancias = new Map<IdComarca, Map<IdComarca, number>>();

  constructor(
    readonly vista: VistaJugador,
    private readonly mundo: Mundo,
    readonly reglas: TablasDeReglas,
  ) {
    this.yo = vista.jugador;
    this.turno = vista.turno;
    this.calendario = calendarioDe(vista.turno, mundo, reglas);
    this.casa = modificadoresDelJugador(this.yo, reglas);
    this.permisos = permisosDelJugador(this.yo, reglas);
    this.prohibiciones = prohibicionesDelJugador(this.yo, reglas);
    const propias: EstadoComarca[] = [];
    for (const id of Object.keys(vista.comarcas).sort(comparar)) {
      const c = vista.comarcas[id];
      if (c?.nivel === 'propia') propias.push(c.comarca);
    }
    this.propias = propias.sort(
      (a, b) =>
        Number(b.id === this.yo.capital) - Number(a.id === this.yo.capital) || comparar(a.id, b.id),
    );
    this.recuas = [...vista.recuas].sort((a, b) => numeroDe(a.id) - numeroDe(b.id));
    this.rebanyos = [...vista.rebanyos].sort((a, b) => numeroDe(a.id) - numeroDe(b.id));
    this.ordenes = vista.ordenes.filter((o) => VIVAS.includes(o.estado));
  }

  get capital(): IdComarca {
    return this.yo.capital;
  }

  /** La comarca de la capital, si sigue siendo propia. */
  get sede(): EstadoComarca | null {
    return this.propias.find((c) => c.id === this.yo.capital) ?? null;
  }

  /** Lo que queda en el almacen: sin lo reservado ni lo que las cargas de este turno se llevan. */
  disponible(recurso: Recurso): number {
    return (
      this.yo.almacen[recurso] - this.yo.reservado[recurso] - (this.apartado.get(recurso) ?? 0)
    );
  }

  /**
   * Una orden de carga de este turno se lleva esto del almacen: lo que decida despues el robot ya
   * no puede contar con ello. Dos recuas que salen a la vez no se comen el mismo pan.
   */
  apartar(cantidades: Readonly<Partial<Record<Recurso, number>>>): void {
    for (const [recurso, cantidad] of Object.entries(cantidades) as [Recurso, number][]) {
      this.apartado.set(recurso, (this.apartado.get(recurso) ?? 0) + cantidad);
    }
  }

  nivel(id: string): VistaComarca['nivel'] | 'desconocida' {
    return this.vista.comarcas[id]?.nivel ?? 'desconocida';
  }

  esPropia(id: string): boolean {
    return this.nivel(id) === 'propia';
  }

  /** La geografia de una comarca explorada o propia; de las demas no se sabe. */
  geografia(id: string): ComarcaMundo | null {
    const nivel = this.nivel(id);
    if (nivel !== 'explorada' && nivel !== 'propia') return null;
    return this.mundo.comarcas[id] ?? null;
  }

  /** Lo que se sabe de una comarca ajena o neutral explorada. */
  explorada(id: string): Extract<VistaComarca, { nivel: 'explorada' }> | null {
    const c = this.vista.comarcas[id];
    return c?.nivel === 'explorada' ? c : null;
  }

  /** Las comarcas que el jugador conoce de algun modo, en orden de identificador. */
  conocidas(): IdComarca[] {
    return Object.keys(this.vista.comarcas).sort(comparar) as IdComarca[];
  }

  /** Vecinas conocidas de una comarca cuya geografia se conoce. */
  vecinas(id: string): IdComarca[] {
    if (this.geografia(id) === null) return [];
    return (this.mundo.vecinos[id] ?? []).filter((v) => this.nivel(v) !== 'desconocida');
  }

  /** Por donde se puede andar: lo explorado y lo propio (docs/03 §3.7). */
  transitable(id: string): boolean {
    const nivel = this.nivel(id);
    return nivel === 'explorada' || nivel === 'propia';
  }

  /**
   * Jornadas base desde una comarca a las que se pueden alcanzar pasando solo por lo transitable;
   * las oidas se alcanzan, pero no se cruzan. Dijkstra con desempate por identificador.
   */
  jornadasDesde(origen: IdComarca): Map<IdComarca, number> {
    const guardadas = this.distancias.get(origen);
    if (guardadas !== undefined) return guardadas;
    const distancias = this.jornadasDesdeVarias([origen]);
    this.distancias.set(origen, distancias);
    return distancias;
  }

  /**
   * La comarca propia mas cercana a otra, por jornadas base: adonde vuelve una recua que anda por
   * alli. A igual distancia, la capital y despues el orden de identificador.
   */
  casaMasCercana(desde: IdComarca): IdComarca {
    let mejor: { id: IdComarca; jornadas: number } = {
      id: this.capital,
      jornadas: Number.POSITIVE_INFINITY,
    };
    for (const comarca of this.propias) {
      const jornadas = this.jornadasDesde(comarca.id).get(desde) ?? Number.POSITIVE_INFINITY;
      if (jornadas < mejor.jornadas) mejor = { id: comarca.id, jornadas };
    }
    return mejor.id;
  }

  /** Jornadas desde la comarca propia mas cercana: lo que se anda fuera de casa. */
  jornadasDesdeLoPropio(): Map<IdComarca, number> {
    return this.jornadasDesdeVarias(this.propias.map((c) => c.id));
  }

  private jornadasDesdeVarias(origenes: readonly IdComarca[]): Map<IdComarca, number> {
    const distancia = new Map<IdComarca, number>(origenes.map((o) => [o, 0]));
    const hechas = new Set<string>();
    for (;;) {
      let actual: IdComarca | null = null;
      let mejor = Number.POSITIVE_INFINITY;
      for (const [id, d] of distancia) {
        if (hechas.has(id)) continue;
        if (d < mejor || (d === mejor && actual !== null && comparar(id, actual) < 0)) {
          actual = id;
          mejor = d;
        }
      }
      if (actual === null) return distancia;
      hechas.add(actual);
      if (!origenes.includes(actual) && !this.transitable(actual)) continue;
      for (const vecina of this.vecinas(actual)) {
        const nueva = mejor + this.jornadasDeTramo(actual, vecina);
        if (nueva < (distancia.get(vecina) ?? Number.POSITIVE_INFINITY)) {
          distancia.set(vecina, nueva);
        }
      }
    }
  }

  private jornadasDeTramo(a: string, b: string): number {
    return this.tramo(a, b)?.jornadasBase ?? 99;
  }

  /** El tramo entre dos comarcas vecinas, si se conoce la geografia de alguna de sus puntas. */
  tramo(a: string, b: string): Camino | null {
    if (this.geografia(a) === null && this.geografia(b) === null) return null;
    if (this.nivel(a) === 'desconocida' || this.nivel(b) === 'desconocida') return null;
    return (
      this.mundo.caminos.find(
        (c) => (c.desde === a && c.hasta === b) || (c.desde === b && c.hasta === a),
      ) ?? null
    );
  }

  // ——— Lo que dice el nucleo de los caminos, con lo que el jugador sabe ———————————————

  /**
   * La estacion de un turno, con los acontecimientos que el jugador conoce: unas nieves o una riada
   * de las que no se ha enterado no cuentan, como no contarian para quien mira el mapa.
   */
  estacional(turno: number): EstadoEstacional {
    return estadoEstacionalDe(turno, this.mundo, this.reglas, this.vista.acontecimientos);
  }

  /** Por donde puede trazar ruta el jugador: lo explorado, lo propio y la capital. */
  private transitables(): Set<string> {
    const transitables = comarcasTransitables(this.yo);
    for (const c of this.propias) transitables.add(c.id);
    return transitables;
  }

  /** La ruta que trazaria hoy el motor para una recua que sale de `desde` y para en `paradas`. */
  rutaDeRecua(desde: IdComarca, paradas: readonly IdComarca[]): Ruta | null {
    return rutaPorParadas(
      desde,
      paradas,
      false,
      this.mundo,
      this.estacional(this.turno),
      this.transitables(),
      this.reglas,
      this.vista.caminos,
    );
  }

  /**
   * La ruta que trazaria hoy el motor para un rebanyo: por las canyadas si puede, y sin entrar en
   * tierra ajena salvo por canyada con paso franco (la regla la pone el nucleo, no el robot).
   */
  rutaDeRebanyo(desde: IdComarca, hasta: IdComarca): Ruta | null {
    const sede = this.sede;
    if (sede === null) return null;
    // Para la regla de paso solo cuenta el duenyo de cada comarca: lo propio es lo que es, y de lo
    // explorado se sabe de quien era cuando se exploro. Si hoy ya no es neutral (la vista no da
    // influencia propia), es de otro aunque no se sepa de quien: cuenta como la de cualquier rival.
    const rival = this.vista.casas.find((c) => c.id !== this.yo.id)?.id ?? null;
    const comarcas: Record<string, EstadoComarca> = {};
    for (const c of this.propias) comarcas[c.id] = c;
    for (const id of this.conocidas()) {
      const sabido = this.explorada(id);
      if (sabido === null) continue;
      const duenyo = sabido.datos?.duenyo ?? (sabido.influenciaPropia === null ? rival : null);
      if (duenyo !== null && duenyo !== this.yo.id) comarcas[id] = { ...sede, id, duenyo };
    }
    return rutaPorParadas(
      desde,
      [hasta],
      false,
      this.mundo,
      this.estacional(this.turno),
      this.transitables(),
      this.reglas,
      this.vista.caminos,
      opcionesDeRutaDeRebanyo(comarcas, this.yo, this.reglas),
    );
  }

  /** Lo que cuesta un tramo de una ruta con la estacion dada, en milesimas, o `cerrado`. */
  costeDeTramo(
    desde: IdComarca,
    hasta: IdComarca,
    estacional: EstadoEstacional,
  ): number | 'cerrado' {
    const camino = this.caminoDeRuta(desde, hasta);
    return costeDeTramoMil(camino, estacional, this.reglas, this.vista.caminos);
  }

  /** El tramo tiene calzada: la recua anda una jornada mas por el. */
  calzadaEntre(desde: IdComarca, hasta: IdComarca): boolean {
    return tieneCalzada(this.caminoDeRuta(desde, hasta), this.vista.caminos);
  }

  /** Canyada real entre dos comarcas de una ruta: el ganado anda mas por ella. */
  canyadaEntre(desde: IdComarca, hasta: IdComarca): boolean {
    return this.caminoDeRuta(desde, hasta).canyada !== null;
  }

  /** Un tramo de una ruta que ha trazado el nucleo: existe siempre, y una punta es conocida. */
  private caminoDeRuta(desde: IdComarca, hasta: IdComarca): Camino {
    const camino = tramoEntre(this.mundo, desde, hasta);
    if (camino === undefined || this.tramo(desde, hasta) === null) {
      throw new Error(
        `El robot pregunta por el tramo ${desde}–${hasta}, que no esta en ninguna ruta que pueda conocer.`,
      );
    }
    return camino;
  }

  /** Donde esta una recua o un rebanyo: su comarca, o la de salida si va de camino. */
  static donde(unidad: Recua | Rebanyo): IdComarca {
    return unidad.situacion.donde === 'comarca' ? unidad.situacion.comarca : unidad.situacion.desde;
  }

  /** Quieta en una comarca, sin ruta. */
  static quieta(unidad: Recua | Rebanyo): boolean {
    return unidad.situacion.donde === 'comarca' && unidad.ruta.length === 0;
  }

  /** Ordenes vivas de la cola de una recua. */
  enColaDe(recua: Recua): Orden[] {
    const cola = `recua:${recua.id}`;
    return this.ordenes.filter((o) => o.cola === cola);
  }

  /** La recua no tiene nada pendiente: ni ruta, ni cola, ni ordenes sueltas que la citen. */
  libre(recua: Recua): boolean {
    if (!Tablero.quieta(recua)) return false;
    return !this.ordenes.some(
      (o) =>
        ((o.tipo === 'ruta' || o.tipo === 'carga' || o.tipo === 'cometido') &&
          o.recua === recua.id) ||
        (o.tipo === 'mercado' && o.recua === recua.id),
    );
  }

  /** Niveles que tendra un edificio en la comarca: hechos, en obra y en espera o en cola. */
  nivelPrevisto(comarca: EstadoComarca, edificio: string): number {
    const enObra = this.vista.obras.filter(
      (o) => o.comarca === comarca.id && o.tipo === 'edificio' && o.que === edificio,
    ).length;
    const pedidas = this.ordenes.filter(
      (o) =>
        o.tipo === 'construir' &&
        o.comarca === comarca.id &&
        o.edificio === edificio &&
        o.estado !== 'en curso',
    ).length;
    return (comarca.edificios[edificio] ?? 0) + enObra + pedidas;
  }

  /** Edificios y aperos esperando su turno en la cola de la comarca (las obras mayores, aparte). */
  obrasEnCola(comarca: IdComarca): number {
    return this.ordenes.filter(
      (o) =>
        (o.tipo === 'construir' || o.tipo === 'aperos') &&
        o.comarca === comarca &&
        o.estado !== 'en curso',
    ).length;
  }

  capacidad(comarca: EstadoComarca): number {
    return capacidadDe(comarca, this.reglas, this.casa.capacidadPorCasasExtra);
  }

  cuadrillas(comarca: EstadoComarca): number {
    return cuadrillasDe(comarca, this.reglas, this.casa.cuadrillasExtra);
  }

  /** Pan que se come cada turno: la gente de las comarcas propias y las cuadrillas en obra. */
  consumoDePan(): number {
    const p = this.reglas.poblacion;
    const gente = this.propias.reduce((total, c) => total + c.poblacion, 0);
    const cuadrillas = this.vista.obras.filter((o) => !o.abandonada).length;
    return (
      Math.ceil((gente * p.consumoPorVecinoMil) / 1000) +
      cuadrillas * this.reglas.consumo.panPorCuadrilla
    );
  }

  /** Lo que se comen cada turno los edificios de las comarcas propias (la carbonera, la madera). */
  consumoDe(recurso: Recurso): number {
    let total = 0;
    for (const comarca of this.propias) {
      for (const [edificio, nivel] of Object.entries(comarca.edificios)) {
        const datos = this.reglas.edificios[edificio as TipoEdificio];
        total += (datos.consumo[recurso] ?? 0) * nivel;
      }
    }
    return total;
  }

  /** Lo que las comarcas propias produjeron el turno pasado de un recurso. */
  produccion(recurso: Recurso): number {
    return this.propias.reduce((total, c) => total + c.produccionUltimoTurno[recurso], 0);
  }

  /** Las plazas cuyas comarcas conoce el jugador: las ferias de su geografia y los mercados. */
  plazasConocidas(): PlazaConocida[] {
    const plazas: PlazaConocida[] = [];
    for (const id of this.conocidas()) {
      const geografia = this.geografia(id);
      for (const feria of geografia?.ferias ?? []) {
        plazas.push({
          id: idDeMercadoDeFeria(feria.id),
          comarca: id,
          tipo: 'feria',
          turnos: feria.turnos,
        });
      }
      const edificios = this.esPropia(id)
        ? (this.propias.find((c) => c.id === id)?.edificios ?? {})
        : (this.explorada(id)?.datos?.edificios ?? {});
      // El mercado del pueblo y la venta del camino abren plaza igual (T-053).
      if ((edificios['mercado'] ?? 0) > 0 || (edificios['venta'] ?? 0) > 0) {
        plazas.push({ id: idDeMercadoLocal(id), comarca: id, tipo: 'local', turnos: [] });
      }
    }
    return plazas.sort((a, b) => comparar(a.id, b.id));
  }

  /** El precio de un recurso en una plaza, tal como se supo; si no se sabe, el base de alli. */
  precioMil(plaza: IdMercado, recurso: Recurso): number {
    return (
      this.yo.plazas[plaza]?.preciosMil[recurso] ?? this.baseEn(this.comarcaDePlaza(plaza), recurso)
    );
  }

  /**
   * El precio base de un recurso **en una comarca** (T-052): es la vara con la que hay que medir
   * lo caro y lo barato. Medir con el del catalogo lleva a vender sal a mitad de precio en una
   * comarca sin salinas, o a no comprarla nunca en una que las tiene.
   */
  baseEn(comarca: IdComarca | null, recurso: Recurso): number {
    return precioBaseLocalMil(
      this.reglas.recursos[recurso].precioBaseMil,
      comarca === null ? undefined : this.mundo.comarcas[comarca],
      recurso,
      this.reglas.mercado,
    );
  }

  /** La comarca de una plaza conocida, si se sabe cual es. */
  comarcaDePlaza(plaza: IdMercado): IdComarca | null {
    return this.plazasConocidas().find((conocida) => conocida.id === plaza)?.comarca ?? null;
  }

  /** Turnos que faltan para que abra una plaza de feria (0 si abre este turno). */
  turnosHastaQueAbra(plaza: PlazaConocida): number {
    return this.turnosHastaQueAbraEn(plaza, this.turno);
  }

  /** Turnos que faltan, contados desde el turno dado, para que la plaza este abierta. */
  turnosHastaQueAbraEn(plaza: PlazaConocida, turno: number): number {
    if (plaza.tipo === 'local') return 0;
    const anyo = this.reglas.estaciones.turnosPorAnyo;
    const delAnyo = ((turno - 1) % anyo) + 1;
    return Math.min(...plaza.turnos.map((t) => (t - delAnyo + anyo) % anyo));
  }

  /** Cuadrillas de la comarca que quedan libres sin contar lo que espera en su cola. */
  cuadrillasLibres(comarca: EstadoComarca): number {
    const ocupadas = this.vista.obras.filter(
      (o) => o.comarca === comarca.id && !o.abandonada,
    ).length;
    return this.cuadrillas(comarca) - ocupadas;
  }
}
