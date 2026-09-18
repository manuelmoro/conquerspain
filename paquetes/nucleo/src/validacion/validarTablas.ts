// Validacion de las tablas de equilibrio. Si un numero del juego esta mal escrito, se sabe aqui
// y no tres fases despues, con una produccion imposible.
import { CARGAS_FISCALES, FUEROS, RECURSOS_AGOTABLES } from '../tipos/estado.ts';
import { POTENCIALES } from '../tipos/mundo.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import type {
  DatosArranque,
  DatosCasa,
  DatosConsumo,
  DatosFuero,
  DatosEdificio,
  DatosEstaciones,
  DatosInfluencia,
  DatosMercado,
  DatosMovimiento,
  DatosPoblacion,
  DatosPrestigio,
  DatosProduccion,
  DatosRecurso,
  DatosTradicion,
  Modificadores,
  Permisos,
  Prohibiciones,
  TablasDeReglas,
} from '../tipos/reglas.ts';
import {
  CALIDADES_CAMINO,
  CASAS,
  ESTACIONES,
  TIPOS_DE_EDIFICIO,
  VERSION_REGLAS,
} from '../tipos/reglas.ts';
import { milesimas, recursos, recursosParciales } from './comunes.ts';
import type { ErrorValidacion, Resultado, Validador } from './validador.ts';
import {
  booleano,
  entero,
  enteroNoNegativo,
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

const validarRecurso: Validador<DatosRecurso> = objeto<DatosRecurso>({
  precioBaseMil: entero({ minimo: 1 }),
  elasticidadMil: milesimas(0, 2000),
  mermaPorTurnoMil: milesimas(0, 200),
  perecedero: booleano(),
});

const validarEdificio: Validador<DatosEdificio> = objeto<DatosEdificio>({
  nombre: texto({ minimo: 1, maximo: 40 }),
  potencial: oNulo(unoDe(POTENCIALES)),
  potencialMinimo: entero({ minimo: 0, maximo: 5 }),
  coste: recursos(),
  turnos: entero({ minimo: 1, maximo: 60 }),
  nivelMaximo: entero({ minimo: 1, maximo: 10 }),
  produccion: recursosParciales(),
  consumo: recursosParciales(),
  vecinosPorNivel: enteroNoNegativo(100),
  requiereEdificio: oNulo(unoDe(TIPOS_DE_EDIFICIO)),
  esDePiedra: booleano(),
});

const validarModificadores: Validador<Modificadores> = objeto<Modificadores>({
  produccionMil: recursosParciales(),
  costeEdificioMil: registro(milesimas(0, 5000), unoDe(TIPOS_DE_EDIFICIO)),
  nivelMaximoEdificio: registro(entero({ minimo: 0, maximo: 10 }), unoDe(TIPOS_DE_EDIFICIO)),
  potencialMinimoEdificio: registro(entero({ minimo: 0, maximo: 5 }), unoDe(TIPOS_DE_EDIFICIO)),
  solaresExtra: entero({ minimo: -4, maximo: 4 }),
  aperosMaximo: entero({ minimo: 0, maximo: 6 }),
  pasoRecuaMil: milesimas(0, 5000),
  costeRecuaMil: milesimas(0, 5000),
  porteExtra: entero({ minimo: -20, maximo: 60 }),
  obraMayorCosteMil: milesimas(0, 5000),
  obraMayorAvanceMil: milesimas(0, 5000),
  obraSinFrenazoInvernal: booleano(),
  mermaPanMil: milesimas(0, 200),
  comisionMercadoMil: milesimas(0, 200),
  lanaEsquileoMil: milesimas(0, 5000),
  costeRebanyoMil: milesimas(0, 5000),
  lealtadMinima: entero({ minimo: 0, maximo: 100 }),
  agotamientoMonteMil: milesimas(0, 5000),
  crecimientoMil: milesimas(0, 5000),
});

const validarPermisos: Validador<Permisos> = objeto<Permisos>({
  pasoFrancoPorCanyada: booleano(),
  obraEnComarcaAjena: booleano(),
  letraDeCambio: booleano(),
  cobrarPortazgo: booleano(),
  venderAperos: booleano(),
  acequiaMenor: booleano(),
  cartaPuebla: booleano(),
});

const validarProhibiciones: Validador<Prohibiciones> = objeto<Prohibiciones>({
  roturar: booleano(),
  cargaFiscalDura: booleano(),
  catedral: booleano(),
  cobrarPortazgo: booleano(),
});

const validarCasa: Validador<DatosCasa> = objeto<DatosCasa>({
  nombre: texto({ minimo: 1, maximo: 60 }),
  privilegio: texto({ minimo: 1, maximo: 200 }),
  herramienta: texto({ minimo: 1, maximo: 200 }),
  limite: texto({ minimo: 1, maximo: 200 }),
  modificadores: validarModificadores,
  permisos: validarPermisos,
  prohibiciones: validarProhibiciones,
  potencialesDeOrigen: registro(entero({ minimo: 0, maximo: 5 }), unoDe(POTENCIALES)),
});

const validarTradicion: Validador<DatosTradicion> = objeto<DatosTradicion>({
  casa: unoDe(CASAS),
  ronda: unoDe(['renombre', 'fama', 'linaje'] as const),
  nombre: texto({ minimo: 1, maximo: 60 }),
  descripcion: texto({ minimo: 1, maximo: 300 }),
  nota: texto({ maximo: 300 }),
  modificadores: validarModificadores,
  desactivada: booleano(),
});

const validarEstacionesDatos: Validador<DatosEstaciones> = objeto<DatosEstaciones>({
  turnosPorAnyo: entero({ minimo: 1, maximo: 48 }),
  estacionPorTurno: lista(unoDe(ESTACIONES), { minimo: 1, maximo: 48 }),
  factorPanMil: registroCompleto(ESTACIONES, milesimas(0, 3000)),
  factorObraPiedraMil: registroCompleto(ESTACIONES, milesimas(500, 4000)),
  turnosDeBarro: lista(entero({ minimo: 1, maximo: 48 }), { maximo: 12 }),
  turnoDeEsquileo: entero({ minimo: 1, maximo: 48 }),
  turnosPastoDeVerano: lista(entero({ minimo: 1, maximo: 48 }), { minimo: 1, maximo: 24 }),
});

const validarMovimiento: Validador<DatosMovimiento> = objeto<DatosMovimiento>({
  jornadasPorTerreno: registro(entero({ minimo: 1, maximo: 30 })),
  factorCaminoMil: registroCompleto(CALIDADES_CAMINO, milesimas(100, 3000)),
  jornadasDeVado: enteroNoNegativo(10),
  pasoBaseMil: milesimas(500, 10000),
  bastimentoPorJornada: enteroNoNegativo(20),
  porteBase: entero({ minimo: 1, maximo: 200 }),
  costeFormarRecua: recursos(),
  factorBarroMil: milesimas(500, 3000),
  factorNieveMil: milesimas(500, 3000),
  factorVeranoMil: milesimas(500, 3000),
});

const validarPoblacion: Validador<DatosPoblacion> = objeto<DatosPoblacion>({
  consumoPorVecinoMil: milesimas(1, 3000),
  vecinosPorCuadrilla: entero({ minimo: 1, maximo: 200 }),
  cuadrillasMaximas: entero({ minimo: 1, maximo: 10 }),
  capacidadBase: entero({ minimo: 1, maximo: 1000 }),
  capacidadPorCasas: entero({ minimo: 1, maximo: 1000 }),
  crecimientoBase: enteroNoNegativo(100),
  crecimientoMaximoMil: milesimas(0, 1000),
  emigracionPorHambreMil: milesimas(0, 1000),
  lealtadInicialIncorporada: entero({ minimo: 0, maximo: 100 }),
  turnosDeslealParaPerderla: entero({ minimo: 1, maximo: 50 }),
  fueros: registroCompleto(
    FUEROS,
    objeto<DatosFuero>({
      administracionMil: milesimas(0, 3000),
      impuestosMil: milesimas(0, 3000),
      lealtadPorTurno: entero({ minimo: -10, maximo: 10 }),
    }),
  ),
});

const validarMercado: Validador<DatosMercado> = objeto<DatosMercado>({
  comisionMil: milesimas(0, 500),
  comisionFeriaMil: milesimas(0, 500),
  movimientoMaximoPorTurnoMil: milesimas(0, 1000),
  regresionAlBaseMil: milesimas(0, 1000),
  sueloMil: milesimas(100, 10000),
  techoMil: milesimas(1000, 10000),
  volumenBase: entero({ minimo: 1, maximo: 10000 }),
  multiplicadorVolumen: registro(entero({ minimo: 1, maximo: 100 })),
  liquidezMercaderesMenoresMil: milesimas(0, 5000),
});

const validarInfluencia: Validador<DatosInfluencia> = objeto<DatosInfluencia>({
  porPresencia: enteroNoNegativo(20),
  porComarcaVecina: enteroNoNegativo(20),
  maximoPorComarcasVecinas: enteroNoNegativo(50),
  porMercadoVecino: enteroNoNegativo(20),
  porComercioPorCadaCincuenta: enteroNoNegativo(20),
  maximoPorComercio: enteroNoNegativo(50),
  porMonasterio: enteroNoNegativo(20),
  porRegalo: enteroNoNegativo(50),
  costeRegalo: enteroNoNegativo(1000),
  turnosEntreRegalos: entero({ minimo: 1, maximo: 50 }),
  porCamino: enteroNoNegativo(20),
  desgastePorTurno: enteroNoNegativo(20),
  minimaParaIncorporar: entero({ minimo: 1, maximo: 100 }),
  ventajaSobreElSegundo: entero({ minimo: 0, maximo: 100 }),
  jornadasMaximasDesdeElDominio: entero({ minimo: 1, maximo: 60 }),
  costeIncorporar: recursos(),
  turnosIncorporar: entero({ minimo: 1, maximo: 20 }),
});

const validarPrestigio: Validador<DatosPrestigio> = objeto<DatosPrestigio>({
  porCadaCincoVecinos: enteroNoNegativo(100),
  porComarca: enteroNoNegativo(500),
  porComarcaConFuero: enteroNoNegativo(500),
  porObraMayor: registro(enteroNoNegativo(2000)),
  porTramoDeCamino: enteroNoNegativo(200),
  porFeriaDestacada: enteroNoNegativo(500),
  porPrimicia: enteroNoNegativo(500),
  porComarcaExplorada: enteroNoNegativo(100),
  porAnyoTrashumante: enteroNoNegativo(200),
  porAperosAltos: enteroNoNegativo(200),
  penalizacionPorComarcaPerdida: enteroNoNegativo(500),
  penalizacionPorEscasez: enteroNoNegativo(100),
});

const validarProduccion: Validador<DatosProduccion> = objeto<DatosProduccion>({
  multiplicadorPotencialMil: lista(milesimas(0, 3000), { minimo: 6, maximo: 6 }),
  aperoMil: milesimas(0, 500),
  lealtad: lista(
    objeto<{ menorQue: number; factorMil: number }>({
      menorQue: entero({ minimo: 1, maximo: 100 }),
      factorMil: milesimas(0, 1000),
    }),
    { maximo: 10 },
  ),
  agotamiento: objeto<DatosProduccion['agotamiento']>({
    factorPorPuntoMil: milesimas(0, 100),
    sueloMil: milesimas(0, 1000),
    porNivel: enteroNoNegativo(20),
    maximo: entero({ minimo: 1, maximo: 100 }),
    regeneracion: registroCompleto(RECURSOS_AGOTABLES, enteroNoNegativo(20)),
  }),
  dehesa: objeto<DatosProduccion['dehesa']>({
    agotamientoMonteMil: milesimas(0, 1000),
    maderaMil: milesimas(0, 1000),
  }),
  edificiosEstacionales: lista(unoDe(TIPOS_DE_EDIFICIO), { maximo: 15 }),
  molinoMil: milesimas(0, 1000),
  maravedis: objeto<DatosProduccion['maravedis']>({
    porNivelMercado: enteroNoNegativo(100),
    vecinosPorPunto: entero({ minimo: 1, maximo: 100 }),
    cargaFiscal: registroCompleto(CARGAS_FISCALES, enteroNoNegativo(10)),
  }),
});

const validarConsumo: Validador<DatosConsumo> = objeto<DatosConsumo>({
  panPorCuadrilla: enteroNoNegativo(20),
  hierroPorApero: enteroNoNegativo(10),
  turnosSinHierroParaPerderApero: entero({ minimo: 1, maximo: 10 }),
  mermaGraneroMil: milesimas(0, 1000),
  mermaSalMil: milesimas(0, 1000),
  panPorSal: entero({ minimo: 1, maximo: 1000 }),
  administracionBase: enteroNoNegativo(100),
  administracionPorJornada: enteroNoNegativo(100),
  lealtadPorEscasez: enteroNoNegativo(50),
  lealtadPorHambreProlongada: enteroNoNegativo(50),
  lealtadPorDeudaDeAdministracion: enteroNoNegativo(50),
  escasezParaEmigrar: entero({ minimo: 1, maximo: 20 }),
  turnosDeAvisoDeHambre: entero({ minimo: 1, maximo: 24 }),
});

const validarArranque: Validador<DatosArranque> = objeto<DatosArranque>({
  almacen: recursos(),
  edificiosDeOrigen: registro(entero({ minimo: 1, maximo: 10 }), unoDe(TIPOS_DE_EDIFICIO)),
});

const validarForma: Validador<TablasDeReglas> = objeto<TablasDeReglas>({
  version: entero({ minimo: 1 }),
  recursos: registroCompleto(RECURSOS, validarRecurso),
  edificios: registroCompleto(TIPOS_DE_EDIFICIO, validarEdificio),
  casas: registroCompleto(CASAS, validarCasa),
  tradiciones: registro(validarTradicion),
  estaciones: validarEstacionesDatos,
  produccion: validarProduccion,
  consumo: validarConsumo,
  movimiento: validarMovimiento,
  poblacion: validarPoblacion,
  mercado: validarMercado,
  influencia: validarInfluencia,
  prestigio: validarPrestigio,
  arranque: validarArranque,
});

/** Valida las tablas de equilibrio y su coherencia con la version de reglas del motor. */
export function validarTablas(dato: unknown): Resultado<TablasDeReglas> {
  const forma = validarForma(dato, '');
  if (!forma.ok) return forma;
  const tablas = forma.valor;
  const errores: ErrorValidacion[] = [];

  if (tablas.version !== VERSION_REGLAS) {
    errores.push({
      ruta: 'version',
      mensaje: `las tablas son de la version ${String(tablas.version)} y el motor es la ${String(VERSION_REGLAS)}`,
    });
  }

  if (tablas.estaciones.estacionPorTurno.length !== tablas.estaciones.turnosPorAnyo) {
    errores.push({
      ruta: 'estaciones.estacionPorTurno',
      mensaje: `hay ${String(tablas.estaciones.estacionPorTurno.length)} turnos descritos y el anyo tiene ${String(tablas.estaciones.turnosPorAnyo)}`,
    });
  }

  for (const clave of TIPOS_DE_EDIFICIO) {
    const edificio = tablas.edificios[clave];
    if (edificio.potencial === null && edificio.potencialMinimo > 0) {
      errores.push({
        ruta: `edificios.${clave}.potencialMinimo`,
        mensaje: 'pide un potencial minimo pero no dice de que potencial depende',
      });
    }
    // Los insumos se resuelven en el orden de TIPOS_DE_EDIFICIO (reglas/insumos.ts): el edificio
    // del que depende otro tiene que ir antes para saber cuantos niveles suyos trabajan.
    const requerido = edificio.requiereEdificio;
    if (
      requerido !== null &&
      TIPOS_DE_EDIFICIO.indexOf(requerido) >= TIPOS_DE_EDIFICIO.indexOf(clave)
    ) {
      errores.push({
        ruta: `edificios.${clave}.requiereEdificio`,
        mensaje: `"${requerido}" tiene que ir antes que "${clave}" en la lista de tipos de edificio`,
      });
    }
  }

  for (const [clave, tradicion] of Object.entries(tablas.tradiciones)) {
    if (!clave.startsWith(`${tradicion.casa}-`)) {
      errores.push({
        ruta: `tradiciones.${clave}`,
        mensaje: `una tradicion se identifica como "<casa>-<nombre>" y esta es de la casa "${tradicion.casa}"`,
      });
    }
  }

  if (tablas.mercado.sueloMil >= tablas.mercado.techoMil) {
    errores.push({
      ruta: 'mercado.sueloMil',
      mensaje: 'el suelo de precios tiene que estar por debajo del techo',
    });
  }

  return errores.length > 0 ? invalidos(errores) : valido(tablas);
}
