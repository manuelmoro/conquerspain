// El recorte del mapa (ficha T-049 §4.2 y §4.3).
//
// Una partida no se juega en la peninsula entera: se recorta un trozo conexo, del tamanyo de los
// que juegan, que conserva los identificadores, la geografia, los tramos, las canyadas y las ferias
// del mundo original. El recorte no se elige mirando por donde anduvieron unos robots: se hace
// antes de jugar, con la semilla, y tiene que traer sal, hierro, pan, comercio y pastos.
import { origenesPosibles } from '../reglas/casas/origenes.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { Camino, ComarcaMundo, Mundo, Rasgo } from '../tipos/mundo.ts';
import type { Casa, DatosRecorte, TablasDeReglas } from '../tipos/reglas.ts';
import { azarDe } from '../utiles/azar.ts';
import { multiplicarFactores } from '../utiles/enteros.ts';
import { comparar, idsEnOrden } from '../utiles/orden.ts';
import { validarMundo } from '../validacion/validarMundo.ts';
import type { ErrorValidacion, Resultado } from '../validacion/validador.ts';
import { invalidos, valido } from '../validacion/validador.ts';
import { caminoMasCorto, indiceDeCaminos, jornadasDesde } from './distancias.ts';
import type { IndiceDeCaminos } from './distancias.ts';

/** Lo que el recorte tiene que traer dentro, ademas de ser conexo. */
export interface Requisito {
  readonly nombre: string;
  readonly cumple: (comarca: ComarcaMundo) => boolean;
  /** Comarcas que tienen que cumplirlo. */
  readonly cuantas: number;
}

/**
 * Los requisitos que salen de las tablas y de las casas que juegan. Los pastos de ida y vuelta se
 * piden cuando alguna casa participante busca su origen por el pasto: sin los dos, no hay
 * trashumancia que valga.
 */
export function requisitosDe(
  reglas: TablasDeReglas,
  casas: readonly Casa[],
  recorte: DatosRecorte,
): Requisito[] {
  const tieneRasgo =
    (rasgo: Rasgo) =>
    (comarca: ComarcaMundo): boolean =>
      comarca.rasgos.includes(rasgo);
  const requisitos: Requisito[] = [
    { nombre: 'sal', cumple: (c) => c.potenciales.sal >= recorte.salMinima, cuantas: 1 },
    { nombre: 'hierro', cumple: (c) => c.potenciales.hierro >= recorte.hierroMinimo, cuantas: 1 },
    {
      nombre: 'tierra de pan',
      cumple: (c) => c.potenciales.labor >= recorte.laborAlta,
      cuantas: recorte.laborAltaMinima,
    },
    { nombre: 'feria', cumple: (c) => c.ferias.length > 0, cuantas: recorte.feriasMinimas },
  ];
  const conPasto = casas.some((casa) =>
    reglas.casas[casa].origenes.some((criterio) => (criterio.potenciales.pasto ?? 0) > 0),
  );
  if (conPasto) {
    requisitos.push(
      { nombre: 'pasto de verano', cumple: tieneRasgo('pasto-de-verano'), cuantas: 1 },
      { nombre: 'pasto de invierno', cumple: tieneRasgo('pasto-de-invierno'), cuantas: 1 },
    );
  }
  return requisitos;
}

/** Lo que le falta al mundo para servir de recorte; vacio si no le falta nada. */
export function faltasDelRecorte(
  mundo: Mundo,
  reglas: TablasDeReglas,
  casas: readonly Casa[],
  recorte: DatosRecorte,
): string[] {
  const comarcas = Object.values(mundo.comarcas);
  const faltas: string[] = [];
  for (const requisito of requisitosDe(reglas, casas, recorte)) {
    const hay = comarcas.filter((comarca) => requisito.cumple(comarca)).length;
    if (hay < requisito.cuantas) {
      faltas.push(
        `${requisito.nombre}: hacen falta ${String(requisito.cuantas)} comarcas y hay ${String(hay)}`,
      );
    }
  }
  // Basta con que cada casa tenga donde empezar: que le quepan las tres tarjetas lo comprueba el
  // sorteo de ofertas, que ademas tiene en cuenta la separacion entre capitales.
  for (const casa of [...new Set(casas)].sort(comparar)) {
    if (origenesPosibles(mundo, casa, reglas).length === 0) {
      faltas.push(`${reglas.casas[casa].nombre} no tiene ningun origen posible en el recorte`);
    }
  }
  return faltas;
}

/** El mundo con solo estas comarcas: mismos identificadores, misma geografia, tramos de dentro. */
export function mundoCon(mundo: Mundo, dentro: ReadonlySet<string>): Mundo {
  const comarcas: Record<string, ComarcaMundo> = {};
  const vecinos: Record<string, IdComarca[]> = {};
  for (const id of idsEnOrden(mundo.comarcas)) {
    if (!dentro.has(id)) continue;
    const comarca = mundo.comarcas[id];
    if (comarca === undefined) continue;
    comarcas[id] = comarca;
    vecinos[id] = (mundo.vecinos[id] ?? []).filter((vecina) => dentro.has(vecina));
  }
  const caminos: Camino[] = mundo.caminos.filter(
    (camino) => dentro.has(camino.desde) && dentro.has(camino.hasta),
  );
  return { version: mundo.version, comarcas, caminos, vecinos };
}

