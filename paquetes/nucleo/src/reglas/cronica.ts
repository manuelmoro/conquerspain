// La cronica de un jugador (docs/02-diseno-nucleo.md §2.7; ficha T-044 §4.4 y §4.5).
//
// Se compone con los sucesos del turno entero y el estado al acabarlo, fuera del estado: no cambia
// nada. Cada jugador lee sus sucesos y los publicos de comarcas que conoce; nunca los de otro. Los
// huecos de las plantillas se rellenan con nombres, nunca con identificadores internos, y lo que
// exige una decision va primero.
import {
  MOTIVOS,
  NOMBRES_DE_OBRA,
  NOMBRES_DE_ORDEN,
  NOMBRES_DE_RECURSO,
  NOMBRES_DE_REGION,
  PALABRAS,
  PLANTILLAS,
} from '../datos/plantillas.ts';
import type { Cronica, EntradaDeCronica, Plantilla, Suceso } from '../tipos/cronica.ts';
import { SECCIONES_DE_CRONICA } from '../tipos/cronica.ts';
import type { EstadoJugador, EstadoPartida } from '../tipos/estado.ts';
import type { IdJugador } from '../tipos/ids.ts';
import type { Mundo } from '../tipos/mundo.ts';
import type { TablasDeReglas } from '../tipos/reglas.ts';
import { esHito, esTipoDeAcontecimiento } from '../tipos/reglas.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import { anyoDe, calendarioDe } from './calendario.ts';

export interface FuentesDeCronica {
  /** El estado al acabar el turno. */
  readonly estado: EstadoPartida;
  readonly sucesos: readonly Suceso[];
  /** El turno que se resolvio. */
  readonly turno: number;
  readonly mundo: Mundo;
  readonly reglas: TablasDeReglas;
}

// ——— Formatos ———————————————————————————————————————————————————————————————

/** «1 234», «12 345»: la RAE agrupa de tres en tres desde los cinco digitos. */
export function formatoNumero(valor: number): string {
  const signo = valor < 0 ? '-' : '';
  const cifras = String(Math.abs(valor));
  if (cifras.length < 5) return signo + cifras;
  const grupos: string[] = [];
  for (let fin = cifras.length; fin > 0; fin -= 3)
    grupos.unshift(cifras.slice(Math.max(0, fin - 3), fin));
  return signo + grupos.join(' ');
}

/** Milesimas como numero con coma: 43250 → «43,25». */
function formatoMil(valor: number): string {
  const entero = Math.trunc(valor / 1000);
  const resto = Math.abs(valor % 1000);
  if (resto === 0) return formatoNumero(entero);
  const decimales = String(resto).padStart(3, '0').replace(/0+$/, '');
  return `${formatoNumero(entero)},${decimales}`;
}

function lista(nombres: readonly string[]): string {
  if (nombres.length <= 1) return nombres.join('');
  return `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1) ?? ''}`;
}

/** La fecha de un turno como la dice el cronista: «la segunda quincena de mayo del año 3». */
export function fechaDe(turno: number, fuentes: FuentesDeCronica): string {
  const nombre = calendarioDe(turno, fuentes.mundo, fuentes.reglas).nombre;
  return `${nombre} del año ${String(anyoDe(turno))}`;
}

// ——— Nombres ———————————————————————————————————————————————————————————————

function nombreDeComarca(id: string, fuentes: FuentesDeCronica): string {
  return fuentes.mundo.comarcas[id]?.nombre ?? id;
}

function nombreDeJugador(id: string, fuentes: FuentesDeCronica): string {
  return fuentes.estado.jugadores[id]?.nombre ?? id;
}

/** «Recua de Vinuesa» → «la recua de Vinuesa»; un nombre propio cualquiera → «la recua Tal». */
function conArticulo(nombre: string, clase: 'recua' | 'rebaño'): string {
  const articulo = clase === 'recua' ? 'la' : 'el';
  const prefijo = `${clase.charAt(0).toUpperCase()}${clase.slice(1)} `;
  return nombre.startsWith(prefijo)
    ? `${articulo} ${clase} ${nombre.slice(prefijo.length)}`
    : `${articulo} ${clase} ${nombre}`;
}

function nombreDePlaza(id: string, fuentes: FuentesDeCronica): string {
  if (id.startsWith('local-')) {
    return `el mercado de ${nombreDeComarca(id.slice('local-'.length), fuentes)}`;
  }
  const feria = id.slice('feria-'.length);
  for (const comarca of Object.values(fuentes.mundo.comarcas)) {
    const encontrada = comarca.ferias.find((f) => f.id === feria);
    if (encontrada !== undefined) return `la ${encontrada.nombre}`;
  }
  return id;
}

