// El tutorial de las primeras acciones (ficha T-090 §2.6), puro: cinco pasos que se dan por hechos
// cuando el jugador los hace, no al leerlos. Lo que lleva hecho se guarda por partida en el navegador
// (una preferencia de quien mira: si se pierde, el tutorial vuelve a empezar y no pasa nada).

export interface SituacionDelTutorial {
  readonly turno: number;
  readonly capital: string;
  readonly comarcaAbierta: string | null;
  /** Si la comarca abierta es propia. */
  readonly abiertaEsPropia: boolean;
  /** Ordenes del jugador dadas o en marcha. */
  readonly ordenes: number;
}

export interface PasoDelTutorial {
  readonly id: string;
  readonly titulo: string;
  readonly texto: string;
  /**
   * Donde mirar: selectores CSS, en orden de preferencia; el primero que exista se resalta y el resto
   * de la pantalla se oscurece. Vacio si no hay nada que senyalar.
   */
  readonly objetivo: (capital: string) => readonly string[];
  /** Se da por hecho al pasar esto; null si el jugador dice «Entendido». */
  readonly hecho: ((s: SituacionDelTutorial, alEmpezar: number) => boolean) | null;
}

export const PASOS_DEL_TUTORIAL: readonly PasoDelTutorial[] = [
  {
    id: 'recursos',
    titulo: 'Esto es lo que tienes',
    texto:
      'Arriba ves tus recursos: pan para comer, madera y piedra para construir, maravedís para pagar. El pan es lo primero: si falta, tu gente pasa hambre.',
    objetivo: () => ['.barra-de-recursos'],
    hecho: null,
  },
  {
    id: 'capital',
    titulo: 'Toca tu capital',
    texto:
      'Tu capital es la de la torre con banderola. Tócala: su ficha te dice qué produce y qué puedes hacer en ella.',
    objetivo: (capital) => [`.capa-comarcas [data-comarca="${capital}"]`, '.contenedor-atlas'],
    hecho: (s) => s.comarcaAbierta === s.capital,
  },
  {
    id: 'obra',
    titulo: 'Da tu primera orden',
    texto:
      'En la ficha, elige qué construir (una granja da más pan) y pulsa «Dar la orden». Se paga al empezar, y hasta el corte la puedes retirar.',
    objetivo: () => ['.panel .ficha'],
    hecho: (s) => s.ordenes > 0,
  },
  {
    id: 'turno',
    titulo: 'El turno se resuelve a su hora',
    texto:
      'Cuando llegue el corte, se resuelven las órdenes de todos a la vez y te llega la crónica de lo que ha pasado. No hace falta estar conectado.',
    objetivo: () => ['.cabecera button.empuje', '.titulo-de-partida'],
    hecho: (s, alEmpezar) => s.turno > alEmpezar,
  },
  {
    id: 'tierra',
    titulo: 'Gana tierra',
    texto:
      'Toca una comarca vecina: «Cómo ganarla» te dice cuánta influencia tienes y qué la sube. Una recua presente o un regalo al concejo la acercan.',
    objetivo: () => ['.contenedor-atlas'],
    hecho: (s) => s.comarcaAbierta !== null && !s.abiertaEsPropia,
  },
];

/** Lo que se guarda: el paso por el que va (o fuera), y el turno en que empezo. */
export interface ProgresoDelTutorial {
  readonly paso: number;
  readonly turnoAlEmpezar: number;
  readonly saltado: boolean;
}

export function progresoInicial(turno: number): ProgresoDelTutorial {
  return { paso: 0, turnoAlEmpezar: turno, saltado: false };
}

/** Se ha terminado o se ha saltado: ya no se ensenya. */
export function terminado(p: ProgresoDelTutorial): boolean {
  return p.saltado || p.paso >= PASOS_DEL_TUTORIAL.length;
}

/** Avanza todos los pasos que la situacion ya cumple, en orden. */
export function alDia(p: ProgresoDelTutorial, s: SituacionDelTutorial): ProgresoDelTutorial {
  let paso = p.paso;
  for (;;) {
    const actual = PASOS_DEL_TUTORIAL[paso];
    const hecho = actual?.hecho ?? null;
    if (p.saltado || hecho === null || !hecho(s, p.turnoAlEmpezar)) break;
    paso += 1;
  }
  return paso === p.paso ? p : { ...p, paso };
}

/** «Entendido» en un paso que no se cumple solo, o «Siguiente» si el jugador quiere pasar. */
export function siguiente(p: ProgresoDelTutorial): ProgresoDelTutorial {
  return { ...p, paso: Math.min(PASOS_DEL_TUTORIAL.length, p.paso + 1) };
}

export function saltar(p: ProgresoDelTutorial): ProgresoDelTutorial {
  return { ...p, saltado: true };
}

/** Lee lo guardado con cuidado: si no vale, empieza de nuevo. */
export function leerProgreso(texto: string | null, turno: number): ProgresoDelTutorial {
  if (texto === null) return progresoInicial(turno);
  try {
    const dato: unknown = JSON.parse(texto);
    if (typeof dato === 'object' && dato !== null && !Array.isArray(dato)) {
      const campos = new Map<string, unknown>(Object.entries(dato));
      const paso = campos.get('paso');
      const turnoAlEmpezar = campos.get('turnoAlEmpezar');
      const saltado = campos.get('saltado');
      if (
        typeof paso === 'number' &&
        typeof turnoAlEmpezar === 'number' &&
        typeof saltado === 'boolean'
      )
        return { paso, turnoAlEmpezar, saltado };
    }
  } catch {
    // Lo guardado no se entiende: se empieza de nuevo.
  }
  return progresoInicial(turno);
}

export interface Caja {
  readonly x: number;
  readonly y: number;
  readonly ancho: number;
  readonly alto: number;
}

/**
 * Donde poner la tarjeta del tutorial para que quede al lado de lo que senyala sin taparlo: a la
 * derecha si cabe, si no a la izquierda, debajo o encima; y siempre dentro de la ventana.
 */
export function junto(
  objetivo: Caja,
  tarjeta: { readonly ancho: number; readonly alto: number },
  ventana: { readonly ancho: number; readonly alto: number },
  hueco = 16,
): { readonly x: number; readonly y: number } {
  const dentro = (v: number, tam: number, max: number): number =>
    Math.max(hueco, Math.min(v, max - tam - hueco));
  const centradoEnY = objetivo.y + objetivo.alto / 2 - tarjeta.alto / 2;
  const centradoEnX = objetivo.x + objetivo.ancho / 2 - tarjeta.ancho / 2;
  if (objetivo.x + objetivo.ancho + hueco + tarjeta.ancho + hueco <= ventana.ancho) {
    return {
      x: objetivo.x + objetivo.ancho + hueco,
      y: dentro(centradoEnY, tarjeta.alto, ventana.alto),
    };
  }
  if (objetivo.x - hueco - tarjeta.ancho >= hueco) {
    return {
      x: objetivo.x - hueco - tarjeta.ancho,
      y: dentro(centradoEnY, tarjeta.alto, ventana.alto),
    };
  }
  if (objetivo.y + objetivo.alto + hueco + tarjeta.alto + hueco <= ventana.alto) {
    return {
      x: dentro(centradoEnX, tarjeta.ancho, ventana.ancho),
      y: objetivo.y + objetivo.alto + hueco,
    };
  }
  return {
    x: dentro(centradoEnX, tarjeta.ancho, ventana.ancho),
    y: dentro(objetivo.y - hueco - tarjeta.alto, tarjeta.alto, ventana.alto),
  };
}
