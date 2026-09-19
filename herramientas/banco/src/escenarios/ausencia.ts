// Comprobacion del principio fundacional (ficha T-045 §4.5): conectarse mas no puede dar ventaja.
//
// La misma estrategia se juega dos veces en el mundo de pruebas: (a) dando cada orden en su turno
// y (b) entrando solo cada seis turnos, con colas, plan y mayordomo que hacen lo mismo. Al turno
// 100 el prestigio de las dos tiene que diferir menos de un 5 %. Si no, la automatizacion no basta.
//
// Uso: npx tsx herramientas/banco/src/escenarios/ausencia.ts
import { fileURLToPath } from 'node:url';

import { costeDeEdificio, modificadoresDe, resolverTurno } from '@conquer/nucleo';
import type {
  EstadoPartida,
  IdComarca,
  IdJugador,
  IdOrden,
  IdRecua,
  Orden,
  OrdenBase,
  ReglaDeMayordomo,
  TipoEdificio,
} from '@conquer/nucleo';

import {
  estadoMini,
  mundoMini,
  tablasMini,
} from '../../../../paquetes/nucleo/pruebas/mundo-mini.ts';

const MUNDO = mundoMini();
const REGLAS = tablasMini();
const CAPITAL = 'prueba-llano' as IdComarca;

/** Lo que la estrategia quiere levantar en la capital, en este orden. */
const OBRAS: readonly TipoEdificio[] = [
  'aserradero',
  'granja',
  'casas',
  'aserradero',
  'huerta',
  'granero',
  'casas',
  'granja',
  'huerta',
  'molino',
];

/** Las comarcas que quiere explorar, en este orden: cada una se oye al explorar la anterior. */
const EXPLORAR: readonly string[] = ['prueba-vega', 'prueba-rio', 'prueba-costa'];

/** Dos reglas de gobierno: carga ligera en invierno, normal en primavera. */
const GOBIERNO: readonly ReglaDeMayordomo[] = [
  {
    prioridad: 1,
    condicion: { tipo: 'estacion-empieza', estacion: 'invierno' },
    accion: { tipo: 'carga-fiscal', comarca: CAPITAL, carga: 'ligera' },
  },
  {
    prioridad: 2,
    condicion: { tipo: 'estacion-empieza', estacion: 'primavera' },
    accion: { tipo: 'carga-fiscal', comarca: CAPITAL, carga: 'normal' },
  },
];

/** Quien juega: su identificador y el contador de ordenes para no repetirlos. */
class Jugador {
  private contador = 0;
  constructor(readonly id: IdJugador) {}

  base(estado: EstadoPartida, cambios: Partial<OrdenBase> = {}): OrdenBase {
    this.contador += 1;
    return {
      id: `orden-banco-${String(this.contador).padStart(4, '0')}` as IdOrden,
      jugador: this.id,
      turnoAlta: estado.turno,
      estado: 'pendiente',
      coste: { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 },
      turnosTotales: 1,
      turnosHechos: 0,
      motivoEspera: null,
      delMayordomo: false,
      turnoProgramado: null,
      cola: null,
      ...cambios,
    };
  }

  construir(estado: EstadoPartida, edificio: TipoEdificio, cola: string | null): Orden {
    const casa = modificadoresDe(estado, this.id, REGLAS);
    return {
      ...this.base(estado, { coste: costeDeEdificio(edificio, casa, REGLAS), cola }),
      tipo: 'construir',
      comarca: CAPITAL,
      edificio,
    };
  }

  formarRecua(estado: EstadoPartida): Orden {
    return {
      ...this.base(estado, {
        coste: { pan: 10, madera: 0, piedra: 0, maravedis: 20, sal: 0, hierro: 0, lana: 0 },
      }),
      tipo: 'formar-recua',
      comarca: CAPITAL,
      acemilas: 10,
      vecinos: 0,
    };
  }

  ir(estado: EstadoPartida, recua: IdRecua, comarca: string, cola: string | null): Orden {
    return {
      ...this.base(estado, { cola }),
      tipo: 'ruta',
      recua,
      rebanyo: null,
      paradas: [
        { comarca: comarca as IdComarca, cargar: {}, descargar: {}, vender: {}, comprar: {} },
      ],
      circular: false,
    };
  }

  explorar(estado: EstadoPartida, recua: IdRecua, cola: string | null): Orden {
    return { ...this.base(estado, { cola }), tipo: 'cometido', recua, cometido: 'explorar' };
  }

  politica(estado: EstadoPartida, carga: 'ligera' | 'normal'): Orden {
    return {
      ...this.base(estado),
      tipo: 'politica',
      comarca: CAPITAL,
      fuero: null,
      cargaFiscal: carga,
      dehesa: null,
      conservarConSal: null,
    };
  }

  mayordomo(estado: EstadoPartida, regla: ReglaDeMayordomo): Orden {
    return { ...this.base(estado), tipo: 'mayordomo', alta: regla, bajaPrioridad: null };
  }
}

function suRecua(estado: EstadoPartida, jugador: IdJugador) {
  return Object.values(estado.recuas).find((r) => r.jugador === jugador);
}

function puedePagar(estado: EstadoPartida, orden: Orden): boolean {
  const j = estado.jugadores[orden.jugador];
  if (j === undefined) return false;
  return (Object.keys(orden.coste) as (keyof typeof orden.coste)[]).every(
    (r) => j.almacen[r] - j.reservado[r] >= orden.coste[r],
  );
}

