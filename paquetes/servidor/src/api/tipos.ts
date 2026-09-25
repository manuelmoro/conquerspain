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
}

export interface RespuestaHttp {
  readonly estado: number;
  /** Siempre JSON. */
  readonly cuerpo: unknown;
  readonly cabeceras: Readonly<Record<string, string>>;
}

/** Quien pone al jugador delante de la API. T-063 da el real: cuenta y sesion. */
export interface Autenticador {
  /** El identificador de la cuenta de la peticion, o null si no hay ninguna valida. */
  identificar(peticion: PeticionHttp): Promise<string | null>;
}
