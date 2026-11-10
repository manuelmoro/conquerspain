// Fase 04 · Las mesnadas (T-120, docs/06 §6.6). La llama la fase de movimiento despues de recuas y
// rebanyos. En este orden: hostilidades, levas, licencias y marchas (cada clase en orden de
// identificador); despues cada mesnada anda, paga su pan y su soldada o deserta; y al final, los
// enfrentamientos entre casas con hostilidad vigente. Los hombres nunca mueren: van y vuelven.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { cancelarOrden, dejarEnEspera, empezarOrden, ordenesVivas } from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { indiceDeCaminos, jornadasDesde } from '../partidas/distancias.ts';
import { estaAmparado } from '../reglas/ausencia.ts';
import { esDesleal } from '../reglas/lealtad.ts';
import { asedios } from './04-asedios.ts';
import {
  claveDeHostilidad,
  costeDeMesnada,
  fuerzaDe,
  puedeEntrarLaMesnada,
  sonHostiles,
} from '../reglas/milicia.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { Mesnada } from '../tipos/estado.ts';
import type { IdComarca } from '../tipos/ids.ts';
import { nuevoId } from '../tipos/ids.ts';
import { MIL } from '../utiles/enteros.ts';
import { idsEnOrden } from '../utiles/orden.ts';

export function movimientoDeMesnadas(ctx: Contexto): void {
  for (const orden of ordenesVivas(ctx, 'hostilidad')) hostilidad(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'levar')) levar(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'licenciar')) licenciar(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'marchar')) marchar(ctx, orden);
  for (const id of idsEnOrden(ctx.estado.mesnadas ?? {})) avanzarYMantener(ctx, id);
  enfrentamientos(ctx);
  asedios(ctx);
}

function mesnadaDe(ctx: Contexto, id: string): Mesnada | undefined {
  return ctx.estado.mesnadas?.[id];
}

// ——— Hostilidad ————————————————————————————————————————————————————————————

