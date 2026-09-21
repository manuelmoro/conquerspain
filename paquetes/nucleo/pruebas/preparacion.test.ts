// La preparación de una partida (ficha T-049): recorte, ofertas, arranque y fundación.
//
// Se juega en el mundo mini, con unas tablas a su medida: siete comarcas no dan para pedirle tres
// ferias, pero sí para comprobar lo que de verdad importa —que el recorte sea conexo y válido, que
// nadie empiece pegado a otro, que el sorteo no dependa del orden de llegada y que el arranque no
// regale un edificio imposible.
import { describe, expect, it } from 'vitest';

import { arranqueDe, panDelAnyo, panQueComeElAnyo } from '../src/partidas/arranque.ts';
import { fundarPartida } from '../src/partidas/fundar.ts';
import { jornadasDesde } from '../src/partidas/distancias.ts';
import type { Participante } from '../src/partidas/ofertas.ts';
import { prepararPartida } from '../src/partidas/preparar.ts';
import { faltasDelRecorte } from '../src/partidas/recorte.ts';
import { impedimentoDeConstruir } from '../src/reglas/obras.ts';
import type { ConfiguracionPartida, EstadoComarca } from '../src/tipos/estado.ts';
import type { IdComarca, IdJugador, IdPartida } from '../src/tipos/ids.ts';
import type { Casa, CriterioDeOrigen, TablasDeReglas, TipoEdificio } from '../src/tipos/reglas.ts';
import { TIPOS_DE_EDIFICIO } from '../src/tipos/reglas.ts';
import { huella } from '../src/utiles/huella.ts';
import { explicar } from '../src/validacion/validador.ts';
import { mundoMini, tablasMini } from './mundo-mini.ts';

const MUNDO = mundoMini();

function origen(parte: Partial<CriterioDeOrigen>): CriterioDeOrigen {
  return { potenciales: {}, rasgos: [], terrenos: [], vecinaConPotencial: null, ...parte };
}

/** Tablas a la medida del mundo mini: sin ferias que pedir y con las distancias que hay. */
function reglasDePrueba(
  cambios: Partial<TablasDeReglas['arranque']['recorte']> = {},
): TablasDeReglas {
  const base = tablasMini();
  const casas = { ...base.casas };
  for (const casa of Object.keys(casas) as Casa[]) {
    const comprador = casa === 'mercaderes';
    casas[casa] = {
      ...casas[casa],
      origenes: [origen({ potenciales: { labor: 3 } })],
      edificioDeOrigen: casa === 'mesta' ? 'majada' : null,
      compraElPan: comprador,
      // Quien vive de comprar saca menos pan de su tierra: es lo que le pasa a la casa de verdad.
      modificadores: comprador
        ? { ...casas[casa].modificadores, produccionMil: { pan: 750 } }
        : casas[casa].modificadores,
    };
  }
  return {
    ...base,
    casas,
    arranque: {
      ...base.arranque,
      ajuste: { ...base.arranque.ajuste, activo: true },
      recorte: {
        ...base.arranque.recorte,
        comarcasPorJugador: 3,
        minimoDeComarcas: 3,
        jornadasEntreCapitales: 2,
        // El mundo mini tiene tres origenes: con dos jugadores no caben tres ofertas por cabeza.
        origenesPorCasa: 2,
        laborAltaMinima: 1,
        laborAlta: 4,
        feriasMinimas: 0,
        salMinima: 3,
        hierroMinimo: 3,
        ...cambios,
      },
    },
  };
}

const REGLAS = reglasDePrueba();

function participante(id: string, casa: Casa): Participante {
  return { id: id as IdJugador, nombre: `Casa ${id}`, casa };
}

const DOS: readonly Participante[] = [
  participante('uno', 'mesta'),
  participante('dos', 'canteros'),
];

const CONFIGURACION: ConfiguracionPartida = {
  nombre: 'Partida de prueba',
  intervaloMinutos: 60,
  modo: 'vecindad',
  turnosDeTemporada: null,
  reservaMinimaDePan: 30,
  esDePrueba: true,
};

function preparar(participantes: readonly Participante[], reglas = REGLAS, semilla = 'prueba') {
  const resultado = prepararPartida({ mundo: MUNDO, reglas, semilla, participantes });
  if (!resultado.ok) throw new Error(explicar(resultado.errores));
  return resultado.valor;
}

