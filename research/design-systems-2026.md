# Design systems research — findings and recommendations for EzyMap

Research date: 2026-07. Scope: 28 design systems/libraries, surveyed for ideas EzyMap can adopt. EzyMap stays the only brand; this document informs future releases (next candidate: v2.4.0).

---

## 1. The landscape in three buckets

**A. "Copy the source, own it" component registries** — the dominant 2025–26 pattern. Code lands in your repo as files you own; no runtime dependency, no lock-in.

- **shadcn/ui** — the model everyone else copies. Radix/Base UI primitives + Tailwind + CSS variables. "Composable, accessible components with thoughtful defaults." The registry format (`components.json`, `npx shadcn add`) is now an industry standard.
- **21st.dev** — community registry of 12,000+ React/Tailwind components from many authors, shadcn registry format, live previews, MCP + `.md` twins + `llms.txt` for agents.
- **Kokonut UI** — shadcn registry focused on AI-app components (tool calls, autocomplete, context meter) plus playful inputs/buttons. Pro tier is one-time $119.
- **Cult UI** — 154 animated components for shadcn/ui, MIT. Notable new direction: full-stack "AI agent" blocks (UI + API route + tools as owned source).
- **SmoothUI** — 228 animated primitives/blocks/templates for shadcn/ui. Ships an MCP server, public search API, `llms.txt`, and "UI Craft" — an anti-slop detection + scored quality gate + convergence loop for AI-generated UI.
- **Animate UI** — drop-in *animated* primitives for Radix/Base UI/React Aria: "swap the import, keep your components, your styles and your API." Ships an agent skill (`npx skills add`).
- **coss ui** — Cal.com's component set (Base UI + Tailwind), ~64 primitives incl. newer Composer (chat input), Drawer, Kbd. Sibling site **Origin UI** is the older copy-paste catalog (500+ components).
- **Motion Primitives** — Ibelick's motion-focused kit: text effects, animated numbers, marquees; free core + Pro.
- **Aceternity UI** — 200+ components/blocks/pages/interactions for React + Tailwind + Motion; MCP install for agents; heavy landing-page focus.
- **Magic UI** — 150+ free animated components "perfect companion for shadcn/ui"; Pro templates. Known for text effects, bento grids, marquees, shimmer/border-beam effects.
- **React Bits** — animated components *and backgrounds* (text animations, micro-interactions, backgrounds) as owned source; JS or TS, plain CSS or Tailwind.
- **Hover.dev** — playful animated components (wet-paint buttons, carousels, 3D sections); copy-paste, some free / paid.

**B. Full design systems (tokens + components + guidance)** — the classic enterprise pattern.

- **shadcn/ui** (also here) — theming via CSS variables, `components.json`, now "shadcn/create" scaffolding.
- **Radix Themes** — Themes 3.0; opinionated, zero-config (`import "@radix-ui/themes/styles.css"`), radius/color scale props.
- **Mantine** — 120+ components + 70 hooks, CSS-first styling, Styles API, dark mode built in. Standout: LLM-optimized docs (`llms.txt`, `llms-full.txt`), agent skills, and an official MCP server regenerated every release.
- **Ant Design** — enterprise-scale; v6 pivot to CSS variables + semantic tokens + `theme-editor`; explicitly markets "AI friendly" theming.
- **HeroUI** — React *and* React Native from one theme; free OSS + Pro (Glass/Brutalist/Mouve premium themes, templates, Figma sync, "Pro Skills & MCPs").
- **Atlassian Design System** — token taxonomy (`color.text.accent.red` style), dedicated Rovo UI for AI experiences, public motion-system thinking ("motion creates meaning in the space between actions").
- **GitHub Primer** — three surfaces: Product UI (components), Brand UI (marketing), Octicons + primitives (tokens). Clean separation of product vs brand.
- **IBM Carbon** — deepest system: foundations → components → patterns → data-viz. New: **Carbon MCP** with token-conservation guidance, Carbon for AI patterns, v12 in progress.
- **Adobe Spectrum 2** — unified cross-platform system (React/Web Components now, iOS/Android coming); every component page has a live playground wired to real repo data.
- **Material 3 (Expressive)** — latest evolution: expressive shapes, spring-based motion, dynamic color; motion is a first-class foundation, not an afterthought.
- **Apple HIG** — platform guidance: springs for interruption-friendly animation, `prefers-reduced-motion` respected, haptics/audio/visual motion triad, clarity/deference/depth principles.
- **Vercel Geist** — minimal, high-contrast; foundations (colors/type/materials/grid) + `@vercel/geistcn` components + assets packages; every docs page ships a `.md` twin for agents.
- **Microsoft Fluent 2** — cross-platform (web/iOS/Android/Windows); motion guidance is deliberately restrained ("motion informs, doesn't decorate"), strong a11y tooling (focus order, contrast checker plugins).

**C. Motion/3D runtimes and tools** — assets and runtime, not component kits.

