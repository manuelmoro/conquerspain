// Ferias del mapa (T-014 §4.3). Son el calendario economico del juego, y por eso se validan
// aparte del catalogo de comarcas: una feria mal puesta descoloca media partida.
import type { ComarcaCatalogo } from './tipos.ts';
import type { ErrorValidacion, Resultado, Validador, VolumenFeria } from '@conquer/nucleo';
import {
  VOLUMENES_FERIA,
  entero,
  identificador,
  lista,
  oNulo,
  objeto,
  texto,
  unoDe,
} from '@conquer/nucleo';

export interface FeriaDelMapa {
  readonly id: string;
  readonly nombre: string;
  readonly comarca: string;
  readonly turnos: readonly number[];
  readonly volumen: VolumenFeria;
  readonly recursosDestacados: readonly string[];
  readonly nota: string | null;
}

/** Tres grandes y ni una mas: si todas son importantes, ninguna lo es (§4.3). */
export const FERIAS_GRANDES = 3;
/** Turnos minimos entre dos ferias grandes, para que una recua pueda encadenarlas. */
export const SEPARACION_ENTRE_GRANDES = 4;

const validarFeria: Validador<FeriaDelMapa> = objeto<FeriaDelMapa>({
  id: identificador(),
  nombre: texto({ minimo: 3, maximo: 80 }),
  comarca: identificador(),
  turnos: lista(entero({ minimo: 1, maximo: 24 }), { minimo: 1, maximo: 2 }),
  volumen: unoDe(VOLUMENES_FERIA),
  recursosDestacados: lista(texto({ minimo: 3 }), { minimo: 1, maximo: 7 }),
  nota: oNulo(texto({ maximo: 400 })),
});

/** Valida la forma del archivo `ferias.jsonc`. */
export function validarFerias(datos: unknown, archivo: string): Resultado<FeriaDelMapa[]> {
  return lista(validarFeria, { minimo: 1 })(datos, archivo);
}

function turnosSeguidos(turnos: readonly number[]): boolean {
  if (turnos.length < 2) return true;
  const [primero, segundo] = turnos;
  return primero !== undefined && segundo !== undefined && segundo === primero + 1;
}

/** Comprueba las ferias contra el catalogo: comarca que existe, con derecho de feria y calendario. */
export function comprobarFerias(
  ferias: readonly FeriaDelMapa[],
  comarcas: readonly ComarcaCatalogo[],
): ErrorValidacion[] {
  const errores: ErrorValidacion[] = [];
  const porId = new Map(comarcas.map((comarca) => [comarca.id, comarca]));
  const vistas = new Set<string>();

  for (const feria of ferias) {
    const ruta = `ferias.${feria.id}`;
    if (vistas.has(feria.id)) errores.push({ ruta, mensaje: 'identificador de feria repetido' });
    vistas.add(feria.id);

    const comarca = porId.get(feria.comarca);
    if (comarca === undefined) {
      errores.push({ ruta, mensaje: `la comarca "${feria.comarca}" no esta en el catalogo` });
    } else if (!comarca.rasgos.includes('villa-de-feria')) {
      errores.push({
        ruta,
        mensaje: `"${feria.comarca}" no tiene el rasgo "villa-de-feria": sin derecho de feria no hay feria`,
      });
    }

    if (!turnosSeguidos(feria.turnos)) {
      errores.push({
        ruta,
        mensaje: `una feria de dos turnos los tiene seguidos, y estos son ${feria.turnos.join(' y ')}`,
      });
    }
  }

  const grandes = ferias.filter((feria) => feria.volumen === 'grande');
  if (grandes.length > FERIAS_GRANDES) {
    errores.push({
      ruta: 'ferias',
      mensaje: `hay ${String(grandes.length)} ferias grandes y el mapa admite ${String(FERIAS_GRANDES)}: si todas son importantes, ninguna lo es`,
    });
  }

  const ordenadas = [...grandes].sort(
    (a, b) => Math.min(...a.turnos) - Math.min(...b.turnos) || (a.id < b.id ? -1 : 1),
  );
  for (let i = 0; i + 1 < ordenadas.length; i += 1) {
    const anterior = ordenadas[i];
    const siguiente = ordenadas[i + 1];
    if (anterior === undefined || siguiente === undefined) continue;
    const separacion = Math.min(...siguiente.turnos) - Math.max(...anterior.turnos);
    if (separacion < SEPARACION_ENTRE_GRANDES) {
      errores.push({
        ruta: `ferias.${siguiente.id}`,
        mensaje: `solo hay ${String(separacion)} turnos desde "${anterior.id}" y hacen falta ${String(SEPARACION_ENTRE_GRANDES)} para encadenar las dos`,
      });
    }
  }

  return errores;
}

/**
 * Coherencia de los rasgos con los potenciales (§4.3, regla 6): las salinas y las venas de hierro
 * no se declaran donde no hay de que. `puerto-de-mar` no exige terreno de costa a proposito: una
 * huerta de vega puede tener puerto (Valencia, Gandia, Sanlucar) y el catalogo lo refleja asi.
 */
export function comprobarRasgos(comarcas: readonly ComarcaCatalogo[]): ErrorValidacion[] {
  const errores: ErrorValidacion[] = [];
  for (const comarca of comarcas) {
    if (comarca.rasgos.includes('salinas-historicas') && comarca.potenciales.sal < 2) {
      errores.push({
        ruta: `${comarca.id}.rasgos`,
        mensaje:
          'tiene "salinas-historicas" y sal menor que 2: una salina sin sal no es una salina',
      });
    }
    if (comarca.rasgos.includes('vena-de-hierro') && comarca.potenciales.hierro < 2) {
      errores.push({
        ruta: `${comarca.id}.rasgos`,
        mensaje: 'tiene "vena-de-hierro" y hierro menor que 2',
      });
    }
  }
  return errores;
}
