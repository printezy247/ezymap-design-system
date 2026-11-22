#!/usr/bin/env node
// Generates the EzyMap SVG asset family from the existing 3D mark geometry.
// Run: node scripts/build-assets.mjs
// Outputs: assets/logos/* variants and assets/products/* app icons.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
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

/* ---------- v2.2: hero animated logos (gold + fintech) ---------- */

// Gold variant: every green stop in the shared defs/art is remapped to the
// gold ramp, so the gem renders as a premium all-metal piece.
const goldify = (s) =>
  s
    .replaceAll("#5be39a", "#f7e3a0")
    .replaceAll("#2fbf71", "#e0bc63")
    .replaceAll("#13804d", "#b38e2f")
    .replaceAll("#14935a", "#e8c877")
    .replaceAll("#0f7a4a", "#c9a13a")
    .replaceAll("#073d25", "#6b531a")
    .replaceAll("#9af0c0", "#fff3c4");
const defsGold = goldify(defs);
const artGold = goldify(art);

// All-gold gem for premium moments (one per view).
writeFileSync(
  join(logosDir, "ezymap-mark-gold.svg"),
  svg("0 0 512 512", `${defsGold}${artGold}`, 'role="img" aria-label="EzyMap gold mark"')
);

// Hero mark: the fullest animation in the set — floating gem, counter-rotating
// orbit rings, a comet on the outer ring, a breathing halo and a sheen sweep.
const hero = svg(
  "0 0 640 640",
  `${defs}<style>
.ezm-h-float{animation:ezmHFloat 6s ease-in-out infinite;transform-box:view-box;transform-origin:center}
.ezm-h-ring{animation:ezmHSpin 16s linear infinite;transform-box:view-box;transform-origin:320px 330px}
.ezm-h-ring2{animation:ezmHSpin2 22s linear infinite;transform-box:view-box;transform-origin:320px 330px}
.ezm-h-pulse{animation:ezmHPulse 3.2s ease-out infinite;transform-box:view-box;transform-origin:320px 320px}
.ezm-h-sweep{animation:ezmHSweep 7s ease-in-out infinite}
@keyframes ezmHFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes ezmHSpin{to{transform:rotate(360deg)}}
@keyframes ezmHSpin2{to{transform:rotate(-360deg)}}
@keyframes ezmHPulse{0%{transform:scale(.82);opacity:.55}100%{transform:scale(1.18);opacity:0}}
@keyframes ezmHSweep{0%{transform:translateX(-160px)}55%,100%{transform:translateX(800px)}}
@media (prefers-reduced-motion:reduce){.ezm-h-float,.ezm-h-ring,.ezm-h-ring2,.ezm-h-pulse,.ezm-h-sweep{animation:none}}
</style>
<circle class="ezm-h-pulse" cx="320" cy="320" r="185" fill="url(#mhalo)"/>
<ellipse class="ezm-h-ring2" cx="320" cy="330" rx="252" ry="76" fill="none" stroke="#2fbf71" stroke-width="3" stroke-dasharray="4 14" opacity=".5"/>
<ellipse class="ezm-h-ring" cx="320" cy="330" rx="228" ry="62" fill="none" stroke="#e0bc63" stroke-width="6" stroke-linecap="round" stroke-dasharray="90 550" opacity=".9"/>
<circle r="10" fill="#f4dc93"><animateMotion dur="5s" repeatCount="indefinite" path="M90 330 A230 64 0 0 1 550 330 A230 64 0 0 1 90 330"/></circle>
<g transform="translate(64 64)"><g class="ezm-h-float">${art}</g></g>
<rect class="ezm-h-sweep" x="0" y="0" width="120" height="640" fill="url(#sweepg)" opacity=".5"/>`,
  'role="img" aria-label="EzyMap hero mark"'
);
// sheen gradient appended as a second defs block
const heroFixed = hero.replace(
  "</defs>",
  `<linearGradient id="sweepg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".14"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>`
);
writeFileSync(join(logosDir, "ezymap-mark-hero.svg"), heroFixed);

