#!/usr/bin/env node
// Query assets/manifest.json from the command line or from scripts/agents.
// Node only, no dependencies.
//
//   node scripts/manifest.mjs                          summary
//   node scripts/manifest.mjs --list [logos|products|models|motion]
//   node scripts/manifest.mjs --product pro [--variant glass] [--format png]
//   node scripts/manifest.mjs --logo ezymap-mark-aurora [--format svg]
//   node scripts/manifest.mjs --motion [file.css]
//
// --product takes the same names as the ProductIcon component:
//   channel miniapp bot ticker calculators exchanges pro ebooks macro-bot
// --variant: default (no suffix) | animated | extrude | glass
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "assets/manifest.json"), "utf8"));

const PRODUCTS = {
  channel: "ezymap-channel-icon",
  miniapp: "ezymap-miniapp-icon",
  bot: "ezymap-bot-icon",
  ticker: "ezymap-ticker-icon",
  calculators: "ezymap-calculators-icon",
  exchanges: "ezymap-exchanges-icon",
  pro: "ezymap-pro-icon",
  ebooks: "ezymap-ebooks-icon",
  "macro-bot": "ezymap-macro-bot-icon",
};
const VARIANTS = ["default", "animated", "extrude", "glass"];

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const has = (name) => args.includes(`--${name}`);
const positional = args.filter((a, i) => !a.startsWith("--") && (i === 0 || args[i - 1] !== "--list" && args[i - 1] !== "--product" && args[i - 1] !== "--logo" && args[i - 1] !== "--variant" && args[i - 1] !== "--format" && args[i - 1] !== "--motion"));

const out = (v) => console.log(typeof v === "string" ? v : JSON.stringify(v, null, 2));
const fail = (msg) => { console.error(`manifest: ${msg}`); process.exit(1); };

function filesIn(category, match) {
  return (manifest.categories[category] ?? []).filter((f) => !match || match(f.file));
}

if (has("product")) {
  const name = opt("product");
  if (!PRODUCTS[name]) fail(`unknown product "${name}". Expected one of: ${Object.keys(PRODUCTS).join(", ")}`);
  const variant = opt("variant", "default");
  if (!VARIANTS.includes(variant)) fail(`unknown variant "${variant}". Expected: ${VARIANTS.join(", ")}`);
  const suffix = variant === "default" ? "" : `-${variant}`;
  const base = `${PRODUCTS[name]}${suffix}`;
  const format = opt("format");
  const hits = filesIn("products", (f) => f.includes(`/${base}.`));
  if (!hits.length) fail(`no asset found for ${name}/${variant}`);
  const picked = format ? hits.filter((h) => h.formats.includes(format)) : hits;
  if (!picked.length) fail(`no ${format} render for ${name}/${variant}`);
  out(picked.map((h) => ({
    product: name,
    variant,
    file: format ? h.file.replace(/\.svg$/, `.${format}`) : h.file,
    formats: h.formats,
    animated: h.animated,
  })));
} else if (has("logo")) {
  const name = opt("logo");
  const format = opt("format");
  const hits = filesIn("logos", (f) => f.includes(name));
  if (!hits.length) fail(`no logo found matching "${name}"`);
  const picked = format ? hits.filter((h) => h.formats.includes(format)) : hits;
  if (!picked.length) fail(`no ${format} format for logo "${name}"`);
  out(picked.map((h) => ({ file: format ? h.file.replace(/\.svg$/, `.${format}`) : h.file, formats: h.formats, animated: h.animated })));
} else if (has("motion")) {
  const name = opt("motion");
  const hits = filesIn("motion", (f) => !name || f.includes(name));
  if (!hits.length) fail(`no motion stylesheet matching "${name}"`);
  out(hits);
} else if (has("list")) {
  const cat = opt("list") ?? positional[0];
  if (cat && !manifest.categories[cat]) fail(`unknown category "${cat}". Expected: ${Object.keys(manifest.categories).join(", ")}`);
  out(cat ? filesIn(cat) : manifest.categories);
} else {
  out({
    name: manifest.name,
    version: manifest.version,
    totals: manifest.totals,
    categories: Object.fromEntries(Object.entries(manifest.categories).map(([k, v]) => [k, v.length])),
    usage: "--product <name> [--variant default|animated|extrude|glass] [--format svg|png] · --logo <file> · --motion [file] · --list [category]",
  });
}
