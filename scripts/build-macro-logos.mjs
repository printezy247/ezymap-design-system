// Generates the Macro Fundamentals logo set into assets/logos/macro-fundamentals/.
// Macro is an EzyMap product with its own glyph; these files never embed the EzyMap mark.
// Usage: node scripts/build-macro-logos.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets", "logos", "macro-fundamentals");
mkdirSync(outDir, { recursive: true });

const FONT = "'Space Grotesk','Inter Tight',system-ui,-apple-system,'Segoe UI',sans-serif";

// Palette values come from tokens/tokens.json (primary green, gold, background).
const palettes = {
  full: { ring: "#2fbf71", grid: "#2fbf71", line: "#e0bc63", node: "#f4dc93" },
  gold: { ring: "#e0bc63", grid: "#e0bc63", line: "#f4dc93", node: "#f4dc93" },
  white: { ring: "#ffffff", grid: "#ffffff", line: "#ffffff", node: "#ffffff" },
  black: { ring: "#0a0c0b", grid: "#0a0c0b", line: "#0a0c0b", node: "#0a0c0b" },
  green: { ring: "#2fbf71", grid: "#2fbf71", line: "#2fbf71", node: "#2fbf71" },
  onLight: { ring: "#0f7a4a", grid: "#0f7a4a", line: "#b38e2f", node: "#b38e2f" }
};

const svg = (w, h, label, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}"><title>${label}</title>\n${body}\n</svg>\n`;

// Globe (macro), meridian and parallels (global grid), rising line with end node (fundamentals trend).
const mark = (c, x = 0, y = 0, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke-linecap="round" stroke-linejoin="round">` +
  `<circle cx="256" cy="256" r="170" stroke="${c.ring}" stroke-width="16"/>` +
  `<g stroke="${c.grid}" stroke-width="8" opacity=".55"><ellipse cx="256" cy="256" rx="70" ry="170"/><line x1="86" y1="256" x2="426" y2="256"/><path d="M112 168H400M112 344H400"/></g>` +
  `<polyline points="150,336 212,282 266,312 366,186" stroke="${c.line}" stroke-width="20"/>` +
  `<circle cx="366" cy="186" r="24" fill="${c.node}" stroke="none"/></g>`;

const files = {};

// Marks (transparent background)
for (const [name, key] of [["fullcolour", "full"], ["gold", "gold"], ["white", "white"], ["black", "black"], ["green", "green"]]) {
  files[`macro-mark-${name}.svg`] = svg(512, 512, "Macro Fundamentals mark", mark(palettes[key]));
}

// Avatars (square, background baked in)
const avatar = (bg, c) =>
  svg(512, 512, "Macro Fundamentals avatar", `<rect width="512" height="512" rx="112" fill="${bg}"/>${mark(c, 97, 97, 0.62)}`);
files["macro-avatar-green.svg"] = avatar("#0a0c0b", palettes.full);
files["macro-avatar-black.svg"] = avatar("#000000", palettes.white);
files["macro-avatar-gold.svg"] = avatar("#0a0c0b", palettes.gold);
files["macro-avatar-light.svg"] = avatar("#f6f7f5", palettes.onLight);

// Lockups
const wordmark = (x, y, anchor, ink, sub, size, subSize, track) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-weight="700" font-size="${size}" letter-spacing="${track}" fill="${ink}">MACRO</text>` +
  `<text x="${x}" y="${y + size * 0.55}" text-anchor="${anchor}" font-family="${FONT}" font-weight="600" font-size="${subSize}" letter-spacing="${subSize * 0.32}" fill="${sub}">FUNDAMENTALS</text>`;

files["macro-lockup-horizontal-light.svg"] = svg(960, 240, "Macro Fundamentals",
  `<rect width="960" height="240" fill="#f6f7f5"/>${mark(palettes.onLight, 24, 16, 0.43)}${wordmark(262, 126, "start", "#0a0c0b", "#b38e2f", 84, 30, 4)}`);
files["macro-lockup-horizontal-dark.svg"] = svg(960, 240, "Macro Fundamentals",
  `<rect width="960" height="240" fill="#0a0c0b"/>${mark(palettes.full, 24, 16, 0.43)}${wordmark(262, 126, "start", "#ffffff", "#e0bc63", 84, 30, 4)}`);
files["macro-lockup-stacked.svg"] = svg(520, 560, "Macro Fundamentals",
  `<rect width="520" height="560" fill="#0a0c0b"/>${mark(palettes.full, 90, 20, 0.68)}${wordmark(260, 440, "middle", "#ffffff", "#e0bc63", 84, 30, 4)}`);

// Banner 1280x320 with a faint market grid and trend line
const gridLines = [64, 128, 192, 256].map((y) => `<line x1="0" y1="${y}" x2="1280" y2="${y}"/>`).join("");
files["macro-banner-1280x320.svg"] = svg(1280, 320, "Macro Fundamentals banner",
  `<rect width="1280" height="320" fill="#0a0c0b"/>` +
  `<g stroke="#2fbf71" stroke-opacity=".12" stroke-width="1">${gridLines}</g>` +
  `<polyline points="560,250 680,214 780,236 900,160 1020,182 1140,92 1240,60" fill="none" stroke="#e0bc63" stroke-opacity=".55" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<circle cx="1240" cy="60" r="10" fill="#f4dc93"/>` +
  `${mark(palettes.full, 40, 36, 0.5)}${wordmark(330, 168, "start", "#ffffff", "#e0bc63", 96, 32, 5)}`);

for (const [name, content] of Object.entries(files)) writeFileSync(join(outDir, name), content);
console.log(`macro logos: ${Object.keys(files).length} SVG files in assets/logos/macro-fundamentals/`);