// Fintech mark: gem floating above a candlestick cluster with a gold trend
// line — fundamentals and momentum in one tile.
const fintechCandles = `
<line x1="120" y1="404" x2="392" y2="404" stroke="url(#medge)" stroke-width="5" stroke-linecap="round" opacity=".7"/>
<g stroke-linecap="round">
<line x1="180" y1="360" x2="180" y2="396" stroke="url(#mgl)" stroke-width="8"/>
<rect x="162" y="368" width="36" height="28" rx="6" fill="url(#mgl)"/>
<line x1="256" y1="336" x2="256" y2="396" stroke="url(#mol)" stroke-width="8"/>
<rect x="238" y="348" width="36" height="44" rx="6" fill="url(#mol)"/>
<line x1="332" y1="312" x2="332" y2="396" stroke="url(#mgl)" stroke-width="8"/>
<rect x="314" y="326" width="36" height="66" rx="6" fill="url(#mgd)"/>
</g>
<polyline points="140,392 220,372 290,344 370,318" fill="none" stroke="#0a2a18" stroke-width="14" stroke-linejoin="round" stroke-linecap="round" opacity=".3"/>
<polyline points="140,386 220,366 290,338 370,312" fill="none" stroke="url(#medge)" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="370" cy="312" r="10" fill="#f4dc93"/>`;
const fintech = svg(
  "0 0 512 512",
  `${defs}<rect width="512" height="512" rx="112" fill="#0a0c0b"/>
<rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="#2fbf71" stroke-opacity=".3"/>
<g transform="translate(96 18) scale(.62)">${art}</g>
${fintechCandles}`,
  'role="img" aria-label="EzyMap fintech mark"'
);
writeFileSync(join(logosDir, "ezymap-mark-fintech.svg"), fintech);

// Macro Trader Bot: no gem — a dark rounded tile holding a fundamental-trading
// glyph: a candlestick cluster (fundamentals) plus a rising macro line.
// Variations as per the EzyAI set: base, gold, white, black.
const macroTraderGlyph = (cfg) => `
<g stroke-linecap="round">
  <line x1="104" y1="410" x2="296" y2="296" stroke="${cfg.line}" stroke-width="4" opacity=".85"/>
  <line x1="296" y1="296" x2="336" y2="296" stroke="${cfg.line}" stroke-width="3" opacity=".6"/>
  <circle cx="296" cy="296" r="9" fill="#f4dc93"/>
  <line x1="186" y1="392" x2="186" y2="350" stroke="${cfg.c1}" stroke-width="8"/>
  <rect x="168" y1="360" width="36" height="32" rx="5" fill="${cfg.c1}"/>
  <line x1="266" y1="364" x2="266" y2="334" stroke="${cfg.c2}" stroke-width="8"/>
  <rect x="248" y1="344" width="36" height="20" rx="4" fill="${cfg.c2}"/>
  <line x1="336" y1="400" x2="336" y2="346" stroke="${cfg.c3}" stroke-width="8"/>
  <rect x1="318" y1="350" width="36" height="50" rx="5" fill="${cfg.c3}"/>
</g>`;
const macroTraderTile = (cfg) =>
  `<rect width="512" height="512" rx="112" fill="${cfg.tile}"/><rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="${cfg.stroke}" stroke-opacity=".3"/>`;
const macroTraderCfgs = {
  "ezymap-mark-macro-trader-bot": { tile: "#0a0c0b", stroke: "#2fbf71", line: "url(#medge)", c1: "url(#mol)", c2: "url(#mgl)", c3: "url(#mgd)" },
  "ezymap-mark-macro-trader-bot-gold": { tile: "#0a0c0b", stroke: "#2fbf71", line: "url(#medge)", c1: "url(#medge)", c2: "url(#medge)", c3: "url(#medge)" },
  "ezymap-mark-macro-trader-bot-white": { tile: "#FFFFFF", stroke: "#1d1d1f", line: "#1d1d1f", c1: "#1d1d1f", c2: "#1d1d1f", c3: "#1d1d1f" },
  "ezymap-mark-macro-trader-bot-black": { tile: "#050807", stroke: "#2fbf71", line: "url(#medge)", c1: "url(#medge)", c2: "url(#medge)", c3: "url(#medge)" },
};
for (const [name, cfg] of Object.entries(macroTraderCfgs)) {
  const label = name.replace(/^ezymap-mark-macro-trader-bot-?(.*)$/, (_, v) => `Macro Trader Bot${v ? " " + v[0].toUpperCase() + v.slice(1) : ""}`);
  writeFileSync(
    join(logosDir, `${name}.svg`),
    svg(
      "0 0 512 512",
      `${defs}${macroTraderTile(cfg)}${macroTraderGlyph(cfg)}`,
      `role="img" aria-label="EzyMap ${label}"`
    )
  );
}

