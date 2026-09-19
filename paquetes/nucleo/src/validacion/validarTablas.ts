// Validacion de las tablas de equilibrio. Si un numero del juego esta mal escrito, se sabe aqui
// y no tres fases despues, con una produccion imposible.
import {
  CARGAS_FISCALES,
  EFECTOS_QUE_MULTIPLICAN,
  FUEROS,
  QUE_DE_EFECTO,
  RECURSOS_AGOTABLES,
} from '../tipos/estado.ts';
import type { Potencial } from '../tipos/mundo.ts';
import { POTENCIALES, RASGOS, TERRENOS, VOLUMENES_FERIA } from '../tipos/mundo.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import type {
  CondicionDeRonda,
  CriterioDeOrigen,
  DatosHito,
  DatosRumores,
  DatosAcontecimiento,
  DatosAcontecimientos,
  DatosSorteoDeAcontecimientos,
  DuracionDeAcontecimiento,
  DatosArranque,
  DatosCasa,
  DatosCometidos,
  DatosObraMayor,
  DatosObras,
  DatosConsumo,
  DatosFuero,
  DatosGanaderia,
  DatosEdificio,
  DatosEstaciones,
  DatosInfluencia,
  DatosMercado,
  DatosMovimiento,
  DatosPoblacion,
  DatosPrestigio,
  DatosProduccion,
  DatosRecurso,
  DatosTerritorio,
  DatosTradicion,
  Modificadores,
  Permisos,
  Prohibiciones,
  TablasDeReglas,
} from '../tipos/reglas.ts';
import {
  CALIDADES_CAMINO,
  COMPOSICION_DE_MODIFICADORES,
  CRITERIOS_DE_TRADICION,
  NOMBRES_DE_PERMISO,
  CASAS,
  ESTACIONES,
  HITOS,
  RONDAS_DE_TRADICION,
  TIPOS_DE_ACONTECIMIENTO,
  TIPOS_DE_EDIFICIO,
  TIPOS_DE_OBRA_MAYOR,
  VERSION_REGLAS,
} from '../tipos/reglas.ts';
import { comparar } from '../utiles/orden.ts';
import { efectoDeAcontecimiento, milesimas, recursos, recursosParciales } from './comunes.ts';
import type { CamposDe, ErrorValidacion, Resultado, Validador } from './validador.ts';
import {
  booleano,
  entero,
  enteroNoNegativo,
  invalidos,
  lista,
  oNulo,
  objeto,
  objetoParcial,
  porTipo,
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
  exigePermiso: oNulo(unoDe(NOMBRES_DE_PERMISO)),
});

const camposDeModificadores: CamposDe<Modificadores> = {
  produccionMil: recursosParciales(),
  costeEdificioMil: registro(milesimas(0, 5000), unoDe(TIPOS_DE_EDIFICIO)),
  nivelMaximoEdificio: registro(entero({ minimo: 0, maximo: 10 }), unoDe(TIPOS_DE_EDIFICIO)),
  potencialMinimoEdificio: registro(entero({ minimo: 0, maximo: 5 }), unoDe(TIPOS_DE_EDIFICIO)),
  solaresExtra: entero({ minimo: -4, maximo: 4 }),
  aperosMaximo: entero({ minimo: 0, maximo: 6 }),
  // Es un sumando: una tradicion puede restar paso (la carreta de bueyes).
  pasoRecuaMil: entero({ minimo: -2000, maximo: 5000 }),
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
  agotamientoMil: registro(milesimas(0, 5000), unoDe(RECURSOS_AGOTABLES)),
  crecimientoMil: milesimas(0, 5000),
  produccionEdificioMil: registro(milesimas(0, 5000), unoDe(TIPOS_DE_EDIFICIO)),
  produccionEdificioEnVegaMil: registro(milesimas(0, 5000), unoDe(TIPOS_DE_EDIFICIO)),
  laborFueraDeVegaMil: milesimas(0, 5000),
  edificiosPorRequisito: registro(entero({ minimo: 1, maximo: 10 }), unoDe(TIPOS_DE_EDIFICIO)),
  costeObraMayorMil: registro(milesimas(0, 5000), unoDe(TIPOS_DE_OBRA_MAYOR)),
  capacidadPorCasasExtra: entero({ minimo: -30, maximo: 30 }),
  vecinosParaPueblaMil: milesimas(0, 5000),
  avanceObraMayorMil: registro(milesimas(0, 5000), unoDe(TIPOS_DE_OBRA_MAYOR)),
  cuadrillasExtra: entero({ minimo: -3, maximo: 3 }),
  efectoAperosMil: milesimas(0, 5000),
  administracionMil: milesimas(0, 5000),
  influenciaMil: milesimas(0, 5000),
  bastimentoMil: milesimas(0, 5000),
};
const validarModificadores = objeto<Modificadores>(camposDeModificadores);

