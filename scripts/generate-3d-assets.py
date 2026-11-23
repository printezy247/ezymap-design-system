#!/usr/bin/env python3
"""Generate three EzyMap 3D asset sets (OBJ + MTL) from procedural primitives.

Output: assets/3d/ in the workspace root. Standard library only.
Run: python3 scripts/generate-3d-assets.py
"""

import math
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "3d")

# Road in front of the golden mascot, running toward +Z from the plinth edge.
# assets/3d/preview.html uses the same ROAD_START and ROAD_LENGTH to animate it.
ROAD_START = 0.42
ROAD_LENGTH = 1.2
ROAD_CENTER_Z = ROAD_START + ROAD_LENGTH / 2


def _srgb_hex_to_linear(hex_color):
    """Convert an sRGB hex colour (#rrggbb) to linear RGB, as stored in the .mtl files."""
    h = hex_color.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255.0
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return tuple(round(v, 4) for v in out)


# Palette and specular values taken from the reference SamBangGoldMascot_v1.mtl.
# green / green_deep come from tokens/tokens.json (primary and primary-glow, dark theme).
# logo_* come from the gradient stops in assets/logos/ezymap-hero-gold.svg.
# fin_light comes from the green gradient in assets/logos/ezymap-hero-fintech.svg.
MATERIALS = {
    "graphite": ((0.0185, 0.0232, 0.0343), 116),
    "gold": ((0.8070, 0.5149, 0.0595), 156),
    "gold_deep": ((0.4793, 0.2502, 0.0103), 140),
    "chrome": ((0.7157, 0.7529, 0.8070), 172),
    "green": (_srgb_hex_to_linear("#2fbf71"), 150),
    "green_deep": (_srgb_hex_to_linear("#0f7a4a"), 140),
    "logo_light": (_srgb_hex_to_linear("#f7e3a0"), 156),
    "logo_gold": (_srgb_hex_to_linear("#e0bc63"), 156),
    "logo_mid": (_srgb_hex_to_linear("#c9a13a"), 156),
    "logo_ink": (_srgb_hex_to_linear("#3a2a06"), 120),
    "logo_shine": (_srgb_hex_to_linear("#fff6d6"), 172),
    "fin_light": (_srgb_hex_to_linear("#5be39a"), 150),
    "lens_black": ((0.0, 0.0, 0.0), 120),
}


# ---------------------------------------------------------------- vector math

def _sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def _add(a, b):
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])


def _scale(a, s):
    return (a[0] * s, a[1] * s, a[2] * s)


def _cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def _dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def _len(a):
    return math.sqrt(_dot(a, a))


# ---------------------------------------------------------------- geometry

def _axis_map(p, axis):
    """Map a local Y-up point onto the world axis the shape should run along."""
    x, y, z = p
    if axis == "y":
        return (x, y, z)
    if axis == "z":
        return (x, -z, y)
    if axis == "x":
        return (y, x, z)
    raise ValueError(f"unknown axis {axis!r}")


def _place(p, axis, center, scale=(1.0, 1.0, 1.0)):
    q = (p[0] * scale[0], p[1] * scale[1], p[2] * scale[2])
    q = _axis_map(q, axis)
    return (q[0] + center[0], q[1] + center[1], q[2] + center[2])


class Part:
    """One named OBJ object with one material and flat-shaded triangles."""

    def __init__(self, name, material):
        if material not in MATERIALS:
            raise ValueError(f"unknown material {material!r}")
        self.name = name
        self.material = material
        self.tris = []  # list of (a, b, c, normal)

    def tri(self, a, b, c, ref):
        """Add a triangle. `ref` is a point inside the solid; the normal is
        flipped if it would point toward that point, so winding is always outward."""
        n = _cross(_sub(b, a), _sub(c, a))
        length = _len(n)
        if length < 1e-12:
            return  # degenerate (e.g. sphere pole)
        n = _scale(n, 1.0 / length)
        centroid = _scale(_add(_add(a, b), c), 1.0 / 3.0)
        if _dot(n, _sub(centroid, ref)) < 0:
            b, c = c, b
            n = _scale(n, -1.0)
        self.tris.append((a, b, c, n))

    def quad(self, a, b, c, d, ref):
        self.tri(a, b, c, ref)
        self.tri(a, c, d, ref)


