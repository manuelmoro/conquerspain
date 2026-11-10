# ConquerSpain en un contenedor (docs/07 §7.8): el servidor y el cliente compilado en un solo proceso.
# El codigo se ejecuta desde las fuentes con tsx, como en desarrollo; la base vive en el volumen /datos.
FROM node:22-bookworm-slim

WORKDIR /app
COPY . .
RUN npm ci --no-audit --no-fund && npm run cliente:tamano

ENV NODE_ENV=production \
    PUERTO=8471 \
    ANFITRION=0.0.0.0 \
    BASE_DE_DATOS=/datos/conquerspain.sqlite \
    CLIENTE_COMPILADO=/app/paquetes/cliente/dist-web \
    CABECERA_DE_ORIGEN=cf-connecting-ip

VOLUME ["/datos"]
EXPOSE 8471
CMD ["npx", "tsx", "paquetes/servidor/src/principal.ts"]