const camposDePermisos: CamposDe<Permisos> = {
  pasoFrancoPorCanyada: booleano(),
  obraEnComarcaAjena: booleano(),
  letraDeCambio: booleano(),
  cobrarPortazgo: booleano(),
  venderAperos: booleano(),
  acequiaMenor: booleano(),
  cartaPuebla: booleano(),
  corresponsales: booleano(),
};
const validarPermisos = objeto<Permisos>(camposDePermisos);

const camposDeProhibiciones: CamposDe<Prohibiciones> = {
  roturar: booleano(),
  cargaFiscalDura: booleano(),
  catedral: booleano(),
  cobrarPortazgo: booleano(),
};
const validarProhibiciones = objeto<Prohibiciones>(camposDeProhibiciones);

const validarCriterioDeOrigen: Validador<CriterioDeOrigen> = objeto<CriterioDeOrigen>({
  potenciales: registro(entero({ minimo: 1, maximo: 5 }), unoDe(POTENCIALES)),
  rasgos: lista(unoDe(RASGOS), { maximo: 8 }),
  terrenos: lista(unoDe(TERRENOS), { maximo: 5 }),
  vecinaConPotencial: oNulo(
    objeto<{ readonly potencial: Potencial; readonly nivel: number }>({
      potencial: unoDe(POTENCIALES),
      nivel: entero({ minimo: 1, maximo: 5 }),
    }),
  ),
});

const validarCasa: Validador<DatosCasa> = objeto<DatosCasa>({
  nombre: texto({ minimo: 1, maximo: 60 }),
  privilegio: texto({ minimo: 1, maximo: 200 }),
  herramienta: texto({ minimo: 1, maximo: 200 }),
  limite: texto({ minimo: 1, maximo: 200 }),
  modificadores: validarModificadores,
  permisos: validarPermisos,
  prohibiciones: validarProhibiciones,
  origenes: lista(validarCriterioDeOrigen, { maximo: 8 }),
});

const validarTradicion: Validador<DatosTradicion> = objeto<DatosTradicion>({
  casa: unoDe(CASAS),
  ronda: unoDe(RONDAS_DE_TRADICION),
  criterio: unoDe(CRITERIOS_DE_TRADICION),
  nombre: texto({ minimo: 1, maximo: 60 }),
  descripcion: texto({ minimo: 1, maximo: 200 }),
  nota: texto({ minimo: 1, maximo: 400 }),
  modificadores: objetoParcial<Modificadores>(camposDeModificadores),
  permisos: objetoParcial<Permisos>(camposDePermisos),
  prohibiciones: objetoParcial<Prohibiciones>(camposDeProhibiciones),
  desactivada: booleano(),
  pendienteDe: oNulo(texto({ minimo: 1, maximo: 20 })),
});

const umbral = oNulo(entero({ minimo: 1 }));
const validarCondicionDeRonda: Validador<CondicionDeRonda> = objeto<CondicionDeRonda>({
  comarcas: umbral,
  vecinos: umbral,
  obraMayorTerminada: booleano(),
  prestigio: umbral,
  turno: umbral,
});

const validarEstacionesDatos: Validador<DatosEstaciones> = objeto<DatosEstaciones>({
  turnosPorAnyo: entero({ minimo: 1, maximo: 48 }),
  estacionPorTurno: lista(unoDe(ESTACIONES), { minimo: 1, maximo: 48 }),
  factorPanMil: registroCompleto(ESTACIONES, milesimas(0, 3000)),
  factorObraPiedraMil: registroCompleto(ESTACIONES, milesimas(500, 4000)),
  factorObraMaderaMil: registroCompleto(ESTACIONES, milesimas(500, 4000)),
  turnosDeBarro: lista(entero({ minimo: 1, maximo: 48 }), { maximo: 12 }),
  turnoDeEsquileo: entero({ minimo: 1, maximo: 48 }),
  turnosPastoDeVerano: lista(entero({ minimo: 1, maximo: 48 }), { minimo: 1, maximo: 24 }),
});

