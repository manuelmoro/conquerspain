// El sorteo de origen (docs/04-casas-y-tradiciones.md §4.2; docs/05-geografia.md §5.7).
//
// Se ofrecen tres comarcas de origen filtradas por lo que la casa necesita, de perfiles distintos y
// con azar reproducible: la misma partida y la misma casa dan siempre las mismas tres.
import type { ComarcaMundo, Mundo, Potencial } from '../../tipos/mundo.ts';
import { POTENCIALES } from '../../tipos/mundo.ts';
import type { IdComarca } from '../../tipos/ids.ts';
import type { Casa, CriterioDeOrigen, TablasDeReglas } from '../../tipos/reglas.ts';
import { azarDe } from '../../utiles/azar.ts';
import { idsEnOrden } from '../../utiles/orden.ts';

/** La comarca cumple un criterio: todo lo que pide, y alguno de los rasgos y terrenos si los pide. */
function cumple(criterio: CriterioDeOrigen, comarca: ComarcaMundo, mundo: Mundo): boolean {
  const potenciales = POTENCIALES.every(
    (potencial) => comarca.potenciales[potencial] >= (criterio.potenciales[potencial] ?? 0),
  );
  const rasgos =
    criterio.rasgos.length === 0 || criterio.rasgos.some((rasgo) => comarca.rasgos.includes(rasgo));
  const terrenos = criterio.terrenos.length === 0 || criterio.terrenos.includes(comarca.terreno);
  const pedida = criterio.vecinaConPotencial;
  const vecina =
    pedida === null ||
    (mundo.vecinos[comarca.id] ?? []).some(
      (id) => (mundo.comarcas[id]?.potenciales[pedida.potencial] ?? 0) >= pedida.nivel,
    );
  return potenciales && rasgos && terrenos && vecina;
}

/** Comarcas de origen que sirven a la casa, en orden de identificador. */
export function origenesPosibles(mundo: Mundo, casa: Casa, reglas: TablasDeReglas): ComarcaMundo[] {
  const criterios = reglas.casas[casa].origenes;
  return idsEnOrden(mundo.comarcas)
    .map((id) => mundo.comarcas[id])
    .filter((comarca): comarca is ComarcaMundo => comarca !== undefined && comarca.esOrigen)
    .filter((comarca) => criterios.some((criterio) => cumple(criterio, comarca, mundo)));
}

/** El potencial que mas destaca de la comarca (a igualdad, el primero de la lista): su perfil. */
export function perfilDe(comarca: ComarcaMundo): Potencial {
  let mejor: Potencial = POTENCIALES[0];
  for (const potencial of POTENCIALES) {
    if (comarca.potenciales[potencial] > comarca.potenciales[mejor]) mejor = potencial;
  }
  return mejor;
}

/**
 * Tres origenes de perfiles distintos para la casa. Se eligen primero de perfil distinto, si no
 * bastan de otra region y, si tampoco, las que haya; nunca se repite una comarca.
 */
export function sortearOrigenes(
  mundo: Mundo,
  casa: Casa,
  semilla: string,
  reglas: TablasDeReglas,
  cuantos = 3,
): IdComarca[] {
  const posibles = origenesPosibles(mundo, casa, reglas);
  const barajadas = azarDe(semilla, 0, 'origen', casa).barajar(posibles);
  const elegidas: ComarcaMundo[] = [];
  const cabe = (comarca: ComarcaMundo): boolean => !elegidas.includes(comarca);
  const pasadas: ((candidata: ComarcaMundo) => boolean)[] = [
    (candidata) => elegidas.every((otra) => perfilDe(otra) !== perfilDe(candidata)),
    (candidata) => elegidas.every((otra) => otra.region !== candidata.region),
    () => true,
  ];
  for (const admite of pasadas) {
    for (const candidata of barajadas) {
      if (elegidas.length >= cuantos) break;
      if (cabe(candidata) && admite(candidata)) elegidas.push(candidata);
    }
  }
  return elegidas.map((comarca) => comarca.id);
}
