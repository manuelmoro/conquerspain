// Ejemplos minimos y validos para las pruebas de validacion. No son datos de juego: son la
// plantilla mas pequenya que el motor acepta, y sirven para comprobar que los validadores
// rechazan lo que tienen que rechazar.
import { POTENCIALES } from '../src/tipos/mundo.ts';
import { RECURSOS } from '../src/tipos/recursos.ts';
import { ARRANQUE } from '../src/datos/arranque.ts';
import { COMETIDOS_DE_RECUA } from '../src/datos/cometidos.ts';
import { CONSUMO } from '../src/datos/consumo.ts';
import { EDIFICIOS } from '../src/datos/edificios.ts';
import { INFLUENCIA } from '../src/datos/influencia.ts';
import { MERCADO } from '../src/datos/mercado.ts';
import { MOVIMIENTO } from '../src/datos/movimiento.ts';
import { OBRAS, OBRAS_MAYORES } from '../src/datos/obras.ts';
import { POBLACION } from '../src/datos/poblacion.ts';
import { PRODUCCION } from '../src/datos/produccion.ts';
import { DATOS_DE_RECURSOS } from '../src/datos/recursos.ts';
import { TERRITORIO } from '../src/datos/territorio.ts';
import { CASAS, VERSION_REGLAS } from '../src/tipos/reglas.ts';

/** Los ejemplos son datos sueltos: los validadores reciben "unknown" y ellos dicen si valen. */
export type Registro = Record<string, unknown>;

/** Copia con un campo cambiado, para escribir casos invalidos sin repetir el ejemplo entero. */
export function con(base: Registro, cambios: Registro): Registro {
  return { ...base, ...cambios };
}

/** Copia con un campo anidado cambiado: `dentro(estado, 'jugadores', 'mesta', { credito: -1 })`. */
export function dentro(
  base: Registro,
  clave: string,
  subclave: string,
  cambios: Registro,
): Registro {
  const rama = { ...(base[clave] as Registro) };
  const hijo = { ...(rama[subclave] as Registro) };
  rama[subclave] = { ...hijo, ...cambios };
  return { ...base, [clave]: rama };
}

function sinRecursos(): Record<string, number> {
  const vacio: Record<string, number> = {};
  for (const recurso of RECURSOS) vacio[recurso] = 0;
  return vacio;
}

export function recursosCon(cantidades: Record<string, number>): Record<string, number> {
  return { ...sinRecursos(), ...cantidades };
}

function potencialesLlanos(): Record<string, number> {
  const potenciales: Record<string, number> = {};
  for (const potencial of POTENCIALES) potenciales[potencial] = 2;
  return potenciales;
}

export function mundoDeEjemplo(): Registro {
  const comarca = (id: string, cabecera: string): Registro => ({
    id,
    nombre: cabecera,
    cabecera,
    region: 'prueba',
    centro: [-2920, 41920],
    poligono: [
      [0, 0],
      [10, 0],
      [10, 10],
    ],
    terreno: 'llano',
    potenciales: potencialesLlanos(),
    solares: 6,
    poblacionInicial: 40,
    localidades: [{ nombre: cabecera, coord: [-2879, 41934], cabecera: true }],
    rasgos: [],
    ferias: [],
    esOrigen: true,
  });

  return {
    version: 'prueba',
    comarcas: {
      'prueba-llano': comarca('prueba-llano', 'Llano'),
      'prueba-sierra': comarca('prueba-sierra', 'Sierra'),
    },
    caminos: [
      {
        desde: 'prueba-llano',
        hasta: 'prueba-sierra',
        terreno: 'llano',
        jornadasBase: 2,
        vado: false,
        puertoDeMontanya: null,
        cierraEnInvierno: false,
        canyada: null,
        calzadaRomana: false,
      },
    ],
    vecinos: {
      'prueba-llano': ['prueba-sierra'],
      'prueba-sierra': ['prueba-llano'],
    },
  };
}

export function ordenDeEjemplo(): Registro {
  return {
    id: 'orden-1',
    jugador: 'mesta',
    turnoAlta: 1,
    estado: 'pendiente',
    coste: recursosCon({ madera: 20, maravedis: 10 }),
    turnosTotales: 2,
    turnosHechos: 0,
    motivoEspera: null,
    delMayordomo: false,
    tipo: 'construir',
    comarca: 'prueba-llano',
    edificio: 'granja',
  };
}

export function estadoDeEjemplo(): Registro {
  const comarca = (id: string, duenyo: string | null): Registro => ({
    id,
    duenyo,
    poblacion: 40,
    lealtad: 100,
    edificios: { granja: 1 },
    aperos: 0,
    fuero: 'ninguno',
    turnoFuero: 0,
    cargaFiscal: 'normal',
    dehesa: false,
    potenciales: potencialesLlanos(),
    agotamiento: { monte: 0, piedra: 0, hierro: 0, sal: 0 },
    influencias: duenyo === null ? { mesta: 10 } : {},
    presenciaSeguida: {},
    ultimoRegalo: {},
    exDuenyo: null,
    turnosDesleal: 0,
    turnosSinMantenimiento: 0,
    obrasMayores: [],
    produccionUltimoTurno: sinRecursos(),
  });

  return {
    version: VERSION_REGLAS,
    id: 'partida-prueba',
    semilla: 'semilla-de-prueba',
    turno: 1,
    configuracion: {
      nombre: 'Partida de prueba',
      intervaloMinutos: 60,
      modo: 'solitario',
      turnosDeTemporada: null,
      reservaMinimaDePan: 30,
      esDePrueba: true,
    },
    jugadores: {
      mesta: {
        id: 'mesta',
        nombre: 'Casa de prueba',
        casa: 'mesta',
        tradiciones: [],
        capital: 'prueba-llano',
        almacen: recursosCon({ pan: 80, madera: 60 }),
        reservado: sinRecursos(),
        prestigio: 0,
        credito: 50,
        hitos: {},
        conocimiento: {
          'prueba-llano': { nivel: 'propia', turnoUltimaNoticia: 1, datos: null },
        },
        escasez: false,
        escasezSeguidas: 0,
        conservarConSal: true,
        deudaAdministracion: 0,
        traslado: null,
        turnosSinOrdenes: 0,
      },
    },
    comarcas: {
      'prueba-llano': comarca('prueba-llano', 'mesta'),
      'prueba-sierra': comarca('prueba-sierra', null),
    },
    recuas: {},
    rebanyos: {},
    obras: {},
    caminos: {},
    mercados: {},
    acontecimientos: [],
    ordenes: [],
    siguienteId: 1,
    huellaTurnoAnterior: null,
  };
}

