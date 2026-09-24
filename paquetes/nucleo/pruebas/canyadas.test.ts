// La Mesta conoce sus cañadas (ficha T-058): la cañada real más cercana, entera, y el camino hasta
// ella, desde el turno 1.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

import { CASAS_DE_OFICIO } from '../src/datos/casas.ts';
import { comarcasDeSuCanyada } from '../src/partidas/canyadas.ts';
import { caminoMasCorto } from '../src/partidas/distancias.ts';
import { fundarPartida } from '../src/partidas/fundar.ts';
import type { Participante } from '../src/partidas/ofertas.ts';
import { prepararPartida } from '../src/partidas/preparar.ts';
import { hitosNuevos } from '../src/reglas/hitos.ts';
import { prestigioDe } from '../src/reglas/prestigio.ts';
import type { EstadoPartida } from '../src/tipos/estado.ts';
import type { IdComarca, IdFeria, IdJugador, IdPartida } from '../src/tipos/ids.ts';
import type { Camino, Mundo } from '../src/tipos/mundo.ts';
import type { Casa, TablasDeReglas } from '../src/tipos/reglas.ts';
import { explicar } from '../src/validacion/validador.ts';
import { validarMundo } from '../src/validacion/validarMundo.ts';
import { mundoMini, tablasMini } from './mundo-mini.ts';

const RUTA = fileURLToPath(new URL('../../mundo/datos/mundo.v1.json', import.meta.url));
const c = (id: string): IdComarca => id as IdComarca;

let peninsula: Mundo;
beforeAll(() => {
  const resultado = validarMundo(JSON.parse(readFileSync(RUTA, 'utf8')) as unknown);
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  peninsula = resultado.valor;
});

/** Las comarcas por las que pasa una cañada, escritas a mano desde los tramos del mundo. */
function comarcasDe(mundo: Mundo, canyada: string): string[] {
  const suyas = new Set<string>();
  for (const camino of mundo.caminos) {
    if (camino.canyada === canyada) suyas.add(camino.desde).add(camino.hasta);
  }
  return [...suyas].sort();
}

/** El mundo mini con cañadas en los tramos que se digan: `desde|hasta` → nombre. */
function miniConCanyadas(canyadas: Readonly<Record<string, string>>): Mundo {
  const mini = mundoMini();
  const caminos: Camino[] = mini.caminos.map((camino) => ({
    ...camino,
    canyada: canyadas[`${camino.desde}|${camino.hasta}`] ?? null,
  }));
  return { ...mini, caminos };
}

/** El primer tramo del mundo mini que toca esa comarca, en orden: para poner cañadas donde haya. */
function tramoDe(mundo: Mundo, comarca: string, sin: string): string {
  const tramo = [...mundo.caminos]
    .filter(
      (t) => (t.desde === comarca || t.hasta === comarca) && t.desde !== sin && t.hasta !== sin,
    )
    .sort((a, b) => `${a.desde}|${a.hasta}`.localeCompare(`${b.desde}|${b.hasta}`))[0];
  if (tramo === undefined) throw new Error(`el mundo mini no tiene tramos de ${comarca}`);
  return `${tramo.desde}|${tramo.hasta}`;
}

