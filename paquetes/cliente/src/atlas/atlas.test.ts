// El atlas en el cliente (ficha T-081 §6): modos, niebla, movimiento, rotulos, encuadre y presupuesto.
import { describe, expect, it } from 'vitest';

import { atlasDeJugador, vistaDeJugador } from '@conquer/nucleo';
import type {
  AtlasDeJugador,
  ComarcaEnAtlas,
  IdComarca,
  IdJugador,
  IdRecua,
  Recua,
  VistaJugador,
} from '@conquer/nucleo';

import {
  TODAS_LAS_CASAS,
  partidaDePrueba,
} from '../../../servidor/src/persistencia/prueba-comun.ts';
import { componerAtlas, potencialPrincipal } from './componer.ts';
import type { Dibujo, Figura } from './componer.ts';
import { acercar, desplazar, encuadreInicial } from './encuadre.ts';
import { cajaDeRotulo, colocarRotulos } from './rotulos.ts';

const { estado, mundo } = partidaDePrueba(['mesta', 'monjes', 'canteros'], '1492', 'p1');
const vista = vistaDeJugador(estado, 'mesta' as IdJugador, mundo);
const atlas = atlasDeJugador(vista, mundo);

/** El peor caso: el mapa entero de ocho casas, todo explorado. */
function atlasCompleto(): { atlas: AtlasDeJugador; vista: VistaJugador } {
  const grande = partidaDePrueba(TODAS_LAS_CASAS, '1085', 'p8');
  const v = vistaDeJugador(grande.estado, 'mesta' as IdJugador, grande.mundo);
  const comarcas: ComarcaEnAtlas[] = Object.values(grande.mundo.comarcas).map((c) => ({
    id: c.id,
    nivel: 'explorada',
    nombre: c.nombre,
    poligono: c.poligono,
    centro: c.poligono[0] ?? [0, 0],
    terreno: c.terreno,
    potenciales: c.potenciales,
    feria: c.ferias.length > 0,
    duenyo: null,
  }));
  const conocidas = Object.fromEntries(
    comarcas.map(
      (c) =>
        [c.id, { nivel: 'oida', turnoUltimaNoticia: 1, nombre: c.nombre, region: 'x' }] as const,
    ),
  );
  const todo = atlasDeJugador({ ...v, comarcas: conocidas }, grande.mundo);
  return { atlas: { ...todo, comarcas }, vista: v };
}

function de(d: Dibujo, capa: Figura['capa']): Figura[] {
  return d.figuras.filter((f) => f.capa === capa);
}

describe('la niebla del dibujo es la del atlas (criterio 1)', () => {
  it('solo las comarcas del atlas llevan id; lo desconocido es niebla anonima', () => {
    const dibujo = componerAtlas(atlas, vista, { modo: 'economico', estacion: 'primavera' });
    const conocidas = new Set(atlas.comarcas.map((c) => c.id));
    for (const f of dibujo.figuras)
      if (f.comarca !== undefined) expect(conocidas.has(f.comarca)).toBe(true);
    expect(de(dibujo, 'niebla').filter((f) => f.clase === 'niebla')).toHaveLength(
      atlas.niebla.length,
    );
    const texto = JSON.stringify(dibujo);
    for (const [id, c] of Object.entries(mundo.comarcas)) {
      if (conocidas.has(id as IdComarca)) continue;
      expect(texto).not.toContain(`"${id}"`);
      expect(texto).not.toContain(c.nombre);
    }
  });
});

