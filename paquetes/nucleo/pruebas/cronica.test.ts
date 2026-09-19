// La cronica (T-044 §4.4 y §4.5): que cada suceso del motor tenga su plantilla y que ningun hueco
// quede sin rellenar, el orden de las secciones, las acciones sugeridas, quien lee que, y la voz.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { CASAS_DE_OFICIO } from '../src/datos/casas.ts';
import { MOTIVOS, NOMBRES_DE_OBRA, NOMBRES_DE_ORDEN, PLANTILLAS } from '../src/datos/plantillas.ts';
import type { FuentesDeCronica } from '../src/reglas/cronica.ts';
import { componerCronica, entradaDe, formatoNumero, rellenar } from '../src/reglas/cronica.ts';
import { EFECTOS_DE_CLIMA } from '../src/reglas/calendario.ts';
import { HALLAZGOS } from '../src/reglas/explorar.ts';
import { resolverTurno } from '../src/resolver.ts';
import { registrarSuceso } from '../src/sucesos.ts';
import type { Cronica, Plantilla, Suceso } from '../src/tipos/cronica.ts';
import type { EstadoPartida } from '../src/tipos/estado.ts';
import {
  ESTADOS_DE_ORDEN,
  FUEROS,
  NIVELES_DE_CONOCIMIENTO,
  TIPOS_DE_OBRA,
} from '../src/tipos/index.ts';
import type { IdComarca, IdJugador } from '../src/tipos/ids.ts';
import { TIPOS_DE_ORDEN } from '../src/tipos/ordenes.ts';
import { TIPOS_DE_EDIFICIO, TIPOS_DE_OBRA_MAYOR } from '../src/tipos/reglas.ts';
import { mundoMini, tablasMini } from './mundo-mini.ts';
import { DOS, UNO, c, conComarca, escenario, mundo, reglas } from './recuas.ts';

// ——— Lo que emite el motor, leido de sus fuentes ——————————————————————————————

const RAIZ = fileURLToPath(new URL('../src/', import.meta.url));

function fuentesDelMotor(): { ruta: string; texto: string }[] {
  const archivos: { ruta: string; texto: string }[] = [];
  const recorrer = (carpeta: string): void => {
    for (const nombre of readdirSync(carpeta)) {
      const ruta = join(carpeta, nombre);
      if (statSync(ruta).isDirectory()) recorrer(ruta);
      else if (ruta.endsWith('.ts') && !ruta.endsWith('.test.ts')) {
        archivos.push({ ruta: ruta.slice(RAIZ.length), texto: readFileSync(ruta, 'utf8') });
      }
    }
  };
  recorrer(RAIZ);
  return archivos;
}

/** La llamada entera a `registrarSuceso` que empieza en `desde`, parentesis equilibrados. */
function llamada(texto: string, desde: number): string {
  let profundidad = 0;
  for (let i = desde; i < texto.length; i += 1) {
    if (texto[i] === '(') profundidad += 1;
    if (texto[i] === ')') {
      profundidad -= 1;
      if (profundidad === 0) return texto.slice(desde, i + 1);
    }
  }
  return texto.slice(desde);
}

/** Las claves del primer objeto literal de la llamada: `{ a: 1, b }` → a, b. */
function clavesDeDatos(llamadaEntera: string): string[] {
  const inicio = llamadaEntera.indexOf('{');
  if (inicio < 0) return [];
  let profundidad = 0;
  let fin = inicio;
  for (let i = inicio; i < llamadaEntera.length; i += 1) {
    if (llamadaEntera[i] === '{') profundidad += 1;
    if (llamadaEntera[i] === '}') {
      profundidad -= 1;
      if (profundidad === 0) {
        fin = i;
        break;
      }
    }
  }
  const cuerpo = llamadaEntera.slice(inicio + 1, fin).replace(/\{[^{}]*\}|\([^()]*\)/g, '');
  const claves: string[] = [];
  for (const parte of cuerpo.split(',')) {
    const clave = /^\s*(?:\.\.\.)?([a-zA-Z]+)/.exec(parte)?.[1];
    if (clave !== undefined) claves.push(clave);
  }
  return claves;
}

