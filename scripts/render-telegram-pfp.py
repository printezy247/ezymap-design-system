#!/usr/bin/env python3
"""Render the Macro Fundamentals Telegram profile picture (1024x1024 PNG).

The mark keeps the geometry of assets/logos/macro-fundamentals/macro-lockup-stacked.svg
(ring, meridian, parallels, trend line, end dot) with lighter stroke weights.

Depth follows the EzyMap design system ("Depth: the 3D feel"): bevelled glass surfaces,
neutral black shadows, a perspective grid floor in primary at low opacity and a soft radial
primary glow behind the hero object. Instead of stacked offset copies, each shape is lit:
its mask is blurred into a height field, surface normals are derived from it, and a
top-left light adds diffuse shading and a specular highlight. A thin extrusion and two
shadows (soft and contact) seat the mark on the floor.

Rendered at 3x and downsampled for smooth edges. Requires numpy and Pillow.
"""
import os

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "logos", "macro-fundamentals", "macro-telegram-pfp-1024.png")
SIZE = 1024
S = 3
W = SIZE * S

# Mark placement: centre (MX, MY) in output pixels, scale MS applied to the 512-unit source.
MX, MY, MS = 512, 352, 1.1
# Stroke weights in source units (the lockup uses 16 / 8 / 20 / 24).
RING_W, INNER_W, TREND_W, DOT_R = 12, 5, 15, 19
EXTRUDE_STEPS = 14

BG = (10, 12, 11)
BG_LIFT = (22, 27, 24)
GLASS_DARK = (9, 14, 12)
GLASS_LIGHT = (38, 60, 49)
GREEN = (47, 191, 113)
GREEN_DEEP = (15, 122, 74)
GREEN_DARK = (7, 61, 37)
GOLD = (224, 188, 99)
GOLD_DEEP = (143, 112, 36)
GOLD_DARK = (70, 52, 18)
GOLD_LIGHT = (244, 220, 147)
WHITE_LIT = (232, 238, 235)
TEXT_SIDE_NEAR = (92, 100, 96)
TEXT_SIDE_FAR = (30, 34, 32)

LIGHT = np.array([-0.45, -0.65, 0.62], dtype=np.float32)
LIGHT /= np.linalg.norm(LIGHT)
HALF = LIGHT + np.array([0.0, 0.0, 1.0], dtype=np.float32)
HALF /= np.linalg.norm(HALF)


def sc(v):
    return int(round(v * S))


def rgba(rgb, alpha=255):
    return (rgb[0], rgb[1], rgb[2], alpha)


def mix(a, b, t):
    return tuple(int(round(x + (y - x) * t)) for x, y in zip(a, b))


def load_font(size):
    candidates = [
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, sc(size))
    return ImageFont.load_default(size=sc(size))


def new_mask():
    return Image.new("L", (W, W), 0)


def mp(x, y):
    """Map a point from the 512-unit mark source to canvas pixels."""
    return (sc(MX + MS * (x - 256)), sc(MY + MS * (y - 256)))


# ---------------------------------------------------------------- masks

def stroke_path(d, pts, width_units):
    w = sc(width_units * MS)
    px = [mp(x, y) for x, y in pts]
    d.line(px, fill=255, width=w, joint="curve")
    r = w / 2
    for x, y in px:
        d.ellipse((x - r, y - r, x + r, y + r), fill=255)


def ring_mask():
    m = new_mask()
    cx, cy = mp(256, 256)
    r = sc((170 + RING_W / 2) * MS)
    ImageDraw.Draw(m).ellipse((cx - r, cy - r, cx + r, cy + r), outline=255, width=sc(RING_W * MS))
    return m


def inner_mask():
    m = new_mask()
    d = ImageDraw.Draw(m)
    cx, cy = mp(256, 256)
    rx = sc((70 + INNER_W / 2) * MS)
    ry = sc((170 + INNER_W / 2) * MS)
    d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), outline=255, width=sc(INNER_W * MS))
    stroke_path(d, [(86, 256), (426, 256)], INNER_W)
    stroke_path(d, [(112, 168), (400, 168)], INNER_W)
    stroke_path(d, [(112, 344), (400, 344)], INNER_W)
    return m


