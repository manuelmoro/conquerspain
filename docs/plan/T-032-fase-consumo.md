# T-032 · Fase 3: consumo, merma y escasez

**Fase:** 2 · Motor · **Depende de:** T-031 · **Estado:** pendiente

## 1. Contexto

La presión del juego. Aquí se decide si tu gente come, si el granero aguanta el invierno y si este
turno se te paran las expediciones.

Lee antes: [docs/03-economia.md](../03-economia.md) §3.1 y §3.6,
[docs/02-diseno-nucleo.md](../02-diseno-nucleo.md) §2.4.1.

## 2. Objetivo

Aplicar consumo de pan, salarios y mantenimientos; calcular la merma del almacén; determinar la
escasez y sus efectos, con avisos claros antes de que ocurra.

## 3. Alcance

**Entra:** consumo de población, cuadrillas y recuas; mantenimiento de aperos; administración en
maravedís; merma del pan; regla de escasez y sus consecuencias.

**No entra:** crecimiento y lealtad (T-036), mercado (T-037).

## 4. Diseño detallado

### 4.1 Consumo

| Concepto | Cantidad |
|---|---|
| Población | 1 pan por vecino y turno |
| Cuadrilla ocupada en obra | 2 pan por turno |
| Recua en ruta | 2 pan por jornada recorrida (lo cobra la fase de movimiento, no esta) |
| Aperos | 1 hierro por nivel y comarca |
| Administración | maravedís según [docs/03-economia.md](../03-economia.md) §3.9 |

El consumo se cobra del **almacén disponible** (almacén menos lo reservado por órdenes pendientes):
lo reservado es intocable, porque el jugador ya contó con ello.

### 4.2 Orden de cobro

1. Pan de la población.
2. Pan de las cuadrillas.
3. Hierro de los aperos.
4. Maravedís de la administración.

Cada uno, si no se puede pagar, tiene su consecuencia propia (no se «toma prestado» de otro recurso):

| No se puede pagar | Consecuencia |
|---|---|
| Pan | **Escasez** (§4.4) |
| Hierro | Los aperos bajan un nivel tras dos turnos consecutivos sin pago; aviso desde el primero |
| Maravedís | Deuda de administración: la lealtad de las comarcas baja 2 por turno mientras dure, empezando por las más lejanas |

### 4.3 Merma

```
mermaMil = 40                                 // 4 % base
si hay granero en alguna comarca propia:  mermaMil −= 20 × min(1, graneros)
si se gasta sal: 1 sal por cada 50 de pan almacenado → mermaMil −= 20
mermaMil = limitar(mermaMil, 0, 40)
panPerdido = porcentaje(panAlmacenado, mermaMil)
```

La sal se gasta automáticamente si hay, salvo que el jugador lo desactive con una orden de política.
El gasto se anuncia en la crónica («se gastaron 3 cargas de sal en conservar el granero»).

### 4.4 Escasez

```
disponible = almacen.pan − reservado.pan
si disponible < consumoTotalDePan:
    almacen.pan -= disponible          // queda en cero; NUNCA negativo
    jugador.escasez = true
    faltante = consumoTotalDePan − disponible
```

Efectos mientras haya escasez:

- no se inician expediciones nuevas (las en curso continúan: su bastimento ya se pagó);
- no se inician obras nuevas;
- no hay crecimiento de población;
- la lealtad baja 5 por turno en todas las comarcas propias;
- a partir de la tercera escasez consecutiva, cada comarca pierde el 3 % de sus vecinos por
  emigración, con aviso en las dos anteriores.

Al recuperar el abastecimiento, todo se reanuda y las órdenes «en espera» vuelven a validarse.

### 4.5 Aviso anticipado

La fase calcula también la **previsión**: con el balance actual, cuántos turnos aguanta la reserva.
Si son menos de tres, emite `consumo.aviso-hambre` con la cifra, para que la crónica lo destaque.
El jugador nunca debe llegar a la escasez sin haber sido avisado.

## 5. Archivos

```
paquetes/nucleo/src/fases/03-consumo.ts
paquetes/nucleo/src/reglas/{consumo,merma,escasez}.ts
paquetes/nucleo/src/reglas/*.test.ts
```

## 6. Criterios de aceptación

1. El pan nunca queda negativo, en ninguna combinación (test de propiedad con 10 000 estados
   generados con semilla fija).
2. Lo reservado por órdenes pendientes no se toca jamás (test).
3. La merma se aplica con las tres combinaciones (sin granero, con granero, con granero y sal) y da
   los valores esperados escritos a mano.
4. La escasez activa exactamente los cinco efectos de §4.4 y los desactiva al recuperarse.
5. La emigración empieza en la tercera escasez consecutiva, ni antes ni después.
6. El aviso de hambre aparece cuando quedan menos de tres turnos de reserva.
7. Una partida de prueba de 24 turnos sin intervención muestra la tensión invernal esperada: reservas
   acumuladas en verano y descenso en invierno sin llegar a escasez con la economía de partida.
8. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx vitest run paquetes/nucleo/src/reglas/consumo.test.ts paquetes/nucleo/src/reglas/escasez.test.ts
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-033). Commit: `T-032: consumo, merma y escasez`.
