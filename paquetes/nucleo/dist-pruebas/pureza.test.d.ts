interface Prohibicion {
    readonly nombre: string;
    readonly patron: RegExp;
    readonly motivo: string;
    /** true: se busca sobre el codigo sin comentarios ni cadenas. */
    readonly soloCodigo: boolean;
}
/** Sustituye comentarios y cadenas por espacios, conservando los saltos de linea. */
export declare function limpiarCodigo(texto: string): string;
interface Infraccion {
    readonly archivo: string;
    readonly linea: number;
    readonly texto: string;
    readonly prohibicion: Prohibicion;
}
export declare function buscarInfracciones(archivo: string, contenido: string): Infraccion[];
export {};
//# sourceMappingURL=pureza.test.d.ts.map