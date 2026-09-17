# T-046 · Banco de pruebas: robots por casa e informes

**Fase:** 2 · Motor · **Depende de:** T-045 · **Estado:** pendiente

## 1. Contexto

No se puede equilibrar ocho casas jugando a mano. Hace falta poder lanzar partidas completas,
medirlas y comparar versiones. Este es el instrumento con el que se afinará el juego durante años.

Lee antes: [docs/07-arquitectura.md](../07-arquitectura.md) §7.7,
[docs/06-competicion.md](../06-competicion.md) §6.8.

## 2. Objetivo

`herramientas/banco`: lanzar partidas automáticas deterministas con un robot por casa, recoger
métricas y emitir informes comparables entre versiones.

## 3. Alcance

**Entra:** robots (uno por casa), ejecutor de partidas, métricas, informes en Markdown y CSV,
comparación entre ejecuciones.

**No entra:** cambiar valores de equilibrio (eso es T-047), ni IA que juegue contra humanos.

## 4. Diseño detallado

### 4.1 Robots

Un robot es una **estrategia escrita a mano**, no una IA: una función pura que, dado el estado
visible, devuelve órdenes.

```ts
export interface Robot {
  casa: Casa;
  nombre: string;
  decidir(vista: VistaJugador, mundo: Mundo, reglas: TablasDeReglas): Orden[];
}
```

Cada robot juega su vía: el de la Mesta forma rebaños y hace el ciclo anual; el ferrón busca hierro y
monte; el cantero acumula piedra y encadena obras mayores; el mercader monta rutas entre ferias, etc.
Se escriben con prioridades simples y legibles, y **sin trampas**: solo usan la vista filtrada.

### 4.2 Ejecutor

```bash
npx tsx herramientas/banco/src/ejecutar.ts \
  --mapa peninsula --semilla 1492 --turnos 200 --casas todas --repeticiones 3
```

- Determinista: misma semilla, misma partida.
- Guarda el estado cada 10 turnos para poder inspeccionar.
- Admite escenarios especiales (`--escenario ausencia`, `--escenario hambre`).

### 4.3 Métricas

Por jugador y turno: prestigio (con capítulos), población, comarcas, maravedís, almacén, turnos con
escasez, obras terminadas, jornadas recorridas, volumen comerciado, y **turnos sin decisión útil**
(turnos en los que el robot no tenía ninguna orden sensata disponible).

Por partida: puesto final, diferencia con la mediana, primicias conseguidas.

### 4.4 Informes

`informes/<fecha>-<semilla>.md` con tablas y un resumen legible, y `.csv` para comparar. Un comando
`comparar` enseña la diferencia entre dos informes para ver qué ha hecho un cambio de equilibrio.

### 4.5 Salud del juego

El informe marca en rojo:

- casas fuera de la horquilla 80 %–120 % de la mediana de prestigio;
- más de un 10 % de turnos sin decisión útil;
- partidas con escasez crónica (más del 20 % de los turnos);
- precios pegados al suelo o al techo más de 20 turnos;
- comarcas que nunca las toca nadie en ninguna partida (tierra muerta).

## 5. Archivos

```
herramientas/banco/src/{ejecutar,metricas,informe,comparar}.ts
herramientas/banco/src/robots/{mesta,ferrones,canteros,mercaderes,monjes,salineros,arrieros,hortelanos}.ts
herramientas/banco/src/escenarios/{ausencia,hambre}.ts
herramientas/banco/informes/.gitkeep
```

## 6. Criterios de aceptación

1. Una partida de 200 turnos con 8 robots se ejecuta en menos de 2 minutos.
2. Misma semilla → mismo informe, byte a byte.
3. Los ocho robots juegan su vía de verdad (se comprueba leyendo el informe: el de la Mesta debe
   tener lana e ingresos de feria; el cantero, obras mayores…).
4. Ningún robot usa información que su jugador no ve (test que le pasa una vista manipulada).
5. El informe incluye las cinco alertas de §4.5 y funciona el comando `comparar`.
6. `npm run verificar` pasa.

## 7. Verificación

```bash
npm run verificar
npx tsx herramientas/banco/src/ejecutar.ts --semilla 1492 --turnos 200 --casas todas
npx tsx herramientas/banco/src/comparar.ts informes/a.csv informes/b.csv
```

## 8. Al terminar

Índice y `ESTADO.md` (siguiente T-047). Guarda el primer informe en el repositorio como referencia.
Commit: `T-046: banco de pruebas con robots por casa`.
