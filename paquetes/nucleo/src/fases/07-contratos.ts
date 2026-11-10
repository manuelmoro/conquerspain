// Fase 07 · Contratos (T-103; docs/06-competicion.md §6.4.5; ficha T-103 §3).
//
// Despues del mercado y antes del territorio. Primero salen los contratos cerrados el turno
// pasado (ya se vieron y quedan en la cronica); despues se atienden las respuestas, en orden de
// contrato; luego las propuestas nuevas y los portazgos, en orden de orden; y al final cada contrato
// vivo, en orden de identificador: caduca, se cumple o se incumple. El orden de llegada no cuenta.
import { aplicar } from '../cambios.ts';
import type { Contexto } from '../contexto.ts';
import { cancelarOrden, empezarOrden, ordenesVivas } from '../ordenes.ts';
import type { OrdenDe } from '../ordenes.ts';
import { modificadoresDe, permisosDe } from '../reglas/casas/index.ts';
import {
  contratosEnOrden,
  costeDeAperosPorContrato,
  impedimentoDeFirma,
  libre,
  otraParte,
  parteActiva,
  partePasiva,
  tienePocoCredito,
} from '../reglas/contratos.ts';
import type { MotivoDeContrato } from '../reglas/contratos.ts';
import { costeDeObraMayor } from '../reglas/obras.ts';
import { puedeCobrarPortazgo } from '../reglas/portazgos.ts';
import { claveDeTramo, tieneCalzada, tienePuente, tramoEntre } from '../reglas/ruta.ts';
import { registrarSuceso } from '../sucesos.ts';
import type { Contrato, ContratoEntrega, ContratoObra } from '../tipos/contratos.ts';
import type { IdJugador } from '../tipos/ids.ts';
import { nuevoId } from '../tipos/ids.ts';
import type { CondicionesDeContrato } from '../tipos/ordenes.ts';
import { RECURSOS, recursosSegun } from '../tipos/recursos.ts';
import type { Recurso } from '../tipos/recursos.ts';
import { OBRAS_MAYORES_DE_TRAMO } from '../tipos/reglas.ts';
import { TIPOS_DE_ACUERDO } from '../tipos/contratos.ts';
import { claveDeHostilidad } from '../reglas/milicia.ts';
import { MIL } from '../utiles/enteros.ts';
import { comparar, idsEnOrden } from '../utiles/orden.ts';

const CERRADOS: readonly Contrato['estado'][] = [
  'cumplido',
  'incumplido',
  'rechazado',
  'caducado',
  'roto',
];

export function faseContratos(ctx: Contexto): void {
  for (const contrato of contratosEnOrden(ctx.estado)) {
    if (CERRADOS.includes(contrato.estado)) {
      aplicar(ctx, { tipo: 'contrato-baja', contrato: contrato.id });
    }
  }
  const respuestas = ordenesVivas(ctx, 'responder-contrato').sort(
    (a, b) => comparar(a.contrato, b.contrato) || comparar(a.id, b.id),
  );
  for (const orden of respuestas) responder(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'contrato')) proponer(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'portazgo')) fijarPortazgo(ctx, orden);
  for (const orden of ordenesVivas(ctx, 'romper-acuerdo')) romper(ctx, orden);
  for (const contrato of contratosEnOrden(ctx.estado)) {
    if (contrato.estado === 'propuesto') caducar(ctx, contrato);
    else if (contrato.estado === 'vigente') seguir(ctx, contrato);
  }
}

// ——— Cronica ———————————————————————————————————————————————————————————————

/** El mismo suceso para las dos partes, cada una con la otra en `de` y su papel en `rol`. */
function contarALasDos(
  ctx: Contexto,
  tipo: string,
  contrato: Contrato,
  datos: Readonly<Record<string, string | number>>,
  rolDe: (jugador: IdJugador) => string,
): void {
  for (const jugador of [contrato.propone, contrato.recibe]) {
    registrarSuceso(
      ctx.sucesos,
      ctx.fase,
      tipo,
      {
        contrato: contrato.id,
        acuerdo: contrato.tipo,
        de: otraParte(contrato, jugador),
        rol: rolDe(jugador),
        ...datos,
      },
      { jugador },
    );
  }
}

