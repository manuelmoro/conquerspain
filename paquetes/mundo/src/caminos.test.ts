// La capa historica de caminos (T-013): que los datos hablen del mapa que existe y que la red
// de canyadas sirva para lo que se invento, llevar los rebanyos del agostadero al invernadero.
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import type { Mundo } from '@conquer/nucleo';
import { explicar } from '@conquer/nucleo';

import { cargarCaminos, cargarMundo } from './cargador.ts';
import type { CaminosCatalogo } from './validarCaminos.ts';
import { comprobarCaminos, validarCaminos } from './validarCaminos.ts';

const CATALOGO = fileURLToPath(new URL('../catalogo', import.meta.url));
const MUNDO = fileURLToPath(new URL('../datos/mundo.v1.json', import.meta.url));

function capa(): CaminosCatalogo {
  const resultado = cargarCaminos(CATALOGO);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

function mundoGenerado(): Mundo {
  const resultado = cargarMundo(MUNDO);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

/** Comarcas que toca la red de canyadas, y a que distancia queda cada comarca de ella. */
function saltosHastaUnaCanyada(mundo: Mundo): Map<string, number> {
  const enCanyada = new Set<string>();
  for (const camino of mundo.caminos) {
    if (camino.canyada === null) continue;
    enCanyada.add(camino.desde);
    enCanyada.add(camino.hasta);
  }
  const distancia = new Map([...enCanyada].map((id) => [id, 0]));
  let frente = [...enCanyada];
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

describe('catalogo de caminos', () => {
  it('valida contra el mundo generado sin un solo error', () => {
    expect(explicar(comprobarCaminos(capa(), mundoGenerado()))).toBe('');
  });

  it('trae los puertos, los vados, las cuatro calzadas y las nueve canyadas', () => {
    const caminos = capa();
    expect(caminos.canyadas).toHaveLength(9);
    expect(caminos.calzadas.map((c) => c.nombre).sort()).toEqual([
      'Calzada de Braga a Astorga',
      'Calzada del Duero',
      'Vía Augusta',
      'Vía de la Plata',
    ]);
    expect(caminos.puertos.length).toBeGreaterThanOrEqual(21);
    expect(caminos.vados.length).toBeGreaterThanOrEqual(10);
    // Los puertos de docs/05 §5.3 que no pueden faltar.
    const nombres = caminos.puertos.map((p) => p.nombre);
    for (const puerto of [
      'Puerto de Piqueras',
      'Somosierra',
      'Puerto de Pajares',
      'Despeñaperros',
      'Puerto del Pico',
      'Serra da Estrela',
      'Portela do Homem',
    ]) {
      expect(nombres, puerto).toContain(puerto);
    }
  });

  it('rechaza un puerto entre comarcas que no son vecinas', () => {
    const mundo = mundoGenerado();
    const rotos = comprobarCaminos(
      {
        ...capa(),
        puertos: [
          {
            nombre: 'Puerto Imposible',
            entre: ['pinares', 'bahia-de-cadiz'],
            altitud: 1200,
            cierre: 'invierno',
            nota: null,
          },
        ],
      },
      mundo,
    );
    expect(explicar(rotos)).toMatch(/no son vecinas/);
  });

  it('rechaza una canyada que no acaba en invernadero', () => {
    const mundo = mundoGenerado();
    const rotos = comprobarCaminos(
      {
        ...capa(),
        canyadas: [
          {
            nombre: 'Canyada Inventada',
            comarcas: [
              'pinares',
              'tierra-del-burgo',
              'ayllon',
              'sepulveda',
              'pedraza',
              'tierra-de-segovia',
              'tierra-de-avila',
              'sierra-de-gredos',
            ],
            nota: null,
          },
        ],
      },
      mundo,
    );
    expect(explicar(rotos)).toMatch(/no es pasto de invierno ni dehesa/);
  });

  it('rechaza una canyada demasiado corta', () => {
    const rotos = comprobarCaminos(
      {
        ...capa(),
        canyadas: [
          { nombre: 'Canyada Corta', comarcas: ['cameros', 'tierra-de-soria'], nota: null },
        ],
      },
      mundoGenerado(),
    );
    expect(explicar(rotos)).toMatch(/entre 8 y 16/);
  });

  it('rechaza un archivo con la forma cambiada', () => {
    const resultado = validarCaminos({ puertos: [], vados: [] }, 'x');
    expect(resultado.ok).toBe(false);
  });
});

describe('la capa en el mundo generado', () => {
  it('marca los tramos con su puerto, su vado, su calzada y su canyada', () => {
    const mundo = mundoGenerado();
    const conPuerto = mundo.caminos.filter((c) => c.puertoDeMontanya !== null);
    expect(conPuerto.length).toBeGreaterThanOrEqual(21);
    // Un puerto cuesta siempre siete jornadas de base, suba de donde suba.
    expect(conPuerto.every((c) => c.jornadasBase === 7)).toBe(true);
    // Los que no cierran (Despenyaperros, el Manzanal, Bejar…) siguen siendo paso, no barrera.
    expect(conPuerto.some((c) => !c.cierraEnInvierno)).toBe(true);
    expect(mundo.caminos.filter((c) => c.vado).length).toBeGreaterThanOrEqual(10);
    expect(mundo.caminos.filter((c) => c.calzadaRomana).length).toBeGreaterThanOrEqual(40);
    expect(mundo.caminos.filter((c) => c.canyada !== null).length).toBeGreaterThanOrEqual(60);
  });

  it('el Piqueras y la Via de la Plata estan donde tienen que estar', () => {
    const mundo = mundoGenerado();
    const piqueras = mundo.caminos.find((c) => c.puertoDeMontanya === 'Puerto de Piqueras');
    expect(piqueras?.cierraEnInvierno).toBe(true);
    expect([piqueras?.desde, piqueras?.hasta].sort()).toEqual(['cameros', 'tierra-de-soria']);
    const plata = mundo.caminos.filter((c) => c.calzadaRomana);
    expect(
      plata.some(
        (c) =>
          (c.desde === 'tierra-de-caceres' && c.hasta === 'tierra-de-plasencia') ||
          (c.desde === 'tierra-de-plasencia' && c.hasta === 'tierra-de-caceres'),
      ),
    ).toBe(true);
  });

  /**
   * Comprobacion heredada de T-015 §5, afinada aqui: las canyadas reales son la red de la Mesta,
   * no cubren el Pirineo ni la cornisa, que tuvieron trashumancia corta y propia. Lo exigible es
   * que la red una de verdad agostaderos con invernaderos y que la inmensa mayoria de los pastos
   * de verano la tengan a mano.
   */
  it('une los pastos de verano con los de invierno', () => {
    const mundo = mundoGenerado();
    const comarcas = Object.values(mundo.comarcas);
    const saltos = saltosHastaUnaCanyada(mundo);
    const enCanyada = (id: string): boolean => saltos.get(id) === 0;
    const verano = comarcas.filter((c) => c.rasgos.includes('pasto-de-verano'));
    const invierno = comarcas.filter(
      (c) => c.rasgos.includes('pasto-de-invierno') || c.rasgos.includes('dehesa'),
    );
    expect(verano.filter((c) => enCanyada(c.id)).length).toBeGreaterThanOrEqual(15);
    expect(invierno.filter((c) => enCanyada(c.id)).length).toBeGreaterThanOrEqual(15);
    const aDosSaltos = verano.filter((c) => (saltos.get(c.id) ?? 99) <= 2).length;
    expect(aDosSaltos * 4).toBeGreaterThanOrEqual(verano.length * 3);
  });
});
