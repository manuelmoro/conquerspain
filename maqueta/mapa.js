// Atlas ilustrado: silueta real, comarcas de juego (Voronoi recortado a tierra), niebla y zoom táctil.
(function () {
  const A = window.ATLAS;
  const NS = 'http://www.w3.org/2000/svg';
  window.DELAUNAY = d3.Delaunay.from(A.cells, c => c.x, c => c.y);
  const voronoi = DELAUNAY.voronoi([-40, -40, A.w + 40, A.h + 40]);
  // Recorte de tierra compartido por el atlas y las miniaturas
  document.querySelector('svg defs').insertAdjacentHTML('beforeend', `<clipPath id="clip-tierra"><path d="${A.iberia}"/></clipPath>`);

  const COLOR_TERRENO = { campo: '#e8cf8f', vega: '#cfd08a', bosque: '#aebb7c', sierra: '#cdb08a', dehesa: '#d9c48c' };
  const PATRON = { campo: 'p-campo', vega: 'p-vega', bosque: 'p-bosque', sierra: 'p-sierra', dehesa: 'p-dehesa' };

  let svg, raiz, capas = {}, zoom, k = 1, seleccion = null, alSeleccionar = () => {};

  function el(tag, attrs = {}, padre) {
    const n = document.createElementNS(NS, tag);
    for (const [a, v] of Object.entries(attrs)) n.setAttribute(a, v);
    if (padre) padre.appendChild(n);
    return n;
  }

  function defs() {
    const d = el('defs', {}, svg);
    d.innerHTML = `
      <pattern id="p-campo" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-18) scale(.5)">
        <rect width="9" height="9" fill="${COLOR_TERRENO.campo}"/><path d="M0 4.5h9" stroke="#c9a85a" stroke-width=".7" opacity=".7"/></pattern>
      <pattern id="p-vega" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="scale(.5)">
        <rect width="10" height="10" fill="${COLOR_TERRENO.vega}"/><path d="M0 3h4M5 8h4" stroke="#8f9b4c" stroke-width=".8"/><path d="M5 0v4M0 5v4" stroke="#8f9b4c" stroke-width=".5" opacity=".6"/></pattern>
      <pattern id="p-bosque" width="11" height="10" patternUnits="userSpaceOnUse" patternTransform="scale(.5)">
        <rect width="11" height="10" fill="${COLOR_TERRENO.bosque}"/><path d="M2 7 4 2.5 6 7z M7.5 9.5l1.6-3.8 1.6 3.8z" fill="#6d8448" stroke="#4f6334" stroke-width=".35"/></pattern>
      <pattern id="p-sierra" width="14" height="11" patternUnits="userSpaceOnUse" patternTransform="scale(.5)">
        <rect width="14" height="11" fill="${COLOR_TERRENO.sierra}"/><path d="M1 8.5 4.5 3 8 8.5 M7.5 10.5 10.5 6 13.5 10.5" fill="none" stroke="#8a6a44" stroke-width=".7"/><path d="M4.5 3 5.8 8.5" stroke="#8a6a44" stroke-width=".4"/></pattern>
      <pattern id="p-dehesa" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="scale(.5)">
        <rect width="12" height="12" fill="${COLOR_TERRENO.dehesa}"/><circle cx="3" cy="4" r="1.3" fill="#7d8b56"/><circle cx="9" cy="9.5" r="1.1" fill="#7d8b56"/></pattern>
      <pattern id="p-niebla" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <rect width="6" height="6" fill="#ddd6c7"/><path d="M0 3h6" stroke="#cbc2b0" stroke-width=".8"/></pattern>
      <pattern id="p-mar" width="16" height="8" patternUnits="userSpaceOnUse">
        <rect width="16" height="8" fill="#9dc0bb"/><path d="M1 5q2.5-2 5 0t5 0" fill="none" stroke="#86ada8" stroke-width=".6"/></pattern>
      <filter id="f-niebla" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>
      <filter id="f-papel" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7"/>
        <feColorMatrix values="0 0 0 0 .2  0 0 0 0 .14  0 0 0 0 .1  0 0 0 -1.1 .62"/>
        <feComposite in2="SourceGraphic" operator="in"/>
      </filter>`;
  }

  function construir(contenedor, opciones) {
    alSeleccionar = opciones.alSeleccionar;
    svg = contenedor;
    svg.setAttribute('viewBox', `0 0 ${A.w} ${A.h}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    defs();
    raiz = el('g', {}, svg);
    el('rect', { x: -2000, y: -2000, width: A.w + 4000, height: A.h + 4000, fill: 'url(#p-mar)' }, raiz);
    el('path', { d: A.neighbors, fill: '#e6dccb', stroke: '#b9a98c', 'stroke-width': 1 }, raiz);
    // Costa grabada: trazos concéntricos bajo la tierra
    for (const [w, o] of [[14, .12], [8, .22], [3.4, .9]]) {
      el('path', { d: A.iberia, fill: 'none', stroke: '#5f8d89', 'stroke-width': w, opacity: o, 'stroke-linejoin': 'round' }, raiz);
    }
    el('path', { d: A.iberia, fill: '#e8cf8f' }, raiz);

    const tierra = el('g', { 'clip-path': 'url(#clip-tierra)' }, raiz);
    capas.celdas = el('g', {}, tierra);
    capas.rios = el('g', { fill: 'none', stroke: '#6f9c98', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, tierra);
    capas.niebla = el('g', { filter: 'url(#f-niebla)' }, tierra);
    capas.frontera = el('g', {}, tierra);
    capas.dominio = el('g', {}, tierra);
    el('rect', { x: 0, y: 0, width: A.w, height: A.h, filter: 'url(#f-papel)', fill: '#fff', opacity: .35, 'pointer-events': 'none' }, tierra);
    // Raya de Portugal como referencia geográfica, discreta
    const cp = el('clipPath', { id: 'clip-esp' }, svg.querySelector('defs'));
    el('path', { d: A.esp }, cp);
    el('path', { d: A.prt + A.and, fill: 'none', stroke: '#8a6a44', 'stroke-width': 1.2, 'stroke-dasharray': '1 4', 'stroke-linecap': 'round', 'clip-path': 'url(#clip-esp)', opacity: .7, 'pointer-events': 'none' }, raiz);
    capas.seleccion = el('g', { 'pointer-events': 'none' }, raiz);
    capas.etiquetas = el('g', {}, raiz);
    capas.rotulos = el('g', { 'pointer-events': 'none' }, raiz);

    rotulosFijos();

    zoom = d3.zoom().scaleExtent([1, 14])
      .translateExtent([[-120, -120], [A.w + 120, A.h + 120]])
      .on('zoom', ev => {
        raiz.setAttribute('transform', ev.transform.toString());
        if (Math.abs(ev.transform.k - k) > 0.01) { k = ev.transform.k; escalarEtiquetas(); }
      });
    d3.select(svg).call(zoom).on('dblclick.zoom', null);
    pintar();
  }

  function rotulosFijos() {
    const mar = [['Mar Cantábrico', 330, 22, 0], ['Océano Atlántico', 40, 470, -90], ['Mar Mediterráneo', 800, 560, -28], ['Francia', 830, 60, 0]];
    for (const [t, x, y, r] of mar) {
      const n = el('text', { x, y, transform: `rotate(${r} ${x} ${y})`, class: 'nombre-comarca', 'font-size': 17, fill: t === 'Francia' ? '#8f7d63' : '#3f6966', 'stroke-width': 0, 'font-style': 'italic', 'letter-spacing': 3, 'text-anchor': 'middle' }, capas.rotulos);
      n.style.fontFamily = 'var(--cursiva)';
      n.textContent = t;
    }
  }

  function pintar() {
    const J = window.JUEGO, S = J.S;
    for (const g of Object.values(capas)) if (g !== capas.rotulos) g.replaceChildren();

    for (const r of A.rivers) el('path', { d: r, 'stroke-width': 1.6, opacity: .9 }, capas.rios);

    A.cells.forEach((c, i) => {
      const d = voronoi.renderCell(i);
      const st = S.comarcas[c.id].estado;
      const p = el('path', { d, class: 'celda', fill: `url(#${PATRON[c.t]})`, stroke: '#8a6a44', 'stroke-width': .8, 'stroke-opacity': .45, 'vector-effect': 'non-scaling-stroke', 'data-id': c.id }, capas.celdas);
      p.addEventListener('click', () => seleccionar(c.id, true));
      if (st === 'oculta') {
        const frontera = J.esFrontera(c.id);
        el('path', { d, fill: 'url(#p-niebla)', opacity: frontera ? .72 : .93, 'pointer-events': 'none' }, capas.niebla);
        if (frontera) {
          el('path', { d, fill: 'none', stroke: '#6b5442', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', opacity: .7, 'vector-effect': 'non-scaling-stroke', 'pointer-events': 'none' }, capas.frontera);
        }
      } else if (st === 'propia') {
        el('path', { d, fill: '#24488f', opacity: .12, 'pointer-events': 'none' }, capas.dominio);
      } else {
        el('path', { d, fill: 'none', stroke: '#6b5442', 'stroke-width': 2, 'stroke-dasharray': '8 4', 'vector-effect': 'non-scaling-stroke', 'pointer-events': 'none' }, capas.dominio);
      }
    });

    // Contorno exterior del dominio: aristas entre una celda propia y otra que no lo es
    const propias = new Set(J.propias());
    let borde = '';
    A.cells.forEach((c, i) => {
      if (!propias.has(c.id)) return;
      const poly = voronoi.cellPolygon(i);
      for (const j of DELAUNAY.neighbors(i)) {
        if (propias.has(A.cells[j].id)) continue;
        const otra = voronoi.cellPolygon(j);
        const comunes = poly.filter(p => otra.some(q => Math.hypot(p[0] - q[0], p[1] - q[1]) < .01));
        if (comunes.length >= 2) borde += `M${comunes[0]}L${comunes[1]}`;
      }
    });
    if (borde) {
      el('path', { d: borde, fill: 'none', stroke: '#fbf4e3', 'stroke-width': 7, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', 'pointer-events': 'none' }, capas.dominio);
      el('path', { d: borde, fill: 'none', stroke: '#24488f', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', 'pointer-events': 'none' }, capas.dominio);
    }

    for (const o of S.ordenes) {
      if (o.tipo === 'obra') continue;
      const c = J.celda(o.comarca), cap = A.cells.find(x => x.id === S.capitalComarca).locs.find(l => l.cap);
      el('path', { d: `M${cap.x},${cap.y} Q${(cap.x + c.x) / 2 + 8},${(cap.y + c.y) / 2 - 10} ${c.x},${c.y}`, fill: 'none', stroke: '#a8660f', 'stroke-width': 2.5, 'stroke-dasharray': '2 5', 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', class: 'ruta', 'pointer-events': 'none' }, capas.frontera);
    }

    etiquetas();
    marcarSeleccion();
    escalarEtiquetas();
  }

  function etiquetas() {
    const J = window.JUEGO, S = J.S;
    const g = capas.etiquetas;
    for (const c of A.cells) {
      const st = S.comarcas[c.id].estado;
      if (st === 'oculta') {
        if (J.esFrontera(c.id)) {
          const t = el('text', { x: c.x, y: c.y, class: 'nombre-comarca escala', 'data-fs': 15, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: '#6b5442', 'pointer-events': 'none' }, g);
          t.textContent = S.ordenes.some(o => o.comarca === c.id) ? '⌖' : '?';
        }
        continue;
      }
      const nombre = el('text', { x: c.x, y: c.y + 13, class: 'nombre-comarca escala', 'data-fs': 12.5, 'data-sw': 3, 'text-anchor': 'middle' }, g);
      nombre.textContent = c.name || 'Comarca';
      for (const l of c.locs || []) {
        if (l.cap) {
          const pob = S.comarcas[c.id].pob;
          const u = el('use', { href: `#cap-${J.rango(pob)}`, class: 'escala-icono', 'data-cx': l.x, 'data-cy': l.y, 'data-w': 30, 'data-h': 22, 'pointer-events': 'none' }, g);
          const t = el('text', { x: l.x, y: l.y, class: 'nombre-cap escala', 'data-fs': 13, 'data-sw': 3, 'data-dy': -13, 'text-anchor': 'middle' }, g);
          t.textContent = l.n;
          u.dataset.cap = '1';
          iconosEdificios(c, l, g);
        } else {
          el('circle', { cx: l.x, cy: l.y, r: 1.6, fill: '#33241a', stroke: '#f3e7cc', 'stroke-width': .6, class: 'escala-punto loc', 'pointer-events': 'none' }, g);
          const t = el('text', { x: l.x, y: l.y, class: 'nombre-loc escala loc', 'data-fs': 9, 'data-sw': 2.5, 'data-dx': 3.5, 'data-dy': 3 }, g);
          t.textContent = l.n;
        }
      }
      if (st === 'propia' && !(c.locs || []).some(l => l.cap)) {
        const principal = (c.locs || [])[0];
        if (principal) el('use', { href: '#b-incorporar', class: 'escala-icono', 'data-cx': principal.x, 'data-cy': principal.y - 6, 'data-w': 12, 'data-h': 12, 'pointer-events': 'none' }, g);
      }
    }
  }

  function iconosEdificios(c, cap, g) {
    const edif = window.JUEGO.S.comarcas[c.id].edif;
    const mostrar = ['molino', 'granja', 'aserradero', 'cantera', 'mercado'].filter(e => edif[e] > 0);
    const offs = [[-22, 12], [22, 12], [-26, -6], [26, -6], [0, 24]];
    mostrar.forEach((e, i) => {
      el('use', { href: `#b-${e}`, class: 'escala-icono detalle', 'data-cx': cap.x, 'data-cy': cap.y, 'data-ox': offs[i][0], 'data-oy': offs[i][1], 'data-w': 16, 'data-h': 16, 'pointer-events': 'none' }, g);
    });
  }

  // Las etiquetas mantienen su tamaño en pantalla; los detalles aparecen al acercarse.
  function escalarEtiquetas() {
    const s = 1 / Math.pow(k, 0.85);
    const verLoc = k >= 5.5, verDetalle = k >= 2.6;
    for (const t of capas.etiquetas.querySelectorAll('.escala')) {
      t.setAttribute('font-size', (+t.dataset.fs) * s * (k < 1.5 && !t.classList.contains('nombre-cap') ? 1.2 : 1));
      t.setAttribute('stroke-width', (+t.dataset.sw || 0) * s);
      if (t.dataset.dx || t.dataset.dy) t.setAttribute('transform', `translate(${(+t.dataset.dx || 0) * s} ${(+t.dataset.dy || 0) * s})`);
    }
    for (const u of capas.etiquetas.querySelectorAll('.escala-icono')) {
      const w = +u.dataset.w * s, h = +u.dataset.h * s;
      const cx = +u.dataset.cx + (+u.dataset.ox || 0) * s, cy = +u.dataset.cy + (+u.dataset.oy || 0) * s;
      u.setAttribute('x', cx - w / 2); u.setAttribute('y', cy - h / 2);
      u.setAttribute('width', w); u.setAttribute('height', h);
    }
    for (const p of capas.etiquetas.querySelectorAll('.escala-punto')) p.setAttribute('r', 1.8 * s);
    capas.etiquetas.querySelectorAll('.loc').forEach(n => n.style.display = verLoc ? '' : 'none');
    capas.etiquetas.querySelectorAll('.detalle').forEach(n => n.style.display = verDetalle ? '' : 'none');
    capas.etiquetas.querySelectorAll('.nombre-comarca').forEach(n => n.style.display = k < 1.6 && n.textContent !== '?' && n.textContent !== '⌖' ? 'none' : '');
    
    capas.rios.querySelectorAll('path').forEach(p => p.setAttribute('stroke-width', 1.8 * Math.max(s, .3)));
  }

  function marcarSeleccion() {
    capas.seleccion.replaceChildren();
    if (!seleccion) return;
    const i = A.cells.findIndex(c => c.id === seleccion);
    const d = voronoi.renderCell(i);
    const g = el('g', { 'clip-path': 'url(#clip-tierra)' }, capas.seleccion);
    el('path', { d, fill: 'none', stroke: '#fbf4e3', 'stroke-width': 7, 'vector-effect': 'non-scaling-stroke', 'stroke-linejoin': 'round' }, g);
    el('path', { d, fill: 'none', stroke: '#a8660f', 'stroke-width': 3.5, 'vector-effect': 'non-scaling-stroke', 'stroke-dasharray': '8 4', 'stroke-linejoin': 'round', class: 'seleccion' }, g);
  }

  function seleccionar(id, porUsuario) {
    seleccion = id;
    marcarSeleccion();
    escalarEtiquetas();
    if (porUsuario) alSeleccionar(id);
  }

  function encuadrar(ids, duracion = 600) {
    const pts = ids.flatMap(id => voronoi.cellPolygon(A.cells.findIndex(c => c.id === id)));
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const r = svg.getBoundingClientRect();
    const escalaVista = Math.min(r.width / A.w, r.height / A.h);
    const panelMovil = window.matchMedia('(max-width: 860px)').matches ? 120 : 0;
    const altoUtil = (r.height - panelMovil) / escalaVista;
    const kk = Math.max(1, Math.min(14, 0.5 * Math.min(A.w / (x1 - x0), altoUtil / (y1 - y0))));
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 + (panelMovil / escalaVista) / (2 * kk);
    const t = d3.zoomIdentity.translate(A.w / 2, A.h / 2).scale(kk).translate(-cx, -cy);
    d3.select(svg).transition().duration(duracion).call(zoom.transform, t);
  }
  const acercar = f => d3.select(svg).transition().duration(250).call(zoom.scaleBy, f);
  const peninsula = () => d3.select(svg).transition().duration(600).call(zoom.transform, d3.zoomIdentity);

  window.MAPA = { construir, pintar, seleccionar, encuadrar, acercar, peninsula, voronoi };
})();
