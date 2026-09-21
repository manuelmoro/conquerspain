// Con que empieza cada casa en su comarca (ficha T-049 §4.5; docs/03 §3.1).
//
// Hasta T-048 toda capital empezaba con las mismas dos granjas, viniera de una vega o de un secano
// de labor 1. Ahora el arranque mira la comarca: primero se come, despues se levanta la primera
// pieza del oficio, y lo que la tierra no da en el anyo se compensa con maravedis para comprarlo.
// Nada se regala saltandose las reglas: cada nivel pasa por `impedimentoDeConstruir`.
import { estacionDe } from '../reglas/calendario.ts';
import { TURNOS_POR_ANYO } from '../reglas/calendario.ts';
import { arranqueDeCasa, modificadoresDeCasa, permisosDeCasa } from '../reglas/casas/index.ts';
import { impedimentoDeConstruir } from '../reglas/obras.ts';
import { explotacionesDe } from '../reglas/produccion.ts';
import type { EstadoComarca } from '../tipos/estado.ts';
import type { ComarcaMundo } from '../tipos/mundo.ts';
import type { Recurso, Recursos } from '../tipos/recursos.ts';

import type { Casa, TablasDeReglas, TipoEdificio } from '../tipos/reglas.ts';
import { multiplicarFactores } from '../utiles/enteros.ts';
import { comparar } from '../utiles/orden.ts';

export interface Arranque {
  readonly edificios: Readonly<Record<string, number>>;
  readonly almacen: Recursos;
  /** Por que se dio cada cosa: va a la cronica del alta y lo leen las pruebas. */
  readonly motivos: readonly string[];
  /** Pan que la tierra no da en el anyo con estos edificios (0 si se alimenta sola). */
  readonly faltaDePanDelAnyo: number;
}

/** El clima neutro: el arranque no puede depender de la suerte del primer anyo. */
const SIN_CLIMA = { anyo: 1, modificadores: [] };

function comarcaConEdificios(
  geografia: ComarcaMundo,
  edificios: Readonly<Record<string, number>>,
): EstadoComarca {
  return {
    id: geografia.id,
    duenyo: null,
    poblacion: geografia.poblacionInicial,
    lealtad: 100,
    edificios,
    aperos: 0,
    fuero: 'ninguno',
    turnoFuero: 0,
    cargaFiscal: 'normal',
    dehesa: false,
    potenciales: geografia.potenciales,
    agotamiento: { monte: 0, piedra: 0, hierro: 0, sal: 0 },
    influencias: {},
    presenciaSeguida: {},
    ultimoRegalo: {},
    exDuenyo: null,
    turnosDesleal: 0,
    turnosSinMantenimiento: 0,
    obrasMayores: [],
    produccionUltimoTurno: {
      pan: 0,
      madera: 0,
      piedra: 0,
      maravedis: 0,
      sal: 0,
      hierro: 0,
      lana: 0,
    },
    turnosDeAbono: 0,
    estiercol: 0,
  };
}

/** Pan que dan estos edificios en un anyo entero, con el clima neutro y sin acontecimientos. */
export function panDelAnyo(
  geografia: ComarcaMundo,
  edificios: Readonly<Record<string, number>>,
  casa: Casa,
  reglas: TablasDeReglas,
): number {
  const modificadores = modificadoresDeCasa(casa, reglas);
  const comarca = comarcaConEdificios(geografia, edificios);
  const enVega = geografia.terreno === 'vega' || geografia.rasgos.includes('vega-fluvial');
  let total = 0;
  for (let turno = 1; turno <= TURNOS_POR_ANYO; turno += 1) {
    const explotaciones = explotacionesDe(
      {
        comarca,
        region: geografia.region,
        estacion: estacionDe(turno, reglas),
        clima: SIN_CLIMA,
        casaMil: modificadores.produccionMil,
        casa: modificadores,
        terreno: geografia.terreno,
        enVega,
      },
      reglas,
    );
    for (const explotacion of explotaciones) {
      if (explotacion.recurso === 'pan') total += explotacion.resultado;
    }
  }
  return total;
}

/** Pan que come la capital en un anyo entero. */
export function panQueComeElAnyo(geografia: ComarcaMundo, reglas: TablasDeReglas): number {
  const porTurno = multiplicarFactores(geografia.poblacionInicial, [
    reglas.poblacion.consumoPorVecinoMil,
  ]);
  return porTurno * TURNOS_POR_ANYO;
}

