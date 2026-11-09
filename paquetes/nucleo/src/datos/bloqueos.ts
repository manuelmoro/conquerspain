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
  'regalo-pedido': {
    causa: 'Ya tienes un regalo pedido para este concejo.',
    salida:
      'Un concejo acepta un regalo cada pocos turnos: espera a que se entregue el que está pedido.',
  },
  // Los viajes y las misiones de las recuas (T-083).
  'sin-recua-libre': {
    causa: 'No tienes ninguna recua quieta en casa y sin nada pendiente.',
    salida: 'Forma una recua en una comarca tuya, o espera a que vuelva la que está fuera.',
  },
  'sin-ruta': {
    causa: 'No conoces ningún camino que llegue hasta allí.',
    salida: 'Explora las comarcas de en medio para saber por dónde se va.',
  },
  'puerto-cerrado': {
    causa: 'Un puerto del camino se cierra antes de que la recua lo cruce.',
    salida: 'Espera al deshielo, o busca otro camino que no pase por la sierra.',
  },
  'demasiado-largo': {
    causa: 'El viaje dura más de lo que aguanta una recua.',
    salida: 'Elige un destino más cercano, o gana antes tierra por el camino.',
  },
  'no-cabe': {
    causa: 'El bastimento del viaje y la carga no caben en la recua.',
    salida: 'Lleva menos carga, o elige un destino más cercano.',
  },
  'sin-sal': {
    causa: 'En verano el camino pide sal para las conservas, y no tienes bastante.',
    salida: 'Compra sal o espera a que pase el verano.',
  },
  'sin-pan': {
    causa: 'No tienes pan bastante en el almacén para lo que se come el camino.',
    salida: 'Junta pan antes: una granja más o comprarlo en una plaza.',
  },
  // El gobierno de las comarcas propias (T-089).
  'comarca-ajena': {
    causa: 'La comarca no es de tu dominio.',
    salida: 'Gánala primero: influencia e incorporación.',
  },
  'fuero-reciente': {
    causa: 'El fuero de esta comarca cambió hace poco: solo se cambia una vez cada 10 turnos.',
    salida: 'Espera a que pasen los turnos; la orden puede quedar dada y se cumple sola.',
  },
  'fuero-irreversible': {
    causa: 'Un fuero pleno no se puede quitar en sus primeros 20 turnos.',
    salida: 'Espera a que pasen; quitarlo después costará 20 de lealtad.',
  },
  'ya-construida': {
    causa: 'Esa obra ya está hecha aquí.',
    salida: 'Elige otra obra u otro lugar.',
  },
  'ya-en-obra': {
    causa: 'Esa obra ya está empezada aquí.',
    salida: 'Sigue la que hay en marcha.',
  },
  'sin-tramo': {
    causa: 'No hay camino entre estas dos comarcas.',
    salida: 'Elige un tramo que exista, hacia una vecina.',
  },
  'sin-vado': {
    causa: 'El tramo no tiene vado: no hay río que salvar.',
    salida: 'Los puentes van en los tramos con vado.',
  },
  'sin-camino-carretero': {
    causa: 'Una calzada se hace sobre un camino carretero.',
    salida: 'Mejora antes el tramo a camino carretero.',
  },
  'poca-lealtad': {
    causa: 'La comarca no es bastante leal para un monasterio (hace falta 60).',
    salida: 'Sube su lealtad: fuero, carga ligera, mercado u obras.',
  },
  'no-es-ciudad': {
    causa: 'La catedral pide una ciudad: 200 vecinos y muralla.',
    salida: 'Haz crecer la comarca y levanta la muralla.',
  },
  'sin-sede-episcopal': {
    causa: 'Esta comarca no es sede de obispado.',
    salida: 'La catedral solo se levanta en una ciudad episcopal.',
  },
  'sin-cantera': {
    causa: 'Hace falta una cantera propia en la comarca.',
    salida: 'Construye antes la cantera.',
  },
  'no-es-costa': {
    causa: 'La atarazana solo se levanta en la costa.',
    salida: 'Elige una comarca costera.',
  },
  'sin-vega-fluvial': {
    causa: 'La acequia mayor pide una vega con río.',
    salida: 'Elige una vega fluvial.',
  },
  'ya-es-capital': {
    causa: 'Tu corte ya está aquí.',
    salida: 'El traslado se da hacia otra comarca tuya.',
  },
  'traslado-en-marcha': {
    causa: 'Ya hay un traslado de la corte en marcha.',
    salida: 'Espera a que termine.',
  },
};