function hostilidad(ctx: Contexto, orden: OrdenDe<'hostilidad'>): void {
  const clave = claveDeHostilidad(orden.jugador, orden.contra);
  const existente = ctx.estado.hostilidades?.[clave];
  const otra = ctx.estado.jugadores[orden.contra];
  if (orden.declarar) {
    if (otra === undefined || orden.contra === orden.jugador || existente !== undefined) {
      cancelarOrden(ctx, orden, 'hostilidad-imposible');
      return;
    }
    if (estaAmparado(otra, ctx.turno)) {
      cancelarOrden(ctx, orden, 'amparada');
      return;
    }
    empezarOrden(ctx, orden, 'terminada');
    const vigenteDesde = ctx.turno + 1;
    aplicar(ctx, {
      tipo: 'hostilidad',
      clave,
      hostilidad: { de: orden.jugador, contra: orden.contra, declaradaEn: ctx.turno, vigenteDesde },
    });
    // El preaviso es publico: todos lo leen un turno antes de que cuente.
    registrarSuceso(ctx.sucesos, ctx.fase, 'hostilidad.declarada', {
      de: orden.jugador,
      contra: orden.contra,
      desde: vigenteDesde,
    });
    return;
  }
  if (existente?.de !== orden.jugador) {
    cancelarOrden(ctx, orden, 'hostilidad-imposible');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  aplicar(ctx, { tipo: 'hostilidad-baja', clave });
  registrarSuceso(ctx.sucesos, ctx.fase, 'hostilidad.retirada', {
    de: orden.jugador,
    contra: orden.contra,
  });
}

// ——— Levar y licenciar ———————————————————————————————————————————————————————

function levar(ctx: Contexto, orden: OrdenDe<'levar'>): void {
  const comarca = ctx.estado.comarcas[orden.comarca];
  if (comarca?.duenyo !== orden.jugador) {
    cancelarOrden(ctx, orden, 'comarca-ajena');
    return;
  }
  if (esDesleal(comarca, ctx.reglas)) {
    dejarEnEspera(ctx, orden, 'comarca-desleal');
    return;
  }
  const t = ctx.reglas.milicia;
  const maximo = Math.floor((comarca.poblacion * t.levaMaximaMil) / MIL);
  if (orden.hombres > maximo) {
    cancelarOrden(ctx, orden, 'demasiados-hombres');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  aplicar(ctx, {
    tipo: 'poblacion',
    comarca: comarca.id,
    delta: -orden.hombres,
    motivo: 'leva de milicia',
  });
  aplicar(ctx, {
    tipo: 'lealtad',
    comarca: comarca.id,
    delta: -t.lealtadPorLeva,
    motivo: 'leva de milicia',
  });
  const id = nuevoId('mesnada', ctx.estado.siguienteId);
  aplicar(ctx, { tipo: 'siguiente-id' });
  const nombre = `Mesnada de ${ctx.mundo.comarcas[comarca.id]?.nombre ?? comarca.id}`;
  aplicar(ctx, {
    tipo: 'mesnada',
    mesnada: {
      id,
      jugador: orden.jugador,
      nombre,
      origen: comarca.id,
      hombres: orden.hombres,
      situacion: { donde: 'comarca', comarca: comarca.id },
      turnosFuera: 0,
    },
  });
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'milicia.leva',
    { mesnada: id, nombre, hombres: orden.hombres },
    { jugador: orden.jugador, comarca: comarca.id },
  );
}

/** Los hombres vuelven a su comarca; si ya no es suya, a la capital de su casa. */
function devolverHombres(ctx: Contexto, mesnada: Mesnada, hombres: number, motivo: string): void {
  if (hombres <= 0) return;
  const origen = ctx.estado.comarcas[mesnada.origen];
  const casa =
    origen?.duenyo === mesnada.jugador
      ? mesnada.origen
      : (ctx.estado.jugadores[mesnada.jugador]?.capital ?? mesnada.origen);
  aplicar(ctx, { tipo: 'poblacion', comarca: casa, delta: hombres, motivo });
}

/** Quita hombres de una mesnada (vuelven a casa) y la disuelve si se queda sin nadie. */
function quitarHombres(
  ctx: Contexto,
  mesnada: Mesnada,
  hombres: number,
  motivo: string,
): Mesnada | null {
  const quitados = Math.min(mesnada.hombres, Math.max(0, hombres));
  devolverHombres(ctx, mesnada, quitados, motivo);
  if (quitados >= mesnada.hombres) {
    aplicar(ctx, { tipo: 'mesnada-baja', mesnada: mesnada.id });
    return null;
  }
  const queda = { ...mesnada, hombres: mesnada.hombres - quitados };
  aplicar(ctx, { tipo: 'mesnada', mesnada: queda });
  return queda;
}

function licenciar(ctx: Contexto, orden: OrdenDe<'licenciar'>): void {
  const mesnada = mesnadaDe(ctx, orden.mesnada);
  if (mesnada?.jugador !== orden.jugador) {
    cancelarOrden(ctx, orden, 'mesnada-desconocida');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  quitarHombres(ctx, mesnada, mesnada.hombres, 'vuelven de la milicia');
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'milicia.licencia',
    { mesnada: mesnada.id, nombre: mesnada.nombre, hombres: mesnada.hombres },
    { jugador: mesnada.jugador, comarca: mesnada.origen },
  );
}

// ——— Marchar ———————————————————————————————————————————————————————————————

function marchar(ctx: Contexto, orden: OrdenDe<'marchar'>): void {
  const mesnada = mesnadaDe(ctx, orden.mesnada);
  if (mesnada?.jugador !== orden.jugador) {
    cancelarOrden(ctx, orden, 'mesnada-desconocida');
    return;
  }
  if (mesnada.situacion.donde !== 'comarca') {
    dejarEnEspera(ctx, orden, 'mesnada-en-marcha');
    return;
  }
  if (!puedeEntrarLaMesnada(ctx.estado, orden.jugador, orden.destino, ctx.turno)) {
    cancelarOrden(ctx, orden, 'tierra-vedada');
    return;
  }
  const desde = mesnada.situacion.comarca;
  const jornadas = jornadasDesde(ctx.mundo, desde, indiceDeCaminos(ctx.mundo)).get(orden.destino);
  if (jornadas === undefined) {
    cancelarOrden(ctx, orden, 'sin-ruta-conocida');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  if (orden.destino === desde) return;
  const turnos = Math.max(1, Math.ceil((jornadas * MIL) / ctx.reglas.milicia.pasoMil));
  aplicar(ctx, {
    tipo: 'mesnada',
    mesnada: {
      ...mesnada,
      situacion: { donde: 'marcha', hacia: orden.destino, turnosQueFaltan: turnos },
    },
  });
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'milicia.marcha',
    { mesnada: mesnada.id, nombre: mesnada.nombre, hacia: orden.destino, turnos },
    { jugador: mesnada.jugador, comarca: desde },
  );
}

// ——— Cada turno: andar y mantenerse ———————————————————————————————————————————

function avanzarYMantener(ctx: Contexto, id: string): void {
  let mesnada = mesnadaDe(ctx, id);
  if (mesnada === undefined) return;

  if (mesnada.situacion.donde === 'marcha') {
    const { hacia, turnosQueFaltan } = mesnada.situacion;
    if (turnosQueFaltan > 1) {
      mesnada = {
        ...mesnada,
        situacion: { donde: 'marcha', hacia, turnosQueFaltan: turnosQueFaltan - 1 },
      };
    } else if (puedeEntrarLaMesnada(ctx.estado, mesnada.jugador, hacia, ctx.turno)) {
      mesnada = { ...mesnada, situacion: { donde: 'comarca', comarca: hacia } };
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'milicia.llega',
        { mesnada: mesnada.id, nombre: mesnada.nombre },
        { jugador: mesnada.jugador, comarca: hacia },
      );
    } else {
      // Al llegar ya no puede entrar (se retiro la hostilidad o la casa esta amparada): vuelve.
      mesnada = { ...mesnada, situacion: { donde: 'comarca', comarca: mesnada.origen } };
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'milicia.no-entra',
        { mesnada: mesnada.id, nombre: mesnada.nombre, hacia },
        { jugador: mesnada.jugador, comarca: mesnada.origen },
      );
    }
  }
  const donde = mesnada.situacion.donde === 'comarca' ? mesnada.situacion.comarca : null;
  const enCasa = donde !== null && ctx.estado.comarcas[donde]?.duenyo === mesnada.jugador;
  mesnada = { ...mesnada, turnosFuera: enCasa ? 0 : mesnada.turnosFuera + 1 };
  aplicar(ctx, { tipo: 'mesnada', mesnada });
  pagar(ctx, mesnada);
}