def box(part, center, size):
    hx, hy, hz = size[0] / 2, size[1] / 2, size[2] / 2
    cx, cy, cz = center

    def P(x, y, z):
        return (cx + x * hx, cy + y * hy, cz + z * hz)

    faces = [
        (P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1)),
        (P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1), P(-1, -1, -1)),
        (P(-1, 1, -1), P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1)),
        (P(-1, -1, 1), P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1)),
        (P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)),
        (P(1, -1, -1), P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1)),
    ]
    for a, b, c, d in faces:
        part.quad(a, b, c, d, center)


def cylinder(part, center, radius, height, seg=24, axis="y"):
    h = height / 2
    ref = _place((0.0, 0.0, 0.0), axis, center)
    top_c = _place((0.0, h, 0.0), axis, center)
    bot_c = _place((0.0, -h, 0.0), axis, center)
    top, bot = [], []
    for i in range(seg):
        t = 2 * math.pi * i / seg
        x, z = radius * math.cos(t), radius * math.sin(t)
        bot.append(_place((x, -h, z), axis, center))
        top.append(_place((x, h, z), axis, center))
    for i in range(seg):
        j = (i + 1) % seg
        part.quad(bot[i], bot[j], top[j], top[i], ref)
        part.tri(top_c, top[i], top[j], ref)
        part.tri(bot_c, bot[j], bot[i], ref)


def tube(part, a, b, radius, seg=16):
    """Round tube between two world points, with flat caps. Used for arms."""
    d = _sub(b, a)
    length = _len(d)
    if length < 1e-9:
        raise ValueError("tube endpoints coincide")
    axis = _scale(d, 1.0 / length)
    helper = (0.0, 1.0, 0.0) if abs(axis[1]) < 0.9 else (1.0, 0.0, 0.0)
    u = _cross(axis, helper)
    u = _scale(u, 1.0 / _len(u))
    v = _cross(axis, u)

    def ring(p):
        pts = []
        for k in range(seg):
            t = 2 * math.pi * k / seg
            off = _add(_scale(u, radius * math.cos(t)), _scale(v, radius * math.sin(t)))
            pts.append(_add(p, off))
        return pts

    ra, rb = ring(a), ring(b)
    ref = _scale(_add(a, b), 0.5)
    for k in range(seg):
        j = (k + 1) % seg
        part.quad(ra[k], rb[k], rb[j], ra[j], ref)
        part.tri(a, ra[j], ra[k], ref)
        part.tri(b, rb[k], rb[j], ref)


def sphere(part, center, radius, lat=12, lon=24, scale=(1.0, 1.0, 1.0), axis="y"):
    ref = _place((0.0, 0.0, 0.0), axis, center, scale)

    def P(i, j):
        th = math.pi * i / lat
        ph = 2 * math.pi * (j % lon) / lon
        p = (
            radius * math.sin(th) * math.cos(ph),
            radius * math.cos(th),
            radius * math.sin(th) * math.sin(ph),
        )
        return _place(p, axis, center, scale)

    for i in range(lat):
        for j in range(lon):
            part.quad(P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1), ref)


def torus(part, center, big_r, small_r, seg_u=48, seg_v=12, axis="y"):
    def P(i, j):
        u = 2 * math.pi * (i % seg_u) / seg_u
        v = 2 * math.pi * (j % seg_v) / seg_v
        ring = big_r + small_r * math.cos(v)
        return _place(
            (ring * math.cos(u), small_r * math.sin(v), ring * math.sin(u)),
            axis,
            center,
        )

    for i in range(seg_u):
        u_mid = 2 * math.pi * (i + 0.5) / seg_u
        ref = _place(
            (big_r * math.cos(u_mid), 0.0, big_r * math.sin(u_mid)), axis, center
        )
        for j in range(seg_v):
            part.quad(P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1), ref)


