// Que correo usa el servidor segun el entorno (T-066).
import { describe, expect, it } from 'vitest';

import { configuracionSmtp, enviadorDesdeEntorno } from './configuracion-de-correo.ts';
import { CorreoPorConsola } from './correo.ts';
import { CorreoPorSmtp } from './smtp.ts';

const URL = 'https://juego.ejemplo.es';
const SMTP = {
  SMTP_HOST: 'smtp.ejemplo.es',
  SMTP_USUARIO: 'avisos@ejemplo.es',
  SMTP_CLAVE: 'secreta',
  CORREO_REMITENTE: 'ConquerSpain <avisos@ejemplo.es>',
};

describe('el correo según el entorno', () => {
  it('con SMTP_HOST, SMTP; el puerto 465 va con TLS y el resto con STARTTLS', () => {
    expect(configuracionSmtp(SMTP, URL)).toMatchObject({ puerto: 587, seguridad: 'starttls' });
    expect(configuracionSmtp({ ...SMTP, SMTP_PUERTO: '465' }, URL)).toMatchObject({
      seguridad: 'tls',
    });
    const r = enviadorDesdeEntorno(SMTP, false, URL);
    expect(r.correo).toBeInstanceOf(CorreoPorSmtp);
    // El registro dice qué transporte, nunca la clave ni el usuario.
    expect(r.descripcion).toBe('smtp smtp.ejemplo.es:587 (starttls)');
  });

  it('sin SMTP_HOST: la consola en desarrollo, y en producción no arranca', () => {
    expect(enviadorDesdeEntorno({}, true, URL).correo).toBeInstanceOf(CorreoPorConsola);
    expect(() => enviadorDesdeEntorno({}, false, URL)).toThrow(/Falta SMTP_HOST/);
  });

  it('una configuración a medias se dice al arrancar, con qué falta', () => {
    expect(() => configuracionSmtp({ SMTP_HOST: 'smtp.ejemplo.es' }, URL)).toThrow(
      /CORREO_REMITENTE/,
    );
    expect(() => configuracionSmtp({ ...SMTP, SMTP_CLAVE: undefined }, URL)).toThrow(/van juntos/);
    expect(() => configuracionSmtp({ ...SMTP, SMTP_PUERTO: 'no' }, URL)).toThrow(/SMTP_PUERTO/);
    expect(() => configuracionSmtp({ ...SMTP, SMTP_SEGURIDAD: 'ssl' }, URL)).toThrow(
      /SMTP_SEGURIDAD/,
    );
  });
});
