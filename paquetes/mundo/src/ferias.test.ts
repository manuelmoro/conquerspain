// Las ferias del mapa y las reglas que las gobiernan (T-014 §4.3): una por regla.
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { explicar } from '@conquer/nucleo';

import { cargarCatalogo, cargarFeriasDelMapa, cargarMundo } from './cargador.ts';
import type { ComarcaCatalogo } from './tipos.ts';
import type { FeriaDelMapa } from './validarFerias.ts';
import { comprobarFerias, comprobarRasgos, validarFerias } from './validarFerias.ts';

const CATALOGO = fileURLToPath(new URL('../catalogo', import.meta.url));
const MUNDO = fileURLToPath(new URL('../datos/mundo.v1.json', import.meta.url));

function comarcas(): ComarcaCatalogo[] {
  const resultado = cargarCatalogo(CATALOGO);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

function ferias(): FeriaDelMapa[] {
  const resultado = cargarFeriasDelMapa(CATALOGO);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

function feriaDe(cambios: Partial<FeriaDelMapa> = {}): FeriaDelMapa {
  return {
    id: 'feria-inventada',
    nombre: 'Feria Inventada',
    comarca: 'tierra-de-medina',
    turnos: [3],
    volumen: 'pequenya',
    recursosDestacados: ['lana'],
    nota: null,
    ...cambios,
  };
}

describe('ferias del mapa', () => {
  it('las once ferias del catalogo validan contra las comarcas', () => {
    expect(explicar(comprobarFerias(ferias(), comarcas()))).toBe('');
    expect(ferias()).toHaveLength(11);
  });

  it('regla 1: la feria va en una comarca que existe y tiene derecho de feria', () => {
    const lista = comarcas();
    expect(explicar(comprobarFerias([feriaDe({ comarca: 'no-existe-esta' })], lista))).toMatch(
      /no esta en el catalogo/,
    );
    expect(explicar(comprobarFerias([feriaDe({ comarca: 'pinares' })], lista))).toMatch(
      /sin derecho de feria no hay feria/,
    );
  });

  it('regla 2: los turnos van de 1 a 24 y una feria no dura mas de dos seguidos', () => {
    expect(validarFerias([feriaDe({ turnos: [25] })], 'x').ok).toBe(false);
    expect(validarFerias([feriaDe({ turnos: [1, 2, 3] })], 'x').ok).toBe(false);
    expect(explicar(comprobarFerias([feriaDe({ turnos: [4, 9] })], comarcas()))).toMatch(
      /los tiene seguidos/,
    );
  });

  it('regla 3: no hay mas de tres ferias grandes en todo el mapa', () => {
    const grandes = ferias().filter((feria) => feria.volumen === 'grande');
    expect(grandes).toHaveLength(3);
    const demasiadas = [...ferias(), feriaDe({ volumen: 'grande', turnos: [2] })];
    expect(explicar(comprobarFerias(demasiadas, comarcas()))).toMatch(/ferias grandes/);
  });

  it('regla 4: entre dos ferias grandes hay al menos cuatro turnos', () => {
    const apinyadas = [
      feriaDe({ id: 'una', volumen: 'grande', turnos: [10] }),
      feriaDe({ id: 'otra', volumen: 'grande', turnos: [12] }),
    ];
    expect(explicar(comprobarFerias(apinyadas, comarcas()))).toMatch(/para encadenar las dos/);
  });

  it('regla 5: todo rasgo asignado existe en el catalogo cerrado', () => {
    // Lo comprueba el validador del catalogo, y aqui se verifica sobre el catalogo real.
    const resultado = cargarCatalogo(CATALOGO);
    expect(resultado.ok).toBe(true);
  });

  it('regla 6: las salinas y las venas de hierro solo donde hay de que', () => {
    expect(explicar(comprobarRasgos(comarcas()))).toBe('');
    const inventada = comarcas().map((comarca) =>
      comarca.id === 'pinares'
        ? { ...comarca, rasgos: [...comarca.rasgos, 'salinas-historicas'] }
        : comarca,
    );
    expect(explicar(comprobarRasgos(inventada))).toMatch(/una salina sin sal/);
  });

  it('el calendario reparte las ferias por el anyo y por el mapa', () => {
    const lista = ferias();
    const turnos = lista.flatMap((feria) => feria.turnos).sort((a, b) => a - b);
    expect(turnos[0]).toBeGreaterThanOrEqual(1);
    expect(turnos.at(-1)).toBeLessThanOrEqual(24);
    // Ocho regiones distintas con feria: ninguna region se queda con todas.
    const porComarca = new Set(lista.map((feria) => feria.comarca));
    expect(porComarca.size).toBeGreaterThanOrEqual(8);
  });

  it('el mundo generado lleva las ferias puestas en su comarca', () => {
    const mundo = cargarMundo(MUNDO);
    if (!mundo.ok) throw new Error(explicar(mundo.errores));
    const todas = Object.values(mundo.valor.comarcas).flatMap((comarca) => comarca.ferias);
    expect(todas).toHaveLength(11);
    const medina = mundo.valor.comarcas['tierra-de-medina'];
    expect(medina?.ferias).toHaveLength(2);
    expect(medina?.rasgos).toContain('villa-de-feria');
    for (const comarca of Object.values(mundo.valor.comarcas)) {
      if (comarca.ferias.length > 0) expect(comarca.rasgos, comarca.id).toContain('villa-de-feria');
    }
  });
});

describe('rasgos del catalogo (T-014 §4.1 y §4.4)', () => {
  it('usa los diecisiete rasgos del catalogo cerrado', () => {
    const usados = new Set(comarcas().flatMap((comarca) => comarca.rasgos));
    for (const rasgo of [
      'salinas-historicas',
      'vena-de-hierro',
      'ferreria-de-agua',
      'cantera-noble',
      'pinar-maderable',
      'pasto-de-verano',
      'pasto-de-invierno',
      'dehesa',
      'marisma',
      'vega-fluvial',
      'ciudad-episcopal',
      'villa-de-feria',
      'puerto-de-mar',
      'camino-de-santiago',
      'calzada-romana',
      'vinyedo',
      'montado',
    ]) {
      expect(usados.has(rasgo), rasgo).toBe(true);
    }
  });

  it('asigna en la region 1 los rasgos que pide la ficha', () => {
    const porId = new Map(comarcas().map((comarca) => [comarca.id, comarca.rasgos]));
    const exigidos: Record<string, readonly string[]> = {
      'salinas-historicas': ['bureba', 'siguenza'],
      'vena-de-hierro': ['senyorio-de-molina', 'jiloca'],
      'ferreria-de-agua': ['aranda-jalon'],
      'pinar-maderable': ['pinares', 'alto-tajo', 'ayllon'],
      'pasto-de-verano': [
        'pinares',
        'cameros',
        'demanda',
        'albarracin',
        'tierras-altas',
        'pedraza',
      ],
      'cantera-noble': ['tierra-de-lara', 'sepulveda'],
      'ciudad-episcopal': ['tierra-del-burgo', 'siguenza', 'alfoz-de-burgos', 'rioja-baja'],
      'camino-de-santiago': ['montes-de-oca', 'valle-del-oja', 'najerilla', 'rioja-media'],
      'vega-fluvial': ['rioja-media', 'rioja-baja', 'calatayud', 'ribera-del-duero'],
      vinyedo: ['ribera-del-duero', 'rioja-alavesa', 'rioja-media'],
      'villa-de-feria': ['alfoz-de-burgos'],
    };
    for (const [rasgo, ids] of Object.entries(exigidos)) {
      for (const id of ids) expect(porId.get(id), `${id} · ${rasgo}`).toContain(rasgo);
    }
  });
});
