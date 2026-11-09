// Las cuentas desde el cliente (ficha T-091): registrarse, confirmar, salir, entrar con contrasenya y
// restablecerla, contra el servidor real por HTTP.
import { describe, expect, it } from 'vitest';

import { TABLAS_DEL_JUEGO } from '@conquer/nucleo';

import { crearApi } from '../../servidor/src/api/manejadores.ts';
import { servirHttp } from '../../servidor/src/api/http.ts';
import { autenticadorDeSesiones } from '../../servidor/src/cuentas/autenticador.ts';
import { CorreoEnMemoria } from '../../servidor/src/cuentas/correo.ts';
import { ServicioDeCuentas } from '../../servidor/src/cuentas/servicio.ts';
import { AHORA, mundoPeninsula } from '../../servidor/src/persistencia/prueba-comun.ts';
import { RepositorioSqlite } from '../../servidor/src/persistencia/sqlite.ts';
import { proveedorDeRecorte } from '../../servidor/src/reloj/mundoDeLaPartida.ts';
import { RegistroEnMemoria } from '../../servidor/src/reloj/registro.ts';
import { Almacen } from './almacen.ts';
import { ClienteApi } from './api.ts';
import type { TarroDeCookies } from './api.ts';
import { GuardadoEnMemoria } from './guardado.ts';

describe('la cuenta desde el cliente', () => {
  it('registrarse, confirmar, salir, entrar con contraseña y restablecerla', async () => {
    const repo = new RepositorioSqlite(':memory:');
    await repo.migrar(AHORA);
    const correo = new CorreoEnMemoria();
    const registro = new RegistroEnMemoria();
    const ahora = () => AHORA;
    const cuentas = new ServicioDeCuentas({
      repo,
      correo,
      claveDeCookies: new Uint8Array(32).fill(5),
      urlPublica: 'http://x',
      registro,
      ahora,
      cookieSegura: false,
    });
    const servidor = await servirHttp(
      crearApi({
        repo,
        reglas: TABLAS_DEL_JUEGO,
        proveedorDeMundo: proveedorDeRecorte(mundoPeninsula(), TABLAS_DEL_JUEGO),
        autenticador: autenticadorDeSesiones(cuentas),
        registro,
        ahora,
        cuentas,
      }),
    );
    try {
      const tarro: TarroDeCookies = { cookie: null };
      const almacen = new Almacen({
        api: new ClienteApi({ base: `http://127.0.0.1:${String(servidor.puerto)}`, tarro }),
        guardado: new GuardadoEnMemoria(),
        reglas: TABLAS_DEL_JUEGO,
        ahora,
        nuevaClave: () => 'k1',
      });
      const CLAVE = 'mi contraseña segura';

      const corta = await almacen.registrar('luis@correo.es', 'Luis', 'corta');
      expect(corta.ok).toBe(false);
      expect(corta.mensaje).toMatch(/al menos 10/);
      expect((await almacen.registrar('luis@correo.es', 'Luis', CLAVE)).ok).toBe(true);
      // Sin confirmar no entra; el enlace del correo lo confirma y abre sesión.
      expect((await almacen.entrarConClave('luis@correo.es', CLAVE, true)).ok).toBe(false);
      expect(await almacen.entrar(correo.ultimoToken('luis@correo.es') ?? '')).toBe(true);
      expect(almacen.estado.cuenta?.nombre).toBe('Luis');

      await almacen.salir();
      expect(almacen.estado.cuenta).toBeNull();
      const mal = await almacen.entrarConClave('luis@correo.es', 'otra contraseña', false);
      expect(mal).toEqual({ ok: false, mensaje: expect.stringMatching(/incorrectos/) as string });
      expect((await almacen.entrarConClave('luis@correo.es', CLAVE, false)).ok).toBe(true);
      expect(tarro.cookie).toMatch(/^sesion=/);

      await almacen.salir();
      expect((await almacen.olvido('luis@correo.es')).ok).toBe(true);
      const token = correo.ultimoToken('luis@correo.es') ?? '';
      expect((await almacen.restablecer(token, 'la nueva contraseña')).ok).toBe(true);
      expect(almacen.estado.cuenta?.nombre).toBe('Luis');
    } finally {
      await servidor.cerrar();
      await repo.cerrar();
    }
  }, 120_000);
});