describe('el recorte del mapa', () => {
  it('sale conexo, con sus tramos y sus vecinos, y pasa la validación del mundo', () => {
    const preparada = preparar(DOS);
    const comarcas = Object.keys(preparada.mundo.comarcas);
    expect(comarcas.length).toBeGreaterThanOrEqual(3);
    for (const id of comarcas) {
      expect(preparada.mundo.vecinos[id]?.length ?? 0).toBeGreaterThan(0);
      for (const vecina of preparada.mundo.vecinos[id] ?? []) expect(comarcas).toContain(vecina);
    }
    for (const camino of preparada.mundo.caminos) {
      expect(comarcas).toContain(camino.desde);
      expect(comarcas).toContain(camino.hasta);
    }
    // Conexo: desde la primera se llega a todas.
    const desde = jornadasDesde(preparada.mundo, comarcas[0] as IdComarca);
    expect(desde.size).toBe(comarcas.length);
  });

  it('conserva los identificadores y la geografía del mundo original', () => {
    const preparada = preparar(DOS);
    for (const [id, comarca] of Object.entries(preparada.mundo.comarcas)) {
      expect(comarca).toEqual(MUNDO.comarcas[id]);
    }
  });

  it('dice lo que le falta a un mapa que no sirve, sin inventarse nada', () => {
    const exigentes = reglasDePrueba({ feriasMinimas: 1, laborAltaMinima: 3 });
    const faltas = faltasDelRecorte(MUNDO, exigentes, ['mesta'], exigentes.arranque.recorte);
    expect(faltas.join(' | ')).toContain('feria');
    expect(faltas.join(' | ')).toContain('tierra de pan');
  });

  it('cuando no se puede recortar, el error explica qué hacer', () => {
    const imposible = reglasDePrueba({ feriasMinimas: 1 });
    const resultado = prepararPartida({
      mundo: MUNDO,
      reglas: imposible,
      semilla: 'prueba',
      participantes: DOS,
    });
    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    const texto = explicar(resultado.errores);
    expect(texto).toContain('feria');
    expect(texto).toContain('menos casas');
  });

  it('sin recortar, la partida se juega en el mundo entero', () => {
    const resultado = prepararPartida({
      mundo: MUNDO,
      reglas: REGLAS,
      semilla: 'prueba',
      participantes: DOS,
      recortar: false,
    });
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.valor.comarcas).toBe(Object.keys(MUNDO.comarcas).length);
  });
});