const validarMovimiento: Validador<DatosMovimiento> = objeto<DatosMovimiento>({
  jornadasPorTerreno: registro(entero({ minimo: 1, maximo: 30 })),
  factorCaminoMil: registroCompleto(CALIDADES_CAMINO, milesimas(100, 3000)),
  jornadasDeVado: enteroNoNegativo(10),
  pasoBaseMil: milesimas(500, 10000),
  pasoCargadaMil: milesimas(0, 5000),
  pasoBarroMil: milesimas(0, 5000),
  pasoCalzadaMil: milesimas(0, 5000),
  pasoMinimoMil: milesimas(100, 5000),
  cargaPesadaMil: milesimas(1, 1000),
  bastimentoPorJornada: enteroNoNegativo(20),
  jornadasPorSalEnVerano: entero({ minimo: 1, maximo: 30 }),
  acemilasPorRecua: entero({ minimo: 1, maximo: 100 }),
  portePorAcemila: entero({ minimo: 1, maximo: 20 }),
  arrierosPorRecua: enteroNoNegativo(20),
  vecinosMaximosPorRecua: enteroNoNegativo(200),
  costeFormarRecua: recursos(),
  factorBarroMil: milesimas(500, 3000),
  factorNieveMil: milesimas(500, 3000),
  factorVeranoMil: milesimas(500, 3000),
});

const validarCometidos: Validador<DatosCometidos> = objeto<DatosCometidos>({
  probabilidadHallazgoMil: milesimas(0, 1000),
  influenciaParaPuebla: entero({ minimo: 0, maximo: 100 }),
  vecinosParaPuebla: entero({ minimo: 1, maximo: 200 }),
  turnosParaPuebla: entero({ minimo: 1, maximo: 20 }),
  lealtadDePuebla: entero({ minimo: 0, maximo: 100 }),
  bastimentoPresenciaMil: milesimas(0, 10000),
  devolucionAlDisolverMil: milesimas(0, 1000),
});

const validarObras: Validador<DatosObras> = objeto<DatosObras>({
  cuadrillasPorFuero: enteroNoNegativo(4),
  cuadrillasPorMonasterio: enteroNoNegativo(4),
  turnosDerribo: entero({ minimo: 1, maximo: 10 }),
  costeAperos: recursos(),
  devolucionDerriboMil: milesimas(0, 1000),
  turnosRoturar: entero({ minimo: 1, maximo: 20 }),
  costeRoturar: recursos(),
  costeRoturarDehesaMil: milesimas(1000, 5000),
  lealtadPorRoturarDehesa: enteroNoNegativo(50),
  deterioroAbandonoMil: milesimas(0, 1000),
  lealtadParaMonasterio: entero({ minimo: 0, maximo: 100 }),
  vecinosDeCiudad: entero({ minimo: 1, maximo: 10000 }),
  lealtadPorMuralla: enteroNoNegativo(100),
  lealtadRegionalPorCatedral: enteroNoNegativo(20),
  maravedisPorPeregrinos: enteroNoNegativo(200),
  crecimientoPorMonasterioMil: milesimas(0, 2000),
  laborPorAcequiaMil: milesimas(1000, 3000),
});

const validarObraMayor: Validador<DatosObraMayor> = objeto<DatosObraMayor>({
  nombre: texto({ minimo: 1, maximo: 40 }),
  turnos: entero({ minimo: 1, maximo: 100 }),
  coste: recursos(),
  esDePiedra: booleano(),
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
  capacidadPorMuralla: enteroNoNegativo(1000),
  fueros: registroCompleto(
    FUEROS,
    objeto<DatosFuero>({
      administracionMil: milesimas(0, 3000),
      impuestosMil: milesimas(0, 3000),
      lealtadPorTurno: entero({ minimo: -10, maximo: 10 }),
      crecimientoMil: milesimas(0, 3000),
    }),
  ),
});

