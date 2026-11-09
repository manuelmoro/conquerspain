// El panel de mercado de un jugador (ficha T-084 §4.1): las plazas que conoce, si estan abiertas o
// cuando abren, sus precios **con la fecha y la fuente con que se supieron**, y sus recuas que estan
// alli. Sale del tablero, asi que no ensenya nada que el jugador no sepa.
import type { FuenteDePrecios } from '../tipos/estado.ts';
import type { IdComarca, IdMercado, IdRecua } from '../tipos/ids.ts';
import { idDeMercadoDeFeria } from '../tipos/ids.ts';
import type { Mundo, VolumenFeria } from '../tipos/mundo.ts';
import type { Recurso } from '../tipos/recursos.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import { comparar } from '../utiles/orden.ts';
import { Tablero } from './tablero.ts';
import type { PlazaConocida } from './tablero.ts';

/** Lo que se comercia: todo menos los maravedis, que son la moneda (docs/03 §3.10.1). */
export const RECURSOS_DE_MERCADO: readonly Recurso[] = RECURSOS.filter((r) => r !== 'maravedis');

export interface PrecioEnPlaza {
  readonly mil: number;
  /** El precio base de esa comarca (docs/03 §3.10.2): la vara de lo caro y lo barato. */
  readonly baseMil: number;
}

export interface RecuaEnPlaza {
  readonly id: IdRecua;
  readonly nombre: string;
  /** Tiene el cometido `tratar`: sus ordenes de mercado se ejecutan. */
  readonly trata: boolean;
}

export interface PlazaEnPanel {
  readonly id: IdMercado;
  readonly comarca: IdComarca;
  readonly nombre: string;
  readonly tipo: 'local' | 'feria';
  readonly volumen: VolumenFeria;
  readonly abierta: boolean;
  /** Turnos que faltan para que abra: 0 si esta abierta. */
  readonly abreEn: number;
  /** Lo que se supo, o null si de esta plaza no se sabe ningun precio. */
  readonly precios: Readonly<Partial<Record<Recurso, PrecioEnPlaza>>> | null;
  readonly turnoDelPrecio: number | null;
  readonly fuente: FuenteDePrecios | null;
  readonly recuas: readonly RecuaEnPlaza[];
}

export interface PanelDeMercado {
  readonly turno: number;
  readonly plazas: readonly PlazaEnPanel[];
}

function nombreDePlaza(t: Tablero, plaza: PlazaConocida, mundo: Mundo): string {
  const comarca = mundo.comarcas[plaza.comarca];
  if (plaza.tipo === 'feria') {
    const feria = comarca?.ferias.find((f) => idDeMercadoDeFeria(f.id) === plaza.id);
    return feria?.nombre ?? `Feria de ${comarca?.nombre ?? 'una comarca'}`;
  }
  const tieneMercado = (t.edificiosSabidos(plaza.comarca)['mercado'] ?? 0) > 0;
  return `${tieneMercado ? 'Mercado' : 'Venta'} de ${comarca?.nombre ?? 'una comarca'}`;
}

export function panelDeMercado(t: Tablero, mundo: Mundo): PanelDeMercado {
  const plazas = t.plazasConocidas().map((plaza): PlazaEnPanel => {
    const sabido = t.yo.plazas[plaza.id];
    const precios =
      sabido === undefined
        ? null
        : Object.fromEntries(
            RECURSOS_DE_MERCADO.map((r) => [
              r,
              { mil: sabido.preciosMil[r], baseMil: t.baseEn(plaza.comarca, r) },
            ]),
          );
    const abreEn = t.turnosHastaQueAbra(plaza);
    const recuas = t.recuas
      .filter((r) => Tablero.quieta(r) && Tablero.donde(r) === plaza.comarca)
      .map((r) => ({ id: r.id, nombre: r.nombre, trata: r.cometido === 'tratar' }));
    return {
      id: plaza.id,
      comarca: plaza.comarca,
      nombre: nombreDePlaza(t, plaza, mundo),
      tipo: plaza.tipo,
      volumen: plaza.volumen,
      abierta: abreEn === 0,
      abreEn,
      precios,
      turnoDelPrecio: sabido?.turno ?? null,
      fuente: sabido?.fuente ?? null,
      recuas,
    };
  });
  plazas.sort(
    (a, b) =>
      Number(b.abierta) - Number(a.abierta) ||
      a.abreEn - b.abreEn ||
      comparar(a.nombre, b.nombre) ||
      comparar(a.id, b.id),
  );
  return { turno: t.turno, plazas };
}