describe('la cañada que conoce (T-058 §4.1)', () => {
  it('desde Cameros, la Cañada Real Galiana entera, hasta el Valle de Alcudia', () => {
    const conocidas = comarcasDeSuCanyada(peninsula, c('cameros'));
    const galiana = comarcasDe(peninsula, 'Cañada Real Galiana').filter((id) => id !== 'cameros');
    expect(galiana.length).toBeGreaterThan(5);
    for (const id of galiana) expect(conocidas).toContain(id);
    expect(conocidas).toContain('valle-de-alcudia');
    expect(conocidas).toContain('campo-de-montiel');
    // La capital ya es suya: no se «explora».
    expect(conocidas).not.toContain('cameros');
  });

  it('donde se cruzan dos cañadas se conocen las dos', () => {
    // Por tierra de Segovia pasan la Segoviana y la Soriana Occidental.
    const conocidas = comarcasDeSuCanyada(peninsula, c('tierra-de-segovia'));
    for (const nombre of ['Cañada Real Segoviana', 'Cañada Real Soriana Occidental']) {
      for (const id of comarcasDe(peninsula, nombre).filter((i) => i !== 'tierra-de-segovia')) {
        expect(conocidas, `${nombre}: ${id}`).toContain(id);
      }
    }
  });

  it('lejos de toda cañada, conoce también el camino hasta la más cercana', () => {
    const lejos = c('a-fonsagrada');
    const conocidas = comarcasDeSuCanyada(peninsula, lejos);
    expect(conocidas.length).toBeGreaterThan(0);
    const conCanyada = new Set(
      peninsula.caminos.flatMap((t) => (t.canyada === null ? [] : [t.desde, t.hasta])),
    );
    const cercana = conocidas.find((id) => conCanyada.has(id));
    expect(cercana).toBeDefined();
    // Todo el camino hasta alguna comarca de cañada queda conocido, menos la capital.
    const hastaAlguna = conocidas
      .filter((id) => conCanyada.has(id))
      .some((destino) =>
        caminoMasCorto(peninsula, lejos, destino)
          .filter((id) => id !== lejos)
          .every((id) => conocidas.includes(id)),
      );
    expect(hastaAlguna).toBe(true);
  });

  it('a igual distancia manda la comarca de menor identificador', () => {
    // Desde prueba-llano, prueba-monte y prueba-rio quedan a las mismas jornadas.
    const base = mundoMini();
    const monte = tramoDe(base, 'prueba-monte', 'prueba-llano');
    const rio = tramoDe(base, 'prueba-rio', 'prueba-llano');
    const mundo = miniConCanyadas({ [monte]: 'Cañada del Monte', [rio]: 'Cañada del Río' });
    const conocidas = comarcasDeSuCanyada(mundo, c('prueba-llano'));
    expect(conocidas).toEqual(comarcasDe(mundo, 'Cañada del Monte'));
  });

  it('en un mapa sin cañadas no conoce nada de más', () => {
    expect(comarcasDeSuCanyada(mundoMini(), c('prueba-llano'))).toEqual([]);
  });
});

