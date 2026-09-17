// Generacion reproducible del mapa: catalogo + fuentes abiertas → mundo.v1.json.
//
// Dos ejecuciones seguidas producen ficheros identicos: las semillas de relleno salen del azar con
// semilla del nucleo y todas las coordenadas se redondean a enteros al final.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Delaunay } from 'd3-delaunay';

import type { Camino, ComarcaMundo, IdComarca, Mundo, Terreno } from '@conquer/nucleo';
import { azarDeTexto, canonico, comparar, explicar, validarMundo } from '@conquer/nucleo';
import type { ComarcaCatalogo } from '@conquer/mundo';
import { cargarCatalogoOFallar, esRasgo } from '@conquer/mundo';
import { obtener, fuentes } from './descargar.ts';
import { idComarca, idFeria } from './identificadores.ts';
import type { Punto } from './geometria.ts';
import {
  area,
  centroide,
  dentroDelPoligono,
  porcionSobreTierra,
  recortarATierra,
  simplificar,
} from './geometria.ts';
import {
  ALTO,
  ANCHO,
  aKilometros,
  proyectar,
  proyectarMilesimas,
  redondear,
} from './proyeccion.ts';
import {
  JORNADAS_POR_TERRENO,
  cargarRelieve,
  dentroDeCaja,
  potencialesDe,
  terrenoDe,
  terrenoDeTramo,
} from './terreno.ts';

const RAIZ = fileURLToPath(new URL('../../..', import.meta.url));
export const RUTA_MUNDO = join(RAIZ, 'paquetes/mundo/datos/mundo.v1.json');
export const RUTA_INFORME = join(RAIZ, 'paquetes/mundo/datos/informe-atlas.md');
const CATALOGO = join(RAIZ, 'paquetes/mundo/catalogo');

const SEMILLA_RELLENO = 'atlas-relleno-1492';
const SEPARACION = 40.5; // unidades de mapa ≈ 45 km entre semillas de relleno
const DISTANCIA_MINIMA_AL_CATALOGO = 27;
const TOLERANCIA_COSTA = 0.7;
const TOLERANCIA_CELDA = 0.6;
const AREA_MINIMA = 200;
const TIERRA_MINIMA_DE_UN_TRAMO = 600; // por mil

interface Semilla {
  readonly id: string;
  readonly punto: Punto;
  readonly catalogo: ComarcaCatalogo | null;
}

interface RasgoGeo {
  readonly properties: Record<string, unknown>;
  readonly geometry: { type: string; coordinates: unknown };
}

function anillosDe(rasgo: RasgoGeo): number[][][][] {
  return rasgo.geometry.type === 'MultiPolygon'
    ? (rasgo.geometry.coordinates as number[][][][])
    : [rasgo.geometry.coordinates as number[][][]];
}

function paisesDe(texto: string): Map<string, RasgoGeo> {
  const datos = JSON.parse(texto) as { features: RasgoGeo[] };
  const paises = new Map<string, RasgoGeo>();
  for (const rasgo of datos.features) {
    const codigo = rasgo.properties['ADM0_A3'];
    if (typeof codigo === 'string') paises.set(codigo, rasgo);
  }
  return paises;
}

function mayorAnillo(rasgo: RasgoGeo): number[][] {
  const exteriores = anillosDe(rasgo).map((poligono) => poligono[0] ?? []);
  return exteriores.sort((a, b) => b.length - a.length)[0] ?? [];
}

function proyectarAnillo(anillo: number[][]): Punto[] {
  return anillo.map((punto) => proyectar(punto[0] ?? 0, punto[1] ?? 0));
}

/** Los anillos de tierra jugable: Espanya peninsular, Portugal continental, Andorra y Gibraltar. */
async function tierraPeninsular(): Promise<{ anillos: Punto[][]; sinSimplificar: Punto[][] }> {
  const fuenteMapa = fuentes().find((fuente) => fuente.id === 'countries');
  if (fuenteMapa === undefined) throw new Error('Falta la fuente "countries" en fuentes.json');
  const paises = paisesDe(await obtener(fuenteMapa));

  const anillos: Punto[][] = [];
  const sinSimplificar: Punto[][] = [];
  for (const codigo of ['ESP', 'PRT', 'AND', 'GIB']) {
    const pais = paises.get(codigo);
    if (pais === undefined) throw new Error(`Natural Earth no trae el pais "${codigo}"`);
    const proyectado = proyectarAnillo(mayorAnillo(pais));
    sinSimplificar.push(proyectado);
    anillos.push(simplificar(proyectado, TOLERANCIA_COSTA));
  }
  return { anillos, sinSimplificar };
}

