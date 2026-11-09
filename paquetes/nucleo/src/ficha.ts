// La ficha de una comarca (ficha T-082): lo que el jugador sabe de ella y las acciones que puede
// darle, cada una con su coste, su duracion, su efecto previsto y, si esta bloqueada, su causa y su
// salida. Pura; la compone el servidor con el estado, pero solo ensenya lo que el jugador puede saber.
import { crearContexto } from './contexto.ts';
import { accionesDeGobierno } from './ficha-gobierno.ts';
import { BLOQUEOS } from './datos/bloqueos.ts';
import { datosDeProduccion } from './fases/02-produccion.ts';
import { costeDeIntencion } from './ordenes/intencion.ts';
import {
  modificadoresDelJugador,
  permisosDelJugador,
  prohibicionesDelJugador,
} from './reglas/casas/index.ts';
import type { ComoGanarLa } from './reglas/ganar-comarca.ts';
import { comoGanarLa } from './reglas/ganar-comarca.ts';
import { planDeMision } from './prevision/misiones.ts';
import type { Mision } from './prevision/misiones.ts';
import { Tablero } from './prevision/tablero.ts';
import { impedimentoDeIncorporar } from './reglas/incorporar.ts';
import { regaloYaPedido } from './reglas/regalo.ts';
import { impedimentoDeConstruir, solaresOcupados, solaresDe } from './reglas/obras.ts';
import { capacidadDe } from './reglas/poblar.ts';
import { explotacionesDe } from './reglas/produccion.ts';
import { impedimentoDeRoturar } from './reglas/roturar.ts';
import { vistaDeJugador } from './reglas/vista.ts';
import type { EstadoComarca, EstadoPartida, Fuero, CargaFiscal } from './tipos/estado.ts';
import type { IdComarca, IdJugador } from './tipos/ids.ts';
import type { Mundo, NivelPotencial, Potencial, Terreno } from './tipos/mundo.ts';
import type { Orden } from './tipos/ordenes.ts';
import type { Recurso, Recursos } from './tipos/recursos.ts';
import { RECURSOS, recursosSegun } from './tipos/recursos.ts';
import { TIPOS_DE_EDIFICIO, esTipoDeEdificio } from './tipos/reglas.ts';
import type { TablasDeReglas, TipoEdificio } from './tipos/reglas.ts';
import { validarIntencion } from './ordenes/intencion.ts';
import { multiplicarFactores } from './utiles/enteros.ts';

export interface BloqueoDeAccion {
  readonly motivo: string;
  readonly causa: string;
  readonly salida: string;
}

export interface AccionDeFicha {
  readonly clave: string;
  readonly titulo: string;
  /** Lo que se manda a la API (sin `idCliente`). */
  readonly intencion: Readonly<Record<string, unknown>>;
  /**
   * Todo lo que se manda, en orden: la `intencion` sola, o varias si la accion es una mision de
   * recua (cargar, ir, cometido y vuelta; T-083 §4.2).
   */
  readonly intenciones: readonly Readonly<Record<string, unknown>>[];
  readonly coste: Recursos;
  /** Turnos que tarda en hacerse. */
  readonly turnos: number;
  /** El efecto previsto, en palabras y con cifras. */
  readonly efecto: string;
  readonly bloqueo: BloqueoDeAccion | null;
}

export interface FactorDeProduccion {
  readonly nombre: string;
  readonly mil: number;
}

export interface ProduccionPrevista {
  readonly edificio: TipoEdificio;
  readonly nivel: number;
  readonly recurso: Recurso;
  readonly base: number;
  readonly factores: readonly FactorDeProduccion[];
  readonly resultado: number;
}

export interface DetalleDePropia {
  readonly poblacion: number;
  readonly capacidad: number;
  readonly lealtad: number;
  readonly fuero: Fuero;
  readonly cargaFiscal: CargaFiscal;
  readonly aperos: number;
  readonly solares: { readonly usados: number; readonly total: number };
  readonly edificios: readonly {
    tipo: TipoEdificio;
    nombre: string;
    nivel: number;
    maximo: number;
  }[];
  readonly obras: readonly {
    que: string;
    /** El edificio que se levanta, que ya ocupa su solar; null en una obra mayor (T-092). */
    edificio: TipoEdificio | null;
    avanceMil: number;
    necesarioMil: number;
  }[];
  /** Lo que produjo en el ultimo turno resuelto. */
  readonly producido: Recursos;
  /** Lo que producira este turno con lo que hay, si no faltan insumos, con su desglose. */
  readonly prevision: readonly ProduccionPrevista[];
}

