// Temporadas en el cliente (ficha T-104 §2.4): el turno en la cabecera, el mejor capitulo de cada
// uno para que la clasificacion informe sin desanimar, y el cierre en palabras.
import { CAPITULOS_DE_PRESTIGIO } from '@conquer/nucleo';
import type {
  CapituloDePrestigio,
  CierreDeTemporada,
  ClasificacionPublica,
  Reconocimiento,
  VistaJugador,
} from '@conquer/nucleo';

export const NOMBRE_DE_CAPITULO: Readonly<Record<CapituloDePrestigio, string>> = {
  poblacion: 'población',
  territorio: 'territorio',
  obras: 'obras',
  caminos: 'caminos',
  comercio: 'comercio',
  exploracion: 'exploración',
  ganaderia: 'ganadería',
  industria: 'industria',
  hitos: 'hitos',
};

export const NOMBRE_DE_RECONOCIMIENTO: Readonly<Record<Reconocimiento, string>> = {
  poblacion: 'Mayor población',
  obras: 'Mayor obra',
  comercio: 'Mejor comerciante',
  caminos: 'Mayor red de caminos',
  ganaderia: 'Mejor trashumancia',
};

/** «turno 37 de 240» en una temporada, «turno 37» en una abierta, «temporada cerrada» al final. */
export function turnoEnCabecera(vista: VistaJugador): string {
  if (vista.cierre !== null) return `temporada cerrada en el turno ${String(vista.cierre.turno)}`;
  const total = vista.configuracion.turnosDeTemporada;
  return total === null
    ? `turno ${String(vista.turno)}`
    : `turno ${String(vista.turno)} de ${String(total)}`;
}

export interface MejorCapitulo {
  readonly capitulo: CapituloDePrestigio;
  readonly puesto: number;
  /** Lo que le falta para alcanzar al de arriba en ese capitulo; 0 si va primero. */
  readonly faltan: number;
}

/**
 * El capitulo en el que mejor puesto tiene el jugador (a igual puesto, el de mas valor): cada uno
 * tiene algo en lo que destaca, aunque vaya ultimo en el total.
 */
export function mejorCapitulo(c: ClasificacionPublica, yo: string): MejorCapitulo | null {
  const mia = c.filas.find((f) => f.jugador === yo);
  if (mia === undefined) return null;
  let mejor: (MejorCapitulo & { readonly valor: number }) | null = null;
  for (const capitulo of CAPITULOS_DE_PRESTIGIO) {
    const valor = mia.capitulos[capitulo];
    if (valor <= 0) continue;
    const delante = c.filas
      .filter((f) => f.jugador !== yo && f.capitulos[capitulo] > valor)
      .map((f) => f.capitulos[capitulo]);
    const puesto = delante.length + 1;
    const faltan = delante.length === 0 ? 0 : Math.min(...delante) - valor;
    if (mejor === null || puesto < mejor.puesto || (puesto === mejor.puesto && valor > mejor.valor))
      mejor = { capitulo, puesto, faltan, valor };
  }
  return mejor === null
    ? null
    : { capitulo: mejor.capitulo, puesto: mejor.puesto, faltan: mejor.faltan };
}

/** Lo que dice la clasificacion a quien la mira: su mejor capitulo y cuanto le falta. */
export function animo(c: ClasificacionPublica, yo: string): string | null {
  const m = mejorCapitulo(c, yo);
  if (m === null) return null;
  const nombre = NOMBRE_DE_CAPITULO[m.capitulo];
  return m.puesto === 1
    ? `Vas primero en ${nombre}.`
    : `Vas ${String(m.puesto)}.º en ${nombre}: te faltan ${String(m.faltan)} para alcanzar al de delante.`;
}

/** El cierre en lineas: el podio y los reconocimientos, con los nombres de las casas. */
export function lineasDeCierre(
  cierre: CierreDeTemporada,
  nombre: (jugador: string) => string,
): readonly string[] {
  const podio = cierre.clasificacion
    .slice(0, 3)
    .map(
      (p) => `${String(p.puesto)}.º ${nombre(p.jugador)}, con ${String(p.prestigio)} de prestigio`,
    );
  const reconocimientos = cierre.reconocimientos.map(
    (r) =>
      `${NOMBRE_DE_RECONOCIMIENTO[r.reconocimiento]}: ${nombre(r.jugador)} (${String(r.valor)})`,
  );
  return [...podio, ...reconocimientos];
}
