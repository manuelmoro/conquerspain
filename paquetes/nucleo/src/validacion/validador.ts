// Validacion de todo lo que entra de fuera del motor: estados guardados, ordenes de un cliente,
// datos del mundo y tablas de reglas. Sin dependencias: unos pocos combinadores que acumulan
// errores con la ruta del campo culpable y el mensaje en espanyol.
import { comparar } from '../utiles/orden.ts';

export interface ErrorValidacion {
  readonly ruta: string;
  readonly mensaje: string;
}

export type Resultado<T> =
  | { readonly ok: true; readonly valor: T }
  | { readonly ok: false; readonly errores: readonly ErrorValidacion[] };

export type Validador<T> = (dato: unknown, ruta: string) => Resultado<T>;

export function valido<T>(valor: T): Resultado<T> {
  return { ok: true, valor };
}

export function invalido<T>(ruta: string, mensaje: string): Resultado<T> {
  return { ok: false, errores: [{ ruta: ruta === '' ? '(raiz)' : ruta, mensaje }] };
}

export function invalidos<T>(errores: readonly ErrorValidacion[]): Resultado<T> {
  return { ok: false, errores };
}

/** Texto legible de un resultado fallido, pensado para registros y mensajes de error. */
export function explicar(errores: readonly ErrorValidacion[]): string {
  return errores.map((error) => `  · ${error.ruta} → ${error.mensaje}`).join('\n');
}

function unir(ruta: string, clave: string): string {
  return ruta === '' ? clave : `${ruta}.${clave}`;
}

function tipoDe(dato: unknown): string {
  if (dato === null) return 'null';
  if (Array.isArray(dato)) return 'lista';
  return typeof dato;
}

// ——— Tipos basicos ——————————————————————————————————————————————————————————

export interface OpcionesTexto {
  readonly minimo?: number;
  readonly maximo?: number;
  readonly patron?: RegExp;
  readonly descripcionDelPatron?: string;
}

export function texto(opciones: OpcionesTexto = {}): Validador<string> {
  return (dato, ruta) => {
    if (typeof dato !== 'string') {
      return invalido(ruta, `se esperaba un texto y llego ${tipoDe(dato)}`);
    }
    if (opciones.minimo !== undefined && dato.length < opciones.minimo) {
      return invalido(
        ruta,
        `el texto tiene ${String(dato.length)} caracteres y necesita al menos ${String(opciones.minimo)}`,
      );
    }
    if (opciones.maximo !== undefined && dato.length > opciones.maximo) {
      return invalido(
        ruta,
        `el texto tiene ${String(dato.length)} caracteres y el maximo son ${String(opciones.maximo)}`,
      );
    }
    if (opciones.patron !== undefined && !opciones.patron.test(dato)) {
      const forma = opciones.descripcionDelPatron ?? opciones.patron.source;
      return invalido(ruta, `"${dato}" no tiene la forma esperada (${forma})`);
    }
    return valido(dato);
  };
}

export interface OpcionesEntero {
  readonly minimo?: number;
  readonly maximo?: number;
}

export function entero(opciones: OpcionesEntero = {}): Validador<number> {
  return (dato, ruta) => {
    if (typeof dato !== 'number') {
      return invalido(ruta, `se esperaba un numero entero y llego ${tipoDe(dato)}`);
    }
    if (!Number.isSafeInteger(dato)) {
      return invalido(
        ruta,
        `${String(dato)} no es un entero seguro: en el motor no hay coma flotante, las fracciones van en milesimas`,
      );
    }
    if (opciones.minimo !== undefined && dato < opciones.minimo) {
      return invalido(ruta, `${String(dato)} es menor que el minimo (${String(opciones.minimo)})`);
    }
    if (opciones.maximo !== undefined && dato > opciones.maximo) {
      return invalido(ruta, `${String(dato)} es mayor que el maximo (${String(opciones.maximo)})`);
    }
    return valido(dato);
  };
}

export function enteroNoNegativo(maximo?: number): Validador<number> {
  return maximo === undefined ? entero({ minimo: 0 }) : entero({ minimo: 0, maximo });
}

export function booleano(): Validador<boolean> {
  return (dato, ruta) =>
    typeof dato === 'boolean'
      ? valido(dato)
      : invalido(ruta, `se esperaba verdadero o falso y llego ${tipoDe(dato)}`);
}