def trend_mask():
    m = new_mask()
    stroke_path(ImageDraw.Draw(m), [(150, 336), (212, 282), (266, 312), (366, 186)], TREND_W)
    return m


def dot_mask():
    m = new_mask()
    x, y = mp(366, 186)
    r = sc(DOT_R * MS)
    ImageDraw.Draw(m).ellipse((x - r, y - r, x + r, y + r), fill=255)
    return m


def disc_mask():
    m = new_mask()
    cx, cy = mp(256, 256)
    r = sc(170 * MS)
    ImageDraw.Draw(m).ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    return m


def text_mask(text, font, baseline, spacing):
    m = new_mask()
    d = ImageDraw.Draw(m)
    adv = [font.getlength(c) for c in text]
    total = sum(adv) + sc(spacing) * (len(text) - 1)
    x = sc(512) - total / 2
    for c, a in zip(text, adv):
        d.text((x, sc(baseline)), c, font=font, fill=255, anchor="ls")
        x += a + sc(spacing)
    return m


# ---------------------------------------------------------------- lighting

def gblur(a, sigma):
    """Gaussian blur of a float array through the Fourier domain (no 8-bit banding)."""
    h, w = a.shape
    fy = np.fft.fftfreq(h).astype(np.float32)[:, None]
    fx = np.fft.rfftfreq(w).astype(np.float32)[None, :]
    g = np.exp(-2.0 * (np.pi * sigma) ** 2 * (fx * fx + fy * fy)).astype(np.float32)
    return np.fft.irfft2(np.fft.rfft2(a) * g, s=a.shape).astype(np.float32)


