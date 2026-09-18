// Piezas de validacion que comparten el mundo, el estado, las ordenes y las tablas.
import type { EfectoAcontecimiento } from '../tipos/estado.ts';
import { QUE_DE_EFECTO } from '../tipos/estado.ts';
import type { Coordenada, NivelPotencial, Punto } from '../tipos/mundo.ts';
import { TERRENOS } from '../tipos/mundo.ts';
import type { Recurso, Recursos } from '../tipos/recursos.ts';
import { RECURSOS } from '../tipos/recursos.ts';
import type { Validador } from './validador.ts';
import {
  entero,
  enteroNoNegativo,
  invalido,
  lista,
  oNulo,
  objeto,
  registro,
  registroCompleto,
  unoDe,
  valido,
} from './validador.ts';

/** Par de numeros enteros: coordenada geografica en milesimas de grado o punto del mapa. */
export function par(): Validador<Coordenada & Punto> {
  const validarLista = lista(entero(), { minimo: 2, maximo: 2 });
  return (dato, ruta) => {
    const resultado = validarLista(dato, ruta);
    if (!resultado.ok) return resultado;
    const [primero, segundo] = resultado.valor;
    if (primero === undefined || segundo === undefined) {
      return invalido(ruta, 'un par necesita exactamente dos numeros');
    }
    return valido([primero, segundo] as Coordenada & Punto);
  };
}

export function nivelPotencial(): Validador<NivelPotencial> {
  const validarEntero = entero({ minimo: 0, maximo: 5 });
  return (dato, ruta) => {
    const resultado = validarEntero(dato, ruta);
    return resultado.ok ? valido(resultado.valor as NivelPotencial) : resultado;
  };
}

/** Los siete recursos, todos presentes y sin cantidades negativas. */
export function recursos(): Validador<Recursos> {
  return registroCompleto(RECURSOS, enteroNoNegativo());
}

/** Algunos recursos, con cantidades no negativas: costes parciales y producciones. */
export function recursosParciales(): Validador<Readonly<Partial<Record<Recurso, number>>>> {
  const validarRegistro = registro(enteroNoNegativo());
  return (dato, ruta) => {
    const resultado = validarRegistro(dato, ruta);
    if (!resultado.ok) return resultado;
    for (const clave of Object.keys(resultado.valor)) {
      if (!RECURSOS.some((recurso) => recurso === clave)) {
        return invalido(`${ruta}.${clave}`, `"${clave}" no es un recurso del juego`);
      }
    }
    return valido(resultado.valor as Readonly<Partial<Record<Recurso, number>>>);
  };
}

/** Porcentaje en milesimas, acotado a un rango razonable para el equilibrio. */
export function milesimas(minimo = 0, maximo = 10000): Validador<number> {
  return entero({ minimo, maximo });
}

/** Un efecto de acontecimiento; que su medida este en la horquilla lo comprueban las tablas. */
export function efectoDeAcontecimiento(): Validador<EfectoAcontecimiento> {
  return objeto<EfectoAcontecimiento>({
    que: unoDe(QUE_DE_EFECTO),
    recurso: oNulo(unoDe(RECURSOS)),
    terreno: oNulo(unoDe(TERRENOS)),
    factorMil: milesimas(0, 5000),
    cantidad: entero({ minimo: 0, maximo: 100 }),
  });
}