// Animated app icon: gem floats inside the dark tile while a gold comet
// travels a small orbit — the app-icon sibling of ezymap-mark-animated.
const appiconAnim = svg(
  "0 0 512 512",
  `${defs}<rect width="512" height="512" rx="112" fill="url(#mground)"/>
<g stroke="#2fbf71" stroke-opacity=".14" stroke-width="1">
${Array.from({ length: 8 }, (_, i) => `<line x1="${64 + i * 64}" y1="0" x2="${64 + i * 64}" y2="512"/>`).join("")}
${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${64 + i * 64}" x2="512" y2="${64 + i * 64}"/>`).join("")}
</g>
<rect x="8" y="8" width="496" height="496" rx="104" fill="none" stroke="#2fbf71" stroke-opacity=".35" stroke-width="2"/>
<style>
.ezm-ai-float{animation:ezmAiFloat 6s ease-in-out infinite;transform-box:view-box;transform-origin:center}
@keyframes ezmAiFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@media (prefers-reduced-motion:reduce){.ezm-ai-float{animation:none}}
</style>
<ellipse cx="256" cy="270" rx="160" ry="46" fill="none" stroke="#e0bc63" stroke-width="5" stroke-linecap="round" stroke-dasharray="60 440" opacity=".85"/>
<g class="ezm-ai-float"><g transform="translate(76 66) scale(.705)">${art}</g></g>
<circle r="8" fill="#f4dc93"><animateMotion dur="3.6s" repeatCount="indefinite" path="M96 270 A160 46 0 0 1 416 270 A160 46 0 0 1 96 270"/></circle>`,
  'role="img" aria-label="EzyMap animated app icon"'
);
writeFileSync(join(logosDir, "ezymap-appicon-animated.svg"), appiconAnim);

// Animated horizontal lockup: floating gem + wordmark with a travelling gold
// sheen and a gold rule that marches.
const hdefs = `${defs}<linearGradient id="wmx" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#f2f4f2"><animate attributeName="stop-color" values="#f2f4f2;#5be39a;#f2f4f2" dur="7s" repeatCount="indefinite"/></stop>
<stop offset="1" stop-color="#e3bd5e"><animate attributeName="stop-color" values="#e3bd5e;#f4dc93;#e3bd5e" dur="7s" repeatCount="indefinite"/></stop>
</linearGradient>
<style>
.ezm-hz-float{animation:ezmHzFloat 6s ease-in-out infinite;transform-box:view-box;transform-origin:110px 110px}
.ezm-hz-march{animation:ezmHzMarch 1.6s linear infinite}
@keyframes ezmHzFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes ezmHzMarch{to{stroke-dashoffset:-28}}
@media (prefers-reduced-motion:reduce){.ezm-hz-float,.ezm-hz-march{animation:none}}
</style>`;
const horizontalAnim = svg(
  "0 0 760 220",
  `${hdefs}
<g class="ezm-hz-float"><g transform="translate(14 18) scale(.36)">${art}</g></g>
<text x="238" y="102" font-family="'Clash Display','Space Grotesk',Inter,Helvetica Neue,Arial,sans-serif" font-size="64" font-weight="700" letter-spacing="-1.5" fill="url(#wmx)">Ezy<tspan fill="#e3bd5e">Map</tspan></text>
<text x="242" y="134" font-family="ui-monospace,'JetBrains Mono','IBM Plex Mono',Menlo,monospace" font-size="14" font-weight="500" letter-spacing="3.5" fill="#a8b0ab">ALGO · SIGNAL DESK</text>
<line class="ezm-hz-march" x1="242" y1="152" x2="470" y2="152" stroke="url(#medge)" stroke-width="4" stroke-linecap="round" stroke-dasharray="16 12" opacity=".9"/>
<circle cx="486" cy="152" r="6" fill="#f4dc93"/>`,
  'role="img" aria-label="EzyMap animated lockup"'
);
writeFileSync(join(logosDir, "ezymap-horizontal-animated.svg"), horizontalAnim);

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
  // Trading research (2026-11): stacked coins with a gold trend arrow.
  "ezymap-crypto-icon": T(`<g ${stroke}>
<circle cx="32" cy="21" r="10" fill="none"/>
<circle cx="32" cy="30.5" r="7" fill="none" opacity=".7"/>
<path d="M27 22.5l8 8 6-8" fill="none" stroke="@A@" stroke-width="2.4"/>
</g>`),
  // Forex: two currency bills crossing with a trend arrow.
  "ezymap-forex-icon": T(`<g ${stroke}>
