// Las ordenes que da un robot, con el coste que reservaria el servidor (T-062).
//
// El motor paga lo que dice `coste`, asi que se calcula con las mismas funciones del nucleo que
// usara el servidor. Los identificadores llevan el jugador y el turno: un robot decide una vez por
// turno como mucho, asi que nunca se repiten.
import {
  costeDeAperos,
  costeDeEdificio,
  costeDeObraMayor,
  costeDeRebanyo,
  costeDeRecua,
} from '@conquer/nucleo';
import type {
  AccionDeMayordomo,
  CondicionDeMayordomo,
  CargaFiscal,
  Cometido,
  Fuero,
  IdComarca,
  IdMercado,
  IdOrden,
  IdRebanyo,
  IdRecua,
  Orden,
  OrdenBase,
  ParadaDeRuta,
  Recurso,
  Recursos,
  TipoEdificio,
  TipoObraMayor,
  Tradicion,
} from '@conquer/nucleo';

import type { Tablero } from './tablero.ts';

export type Cantidades = Readonly<Partial<Record<Recurso, number>>>;

const NADA: Recursos = { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 };

/** Una parada donde solo se carga y se descarga. */
export function parada(comarca: IdComarca, cambios: Partial<ParadaDeRuta> = {}): ParadaDeRuta {
  return { comarca, cargar: {}, descargar: {}, vender: {}, comprar: {}, ...cambios };
}

export class Pedidos {
  private readonly lista: Orden[] = [];

  constructor(private readonly t: Tablero) {}

  get ordenes(): readonly Orden[] {
    return this.lista;
  }

  get cuantas(): number {
    return this.lista.length;
  }

  /** Lo que ya reservan las ordenes de este turno que no van en cola. */
  reservado(recurso: Recurso): number {
    return this.lista
      .filter((o) => o.cola === null)
      .reduce((total, o) => total + o.coste[recurso], 0);
  }

  /** Se puede pagar ya, contando lo que reservan las ordenes que el robot acaba de dar. */
  alcanza(coste: Recursos): boolean {
    return (Object.keys(coste) as Recurso[]).every(
      (r) => this.t.disponible(r) - this.reservado(r) >= coste[r],
    );
  }

  private base(cambios: Partial<OrdenBase> = {}): OrdenBase {
    const numero = String(this.lista.length + 1).padStart(2, '0');
    return {
      id: `r-${this.t.yo.id}-${String(this.t.turno)}-${numero}` as IdOrden,
      jugador: this.t.yo.id,
      turnoAlta: this.t.turno,
      estado: 'pendiente',
      coste: NADA,
      turnosTotales: 1,
      turnosHechos: 0,
      motivoEspera: null,
      delMayordomo: false,
      turnoProgramado: null,
      cola: null,
      ...cambios,
    };
  }

  private dar(orden: Orden): Orden {
    this.lista.push(orden);
    return orden;
  }

  /** Un edificio, en la cola de su comarca: empieza cuando haya cuadrilla y con que pagarlo. */
  construir(comarca: IdComarca, edificio: TipoEdificio): Orden {
    const coste = costeDeEdificio(edificio, this.t.casa, this.t.reglas);
    return this.dar({
      ...this.base({ coste, cola: `comarca:${comarca}` }),
      tipo: 'construir',
      comarca,
      edificio,
    });
  }

  /** Derribar un nivel de un edificio, en la cola de su comarca: deja el solar libre. */
  derribar(comarca: IdComarca, edificio: TipoEdificio): Orden {
    return this.dar({
      ...this.base({ cola: `comarca:${comarca}` }),
      tipo: 'derribar',
      comarca,
      edificio,
    });
  }

  obraMayor(comarca: IdComarca, obra: TipoObraMayor, hacia: IdComarca | null = null): Orden {
    const coste = costeDeObraMayor(obra, this.t.casa, this.t.reglas);
    return this.dar({
      ...this.base({ coste, cola: `comarca:${comarca}` }),
      tipo: 'obra-mayor',
      comarca,
      obra,
      hacia,
      continuar: null,
      abandonar: false,
    });
  }

