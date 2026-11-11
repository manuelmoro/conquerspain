// `npm run guia:capturas` (ficha T-127 §2.3): las capturas de la guia, sacadas del juego de verdad.
//
// Siembra una partida de muestra en una base temporal (`npm run partida:muestra`), arranca el servidor y
// Vite en puertos aparte y recorre el juego con Chrome (el del sistema: `playwright-core` no descarga
// navegadores) como lo haria una persona: la portada, la lista, una convocatoria, la partida, la ficha
// de la capital, una orden, terminar el turno, el resumen, la cronica, el mercado, tu casa, el desglose
// de un recurso, invitar, una recua en ruta y el movil. Deja las imagenes en `public/guia/`, que Vite
// copia tal cual. No toca la base de desarrollo.
//
//   npm run guia:capturas
//   CHROME=/ruta/a/chrome npm run guia:capturas   (si Chrome no esta donde Playwright lo busca)
import { spawn, spawnSync } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright-core';
import type { Browser, BrowserContext, Locator, Page } from 'playwright-core';

const RAIZ = fileURLToPath(new URL('../../..', import.meta.url));
const SALIDA = fileURLToPath(new URL('../public/guia', import.meta.url));
const PUERTO_API = process.env['PUERTO_GUIA'] ?? '8491';
const PUERTO_WEB = process.env['PUERTO_CLIENTE_GUIA'] ?? '5193';
const WEB = `http://localhost:${PUERTO_WEB}`;
const CLAVE = 'castilla-1492-muestra';
const ESCRITORIO = { width: 1440, height: 900 };
const MOVIL = { width: 390, height: 844 };

const temporal = mkdtempSync(join(tmpdir(), 'conquer-guia-'));
const base = join(temporal, 'muestra.sqlite');
const hijos: ChildProcess[] = [];

function parar(): void {
  for (const hijo of hijos) {
    if (hijo.pid === undefined || hijo.exitCode !== null) continue;
    try {
      process.kill(-hijo.pid, 'SIGTERM');
    } catch {
      // Ya habia terminado.
    }
  }
  rmSync(temporal, { recursive: true, force: true });
}

function sembrar(): { partida: string; codigo: string } {
  const r = spawnSync(
    'npx',
    ['tsx', 'paquetes/servidor/herramientas/partida-de-muestra.ts', base, '4', '--json'],
    { cwd: RAIZ, encoding: 'utf8' },
  );
  const ultima = r.stdout.trim().split('\n').at(-1) ?? '';
  if (r.status !== 0 || !ultima.startsWith('{')) {
    throw new Error(`No se pudo sembrar la partida de muestra:\n${r.stderr}`);
  }
  const dato: unknown = JSON.parse(ultima);
  if (
    typeof dato !== 'object' ||
    dato === null ||
    !('partida' in dato) ||
    !('codigo' in dato) ||
    typeof dato.partida !== 'string' ||
    typeof dato.codigo !== 'string'
  ) {
    throw new Error(`La partida de muestra no dijo su identificador: ${ultima}`);
  }
  return { partida: dato.partida, codigo: dato.codigo };
}

function arrancar(): void {
  const entorno = {
    ...process.env,
    PUERTO: PUERTO_API,
    BASE_DE_DATOS: base,
    URL_PUBLICA: WEB,
  };
  hijos.push(
    spawn('npx', ['tsx', 'paquetes/servidor/src/principal.ts'], {
      cwd: RAIZ,
      env: entorno,
      detached: true,
      stdio: 'ignore',
    }),
    spawn('npx', ['vite', 'paquetes/cliente', '--port', PUERTO_WEB, '--strictPort'], {
      cwd: RAIZ,
      env: entorno,
      detached: true,
      stdio: 'ignore',
    }),
  );
}

async function esperarAlServidor(): Promise<void> {
  for (let i = 0; i < 120; i += 1) {
    try {
      const r = await fetch(`${WEB}/api/cuenta`);
      if (r.status === 401 || r.ok) return;
    } catch {
      // Aun arrancando.
    }
    await new Promise((seguir) => setTimeout(seguir, 500));
  }
  throw new Error(`El servidor no contesto en ${WEB}: mira si los puertos estan libres.`);
}

