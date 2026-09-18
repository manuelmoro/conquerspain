# T-041 · Casas: privilegios y herramientas

**Fase:** 2 · Motor · **Depende de:** T-035, T-037 · **Estado:** pendiente

## 1. Contexto

Aquí se juega la asimetría, que es lo que hace que una partida se parezca a VGA Planets y no a un
juego de construir pueblos. Cada casa tiene que cambiar **reglas**, no multiplicar números.

Lee antes: [docs/04-casas-y-tradiciones.md](../04-casas-y-tradiciones.md) entero.

## 2. Objetivo

Un sistema de modificadores de casa limpio, con las ocho casas implementadas, probadas una a una, y
sin que el motor se llene de condicionales por casa.

## 3. Alcance

**Entra:** infraestructura de modificadores, las ocho casas con su privilegio, su herramienta y su
límite, y la elección de casa al crear la partida.

**No entra:** tradiciones (T-042), equilibrio fino (T-047), lo que dependa de mecánicas de conflicto
(queda desactivado y documentado).

**Heredado de T-034.** Los monjes fundan puebla con la mitad de gente: hoy
`cometidos.vecinosParaPuebla` (10) es igual para todas las casas y `impedimentoDePuebla`
(`reglas/poblar.ts`) no consulta la casa; hay que añadir el modificador. `pasoRecuaMil` es aditivo
(arrieros: +1000) y `porteExtra` ya entra en el porte de las recuas. **De T-035:** la fase de obras
ya aplica `solaresExtra`, `nivelMaximoEdificio`, `potencialMinimoEdificio`,
`obraSinFrenazoInvernal`, `obraMayorAvanceMil` y `obraMayorCosteMil`; falta darles valor por casa.

## 4. Diseño detallado

### 4.1 Cómo se modelan

Nada de `if (casa === 'mesta')` esparcidos por el motor. Se define un conjunto cerrado de **puntos de
extensión**, y cada casa aporta valores o funciones puras en esos puntos:

```ts
export interface ModificadoresCasa {
  produccionMil?: Partial<Record<Recurso, Milesimas>>;
  costeEdificioMil?: Partial<Record<TipoEdificio, Milesimas>>;
  nivelMaximoEdificio?: Partial<Record<TipoEdificio, number>>;
  potencialMinimoEdificio?: Partial<Record<TipoEdificio, number>>;
  solaresExtra?: number;
  capacidadPorCasasMil?: Milesimas;
  pasoRecuaMil?: Milesimas;
  costeRecuaMil?: Milesimas;
  porteExtra?: number;
  obraMayorCosteMil?: Milesimas;
  obraMayorAvanceMil?: Milesimas;
  obraEnInvierno?: boolean;               // canteros: no sufren el frenazo
  mermaPanMil?: Milesimas;
  comisionMercadoMil?: Milesimas;
  lanaEsquileoMil?: Milesimas;
  costeRebanyoMil?: Milesimas;
  lealtadMinima?: number;
  agotamientoMonteMil?: Milesimas;
  permisos?: {
    pasoFrancoPorCanyada?: boolean;       // Mesta
    obraEnComarcaAjena?: boolean;         // canteros
    letraDeCambio?: boolean;              // mercaderes
    cobrarPortazgo?: boolean;             // arrieros
    venderAperos?: boolean;               // ferrones
    acequiaMenor?: boolean;               // hortelanos
    cartaPueblaGratis?: boolean;          // monjes
  };
  prohibiciones?: {
    roturar?: boolean;                    // Mesta
    cargaFiscalDura?: boolean;            // monjes
    catedral?: boolean;                   // arrieros
    cobrarPortazgo?: boolean;             // monjes
  };
}
```

Las tablas viven en `nucleo/datos/casas.json`; las funciones (las pocas que hagan falta, como el
contrato de obra ajena) en `nucleo/src/reglas/casas/`.

### 4.2 Reglas transversales

- Un modificador **nunca** puede saltarse un invariante del motor (no hay casa que produzca recursos
  negativos ni que ignore la escasez).
- Los permisos habilitan órdenes: si una casa no tiene `venderAperos`, esa orden no existe para ella y
  la interfaz no la muestra.
- Las prohibiciones se comprueban en la validación de la orden, con mensaje explicativo («la Mesta no
  rotura: su privilegio de paso va con esa obligación»).

### 4.3 Mecánicas propias que hay que implementar

| Casa | Mecánica propia |
|---|---|
| Mesta | Paso franco por cañada (ignora portazgo y permiso) |
| Ferrones | Contrato de aperos: instalar aperos en comarca de otro jugador a cambio de renta por turno |
| Canteros | Contrato de obra: una cuadrilla propia trabaja una obra mayor en comarca ajena, cobrando |
| Mercaderes | Letra de cambio: mover maravedís entre plazas conocidas, 3 % y un turno |
| Monjes | Carta puebla gratuita y suelo de lealtad 50 |
| Salineros | Pan sin merma y salazón (lonja que produce pan inmune a la estación) |
| Arrieros | Portazgo propio y recuas mejores |
| Hortelanos | Acequia menor (obra corta que anula la estación del pan en la comarca) |

Las que implican a otro jugador (contratos, portazgo) se implementan como **contratos internos** ya
en esta tarea, aunque hasta T-103 solo puedan firmarse con los mercaderes menores o consigo mismo.

### 4.4 Elección de casa

La casa se fija al crear la partida y **no se puede cambiar**. Afecta al filtrado del sorteo de
orígenes ([docs/04](../04-casas-y-tradiciones.md) §4.2), que también se implementa aquí.

## 5. Archivos

```
paquetes/nucleo/src/reglas/casas/{index,mesta,ferrones,canteros,mercaderes,monjes,salineros,arrieros,hortelanos}.ts
paquetes/nucleo/src/reglas/casas/*.test.ts
paquetes/nucleo/datos/casas.json
paquetes/nucleo/src/reglas/modificadores.ts       (resolución de modificadores en un punto único)
```

## 6. Criterios de aceptación

1. Las ocho casas están implementadas con su privilegio, su herramienta y su límite.
2. Cada casa tiene un test de escenario que demuestra que su mecánica propia funciona y que su
   límite duele (por ejemplo: la Mesta no puede roturar y su pan propio es insuficiente).
3. Ningún archivo del motor fuera de `reglas/casas/` menciona una casa concreta (test de código:
   búsqueda de los nombres de casa fuera de esa carpeta).
4. Un modificador mal puesto (por ejemplo, producción ×0) no rompe invariantes: hay test.
5. El sorteo de orígenes filtra por casa y ofrece tres perfiles distintos.
6. Las mecánicas que dependen del conflicto quedan documentadas como desactivadas.
7. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/casas
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-042). Si alguna casa ha cambiado respecto al diseño, actualiza
`docs/04-casas-y-tradiciones.md`. Commit: `T-041: casas de oficio con sus privilegios`.