<rect x="20" y="16" width="16" height="16" rx="3" fill="none"/>
<rect x="30" y="26" width="14" height="14" rx="3" fill="none" opacity=".8"/>
<path d="M18 44l8-7 8 7" fill="none" stroke="@A@" stroke-width="2.4"/>
</g>`),
};

for (const [name, svgText] of Object.entries(products)) {
  writeFileSync(join(productsDir, `${name}.svg`), svgText);
}

/* ---------- v2.3: extra logo variants ---------- */

// Aurora: cool teal/cyan ramp for data-viz and dashboard surfaces.
const aurorify = (s) =>
  s
    .replaceAll("#5be39a", "#7df0e4")
    .replaceAll("#2fbf71", "#2dd4bf")
    .replaceAll("#13804d", "#0d9488")
    .replaceAll("#14935a", "#2dd4bf")
    .replaceAll("#0f7a4a", "#14b8a6")
    .replaceAll("#073d25", "#115e59")
    .replaceAll("#9af0c0", "#c8fff8");
writeFileSync(
  join(logosDir, "ezymap-mark-aurora.svg"),
  svg("0 0 512 512", `${aurorify(defs)}${aurorify(art)}`, 'role="img" aria-label="EzyMap aurora mark"')
);

// Glass app icon: frosted tile for glassmorphism heroes and the Mini App.
writeFileSync(
  join(logosDir, "ezymap-appicon-glass.svg"),
  svg(
    "0 0 512 512",
    `${defs}<rect width="512" height="512" rx="112" fill="#101413"/>
<rect x="10" y="10" width="492" height="492" rx="104" fill="#ffffff" opacity=".05"/>
<rect x="10" y="10" width="492" height="246" rx="104" fill="#ffffff" opacity=".07"/>
<rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="#ffffff" stroke-opacity=".22"/>
<line x1="60" y1="70" x2="452" y2="70" stroke="#ffffff" stroke-opacity=".28" stroke-width="3" stroke-linecap="round"/>
<g transform="translate(51.2 46) scale(.8)">${art}</g>`,
    'role="img" aria-label="EzyMap glass app icon"'
  )
);

// Neon app icon: black tile, phosphor gem, green halo — stream overlays.
writeFileSync(
  join(logosDir, "ezymap-appicon-neon.svg"),
  svg(
    "0 0 512 512",
    `${defs}<rect width="512" height="512" rx="112" fill="#050807"/>
<circle cx="256" cy="270" r="180" fill="url(#mhalo)"/>
<rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="#2fbf71" stroke-opacity=".45"/>
<g transform="translate(51.2 46) scale(.8)" style="filter:drop-shadow(0 0 20px rgba(47,191,113,.55)) drop-shadow(0 0 5px rgba(190,255,220,.5))">${art}</g>`,
    'role="img" aria-label="EzyMap neon app icon"'
  )
);

/* ---------- v2.3: product variants (animated / extrude / glass) + PNGs ---------- */

// Every base product icon (ezymap-*-icon.svg, including the hand-made Macro
// Bot tile) gets three variants: a floating animated tile, an extruded 3D
// tile and a frosted glass tile. PNG renders at 256px ship alongside when
// ImageMagick is available; the script still succeeds without it.
const productFiles = readdirSync(productsDir)
  .filter((f) => /^ezymap-.+-icon\.svg$/.test(f))
  .sort();

const splitIcon = (src) => {
  const d = src.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? "";
  const body = src.split(/<\/defs>/)[1]?.replace(/<\/?svg[^>]*>/g, "").trim() ?? "";
  const tileMatch = body.match(/<rect[^>]*\/>/);
  const tile = tileMatch ? tileMatch[0] : "";
  const rest = tile ? body.slice(tileMatch.index + tile.length) : body;
  return { d, tile, rest };
};

const productTitle = (file) =>
  file
    .replace(/^ezymap-|-icon\.svg$/g, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const variantSvg = (viewBox, inner, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${viewBox.split(" ")[2]}" height="${viewBox.split(" ")[3]}" role="img"><title>${label}</title>${inner}</svg>\n`;

const png = (svgPath, pngPath) => {
  try {
    execFileSync("convert", ["-background", "none", "-density", "288", "-resize", "256x256", svgPath, pngPath]);
    return true;
  } catch {
    return false;
  }
};

