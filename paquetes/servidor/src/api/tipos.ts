// Los tipos de la frontera HTTP. La API es una funcion pura de `PeticionHttp` a `RespuestaHttp`, asi
// que se prueba sin abrir un puerto; `http.ts` es el adaptador de `node:http` (ficha T-062 §4.1).
export interface PeticionHttp {
  readonly metodo: string;
  /** Solo la ruta, sin consulta: `/partidas/p1/estado`. */
  readonly ruta: string;
  /** Cabeceras con el nombre en minusculas. */
  readonly cabeceras: Readonly<Record<string, string>>;
  /** El cuerpo tal como llego, o null si no habia. */
  readonly cuerpo: string | null;
  /** La direccion del cliente, para limitar lo que llega sin sesion. La rellena el adaptador. */
  readonly origen?: string;
}

/**
 * Un flujo de eventos (SSE, T-064): se arranca con la funcion que escribe y devuelve la que lo para
 * cuando el cliente se va.
 */
export type Flujo = (escribir: (texto: string) => void) => () => void;

export interface RespuestaHttp {
  readonly estado: number;
  /** JSON; null si la respuesta es un flujo. */
  readonly cuerpo: unknown;
  readonly cabeceras: Readonly<Record<string, string>>;
  /** Si esta, la respuesta no acaba: el adaptador escribe lo que el flujo mande. */
  readonly flujo?: Flujo;
}

/** Quien pone al jugador delante de la API. T-063 da el real: cuenta y sesion. */
export interface Autenticador {
  /** El identificador de la cuenta de la peticion, o null si no hay ninguna valida. */
  identificar(peticion: PeticionHttp): Promise<string | null>;
}
