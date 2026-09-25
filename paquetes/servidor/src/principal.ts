// El servidor de verdad (ficha T-080 §4.7): base en un fichero, reloj con su despachador de correos,
// API y HTTP. La configuracion entra por el entorno; sin CLAVE_DE_COOKIES solo arranca en desarrollo.
import { randomBytes } from 'node:crypto';

import { cargarMundo } from '@conquer/mundo';
import { TABLAS_DEL_JUEGO, explicar, resolverTurno } from '@conquer/nucleo';

import { ServicioDeAltas } from './altas/servicio.ts';
import { crearApi } from './api/manejadores.ts';
import { servirHttp } from './api/http.ts';
import { CanalDeAvisos } from './avisos/canal.ts';
import { DespachadorDeCorreos } from './avisos/despachador.ts';
import { autenticadorDeSesiones } from './cuentas/autenticador.ts';
import { CorreoPorConsola } from './cuentas/correo.ts';
import { ServicioDeCuentas } from './cuentas/servicio.ts';
import { RepositorioSqlite } from './persistencia/sqlite.ts';
import { proveedorDeRecorte } from './reloj/mundoDeLaPartida.ts';
import type { Registro } from './reloj/registro.ts';
import { Reloj } from './reloj/reloj.ts';

const entorno = process.env;
const desarrollo = entorno['NODE_ENV'] !== 'production';
const puerto = Number(entorno['PUERTO'] ?? 8471);
const baseDeDatos = entorno['BASE_DE_DATOS'] ?? 'conquerspain.sqlite';
const urlPublica = entorno['URL_PUBLICA'] ?? 'http://localhost:5173';
const claveEnTexto = entorno['CLAVE_DE_COOKIES'];
if (claveEnTexto === undefined && !desarrollo) {
  throw new Error(
    'Falta CLAVE_DE_COOKIES (al menos 32 bytes aleatorios en base64): sin ella no se puede firmar la sesion.',
  );
}
const claveDeCookies =
  claveEnTexto === undefined
    ? randomBytes(32)
    : new Uint8Array(Buffer.from(claveEnTexto, 'base64'));

const mundoCargado = cargarMundo(
  new URL('../../mundo/datos/mundo.v1.json', import.meta.url).pathname,
);
if (!mundoCargado.ok) throw new Error(`El mundo no valida:\n${explicar(mundoCargado.errores)}`);
const mundo = mundoCargado.valor;

const registro: Registro = {
  anotar: (nivel, evento, datos = {}) => {
    console.log(JSON.stringify({ nivel, evento, ...datos }));
  },
};
const ahora = (): number => Date.now();
const repo = new RepositorioSqlite(baseDeDatos);
await repo.migrar(ahora());
const correo = new CorreoPorConsola();
const canal = new CanalDeAvisos();
const proveedorDeMundo = proveedorDeRecorte(mundo, TABLAS_DEL_JUEGO);
const cuentas = new ServicioDeCuentas({
  repo,
  correo,
  claveDeCookies,
  urlPublica,
  registro,
  ahora,
  cookieSegura: !desarrollo,
});
const api = crearApi({
  repo,
  reglas: TABLAS_DEL_JUEGO,
  proveedorDeMundo,
  autenticador: autenticadorDeSesiones(cuentas),
  registro,
  ahora,
  cuentas,
  canal,
  avisos: repo,
  altas: new ServicioDeAltas({ repo, mundoCompleto: mundo, reglas: TABLAS_DEL_JUEGO, ahora }),
  avanzar: (id) => {
    if (relojListo === null) throw new Error('El reloj aun no ha arrancado.');
    return relojListo.avanzarManual(id);
  },
});
// El reloj se crea despues de la API: la ruta de avance manual lo llama por esta referencia.
let relojListo: Reloj | null = null;
const reloj = new Reloj(
  { repo, reglas: TABLAS_DEL_JUEGO, proveedorDeMundo, resolverTurno, registro, ahora, canal },
  { despachador: new DespachadorDeCorreos({ repo, correo, registro, ahora }) },
);
const servidor = await servirHttp(api, { puerto });
relojListo = reloj;
reloj.iniciar();
console.log(
  `ConquerSpain escucha en http://127.0.0.1:${String(servidor.puerto)} (base: ${baseDeDatos}).`,
);

for (const senyal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(senyal, () => {
    void (async () => {
      await reloj.parar();
      await servidor.cerrar();
      await repo.cerrar();
      process.exit(0);
    })();
  });
}
