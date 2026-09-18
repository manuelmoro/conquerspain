// Validacion del catalogo geografico. Es la puerta por la que entra la peninsula al juego, y se
// escribe a mano region por region: mas vale que avise aqui, con la comarca y el campo, que
// descubrir en la partida que Soria tiene salinas.
import type { NivelPotencial, Potencial, Terreno } from '@conquer/nucleo';
import { POTENCIALES, TERRENOS } from '@conquer/nucleo';
import type { ErrorValidacion, Resultado, Validador } from '@conquer/nucleo';
import {
  booleano,
  entero,
  identificador,
  invalidos,
  lista,
  oNulo,
  objeto,
  registroCompleto,
  texto,
  unoDe,
  valido,
} from '@conquer/nucleo';

import { esRasgo } from './rasgos.ts';
import type { ComarcaCatalogo, LocalidadCatalogo } from './tipos.ts';

const RECUADRO = { lonMin: -9600, lonMax: 3450, latMin: 35850, latMax: 43900 };
const KM_POR_GRADO = 111.32;
const DISTANCIA_MAXIMA_KM = 60;

function par(): Validador<readonly [number, number]> {
  const validarLista = lista(entero(), { minimo: 2, maximo: 2 });
  return (dato, ruta) => {
    const resultado = validarLista(dato, ruta);
    if (!resultado.ok) return resultado;
    const [lon, lat] = resultado.valor;
    if (lon === undefined || lat === undefined) {
      return invalidos([{ ruta, mensaje: 'una coordenada son dos numeros: [longitud, latitud]' }]);
    }
    return valido([lon, lat] as const);
  };
}

function nivel(): Validador<NivelPotencial> {
  const validarEntero = entero({ minimo: 0, maximo: 5 });
  return (dato, ruta) => {
    const resultado = validarEntero(dato, ruta);
    return resultado.ok ? valido(resultado.valor as NivelPotencial) : resultado;
  };
}

const validarLocalidad: Validador<LocalidadCatalogo> = objeto<LocalidadCatalogo>({
  nombre: texto({ minimo: 2, maximo: 80 }),
  coord: par(),
  cabecera: oNulo(booleano()),
});

const validarComarca: Validador<ComarcaCatalogo> = objeto<ComarcaCatalogo>({
  id: identificador(),
  nombre: texto({ minimo: 2, maximo: 80 }),
  cabecera: texto({ minimo: 2, maximo: 80 }),
  region: texto({ minimo: 2, maximo: 80 }),
  centro: par(),
  terreno: unoDe(TERRENOS),
  potenciales: registroCompleto(POTENCIALES, nivel()),
  solares: entero({ minimo: 4, maximo: 8 }),
  poblacionInicial: entero({ minimo: 20, maximo: 120 }),
  localidades: lista(validarLocalidad, { minimo: 1, maximo: 6 }),
  rasgos: lista(texto({ minimo: 3 }), { maximo: 8 }),
  esOrigen: booleano(),
  nota: oNulo(texto({ maximo: 400 })),
});

/**
 * Lo que cabe esperar de cada terreno. Salirse de aqui no esta prohibido: obliga a escribir una
 * `nota` que lo justifique, que es como se documenta el criterio geografico.
 */
const HORQUILLAS: Readonly<Record<Terreno, Partial<Record<Potencial, readonly [number, number]>>>> =
  {
    llano: { labor: [2, 5], monte: [0, 3], pasto: [0, 3], piedra: [0, 3] },
    ondulado: { labor: [1, 4], monte: [1, 5], pasto: [1, 4], piedra: [0, 4] },
    sierra: { labor: [0, 2], monte: [1, 5], pasto: [2, 5], piedra: [1, 5] },
    costa: { labor: [1, 4], monte: [0, 3], pasto: [0, 3], pesca: [2, 5] },
    vega: { labor: [3, 5], monte: [0, 2], pasto: [0, 3], piedra: [0, 2] },
  };

