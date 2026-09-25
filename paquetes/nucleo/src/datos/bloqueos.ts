// Por que no se puede una accion y que hacer para poder (ficha T-082 §4.3): cada bloqueo dice su
// causa y su salida, en palabras del jugador. Es texto de interfaz, pero vive aqui porque la ficha
// lo compone en el nucleo, junto a las reglas que lo deciden.
export interface TextoDeBloqueo {
  readonly causa: string;
  readonly salida: string;
}

export const BLOQUEOS: Readonly<Record<string, TextoDeBloqueo>> = {
  'nivel-maximo': {
    causa: 'Este edificio ya está al máximo que admite aquí tu casa.',
    salida: 'Levanta otro edificio, o el mismo en otra comarca tuya.',
  },
  'sin-solar': {
    causa: 'No quedan solares libres en la comarca.',
    salida: 'Derriba un edificio que no rinda, o construye en otra comarca.',
  },
  'potencial-insuficiente': {
    causa: 'La tierra de esta comarca no da para este edificio.',
    salida: 'Búscalo en una comarca con más potencial; roturar convierte monte en labor.',
  },
  'falta-edificio-requerido': {
    causa: 'Antes hace falta el edificio del que depende.',
    salida:
      'Construye primero el edificio que pide (por ejemplo, la carbonera antes que la ferrería).',
  },
  'sin-permiso': {
    causa: 'Tu casa no sabe levantar este edificio.',
    salida: 'Algunas tradiciones lo permiten: míralas cuando se abra una ronda.',
  },
  'sin-monte': {
    causa: 'No queda monte que roturar.',
    salida: 'Rotura en otra comarca con monte.',
  },
  'labor-al-maximo': {
    causa: 'La labor ya está al máximo: no se puede roturar más.',
    salida: 'Aprovecha la labor con granjas y aperos.',
  },
  'prohibido-por-la-casa': {
    causa: 'Tu casa no rotura: vive de otra cosa.',
    salida: 'Busca el pan comprándolo o en comarcas que ya tengan labor.',
  },
  'aperos-al-maximo': {
    causa: 'Los aperos ya están al máximo que alcanza tu casa.',
    salida: 'Instálalos en otra comarca.',
  },
  'comarca-con-duenyo': {
    causa: 'La comarca ya tiene dueño.',
    salida: 'Solo se incorporan las comarcas neutrales.',
  },
  'influencia-baja': {
    causa: 'Tu influencia en el concejo no llega a lo que pide.',
    salida: 'Deja una recua presente, haz regalos o levanta un mercado cerca.',
  },
  'sin-ventaja': {
    causa: 'Otra casa tiene casi tanta influencia como tú, por lo que sabes de ella.',
    salida: 'Gana ventaja con presencia y regalos antes de pedir la incorporación.',
  },
  'muy-lejos': {
    causa: 'La comarca queda demasiado lejos de tu dominio por camino conocido.',
    salida: 'Incorpora antes una comarca intermedia, o explora un camino más corto.',
  },
  escasez: {
    causa: 'Con escasez no se emprende nada nuevo.',
    salida: 'Consigue pan: compra en la plaza o reduce lo que consumes.',
  },
  'regalo-reciente': {
    causa: 'El concejo recibió un regalo tuyo hace poco.',
    salida: 'Espera unos turnos: los regalos seguidos no valen.',
  },
};