describe('al fundar la partida', () => {
  /**
   * Las tablas mini a la medida de un solo jugador en siete comarcas (como en preparacion.test.ts),
   * con el permiso de la cañada para la Mesta, que es lo que se prueba.
   */
  function reglasDe(): TablasDeReglas {
    const base = tablasMini();
    const casas = { ...base.casas };
    for (const casa of Object.keys(casas) as Casa[]) {
      casas[casa] = {
        ...casas[casa],
        origenes: [
          { potenciales: { labor: 3 }, rasgos: [], terrenos: [], vecinaConPotencial: null },
        ],
        permisos: { ...casas[casa].permisos, conoceLasCanyadas: casa === 'mesta' },
      };
    }
    return {
      ...base,
      casas,
      arranque: {
        ...base.arranque,
        recorte: {
          ...base.arranque.recorte,
          comarcasPorJugador: 3,
          minimoDeComarcas: 3,
          jornadasEntreCapitales: 2,
          origenesPorCasa: 2,
          laborAltaMinima: 1,
          laborAlta: 4,
          feriasMinimas: 0,
          salMinima: 3,
          hierroMinimo: 3,
        },
      },
    };
  }

  function fundar(casa: Casa, mundo: Mundo): EstadoPartida {
    const reglas = reglasDe();
    const participantes: Participante[] = [{ id: 'uno' as IdJugador, nombre: 'Uno', casa }];
    const preparada = prepararPartida({ mundo, reglas, semilla: 'cañadas', participantes });
    if (!preparada.ok) throw new Error(explicar(preparada.errores));
    const capital = preparada.valor.ofertas['uno']?.[0]?.comarca;
    if (capital === undefined) throw new Error('sin ofertas de origen');
    const estado = fundarPartida({
      preparada: preparada.valor,
      reglas,
      semilla: 'cañadas',
      participantes,
      elecciones: { uno: capital },
      configuracion: {
        nombre: 'Cañadas',
        intervaloMinutos: 60,
        modo: 'vecindad',
        turnosDeTemporada: null,
        reservaMinimaDePan: 30,
        esDePrueba: true,
      },
      id: 'canyadas' as IdPartida,
    });
    if (!estado.ok) throw new Error(explicar(estado.errores));
    return estado.valor;
  }

  it('la Mesta empieza con su cañada explorada, con la foto del turno 1, y oye a sus vecinas', () => {
    // En las tablas del juego la tiene la Mesta, y solo ella.
    for (const [casa, datos] of Object.entries(CASAS_DE_OFICIO)) {
      expect(datos.permisos.conoceLasCanyadas, casa).toBe(casa === 'mesta');
    }
    const base = mundoMini();
    const mundo = miniConCanyadas({ [tramoDe(base, 'prueba-costa', '')]: 'Cañada de la Costa' });
    const estado = fundar('mesta', mundo);
    const yo = estado.jugadores['uno'];
    if (yo === undefined) throw new Error('falta el jugador');
    const esperadas = comarcasDeSuCanyada(mundo, yo.capital);
    expect(esperadas.length).toBeGreaterThan(0);
    for (const id of esperadas) {
      const sabido = yo.conocimiento[id];
      expect(sabido?.nivel, id).toBe('explorada');
      expect(sabido?.turnoUltimaNoticia).toBe(1);
      expect(sabido?.datos?.potenciales).toEqual(estado.comarcas[id]?.potenciales);
    }
    for (const id of esperadas) {
      for (const vecina of mundo.vecinos[id] ?? []) {
        expect(yo.conocimiento[vecina]?.nivel, vecina).not.toBeUndefined();
      }
    }
  });

  it('lo que sabe al empezar no es mérito: ni prestigio de exploración ni primer horizonte', () => {
    const base = mundoMini();
    const mundo = miniConCanyadas({ [tramoDe(base, 'prueba-costa', '')]: 'Cañada de la Costa' });
    const estado = fundar('mesta', mundo);
    const yo = estado.jugadores['uno'];
    if (yo === undefined) throw new Error('falta el jugador');
    const reglas = reglasDe();
    expect(yo.registro.conocidasAlEmpezar).toEqual(comarcasDeSuCanyada(mundo, yo.capital));
    // Solo cuenta la capital, como a cualquier casa recién fundada.
    expect(prestigioDe(estado, yo, reglas).capitulos.exploracion).toBe(
      reglas.prestigio.porComarcaExplorada,
    );
    expect(hitosNuevos(estado, yo, { mejorEsquileoMil: 0, prestigio: 0 }, reglas)).not.toContain(
      'primer-horizonte',
    );
  });

  it('todos saben de oídas dónde están las ferias: el calendario es público (T-059)', () => {
    const base = mundoMini();
    const sierra = base.comarcas['prueba-mina'];
    if (sierra === undefined) throw new Error('el mundo mini ha cambiado');
    const conFeria: Mundo = {
      ...base,
      comarcas: {
        ...base.comarcas,
        'prueba-mina': {
          ...sierra,
          rasgos: [...sierra.rasgos, 'villa-de-feria'],
          ferias: [
            {
              id: 'prueba' as IdFeria,
              nombre: 'Feria de Prueba',
              turnos: [10],
              volumen: 'mediana',
              recursosDestacados: [],
            },
          ],
        },
      },
    };
    const yo = fundar('canteros', conFeria).jugadores['uno'];
    if (yo === undefined) throw new Error('falta el jugador');
    expect(yo.conocimiento['prueba-mina']?.nivel).toBe('oida');
    expect(yo.conocimiento['prueba-mina']?.datos).toBeNull();
  });

  it('una casa sin el permiso solo conoce su capital y, de oídas, sus vecinas', () => {
    const base = mundoMini();
    const mundo = miniConCanyadas({ [tramoDe(base, 'prueba-costa', '')]: 'Cañada de la Costa' });
    const estado = fundar('canteros', mundo);
    const yo = estado.jugadores['uno'];
    if (yo === undefined) throw new Error('falta el jugador');
    const niveles = Object.values(yo.conocimiento).map((k) => k.nivel);
    expect(niveles.filter((n) => n === 'explorada')).toEqual([]);
    expect(niveles.filter((n) => n === 'propia')).toHaveLength(1);
  });
});
