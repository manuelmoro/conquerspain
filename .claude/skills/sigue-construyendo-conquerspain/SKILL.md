---
name: sigue-construyendo-conquerspain
description: Continúa la construcción del juego ConquerSpain desde donde se quedó. Úsala cuando el usuario invoque /sigue-construyendo-conquerspain, pida "sigue con el juego", "continúa ConquerSpain" o "sigue por donde lo dejaste" en este repositorio. Lee ESTADO.md, toma la siguiente tarea del plan, la implementa completa, la verifica y cierra el estado.
---

# Sigue construyendo ConquerSpain

Tu trabajo en esta invocación es **avanzar el plan una tarea completa**, con la calidad que pide
[CLAUDE.md](../../../CLAUDE.md). Es preferible tardar y que quede perfecto a entregar algo a medias.

## 1. Sitúate (siempre, sin saltártelo)

1. Lee `ESTADO.md` de la raíz del repositorio.
2. Lee `CLAUDE.md` §1 a §4 si no lo has leído en esta sesión.
3. Determina la tarea a trabajar:
   - si hay **tarea en curso**, esa es tu tarea: continúala desde donde indique la bitácora;
   - si no, toma la **siguiente tarea** que indique `ESTADO.md`;
   - si el usuario ha dado un identificador de tarea (`/sigue-construyendo-conquerspain T-031`),
     manda el suyo.
4. Abre su ficha en `docs/plan/` y **léela entera**, con todos los documentos de diseño que cite.
   No implementes reglas de memoria: el diseño escrito manda sobre lo que creas recordar.
5. Comprueba las dependencias de la tarea en `docs/plan/00-indice.md`. Si alguna no está `hecha`,
   dilo y trabaja la dependencia en su lugar.

Antes de tocar nada, escribe al usuario **dos o tres líneas**: qué tarea vas a hacer, qué vas a
entregar y cómo se verificará. No pidas permiso para empezar: empieza.

## 2. Si la ficha está solo esbozada

Las fichas de las fases 3 a 6 están esbozadas a propósito. En ese caso, la **primera mitad de la
tarea es detallar la ficha** al nivel de las fases 0 a 2: contexto, objetivo, alcance, diseño
detallado con firmas y fórmulas, archivos, criterios de aceptación y verificación. Guarda la ficha
detallada, y solo entonces empieza a implementar.

Si al detallar descubres que el diseño del juego no cubre algo, decide con criterio, escríbelo en el
documento de diseño correspondiente (`docs/0X-*.md`) y anótalo en la bitácora de `ESTADO.md`. El
diseño es un documento vivo; lo que no vale es implementar una regla que no esté escrita en ninguna
parte.

## 3. Implementa

- Respeta sin excepciones las reglas técnicas de `CLAUDE.md` §4: núcleo puro y determinista, enteros
  y milésimas, orden estable, azar con semilla, TypeScript estricto, datos de equilibrio en tablas.
- Escribe los tests que pide la ficha **mientras** implementas, no al final.
- Todo en español: identificadores del dominio, comentarios, mensajes y textos.
- Si encuentras algo mal hecho de una tarea anterior, arréglalo si es pequeño; si es grande, abre una
  tarea nueva en el índice (siguiente número libre de esa fase) y anótala en `ESTADO.md`.
- No amplíes el alcance. Lo que no esté en la ficha, se apunta como tarea futura.

## 4. Verifica de verdad

Ejecuta los comandos de la ficha (normalmente `npm run verificar`) y **enseña la salida**. Si algo
falla, arréglalo antes de cerrar. No se cierra una tarea con tests en rojo, con `any` colados ni con
criterios de aceptación «casi» cumplidos.

Repasa uno por uno los criterios de aceptación de la ficha y comprueba que cada uno se cumple. Si
alguno no se cumple y no vas a poder cumplirlo, **no cierres la tarea**: ve al punto 6.

## 5. Cierra la tarea

1. Marca la tarea como `hecha` en `docs/plan/00-indice.md`.
2. Actualiza `ESTADO.md`:
   - «Tarea en curso» → Ninguna;
   - «Siguiente tarea» → la siguiente del índice cuyas dependencias estén hechas;
   - una línea nueva en la bitácora con la fecha y lo entregado;
   - actualiza «Qué existe hoy» y «Riesgos abiertos» si han cambiado.
3. Si el diseño ha cambiado durante el trabajo, actualiza el documento de diseño afectado.
4. Haz un commit: `T-0xx: resumen en una línea`, y **haz push** a `origin/main` (lo pidió el
   usuario: el remoto es lo que retoma la siguiente sesión u otra IA). No toques otras ramas.
5. Termina con un resumen corto para el usuario: qué quedó hecho, qué se verificó, qué viene ahora.

## 6. Si te quedas sin margen a mitad de tarea

Es normal y está previsto. Deja el trabajo **recogido**, no a medias en silencio:

1. Asegúrate de que el repositorio compila y los tests que ya existían siguen pasando. Si algo quedó
   roto, o lo arreglas o lo revierte.
2. En `ESTADO.md`, pon la tarea como «Tarea en curso» con un apartado **Dónde va**:
   - qué partes están hechas y verificadas;
   - qué archivos tocaste;
   - qué falta exactamente, en pasos concretos;
   - cualquier decisión que tomaste y que no esté ya en la documentación.
3. Haz un commit `T-0xx (en curso): ...` y push.

Con eso, otra sesión —o una IA distinta— puede continuar sin preguntarte nada.

## 7. Recordatorios de criterio

- El juego se juega leyendo la crónica y preparando órdenes. Si una mecánica premia conectarse más
  veces, está mal planteada: reformúlala con órdenes permanentes o mayordomo.
- Cada mecánica nueva debe añadir **una decisión**. Si no añade decisión, sobra.
- Los guiños históricos son mecánica, no decorado: la Mesta, las ferias, las salinas, los fueros y
  los puertos de montaña tienen que **cambiar lo que haces**, no solo cómo se llama.
- Ninguna casa es «lo mismo con un bonus».
- Ante la duda entre dos diseños, gana el que se pueda explicar en una frase al jugador.
