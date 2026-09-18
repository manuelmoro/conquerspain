// Fase 10 · Acontecimientos (T-039, docs/02 §2.4.5; ficha T-039).
//
// El calendario del anyo sale de la semilla (`calendarioDeAcontecimientos`): el primer turno del
// anyo se publica entero y cada acontecimiento se anuncia —entra en el estado— exactamente dos
// turnos antes de empezar. Solo lo anunciado se aplica. Al empezar se aplican sus efectos unicos
// (la lealtad de una romeria, el agotamiento de un incendio); los demas los consultan las fases
// que tocan (docs/02 §2.4.5, `factorDeAcontecimientos`). Al acabar, el acontecimiento sale.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { ultimoTurnoDe } from '../reglas/acontecimientos.ts';
import { calendarioDeAcontecimientos } from '../reglas/calendarioDeAcontecimientos.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { Acontecimiento, EstadoComarca } from '../tipos/estado.ts';
import { multiplicarFactores } from '../utiles/enteros.ts';

export function faseAcontecimientos(ctx: Contexto): void {
  const plan = calendarioDeAcontecimientos(ctx.semilla, ctx.calendario.anyo, ctx.mundo, ctx.reglas);

  const primerTurno = ctx.calendario.turnoDelAnyo === 1 || ctx.estado.huellaTurnoAnterior === null;
  if (primerTurno) {
    // Solo se publica lo que aun se puede anunciar: lo que caeria antes del aviso no ocurre.
    for (const acontecimiento of plan) {
      if (acontecimiento.turnoAnuncio >= ctx.turno) suceso(ctx, 'calendario', acontecimiento);
    }
  }

  for (const acontecimiento of plan) {
    if (
      acontecimiento.turnoAnuncio === ctx.turno &&
      !ctx.estado.acontecimientos.some((anunciado) => anunciado.id === acontecimiento.id)
    ) {
      aplicar(ctx, { tipo: 'acontecimiento-alta', acontecimiento });
      suceso(ctx, 'anuncia', acontecimiento);
    }
  }

  for (const acontecimiento of [...ctx.estado.acontecimientos]) {
    if (acontecimiento.turnoInicio === ctx.turno) {
      efectosUnicos(ctx, acontecimiento);
      suceso(ctx, 'empieza', acontecimiento);
    }
    if (ultimoTurnoDe(acontecimiento) <= ctx.turno) {
      aplicar(ctx, { tipo: 'acontecimiento-baja', acontecimiento: acontecimiento.id });
      suceso(ctx, 'termina', acontecimiento);
    }
  }
}

function suceso(ctx: Contexto, que: string, acontecimiento: Acontecimiento): void {
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    `acontecimiento.${que}`,
    {
      acontecimiento: acontecimiento.id,
      tipo: acontecimiento.tipo,
      region: acontecimiento.region,
      turnoInicio: acontecimiento.turnoInicio,
      turnosDuracion: acontecimiento.turnosDuracion,
    },
    { comarca: acontecimiento.comarca },
  );
}

/** Lo que un acontecimiento cambia de una vez al empezar, en la comarca a la que apunta. */
function efectosUnicos(ctx: Contexto, acontecimiento: Acontecimiento): void {
  const comarca =
    acontecimiento.comarca === null ? undefined : ctx.estado.comarcas[acontecimiento.comarca];
  if (comarca === undefined) return;
  for (const efecto of acontecimiento.efectos) {
    if (efecto.que === 'lealtad') {
      // Una romeria alegra a la gente de una comarca que tiene señor; a una neutral no le suma nada.
      if (comarca.duenyo === null) continue;
      aplicar(ctx, {
        tipo: 'lealtad',
        comarca: comarca.id,
        delta: efecto.cantidad,
        motivo: acontecimiento.tipo,
      });
    } else if (efecto.que === 'monte') {
      incendio(ctx, comarca, efecto.cantidad);
    }
  }
}

/** El incendio sube el agotamiento del monte; en dehesa el monte se resiente la mitad. */
function incendio(ctx: Contexto, comarca: EstadoComarca, puntos: number): void {
  const t = ctx.reglas.produccion;
  const suben = comarca.dehesa
    ? multiplicarFactores(puntos, [t.dehesa.agotamientoMonteMil])
    : puntos;
  aplicar(ctx, {
    tipo: 'agotamiento',
    comarca: comarca.id,
    valores: {
      ...comarca.agotamiento,
      monte: Math.min(t.agotamiento.maximo, comarca.agotamiento.monte + suben),
    },
  });
}