- **Motion (motion.dev, ex-Framer Motion)** — the animation engine behind half the registries above. Layout animations, gestures, scroll-linked (`ScrollTimeline`), springs with velocity, `AnimatePresence`, 3.2kb mini build, Three.js support, "Motion+" example vault, AI Kit + Performance Doctor skill.
- **Spline** — browser 3D design tool; now agent-first: Spline MCP lets Claude/Cursor/etc. build editable 3D scenes that ship to web (WebGPU/WebGL), iOS, Android. Relevant to EzyMap's 3D asset ambitions.
- **Rive** — interactive vector animation runtime (.riv) with state machines + data binding; new Rive CLI lets coding agents build .riv files; runs everywhere incl. consoles. Lottie alternative with logic.

---

## 2. Cross-cutting findings

1. **"Owned source" won.** Nearly every modern library ships code into your repo via the shadcn registry format or CLI. EzyMap's current model (React components + vanilla `bundle.js` + token-generated CSS/TS/Tailwind) is already aligned — the gap is *distribution format*, not architecture.

2. **AI-agent ergonomics is now table stakes.** Mantine, SmoothUI, 21st, Geist, Carbon, Aceternity, Rive, Spline all ship `llms.txt`, `.md` doc twins, MCP servers, or agent skills. A design system an agent can't read is invisible to the people building with agents.

3. **Motion is a foundation, not decoration.** Material 3 Expressive, Motion, Animate UI, and the entire registry bucket treat motion tokens (durations, easings, springs) as first-class tokens — exactly what EzyMap started with `duration-xl`/`ease-spring` in v2.3.0. Spring physics (stiffness/damping/mass) is the new standard easing vocabulary.

4. **Anti-slop is a selling point.** SmoothUI's "UI Craft" (slop detection + quality gate), Hallmark, and 21st's "not the bland AI average" positioning all respond to the same problem: AI-generated UI converges to the same gradients/glass/cards. EzyMap already runs Hallmark sloplint — that's a differentiator worth documenting.

5. **Product vs brand separation is standard.** Primer splits Product UI / Brand UI / Octicons; EzyMap already does this (brand marks vs product glyphs). Good validation.