function actualizar(ctx: Contexto, contrato: Contrato): void {
  aplicar(ctx, { tipo: 'contrato', contrato });
}

/** Pasa maravedis de una casa a otra, del almacen. */
function pagar(ctx: Contexto, de: IdJugador, a: IdJugador, cantidad: number, motivo: string): void {
  if (cantidad <= 0) return;
  aplicar(ctx, { tipo: 'recurso', jugador: de, recurso: 'maravedis', delta: -cantidad, motivo });
  aplicar(ctx, { tipo: 'recurso', jugador: a, recurso: 'maravedis', delta: cantidad, motivo });
}

function libreDe(ctx: Contexto, jugador: IdJugador, recurso: Recurso): number {
  const datos = ctx.estado.jugadores[jugador];
  return datos === undefined ? 0 : libre(datos, recurso);
}

// ——— Proponer y responder ——————————————————————————————————————————————————

function nuevoContrato(
  ctx: Contexto,
  orden: OrdenDe<'contrato'>,
  condiciones: CondicionesDeContrato,
): Contrato {
  const base = {
    id: nuevoId('contrato', ctx.estado.siguienteId),
    propone: orden.jugador,
    recibe: orden.con,
    estado: 'propuesto' as const,
    propuestoEn: ctx.turno,
    plazo: orden.plazo,
    penalizacion: orden.penalizacion,
    motivo: null,
    fallo: null,
  };
  const activa = condiciones.activa === 'propone' ? orden.jugador : orden.con;
  switch (condiciones.tipo) {
    case 'entrega':
      return {
        ...base,
        tipo: 'entrega',
        entrega: activa,
        recurso: condiciones.recurso,
        cantidad: condiciones.cantidad,
        comarca: condiciones.comarca,
        precio: condiciones.precio,
        depositado: 0,
      };
    case 'prestamo':
      return {
        ...base,
        tipo: 'prestamo',
        presta: activa,
        cantidad: condiciones.cantidad,
        devolver: condiciones.devolver,
      };
    case 'aperos':
      return {
        ...base,
        tipo: 'aperos',
        vende: activa,
        comarca: condiciones.comarca,
        niveles: condiciones.niveles,
        precio: condiciones.precio,
      };
    case 'obra':
      return {
        ...base,
        tipo: 'obra',
        construye: activa,
        comarca: condiciones.comarca,
        obra: condiciones.obra,
        hacia: OBRAS_MAYORES_DE_TRAMO.includes(condiciones.obra) ? condiciones.hacia : null,
        precio: condiciones.precio,
        idObra: null,
      };
    case 'paso':
      return { ...base, tipo: 'paso', concede: activa, precio: condiciones.precio };
    case 'no-agresion':
      return { ...base, tipo: 'no-agresion', compromete: activa, precio: condiciones.precio };
    case 'no-cortejo':
      return {
        ...base,
        tipo: 'no-cortejo',
        compromete: activa,
        comarcas: [...condiciones.comarcas],
        precio: condiciones.precio,
      };
    case 'exclusiva':
      return {
        ...base,
        tipo: 'exclusiva',
        compromete: activa,
        recurso: condiciones.recurso,
        precio: condiciones.precio,
      };
  }
}

function proponer(ctx: Contexto, orden: OrdenDe<'contrato'>): void {
  if (orden.con === orden.jugador || ctx.estado.jugadores[orden.con] === undefined) {
    cancelarOrden(ctx, orden, 'casa-desconocida');
    return;
  }
  if (orden.plazo <= ctx.turno) {
    cancelarOrden(ctx, orden, 'plazo-pasado');
    return;
  }
  const contrato = nuevoContrato(ctx, orden, orden.condiciones);
  aplicar(ctx, { tipo: 'siguiente-id' });
  actualizar(ctx, contrato);
  darAConocer(ctx, contrato);
  empezarOrden(ctx, orden, 'terminada');
  contarALasDos(ctx, 'contrato.propuesto', contrato, { plazo: contrato.plazo }, (j) =>
    j === contrato.propone ? 'propone' : 'recibe',
  );
}

/**
 * Las comarcas que cita el contrato las conocen las dos partes, al menos de oidas: no se firma una
 * entrega en un sitio del que no se sabe ni el nombre.
 */