const validarTerritorio: Validador<DatosTerritorio> = objeto<DatosTerritorio>({
  lealtadMaximaPorFuero: entero({ minimo: 0, maximo: 100 }),
  lealtadPorMercado: enteroNoNegativo(20),
  lealtadPorObraMayorCerca: enteroNoNegativo(20),
  lealtadPorCargaLigera: enteroNoNegativo(20),
  lealtadPorCargaDura: enteroNoNegativo(20),
  jornadasDeLejania: enteroNoNegativo(50),
  lealtadPorLejania: enteroNoNegativo(20),
  lealtadPorAbandono: enteroNoNegativo(20),
  lealtadDesleal: entero({ minimo: 0, maximo: 100 }),
  turnosEntreCambiosDeFuero: enteroNoNegativo(100),
  turnosFueroIrreversible: enteroNoNegativo(100),
  lealtadPorQuitarFuero: enteroNoNegativo(100),
  turnosTraslado: entero({ minimo: 1, maximo: 100 }),
  costeTraslado: recursos(),
  recargoAdministracionTrasladoMil: milesimas(0, 2000),
});

const validarGanaderia: Validador<DatosGanaderia> = objeto<DatosGanaderia>({
  cabezasPorRebanyo: entero({ minimo: 1, maximo: 100000 }),
  costeFormarRebanyo: recursos(),
  vecinosPorRebanyo: entero({ minimo: 0, maximo: 50 }),
  pasoBaseMil: entero({ minimo: 1, maximo: 20000 }),
  pasoCanyadaMil: enteroNoNegativo(20000),
  pastoMinimo: entero({ minimo: 0, maximo: 5 }),
  cabezasPorPuntoDePasto: entero({ minimo: 1, maximo: 100000 }),
  sacasPorRebanyo: enteroNoNegativo(1000),
  panPorTurno: enteroNoNegativo(1000),
  turnosSinPastoParaPerder: entero({ minimo: 1, maximo: 24 }),
  perdidaPorSinPastoMil: milesimas(0, 1000),
  turnosDeInvernadaParaAbono: entero({ minimo: 1, maximo: 240 }),
  abonoPorNivelMil: milesimas(0, 500),
  nivelesDeAbono: enteroNoNegativo(10),
  avisoDePuertoTurnos: entero({ minimo: 1, maximo: 12 }),
  costeCanyadaMil: milesimas(1, 2000),
});

const validarMercado: Validador<DatosMercado> = objeto<DatosMercado>({
  comisionFeriaMil: milesimas(0, 500),
  comisionLetraMil: milesimas(0, 500),
  movimientoMaximoPorTurnoMil: milesimas(0, 1000),
  regresionAlBaseMil: milesimas(0, 1000),
  sueloMil: milesimas(100, 10000),
  techoMil: milesimas(1000, 10000),
  volumenBase: entero({ minimo: 1, maximo: 10000 }),
  multiplicadorVolumen: registro(entero({ minimo: 1, maximo: 100 })),
  liquidezMercaderesMenoresMil: milesimas(0, 5000),
  margenMercaderesMenoresMil: milesimas(0, 900),
});

const validarInfluencia: Validador<DatosInfluencia> = objeto<DatosInfluencia>({
  porPresencia: enteroNoNegativo(20),
  porComarcaVecina: enteroNoNegativo(20),
  maximoPorComarcasVecinas: enteroNoNegativo(50),
  porMercadoVecino: enteroNoNegativo(20),
  maravedisPorBloqueDeComercio: entero({ minimo: 1, maximo: 10000 }),
  porBloqueDeComercio: enteroNoNegativo(20),
  maximoPorComercio: enteroNoNegativo(50),
  porMonasterio: enteroNoNegativo(20),
  porRegalo: enteroNoNegativo(50),
  costeRegalo: enteroNoNegativo(1000),
  turnosEntreRegalos: entero({ minimo: 1, maximo: 50 }),
  porCamino: enteroNoNegativo(20),
  desgastePorTurno: enteroNoNegativo(20),
  desgastePorEscasez: enteroNoNegativo(50),
  minimaParaIncorporar: entero({ minimo: 1, maximo: 100 }),
  ventajaSobreElSegundo: entero({ minimo: 0, maximo: 100 }),
  jornadasMaximasDesdeElDominio: entero({ minimo: 1, maximo: 60 }),
  costeIncorporar: recursos(),
  turnosIncorporar: entero({ minimo: 1, maximo: 20 }),
});

