// Las acciones de gobierno de una comarca propia en su ficha (ficha T-089 §4.2): fuero, carga fiscal,
// dehesa, obras mayores y traslado de la corte. Cada una con su efecto y con el bloqueo que pondria la
// fase que la cumple, por las mismas funciones.
import {
  EFECTO_DE_CARGA,
  EFECTO_DE_DEHESA,
  EFECTO_DE_FUERO,
  EFECTO_DE_OBRA_MAYOR,
  EFECTO_DE_TRASLADO,
  TITULO_DE_FUERO,
} from './datos/gobierno.ts';
import { prohibicionesDelJugador } from './reglas/casas/index.ts';
import { impedimentoDeTraslado } from './reglas/capital.ts';
import { impedimentoDeObraMayor } from './reglas/obras.ts';
import { impedimentoDePolitica } from './reglas/politica.ts';
import type { EstadoComarca, EstadoJugador, EstadoPartida } from './tipos/estado.ts';
import { CARGAS_FISCALES, FUEROS } from './tipos/estado.ts';
import type { Mundo } from './tipos/mundo.ts';
import { TIPOS_DE_OBRA_MAYOR } from './tipos/reglas.ts';
import type { TablasDeReglas } from './tipos/reglas.ts';

/** Lo que la ficha necesita para componer una accion: el mismo constructor que las demas. */
export type ConstructorDeAccion<A> = (
  clave: string,
  titulo: string,
  intencion: Record<string, unknown>,
  turnos: number,
  efecto: string,
  motivo: string | null,
) => A;

export function accionesDeGobierno<A>(
  comarca: EstadoComarca,
  jugador: EstadoJugador,
  estado: EstadoPartida,
  mundo: Mundo,
  reglas: TablasDeReglas,
  accion: ConstructorDeAccion<A>,
): A[] {
  const acciones: A[] = [];
  const prohibiciones = prohibicionesDelJugador(jugador, reglas);
  const politica = (cambios: Record<string, unknown>): Record<string, unknown> => ({
    tipo: 'politica',
    comarca: comarca.id,
    fuero: null,
    cargaFiscal: null,
    dehesa: null,
    conservarConSal: null,
    ...cambios,
  });

  for (const fuero of FUEROS) {
    if (fuero === comarca.fuero) continue;
    acciones.push(
      accion(
        `fuero-${fuero.replace(' ', '-')}`,
        TITULO_DE_FUERO[fuero],
        politica({ fuero }),
        1,
        EFECTO_DE_FUERO[fuero],
        impedimentoDePolitica(
          comarca,
          jugador.id,
          { fuero, cargaFiscal: null },
          estado.turno,
          prohibiciones,
          reglas,
        ),
      ),
    );
  }
  for (const carga of CARGAS_FISCALES) {
    if (carga === comarca.cargaFiscal) continue;
    acciones.push(
      accion(
        `carga-${carga}`,
        `Carga fiscal ${carga}`,
        politica({ cargaFiscal: carga }),
        1,
        EFECTO_DE_CARGA[carga],
        impedimentoDePolitica(
          comarca,
          jugador.id,
          { fuero: null, cargaFiscal: carga },
          estado.turno,
          prohibiciones,
          reglas,
        ),
      ),
    );
  }
  acciones.push(
    accion(
      comarca.dehesa ? 'levantar-dehesa' : 'acotar-dehesa',
      comarca.dehesa ? 'Levantar la dehesa' : 'Acotar el monte en dehesa',
      politica({ dehesa: !comarca.dehesa }),
      1,
      comarca.dehesa ? EFECTO_DE_DEHESA.levantar : EFECTO_DE_DEHESA.acotar,
      null,
    ),
  );

  for (const obra of TIPOS_DE_OBRA_MAYOR) {
    const datos = reglas.obrasMayores[obra];
    const enTramo = obra === 'puente' || obra === 'calzada';
    const destinos = enTramo ? (mundo.vecinos[comarca.id] ?? []) : [null];
    for (const hacia of destinos) {
      // Solo hacia lo que se conoce: un tramo a una comarca desconocida ni se sabe que existe.
      if (hacia !== null && (jugador.conocimiento[hacia]?.nivel ?? 'desconocida') === 'desconocida')
        continue;
      const motivo = impedimentoDeObraMayor(obra, { comarca, hacia }, estado, mundo, reglas);
      // Lo que no tiene sentido en este tramo (sin vado, sin camino) no se ofrece en cada vecina.
      if (
        enTramo &&
        (motivo === 'sin-vado' || motivo === 'sin-tramo' || motivo === 'ya-construida')
      )
        continue;
      acciones.push(
        accion(
          hacia === null ? `obra-${obra}` : `obra-${obra}-${hacia}`,
          hacia === null
            ? `Levantar ${datos.nombre.toLowerCase()}`
            : `${datos.nombre} hacia ${mundo.comarcas[hacia]?.nombre ?? 'una vecina'}`,
          {
            tipo: 'obra-mayor',
            comarca: comarca.id,
            obra,
            hacia,
            continuar: null,
            abandonar: false,
          },
          datos.turnos,
          EFECTO_DE_OBRA_MAYOR[obra],
          motivo,
        ),
      );
    }
  }

  if (jugador.capital !== comarca.id) {
    acciones.push(
      accion(
        'trasladar-corte',
        'Trasladar aquí la corte',
        { tipo: 'trasladar-corte', comarca: comarca.id },
        reglas.territorio.turnosTraslado,
        EFECTO_DE_TRASLADO,
        impedimentoDeTraslado(jugador, comarca.id, estado),
      ),
    );
  }
  return acciones;
}