/** Un motivo dicho como lo diria el cronista; si no esta en la tabla, sus palabras sin guiones. */
function motivo(
  codigo: string,
  lector: EstadoJugador | undefined,
  fuentes: FuentesDeCronica,
): string {
  const texto = MOTIVOS[codigo] ?? codigo.replaceAll('-', ' ');
  if (!texto.includes('{limite}') || lector === undefined) return texto;
  const limite = fuentes.reglas.casas[lector.casa].limite;
  return texto.replace(
    '{limite}',
    limite.charAt(0).toLowerCase() + limite.slice(1).replace(/\.$/, ''),
  );
}

function nombreEnSuceso(suceso: Suceso, porDefecto: string): string {
  const nombre = suceso.datos['nombre'];
  return typeof nombre === 'string' ? nombre : porDefecto;
}

/** El valor de un hueco ya traducido, o null si el suceso no lo trae. */
function valorDe(
  campo: string,
  formato: string | undefined,
  suceso: Suceso,
  lector: EstadoJugador | undefined,
  fuentes: FuentesDeCronica,
): string | null {
  const dato = suceso.datos[campo];
  if (campo === 'comarca' && dato === undefined) {
    return suceso.comarca === null ? null : nombreDeComarca(suceso.comarca, fuentes);
  }
  if (campo === 'jugador' && dato === undefined) {
    return suceso.jugador === null ? null : nombreDeJugador(suceso.jugador, fuentes);
  }
  if (campo === 'respuestas') {
    const tipo = String(suceso.datos['tipo']);
    if (!esTipoDeAcontecimiento(tipo)) return null;
    return lista(
      fuentes.reglas.acontecimientos.catalogo[tipo].respuestas.map((r) => r.toLowerCase()),
    );
  }
  if (dato === undefined) return null;

  if (typeof dato === 'number') {
    switch (formato) {
      case 'mil':
        return formatoMil(dato);
      case 'pct':
        return `${String(Math.floor(dato / 10))} %`;
      case 'abs':
        return formatoNumero(Math.abs(dato));
      case 'fecha':
        return calendarioDe(dato, fuentes.mundo, fuentes.reglas).nombre;
      default:
        return formatoNumero(dato);
    }
  }

  const palabras = PALABRAS[formato === undefined ? campo : `${campo}:${formato}`];
  if (palabras !== undefined) return palabras[dato] ?? dato;
  switch (campo) {
    case 'comarca':
    case 'desde':
    case 'hasta':
    case 'sobre':
    case 'destino':
      return nombreDeComarca(dato, fuentes);
    case 'ganador':
    case 'de':
      return nombreDeJugador(dato, fuentes);
    // Si ya no existe (disuelta, perdida), el suceso trae su nombre.
    case 'recua':
      return conArticulo(
        fuentes.estado.recuas[dato]?.nombre ?? nombreEnSuceso(suceso, dato),
        'recua',
      );
    case 'rebanyo':
      return conArticulo(
        fuentes.estado.rebanyos[dato]?.nombre ?? nombreEnSuceso(suceso, dato),
        'rebaño',
      );
    case 'mercado':
      return nombreDePlaza(dato, fuentes);
    case 'edificio':
    case 'que':
    case 'obra':
      return NOMBRES_DE_OBRA[dato] ?? dato;
    case 'recurso':
    case 'falta':
      return NOMBRES_DE_RECURSO[dato] ?? dato;
    case 'region':
      return NOMBRES_DE_REGION[dato] ?? dato;
    case 'regiones':
      return lista(dato.split(',').map((r) => NOMBRES_DE_REGION[r] ?? r));
    case 'hito':
      return esHito(dato) ? fuentes.reglas.hitos[dato].nombre : dato;
    case 'tradicion':
      return fuentes.reglas.tradiciones[dato]?.nombre ?? dato;
    case 'opciones':
      return lista(dato.split(',').map((t) => `«${fuentes.reglas.tradiciones[t]?.nombre ?? t}»`));
    case 'tipo':
      return esTipoDeAcontecimiento(dato)
        ? fuentes.reglas.acontecimientos.catalogo[dato].nombre.toLowerCase()
        : dato;
    case 'clase':
      return NOMBRES_DE_ORDEN[dato] ?? dato;
    case 'motivo':
      return motivo(dato, lector, fuentes);
    case 'cola': {
      const [clase, id = ''] = dato.split(':');
      return clase === 'recua'
        ? `la cola de ${conArticulo(fuentes.estado.recuas[id]?.nombre ?? id, 'recua')}`
        : `la cola de obras de ${nombreDeComarca(id, fuentes)}`;
    }
    default:
      return dato;
  }
}

