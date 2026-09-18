import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import type { ErrorValidacion, Resultado } from '@conquer/nucleo';
import { explicar } from '@conquer/nucleo';

import { cargarCatalogo } from './cargador.ts';
import { informeCobertura, informeLegible } from './cobertura.ts';
import { limpiarJsonc } from './jsonc.ts';
import { validarRegion } from './validarCatalogo.ts';

const CATALOGO = fileURLToPath(new URL('../catalogo', import.meta.url));

function errores<T>(resultado: Resultado<T>): readonly ErrorValidacion[] {
  return resultado.ok ? [] : resultado.errores;
}

function esperarError<T>(resultado: Resultado<T>, ruta: string, contiene: RegExp): void {
  const lista = errores(resultado);
  const encontrado = lista.find((error) => error.ruta === ruta);
  expect(encontrado, `no hay error en "${ruta}":\n${explicar(lista)}`).toBeDefined();
  expect(encontrado?.mensaje ?? '').toMatch(contiene);
}

/** La comarca de ejemplo, en bruto, para poder estropearla campo a campo. */
function comarca(cambios: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'ejemplo-campina',
    nombre: 'Campina de Ejemplo',
    cabecera: 'Villaejemplo',
    region: '00-ejemplo',
    centro: [-4900, 41300],
    terreno: 'llano',
    potenciales: { labor: 4, monte: 1, pasto: 2, piedra: 1, hierro: 0, sal: 0, pesca: 0 },
    solares: 5,
    poblacionInicial: 60,
    localidades: [{ nombre: 'Villaejemplo', coord: [-4900, 41300], cabecera: true }],
    rasgos: [],
    esOrigen: true,
    nota: null,
    ...cambios,
  };
}

describe('lectura de .jsonc', () => {
  it('quita comentarios de linea, de bloque y comas sobrantes', () => {
    const texto = `{
      // un comentario
      "a": 1, /* otro */
      "b": [1, 2,],
    }`;
    expect(JSON.parse(limpiarJsonc(texto))).toEqual({ a: 1, b: [1, 2] });
  });

  it('no toca las barras que van dentro de una cadena', () => {
    expect(JSON.parse(limpiarJsonc('{"url": "a//b", "otro": "/* no */"}'))).toEqual({
      url: 'a//b',
      otro: '/* no */',
    });
  });
});

