"""Genera atlas-data.js para la maqueta: silueta peninsular, ríos y semillas de comarcas.
Fuente: Natural Earth 10m (dominio público). Proyección equirectangular con escala a 40,2° N."""
import json, math, random, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else '.'
LON0, LAT1, S = -9.6, 43.85, 100.0
COS = math.cos(math.radians(40.2))
W, H = round((3.45 - LON0) * COS * S), round((LAT1 - 35.85) * S)

def proj(lon, lat):
    return ((lon - LON0) * COS * S, (LAT1 - lat) * S)

def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    stack, keep = [(0, len(pts) - 1)], {0, len(pts) - 1}
    while stack:
        a, b = stack.pop()
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        n = math.hypot(dx, dy) or 1e-9
        best, idx = 0, None
        for i in range(a + 1, b):
            x, y = pts[i]
            d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / n if (dx or dy) else math.hypot(x - x1, y - y1)
            if d > best:
                best, idx = d, i
        if idx is not None and best > eps:
            keep.add(idx)
            stack += [(a, idx), (idx, b)]
    return [pts[i] for i in sorted(keep)]

def path(rings, eps, closed=True):
    out = []
    for r in rings:
        p = rdp([proj(*c[:2]) for c in r], eps)
        if len(p) < (4 if closed else 2):
            continue
        out.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in p) + ('Z' if closed else ''))
    return ''.join(out)

countries = {f['properties']['ADM0_A3']: f['geometry'] for f in json.load(open(f'{SRC}/countries.geojson'))['features']}

def polys(code):
    g = countries[code]
    return g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]

def largest(code, n=1):
    return sorted(polys(code), key=lambda p: -len(p[0]))[:n]

esp, prt = largest('ESP')[0], largest('PRT')[0]
andorra, gib = polys('AND')[0], polys('GIB')[0]
iberia_rings = [esp[0], prt[0], andorra[0], gib[0]]

def in_poly(lon, lat, ring):
    inside, j = False, len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i][:2]; xj, yj = ring[j][:2]
        if (yi > lat) != (yj > lat) and lon < (xj - xi) * (lat - yi) / (yj - yi) + xi:
            inside = not inside
        j = i
    return inside

def on_land(lon, lat):
    return any(in_poly(lon, lat, r) for r in iberia_rings[:3])

neighbors = [p[0] for p in largest('FRA', 1) + largest('MAR', 1)]

rivers = []
keepnames = {'Duero', 'Ebro', 'Tajo', 'Tejo', 'Guadiana', 'Guadalquivir', 'Minho', 'Mio', 'Segre', 'Esla'}
for f in json.load(open(f'{SRC}/rivers.geojson'))['features']:
    n = f['properties'].get('name')
    if n not in keepnames:
        continue
    g = f['geometry']
    lines = g['coordinates'] if g['type'] == 'MultiLineString' else [g['coordinates']]
    lines = [l for l in lines if any(-10 < p[0] < 3.5 and 36 < p[1] < 44 for p in l)]
    if lines:
        rivers.append(path(lines, 0.9, closed=False))

# Comarcas con nombre alrededor del origen de ejemplo (Covaleda). Límites de juego simplificados.
named = [
    ('pinares', 'Pinares', -2.92, 41.92, 'bosque', [('Covaleda', -2.879, 41.934, 1), ('Duruelo de la Sierra', -2.931, 41.955), ('Vinuesa', -2.763, 41.912), ('Navaleno', -3.005, 41.838), ('San Leonardo de Yagüe', -3.069, 41.829), ('Quintanar de la Sierra', -3.034, 41.984)]),
    ('soria', 'Tierra de Soria', -2.45, 41.76, 'campo', [('Soria', -2.465, 41.764), ('Garray', -2.447, 41.816)]),
    ('burgo', 'Tierra de El Burgo', -3.10, 41.58, 'campo', [('El Burgo de Osma', -3.066, 41.587), ('San Esteban de Gormaz', -3.204, 41.575), ('Berlanga de Duero', -2.862, 41.465)]),
    ('demanda', 'Sierra de la Demanda', -3.25, 42.12, 'sierra', [('Salas de los Infantes', -3.285, 42.022), ('Barbadillo del Mercado', -3.35, 42.04)]),
    ('cameros', 'Cameros', -2.65, 42.17, 'sierra', [('Villoslada de Cameros', -2.672, 42.077), ('Torrecilla en Cameros', -2.630, 42.256)]),
    ('altas', 'Tierras Altas', -2.20, 42.05, 'sierra', [('San Pedro Manrique', -2.231, 42.030)]),
    ('almazan', 'Tierra de Almazán', -2.45, 41.47, 'campo', [('Almazán', -2.531, 41.487)]),
    ('moncayo', 'Moncayo', -1.90, 41.80, 'sierra', [('Ágreda', -1.922, 41.855), ('Ólvega', -1.985, 41.781)]),
    ('ribera', 'Ribera del Duero', -3.70, 41.65, 'vega', [('Aranda de Duero', -3.689, 41.670), ('Peñaranda de Duero', -3.47, 41.68)]),
    ('arlanza', 'Arlanza', -3.72, 42.02, 'bosque', [('Lerma', -3.757, 42.026), ('Covarrubias', -3.518, 42.059)]),
    ('alfoz', 'Alfoz de Burgos', -3.70, 42.35, 'campo', [('Burgos', -3.697, 42.344)]),
    ('najerilla', 'Najerilla', -2.95, 42.40, 'vega', [('Nájera', -2.730, 42.416), ('Ezcaray', -3.013, 42.325)]),
    ('rioja', 'Rioja Media', -2.40, 42.42, 'vega', [('Logroño', -2.445, 42.465)]),
]