export function tablasDeEjemplo(): Registro {
  const recursos = JSON.parse(JSON.stringify(DATOS_DE_RECURSOS)) as Registro;

  // Los edificios y la cadena de produccion son las tablas reales del juego (src/datos).
  const edificios = JSON.parse(JSON.stringify(EDIFICIOS)) as Registro;

  const modificadores: Registro = {
    produccionMil: {},
    costeEdificioMil: {},
    nivelMaximoEdificio: {},
    potencialMinimoEdificio: {},
    solaresExtra: 0,
    aperosMaximo: 3,
    pasoRecuaMil: 0,
    costeRecuaMil: 1000,
    porteExtra: 0,
    obraMayorCosteMil: 1000,
    obraMayorAvanceMil: 1000,
    obraSinFrenazoInvernal: false,
    mermaPanMil: 40,
    comisionMercadoMil: 20,
    lanaEsquileoMil: 1000,
    costeRebanyoMil: 1000,
    lealtadMinima: 0,
    agotamientoMonteMil: 1000,
    crecimientoMil: 1000,
  };

  const casas: Registro = {};
  for (const casa of CASAS) {
    casas[casa] = {
      nombre: casa,
      privilegio: 'privilegio de prueba',
      herramienta: 'herramienta de prueba',
      limite: 'limite de prueba',
      modificadores,
      permisos: {
        pasoFrancoPorCanyada: false,
        obraEnComarcaAjena: false,
        letraDeCambio: false,
        cobrarPortazgo: false,
        venderAperos: false,
        acequiaMenor: false,
        cartaPuebla: false,
      },
      prohibiciones: {
        roturar: false,
        cargaFiscalDura: false,
        catedral: false,
        cobrarPortazgo: false,
      },
      potencialesDeOrigen: {},
    };
  }

  const estacionPorTurno: string[] = [];
  for (let turno = 1; turno <= 24; turno += 1) {
    const mes = Math.floor((turno - 1) / 2) + 1;
    estacionPorTurno.push(
      mes <= 2 || mes === 12 ? 'invierno' : mes <= 5 ? 'primavera' : mes <= 8 ? 'verano' : 'otonyo',
    );
  }

  const factorPanMil: Registro = {};
  // El pan sigue la estacion: el verano llena el granero y el invierno lo vacia (docs/03 §3.4).
  Object.assign(factorPanMil, { primavera: 800, verano: 1600, otonyo: 1000, invierno: 600 });

  return {
    version: VERSION_REGLAS,
    recursos,
    edificios,
    casas,
    tradiciones: {
      'mesta-lanas-finas': {
        casa: 'mesta',
        ronda: 'renombre',
        nombre: 'Lanas finas',
        descripcion: 'Merinas de vellon corto.',
        nota: 'La lana castellana se pagaba por su finura.',
        modificadores,
        desactivada: false,
      },
    },
    estaciones: {
      turnosPorAnyo: 24,
      estacionPorTurno,
      factorPanMil,
      factorObraPiedraMil: { primavera: 1000, verano: 1000, otonyo: 1000, invierno: 2000 },
      factorObraMaderaMil: { primavera: 1000, verano: 1000, otonyo: 1000, invierno: 1500 },
      turnosDeBarro: [5, 21],
      turnoDeEsquileo: 10,
      turnosPastoDeVerano: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    },
    produccion: JSON.parse(JSON.stringify(PRODUCCION)) as Registro,
    consumo: JSON.parse(JSON.stringify(CONSUMO)) as Registro,
    movimiento: JSON.parse(JSON.stringify(MOVIMIENTO)) as Registro,
    cometidos: JSON.parse(JSON.stringify(COMETIDOS_DE_RECUA)) as Registro,
    obras: JSON.parse(JSON.stringify(OBRAS)) as Registro,
    obrasMayores: JSON.parse(JSON.stringify(OBRAS_MAYORES)) as Registro,
    poblacion: JSON.parse(JSON.stringify(POBLACION)) as Registro,
    territorio: JSON.parse(JSON.stringify(TERRITORIO)) as Registro,
    mercado: JSON.parse(JSON.stringify(MERCADO)) as Registro,
    influencia: JSON.parse(JSON.stringify(INFLUENCIA)) as Registro,
    prestigio: {
      porCadaCincoVecinos: 1,
      porComarca: 20,
      porComarcaConFuero: 30,
      porObraMayor: { catedral: 250, calzada: 150, puente: 120 },
      porTramoDeCamino: 15,
      porFeriaDestacada: 30,
      porPrimicia: 50,
      porComarcaExplorada: 3,
      porAnyoTrashumante: 10,
      porAperosAltos: 10,
      penalizacionPorComarcaPerdida: 20,
      penalizacionPorEscasez: 1,
    },
    arranque: JSON.parse(JSON.stringify(ARRANQUE)) as Registro,
  };
}