describe('validacion de una region del catalogo', () => {
  it('acepta el catalogo del repositorio', () => {
    const resultado = cargarCatalogo(CATALOGO);
    expect(explicar(errores(resultado))).toBe('');
    const ejemplo = resultado.ok
      ? resultado.valor.filter((comarca) => comarca.region === '00-ejemplo')
      : [];
    expect(ejemplo).toHaveLength(3);
  });

  it('exige una sola cabecera, y que coincida con el campo cabecera', () => {
    esperarError(
      validarRegion(
        [
          comarca({
            localidades: [
              { nombre: 'Villaejemplo', coord: [-4900, 41300], cabecera: true },
              { nombre: 'Otra', coord: [-4890, 41290], cabecera: true },
            ],
          }),
        ],
        'x',
      ),
      'ejemplo-campina.localidades',
      /exactamente una localidad cabecera/,
    );
    esperarError(
      validarRegion([comarca({ cabecera: 'Villaotra' })], 'x'),
      'ejemplo-campina.cabecera',
      /la localidad marcada es/,
    );
  });

  it('rechaza una localidad demasiado lejos de su comarca', () => {
    esperarError(
      validarRegion(
        [
          comarca({
            localidades: [
              { nombre: 'Villaejemplo', coord: [-4900, 41300], cabecera: true },
              { nombre: 'Lejos', coord: [-3000, 41300], cabecera: null },
            ],
          }),
        ],
        'x',
      ),
      'ejemplo-campina.localidades.Lejos',
      /km del centro/,
    );
  });

  it('rechaza un centro fuera del recuadro peninsular', () => {
    esperarError(
      validarRegion([comarca({ centro: [12000, 41300] })], 'x'),
      'ejemplo-campina.centro',
      /recuadro peninsular/,
    );
  });

  it('exige el rasgo historico para la sal y para el hierro', () => {
    esperarError(
      validarRegion(
        [
          comarca({
            potenciales: { labor: 2, monte: 1, pasto: 2, piedra: 1, hierro: 0, sal: 4, pesca: 0 },
          }),
        ],
        'x',
      ),
      'ejemplo-campina.potenciales.sal',
      /salinas-historicas/,
    );
    esperarError(
      validarRegion(
        [
          comarca({
            potenciales: { labor: 2, monte: 1, pasto: 2, piedra: 1, hierro: 4, sal: 0, pesca: 0 },
          }),
        ],
        'x',
      ),
      'ejemplo-campina.potenciales.hierro',
      /vena-de-hierro/,
    );
  });

  it('solo deja pescar en la costa y labrar mucho en llano o vega', () => {
    esperarError(
      validarRegion(
        [
          comarca({
            potenciales: { labor: 2, monte: 1, pasto: 2, piedra: 1, hierro: 0, sal: 0, pesca: 3 },
          }),
        ],
        'x',
      ),
      'ejemplo-campina.potenciales.pesca',
      /comarcas de costa/,
    );
    esperarError(
      validarRegion(
        [
          comarca({
            terreno: 'sierra',
            potenciales: { labor: 4, monte: 3, pasto: 3, piedra: 2, hierro: 0, sal: 0, pesca: 0 },
          }),
        ],
        'x',
      ),
      'ejemplo-campina.potenciales.labor',
      /llano o vega/,
    );
  });

  it('rechaza el paraiso y el erial', () => {
    esperarError(
      validarRegion(
        [
          comarca({
            terreno: 'vega',
            potenciales: { labor: 5, monte: 2, pasto: 3, piedra: 2, hierro: 4, sal: 4, pesca: 0 },
            rasgos: ['salinas-historicas', 'vena-de-hierro'],
            solares: 8,
          }),
        ],
        'x',
      ),
      'ejemplo-campina.potenciales',
      /entre 6 y 18/,
    );
    esperarError(
      validarRegion(
        [
          comarca({
            potenciales: { labor: 1, monte: 1, pasto: 1, piedra: 1, hierro: 0, sal: 0, pesca: 0 },
            solares: 4,
          }),
        ],
        'x',
      ),
      'ejemplo-campina.potenciales',
      /entre 6 y 18/,
    );
  });

  it('exige solares coherentes con el potencial de la comarca', () => {
    esperarError(
      validarRegion([comarca({ solares: 8 })], 'x'),
      'ejemplo-campina.solares',
      /lo coherente serian/,
    );
  });

  it('rechaza rasgos que no estan en el catalogo cerrado', () => {
    esperarError(
      validarRegion([comarca({ rasgos: ['minas-de-oro'] })], 'x'),
      'ejemplo-campina.rasgos',
      /catalogo cerrado/,
    );
  });

  it('exige nota cuando un potencial se aparta de lo normal en ese terreno', () => {
    const rara = comarca({
      terreno: 'llano',
      potenciales: { labor: 2, monte: 5, pasto: 2, piedra: 1, hierro: 0, sal: 0, pesca: 0 },
      solares: 6,
    });
    esperarError(validarRegion([rara], 'x'), 'ejemplo-campina.nota', /justifique monte 5/);
    const conNota = {
      ...rara,
      nota: 'Encinar denso poco habitual en la campina, documentado desde el siglo XIV.',
    };
    expect(errores(validarRegion([conNota], 'x'))).toEqual([]);
  });

  it('rechaza identificadores repetidos entre regiones', () => {
    const directorio = mkdtempSync(join(tmpdir(), 'catalogo-'));
    writeFileSync(join(directorio, '01-una.jsonc'), JSON.stringify([comarca()]));
    writeFileSync(
      join(directorio, '02-otra.jsonc'),
      JSON.stringify([comarca({ region: '02-otra' })]),
    );
    esperarError(cargarCatalogo(directorio), 'ejemplo-campina', /identificador repetido/);
  });

  it('dice el archivo y la linea cuando el jsonc esta roto', () => {
    const directorio = mkdtempSync(join(tmpdir(), 'catalogo-'));
    writeFileSync(join(directorio, '01-rota.jsonc'), '[\n  { "id": "mal" \n');
    const resultado = cargarCatalogo(directorio);
    expect(errores(resultado)[0]?.ruta).toMatch(/01-rota\.jsonc/);
    expect(errores(resultado)[0]?.mensaje).toMatch(/no se puede leer/);
  });
});

