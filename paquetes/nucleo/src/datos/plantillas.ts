// Las plantillas de la cronica (docs/08-interfaz.md §8.6; ficha T-044 §4.4 y §4.5).
//
// Una por cada tipo de suceso del motor, aunque sea `null`: un test lo comprueba. La voz es la de un
// cronista: frases cortas, concretas, con nombres propios; sin jerga de sistema ni exclamaciones.
// Los huecos se rellenan con nombres, no con identificadores (`reglas/cronica.ts`).
import type { Plantilla, PlantillaDeSuceso, SeccionDeCronica } from '../tipos/cronica.ts';
import type { TipoDeOrden } from '../tipos/ordenes.ts';

function p(
  seccion: SeccionDeCronica,
  texto: string,
  opciones: {
    readonly accion?: TipoDeOrden;
    /** Texto para los demas jugadores; si se da, la plantilla es publica. */
    readonly ajeno?: string;
    /** Publica sin jugador: la leen todos (el calendario, los acontecimientos). */
    readonly publica?: boolean;
  } = {},
): Plantilla {
  return {
    seccion,
    texto,
    accion: opciones.accion ?? null,
    publica: opciones.publica === true || opciones.ajeno !== undefined,
    textoAjeno: opciones.ajeno ?? null,
  };
}

const aviso = (texto: string, accion?: TipoDeOrden) =>
  p('avisos', texto, accion === undefined ? {} : { accion });
const suceso = (texto: string) => p('sucesos', texto);
const economia = (texto: string) => p('economia', texto);

