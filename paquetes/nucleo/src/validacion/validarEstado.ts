// Validacion del estado de una partida: forma, coherencia interna y version de reglas.
import type {
  Acontecimiento,
  ConfiguracionPartida,
  Conocimiento,
  DatosConocidos,
  EstadoComarca,
  EstadoJugador,
  PreciosConocidos,
  PuestoEnLaClasificacion,
  RegistroDeJugador,
  EstadoMercado,
  EstadoPartida,
  Obra,
  Rebanyo,
  Recua,
  SituacionMovil,
  EstadoTramo,
  TrasladoDeCorte,
} from '../tipos/estado.ts';
import {
  CARGAS_FISCALES,
  COMETIDOS,
  FUENTES_DE_PRECIOS,
  FUEROS,
  LONGITUD_MAXIMA_DE_RUTA,
  MODOS_DE_PARTIDA,
  NIVELES_DE_CONOCIMIENTO,
  RECURSOS_AGOTABLES,
  TIPOS_DE_OBRA,
} from '../tipos/estado.ts';
import type {
  IdAcontecimiento,
  IdComarca,
  IdJugador,
  IdMercado,
  IdObra,
  IdOrden,
  IdPartida,
  IdRebanyo,
  IdRecua,
} from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { Orden } from '../tipos/ordenes.ts';
import { POTENCIALES, VOLUMENES_FERIA } from '../tipos/mundo.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import {
  CALIDADES_CAMINO,
  CASAS,
  HITOS,
  RONDAS_DE_TRADICION,
  TIPOS_DE_OBRA_MAYOR,
  VERSION_REGLAS,
} from '../tipos/reglas.ts';
import { efectoDeAcontecimiento, nivelPotencial, recursos } from './comunes.ts';
import { validarOrdenEntrante, validarParada, validarReglaDeMayordomo } from './validarOrden.ts';
import type { ErrorValidacion, Resultado, Validador } from './validador.ts';
import {
  booleano,
  entero,
  enteroNoNegativo,
  identificador,
  invalido,
  invalidos,
  lista,
  oNulo,
  objeto,
  registro,
  registroCompleto,
  texto,
  unoDe,
  valido,
} from './validador.ts';

const validarConfiguracion: Validador<ConfiguracionPartida> = objeto<ConfiguracionPartida>({
  nombre: texto({ minimo: 1, maximo: 80 }),
  intervaloMinutos: entero({ minimo: 1, maximo: 10080 }),
  modo: unoDe(MODOS_DE_PARTIDA),
  turnosDeTemporada: oNulo(entero({ minimo: 1, maximo: 10000 })),
  reservaMinimaDePan: enteroNoNegativo(),
  esDePrueba: booleano(),
});

const validarDatosConocidos: Validador<DatosConocidos> = objeto<DatosConocidos>({
  duenyo: oNulo(identificador<IdJugador>()),
  poblacion: enteroNoNegativo(),
  terreno: texto({ minimo: 1, maximo: 20 }),
  potenciales: registroCompleto(POTENCIALES, nivelPotencial()),
  edificios: registro(enteroNoNegativo(20)),
});

const validarPreciosConocidos: Validador<PreciosConocidos> = objeto<PreciosConocidos>({
  turno: entero({ minimo: 1 }),
  fuente: unoDe(FUENTES_DE_PRECIOS),
  preciosMil: registroCompleto(RECURSOS, enteroNoNegativo()),
  visitada: booleano(),
});

const validarConocimiento: Validador<Conocimiento> = objeto<Conocimiento>({
  nivel: unoDe(NIVELES_DE_CONOCIMIENTO),
  turnoUltimaNoticia: enteroNoNegativo(),
  datos: oNulo(validarDatosConocidos),
});

const validarRegistro: Validador<RegistroDeJugador> = objeto<RegistroDeJugador>({
  obrasMayores: registro(enteroNoNegativo(), unoDe(TIPOS_DE_OBRA_MAYOR)),
  anyosTrashumantes: enteroNoNegativo(),
  feriasDestacadas: enteroNoNegativo(),
  volumenEnFerias: registro(enteroNoNegativo(), identificador()),
  comarcasPerdidas: enteroNoNegativo(),
  turnosConEscasez: enteroNoNegativo(),
  turnosDeDespensaEstable: enteroNoNegativo(),
});

const validarPuesto: Validador<PuestoEnLaClasificacion> = objeto<PuestoEnLaClasificacion>({
  jugador: identificador<IdJugador>(),
  puesto: entero({ minimo: 1 }),
  puestoAnterior: oNulo(entero({ minimo: 1 })),
  prestigio: entero(),
});