async function captura(pagina: Page, nombre: string, recorte?: Locator): Promise<void> {
  await pagina.waitForTimeout(400);
  const opciones = { path: join(SALIDA, `${nombre}.jpg`), type: 'jpeg', quality: 80 } as const;
  if (recorte === undefined) await pagina.screenshot(opciones);
  else await recorte.screenshot(opciones);
  console.log(`  ${nombre}.jpg`);
}

/** Un contexto con la sesion de esa cuenta abierta y, si se pide, sin el tutorial. */
async function sesion(
  navegador: Browser,
  correo: string,
  opciones: { readonly movil?: boolean; readonly sinTutorial?: string } = {},
): Promise<BrowserContext> {
  const contexto = await navegador.newContext({
    viewport: opciones.movil === true ? MOVIL : ESCRITORIO,
    deviceScaleFactor: opciones.movil === true ? 2 : 1,
    locale: 'es-ES',
    ...(opciones.movil === true ? { isMobile: true, hasTouch: true } : {}),
  });
  if (opciones.sinTutorial !== undefined) {
    await contexto.addInitScript((partida) => {
      localStorage.setItem(
        `conquer:tutorial:${partida}`,
        JSON.stringify({ paso: 0, turnoAlEmpezar: 1, saltado: true }),
      );
    }, opciones.sinTutorial);
  }
  const r = await contexto.request.post(`${WEB}/api/sesion/clave`, {
    data: { correo, clave: CLAVE, recordar: true },
  });
  if (!r.ok()) throw new Error(`No se pudo entrar como ${correo}: ${String(r.status())}.`);
  return contexto;
}

async function abrirPartida(contexto: BrowserContext, partida: string): Promise<Page> {
  const pagina = await contexto.newPage();
  await pagina.goto(`${WEB}/?partida=${partida}`);
  await pagina.waitForSelector('.cabecera h1');
  await pagina.waitForSelector('.capa-comarcas [data-comarca]');
  return pagina;
}

/** La capital del jugador y una comarca que ya puede incorporar (su alfoz), del estado de la API. */
async function capitalYVecina(
  contexto: BrowserContext,
  partida: string,
): Promise<{ capital: string; vecina: string | null }> {
  const r = await contexto.request.get(`${WEB}/api/partidas/${partida}/estado`);
  const datos: unknown = await r.json();
  if (typeof datos !== 'object' || datos === null) throw new Error('El estado no es un objeto.');
  const vista = 'vista' in datos && typeof datos.vista === 'object' ? datos.vista : null;
  const jugador =
    vista !== null && 'jugador' in vista && typeof vista.jugador === 'object'
      ? vista.jugador
      : null;
  const capital = jugador !== null && 'capital' in jugador ? jugador.capital : null;
  if (typeof capital !== 'string') throw new Error('El estado no trae la capital.');
  const incorporables =
    'incorporables' in datos && Array.isArray(datos.incorporables) ? datos.incorporables : [];
  const primera: unknown = incorporables[0];
  return { capital, vecina: typeof primera === 'string' ? primera : null };
}

async function pestanya(pagina: Page, texto: string): Promise<void> {
  await pagina.locator('nav.pestanyas button', { hasText: texto }).click();
  await pagina.waitForTimeout(800);
}