def terrain(lon, lat, rnd):
    zones = [
        ('sierra', lambda: lat > 42.35 and lon > -1.6),
        ('sierra', lambda: lat > 42.75 and -7.2 < lon < -3.6),
        ('sierra', lambda: 40.15 < lat < 40.85 and -6.6 < lon < -3.3),
        ('sierra', lambda: 40.2 < lat < 41.3 and -2.2 < lon < -0.7),
        ('sierra', lambda: lat < 37.5 and -5.4 < lon < -2.2),
        ('sierra', lambda: 37.9 < lat < 38.5 and -6.4 < lon < -3.2),
        ('sierra', lambda: 40.1 < lat < 40.6 and -8.0 < lon < -7.2),
        ('bosque', lambda: lat > 41.6 and lon < -6.8),
        ('bosque', lambda: lat > 43.0 and -8 < lon < -1.8),
        ('dehesa', lambda: 38.2 < lat < 40.1 and lon < -5.4),
        ('vega', lambda: 37.1 < lat < 38.0 and -6.4 < lon < -3.6),
        ('vega', lambda: 41.2 < lat < 42.2 and -1.8 < lon < 0.9),
        ('vega', lambda: 37.6 < lat < 39.8 and lon > -1.2),
        ('vega', lambda: 38.5 < lat < 39.5 and lon < -8.2),
    ]
    for t, test in zones:
        if test() and rnd.random() < 0.8:
            return t
    return rnd.choices(['campo', 'campo', 'dehesa', 'bosque', 'sierra'], k=1)[0]

rnd = random.Random(1492)
cells = []
for cid, name, lon, lat, ter, locs in named:
    x, y = proj(lon, lat)
    cells.append({'id': cid, 'name': name, 'x': round(x, 1), 'y': round(y, 1), 't': ter,
                  'locs': [{'n': l[0], 'x': round(proj(l[1], l[2])[0], 1), 'y': round(proj(l[1], l[2])[1], 1), **({'cap': 1} if len(l) > 3 else {})} for l in locs]})

SP = 40.5
row = 0
y = 0.0
while y < H + SP:
    x = (SP / 2 if row % 2 else 0.0)
    while x < W + SP:
        jx, jy = x + rnd.uniform(-8, 8), y + rnd.uniform(-8, 8)
        lon, lat = jx / (COS * S) + LON0, LAT1 - jy / S
        if on_land(lon, lat) and all(math.hypot(jx - c['x'], jy - c['y']) > 27 for c in cells[:len(named)]):
            cells.append({'id': f'c{len(cells)}', 'x': round(jx, 1), 'y': round(jy, 1), 't': terrain(lon, lat, rnd)})
        x += SP
    y += SP * 0.866
    row += 1

data = {
    'w': W, 'h': H,
    'iberia': path([esp[0], prt[0], andorra[0], gib[0]], 0.7),
    'esp': path([esp[0]], 0.7),
    'prt': path([prt[0]], 0.7),
    'and': path([andorra[0]], 0.3),
    'neighbors': path(neighbors, 1.2),
    'rivers': rivers,
    'cells': cells,
}
sys.stdout.write('window.ATLAS=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
