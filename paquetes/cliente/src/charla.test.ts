// La charla en el cliente (ficha T-129 §4): abrir trae y da por leido, escribir anyade sin duplicar lo
// que tambien llega por el canal, y lo de otros cuenta como no leido mientras esta cerrada.
import { describe, expect, it } from 'vitest';

import type { IdJugador } from '@conquer/nucleo';

import type { MensajeRecibido } from './api.ts';
import { leerMensaje } from './eventos.ts';
import { horaDeMensaje } from './pantallas/charla.ts';
import { montar } from './prueba-comun.ts';

const deLosMonjes = (id: number, texto: string): MensajeRecibido => ({
  id,
  jugador: 'monjes',
  nombre: 'Luis',
  casa: 'monjes',
  turno: 2,
  texto,
  enviadoEn: 1,
});

describe('la charla en el cliente', () => {
  it('escribe, no duplica, cuenta lo ajeno sin leer y al abrir lo da por leído', async () => {
    const m = await montar();
    await m.almacen.abrirPartida('p1');
    await m.almacen.abrirCharla();
    expect(m.almacen.estado.charla?.mensajes).toEqual([]);
    expect(await m.almacen.escribirEnLaCharla('¿Quién va a la feria?')).toBe(true);
    const propio = m.almacen.estado.charla?.mensajes[0];
    expect(propio).toMatchObject({ jugador: 'mesta', texto: '¿Quién va a la feria?' });
    // El mismo mensaje por el canal en vivo no se duplica.
    if (propio !== undefined) m.almacen.alMensaje(propio);
    expect(m.almacen.estado.charla?.mensajes).toHaveLength(1);

    m.almacen.cerrarCharla();
    const ajeno = await m.e.repo.guardarMensaje(m.e.estado.id, 'monjes' as IdJugador, 'Yo', 2);
    m.almacen.alMensaje({ ...deLosMonjes(ajeno.id, 'Yo') });
    expect(m.almacen.estado.charlaSinLeer).toBe(1);
    expect(m.almacen.estado.charla?.mensajes).toHaveLength(2);

    await m.almacen.abrirCharla();
    expect(m.almacen.estado.charlaSinLeer).toBe(0);
    // Al volver a abrir la partida, lo leido sigue leido: lo guarda el servidor.
    await m.almacen.abrirPartida('p1');
    expect(m.almacen.estado.charlaSinLeer).toBe(0);
    await m.cerrar();
  }, 60_000);
});

describe('leerMensaje', () => {
  it('lee el evento bueno e ignora lo mal formado', () => {
    const bueno = deLosMonjes(7, 'hola');
    expect(leerMensaje(JSON.stringify(bueno))).toEqual(bueno);
    expect(leerMensaje('no es json')).toBeNull();
    expect(leerMensaje(JSON.stringify({ ...bueno, id: '7' }))).toBeNull();
  });
});

describe('horaDeMensaje', () => {
  it('solo la hora si es de hoy; con el día si no', () => {
    const ahora = new Date(2026, 10, 11, 18, 0).getTime();
    expect(horaDeMensaje(new Date(2026, 10, 11, 9, 5).getTime(), ahora)).toBe('09:05');
    expect(horaDeMensaje(new Date(2026, 10, 9, 9, 5).getTime(), ahora)).toMatch(/9 nov.*09:05/);
  });
});
