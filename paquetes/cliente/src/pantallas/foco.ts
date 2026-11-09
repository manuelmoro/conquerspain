// El foco del tutorial (ficha T-090 §2.6): oscurece la pantalla salvo lo que el jugador tiene que mirar,
// y pone la tarjeta a su lado. La capa oscura no recibe clics: se sigue pudiendo tocar lo resaltado.
import { junto } from '../tutorial.ts';

let selectores: readonly string[] = [];
let tarjeta: HTMLElement | null = null;
let ultimoObjetivo: Element | null = null;
let escuchando = false;

function capa(): HTMLElement {
  const existente = document.getElementById('foco-del-tutorial');
  if (existente !== null) return existente;
  const nueva = document.createElement('div');
  nueva.id = 'foco-del-tutorial';
  nueva.className = 'foco';
  nueva.setAttribute('aria-hidden', 'true');
  document.body.append(nueva);
  return nueva;
}

function colocar(): void {
  const foco = capa();
  // Lo primero que exista **y se vea**: lo plegado o lo oculto mide cero y no se puede senyalar.
  const objetivo =
    selectores
      .flatMap((s) => [...document.querySelectorAll(s)])
      .find((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }) ?? null;
  if (tarjeta === null || !tarjeta.isConnected || objetivo === null) {
    foco.hidden = true;
    tarjeta?.classList.remove('junto');
    return;
  }
  // La primera vez que se senyala algo, se trae a la vista.
  if (objetivo !== ultimoObjetivo) {
    ultimoObjetivo = objetivo;
    const r = objetivo.getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) objetivo.scrollIntoView({ block: 'center' });
  }
  const r = objetivo.getBoundingClientRect();
  const margen = 6;
  foco.hidden = false;
  foco.style.left = `${String(r.left - margen)}px`;
  foco.style.top = `${String(r.top - margen)}px`;
  foco.style.width = `${String(r.width + margen * 2)}px`;
  foco.style.height = `${String(r.height + margen * 2)}px`;
  tarjeta.classList.add('junto');
  const t = tarjeta.getBoundingClientRect();
  const p = junto(
    {
      x: r.left - margen,
      y: r.top - margen,
      ancho: r.width + margen * 2,
      alto: r.height + margen * 2,
    },
    { ancho: t.width, alto: t.height },
    { ancho: innerWidth, alto: innerHeight },
  );
  tarjeta.style.left = `${String(p.x)}px`;
  tarjeta.style.top = `${String(p.y)}px`;
}

/** Senyala lo primero que exista de `nuevos` y pone `nueva` a su lado; sin tarjeta, se apaga. */
export function enfocar(nuevos: readonly string[], nueva: HTMLElement | null): void {
  selectores = nuevos;
  tarjeta = nueva;
  if (!escuchando) {
    escuchando = true;
    addEventListener('resize', colocar);
    addEventListener('scroll', colocar, true);
  }
  requestAnimationFrame(colocar);
}