let pngCount = 0;
const renderPng = (name) => {
  const svgPath = join(productsDir, `${name}.svg`);
  if (existsSync(svgPath) && png(svgPath, join(productsDir, `${name}.png`))) pngCount++;
};

for (const file of productFiles) {
  const base = file.replace(/\.svg$/, "");
  const { d, tile, rest } = splitIcon(readFileSync(join(productsDir, file), "utf8"));
  const label = `EzyMap ${productTitle(file)}`;

  // Animated: glyph floats, a dashed gold ring rotates around the tile.
  // Hand-tuned animations (Macro Bot) are kept: only write when absent.
  const animatedPath = join(productsDir, `${base}-animated.svg`);
  if (!existsSync(animatedPath))
  writeFileSync(
    animatedPath,
    variantSvg(
      "0 0 64 64",
      `${d}<style>
.ezm-pf-float{animation:ezmPfFloat 5s ease-in-out infinite;transform-box:view-box;transform-origin:center}
.ezm-pf-ring{animation:ezmPfSpin 9s linear infinite;transform-box:view-box;transform-origin:32px 32px}
@keyframes ezmPfFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}
@keyframes ezmPfSpin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.ezm-pf-float,.ezm-pf-ring{animation:none}}
</style>${tile}
<g class="ezm-pf-float">${rest}</g>
<g class="ezm-pf-ring"><rect x="4" y="4" width="56" height="56" rx="14" fill="none" stroke="#e0bc63" stroke-width="1.4" stroke-dasharray="7 9" opacity=".65"/></g>`,
      `${label} animated`
    )
  );

  // Extruded 3D: two dark offset copies behind the tile for real depth.
  writeFileSync(
    join(productsDir, `${base}-extrude.svg`),
    variantSvg(
      "0 0 64 64",
      `${d}<g transform="translate(2 2.5)" opacity=".5" style="filter:brightness(.14)">${tile}${rest}</g>
<g transform="translate(1 1.25)" opacity=".75" style="filter:brightness(.32)">${tile}${rest}</g>
${tile}${rest}`,
      `${label} extruded 3D`
    )
  );

  // Glass: frosted translucent tile for glassmorphism surfaces.
  const glassBody = `${tile}${rest}`.replace('fill="url(#pg)"', 'fill="#141817" opacity=".55"');
  writeFileSync(
    join(productsDir, `${base}-glass.svg`),
    variantSvg(
      "0 0 64 64",
      `${d}<rect width="64" height="64" rx="16" fill="#101413"/>
<rect x="2" y="2" width="60" height="28" rx="13" fill="#ffffff" opacity=".09"/>
${glassBody}
<rect x="2" y="2" width="60" height="60" rx="14" fill="none" stroke="#ffffff" stroke-opacity=".25"/>`,
      `${label} glass`
    )
  );

  for (const suffix of ["", "-animated", "-extrude", "-glass"]) renderPng(`${base}${suffix}`);
}

/* ---------- v2.3: asset manifest ---------- */

// Catalog every shipped asset so consumers can discover variants without
// scraping the directories. Motion utilities are CSS, listed by class name.
const motionDir = join(root, "assets/motion");
const listSvgs = (dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(".svg"))
    .sort()
    .map((f) => ({
      file: `assets/${dir === logosDir ? "logos" : "products"}/${f}`,
      formats: existsSync(join(dir, f.replace(/\.svg$/, ".png"))) ? ["svg", "png"] : ["svg"],
      animated: /animated|hero|orbit|aurora/.test(f),
    }));
const manifest = {
  name: "EzyMap",
  version: "2.6.1",
  generatedBy: "scripts/build-assets.mjs",
  categories: {
    logos: listSvgs(logosDir),
    products: listSvgs(productsDir),
    motion: readdirSync(motionDir)
      .filter((f) => f.endsWith(".css"))
      .sort()
      .map((f) => ({ file: `assets/motion/${f}`, format: "css" })),
  },
  totals: { logoFiles: listSvgs(logosDir).length, productFiles: listSvgs(productsDir).length, pngRenders: pngCount },
};
writeFileSync(join(root, "assets/manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log(
  `assets: ${Object.keys(products).length} product icons, ${productFiles.length} products x 3 variants, ` +
    `${pngCount} PNG renders, manifest.json (${manifest.totals.logoFiles} logos / ${manifest.totals.productFiles} product files)`
);
