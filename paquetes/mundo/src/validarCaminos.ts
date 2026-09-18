// Validacion de la capa historica de caminos (T-013): puertos, vados, calzadas y canyadas.
//
// Lo que se comprueba aqui es que los datos hablen del mapa que existe: que las comarcas esten,
// que los pares sean vecinos de verdad y que cada ruta sea un camino contiguo del grafo. Un error
// aqui es un dato historico mal puesto, y se dice con nombre y apellidos.
import type { ComarcaMundo, ErrorValidacion, Mundo, Resultado, Validador } from '@conquer/nucleo';
import {
  entero,
  identificador,
  invalidos,
  lista,
  objeto,
  oNulo,
  texto,
  unoDe,
  valido,
} from '@conquer/nucleo';

export const CIERRES = ['invierno', 'ninguno'] as const;
export type CierreDePuerto = (typeof CIERRES)[number];

export interface PuertoCatalogo {
  readonly nombre: string;
  readonly entre: readonly [string, string];
  readonly altitud: number;
  readonly cierre: CierreDePuerto;
  readonly nota: string | null;
}

export interface VadoCatalogo {
  readonly entre: readonly [string, string];
  readonly rio: string;
}

export interface RutaCatalogo {
  readonly nombre: string;
  readonly comarcas: readonly string[];
  readonly nota: string | null;
}

export interface CaminosCatalogo {
  readonly puertos: readonly PuertoCatalogo[];
  readonly vados: readonly VadoCatalogo[];
  readonly calzadas: readonly RutaCatalogo[];
  readonly canyadas: readonly RutaCatalogo[];
}

/** Longitud de una canyada real, en comarcas (ficha T-013 §4.2). */
const CANYADA_MINIMA = 8;
const CANYADA_MAXIMA = 16;

function par(): Validador<readonly [string, string]> {
  const validarLista = lista(identificador(), { minimo: 2, maximo: 2 });
  return (dato, ruta) => {
    const resultado = validarLista(dato, ruta);
    if (!resultado.ok) return resultado;
    const [a, b] = resultado.valor;
    if (a === undefined || b === undefined) {
      return invalidos([{ ruta, mensaje: 'un tramo son dos comarcas' }]);
    }
    if (a === b) return invalidos([{ ruta, mensaje: `"${a}" no puede lindar consigo misma` }]);
    return valido([a, b] as const);
  };
}

const validarPuerto: Validador<PuertoCatalogo> = objeto<PuertoCatalogo>({
  nombre: texto({ minimo: 3, maximo: 80 }),
  entre: par(),
  altitud: entero({ minimo: 100, maximo: 3000 }),
  cierre: unoDe(CIERRES),
  nota: oNulo(texto({ maximo: 400 })),
});

const validarVado: Validador<VadoCatalogo> = objeto<VadoCatalogo>({
  entre: par(),
  rio: texto({ minimo: 3, maximo: 40 }),
});

const validarRuta: Validador<RutaCatalogo> = objeto<RutaCatalogo>({
  nombre: texto({ minimo: 3, maximo: 80 }),
  comarcas: lista(identificador(), { minimo: 2, maximo: 40 }),
  nota: oNulo(texto({ maximo: 400 })),
});

const validarForma: Validador<CaminosCatalogo> = objeto<CaminosCatalogo>({
  puertos: lista(validarPuerto),
  vados: lista(validarVado),
  calzadas: lista(validarRuta),
  canyadas: lista(validarRuta),
});

function sonVecinas(mundo: Mundo, a: string, b: string): boolean {
  return (mundo.vecinos[a] ?? []).some((vecino) => vecino === b);
}

function comprobarTramo(
  mundo: Mundo,
  ruta: string,
  a: string,
  b: string,
  errores: ErrorValidacion[],
): void {
  for (const id of [a, b]) {
    if (!(id in mundo.comarcas)) {
      errores.push({ ruta, mensaje: `la comarca "${id}" no existe en el mundo generado` });
      return;
    }
  }
  if (!sonVecinas(mundo, a, b)) {
    errores.push({ ruta, mensaje: `"${a}" y "${b}" no son vecinas: no hay tramo que unirlas` });
  }
}

