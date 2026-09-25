// Donde el cliente guarda lo que no puede perder (ficha T-080 §4.3 y §4.5): la bandeja y la ultima
// vista buena. En el navegador, localStorage; en las pruebas, memoria.
export interface Guardado {
  leer(clave: string): string | null;
  escribir(clave: string, valor: string): void;
  borrar(clave: string): void;
}

export class GuardadoEnMemoria implements Guardado {
  private readonly datos = new Map<string, string>();

  leer(clave: string): string | null {
    return this.datos.get(clave) ?? null;
  }

  escribir(clave: string, valor: string): void {
    this.datos.set(clave, valor);
  }

  borrar(clave: string): void {
    this.datos.delete(clave);
  }
}

/** localStorage si existe y deja escribir (en modo privado puede negarse); si no, memoria. */
export function guardadoDelNavegador(): Guardado {
  try {
    const almacen = globalThis.localStorage;
    const prueba = '__conquer__';
    almacen.setItem(prueba, '1');
    almacen.removeItem(prueba);
    return {
      leer: (clave) => almacen.getItem(clave),
      escribir: (clave, valor) => {
        almacen.setItem(clave, valor);
      },
      borrar: (clave) => {
        almacen.removeItem(clave);
      },
    };
  } catch {
    return new GuardadoEnMemoria();
  }
}