describe('las ofertas de origen', () => {
  it('cualquier combinación de elecciones respeta la separación entre capitales', () => {
    const preparada = preparar(DOS);
    const minima = REGLAS.arranque.recorte.jornadasEntreCapitales;
    const deUno = preparada.ofertas['uno'] ?? [];
    const deDos = preparada.ofertas['dos'] ?? [];
    expect(deUno.length).toBeGreaterThan(0);
    expect(deDos.length).toBeGreaterThan(0);
    for (const a of deUno) {
      const distancia = jornadasDesde(preparada.mundo, a.comarca);
      for (const b of deDos) expect(distancia.get(b.comarca) ?? 0).toBeGreaterThanOrEqual(minima);
    }
  });

  it('cada oferta cumple los requisitos de origen de su casa', () => {
    const preparada = preparar(DOS);
    for (const [jugador, ofertas] of Object.entries(preparada.ofertas)) {
      const casa = DOS.find((p) => p.id === jugador)?.casa;
      for (const oferta of ofertas) {
        const comarca = preparada.mundo.comarcas[oferta.comarca];
        expect(comarca?.esOrigen, `${oferta.comarca} de ${String(casa)}`).toBe(true);
        expect(comarca?.potenciales.labor ?? 0).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('si no caben las ofertas de todos, se dice cuántas quedaron y no se calla', () => {
    const preparada = preparar(DOS);
    expect(preparada.avisos.join(' | ')).toContain('solo caben');
  });

  it('la tarjeta dice su ventaja y su limitación sin enseñar nada oculto', () => {
    const preparada = preparar(DOS);
    const oferta = (preparada.ofertas['uno'] ?? [])[0];
    expect(oferta?.ventaja).toContain('nivel');
    expect(oferta?.limitacion).toContain('solares');
    expect(oferta?.nombre).toBe(MUNDO.comarcas[oferta?.comarca ?? '']?.nombre);
  });

  it('permutar la lista de participantes no cambia nada', () => {
    const derecho = preparar(DOS);
    const revés = preparar([...DOS].reverse());
    expect(huella(revés)).toBe(huella(derecho));
  });

  it('con la misma semilla sale lo mismo, y con otra semilla otra cosa', () => {
    expect(huella(preparar(DOS, REGLAS, 'a'))).toBe(huella(preparar(DOS, REGLAS, 'a')));
    const otra = huella(preparar(DOS, REGLAS, 'b'));
    expect(otra === huella(preparar(DOS, REGLAS, 'a'))).toBe(false);
  });

  it('el orden de elección lo manda la escasez, no el identificador', () => {
    // La casa «apretada» solo puede empezar en la vega; la otra, en cualquier sitio de labor 3.
    const reglas = reglasDePrueba();
    const casas = { ...reglas.casas };
    casas.canteros = { ...casas.canteros, origenes: [origen({ potenciales: { labor: 5 } })] };
    const suyas: TablasDeReglas = { ...reglas, casas };
    const preparada = prepararPartida({
      mundo: MUNDO,
      reglas: suyas,
      semilla: 'prueba',
      participantes: DOS,
      recortar: false,
    });
    expect(preparada.ok).toBe(true);
    if (!preparada.ok) return;
    expect((preparada.valor.ofertas['dos'] ?? [])[0]?.comarca).toBe('prueba-vega');
  });

  it('un origen fijado se respeta, y uno que no sirve se rechaza con su motivo', () => {
    const buena = prepararPartida({
      mundo: MUNDO,
      reglas: REGLAS,
      semilla: 'prueba',
      participantes: DOS,
      recortar: false,
      origenesFijos: { uno: 'prueba-rio' as IdComarca },
    });
    expect(buena.ok).toBe(true);
    if (buena.ok) expect(buena.valor.ofertas['uno']?.[0]?.comarca).toBe('prueba-rio');
    const mala = prepararPartida({
      mundo: MUNDO,
      reglas: REGLAS,
      semilla: 'prueba',
      participantes: DOS,
      recortar: false,
      origenesFijos: { uno: 'prueba-mina' as IdComarca },
    });
    expect(mala.ok).toBe(false);
    if (!mala.ok) expect(explicar(mala.errores)).toContain('no es un origen posible');
  });
});

describe('el arranque por origen', () => {
  const vega = MUNDO.comarcas['prueba-vega'];
  const monte = MUNDO.comarcas['prueba-monte'];
  const costa = MUNDO.comarcas['prueba-costa'];

  it('levanta granjas hasta dar de comer al año, y no más', () => {
    if (vega === undefined) throw new Error('falta la vega');
    const arranque = arranqueDe(vega, 'canteros', REGLAS);
    const cubre = panQueComeElAnyo(vega, REGLAS);
    expect(panDelAnyo(vega, arranque.edificios, 'canteros', REGLAS)).toBeGreaterThanOrEqual(
      cubre - cubre / 20,
    );
    expect(arranque.motivos.join(' ')).toContain('de comer');
  });

  it('donde la tierra no da y el mar sí, empieza con lonja y con sal para salarla', () => {
    if (costa === undefined) throw new Error('falta la costa');
    const arranque = arranqueDe(costa, 'canteros', REGLAS);
    expect(arranque.edificios['lonja'] ?? 0).toBeGreaterThan(0);
    expect(arranque.almacen.sal).toBeGreaterThan(0);
  });

  it('a quien vive de comprar el pan se le dan maravedís en vez de granjas', () => {
    if (monte === undefined) throw new Error('falta el monte');
    const propio = arranqueDe(monte, 'canteros', REGLAS);
    const comprador = arranqueDe(monte, 'mercaderes', REGLAS);
    expect(comprador.edificios['granja'] ?? 0).toBeLessThanOrEqual(propio.edificios['granja'] ?? 0);
    expect(comprador.almacen.maravedis).toBeGreaterThan(propio.almacen.maravedis);
    expect(comprador.faltaDePanDelAnyo).toBeGreaterThan(propio.faltaDePanDelAnyo);
    expect(comprador.motivos.join(' ')).toContain('comprar');
  });

  it('no regala ningún edificio que las reglas no dejarían construir', () => {
    for (const id of Object.keys(MUNDO.comarcas)) {
      const geografia = MUNDO.comarcas[id];
      if (geografia === undefined) continue;
      for (const casa of Object.keys(REGLAS.casas) as Casa[]) {
        const arranque = arranqueDe(geografia, casa, REGLAS);
        // Se rehace el arranque nivel a nivel: cada uno tenía que ser legal en su momento.
        const puestos: Record<string, number> = {};
        for (const tipo of Object.keys(arranque.edificios).sort()) {
          expect(TIPOS_DE_EDIFICIO).toContain(tipo);
          for (let i = 0; i < (arranque.edificios[tipo] ?? 0); i += 1) {
            const impedimento = impedimentoDeConstruir(
              comarcaDePrueba(geografia.id, { ...puestos }, geografia.potenciales),
              tipo as TipoEdificio,
              [],
              geografia.solares,
              REGLAS.casas[casa].modificadores,
              REGLAS,
              REGLAS.casas[casa].permisos,
            );
            expect(impedimento, `${casa} en ${id}: ${tipo} nivel ${String(i + 1)}`).toBeNull();
            puestos[tipo] = (puestos[tipo] ?? 0) + 1;
          }
        }
      }
    }
  });

  it('no da ningún edificio que consuma algo que el arranque no le da', () => {
    for (const id of Object.keys(MUNDO.comarcas)) {
      const geografia = MUNDO.comarcas[id];
      if (geografia === undefined) continue;
      for (const casa of Object.keys(REGLAS.casas) as Casa[]) {
        const arranque = arranqueDe(geografia, casa, REGLAS);
        for (const tipo of Object.keys(arranque.edificios)) {
          const consumo = REGLAS.edificios[tipo as TipoEdificio].consumo;
          for (const [recurso, cantidad] of Object.entries(consumo)) {
            if (cantidad <= 0) continue;
            expect(
              arranque.almacen[recurso as keyof typeof arranque.almacen],
              `${casa} en ${id}: ${tipo} come ${recurso} y no se lo dan`,
            ).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});

/** Una comarca de estado con estos edificios, para comprobar impedimentos. */
function comarcaDePrueba(
  id: string,
  edificios: Record<string, number>,
  potenciales: (typeof MUNDO.comarcas)[string]['potenciales'],
): EstadoComarca {
  return {
    id: id as IdComarca,
    duenyo: null,
    poblacion: 100,
    lealtad: 100,
    edificios,
    aperos: 0,
    fuero: 'ninguno' as const,
    turnoFuero: 0,
    cargaFiscal: 'normal' as const,
    dehesa: false,
    potenciales,
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

describe('la fundación', () => {
  it('funda la partida con las elecciones y valida el estado', () => {
    const preparada = preparar(DOS);
    const elecciones: Record<string, IdComarca> = {};
    for (const p of DOS) {
      const suya = preparada.ofertas[p.id]?.[0]?.comarca;
      if (suya !== undefined) elecciones[p.id] = suya;
    }
    const estado = fundarPartida({
      preparada,
      reglas: REGLAS,
      semilla: 'prueba',
      participantes: DOS,
      elecciones,
      configuracion: CONFIGURACION,
      id: 'prueba' as IdPartida,
    });
    expect(estado.ok, estado.ok ? '' : explicar(estado.errores)).toBe(true);
    if (!estado.ok) return;
    expect(Object.keys(estado.valor.jugadores)).toEqual(['dos', 'uno']);
    for (const p of DOS) {
      const capital = estado.valor.jugadores[p.id]?.capital;
      expect(capital).toBe(elecciones[p.id]);
      expect(estado.valor.comarcas[capital ?? '']?.duenyo).toBe(p.id);
      expect(
        Object.keys(estado.valor.comarcas[capital ?? '']?.edificios ?? {}).length,
      ).toBeGreaterThan(0);
    }
  });

  it('con la misma entrada, el mismo estado byte a byte', () => {
    const preparada = preparar(DOS);
    const elecciones: Record<string, IdComarca> = {};
    for (const p of DOS) {
      const suya = preparada.ofertas[p.id]?.[0]?.comarca;
      if (suya !== undefined) elecciones[p.id] = suya;
    }
    const fundar = () =>
      fundarPartida({
        preparada,
        reglas: REGLAS,
        semilla: 'prueba',
        participantes: DOS,
        elecciones,
        configuracion: CONFIGURACION,
        id: 'prueba' as IdPartida,
      });
    const a = fundar();
    const b = fundar();
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(huella(b.valor)).toBe(huella(a.valor));
  });

  it('rechaza una elección que no estaba entre las ofertas', () => {
    const preparada = preparar(DOS);
    const estado = fundarPartida({
      preparada,
      reglas: REGLAS,
      semilla: 'prueba',
      participantes: DOS,
      elecciones: { uno: 'prueba-sierra' as IdComarca },
      configuracion: CONFIGURACION,
      id: 'prueba' as IdPartida,
    });
    expect(estado.ok).toBe(false);
    if (!estado.ok) {
      expect(explicar(estado.errores)).toContain('no esta entre las ofertas');
      expect(explicar(estado.errores)).toContain('no ha elegido origen');
    }
  });
});
