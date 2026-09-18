// Fase 01 · Calendario (T-030, docs/02-diseno-nucleo.md §2.1).
//
// El calendario, la estacion y el clima ya estan en el contexto, porque son funcion pura del turno.
// Esta fase publica lo que cambia: la estacion que empieza, los puertos que cierra o abre la nieve,
// las ferias que abren y el clima del anyo que viene, anunciado en el ultimo turno del anyo.
import type { Contexto } from '../contexto.ts';
import type { ClimaAnual } from '../reglas/calendario.ts';
import {
  TURNOS_POR_ANYO,
  climaDelAnyo,
  estacionDe,
  puertosCerradosEn,
} from '../reglas/calendario.ts';
import { registrarSuceso } from '../sucesos.ts';

function anunciarClima(ctx: Contexto, clima: ClimaAnual): void {
  if (clima.modificadores.length === 0) {
    registrarSuceso(ctx.sucesos, ctx.fase, 'calendario.clima-anunciado', {
      anyo: clima.anyo,
      efecto: 'normal',
    });
    return;
  }
  for (const modificador of clima.modificadores) {
    registrarSuceso(ctx.sucesos, ctx.fase, 'calendario.clima-anunciado', {
      anyo: clima.anyo,
      regiones: modificador.regiones.join(','),
      estacion: modificador.estacion,
      efecto: modificador.efecto,
      factorPanMil: modificador.factorPanMil,
    });
  }
}

export function faseCalendario(ctx: Contexto): void {
  const { calendario, estacional, turno } = ctx;
  const recienCreada = ctx.estado.huellaTurnoAnterior === null;

  const anterior = turno > 1 ? estacionDe(turno - 1, ctx.reglas) : null;
  if (recienCreada || anterior !== estacional.estacion) {
    registrarSuceso(ctx.sucesos, ctx.fase, 'calendario.estacion', {
      estacion: estacional.estacion,
      nombre: calendario.nombre,
    });
  }

  const cerradosAntes = new Set(
    anterior === null || recienCreada ? [] : puertosCerradosEn(anterior, ctx.mundo),
  );
  const cerradosAhora = new Set(estacional.puertosCerrados);
  for (const puerto of estacional.puertosCerrados) {
    if (!cerradosAntes.has(puerto)) {
      registrarSuceso(ctx.sucesos, ctx.fase, 'calendario.puerto-cerrado', { puerto });
    }
  }
  for (const puerto of [...cerradosAntes].sort()) {
    if (!cerradosAhora.has(puerto)) {
      registrarSuceso(ctx.sucesos, ctx.fase, 'calendario.puerto-abierto', { puerto });
    }
  }

  for (const id of calendario.feriasActivas) {
    for (const comarca of Object.values(ctx.mundo.comarcas)) {
      const feria = comarca.ferias.find((suya) => suya.id === id);
      if (feria === undefined) continue;
      if (Math.min(...feria.turnos) !== calendario.turnoDelAnyo) continue;
      registrarSuceso(
        ctx.sucesos,
        ctx.fase,
        'calendario.feria-abierta',
        { feria: feria.id, nombre: feria.nombre, volumen: feria.volumen },
        { comarca: comarca.id },
      );
    }
  }

  if (recienCreada) anunciarClima(ctx, ctx.clima);
  if (calendario.turnoDelAnyo === TURNOS_POR_ANYO) {
    anunciarClima(ctx, climaDelAnyo(ctx.semilla, calendario.anyo + 1, ctx.mundo));
  }
}