export const PLANTILLAS: Readonly<Record<string, PlantillaDeSuceso>> = {
  // ——— Turno, almacen y ordenes: van al resumen o son detalle de auditoria ———
  'turno.empieza': null,
  'almacen.cambio': null,
  'almacen.reserva': null,
  'orden.alta': null,
  'orden.avance': null,
  'orden.estado': {
    segun: 'estado',
    casos: {
      pendiente: null,
      'en curso': null,
      terminada: null,
      'en espera': aviso('La orden de {clase} espera: {motivo}.'),
      cancelada: aviso('Se cancela la orden de {clase}: {motivo}.'),
    },
  },

  // ——— Calendario ———
  'calendario.estacion': p('sucesos', 'Empieza {estacion}.', { publica: true }),
  'calendario.clima-anunciado': {
    segun: 'efecto',
    casos: {
      normal: p('avisos', 'El año {anyo} se anuncia sin sobresaltos de tiempo.', {
        publica: true,
      }),
      seco: p('avisos', 'Para el año {anyo} se anuncia {estacion} seco en {regiones}.', {
        publica: true,
      }),
      lluvioso: p('avisos', 'Para el año {anyo} se anuncia {estacion} lluvioso en {regiones}.', {
        publica: true,
      }),
      duro: p('avisos', 'Para el año {anyo} se anuncia {estacion} duro en {regiones}.', {
        publica: true,
      }),
      benigno: p('avisos', 'Para el año {anyo} se anuncia {estacion} benigno en {regiones}.', {
        publica: true,
      }),
    },
  },
  'calendario.feria-abierta': p('avisos', 'Abre la {nombre}.', { publica: true, accion: 'ruta' }),
  'calendario.puerto-cerrado': p('avisos', '{puerto} queda cerrado por la nieve.', {
    publica: true,
  }),
  'calendario.puerto-abierto': p('sucesos', '{puerto} vuelve a estar abierto.', {
    publica: true,
  }),

  // ——— Produccion y consumo ———
  'produccion.explotacion': null,
  'produccion.maravedis': null,
  'produccion.falta-mano-de-obra': aviso(
    'En {comarca} faltan {faltan} brazos: las explotaciones no rinden entero.',
  ),
  'produccion.sin-insumo': aviso(
    'En {comarca}, {edificio} trabaja a medias por falta de insumos: {activos} de {nivel} niveles.',
    'mercado',
  ),
  'consumo.pan': null,
  // La merma ya cuenta en lo que sale del almacen; solo se dice aparte la sal que se gasto.
  'consumo.merma': economia('[Para conservar el pan se gastaron {salGastada} de sal.]'),
  // Lo pagado ya sale en el resumen; aqui solo la deuda, que es lo que exige decidir algo.
  'consumo.administracion': aviso(
    '[La administración deja {deuda} maravedís de deuda: las comarcas sin pagar pierden lealtad.]',
    'politica',
  ),
  'consumo.aviso-hambre': aviso(
    'Al paso de ahora, el pan se acaba en {turnos} turnos: quedan {reserva}.',
    'mercado',
  ),
  'consumo.aviso-emigracion': aviso(
    'Van {escasecesSeguidas} turnos de hambre: en {turnosHastaEmigrar} empezará a irse la gente.',
    'mercado',
  ),
  'consumo.aviso-aperos': aviso(
    'Faltan {hierro} de hierro para los aperos: en {turnosHastaPerderlos} turnos se perderá un nivel.',
    'mercado',
  ),
  'escasez.empieza': aviso('Falta pan: la gente pasa hambre y deja de crecer.', 'mercado'),
  'escasez.sigue': aviso('Sigue el hambre: van {seguidas} turnos sin pan bastante.', 'mercado'),
  'escasez.termina': suceso('Vuelve a haber pan para todos.'),
  'aperos.cambio': suceso('Los aperos de {comarca} quedan en nivel {nivel}.'),

  // ——— Recuas ———
  'recua.formada': suceso('Se forma {recua}, con {acemilas} acémilas[ y {vecinos} vecinos].'),
  'recua.ruta': null,
  'recua.avanza': null,
  'recua.entra': null,
  'recua.llega': suceso('{recua} llega a {comarca}.'),
  'recua.detenida': aviso('{recua} se detiene: {puerto} está cerrado.', 'ruta'),
  'recua.vuelve-por-nieve': aviso(
    '{recua} vuelve a {desde}: la nieve cerró el paso hacia {hasta}.',
    'ruta',
  ),
  'recua.sin-bastimento': aviso(
    '{recua} se queda sin bastimento: hacen falta {pan} de pan[ y {sal} de sal].',
    'carga',
  ),
  'recua.carga': null,
  'recua.carga-recortada': aviso(
    '{recua} solo pudo cargar {cargado} de {recurso} de los {pedido} que se pidieron.',
  ),
  'recua.vecinos': null,
  'recua.acemilas': suceso('{recua} queda con {acemilas} acémilas.'),
  'recua.cometido': null,
  'recua.explora': {
    segun: 'nueva',
    casos: {
      '1': suceso('{recua} explora {comarca}.'),
      '0': suceso('{recua} vuelve a recorrer {comarca}: lo sabido queda al día.'),
    },
  },
  'recua.hallazgo': {
    segun: 'tipo',
    casos: {
      localidad: suceso('{recua} da con {nombre}, en {comarca}.'),
      noticias: p('rumores', '{recua} trae noticias de {de} por tierras de {sobre}.'),
    },
  },
  'recua.presente': null,
  'recua.puebla': suceso('{recua} asienta {vecinos} vecinos en {comarca}.'),
  'recua.puebla-en-marcha': suceso(
    'La puebla de {comarca} va tomando forma: {turnos} de {necesarios} turnos.',
  ),
  'recua.funda-puebla': suceso('{recua} funda puebla en {comarca} con {vecinos} vecinos.'),
  'recua.puebla-imposible': aviso('{recua} no puede fundar puebla en {comarca}: {motivo}.'),
  'recua.puebla-perdida': aviso('Otra casa se adelanta: la puebla de {comarca} es de {ganador}.'),
  'recua.disuelta': suceso('Se disuelve {recua}.'),
  'cometido.sin-efecto': aviso(
    '{recua} no pudo {cometido:infinitivo} en {comarca}: {motivo}.',
    'cometido',
  ),
  'conocimiento.cambio': {
    segun: 'despues',
    casos: {
      oida: suceso('Se oye hablar de {comarca}.'),
      explorada: null,
      propia: null,
      desconocida: null,
    },
  },

  // ——— Rebanyos ———
  'rebanyo.forma': suceso('Se forma {rebanyo}, de {cabezas} cabezas.'),
  'rebanyo.llega': suceso('{rebanyo} llega a {comarca}.'),
  'rebanyo.detenido': {
    segun: 'motivo',
    casos: {
      'camino-cerrado': aviso('{rebanyo} se detiene: {puerto} está cerrado.', 'ruta'),
      'tierra-ajena': aviso(
        '{rebanyo} no puede entrar en {hasta}: es tierra ajena y no va por cañada.',
        'ruta',
      ),
    },
  },
  'rebanyo.vuelve-por-nieve': aviso(
    '{rebanyo} vuelve a {desde}: la nieve cerró el paso hacia {hasta}.',
    'ruta',
  ),
  'rebanyo.aviso-puerto': aviso(
    '{rebanyo} tiene por delante {puerto}, que cierra en {turnos} turnos.',
    'ruta',
  ),
  'rebanyo.sin-pasto': aviso('{rebanyo} no encuentra pasto en {comarca}: {motivo}.', 'ruta'),
  'rebanyo.cabezas': aviso('{rebanyo} pierde {delta:abs} cabezas; le quedan {total}.'),
  'rebanyo.desaparece': aviso('{rebanyo} se ha perdido.'),
  'rebanyo.esquileo': suceso(
    'Esquileo del rebaño {rebanyo}: {lana} sacas de {cabezas} cabezas, con el año pastado al {calidadMil:pct}.',
  ),
  'comarca.estiercol': suceso('Los campos de {comarca} quedan abonados a nivel {despues}.'),

  // ——— Obras ———
  'obra.empieza': suceso('Empieza la obra de {que} en {comarca}: {turnos} turnos.'),
  'obra.termina': {
    segun: 'clase',
    casos: {
      edificio: suceso('Terminada la obra de {que} en {comarca}.'),
      derribo: suceso('Se derriba {que} en {comarca}.'),
      roturacion: suceso('Roturado el monte de {comarca}: hay más tierra de labor.'),
      // Las obras mayores se cuentan como hito.
      'obra mayor': null,
    },
  },
  'obra.detenida': aviso(
    'La obra de {que} en {comarca} se detuvo: falta {falta}, hacen falta {necesita}.',
    'mercado',
  ),
  'obra.sin-cuadrilla': aviso(
    'No hay cuadrilla libre en {comarca}: la obra espera hasta {turnoPrevisto:fecha}.',
  ),
  'obra.abandonada': aviso(
    'Se abandona la obra de {que} en {comarca}: sin cuidado, se irá deteriorando.',
    'obra-mayor',
  ),
  'obra.retomada': suceso('Se retoma la obra de {que} en {comarca}.'),
  'obra.perdida': aviso('La obra de {que} en {comarca} se pierde con la comarca.'),
  'edificio.cambio': null,
  'camino.mejora': null,
  'hito.obra-mayor': p('hitos', 'Se termina {obra} en {comarca}.'),

  // ——— Mercado ———
  'mercado.abre': null,
  'mercado.precio': null,
  'mercado.trato': economia(
    'En {mercado}, {recua} {operacion} {cantidad} de {recurso} a {precioMil:mil} maravedís.',
  ),
  'mercado.sin-casar': aviso(
    'En {mercado}, {recua} no pudo {operacion:infinitivo} todo el {recurso}: {motivo}.',
    'mercado',
  ),
  'mercado.sin-plaza': aviso('{recua} no halla plaza abierta en {comarca}.', 'ruta'),
  'mercado.orden-caduca': aviso(
    'Caduca una orden de mercado: quedaron {sobra} sin casar.',
    'mercado',
  ),
  'letra.emitida': economia(
    'Sale una letra de cambio de {cantidad} maravedís para {recua}: llega el turno que viene.',
  ),
  'letra.cobrada': economia(
    '{recua} cobra la letra: {cantidad} maravedís, con {comision} de comisión.',
  ),

  // ——— Territorio ———
  'comarca.incorporada': p('sucesos', '{comarca} entra en el dominio.', {
    ajeno: '{comarca} entra en el dominio de {jugador}.',
  }),
  'comarca.vuelve-neutral': p(
    'avisos',
    '{comarca} se va: el descontento la devuelve a su concejo.',
    { ajeno: '{comarca} deja a {jugador} y vuelve a su concejo.', accion: 'regalo' },
  ),
  'comarca.fuero': {
    segun: 'fuero',
    casos: {
      ninguno: suceso('{comarca} queda sin fuero.'),
      'carta puebla': suceso('{comarca} recibe carta puebla.'),
      fuero: suceso('{comarca} recibe fuero propio.'),
    },
  },
  'comarca.carga-fiscal': suceso('En {comarca} rige desde ahora una carga fiscal {carga}.'),
  'comarca.dehesa': {
    segun: 'dehesa',
    casos: {
      '1': suceso('{comarca} acota dehesa: el monte descansa.'),
      '0': suceso('{comarca} levanta la dehesa.'),
    },
  },
  'lealtad.cambio': null,
  'lealtad.cuenta-atras': aviso(
    '{comarca} está descontenta, con lealtad {lealtad}: en {turnosRestantes} turnos volverá a su concejo.',
    'politica',
  ),
  'influencia.cambio': null,
  'influencia.fuentes': null,
  'influencia.regalo': suceso('El concejo de {comarca} recibe el regalo.'),
  'incorporar.empieza': suceso(
    'Empieza la incorporación de {comarca}: {turnos} turnos, si nadie la disputa.',
  ),
  'incorporar.completa': null,
  'incorporar.perdida': aviso(
    '{comarca} se incorpora a {ganador}: se devuelve lo que costaba intentarlo.',
  ),
  'corte.traslado-empieza': suceso('Empieza el traslado de la corte a {comarca}: {turnos} turnos.'),
  'corte.trasladada': suceso('La corte queda asentada en {comarca}.'),
  'corte.traslado-perdido': aviso(
    'El traslado de la corte a {comarca} se pierde: la comarca ya no es del dominio.',
  ),
  'poblacion.cambio': null,
  'poblacion.no-crece': suceso('La gente de {comarca} no crece: {motivo}.'),

  // ——— Acontecimientos ———
  'acontecimiento.calendario': p(
    'avisos',
    'En el calendario del año: {tipo} en {region}, desde {turnoInicio:fecha}.',
    { publica: true },
  ),
  'acontecimiento.anuncia': p(
    'avisos',
    'Se anuncia {tipo} en {region} para {turnoInicio:fecha}. Se aconseja: {respuestas}.',
    { publica: true },
  ),
  'acontecimiento.empieza': p('avisos', 'Empieza {tipo} en {region}.', { publica: true }),
  'acontecimiento.termina': p('sucesos', 'Termina {tipo} en {region}.', { publica: true }),

  // ——— Rumores ———
  'rumor.precios': p(
    'rumores',
    'Se oye {via} que en {mercado} el pan anda a unos {panMil:mil} maravedís y la lana a unos {lanaMil:mil}.',
  ),
  'rumor.comarca': p('rumores', 'Se oye {via} que más allá hay una tierra llamada {comarca}.'),

  // ——— Tradiciones, prestigio e hitos ———
  'tradicion.ronda-abierta': aviso(
    'Se abre la ronda de {ronda}: la casa puede tomar {opciones}.',
    'tradicion',
  ),
  'tradicion.elegida': p('hitos', 'La casa toma la tradición «{tradicion}».'),
  'hito.logrado': p('hitos', 'Se logra un hito, «{hito}»: {prestigio} de prestigio.'),
  'hito.primicia': p(
    'hitos',
    'La casa es la primera de la partida en «{hito}»: {prestigio} de prestigio más.',
    {
      ajeno: '{jugador} ha sido la primera casa en lograr «{hito}».',
    },
  ),
  'prestigio.cambio': null,
  'prestigio.clasificacion': null,
  'prestigio.desglose': p(
    'hitos',
    'Prestigio {total}: población {poblacion}, territorio {territorio}, obras {obras}, caminos {caminos}, comercio {comercio}, exploración {exploracion}, ganadería {ganaderia}, industria {industria} e hitos {hitos}, menos {penalizaciones} de penalizaciones.',
  ),
};