/** (a) El jugador diligente: entra cada turno y da cada orden cuando toca. */
function diligente(turnos: number): EstadoPartida {
  let estado = estadoMini();
  const yo = new Jugador(Object.keys(estado.jugadores)[0] as IdJugador);
  const pendientes = [...OBRAS];
  let siguienteDestino = 0;
  for (let t = 0; t < turnos; t += 1) {
    const ordenes: Orden[] = [];
    const vivas = estado.ordenes.filter((o) => o.jugador === yo.id);
    if (t === 0) ordenes.push(yo.formarRecua(estado));
    // Una obra cada vez que la cuadrilla queda libre: la primera de la lista que pueda pagar, como
    // haria su cola.
    const obraEnMarcha = Object.values(estado.obras).some((o) => o.jugador === yo.id);
    if (!obraEnMarcha && !vivas.some((o) => o.tipo === 'construir')) {
      const i = pendientes.findIndex((obra) =>
        puedePagar(estado, yo.construir(estado, obra, null)),
      );
      const obra = pendientes[i];
      if (obra !== undefined) {
        ordenes.push(yo.construir(estado, obra, null));
        pendientes.splice(i, 1);
      }
    }
    // La recua: a la siguiente comarca y, al llegar, a explorarla.
    const recua = suRecua(estado, yo.id);
    const destino = EXPLORAR[siguienteDestino];
    if (
      recua !== undefined &&
      destino !== undefined &&
      recua.ruta.length === 0 &&
      recua.cometido === null
    ) {
      const alli = recua.situacion.donde === 'comarca' && recua.situacion.comarca === destino;
      if (alli) {
        ordenes.push(yo.explorar(estado, recua.id, null));
        siguienteDestino += 1;
      } else if (!vivas.some((o) => o.tipo === 'ruta')) {
        ordenes.push(yo.ir(estado, recua.id, destino, null));
      }
    }
    // El gobierno, a mano, el turno en que cambia la estacion.
    const estacion = REGLAS.estaciones.estacionPorTurno[(estado.turno - 1) % 24];
    const antes = REGLAS.estaciones.estacionPorTurno[(estado.turno + 22) % 24];
    if (estacion !== antes && estacion === 'invierno') ordenes.push(yo.politica(estado, 'ligera'));
    if (estacion !== antes && estacion === 'primavera') ordenes.push(yo.politica(estado, 'normal'));
    estado = resolverTurno(estado, ordenes, MUNDO, REGLAS).estado;
  }
  return estado;
}

/** (b) El jugador ausente: entra cada seis turnos y deja colas, plan y mayordomo. */
function ausente(turnos: number): EstadoPartida {
  let estado = estadoMini();
  const yo = new Jugador(Object.keys(estado.jugadores)[0] as IdJugador);
  const colaDeObras = `comarca:${CAPITAL}`;
  let exploracionEnCola = false;
  for (let t = 0; t < turnos; t += 1) {
    const ordenes: Orden[] = [];
    if (t % 6 === 0) {
      if (t === 0) {
        ordenes.push(yo.formarRecua(estado));
        // Todas las obras, en cola: empiezan solas cuando hay cuadrilla y con que pagarlas.
        for (const obra of OBRAS) ordenes.push(yo.construir(estado, obra, colaDeObras));
        for (const regla of GOBIERNO) ordenes.push(yo.mayordomo(estado, regla));
      }
      const recua = suRecua(estado, yo.id);
      if (recua !== undefined && !exploracionEnCola) {
        const cola = `recua:${recua.id}`;
        for (const destino of EXPLORAR) {
          ordenes.push(yo.ir(estado, recua.id, destino, cola));
          ordenes.push(yo.explorar(estado, recua.id, cola));
        }
        exploracionEnCola = true;
      }
    }
    estado = resolverTurno(estado, ordenes, MUNDO, REGLAS).estado;
  }
  return estado;
}

export interface InformeDeAusencia {
  readonly turnos: number;
  readonly prestigioDiligente: number;
  readonly prestigioAusente: number;
  /** Diferencia relativa en milesimas, sobre el mayor de los dos. */
  readonly diferenciaMil: number;
}

export function compararAusencia(turnos = 100): InformeDeAusencia {
  const a = diligente(turnos);
  const b = ausente(turnos);
  const prestigio = (e: EstadoPartida) => Object.values(e.jugadores)[0]?.prestigio ?? 0;
  const pa = prestigio(a);
  const pb = prestigio(b);
  const mayor = Math.max(Math.abs(pa), Math.abs(pb), 1);
  return {
    turnos,
    prestigioDiligente: pa,
    prestigioAusente: pb,
    diferenciaMil: Math.floor((Math.abs(pa - pb) * 1000) / mayor),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const informe = compararAusencia();
  console.log(`Turnos: ${String(informe.turnos)}`);
  console.log(`Prestigio entrando cada turno:     ${String(informe.prestigioDiligente)}`);
  console.log(`Prestigio entrando cada seis:      ${String(informe.prestigioAusente)}`);
  console.log(`Diferencia: ${(informe.diferenciaMil / 10).toFixed(1)} % (tiene que ser < 5 %)`);
}
