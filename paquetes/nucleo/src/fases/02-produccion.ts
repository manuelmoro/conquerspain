// Fase 02 · Produccion (T-031, docs/03-economia.md §3.2 a §3.5).
//
// Cada comarca con duenyo produce segun sus explotaciones, y lo producido entra en el almacen
// comun del jugador. Cada explotacion deja su suceso con el desglose entero, la comarca guarda su
// produccion del turno para la cronica, y al final se agota y se regenera lo explotado.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import {
  explotacionesDe,
  maravedisDe,
  siguienteAgotamiento,
  vecinosNecesarios,
} from '../reglas/produccion.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { Fuero } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import type { Recurso } from '../tipos/recursos.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import { idsEnOrden } from '../utiles/orden.ts';

export function faseProduccion(ctx: Contexto): void {
  const fueroImpuestos = {} as Record<Fuero, number>;
  for (const [fuero, datos] of Object.entries(ctx.reglas.poblacion.fueros)) {
    fueroImpuestos[fuero as Fuero] = datos.impuestosMil;
  }

  for (const id of idsEnOrden(ctx.estado.comarcas)) {
    const comarca = ctx.estado.comarcas[id];
    if (comarca === undefined) continue;
    const duenyo = comarca.duenyo;
    const producido = Object.fromEntries(RECURSOS.map((r) => [r, 0])) as Record<Recurso, number>;

    if (duenyo !== null) {
      const jugador = ctx.estado.jugadores[duenyo];
      const region = ctx.mundo.comarcas[id]?.region ?? '';
      const casaMil =
        jugador === undefined ? {} : ctx.reglas.casas[jugador.casa].modificadores.produccionMil;
      const explotaciones = explotacionesDe(
        { comarca, region, estacion: ctx.estacional.estacion, clima: ctx.clima, casaMil },
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

      const maravedis = maravedisDe(comarca, fueroImpuestos, ctx.reglas);
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
      valores: siguienteAgotamiento(comarca, ctx.reglas),
    });
  }
}
