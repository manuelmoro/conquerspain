// Invitar con un enlace (ficha T-125 §2.2): el enlace, como se lee de la direccion y lo que se cuenta
// de la partida a quien lo abre. Puro.
import type { InvitacionRecibida } from './api.ts';
import { ritmoEnPalabras } from './inicio.ts';

/** Donde se recuerda el codigo mientras quien fue invitado crea su cuenta o entra. */
export const CLAVE_DE_INVITACION = 'conquer:invitacion';

/** El parametro de la direccion que lleva el codigo. */
export const PARAMETRO_DE_INVITACION = 'unirse';

export function enlaceDeInvitacion(origen: string, codigo: string): string {
  return `${origen}/?${PARAMETRO_DE_INVITACION}=${encodeURIComponent(codigo)}`;
}

/** El codigo para leerlo o dictarlo: los nuevos (T-131), en tres grupos de cuatro; los antiguos, tal cual. */
export function codigoLegible(codigo: string): string {
  return /^[0-9A-Z]{12}$/.test(codigo) ? (codigo.match(/.{4}/g) ?? [codigo]).join('-') : codigo;
}

/** El codigo de una direccion como `?unirse=…`, o null. */
export function codigoDeLaDireccion(busqueda: string): string | null {
  const codigo = new URLSearchParams(busqueda).get(PARAMETRO_DE_INVITACION)?.trim() ?? '';
  return /^[A-Za-z0-9_-]{4,64}$/.test(codigo) ? codigo : null;
}

/** Lo que se le cuenta a quien abre el enlace, en dos frases. */
export function textoDeInvitacion(v: InvitacionRecibida): {
  readonly titulo: string;
  readonly detalle: string;
} {
  const titulo = `${v.convoca} te invita a «${v.nombre}»`;
  const casas =
    v.casas.length === 0
      ? ''
      : ` Ya juegan: ${v.casas.map((c) => (c.veces > 1 ? `${c.nombre} (×${String(c.veces)})` : c.nombre)).join(', ')}.`;
  const ritmo = ritmoEnPalabras(v.intervaloMinutos);
  switch (v.momento) {
    case 'apuntandose':
      return {
        titulo,
        detalle: `${ritmo}. Aún se está apuntando gente (quedan ${String(v.plazasLibres)} plazas).${casas}`,
      };
    case 'sorteando':
      return {
        titulo,
        detalle: `${ritmo}. Se están eligiendo los orígenes: podrás entrar en cuanto empiece.${casas}`,
      };
    case 'empezada':
      return {
        titulo,
        detalle: `${ritmo}. Ya va por el turno ${String(v.turno ?? 1)}: entras con una comarca libre, lejos de los demás, y veinte turnos de amparo.${casas}`,
      };
    case 'cerrada':
      return { titulo, detalle: 'Esta partida ya ha terminado: no admite a nadie más.' };
  }
}