function distanciaKm(a: readonly [number, number], b: readonly [number, number]): number {
  const latMedia = (a[1] + b[1]) / 2 / 1000;
  const dLat = ((a[1] - b[1]) / 1000) * KM_POR_GRADO;
  const dLon = ((a[0] - b[0]) / 1000) * KM_POR_GRADO * Math.cos((latMedia * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

function sumaDePotenciales(comarca: ComarcaCatalogo): number {
  return POTENCIALES.reduce((total, potencial) => total + comarca.potenciales[potencial], 0);
}

function comprobarCoherencia(comarca: ComarcaCatalogo, errores: ErrorValidacion[]): void {
  const ruta = (campo: string): string => `${comarca.id}.${campo}`;
  const rasgos = new Set(comarca.rasgos);

  const [lon, lat] = comarca.centro;
  if (
    lon < RECUADRO.lonMin ||
    lon > RECUADRO.lonMax ||
    lat < RECUADRO.latMin ||
    lat > RECUADRO.latMax
  ) {
    errores.push({
      ruta: ruta('centro'),
      mensaje: `el centro se sale del recuadro peninsular (lon ${String(RECUADRO.lonMin)}..${String(RECUADRO.lonMax)}, lat ${String(RECUADRO.latMin)}..${String(RECUADRO.latMax)})`,
    });
  }

  const cabeceras = comarca.localidades.filter((localidad) => localidad.cabecera === true);
  if (cabeceras.length !== 1) {
    errores.push({
      ruta: ruta('localidades'),
      mensaje: `tiene que haber exactamente una localidad cabecera y hay ${String(cabeceras.length)}`,
    });
  } else if (cabeceras[0]?.nombre !== comarca.cabecera) {
    errores.push({
      ruta: ruta('cabecera'),
      mensaje: `la cabecera dice "${comarca.cabecera}" y la localidad marcada es "${cabeceras[0]?.nombre ?? ''}"`,
    });
  }

  for (const localidad of comarca.localidades) {
    const distancia = distanciaKm(localidad.coord, comarca.centro);
    if (distancia > DISTANCIA_MAXIMA_KM) {
      errores.push({
        ruta: ruta(`localidades.${localidad.nombre}`),
        mensaje: `esta a ${String(Math.round(distancia))} km del centro de la comarca y el maximo son ${String(DISTANCIA_MAXIMA_KM)} km`,
      });
    }
  }

  if (comarca.potenciales.sal >= 3 && !rasgos.has('salinas-historicas')) {
    errores.push({
      ruta: ruta('potenciales.sal'),
      mensaje:
        'una comarca con sal 3 o mas necesita el rasgo "salinas-historicas": la sal solo esta donde la hubo',
    });
  }
  if (comarca.potenciales.hierro >= 3 && !rasgos.has('vena-de-hierro')) {
    errores.push({
      ruta: ruta('potenciales.hierro'),
      mensaje: 'una comarca con hierro 3 o mas necesita el rasgo "vena-de-hierro"',
    });
  }
  if (comarca.potenciales.pesca >= 1 && comarca.terreno !== 'costa') {
    errores.push({
      ruta: ruta('potenciales.pesca'),
      mensaje: 'solo las comarcas de costa pescan',
    });
  }
  if (comarca.potenciales.labor >= 4 && comarca.terreno !== 'llano' && comarca.terreno !== 'vega') {
    errores.push({
      ruta: ruta('potenciales.labor'),
      mensaje: 'labor 4 o mas solo en llano o vega: la meseta alta no da tanto',
    });
  }

  const suma = sumaDePotenciales(comarca);
  if (suma < 6 || suma > 18) {
    errores.push({
      ruta: ruta('potenciales'),
      mensaje: `la suma de potenciales es ${String(suma)} y tiene que estar entre 6 y 18: ninguna comarca es un paraiso ni un erial`,
    });
  }

  const esperados = 4 + Math.floor(suma / 5);
  if (Math.abs(comarca.solares - esperados) > 1) {
    errores.push({
      ruta: ruta('solares'),
      mensaje: `con una suma de potenciales de ${String(suma)} lo coherente serian ${String(esperados)} solares (±1), y hay ${String(comarca.solares)}`,
    });
  }

  for (const rasgo of comarca.rasgos) {
    if (!esRasgo(rasgo)) {
      errores.push({
        ruta: ruta('rasgos'),
        mensaje: `"${rasgo}" no esta en el catalogo cerrado de rasgos`,
      });
    }
  }

  const fuera: string[] = [];
  for (const potencial of POTENCIALES) {
    const horquilla = HORQUILLAS[comarca.terreno][potencial];
    if (horquilla === undefined) continue;
    const valor = comarca.potenciales[potencial];
    if (valor < horquilla[0] || valor > horquilla[1]) {
      fuera.push(
        `${potencial} ${String(valor)} (lo normal en ${comarca.terreno}: ${String(horquilla[0])}-${String(horquilla[1])})`,
      );
    }
  }
  if (fuera.length > 0 && (comarca.nota === null || comarca.nota.length < 10)) {
    errores.push({
      ruta: ruta('nota'),
      mensaje: `hace falta una nota que justifique ${fuera.join(', ')}`,
    });
  }
}

/** Valida una region entera del catalogo: forma de cada ficha y coherencia geografica. */
export function validarRegion(datos: unknown, archivo: string): Resultado<ComarcaCatalogo[]> {
  const forma = lista(validarComarca, { minimo: 1 })(datos, archivo);
  if (!forma.ok) return forma;
  const errores: ErrorValidacion[] = [];
  for (const comarca of forma.valor) comprobarCoherencia(comarca, errores);
  return errores.length > 0 ? invalidos(errores) : valido(forma.valor);
}

/** Comprobaciones que solo se pueden hacer con el catalogo entero delante. */
export function validarCatalogoCompleto(comarcas: readonly ComarcaCatalogo[]): ErrorValidacion[] {
  const errores: ErrorValidacion[] = [];
  const vistas = new Map<string, string>();
  for (const comarca of comarcas) {
    const anterior = vistas.get(comarca.id);
    if (anterior !== undefined) {
      errores.push({
        ruta: comarca.id,
        mensaje: `identificador repetido: ya lo usa una comarca de la region "${anterior}"`,
      });
    }
    vistas.set(comarca.id, comarca.region);
  }
  return errores;
}
