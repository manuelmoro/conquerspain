// Una API montada sobre una partida real de tres casas, con cinco turnos jugados y una cuenta por
// jugador. No es codigo de produccion: el autenticador solo mira una cabecera.
import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import type { EstadoPartida, Mundo } from '@conquer/nucleo';

import {
  AHORA,
  INTERVALO_SEGUNDOS,
  datosDePartida,
  mundoPeninsula,
  partidaDePrueba,
  resolverParaGuardar,
} from '../persistencia/prueba-comun.ts';
import { RepositorioSqlite } from '../persistencia/sqlite.ts';
import { proveedorDeRecorte } from '../reloj/mundoDeLaPartida.ts';
import { RegistroEnMemoria } from '../reloj/registro.ts';
import { crearApi } from './manejadores.ts';
import type { DependenciasDeApi } from './manejadores.ts';
import type { CuboDeFichas } from './limites.ts';
import type { Autenticador, PeticionHttp, RespuestaHttp } from './tipos.ts';

export const CUENTAS: Readonly<Record<string, string>> = {
  mesta: 'cuenta-de-mesta',
  monjes: 'cuenta-de-monjes',
  canteros: 'cuenta-de-canteros',
};

/** Solo para pruebas: la cuenta es lo que diga la cabecera `x-cuenta`. */
export const autenticadorDePrueba: Autenticador = {
  identificar: (peticion) => Promise.resolve(peticion.cabeceras['x-cuenta'] ?? null),
};

export interface ApiDePrueba {
  readonly repo: RepositorioSqlite;
  readonly mundo: Mundo;
  readonly estado: EstadoPartida;
  readonly registro: RegistroEnMemoria;
  readonly dep: DependenciasDeApi;
  readonly api: (peticion: PeticionHttp) => Promise<RespuestaHttp>;
  readonly ahora: { valor: number };
  /** Una peticion como la haria esa cuenta. */
  pedir(
    cuenta: string | null,
    metodo: string,
    ruta: string,
    cuerpo?: unknown,
  ): Promise<RespuestaHttp>;
  /** Resuelve un turno con el motor y lo guarda: el reloj de T-061, a mano. */
  resolver(): Promise<EstadoPartida>;
}

export async function apiDePrueba(
  opciones: { turnosJugados?: number; semilla?: string; cubo?: CuboDeFichas } = {},
): Promise<ApiDePrueba> {
  const { turnosJugados = 5, semilla = 'semilla-secreta-del-servidor' } = opciones;
  const { estado, mundo } = partidaDePrueba(['mesta', 'monjes', 'canteros'], semilla, 'p1');
  const repo = new RepositorioSqlite(':memory:');
  await repo.migrar(AHORA);
  const datos = datosDePartida(estado, mundo);
  await repo.crearPartida(
    {
      ...datos,
      participantes: datos.participantes.map((p) => ({ ...p, cuenta: CUENTAS[p.casa] ?? null })),
    },
    estado,
    AHORA,
  );
  const registro = new RegistroEnMemoria();
  const ahora = { valor: AHORA };
  const dep: DependenciasDeApi = {
    repo,
    reglas: TABLAS_DEL_JUEGO,
    proveedorDeMundo: proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO),
    autenticador: autenticadorDePrueba,
    registro,
    ahora: () => ahora.valor,
    ...(opciones.cubo === undefined ? {} : { cubo: opciones.cubo }),
  };
  const api = crearApi(dep);
  const entorno: ApiDePrueba = {
    repo,
    mundo,
    estado,
    registro,
    dep,
    api,
    ahora,
    pedir: (cuenta, metodo, ruta, cuerpo) =>
      api({
        metodo,
        ruta,
        cabeceras: {
          ...(cuenta === null ? {} : { 'x-cuenta': cuenta }),
          ...(cuerpo === undefined ? {} : { 'content-type': 'application/json' }),
        },
        cuerpo:
          cuerpo === undefined
            ? null
            : typeof cuerpo === 'string'
              ? cuerpo
              : JSON.stringify(cuerpo),
      }),
    resolver: async () => {
      const actual = await repo.ultimoEstado(estado.id);
      if (actual === null) throw new Error('la partida no tiene estado');
      const pendientes = await repo.ordenesPendientes(estado.id);
      const ordenes = pendientes
        .filter((o) => o.orden.turnoAlta === actual.turno)
        .map((o) => o.orden);
      const resolucion = resolverParaGuardar(actual, mundo, ordenes);
      await repo.guardarResolucion(
        {
          ...resolucion,
          proximaResolucion: AHORA + INTERVALO_SEGUNDOS * 1000 * (actual.turno + 1),
        },
        ahora.valor,
      );
      return resolucion.estadoNuevo;
    },
  };
  for (let i = 0; i < turnosJugados; i += 1) await entorno.resolver();
  return entorno;
}
