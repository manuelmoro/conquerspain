// Arranque del cliente (ficha T-080): enlaza la capa de datos con las pantallas y los eventos.
// Las fuentes van con el cliente (T-090): ninguna peticion a terceros.
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/fraunces';
import './estilo.css';
import './atlas/atlas.css';

import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';

import { Almacen, claveOrdenada } from './almacen.ts';
import { ClienteApi } from './api.ts';
import { escucharEventos } from './eventos.ts';
import { guardadoDelNavegador } from './guardado.ts';
import { codigoDeLaDireccion } from './invitacion.ts';
import { pantallaDeEntrada } from './pantallas/entrar.ts';
import { pantallaDePartida } from './pantallas/partida.ts';
import { pantallaDePartidas } from './pantallas/partidas.ts';
import { abrirRestablecer, barraDeCuenta } from './pantallas/cuenta.ts';
import { el } from './pantallas/dom.ts';

const BASE = '/api';
const raiz = document.getElementById('aplicacion');
if (raiz === null) throw new Error('Falta el elemento #aplicacion en index.html.');

const api = new ClienteApi({ base: BASE });
const almacen = new Almacen({
  api,
  guardado: guardadoDelNavegador(),
  reglas: TABLAS_DEL_JUEGO,
  ahora: () => Date.now(),
  nuevaClave: () => claveOrdenada(Date.now(), crypto.randomUUID()),
});

let desconectarEventos: (() => void) | null = null;

function abrir(id: string): void {
  history.pushState(null, '', `?partida=${encodeURIComponent(id)}`);
  void almacen.abrirPartida(id);
  desconectarEventos?.();
  desconectarEventos = escucharEventos({
    url: `${BASE}/partidas/${encodeURIComponent(id)}/eventos`,
    crear: (url) => {
      const fuente = new EventSource(url, { withCredentials: true });
      return {
        alMensaje: (tipo, oyente) => {
          fuente.addEventListener(tipo, (evento) => {
            oyente(String(evento.data));
          });
        },
        alError: (oyente) => {
          fuente.addEventListener('error', oyente);
        },
        cerrar: () => {
          fuente.close();
        },
      };
    },
    alTurno: (turno) => {
      almacen.alTurnoResuelto(turno);
    },
    alFinDeTurno: (turno, quienes) => {
      almacen.alFinDeTurno(turno, quienes);
    },
    alMensaje: (mensaje) => {
      almacen.alMensaje(mensaje);
    },
  });
}

/** Lo que tiene desplazamiento propio conserva su posicion entre repintadas (T-088). */
function desplazamientos(): Map<string, number> {
  const guardados = new Map<string, number>();
  for (const n of document.querySelectorAll<HTMLElement>('[data-conservar-scroll]')) {
    guardados.set(n.dataset['conservarScroll'] ?? '', n.scrollTop);
  }
  return guardados;
}

function pintar(): void {
  if (raiz === null) return;
  const estado = almacen.estado;
  const antes = desplazamientos();
  const pantalla =
    estado.cuenta === null
      ? pantallaDeEntrada(almacen, api, estado)
      : estado.partida === null
        ? el('div', {}, barraDeCuenta(almacen, estado), pantallaDePartidas(almacen, api, abrir))
        : pantallaDePartida(almacen, estado);
  raiz.replaceChildren(pantalla);
  for (const n of document.querySelectorAll<HTMLElement>('[data-conservar-scroll]')) {
    const top = antes.get(n.dataset['conservarScroll'] ?? '');
    if (top !== undefined) n.scrollTop = top;
  }
}

almacen.suscribir(pintar);
addEventListener('online', () => {
  void almacen.sincronizar();
});

async function arrancar(): Promise<void> {
  const parametros = new URLSearchParams(location.search);
  // Un enlace de invitacion (T-125): se recuerda el codigo mientras crea su cuenta o entra.
  const invitacion = codigoDeLaDireccion(location.search);
  if (invitacion !== null) {
    almacen.recordarInvitacion(invitacion);
    history.replaceState(null, '', location.pathname);
  }
  // El enlace de restablecer la contrasenya abre su formulario (T-091).
  const restablecer = parametros.get('restablecer');
  if (restablecer !== null) abrirRestablecer(restablecer);
  const token = parametros.get('token');
  if (token !== null) {
    history.replaceState(null, '', location.pathname);
    await almacen.entrar(token);
  } else {
    await almacen.cargarCuenta();
  }
  const partida = parametros.get('partida');
  if (partida !== null && almacen.estado.cuenta !== null) abrir(partida);
  pintar();
}

void arrancar();