export interface TextoCompuesto {
  readonly texto: string;
  /** Huecos que el suceso no traia: debe estar vacio (lo vigila un test). */
  readonly faltan: readonly string[];
}

/** Los huecos de un trozo de plantilla, y si alguno era una cifra a cero. */
function rellenarTrozo(
  trozo: string,
  suceso: Suceso,
  lector: EstadoJugador | undefined,
  fuentes: FuentesDeCronica,
  faltan: string[],
): { readonly texto: string; readonly hayCero: boolean } {
  let hayCero = false;
  const texto = trozo.replace(
    /\{([a-zA-Z]+)(?::([a-z]+))?\}/g,
    (hueco, campo: string, formato?: string) => {
      if (suceso.datos[campo] === 0) hayCero = true;
      const valor = valorDe(campo, formato, suceso, lector, fuentes);
      if (valor === null) {
        faltan.push(campo);
        return hueco;
      }
      return valor;
    },
  );
  return { texto, hayCero };
}

/**
 * Rellena una plantilla. Lo que va entre corchetes es opcional: se calla si alguna de sus cifras es
 * cero («[ y {sal} de sal]»), para no contar lo que no paso.
 */
export function rellenar(
  plantilla: string,
  suceso: Suceso,
  lector: EstadoJugador | undefined,
  fuentes: FuentesDeCronica,
): TextoCompuesto {
  const faltan: string[] = [];
  const conOpcionales = plantilla.replace(/\[([^\]]*)\]/g, (_segmento, dentro: string) => {
    const trozo = rellenarTrozo(dentro, suceso, lector, fuentes, faltan);
    return trozo.hayCero ? '' : trozo.texto;
  });
  const texto = rellenarTrozo(conOpcionales, suceso, lector, fuentes, faltan).texto;
  // La primera letra de la frase, en mayuscula aunque empiece por un nombre en minuscula.
  return { texto: texto.charAt(0).toUpperCase() + texto.slice(1), faltan };
}

// ——— Que suceso ve cada jugador y como ——————————————————————————————————————

/** La plantilla de un suceso, `null` si no se cuenta suelto, `undefined` si no hay ninguna. */
export function plantillaDe(suceso: Suceso): Plantilla | null | undefined {
  const entrada = PLANTILLAS[suceso.tipo];
  if (entrada === undefined || entrada === null) return entrada;
  if ('segun' in entrada) return entrada.casos[String(suceso.datos[entrada.segun])] ?? null;
  return entrada;
}

function conoce(lector: EstadoJugador, comarca: string): boolean {
  return (lector.conocimiento[comarca]?.nivel ?? 'desconocida') !== 'desconocida';
}

/** La entrada que un suceso deja en la cronica de un jugador, o null si no le toca verla. */
export function entradaDe(
  suceso: Suceso,
  lector: EstadoJugador,
  fuentes: FuentesDeCronica,
): (EntradaDeCronica & TextoCompuesto) | null {
  const plantilla = plantillaDe(suceso);
  if (plantilla === null || plantilla === undefined) return null;
  const suyo = suceso.jugador === lector.id;
  if (!suyo) {
    if (!plantilla.publica) return null;
    if (suceso.comarca !== null && !conoce(lector, suceso.comarca)) return null;
  }
  const texto =
    !suyo && suceso.jugador !== null && plantilla.textoAjeno !== null
      ? plantilla.textoAjeno
      : plantilla.texto;
  const compuesto = rellenar(texto, suceso, lector, fuentes);
  // Una plantilla que es toda opcional y se calla no deja entrada.
  if (compuesto.texto.trim() === '') return null;
  // Lo que hizo el mayordomo va marcado como suyo (ficha T-045 §4.3).
  const marcado =
    suceso.datos['delMayordomo'] === 1 && suceso.tipo !== 'mayordomo.ordena'
      ? `Por orden del mayordomo: ${compuesto.texto.charAt(0).toLowerCase()}${compuesto.texto.slice(1)}`
      : compuesto.texto;
  return {
    seccion: plantilla.seccion,
    texto: marcado,
    faltan: compuesto.faltan,
    comarca: suceso.comarca,
    accionSugerida: plantilla.accion,
  };
}

// ——— Lo que se compone aparte ———————————————————————————————————————————————

