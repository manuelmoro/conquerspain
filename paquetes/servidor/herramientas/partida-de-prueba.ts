// Deja lista una partida de prueba en la base de desarrollo (checkpoint J-01, ficha T-082): crea la
// cuenta del correo si no existe, convoca en solitario con la casa pedida, sortea y elige la primera
// comarca. Luego basta con `npm run dev`, entrar con ese correo y abrir la partida.
//
//   npm run partida:prueba -- tu@correo.es [casa]
import { cargarMundo } from '@conquer/mundo';
import { CASAS, TABLAS_DEL_JUEGO, explicar } from '@conquer/nucleo';

import { ServicioDeAltas } from '../src/altas/servicio.ts';
import { RepositorioSqlite } from '../src/persistencia/sqlite.ts';

const [correo, casa = 'hortelanos'] = process.argv.slice(2);
if (correo === undefined || !correo.includes('@')) {
  console.error('Uso: npm run partida:prueba -- tu@correo.es [casa]');
  process.exit(1);
}
if (!CASAS.some((c) => c === casa)) {
  console.error(`La casa tiene que ser una de: ${CASAS.join(', ')}.`);
  process.exit(1);
}
const mundo = cargarMundo(new URL('../../mundo/datos/mundo.v1.json', import.meta.url).pathname);
if (!mundo.ok) throw new Error(explicar(mundo.errores));
const ahora = Date.now();
const repo = new RepositorioSqlite(process.env['BASE_DE_DATOS'] ?? 'desarrollo.sqlite');
await repo.migrar(ahora);
const cuenta = await repo.cuentaDeCorreo(
  correo.toLowerCase(),
  `c-prueba-${String(ahora)}`,
  correo.split('@')[0] ?? 'Jugador',
  ahora,
);
const altas = new ServicioDeAltas({
  repo,
  mundoCompleto: mundo.valor,
  reglas: TABLAS_DEL_JUEGO,
  ahora: () => ahora,
});
const { id } = await altas.convocar(cuenta.id, {
  nombre: `Prueba de ${casa}`,
  casa,
  intervaloMinutos: 1440,
  plazas: 1,
  esDePrueba: true,
});
const sorteada = await altas.sortear(cuenta.id, id);
const primera = sorteada.misOfertas[0];
if (primera === undefined) throw new Error('El sorteo no dio ninguna comarca.');
await altas.elegir(cuenta.id, id, { comarca: primera.comarca });
await repo.cerrar();
console.log(`Partida de prueba "${id}" lista: ${casa} en ${primera.nombre}.`);
console.log(
  'Ahora: npm run dev, entra con ese correo (el enlace sale en la consola) y abre la partida.',
);
console.log(
  'El turno se resuelve con el boton «Resolver el turno ya» (solo en partidas de prueba).',
);
