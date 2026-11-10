// Copia de la base de datos (despliegue, docs/07 §7.8): una al dia, en la misma carpeta de datos, y
// se guardan las ultimas `COPIAS_A_GUARDAR` (14 por defecto). Usa `VACUUM INTO`, que copia una foto
// coherente aunque el servidor siga escribiendo.
//
//   BASE_DE_DATOS=/datos/conquerspain.sqlite npx tsx paquetes/servidor/herramientas/copia.ts
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const base = process.env['BASE_DE_DATOS'] ?? 'conquerspain.sqlite';
const carpeta = process.env['CARPETA_DE_COPIAS'] ?? join(dirname(base), 'copias');
const guardar = Number(process.env['COPIAS_A_GUARDAR'] ?? '14');
mkdirSync(carpeta, { recursive: true });

const sello = new Date().toISOString().replace(/[:.]/g, '-');
const destino = join(carpeta, `conquerspain-${sello}.sqlite`);
const db = new DatabaseSync(base, { readOnly: true });
db.exec(`VACUUM INTO '${destino.replace(/'/g, "''")}'`);
db.close();

const copias = readdirSync(carpeta)
  .filter((f) => f.startsWith('conquerspain-') && f.endsWith('.sqlite'))
  .sort();
for (const vieja of copias.slice(0, Math.max(0, copias.length - guardar))) {
  rmSync(join(carpeta, vieja));
}
console.log(
  JSON.stringify({
    nivel: 'info',
    evento: 'copia',
    destino,
    guardadas: Math.min(copias.length, guardar),
  }),
);
