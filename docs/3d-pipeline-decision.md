# Decision: 3D asset pipeline for EzyMap

Date: 2026-07 · Status: accepted (revisit if richer 3D is needed)

## Context

EzyMap ships product and brand assets in SVG + PNG today, with an `-extrude` variant
(offset-copy 3D depth) and animated SVGs (float, orbit ring, dash flow). The 2026
research survey (`research/design-systems-2026.md`) flagged two agent-native 3D tools:

- **Spline** — browser 3D editor with an MCP server; agents can build editable scenes
  that ship to web (WebGPU/WebGL), iOS and Android.
- **Rive** — interactive vector runtime (.riv) with state machines and data binding;
  a CLI lets coding agents build .riv files; runs on web, mobile, desktop, consoles.

## Decision

**Keep the SVG/PNG pipeline as the canonical asset format.** Do not adopt Spline or
Rive outputs into `assets/` yet.

Reasons:

1. **Weight and reach.** EzyMap surfaces are Telegram Mini Apps, a website and social
   cards. Tiny self-contained SVG/PNG files load everywhere, including inlined in
   Telegram posts and favicons. A .riv or Spline runtime adds JS weight and a runtime
   dependency for marginal gain at icon sizes.
2. **The extrude variant already covers the 3D read.** At 64–256px, offset-copy depth
   reads as 3D without a real renderer. The gem mark's faceted geometry is the brand;
   real-time 3D would compete with it.
3. **Agent-native doesn't mean agent-maintained.** Spline/Rive scenes need an editor
   pass for art direction. Our assets are generated deterministically from
   `scripts/build-assets.mjs`, which keeps them reproducible and diffable.

## When to revisit

- A marketing site or Mini App hero needs a real-time 3D product shot (e.g. a rotating
  gem with parallax) → evaluate **Spline** first (web runtime is mature, MCP workflow
  fits our agent-driven process), keep the SVG as poster/fallback.
- Interactive character or state-machine animation is needed (e.g. an animated Macro
  Bot avatar with moods) → evaluate **Rive** (.riv + state machines beat CSS loops for
  that use case).

Either way: keep SVG/PNG variants as the always-available fallback and list any new
runtime assets in `assets/manifest.json` with their format and weight.
