// `npm run dev`: el servidor y Vite a la vez, con la salida de los dos en la misma consola.
//
// Cada hijo va en su propio grupo de procesos y se para el grupo entero: `npx` y `tsx` lanzan a su
// vez otro proceso, y matar solo al primero dejaba al de debajo vivo y con el puerto ocupado. Vite va
// con `--strictPort`: si el 5173 esta ocupado, falla en vez de mudarse, porque el enlace del correo
// (URL_PUBLICA) apunta a ese puerto. Si uno de los dos se cae, se para el otro.
import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';

const PUERTO_DEL_CLIENTE = process.env['PUERTO_CLIENTE'] ?? '5173';
const entorno = {
  ...process.env,
  BASE_DE_DATOS: process.env['BASE_DE_DATOS'] ?? 'desarrollo.sqlite',
  URL_PUBLICA: process.env['URL_PUBLICA'] ?? `http://localhost:${PUERTO_DEL_CLIENTE}`,
};

const hijos: ChildProcess[] = [
  spawn('npx', ['tsx', 'paquetes/servidor/src/principal.ts'], {
    stdio: 'inherit',
    env: entorno,
    detached: true,
  }),
  spawn('npx', ['vite', 'paquetes/cliente', '--port', PUERTO_DEL_CLIENTE, '--strictPort'], {
    stdio: 'inherit',
    env: entorno,
    detached: true,
  }),
];

let parando = false;
function parar(codigo: number): void {
  if (parando) return;
  parando = true;
  for (const hijo of hijos) {
    if (hijo.pid === undefined || hijo.exitCode !== null) continue;
    try {
      // El signo menos para el grupo entero, no solo el primer proceso.
      process.kill(-hijo.pid, 'SIGTERM');
    } catch {
      // Ya habia terminado.
    }
  }
  process.exitCode = codigo;
}

process.once('SIGINT', () => {
  parar(0);
});
process.once('SIGTERM', () => {
  parar(0);
});
for (const hijo of hijos) {
  hijo.once('exit', (codigo) => {
    if (!parando) {
      console.error(
        codigo === 0
          ? 'Uno de los dos procesos ha terminado: paro el otro.'
          : 'Uno de los dos procesos ha fallado (¿un puerto ocupado? mira el error de arriba): paro el otro.',
      );
    }
    parar(codigo ?? 1);
  });
}
