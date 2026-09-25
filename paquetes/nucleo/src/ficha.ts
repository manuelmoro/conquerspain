// La ficha de una comarca (ficha T-082): lo que el jugador sabe de ella y las acciones que puede
// darle, cada una con su coste, su duracion, su efecto previsto y, si esta bloqueada, su causa y su
// salida. Pura; la compone el servidor con el estado, pero solo ensenya lo que el jugador puede saber.
import { crearContexto } from './contexto.ts';
import { BLOQUEOS } from './datos/bloqueos.ts';
import { datosDeProduccion } from './fases/02-produccion.ts';
import { costeDeIntencion } from './ordenes/intencion.ts';
import {
  modificadoresDelJugador,
  permisosDelJugador,
  prohibicionesDelJugador,
} from './reglas/casas/index.ts';
import { impedimentoDeIncorporar } from './reglas/incorporar.ts';
import { impedimentoDeConstruir, solaresOcupados, solaresDe } from './reglas/obras.ts';
import { capacidadDe } from './reglas/poblar.ts';
import { explotacionesDe } from './reglas/produccion.ts';
import { impedimentoDeRoturar } from './reglas/roturar.ts';
import { vistaDeJugador } from './reglas/vista.ts';
import type { EstadoComarca, EstadoPartida, Fuero, CargaFiscal } from './tipos/estado.ts';
import type { IdComarca, IdJugador } from './tipos/ids.ts';
import type { Mundo, NivelPotencial, Potencial, Terreno } from './tipos/mundo.ts';
import type { Recurso, Recursos } from './tipos/recursos.ts';
import { RECURSOS, recursosSegun } from './tipos/recursos.ts';
import { TIPOS_DE_EDIFICIO } from './tipos/reglas.ts';
import type { TablasDeReglas, TipoEdificio } from './tipos/reglas.ts';
import { validarIntencion } from './ordenes/intencion.ts';

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
  readonly obras: readonly { que: string; avanceMil: number; necesarioMil: number }[];
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
): FichaDeComarca | null {
  const vista = vistaDeJugador(estado, jugador, mundo);
  const conocida = vista.comarcas[comarca];
  const geografia = mundo.comarcas[comarca];
  if (conocida === undefined || geografia === undefined) return null;
  const yo = vista.jugador;
  const base = { id: geografia.id, nombre: geografia.nombre };
  if (conocida.nivel === 'oida') {
    return {
      ...base,
      nivel: 'oida',
      terreno: null,
      potenciales: null,
      duenyo: null,
      propia: null,
      influenciaPropia: null,
      acciones: [],
    };
  }
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
    return { clave, titulo, intencion, coste, turnos, efecto, bloqueo: bloqueo(motivo) };
  };

  if (conocida.nivel === 'explorada') {
    const acciones: AccionDeFicha[] = [];
    const datos = conocida.datos;
    const neutral = datos === null || datos.duenyo === null;
    if (neutral) {
      const real = estado.comarcas[comarca];
      const t = reglas.influencia;
      const ultimo = real?.ultimoRegalo[yo.id];
      const reciente = ultimo !== undefined && estado.turno - ultimo < t.turnosEntreRegalos;
      acciones.push(
        accion(
          'regalo',
          'Hacer un regalo al concejo',
          { tipo: 'regalo', comarca },
          1,
          `+${String(t.porRegalo)} de influencia`,
          reciente ? 'regalo-reciente' : null,
          real,
        ),
      );
      // La incorporacion se juzga con lo que el jugador sabe de las demas casas, no con lo que hay.
      const conLoSabido: EstadoComarca | undefined =
        real === undefined
          ? undefined
          : {
              ...real,
              influencias: { ...conocida.influenciasAjenas, [yo.id]: real.influencias[yo.id] ?? 0 },
            };
      acciones.push(
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
      );
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
      acciones,
    };
  }

  const real = conocida.comarca;
  const ctx = crearContexto(estado, [], mundo, reglas);
  const producir = (c: EstadoComarca) =>
    explotacionesDe(datosDeProduccion(ctx, c, estado.jugadores[yo.id]), reglas);
  const prevision = producir(real);
  const antes = suma(prevision);
  const obras = vista.obras.filter((o) => o.comarca === comarca);
  const acciones: AccionDeFicha[] = [];
  for (const tipo of TIPOS_DE_EDIFICIO) {
    const datos = reglas.edificios[tipo];
    const nivel = real.edificios[tipo] ?? 0;
    const mas = { ...real, edificios: { ...real.edificios, [tipo]: nivel + 1 } };
    let efecto = diferenciaEnTexto(antes, suma(producir(mas)));
    if (tipo === 'casas') {
      efecto = `Capacidad de ${String(capacidadDe(real, reglas, casa.capacidadPorCasasExtra))} a ${String(capacidadDe(mas, reglas, casa.capacidadPorCasasExtra))} vecinos`;
    }
    const motivo = impedimentoDeConstruir(
      real,
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
        real,
      ),
    );
    if (nivel > 0) {
      const menos = { ...real, edificios: { ...real.edificios, [tipo]: nivel - 1 } };
      const perdida = diferenciaEnTexto(antes, suma(producir(menos)));
      acciones.push(
        accion(
          `derribar-${tipo}`,
          `Derribar un nivel de ${datos.nombre.toLowerCase()}`,
          { tipo: 'derribar', comarca, edificio: tipo },
          reglas.obras.turnosDerribo,
          `Libera un solar${perdida === '' ? '' : `; ${perdida}`}`,
          null,
          real,
        ),
      );
    }
  }
  const sinRoturar = prohibiciones.roturar ? 'prohibido-por-la-casa' : impedimentoDeRoturar(real);
  acciones.push(
    accion(
      'roturar',
      'Roturar monte',
      { tipo: 'roturar', comarca },
      reglas.obras.turnosRoturar,
      'Un punto de monte pasa a labor',
      sinRoturar,
      real,
    ),
  );
  const conAperos = { ...real, aperos: real.aperos + 1 };
  acciones.push(
    accion(
      'aperos',
      'Instalar aperos',
      { tipo: 'aperos', comarca },
      1,
      diferenciaEnTexto(antes, suma(producir(conAperos))) || 'Mejor labor',
      real.aperos >= casa.aperosMaximo ? 'aperos-al-maximo' : null,
      real,
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
      real,
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
      real,
    ),
  );

  return {
    ...base,
    nivel: 'propia',
    terreno: geografia.terreno,
    potenciales: real.potenciales,
    duenyo: yo.id,
    influenciaPropia: null,
    propia: {
      poblacion: real.poblacion,
      capacidad: capacidadDe(real, reglas, casa.capacidadPorCasasExtra),
      lealtad: real.lealtad,
      fuero: real.fuero,
      cargaFiscal: real.cargaFiscal,
      aperos: real.aperos,
      solares: {
        usados: solaresOcupados(real, vista.obras),
        total: solaresDe(geografia.solares, casa),
      },
      edificios: TIPOS_DE_EDIFICIO.filter((t) => (real.edificios[t] ?? 0) > 0).map((t) => ({
        tipo: t,
        nombre: reglas.edificios[t].nombre,
        nivel: real.edificios[t] ?? 0,
        maximo: casa.nivelMaximoEdificio[t] ?? reglas.edificios[t].nivelMaximo,
      })),
      obras: obras.map((o) => ({
        que: o.que,
        avanceMil: o.avanceMil,
        necesarioMil: o.avanceNecesarioMil,
      })),
      producido: real.produccionUltimoTurno,
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