/** Que entro y salio del almacen y para cuanto da el pan (docs/02 §2.7, punto 1). */
function resumenEconomico(lector: EstadoJugador, fuentes: FuentesDeCronica): EntradaDeCronica {
  const entradas = new Map<string, number>();
  const salidas = new Map<string, number>();
  let comen = 0;
  for (const suceso of fuentes.sucesos) {
    if (suceso.jugador !== lector.id) continue;
    if (suceso.tipo === 'almacen.cambio') {
      const recurso = String(suceso.datos['recurso']);
      const delta = Number(suceso.datos['delta']);
      const donde = delta >= 0 ? entradas : salidas;
      donde.set(recurso, (donde.get(recurso) ?? 0) + Math.abs(delta));
    } else if (suceso.tipo === 'consumo.pan') {
      comen += Number(suceso.datos['poblacion']) + Number(suceso.datos['cuadrillas']);
    }
  }
  const cuanto = (mapa: Map<string, number>): string[] =>
    RECURSOS.filter((r) => (mapa.get(r) ?? 0) > 0).map((r) =>
      r === 'maravedis'
        ? `${formatoNumero(mapa.get(r) ?? 0)} maravedís`
        : `${formatoNumero(mapa.get(r) ?? 0)} de ${NOMBRES_DE_RECURSO[r] ?? r}`,
    );
  const partes: string[] = [];
  if (entradas.size > 0) partes.push(`Entraron ${lista(cuanto(entradas))}`);
  if (salidas.size > 0) partes.push(`salieron ${lista(cuanto(salidas))}`);
  const movimiento = partes.length === 0 ? 'El almacén no se movió' : partes.join('; ');
  const pan = lector.almacen.pan;
  const dura =
    comen > 0
      ? `, que dan para ${formatoNumero(Math.floor(pan / comen))} turnos al paso de ahora`
      : '';
  const texto = `${movimiento.charAt(0).toUpperCase()}${movimiento.slice(1)}. Quedan ${formatoNumero(pan)} de pan${dura}.`;
  return { seccion: 'economia', texto, comarca: null, accionSugerida: null };
}

/** La clasificacion publica del turno, en una linea. */
function lineaDeClasificacion(fuentes: FuentesDeCronica): EntradaDeCronica | null {
  const puestos = fuentes.estado.clasificacion;
  if (puestos.length === 0) return null;
  const partes = puestos.map((p) => {
    const cambio =
      p.puestoAnterior === null || p.puestoAnterior === p.puesto
        ? ''
        : p.puestoAnterior > p.puesto
          ? ', sube'
          : ', baja';
    return `${String(p.puesto)}.º ${nombreDeJugador(p.jugador, fuentes)} (${formatoNumero(p.prestigio)}${cambio})`;
  });
  return {
    seccion: 'hitos',
    texto: `Clasificación: ${partes.join('; ')}.`,
    comarca: null,
    accionSugerida: null,
  };
}

// ——— La cronica ————————————————————————————————————————————————————————————

/**
 * La cronica de un jugador: primero lo que exige decision (avisos), despues lo suyo, la economia,
 * los rumores y los hitos. Dentro de cada seccion, en el orden en que paso.
 */
export function componerCronica(jugador: IdJugador, fuentes: FuentesDeCronica): Cronica {
  const lector = fuentes.estado.jugadores[jugador];
  const fecha = fechaDe(fuentes.turno, fuentes);
  const cabecera = fecha.charAt(0).toUpperCase() + fecha.slice(1);
  if (lector === undefined) return { turno: fuentes.turno, fecha: cabecera, jugador, entradas: [] };

  const sueltas: EntradaDeCronica[] = [];
  for (const suceso of fuentes.sucesos) {
    const entrada = entradaDe(suceso, lector, fuentes);
    if (entrada !== null) {
      sueltas.push({
        seccion: entrada.seccion,
        texto: entrada.texto,
        comarca: entrada.comarca,
        accionSugerida: entrada.accionSugerida,
      });
    }
  }
  const clasificacion = lineaDeClasificacion(fuentes);
  const todas = [
    resumenEconomico(lector, fuentes),
    ...sueltas,
    ...(clasificacion === null ? [] : [clasificacion]),
  ];
  const puesto = (e: EntradaDeCronica): number => SECCIONES_DE_CRONICA.indexOf(e.seccion);
  // `sort` es estable: dentro de una seccion se conserva el orden en que paso.
  const entradas = [...todas].sort((a, b) => puesto(a) - puesto(b));
  return { turno: fuentes.turno, fecha: cabecera, jugador, entradas };
}
