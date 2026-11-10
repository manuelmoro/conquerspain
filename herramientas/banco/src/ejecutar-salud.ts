// La salud multijugador desde la linea de ordenes (ficha T-106):
//   npm run banco:salud -- [--semillas 1492,1212,1808] [--turnos 120]
import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';

import { mundoPeninsula } from './partida.ts';
import { informeDeSalud, saludMultijugador } from './salud.ts';

const argumentos = process.argv.slice(2);
const valor = (nombre: string): string | undefined => {
  const i = argumentos.indexOf(`--${nombre}`);
  return i >= 0 ? argumentos[i + 1] : undefined;
};
const semillas = (valor('semillas') ?? '1492,1212,1808').split(',');
const turnos = Number(valor('turnos') ?? '120');
if (!Number.isInteger(turnos) || turnos < 1) {
  throw new Error(`--turnos tiene que ser un entero positivo, y es "${String(valor('turnos'))}".`);
}
const informe = saludMultijugador({
  semillas,
  turnos,
  reglas: TABLAS_DEL_JUEGO,
  mundo: mundoPeninsula(),
});
process.stdout.write(informeDeSalud(informe, turnos));
const todo = Object.values(informe.cumple).every(Boolean);
process.exitCode = todo ? 0 : 1;