function darAConocer(ctx: Contexto, contrato: Contrato): void {
  const citadas =
    contrato.tipo === 'entrega' || contrato.tipo === 'aperos'
      ? [contrato.comarca]
      : contrato.tipo === 'obra'
        ? [contrato.comarca, ...(contrato.hacia === null ? [] : [contrato.hacia])]
        : [];
  for (const jugador of [contrato.propone, contrato.recibe]) {
    for (const comarca of citadas) {
      const sabe = ctx.estado.jugadores[jugador]?.conocimiento[comarca]?.nivel ?? 'desconocida';
      if (sabe !== 'desconocida' || ctx.estado.comarcas[comarca] === undefined) continue;
      aplicar(ctx, {
        tipo: 'conocimiento',
        jugador,
        comarca,
        conocimiento: { nivel: 'oida', turnoUltimaNoticia: ctx.turno, datos: null },
      });
    }
  }
}

function responder(ctx: Contexto, orden: OrdenDe<'responder-contrato'>): void {
  const contrato = ctx.estado.contratos?.[orden.contrato];
  if (contrato?.recibe !== orden.jugador || contrato.estado !== 'propuesto') {
    cancelarOrden(ctx, orden, 'contrato-sin-propuesta');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  const impedimento = orden.acepta
    ? impedimentoDeFirma(contrato, ctx.estado, ctx.mundo, ctx.reglas)
    : 'contrato-rechazado';
  if (impedimento !== null) {
    actualizar(ctx, { ...contrato, estado: 'rechazado', motivo: impedimento });
    contarALasDos(ctx, 'contrato.rechazado', contrato, { motivo: impedimento }, (j) =>
      j === contrato.propone ? 'propone' : 'recibe',
    );
    return;
  }
  firmar(ctx, contrato);
}

// ——— Firmar ————————————————————————————————————————————————————————————————

function firmar(ctx: Contexto, contrato: Contrato): void {
  const activa = parteActiva(contrato);
  const pasiva = partePasiva(contrato);
  const motivo = `contrato ${contrato.id}`;
  let firmado: Contrato = { ...contrato, estado: 'vigente' };
  switch (contrato.tipo) {
    case 'entrega': {
      // Quien paga con poco credito lo aparta al firmar: el que entrega cobra seguro.
      const paga = ctx.estado.jugadores[pasiva];
      const deposito =
        paga !== undefined && tienePocoCredito(paga, ctx.reglas) ? contrato.precio : 0;
      if (deposito > 0) {
        aplicar(ctx, {
          tipo: 'recurso',
          jugador: pasiva,
          recurso: 'maravedis',
          delta: -deposito,
          motivo: `deposito del ${motivo}`,
        });
      }
      firmado = { ...contrato, estado: 'vigente', depositado: deposito };
      break;
    }
    case 'prestamo':
      pagar(ctx, activa, pasiva, contrato.cantidad, motivo);
      break;
    case 'aperos': {
      const coste = costeDeAperosPorContrato(contrato.niveles, ctx.reglas);
      for (const recurso of RECURSOS) {
        if (coste[recurso] > 0) {
          aplicar(ctx, {
            tipo: 'recurso',
            jugador: activa,
            recurso,
            delta: -coste[recurso],
            motivo,
          });
        }
      }
      aplicar(ctx, {
        tipo: 'aperos',
        comarca: contrato.comarca,
        delta: contrato.niveles,
        motivo: `los instala ${activa}`,
      });
      pagar(ctx, pasiva, activa, contrato.precio, motivo);
      break;
    }
    case 'obra':
      pagar(ctx, pasiva, activa, contrato.precio, motivo);
      firmado = { ...contrato, estado: 'vigente', idObra: abrirObraPorContrato(ctx, contrato) };
      break;
    case 'paso':
    case 'no-cortejo':
    case 'exclusiva':
      pagar(ctx, pasiva, activa, contrato.precio, motivo);
      break;
    case 'no-agresion': {
      pagar(ctx, pasiva, activa, contrato.precio, motivo);
      // Al firmar la paz se retira la hostilidad; los asedios se levantan solos al no haberla.
      const clave = claveDeHostilidad(activa, pasiva);
      if (ctx.estado.hostilidades?.[clave] !== undefined) {
        aplicar(ctx, { tipo: 'hostilidad-baja', clave });
      }
      break;
    }
  }
  actualizar(ctx, firmado);
  contarALasDos(ctx, 'contrato.firmado', firmado, { plazo: firmado.plazo }, (j) =>
    j === activa ? 'activa' : 'pasiva',
  );
  // Los aperos se instalan al firmar: el contrato queda cumplido en el acto.
  if (firmado.tipo === 'aperos') cumplir(ctx, firmado);
}

/** La obra del cliente que levanta el cantero: su coste es el del cantero, que pone el material. */
function abrirObraPorContrato(ctx: Contexto, contrato: ContratoObra) {
  const id = nuevoId('obra', ctx.estado.siguienteId);
  aplicar(ctx, { tipo: 'siguiente-id' });
  const casa = modificadoresDe(ctx.estado, contrato.construye, ctx.reglas);
  aplicar(ctx, {
    tipo: 'obra-alta',
    obra: {
      id,
      jugador: partePasiva(contrato),
      comarca: contrato.comarca,
      tipo: 'obra mayor',
      que: contrato.obra,
      hacia: contrato.hacia,
      avanceMil: 0,
      avanceNecesarioMil: ctx.reglas.obrasMayores[contrato.obra].turnos * MIL,
      entregado: recursosSegun(() => 0),
      costeTotal: costeDeObraMayor(contrato.obra, casa, ctx.reglas),
      abandonada: false,
      porContrato: contrato.construye,
    },
  });
  return id;
}

// ——— Cumplir, incumplir y caducar ——————————————————————————————————————————

function cumplir(ctx: Contexto, contrato: Contrato): void {
  actualizar(ctx, { ...contrato, estado: 'cumplido' });
  for (const jugador of [contrato.propone, contrato.recibe]) {
    aplicar(ctx, {
      tipo: 'credito',
      jugador,
      delta: ctx.reglas.contratos.creditoPorCumplir,
      cumplido: true,
      motivo: 'contrato-cumplido',
    });
  }
  contarALasDos(ctx, 'contrato.cumplido', contrato, {}, (j) =>
    j === parteActiva(contrato) ? 'activa' : 'pasiva',
  );
}

/**
 * Quien falla paga la penalizacion pactada, hasta lo que tenga, y pierde credito. Lo depositado
 * vuelve a quien lo puso si el que falla es el otro.
 */
function incumplir(
  ctx: Contexto,
  contrato: Contrato,
  fallo: IdJugador,
  motivo: MotivoDeContrato,
): void {
  const otro = otraParte(contrato, fallo);
  if (contrato.tipo === 'entrega' && contrato.depositado > 0 && fallo === contrato.entrega) {
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: otro,
      recurso: 'maravedis',
      delta: contrato.depositado,
      motivo: `devolucion del deposito del contrato ${contrato.id}`,
    });
  }
  const penalizacion = Math.min(contrato.penalizacion, libreDe(ctx, fallo, 'maravedis'));
  pagar(ctx, fallo, otro, penalizacion, `penalizacion del contrato ${contrato.id}`);
  actualizar(ctx, { ...contrato, estado: 'incumplido', motivo, fallo });
  aplicar(ctx, {
    tipo: 'credito',
    jugador: fallo,
    delta: -ctx.reglas.contratos.creditoPorIncumplir,
    cumplido: false,
    motivo: 'contrato-incumplido',
  });
  contarALasDos(ctx, 'contrato.incumplido', contrato, { motivo, penalizacion }, (j) =>
    j === fallo ? 'falla' : 'cobra',
  );
}