/** Los motivos de espera, cancelacion o fracaso, dichos como los diria el cronista. */
export const MOTIVOS: Readonly<Record<string, string>> = {
  escasez: 'con hambre no se emprende nada',
  'sin-cuadrilla': 'no hay cuadrilla libre',
  'sin-solar': 'no queda solar',
  'nivel-maximo': 'ya está al máximo',
  'sin-permiso': 'no es cosa de esta casa',
  'prohibido-por-la-casa': '{limite}',
  'coste-incoherente': 'lo reservado no cuadra con lo pedido',
  'comarca-ajena': 'la comarca no es del dominio',
  'comarca-desconocida': 'nadie sabe dónde está esa comarca',
  'comarca-con-duenyo': 'la comarca ya tiene dueño',
  'comarca-desleal': 'la comarca está descontenta',
  'recua-desconocida': 'esa recua ya no existe',
  'recua-sin-plaza': 'la recua no está en una plaza',
  'recua-fuera-de-casa': 'la recua no está en casa',
  'rebanyo-desconocido': 'ese rebaño ya no existe',
  'mercado-desconocido': 'no hay tal plaza',
  'plaza-cerrada': 'la plaza está cerrada',
  'sin-ruta-conocida': 'no se conoce camino hasta allí',
  'destino-desconocido': 'nadie sabe llegar a ese destino',
  'ruta-demasiado-larga': 'la ruta es demasiado larga',
  'ruta-circular-vacia': 'una ruta circular necesita paradas',
  'ruta-circular-de-rebanyo': 'un rebaño no hace rutas circulares',
  'sin-paradas': 'no tiene paradas',
  'regalo-reciente': 'el concejo ya recibió un regalo hace poco',
  'influencia-baja': 'aún no hay influencia bastante',
  'sin-ventaja': 'otra casa tiene casi tanta influencia',
  'muy-lejos': 'queda demasiado lejos del dominio',
  'fuero-reciente': 'el fuero se cambió hace poco',
  'fuero-irreversible': 'un fuero concedido no se retira',
  'faltan-vecinos': 'faltan vecinos',
  'demasiada-gente': 'no cabe tanta gente',
  'nada-que-derribar': 'no hay nada que derribar',
  'no-esta-abandonada': 'la obra no está abandonada',
  'obra-desconocida': 'esa obra ya no existe',
  'no-se-comercia-con-maravedis': 'los maravedís no se compran ni se venden',
  'acemilas-fuera-de-rango': 'el número de acémilas no es posible',
  'cabezas-invalidas': 'el número de cabezas no es posible',
  'orden-duplicada': 'ya había una orden igual',
  'jugador-desconocido': 'la casa no está en la partida',
  'eleccion-ambigua': 'se eligieron dos tradiciones para la misma ronda',
  'ronda-cerrada': 'la ronda aún no está abierta',
  'ronda-ya-elegida': 'en esa ronda ya se eligió',
  'tradicion-de-otra-casa': 'esa tradición es de otra casa',
  'tradicion-desactivada': 'esa tradición todavía no se puede tomar',
  'tradicion-desconocida': 'no hay tal tradición',
  'sin-capacidad': 'no cabe más gente',
  'reserva-baja': 'hay poco pan guardado',
  'balance-negativo': 'se come más pan del que entra',
  estacion: 'no es tiempo de pasto',
  'sin-pasto': 'no hay pasto',
  saturado: 'hay demasiado ganado',
  camino: 'está de camino',
  'volumen-de-plaza': 'la plaza no da para tanto',
  'precio-limite': 'el precio no llegó al límite puesto',
  'sin-contraparte': 'no hubo con quién tratar',
  'sin-fondos': 'no hay fondos',
  'potencial-insuficiente': 'la tierra no da para eso',
  'falta-edificio-requerido': 'falta el edificio del que depende',
  'ya-construida': 'ya está construida',
  'ya-en-obra': 'ya está en obra',
  'sin-camino-carretero': 'hace falta camino carretero',
  'sin-cantera': 'hace falta cantera',
  'no-es-ciudad': 'no es ciudad',
  'no-es-costa': 'no está en la costa',
  'sin-sede-episcopal': 'no es sede de obispo',
  'sin-vega-fluvial': 'no tiene vega con río',
  'sin-tramo': 'no hay camino entre esas comarcas',
  'sin-vado': 'no hay vado que salvar',
  'obra-mayor-cerca': 'hay otra igual demasiado cerca',
  'labor-al-maximo': 'la labor ya está al máximo',
  'sin-monte': 'no queda monte',
  'ya-es-capital': 'ya es la capital',
  'traslado-en-marcha': 'ya hay un traslado en marcha',
  'poca-influencia': 'hay poca influencia',
  'poca-lealtad': 'hay poca lealtad',
  'pocos-vecinos': 'hay pocos vecinos',
  lejania: 'queda lejos',
};

