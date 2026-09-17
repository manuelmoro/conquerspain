// Punto de entrada de `npm run atlas`.
import { principal } from './generar.ts';

process.exitCode = await principal(process.argv.slice(2));
