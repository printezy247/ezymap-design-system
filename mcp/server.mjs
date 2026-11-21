#!/usr/bin/env node
// @ezymap/design-system MCP server — zero dependencies, newline-delimited
// JSON-RPC over stdio (the MCP "stdio" transport). Exposes the design system
// to AI agents: tokens, components, motion utilities and the asset manifest.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const readJson = (p) => JSON.parse(read(p));

const tokens = readJson("tokens/tokens.json");
const manifest = readJson("assets/manifest.json");
const componentsDir = join(root, "components");
const componentNames = readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(componentsDir, d.name, "README.md")))
  .map((d) => d.name)
  .sort();
const motionDir = join(root, "assets/motion");
const motionFiles = readdirSync(motionDir).filter((f) => f.endsWith(".css"));

const PRODUCTS = {
  channel: "ezymap-channel-icon", miniapp: "ezymap-miniapp-icon", bot: "ezymap-bot-icon",
  ticker: "ezymap-ticker-icon", calculators: "ezymap-calculators-icon", exchanges: "ezymap-exchanges-icon",
  pro: "ezymap-pro-icon", ebooks: "ezymap-ebooks-icon", "macro-bot": "ezymap-macro-bot-icon",
};
const VARIANTS = ["default", "animated", "extrude", "glass"];

const text = (t) => ({ content: [{ type: "text", text: typeof t === "string" ? t : JSON.stringify(t, null, 2) }] });
const err = (msg) => ({ content: [{ type: "text", text: `Error: ${msg}` }], isError: true });

function tokenGroups() {
  const g = {};
  for (const t of tokens.color.tokens) (g.color ??= []).push({ name: t.name, value: t.value, usage: t.usage });
  for (const [k, v] of Object.entries({ spacing: tokens.spacing, radius: tokens.radius, shadow: tokens.shadow, gradient: tokens.gradient, motion: tokens.motion, breakpoint: tokens.breakpoint })) {
    g[k] = (v?.tokens ?? []).map((t) => ({ name: t.name, value: t.value, usage: t.usage }));
  }
  g.type = {
    families: tokens.type.families,
    fonts: tokens.type.fonts,
    styles: tokens.type.groups.flatMap((gr) => gr.styles.map((s) => ({ name: s.name, family: gr.family, ...s }))),
  };
  return g;
}

function motionClasses(file) {
  const css = readFileSync(join(motionDir, file), "utf8");
  return [...new Set([...css.matchAll(/^\s*\.?(ezm-[a-z0-9-]+)/gm)].map((m) => m[1]))].sort();
}

function resolveAssets({ kind, name, variant, format }) {
  const catKey = { logo: "logos", product: "products", motion: "motion" }[kind];
  const cat = manifest.categories[catKey];
  if (!cat) return err(`unknown kind "${kind}". Expected: logo, product, motion`);
  let hits = cat;
  if (kind === "product" || catKey === "products") {
    if (!PRODUCTS[name]) return err(`unknown product "${name}". Expected: ${Object.keys(PRODUCTS).join(", ")}`);
    const v = variant ?? "default";
    if (!VARIANTS.includes(v)) return err(`unknown variant "${v}". Expected: ${VARIANTS.join(", ")}`);
    const base = `${PRODUCTS[name]}${v === "default" ? "" : `-${v}`}`;
    hits = cat.filter((f) => f.file.includes(`/${base}.`));
  } else if (name) {
    hits = cat.filter((f) => f.file.includes(name));
  }
  if (!hits.length) return err("no matching assets");
  if (format) hits = hits.filter((h) => (h.formats ?? [h.format]).includes(format));
  if (!hits.length) return err(`no ${format} format available`);
  return hits.map((h) => ({
    file: format ? h.file.replace(/\.svg$/, `.${format}`) : h.file,
    formats: h.formats ?? [h.format],
    animated: h.animated ?? false,
  }));
}

