#!/usr/bin/env node
// Generates the EzyMap SVG asset family from the existing 3D mark geometry.
// Run: node scripts/build-assets.mjs
// Outputs: assets/logos/* variants and assets/products/* app icons.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logosDir = join(root, "assets/logos");
const productsDir = join(root, "assets/products");
mkdirSync(productsDir, { recursive: true });

const markSrc = readFileSync(join(logosDir, "ezymap-3d-mark.svg"), "utf8");
const defs = markSrc.match(/<defs>[\s\S]*?<\/defs>/)[0];
const art = markSrc.split("</defs>")[1].replace(/<\/svg>\s*$/, "");

const svg = (viewBox, inner, extraAttrs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${viewBox.split(" ")[2]}" height="${viewBox.split(" ")[3]}" ${extraAttrs}><title>EzyMap</title>${inner}</svg>\n`;

/* ---------- logo variants ---------- */

// Animated mark: gentle float + a gold comet travelling the orbit ring.
// CSS lives inside the SVG so the file animates anywhere it is embedded.
// SMIL animateMotion is used for the comet; both stop under reduced motion.
const animated = svg(
  "0 0 512 512",
  `${defs}<style>
.ezm-float{animation:ezmFloat 6s ease-in-out infinite;transform-box:view-box;transform-origin:center}
.ezm-orbit-dash{animation:ezmOrbitDash 3.2s linear infinite}
@keyframes ezmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes ezmOrbitDash{to{stroke-dashoffset:-640}}
@media (prefers-reduced-motion:reduce){.ezm-float,.ezm-orbit-dash{animation:none}}
</style><g class="ezm-float">${art}</g>
<ellipse cx="256" cy="262" rx="206" ry="58" fill="none" stroke="#e0bc63" stroke-width="7" stroke-linecap="round" stroke-dasharray="90 550" class="ezm-orbit-dash" opacity=".9"/>`,
  'role="img" aria-label="EzyMap"'
);
writeFileSync(join(logosDir, "ezymap-mark-animated.svg"), animated);

// App icon on a light tile, for light-mode UIs and print.
const appiconLight = svg(
  "0 0 512 512",
  `${defs}<rect width="512" height="512" rx="112" fill="#f4f6f4"/>
<g stroke="#c9a13a" stroke-opacity=".35" stroke-width="1">
${Array.from({ length: 15 }, (_, i) => `<line x1="${32 + i * 32}" y1="0" x2="${32 + i * 32}" y2="512"/>`).join("")}
${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${32 + i * 32}" x2="512" y2="${32 + i * 32}"/>`).join("")}
</g>
<rect x="8" y="8" width="496" height="496" rx="104" fill="none" stroke="#c9a13a" stroke-opacity=".4" stroke-width="2"/>
<g transform="translate(51.2 46) scale(.8)">${art}</g>`,
  'role="img" aria-label="EzyMap app icon"'
);
writeFileSync(join(logosDir, "ezymap-appicon-light.svg"), appiconLight);

// Single-colour line variant: isometric outline only, inherits currentColor.
const lineArt = art
  .replace(/fill="url\([^)]*\)"/g, 'fill="none"')
  .replace(/fill="#[0-9a-fA-F]{3,8}"/g, 'fill="currentColor"')
  .replace(/stroke="url\([^)]*\)"/g, 'stroke="currentColor"')
  .replace(/stroke="#[0-9a-fA-F]{3,8}"/g, 'stroke="currentColor"');
const lineMark = svg(
  "0 0 512 512",
  `<g fill="none" stroke="currentColor" stroke-width="12" stroke-linejoin="round" stroke-linecap="round">${lineArt}</g>`,
  'role="img" aria-label="EzyMap line mark"'
);
writeFileSync(join(logosDir, "ezymap-mark-line.svg"), lineMark);

// Stacked lockup on light grounds: same artwork, ink wordmark instead of white.
const stackedSrc = readFileSync(join(logosDir, "ezymap-3d-stacked-on-dark.svg"), "utf8");
const stackedDefs = stackedSrc.match(/<defs>[\s\S]*?<\/defs>/)[0];
const stackedArt = stackedSrc.split("</defs>")[1].replace(/<\/svg>\s*$/, "");
const stackedLight = stackedArt
  .replaceAll('fill="#f2f4f2"', 'fill="#132019"')
  .replaceAll('fill="#7d8681"', 'fill="#5b6a64"');
writeFileSync(
  join(logosDir, "ezymap-stacked-on-light.svg"),
  svg("0 0 800 800", `${stackedDefs}${stackedLight}`, 'role="img" aria-label="EzyMap stacked lockup"')
);

// Extruded 3D: two dark offset copies behind the mark give real depth on a tile.
const extrude = svg(
  "0 0 512 512",
  `${defs}<rect width="512" height="512" rx="112" fill="#0a0c0b"/>
<rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="#2fbf71" stroke-opacity=".3"/>
<g transform="translate(18 22)" opacity=".5" style="filter:brightness(.12)">${art}</g>
<g transform="translate(9 11)" opacity=".7" style="filter:brightness(.3)">${art}</g>
<g transform="translate(51.2 46) scale(.8)">${art}</g>`,
  'role="img" aria-label="EzyMap extruded 3D mark"'
);
writeFileSync(join(logosDir, "ezymap-mark-extrude.svg"), extrude);

// Frosted glass tile: translucent white gradients over the dark ground, for
// glassmorphism surfaces where the mark sits on a panel, not a solid tile.
const glass = svg(
  "0 0 512 512",
  `${defs}<rect width="512" height="512" rx="112" fill="#101413"/>
<rect x="10" y="10" width="492" height="492" rx="104" fill="#ffffff" opacity=".05"/>
<rect x="10" y="10" width="492" height="246" rx="104" fill="#ffffff" opacity=".07"/>
<rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="#ffffff" stroke-opacity=".22"/>
<line x1="60" y1="70" x2="452" y2="70" stroke="#ffffff" stroke-opacity=".28" stroke-width="3" stroke-linecap="round"/>
<g transform="translate(51.2 46) scale(.8)">${art}</g>`,
  'role="img" aria-label="EzyMap glass mark"'
);
writeFileSync(join(logosDir, "ezymap-mark-glass.svg"), glass);

// Neon: black tile, green halo, mark with a phosphor drop-shadow.
const neon = svg(
  "0 0 512 512",
  `${defs}<rect width="512" height="512" rx="112" fill="#050807"/>
<circle cx="256" cy="262" r="180" fill="url(#mhalo)"/>
<rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="#2fbf71" stroke-opacity=".45"/>
<g transform="translate(51.2 46) scale(.8)" style="filter:drop-shadow(0 0 20px rgba(47,191,113,.55)) drop-shadow(0 0 5px rgba(190,255,220,.5))">${art}</g>`,
  'role="img" aria-label="EzyMap neon mark"'
);
writeFileSync(join(logosDir, "ezymap-mark-neon.svg"), neon);

// Ghost watermark: faint line mark for backgrounds and document watermarks.
const ghost = svg(
  "0 0 512 512",
  `<g fill="none" stroke="#2fbf71" stroke-width="10" stroke-linejoin="round" stroke-linecap="round" opacity=".12">${lineArt}</g>`,
  'role="img" aria-label="EzyMap ghost watermark"'
);
writeFileSync(join(logosDir, "ezymap-mark-ghost.svg"), ghost);

// Orbit variant: gem floats while a dashed gold ring rotates around it.
const orbit = svg(
  "0 0 512 512",
  `${defs}<style>
.ezm-oo-float{animation:ezmOoFloat 6s ease-in-out infinite;transform-box:view-box;transform-origin:center}
.ezm-oo-ring{animation:ezmOoSpin 14s linear infinite;transform-box:view-box;transform-origin:center}
@keyframes ezmOoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes ezmOoSpin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.ezm-oo-float,.ezm-oo-ring{animation:none}}
</style><ellipse class="ezm-oo-ring" cx="256" cy="262" rx="212" ry="60" fill="none" stroke="#e0bc63" stroke-width="4" stroke-dasharray="60 480" opacity=".8"/>
<g class="ezm-oo-float">${art}</g>`,
  'role="img" aria-label="EzyMap orbit mark"'
);
writeFileSync(join(logosDir, "ezymap-mark-animated-orbit.svg"), orbit);

/* ---------- product icons ---------- */
// One rounded tile per ready EzyMap product: dark ground, green glyph,
// one gold accent. viewBox 64, stroke-based so it stays crisp at any size.
const T = (glyph, accent = "#e0bc63") => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img">
<title>EzyMap</title>
<defs>
<linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#171a19"/><stop offset="1" stop-color="#0c0f0e"/></linearGradient>
<linearGradient id="pe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5be39a"/><stop offset="1" stop-color="#2fbf71"/></linearGradient>
</defs>
<rect width="64" height="64" rx="16" fill="url(#pg)" stroke="#2fbf71" stroke-opacity=".35"/>
${glyph.replaceAll("@A@", accent)}
</svg>
`;

const stroke = 'fill="none" stroke="url(#pe)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';