describe('los tres modos (criterio 2)', () => {
  it('economico: cada comarca vista, tintada por su potencial principal y rotulada con el', () => {
    const d = componerAtlas(atlas, vista, { modo: 'economico', estacion: 'primavera' });
    for (const c of atlas.comarcas.filter((x) => x.nivel !== 'oida')) {
      const p = potencialPrincipal(c);
      const figura = de(d, 'comarcas').find((f) => f.comarca === c.id);
      if (p !== null) expect(figura?.clase).toContain(`potencial-${p}`);
    }
    const capital = de(d, 'rotulos').find((f) => f.comarca === vista.jugador.capital);
    expect(capital?.clase).toContain('capital');
    expect(capital?.texto).toContain(' · ');
  });

  it('politico: lo propio en cobalto y lo que no tiene dueño, neutral', () => {
    const d = componerAtlas(atlas, vista, { modo: 'politico', estacion: 'primavera' });
    const propia = de(d, 'comarcas').find((f) => f.comarca === vista.jugador.capital);
    expect(propia?.clase).toContain('de-propio');
    expect(de(d, 'comarcas').some((f) => f.clase.includes('neutral'))).toBe(true);
  });

  it('logistico: caminos destacados con sus jornadas; los puertos, cerrados solo en invierno', () => {
    const { atlas: todo, vista: v } = atlasCompleto();
    const invierno = componerAtlas(todo, v, { modo: 'logistico', estacion: 'invierno' });
    const verano = componerAtlas(todo, v, { modo: 'logistico', estacion: 'verano' });
    expect(de(invierno, 'caminos').every((f) => f.clase.includes('destacado'))).toBe(true);
    expect(de(verano, 'rotulos').some((f) => /^\d+ j$/.test(f.texto ?? ''))).toBe(true);
    const cierran = todo.tramos.filter((t) => t.cierraEnInvierno && t.calidad !== 'calzada').length;
    expect(cierran).toBeGreaterThan(0);
    expect(de(invierno, 'caminos').filter((f) => f.clase.includes('puerto-cerrado'))).toHaveLength(
      cierran,
    );
    expect(de(verano, 'caminos').some((f) => f.clase.includes('puerto-cerrado'))).toBe(false);
    expect(de(invierno, 'caminos').some((f) => f.clase.includes('canyada'))).toBe(true);
    // En los otros modos, los caminos quedan discretos y sin jornadas.
    const eco = componerAtlas(todo, v, { modo: 'economico', estacion: 'verano' });
    expect(de(eco, 'caminos').every((f) => f.clase.includes('discreto'))).toBe(true);
  });
});

describe('el movimiento (criterio 6)', () => {
  it('una recua en camino esta entre sus dos comarcas, con las jornadas que le quedan', () => {
    const tramo = atlas.tramos.find((t) =>
      atlas.tramos.some((u) => u.desde === t.hasta && u.hasta !== t.desde),
    );
    if (tramo === undefined) throw new Error('sin tramos encadenados');
    const siguiente = atlas.tramos.find((u) => u.desde === tramo.hasta && u.hasta !== tramo.desde);
    if (siguiente === undefined) throw new Error('sin tramo siguiente');
    const recua: Recua = {
      id: 'recua-x' as IdRecua,
      jugador: 'mesta' as IdJugador,
      nombre: 'Recua de prueba',
      situacion: {
        donde: 'camino',
        desde: tramo.desde,
        hasta: tramo.hasta,
        jornadasHechasMil: 1000,
      },
      ruta: [tramo.hasta, siguiente.hasta],
      rutaCircular: false,
      paradas: [],
      siguienteParada: 0,
      enParada: null,
      acemilas: 10,
      porte: 10,
      carga: { pan: 0, madera: 0, piedra: 0, maravedis: 0, sal: 0, hierro: 0, lana: 0 },
      vecinos: 0,
      cometido: null,
      turnosDeCometido: 0,
      avisadaSinBastimento: false,
      enExpedicion: false,
      fallosDePrecio: 0,
    };
    const d = componerAtlas(
      atlas,
      { ...vista, recuas: [recua] },
      { modo: 'economico', estacion: 'verano' },
    );
    const punto = de(d, 'movimiento').find((f) => f.forma === 'circulo')?.puntos[0];
    const a = atlas.comarcas.find((c) => c.id === tramo.desde)?.centro;
    const b = atlas.comarcas.find((c) => c.id === tramo.hasta)?.centro;
    if (punto === undefined || a === undefined || b === undefined)
      throw new Error('falta la recua');
    expect(punto[0]).toBeGreaterThanOrEqual(Math.min(a[0], b[0]));
    expect(punto[0]).toBeLessThanOrEqual(Math.max(a[0], b[0]));
    const quedan = tramo.jornadasBase + siguiente.jornadasBase - 1;
    expect(
      de(d, 'rotulos').some((f) => f.clase.includes('ruta') && f.texto === `${String(quedan)} j`),
    ).toBe(true);
  });
});