6. **Live playgrounds wired to source** (Spectrum, Radix Themes playground, Kokonut's all-live demos) beat static screenshots for docs.

7. **3D is going agent-native.** Spline MCP and Rive CLI mean 3D/interactive assets can be generated and iterated by agents directly — relevant for future EzyMap product visuals beyond static SVG/PNG.

8. **Accessibility is assumed, then exceeded.** Every serious system now documents reduced-motion, focus order, contrast tooling. EzyMap's `html.js` gating + reduced-motion fallbacks match the bar; the gap is *demonstrating* it (a dedicated a11y section in docs).

---

## 3. Recommendations for EzyMap (prioritized)

### P0 — cheap, high leverage (suggest for v2.4.0)

1. **Add `llms.txt` + `.md` twins for docs.** Serve `docs/llms.txt` (index of tokens, components, assets, manifest) and make key docs pages available as markdown. Cost: small; benefit: every AI tool that touches EzyMap projects reads the system correctly. Mirrors Geist, Mantine, 21st.

2. **Publish `assets/manifest.json` consumption docs + a `manifest` snippet API.** Agents and scripts currently have to know the schema; document it and add a tiny `scripts/` helper (`node scripts/manifest.mjs --product pro --variant glass`) that prints resolved paths. Mirrors the "public API, no auth" pattern from SmoothUI/21st.

3. **Motion token expansion.** Add spring tokens alongside easings — e.g. `ease-spring` exists; consider `spring-snappy`/`spring-gentle` expressed as cubic-bezier approximations so CSS/vanilla consumers don't need a JS spring lib, plus `duration-fast/base/slow/xl` already present. Reference: Motion's stiffness/damping vocabulary, Material 3 Expressive springs.

4. **A11y section in `docs/index.html`.** One section demonstrating: reduced-motion behavior, `html.js` no-script visibility, focus-visible rings, alt-text conventions for `ProductIcon`. Every benchmark system documents this; it's also our anti-slop story (Hallmark + a11y = "designed, not generated").

### P1 — medium effort, next release

5. **Registry-style install story.** EzyMap isn't shadcn-compatible (it has its own token pipeline), but we can ship a `components.json`-style manifest + copy-paste snippets per component in docs, so agents can pull a component by name. Optionally evaluate publishing a shadcn-compatible registry namespace later.

6. **Component gaps worth adding** (mapped from benchmark coverage):
   - `Sparkline`/`ChartCard` — data-viz is core to EzyMap products (ticker, pro indicator); Carbon devotes a whole pillar to data-viz palettes; AntV is Ant's answer.
   - `LiveBadge`/`StatusPill` — formalize the `ezm-live-ping` pattern as a component (price ticking, bot status).
   - `Marquee`/`LogoStrip` — for channel/product showcases (Magic UI/React Bits pattern, trivial in CSS).
   - `Skeleton`/`Shimmer` — loading states for async product data.
   - `GlowCard`/`BorderBeam` — the signature "premium" effects (Aceternity/Magic UI); must stay tokenized and reduced-motion safe.

7. **3D asset pipeline decision.** Current extrude variant is SVG offset-copy — fine for icons. If richer 3D is wanted for product marketing, evaluate **Spline MCP** (agent-buildable scenes → web/iOS/Android) or **Rive** (interactive vector with state machines) as the source format, exporting lightweight web assets. Keep the SVG/PNG variants as the always-available fallback.

8. **Motion showcase page.** A dedicated `motion.html` (or docs section) with every utility played side-by-side, reduced-motion toggle, and copy-paste CSS. Spectrum/Origin pattern: live, explorable, source-visible.

### P2 — strategic

9. **MCP server for the design system** (`ezymap-ds` MCP): expose tokens, components, and asset resolution as tools so agents working on EzyMap products can query "give me the ProductIcon for pro, glass variant" and get the right path/props. This is where Mantine, Carbon, Aceternity, Spline, and Rive all landed in 2026.

10. **Versioned theme packs.** HeroUI's Glass/Brutalist/Mouve and Ant's theme-editor point the same direction: EzyMap could ship alternate token themes (e.g. "EzyMap Aurora" using the new aurora mark palette) as `tokens.themes.json` → generated CSS. Cheap once the token pipeline exists.

11. **Front-End Checklist as release gate.** Run frontendchecklist.io against docs/previews each release; the research shows every top system treats a11y/perf/SEO as documented foundations, not audit afterthoughts.

### Explicitly not recommended

- **Adopting shadcn/ui or Radix as the base.** EzyMap's identity is its token pipeline + vanilla bundle + product asset family; shadcn solves a problem we don't have (form-heavy app UI) and would dilute the brand system.
- **Runtime animation dependency (Motion.js).** Our CSS-keyframes + `IntersectionObserver` approach is lighter and framework-free; adding Motion would break the "drop-in `<script>` + CSS" story that makes `bundle.js` valuable.
- **Chasing every registry effect** (particles, gooey, 3D card flips). Pick 2–3 signature motions that match the brand (gold route-line, gem float, live ping) rather than a catalog.

---

## 4. Source notes

- React Bits — reactbits.dev: animated components/backgrounds as owned source, JS/TS, CSS/Tailwind.
- Aceternity — ui.aceternity.com: 200+ components/blocks/templates, Motion+Tailwind, agent/MCP install.
- Magic UI — magicui.design: 150+ free animated React/TS/Tailwind/Motion components, shadcn companion.
- Cult UI — cult-ui.com: 154 MIT animated components for shadcn/ui + AI-agent full-stack blocks.
- Motion Primitives — motion-primitives.com: motion components, free core + Pro.
- Animate UI — animate-ui.com: animated primitives for Radix/Base UI/React Aria, agent skill.
- SmoothUI — smoothui.dev: 228 animated primitives/blocks/templates, MCP + llms.txt + UI Craft anti-slop gate.
- Hover.dev — hover.dev: playful animated React/Tailwind/Motion components, copy-paste.
- 21st.dev — 21st.dev: 12k+ community components, shadcn registry, live previews, MCP/llms.txt.
- Kokonut UI — kokonutui.com: AI-app components + playful inputs, shadcn registry, one-time Pro.
- coss ui — coss.com/ui: Cal.com's Base UI + Tailwind primitives (~64 components).
- Origin UI — coss.com/origin: 500+ copy-paste components by category.
- shadcn/ui — ui.shadcn.com: the registry/component foundation; "Foundation for your Design System."
- HeroUI — heroui.com: React + RN components, premium themes, templates, Pro skills/MCP.
- Adobe Spectrum 2 — spectrum.adobe.com: cross-platform system, live component playgrounds.
- Material 3 Expressive — m3.material.io: expressive shapes, spring motion, dynamic color.
- Apple HIG — developer.apple.com/design/human-interface-guidelines: springs, reduce-motion, haptics.
- Vercel Geist — vercel.com/geist: colors/typography/materials/grid + geistcn components + `.md` docs.
- Microsoft Fluent 2 — fluent2.microsoft.design: cross-platform, restrained motion, a11y tooling.
- Atlassian DS — atlassian.design: semantic token taxonomy, Rovo UI for AI, motion-system essays.
- Ant Design — ant.design: enterprise React library, CSS-var theming, theme editor, "AI friendly."
- Mantine — mantine.dev: 120+ components + 70 hooks, llms.txt, skills, MCP server.
- Radix UI — radix-ui.com: primitives + Themes 3.0, zero-config styled system.
- GitHub Primer — primer.style: Product UI / Brand UI / Octicons split.
- IBM Carbon — carbondesignsystem.com: foundations/components/patterns/data-viz, Carbon MCP, Carbon for AI.
- Spline — spline.design: browser 3D, agent-native via MCP, ships to web/iOS/Android.
- Rive — rive.app: interactive vector runtime, state machines, agent-friendly CLI.
- Motion — motion.dev: React/JS/Vue animation library; layout, gestures, scroll, springs, 3D.
