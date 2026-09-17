// El atlas construye datos a partir de texto plano (catalogo y calculos), asi que en algun punto
// hay que marcar esas cadenas como identificadores del dominio. Se hace aqui y solo aqui.
import type { IdComarca, IdFeria } from '@conquer/nucleo';

export function idComarca(valor: string): IdComarca {
  return valor as IdComarca;
}

export function idFeria(valor: string): IdFeria {
  return valor as IdFeria;
}
