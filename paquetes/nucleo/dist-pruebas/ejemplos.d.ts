/** Los ejemplos son datos sueltos: los validadores reciben "unknown" y ellos dicen si valen. */
export type Registro = Record<string, unknown>;
/** Copia con un campo cambiado, para escribir casos invalidos sin repetir el ejemplo entero. */
export declare function con(base: Registro, cambios: Registro): Registro;
/** Copia con un campo anidado cambiado: `dentro(estado, 'jugadores', 'mesta', { credito: -1 })`. */
export declare function dentro(base: Registro, clave: string, subclave: string, cambios: Registro): Registro;
export declare function recursosCon(cantidades: Record<string, number>): Record<string, number>;
export declare function mundoDeEjemplo(): Registro;
export declare function ordenDeEjemplo(): Registro;
export declare function estadoDeEjemplo(): Registro;
export declare function tablasDeEjemplo(): Registro;
//# sourceMappingURL=ejemplos.d.ts.map