/** Uno de una lista cerrada de valores. */
export function unoDe<T extends string>(valores: readonly T[]): Validador<T> {
  return (dato, ruta) => {
    if (typeof dato !== 'string') {
      return invalido(ruta, `se esperaba uno de [${valores.join(', ')}] y llego ${tipoDe(dato)}`);
    }
    const encontrado = valores.find((valor) => valor === dato);
    return encontrado === undefined
      ? invalido(
          ruta,
          `"${dato}" no es un valor admitido; los admitidos son [${valores.join(', ')}]`,
        )
      : valido(encontrado);
  };
}

/** Identificador del dominio: minusculas, sin tildes ni enyes, con guiones. */
export function identificador<T extends string>(): Validador<T> {
  const validarTexto = texto({
    minimo: 1,
    maximo: 64,
    patron: /^[a-z0-9][a-z0-9-]*$/,
    descripcionDelPatron: 'minusculas, digitos y guiones, sin tildes ni enyes',
  });
  return (dato, ruta) => {
    const resultado = validarTexto(dato, ruta);
    return resultado.ok ? valido(resultado.valor as T) : resultado;
  };
}

export function oNulo<T>(validador: Validador<T>): Validador<T | null> {
  return (dato, ruta) => (dato === null ? valido(null) : validador(dato, ruta));
}

// ——— Estructuras ——————————————————————————————————————————————————————————

export interface OpcionesLista {
  readonly minimo?: number;
  readonly maximo?: number;
}

export function lista<T>(elemento: Validador<T>, opciones: OpcionesLista = {}): Validador<T[]> {
  return (dato, ruta) => {
    if (!Array.isArray(dato)) {
      return invalido(ruta, `se esperaba una lista y llego ${tipoDe(dato)}`);
    }
    if (opciones.minimo !== undefined && dato.length < opciones.minimo) {
      return invalido(
        ruta,
        `la lista tiene ${String(dato.length)} elementos y necesita al menos ${String(opciones.minimo)}`,
      );
    }
    if (opciones.maximo !== undefined && dato.length > opciones.maximo) {
      return invalido(
        ruta,
        `la lista tiene ${String(dato.length)} elementos y el maximo son ${String(opciones.maximo)}`,
      );
    }
    const valores: T[] = [];
    const errores: ErrorValidacion[] = [];
    dato.forEach((elementoDato: unknown, indice) => {
      const resultado = elemento(elementoDato, unir(ruta, String(indice)));
      if (resultado.ok) valores.push(resultado.valor);
      else errores.push(...resultado.errores);
    });
    return errores.length > 0 ? invalidos(errores) : valido(valores);
  };
}

function esRegistro(dato: unknown): dato is Record<string, unknown> {
  return typeof dato === 'object' && dato !== null && !Array.isArray(dato);
}

/** Diccionario de clave libre (por ejemplo, comarcas por identificador). */
export function registro<T>(
  valorValidador: Validador<T>,
  claveValidador: Validador<string> = texto({ minimo: 1 }),
): Validador<Record<string, T>> {
  return (dato, ruta) => {
    if (!esRegistro(dato)) {
      return invalido(ruta, `se esperaba un objeto y llego ${tipoDe(dato)}`);
    }
    const valores: Record<string, T> = {};
    const errores: ErrorValidacion[] = [];
    for (const clave of Object.keys(dato).sort(comparar)) {
      const rutaHija = unir(ruta, clave);
      const resultadoClave = claveValidador(clave, rutaHija);
      if (!resultadoClave.ok) {
        errores.push(...resultadoClave.errores);
        continue;
      }
      const resultado = valorValidador(dato[clave], rutaHija);
      if (resultado.ok) valores[clave] = resultado.valor;
      else errores.push(...resultado.errores);
    }
    return errores.length > 0 ? invalidos(errores) : valido(valores);
  };
}

/** Registro con un conjunto cerrado y obligatorio de claves (los siete recursos, por ejemplo). */
export function registroCompleto<C extends string, T>(
  claves: readonly C[],
  valorValidador: Validador<T>,
): Validador<Record<C, T>> {
  return (dato, ruta) => {
    if (!esRegistro(dato)) {
      return invalido(ruta, `se esperaba un objeto y llego ${tipoDe(dato)}`);
    }
    const valores = {} as Record<C, T>;
    const errores: ErrorValidacion[] = [];
    for (const clave of claves) {
      if (!(clave in dato)) {
        errores.push({ ruta: unir(ruta, clave), mensaje: 'falta este campo' });
        continue;
      }
      const resultado = valorValidador(dato[clave], unir(ruta, clave));
      if (resultado.ok) valores[clave] = resultado.valor;
      else errores.push(...resultado.errores);
    }
    for (const clave of Object.keys(dato).sort(comparar)) {
      if (!claves.some((admitida) => admitida === clave)) {
        errores.push({
          ruta: unir(ruta, clave),
          mensaje: `campo desconocido; los admitidos son [${claves.join(', ')}]`,
        });
      }
    }
    return errores.length > 0 ? invalidos(errores) : valido(valores);
  };
}