function semillasDelCatalogo(): Semilla[] {
  const comarcas = cargarCatalogoOFallar(CATALOGO).filter(
    // La region 00 es el ejemplo del formato: no entra en el mundo real.
    (comarca) => !comarca.region.startsWith('00-'),
  );
  return comarcas
    .map((comarca) => ({
      id: comarca.id,
      punto: proyectarMilesimas(comarca.centro[0], comarca.centro[1]),
      catalogo: comarca,
    }))
    .sort((a, b) => comparar(a.id, b.id));
}

/** Malla hexagonal perturbada que rellena la tierra que el catalogo aun no cubre. */
function semillasDeRelleno(tierra: readonly Punto[][], delCatalogo: readonly Semilla[]): Semilla[] {
  const azar = azarDeTexto(SEMILLA_RELLENO);
  const relleno: Semilla[] = [];
  let fila = 0;
  for (let y = 0; y < ALTO + SEPARACION; y += SEPARACION * 0.866) {
    for (let x = fila % 2 === 0 ? 0 : SEPARACION / 2; x < ANCHO + SEPARACION; x += SEPARACION) {
      const punto: Punto = [x + azar.entreInclusive(-8, 8), y + azar.entreInclusive(-8, 8)];
      if (!tierra.some((anillo) => dentroDelPoligono(punto, anillo))) continue;
      const cerca = delCatalogo.some(
        (semilla) =>
          Math.hypot(semilla.punto[0] - punto[0], semilla.punto[1] - punto[1]) <
          DISTANCIA_MINIMA_AL_CATALOGO,
      );
      if (cerca) continue;
      relleno.push({
        id: `sin-nombre-${String(relleno.length + 1).padStart(3, '0')}`,
        punto,
        catalogo: null,
      });
    }
    fila += 1;
  }
  return relleno;
}

function comarcaProvisional(
  semilla: Semilla,
  poligono: Punto[],
  zonas: ReturnType<typeof cargarRelieve>['zonas'],
): ComarcaMundo {
  const centro = centroide(poligono);
  const lon = centro[0] / (100 * Math.cos((40.2 * Math.PI) / 180)) + -9.6;
  const lat = 43.85 - centro[1] / 100;
  const terreno = terrenoDe(lon, lat, zonas);
  const numero = semilla.id.replace('sin-nombre-', '');
  const nombre = `Comarca sin nombre ${numero}`;
  const centroMil: readonly [number, number] = [Math.round(lon * 1000), Math.round(lat * 1000)];
  return {
    id: idComarca(semilla.id),
    nombre,
    cabecera: nombre,
    region: '99-provisional',
    centro: centroMil,
    poligono: poligono.map(redondear),
    terreno,
    potenciales: potencialesDe(terreno, semilla.id),
    solares: 6,
    poblacionInicial: 30,
    localidades: [{ nombre, coord: centroMil, cabecera: true }],
    rasgos: [],
    feria: null,
    esOrigen: false,
  };
}

function comarcaDelCatalogo(semilla: Semilla, poligono: Punto[]): ComarcaMundo {
  const ficha = semilla.catalogo;
  if (ficha === null) throw new Error('semilla sin ficha');
  return {
    id: idComarca(ficha.id),
    nombre: ficha.nombre,
    cabecera: ficha.cabecera,
    region: ficha.region,
    centro: [ficha.centro[0], ficha.centro[1]] as const,
    poligono: poligono.map(redondear),
    terreno: ficha.terreno,
    potenciales: ficha.potenciales,
    solares: ficha.solares,
    poblacionInicial: ficha.poblacionInicial,
    localidades: ficha.localidades.map((localidad) => ({
      nombre: localidad.nombre,
      coord: [localidad.coord[0], localidad.coord[1]] as const,
      cabecera: localidad.cabecera === true,
    })),
    rasgos: ficha.rasgos.filter(esRasgo),
    feria:
      ficha.feria === null
        ? null
        : {
            id: idFeria(ficha.feria.id),
            nombre: ficha.feria.nombre,
            turnos: ficha.feria.turnos,
            volumen: ficha.feria.volumen,
            recursosDestacados: ficha.feria.recursosDestacados,
          },
    esOrigen: ficha.esOrigen,
  };
}