describe('informe de cobertura', () => {
  it('cuenta comarcas, origenes, ferias y recursos estrategicos', () => {
    const resultado = cargarCatalogo(CATALOGO);
    if (!resultado.ok) throw new Error(explicar(resultado.errores));
    const informe = informeCobertura(resultado.valor);
    expect(informe.total).toBe(resultado.valor.length);
    const region = informe.regiones.find((candidata) => candidata.region === '00-ejemplo');
    expect(region?.comarcas).toBe(3);
    expect(region?.origenes).toBe(2);
    // Las ferias ya no viven en la ficha de la comarca, sino en `ferias.jsonc` (T-014).
    expect(region?.ferias).toBe(0);
    expect(region?.conSal).toEqual(['ejemplo-salinas']);
    expect(region?.conHierro).toEqual([]);
    expect(region?.mediaPotencialMil.monte).toBe(2667);
    expect(informeLegible(informe)).toMatch(/00-ejemplo · 3 comarcas/);
  });
});

describe('el archivo de ejemplo se lee tal cual esta en el repositorio', () => {
  it('conserva sus comentarios', () => {
    const texto = readFileSync(join(CATALOGO, '00-ejemplo.jsonc'), 'utf8');
    expect(texto).toMatch(/\/\/ Region de ejemplo/);
  });
});

describe('ortografia del texto visible del catalogo (T-016)', () => {
  // Las formas ASCII que delatan una nota escrita sin tildes ni eñes (con limites de palabra
  // Unicode: en JavaScript `\b` corta en cada letra acentuada). Los `id` y los rasgos
  // (`vinyedo`, `canyada`) siguen en ASCII porque son claves; las notas son texto que se lee.
  const DELATORAS =
    /(?<!\p{L})(anyo|anyos|montanya|montanyas|canyada|canyadas|senyor|senyores|senyorio|vinya|vinyedo|panyo|panyos|campinya|castanyar|rebanyo|rebanyos|pequenya|historico|historica|epoca|peninsula|region|tambien|despues|aqui|mas|rio|via|ria|salia|azucar|Avila|Leon|Cordoba|Cadiz|Malaga|Jaen)(?!\p{L})/u;

  it('la guarda salta si se reintroduce una nota en ASCII', () => {
    expect(DELATORAS.test('El pinar de la montanya se corta cada anyo')).toBe(true);
    expect(DELATORAS.test('El Páramo Leonés y la Lezíria do Tejo')).toBe(false);
  });

  it('ninguna nota ni nombre visible usa las formas ASCII delatoras', () => {
    const texto = readdirSync(CATALOGO)
      .filter((archivo) => archivo.endsWith('.jsonc') && !archivo.startsWith('00-'))
      .map((archivo) => readFileSync(join(CATALOGO, archivo), 'utf8'))
      .join('\n');
    const campos = [...texto.matchAll(/"(?:nota|nombre|cabecera)": "((?:[^"\\]|\\.)*)"/g)].map(
      (coincidencia) => coincidencia[1] ?? '',
    );
    const malos = campos.filter((valor) => DELATORAS.test(valor));
    expect(malos).toEqual([]);
  });
});
