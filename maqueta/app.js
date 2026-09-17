// Pantallas de la maqueta: Mis partidas, elección de origen y atlas.
(function () {
  const J = window.JUEGO, A = window.ATLAS;
  const $ = s => document.querySelector(s);
  const ico = (id, cls = 'ico') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const firma = n => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');
  const COSTE_ICONO = { alimento: 'i-alimento', madera: 'i-madera', piedra: 'i-piedra', monedas: 'i-monedas' };

  J.cargar();
  let pestana = 'comarca', seleccion = J.S.capitalComarca, mapaListo = false;

  // ——— Utilidades de interfaz ———
  function brindis(texto) {
    const b = $('#brindis');
    b.textContent = texto; b.hidden = false;
    clearTimeout(brindis.t);
    brindis.t = setTimeout(() => (b.hidden = true), 3200);
  }
  function miniPeninsula(lon, lat, conocidas = []) {
    const cells = conocidas.map(id => A.cells.findIndex(c => c.id === id)).filter(i => i >= 0);
    const zonas = cells.map(i => `<path d="${MAPA.voronoi.renderCell(i)}" fill="#24488f" opacity=".75"/>`).join('');
    const x = (lon + 9.6) * Math.cos(40.2 * Math.PI / 180) * 100, y = (43.85 - lat) * 100;
    return `<svg viewBox="0 0 ${A.w} ${A.h}" aria-hidden="true"><path d="${A.iberia}" fill="#ead9b3" stroke="#6f9c98" stroke-width="6"/>
      <g clip-path="url(#clip-tierra)">${zonas}</g>
      <circle cx="${x}" cy="${y}" r="30" fill="none" stroke="#9b2f22" stroke-width="9"/><circle cx="${x}" cy="${y}" r="11" fill="#9b2f22"/></svg>`;
  }
  function proximaResolucion() {
    const ahora = new Date(), min = J.S.intervaloMin;
    const base = new Date(ahora); base.setMinutes(0, 0, 0);
    let t = base.getTime();
    while (t <= ahora.getTime()) t += min * 60000;
    return new Date(t);
  }
  const hora = d => d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  function cuentaAtras() {
    const falta = Math.max(0, proximaResolucion() - new Date());
    const m = Math.floor(falta / 60000), s = Math.floor(falta / 1000) % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  const finOrden = o => {
    const turnos = o.total - o.hecho;
    const fecha = new Date(proximaResolucion().getTime() + (turnos - 1) * J.S.intervaloMin * 60000);
    return { turno: J.S.turno + turnos, fecha };
  };

  // ——— Navegación ———
  function ir(pantalla) {
    for (const p of ['partidas', 'origen', 'atlas']) $(`#pantalla-${p}`).hidden = p !== pantalla;
    document.querySelectorAll('[data-ir]').forEach(b => (b.dataset.ir === pantalla ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current')));
    try { localStorage.setItem('atlas-pueblos-pantalla', pantalla); } catch (e) { /* ignorado */ }
    if (pantalla === 'atlas') abrirAtlas();
    if (pantalla === 'partidas') pintarPartidas();
  }
  document.querySelectorAll('[data-ir]').forEach(b => b.addEventListener('click', () => ir(b.dataset.ir)));

  // ——— Mis partidas ———
  function pintarPartidas() {
    const S = J.S, b = J.balance(), ea = J.estadoAlimento();
    const partidas = [
      { nombre: S.partida, capital: S.capital, lugar: 'Pinares, Soria', turno: S.turno, ritmo: '1 hora', proxima: `${hora(proximaResolucion())} · faltan ${cuentaAtras()}`,
        dominio: `${J.propias().length} ${J.propias().length === 1 ? 'comarca' : 'comarcas'} · ${J.rango(S.comarcas[S.capitalComarca].pob)}`,
        estado: `<span class="chip ${ea.nivel}">${ico(ea.nivel === 'bien' ? 'i-ok' : 'i-aviso')} ${ea.texto}</span>`,
        mini: miniPeninsula(-2.879, 41.934, Object.keys(S.comarcas).filter(id => S.comarcas[id].estado === 'propia')), ir: 'atlas', rapida: false },
      { nombre: 'Mármol y Almanzora', capital: 'Macael', lugar: 'Valle del Almanzora, Almería', turno: 212, ritmo: '5 min · prueba', proxima: 'faltan 3:10',
        dominio: '4 comarcas · villa', estado: '<span class="chip bien">' + ico('i-ok') + ' Abastecido</span>', mini: miniPeninsula(-2.301, 37.212), rapida: true },
      { nombre: 'Campos de Medina', capital: 'Medina del Campo', lugar: 'Tierra de Medina, Valladolid', turno: 3, ritmo: '1 día', proxima: 'mañana 09:00',
        dominio: '1 comarca · aldea', estado: '<span class="chip grave">' + ico('i-aviso') + ' Escasez</span>', mini: miniPeninsula(-4.912, 41.311), rapida: false },
    ];
    $('#lista-partidas').innerHTML = partidas.map((p, i) => `
      <button type="button" class="partida" data-partida="${i}">
        <div class="mini">${p.mini}</div>
        <div>
          <h3>${esc(p.nombre)}</h3>
          <div class="capital">${esc(p.capital)} · ${esc(p.lugar)}</div>
          <dl class="num">
            <dt>Turno</dt><dd>${p.turno}</dd>
            <dt>Resuelve</dt><dd>${p.proxima}</dd>
            <dt>Dominio</dt><dd>${p.dominio}</dd>
          </dl>
        </div>
        <div class="pie"><span class="chip ${p.rapida ? 'rapida' : 'ritmo'}">${ico('i-reloj')} ${p.ritmo}</span>${p.estado}</div>
      </button>`).join('') + `
      <button type="button" class="partida nueva" id="tarjeta-nueva"><div><h3>Nueva partida</h3><p class="lead" style="margin:4px auto 0">Elige nombre y ritmo; después, tu capital.</p></div></button>`;
    document.querySelectorAll('[data-partida]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.partida === '0') ir('atlas');
      else brindis('En la maqueta solo está dibujada la partida «Tierras del Urbión».');
    }));
    $('#tarjeta-nueva').addEventListener('click', abrirCrear);
  }
  function abrirCrear() { $('#form-crear').hidden = false; $('#crear-nombre').focus(); }
  $('#abrir-crear').addEventListener('click', abrirCrear);
  $('#cancelar-crear').addEventListener('click', () => ($('#form-crear').hidden = true));
  $('#form-crear').addEventListener('submit', ev => {
    ev.preventDefault();
    const op = $('#crear-turno').selectedOptions[0].textContent.split(' (')[0];
    $('#origen-partida').textContent = `${$('#crear-nombre').value || 'Partida sin nombre'} · turnos de ${op}`;
    ir('origen');
  });

  // ——— Elección de origen ———
  const ORIGENES = [
    { id: 'medina', nombre: 'Medina del Campo', comarca: 'Tierra de Medina', provincia: 'Valladolid', lon: -4.912, lat: 41.311, perfil: 'Agrícola', vineta: 'agricola',
      prod: { alimento: 26, madera: 6, piedra: 2, monedas: 7 }, fuerte: 'alimento', flojo: 'piedra',
      ventaja: 'Campiña de cereal: alimento abundante para sostener población y lanzar expediciones pronto.',
      limite: 'Poca piedra cerca. Las obras grandes dependerán de incorporar sierras vecinas.' },
    { id: 'covaleda', nombre: 'Covaleda', comarca: 'Pinares', provincia: 'Soria', lon: -2.879, lat: 41.934, perfil: 'Forestal', vineta: 'forestal',
      prod: { alimento: 20, madera: 14, piedra: 4, monedas: 5 }, fuerte: 'madera', flojo: null,
      ventaja: 'Pinares del Urbión: madera abundante para construir y mejorar explotaciones.',
      limite: 'Agricultura moderada. Hay que cuidar el alimento antes de expandirse.' },
    { id: 'macael', nombre: 'Macael', comarca: 'Valle del Almanzora', provincia: 'Almería', lon: -2.301, lat: 37.212, perfil: 'Serrano', vineta: 'serrano',
      prod: { alimento: 15, madera: 4, piedra: 16, monedas: 6 }, fuerte: 'piedra', flojo: 'alimento',
      ventaja: 'Canteras de mármol: piedra abundante para infraestructura duradera.',
      limite: 'Tierra seca. El alimento es el primer freno: conviene explorar hacia la vega.' },
  ];
  function pintarOrigenes() {
    $('#lista-origenes').innerHTML = ORIGENES.map(o => `
      <article class="origen">
        <div class="vineta">${VINETAS[o.vineta]}<div class="situacion" title="Ubicación aproximada">${miniPeninsula(o.lon, o.lat)}</div></div>
        <div class="cuerpo">
          <div class="titulo">
            <div><h2>${o.nombre}</h2><div class="donde">${o.comarca} · ${o.provincia}</div></div>
            <span class="perfil">${o.perfil}</span>
          </div>
          <div>
            <div class="eyebrow" style="margin-bottom:6px">Producción inicial por turno</div>
            <ul class="produccion num">${J.RECURSOS.map(r => `
              <li class="${r === o.fuerte ? 'fuerte' : r === o.flojo ? 'flojo' : ''}">${ico(COSTE_ICONO[r])}<b>+${o.prod[r]}</b>${r}</li>`).join('')}
            </ul>
          </div>
          <dl class="pros">
            <div><dt style="color:var(--bien)">${ico('i-ok')}<span class="sr">Ventaja</span></dt><dd><b>Ventaja.</b> ${o.ventaja}</dd></div>
            <div><dt style="color:var(--aviso)">${ico('i-aviso')}<span class="sr">Limitación</span></dt><dd><b>Limitación.</b> ${o.limite}</dd></div>
          </dl>
          <button class="btn ${o.id === 'covaleda' ? 'primario' : ''}" type="button" data-origen="${o.id}">Fundar la capital en ${o.nombre}</button>
        </div>
      </article>`).join('');
    document.querySelectorAll('[data-origen]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.origen === 'covaleda') ir('atlas');
      else brindis(`La maqueta solo tiene dibujado el entorno de Covaleda. ${ORIGENES.find(o => o.id === b.dataset.origen).nombre} queda para el catálogo geográfico.`);
    }));
  }

  // ——— Atlas ———
  function abrirAtlas() {
    if (!mapaListo) {
      MAPA.construir($('#mapa-svg'), { alSeleccionar: id => { seleccion = id; pestana = 'comarca'; abrirPanel(true); pintarPanel(); } });
      mapaListo = true;
      requestAnimationFrame(() => MAPA.encuadrar(['pinares', 'soria', 'burgo', 'cameros', 'demanda'], 0));
    }
    MAPA.seleccionar(seleccion, false);
    pintarAtlas();
  }
  function pintarAtlas() {
    const S = J.S;
    $('#at-partida').textContent = S.partida;
    $('#at-capital').textContent = `Capital: ${S.capital} · ${J.rango(S.comarcas[S.capitalComarca].pob)}`;
    $('#at-turno').textContent = `Turno ${S.turno}`;
    pintarRecursos();
    pintarPanel();
  }
  function reloj() {
    if (!$('#pantalla-atlas').hidden) $('#at-cuenta').textContent = `Resuelve a las ${hora(proximaResolucion())} · faltan ${cuentaAtras()}`;
  }
  setInterval(reloj, 1000);

  function pintarRecursos() {
    const S = J.S, d = J.disponible(), r = J.reservado(), b = J.balance(), ea = J.estadoAlimento();
    const neto = { alimento: b.neto, madera: b.prod.madera, piedra: b.prod.piedra, monedas: b.prod.monedas };
    $('#recursos').innerHTML = J.RECURSOS.map(k => `
      <button type="button" class="recurso ${k}" data-recurso="${k}" aria-label="${k}: ${d[k]} disponibles, ${firma(neto[k])} por turno">
        ${ico(COSTE_ICONO[k])}
        <span class="v num"><b>${d[k]}${r[k] ? `<small style="font-weight:500"> +${r[k]} res.</small>` : ''}</b>
        <small class="${neto[k] < 0 ? 'neg' : ''}">${firma(neto[k])}<span class="sufijo">/turno</span></small></span>
        ${k === 'alimento' ? `<span class="estado ${ea.nivel}">${ico(ea.nivel === 'bien' ? 'i-ok' : 'i-aviso')}${ea.texto}</span>` : ''}
      </button>`).join('');
    document.querySelectorAll('[data-recurso="alimento"]').forEach(b => b.addEventListener('click', () => {
      seleccion = S.capitalComarca; pestana = 'comarca'; MAPA.seleccionar(seleccion, false); abrirPanel(true); pintarPanel();
      document.getElementById('bloque-alimento')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  function costeHTML(coste) {
    const d = J.disponible();
    return Object.entries(coste).map(([k, v]) => `<span class="${d[k] < v ? 'falta' : ''}">${ico(COSTE_ICONO[k])}${v}</span>`).join('');
  }

  function bloqueAlimento() {
    const S = J.S, b = J.balance(), d = J.disponible(), r = J.reservado(), ea = J.estadoAlimento();
    let aviso = '';
    if (ea.nivel === 'grave') aviso = `<div class="aviso-caja grave">${ico('i-aviso')}<div><p><b>Escasez.</b> El crecimiento y las nuevas expediciones están detenidos. Producción y obras siguen activas.</p><button class="btn peq" type="button" data-mejorar>Ver mejoras de alimento</button></div></div>`;
    else if (ea.nivel === 'aviso') aviso = `<div class="aviso-caja aviso">${ico('i-aviso')}<div><p><b>Déficit de ${-b.neto} por turno.</b> Las reservas cubren el consumo durante ${ea.turnos} turnos si nada cambia.</p><button class="btn peq" type="button" data-mejorar>Ver mejoras de alimento</button></div></div>`;
    return `
      <section class="bloque" id="bloque-alimento">
        <h4>Alimento del dominio</h4>
        <table class="tabla num">
          <tr><td>Reservas disponibles</td><td>${d.alimento}</td></tr>
          ${r.alimento ? `<tr><td>Reservado para órdenes</td><td>${r.alimento}</td></tr>` : ''}
          <tr><td>Producción por turno</td><td class="pos">+${b.prod.alimento}</td></tr>
          <tr><td>Consumo por turno</td><td class="neg">−${b.consumo}</td></tr>
          <tr class="total"><td>Balance neto</td><td class="${b.neto < 0 ? 'neg' : 'pos'}">${firma(b.neto)}</td></tr>
        </table>
        ${aviso}
      </section>`;
  }

  function fichaComarca(id) {
    const S = J.S, c = S.comarcas[id], cel = J.celda(id), T = J.TERRENOS[cel.t];
    const orden = S.ordenes.find(o => o.comarca === id && o.tipo !== 'obra');
    if (c.estado === 'oculta') {
      const frontera = J.esFrontera(id);
      const v = J.validarExpedicion(id, 'explorar');
      const turnos = J.turnosExplorar(id);
      return `
        <div class="ficha-cab">
          <div class="fila"><span class="propiedad ${orden ? 'viaje' : 'oculta'}">${orden ? 'Expedición en camino' : frontera ? 'Frontera sin explorar' : 'Desconocida'}</span></div>
          <h2>Tierra sin explorar</h2>
          <p class="terreno" style="margin:0">${frontera ? 'Linda con tu área conocida. Nombre, localidades y recursos se revelan al explorarla.' : 'Demasiado lejos: primero hay que explorar las comarcas intermedias.'}</p>
        </div>
        ${orden ? tarjetaOrden(orden) : frontera ? `
        <section class="bloque">
          <h4>Explorar</h4>
          <div class="edificio">
            <svg class="icono"><use href="#b-explorar"/></svg>
            <div><div class="nm">Enviar expedición</div><div class="det num">${turnos} turnos${turnos === 3 ? ' · el relieve alarga el viaje' : ''} · revela la comarca, no la incorpora</div>
              <div class="coste num">${costeHTML(J.EXPLORAR.coste)}</div></div>
            <button class="btn peq primario" type="button" data-explorar="${id}" ${v.ok ? '' : 'aria-disabled="true"'}>Explorar</button>
            ${v.ok ? '' : `<div class="bloqueo">${ico('i-candado')}<span>${esc(v.motivo)}${v.escasez ? ' <button class="btn peq suave" type="button" data-mejorar>Mejorar alimento</button>' : ''}</span></div>`}
          </div>
          ${v.ok ? `<p class="nota">${ico('i-alimento')} Tras reservar el coste: ${J.disponible().alimento - J.EXPLORAR.coste.alimento} de alimento disponible, balance ${firma(J.balance().neto)} por turno.</p>` : ''}
        </section>` : ''}`;
    }

    const prod = J.produccionComarca(id), cons = J.consumoComarca(id);
    const locs = (cel.locs || []).map(l => (l.cap ? `<b>${l.n}</b> (capital)` : l.n)).join(', ');
    const cab = `
      <div class="ficha-cab">
        <div class="fila"><span class="propiedad ${c.estado === 'propia' ? 'propia' : 'neutral'}">${c.estado === 'propia' ? 'Tu dominio' : 'Descubierta · neutral'}</span><span class="terreno">${T.nombre}</span></div>
        <h2>${cel.name}</h2>
        <div class="localidades">${locs}</div>
      </div>
      <section class="bloque">
        <h4>${c.estado === 'propia' ? 'Aporta por turno' : 'Aportaría por turno'}</h4>
        <ul class="produccion num">
          ${J.RECURSOS.map(r => `<li>${ico(COSTE_ICONO[r])}<b>${r === 'alimento' ? firma(prod[r] - cons) : '+' + prod[r]}</b>${r === 'alimento' ? `${prod[r]} − ${cons}` : r}</li>`).join('')}
        </ul>
        <p class="nota num">${ico('i-poblacion')} ${c.pob} habitantes · capacidad ${J.capacidad(id)}</p>
      </section>`;

    if (c.estado === 'descubierta') {
      const v = J.validarExpedicion(id, 'incorporar');
      const antes = J.balance(), despues = J.balance([id]);
      const dispTras = J.disponible().alimento - J.INCORPORAR.coste.alimento;
      return cab + (orden ? tarjetaOrden(orden) : `
        <section class="bloque">
          <h4>Incorporar al dominio</h4>
          <div class="edificio">
            <svg class="icono"><use href="#b-incorporar"/></svg>
            <div><div class="nm">Establecer administración</div><div class="det num">${J.INCORPORAR.turnos} turnos · su producción y su consumo pasan a tu balance</div>
              <div class="coste num">${costeHTML(J.INCORPORAR.coste)}</div></div>
            <button class="btn peq primario" type="button" data-incorporar="${id}" ${v.ok ? '' : 'aria-disabled="true"'}>Incorporar</button>
            ${v.ok ? '' : `<div class="bloqueo">${ico('i-candado')}<span>${esc(v.motivo)}</span></div>`}
          </div>
          <table class="tabla num">
            <tr><td>Previsión de alimento</td><td>Ahora → Con ${esc(cel.name)}</td></tr>
            <tr><td>Balance por turno</td><td><span class="${antes.neto < 0 ? 'neg' : 'pos'}">${firma(antes.neto)}</span> → <span class="${despues.neto < 0 ? 'neg' : 'pos'}">${firma(despues.neto)}</span></td></tr>
            <tr><td>Reservas tras pagar</td><td>${dispTras}${despues.neto < 0 ? ` · ${Math.max(0, Math.floor(dispTras / -despues.neto))} turnos` : ''}</td></tr>
          </table>
        </section>`);
    }

    // Comarca propia
    const obras = S.ordenes.filter(o => o.tipo === 'obra' && o.comarca === id);
    const sinCrecer = J.motivoSinCrecer(id);
    const edificios = Object.entries(J.EDIFICIOS).map(([e, def]) => {
      const nivel = c.edif[e] || 0, lim = c.limites[e] || 0;
      const v = J.validarObra(id, e);
      const obra = obras.find(o => o.edificio === e);
      return `
        <li class="edificio" id="edif-${e}">
          <svg class="icono"><use href="#b-${e}"/></svg>
          <div>
            <div class="nm">${def.nombre} <span class="nivel num">${nivel}/${lim}</span></div>
            <div class="det">${def.texto} · ${def.turnos} turnos</div>
            ${obra ? `<div class="barra" style="margin-top:6px"><i style="width:${(obra.hecho / obra.total) * 100}%"></i></div>` : `<div class="coste num">${costeHTML(def.coste)}</div>`}
          </div>
          ${obra ? `<span class="chip ritmo">En obra</span>` : `<button class="btn peq ${v.ok ? 'primario' : ''}" type="button" data-construir="${e}" ${v.ok ? '' : 'aria-disabled="true"'}>Construir</button>`}
          ${!obra && !v.ok ? `<div class="bloqueo">${ico('i-candado')}<span>${esc(v.motivo)}</span></div>` : ''}
        </li>`;
    }).join('');
    return cab + (id === S.capitalComarca || J.propias().length ? bloqueAlimento() : '') + `
      <section class="bloque">
        <h4>Población</h4>
        ${sinCrecer ? `<div class="aviso-caja info">${ico('i-poblacion')}<p>No crece: ${esc(sinCrecer)}</p></div>` : `<div class="aviso-caja info">${ico('i-poblacion')}<p>Crecerá +5 al resolver el turno.</p></div>`}
      </section>
      <section class="bloque" id="bloque-obras">
        <h4>Construcciones · ${obras.length}/2 obras</h4>
        <ul class="edificios">${edificios}</ul>
      </section>`;
  }

  function tarjetaOrden(o) {
    const S = J.S, fin = finOrden(o);
    const titulo = o.tipo === 'obra' ? `${J.EDIFICIOS[o.edificio].nombre} en ${J.nombreComarca(o.comarca)}`
      : o.tipo === 'explorar' ? `Exploración ${J.conocida(o.comarca) ? 'de ' + J.nombreComarca(o.comarca) : 'hacia tierra desconocida'}`
      : `Incorporar ${J.nombreComarca(o.comarca)}`;
    const icono = o.tipo === 'obra' ? `b-${o.edificio}` : o.tipo === 'explorar' ? 'b-explorar' : 'b-incorporar';
    const estado = o.iniciada ? `${o.hecho} de ${o.total} turnos` : 'Pendiente · empieza al resolver el turno';
    return `
      <div class="orden">
        <svg class="icono" width="40" height="40"><use href="#${icono}"/></svg>
        <div>
          <div class="t"><span>${esc(titulo)}</span></div>
          <div class="d num">${estado} · termina en el turno ${fin.turno} (${fin.fecha.toLocaleString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' })})</div>
          <div class="d num" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${o.iniciada ? 'Coste pagado:' : 'Reservado:'} <span class="coste" style="display:inline-flex;gap:8px">${Object.entries(o.coste).map(([k, v]) => `<span>${ico(COSTE_ICONO[k])}${v}</span>`).join('')}</span>
            ${o.iniciada ? '' : `<button class="btn peq suave" type="button" data-cancelar="${o.id}">Cancelar y devolver</button>`}</div>
          <div class="barra"><i style="width:${(o.hecho / o.total) * 100}%"></i></div>
        </div>
      </div>`;
  }

  function pintarPanel() {
    const S = J.S;
    document.querySelectorAll('.pestanas [data-tab]').forEach(b => {
      b.setAttribute('aria-selected', b.dataset.tab === pestana);
      if (b.dataset.tab === 'ordenes') b.innerHTML = `Órdenes${S.ordenes.length ? `<span class="n">${S.ordenes.length}</span>` : ''}`;
    });
    const cel = J.celda(seleccion), st = S.comarcas[seleccion].estado;
    $('#panel-resumen').innerHTML = `<b>${st === 'oculta' ? 'Tierra sin explorar' : esc(cel.name)}</b><span class="chip ${J.estadoAlimento().nivel}">${ico('i-alimento')} ${firma(J.balance().neto)}/turno</span>`;
    let html = '';
    if (pestana === 'comarca') html = fichaComarca(seleccion);
    else if (pestana === 'ordenes') {
      const exp = J.expedicion();
      html = `<section class="bloque"><h4>Órdenes en curso</h4>${S.ordenes.length ? S.ordenes.map(tarjetaOrden).join('') : '<p class="nota">No hay órdenes. Selecciona una comarca para construir, explorar o incorporar.</p>'}</section>
        <p class="nota">${ico('b-explorar')} Expediciones: ${exp ? '1/1 en curso' : '0/1 · puedes enviar una'}. Las obras admiten 2 a la vez por comarca.</p>`;
    } else {
      html = `<section class="bloque"><h4>Hitos</h4><div class="hitos">${J.HITOS.map(h => `
          <div class="hito ${S.hitos[h.id] ? 'logrado' : ''}"><span class="sello">${S.hitos[h.id] ? ico('i-ok') : ''}</span><div><b>${h.nombre}</b>${S.hitos[h.id] ? ` · turno ${S.hitos[h.id]}` : `<div class="nota">${h.condicion}</div>`}</div></div>`).join('')}</div></section>
        <section class="bloque"><h4>Crónica</h4><div class="cronica">${S.cronica.map(c => `
          <article><h5 class="num">Turno ${c.turno}</h5><ul>${c.entradas.map(e => `<li>${esc(e)}</li>`).join('')}</ul></article>`).join('')}</div></section>
        <button class="btn suave peq" type="button" id="reiniciar">Reiniciar la maqueta</button>`;
    }
    $('#panel-cuerpo').innerHTML = html;
  }

  // ——— Acciones ———
  function tras(v, ok) {
    if (!v.ok) { brindis(v.motivo); return; }
    brindis(ok);
    MAPA.pintar(); pintarAtlas();
  }
  $('#panel-cuerpo').addEventListener('click', ev => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.construir) tras(J.construir(seleccion, b.dataset.construir), `Obra ordenada: ${J.EDIFICIOS[b.dataset.construir].nombre}. Recursos reservados.`);
    else if (b.dataset.explorar) tras(J.explorar(b.dataset.explorar), 'Expedición preparada. Sale al resolver el turno.');
    else if (b.dataset.incorporar) tras(J.incorporar(b.dataset.incorporar), 'Expedición de incorporación preparada.');
    else if (b.dataset.cancelar) { J.cancelar(+b.dataset.cancelar); brindis('Orden cancelada. Recursos devueltos.'); MAPA.pintar(); pintarAtlas(); }
    else if (b.hasAttribute('data-mejorar')) {
      seleccion = J.S.capitalComarca; pestana = 'comarca'; MAPA.seleccionar(seleccion, false); pintarPanel();
      document.getElementById('edif-molino')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (b.id === 'reiniciar') { J.reiniciar(); seleccion = J.S.capitalComarca; MAPA.pintar(); MAPA.seleccionar(seleccion, false); pintarAtlas(); brindis('Maqueta reiniciada en el turno 14.'); }
  });
  document.querySelectorAll('.pestanas [data-tab]').forEach(b => b.addEventListener('click', () => { pestana = b.dataset.tab; abrirPanel(true); pintarPanel(); }));

  $('#resolver').addEventListener('click', () => {
    const turno = J.S.turno;
    const { terminadas } = J.resolverTurno();
    MAPA.pintar(); MAPA.seleccionar(seleccion, false);
    pestana = 'cronica'; abrirPanel(true); pintarAtlas();
    const exploradas = terminadas.filter(o => o.tipo !== 'obra').map(o => o.comarca);
    if (exploradas.length) MAPA.encuadrar(J.propias().concat(exploradas));
    brindis(`Turno ${turno} resuelto. ${terminadas.length ? terminadas.length + ' órdenes completadas.' : 'Consulta la crónica.'}`);
  });

  $('#zoom-mas').addEventListener('click', () => MAPA.acercar(1.6));
  $('#zoom-menos').addEventListener('click', () => MAPA.acercar(1 / 1.6));
  $('#zoom-dominio').addEventListener('click', () => MAPA.encuadrar(Object.keys(J.S.comarcas).filter(id => J.S.comarcas[id].estado !== 'oculta')));
  $('#zoom-peninsula').addEventListener('click', () => MAPA.peninsula());

  // Panel inferior en móvil
  function abrirPanel(abrir) { $('#panel').classList.toggle('abierto', abrir); }
  $('#asa').addEventListener('click', () => abrirPanel(!$('#panel').classList.contains('abierto')));
  $('#panel-resumen').addEventListener('click', () => abrirPanel(!$('#panel').classList.contains('abierto')));

  // Arranque
  pintarOrigenes();
  let inicial = 'atlas';
  try { inicial = localStorage.getItem('atlas-pueblos-pantalla') || 'atlas'; } catch (e) { /* ignorado */ }
  ir(inicial);
  if (window.matchMedia('(max-width: 860px)').matches) abrirPanel(false);
})();