export interface ResultadoGeneracion {
  readonly mundo: Mundo;
  readonly informe: string;
  readonly avisos: readonly string[];
}

export async function generarMundo(): Promise<ResultadoGeneracion> {
  const { anillos: tierra, sinSimplificar } = await tierraPeninsular();
  const relieve = cargarRelieve();

  const delCatalogo = semillasDelCatalogo();
  const relleno = semillasDeRelleno(sinSimplificar, delCatalogo);
  const semillas = [...delCatalogo, ...relleno];
  if (semillas.length === 0)
    throw new Error('No hay ni una semilla: revisa el catalogo y la tierra.');

  const delaunay = Delaunay.from(
    semillas,
    (semilla) => semilla.punto[0],
    (semilla) => semilla.punto[1],
  );
  const voronoi = delaunay.voronoi([-40, -40, ANCHO + 40, ALTO + 40]);

  const comarcas: Record<string, ComarcaMundo> = {};
  const poligonos = new Map<string, Punto[]>();
  const avisos: string[] = [];

  semillas.forEach((semilla, indice) => {
    const celda = voronoi.cellPolygon(indice);
    // d3 declara que siempre devuelve un poligono, pero con semillas coincidentes devuelve null.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (celda === null) {
      avisos.push(`${semilla.id}: sin celda de Voronoi`);
      return;
    }
    const puntos = celda.slice(0, -1).map((punto) => [punto[0], punto[1]] as Punto);
    const recorte = recortarATierra(puntos, tierra);
    if (recorte === null) {
      avisos.push(`${semilla.id}: su celda no toca tierra`);
      return;
    }
    const poligono = simplificar(recorte.poligono, TOLERANCIA_CELDA);
    if (area(poligono) < AREA_MINIMA) {
      avisos.push(
        `${semilla.id}: superficie de ${String(Math.round(area(poligono)))} unidades, por debajo del minimo`,
      );
      return;
    }
    poligonos.set(semilla.id, poligono);
    comarcas[semilla.id] =
      semilla.catalogo === null
        ? comarcaProvisional(semilla, poligono, relieve.zonas)
        : comarcaDelCatalogo(semilla, poligono);
  });

  // Vecindad: la de Voronoi, filtrando los pares que solo se tocan cruzando el mar.
  const vecinos: Record<string, IdComarca[]> = {};
  const caminos: Camino[] = [];
  const indicePorId = new Map(semillas.map((semilla, indice) => [semilla.id, indice]));

  for (const semilla of semillas) {
    if (!(semilla.id in comarcas)) continue;
    const indice = indicePorId.get(semilla.id);
    if (indice === undefined) continue;
    const suyos: IdComarca[] = [];
    for (const otro of delaunay.neighbors(indice)) {
      const vecino = semillas[otro];
      if (vecino === undefined || !(vecino.id in comarcas)) continue;
      const sobreTierra = porcionSobreTierra(semilla.punto, vecino.punto, tierra);
      if (sobreTierra < TIERRA_MINIMA_DE_UN_TRAMO) continue;
      suyos.push(idComarca(vecino.id));
      if (comparar(semilla.id, vecino.id) < 0) {
        caminos.push(tramoEntre(comarcas, semilla, vecino, relieve.puertos));
      }
    }
    vecinos[semilla.id] = suyos.sort(comparar);
  }

  const mundo: Mundo = {
    version: 'v1',
    comarcas,
    caminos: caminos.sort((a, b) => comparar(`${a.desde}|${a.hasta}`, `${b.desde}|${b.hasta}`)),
    vecinos,
  };

  avisos.push(...comprobar(mundo, poligonos));
  return { mundo, informe: informeDe(mundo, avisos), avisos };
}

