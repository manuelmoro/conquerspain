// Cifras de las obras y de las obras mayores (docs/03-economia.md §3.3 y §3.11; ficha T-035).
//
// Los costes de las obras mayores no estaban en el diseno: se fijan aqui con dos ideas. La obra
// de piedra se paga sobre todo en piedra (es la via del cantero) y la catedral cuesta lo que
// cuesta una catedral: diez veces un puente, repartido en cuarenta y cinco turnos.
import type { DatosObraMayor, DatosObras, TipoObraMayor } from '../tipos/reglas.ts';
import type { Recursos } from '../tipos/recursos.ts';

function coste(partes: Partial<Recursos>): Recursos {
  return { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0, ...partes };
}

export const OBRAS: DatosObras = {
  cuadrillasPorFuero: 1,
  cuadrillasPorMonasterio: 1,
  turnosDerribo: 1,
  devolucionDerriboMil: 500,
  turnosRoturar: 3,
  costeRoturar: coste({ pan: 10, maravedis: 20 }),
  costeRoturarDehesaMil: 2000,
  lealtadPorRoturarDehesa: 5,
  deterioroAbandonoMil: 10,
  lealtadParaMonasterio: 60,
  vecinosDeCiudad: 200,
  lealtadPorMuralla: 15,
  lealtadRegionalPorCatedral: 2,
  maravedisPorPeregrinos: 12,
  crecimientoPorMonasterioMil: 200,
  laborPorAcequiaMil: 1500,
};

export const OBRAS_MAYORES: Readonly<Record<TipoObraMayor, DatosObraMayor>> = {
  puente: {
    nombre: 'Puente',
    turnos: 12,
    coste: coste({ piedra: 120, madera: 40, maravedis: 60 }),
    esDePiedra: true,
  },
  calzada: {
    nombre: 'Calzada',
    turnos: 20,
    coste: coste({ piedra: 200, maravedis: 100 }),
    esDePiedra: true,
  },
  monasterio: {
    nombre: 'Monasterio',
    turnos: 25,
    coste: coste({ piedra: 150, madera: 100, maravedis: 150 }),
    esDePiedra: true,
  },
  catedral: {
    nombre: 'Catedral',
    turnos: 45,
    coste: coste({ piedra: 1200, madera: 300, maravedis: 800 }),
    esDePiedra: true,
  },
  muralla: {
    nombre: 'Muralla',
    turnos: 18,
    coste: coste({ piedra: 250, maravedis: 80 }),
    esDePiedra: true,
  },
  atarazana: {
    nombre: 'Atarazana',
    turnos: 30,
    coste: coste({ madera: 250, piedra: 100, maravedis: 200 }),
    esDePiedra: false,
  },
  'acequia-mayor': {
    nombre: 'Acequia mayor',
    turnos: 22,
    coste: coste({ piedra: 120, madera: 60, maravedis: 150 }),
    esDePiedra: true,
  },
};
