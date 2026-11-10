// Ausencia y amparo (ficha T-105): los escalones, en turnos sin dar ninguna orden.
import type { DatosAusencia } from '../tipos/reglas.ts';

export const AUSENCIA: DatosAusencia = {
  turnosParaAvisar: 5,
  turnosParaAusente: 15,
  turnosParaConcejo: 30,
  // Despacio y con suelo: la casa ausente no pierde ninguna comarca por deslealtad.
  lealtadPorTurnoAusente: 1,
  lealtadMinimaAusente: 50,
  turnosDeAmparo: 20,
};