describe('los rotulos (criterio 3)', () => {
  const d = componerAtlas(atlas, vista, { modo: 'economico', estacion: 'primavera' });
  const rotulos = de(d, 'rotulos');

  it('nunca se solapan, y la capital siempre esta', () => {
    for (const escala of [0.3, 1, 4]) {
      const puestos = colocarRotulos(rotulos, escala);
      expect(puestos.some((r) => r.clase.includes('capital'))).toBe(true);
      for (const [i, a] of puestos.entries()) {
        for (const b of puestos.slice(i + 1)) {
          const x = cajaDeRotulo(a, escala);
          const y = cajaDeRotulo(b, escala);
          expect(x.x0 < y.x1 && y.x0 < x.x1 && x.y0 < y.y1 && y.y0 < x.y1).toBe(false);
        }
      }
    }
  });

  it('al alejar caben menos, y se quitan antes los de menos prioridad', () => {
    const cerca = colocarRotulos(rotulos, 4);
    const lejos = colocarRotulos(rotulos, 0.3);
    expect(lejos.length).toBeLessThanOrEqual(cerca.length);
    const minimaLejos = Math.min(...lejos.map((r) => r.prioridad ?? 0));
    const quitados = cerca.filter((r) => !lejos.includes(r));
    for (const r of quitados)
      expect(r.prioridad ?? 0).toBeLessThanOrEqual(
        Math.max(minimaLejos, ...lejos.map((x) => x.prioridad ?? 0)),
      );
    // No depende del orden de llegada.
    expect(colocarRotulos([...rotulos].reverse(), 1)).toEqual(colocarRotulos(rotulos, 1));
  });
});

describe('el encuadre (criterio 4)', () => {
  const caja = { x: 0, y: 0, ancho: 1000, alto: 800 };
  const limites = { caja, anchoMinimo: 80 };

  it('acercar deja quieto el punto bajo el dedo', () => {
    const e = encuadreInicial(caja, 1);
    const punto: [number, number] = [300, 200];
    const z = acercar(e, 2, punto, limites);
    const fx = (punto[0] - e.x) / e.ancho;
    const fz = (punto[0] - z.x) / z.ancho;
    expect(fz).toBeCloseTo(fx, 6);
    expect(z.ancho).toBeCloseTo(e.ancho / 2, 6);
  });

  it('tiene limites de zoom y no se sale del mapa', () => {
    let e = encuadreInicial(caja, 1.25);
    for (let i = 0; i < 40; i += 1) e = acercar(e, 2, [500, 400], limites);
    expect(e.ancho).toBe(80);
    for (let i = 0; i < 40; i += 1) e = acercar(e, 0.5, [500, 400], limites);
    expect(e.ancho).toBeLessThanOrEqual(1200);
    e = desplazar(e, 1e6, 1e6, limites);
    expect(e.x + e.ancho / 2).toBeLessThanOrEqual(1000);
    expect(e.y + e.alto / 2).toBeLessThanOrEqual(800);
  });
});

describe('el presupuesto (criterio 5)', () => {
  it('el mayor dibujo, con el mapa de ocho casas entero y en modo logistico, tiene menos de 2000 figuras', () => {
    const { atlas: todo, vista: v } = atlasCompleto();
    const d = componerAtlas(todo, v, { modo: 'logistico', estacion: 'verano' });
    expect(todo.comarcas.length).toBeGreaterThan(150);
    expect(d.figuras.length).toBeLessThan(2000);
  });
});
