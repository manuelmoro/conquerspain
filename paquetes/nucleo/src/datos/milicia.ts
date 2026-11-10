// La milicia concejil (ficha T-120): cuesta pan, soldada y, sobre todo, brazos que no trabajan.
import type { DatosMilicia } from '../tipos/reglas.ts';

export const MILICIA: DatosMilicia = {
  // Uno de cada cinco vecinos, como mucho: el resto tiene que seguir labrando.
  levaMaximaMil: 200,
  lealtadPorLeva: 5,
  panPorCadaDiezHombres: 1,
  // Un hombre en armas cuesta mas de lo que rinde en el campo: si no, la milicia saldria gratis.
  soldadaPorCadaDiezHombres: 6,
  // Fuera de casa la soldada sube un 10 % por turno, hasta el triple: acosar sale caro.
  recargoLejosPorTurnoMil: 100,
  recargoLejosMaximoMil: 3000,
  desercionSinPagaMil: 100,
  pasoMil: 2000,
  ventajaEnCasaMil: 1500,
  ventajaMurallaMil: 2000,
  bajasDerrotaMil: 100,
  // El asedio (T-121): seis turnos para defenderse o negociar antes de que nada se rinda.
  turnosMinimosAsedio: 6,
  guarnicionMil: 100,
  ventajaAbastecidaMil: 1500,
  lealtadTrasRendicion: 40,
};
