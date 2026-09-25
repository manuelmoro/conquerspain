// `npm run dev`: el servidor y Vite a la vez, con la salida de los dos en la misma consola.
import { spawn } from 'node:child_process';

const hijos = [
  spawn('npx', ['tsx', 'paquetes/servidor/src/principal.ts'], {
    stdio: 'inherit',
    env: { ...process.env, BASE_DE_DATOS: process.env['BASE_DE_DATOS'] ?? 'desarrollo.sqlite' },
  }),
  spawn('npx', ['vite', 'paquetes/cliente'], { stdio: 'inherit' }),
];
const parar = (): void => {
  for (const hijo of hijos) hijo.kill('SIGTERM');
};
process.once('SIGINT', parar);
process.once('SIGTERM', parar);
for (const hijo of hijos) {
  hijo.once('exit', (codigo) => {
    if (codigo !== 0 && codigo !== null) parar();
  });
}
