// Con que empieza cada casa en su comarca de origen y como se recorta el mapa a los participantes
// (fichas T-032 §4.6 y T-049 §4.2 y §4.5; lo aplica `src/partidas/`).
//
// El arranque ya no es plano: dos granjas alimentan un origen tipico (labor 3, unos 75 vecinos),
// pero no uno de labor 1, asi que el alta ajusta los niveles a lo que la comarca puede dar y
// compensa con maravedis lo que la tierra no llega a producir en el anyo.
import type { DatosArranque } from '../tipos/reglas.ts';

export const ARRANQUE: DatosArranque = {
  almacen: { pan: 80, madera: 60, piedra: 20, maravedis: 60, sal: 0, hierro: 0, lana: 0 },
  edificiosDeOrigen: { granja: 1 },
  ajuste: {
    activo: true,
    granjasMaximas: 3,
    coberturaMinimaMil: 950,
    coberturaDeCompradorMil: 700,
    laborDePescador: 2,
    pescaDeLonja: 3,
    salPorLonja: 10,
    maravedisMaximos: 400,
  },
  recorte: {
    // Medido en T-049 §9: con 26 por jugador, las ocho casas caben a la primera casi siempre y el
    // recorte queda en unas 216 comarcas. Con menos hacen falta reintentos y sobran avisos.
    comarcasPorJugador: 26,
    minimoDeComarcas: 40,
    jornadasEntreCapitales: 6,
    intentosMaximos: 6,
    crecimientoPorIntentoMil: 1200,
    salMinima: 3,
    hierroMinimo: 3,
    laborAlta: 4,
    pastoAlto: 4,
    laborAltaMinima: 3,
    feriasMinimas: 1,
    origenesPorCasa: 3,
    // Con mas de ocho jugadores (temporada, hasta doce, T-100): tres ofertas por cabeza a seis jornadas
    // de todas las demas no caben, y el recorte apenas quitaria nada. Medido en T-100 §9.
    jugadoresParaPeninsulaEntera: 9,
    origenesConMuchosJugadores: 2,
    // La equidad: lo que hay a seis jornadas de cada comienzo, y el peor frente al mejor.
    jornadasDeAlcance: 6,
    equidadMinimaMil: 600,
  },
};
