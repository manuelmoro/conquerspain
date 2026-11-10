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
      // La orden del plan que aun no ha llegado a su turno no se cuenta hasta que entra.
      programada: null,
      'en cola': aviso('La orden de {clase} espera en su cola: {motivo}.'),
    },
  },

  // ——— Jugar sin estar: plan, colas, rutas permanentes y mayordomo ———
  'plan.entra': suceso('Según el plan de temporada, entra la orden de {clase}.'),
  'cola.empieza': suceso('De {cola}: empieza la orden de {clase}.'),
  'mayordomo.ordena': suceso('El mayordomo da una orden de {clase}, por su regla {prioridad}.'),
  'recua.ruta-detenida': aviso('{recua} deja su ruta permanente: {motivo}.', 'ruta'),

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
  'consumo.aviso-hambre': {
    segun: 'inminente',
    casos: {
      si: aviso(
        'El pan no llega al turno que viene: quedan {reserva} y gastas {deficit} más de lo que produces. Más pan: una granja o una huerta, comprarlo en una plaza con una recua, o roturar monte para tener más labor.',
        'construir',
      ),
      no: aviso(
        'Al paso de ahora, el pan se acaba en {turnos} turnos: quedan {reserva} y gastas {deficit} más de lo que produces. Más pan: una granja o una huerta, comprarlo en una plaza con una recua, o roturar monte para tener más labor.',
        'construir',
      ),
    },
  },
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
  'rebanyo.entra': null,
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
  'rebanyo.sin-pasto': {
    segun: 'motivo',
    casos: {
      estacion: aviso('{rebanyo} no encuentra pasto en {comarca}: {motivo}.', 'ruta'),
      'sin-pasto': aviso('{rebanyo} no encuentra pasto en {comarca}: {motivo}.', 'ruta'),
      saturado: aviso('{rebanyo} no encuentra pasto en {comarca}: {motivo}.', 'ruta'),
      camino: aviso('{rebanyo} no come de camino: el tramo que anda no es cañada.', 'ruta'),
    },
  },
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

  // ——— Contratos, crédito y portazgos (T-103) ———
  'contrato.propuesto': {
    segun: 'rol',
    casos: {
      propone: suceso(
        'Propones a {de} un contrato {acuerdo}, con plazo hasta {plazo:fecha}: si no responde pronto, caduca.',
      ),
      recibe: aviso(
        '{de} te propone un contrato {acuerdo}, con plazo hasta {plazo:fecha}. Lo tienes en «Tus contratos»: acéptalo o recházalo antes de que caduque.',
        'responder-contrato',
      ),
    },
  },
  'contrato.firmado': suceso(
    'Se firma con {de} el contrato {acuerdo}, con plazo hasta {plazo:fecha}.',
  ),
  'contrato.rechazado': {
    segun: 'rol',
    casos: {
      propone: aviso('{de} no firma tu contrato {acuerdo}: {motivo}.'),
      recibe: suceso('El contrato {acuerdo} que te proponía {de} no se firma: {motivo}.'),
    },
  },
  'contrato.caducado': suceso(
    'La propuesta de contrato {acuerdo} entre tu casa y {de} caduca sin respuesta.',
  ),
  'contrato.cumplido': suceso(
    'Se cumple el contrato {acuerdo} con {de}: las dos casas ganan crédito.',
  ),
  'contrato.incumplido': {
    segun: 'rol',
    casos: {
      falla: aviso(
        'Incumples el contrato {acuerdo} con {de}: {motivo}. Pagas {penalizacion} maravedís de penalización y pierdes crédito.',
      ),
      cobra: aviso(
        '{de} incumple el contrato {acuerdo}: {motivo}. Te paga {penalizacion} maravedís de penalización.',
      ),
    },
  },
  'contrato.perdido': aviso(
    'El contrato {acuerdo} con {de} se deshace sin culpa de nadie: la obra se perdió sin terminar.',
  ),
  'acuerdo.roto': p(
    'avisos',
    '{de} rompe su acuerdo {acuerdo} con {contra} antes de tiempo: pierde crédito y {prestigio} de prestigio.',
    { publica: true },
  ),
  'credito.cambio': economia('Tu crédito ante las demás casas queda en {total}.'),
  'portazgo.fijado': suceso(
    'Portazgo fijado entre {desde} y {hasta}: {cantidad} maravedís por paso.',
  ),
  'portazgo.pagado': {
    segun: 'por',
    casos: {
      recua: economia(
        '{recua} paga {cantidad} maravedís de portazgo a {de} entre {desde} y {hasta}.',
      ),
      rebanyo: economia(
        'Por {rebanyo} se pagan {cantidad} maravedís de portazgo a {de} entre {desde} y {hasta}.',
      ),
    },
  },
  'portazgo.cobrado': economia(
    '{de} te paga {cantidad} maravedís de portazgo entre {desde} y {hasta}.',
  ),
  'portazgo.camino-viejo': {
    segun: 'por',
    casos: {
      recua: aviso(
        '{recua} no lleva para el portazgo de {de} entre {desde} y {hasta} ({cantidad} maravedís): va por el camino viejo, más despacio.',
      ),
      rebanyo: aviso(
        'No hay para el portazgo de {de} entre {desde} y {hasta} ({cantidad} maravedís): {rebanyo} va por el camino viejo, más despacio.',
      ),
    },
  },
  'venta.cobrada': economia(
    'Tu venta de {comarca} cobra {cantidad} maravedís a las recuas de {de}.',
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
  'comarca.rango': {
    segun: 'sube',
    casos: {
      '1': suceso('{comarca} es ya {rango}: tiene más solares para edificios.'),
      '0': suceso(
        '{comarca} vuelve a ser {rango}: pierde solares, aunque lo levantado sigue en pie.',
      ),
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
  'influencia.regalo': suceso(
    'El concejo de {comarca} recibe tu regalo: +{influencia} de influencia, con lo que llegas a {total}.',
  ),
  'incorporar.empieza': suceso(
    'Empieza la incorporación de {comarca}: {turnos} turnos, si nadie la disputa.',
  ),
  'incorporar.completa': null,
  'emisario.visto': aviso(
    'Un emisario de {de} anda por {comarca}: en dos turnos sabrá cómo está tu dominio.',
  ),
  'emisario.informe': suceso(
    'El emisario de {recua} trae su informe del dominio de {de}: {comarcas} comarcas, {vecinos} vecinos y {obras} obras en marcha. Lo ves en el mapa, fechado hoy.',
  ),
  'incorporar.de-otro': aviso(
    '{de} ha empezado a incorporar {comarca}: en {turnos} turnos será suya, si nadie le gana con más influencia.',
    'incorporar',
  ),
  'influencia.cortejo': aviso(
    '{de} empieza a cortejar al concejo de {comarca}. Mientras los dos tengáis gente allí, el concejo dividido da la mitad a cada uno.',
    'cometido',
  ),
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
  'jugador.entra': p(
    'avisos',
    '{de} entra en la partida en {comarca}, con amparo hasta {amparoHasta:fecha}: ni portazgo ni cortejo mientras dure.',
    { publica: true },
  ),
  // ——— Milicia y hostilidad (T-120) ———
  'hostilidad.declarada': p(
    'avisos',
    '{de} declara la hostilidad a {contra}: vale desde {desde:fecha}. Desde entonces sus milicias pueden entrar en tierra de la otra y enfrentarse.',
    { publica: true },
  ),
  'hostilidad.retirada': p('sucesos', '{de} retira la hostilidad a {contra}.', { publica: true }),
  'milicia.leva': suceso('Se leva la {nombre}: {hombres} hombres dejan el trabajo.'),
  'milicia.licencia': suceso('Se licencia la {nombre}: {hombres} hombres vuelven a casa.'),
  'milicia.marcha': suceso('La {nombre} marcha hacia {hacia}: {turnos} turnos.'),
  'milicia.llega': suceso('La {nombre} llega a {comarca}.'),
  'milicia.no-entra': aviso(
    'La {nombre} no puede entrar en {hacia}: ya no hay hostilidad o esa casa está amparada. Vuelve a {comarca}.',
  ),
  'milicia.desercion': aviso(
    'No hay pan o soldada para la {nombre}: {hombres} hombres se vuelven a casa.',
  ),
  'milicia.enfrentamiento': p(
    'avisos',
    'En {comarca} se enfrentan las milicias de {ganador} y de {de}: gana {ganador}. La de {de} se retira y {bajas} de sus hombres vuelven a casa.',
    { publica: true },
  ),
  'asedio.empieza': p(
    'avisos',
    '{de} pone asedio a {comarca}, de {contra}. Durante {turnos} turnos no puede rendirse: tiempo para defenderla o negociar.',
    { publica: true },
  ),
  'asedio.rescate': aviso('{de} ofrece {rescate} maravedís por levantar el asedio de {comarca}.'),
  'asedio.tregua': p(
    'sucesos',
    'Se levanta el asedio de {comarca}: {contra} paga {rescate} maravedís a {de}.',
    { publica: true },
  ),
  'asedio.levantado': p(
    'sucesos',
    'Se levanta el asedio de {comarca}: la milicia de {de} ya no está.',
    {
      publica: true,
    },
  ),
  'asedio.rendicion': p(
    'avisos',
    '{comarca} se rinde a {de} tras {turnos} turnos de asedio. {contra} la pierde, pero conserva el resto de su dominio.',
    { publica: true },
  ),
  'bandidaje.asalto': aviso(
    'Asaltan a {recua} entre {desde} y {hasta}: se llevan {perdido} de la carga. La recua sigue su camino. Una venta, una calzada o una escolta lo evitan.',
  ),
  // ——— Ausencia (T-105) ———
  'ausencia.aviso': aviso(
    'Llevas {turnos} turnos sin dar órdenes: el mayordomo lleva la casa. Si pasan {ausente} más, contarás como ausente y la lealtad de tus comarcas empezará a bajar.',
  ),
  'ausencia.ausente': p(
    'avisos',
    '{de} anda ausente: no da órdenes y la lealtad de sus comarcas baja. Si sigue así {concejo} turnos más, el concejo administrará sus tierras.',
    { publica: true },
  ),
  'ausencia.concejo': p(
    'avisos',
    'El concejo administra las tierras de {de}, que no da órdenes: sus comarcas, salvo la capital, se pueden cortejar e incorporar.',
    { publica: true },
  ),
  'ausencia.vuelve': p(
    'sucesos',
    '{de} vuelve a mandar en su casa tras {turnos} turnos sin órdenes; la influencia ajena en sus comarcas se pierde.',
    { publica: true },
  ),
  'temporada.cerrada': p(
    'hitos',
    'Se cierra la temporada. Gana {ganador}, con {prestigio} de prestigio; la partida queda como archivo.',
    { publica: true },
  ),
  'temporada.reconocimiento': p(
    'hitos',
    'Reconocimiento de la temporada a {reconocimiento}: {ganador}, con {valor}.',
    { publica: true },
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
  'comarca-sin-duenyo': 'la comarca no es de nadie: un emisario va a tierra de otra casa',
  'comarca-propia': 'es tierra tuya',
  'casa-desconocida': 'esa casa no está en la partida',
  'contrato-sin-propuesta': 'ese contrato ya no espera respuesta',
  'contrato-rechazado': 'la otra casa no lo quiere',
  'plazo-pasado': 'el plazo ya ha pasado',
  'poco-credito': 'quien pide prestado tiene poco crédito',
  'cliente-sin-catedral': 'la casa del cliente no puede levantar catedral',
  'sin-entrega': 'la mercancía no llegó a tiempo',
  'obra-sin-terminar': 'la obra no estaba terminada al llegar el plazo',
  'obra-perdida': 'la obra se perdió sin terminar',
  'sin-respuesta': 'nadie respondió',
  'tramo-ajeno': 'ese tramo no lo mejoró tu casa',
  'ya-en-la-partida': 'esa casa ya está en la partida',
  'hostilidad-imposible': 'no hay hostilidad que declarar o retirar con esa casa',
  amparada: 'esa casa está amparada: acaba de entrar en la partida',
  'demasiados-hombres': 'son más hombres de los que la comarca puede dar',
  'mesnada-desconocida': 'esa mesnada ya no existe',
  'mesnada-en-marcha': 'la mesnada sigue de marcha',
  'tierra-vedada': 'no hay hostilidad con esa casa, o está amparada',
  'sin-nada-que-asediar': 'esa comarca no es de nadie',
  'capital-intocable': 'la capital no se asedia: el vencido tiene que poder seguir jugando',
  'ya-asediada': 'esa comarca ya está asediada',
  'asedio-desconocido': 'ese asedio ya no sigue',
  'rescate-sin-fondos': 'el defensor ya no tiene el rescate',
  'demasiados-acuerdos': 'una de las dos ya tiene tres acuerdos de no agresión',
  'demasiadas-comarcas': 'no se puede comprometer a no cortejar más de tres comarcas',
  'acuerdo-roto': 'una de las partes lo rompió',
  'exclusiva-vigente':
    'tienes una exclusiva de venta de ese recurso: solo se lo vendes a quien la firmó',
  'acuerdo-de-no-agresion': 'hay un acuerdo de no agresión con esa casa',
  'temporada-cerrada': 'la temporada ya se cerró',
  'origen-no-ofrecido': 'ese origen ya no está libre o lejos de los demás',
  'comarca-desleal': 'la comarca está descontenta',
  'recua-desconocida': 'esa recua ya no existe',
  'recua-sin-plaza': 'la recua no está en una plaza',
  'recua-lejos': 'la recua no está en esa plaza',
  'recua-en-ruta': 'la recua sigue de camino',
  'recua-sin-cometido': 'la recua no tiene el encargo de tratar',
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
  'sin-recursos': 'no hay recursos',
  'fuera-de-temporada': 'el plan solo llega a seis turnos',
  'cola-no-admitida': 'esa orden no va en esa cola',
  'cola-distinta': 'la cola ya no tiene esas órdenes',
  anulada: 'la anulaste tú',
  'orden-no-anulable': 'esa orden ya había empezado o ya no estaba',
  'detras-en-la-cola': 'hay otra antes en la cola',
  'recua-ocupada': 'la recua no ha terminado lo anterior',
  'mayordomo-lleno': 'el mayordomo no admite más reglas',
  'regla-desconocida': 'el mayordomo no tiene esa regla',
  'sin-bastimento': 'no le queda bastimento',
  'precio-limite': 'el precio límite no se cumplió',
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
  cola: 'orden de la cola',
  anular: 'anular una orden',
  contrato: 'contrato',
  'responder-contrato': 'respuesta a un contrato',
  portazgo: 'portazgo',
  entrar: 'entrada en la partida',
  levar: 'leva',
  licenciar: 'licencia de milicia',
  marchar: 'marcha',
  hostilidad: 'hostilidad',
  asediar: 'asedio',
  tregua: 'oferta de rescate',
  'aceptar-tregua': 'aceptación del rescate',
  'romper-acuerdo': 'ruptura de un acuerdo',
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
  reconocimiento: {
    poblacion: 'la mayor población',
    obras: 'la mayor obra',
    comercio: 'el mejor comerciante',
    caminos: 'la mayor red de caminos',
    ganaderia: 'la mejor trashumancia',
  },
  acuerdo: {
    entrega: 'de entrega',
    prestamo: 'de préstamo',
    aperos: 'de aperos',
    obra: 'de obra',
    paso: 'de paso de ganado',
    'no-agresion': 'de no agresión',
    'no-cortejo': 'de no cortejar',
    exclusiva: 'de exclusiva de venta',
  },
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
