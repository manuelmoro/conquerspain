// Mundo de pruebas: siete comarcas inventadas, con nombres claramente de prueba, para que los
// tests del motor no se rompan cuando crezca el catalogo real de la peninsula.
import type { EstadoPartida } from '../src/tipos/estado.ts';
import type { Mundo } from '../src/tipos/mundo.ts';
import { RECURSOS } from '../src/tipos/recursos.ts';
import { VERSION_REGLAS } from '../src/tipos/reglas.ts';
import type { TablasDeReglas } from '../src/tipos/reglas.ts';
import { validarEstado } from '../src/validacion/validarEstado.ts';
import { validarMundo } from '../src/validacion/validarMundo.ts';
import { validarTablas } from '../src/validacion/validarTablas.ts';
import { explicar } from '../src/validacion/validador.ts';
import { tablasDeEjemplo } from './ejemplos.ts';

type Registro = Record<string, unknown>;

interface Plantilla {
  readonly id: string;
  readonly nombre: string;
  readonly terreno: string;
  readonly labor: number;
  readonly monte: number;
  readonly pasto: number;
  readonly piedra: number;
  readonly hierro: number;
  readonly sal: number;
  readonly pesca: number;
  readonly vecinos: readonly string[];
}

const COMARCAS: readonly Plantilla[] = [
  {
    id: 'prueba-vega',
    nombre: 'Vega de Prueba',
    terreno: 'vega',
    labor: 5,
    monte: 1,
    pasto: 2,
    piedra: 0,
    hierro: 0,
    sal: 0,
    pesca: 0,
    vecinos: ['prueba-llano', 'prueba-rio'],
  },
  {
    id: 'prueba-llano',
    nombre: 'Llano de Prueba',
    terreno: 'llano',
    labor: 3,
    monte: 1,
    pasto: 2,
    piedra: 1,
    hierro: 0,
    sal: 0,
    pesca: 0,
    vecinos: ['prueba-vega', 'prueba-monte', 'prueba-rio'],
  },
  {
    id: 'prueba-monte',
    nombre: 'Monte de Prueba',
    terreno: 'ondulado',
    labor: 1,
    monte: 5,
    pasto: 3,
    piedra: 2,
    hierro: 0,
    sal: 0,
    pesca: 0,
    vecinos: ['prueba-llano', 'prueba-sierra'],
  },
  {
    id: 'prueba-sierra',
    nombre: 'Sierra de Prueba',
    terreno: 'sierra',
    labor: 1,
    monte: 3,
    pasto: 5,
    piedra: 4,
    hierro: 2,
    sal: 0,
    pesca: 0,
    vecinos: ['prueba-monte', 'prueba-mina'],
  },
  {
    id: 'prueba-mina',
    nombre: 'Mina de Prueba',
    terreno: 'sierra',
    labor: 1,
    monte: 2,
    pasto: 2,
    piedra: 3,
    hierro: 5,
    sal: 0,
    pesca: 0,
    vecinos: ['prueba-sierra'],
  },
  {
    id: 'prueba-rio',
    nombre: 'Rio de Prueba',
    terreno: 'llano',
    labor: 3,
    monte: 2,
    pasto: 2,
    piedra: 1,
    hierro: 0,
    sal: 3,
    pesca: 0,
    vecinos: ['prueba-vega', 'prueba-llano', 'prueba-costa'],
  },
  {
    id: 'prueba-costa',
    nombre: 'Costa de Prueba',
    terreno: 'costa',
    labor: 2,
    monte: 1,
    pasto: 1,
    piedra: 1,
    hierro: 0,
    sal: 4,
    pesca: 5,
    vecinos: ['prueba-rio'],
  },
];

function comarcaDeMundo(plantilla: Plantilla, indice: number): Registro {
  const rasgos: string[] = [];
  if (plantilla.sal >= 3) rasgos.push('salinas-historicas');
  if (plantilla.hierro >= 3) rasgos.push('vena-de-hierro');
  if (plantilla.pasto >= 4) rasgos.push('pasto-de-verano');
  const lon = -3000 + indice * 200;
  const lat = 41000 + indice * 100;
  return {
    id: plantilla.id,
    nombre: plantilla.nombre,
    cabecera: plantilla.nombre,
    region: '00-prueba',
    centro: [lon, lat],
    poligono: [
      [indice * 10, 0],
      [indice * 10 + 10, 0],
      [indice * 10 + 10, 10],
      [indice * 10, 10],
    ],
    terreno: plantilla.terreno,
    potenciales: {
      labor: plantilla.labor,
      monte: plantilla.monte,
      pasto: plantilla.pasto,
      piedra: plantilla.piedra,
      hierro: plantilla.hierro,
      sal: plantilla.sal,
      pesca: plantilla.pesca,
    },
    solares: 6,
    poblacionInicial: 40,
    localidades: [{ nombre: plantilla.nombre, coord: [lon, lat], cabecera: true }],
    rasgos,
    ferias: [],
    esOrigen: plantilla.labor >= 3,
  };
}