const validarJugador: Validador<EstadoJugador> = objeto<EstadoJugador>({
  id: identificador<IdJugador>(),
  nombre: texto({ minimo: 1, maximo: 60 }),
  casa: unoDe(CASAS),
  tradiciones: lista(texto({ minimo: 1, maximo: 60 }), { maximo: 3 }),
  rondas: registro(entero({ minimo: 1 }), unoDe(RONDAS_DE_TRADICION)),
  capital: identificador<IdComarca>(),
  almacen: recursos(),
  reservado: recursos(),
  prestigio: entero(),
  credito: entero({ minimo: 0, maximo: 100 }),
  hitos: registro(entero({ minimo: 1 }), unoDe(HITOS)),
  registro: validarRegistro,
  conocimiento: registro(validarConocimiento, identificador()),
  plazas: registro(validarPreciosConocidos, identificador()),
  escasez: booleano(),
  escasezSeguidas: enteroNoNegativo(),
  conservarConSal: booleano(),
  deudaAdministracion: enteroNoNegativo(),
  traslado: oNulo(
    objeto<TrasladoDeCorte>({
      destino: identificador<IdComarca>(),
      turnosRestantes: entero({ minimo: 1, maximo: 100 }),
    }),
  ),
  turnosSinOrdenes: enteroNoNegativo(),
  mayordomo: lista(validarReglaDeMayordomo, { maximo: 20 }),
  colas: registro(lista(identificador<IdOrden>(), { maximo: 50 })),
});

const validarComarca: Validador<EstadoComarca> = objeto<EstadoComarca>({
  id: identificador<IdComarca>(),
  duenyo: oNulo(identificador<IdJugador>()),
  poblacion: enteroNoNegativo(100000),
  lealtad: entero({ minimo: 0, maximo: 100 }),
  edificios: registro(enteroNoNegativo(20)),
  aperos: entero({ minimo: 0, maximo: 4 }),
  fuero: unoDe(FUEROS),
  turnoFuero: enteroNoNegativo(),
  cargaFiscal: unoDe(CARGAS_FISCALES),
  dehesa: booleano(),
  potenciales: registroCompleto(POTENCIALES, nivelPotencial()),
  agotamiento: registroCompleto(RECURSOS_AGOTABLES, entero({ minimo: 0, maximo: 100 })),
  influencias: registro(entero({ minimo: 0, maximo: 100 }), identificador()),
  presenciaSeguida: registro(enteroNoNegativo(), identificador()),
  ultimoRegalo: registro(entero({ minimo: 1 }), identificador()),
  exDuenyo: oNulo(identificador<IdJugador>()),
  ventaDe: oNulo(identificador<IdJugador>()),
  turnosDesleal: enteroNoNegativo(),
  turnosSinMantenimiento: enteroNoNegativo(),
  turnosDeAbono: enteroNoNegativo(),
  estiercol: entero({ minimo: 0, maximo: 10 }),
  obrasMayores: lista(unoDe(TIPOS_DE_OBRA_MAYOR), { maximo: TIPOS_DE_OBRA_MAYOR.length }),
  produccionUltimoTurno: recursos(),
});

const validarSituacion: Validador<SituacionMovil> = (dato, ruta) => {
  if (typeof dato !== 'object' || dato === null || Array.isArray(dato)) {
    return invalido(ruta, 'se esperaba la situacion de una unidad movil');
  }
  const donde = (dato as Record<string, unknown>)['donde'];
  if (donde === 'comarca') {
    return objeto<{ donde: 'comarca'; comarca: IdComarca }>({
      donde: unoDe(['comarca'] as const),
      comarca: identificador<IdComarca>(),
    })(dato, ruta);
  }
  if (donde === 'camino') {
    return objeto<{
      donde: 'camino';
      desde: IdComarca;
      hasta: IdComarca;
      jornadasHechasMil: number;
    }>({
      donde: unoDe(['camino'] as const),
      desde: identificador<IdComarca>(),
      hasta: identificador<IdComarca>(),
      jornadasHechasMil: enteroNoNegativo(),
    })(dato, ruta);
  }
  return invalido(`${ruta}.donde`, 'una unidad movil esta en una comarca o en un camino');
};