function pagar(ctx: Contexto, mesnada: Mesnada): void {
  const jugador = ctx.estado.jugadores[mesnada.jugador];
  if (jugador === undefined) return;
  const coste = costeDeMesnada(mesnada, ctx.reglas);
  const libre = (r: 'pan' | 'maravedis'): number => jugador.almacen[r] - jugador.reservado[r];
  if (libre('pan') >= coste.pan && libre('maravedis') >= coste.maravedis) {
    for (const recurso of ['pan', 'maravedis'] as const) {
      if (coste[recurso] > 0) {
        aplicar(ctx, {
          tipo: 'recurso',
          jugador: mesnada.jugador,
          recurso,
          delta: -coste[recurso],
          motivo: `mantenimiento de ${mesnada.id}`,
        });
      }
    }
    return;
  }
  // Sin pan o sin soldada, una parte se vuelve a casa y el pueblo lo nota.
  const desertores = Math.max(
    1,
    Math.floor((mesnada.hombres * ctx.reglas.milicia.desercionSinPagaMil) / MIL),
  );
  quitarHombres(ctx, mesnada, desertores, 'desertan de la milicia');
  const origen = ctx.estado.comarcas[mesnada.origen];
  if (origen?.duenyo === mesnada.jugador) {
    aplicar(ctx, {
      tipo: 'lealtad',
      comarca: mesnada.origen,
      delta: -1,
      motivo: 'milicia sin paga',
    });
  }
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'milicia.desercion',
    { mesnada: mesnada.id, nombre: mesnada.nombre, hombres: Math.min(desertores, mesnada.hombres) },
    { jugador: mesnada.jugador, comarca: mesnada.origen },
  );
}

