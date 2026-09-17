import type { EstadoPartida } from '../src/tipos/estado.ts';
import type { Mundo } from '../src/tipos/mundo.ts';
import type { TablasDeReglas } from '../src/tipos/reglas.ts';
/** El mundo mini, ya validado: si alguien lo estropea, falla al cargarlo y no en mitad de un test. */
export declare function mundoMini(): Mundo;
/** Estado inicial de la partida de pruebas: un jugador en el llano, seis comarcas neutrales. */
export declare function estadoMini(): EstadoPartida;
/** Tablas de reglas para las pruebas del motor. */
export declare function tablasMini(): TablasDeReglas;
//# sourceMappingURL=mundo-mini.d.ts.map