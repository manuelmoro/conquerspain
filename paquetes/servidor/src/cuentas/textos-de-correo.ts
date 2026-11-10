// Lo que dice cada correo (ficha T-066): el asunto y el texto plano de cada enlace, y el pie de los
// avisos con la baja. Lo usa el transporte real; la consola de desarrollo solo escribe el enlace.
import type { MensajeDeAviso, MensajeDeEnlace, MotivoDeEnlace } from './correo.ts';

export interface CorreoCompuesto {
  readonly asunto: string;
  readonly texto: string;
}

const ASUNTO: Readonly<Record<MotivoDeEnlace, string>> = {
  entrar: 'Tu enlace para entrar en ConquerSpain',
  confirmar: 'Confirma tu correo en ConquerSpain',
  restablecer: 'Pon una contraseña nueva en ConquerSpain',
  'ya-registrado': 'Ya tienes una cuenta en ConquerSpain',
};

const PARA_QUE: Readonly<Record<MotivoDeEnlace, string>> = {
  entrar: 'Pulsa este enlace para entrar en ConquerSpain:',
  confirmar:
    'Pulsa este enlace para confirmar que este correo es tuyo y terminar de crear tu cuenta:',
  restablecer: 'Pulsa este enlace para poner una contraseña nueva:',
  'ya-registrado':
    'Alguien (quizá tú) ha intentado crear una cuenta con este correo, pero ya tienes una. Si fuiste tú y no recuerdas la contraseña, ponle una nueva aquí:',
};

/** Un correo con enlace: para qué es, el enlace, cuánto dura y qué hacer si no lo pediste. */
export function componerEnlace(m: MensajeDeEnlace): CorreoCompuesto {
  const motivo = m.motivo ?? 'entrar';
  const saludo = m.nombre === null ? 'Hola:' : `Hola, ${m.nombre}:`;
  return {
    asunto: ASUNTO[motivo],
    texto: [
      saludo,
      '',
      PARA_QUE[motivo],
      m.enlace,
      '',
      `El enlace vale ${String(m.caducaEnMinutos)} minutos y una sola vez.`,
      'Si no lo has pedido tú, no hagas nada: sin el enlace nadie puede entrar en tu cuenta.',
      '',
      '— ConquerSpain',
    ].join('\n'),
  };
}

/** Un aviso de resolución, con el pie que dice cómo dejar de recibirlos. */
export function componerAviso(m: MensajeDeAviso, urlPublica: string): CorreoCompuesto {
  return {
    asunto: m.asunto,
    texto: [
      m.texto,
      '',
      '—',
      `Para dejar de recibir estos avisos, entra en ${urlPublica} y, en la partida, cambia los avisos en «Tu casa».`,
    ].join('\n'),
  };
}