const validarDuracion = porTipo<DuracionDeAcontecimiento>({
  fija: objeto<{ readonly tipo: 'fija'; readonly turnos: number }>({
    tipo: unoDe(['fija'] as const),
    turnos: entero({ minimo: 1, maximo: 24 }),
  }),
  'hasta-el-esquileo': objeto<{ readonly tipo: 'hasta-el-esquileo' }>({
    tipo: unoDe(['hasta-el-esquileo'] as const),
  }),
  'de-la-feria': objeto<{ readonly tipo: 'de-la-feria' }>({
    tipo: unoDe(['de-la-feria'] as const),
  }),
});

const validarAcontecimiento: Validador<DatosAcontecimiento> = objeto<DatosAcontecimiento>({
  nombre: texto({ minimo: 1, maximo: 60 }),
  signo: unoDe(['positivo', 'negativo'] as const),
  peso: entero({ minimo: 1, maximo: 100 }),
  objetivo: unoDe(['region', 'comarca', 'feria'] as const),
  inicio: oNulo(
    objeto<{ readonly desde: number; readonly hasta: number }>({
      desde: entero({ minimo: 1, maximo: 24 }),
      hasta: entero({ minimo: 1, maximo: 24 }),
    }),
  ),
  duracion: validarDuracion,
  potencialMinimo: oNulo(
    objeto<{ readonly potencial: Potencial; readonly nivel: number }>({
      potencial: unoDe(POTENCIALES),
      nivel: entero({ minimo: 1, maximo: 5 }),
    }),
  ),
  efectos: lista(efectoDeAcontecimiento(), { minimo: 1, maximo: 6 }),
  respuestas: lista(texto({ minimo: 1, maximo: 120 }), { minimo: 1, maximo: 4 }),
});

const validarSorteoDeAcontecimientos: Validador<DatosSorteoDeAcontecimientos> =
  objeto<DatosSorteoDeAcontecimientos>({
    minimoPorAnyo: entero({ minimo: 1, maximo: 12 }),
    maximoPorAnyo: entero({ minimo: 1, maximo: 12 }),
    turnosDeAviso: entero({ minimo: 1, maximo: 6 }),
  });

const validarAcontecimientos: Validador<DatosAcontecimientos> = objeto<DatosAcontecimientos>({
  sorteo: validarSorteoDeAcontecimientos,
  catalogo: registroCompleto(TIPOS_DE_ACONTECIMIENTO, validarAcontecimiento),
  limites: registroCompleto(
    QUE_DE_EFECTO,
    objeto<{ readonly minimo: number; readonly maximo: number }>({
      minimo: entero({ minimo: 0, maximo: 5000 }),
      maximo: entero({ minimo: 0, maximo: 5000 }),
    }),
  ),
});

const validarPrestigio: Validador<DatosPrestigio> = objeto<DatosPrestigio>({
  porCadaCincoVecinos: enteroNoNegativo(100),
  porComarca: enteroNoNegativo(500),
  porComarcaConFuero: enteroNoNegativo(500),
  porObraMayor: registroCompleto(TIPOS_DE_OBRA_MAYOR, enteroNoNegativo(2000)),
  porTramoDeCamino: enteroNoNegativo(200),
  porFeriaDestacada: enteroNoNegativo(500),
  volumenDeFeriaDestacada: entero({ minimo: 1, maximo: 100_000 }),
  porPrimicia: enteroNoNegativo(500),
  porComarcaExplorada: enteroNoNegativo(100),
  porAnyoTrashumante: enteroNoNegativo(200),
  calidadDeAnyoTrashumanteMil: milesimas(1, 1000),
  porAperosAltos: enteroNoNegativo(200),
  nivelDeAperosAltos: entero({ minimo: 1, maximo: 6 }),
  reservaDeDespensaEstable: enteroNoNegativo(10_000),
  penalizacionPorComarcaPerdida: enteroNoNegativo(500),
  penalizacionPorEscasez: enteroNoNegativo(100),
});

const validarRumores: Validador<DatosRumores> = objeto<DatosRumores>({
  porFeria: registroCompleto(VOLUMENES_FERIA, enteroNoNegativo(10)),
  porCaminoDeSantiago: enteroNoNegativo(10),
  porVenta: enteroNoNegativo(10),
  corresponsalesMil: milesimas(1000, 5000),
  maximoPorTurno: enteroNoNegativo(50),
  dePreciosMil: milesimas(0, 1000),
});