const validarRecua: Validador<Recua> = objeto<Recua>({
  id: identificador<IdRecua>(),
  jugador: identificador<IdJugador>(),
  nombre: texto({ minimo: 1, maximo: 60 }),
  situacion: validarSituacion,
  ruta: lista(identificador<IdComarca>(), { maximo: LONGITUD_MAXIMA_DE_RUTA }),
  rutaCircular: booleano(),
  paradas: lista(validarParada, { maximo: 12 }),
  siguienteParada: enteroNoNegativo(12),
  enParada: oNulo(enteroNoNegativo(11)),
  acemilas: enteroNoNegativo(1000),
  porte: enteroNoNegativo(1000),
  carga: recursos(),
  vecinos: enteroNoNegativo(1000),
  cometido: oNulo(unoDe(COMETIDOS)),
  turnosDeCometido: enteroNoNegativo(),
  avisadaSinBastimento: booleano(),
  fallosDePrecio: enteroNoNegativo(),
});

const validarRebanyo: Validador<Rebanyo> = objeto<Rebanyo>({
  id: identificador<IdRebanyo>(),
  jugador: identificador<IdJugador>(),
  nombre: texto({ minimo: 1, maximo: 60 }),
  situacion: validarSituacion,
  ruta: lista(identificador<IdComarca>(), { maximo: LONGITUD_MAXIMA_DE_RUTA }),
  cabezas: enteroNoNegativo(100000),
  pastoDelAnyoMil: enteroNoNegativo(100000),
  turnosSinPasto: enteroNoNegativo(),
});

const validarObra: Validador<Obra> = objeto<Obra>({
  id: identificador<IdObra>(),
  jugador: identificador<IdJugador>(),
  comarca: identificador<IdComarca>(),
  tipo: unoDe(TIPOS_DE_OBRA),
  que: texto({ minimo: 1, maximo: 40 }),
  hacia: oNulo(identificador<IdComarca>()),
  avanceMil: enteroNoNegativo(),
  avanceNecesarioMil: entero({ minimo: 1 }),
  entregado: recursos(),
  costeTotal: recursos(),
  abandonada: booleano(),
});

const validarMercado: Validador<EstadoMercado> = objeto<EstadoMercado>({
  id: identificador<IdMercado>(),
  comarca: identificador<IdComarca>(),
  tipo: unoDe(['local', 'feria'] as const),
  volumen: unoDe(VOLUMENES_FERIA),
  preciosMil: registroCompleto(RECURSOS, entero({ minimo: 1 })),
  ultimoVolumen: registroCompleto(RECURSOS, enteroNoNegativo()),
});

const validarEfecto = efectoDeAcontecimiento();

const validarAcontecimiento: Validador<Acontecimiento> = objeto<Acontecimiento>({
  id: identificador<IdAcontecimiento>(),
  tipo: texto({ minimo: 1, maximo: 60 }),
  region: texto({ minimo: 1, maximo: 60 }),
  comarca: oNulo(identificador<IdComarca>()),
  turnoAnuncio: entero({ minimo: 1 }),
  turnoInicio: entero({ minimo: 1 }),
  turnosDuracion: entero({ minimo: 1, maximo: 48 }),
  efectos: lista(validarEfecto, { minimo: 1, maximo: 6 }),
});

/** Una orden guardada en el estado se valida igual que una que llega de fuera. */
const validarOrdenGuardada: Validador<Orden> = (dato, ruta) => {
  const resultado = validarOrdenEntrante(dato);
  if (resultado.ok) return resultado;
  return invalidos(
    resultado.errores.map((error) => ({
      ruta: error.ruta === '(raiz)' ? ruta : `${ruta}.${error.ruta}`,
      mensaje: error.mensaje,
    })),
  );
};

const validarTramo: Validador<EstadoTramo> = objeto<EstadoTramo>({
  calidad: unoDe(CALIDADES_CAMINO),
  puente: booleano(),
});

const validarForma: Validador<EstadoPartida> = objeto<EstadoPartida>({
  version: entero({ minimo: 1 }),
  id: identificador<IdPartida>(),
  semilla: texto({ minimo: 1, maximo: 120 }),
  turno: entero({ minimo: 1 }),
  configuracion: validarConfiguracion,
  jugadores: registro(validarJugador, identificador()),
  comarcas: registro(validarComarca, identificador()),
  recuas: registro(validarRecua, identificador()),
  rebanyos: registro(validarRebanyo, identificador()),
  obras: registro(validarObra, identificador()),
  caminos: registro(validarTramo),
  mercados: registro(validarMercado, identificador()),
  acontecimientos: lista(validarAcontecimiento, { maximo: 40 }),
  ordenes: lista(validarOrdenGuardada, { maximo: 2000 }),
  siguienteId: enteroNoNegativo(),
  huellaTurnoAnterior: oNulo(texto({ minimo: 64, maximo: 64 })),
  primicias: registro(identificador<IdJugador>(), unoDe(HITOS)),
  clasificacion: lista(validarPuesto),
});

