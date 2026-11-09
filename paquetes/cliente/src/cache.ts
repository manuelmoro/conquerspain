// Lo que la interfaz trae del servidor al pintar (fichas, mercado, cronicas, clasificacion), por clave.
// Una peticion que falla **no se repite** en cada repintado: antes, un fallo borraba la entrada y la
// siguiente repintada volvia a pedir, en bucle, hasta topar con el limite del servidor (T-090). Se
// vuelve a pedir solo con una clave nueva (otro turno, otra vista) o si se olvida a proposito.
type Entrada<T> =
  | { readonly tipo: 'cargando' }
  | { readonly tipo: 'listo'; readonly valor: T }
  | { readonly tipo: 'fallo' };

export class CacheDeServidor<T> {
  private readonly entradas = new Map<string, Entrada<T>>();

  /**
   * Lo guardado para `clave`, o null mientras llega o si fallo. La primera vez lanza `pedir`, y al
   * terminar avisa con `alLlegar` para que se repinte.
   */
  leer(clave: string, pedir: () => Promise<T | null>, alLlegar: () => void): T | null {
    const entrada = this.entradas.get(clave);
    if (entrada === undefined) {
      this.entradas.set(clave, { tipo: 'cargando' });
      void pedir().then(
        (valor) => {
          this.entradas.set(clave, valor === null ? { tipo: 'fallo' } : { tipo: 'listo', valor });
          alLlegar();
        },
        () => {
          this.entradas.set(clave, { tipo: 'fallo' });
          alLlegar();
        },
      );
      return null;
    }
    return entrada.tipo === 'listo' ? entrada.valor : null;
  }

  /** Si lo de `clave` fallo: la pantalla lo dice en vez de quedarse «cargando». */
  fallo(clave: string): boolean {
    return this.entradas.get(clave)?.tipo === 'fallo';
  }

  /** Olvida una clave, para que se vuelva a pedir (un «reintentar» del jugador). */
  olvidar(clave: string): void {
    this.entradas.delete(clave);
  }
}
