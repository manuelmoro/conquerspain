// Fase 02 · Produccion (T-031, docs/03-economia.md §3.2 a §3.5).
//
// Primero cada jugador paga los insumos de sus edificios (T-032), de la comarca mas cercana a la
// capital a la mas lejana y con lo que tenia al empezar el turno. Despues cada comarca con duenyo
// produce segun sus explotaciones, y lo producido entra en el almacen comun del jugador. Cada explotacion deja su suceso con el desglose entero, la comarca guarda su
// produccion del turno para la cronica, y al final se agota y se regenera lo explotado.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { comarcasPorCercania } from '../reglas/administracion.ts';
import { comarcasDe } from '../reglas/consumo.ts';
import { insumosDe } from '../reglas/insumos.ts';
import {
  explotacionesDe,
  maravedisDe,
  siguienteAgotamiento,
  vecinosNecesarios,
} from '../reglas/produccion.ts';
import { factorDeAcontecimientos } from '../reglas/acontecimientos.ts';
import { modificadoresDe, modificadoresDelJugador } from '../reglas/casas/index.ts';
import { registrarSuceso } from '../sucesos.ts';
import { produccionDeRebanyos } from './02-rebanyos.ts';
import type { Fuero } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { TipoEdificio } from '../tipos/reglas.ts';
import type { Recurso } from '../tipos/recursos.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import { MIL, multiplicarFactores } from '../utiles/enteros.ts';
import { idsEnOrden } from '../utiles/orden.ts';

type NivelesActivos = Readonly<Partial<Record<TipoEdificio, number>>>;

/** Cobra los insumos de todos los jugadores y devuelve los niveles que trabajan en cada comarca. */
function pagarInsumos(ctx: Contexto): Map<string, NivelesActivos> {
  const activos = new Map<string, NivelesActivos>();
  for (const clave of idsEnOrden(ctx.estado.jugadores)) {
    const jugador = ctx.estado.jugadores[clave];
    if (jugador === undefined) continue;
    const idJugador = jugador.id;
    const disponible: Partial<Record<Recurso, number>> = {};
    for (const recurso of RECURSOS) {
      disponible[recurso] = jugador.almacen[recurso] - jugador.reservado[recurso];
    }
    const comarcas = comarcasDe(ctx.estado, idJugador);
    for (const { comarca: id } of comarcasPorCercania(
      comarcas,
      jugador,
      ctx.mundo,
      ctx.reglas,
      ctx.estado.caminos,
    )) {
      const comarca = ctx.estado.comarcas[id];
      if (comarca === undefined) continue;
      const insumos = insumosDe(
        comarca,
        disponible,
        ctx.reglas,
        modificadoresDelJugador(jugador, ctx.reglas).edificiosPorRequisito,
      );
      activos.set(id, insumos.nivelesActivos);
      for (const recurso of RECURSOS) {
        const cantidad = insumos.gasto[recurso] ?? 0;
        if (cantidad > 0) {
          aplicar(ctx, {
            tipo: 'recurso',
            jugador: idJugador,
            recurso,
            delta: -cantidad,
            motivo: `insumos de ${id}`,
          });
        }
      }
      for (const parado of insumos.parados) {
        registrarSuceso(
          ctx.sucesos,
          ctx.fase,
          'produccion.sin-insumo',
          {
            edificio: parado.edificio,
            nivel: comarca.edificios[parado.edificio] ?? 0,
            activos: parado.activos,
          },
          { comarca: id, jugador: idJugador },
        );
      }
    }
  }
  return activos;
}