function tramoEntre(
  comarcas: Record<string, ComarcaMundo>,
  a: Semilla,
  b: Semilla,
  puertos: ReturnType<typeof cargarRelieve>['puertos'],
): Camino {
  const terrenoA = comarcas[a.id]?.terreno ?? 'llano';
  const terrenoB = comarcas[b.id]?.terreno ?? 'llano';
  const terreno: Terreno = terrenoDeTramo(terrenoA, terrenoB);
  const medioX = (a.punto[0] + b.punto[0]) / 2;
  const medioY = (a.punto[1] + b.punto[1]) / 2;
  const lon = medioX / (100 * Math.cos((40.2 * Math.PI) / 180)) + -9.6;
  const lat = 43.85 - medioY / 100;
  const puerto = puertos.find((candidato) => dentroDeCaja(lon, lat, candidato.caja));
  return {
    desde: idComarca(a.id),
    hasta: idComarca(b.id),
    terreno,
    jornadasBase: JORNADAS_POR_TERRENO[terreno],
    vado: false,
    // Candidato a puerto de montanya: T-013 confirma el nombre y su comportamiento estacional.
    puertoDeMontanya: puerto !== undefined && terreno === 'sierra' ? puerto.nombre : null,
    canyada: null,
    calzadaRomana: false,
  };
}

/** Las seis comprobaciones que detienen el proceso si el mapa sale incoherente. */
export function comprobar(mundo: Mundo, poligonos: Map<string, Punto[]>): string[] {
  const problemas: string[] = [];
  const ids = Object.keys(mundo.comarcas).sort(comparar);

  // Mientras queden comarcas de relleno, el mapa esta en transito: el catalogo real es mas denso
  // que la malla de relleno, asi que el total sube segun entran regiones y baja cuando el relleno
  // desaparece. Cuando ya no quede ni una provisional, vale la horquilla de docs/05 §5.2.
  const provisionales = ids.filter((id) => mundo.comarcas[id]?.region === '99-provisional').length;
  const horquilla = provisionales > 0 ? ([300, 430] as const) : ([320, 380] as const);
  if (ids.length < horquilla[0] || ids.length > horquilla[1]) {
    problemas.push(
      `el mapa tiene ${String(ids.length)} comarcas y lo esperable son entre ${String(horquilla[0])} y ${String(horquilla[1])}${provisionales > 0 ? ' mientras queden comarcas provisionales' : ''}`,
    );
  }

  for (const id of ids) {
    const vecinos = mundo.vecinos[id] ?? [];
    if (vecinos.length === 0) problemas.push(`${id}: se ha quedado sin vecinos`);
    const comarca = mundo.comarcas[id];
    const poligono = poligonos.get(id);
    if (comarca === undefined || poligono === undefined) continue;
    for (const localidad of comarca.localidades) {
      const punto = proyectarMilesimas(localidad.coord[0], localidad.coord[1]);
      if (!dentroDelPoligono(punto, poligono)) {
        problemas.push(
          `${id}: la localidad "${localidad.nombre}" cae fuera del poligono de su comarca`,
        );
      }
    }
  }

  // Grafo conexo: se recorre desde la primera comarca y tienen que salir todas.
  const vistos = new Set<string>();
  const pila = ids.slice(0, 1);
  while (pila.length > 0) {
    const actual = pila.pop();
    if (actual === undefined || vistos.has(actual)) continue;
    vistos.add(actual);
    for (const vecino of mundo.vecinos[actual] ?? []) pila.push(vecino);
  }
  if (vistos.size !== ids.length) {
    const sueltas = ids.filter((id) => !vistos.has(id));
    problemas.push(
      `el grafo no es conexo: ${String(sueltas.length)} comarcas quedan aisladas (${sueltas.slice(0, 5).join(', ')}…)`,
    );
  }

  const validacion = validarMundo(mundo);
  if (!validacion.ok) problemas.push(`el mundo no valida:\n${explicar(validacion.errores)}`);

  return problemas;
}