function tieneRasgo(comarca: ComarcaMundo | undefined, rasgo: string): boolean {
  return (comarca?.rasgos ?? []).some((suyo) => suyo === rasgo);
}

function esPastoDeInvierno(comarca: ComarcaMundo | undefined): boolean {
  return tieneRasgo(comarca, 'pasto-de-invierno') || tieneRasgo(comarca, 'dehesa');
}

/** Comprueba la capa contra el mundo generado: comarcas que existen, vecinas y rutas contiguas. */
export function comprobarCaminos(caminos: CaminosCatalogo, mundo: Mundo): ErrorValidacion[] {
  const errores: ErrorValidacion[] = [];
  const tramosUsados = new Map<string, string>();
  const clave = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);

  for (const puerto of caminos.puertos) {
    const ruta = `puertos.${puerto.nombre}`;
    comprobarTramo(mundo, ruta, puerto.entre[0], puerto.entre[1], errores);
    const suya = clave(puerto.entre[0], puerto.entre[1]);
    const anterior = tramosUsados.get(suya);
    if (anterior !== undefined) {
      errores.push({ ruta, mensaje: `ese tramo ya lo ocupa el puerto "${anterior}"` });
    }
    tramosUsados.set(suya, puerto.nombre);
  }

  for (const vado of caminos.vados) {
    comprobarTramo(mundo, `vados.${vado.rio}`, vado.entre[0], vado.entre[1], errores);
  }

  for (const [campo, rutas] of [
    ['calzadas', caminos.calzadas],
    ['canyadas', caminos.canyadas],
  ] as const) {
    for (const ruta of rutas) {
      const donde = `${campo}.${ruta.nombre}`;
      const vistas = new Set<string>();
      for (const id of ruta.comarcas) {
        if (vistas.has(id)) {
          errores.push({ ruta: donde, mensaje: `pasa dos veces por "${id}"` });
        }
        vistas.add(id);
      }
      for (let i = 0; i + 1 < ruta.comarcas.length; i += 1) {
        const a = ruta.comarcas[i];
        const b = ruta.comarcas[i + 1];
        if (a === undefined || b === undefined) continue;
        comprobarTramo(mundo, donde, a, b, errores);
      }
    }
  }

  for (const canyada of caminos.canyadas) {
    const donde = `canyadas.${canyada.nombre}`;
    const largo = canyada.comarcas.length;
    if (largo < CANYADA_MINIMA || largo > CANYADA_MAXIMA) {
      errores.push({
        ruta: donde,
        mensaje: `atraviesa ${String(largo)} comarcas y una canyada real recorre entre ${String(CANYADA_MINIMA)} y ${String(CANYADA_MAXIMA)}`,
      });
    }
    const primera = mundo.comarcas[canyada.comarcas[0] ?? ''];
    const ultima = mundo.comarcas[canyada.comarcas[largo - 1] ?? ''];
    if (!tieneRasgo(primera, 'pasto-de-verano')) {
      errores.push({
        ruta: donde,
        mensaje: `empieza en "${primera?.id ?? '?'}", que no tiene pasto de verano: una canyada sube a agostadero`,
      });
    }
    if (!esPastoDeInvierno(ultima)) {
      errores.push({
        ruta: donde,
        mensaje: `acaba en "${ultima?.id ?? '?'}", que no es pasto de invierno ni dehesa: una canyada baja a invernadero`,
      });
    }
  }

  return errores;
}

/** Valida la forma del archivo `caminos.jsonc`. La coherencia con el mundo la da `comprobarCaminos`. */
export function validarCaminos(datos: unknown, archivo: string): Resultado<CaminosCatalogo> {
  return validarForma(datos, archivo);
}
