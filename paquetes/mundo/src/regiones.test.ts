// Revision de las regiones escritas del catalogo (T-012 §4.4 y T-015 §4.6), como test: lo que
// antes se miraba a ojo en el informe se comprueba solo cada vez que entra una region nueva.
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import type { Mundo } from '@conquer/nucleo';
import { explicar } from '@conquer/nucleo';

import { cargarCatalogo, cargarMundo } from './cargador.ts';
import type { ComarcaCatalogo } from './tipos.ts';

const CATALOGO = fileURLToPath(new URL('../catalogo', import.meta.url));
const MUNDO = fileURLToPath(new URL('../datos/mundo.v1.json', import.meta.url));

/** Las regiones reales escritas hasta ahora. La 00 es el ejemplo del formato y no entra. */
const REGIONES = [
  '01-iberico-alto-duero',
  '02-meseta-norte',
  '03-cantabrico',
  '04-galicia-minho',
  '05-central-extremadura',
  '06-meseta-sur',
  '07-ebro-pirineo',
  '08-levante',
  '09-andalucia',
  '10-portugal-sur',
] as const;

/**
 * Regiones a las que se les exige la proporcion de pan de T-015 §4.6 (una comarca de `labor 4`
 * por cada cinco). La 01 es el Sistema Iberico: sierra y paramo alto, donde esa proporcion seria
 * falsear la geografia. Para ella manda la regla de T-012: nadie a mas de tres jornadas del pan.
 */
const REGIONES_DE_LLANO = [
  '02-meseta-norte',
  '06-meseta-sur',
  '08-levante',
  '09-andalucia',
] as const;