export function faseProduccion(ctx: Contexto): void {
  const nivelesActivos = pagarInsumos(ctx);
  const fueros = ctx.reglas.poblacion.fueros;
  const fueroImpuestos: Record<Fuero, number> = {
    ninguno: fueros.ninguno.impuestosMil,
    'carta puebla': fueros['carta puebla'].impuestosMil,
    fuero: fueros.fuero.impuestosMil,
  };

  for (const id of idsEnOrden(ctx.estado.comarcas)) {
    const comarca = ctx.estado.comarcas[id];
    if (comarca === undefined) continue;
    const duenyo = comarca.duenyo;
    const producido = Object.fromEntries(RECURSOS.map((r) => [r, 0])) as Record<Recurso, number>;

    if (duenyo !== null) {
      const jugador = ctx.estado.jugadores[duenyo];
      const region = ctx.mundo.comarcas[id]?.region ?? '';
      const casa = jugador === undefined ? undefined : modificadoresDelJugador(jugador, ctx.reglas);
      const explotaciones = explotacionesDe(
        {
          comarca,
          region,
          estacion: ctx.estacional.estacion,
          clima: ctx.clima,
          acontecimientos: ctx.estado.acontecimientos,
          turno: ctx.turno,
          terreno: ctx.mundo.comarcas[id]?.terreno,
          casaMil: casa?.produccionMil ?? {},
          casa,
          enVega: esVega(ctx, id),
          nivelesActivos: nivelesActivos.get(id) ?? {},
        },
        ctx.reglas,
      );

      const necesarios = vecinosNecesarios(comarca, ctx.reglas);
      if (necesarios > comarca.poblacion) {
        registrarSuceso(
          ctx.sucesos,
          ctx.fase,
          'produccion.falta-mano-de-obra',
          { necesarios, vecinos: comarca.poblacion, faltan: necesarios - comarca.poblacion },
          { comarca: id as IdComarca, jugador: duenyo },
        );
      }

      for (const explotacion of explotaciones) {
        const datos: Record<string, number | string> = {
          edificio: explotacion.edificio,
          nivel: explotacion.nivel,
          recurso: explotacion.recurso,
          base: explotacion.base,
          resultado: explotacion.resultado,
        };
        for (const factor of explotacion.factores) datos[`${factor.nombre}Mil`] = factor.mil;
        registrarSuceso(ctx.sucesos, ctx.fase, 'produccion.explotacion', datos, {
          comarca: id as IdComarca,
          jugador: duenyo,
        });
        producido[explotacion.recurso] += explotacion.resultado;
      }

      const ingresosMil = factorDeAcontecimientos(
        ctx.estado.acontecimientos,
        ctx.turno,
        'ingresos',
        { region, comarca: comarca.id },
      );
      // El modificador de maravedis de la casa pesa sobre el mercado y los impuestos de la comarca.
      const casaMaravedisMil = casa?.produccionMil.maravedis ?? MIL;
      const maravedis = maravedisDe(
        comarca,
        fueroImpuestos,
        ctx.reglas,
        multiplicarFactores(ingresosMil, [casaMaravedisMil]),
      );
      if (maravedis.total > 0) {
        registrarSuceso(
          ctx.sucesos,
          ctx.fase,
          'produccion.maravedis',
          { mercado: maravedis.mercado, impuestos: maravedis.impuestos, total: maravedis.total },
          { comarca: id as IdComarca, jugador: duenyo },
        );
        producido.maravedis += maravedis.total;
      }

      for (const recurso of RECURSOS) {
        if (producido[recurso] > 0) {
          aplicar(ctx, {
            tipo: 'recurso',
            jugador: duenyo,
            recurso,
            delta: producido[recurso],
            motivo: `produccion de ${id}`,
          });
        }
      }
    }

    aplicar(ctx, { tipo: 'produccion-comarca', comarca: id as IdComarca, produccion: producido });
    aplicar(ctx, {
      tipo: 'agotamiento',
      comarca: id as IdComarca,
      valores: siguienteAgotamiento(
        comarca,
        ctx.reglas,
        modificadoresDe(ctx.estado, duenyo, ctx.reglas).agotamientoMil,
      ),
    });
  }
  produccionDeRebanyos(ctx);
}

/** La comarca es de vega o tiene rio: lo que cuenta para quien rinde mas (o menos) con el agua. */
function esVega(ctx: Contexto, id: string): boolean {
  const geografia = ctx.mundo.comarcas[id];
  return geografia?.terreno === 'vega' || (geografia?.rasgos.includes('vega-fluvial') ?? false);
}