async function recorrer(navegador: Browser, partida: string, codigo: string): Promise<void> {
  // ——— Sin cuenta: la portada y lo que ve quien llega con una invitacion ———
  const anonimo = await navegador.newContext({ viewport: ESCRITORIO, locale: 'es-ES' });
  const portada = await anonimo.newPage();
  await portada.goto(WEB);
  await portada.waitForSelector('.portada');
  await captura(portada, 'portada');
  await portada.goto(`${WEB}/?unirse=${codigo}`);
  await portada.waitForSelector('.invitacion h2');
  await captura(portada, 'invitacion-portada', portada.locator('.invitacion'));
  await anonimo.close();

  // ——— Carmen: invitada, ve la partida a la que la invitan y elige casa ———
  const carmen = await sesion(navegador, 'carmen@muestra.conquerspain');
  const invitada = await carmen.newPage();
  await invitada.goto(`${WEB}/?unirse=${codigo}`);
  await invitada.waitForSelector('text=Unirse a una partida');
  await invitada.waitForSelector('.invitacion h2');
  await captura(invitada, 'invitacion-unirse');
  // Y convoca una partida suya para ensenyar el alta: el formulario y la eleccion de origen.
  await invitada.locator('button', { hasText: 'Volver' }).click();
  await invitada.locator('button', { hasText: 'Convocar una partida' }).click();
  await invitada.waitForSelector('text=Convocar una partida');
  await captura(invitada, 'convocar');
  const convocada = await carmen.request.post(`${WEB}/api/convocatorias`, {
    data: { nombre: 'Partida de los jueves', casa: 'arrieros', intervaloMinutos: 1440, plazas: 1 },
  });
  const { id } = (await convocada.json()) as { id: string };
  await carmen.request.post(`${WEB}/api/convocatorias/${id}/sortear`);
  await invitada.goto(WEB);
  await invitada.waitForSelector('li.oferta, .oferta');
  await captura(invitada, 'elegir-origen');
  await carmen.close();

  // ——— Ana: su lista, la partida y el tutorial ———
  const conTutorial = await sesion(navegador, 'ana@muestra.conquerspain');
  const lista = await conTutorial.newPage();
  await lista.goto(WEB);
  await lista.waitForSelector('section.mis-partidas li');
  await captura(lista, 'mis-partidas', lista.locator('section.mis-partidas'));
  const tutorial = await abrirPartida(conTutorial, partida);
  await tutorial.waitForSelector('aside.tutorial');
  await captura(tutorial, 'tutorial');
  await conTutorial.close();

  const ana = await sesion(navegador, 'ana@muestra.conquerspain', { sinTutorial: partida });
  const juego = await abrirPartida(ana, partida);
  const { capital, vecina } = await capitalYVecina(ana, partida);
  await captura(juego, 'partida');
  // Los tres modos del mapa, recortados al mapa: es lo unico que cambia.
  for (const [modo, nombre] of [
    ['Cómo se viaja', 'mapa-caminos'],
    ['De quién es', 'mapa-duenyos'],
    ['Qué produce', 'mapa-produccion'],
  ] as const) {
    await juego.locator('button', { hasText: modo }).first().click();
    await captura(juego, nombre, juego.locator('.juego > :first-child'));
  }

  // La ficha de la capital, una orden y la bandeja.
  await juego.locator(`.capa-comarcas [data-comarca="${capital}"]`).first().click({ force: true });
  await juego.waitForSelector('li.accion');
  await captura(juego, 'ficha-capital', juego.locator('aside.panel'));
  await captura(juego, 'plano', juego.locator('.juego > :first-child'));
  await juego.locator('li.accion[data-clave="formar-recua"] button').first().click();
  await juego.waitForSelector('.confirmacion');
  await captura(juego, 'orden-confirmar', juego.locator('.confirmacion'));
  await juego.locator('.confirmacion button.dar-la-orden').click();
  await juego.waitForSelector('.frase-de-orden');
  await juego.locator('#bandeja').scrollIntoViewIfNeeded();
  await captura(juego, 'bandeja', juego.locator('#bandeja'));

  // Una comarca vecina, desde el aviso «Ya puedes incorporar»: como ganarla. Antes se vuelve al mapa:
  // con una comarca propia abierta, en su lugar esta su plano.
  await pestanya(juego, 'Órdenes');
  const incorporable = juego.locator('.aviso-incorporable button').first();
  if ((await incorporable.count()) > 0) {
    await incorporable.click();
    await juego.waitForTimeout(800);
    await captura(juego, 'ficha-vecina', juego.locator('aside.panel'));
  }

  // El desglose de un recurso y la invitacion.
  await juego.locator('button.boton-de-recurso', { hasText: 'pan' }).click();
  await juego.waitForSelector('.seccion-de-desglose');
  await captura(juego, 'desglose', juego.locator('.dialogo'));
  await juego.locator('.dialogo button.cerrar').click();
  await juego.locator('button.invitar').click();
  await juego.waitForSelector('input.enlace-de-invitacion');
  await captura(juego, 'invitar', juego.locator('.dialogo'));
  await juego.locator('.dialogo button.cerrar').click();

  // Terminar el turno: Ana termina; Bruno lo ve y, al terminar el, se resuelve para los dos.
  await juego.locator('.fin-de-turno-compacto button').first().click();
  await juego.waitForTimeout(1000);
  await captura(juego, 'fin-de-turno', juego.locator('.fin-de-turno-compacto'));
  // Quien ha terminado y quien no, desplegado desde «n/m listos».
  await juego.locator('button.contador-de-listos').click();
  await juego.waitForSelector('.lista-de-listos');
  await captura(juego, 'lista-de-listos', juego.locator('.lista-de-listos'));
  await juego.locator('button.contador-de-listos').click();
  const bruno = await sesion(navegador, 'bruno@muestra.conquerspain', { sinTutorial: partida });
  // Un poco de charla entre los dos, antes de que Bruno termine.
  for (const [contexto, texto] of [
    [ana, 'Bruno, ¿vas a la feria de Medina este año? Te compro la lana si me llevas sal.'],
    [bruno, 'Allí estaré con dos recuas. La lana a 4 maravedís la saca, y la sal te la pongo yo.'],
    [bruno, 'Termino el turno ya, que me queda poco pan.'],
  ] as const) {
    await contexto.request.post(`${WEB}/api/partidas/${partida}/charla`, { data: { texto } });
  }
  const deBruno = await abrirPartida(bruno, partida);
  await deBruno.locator('.fin-de-turno-bloque').scrollIntoViewIfNeeded();
  await captura(deBruno, 'fin-de-turno-falta', deBruno.locator('.fin-de-turno-bloque'));
  await deBruno.locator('.fin-de-turno-bloque button').click();
  await deBruno.waitForTimeout(1500);
  await bruno.close();
  await juego.locator('button', { hasText: 'Ver qué ha pasado' }).click();
  await juego.waitForSelector('.dialogo');
  await juego.waitForTimeout(800);
  await captura(juego, 'resumen', juego.locator('.dialogo'));
  await juego.keyboard.press('Escape');
  const cerrar = juego.locator('.dialogo button.cerrar');
  if ((await cerrar.count()) > 0) await cerrar.first().click();
  await captura(juego, 'charla-aviso', juego.locator('nav.pestanyas'));

  // Las pestanyas del panel.
  for (const [texto, nombre] of [
    ['Charla', 'charla'],
    ['Crónica', 'cronica'],
    ['Mercado', 'mercado'],
    ['Tu casa', 'casa'],
    ['Ayuda', 'ayuda'],
  ] as const) {
    await pestanya(juego, texto);
    await captura(juego, nombre, juego.locator('aside.panel'));
  }
  await pestanya(juego, 'Órdenes');

  // La recua ya formada: darle ruta.
  const darRuta = juego.locator('button', { hasText: 'Darle ruta' }).first();
  if ((await darRuta.count()) > 0) {
    await darRuta.click();
    await juego.waitForTimeout(600);
    // Una parada: la primera comarca del alfoz, tocada en el mapa si esta pintada.
    const parada =
      vecina === null ? null : juego.locator(`.capa-comarcas [data-comarca="${vecina}"]`).first();
    if (parada !== null && (await parada.count()) > 0) {
      await parada.click({ force: true });
      await juego.waitForTimeout(1200);
    }
    await captura(juego, 'ruta');
  }
  await ana.close();

  // ——— En el movil ———
  const movil = await sesion(navegador, 'ana@muestra.conquerspain', {
    movil: true,
    sinTutorial: partida,
  });
  const enMovil = await abrirPartida(movil, partida);
  await captura(enMovil, 'movil');
  await movil.close();
}

mkdirSync(SALIDA, { recursive: true });
try {
  console.log('Sembrando la partida de muestra…');
  const { partida, codigo } = sembrar();
  console.log('Arrancando el servidor y el cliente…');
  arrancar();
  await esperarAlServidor();
  const ejecutable = process.env['CHROME'];
  const navegador = await chromium.launch(
    ejecutable === undefined ? { channel: 'chrome' } : { executablePath: ejecutable },
  );
  try {
    console.log(`Capturas en ${SALIDA}:`);
    await recorrer(navegador, partida, codigo);
  } finally {
    await navegador.close();
  }
} finally {
  parar();
}
