# T-092 · El plano de la comarca: los solares a la vista

**Fase:** 4 · Cliente · **Depende de:** T-082, T-090 · **Estado:** hecha (09-11-2026)

## 1. Contexto

Tras jugar, el usuario no entendía la ficha de su capital: «Granja 2/4», «3 de 6 solares». No se veía qué
ocupaba cada solar ni por qué, ni qué era cada edificio. Pidió que, al tocar la capital o una comarca suya,
se cambiara de vista a un plano con las parcelas, mejor en perspectiva, y con los edificios dibujados.

Al hacerlo se vio que la Ayuda y la ficha decían algo falso: «ampliar un edificio no gasta solar». La regla
(docs/03 §3.2.1) es que **cada nivel de cada edificio ocupa un solar**, y una obra de edificio el suyo. Se ha
corregido el texto.

## 2. Diseño

- **Una parcela por solar** (`cliente/src/plano.ts`, puro):
  - una por cada nivel de cada edificio, con las casas primero;
  - una por cada obra de edificio, con su avance;
  - el resto, libres.

  Si hay más ocupado que solares, no se esconde nada.
- **Rejilla:** de tres columnas, con la plaza del pueblo en el centro. Con ocho solares, el pueblo queda
  rodeado. La plaza no es un solar: lleva la iglesia y, en la capital, una torre con pendón.
- **Arte isométrico generado** (`cliente/src/arte/edificios.ts`):
  - cajas y tejados de caras planas sobre un rombo de suelo con grosor;
  - un dibujo propio para cada uno de los 16 edificios (surcos de la granja, aspas del molino, balsas de la
    salina, ovejas de la majada, puestos con toldos del mercado…);
  - además, la obra con andamios y el solar libre con un «+».
- **Pantalla** (`pantallas/plano.ts`):
  - con una comarca propia abierta, el plano ocupa el sitio del mapa;
  - «Volver al mapa» devuelve el atlas sin cerrar la ficha, y «Ver su plano» vuelve al plano;
  - tocar una parcela (o pulsar Intro sobre ella) explica qué es, para qué sirve, por qué ocupa el solar
    («Nivel 2 de 4: cada nivel ocupa un solar, y este es el 1.º de 2») y lo que da;
  - en móvil, la hoja de la ficha tapa el mapa, así que el plano va también dentro de la ficha (el CSS lo
    oculta en escritorio).
- **Núcleo:** cada obra de la ficha dice qué edificio levanta (`edificio`, null en las obras mayores).

## 3. Criterios de aceptación

1. Al tocar una comarca propia se ve su plano con tantas parcelas como solares, y cada nivel ocupa una. ✔
2. Cada edificio se reconoce por su dibujo, y todos son distintos (prueba). ✔
3. Tocar una parcela dice qué es, por qué ocupa el solar y qué produce. ✔
4. Se puede volver al mapa sin cerrar la ficha, y en móvil el plano se ve dentro de la hoja. ✔
5. La regla de los solares se explica bien en la ficha, en la Ayuda y en el glosario. ✔

## 4. Verificación

`npm run verificar`, `plano.test.ts`, y capturas en escritorio y móvil con la partida de prueba.
