// Cifras de los cometidos de las recuas (docs/03-economia.md §3.7.3; ficha T-034).
import type { DatosCometidos } from '../tipos/reglas.ts';

export const COMETIDOS_DE_RECUA: DatosCometidos = {
  // Una exploracion de cada cinco trae algo mas que el mapa: una localidad o noticias de un rival.
  probabilidadHallazgoMil: 200,
  influenciaParaPuebla: 40,
  vecinosParaPuebla: 10,
  turnosParaPuebla: 2,
  lealtadDePuebla: 50,
  // Estar presente cuesta como andar una jornada al turno.
  bastimentoPresenciaMil: 1000,
  devolucionAlDisolverMil: 500,
};
