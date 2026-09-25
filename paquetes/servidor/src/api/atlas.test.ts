// El atlas del jugador (ficha T-081 §6.1): la niebla es exacta sobre una partida real de tres casas.
import { describe, expect, it } from 'vitest';

import { vistaDeJugador } from '@conquer/nucleo';
import type { AtlasDeJugador, IdJugador, IdPartida } from '@conquer/nucleo';

import { apiDePrueba, CUENTAS } from './prueba-comun.ts';

describe('el atlas del jugador', () => {
  it('tiene exactamente las comarcas de la vista; de las desconocidas, solo la silueta', async () => {
    const e = await apiDePrueba({ turnosJugados: 5 });
    const estado = await e.repo.ultimoEstado('p1' as IdPartida);
    if (estado === null) throw new Error('sin estado');
    for (const casa of ['mesta', 'monjes', 'canteros']) {
      const r = await e.pedir(CUENTAS[casa] ?? '', 'GET', '/partidas/p1/atlas');
      expect(r.estado).toBe(200);
      const atlas = (r.cuerpo as { atlas: AtlasDeJugador }).atlas;
      const vista = vistaDeJugador(estado, casa as IdJugador, e.mundo);
      const conocidas = new Set(Object.keys(vista.comarcas));

      expect(atlas.comarcas.map((c) => c.id).sort()).toEqual([...conocidas].sort());
      expect(atlas.comarcas.length + atlas.niebla.length).toBe(
        Object.keys(e.mundo.comarcas).length,
      );
      const texto = JSON.stringify(r.cuerpo);
      for (const [id, comarca] of Object.entries(e.mundo.comarcas)) {
        if (conocidas.has(id)) continue;
        expect(texto, `${casa} no ve ${id}`).not.toContain(`"${id}"`);
        expect(texto, `${casa} no ve el nombre de ${id}`).not.toContain(`"${comarca.nombre}"`);
      }
      for (const c of atlas.comarcas.filter((x) => x.nivel === 'oida')) {
        expect(c).toMatchObject({ terreno: null, potenciales: null, duenyo: null });
      }
      for (const c of atlas.comarcas.filter((x) => x.nivel === 'propia'))
        expect(c.duenyo).toBe(casa);
      for (const t of atlas.tramos) {
        expect(conocidas.has(t.desde) && conocidas.has(t.hasta), `${t.desde}-${t.hasta}`).toBe(
          true,
        );
      }
      expect(atlas.niebla.length).toBeGreaterThan(0);
      expect(texto).not.toContain('semilla');
    }
    await e.repo.cerrar();
  }, 120_000);
});