export type CamposDe<F> = { [K in keyof F]-?: Validador<F[K]> };

export interface OpcionesObjeto {
  /** Si es true (lo normal), un campo desconocido es un error. */
  readonly estricto?: boolean;
}

/**
 * Objeto con campos conocidos. Por defecto es estricto: cualquier campo de mas es un error,
 * de modo que un cliente manipulado no puede colar datos que el motor ignoraria en silencio.
 */
export function objeto<F extends object>(
  campos: CamposDe<F>,
  opciones: OpcionesObjeto = {},
): Validador<F> {
  // Sin `parcial`, cada campo ausente es un error: si no hay errores, estan todos.
  return camposDe<F, F>(campos, opciones.estricto ?? true, false);
}

/**
 * Objeto estricto en el que cada campo puede faltar: lo que no se dice no cambia (los
 * modificadores de una tradicion, que solo cuentan lo que tocan).
 */
export function objetoParcial<F extends object>(campos: CamposDe<F>): Validador<Partial<F>> {
  return camposDe<F, Partial<F>>(campos, true, true);
}

function camposDe<F extends object, R>(
  campos: CamposDe<F>,
  estricto: boolean,
  parcial: boolean,
): Validador<R> {
  // Unico punto del modulo donde se pierde el tipo: el mapa de campos se recorre por nombre.
  // La firma publica sigue siendo segura, porque CamposDe<F> obliga a declararlos todos.
  const validadorDe = (nombre: string): Validador<unknown> | undefined =>
    (campos as Record<string, Validador<unknown> | undefined>)[nombre];
  return (dato, ruta) => {
    if (!esRegistro(dato)) {
      return invalido(ruta, `se esperaba un objeto y llego ${tipoDe(dato)}`);
    }
    const valores: Record<string, unknown> = {};
    const errores: ErrorValidacion[] = [];
    const nombres = Object.keys(campos).sort(comparar);
    for (const nombre of nombres) {
      const validador = validadorDe(nombre);
      if (validador === undefined) continue;
      if (!(nombre in dato)) {
        if (!parcial) errores.push({ ruta: unir(ruta, nombre), mensaje: 'falta este campo' });
        continue;
      }
      const resultado = validador(dato[nombre], unir(ruta, nombre));
      if (resultado.ok) valores[nombre] = resultado.valor;
      else errores.push(...resultado.errores);
    }
    if (estricto) {
      for (const clave of Object.keys(dato).sort(comparar)) {
        if (!nombres.includes(clave)) {
          errores.push({ ruta: unir(ruta, clave), mensaje: 'campo desconocido' });
        }
      }
    }
    return errores.length > 0 ? invalidos(errores) : valido(valores as unknown as R);
  };
}

/** Union discriminada por un campo de texto, como el `tipo` de las ordenes. */
export function porTipo<T extends { readonly tipo: string }>(
  variantes: Readonly<Record<string, Validador<T>>>,
): Validador<T> {
  return (dato, ruta) => {
    if (!esRegistro(dato)) {
      return invalido(ruta, `se esperaba un objeto y llego ${tipoDe(dato)}`);
    }
    const tipo = dato['tipo'];
    if (typeof tipo !== 'string') {
      return invalido(unir(ruta, 'tipo'), 'falta el tipo o no es un texto');
    }
    const variante = variantes[tipo];
    if (variante === undefined) {
      const admitidos = Object.keys(variantes).sort(comparar).join(', ');
      return invalido(
        unir(ruta, 'tipo'),
        `"${tipo}" no es un tipo admitido; los admitidos son [${admitidos}]`,
      );
    }
    return variante(dato, ruta);
  };
}

/** Anyade una comprobacion extra a un validador ya existente. */
export function conRegla<T>(
  validador: Validador<T>,
  regla: (valor: T) => string | null,
): Validador<T> {
  return (dato, ruta) => {
    const resultado = validador(dato, ruta);
    if (!resultado.ok) return resultado;
    const problema = regla(resultado.valor);
    return problema === null ? resultado : invalido(ruta, problema);
  };
}