function caducar(ctx: Contexto, contrato: Contrato): void {
  if (ctx.turno - contrato.propuestoEn < ctx.reglas.contratos.turnosParaResponder) return;
  actualizar(ctx, { ...contrato, estado: 'caducado', motivo: 'sin-respuesta' });
  contarALasDos(ctx, 'contrato.caducado', contrato, {}, (j) =>
    j === contrato.propone ? 'propone' : 'recibe',
  );
}

function vencido(ctx: Contexto, contrato: Contrato): boolean {
  return ctx.turno >= contrato.plazo;
}

function seguir(ctx: Contexto, contrato: Contrato): void {
  switch (contrato.tipo) {
    case 'entrega':
      seguirEntrega(ctx, contrato);
      return;
    case 'prestamo':
      if (vencido(ctx, contrato)) cobrarPrestamo(ctx, contrato);
      return;
    case 'obra':
      seguirObra(ctx, contrato);
      return;
    case 'paso':
    case 'no-agresion':
    case 'no-cortejo':
    case 'exclusiva':
      if (vencido(ctx, contrato)) cumplir(ctx, contrato);
      return;
    case 'aperos':
      return;
  }
}

/** Una recua del que entrega, en la comarca de entrega, con toda la mercancia: la primera por id. */
function recuaQueEntrega(ctx: Contexto, contrato: ContratoEntrega) {
  for (const id of idsEnOrden(ctx.estado.recuas)) {
    const recua = ctx.estado.recuas[id];
    if (
      recua?.jugador === contrato.entrega &&
      recua.situacion.donde === 'comarca' &&
      recua.situacion.comarca === contrato.comarca &&
      recua.carga[contrato.recurso] >= contrato.cantidad
    ) {
      return recua;
    }
  }
  return null;
}

