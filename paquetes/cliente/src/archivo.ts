// La navegacion del archivo de cronicas (ficha T-085 §4.3), pura: de que turnos hay cronica, como se
// pasa al anterior o al siguiente y a que turno salta cada anyo del calendario.

/** El ultimo turno con cronica: el anterior al que se juega. 0 si aun no se ha resuelto ninguno. */
export function ultimoResuelto(turnoQueSeJuega: number): number {
  return Math.max(0, turnoQueSeJuega - 1);
}

/** Un turno del archivo, dentro de lo que hay: de 1 al ultimo resuelto. */
export function moverTurno(actual: number, paso: number, ultimo: number): number {
  return Math.min(ultimo, Math.max(1, actual + paso));
}

export function anyoDe(turno: number, turnosPorAnyo: number): number {
  return Math.floor((Math.max(1, turno) - 1) / turnosPorAnyo) + 1;
}

/** Los anyos que tienen alguna cronica, con el turno al que salta cada uno (su primero). */
export function anyosDelArchivo(
  ultimo: number,
  turnosPorAnyo: number,
): readonly { readonly anyo: number; readonly turno: number }[] {
  if (ultimo < 1) return [];
  const ultimoAnyo = anyoDe(ultimo, turnosPorAnyo);
  return Array.from({ length: ultimoAnyo }, (_, i) => ({
    anyo: i + 1,
    turno: i * turnosPorAnyo + 1,
  }));
}
