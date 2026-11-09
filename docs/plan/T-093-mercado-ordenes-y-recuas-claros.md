# T-093 · Mercado sencillo, órdenes claras y recuas en el mapa

**Fase:** 4 · Cliente · **Depende de:** T-084, T-092 · **Estado:** hecha (09-11-2026)

## 1. Contexto

Tras jugar, el usuario dijo:

- que el mercado era demasiado complejo;
- que no sabía qué órdenes había dado ni cuáles esperaban;
- que «Anular» no funcionaba;
- y que no encontraba sus recuas ni sabía qué hacían.

«Lo básico debe estar accesible y fácil de entender para empezar».

Al mirar su partida apareció la causa de fondo de que no pudiera comprar pan: **para comprar, la recua tiene que
llevar los maravedís cargados** (docs/03 §3.10.1). Su recua iba vacía y nada lo decía. «Anular» fallaba porque su
servidor de desarrollo era anterior a la orden, y no se había reiniciado.

## 2. Diseño

- **Recuas en el mapa:**
  - cada recua y cada rebaño es una ficha redonda (🐴, 🐑) del mismo tamaño en pantalla a cualquier zoom, con
    su ruta más gruesa y una marca en el destino;
  - las fichas no se tapan entre sí: las recuas van a un lado, los rebaños al otro y las que coinciden, en fila;
  - en el panel, cada recua dice en líneas cortas dónde está, su ruta, su encargo, lo que lleva y cuántas
    órdenes la esperan (`recuas.ts`);
  - «📍 Ver en el mapa» la hace latir, resalta su ruta y acerca el mapa hasta ella (`AtlasMontado.centrarEn`).
- **Órdenes en palabras** (`ordenes-en-palabras.ts`): cada orden en una frase con su icono, por ejemplo
  «Comprar 10 de pan en la plaza de Burgos (pagando hasta 3 mrs), con Recua de Burgos». Van en tres grupos con
  su cuenta:
  - **📝 Para este turno**, que aún se pueden retirar;
  - **⏳ Esperando**, con el porqué, qué hacer, «↑ Antes», «↓ Después» y «Anular»;
  - **🔨 En marcha**.

  «Tus órdenes» va ahora antes que los recursos.
- **Mercado sencillo** (`mercado.ts`, `pantallas/mercado.ts`):
  - arriba, «Comerciar ahora», con una tarjeta por cada recua que está en una plaza abierta: comprar o vender,
    qué (con su precio), cuánto (5, 10, 20, 50), el total aproximado y un botón «Comprar 10 de pan»;
  - el precio límite y los turnos van plegados en «Más opciones», con un valor sensato (±10 %);
  - si la recua está en casa, la compra le **carga antes del almacén los maravedís que hacen falta**
    (cantidad × límite + comisión); la venta le carga la mercancía; fuera de casa, se avisa si no le alcanza;
  - debajo, «Tus órdenes de mercado», con su espera y «Anular», y la tabla de precios de las plazas que
    conoces.
- **📥 Descargar al almacén** en la tarjeta de una recua que está en casa con mercancía: lo comprado viaja en la
  recua y, sin descargarlo, no se come.

## 3. Criterios de aceptación

1. Las recuas se ven en el mapa con su ruta, y desde el panel se encuentran con un toque. ✔
2. Se distingue lo dado este turno, lo que espera (con su porqué y su salida) y lo que va en marcha. ✔
3. Comprar pan con la recua en casa son tres toques, y funciona de punta a punta: carga el dinero, compra, y al
   descargar el pan llega al almacén (prueba en `mercado.test.ts`). ✔
4. Ninguna orden ni motivo se muestra con su clave interna. ✔

## 4. Verificación

`npm run verificar`; capturas en una copia de la partida del usuario y en la partida de prueba de mercaderes,
con el ciclo comprar → avanzar → descargar hecho en el navegador.

## 5. Lo que se vio y queda para el equilibrio

En la partida del usuario la recua había perdido 9 de sus 10 acémilas con el hambre, y ya solo le cabía una
carga. Junto con el arranque lento de los mercaderes, eso va a T-094.
