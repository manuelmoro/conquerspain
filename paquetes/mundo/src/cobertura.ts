// Informe de cobertura del catalogo: lo que se lee para saber si una region ha quedado
// desequilibrada antes de darla por terminada.
import type { Potencial } from '@conquer/nucleo';
import { POTENCIALES } from '@conquer/nucleo';

import type { ComarcaCatalogo } from './tipos.ts';
import type { FeriaDelMapa } from './validarFerias.ts';

export interface CoberturaDeRegion {
  readonly region: string;
  readonly comarcas: number;
  readonly origenes: number;
  readonly ferias: number;
  /** Media de cada potencial, en milesimas, para no sacar decimales. */
  readonly mediaPotencialMil: Readonly<Record<Potencial, number>>;
  readonly conSal: readonly string[];
  readonly conHierro: readonly string[];
  readonly conPesca: readonly string[];
  readonly terrenos: Readonly<Record<string, number>>;
}

export interface InformeCobertura {
  readonly total: number;
  readonly regiones: readonly CoberturaDeRegion[];
}

export function informeCobertura(
  comarcas: readonly ComarcaCatalogo[],
  ferias: readonly FeriaDelMapa[] = [],
): InformeCobertura {
  const porRegion = new Map<string, ComarcaCatalogo[]>();
  for (const comarca of comarcas) {
    const lista = porRegion.get(comarca.region) ?? [];
    lista.push(comarca);
    porRegion.set(comarca.region, lista);
  }

  const regiones: CoberturaDeRegion[] = [];
  for (const region of [...porRegion.keys()].sort((a, b) => (a < b ? -1 : 1))) {
    const lista = porRegion.get(region) ?? [];
    const mediaPotencialMil: Record<string, number> = {};
    for (const potencial of POTENCIALES) {
      const suma = lista.reduce((total, comarca) => total + comarca.potenciales[potencial], 0);
      mediaPotencialMil[potencial] =
        lista.length === 0 ? 0 : Math.round((suma * 1000) / lista.length);
    }
    const terrenos: Record<string, number> = {};
    for (const comarca of lista) {
      terrenos[comarca.terreno] = (terrenos[comarca.terreno] ?? 0) + 1;
    }
    regiones.push({
      region,
      comarcas: lista.length,
      origenes: lista.filter((comarca) => comarca.esOrigen).length,
      ferias: ferias.filter((feria) => lista.some((comarca) => comarca.id === feria.comarca))
        .length,
      mediaPotencialMil: mediaPotencialMil as Readonly<Record<Potencial, number>>,
      conSal: lista.filter((c) => c.potenciales.sal >= 3).map((c) => c.id),
      conHierro: lista.filter((c) => c.potenciales.hierro >= 3).map((c) => c.id),
      conPesca: lista.filter((c) => c.potenciales.pesca >= 3).map((c) => c.id),
      terrenos,
    });
  }
  return { total: comarcas.length, regiones };
}

/** El mismo informe, escrito para leerlo de un vistazo. */
export function informeLegible(informe: InformeCobertura): string {
  const lineas: string[] = [
    `Catalogo: ${String(informe.total)} comarcas en ${String(informe.regiones.length)} regiones`,
  ];
  for (const region of informe.regiones) {
    lineas.push('');
    lineas.push(`## ${region.region} · ${String(region.comarcas)} comarcas`);
    lineas.push(`  origenes: ${String(region.origenes)} · ferias: ${String(region.ferias)}`);
    const medias = POTENCIALES.map(
      (potencial) => `${potencial} ${(region.mediaPotencialMil[potencial] / 1000).toFixed(1)}`,
    ).join(' · ');
    lineas.push(`  medias: ${medias}`);
    if (region.conSal.length > 0) lineas.push(`  sal: ${region.conSal.join(', ')}`);
    if (region.conHierro.length > 0) lineas.push(`  hierro: ${region.conHierro.join(', ')}`);
    if (region.conPesca.length > 0) lineas.push(`  pesca: ${region.conPesca.join(', ')}`);
  }
  return lineas.join('\n');
}
