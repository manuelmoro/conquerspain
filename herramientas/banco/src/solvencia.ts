// La solvencia de los planes de los robots (ficha T-050 §4.1.6): que el plan de la capital quepa en
// sus solares desde el arranque de verdad, que cada edificio que consume algo tenga de donde sacarlo
// y que la primera obra mayor tenga de donde sacar sus materiales. Un plan que no cabe no es una
// casa desequilibrada, es un robot mal escrito, y T-047 no debe compensarlo con tablas.
import {
  costeDeObraMayor,
  impedimentoDeConstruir,
  modificadoresDelJugador,
  permisosDelJugador,
} from '@conquer/nucleo';
import type {
  Casa,
  ComarcaMundo,
  IdJugador,
  Recurso,
  TablasDeReglas,
  TipoEdificio,
} from '@conquer/nucleo';

import { altaDelBanco } from './partida.ts';
import type { Perfil } from './robots/impulsos.ts';
import { LO_QUE_COMPRA_EL_TRATANTE } from './robots/impulsos.ts';
import { ESTRATEGIAS } from './robots/index.ts';

/** Lo que el plan de la capital deja levantado, y lo que no le cupo. */
export interface PlanLevantado {
  readonly edificios: Readonly<Record<string, number>>;
  readonly problemas: readonly string[];
}

/** Levanta el plan de la capital, en su orden, sobre la comarca tal como la deja el arranque. */
function levantarPlan(
  casa: Casa,
  comarca: ComarcaMundo,
  reglas: TablasDeReglas,
  perfil: Perfil,
): PlanLevantado {
  const alta = altaDelBanco({
    semilla: `solvencia-${comarca.id}`,
    casas: [casa],
    reglas,
    recortar: false,
    origenesFijos: { [casa]: comarca.id },
  });
  const jugador = alta.estado.jugadores[casa as string as IdJugador];
  const sede = alta.estado.comarcas[comarca.id];
  if (jugador === undefined || sede === undefined) {
    throw new Error(`La partida de ${casa} en ${comarca.id} no tiene su jugador o su capital.`);
  }
  const modificadores = modificadoresDelJugador(jugador, reglas);
  const permisos = permisosDelJugador(jugador, reglas);
  const edificios: Record<string, number> = { ...sede.edificios };
  const problemas: string[] = [];
  for (const [edificio, nivel] of perfil.capital) {
    while ((edificios[edificio] ?? 0) < nivel) {
      const impedimento = impedimentoDeConstruir(
        { ...sede, edificios },
        edificio,
        [],
        comarca.solares,
        modificadores,
        reglas,
        permisos,
      );
      if (impedimento === null) {
        edificios[edificio] = (edificios[edificio] ?? 0) + 1;
        continue;
      }
      // Lo que la tierra no da (potencial) o la casa no puede (permiso, nivel) el robot lo salta,
      // como haria un jugador. Que un esencial no quepa o le falte lo previo es un plan mal
      // ordenado; lo demas se pide solo si cabe.
      // Esencial es tener el edificio; los niveles de mas son crecimiento.
      const esencial = perfil.esenciales.includes(edificio) && (edificios[edificio] ?? 0) === 0;
      if (esencial && (impedimento === 'sin-solar' || impedimento === 'falta-edificio-requerido')) {
        problemas.push(
          `${edificio} ${String(nivel)}: ${impedimento}, con ${JSON.stringify(edificios)} en ${String(comarca.solares)} solares`,
        );
      }
      break;
    }
  }
  return { edificios, problemas };
}

/** Recursos que produce algun edificio de la lista. */
function producidos(
  edificios: Readonly<Record<string, number>>,
  reglas: TablasDeReglas,
): Set<Recurso> {
  const dan = new Set<Recurso>();
  for (const edificio of Object.keys(edificios) as TipoEdificio[]) {
    for (const [recurso, cantidad] of Object.entries(reglas.edificios[edificio].produccion)) {
      if (cantidad > 0) dan.add(recurso as Recurso);
    }
  }
  return dan;
}

/** Los problemas del plan de una casa en una comarca de origen; vacio si es solvente. */
export function problemasDelPlan(
  casa: Casa,
  comarca: ComarcaMundo,
  reglas: TablasDeReglas,
  perfil: Perfil = ESTRATEGIAS[casa].perfil,
): string[] {
  const plan = levantarPlan(casa, comarca, reglas, perfil);
  const problemas = [...plan.problemas];
  const dan = producidos(plan.edificios, reglas);
  const compra =
    (plan.edificios['mercado'] ?? 0) > 0 && perfil.recuas.includes('tratar')
      ? new Set<Recurso>(LO_QUE_COMPRA_EL_TRATANTE)
      : new Set<Recurso>();
  for (const edificio of Object.keys(plan.edificios) as TipoEdificio[]) {
    for (const recurso of Object.keys(reglas.edificios[edificio].consumo) as Recurso[]) {
      if (!dan.has(recurso) && !compra.has(recurso)) {
        problemas.push(`${edificio} consume ${recurso} y ni lo produce el plan ni lo compra`);
      }
    }
  }
  const obra = perfil.obrasMayores[0];
  if (obra !== undefined) {
    const coste = costeDeObraMayor(obra, reglas.casas[casa].modificadores, reglas);
    for (const recurso of ['madera', 'piedra'] as const) {
      if (coste[recurso] > 0 && !dan.has(recurso) && !compra.has(recurso)) {
        problemas.push(`${obra} pide ${recurso} y ni lo produce el plan ni lo compra`);
      }
    }
  }
  return problemas;
}