export interface FichaDeComarca {
  readonly id: IdComarca;
  readonly nombre: string;
  readonly nivel: 'propia' | 'explorada' | 'oida';
  readonly terreno: Terreno | null;
  readonly potenciales: Readonly<Record<Potencial, NivelPotencial>> | null;
  readonly duenyo: IdJugador | null;
  readonly propia: DetalleDePropia | null;
  readonly influenciaPropia: number | null;
  /** En las neutrales conocidas: cuanto falta para incorporarla, a que ritmo y que lo aceleraria. */
  readonly comoGanarLa: ComoGanarLa | null;
  /** Un consejo de lo que conviene hacer para saber mas, si lo hay. */
  readonly consejo: string | null;
  readonly acciones: readonly AccionDeFicha[];
}

function bloqueo(motivo: string | null): BloqueoDeAccion | null {
  if (motivo === null) return null;
  const texto = BLOQUEOS[motivo] ?? { causa: motivo, salida: '' };
  return { motivo, ...texto };
}

function suma(
  explotaciones: readonly { recurso: Recurso; resultado: number }[],
): Record<Recurso, number> {
  const total = Object.fromEntries(RECURSOS.map((r) => [r, 0])) as Record<Recurso, number>;
  for (const e of explotaciones) total[e.recurso] += e.resultado;
  return total;
}

function diferenciaEnTexto(
  antes: Record<Recurso, number>,
  despues: Record<Recurso, number>,
): string {
  const partes = RECURSOS.filter((r) => despues[r] !== antes[r]).map(
    (r) => `${despues[r] > antes[r] ? '+' : ''}${String(despues[r] - antes[r])} ${r}`,
  );
  return partes.length === 0 ? '' : `${partes.join(', ')} por turno`;
}

/**
 * La ficha de `comarca` para `jugador`, o null si no sabe nada de ella. Lo de las comarcas ajenas y
 * neutrales sale de su vista (T-044); el estado solo se usa para lo propio y para prever.
 */
