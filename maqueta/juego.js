// Reglas de simulación de la maqueta. Cifras provisionales para validar el ciclo
// explorar → producir → construir → expandirse; se ajustarán jugando.
(function () {
  const RECURSOS = ['alimento', 'madera', 'piedra', 'monedas'];
  const NOMBRE_RECURSO = { alimento: 'alimento', madera: 'madera', piedra: 'piedra', monedas: 'monedas' };

  const EDIFICIOS = {
    granja:     { nombre: 'Granja',     coste: { madera: 20, monedas: 10 },             turnos: 2, efecto: { alimento: 5 }, texto: '+5 alimento por turno' },
    aserradero: { nombre: 'Aserradero', coste: { madera: 10, piedra: 10, monedas: 10 }, turnos: 2, efecto: { madera: 4 },   texto: '+4 madera por turno' },
    cantera:    { nombre: 'Cantera',    coste: { madera: 20, monedas: 15 },             turnos: 3, efecto: { piedra: 4 },   texto: '+4 piedra por turno' },
    mercado:    { nombre: 'Mercado',    coste: { madera: 15, piedra: 15, monedas: 20 }, turnos: 3, efecto: { monedas: 3 },  texto: '+3 monedas por turno' },
    molino:     { nombre: 'Molino',     coste: { madera: 30, piedra: 10 },              turnos: 3, efecto: { alimento: 6 }, texto: '+6 alimento; requiere granja' },
    viviendas:  { nombre: 'Viviendas',  coste: { madera: 25, piedra: 10 },              turnos: 2, efecto: { capacidad: 40 }, texto: '+40 de capacidad de población' },
  };

  const EXPLORAR = { coste: { alimento: 15, monedas: 5 } };
  const INCORPORAR = { coste: { alimento: 40, monedas: 30 }, turnos: 3 };
  const OBRAS_POR_COMARCA = 2;
  const CONSUMO_POR_HAB = 1 / 5;
  const RESERVA_MINIMA = 30;
  const CRECIMIENTO = 5;

  const TERRENOS = {
    campo:  { nombre: 'Campiña de cereal', base: { alimento: 8, madera: 0, piedra: 1, monedas: 3 }, limites: { granja: 5, aserradero: 1, cantera: 1, mercado: 2, molino: 2, viviendas: 3 } },
    vega:   { nombre: 'Vega de regadío',   base: { alimento: 10, madera: 1, piedra: 0, monedas: 4 }, limites: { granja: 6, aserradero: 1, cantera: 0, mercado: 3, molino: 2, viviendas: 4 } },
    bosque: { nombre: 'Pinar y monte',     base: { alimento: 5, madera: 2, piedra: 0, monedas: 2 }, limites: { granja: 3, aserradero: 4, cantera: 1, mercado: 2, molino: 1, viviendas: 3 } },
    sierra: { nombre: 'Sierra',            base: { alimento: 3, madera: 1, piedra: 2, monedas: 2 }, limites: { granja: 2, aserradero: 2, cantera: 4, mercado: 1, molino: 1, viviendas: 2 } },
    dehesa: { nombre: 'Dehesa',            base: { alimento: 6, madera: 2, piedra: 0, monedas: 3 }, limites: { granja: 3, aserradero: 2, cantera: 1, mercado: 2, molino: 1, viviendas: 2 } },
  };

  // Condiciones de partida de las comarcas con nombre. Las demás se derivan del terreno al descubrirlas.
  const INICIO_COMARCAS = {
    pinares: { estado: 'propia', pob: 120, edif: { granja: 3, aserradero: 3, cantera: 1, mercado: 1, viviendas: 2 } },
    soria:   { estado: 'descubierta', pob: 80, edif: { granja: 2, mercado: 1 }, base: { alimento: 6, madera: 1, piedra: 1, monedas: 4 },
               limites: { granja: 4, aserradero: 1, cantera: 2, mercado: 3, molino: 2, viviendas: 3 } },
    burgo:   { pob: 90, edif: { granja: 2, mercado: 1 }, base: { alimento: 8, madera: 0, piedra: 2, monedas: 3 } },
  };

  const HITOS = [
    { id: 'horizonte', nombre: 'Primer horizonte', condicion: 'Explorar una comarca nueva' },
    { id: 'despensa', nombre: 'Despensa estable', condicion: 'Balance de alimento ≥ 0 y 60 en reserva durante 3 turnos' },
    { id: 'prospera', nombre: 'Un pueblo que prospera', condicion: 'La capital alcanza 150 habitantes: pasa a villa' },
    { id: 'mas-alla', nombre: 'Más allá del origen', condicion: 'Incorporar la primera comarca vecina' },
    { id: 'dominio', nombre: 'Un pequeño dominio', condicion: 'Administrar tres comarcas' },
  ];

  const CLAVE = 'atlas-pueblos-maqueta-v1';

  function estadoInicial() {
    const comarcas = {};
    for (const c of ATLAS.cells) {
      const ini = INICIO_COMARCAS[c.id] || {};
      const t = TERRENOS[c.t];
      comarcas[c.id] = {
        estado: ini.estado || 'oculta',
        pob: ini.pob ?? 40 + (hash(c.id) % 5) * 10,
        edif: ini.edif ? { ...ini.edif } : { granja: 1 },
        base: ini.base || { ...t.base },
        limites: ini.limites || { ...t.limites },
      };
    }
    return {
      partida: 'Tierras del Urbión', capital: 'Covaleda', capitalComarca: 'pinares',
      turno: 14, intervaloMin: 60, prueba: true,
      stock: { alimento: 80, madera: 64, piedra: 22, monedas: 45 },
      comarcas,
      ordenes: [
        { id: 1, tipo: 'obra', comarca: 'pinares', edificio: 'molino', total: 3, hecho: 1, iniciada: true, coste: { ...EDIFICIOS.molino.coste } },
        { id: 2, tipo: 'explorar', comarca: 'burgo', total: 2, hecho: 1, iniciada: true, coste: { ...EXPLORAR.coste } },
      ],
      sigId: 3,
      escasez: false,
      turnosDespensa: 0,
      hitos: { horizonte: 9 },
      cronica: [
        { turno: 13, entradas: [
          'Comienza la obra del molino en Pinares. Estará listo en 3 turnos.',
          'Una expedición sale de Covaleda hacia el sur, siguiendo el Duero.',
          'Producción +20 alimento, +14 madera, +4 piedra, +5 monedas. Consumo: 24 alimento.',
        ] },
        { turno: 12, entradas: ['El aserradero de Pinares alcanza el nivel 3.', 'Las reservas de alimento bajan a 88: la producción no cubre el consumo.'] },
        { turno: 9, entradas: ['Hito: Primer horizonte. Se descubre la Tierra de Soria, al este del Urbión.'] },
      ],
    };
  }

  function hash(s) { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }

  let S;
  function cargar() {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) { S = JSON.parse(raw); return S; }
    } catch (e) { /* sin almacenamiento: estado nuevo */ }
    S = estadoInicial();
    return S;
  }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) { /* ignorado */ } }
  function reiniciar() { S = estadoInicial(); guardar(); return S; }

  const celda = id => ATLAS.cells.find(c => c.id === id);
  const nombreComarca = id => celda(id).name || 'Comarca sin nombre';
  const propias = () => Object.keys(S.comarcas).filter(id => S.comarcas[id].estado === 'propia');

  function produccionComarca(id) {
    const c = S.comarcas[id], p = { ...c.base };
    for (const [e, nivel] of Object.entries(c.edif)) {
      for (const [r, v] of Object.entries(EDIFICIOS[e].efecto)) if (r in p) p[r] += v * nivel;
    }
    return p;
  }
  const capacidad = id => 60 + (S.comarcas[id].edif.viviendas || 0) * 40;
  const consumoComarca = id => Math.round(S.comarcas[id].pob * CONSUMO_POR_HAB);

  function reservado() {
    const r = { alimento: 0, madera: 0, piedra: 0, monedas: 0 };
    for (const o of S.ordenes) if (!o.iniciada) for (const [k, v] of Object.entries(o.coste)) r[k] += v;
    return r;
  }
  function disponible() {
    const r = reservado(), d = {};
    for (const k of RECURSOS) d[k] = S.stock[k] - r[k];
    return d;
  }
  function balance(extra = []) {
    const ids = propias().concat(extra);
    const prod = { alimento: 0, madera: 0, piedra: 0, monedas: 0 };
    let consumo = 0;
    for (const id of ids) {
      const p = produccionComarca(id);
      for (const k of RECURSOS) prod[k] += p[k];
      consumo += consumoComarca(id);
    }
    return { prod, consumo, neto: prod.alimento - consumo };
  }
  function estadoAlimento(d = disponible().alimento, b = balance()) {
    if (S.escasez) return { nivel: 'grave', texto: 'Escasez', turnos: 0 };
    if (b.neto >= 0) return { nivel: 'bien', texto: 'Abastecido', turnos: Infinity };
    const turnos = Math.floor(d / -b.neto);
    return { nivel: 'aviso', texto: `Reservas para ${turnos} turnos`, turnos };
  }

  function vecinos(id) {
    const i = ATLAS.cells.findIndex(c => c.id === id);
    return [...window.DELAUNAY.neighbors(i)].map(j => ATLAS.cells[j].id);
  }
  const conocida = id => S.comarcas[id].estado !== 'oculta';
  const expedicion = () => S.ordenes.find(o => o.tipo !== 'obra');
  const esFrontera = id => !conocida(id) && vecinos(id).some(conocida);

  function faltas(coste) {
    const d = disponible(), f = [];
    for (const [k, v] of Object.entries(coste)) if (d[k] < v) f.push(`${v - d[k]} de ${NOMBRE_RECURSO[k]}`);
    return f;
  }
  const turnosExplorar = id => (['sierra', 'bosque'].includes(celda(id).t) ? 3 : 2);

  function validarObra(id, e) {
    const c = S.comarcas[id], def = EDIFICIOS[e];
    const nivel = c.edif[e] || 0, lim = c.limites[e] || 0;
    const enObra = S.ordenes.filter(o => o.tipo === 'obra' && o.comarca === id);
    if (c.estado !== 'propia') return { ok: false, motivo: 'Solo puedes construir en comarcas de tu dominio.' };
    if (enObra.some(o => o.edificio === e)) return { ok: false, motivo: `Ya hay un ${def.nombre.toLowerCase()} en obra aquí.`, enObra: true };
    if (lim === 0) return { ok: false, motivo: `El terreno de ${nombreComarca(id)} no admite ${def.nombre.toLowerCase()}.` };
    if (nivel >= lim) return { ok: false, motivo: `Límite de explotación alcanzado (${nivel}/${lim}). Otras comarcas pueden tener más potencial.` };
    if (e === 'molino' && !(c.edif.granja > 0)) return { ok: false, motivo: 'Necesita al menos una granja en la comarca.' };
    if (enObra.length >= OBRAS_POR_COMARCA) return { ok: false, motivo: `${nombreComarca(id)} ya tiene ${OBRAS_POR_COMARCA} obras en curso.` };
    const f = faltas(def.coste);
    if (f.length) return { ok: false, motivo: `Faltan ${f.join(' y ')}.` };
    return { ok: true };
  }

  function validarExpedicion(id, tipo) {
    const exp = expedicion();
    if (S.escasez) return { ok: false, motivo: 'Hay escasez de alimento: no se pueden iniciar expediciones hasta recuperar reservas.', escasez: true };
    if (exp) return { ok: false, motivo: `Ya hay una expedición en curso hacia ${exp.tipo === 'explorar' && !conocida(exp.comarca) ? 'tierras sin explorar' : nombreComarca(exp.comarca)}. Termina en el turno ${S.turno + exp.total - exp.hecho}.` };
    if (tipo === 'explorar') {
      if (!esFrontera(id)) return { ok: false, motivo: 'Solo se pueden explorar comarcas que lindan con tu área conocida.' };
      const f = faltas(EXPLORAR.coste);
      if (f.length) return { ok: false, motivo: `Faltan ${f.join(' y ')}.` };
    } else {
      if (S.comarcas[id].estado !== 'descubierta') return { ok: false, motivo: 'Primero hay que explorar la comarca.' };
      if (!vecinos(id).some(v => S.comarcas[v].estado === 'propia')) return { ok: false, motivo: 'Solo puedes incorporar comarcas que lindan con tu dominio.' };
      const f = faltas(INCORPORAR.coste);
      if (f.length) return { ok: false, motivo: `Faltan ${f.join(' y ')}.` };
    }
    return { ok: true };
  }

  function ordenar(o) {
    S.ordenes.push({ id: S.sigId++, hecho: 0, iniciada: false, ...o });
    guardar();
  }
  function construir(id, e) {
    const v = validarObra(id, e); if (!v.ok) return v;
    ordenar({ tipo: 'obra', comarca: id, edificio: e, total: EDIFICIOS[e].turnos, coste: { ...EDIFICIOS[e].coste } });
    return v;
  }
  function explorar(id) {
    const v = validarExpedicion(id, 'explorar'); if (!v.ok) return v;
    ordenar({ tipo: 'explorar', comarca: id, total: turnosExplorar(id), coste: { ...EXPLORAR.coste } });
    return v;
  }
  function incorporar(id) {
    const v = validarExpedicion(id, 'incorporar'); if (!v.ok) return v;
    ordenar({ tipo: 'incorporar', comarca: id, total: INCORPORAR.turnos, coste: { ...INCORPORAR.coste } });
    return v;
  }
  function cancelar(oid) {
    const o = S.ordenes.find(x => x.id === oid);
    if (!o || o.iniciada) return false;
    S.ordenes = S.ordenes.filter(x => x.id !== oid);
    guardar();
    return true;
  }

  function lograr(id, entradas) {
    if (S.hitos[id]) return;
    S.hitos[id] = S.turno;
    entradas.push(`Hito: ${HITOS.find(h => h.id === id).nombre}.`);
  }

  function rango(pob) { return pob < 150 ? 'aldea' : pob < 260 ? 'villa' : 'ciudad'; }

  // Orden de resolución: producir → consumir → iniciar órdenes → avanzar → completar → crecer.
  function resolverTurno() {
    const entradas = [];
    const b = balance();
    for (const k of RECURSOS) S.stock[k] += b.prod[k];
    const disp = S.stock.alimento - reservado().alimento;
    if (disp < b.consumo) {
      S.stock.alimento -= disp;
      S.escasez = true;
      entradas.push(`Escasez: faltaron ${b.consumo - disp} de alimento. Se detienen el crecimiento y las nuevas expediciones.`);
    } else {
      S.stock.alimento -= b.consumo;
      if (S.escasez) entradas.push('Vuelve el abastecimiento: se reanudan el crecimiento y las expediciones.');
      S.escasez = false;
    }
    entradas.push(`Producción +${b.prod.alimento} alimento, +${b.prod.madera} madera, +${b.prod.piedra} piedra, +${b.prod.monedas} monedas. Consumo: ${b.consumo} alimento.`);

    const terminadas = [];
    for (const o of S.ordenes) {
      if (!o.iniciada) {
        if (o.tipo !== 'obra' && S.escasez) { entradas.push(`La expedición hacia ${nombreComarca(o.comarca)} espera: hay escasez.`); continue; }
        for (const [k, v] of Object.entries(o.coste)) S.stock[k] -= v;
        o.iniciada = true;
      }
      o.hecho += 1;
      if (o.hecho >= o.total) terminadas.push(o);
    }
    for (const o of terminadas) {
      const c = S.comarcas[o.comarca];
      if (o.tipo === 'obra') {
        c.edif[o.edificio] = (c.edif[o.edificio] || 0) + 1;
        entradas.push(`Termina la obra: ${EDIFICIOS[o.edificio].nombre.toLowerCase()} en ${nombreComarca(o.comarca)}. Producirá desde el próximo turno.`);
      } else if (o.tipo === 'explorar') {
        c.estado = 'descubierta';
        entradas.push(`La expedición regresa: se descubre ${nombreComarca(o.comarca)} (${TERRENOS[celda(o.comarca).t].nombre.toLowerCase()}).`);
        lograr('horizonte', entradas);
      } else {
        c.estado = 'propia';
        entradas.push(`${nombreComarca(o.comarca)} se incorpora a tu dominio.`);
        lograr('mas-alla', entradas);
        if (propias().length >= 3) lograr('dominio', entradas);
      }
    }
    S.ordenes = S.ordenes.filter(o => !terminadas.includes(o));

    for (const id of propias()) {
      const m = motivoSinCrecer(id);
      if (!m) {
        S.comarcas[id].pob += CRECIMIENTO;
        entradas.push(`${nombreComarca(id)} gana ${CRECIMIENTO} habitantes.`);
      }
    }
    const b2 = balance();
    S.turnosDespensa = b2.neto >= 0 && S.stock.alimento >= 60 && !S.escasez ? S.turnosDespensa + 1 : 0;
    if (S.turnosDespensa >= 3) lograr('despensa', entradas);
    if (S.comarcas[S.capitalComarca].pob >= 150) lograr('prospera', entradas);

    S.cronica.unshift({ turno: S.turno, entradas });
    S.cronica = S.cronica.slice(0, 12);
    S.turno += 1;
    guardar();
    return { entradas, terminadas };
  }

  function motivoSinCrecer(id) {
    const c = S.comarcas[id], b = balance();
    if (S.escasez) return 'Crecimiento detenido por escasez de alimento.';
    if (c.pob >= capacidad(id)) return `Sin viviendas libres (${c.pob}/${capacidad(id)}).`;
    if (S.stock.alimento - reservado().alimento < RESERVA_MINIMA) return `La reserva de alimento está por debajo de ${RESERVA_MINIMA}.`;
    if (b.neto - Math.round(CRECIMIENTO * CONSUMO_POR_HAB) < 0) return 'La producción de alimento no sostendría más población.';
    return null;
  }

  window.JUEGO = {
    RECURSOS, EDIFICIOS, EXPLORAR, INCORPORAR, TERRENOS, HITOS,
    get S() { return S; },
    cargar, guardar, reiniciar, celda, nombreComarca, propias, produccionComarca, capacidad, consumoComarca,
    reservado, disponible, balance, estadoAlimento, vecinos, conocida, esFrontera, expedicion, turnosExplorar,
    validarObra, validarExpedicion, construir, explorar, incorporar, cancelar, resolverTurno, motivoSinCrecer, rango,
  };
})();