function informeDe(mundo: Mundo, avisos: readonly string[]): string {
  const comarcas = Object.values(mundo.comarcas);
  const provisionales = comarcas.filter((comarca) => comarca.region === '99-provisional');
  const porRegion = new Map<string, number>();
  for (const comarca of comarcas)
    porRegion.set(comarca.region, (porRegion.get(comarca.region) ?? 0) + 1);

  const vecindades = Object.values(mundo.vecinos).map((lista) => lista.length);
  const media = vecindades.reduce((total, n) => total + n, 0) / Math.max(1, vecindades.length);
  const jornadas =
    mundo.caminos.reduce((total, camino) => total + camino.jornadasBase, 0) /
    Math.max(1, mundo.caminos.length);
  const puertos = mundo.caminos.filter((camino) => camino.puertoDeMontanya !== null);

  const lineas: string[] = [
    '# Informe del atlas',
    '',
    'Generado por `npm run atlas`. No se edita a mano.',
    '',
    `- Comarcas: **${String(comarcas.length)}**, de las cuales **${String(provisionales.length)}** son provisionales (sin catálogo).`,
    `- Tramos de camino: ${String(mundo.caminos.length)} · vecinos por comarca: ${media.toFixed(1)} · jornadas medias: ${jornadas.toFixed(1)}`,
    `- Tramos marcados como candidatos a puerto de montaña: ${String(puertos.length)}`,
    `- Superficie del mapa: ${String(ANCHO)} × ${String(ALTO)} unidades (1 unidad ≈ ${aKilometros(1).toFixed(2)} km)`,
    '',
    '## Comarcas por región',
    '',
    '| Región | Comarcas |',
    '|---|---|',
  ];
  for (const region of [...porRegion.keys()].sort(comparar)) {
    lineas.push(`| ${region} | ${String(porRegion.get(region) ?? 0)} |`);
  }

  const masVecinos = [...Object.entries(mundo.vecinos)]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);
  const menosVecinos = [...Object.entries(mundo.vecinos)]
    .sort((a, b) => a[1].length - b[1].length)
    .slice(0, 5);
  lineas.push(
    '',
    '## Vecindades extremas',
    '',
    `- Más conectadas: ${masVecinos.map(([id, lista]) => `${id} (${String(lista.length)})`).join(', ')}`,
    `- Menos conectadas: ${menosVecinos.map(([id, lista]) => `${id} (${String(lista.length)})`).join(', ')}`,
  );

  if (puertos.length > 0) {
    lineas.push('', '## Candidatos a puerto de montaña', '');
    for (const camino of puertos.slice(0, 20)) {
      lineas.push(`- ${camino.puertoDeMontanya ?? ''}: ${camino.desde} ↔ ${camino.hasta}`);
    }
  }

  if (avisos.length > 0) {
    lineas.push('', '## Avisos', '');
    for (const aviso of avisos) lineas.push(`- ${aviso}`);
  }

  return `${lineas.join('\n')}\n`;
}

export function textoDelMundo(mundo: Mundo): string {
  return `${canonico(mundo)}\n`;
}

export async function principal(argumentos: readonly string[]): Promise<number> {
  const comprobando = argumentos.includes('--comprobar');
  console.log(comprobando ? 'Comprobando el atlas…' : 'Generando el atlas…');
  const { mundo, informe, avisos } = await generarMundo();
  const texto = textoDelMundo(mundo);

  const graves = avisos.filter((aviso) => !aviso.includes('su celda no toca tierra'));
  if (graves.length > 0) {
    console.error('El atlas tiene problemas:');
    for (const problema of graves) console.error(`  · ${problema}`);
    return 1;
  }

  if (comprobando) {
    const actual = readFileSync(RUTA_MUNDO, 'utf8');
    if (actual !== texto) {
      console.error(
        'El mundo generado no coincide con paquetes/mundo/datos/mundo.v1.json.\n' +
          'El mapa no se edita a mano: vuelve a generarlo con "npm run atlas".',
      );
      return 1;
    }
    console.log('El atlas coincide con el fichero generado.');
    return 0;
  }

  mkdirSync(join(RAIZ, 'paquetes/mundo/datos'), { recursive: true });
  writeFileSync(RUTA_MUNDO, texto, 'utf8');
  writeFileSync(RUTA_INFORME, informe, 'utf8');
  console.log(`Escrito ${RUTA_MUNDO} (${String(Object.keys(mundo.comarcas).length)} comarcas).`);
  return 0;
}