def extrude(part, center, pts, depth):
    """Extrude a convex 2D outline (local x, y) along world Z, centred on `center`."""
    h = depth / 2
    n = len(pts)
    cx = sum(p[0] for p in pts) / n + center[0]
    cy = sum(p[1] for p in pts) / n + center[1]
    cz = center[2]
    ref = (cx, cy, cz)
    front = [(p[0] + center[0], p[1] + center[1], cz + h) for p in pts]
    back = [(p[0] + center[0], p[1] + center[1], cz - h) for p in pts]
    fc = (cx, cy, cz + h)
    bc = (cx, cy, cz - h)
    for i in range(n):
        j = (i + 1) % n
        part.tri(fc, front[i], front[j], ref)
        part.tri(bc, back[j], back[i], ref)
        part.quad(front[i], back[i], back[j], front[j], ref)


# ---------------------------------------------------------------- EzyMap logo

# Geometry from assets/logos/ezymap-hero-gold.svg (512-unit viewBox, y down).
LOGO_DIAMOND = [(256, 44), (420, 250), (256, 470), (92, 250)]
LOGO_HIGHLIGHT = [(256, 44), (174, 147), (256, 180)]
LOGO_CHEVRON = [(92, 250), (256, 316), (420, 250)]
LOGO_ROUTE = [(140, 236), (184, 214), (216, 228), (256, 176), (292, 196), (326, 158)]
LOGO_ORIGIN = (256, 257)


def _logo_pt(p, s, k=1.0):
    """SVG point (y down) to a local XY point (y up), scaled by s and by k about the logo centre."""
    return ((p[0] - LOGO_ORIGIN[0]) * s * k, (LOGO_ORIGIN[1] - p[1]) * s * k)


