// Lo que el reloj cuenta de lo que hace. T-064 lo convertira en avisos; de momento es un registro
// que el servidor puede mandar a donde quiera (consola, fichero) y que las pruebas leen.
export type NivelDeRegistro = 'info' | 'aviso' | 'error';

export interface EntradaDeRegistro {
  readonly nivel: NivelDeRegistro;
  readonly evento: string;
  readonly datos: Readonly<Record<string, string | number>>;
}

export interface Registro {
  anotar(
    nivel: NivelDeRegistro,
    evento: string,
    datos?: Readonly<Record<string, string | number>>,
  ): void;
}

/** Guarda las entradas en memoria: para las pruebas y para quien quiera mirar lo ultimo. */
export class RegistroEnMemoria implements Registro {
  readonly entradas: EntradaDeRegistro[] = [];

  anotar(
    nivel: NivelDeRegistro,
    evento: string,
    datos: Readonly<Record<string, string | number>> = {},
  ): void {
    this.entradas.push({ nivel, evento, datos });
  }

  eventos(nivel?: NivelDeRegistro): string[] {
    return this.entradas
      .filter((e) => nivel === undefined || e.nivel === nivel)
      .map((e) => e.evento);
  }
}
