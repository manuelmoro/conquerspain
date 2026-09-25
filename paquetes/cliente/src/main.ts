// Arranque del cliente (ficha T-080): enlaza la capa de datos con las pantallas y los eventos.
import './atlas/atlas.css';

import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';

import { Almacen } from './almacen.ts';
import { ClienteApi } from './api.ts';
import { escucharEventos } from './eventos.ts';
import { guardadoDelNavegador } from './guardado.ts';
import { pantallaDeEntrada } from './pantallas/entrar.ts';
import { pantallaDePartida } from './pantallas/partida.ts';
import { pantallaDePartidas } from './pantallas/partidas.ts';

const BASE = '/api';
const raiz = document.getElementById('aplicacion');
if (raiz === null) throw new Error('Falta el elemento #aplicacion en index.html.');

const api = new ClienteApi({ base: BASE });
const almacen = new Almacen({
  api,
  guardado: guardadoDelNavegador(),
  reglas: TABLAS_DEL_JUEGO,
  ahora: () => Date.now(),
  nuevaClave: () => crypto.randomUUID().replaceAll('-', '').slice(0, 24),
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
  });
}

function pintar(): void {
  if (raiz === null) return;
  const estado = almacen.estado;
  const pantalla =
    estado.cuenta === null
      ? pantallaDeEntrada(almacen)
      : estado.partida === null
        ? pantallaDePartidas(api, abrir)
        : pantallaDePartida(almacen, estado);
  raiz.replaceChildren(pantalla);
}

almacen.suscribir(pintar);
addEventListener('online', () => {
  void almacen.sincronizar();
});

async function arrancar(): Promise<void> {
  const parametros = new URLSearchParams(location.search);
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