/** Tipo de suceso → claves de datos que puede traer, de todas las llamadas del motor. */
function sucesosDelMotor(): Map<string, Set<string>> {
  const tipos = new Map<string, Set<string>>();
  const apuntar = (tipo: string, claves: readonly string[]): void => {
    const conjunto = tipos.get(tipo) ?? new Set<string>();
    for (const clave of claves) conjunto.add(clave);
    tipos.set(tipo, conjunto);
  };
  for (const { texto } of fuentesDelMotor()) {
    for (const coincidencia of texto.matchAll(/registrarSuceso\(/g)) {
      const entera = llamada(texto, coincidencia.index + 'registrarSuceso'.length);
      const claves = clavesDeDatos(entera);
      for (const tipo of entera.matchAll(/'([a-z]+\.[a-z-]+)'/g)) apuntar(tipo[1] ?? '', claves);
    }
  }
  // Los que se componen en tiempo de ejecucion: la escasez y los acontecimientos.
  const escasez = tipos.get('escasez.empieza') ?? new Set(['seguidas']);
  for (const tipo of ['escasez.empieza', 'escasez.sigue', 'escasez.termina'])
    apuntar(tipo, [...escasez]);
  for (const que of ['calendario', 'anuncia', 'empieza', 'termina']) {
    apuntar(`acontecimiento.${que}`, [
      'acontecimiento',
      'tipo',
      'region',
      'turnoInicio',
      'turnosDuracion',
    ]);
  }
  // `prestigio.desglose` esparce los capitulos; `produccion.explotacion` lleva un objeto en variable.
  apuntar('prestigio.desglose', [
    'poblacion',
    'territorio',
    'obras',
    'caminos',
    'comercio',
    'exploracion',
    'ganaderia',
    'industria',
    'hitos',
  ]);
  tipos.delete('');
  return tipos;
}

const EMITIDOS = sucesosDelMotor();
/** Huecos que no salen de los datos del suceso sino de su comarca, su jugador o las tablas. */
const HUECOS_DERIVADOS = new Set(['comarca', 'jugador', 'respuestas']);

function plantillasDe(tipo: string): Plantilla[] {
  const entrada = PLANTILLAS[tipo];
  if (entrada === undefined || entrada === null) return [];
  if ('segun' in entrada)
    return Object.values(entrada.casos).filter((p): p is Plantilla => p !== null);
  return [entrada];
}

describe('cada suceso del motor tiene su plantilla', () => {
  it('el motor emite los tipos conocidos, y cada uno está en la tabla', () => {
    expect(EMITIDOS.size).toBeGreaterThan(90);
    const sinPlantilla = [...EMITIDOS.keys()].filter((tipo) => !(tipo in PLANTILLAS)).sort();
    expect(sinPlantilla).toEqual([]);
  });

  it('no hay plantillas de sucesos que el motor ya no emite', () => {
    const huerfanas = Object.keys(PLANTILLAS)
      .filter((tipo) => !EMITIDOS.has(tipo))
      .sort();
    expect(huerfanas).toEqual([]);
  });

  it('ningún hueco pide un dato que el suceso no trae', () => {
    const malos: string[] = [];
    for (const [tipo, claves] of EMITIDOS) {
      for (const plantilla of plantillasDe(tipo)) {
        for (const texto of [plantilla.texto, plantilla.textoAjeno ?? '']) {
          for (const hueco of texto.matchAll(/\{([a-zA-Z]+)(?::[a-z]+)?\}/g)) {
            const campo = hueco[1] ?? '';
            if (!claves.has(campo) && !HUECOS_DERIVADOS.has(campo))
              malos.push(`${tipo}: {${campo}}`);
          }
        }
      }
    }
    expect(malos).toEqual([]);
  });

  it('las plantillas por casos cubren todos los valores del campo', () => {
    const casos = (tipo: string): string[] => {
      const entrada = PLANTILLAS[tipo];
      return entrada !== null && entrada !== undefined && 'segun' in entrada
        ? Object.keys(entrada.casos).sort()
        : [];
    };
    expect(casos('orden.estado')).toEqual([...ESTADOS_DE_ORDEN].sort());
    expect(casos('conocimiento.cambio')).toEqual([...NIVELES_DE_CONOCIMIENTO].sort());
    expect(casos('comarca.fuero')).toEqual([...FUEROS].sort());
    expect(casos('obra.termina')).toEqual([...TIPOS_DE_OBRA].sort());
    expect(casos('recua.hallazgo')).toEqual([...HALLAZGOS].sort());
    expect(casos('calendario.clima-anunciado')).toEqual([...EFECTOS_DE_CLIMA, 'normal'].sort());
    expect(casos('rebanyo.detenido')).toEqual(['camino-cerrado', 'tierra-ajena']);
    expect(casos('recua.explora')).toEqual(['0', '1']);
    expect(casos('comarca.dehesa')).toEqual(['0', '1']);
  });

  it('cada motivo que el motor puede dar tiene su frase', () => {
    const motivos = new Set<string>();
    for (const { texto } of fuentesDelMotor()) {
      for (const m of texto.matchAll(
        /(?:cancelarOrden|dejarEnEspera)\(ctx, [a-z]+, '([a-z-]+)'/g,
      )) {
        motivos.add(m[1] ?? '');
      }
      for (const tipo of texto.matchAll(/export type Motivo[A-Za-z]* =([^;]*);/g)) {
        for (const m of (tipo[1] ?? '').matchAll(/'([a-z-]+)'/g)) motivos.add(m[1] ?? '');
      }
    }
    for (const m of ['prohibido-por-la-casa', 'ronda-cerrada', 'ronda-ya-elegida']) motivos.add(m);
    expect(motivos.size).toBeGreaterThan(40);
    expect([...motivos].filter((m) => MOTIVOS[m] === undefined).sort()).toEqual([]);
  });

  it('los nombres cubren todos los edificios, obras y órdenes', () => {
    for (const tipo of [...TIPOS_DE_EDIFICIO, ...TIPOS_DE_OBRA_MAYOR]) {
      expect(NOMBRES_DE_OBRA[tipo], tipo).toBeDefined();
    }
    for (const tipo of TIPOS_DE_ORDEN) expect(NOMBRES_DE_ORDEN[tipo], tipo).toBeDefined();
  });
});

// ——— La composicion ——————————————————————————————————————————————————————————

function fuentesCon(estado: EstadoPartida, sucesos: readonly Suceso[]): FuentesDeCronica {
  return { estado, sucesos, turno: estado.turno, mundo, reglas };
}

function sucesos(
  lista: readonly {
    tipo: string;
    datos?: Record<string, number | string>;
    jugador?: IdJugador | null;
    comarca?: IdComarca | null;
  }[],
): Suceso[] {
  const salida: Suceso[] = [];
  for (const s of lista) {
    registrarSuceso(salida, 'obras', s.tipo, s.datos ?? {}, {
      jugador: s.jugador === undefined ? UNO : s.jugador,
      comarca: s.comarca ?? null,
    });
  }
  return salida;
}

describe('la crónica de un turno', () => {
  it('con escasez, obra detenida y recua llegada: las tres, lo urgente primero y con su acción', () => {
    const estado = escenario();
    const turno = sucesos([
      { tipo: 'recua.llega', datos: { recua: 'recua-1' }, comarca: c('prueba-vega') },
      {
        tipo: 'obra.detenida',
        datos: { obra: 'obra-1', que: 'muralla', falta: 'piedra', necesita: 12 },
        comarca: c('prueba-llano'),
      },
      { tipo: 'escasez.empieza', datos: { seguidas: 1 } },
    ]);
    const cronica = componerCronica(UNO, fuentesCon(estado, turno));
    const secciones = cronica.entradas.map((e) => e.seccion);
    // Primero los avisos, en el orden en que pasaron; despues los sucesos propios.
    expect(cronica.entradas.slice(0, 3).map((e) => [e.seccion, e.texto, e.accionSugerida])).toEqual(
      [
        [
          'avisos',
          'La obra de la muralla en Llano de Prueba se detuvo: falta piedra, hacen falta 12.',
          'mercado',
        ],
        ['avisos', 'Falta pan: la gente pasa hambre y deja de crecer.', 'mercado'],
        ['sucesos', 'La recua recua-1 llega a Vega de Prueba.', null],
      ],
    );
    expect(secciones).toEqual([...secciones].sort((a, b) => ORDEN.indexOf(a) - ORDEN.indexOf(b)));
  });

  it('en un turno real, el hambre sale como aviso con su acción', () => {
    const hambre = conComarca(escenario({ almacen: { pan: 0 } }), 'prueba-llano', {
      poblacion: 200,
    });
    const { cronicas } = resolverTurno(hambre, [], mundo, reglas);
    const avisos = cronicas[UNO]?.entradas.filter((e) => e.seccion === 'avisos') ?? [];
    expect(
      avisos.some((e) => e.texto.startsWith('Falta pan') && e.accionSugerida === 'mercado'),
    ).toBe(true);
    expect(cronicas[UNO]?.entradas[0]?.seccion).toBe('avisos');
  });

  it('lleva la fecha del turno que se resolvió', () => {
    const cronica = componerCronica(UNO, fuentesCon(escenario({ turno: 10 }), []));
    expect(cronica.fecha).toBe('Segunda quincena de mayo del año 1');
  });

  it('el resumen económico cuenta lo que entró, lo que salió y para cuánto da el pan', () => {
    const estado = escenario({ almacen: { pan: 120 } });
    const turno = sucesos([
      { tipo: 'almacen.cambio', datos: { recurso: 'pan', delta: 30, total: 0, motivo: 'x' } },
      { tipo: 'almacen.cambio', datos: { recurso: 'maravedis', delta: 12, total: 0, motivo: 'x' } },
      { tipo: 'almacen.cambio', datos: { recurso: 'pan', delta: -20, total: 0, motivo: 'x' } },
      { tipo: 'consumo.pan', datos: { poblacion: 10, cuadrillas: 2, pagado: 12, faltante: 0 } },
    ]);
    const [resumen] = componerCronica(UNO, fuentesCon(estado, turno)).entradas;
    expect(resumen?.texto).toBe(
      'Entraron 30 de pan y 12 maravedís; salieron 20 de pan. Quedan 120 de pan, que dan para 10 turnos al paso de ahora.',
    );
  });
});

const ORDEN = ['avisos', 'sucesos', 'economia', 'rumores', 'hitos'];

describe('quién lee qué', () => {
  const estado = conComarca(escenario({ conDos: true }), 'prueba-costa', { duenyo: DOS });

  it('lo de otro jugador no se ve; lo público sí, con su texto para los demás', () => {
    const turno = sucesos([
      { tipo: 'recua.llega', datos: { recua: 'recua-9' }, jugador: DOS, comarca: c('prueba-vega') },
      { tipo: 'hito.primicia', datos: { hito: 'villa', prestigio: 50, publico: 1 }, jugador: DOS },
    ]);
    const deUno = componerCronica(UNO, fuentesCon(estado, turno)).entradas.map((e) => e.texto);
    expect(deUno).toContain('Casa Dos ha sido la primera casa en lograr «Un pueblo que prospera».');
    expect(deUno.some((t) => t.includes('llega a'))).toBe(false);
    const deDos = componerCronica(DOS, fuentesCon(estado, turno)).entradas.map((e) => e.texto);
    expect(deDos).toContain(
      'La casa es la primera de la partida en «Un pueblo que prospera»: 50 de prestigio más.',
    );
  });

  it('lo público de una comarca que no se conoce no se cuenta', () => {
    const [cambio] = sucesos([
      {
        tipo: 'comarca.incorporada',
        datos: { anterior: '(neutral)' },
        jugador: DOS,
        comarca: c('prueba-costa'),
      },
    ]);
    if (cambio === undefined) throw new Error('falta el suceso');
    const lector = estado.jugadores[UNO];
    if (lector === undefined) throw new Error('falta el jugador');
    const sinConocer = { ...lector, conocimiento: {} };
    expect(entradaDe(cambio, sinConocer, fuentesCon(estado, [cambio]))).toBeNull();
    expect(entradaDe(cambio, lector, fuentesCon(estado, [cambio]))?.texto).toBe(
      'Costa de Prueba entra en el dominio de Casa Dos.',
    );
  });

  it('un motivo prohibido por la casa se explica con el límite de esa casa', () => {
    const [orden] = sucesos([
      {
        tipo: 'orden.estado',
        datos: {
          orden: 'orden-1',
          clase: 'roturar',
          estado: 'cancelada',
          motivo: 'prohibido-por-la-casa',
        },
      },
    ]);
    if (orden === undefined) throw new Error('falta el suceso');
    const lector = estado.jugadores[UNO];
    if (lector === undefined) throw new Error('falta el jugador');
    const conCasasReales = {
      ...fuentesCon(estado, [orden]),
      reglas: { ...reglas, casas: CASAS_DE_OFICIO },
    };
    const texto = entradaDe(orden, { ...lector, casa: 'mesta' }, conCasasReales)?.texto;
    expect(texto).toBe(
      'Se cancela la orden de roturar: no puede roturar, y su pan propio es un 30 % menor: depende del mercado.',
    );
  });
});

describe('la voz', () => {
  it('los números se escriben como manda la RAE y lo opcional se calla si es cero', () => {
    expect(formatoNumero(1234)).toBe('1234');
    expect(formatoNumero(12345)).toBe('12 345');
    expect(formatoNumero(-1234567)).toBe('-1 234 567');
    const fuentes = fuentesCon(escenario(), []);
    const [conSal, sinSal] = sucesos([
      { tipo: 'x.y', datos: { pan: 3, sal: 1 } },
      { tipo: 'x.y', datos: { pan: 3, sal: 0 } },
    ]);
    if (conSal === undefined || sinSal === undefined) throw new Error('faltan sucesos');
    const plantilla = 'faltan {pan} de pan[ y {sal} de sal].';
    expect(rellenar(plantilla, conSal, undefined, fuentes).texto).toBe(
      'Faltan 3 de pan y 1 de sal.',
    );
    expect(rellenar(plantilla, sinSal, undefined, fuentes).texto).toBe('Faltan 3 de pan.');
  });

  it('en partidas enteras no queda ni un hueco, ni un identificador, ni jerga de sistema', () => {
    const cronicas: Cronica[] = [];
    const faltan: string[] = [];
    for (const nombre of ['humo-01', 'humo-02']) {
      const guardada = JSON.parse(
        readFileSync(new URL(`./partidas/${nombre}.json`, import.meta.url), 'utf8'),
      ) as { estadoInicial: EstadoPartida; turnos: { ordenes: [] }[] };
      let estado = guardada.estadoInicial;
      for (const turno of guardada.turnos) {
        const resultado = resolverTurno(estado, turno.ordenes, mundoMini(), tablasMini());
        const fuentes: FuentesDeCronica = {
          estado: resultado.estado,
          sucesos: resultado.sucesos,
          turno: estado.turno,
          mundo: mundoMini(),
          reglas: tablasMini(),
        };
        for (const suceso of resultado.sucesos) {
          for (const lector of Object.values(resultado.estado.jugadores)) {
            const entrada = entradaDe(suceso, lector, fuentes);
            if (entrada !== null) faltan.push(...entrada.faltan.map((f) => `${suceso.tipo}: ${f}`));
          }
        }
        cronicas.push(...Object.values(resultado.cronicas));
        estado = resultado.estado;
      }
    }
    expect(faltan).toEqual([]);
    const textos = cronicas.flatMap((c2) => c2.entradas.map((e) => e.texto));
    expect(textos.length).toBeGreaterThan(50);
    for (const texto of textos) {
      expect(texto, texto).not.toMatch(/[{}!]|undefined|null|NaN|prueba-[a-z]|recua-\d|casa-uno/);
      expect(texto.charAt(0), texto).toBe(texto.charAt(0).toUpperCase());
      expect(texto.endsWith('.'), texto).toBe(true);
    }
  });
});