// ——— Enfrentamientos ————————————————————————————————————————————————————————

/**
 * Dos mesnadas de casas hostiles en la misma comarca se enfrentan, por parejas y en orden de
 * identificador; cada una, una vez por turno. Gana la de mas fuerza; con empate, la que defiende su
 * tierra o, si ninguna, la de menor identificador. La que pierde vuelve a su origen y una parte de sus
 * hombres se va a casa. Nada mas: ni comarcas ni edificios cambian de manos.
 */
function enfrentamientos(ctx: Contexto): void {
  const yaLucharon = new Set<string>();
  const ids = idsEnOrden(ctx.estado.mesnadas ?? {});
  for (const a of ids) {
    for (const b of ids) {
      if (a >= b || yaLucharon.has(a) || yaLucharon.has(b)) continue;
      const una = mesnadaDe(ctx, a);
      const otra = mesnadaDe(ctx, b);
      if (una === undefined || otra === undefined) continue;
      if (una.situacion.donde !== 'comarca' || otra.situacion.donde !== 'comarca') continue;
      const comarca = una.situacion.comarca;
      if (otra.situacion.comarca !== comarca) continue;
      if (!sonHostiles(ctx.estado, una.jugador, otra.jugador, ctx.turno)) continue;
      yaLucharon.add(a);
      yaLucharon.add(b);
      enfrentar(ctx, una, otra, comarca);
    }
  }
}

function enfrentar(ctx: Contexto, una: Mesnada, otra: Mesnada, comarca: IdComarca): void {
  const fuerzaUna = fuerzaDe(una, comarca, ctx.estado, ctx.reglas);
  const fuerzaOtra = fuerzaDe(otra, comarca, ctx.estado, ctx.reglas);
  const duenyo = ctx.estado.comarcas[comarca]?.duenyo ?? null;
  const ganaUna =
    fuerzaUna !== fuerzaOtra ? fuerzaUna > fuerzaOtra : duenyo === otra.jugador ? false : true;
  const ganadora = ganaUna ? una : otra;
  const perdedora = ganaUna ? otra : una;
  const bajas = Math.max(
    1,
    Math.floor((perdedora.hombres * ctx.reglas.milicia.bajasDerrotaMil) / MIL),
  );
  const queda = quitarHombres(ctx, perdedora, bajas, 'vuelven tras la derrota');
  if (queda !== null) {
    const casa =
      ctx.estado.comarcas[queda.origen]?.duenyo === queda.jugador
        ? queda.origen
        : (ctx.estado.jugadores[queda.jugador]?.capital ?? queda.origen);
    aplicar(ctx, {
      tipo: 'mesnada',
      mesnada: { ...queda, situacion: { donde: 'comarca', comarca: casa }, turnosFuera: 0 },
    });
  }
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'milicia.enfrentamiento',
    {
      ganador: ganadora.jugador,
      de: perdedora.jugador,
      hombres: ganadora.hombres,
      bajas: Math.min(bajas, perdedora.hombres),
    },
    { comarca },
  );
}
