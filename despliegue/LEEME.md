# Despliegue de ConquerSpain

Cómo está montado y cómo se repite (docs/07 §7.8).

## Las piezas

| Pieza | Dónde | Coste |
|---|---|---|
| Dominio `conquerspain.com` | Cloudflare Registrar | unos 10 €/año |
| DNS, HTTPS y túnel | Cloudflare (plan gratuito) | 0 € |
| Servidor | Hetzner Cloud CX22, Ubuntu 24.04 | unos 4,60 €/mes |
| Correo saliente | Brevo (300 correos al día gratis) | 0 € |

- **Un solo proceso** sirve el juego entero: el cliente compilado y la API bajo `/api/`
  (`CLIENTE_COMPILADO`). La base es un SQLite en el volumen `datos` de Docker.
- **El túnel de Cloudflare** (`cloudflared`) saca el juego a internet sin abrir ningún puerto de la
  máquina: solo sale la conexión del túnel. La IP real de cada jugador llega en `cf-connecting-ip`
  (`CABECERA_DE_ORIGEN`), que usa el límite de peticiones.
- **Copias:** el servicio `copias` hace una al arrancar y una al día en `/datos/copias`, y guarda las
  catorce últimas.
- **Despliegue tirando de git:** el temporizador `conquerspain-actualizar.timer` mira cada cinco
  minutos `origin/main`; si hay un commit nuevo **y la verificación de GitHub lo dio por bueno**, lo
  trae y reconstruye (`despliegue/actualizar.sh`). Un commit que no pasa `npm run verificar` no llega
  nunca a producción.

## Montarlo desde cero

En la máquina (Ubuntu 24.04), como `root`:

```bash
apt-get update && apt-get install -y docker.io docker-compose-v2 git python3 curl
git clone https://github.com/manuelmoro/conquerspain.git /opt/conquerspain
cd /opt/conquerspain
cp despliegue/env.ejemplo .env && chmod 600 .env   # y rellenarlo
docker compose up -d --build
cp despliegue/conquerspain-actualizar.service despliegue/conquerspain-actualizar.timer /etc/systemd/system/
systemctl daemon-reload && systemctl enable --now conquerspain-actualizar.timer
```

En Cloudflare: Zero Trust › Networks › Tunnels › crear un túnel «conquerspain», copiar su token a
`TUNNEL_TOKEN`, y en «Public hostnames» `conquerspain.com` y `www.conquerspain.com` → `http://juego:8471`.

## El día a día

| Para | Orden (en `/opt/conquerspain`) |
|---|---|
| Ver si va | `docker compose ps` |
| Ver lo que dice | `docker compose logs -f juego` |
| Desplegar ya, sin esperar | `despliegue/actualizar.sh --forzar` |
| Hacer una copia ahora | `docker compose exec copias npx tsx paquetes/servidor/herramientas/copia.ts` |
| Bajarse las copias | `docker compose cp copias:/datos/copias ./copias` |
| Volver a una copia | parar `juego`, copiar la copia sobre `/datos/conquerspain.sqlite`, arrancar |

## Lo que queda fuera (y cuánto costaría)

- **Copias fuera de la máquina.** Hoy están en el mismo disco: protegen de un error, no de perder el
  servidor. Las copias de Hetzner son un 20 % más (≈ 0,90 €/mes); Cloudflare R2 tiene 10 GB gratis.