/** Anyade un nivel del edificio si las reglas lo permiten; dice si pudo. */
function levantar(
  edificios: Record<string, number>,
  edificio: TipoEdificio,
  geografia: ComarcaMundo,
  casa: Casa,
  reglas: TablasDeReglas,
): boolean {
  const impedimento = impedimentoDeConstruir(
    comarcaConEdificios(geografia, edificios),
    edificio,
    [],
    geografia.solares,
    modificadoresDeCasa(casa, reglas),
    reglas,
    permisosDeCasa(casa, reglas),
  );
  if (impedimento !== null) return false;
  edificios[edificio] = (edificios[edificio] ?? 0) + 1;
  return true;
}

/**
 * El arranque de una casa en una comarca. Sin el ajuste (escenarios de hambre) se queda en lo que
 * diga la tabla, igual para todos.
 */
export function arranqueDe(geografia: ComarcaMundo, casa: Casa, reglas: TablasDeReglas): Arranque {
  const tabla = reglas.arranque;
  const almacen: Record<Recurso, number> = { ...tabla.almacen };
  const edificios: Record<string, number> = {};
  const motivos: string[] = [];

  for (const tipo of Object.keys(tabla.edificiosDeOrigen).sort(comparar)) {
    const niveles = tabla.edificiosDeOrigen[tipo as TipoEdificio] ?? 0;
    for (let i = 0; i < niveles; i += 1) {
      if (!levantar(edificios, tipo as TipoEdificio, geografia, casa, reglas)) break;
    }
  }
  if (!tabla.ajuste.activo) {
    return {
      edificios,
      almacen,
      motivos: ['arranque plano: el ajuste a la comarca esta apagado'],
      faltaDePanDelAnyo: 0,
    };
  }

  const ajuste = tabla.ajuste;
  const come = panQueComeElAnyo(geografia, reglas);
  const datosCasa = arranqueDeCasa(casa, reglas);
  // Quien vive de comprar siembra menos: su solar vale mas para su oficio que para una granja.
  const cubrir = multiplicarFactores(come, [
    datosCasa.compraElPan ? ajuste.coberturaDeCompradorMil : ajuste.coberturaMinimaMil,
  ]);

  // 1. Comer primero: granjas hasta cubrir el anyo, o lonjas donde la tierra no da y el mar si.
  const delMar =
    geografia.potenciales.labor <= ajuste.laborDePescador &&
    geografia.potenciales.pesca >= ajuste.pescaDeLonja;
  if (delMar && levantar(edificios, 'lonja', geografia, casa, reglas)) {
    motivos.push('la tierra no da de comer y el mar si: empieza con lonja');
  }
  for (let i = 0; i < ajuste.granjasMaximas; i += 1) {
    if (panDelAnyo(geografia, edificios, casa, reglas) >= cubrir) break;
    const tipo: TipoEdificio = delMar ? 'lonja' : 'granja';
    if (!levantar(edificios, tipo, geografia, casa, reglas)) break;
  }

  // 2. La primera pieza del oficio, si la comarca la admite.
  const oficio: TipoEdificio | null = datosCasa.edificioDeOrigen;
  if (oficio !== null) {
    if (levantar(edificios, oficio, geografia, casa, reglas)) {
      motivos.push(
        `la primera pieza de su oficio: ${reglas.edificios[oficio].nombre.toLowerCase()}`,
      );
    } else {
      motivos.push(`la comarca no admite ${reglas.edificios[oficio].nombre.toLowerCase()}`);
    }
  }

  // 3. Lo que la tierra no da, se compra: maravedis al precio base del pan.
  const produce = panDelAnyo(geografia, edificios, casa, reglas);
  const falta = Math.max(0, come - produce);
  if (falta > 0) {
    const cuesta = multiplicarFactores(falta, [reglas.recursos.pan.precioBaseMil]);
    const dinero = Math.min(ajuste.maravedisMaximos, cuesta);
    almacen.maravedis += dinero;
    motivos.push(
      datosCasa.compraElPan
        ? `su casa vive de comprar el pan: ${String(dinero)} maravedis para el primer anyo`
        : `le faltan ${String(falta)} de pan al anyo: ${String(dinero)} maravedis para comprarlo`,
    );
  } else {
    motivos.push('su tierra le da de comer el anyo entero');
  }
  const lonjas = edificios['lonja'] ?? 0;
  if (lonjas > 0) {
    almacen.sal += lonjas * ajuste.salPorLonja;
    motivos.push(`sal para la salazon de ${String(lonjas)} lonja(s)`);
  }
  return { edificios, almacen, motivos, faltaDePanDelAnyo: falta };
}