def _segment_outline(a, b, width):
    """Rectangle outline for a line segment of the given width."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    d = math.hypot(dx, dy)
    nx, ny = -dy / d * width / 2, dx / d * width / 2
    return [
        (a[0] + nx, a[1] + ny),
        (b[0] + nx, b[1] + ny),
        (b[0] - nx, b[1] - ny),
        (a[0] - nx, a[1] - ny),
    ]


def _stroke(part, center, pts, width, depth, z):
    """Draw a polyline (local XY points) as extruded segments with round joints, facing +Z."""
    cx, cy, _ = center
    for a, b in zip(pts, pts[1:]):
        extrude(part, (cx, cy, z), _segment_outline(a, b, width), depth)
    for p in pts:
        cylinder(part, (cx + p[0], cy + p[1], z), width / 2, depth, seg=12, axis="z")


def add_logo_plaque(new, center, s):
    """Green and gold EzyMap logo as a faceted plaque facing +Z.

    `center` is the plaque's mid-point on the front face. Every part name starts
    with "logo_" so the preview can pivot the whole plaque as one unit.
    """
    cx, cy, cz = center

    def at(p):
        return _logo_pt(p, s)

    rim = [_logo_pt(p, s, 1.08) for p in LOGO_DIAMOND]
    extrude(new("logo_rim", "graphite"), (cx, cy, cz - 0.015), rim, 0.01)

    # The four facets follow ezymap-hero-fintech.svg: green top, gold bottom.
    facets = [
        ("logo_facet_top_left", "fin_light", [(256, 44), (92, 250), (256, 316)]),
        ("logo_facet_top_right", "green_deep", [(256, 44), (256, 316), (420, 250)]),
        ("logo_facet_bottom_left", "logo_gold", [(92, 250), (256, 470), (256, 316)]),
        ("logo_facet_bottom_right", "logo_mid", [(256, 316), (256, 470), (420, 250)]),
    ]
    for name, mat, pts in facets:
        extrude(new(name, mat), (cx, cy, cz), [at(p) for p in pts], 0.02)
    extrude(
        new("logo_highlight", "logo_shine"),
        (cx, cy, cz + 0.0155),
        [at(p) for p in LOGO_HIGHLIGHT],
        0.006,
    )

    outline_z = cz + 0.022
    frame_loop = LOGO_DIAMOND + [LOGO_DIAMOND[0]]
    _stroke(new("logo_frame", "logo_gold"), center, [at(p) for p in frame_loop], 8 * s, 0.008, outline_z)
    _stroke(new("logo_chevron", "logo_gold"), center, [at(p) for p in LOGO_CHEVRON], 6 * s, 0.008, outline_z)

    route = [at(p) for p in LOGO_ROUTE]
    _stroke(new("logo_route_shadow", "logo_ink"), center, route, 16 * s, 0.008, outline_z)
    top_z = cz + 0.0275
    _stroke(new("logo_route", "logo_light"), center, route, 10 * s, 0.01, top_z)

    sx, sy = route[0]
    cylinder(new("logo_route_start", "logo_light"), (cx + sx, cy + sy, top_z), 7 * s, 0.01, seg=16, axis="z")
    ex, ey = route[-1]
    cylinder(new("logo_node", "logo_ink"), (cx + ex, cy + ey, top_z), 13 * s, 0.01, seg=24, axis="z")
    torus(
        new("logo_node_ring", "logo_gold"),
        (cx + ex, cy + ey, top_z + 0.005),
        13 * s,
        3 * s,
        seg_u=24,
        seg_v=8,
        axis="z",
    )


# ---------------------------------------------------------------- scene sets

# 5x5 pixel glyphs for the lowercase EzyMap wordmark on the mascot's visor.
# Each string is one row, top to bottom; "1" is a lit green pixel.
EYE_FONT = {
    "e": ("01110", "10001", "11111", "10000", "01110", "00000", "00000"),
    "z": ("11111", "00010", "00100", "01000", "11111", "00000", "00000"),
    "y": ("10001", "10001", "10001", "10001", "01111", "00001", "01110"),
    "m": ("11010", "10101", "10101", "10101", "10101", "00000", "00000"),
    "a": ("01110", "00001", "01111", "10001", "01111", "00000", "00000"),
    "p": ("11110", "10001", "10001", "10001", "11110", "10000", "10000"),
}


def eye_text(new, center, px, word="ezymap"):
    """Draw a lowercase word as green pixel blocks on the mascot's visor.

    `center` is the visor's front-face centre. The pixels sit a little in front of it.
    Every part name starts with "eye_" so the preview can turn the whole eye as one unit.
    """
    cx, cy, cz = center
    pz = cz + 0.006
    advance = 6
    total = len(word) * advance - 1
    mid_col = (total - 1) / 2
    count = 0
    for li, ch in enumerate(word):
        for r, row in enumerate(EYE_FONT[ch]):
            for c, bit in enumerate(row):
                if bit != "1":
                    continue
                x = cx + (li * advance + c - mid_col) * px
                y = cy + (3 - r) * px
                box(new(f"eye_px_{count:02d}", "green"), (x, y, pz), (px * 0.9, px * 0.9, 0.012))
                count += 1


def build_golden_mascot():
    parts = []

    def new(name, material):
        p = Part(name, material)
        parts.append(p)
        return p

    box(new("plinth", "graphite"), (0, -0.63, 0), (0.84, 0.06, 0.84))
    torus(new("plinth_ring", "gold"), (0, -0.60, 0), 0.42, 0.018, seg_u=64, seg_v=10)

    # Road in front of the plinth, with lane dashes and a traveller for the preview animation.
    box(new("road_base", "graphite"), (0, -0.67, ROAD_CENTER_Z), (0.36, 0.02, ROAD_LENGTH))
    box(new("road_edge_l", "gold"), (-0.17, -0.655, ROAD_CENTER_Z), (0.02, 0.01, ROAD_LENGTH))
    box(new("road_edge_r", "gold"), (0.17, -0.655, ROAD_CENTER_Z), (0.02, 0.01, ROAD_LENGTH))
    for i in range(6):
        box(
            new(f"road_dash_{i:02d}", "logo_light"),
            (0, -0.654, ROAD_START + 0.1 + 0.2 * i),
            (0.025, 0.006, 0.09),
        )
    sphere(new("road_traveler", "gold"), (0, -0.64, ROAD_START + 0.1), 0.022, lat=8, lon=12)

    for side, x in (("l", -0.09), ("r", 0.09)):
        box(new(f"leg_{side}", "gold_deep"), (x, -0.36, 0), (0.14, 0.40, 0.16))
        box(new(f"foot_{side}", "gold_deep"), (x, -0.56, 0.03), (0.17, 0.08, 0.24))

    box(new("belt", "graphite"), (0, -0.12, 0), (0.38, 0.08, 0.23))
    box(new("torso", "gold"), (0, 0.10, 0), (0.36, 0.42, 0.22))
    cylinder(new("neck", "gold"), (0, 0.36, 0), 0.07, 0.08, seg=20)
    sphere(new("head", "gold"), (0, 0.50, 0), 0.16, lat=16, lon=24)
    # Full black lens with the green "ezymap" wordmark. No frame.
    box(new("eye_plate", "lens_black"), (0, 0.52, 0.14), (0.40, 0.13, 0.10))
    eye_text(new, (0, 0.52, 0.19), 0.0105)

    # Arms reach forward and up so both hands hold the logo plaque at its side points.
    for side, x in (("l", -1), ("r", 1)):
        shoulder = (0.23 * x, 0.27, 0.0)
        elbow = (0.31 * x, 0.02, 0.07)
        hand = (0.16 * x, 0.09, 0.21)
        sphere(new(f"shoulder_{side}", "gold"), shoulder, 0.10, lat=12, lon=18)
        tube(new(f"upper_arm_{side}", "gold"), shoulder, elbow, 0.05)
        sphere(new(f"elbow_{side}", "gold"), elbow, 0.05, lat=8, lon=12)
        tube(new(f"forearm_{side}", "gold"), elbow, hand, 0.045)
        sphere(new(f"hand_{side}", "gold"), hand, 0.05, lat=10, lon=16)

    add_logo_plaque(new, (0, 0.08, 0.24), 0.00095)
    return parts


def build_pin_beacon():
    parts = []

    def new(name, material):
        p = Part(name, material)
        parts.append(p)
        return p

    add_logo_plaque(new, (0, 0.0, 0.0), 0.0006)
    cylinder(new("base", "graphite"), (0, -0.20, 0), 0.36, 0.04, seg=64)
    torus(new("base_ring", "gold"), (0, -0.18, 0), 0.36, 0.016, seg_u=72, seg_v=10)
    torus(new("base_glow", "green_deep"), (0, -0.18, 0), 0.30, 0.008, seg_u=72, seg_v=8)
    return parts


def build_orbit_globe():
    parts = []

    def new(name, material):
        p = Part(name, material)
        parts.append(p)
        return p

    sphere(new("globe", "graphite"), (0, 0, 0), 0.30, lat=18, lon=32)
    torus(new("equator", "gold"), (0, 0, 0), 0.30, 0.016, seg_u=72, seg_v=10)
    torus(
        new("orbit_halo", "chrome"), (0, 0, 0), 0.36, 0.010,
        seg_u=80, seg_v=8, axis="z",
    )
    # Logo plaque above the globe, where the summit pin used to be.
    add_logo_plaque(new, (0, 0.58, 0.0), 0.0005)

    # Location dot on the globe surface (unit direction ~ (0.50, 0.60, 0.62) at radius 0.30).
    sphere(new("location_dot", "green"), (0.1504, 0.1805, 0.1866), 0.02, lat=10, lon=16)

    # Fintech surround: a bar chart on the right, a rising trend line with nodes on the left,
    # a coin stack at the base, and small data dots on an outer ring.
    for i, (h, mat) in enumerate(((0.10, "green_deep"), (0.17, "green"), (0.25, "gold"))):
        x = 0.40 + 0.06 * i
        box(new(f"bar_{i}", mat), (x, -0.30 + h / 2, 0.0), (0.04, h, 0.04))

    trend = [(-0.40, -0.22), (-0.46, -0.04), (-0.42, 0.10), (-0.52, 0.24)]
    for k, (a, b) in enumerate(zip(trend, trend[1:])):
        tube(new(f"trend_{k}", "green"), (a[0], a[1], 0.0), (b[0], b[1], 0.0), 0.008, seg=8)
    for k, (x, y) in enumerate(trend):
        sphere(new(f"trend_node_{k}", "gold"), (x, y, 0.0), 0.018, lat=6, lon=10)

    for k in range(3):
        cylinder(new(f"coin_{k}", "gold"), (-0.30, -0.36 + 0.014 * k, 0.0), 0.03, 0.012, seg=24)

    for k, deg in enumerate((0, 45, 135, 180, 225, 315)):
        a = math.radians(deg)
        sphere(
            new(f"data_dot_{k}", "green"),
            (0.42 * math.cos(a), 0.42 * math.sin(a), 0.0),
            0.012,
            lat=6,
            lon=10,
        )
    return parts


# ---------------------------------------------------------------- writing

def _write_mtl(path):
    lines = [
        "# EzyMap 3D materials (palette from SamBangGoldMascot_v1.mtl and tokens/tokens.json)",
        "",
    ]
    for name, (kd, ns) in MATERIALS.items():
        lines += [
            f"newmtl {name}",
            f"Ka {kd[0]:.4f} {kd[1]:.4f} {kd[2]:.4f}",
            f"Kd {kd[0]:.4f} {kd[1]:.4f} {kd[2]:.4f}",
            "Ks 0.2000 0.2000 0.2000",
            f"Ns {ns}",
            "d 1.0000",
            "illum 2",
            "",
        ]
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines))


def write_set(set_name, title, parts):
    obj_path = os.path.join(OUT_DIR, f"{set_name}.obj")
    mtl_path = os.path.join(OUT_DIR, f"{set_name}.mtl")

    lines = [
        f"# {title}",
        "# Generated by scripts/generate-3d-assets.py",
        f"mtllib {set_name}.mtl",
        "",
    ]
    vi, ni = 1, 1
    for part in parts:
        lines.append(f"o {part.name}")
        lines.append(f"usemtl {part.material}")
        for a, b, c, n in part.tris:
            for p in (a, b, c):
                lines.append(f"v {p[0]:.6f} {p[1]:.6f} {p[2]:.6f}")
            lines.append(f"vn {n[0]:.6f} {n[1]:.6f} {n[2]:.6f}")
            lines.append(f"f {vi}//{ni} {vi + 1}//{ni} {vi + 2}//{ni}")
            vi += 3
            ni += 1
        lines.append("")

    with open(obj_path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines))
    _write_mtl(mtl_path)


def verify(set_name):
    """Re-read the written files and check indices, material references and names."""
    obj_path = os.path.join(OUT_DIR, f"{set_name}.obj")
    mtl_path = os.path.join(OUT_DIR, f"{set_name}.mtl")

    verts = norms = faces = 0
    objects = set()
    used = set()
    with open(mtl_path, encoding="utf-8") as f:
        defined = {ln.split()[1] for ln in f if ln.startswith("newmtl ")}

    with open(obj_path, encoding="utf-8") as f:
        for line in f:
            if line.startswith("v "):
                verts += 1
            elif line.startswith("vn "):
                norms += 1
            elif line.startswith("f "):
                faces += 1
                for tok in line.split()[1:]:
                    vi, ni = tok.split("//")
                    if not (1 <= int(vi) <= verts and 1 <= int(ni) <= norms):
                        raise RuntimeError(f"{set_name}: bad index in {tok!r}")
            elif line.startswith("usemtl "):
                used.add(line.split()[1])
            elif line.startswith("o "):
                name = line.split()[1]
                if name in objects:
                    raise RuntimeError(f"{set_name}: duplicate object {name!r}")
                objects.add(name)

    missing = used - defined
    if missing:
        raise RuntimeError(f"{set_name}: materials not in MTL: {sorted(missing)}")
    if faces != norms or verts != 3 * faces:
        raise RuntimeError(f"{set_name}: vertex/normal/face counts disagree")
    return {"objects": len(objects), "faces": faces, "vertices": verts}


SETS = [
    (
        "ezymap-set-1-golden-mascot",
        "EzyMap set 1: golden figure holding the EzyMap logo, with a road",
        build_golden_mascot,
    ),
    (
        "ezymap-set-2-map-pin-beacon",
        "EzyMap set 2: green and gold logo plaque on a graphite base",
        build_pin_beacon,
    ),
    (
        "ezymap-set-3-orbit-globe",
        "EzyMap set 3: graphite globe with a logo plaque and fintech elements",
        build_orbit_globe,
    ),
]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for set_name, title, builder in SETS:
        parts = builder()
        write_set(set_name, title, parts)
        stats = verify(set_name)
        print(
            f"{set_name}: {stats['objects']} objects, "
            f"{stats['faces']} faces, {stats['vertices']} vertices"
        )
        print(f"  -> {os.path.relpath(os.path.join(OUT_DIR, set_name + '.obj'), ROOT)}")
        print(f"  -> {os.path.relpath(os.path.join(OUT_DIR, set_name + '.mtl'), ROOT)}")


if __name__ == "__main__":
    main()
