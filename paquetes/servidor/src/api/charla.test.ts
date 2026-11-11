// La charla de la partida (ficha T-129 §4): escribir, leer con autor y turno, lo no leido por jugador,
// el aviso en vivo, los limites del texto y que solo hablan quienes juegan.
import { describe, expect, it } from 'vitest';

import type { IdJugador } from '@conquer/nucleo';

import { CanalDeAvisos } from '../avisos/canal.ts';
import type { EventoDePartida } from '../avisos/canal.ts';
import { LARGO_MAXIMO_DE_MENSAJE, MENSAJES_POR_PAGINA, textoDeMensaje } from './charla.ts';
import { crearApi } from './manejadores.ts';
import { CUENTAS, apiDePrueba } from './prueba-comun.ts';
import { CuboDeFichas } from './limites.ts';

const MESTA = CUENTAS['mesta'] ?? '';
const MONJES = CUENTAS['monjes'] ?? '';

async function entorno() {
  const e = await apiDePrueba({ turnosJugados: 1 });
  const canal = new CanalDeAvisos();
  const api = crearApi({
    ...e.dep,
    canal,
    charla: e.repo,
    cubo: new CuboDeFichas(100_000, 100_000),
  });
  const pedir = (cuenta: string, metodo: string, ruta: string, cuerpo?: unknown) =>
    api({
      metodo,
      ruta,
      cabeceras: { 'x-cuenta': cuenta, 'content-type': 'application/json' },
      cuerpo: cuerpo === undefined ? null : JSON.stringify(cuerpo),
    });
  const eventos: EventoDePartida[] = [];
  canal.suscribir(e.estado.id, (ev) => eventos.push(ev));
  return { ...e, pedir, eventos };
}

describe('la charla', () => {
  it('se escribe y se lee con autor, casa y turno, y avisa en vivo', async () => {
    const e = await entorno();
    const r = await e.pedir(MESTA, 'POST', '/partidas/p1/charla', {
      texto: '  ¿Feria en Medina?  ',
    });
    expect(r.estado, JSON.stringify(r.cuerpo)).toBe(201);
    expect(r.cuerpo).toMatchObject({
      mensaje: { jugador: 'mesta', casa: 'mesta', turno: 2, texto: '¿Feria en Medina?' },
    });
    expect(e.eventos).toMatchObject([{ tipo: 'mensaje', mensaje: { texto: '¿Feria en Medina?' } }]);
    await e.pedir(MONJES, 'POST', '/partidas/p1/charla', { texto: 'Allí estaré.' });
    const leida = await e.pedir(MONJES, 'GET', '/partidas/p1/charla');
    expect(leida.cuerpo).toMatchObject({
      mensajes: [
        { jugador: 'mesta', texto: '¿Feria en Medina?' },
        { jugador: 'monjes', texto: 'Allí estaré.' },
      ],
      hayMas: false,
    });
    await e.repo.cerrar();
  }, 60_000);

  it('cuenta lo no leído por jugador, sin contar lo propio, y se da por leído', async () => {
    const e = await entorno();
    const primero = await e.pedir(MESTA, 'POST', '/partidas/p1/charla', { texto: 'uno' });
    await e.pedir(MESTA, 'POST', '/partidas/p1/charla', { texto: 'dos' });
    expect((await e.pedir(MESTA, 'GET', '/partidas/p1/estado')).cuerpo).toMatchObject({
      charlaSinLeer: 0,
    });
    expect((await e.pedir(MONJES, 'GET', '/partidas/p1/estado')).cuerpo).toMatchObject({
      charlaSinLeer: 2,
    });
    const id = (primero.cuerpo as { mensaje: { id: number } }).mensaje.id;
    expect(
      (await e.pedir(MONJES, 'PUT', '/partidas/p1/charla/leidos', { hasta: id })).cuerpo,
    ).toMatchObject({ sinLeer: 1 });
    // Nunca hacia atras.
    await e.pedir(MONJES, 'PUT', '/partidas/p1/charla/leidos', { hasta: id + 1 });
    expect(
      (await e.pedir(MONJES, 'PUT', '/partidas/p1/charla/leidos', { hasta: 0 })).cuerpo,
    ).toMatchObject({ sinLeer: 0 });
    await e.repo.cerrar();
  }, 60_000);

  it('trae los mensajes de cien en cien, los anteriores con /antes/:mensaje', async () => {
    const e = await entorno();
    for (let i = 1; i <= MENSAJES_POR_PAGINA + 5; i += 1) {
      await e.repo.guardarMensaje(e.estado.id, 'mesta' as IdJugador, `m${String(i)}`, i);
    }
    const ultimos = (await e.pedir(MONJES, 'GET', '/partidas/p1/charla')).cuerpo as {
      mensajes: { id: number; texto: string }[];
      hayMas: boolean;
    };
    expect(ultimos.mensajes).toHaveLength(MENSAJES_POR_PAGINA);
    expect(ultimos.hayMas).toBe(true);
    expect(ultimos.mensajes.at(-1)?.texto).toBe(`m${String(MENSAJES_POR_PAGINA + 5)}`);
    const primero = ultimos.mensajes[0]?.id ?? 0;
    const antes = (await e.pedir(MONJES, 'GET', `/partidas/p1/charla/antes/${String(primero)}`))
      .cuerpo as { mensajes: { texto: string }[] };
    expect(antes.mensajes.map((m) => m.texto)).toEqual(['m1', 'm2', 'm3', 'm4', 'm5']);
    await e.repo.cerrar();
  }, 60_000);

  it('solo hablan quienes juegan', async () => {
    const e = await entorno();
    const ajena = await e.pedir('cuenta-que-no-juega', 'POST', '/partidas/p1/charla', {
      texto: 'hola',
    });
    expect(ajena.cuerpo).toMatchObject({ error: { codigo: 'partida-desconocida' } });
    await e.repo.cerrar();
  }, 60_000);
});

describe('textoDeMensaje', () => {
  it('limpia espacios y caracteres de control y deja los saltos de línea', () => {
    expect(textoDeMensaje('  hola\u0007\n\n\n\nadiós  ')).toBe('hola\n\nadiós');
  });

  it('rechaza lo vacío, lo que no es texto y lo demasiado largo', () => {
    expect(() => textoDeMensaje('   ')).toThrow(/vacío/);
    expect(() => textoDeMensaje(3)).toThrow(/texto/);
    expect(() => textoDeMensaje('x'.repeat(LARGO_MAXIMO_DE_MENSAJE + 1))).toThrow(/largo/);
    expect(textoDeMensaje('ñ'.repeat(LARGO_MAXIMO_DE_MENSAJE))).toHaveLength(
      LARGO_MAXIMO_DE_MENSAJE,
    );
  });
});
