import { CASAS, TABLAS_DEL_JUEGO } from '@conquer/nucleo';
import { jugarPartida } from './ejecutar.ts';
import { resumir } from './metricas.ts';
import { mundoPeninsula } from './partida.ts';
const mundo = mundoPeninsula();
const turnos = Number(process.argv[2] ?? 100);
for (const cadencia of [1, 6]) {
  const p = jugarPartida({
    semilla: '1492',
    turnos,
    casas: CASAS,
    cadencia,
    reglas: TABLAS_DEL_JUEGO,
    mundo,
    estados: null,
  });
  for (const j of p.jugadores) {
    const r = resumir(p, j);
    console.log(
      `${cadencia} ${j.casa.padEnd(11)} prest ${String(r.prestigio).padStart(5)} jorn ${String(r.jornadas).padStart(4)} obras ${String(r.obrasTerminadas).padStart(3)} com ${String(r.volumenComerciado).padStart(5)} pueblas ${r.pueblasFundadas} inc ${r.comarcasIncorporadas} pobl ${r.poblacion}`,
    );
  }
}
