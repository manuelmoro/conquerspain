import { describe, expect, it } from 'vitest';

import type { InvitacionRecibida } from './api.ts';
import { codigoDeLaDireccion, enlaceDeInvitacion, textoDeInvitacion } from './invitacion.ts';

const base: InvitacionRecibida = {
  nombre: 'La Meseta',
  convoca: 'Ana',
  momento: 'empezada',
  turno: 7,
  intervaloMinutos: 1440,
  casas: [
    { casa: 'mesta', nombre: 'La Mesta', veces: 2 },
    { casa: 'monjes', nombre: 'Monjes', veces: 1 },
  ],
  casasLlenas: ['mesta'],
  plazasLibres: 9,
};

describe('el enlace de invitación', () => {
  it('va y vuelve: el código del enlace es el de la dirección', () => {
    const enlace = enlaceDeInvitacion('https://conquerspain.com', 'mSgg-W0_Q8');
    expect(enlace).toBe('https://conquerspain.com/?unirse=mSgg-W0_Q8');
    expect(codigoDeLaDireccion(new URL(enlace).search)).toBe('mSgg-W0_Q8');
  });

  it('una dirección sin código, o con basura, no invita a nada', () => {
    expect(codigoDeLaDireccion('?partida=p-1')).toBeNull();
    expect(codigoDeLaDireccion('?unirse=')).toBeNull();
    expect(codigoDeLaDireccion('?unirse=<script>')).toBeNull();
  });
});

describe('textoDeInvitacion', () => {
  it('una partida empezada: quién invita, el turno, el amparo y las casas que juegan', () => {
    const t = textoDeInvitacion(base);
    expect(t.titulo).toBe('Ana te invita a «La Meseta»');
    expect(t.detalle).toContain('Un turno cada día');
    expect(t.detalle).toContain('turno 7');
    expect(t.detalle).toContain('amparo');
    expect(t.detalle).toContain('La Mesta (×2), Monjes');
  });

  it('apuntándose, sorteando y cerrada dicen cada una lo suyo', () => {
    expect(textoDeInvitacion({ ...base, momento: 'apuntandose' }).detalle).toContain(
      'quedan 9 plazas',
    );
    expect(textoDeInvitacion({ ...base, momento: 'sorteando' }).detalle).toContain(
      'en cuanto empiece',
    );
    expect(textoDeInvitacion({ ...base, momento: 'cerrada' }).detalle).toContain('terminado');
  });
});
