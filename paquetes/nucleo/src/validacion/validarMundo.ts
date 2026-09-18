// Validacion de los datos del mundo generados por la herramienta atlas.
import type { Camino, ComarcaMundo, Feria, Localidad, Mundo } from '../tipos/mundo.ts';
import { POTENCIALES, RASGOS, TERRENOS, VOLUMENES_FERIA } from '../tipos/mundo.ts';
import type { IdComarca, IdFeria } from '../tipos/ids.ts';
import { nivelPotencial, par } from './comunes.ts';
import type { ErrorValidacion, Resultado, Validador } from './validador.ts';
import {
  booleano,
  entero,
  enteroNoNegativo,
  identificador,
  invalidos,
  lista,
  oNulo,
  objeto,
  registro,
  registroCompleto,
  texto,
  unoDe,
  valido,
} from './validador.ts';

const validarLocalidad: Validador<Localidad> = objeto<Localidad>({
  nombre: texto({ minimo: 1, maximo: 80 }),
  coord: par(),
  cabecera: booleano(),
});

const validarFeria: Validador<Feria> = objeto<Feria>({
  id: identificador<IdFeria>(),
  nombre: texto({ minimo: 1, maximo: 80 }),
  turnos: lista(entero({ minimo: 1, maximo: 24 }), { minimo: 1, maximo: 2 }),
  volumen: unoDe(VOLUMENES_FERIA),
  recursosDestacados: lista(texto({ minimo: 1 }), { maximo: 7 }),
});

const validarComarca: Validador<ComarcaMundo> = objeto<ComarcaMundo>({
  id: identificador<IdComarca>(),
  nombre: texto({ minimo: 1, maximo: 80 }),
  cabecera: texto({ minimo: 1, maximo: 80 }),
  region: texto({ minimo: 1, maximo: 80 }),
  centro: par(),
  poligono: lista(par(), { minimo: 3 }),
  terreno: unoDe(TERRENOS),
  potenciales: registroCompleto(POTENCIALES, nivelPotencial()),
  solares: entero({ minimo: 1, maximo: 12 }),
  poblacionInicial: enteroNoNegativo(1000),
  localidades: lista(validarLocalidad, { minimo: 1, maximo: 6 }),
  rasgos: lista(unoDe(RASGOS), { maximo: RASGOS.length }),
  feria: oNulo(validarFeria),
  esOrigen: booleano(),
});

const validarCamino: Validador<Camino> = objeto<Camino>({
  desde: identificador<IdComarca>(),
  hasta: identificador<IdComarca>(),
  terreno: unoDe(TERRENOS),
  jornadasBase: entero({ minimo: 1, maximo: 30 }),
  vado: booleano(),
  puertoDeMontanya: oNulo(texto({ minimo: 1, maximo: 80 })),
  cierraEnInvierno: booleano(),
  canyada: oNulo(texto({ minimo: 1, maximo: 80 })),
  calzadaRomana: booleano(),
});

const validarForma: Validador<Mundo> = objeto<Mundo>({
  version: texto({ minimo: 1, maximo: 16 }),
  comarcas: registro(validarComarca, identificador()),
  caminos: lista(validarCamino),
  vecinos: registro(lista(identificador<IdComarca>()), identificador()),
});

/**
 * Valida el mundo: primero la forma y despues la coherencia del grafo.
 * Un mundo incoherente (una comarca sin vecinos, un camino a ninguna parte) no llega al motor.
 */
export function validarMundo(dato: unknown): Resultado<Mundo> {
  const forma = validarForma(dato, '');
  if (!forma.ok) return forma;
  const mundo = forma.valor;
  const errores: ErrorValidacion[] = [];

  for (const [clave, comarca] of Object.entries(mundo.comarcas)) {
    if (comarca.id !== clave) {
      errores.push({
        ruta: `comarcas.${clave}.id`,
        mensaje: `el identificador "${comarca.id}" no coincide con su clave "${clave}"`,
      });
    }
    const cabeceras = comarca.localidades.filter((localidad) => localidad.cabecera);
    if (cabeceras.length !== 1) {
      errores.push({
        ruta: `comarcas.${clave}.localidades`,
        mensaje: `debe haber exactamente una localidad cabecera y hay ${String(cabeceras.length)}`,
      });
    } else if (cabeceras[0]?.nombre !== comarca.cabecera) {
      errores.push({
        ruta: `comarcas.${clave}.cabecera`,
        mensaje: `la cabecera "${comarca.cabecera}" no coincide con la localidad marcada como cabecera`,
      });
    }
    if (comarca.feria !== null && !comarca.rasgos.includes('villa-de-feria')) {
      errores.push({
        ruta: `comarcas.${clave}.feria`,
        mensaje: 'una comarca con feria necesita el rasgo "villa-de-feria"',
      });
    }
  }

  const existe = (id: string): boolean => Object.hasOwn(mundo.comarcas, id);

  mundo.caminos.forEach((camino, indice) => {
    if (!existe(camino.desde)) {
      errores.push({
        ruta: `caminos.${String(indice)}.desde`,
        mensaje: `la comarca "${camino.desde}" no existe`,
      });
    }
    if (!existe(camino.hasta)) {
      errores.push({
        ruta: `caminos.${String(indice)}.hasta`,
        mensaje: `la comarca "${camino.hasta}" no existe`,
      });
    }
    if (camino.desde === camino.hasta) {
      errores.push({
        ruta: `caminos.${String(indice)}`,
        mensaje: 'un camino no puede unir una comarca consigo misma',
      });
    }
  });

  for (const [clave, vecinos] of Object.entries(mundo.vecinos)) {
    if (!existe(clave)) {
      errores.push({ ruta: `vecinos.${clave}`, mensaje: `la comarca "${clave}" no existe` });
      continue;
    }
    if (vecinos.length === 0) {
      errores.push({
        ruta: `vecinos.${clave}`,
        mensaje: 'ninguna comarca puede quedarse sin vecinos',
      });
    }
    for (const vecino of vecinos) {
      if (!existe(vecino)) {
        errores.push({
          ruta: `vecinos.${clave}`,
          mensaje: `la comarca vecina "${vecino}" no existe`,
        });
      }
    }
  }

  for (const clave of Object.keys(mundo.comarcas)) {
    if (!Object.hasOwn(mundo.vecinos, clave)) {
      errores.push({ ruta: `vecinos.${clave}`, mensaje: 'falta la vecindad de esta comarca' });
    }
  }

  return errores.length > 0 ? invalidos(errores) : valido(mundo);
}