/** El mundo mini, ya validado: si alguien lo estropea, falla al cargarlo y no en mitad de un test. */
export function mundoMini(): Mundo {
  const comarcas: Registro = {};
  const vecinos: Registro = {};
  const caminos: Registro[] = [];
  COMARCAS.forEach((plantilla, indice) => {
    comarcas[plantilla.id] = comarcaDeMundo(plantilla, indice);
    vecinos[plantilla.id] = [...plantilla.vecinos].sort((a, b) => (a < b ? -1 : 1));
    for (const vecino of plantilla.vecinos) {
      if (plantilla.id < vecino) {
        caminos.push({
          desde: plantilla.id,
          hasta: vecino,
          terreno: plantilla.terreno,
          jornadasBase: plantilla.terreno === 'sierra' ? 5 : 2,
          vado: false,
          puertoDeMontanya: plantilla.terreno === 'sierra' ? 'Puerto de Prueba' : null,
          cierraEnInvierno: plantilla.terreno === 'sierra',
          canyada: null,
          calzadaRomana: false,
        });
      }
    }
  });

  const resultado = validarMundo({ version: 'mini', comarcas, caminos, vecinos });
  if (!resultado.ok) {
    throw new Error(`El mundo mini no valida:\n${explicar(resultado.errores)}`);
  }
  return resultado.valor;
}

function recursos(cantidades: Record<string, number>): Record<string, number> {
  const base: Record<string, number> = {};
  for (const recurso of RECURSOS) base[recurso] = 0;
  return { ...base, ...cantidades };
}

function comarcaDeEstado(plantilla: Plantilla, duenyo: string | null): Registro {
  return {
    id: plantilla.id,
    duenyo,
    poblacion: plantilla.id === 'prueba-llano' ? 40 : 20,
    lealtad: duenyo === null ? 50 : 100,
    edificios: duenyo === null ? {} : { granja: 1 },
    aperos: 0,
    fuero: 'ninguno',
    cargaFiscal: 'normal',
    dehesa: false,
    potenciales: {
      labor: plantilla.labor,
      monte: plantilla.monte,
      pasto: plantilla.pasto,
      piedra: plantilla.piedra,
      hierro: plantilla.hierro,
      sal: plantilla.sal,
      pesca: plantilla.pesca,
    },
    agotamiento: { monte: 0, piedra: 0, hierro: 0, sal: 0 },
    influencias: {},
    turnosDesleal: 0,
    produccionUltimoTurno: recursos({}),
  };
}

/** Estado inicial de la partida de pruebas: un jugador en el llano, seis comarcas neutrales. */
export function estadoMini(): EstadoPartida {
  const comarcas: Registro = {};
  for (const plantilla of COMARCAS) {
    comarcas[plantilla.id] = comarcaDeEstado(
      plantilla,
      plantilla.id === 'prueba-llano' ? 'casa-uno' : null,
    );
  }

  const estado: Registro = {
    version: VERSION_REGLAS,
    id: 'partida-mini',
    semilla: 'semilla-mini',
    turno: 1,
    configuracion: {
      nombre: 'Partida mini',
      intervaloMinutos: 60,
      modo: 'solitario',
      turnosDeTemporada: null,
      reservaMinimaDePan: 30,
      esDePrueba: true,
    },
    jugadores: {
      'casa-uno': {
        id: 'casa-uno',
        nombre: 'Casa Uno',
        casa: 'mesta',
        tradiciones: [],
        capital: 'prueba-llano',
        almacen: recursos({ pan: 80, madera: 60, piedra: 20, maravedis: 45 }),
        reservado: recursos({}),
        prestigio: 0,
        credito: 50,
        hitos: {},
        conocimiento: {
          'prueba-llano': { nivel: 'propia', turnoUltimaNoticia: 1, datos: null },
          'prueba-vega': { nivel: 'oida', turnoUltimaNoticia: 1, datos: null },
        },
        escasez: false,
        escasezSeguidas: 0,
        turnosSinOrdenes: 0,
      },
    },
    comarcas,
    recuas: {},
    rebanyos: {},
    obras: {},
    mercados: {},
    acontecimientos: [],
    ordenes: [],
    siguienteId: 1,
    huellaTurnoAnterior: null,
  };

  const resultado = validarEstado(estado, mundoMini());
  if (!resultado.ok) {
    throw new Error(`El estado mini no valida:\n${explicar(resultado.errores)}`);
  }
  return resultado.valor;
}

/** Tablas de reglas para las pruebas del motor. */
export function tablasMini(): TablasDeReglas {
  const resultado = validarTablas(tablasDeEjemplo());
  if (!resultado.ok) {
    throw new Error(`Las tablas de prueba no validan:\n${explicar(resultado.errores)}`);
  }
  return resultado.valor;
}