def shade(mask, base, blur_px, opacity=1.0, ambient=0.28, spec=0.5):
    """Light a mask as a bevelled, rounded surface. Returns a full-canvas RGBA layer."""
    layer = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    bbox = mask.getbbox()
    if bbox is None:
        return layer
    pad = int(6 * blur_px) + 8
    x0, y0 = max(bbox[0] - pad, 0), max(bbox[1] - pad, 0)
    x1, y1 = min(bbox[2] + pad, W), min(bbox[3] + pad, W)
    m = np.asarray(mask.crop((x0, y0, x1, y1)), dtype=np.float32) / 255.0

    h = gblur(m, blur_px)
    gy, gx = np.gradient(h)
    k = 4.0 * blur_px
    nx, ny = -gx * k, -gy * k
    inv = 1.0 / np.sqrt(nx * nx + ny * ny + 1.0)
    nx, ny, nz = nx * inv, ny * inv, inv

    diff = np.clip(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2], 0.0, 1.0)
    lit = np.minimum(ambient + (1.0 - ambient) * diff / LIGHT[2], 1.4)
    ndh = np.clip(nx * HALF[0] + ny * HALF[1] + nz * HALF[2], 0.0, 1.0)
    highlight = spec * ndh ** 40

    rgb = np.asarray(base, dtype=np.float32)[None, None, :] * lit[..., None] + 255.0 * highlight[..., None]
    out = np.empty(m.shape + (4,), dtype=np.uint8)
    out[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    out[..., 3] = np.clip(m * opacity * 255.0, 0, 255).astype(np.uint8)
    layer.paste(Image.fromarray(out), (x0, y0))
    return layer


def side(mask, c_near, c_far, steps, dx, dy):
    """Thin extrusion: a few shifted copies stepping down and right, near to far."""
    layer = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    for k in range(steps, 0, -1):
        t = (k - 1) / max(steps - 1, 1)
        shifted = ImageChops.offset(mask, int(round(dx * k)), int(round(dy * k)))
        layer.paste(Image.new("RGBA", (W, W), rgba(mix(c_near, c_far, t))), (0, 0), shifted)
    return layer


def drop_shadow(img, mask, dx, dy, blur, opacity):
    sh = ImageChops.offset(mask, sc(dx), sc(dy)).filter(ImageFilter.GaussianBlur(sc(blur)))
    sh = sh.point(lambda v: int(v * opacity))
    layer = Image.new("RGBA", (W, W), (0, 0, 0, 255))
    layer.putalpha(sh)
    img.alpha_composite(layer)


# ---------------------------------------------------------------- scene layers

def ground():
    ys, xs = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
    d = np.sqrt(((xs - 512) / 620.0) ** 2 + ((ys - 400) / 640.0) ** 2)
    t = np.clip(d, 0, 1)[..., None] ** 1.3
    col = np.array(BG_LIFT, dtype=np.float32) * (1 - t) + np.array(BG, dtype=np.float32) * t
    col += np.random.default_rng(7).uniform(-0.6, 0.6, col.shape).astype(np.float32)
    small = Image.fromarray(np.clip(col, 0, 255).astype(np.uint8))
    return small.resize((W, W), Image.BICUBIC).convert("RGBA")


def glow():
    ys, xs = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
    d = np.sqrt((xs - MX) ** 2 + (ys - MY) ** 2)
    a = 0.26 * np.exp(-((d / 260.0) ** 2))
    alpha = Image.fromarray((a * 255).astype(np.uint8)).resize((W, W), Image.BICUBIC)
    layer = Image.new("RGBA", (W, W), rgba(GREEN))
    layer.putalpha(alpha)
    return layer


def grid_floor():
    m = new_mask()
    d = ImageDraw.Draw(m)
    y, step = 600.0, 10.0
    while y < SIZE:
        d.line([(0, sc(y)), (W, sc(y))], fill=255, width=S)
        y += step
        step *= 1.22
    vp = (sc(512), sc(520))
    for k in range(-8, 9):
        d.line([vp, (sc(512 + k * 170), W)], fill=255, width=S)
    ys = np.arange(SIZE, dtype=np.float32)[:, None] * np.ones((1, SIZE), dtype=np.float32)
    fade = np.clip((ys - 600.0) / 380.0, 0, 1) ** 1.3
    fade_img = Image.fromarray((fade * 255).astype(np.uint8)).resize((W, W), Image.BICUBIC)
    m = ImageChops.multiply(m, fade_img).point(lambda v: int(v * 0.20))
    layer = Image.new("RGBA", (W, W), rgba(GREEN))
    layer.putalpha(m)
    return layer


def chart_layer():
    layer = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    xs = [316, 372, 428, 484, 540, 596, 652, 708]
    wicks = [(878, 934), (868, 926), (872, 930), (858, 922), (850, 916), (854, 918), (840, 908), (832, 900)]
    bodies = [(890, 920), (880, 914), (886, 922), (870, 910), (860, 908), (866, 910), (850, 898), (842, 890)]
    colours = [GREEN, GOLD, GREEN, GREEN, GOLD, GREEN, GREEN, GREEN]
    for x, (wt, wb), (bt, bb), col in zip(xs, wicks, bodies, colours):
        d.line([(sc(x), sc(wt)), (sc(x), sc(wb))], fill=rgba(col, 70), width=sc(2))
        d.rectangle((sc(x - 9), sc(bt), sc(x + 9), sc(bb)), fill=rgba(col, 70))
    trend = [(730, 262), (785, 228), (825, 244), (872, 200)]
    d.line([(sc(x), sc(y)) for x, y in trend], fill=rgba(GREEN, 100), width=sc(3), joint="curve")
    ex, ey, er = sc(872), sc(200), sc(6)
    d.ellipse((ex - er, ey - er, ex + er, ey + er), fill=rgba(GOLD, 140))
    return layer


def glass_disc():
    r = sc(170 * MS)
    dm = 2 * r
    yy, xx = np.mgrid[0:dm, 0:dm].astype(np.float32)
    c = (dm - 1) / 2.0
    u, v = (xx - c) / c, (yy - c) / c
    r2 = np.clip(u * u + v * v, 0, 1)
    t = np.clip(0.5 - 0.5 * (u * 0.6 + v * 0.8), 0, 1)
    k = np.clip(0.55 * t + 0.45 * (1 - r2), 0, 1) ** 1.4
    dark = np.array(GLASS_DARK, dtype=np.float32)
    light = np.array(GLASS_LIGHT, dtype=np.float32)
    rgb = (dark + (light - dark) * k[..., None]) * (1 - 0.35 * r2 ** 3)[..., None]
    arr = np.empty((dm, dm, 4), dtype=np.uint8)
    arr[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    arr[..., 3] = 255
    face = Image.fromarray(arr)

    mask = Image.new("L", (dm, dm), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, dm - 1, dm - 1), fill=255)
    sheen = Image.new("L", (dm, dm), 0)
    ImageDraw.Draw(sheen).ellipse((int(dm * 0.14), int(dm * 0.10), int(dm * 0.58), int(dm * 0.36)), fill=255)
    sheen = sheen.filter(ImageFilter.GaussianBlur(sc(22))).point(lambda p: int(p * 0.07))
    sheen = ImageChops.multiply(sheen, mask)
    white = Image.new("RGBA", (dm, dm), (255, 255, 255, 255))
    white.putalpha(sheen)
    face.alpha_composite(white)
    face.putalpha(mask)

    layer = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    layer.paste(face, (sc(MX) - r, sc(MY) - r))
    return layer


def main():
    img = ground()
    img.alpha_composite(glow())
    img.alpha_composite(grid_floor())
    img.alpha_composite(chart_layer())

    ring, inner, trend, dot, disc = ring_mask(), inner_mask(), trend_mask(), dot_mask(), disc_mask()
    macro = text_mask("MACRO", load_font(108), 700, 5)
    fund = text_mask("FUNDAMENTALS", load_font(38), 760, 13)

    # Shadows on the floor: a soft one and a tight contact one under the mark and wordmark.
    mark = ImageChops.lighter(ring, disc)
    drop_shadow(img, mark, 10, 22, 22, 0.75)
    drop_shadow(img, mark, 3, 6, 5, 0.5)
    drop_shadow(img, ImageChops.lighter(macro, fund), 4, 8, 6, 0.8)

    # Glass disc with the meridian and parallels on top.
    img.alpha_composite(glass_disc())
    img.alpha_composite(shade(inner, GREEN, sc(1.5), opacity=0.55))

    # Ring: thin extrusion, then the lit surface.
    img.alpha_composite(side(ring, GREEN_DEEP, GREEN_DARK, EXTRUDE_STEPS, 0.5, 0.85))
    img.alpha_composite(shade(ring, GREEN, sc(3.3)))

    # Trend line and end dot: contact shadow on the glass, extrusion, lit surfaces.
    drop_shadow(img, ImageChops.lighter(trend, dot), 3, 6, 4, 0.6)
    img.alpha_composite(side(ImageChops.lighter(trend, dot), GOLD_DEEP, GOLD_DARK, EXTRUDE_STEPS - 4, 0.5, 0.85))
    img.alpha_composite(shade(trend, GOLD, sc(4)))
    img.alpha_composite(shade(dot, GOLD_LIGHT, sc(7), spec=0.7))

    # Wordmark.
    img.alpha_composite(side(macro, TEXT_SIDE_NEAR, TEXT_SIDE_FAR, 8, 0.5, 0.8))
    img.alpha_composite(shade(macro, WHITE_LIT, sc(3.0)))
    img.alpha_composite(side(fund, GOLD_DEEP, GOLD_DARK, 5, 0.5, 0.8))
    img.alpha_composite(shade(fund, GOLD, sc(1.4)))

    final = img.convert("RGB").resize((SIZE, SIZE), Image.LANCZOS)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    final.save(OUT, "PNG", optimize=True)
    print("wrote", os.path.relpath(OUT, ROOT), final.size)


if __name__ == "__main__":
    main()