const TOOLS = [
  {
    name: "ezymap_summary",
    description: "EzyMap design system overview: version, counts, doc pointers.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "ezymap_tokens",
    description: "List design tokens. group: color|spacing|radius|shadow|gradient|motion|breakpoint|type (omit for all).",
    inputSchema: { type: "object", properties: { group: { type: "string" } } },
  },
  {
    name: "ezymap_components",
    description: "List the 16 components, or pass name for its README + prop docs.",
    inputSchema: { type: "object", properties: { name: { type: "string" } } },
  },
  {
    name: "ezymap_motion",
    description: "List motion stylesheets, or pass file (e.g. ezymap-motion-product.css) for its class names.",
    inputSchema: { type: "object", properties: { file: { type: "string" } } },
  },
  {
    name: "ezymap_assets",
    description: "Resolve assets from the manifest. kind: logo|product|motion; name/variant/format optional.",
    inputSchema: {
      type: "object",
      properties: {
        kind: { type: "string", enum: ["logo", "product", "motion"] },
        name: { type: "string" },
        variant: { type: "string", enum: VARIANTS },
        format: { type: "string", enum: ["svg", "png", "css"] },
      },
      required: ["kind"],
    },
  },
  {
    name: "ezymap_rules",
    description: "Hard brand and accessibility rules agents must follow.",
    inputSchema: { type: "object", properties: {} },
  },
];

const RULES = `EzyMap rules:
- Brand: "EzyMap" only — never EzyAI or Macro Desk. Macro Bot is a product, not a brand.
- Palette: green leads, gold is the premium accent (~20% of a view), losses use gold never red.
- status-stop red appears only in SignalFlag "Stopped".
- Never tint the full-colour logo; never recolour it.
- One primary Button and one animated-edge GlowCard per view.
- Every animation needs prefers-reduced-motion handling; hidden states need html.js gating.
- Edit tokens/tokens.json then run build-tokens.mjs; edit scripts/build-assets.mjs then run build-assets.mjs.
- Never edit generated files: tokens.css/.ts, tailwind-preset.js, manifest.json, generated SVG/PNG.`;

function callTool(name, args = {}) {
  switch (name) {
    case "ezymap_summary":
      return text({
        name: tokens.name, version: tokens.version,
        components: componentNames.length, motionFiles: motionFiles.length,
        manifest: manifest.totals,
        docs: ["docs/index.html (showcase)", "docs/motion.html (motion playground)", "docs/llms-full.txt (full reference)"],
        install: 'npm install "github:printezy247/ezymap-design-system#v2.4.0"',
      });
    case "ezymap_tokens": {
      const g = tokenGroups();
      if (args.group) {
        if (!g[args.group]) return err(`unknown group "${args.group}". Expected: ${Object.keys(g).join(", ")}`);
        return text(g[args.group]);
      }
      return text(g);
    }
    case "ezymap_components": {
      if (!args.name) return text({ components: componentNames });
      const dir = componentNames.find((c) => c.toLowerCase() === args.name.toLowerCase());
      if (!dir) return err(`unknown component "${args.name}". Expected: ${componentNames.join(", ")}`);
      return text(`# ${dir}\n\n${read(`components/${dir}/README.md`)}`);
    }
    case "ezymap_motion": {
      if (!args.file) return text(motionFiles);
      const f = motionFiles.find((m) => m === args.file || m.includes(args.file));
      if (!f) return err(`unknown motion file "${args.file}". Expected: ${motionFiles.join(", ")}`);
      return text({ file: `assets/motion/${f}`, classes: motionClasses(f) });
    }
    case "ezymap_assets": {
      const r = resolveAssets(args);
      return Array.isArray(r) ? text(r) : r;
    }
    case "ezymap_rules":
      return text(RULES);
    default:
      return err(`unknown tool "${name}"`);
  }
}

const send = (msg) => process.stdout.write(JSON.stringify(msg) + "\n");
const reply = (id, result) => send({ jsonrpc: "2.0", id, result });
const replyErr = (id, code, message) => send({ jsonrpc: "2.0", id, error: { code, message } });

const rl = createInterface({ input: process.stdin });
rl.on("line", (line) => {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch { return; }
  const { id, method, params } = msg;
  if (method === "initialize") {
    reply(id, {
      protocolVersion: params?.protocolVersion ?? "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "ezymap-ds", version: tokens.version },
    });
  } else if (method === "notifications/initialized" || method === "initialized") {
    // no-op
  } else if (method === "ping") {
    reply(id, {});
  } else if (method === "tools/list") {
    reply(id, { tools: TOOLS });
  } else if (method === "tools/call") {
    try {
      reply(id, callTool(params?.name, params?.arguments ?? {}));
    } catch (e) {
      replyErr(id, -32603, String(e?.message ?? e));
    }
  } else if (id !== undefined) {
    replyErr(id, -32601, `method not found: ${method}`);
  }
});