function seguirEntrega(ctx: Contexto, contrato: ContratoEntrega): void {
  const paga = partePasiva(contrato);
  const recua = recuaQueEntrega(ctx, contrato);
  if (recua === null) {
    if (vencido(ctx, contrato)) incumplir(ctx, contrato, contrato.entrega, 'sin-entrega');
    return;
  }
  if (contrato.depositado === 0 && libreDe(ctx, paga, 'maravedis') < contrato.precio) {
    incumplir(ctx, contrato, paga, 'sin-fondos');
    return;
  }
  const motivo = `contrato ${contrato.id}`;
  if (contrato.depositado > 0) {
    aplicar(ctx, {
      tipo: 'recurso',
      jugador: contrato.entrega,
      recurso: 'maravedis',
      delta: contrato.depositado,
      motivo,
    });
  } else {
    pagar(ctx, paga, contrato.entrega, contrato.precio, motivo);
  }
  aplicar(ctx, {
    tipo: 'recua-carga',
    recua: recua.id,
    recurso: contrato.recurso,
    delta: -contrato.cantidad,
    motivo,
  });
  aplicar(ctx, {
    tipo: 'recurso',
    jugador: paga,
    recurso: contrato.recurso,
    delta: contrato.cantidad,
    motivo,
  });
  cumplir(ctx, contrato);
}

/**
 * Al plazo se cobra la devolucion del almacen del que pidio; si no llega, lo que haya, y falla el.
 * La banca cobra ademas de lo que lleven sus recuas.
 */
function cobrarPrestamo(ctx: Contexto, contrato: Contrato & { readonly tipo: 'prestamo' }): void {
  const deudor = partePasiva(contrato);
  const motivo = `devolucion del contrato ${contrato.id}`;
  const delAlmacen = Math.min(contrato.devolver, libreDe(ctx, deudor, 'maravedis'));
  pagar(ctx, deudor, contrato.presta, delAlmacen, motivo);
  let cobrado = delAlmacen;
  if (cobrado < contrato.devolver && permisosDe(ctx.estado, contrato.presta, ctx.reglas).banca) {
    for (const id of idsEnOrden(ctx.estado.recuas)) {
      const recua = ctx.estado.recuas[id];
      if (recua?.jugador !== deudor || recua.carga.maravedis <= 0) continue;
      const toma = Math.min(contrato.devolver - cobrado, recua.carga.maravedis);
      aplicar(ctx, {
        tipo: 'recua-carga',
        recua: recua.id,
        recurso: 'maravedis',
        delta: -toma,
        motivo,
      });
      aplicar(ctx, {
        tipo: 'recurso',
        jugador: contrato.presta,
        recurso: 'maravedis',
        delta: toma,
        motivo,
      });
      cobrado += toma;
      if (cobrado >= contrato.devolver) break;
    }
  }
  if (cobrado >= contrato.devolver) cumplir(ctx, contrato);
  else incumplir(ctx, contrato, deudor, 'sin-fondos');
}