  aperos(comarca: IdComarca): Orden {
    return this.dar({
      ...this.base({ coste: costeDeAperos(this.t.reglas), cola: `comarca:${comarca}` }),
      tipo: 'aperos',
      comarca,
    });
  }

  formarRecua(comarca: IdComarca, vecinos = 0): Orden {
    return this.dar({
      ...this.base({ coste: costeDeRecua(this.t.casa, this.t.reglas) }),
      tipo: 'formar-recua',
      comarca,
      acemilas: this.t.reglas.movimiento.acemilasPorRecua,
      vecinos,
    });
  }

  formarRebanyo(comarca: IdComarca): Orden {
    return this.dar({
      ...this.base({ coste: costeDeRebanyo(this.t.casa, this.t.reglas) }),
      tipo: 'formar-rebanyo',
      comarca,
      cabezas: this.t.reglas.ganaderia.cabezasPorRebanyo,
    });
  }

  /** Una ruta de recua, en su cola: sale cuando acabe lo anterior. */
  ruta(recua: IdRecua, paradas: readonly ParadaDeRuta[], circular = false): Orden {
    return this.dar({
      ...this.base({ cola: `recua:${recua}` }),
      tipo: 'ruta',
      recua,
      rebanyo: null,
      paradas,
      circular,
    });
  }

  /** Ir a una comarca sin mas. */
  ir(recua: IdRecua, comarca: IdComarca): Orden {
    return this.ruta(recua, [parada(comarca)]);
  }

  moverRebanyo(rebanyo: IdRebanyo, comarca: IdComarca): Orden {
    return this.dar({
      ...this.base(),
      tipo: 'ruta',
      recua: null,
      rebanyo,
      paradas: [parada(comarca)],
      circular: false,
    });
  }

  carga(recua: IdRecua, cargar: Cantidades, descargar: Cantidades, vecinos = 0): Orden {
    this.t.apartar(cargar);
    return this.dar({
      ...this.base({ cola: `recua:${recua}` }),
      tipo: 'carga',
      recua,
      cargar,
      descargar,
      vecinosCargados: vecinos,
    });
  }

  cometido(recua: IdRecua, cometido: Cometido): Orden {
    return this.dar({
      ...this.base({ cola: `recua:${recua}` }),
      tipo: 'cometido',
      recua,
      cometido,
    });
  }

  /** Comprar o vender con una recua que trata en la plaza; dura `turnos` turnos de plaza abierta. */
  mercado(
    recua: IdRecua,
    mercado: IdMercado,
    recurso: Recurso,
    operacion: 'comprar' | 'vender',
    cantidad: number,
    precioLimiteMil: number,
    turnos: number,
  ): Orden {
    return this.dar({
      ...this.base({ turnosTotales: turnos }),
      tipo: 'mercado',
      mercado,
      recua,
      recurso,
      operacion,
      cantidad,
      precioLimiteMil,
    });
  }

  regalo(comarca: IdComarca): Orden {
    const coste = { ...NADA, maravedis: this.t.reglas.influencia.costeRegalo };
    return this.dar({ ...this.base({ coste }), tipo: 'regalo', comarca });
  }

  incorporar(comarca: IdComarca): Orden {
    const i = this.t.reglas.influencia;
    return this.dar({
      ...this.base({ coste: i.costeIncorporar, turnosTotales: i.turnosIncorporar }),
      tipo: 'incorporar',
      comarca,
    });
  }

  /** Fuero y carga fiscal de una comarca; null deja lo que haya. */
  politica(comarca: IdComarca, fuero: Fuero | null, carga: CargaFiscal | null): Orden {
    return this.dar({
      ...this.base(),
      tipo: 'politica',
      comarca,
      fuero,
      cargaFiscal: carga,
      dehesa: null,
      conservarConSal: null,
    });
  }

  tradicion(tradicion: Tradicion): Orden {
    return this.dar({ ...this.base(), tipo: 'tradicion', tradicion });
  }

  mayordomo(prioridad: number, condicion: CondicionDeMayordomo, accion: AccionDeMayordomo): Orden {
    return this.dar({
      ...this.base(),
      tipo: 'mayordomo',
      alta: { prioridad, condicion, accion },
      bajaPrioridad: null,
    });
  }
}