const products = {
  "ezymap-channel-icon": T(`<g ${stroke}>
<path d="M15 27v10l7 2V25l-7 2z"/>
<path d="M22 26l19-8v28l-19-8"/>
<path d="M41 31a5.5 5.5 0 0 0 0 9" stroke="@A@"/>
<path d="M17 44c3 2 7 3 11 3" opacity=".45"/>
</g>`),
  "ezymap-miniapp-icon": T(`<g ${stroke}>
<rect x="24" y="11" width="16" height="42" rx="3.5"/>
<line x1="29" y1="17" x2="35" y2="17"/>
<circle cx="32" cy="45" r="1.6" fill="url(#pe)" stroke="none"/>
<circle cx="15" cy="20" r="1.8" fill="@A@" stroke="none"/>
<circle cx="49" cy="20" r="1.8" fill="@A@" stroke="none"/>
</g>`),
  "ezymap-bot-icon": T(`<g ${stroke}>
<line x1="32" y1="13" x2="32" y2="20"/>
<circle cx="32" cy="11" r="2.4" fill="@A@" stroke="none"/>
<rect x="17" y="20" width="30" height="24" rx="7"/>
<rect x="24" y="15" width="16" height="7" rx="3.5"/>
<circle cx="26.5" cy="32" r="2.6" fill="@A@" stroke="none"/>
<circle cx="37.5" cy="32" r="2.6" fill="@A@" stroke="none"/>
<line x1="32" y1="37" x2="32" y2="40"/>
<line x1="27" y1="42" x2="37" y2="42"/>
</g>`),
  "ezymap-ticker-icon": T(`<g ${stroke}>
<path d="M11 35h7l4-11 6 20 5-14 4 5h10"/>
<line x1="11" y1="46" x2="53" y2="46" stroke="@A@" stroke-dasharray="3 4"/>
<circle cx="49" cy="24" r="3" fill="@A@" stroke="none"/>
</g>`),
  "ezymap-calculators-icon": T(`<g ${stroke}>
<rect x="21" y="9" width="22" height="46" rx="4"/>
<rect x="26" y="15" width="12" height="7" rx="1.5" fill="@A@" stroke="none" opacity=".9"/>
<circle cx="27" cy="28" r="1.5" fill="url(#pe)" stroke="none"/>
<circle cx="33" cy="28" r="1.5" fill="url(#pe)" stroke="none"/>
<circle cx="39" cy="28" r="1.5" fill="url(#pe)" stroke="none"/>
<circle cx="27" cy="36" r="1.5" fill="url(#pe)" stroke="none"/>
<circle cx="33" cy="36" r="1.5" fill="url(#pe)" stroke="none"/>
<circle cx="39" cy="36" r="1.5" fill="@A@" stroke="none"/>
<rect x="27" y="43" width="10" height="4" rx="1" fill="url(#pe)" stroke="none"/>
</g>`),
  "ezymap-exchanges-icon": T(`<g ${stroke}>
<path d="M15 25h30"/>
<path d="M37 18l8 7-8 7"/>
<path d="M49 39H19"/>
<path d="M27 32l-8 7 8 7" stroke="@A@"/>
<circle cx="32" cy="32" r="2" fill="url(#pe)" stroke="none"/>
</g>`),
  "ezymap-pro-icon": T(`<g ${stroke}>
<line x1="20" y1="12" x2="20" y2="50"/>
<rect x="16.5" y="22" width="7" height="16" rx="1.5"/>
<line x1="33" y1="18" x2="33" y2="46"/>
<rect x="29.5" y="26" width="7" height="12" rx="1.5" fill="@A@" stroke="none" opacity=".85"/>
<line x1="46" y1="15" x2="46" y2="44"/>
<rect x="42.5" y="24" width="7" height="12" rx="1.5"/>
<path d="M13 54h38" stroke="@A@" stroke-dasharray="3 4"/>
</g>`),
  "ezymap-ebooks-icon": T(`<g ${stroke}>
<path d="M14 17c6-3.2 12-3.2 18 0 6-3.2 12-3.2 18 0v31c-6-3.2-12-3.2-18 0-6-3.2-12-3.2-18 0z"/>
<line x1="32" y1="17" x2="32" y2="48"/>
<path d="M18 24c4-1.6 8-1.6 12 0" opacity=".5"/>
<path d="M34 24c4-1.6 8-1.6 12 0" opacity=".5"/>
<path d="M18 33c4-1.6 8-1.6 12 0" opacity=".5"/>
<path d="M34 33c4-1.6 8-1.6 12 0" opacity=".5"/>
</g>`),
};

for (const [name, svgText] of Object.entries(products)) {
  writeFileSync(join(productsDir, `${name}.svg`), svgText);
}

console.log(`assets: ${Object.keys(products).length} product icons (+ logo variants in assets/logos/)`);