/** Las regiones del catalogo, con su nombre. */
export const NOMBRES_DE_REGION: Readonly<Record<string, string>> = {
  '00-prueba': 'la tierra de prueba',
  '01-iberico-alto-duero': 'el Sistema Ibérico y el alto Duero',
  '02-meseta-norte': 'la Meseta norte',
  '03-cantabrico': 'la cornisa cantábrica',
  '04-galicia-minho': 'Galicia y el Miño',
  '05-central-extremadura': 'el Sistema Central y Extremadura',
  '06-meseta-sur': 'la Meseta sur',
  '07-ebro-pirineo': 'el Ebro y el Pirineo',
  '08-levante': 'Levante',
  '09-andalucia': 'Andalucía',
  '10-portugal-sur': 'el sur de Portugal',
};

export const NOMBRES_DE_RECURSO: Readonly<Record<string, string>> = {
  pan: 'pan',
  madera: 'madera',
  piedra: 'piedra',
  maravedis: 'maravedís',
  sal: 'sal',
  hierro: 'hierro',
  lana: 'lana',
};

/** Las ordenes, como se nombran en «la orden de…». */
export const NOMBRES_DE_ORDEN: Readonly<Record<string, string>> = {
  construir: 'construir',
  derribar: 'derribar',
  roturar: 'roturar',
  politica: 'gobierno de la comarca',
  'formar-recua': 'formar recua',
  ruta: 'ruta',
  carga: 'carga',
  cometido: 'cometido',
  'formar-rebanyo': 'formar rebaño',
  incorporar: 'incorporar',
  regalo: 'regalo al concejo',
  aperos: 'aperos',
  'letra-de-cambio': 'letra de cambio',
  mercado: 'mercado',
  'obra-mayor': 'obra mayor',
  tradicion: 'tradición',
  mayordomo: 'mayordomo',
  'trasladar-corte': 'traslado de la corte',
};