function catalogo(): ComarcaCatalogo[] {
  const resultado = cargarCatalogo(CATALOGO);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

function mundoGenerado(): Mundo {
  const resultado = cargarMundo(MUNDO);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

/** Saltos de camino hasta la comarca con pan (labor 3 o mas) mas cercana. */
function saltosHastaElPan(mundo: Mundo): Map<string, number> {
  const distancia = new Map<string, number>();
  let frente: string[] = [];
  for (const [id, comarca] of Object.entries(mundo.comarcas)) {
    if (comarca.potenciales.labor >= 3) {
      distancia.set(id, 0);
      frente.push(id);
    }
  }
  while (frente.length > 0) {
    const siguiente: string[] = [];
    for (const id of frente) {
      for (const vecino of mundo.vecinos[id] ?? []) {
        if (distancia.has(vecino)) continue;
        distancia.set(vecino, (distancia.get(id) ?? 0) + 1);
        siguiente.push(vecino);
      }
    }
    frente = siguiente;
  }
  return distancia;
}

describe.each(REGIONES)('catalogo de la region %s', (region) => {
  const comarcas = (): ComarcaCatalogo[] => catalogo().filter((c) => c.region === region);

  it('anota el criterio de cada comarca', () => {
    const sinNota = comarcas()
      .filter((comarca) => comarca.nota === null)
      .map((comarca) => comarca.id);
    expect(sinNota).toEqual([]);
  });

  it('no escribe ni un paraiso ni un erial', () => {
    for (const comarca of comarcas()) {
      const suma = Object.values(comarca.potenciales).reduce<number>((total, n) => total + n, 0);
      expect(suma, comarca.id).toBeGreaterThanOrEqual(6);
      expect(suma, comarca.id).toBeLessThanOrEqual(18);
    }
  });

  it('ofrece entre tres y ocho origenes', () => {
    const origenes = comarcas().filter((comarca) => comarca.esOrigen);
    expect(origenes.length).toBeGreaterThanOrEqual(3);
    expect(origenes.length).toBeLessThanOrEqual(8);
  });
});

describe.each(REGIONES_DE_LLANO)('el pan de la region %s', (region) => {
  it('tiene una comarca de labor 4 o mas por cada cinco', () => {
    const lista = catalogo().filter((comarca) => comarca.region === region);
    const conPan = lista.filter((comarca) => comarca.potenciales.labor >= 4);
    expect(conPan.length).toBeGreaterThanOrEqual(Math.ceil(lista.length / 5));
  });
});

describe.each(REGIONES)('la region %s dentro del mundo generado', (region) => {
  it('deja a cada comarca con al menos dos vecinos', () => {
    const mundo = mundoGenerado();
    const pocos = Object.values(mundo.comarcas)
      .filter((comarca) => comarca.region === region)
      .filter((comarca) => (mundo.vecinos[comarca.id] ?? []).length < 2)
      .map((comarca) => comarca.id);
    expect(pocos).toEqual([]);
  });

  it('no deja huecos provisionales dentro de la region', () => {
    const mundo = mundoGenerado();
    const huecos = Object.values(mundo.comarcas)
      .filter((comarca) => comarca.region === '99-provisional')
      .filter((comarca) => {
        const vecinos = mundo.vecinos[comarca.id] ?? [];
        return (
          vecinos.length > 0 && vecinos.every((vecino) => mundo.comarcas[vecino]?.region === region)
        );
      })
      .map((comarca) => comarca.id);
    expect(huecos).toEqual([]);
  });

  it('nunca deja a nadie a mas de tres jornadas del pan', () => {
    const mundo = mundoGenerado();
    const saltos = saltosHastaElPan(mundo);
    const lejos = Object.values(mundo.comarcas)
      .filter((comarca) => comarca.region === region)
      .filter((comarca) => (saltos.get(comarca.id) ?? 99) > 3)
      .map((comarca) => comarca.id);
    expect(lejos).toEqual([]);
  });
});

describe('recursos estrategicos region a region', () => {
  it('reparte la sal y el hierro del Iberico solo donde los hubo', () => {
    const iberico = catalogo().filter((c) => c.region === '01-iberico-alto-duero');
    expect(iberico).toHaveLength(35);
    expect(iberico.filter((c) => c.potenciales.sal >= 3).map((c) => c.id)).toEqual([
      'bureba',
      'siguenza',
    ]);
    expect(
      iberico
        .filter((c) => c.potenciales.hierro >= 3)
        .map((c) => c.id)
        .sort(),
    ).toEqual(['jiloca', 'senyorio-de-molina']);
  });

  it('pone en Andalucia la campinya, la sal de Cadiz, Riotinto y el marmol de Macael', () => {
    const sur = catalogo().filter((c) => c.region === '09-andalucia');
    expect(sur).toHaveLength(48);
    // El valle del Guadalquivir: cinco comarcas de labor 5, mas que ninguna otra region.
    expect(sur.filter((c) => c.potenciales.labor === 5).length).toBeGreaterThanOrEqual(5);
    expect(sur.filter((c) => c.potenciales.sal >= 3).map((c) => c.id)).toEqual(['bahia-de-cadiz']);
    expect(sur.filter((c) => c.potenciales.hierro >= 3).map((c) => c.id)).toEqual([
      'andevalo-y-riotinto',
    ]);
    // Macael es la unica comarca del mapa con piedra 5.
    expect(sur.filter((c) => c.potenciales.piedra === 5).map((c) => c.id)).toEqual([
      'valle-del-almanzora',
    ]);
    expect(sur.filter((c) => c.potenciales.pesca >= 4).length).toBeGreaterThanOrEqual(8);
  });

  it('da a Levante las huertas de regadio, la sal del sur y los puertos', () => {
    const levante = catalogo().filter((c) => c.region === '08-levante');
    expect(levante).toHaveLength(34);
    // Las cuatro huertas mayores son las unicas con labor 5, y todas van como vega.
    const huertas = levante.filter((c) => c.potenciales.labor === 5);
    expect(huertas.map((c) => c.id).sort()).toEqual([
      'horta-de-valencia',
      'huerta-de-murcia',
      'la-ribera',
      'vega-baixa',
    ]);
    expect(huertas.every((c) => c.terreno === 'vega')).toBe(true);
    expect(
      levante
        .filter((c) => c.potenciales.sal >= 3)
        .map((c) => c.id)
        .sort(),
    ).toEqual(['campo-de-cartagena', 'vega-baixa']);
    expect(levante.filter((c) => c.rasgos.includes('puerto-de-mar')).length).toBeGreaterThanOrEqual(
      10,
    );
  });

  it('reparte en el Ebro la sal de Cardona, el hierro del Ripolles y los puertos', () => {
    const ebro = catalogo().filter((c) => c.region === '07-ebro-pirineo');
    expect(ebro).toHaveLength(49);
    expect(ebro.filter((c) => c.potenciales.sal >= 3).map((c) => c.id)).toEqual([
      'cardona-y-el-solsones',
    ]);
    expect(ebro.filter((c) => c.potenciales.hierro >= 3).map((c) => c.id)).toEqual(['ripolles']);
    // El Pirineo entero es pasto de verano; las Bardenas y los Monegros, de invierno.
    expect(ebro.filter((c) => c.rasgos.includes('pasto-de-verano')).length).toBeGreaterThanOrEqual(
      9,
    );
    // El reves seco del Ebro: Bardenas, Monegros y los llanos de Alcubierre y Belchite.
    expect(
      ebro
        .filter((c) => c.rasgos.includes('pasto-de-invierno'))
        .map((c) => c.id)
        .sort(),
    ).toEqual(['bardenas', 'campo-de-belchite', 'monegros', 'tierra-de-alcubierre']);
    // Las vegas de regadio del Ebro y el Segre son las unicas que llegan a labor 5.
    expect(
      ebro
        .filter((c) => c.potenciales.labor === 5)
        .map((c) => c.id)
        .sort(),
    ).toEqual(['ribera-de-tudela', 'segria']);
  });

  it('hace de la Meseta sur tierra de vinya y de ordenes militares', () => {
    const sur = catalogo().filter((c) => c.region === '06-meseta-sur');
    expect(sur).toHaveLength(41);
    // La Mancha: mas de la mitad labra a 4, y el vinyedo es su cultivo de renta.
    expect(sur.filter((c) => c.potenciales.labor >= 4).length).toBeGreaterThanOrEqual(15);
    expect(sur.filter((c) => c.rasgos.includes('vinyedo')).length).toBeGreaterThanOrEqual(8);
    // Ni sal ni pesca; el unico hierro es la mena pobre de Calatrava y Alcudia, que no llega a vena.
    expect(sur.filter((c) => c.potenciales.sal >= 1)).toEqual([]);
    expect(sur.filter((c) => c.potenciales.pesca >= 1)).toEqual([]);
    expect(sur.filter((c) => c.potenciales.hierro >= 3)).toEqual([]);
    expect(
      sur
        .filter((c) => c.potenciales.hierro > 0)
        .map((c) => c.id)
        .sort(),
    ).toEqual(['campo-de-calatrava', 'valle-de-alcudia']);
  });

  it('pone en el Sistema Central el pasto de verano y en Extremadura el de invierno', () => {
    const sur = catalogo().filter((c) => c.region === '05-central-extremadura');
    expect(sur).toHaveLength(37);
    const verano = sur.filter((c) => c.rasgos.includes('pasto-de-verano'));
    const invierno = sur.filter(
      (c) => c.rasgos.includes('pasto-de-invierno') || c.rasgos.includes('dehesa'),
    );
    // Las dos mitades de la trashumancia tienen que estar las dos, y bien servidas.
    expect(verano.length).toBeGreaterThanOrEqual(8);
    expect(invierno.length).toBeGreaterThanOrEqual(10);
    // La dehesa no es tierra de pan: solo las vegas del Guadiana, el Alagon y el Tajo pasan de 3.
    expect(sur.filter((c) => c.potenciales.labor >= 4).length).toBeLessThanOrEqual(8);
    expect(sur.filter((c) => c.potenciales.labor === 5).map((c) => c.id)).toEqual([
      'vegas-del-guadiana',
    ]);
  });

  it('deja Galicia y el Minho sin sal ni hierro y con la mar por despensa', () => {
    const noroeste = catalogo().filter((c) => c.region === '04-galicia-minho');
    expect(noroeste).toHaveLength(42);
    expect(noroeste.filter((c) => c.potenciales.sal >= 3)).toEqual([]);
    expect(noroeste.filter((c) => c.potenciales.hierro >= 3)).toEqual([]);
    expect(noroeste.filter((c) => c.potenciales.pesca >= 4).length).toBeGreaterThanOrEqual(10);
    expect(noroeste.filter((c) => c.potenciales.labor >= 4)).toEqual([]);
    // El vinyedo es su cultivo de renta: Ribeiro, Ribeira Sacra, Douro, Baixo Minyo, Bierzo...
    expect(noroeste.filter((c) => c.rasgos.includes('vinyedo')).length).toBeGreaterThanOrEqual(8);
  });

  it('junta en la cornisa el hierro, la sal de Anyana y la pesca', () => {
    const cornisa = catalogo().filter((c) => c.region === '03-cantabrico');
    expect(cornisa).toHaveLength(39);
    expect(cornisa.filter((c) => c.potenciales.sal >= 3).map((c) => c.id)).toEqual([
      'valles-alaveses',
    ]);
    expect(
      cornisa
        .filter((c) => c.potenciales.hierro >= 3)
        .map((c) => c.id)
        .sort(),
    ).toEqual(['bilbao', 'durangaldea', 'encartaciones', 'oiartzun-bidasoa', 'valle-de-mena']);
    // La mar es su despensa, y solo se pesca desde la costa.
    const conPesca = cornisa.filter((c) => c.potenciales.pesca >= 1);
    expect(conPesca.length).toBeGreaterThanOrEqual(12);
    expect(conPesca.every((c) => c.terreno === 'costa')).toBe(true);
    // Y no tiene pan: una sola comarca llega a labor 4, la Llanada alavesa.
    expect(cornisa.filter((c) => c.potenciales.labor >= 4).map((c) => c.id)).toEqual([
      'llanada-alavesa',
    ]);
  });

  it('en la Meseta norte la unica sal es la de las lagunas de Villafafila', () => {
    const meseta = catalogo().filter((c) => c.region === '02-meseta-norte');
    expect(meseta).toHaveLength(37);
    expect(meseta.filter((c) => c.potenciales.sal >= 3).map((c) => c.id)).toEqual([
      'campos-de-villalpando',
    ]);
    expect(meseta.filter((c) => c.potenciales.hierro >= 3)).toEqual([]);
    // El granero: la mitad de la region labra a 4 o mas.
    expect(meseta.filter((c) => c.potenciales.labor >= 4).length).toBeGreaterThanOrEqual(15);
  });
});

/**
 * Comprobaciones globales del mapa completo (T-015 §5). Las cifras se recalibraron al cerrar el
 * catalogo: la peninsula salio en 403 comarcas y no en las ~350 que estimaba el plan, asi que los
 * objetivos absolutos se ajustaron manteniendo la proporcion. Las dos comprobaciones que dependen
 * de datos que todavia no existen —la canyada que une cada pasto de verano con uno de invierno y
 * las tres ferias grandes— pasaron a T-013 y T-014, que son quienes escriben esos datos.
 */
describe('equilibrio del mapa completo', () => {
  it('no deja ni una comarca provisional', () => {
    const mundo = mundoGenerado();
    const provisionales = Object.values(mundo.comarcas).filter(
      (comarca) => comarca.region === '99-provisional',
    );
    expect(provisionales).toEqual([]);
    expect(Object.keys(mundo.comarcas).length).toBeGreaterThanOrEqual(340);
    expect(Object.keys(mundo.comarcas).length).toBeLessThanOrEqual(420);
  });

  it('reparte la sal y el hierro en pocos focos', () => {
    const comarcas = catalogo().filter((c) => c.region !== '00-ejemplo');
    const conSal = comarcas.filter((c) => c.potenciales.sal >= 3);
    const conHierro = comarcas.filter((c) => c.potenciales.hierro >= 3);
    expect(conSal.length).toBeGreaterThanOrEqual(10);
    expect(conSal.length).toBeLessThanOrEqual(16);
    expect(conHierro.length).toBeGreaterThanOrEqual(8);
    expect(conHierro.length).toBeLessThanOrEqual(14);
    // Cuatro focos de hierro: el cantabrico, el Iberico, el Pirineo oriental y Sierra Morena.
    const focos = new Set(conHierro.map((c) => c.region));
    expect(focos.size).toBeGreaterThanOrEqual(4);
    expect(focos.size).toBeLessThanOrEqual(5);
    // La sal aparece en el interior y en la costa, no solo en una de las dos.
    expect(conSal.some((c) => c.terreno === 'costa')).toBe(true);
    expect(conSal.some((c) => c.terreno !== 'costa')).toBe(true);
  });

  it('mantiene la proporcion de pan, pasto y origenes', () => {
    const comarcas = catalogo().filter((c) => c.region !== '00-ejemplo');
    const conPan = comarcas.filter((c) => c.potenciales.labor >= 4);
    // 70-90 comarcas: el 17-22 % del mapa, la proporcion que pedia T-015 §5 sobre 350 comarcas.
    expect(conPan.length).toBeGreaterThanOrEqual(70);
    expect(conPan.length).toBeLessThanOrEqual(90);
    expect(
      comarcas.filter((c) => c.rasgos.includes('pasto-de-verano')).length,
    ).toBeGreaterThanOrEqual(30);
    expect(
      comarcas.filter((c) => c.rasgos.includes('pasto-de-invierno') || c.rasgos.includes('dehesa'))
        .length,
    ).toBeGreaterThanOrEqual(30);
    const origenes = comarcas.filter((c) => c.esOrigen);
    expect(origenes.length).toBeGreaterThanOrEqual(60);
    for (const region of REGIONES) {
      expect(origenes.filter((c) => c.region === region).length, region).toBeGreaterThanOrEqual(4);
    }
  });

  it('deja el mapa a una distancia media de tres a cuatro jornadas', () => {
    const mundo = mundoGenerado();
    const media =
      mundo.caminos.reduce((total, camino) => total + camino.jornadasBase, 0) /
      mundo.caminos.length;
    expect(media).toBeGreaterThanOrEqual(3);
    expect(media).toBeLessThanOrEqual(4);
  });

  it('cubre la peninsula con nombres reales y sin identificadores repetidos', () => {
    const comarcas = catalogo().filter((c) => c.region !== '00-ejemplo');
    expect(comarcas.length).toBe(403);
    expect(new Set(comarcas.map((c) => c.id)).size).toBe(comarcas.length);
    expect(comarcas.filter((c) => c.nombre.startsWith('Comarca sin nombre'))).toEqual([]);
    expect(comarcas.every((c) => c.nota !== null)).toBe(true);
  });
});
