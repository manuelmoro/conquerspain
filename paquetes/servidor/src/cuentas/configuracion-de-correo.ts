// Que correo usa el servidor (ficha T-066), segun el entorno: SMTP de verdad si hay `SMTP_HOST`; si
// no, la consola, y solo en desarrollo (un enlace en la consola de produccion daria acceso a cuentas).
import { CorreoPorConsola } from './correo.ts';
import type { EnviadorDeCorreo } from './correo.ts';
import { CorreoPorSmtp } from './smtp.ts';
import type { ConfiguracionSmtp, SeguridadSmtp } from './smtp.ts';

export type Entorno = Readonly<Record<string, string | undefined>>;

const SEGURIDADES: readonly SeguridadSmtp[] = ['tls', 'starttls', 'ninguna'];

/** La configuracion SMTP del entorno, o null si no hay `SMTP_HOST`. Lanza si esta a medias. */
export function configuracionSmtp(entorno: Entorno, urlPublica: string): ConfiguracionSmtp | null {
  const host = entorno['SMTP_HOST'];
  if (host === undefined || host === '') return null;
  const puerto = Number(entorno['SMTP_PUERTO'] ?? '587');
  if (!Number.isInteger(puerto) || puerto <= 0 || puerto > 65535) {
    throw new Error(`SMTP_PUERTO no es un puerto valido: «${entorno['SMTP_PUERTO'] ?? ''}».`);
  }
  const pedida = entorno['SMTP_SEGURIDAD'] ?? (puerto === 465 ? 'tls' : 'starttls');
  const seguridad = SEGURIDADES.find((s) => s === pedida);
  if (seguridad === undefined) {
    throw new Error(`SMTP_SEGURIDAD tiene que ser tls, starttls o ninguna, no «${pedida}».`);
  }
  const remitente = entorno['CORREO_REMITENTE'];
  if (remitente === undefined || !remitente.includes('@')) {
    throw new Error(
      'Falta CORREO_REMITENTE (por ejemplo «ConquerSpain <avisos@tu-dominio.es>»): con SMTP_HOST hace falta saber desde donde se escribe.',
    );
  }
  const usuario = entorno['SMTP_USUARIO'] ?? null;
  const clave = entorno['SMTP_CLAVE'] ?? null;
  if ((usuario === null) !== (clave === null)) {
    throw new Error('SMTP_USUARIO y SMTP_CLAVE van juntos: pon los dos o ninguno.');
  }
  return {
    host,
    puerto,
    seguridad,
    usuario,
    clave,
    remitente,
    responderA: entorno['CORREO_RESPONDER_A'] ?? null,
    urlPublica,
    tiempoMaximoMs: 15_000,
  };
}

/** El enviador que toca, y como describirlo en el registro sin ningun secreto. */
export function enviadorDesdeEntorno(
  entorno: Entorno,
  desarrollo: boolean,
  urlPublica: string,
): { readonly correo: EnviadorDeCorreo; readonly descripcion: string } {
  const smtp = configuracionSmtp(entorno, urlPublica);
  if (smtp !== null) {
    return {
      correo: new CorreoPorSmtp(smtp),
      descripcion: `smtp ${smtp.host}:${String(smtp.puerto)} (${smtp.seguridad})`,
    };
  }
  if (!desarrollo) {
    throw new Error(
      'Falta SMTP_HOST: en produccion el correo tiene que salir de verdad (enlaces para entrar y avisos). Mira docs/07 «El correo».',
    );
  }
  return { correo: new CorreoPorConsola(), descripcion: 'consola (desarrollo)' };
}