/**
 * Valida un estado de partida.
 *
 * Con `mundo`, comprueba ademas que todas las comarcas citadas existen en ese mundo.
 * Un estado de otra version de reglas se rechaza: hace falta una migracion explicita.
 */
export function validarEstado(dato: unknown, mundo?: Mundo): Resultado<EstadoPartida> {
  const forma = validarForma(dato, '');
  if (!forma.ok) return forma;
  const estado = forma.valor;
  const errores: ErrorValidacion[] = [];

  if (estado.version !== VERSION_REGLAS) {
    errores.push({
      ruta: 'version',
      mensaje: `la partida es de la version de reglas ${String(estado.version)} y el motor es la ${String(VERSION_REGLAS)}: hace falta migrarla antes de resolver`,
    });
  }

  const hayJugador = (id: string): boolean => Object.hasOwn(estado.jugadores, id);
  const hayComarca = (id: string): boolean => Object.hasOwn(estado.comarcas, id);

  for (const [clave, jugador] of Object.entries(estado.jugadores)) {
    if (jugador.id !== clave) {
      errores.push({
        ruta: `jugadores.${clave}.id`,
        mensaje: `no coincide con su clave "${clave}"`,
      });
    }
    if (!hayComarca(jugador.capital)) {
      errores.push({
        ruta: `jugadores.${clave}.capital`,
        mensaje: `la comarca "${jugador.capital}" no existe en la partida`,
      });
    }
    for (const recurso of RECURSOS) {
      if (jugador.reservado[recurso] > jugador.almacen[recurso]) {
        errores.push({
          ruta: `jugadores.${clave}.reservado.${recurso}`,
          mensaje: `hay ${String(jugador.reservado[recurso])} reservados y solo ${String(jugador.almacen[recurso])} en el almacen`,
        });
      }
    }
    for (const comarca of Object.keys(jugador.conocimiento)) {
      if (!hayComarca(comarca)) {
        errores.push({
          ruta: `jugadores.${clave}.conocimiento.${comarca}`,
          mensaje: `la comarca "${comarca}" no existe en la partida`,
        });
      }
    }
  }

  for (const [clave, comarca] of Object.entries(estado.comarcas)) {
    if (comarca.id !== clave) {
      errores.push({
        ruta: `comarcas.${clave}.id`,
        mensaje: `no coincide con su clave "${clave}"`,
      });
    }
    if (comarca.duenyo !== null && !hayJugador(comarca.duenyo)) {
      errores.push({
        ruta: `comarcas.${clave}.duenyo`,
        mensaje: `el jugador "${comarca.duenyo}" no existe en la partida`,
      });
    }
    if (comarca.duenyo !== null && Object.keys(comarca.influencias).length > 0) {
      errores.push({
        ruta: `comarcas.${clave}.influencias`,
        mensaje: 'una comarca con duenyo no acumula influencias: solo las neutrales',
      });
    }
    if (
      comarca.duenyo !== null &&
      (Object.keys(comarca.presenciaSeguida).length > 0 ||
        Object.keys(comarca.ultimoRegalo).length > 0 ||
        comarca.exDuenyo !== null)
    ) {
      errores.push({
        ruta: `comarcas.${clave}`,
        mensaje:
          'una comarca con duenyo no lleva cuenta de presencia ni de regalos ni de ex dueño: solo las neutrales',
      });
    }
    const cuentas: readonly (readonly [string, readonly string[]])[] = [
      ['influencias', Object.keys(comarca.influencias)],
      ['presenciaSeguida', Object.keys(comarca.presenciaSeguida)],
      ['ultimoRegalo', Object.keys(comarca.ultimoRegalo)],
      ['exDuenyo', comarca.exDuenyo === null ? [] : [comarca.exDuenyo]],
    ];
    for (const [campo, jugadores] of cuentas) {
      for (const jugador of jugadores) {
        if (!hayJugador(jugador)) {
          errores.push({
            ruta: `comarcas.${clave}.${campo}${campo === 'exDuenyo' ? '' : `.${jugador}`}`,
            mensaje: `el jugador "${jugador}" no existe en la partida`,
          });
        }
      }
    }
    if (mundo !== undefined && !Object.hasOwn(mundo.comarcas, clave)) {
      errores.push({
        ruta: `comarcas.${clave}`,
        mensaje: 'esta comarca no existe en el mundo de la partida',
      });
    }
  }

  const comprobarUnidad = (
    ruta: string,
    jugador: string,
    situacion: SituacionMovil,
    rutaPendiente: readonly string[],
  ): void => {
    if (!hayJugador(jugador)) {
      errores.push({
        ruta: `${ruta}.jugador`,
        mensaje: `el jugador "${jugador}" no existe en la partida`,
      });
    }
    const citadas =
      situacion.donde === 'comarca' ? [situacion.comarca] : [situacion.desde, situacion.hasta];
    for (const comarca of [...citadas, ...rutaPendiente]) {
      if (!hayComarca(comarca)) {
        errores.push({
          ruta: `${ruta}.situacion`,
          mensaje: `la comarca "${comarca}" no existe en la partida`,
        });
      }
    }
    if (situacion.donde === 'camino' && rutaPendiente[0] !== situacion.hasta) {
      errores.push({
        ruta: `${ruta}.ruta`,
        mensaje: `va de camino a "${situacion.hasta}" y su ruta tiene que empezar por alli`,
      });
    }
  };

  for (const [clave, recua] of Object.entries(estado.recuas)) {
    if (recua.id !== clave) {
      errores.push({ ruta: `recuas.${clave}.id`, mensaje: `no coincide con su clave "${clave}"` });
    }
    if (recua.siguienteParada > recua.paradas.length) {
      errores.push({
        ruta: `recuas.${clave}.siguienteParada`,
        mensaje: `apunta a la parada ${String(recua.siguienteParada)} y solo hay ${String(recua.paradas.length)}`,
      });
    }
    if (recua.enParada !== null && recua.enParada >= recua.paradas.length) {
      errores.push({
        ruta: `recuas.${clave}.enParada`,
        mensaje: `dice estar en la parada ${String(recua.enParada)} y solo hay ${String(recua.paradas.length)}`,
      });
    }
    comprobarUnidad(`recuas.${clave}`, recua.jugador, recua.situacion, recua.ruta);
  }
  for (const [clave, rebanyo] of Object.entries(estado.rebanyos)) {
    comprobarUnidad(`rebanyos.${clave}`, rebanyo.jugador, rebanyo.situacion, rebanyo.ruta);
  }

  for (const [clave, obra] of Object.entries(estado.obras)) {
    if (!hayJugador(obra.jugador)) {
      errores.push({
        ruta: `obras.${clave}.jugador`,
        mensaje: `el jugador "${obra.jugador}" no existe`,
      });
    }
    if (!hayComarca(obra.comarca)) {
      errores.push({
        ruta: `obras.${clave}.comarca`,
        mensaje: `la comarca "${obra.comarca}" no existe`,
      });
    }
  }

  estado.acontecimientos.forEach((acontecimiento, indice) => {
    if (acontecimiento.comarca !== null && !hayComarca(acontecimiento.comarca)) {
      errores.push({
        ruta: `acontecimientos.${String(indice)}.comarca`,
        mensaje: `la comarca "${acontecimiento.comarca}" no existe`,
      });
    }
  });
  for (const [clave, mercado] of Object.entries(estado.mercados)) {
    if (!hayComarca(mercado.comarca)) {
      errores.push({
        ruta: `mercados.${clave}.comarca`,
        mensaje: `la comarca "${mercado.comarca}" no existe`,
      });
    }
  }

  estado.ordenes.forEach((orden, indice) => {
    if (!hayJugador(orden.jugador)) {
      errores.push({
        ruta: `ordenes.${String(indice)}.jugador`,
        mensaje: `el jugador "${orden.jugador}" no existe en la partida`,
      });
    }
    if (orden.turnoAlta > estado.turno) {
      errores.push({
        ruta: `ordenes.${String(indice)}.turnoAlta`,
        mensaje: `la orden se dio en el turno ${String(orden.turnoAlta)} y la partida va por el ${String(estado.turno)}`,
      });
    }
  });

  for (const hito of HITOS) {
    const jugador = estado.primicias[hito];
    if (jugador !== undefined && estado.jugadores[jugador]?.hitos[hito] === undefined) {
      errores.push({
        ruta: `primicias.${hito}`,
        mensaje: `"${jugador}" no esta en la partida o no tiene el hito: la primicia es de quien lo logro`,
      });
    }
  }
  estado.clasificacion.forEach((puesto, i) => {
    if (!hayJugador(puesto.jugador) || puesto.puesto !== i + 1) {
      errores.push({
        ruta: `clasificacion.${String(i)}`,
        mensaje: 'la clasificacion va del puesto 1 en adelante y solo con jugadores de la partida',
      });
    }
  });

  return errores.length > 0 ? invalidos(errores) : valido(estado);
}
