// Precio base y elasticidad de los siete recursos (docs/03-economia.md §3.1 y §3.10; ficha T-037).
// Los precios son maravedis por carga, en milesimas; son cifras de partida que ajustara T-047.
import type { Recurso } from '../tipos/recursos.ts';
import type { DatosRecurso } from '../tipos/reglas.ts';

export const DATOS_DE_RECURSOS: Readonly<Record<Recurso, DatosRecurso>> = {
  // El pan pierde un 4 % por turno si no se conserva (CONSUMO): por eso es el mas barato.
  pan: { precioBaseMil: 3000, elasticidadMil: 400, mermaPorTurnoMil: 40, perecedero: true },
  madera: { precioBaseMil: 4000, elasticidadMil: 300, mermaPorTurnoMil: 0, perecedero: false },
  piedra: { precioBaseMil: 6000, elasticidadMil: 250, mermaPorTurnoMil: 0, perecedero: false },
  // Los maravedis son la moneda: su precio es 1 y no se comercian.
  maravedis: { precioBaseMil: 1000, elasticidadMil: 0, mermaPorTurnoMil: 0, perecedero: false },
  // Una carga de sal conserva cincuenta de pan: por eso vale mucho mas.
  sal: { precioBaseMil: 14000, elasticidadMil: 600, mermaPorTurnoMil: 0, perecedero: false },
  hierro: { precioBaseMil: 24000, elasticidadMil: 700, mermaPorTurnoMil: 0, perecedero: false },
  lana: { precioBaseMil: 50000, elasticidadMil: 500, mermaPorTurnoMil: 0, perecedero: false },
};