/** Las comarcas del recorte: el esqueleto de anclas y despues las mas cercanas al centro. */
function crecerDesde(
  mundo: Mundo,
  centro: IdComarca,
  objetivo: number,
  requisitos: readonly Requisito[],
  indice: IndiceDeCaminos,
): Set<string> {
  const distancia = jornadasDesde(mundo, centro, indice);
  const dentro = new Set<string>([centro]);
  const cerca = (candidatas: readonly ComarcaMundo[]): ComarcaMundo | undefined =>
    [...candidatas].sort(
      (a, b) =>
        (distancia.get(a.id) ?? Number.POSITIVE_INFINITY) -
          (distancia.get(b.id) ?? Number.POSITIVE_INFINITY) || comparar(a.id, b.id),
    )[0];
  const todas = idsEnOrden(mundo.comarcas)
    .map((id) => mundo.comarcas[id])
    .filter((comarca): comarca is ComarcaMundo => comarca !== undefined);

  // Las anclas: lo que el recorte tiene que traer, lo mas cerca posible del centro.
  for (const requisito of requisitos) {
    const candidatas = todas.filter((comarca) => requisito.cumple(comarca));
    for (let i = 0; i < requisito.cuantas; i += 1) {
      const ancla = cerca(candidatas.filter((comarca) => !dentro.has(comarca.id)));
      if (ancla === undefined) break;
      for (const paso of caminoMasCorto(mundo, centro, ancla.id, indice)) dentro.add(paso);
    }
  }
  // Y despues, lo mas cercano al centro hasta llegar al tamanyo: el prefijo de Dijkstra es conexo.
  const porCercania = [...distancia.entries()].sort((a, b) => a[1] - b[1] || comparar(a[0], b[0]));
  for (const [id] of porCercania) {
    if (dentro.size >= objetivo) break;
    dentro.add(id);
  }
  return dentro;
}

export interface ResultadoDeRecorte {
  readonly mundo: Mundo;
  /** Intentos que hicieron falta (1 es a la primera) y tamanyo final. */
  readonly intentos: number;
  readonly comarcas: number;
}

/**
 * Recorta el mundo para estas casas. Si un intento no cumple los requisitos, se prueba con otro
 * centro y un objetivo mayor, hasta `intentosMaximos`; despues se rinde con un error que dice que
 * falto. Nunca hay bucle sin limite ni recorte que incumpla en silencio.
 */
export function recortarMundo(
  mundo: Mundo,
  reglas: TablasDeReglas,
  semilla: string,
  casas: readonly Casa[],
  /** Comprueba ademas que quepan las capitales; lo usa `prepararPartida`. */
  cabe: (recortado: Mundo) => string[] = () => [],
): Resultado<ResultadoDeRecorte> {
  const recorte = reglas.arranque.recorte;
  const total = Object.keys(mundo.comarcas).length;
  const indice = indiceDeCaminos(mundo);
  const requisitos = requisitosDe(reglas, casas, recorte);
  // El centro se busca donde pueda empezar una de las casas que juegan, empezando por la que menos
  // sitio tiene: recortar lejos de los seis origenes de los canteros seria dejarlos fuera.
  const porEscasez = [...new Set(casas)]
    .sort(comparar)
    .map((casa) => ({ casa, suyos: origenesPosibles(mundo, casa, reglas) }))
    .sort((a, b) => a.suyos.length - b.suyos.length);
  const todosLosOrigenes = idsEnOrden(mundo.comarcas)
    .map((id) => mundo.comarcas[id])
    .filter((comarca): comarca is ComarcaMundo => comarca?.esOrigen === true)
    .map((comarca) => comarca.id);
  const base = Math.max(recorte.minimoDeComarcas, recorte.comarcasPorJugador * casas.length);
  const ultimas: string[] = [];

  for (let intento = 0; intento < recorte.intentosMaximos; intento += 1) {
    const azar = azarDe(semilla, 0, 'recorte', `intento-${String(intento)}`);
    const suyos = porEscasez[intento % Math.max(1, porEscasez.length)]?.suyos ?? [];
    const candidatos = suyos.length > 0 ? suyos.map((comarca) => comarca.id) : todosLosOrigenes;
    if (candidatos.length === 0) {
      return invalidos([{ ruta: 'mundo', mensaje: 'el mundo no tiene ninguna comarca de origen' }]);
    }
    const centro = azar.elegir(candidatos);
    let objetivo = base;
    for (let i = 0; i < intento; i += 1) {
      objetivo = multiplicarFactores(objetivo, [recorte.crecimientoPorIntentoMil]);
    }
    const dentro = crecerDesde(mundo, centro, Math.min(total, objetivo), requisitos, indice);
    const recortado = mundoCon(mundo, dentro);
    const valida = validarMundo(recortado);
    if (!valida.ok) return valida;
    const faltas = [...faltasDelRecorte(recortado, reglas, casas, recorte), ...cabe(recortado)];
    if (faltas.length === 0) {
      return valido({ mundo: recortado, intentos: intento + 1, comarcas: dentro.size });
    }
    ultimas.length = 0;
    ultimas.push(...faltas);
  }
  const errores: ErrorValidacion[] = ultimas.map((falta) => ({ ruta: 'recorte', mensaje: falta }));
  return invalidos([
    ...errores,
    {
      ruta: 'recorte',
      mensaje: `no se pudo recortar un mapa para ${String(casas.length)} casas en ${String(recorte.intentosMaximos)} intentos: juega con menos casas o prepara la partida sin recortar`,
    },
  ]);
}
