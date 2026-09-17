// Registro de sucesos del turno: la materia prima de la cronica (T-044) y del registro de
// auditoria del servidor. Los sucesos no llevan texto redactado, solo datos.
import type { NombreFase, Suceso } from './tipos/cronica.ts';
import type { IdComarca, IdJugador } from './tipos/ids.ts';

export interface DestinatariosDeSuceso {
  readonly jugador?: IdJugador | null;
  readonly comarca?: IdComarca | null;
}

/** Anyade un suceso al turno en curso y devuelve el suceso creado. */
export function registrarSuceso(
  sucesos: Suceso[],
  fase: NombreFase,
  tipo: string,
  datos: Readonly<Record<string, number | string>>,
  donde: DestinatariosDeSuceso = {},
): Suceso {
  const suceso: Suceso = {
    orden: sucesos.length + 1,
    fase,
    tipo,
    jugador: donde.jugador ?? null,
    comarca: donde.comarca ?? null,
    datos,
  };
  sucesos.push(suceso);
  return suceso;
}