const validarHito: Validador<DatosHito> = objeto<DatosHito>({
  nombre: texto({ minimo: 1, maximo: 60 }),
  condicion: texto({ minimo: 1, maximo: 200 }),
  umbral: entero({ minimo: 1, maximo: 100_000 }),
  prestigio: enteroNoNegativo(1000),
  desactivado: booleano(),
  pendienteDe: oNulo(texto({ minimo: 1, maximo: 20 })),
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
  rondas: registroCompleto(RONDAS_DE_TRADICION, validarCondicionDeRonda),
  estaciones: validarEstacionesDatos,
  produccion: validarProduccion,
  consumo: validarConsumo,
  movimiento: validarMovimiento,
  cometidos: validarCometidos,
  obras: validarObras,
  obrasMayores: registroCompleto(TIPOS_DE_OBRA_MAYOR, validarObraMayor),
  poblacion: validarPoblacion,
  territorio: validarTerritorio,
  mercado: validarMercado,
  influencia: validarInfluencia,
  prestigio: validarPrestigio,
  hitos: registroCompleto(HITOS, validarHito),
  rumores: validarRumores,
  arranque: validarArranque,
  acontecimientos: validarAcontecimientos,
  ganaderia: validarGanaderia,
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

  errores.push(...coherenciaDeTradiciones(tablas));
  for (const hito of HITOS) {
    const datos = tablas.hitos[hito];
    if (datos.desactivado !== (datos.pendienteDe !== null)) {
      errores.push({
        ruta: `hitos.${hito}.pendienteDe`,
        mensaje:
          'un hito desactivado dice de que tarea depende, y uno activo lleva pendienteDe null',
      });
    }
  }

  errores.push(...coherenciaDeAcontecimientos(tablas));

  if (tablas.mercado.sueloMil >= tablas.mercado.techoMil) {
    errores.push({
      ruta: 'mercado.sueloMil',
      mensaje: 'el suelo de precios tiene que estar por debajo del techo',
    });
  }

  return errores.length > 0 ? invalidos(errores) : valido(tablas);
}

/** Las cifras de los acontecimientos casan con su horquilla, con el calendario y entre si. */
/**
 * Lo que cada tradicion fija (un valor fijo, un permiso, una prohibicion), con la clave con que
 * choca: `modificadores.aperosMaximo`, `modificadores.nivelMaximoEdificio.huerta`, `permisos.x`…
 */
function loQueFija(tradicion: DatosTradicion): string[] {
  const composicion = new Map<string, string>(Object.entries(COMPOSICION_DE_MODIFICADORES));
  const claves: string[] = [];
  for (const [campo, valor] of Object.entries(tradicion.modificadores)) {
    if (composicion.get(campo) !== 'fija') continue;
    if (typeof valor === 'object') {
      for (const clave of Object.keys(valor)) claves.push(`modificadores.${campo}.${clave}`);
    } else {
      claves.push(`modificadores.${campo}`);
    }
  }
  for (const campo of Object.keys(tradicion.permisos)) claves.push(`permisos.${campo}`);
  for (const campo of Object.keys(tradicion.prohibiciones)) claves.push(`prohibiciones.${campo}`);
  return claves;
}

/**
 * Cada tradicion es de su casa, dice por que esta desactivada, y ninguna fija lo que ya fija
 * otra de su casa: asi el orden en que se eligen no cambia el resultado.
 */
function coherenciaDeTradiciones(tablas: TablasDeReglas): ErrorValidacion[] {
  const errores: ErrorValidacion[] = [];
  const fijadoPor = new Map<string, string>();
  for (const clave of Object.keys(tablas.tradiciones).sort(comparar)) {
    const tradicion = tablas.tradiciones[clave];
    if (tradicion === undefined) continue;
    const ruta = `tradiciones.${clave}`;
    if (!clave.startsWith(`${tradicion.casa}-`)) {
      errores.push({
        ruta,
        mensaje: `una tradicion se identifica como "<casa>-<nombre>" y esta es de la casa "${tradicion.casa}"`,
      });
    }
    if (tradicion.desactivada !== (tradicion.pendienteDe !== null)) {
      errores.push({
        ruta: `${ruta}.pendienteDe`,
        mensaje:
          'una tradicion desactivada dice de que tarea depende, y una activa lleva pendienteDe null',
      });
    }
    for (const fija of loQueFija(tradicion)) {
      const otra = fijadoPor.get(`${tradicion.casa}|${fija}`);
      if (otra !== undefined) {
        errores.push({
          ruta: `${ruta}.${fija}`,
          mensaje: `"${otra}" ya fija este valor para su casa; dos tradiciones no pueden fijar lo mismo`,
        });
      } else {
        fijadoPor.set(`${tradicion.casa}|${fija}`, clave);
      }
    }
  }
  return errores;
}

function coherenciaDeAcontecimientos(tablas: TablasDeReglas): ErrorValidacion[] {
  const errores: ErrorValidacion[] = [];
  const { sorteo, catalogo, limites } = tablas.acontecimientos;
  const anyo = tablas.estaciones.turnosPorAnyo;
  const aviso = sorteo.turnosDeAviso;
  const error = (ruta: string, mensaje: string): void => {
    errores.push({ ruta: `acontecimientos.${ruta}`, mensaje });
  };

  if (sorteo.minimoPorAnyo > sorteo.maximoPorAnyo) {
    error('sorteo.minimoPorAnyo', 'el minimo de acontecimientos por anyo pasa del maximo');
  }
  for (const clase of QUE_DE_EFECTO) {
    if (limites[clase].minimo > limites[clase].maximo) {
      error(`limites.${clase}`, 'el minimo de la horquilla pasa del maximo');
    }
  }
  if (!TIPOS_DE_ACONTECIMIENTO.some((tipo) => catalogo[tipo].signo === 'positivo')) {
    error(
      'catalogo',
      'hace falta al menos un acontecimiento positivo: cada anyo tiene que llevar uno',
    );
  }

  for (const tipo of TIPOS_DE_ACONTECIMIENTO) {
    const datos = catalogo[tipo];
    const donde = `catalogo.${tipo}`;
    const esDeFeria = datos.objetivo === 'feria';
    if (esDeFeria !== (datos.duracion.tipo === 'de-la-feria')) {
      error(
        `${donde}.duracion`,
        'la duracion "de-la-feria" es solo de los acontecimientos de feria y viceversa',
      );
    }
    if (esDeFeria !== (datos.inicio === null)) {
      error(
        `${donde}.inicio`,
        'los de feria empiezan con la feria (sin ventana) y los demas necesitan una',
      );
    }
    if (datos.potencialMinimo !== null && datos.objetivo !== 'comarca') {
      error(`${donde}.potencialMinimo`, 'solo los acontecimientos de una comarca piden potencial');
    }
    if (datos.inicio !== null) {
      const { desde, hasta } = datos.inicio;
      if (desde <= aviso || hasta < desde) {
        error(
          `${donde}.inicio`,
          `tiene que empezar despues del turno ${String(aviso)} del anyo (para anunciarse dentro de el) y desde <= hasta`,
        );
      }
      const duracion = datos.duracion;
      const ultimo =
        duracion.tipo === 'fija'
          ? hasta + duracion.turnos - 1
          : duracion.tipo === 'hasta-el-esquileo'
            ? Math.max(hasta, tablas.estaciones.turnoDeEsquileo)
            : hasta;
      if (ultimo > anyo) {
        error(
          `${donde}.duracion`,
          `terminaria en el turno ${String(ultimo)} y el anyo tiene ${String(anyo)}: ningun acontecimiento cruza de anyo`,
        );
      }
      if (duracion.tipo === 'hasta-el-esquileo' && hasta > tablas.estaciones.turnoDeEsquileo) {
        error(`${donde}.inicio`, 'la ventana de inicio pasa del esquileo, al que tiene que llegar');
      }
    }
    datos.efectos.forEach((efecto, i) => {
      const medida = EFECTOS_QUE_MULTIPLICAN.includes(efecto.que)
        ? efecto.factorMil
        : efecto.cantidad;
      const otra = EFECTOS_QUE_MULTIPLICAN.includes(efecto.que)
        ? efecto.cantidad === 0
        : efecto.factorMil === 1000;
      const horquilla = limites[efecto.que];
      if (medida < horquilla.minimo || medida > horquilla.maximo) {
        error(
          `${donde}.efectos.${String(i)}`,
          `${efecto.que} vale ${String(medida)} y su horquilla va de ${String(horquilla.minimo)} a ${String(horquilla.maximo)}`,
        );
      }
      if (!otra) {
        error(
          `${donde}.efectos.${String(i)}`,
          `${efecto.que} solo usa ${EFECTOS_QUE_MULTIPLICAN.includes(efecto.que) ? 'factorMil' : 'cantidad'}: la otra medida tiene que quedar neutra`,
        );
      }
    });
  }
  return errores;
}