/** Palabras sueltas de los sucesos, por campo y valor. */
export const PALABRAS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  estacion: {
    primavera: 'la primavera',
    verano: 'el verano',
    otonyo: 'el otoño',
    invierno: 'el invierno',
  },
  operacion: { comprar: 'compró', vender: 'vendió' },
  'operacion:infinitivo': { comprar: 'comprar', vender: 'vender' },
  'cometido:infinitivo': {
    explorar: 'explorar',
    portear: 'portear',
    tratar: 'tratar',
    poblar: 'poblar',
    presencia: 'hacerse presente',
    disolver: 'disolverse',
  },
  via: { feria: 'en la feria', camino: 'en el Camino', venta: 'en la venta' },
  ronda: { renombre: 'Renombre', fama: 'Fama', linaje: 'Linaje' },
};

/** Edificios, obras mayores y demas obras, con su articulo: «la obra de la granja». */
export const NOMBRES_DE_OBRA: Readonly<Record<string, string>> = {
  granja: 'la granja',
  huerta: 'la huerta',
  molino: 'el molino',
  granero: 'el granero',
  aserradero: 'el aserradero',
  carbonera: 'la carbonera',
  cantera: 'la cantera',
  ferreria: 'la ferrería',
  salina: 'la salina',
  majada: 'la majada',
  lonja: 'la lonja',
  mercado: 'el mercado',
  venta: 'la venta',
  casas: 'las casas',
  cerca: 'la cerca',
  acequia: 'la acequia menor',
  puente: 'el puente',
  calzada: 'la calzada',
  monasterio: 'el monasterio',
  catedral: 'la catedral',
  muralla: 'la muralla',
  atarazana: 'la atarazana',
  'acequia-mayor': 'la acequia mayor',
  roturacion: 'la roturación',
};
