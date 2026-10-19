#!/usr/bin/env node
// Reads tokens/tokens.json (source of truth) and writes
//   tokens/tokens.css, tokens/tokens.ts, tokens/tailwind-preset.js
// Node only, no dependencies.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = JSON.parse(readFileSync(join(root, "tokens/tokens.json"), "utf8"));
const out = (file, text) => writeFileSync(join(root, "tokens", file), text);

// CSS custom-property names may not contain "." unescaped (space-1.5).
const cssName = (n) => n.replace(/\./g, "\\.");
const v = (n) => `var(--${cssName(n)})`;

// Colour value for the first theme (EzyMap ships a single dark theme).
const theme = src.color.themes[0].id;
const colorVal = (t) => (typeof t.value === "string" ? t.value : t.value[theme] ?? Object.values(t.value)[0]);

const colors = src.color.tokens.map((t) => ({ name: t.name, value: colorVal(t), usage: t.usage }));
const spacing = src.spacing.tokens;
const radius = src.radius.tokens;
const shadow = src.shadow.tokens;
const gradient = src.gradient.tokens;
const families = src.type.families;
const styles = src.type.groups.flatMap((g) => g.styles.map((s) => ({ ...s, family: g.family })));

/* ---------- tokens.css ---------- */
const decl = [];
const section = (title) => decl.push(`  /* ${title} */`);
section("Colour");
for (const t of colors) decl.push(`  --${cssName(t.name)}: ${t.value};`);
section("Spacing");
for (const t of spacing) decl.push(`  --${cssName(t.name)}: ${t.value};`);
section("Radius");
for (const t of radius) decl.push(`  --${cssName(t.name)}: ${t.value};`);
section("Shadow");
for (const t of shadow) decl.push(`  --${cssName(t.name)}: ${t.value};`);
section("Gradient");
for (const t of gradient) decl.push(`  --${cssName(t.name)}: ${t.value};`);
section("Font families");
for (const [k, val] of Object.entries(families)) decl.push(`  --font-${k}: ${val};`);

const classes = styles.map((s) => {
  const lines = [
    `font-family: var(--font-${s.family});`,
    `font-size: ${s.fontSize};`,
    `line-height: ${s.lineHeight};`,
    `font-weight: ${s.fontWeight};`,
  ];
  if (s.letterSpacing) lines.push(`letter-spacing: ${s.letterSpacing};`);
  if (s.name === "price") lines.push("font-variant-numeric: tabular-nums;");
  if (["label-caps", "eyebrow", "flag"].includes(s.name)) lines.push("text-transform: uppercase;");
  return `/* ${s.usage} */\n.${s.name} {\n  ${lines.join("\n  ")}\n}`;
});

out(
  "tokens.css",
  `/* EzyMap design tokens — generated from tokens/tokens.json by scripts/build-tokens.mjs. Do not edit. */
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");

:root {
${decl.join("\n")}
}

/* Type styles */
${classes.join("\n\n")}
`
);

/* ---------- tokens.ts ---------- */
const map = (arr, f = (t) => t.value) => Object.fromEntries(arr.map((t) => [t.name, f(t)]));
const tokens = {
  name: src.name,
  version: src.version,
  color: map(colors),
  spacing: map(spacing),
  radius: map(radius),
  shadow: map(shadow),
  gradient: map(gradient),
  fontFamily: { ...families },
  type: Object.fromEntries(
    styles.map((s) => [
      s.name,
      {
        family: s.family,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        fontWeight: s.fontWeight,
        ...(s.letterSpacing ? { letterSpacing: s.letterSpacing } : {}),
      },
    ])
  ),
};
out(
  "tokens.ts",
  `// EzyMap design tokens — generated from tokens/tokens.json by scripts/build-tokens.mjs. Do not edit.
export const tokens = ${JSON.stringify(tokens, null, 2)} as const;

export type Tokens = typeof tokens;
export type ColorToken = keyof typeof tokens.color;
export type SpacingToken = keyof typeof tokens.spacing;
export type RadiusToken = keyof typeof tokens.radius;
export type ShadowToken = keyof typeof tokens.shadow;
export type GradientToken = keyof typeof tokens.gradient;
export type TypeStyle = keyof typeof tokens.type;

export default tokens;
`
);

/* ---------- tailwind-preset.js (Tailwind v4 compatible) ---------- */
const refs = (arr) => Object.fromEntries(arr.map((t) => [t.name, v(t.name)]));
const preset = {
  theme: {
    extend: {
      colors: refs(colors),
      fontFamily: Object.fromEntries(Object.keys(families).map((k) => [k, [`var(--font-${k})`]])),
      borderRadius: refs(radius),
      boxShadow: refs(shadow),
      spacing: refs(spacing),
      backgroundImage: refs(gradient),
    },
  },
};
out(
  "tailwind-preset.js",
  `// EzyMap Tailwind preset — generated from tokens/tokens.json by scripts/build-tokens.mjs. Do not edit.
// Tailwind v4: add \`@config "./node_modules/@ezymap/design-system/tokens/tailwind-preset.js";\`
// next to \`@import "@ezymap/design-system/tokens.css";\` (or pass it as \`presets\` in a v3 config).
// Every value points at a CSS variable from tokens.css, so import tokens.css as well.
export default ${JSON.stringify(preset, null, 2)};
`
);

console.log(
  `tokens: ${colors.length} colours, ${spacing.length} spacing, ${radius.length} radii, ${shadow.length} shadows, ${gradient.length} gradients, ${styles.length} type styles`
);
