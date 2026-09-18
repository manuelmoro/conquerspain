// Catalogo de acontecimientos y su sorteo (docs/01 §1.3, docs/02 §2.4.5; ficha T-039).
//
// Ninguno es sorpresa: todos se anuncian dos turnos antes y todos tienen una respuesta. Los que
// dependen de una comarca o de una feria concreta lo dicen en `objetivo`.
import type { DatosAcontecimientos, DatosAcontecimiento } from '../tipos/reglas.ts';
import type { EfectoAcontecimiento } from '../tipos/estado.ts';

const NADA = { recurso: null, terreno: null, factorMil: 1000, cantidad: 0 } as const;

function multiplica(
  que: EfectoAcontecimiento['que'],
  factorMil: number,
  resto: Partial<Pick<EfectoAcontecimiento, 'recurso' | 'terreno'>> = {},
): EfectoAcontecimiento {
  return { ...NADA, que, factorMil, ...resto };
}

function suma(que: EfectoAcontecimiento['que'], cantidad: number): EfectoAcontecimiento {
  return { ...NADA, que, cantidad };
}

const SIN_POTENCIAL = null;

function acontecimiento(
  datos: Omit<DatosAcontecimiento, 'peso' | 'potencialMinimo'> &
    Partial<Pick<DatosAcontecimiento, 'peso' | 'potencialMinimo'>>,
): DatosAcontecimiento {
  return { peso: 1, potencialMinimo: SIN_POTENCIAL, ...datos };
}

export const ACONTECIMIENTOS: DatosAcontecimientos = {
  sorteo: { minimoPorAnyo: 2, maximoPorAnyo: 4, turnosDeAviso: 2 },
  catalogo: {
    'buenas-lluvias': acontecimiento({
      nombre: 'Año de buenas lluvias',
      signo: 'positivo',
      objetivo: 'region',
      inicio: { desde: 5, hasta: 18 },
      duracion: { tipo: 'fija', turnos: 6 },
      efectos: [multiplica('pan', 1250)],
      respuestas: ['Vender el excedente de pan', 'Aprovechar para crecer'],
    }),
    sequia: acontecimiento({
      nombre: 'Sequía',
      signo: 'negativo',
      objetivo: 'region',
      inicio: { desde: 9, hasta: 16 },
      duracion: { tipo: 'fija', turnos: 6 },
      // No toca las huertas ni la pesca: por eso son la respuesta.
      efectos: [multiplica('pan', 700)],
      respuestas: ['Comprar pan antes de que suba', 'Apoyarse en huertas y pesca'],
    }),
    'nieves-tempranas': acontecimiento({
      nombre: 'Nieves tempranas',
      signo: 'negativo',
      objetivo: 'region',
      inicio: { desde: 19, hasta: 20 },
      duracion: { tipo: 'fija', turnos: 4 },
      efectos: [suma('puertos', 2)],
      respuestas: ['Adelantar la bajada de los rebaños', 'Cruzar los puertos antes'],
    }),
    riada: acontecimiento({
      nombre: 'Riada',
      signo: 'negativo',
      objetivo: 'region',
      inicio: { desde: 6, hasta: 9 },
      duracion: { tipo: 'fija', turnos: 3 },
      efectos: [suma('vados', 0), multiplica('labor', 800, { terreno: 'vega' })],
      respuestas: ['Rodear por otro camino', 'Tener puente: la riada no lo cierra'],
    }),
    'peste-de-ganado': acontecimiento({
      nombre: 'Peste de ganado',
      signo: 'negativo',
      objetivo: 'region',
      inicio: { desde: 3, hasta: 9 },
      duracion: { tipo: 'hasta-el-esquileo' },
      efectos: [multiplica('lana', 750, { recurso: 'lana' })],
      respuestas: ['Mover los rebaños fuera de la región'],
    }),
    'buen-ano-de-feria': acontecimiento({
      nombre: 'Buen año de feria',
      signo: 'positivo',
      objetivo: 'feria',
      inicio: null,
      duracion: { tipo: 'de-la-feria' },
      // Mas volumen es mas profundidad: el precio se mueve menos y se vende mas.
      efectos: [multiplica('volumen', 1200)],
      respuestas: ['Llevar mercancía a la feria'],
    }),
    'carestia-de-sal': acontecimiento({
      nombre: 'Carestía de sal',
      signo: 'negativo',
      objetivo: 'region',
      inicio: { desde: 13, hasta: 19 },
      duracion: { tipo: 'fija', turnos: 5 },
      efectos: [multiplica('precio', 1500, { recurso: 'sal' })],
      respuestas: ['Vender sal', 'Comprar antes de que suba'],
    }),
    romeria: acontecimiento({
      nombre: 'Romería',
      signo: 'positivo',
      objetivo: 'comarca',
      inicio: { desde: 5, hasta: 20 },
      duracion: { tipo: 'fija', turnos: 2 },
      efectos: [suma('lealtad', 10), multiplica('ingresos', 1100)],
      respuestas: ['Nada: es un regalo pequeño'],
    }),
    incendio: acontecimiento({
      nombre: 'Incendio en el monte',
      signo: 'negativo',
      objetivo: 'comarca',
      inicio: { desde: 12, hasta: 17 },
      duracion: { tipo: 'fija', turnos: 1 },
      potencialMinimo: { potencial: 'monte', nivel: 2 },
      efectos: [suma('monte', 20)],
      respuestas: ['Tener la comarca en dehesa: el monte se resiente la mitad'],
    }),
    maestros: acontecimiento({
      nombre: 'Llegada de maestros',
      signo: 'positivo',
      objetivo: 'region',
      inicio: { desde: 3, hasta: 19 },
      duracion: { tipo: 'fija', turnos: 4 },
      efectos: [multiplica('obra', 2000)],
      respuestas: ['Empezar una obra mayor antes'],
    }),
  },
  limites: {
    pan: { minimo: 700, maximo: 1300 },
    labor: { minimo: 700, maximo: 1300 },
    lana: { minimo: 700, maximo: 1300 },
    precio: { minimo: 500, maximo: 1500 },
    volumen: { minimo: 1000, maximo: 1500 },
    obra: { minimo: 1000, maximo: 2000 },
    ingresos: { minimo: 1000, maximo: 1300 },
    puertos: { minimo: 1, maximo: 3 },
    vados: { minimo: 0, maximo: 0 },
    lealtad: { minimo: 1, maximo: 30 },
    monte: { minimo: 1, maximo: 30 },
  },
};