export function fichaDeComarca(
  estado: EstadoPartida,
  jugador: IdJugador,
  comarca: IdComarca,
  mundo: Mundo,
  reglas: TablasDeReglas,
  /** Las ordenes que el jugador ha dado este turno y aun no se han resuelto. */
  pendientes: readonly Orden[] = [],
): FichaDeComarca | null {
  const vista = vistaDeJugador(estado, jugador, mundo);
  const conocida = vista.comarcas[comarca];
  const geografia = mundo.comarcas[comarca];
  if (conocida === undefined || geografia === undefined) return null;
  const yo = vista.jugador;
  const base = { id: geografia.id, nombre: geografia.nombre };
  const casa = modificadoresDelJugador(yo, reglas);
  const permisos = permisosDelJugador(yo, reglas);
  const prohibiciones = prohibicionesDelJugador(yo, reglas);
  const accion = (
    clave: string,
    titulo: string,
    intencion: Record<string, unknown>,
    turnos: number,
    efecto: string,
    motivo: string | null,
    real: EstadoComarca | undefined,
  ): AccionDeFicha => {
    const forma = validarIntencion({ ...intencion, idCliente: 'ficha' });
    const coste: Recursos = forma.ok
      ? costeDeIntencion(forma.valor.bosquejo, yo, real, reglas)
      : recursosSegun(() => 0);
    return {
      clave,
      titulo,
      intencion,
      intenciones: [intencion],
      coste,
      turnos,
      efecto,
      bloqueo: bloqueo(motivo),
    };
  };

  const real = estado.comarcas[comarca];
  /**
   * Regalo e incorporacion, en toda neutral conocida (de oidas tambien: el concejo existe aunque no
   * se hayan visto sus tierras). La incorporacion se juzga con lo que el jugador sabe de las demas
   * casas, no con lo que hay.
   */
  const accionesDeNeutral = (ajenasSabidas: Readonly<Record<string, number>>): AccionDeFicha[] => {
    const t = reglas.influencia;
    const ultimo = real?.ultimoRegalo[yo.id];
    const reciente = ultimo !== undefined && estado.turno - ultimo < t.turnosEntreRegalos;
    const pedido = regaloYaPedido([...estado.ordenes, ...pendientes], yo.id, comarca);
    const conLoSabido: EstadoComarca | undefined =
      real === undefined
        ? undefined
        : { ...real, influencias: { ...ajenasSabidas, [yo.id]: real.influencias[yo.id] ?? 0 } };
    return [
      accion(
        'regalo',
        'Hacer un regalo al concejo',
        { tipo: 'regalo', comarca },
        1,
        `+${String(t.porRegalo)} de influencia`,
        pedido ? 'regalo-pedido' : reciente ? 'regalo-reciente' : null,
        real,
      ),
      accion(
        'incorporar',
        'Incorporar la comarca',
        { tipo: 'incorporar', comarca },
        t.turnosIncorporar,
        'La comarca pasa a ser tuya, con su gente y su lealtad por ganar',
        conLoSabido === undefined
          ? 'comarca-con-duenyo'
          : impedimentoDeIncorporar(
              estado,
              conLoSabido,
              estado.jugadores[yo.id] ?? yo,
              mundo,
              reglas,
            ),
        real,
      ),
    ];
  };
  /** Mandar una recua a estar presente o a explorar: la mision entera, con su prevision. */
  const accionDeMision = (mision: Mision): AccionDeFicha => {
    const plan = planDeMision(new Tablero(vista, mundo, reglas), comarca, mision);
    const titulo =
      mision === 'presencia' ? 'Enviar una recua a estar presente' : 'Enviar una recua a explorar';
    const turnos = plan.ok ? plan.valor.llegada : 1;
    const nada = recursosSegun(() => 0);
    if (!plan.ok) {
      return {
        clave: `mision-${mision}`,
        titulo,
        intencion: {},
        intenciones: [],
        coste: nada,
        turnos,
        efecto:
          mision === 'presencia'
            ? 'Una recua presente suma influencia cada turno'
            : 'Una recua que explora te dice qué tiene la comarca',
        bloqueo: bloqueo(plan.motivo),
      };
    }
    const p = plan.valor;
    const llega = `${p.nombreDeRecua} llega en ${String(p.llegada)} turno${p.llegada === 1 ? '' : 's'}`;
    const efecto =
      mision === 'presencia'
        ? `${llega}; +${String(multiplicarFactores(reglas.influencia.porPresencia, [casa.influenciaMil]))} de influencia por turno durante ${String(p.turnosPresente ?? 1)} turnos, y vuelve sola`
        : `${llega}, la explora y vuelve a ${mundo.comarcas[p.vuelta]?.nombre ?? 'casa'}`;
    return {
      clave: `mision-${mision}`,
      titulo,
      intencion: p.intenciones[0] ?? {},
      intenciones: p.intenciones,
      coste: { ...nada, pan: p.pan, sal: p.sal },
      turnos,
      efecto,
      bloqueo: null,
    };
  };
  const ganar =
    conocida.nivel !== 'propia' && conocida.influenciaPropia !== null && real !== undefined
      ? comoGanarLa(real, estado.jugadores[yo.id] ?? yo, estado, mundo, reglas)
      : null;

  if (conocida.nivel === 'oida') {
    return {
      ...base,
      nivel: 'oida',
      terreno: null,
      potenciales: null,
      duenyo: null,
      propia: null,
      influenciaPropia: conocida.influenciaPropia,
      comoGanarLa: ganar,
      consejo: 'Explórala con una recua para saber qué tiene y de quién es.',
      acciones:
        conocida.influenciaPropia === null
          ? [accionDeMision('explorar')]
          : [...accionesDeNeutral({}), accionDeMision('explorar')],
    };
  }

  if (conocida.nivel === 'explorada') {
    const datos = conocida.datos;
    const neutral = datos === null || datos.duenyo === null;
    const acciones = neutral
      ? [
          ...accionesDeNeutral(conocida.influenciasAjenas),
          accionDeMision('presencia'),
          accionDeMision('explorar'),
        ]
      : [accionDeMision('explorar')];
    if (neutral) {
      acciones.push(
        accion(
          'construir-venta',
          `Levantar una ${reglas.edificios.venta.nombre.toLowerCase()}`,
          { tipo: 'construir', comarca, edificio: 'venta' },
          reglas.edificios.venta.turnos,
          'Abre plaza y da de comer a las recuas que pasen',
          null,
          real,
        ),
      );
    }
    return {
      ...base,
      nivel: 'explorada',
      terreno: geografia.terreno,
      potenciales: datos?.potenciales ?? geografia.potenciales,
      duenyo: datos?.duenyo ?? null,
      propia: null,
      influenciaPropia: conocida.influenciaPropia,
      comoGanarLa: ganar,
      consejo: null,
      acciones,
    };
  }

  const propia = conocida.comarca;
  const ctx = crearContexto(estado, [], mundo, reglas);
  const producir = (c: EstadoComarca) =>
    explotacionesDe(datosDeProduccion(ctx, c, estado.jugadores[yo.id]), reglas);
  const prevision = producir(propia);
  const antes = suma(prevision);
  const obras = vista.obras.filter((o) => o.comarca === comarca);
  const acciones: AccionDeFicha[] = [];
  for (const tipo of TIPOS_DE_EDIFICIO) {
    const datos = reglas.edificios[tipo];
    const nivel = propia.edificios[tipo] ?? 0;
    const mas = { ...propia, edificios: { ...propia.edificios, [tipo]: nivel + 1 } };
    let efecto = diferenciaEnTexto(antes, suma(producir(mas)));
    if (tipo === 'casas') {
      efecto = `Capacidad de ${String(capacidadDe(propia, reglas, casa.capacidadPorCasasExtra))} a ${String(capacidadDe(mas, reglas, casa.capacidadPorCasasExtra))} vecinos`;
    }
    const motivo = impedimentoDeConstruir(
      propia,
      tipo,
      vista.obras,
      geografia.solares,
      casa,
      reglas,
      permisos,
    );
    acciones.push(
      accion(
        `construir-${tipo}`,
        `${nivel > 0 ? 'Ampliar' : 'Construir'} ${datos.nombre.toLowerCase()}`,
        { tipo: 'construir', comarca, edificio: tipo },
        datos.turnos,
        efecto === '' ? datos.nombre : efecto,
        motivo,
        propia,
      ),
    );
    if (nivel > 0) {
      const menos = { ...propia, edificios: { ...propia.edificios, [tipo]: nivel - 1 } };
      const perdida = diferenciaEnTexto(antes, suma(producir(menos)));
      acciones.push(
        accion(
          `derribar-${tipo}`,
          `Derribar un nivel de ${datos.nombre.toLowerCase()}`,
          { tipo: 'derribar', comarca, edificio: tipo },
          reglas.obras.turnosDerribo,
          `Libera un solar${perdida === '' ? '' : `; ${perdida}`}`,
          null,
          propia,
        ),
      );
    }
  }
  const sinRoturar = prohibiciones.roturar ? 'prohibido-por-la-casa' : impedimentoDeRoturar(propia);
  acciones.push(
    accion(
      'roturar',
      'Roturar monte',
      { tipo: 'roturar', comarca },
      reglas.obras.turnosRoturar,
      'Un punto de monte pasa a labor',
      sinRoturar,
      propia,
    ),
  );
  const conAperos = { ...propia, aperos: propia.aperos + 1 };
  acciones.push(
    accion(
      'aperos',
      'Instalar aperos',
      { tipo: 'aperos', comarca },
      1,
      diferenciaEnTexto(antes, suma(producir(conAperos))) || 'Mejor labor',
      propia.aperos >= casa.aperosMaximo ? 'aperos-al-maximo' : null,
      propia,
    ),
  );
  acciones.push(
    accion(
      'formar-recua',
      'Formar una recua',
      { tipo: 'formar-recua', comarca, vecinos: 0 },
      1,
      `Una recua de ${String(reglas.movimiento.acemilasPorRecua)} acémilas`,
      yo.escasez ? 'escasez' : null,
      propia,
    ),
  );
  acciones.push(
    accion(
      'formar-rebanyo',
      'Formar un rebaño',
      { tipo: 'formar-rebanyo', comarca },
      1,
      `Un rebaño de ${String(reglas.ganaderia.cabezasPorRebanyo)} cabezas`,
      yo.escasez ? 'escasez' : null,
      propia,
    ),
  );
  acciones.push(
    ...accionesDeGobierno(
      propia,
      estado.jugadores[yo.id] ?? yo,
      estado,
      mundo,
      reglas,
      (clave, titulo, intencion, turnos, efecto, motivo) =>
        accion(clave, titulo, intencion, turnos, efecto, motivo, propia),
    ),
  );

  return {
    ...base,
    nivel: 'propia',
    terreno: geografia.terreno,
    potenciales: propia.potenciales,
    duenyo: yo.id,
    influenciaPropia: null,
    comoGanarLa: null,
    consejo: null,
    propia: {
      poblacion: propia.poblacion,
      capacidad: capacidadDe(propia, reglas, casa.capacidadPorCasasExtra),
      lealtad: propia.lealtad,
      fuero: propia.fuero,
      cargaFiscal: propia.cargaFiscal,
      aperos: propia.aperos,
      solares: {
        usados: solaresOcupados(propia, vista.obras),
        total: solaresDe(geografia.solares, casa),
      },
      edificios: TIPOS_DE_EDIFICIO.filter((t) => (propia.edificios[t] ?? 0) > 0).map((t) => ({
        tipo: t,
        nombre: reglas.edificios[t].nombre,
        nivel: propia.edificios[t] ?? 0,
        maximo: casa.nivelMaximoEdificio[t] ?? reglas.edificios[t].nivelMaximo,
      })),
      obras: obras.map((o) => ({
        que: o.que,
        edificio: o.tipo === 'edificio' && esTipoDeEdificio(o.que) ? o.que : null,
        avanceMil: o.avanceMil,
        necesarioMil: o.avanceNecesarioMil,
      })),
      producido: propia.produccionUltimoTurno,
      prevision: prevision.map((e) => ({
        edificio: e.edificio,
        nivel: e.nivel,
        recurso: e.recurso,
        base: e.base,
        factores: e.factores,
        resultado: e.resultado,
      })),
    },
    acciones,
  };
}