/** La obra ya esta: en la comarca, o en el tramo (puente o calzada). */
function obraTerminada(ctx: Contexto, contrato: ContratoObra): boolean {
  if (contrato.hacia === null) {
    return ctx.estado.comarcas[contrato.comarca]?.obrasMayores.includes(contrato.obra) ?? false;
  }
  const camino = tramoEntre(ctx.mundo, contrato.comarca, contrato.hacia);
  if (camino === undefined) return false;
  return contrato.obra === 'puente'
    ? tienePuente(camino, ctx.estado.caminos)
    : tieneCalzada(camino, ctx.estado.caminos);
}

function seguirObra(ctx: Contexto, contrato: ContratoObra): void {
  const obra = contrato.idObra === null ? undefined : ctx.estado.obras[contrato.idObra];
  if (obra === undefined) {
    if (obraTerminada(ctx, contrato)) {
      cumplir(ctx, contrato);
      return;
    }
    // La obra se perdio sin terminar (la comarca cambio de manos): no falla nadie.
    actualizar(ctx, { ...contrato, estado: 'incumplido', motivo: 'obra-perdida' });
    contarALasDos(ctx, 'contrato.perdido', contrato, {}, () => 'parte');
    return;
  }
  if (!vencido(ctx, contrato)) return;
  // Falla el cantero; la obra sigue, ya como obra propia del cliente.
  incumplir(ctx, contrato, contrato.construye, 'obra-sin-terminar');
  aplicar(ctx, { tipo: 'obra-sin-contratista', obra: obra.id });
}

// ——— Portazgos ——————————————————————————————————————————————————————————————

function fijarPortazgo(ctx: Contexto, orden: OrdenDe<'portazgo'>): void {
  const clave = claveDeTramo(orden.desde, orden.hasta);
  if (ctx.estado.caminos[clave]?.duenyo !== orden.jugador) {
    cancelarOrden(ctx, orden, 'tramo-ajeno');
    return;
  }
  if (!puedeCobrarPortazgo(ctx.estado, orden.jugador, ctx.reglas)) {
    cancelarOrden(ctx, orden, 'sin-permiso');
    return;
  }
  const cantidad = Math.min(orden.cantidad, ctx.reglas.contratos.portazgoMaximo);
  empezarOrden(ctx, orden, 'terminada');
  aplicar(ctx, { tipo: 'portazgo', clave, cantidad });
  registrarSuceso(
    ctx.sucesos,
    ctx.fase,
    'portazgo.fijado',
    { desde: orden.desde, hasta: orden.hasta, cantidad },
    { jugador: orden.jugador, comarca: orden.desde },
  );
}

// ——— Romper un acuerdo (T-123) ————————————————————————————————————————————————

function romper(ctx: Contexto, orden: OrdenDe<'romper-acuerdo'>): void {
  const contrato = ctx.estado.contratos?.[orden.contrato];
  if (
    contrato === undefined ||
    contrato.estado !== 'vigente' ||
    !TIPOS_DE_ACUERDO.includes(contrato.tipo) ||
    (contrato.propone !== orden.jugador && contrato.recibe !== orden.jugador)
  ) {
    cancelarOrden(ctx, orden, 'contrato-sin-propuesta');
    return;
  }
  empezarOrden(ctx, orden, 'terminada');
  const t = ctx.reglas.contratos;
  actualizar(ctx, { ...contrato, estado: 'roto', motivo: 'acuerdo-roto', fallo: orden.jugador });
  aplicar(ctx, {
    tipo: 'credito',
    jugador: orden.jugador,
    delta: -t.creditoPorRomper,
    cumplido: false,
    motivo: 'acuerdo-roto',
  });
  // La ruptura la saben todos: la reputacion de guerra es publica. El prestigio lo resta la fase 11,
  // que cuenta las rupturas en el registro y las pone entre las penalizaciones.
  registrarSuceso(ctx.sucesos, ctx.fase, 'acuerdo.roto', {
    de: orden.jugador,
    contra: otraParte(contrato, orden.jugador),
    acuerdo: contrato.tipo,
    prestigio: t.prestigioPorRomper,
  });
}
