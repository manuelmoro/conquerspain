# T-101 · Influencia disputada y comarcas que vuelven a neutral

**Fase:** 5 · Multijugador · **Depende de:** T-100 · **Estado:** en curso: trabajo terminado y verificado; se
cierra cuando se cierre T-100, que espera a T-087

## 1. Contexto

La competición por la tierra, ya con rivales de verdad.

**Heredado de T-038:**

- el cálculo de la influencia, la orden `incorporar` y la disputa por tres criterios: influencia, racha de
  presencia y huella;
- el perdedor recupera su coste íntegro y sabe quién ganó;
- la influencia ajena solo se ve con gente propia allí y en tramos de 10 (T-044).

## 2. Lo que faltaba, medido

**Una comarca disputada no costaba más que una libre.** El que corteja llegaba a los 60 de influencia al mismo
ritmo, y los 15 de ventaja los sacaba antes de llegar a ese umbral. Hacía falta una regla.

## 3. Diseño

### 3.1 El concejo dividido se hace de rogar

- **La regla:** si otra casa tiene una recua presente en la comarca el mismo turno, el concejo se queda la
  mitad de lo que aporta cada una (`concejoDivididoMil`, 500).
- **Cómo se parte:** el total del turno, no fuente a fuente, para que un punto suelto no se pierda entero al
  redondear. Va en el desglose como `concejoDividido`. El desgaste no cambia.
- **El regalo** también vale la mitad con el concejo dividido.
- **El efecto:** con el mismo esfuerzo, una comarca disputada tarda al menos el doble. Con una recua presente
  y una comarca vecina: 20 turnos libre y 60 disputada.
- **Si el rival abandona,** su presencia deja de dividir el concejo desde ese turno, y su influencia baja un
  punto por turno sin actividad: el que sigue se acelera solo.

### 3.2 Lo que se ve

- **La influencia ajena** sigue como en T-044: solo con gente propia allí y en tramos de 10.
- **La previsión de «Cómo ganarla»** se calcula con el estado entero. Por eso no cuenta la disputa salvo que
  el jugador tenga gente allí (`fuentesDeInfluencia(..., rivalesVisibles)`): si no, delataría a un rival
  invisible.
- **Con gente allí**, el motivo «el concejo, dividido con otra casa presente, se queda la mitad» sale en la
  ficha.

### 3.3 Los avisos

Se enteran las otras casas que tienen la comarca **a la vista**: con una recua allí o con una comarca suya al
lado (`quienesLaTienenCerca`).

- **`influencia.cortejo`:** otra casa empieza a cortejar el concejo (su primera presencia de una racha).
- **`incorporar.de-otro`:** otra casa empieza a incorporarla («en 3 turnos será suya, si nadie le gana»).

### 3.4 El perdedor de la disputa

- **Recupera su coste íntegro** (T-038, probado).
- **Su influencia no se conserva:** al tener dueño, el concejo deja de repartir favores y el motor borra
  todas las influencias de la comarca (T-038). Si algún día vuelve a ser neutral, el cortejo empieza de cero,
  salvo el monasterio de quien la tuvo.

### 3.5 La comarca que se va

Una comarca que se va por deslealtad vuelve a neutral sin favores de nadie, apunta a su antiguo dueño
(`exDuenyo`), y un vecino con influencia la puede incorporar.

## 4. Criterios de aceptación

1. Una comarca disputada tarda al menos el doble en incorporarse que una libre. ✔
2. El perdedor de una disputa recupera su coste íntegro. ✔ Su influencia no se conserva (§3.4).
3. Ningún jugador ve la influencia exacta de otro, ni sabe de su presencia, sin gente propia allí. ✔
4. Una comarca abandonada por deslealtad puede ser recogida por un vecino atento. ✔

## 5. Verificación

`npm run verificar`, con `paquetes/nucleo/pruebas/disputa.test.ts`: concejo dividido, ritmo, regalo,
previsión sin delatar, tramos de 10, los dos avisos y la comarca abandonada.
