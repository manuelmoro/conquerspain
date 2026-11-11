// Deja en una base una partida de muestra entre varias cuentas con contrasenya (fichas T-124 y T-127):
// para probar en el navegador lo que necesita a mas de un jugador (terminar el turno, invitar) y para
// sacar las capturas de la guia. Las cuentas quedan confirmadas; la partida, fundada y con unos turnos
// jugados por el administrador, para que haya cronica e historico. Nada de esto toca la base de
// desarrollo salvo que se le pida.
//
//   npm run partida:muestra -- base.sqlite [turnos]
import { cargarMundo } from '@conquer/mundo';
import { TABLAS_DEL_JUEGO, explicar, resolverTurno } from '@conquer/nucleo';
import type { IdPartida } from '@conquer/nucleo';

import { ServicioDeAltas } from '../src/altas/servicio.ts';
import { hashDeClave } from '../src/cuentas/contrasenyas.ts';
import { RepositorioSqlite } from '../src/persistencia/sqlite.ts';
import { proveedorDeRecorte } from '../src/reloj/mundoDeLaPartida.ts';
import { Reloj } from '../src/reloj/reloj.ts';

/** La contrasenya de todas las cuentas de muestra: solo vale para bases de prueba. */
export const CLAVE_DE_MUESTRA = 'castilla-1492-muestra';

export interface CuentaDeMuestra {
  readonly correo: string;
  readonly nombre: string;
  readonly casa: string;
}

/** Quien juega la partida de muestra; la ultima cuenta no juega: es la que se invita (T-125). */
export const CUENTAS_DE_MUESTRA: readonly CuentaDeMuestra[] = [
  { correo: 'ana@muestra.conquerspain', nombre: 'Ana', casa: 'hortelanos' },
  { correo: 'bruno@muestra.conquerspain', nombre: 'Bruno', casa: 'mesta' },
  { correo: 'carmen@muestra.conquerspain', nombre: 'Carmen', casa: 'arrieros' },
];

export interface PartidaDeMuestra {
  readonly partida: string;
  readonly codigo: string;
}

export async function sembrarPartidaDeMuestra(
  base: string,
  turnos: number,
): Promise<PartidaDeMuestra> {
  const mundo = cargarMundo(new URL('../../mundo/datos/mundo.v1.json', import.meta.url).pathname);
  if (!mundo.ok) throw new Error(explicar(mundo.errores));
  let reloj = Date.now();
  const ahora = (): number => reloj;
  const repo = new RepositorioSqlite(base);
  await repo.migrar(ahora());
  const hash = await hashDeClave(CLAVE_DE_MUESTRA);
  const ids: string[] = [];
  for (const [i, c] of CUENTAS_DE_MUESTRA.entries()) {
    const id = `c-muestra-${String(i + 1)}`;
    await repo.crearCuentaConClave(id, c.correo, c.nombre, hash, ahora());
    await repo.confirmarCuenta(id, ahora());
    ids.push(id);
  }
  const [ana, bruno] = ids;
  const [deAna, deBruno] = CUENTAS_DE_MUESTRA;
  if (ana === undefined || bruno === undefined || deAna === undefined || deBruno === undefined) {
    throw new Error('Faltan cuentas de muestra.');
  }
  const altas = new ServicioDeAltas({
    repo,
    mundoCompleto: mundo.valor,
    reglas: TABLAS_DEL_JUEGO,
    ahora,
  });
  const { id } = await altas.convocar(ana, {
    nombre: 'La Meseta en 1492',
    casa: deAna.casa,
    intervaloMinutos: 1440,
    plazas: 2,
    esDePrueba: false,
  });
  const codigo = (await repo.convocatoria(id))?.codigo ?? '';
  await altas.unirse(bruno, { codigo, casa: deBruno.casa });
  await altas.sortear(ana, id);
  for (const cuenta of [ana, bruno]) {
    const oferta = (await altas.ver(cuenta, id)).misOfertas[0];
    if (oferta === undefined) throw new Error('El sorteo no dio ninguna comarca.');
    await altas.elegir(cuenta, id, { comarca: oferta.comarca });
  }
  const partida = (await repo.convocatoria(id))?.partida;
  if (partida === null || partida === undefined) throw new Error('La partida no se fundo.');
  const registro = { anotar: () => undefined };
  const resolutor = new Reloj({
    repo,
    reglas: TABLAS_DEL_JUEGO,
    proveedorDeMundo: proveedorDeRecorte(mundo.valor, TABLAS_DEL_JUEGO),
    resolverTurno,
    registro,
    ahora,
  });
  for (let t = 0; t < turnos; t += 1) {
    reloj += 60_000;
    await resolutor.avanzarManual(partida as IdPartida, { porElAdministrador: true });
  }
  await repo.cerrar();
  return { partida, codigo };
}

if (import.meta.url === `file://${process.argv[1] ?? ''}`) {
  const [base, turnos = '3'] = process.argv.slice(2);
  if (base === undefined || base === 'desarrollo.sqlite') {
    console.error(
      'Uso: npm run partida:muestra -- base.sqlite [turnos] (una base aparte, no la de desarrollo).',
    );
    process.exit(1);
  }
  const { partida, codigo } = await sembrarPartidaDeMuestra(base, Number(turnos));
  console.log(`Partida de muestra "${partida}" lista en ${base} (código de invitación ${codigo}).`);
  for (const c of CUENTAS_DE_MUESTRA) {
    console.log(`  ${c.nombre} (${c.casa}): ${c.correo} / ${CLAVE_DE_MUESTRA}`);
  }
}
