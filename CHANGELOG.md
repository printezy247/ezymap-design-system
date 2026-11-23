# Changelog

## Unreleased — trading and live-data pack

### Added
- Ten components for trading and live-data screens, in `components/react/*.tsx`, the vanilla `components/bundle.js`, `components/index.d.ts` and `components/bundle.css`, each with a README under `components/<Name>/`:
  - `Sparkline`: inline trend line that draws itself.
  - `DeltaBadge`: signed change pill with arrow, sign and colour.
  - `PriceFlash`: mono price that flashes green on a rise and gold on a fall.
  - `OrderBook`: depth ladder with cumulative depth bars and spread row.
  - `RiskMeter`: half-circle 0 to 100 gauge with `role="meter"`.
  - `TradeCard`: signal card with entry, stop loss, targets and risk-to-reward.
  - `CandleStrip`: mini candlestick chart.
  - `SessionClock`: 24-hour UTC strip of Sydney, Tokyo, London and New York sessions.
  - `HeatGrid`: market heat map, tint follows the size of the move.
  - `FeedStatus`: data-feed health pill (live, delayed, offline) with latency.
- All new animation is off under `prefers-reduced-motion`.

## 2.7.0 — depth motion pack, 3D components

### Added
- `assets/motion/ezymap-motion-depth.css`: depth and 3D motion utilities, imported by `components/bundle.css` and listed in `assets/manifest.json`.
- Components `Carousel3D`, `Coin3D` and `Parallax3D`, in `components/react/*.tsx`, the vanilla `components/bundle.js`, and `components/index.d.ts`.

### Changed
- Product icons and logos refreshed, including the Macro Trader Bot marks.
- Version strings in `package.json`, `assets/manifest.json`, `scripts/build-assets.mjs`, README and docs bumped to 2.7.0.

## 2.6.1 — Macro Trader Bot: fundamental glyph, EzyAI-style variations

### Changed
- `ezymap-mark-macro-trader-bot.svg`: the gem is replaced by a dark rounded tile holding a fundamental-trading glyph — a candlestick cluster (fundamentals) plus a rising macro line. Colors stay on the EzyMap palette: gold and green candles, gold trend line.
- New variations as per the EzyAI set: `ezymap-mark-macro-trader-bot-gold.svg`, `ezymap-mark-macro-trader-bot-white.svg`, `ezymap-mark-macro-trader-bot-black.svg`.
- `docs/index.html` — the Macro Trader logo area lists the four variations.

## 2.6.0 — more 3D and animation, trading-research assets

### Added
- **Products from trading research** (yfinance, 2026-11): `crypto` (stacked coins + gold trend arrow) and `forex` (two currency bills crossing) product icons — 4 variants + PNGs each via `node scripts/build-assets.mjs`.
- **Components**: `CardStack` (Apple-style 3D stacked cards — the front card springs up with `translateY(-10px) rotateX(8deg)` on hover) and `CursorSpotlight` (page-level pointer spotlight that follows the cursor; writes `--mx`/`--my`). Both ship in `components/react/*`, the vanilla `bundle.js`, `index.d.ts` and `react/index.ts`.
- **Motion — Apple-inspired additions:** `ezm-spring-pop` (spring entrance, ease-spring-gentle), `ezm-blur-in` (blur crossfade), `ezm-hover-glow` (halo on hover/focus), `ezm-particle-burst` (upward sparkles, one per `--i` child), `ezm-dematerialize` + `ezm-demat-open` (collapse-to-dot reveal), `ezm-orbit-dots` (CSS radial orbit); `ezm-cube-3d` (rotating metal/green/gold cube), `ezm-spring-in`, `ezm-orbit-3d` (tilted marker ring); `ezm-auto-glow` (pulsing brand glow); `ezm-scroll-blur` (fade-through blur). Every utility has a `prefers-reduced-motion` fallback.
- **Playground**: `docs/motion.html` grows the spring-pop/blur-in/hover-glow/particle-burst/orbit-dots/dematerialize core tiles, the cube/spring/orbit-3d tiles, the auto-glow hero tile and the scroll-blur scroll tile.

### Changed
- `assets/manifest.json` version → 2.6.0. Version strings in README, llms.txt, llms-full.txt, mcp/README.md and the previews.

## 2.5.0 — Apple-inspired language

### Changed
- **Typography:** hero 44px at 1.1 leading with −0.022em, section titles step down to 30px (mobile 26px) at weight 400, card titles 18px, wordmark 15px. Display heads are Clash Display 400–500, not 600.
- **Spacing:** section gaps step up (`space-12` 56px, `space-20` 96px).
- **Radius:** cards 16–24px, buttons are pills (`radius-button-lg` 9999px, sm/md 9999px).
- **Motion:** shorter durations (instant 100ms, fast 200ms, base 300ms, slow 500ms, xl 900ms).
- **Light text:** foreground is #1d1d1f, as on Apple pages.
- README, `docs/llms*.txt`, previews and the showcases updated to the new values.

## 2.4.0 — spring tokens, four components, agent surface

### Added
- **Components** (16 total): `LiveBadge` (live status pill with optional ping ring), `Marquee` (seamless scroll strip with `direction`, `duration`, `pauseOnHover` and `label` props — it duplicates children internally so the loop is seamless), `Skeleton` (shimmer loading placeholder, single block or stacked lines) and `GlowCard` (`glow` breathing-edge or `beam` rotating-border variants, same slots as `Card`). All ship in React (`components/react/*.tsx`), the vanilla `window.EzyMap` bundle, `index.d.ts` typings, `bundle.css` styles and per-component READMEs.
- **Spring easings**: `ease-spring-snappy` (`cubic-bezier(0.2, 1.4, 0.4, 1)`) and `ease-spring-gentle` (`cubic-bezier(0.33, 1.15, 0.68, 1)`) join `ease-spring` — CSS-only approximations of Motion-style spring configs, emitted to `tokens.css`, `tokens.ts` and `tailwind-preset.js`.
- **Agent surface**: `docs/llms.txt` and `docs/llms-full.txt` (LLM-readable system reference), `mcp/server.mjs` (zero-dependency stdio MCP server with `ezymap_summary`, `ezymap_tokens`, `ezymap_components`, `ezymap_motion`, `ezymap_assets`, `ezymap_rules` tools) and `scripts/manifest.mjs` (`npm run manifest`) — a CLI resolver over `assets/manifest.json` for products, variants, formats, logos and motion files.
- **Motion playground** (`docs/motion.html`): every motion utility across the six stylesheets, live, with usage notes and reduced-motion behaviour.
- **3D pipeline decision** (`docs/3d-pipeline-decision.md`): SVG/PNG stays the canonical asset format; Spline and Rive documented as the evaluation path if real-time 3D is ever needed.
- **Accessibility section** in the showcase documenting reduced-motion, no-JS, focus and colour behaviour.

### Changed
- Every component README now opens with a standard install block (React import + vanilla `window.EzyMap` usage).
- `ezm-marquee` honours `--marquee-duration`; `.ezm-marquee--always` animates without hover and `.ezm-marquee-reverse` runs backwards.
- `package.json` → v2.4.0; added the `manifest` script.

## 2.3.0 — product asset family, product motion, Reveal and ProductIcon

### Added
- **Product variants** (`assets/products/`): all nine ready products — channel, Mini App, gated bot, live ticker, calculators, exchanges & bots, EzyMapPro, ebooks and Macro Bot — now ship four variants: base, `-animated` (glyph float + rotating gold ring), `-extrude` (offset-copy 3D depth) and `-glass` (frosted tile), each as SVG plus a 256px PNG rendered by `scripts/build-assets.mjs`. Macro Bot's hand-tuned animated tile is preserved.
- **New logo variants** (`assets/logos/`): `ezymap-mark-aurora.svg` (teal/cyan ramp for data-viz surfaces), `ezymap-appicon-glass.svg` and `ezymap-appicon-neon.svg`.
- **Asset manifest** (`assets/manifest.json`): generated catalog of every logo, product file and motion stylesheet with format and animation flags.
- **Product motion** (`assets/motion/ezymap-motion-product.css`): `ezm-product-lift` (hover lift + green underglow), `ezm-sheen` (sheen sweep on hover/focus), `ezm-live-ping` (expanding ring for live badges), `ezm-dash-flow` (marching SVG dashes) and `ezm-js-reveal` (Reveal component styles). All honour `prefers-reduced-motion`; imported by `components/bundle.css`.
- **Tokens**: `duration-xl` (1200ms) and `ease-spring` (`cubic-bezier(0.34, 1.56, 0.64, 1)` overshoot) added to `tokens/tokens.json` and emitted to `tokens.css`, `tokens.ts` and `tailwind-preset.js`.
- **Components**: `Reveal` (IntersectionObserver scroll reveal; the hidden state is gated behind `html.js` so content stays visible with scripting off, and reduced motion skips the reveal) and `ProductIcon` (`product` + `variant` + `basePath` props for the product tiles), in React, vanilla `bundle.js` and `index.d.ts`.

### Changed
- `scripts/build-assets.mjs` now generates the product variants, PNG renders and `assets/manifest.json`; it degrades gracefully when ImageMagick is unavailable.
- Showcase (`docs/index.html`) shows v2.3.0: new what's-new, product variant grid, new motion tiles, new logo entries and demos for `Reveal` and `ProductIcon`.

## 2.2.1 — 3D motion pack and gold/fintech hero logos

### Added
- **3D and motion pack** (`assets/motion/ezymap-motion-3d.css`): `ezm-stage`, `ezm-3d-turn`, `ezm-3d-wobble`, `ezm-ring-3d`, `ezm-flip`, `ezm-depth`, `ezm-beam`, `ezm-glow`, `ezm-reveal-3d` with `ezm-stagger`, and `ezm-gold-flow`. Each animation has a `prefers-reduced-motion` fallback.
- **Hero logos** (`assets/logos/`): `ezymap-hero-gold.svg` (gold gem with orbit, halo and sparkles) and `ezymap-hero-fintech.svg` (gem with an animated bar chart and price route).
- **Preview** (`preview-v3.html`): demos for the hero logos and the 3D motion utilities.
- **Scroll-driven motion** (`assets/motion/ezymap-motion-scroll.css`): `ezm-scroll-progress`, `ezm-scroll-reveal`, `ezm-scroll-zoom`, `ezm-scroll-stagger`, `ezm-scroll-parallax`, `ezm-scroll-hero-out`. Gated behind `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`, so unsupported browsers show the final state.
- **Text motion** (`assets/motion/ezymap-motion-text.css`): `ezm-words`, `ezm-line`, `ezm-underline`, `ezm-rotator`.
- **Hero motion** (`assets/motion/ezymap-motion-hero.css`): `ezm-spotlight`, `ezm-parallax`, `ezm-candle-rise`, `ezm-tick-up` and `ezm-tick-down`, `ezm-draw`, `ezm-sparkle`.
- **Pointer helper** (`assets/motion/ezymap-hero-pointer.js`): `bindHeroPointer(root)` feeds `--px`, `--py`, `--mx` and `--my` to the hero classes, and `flashTick(el, "up" | "down")` triggers the price flash. Both do nothing under reduced motion.
- **Macro Bot assets** (`assets/products/`): `ezymap-macro-bot-icon.svg`, `ezymap-macro-bot-icon-animated.svg` and `ezymap-macro-bot-horizontal-on-dark.svg`, drawn in the product-tile style of the current system.

### Changed
- `ezm-glow` now animates the opacity of a `::before` layer instead of `box-shadow`.
- `components/bundle.css` imports the 3D, scroll, text and hero motion files, so their classes ship with the bundle. `ezymap-hero-pointer.js` is not in the bundle.
- Motion durations use `--duration-*` tokens in `ezymap-motion-hero.css`. Stagger delays stay as literal values.
- `muted-foreground-elevated` (`#8a928d`, 4.99:1 on `surface-elevated`) is a new token for labels on raised surfaces. `muted-foreground` is 4.25:1 there and fails AA for normal text.
- Light theme: `tokens/tokens.json` has light values for all 35 colour tokens. `scripts/build-tokens.mjs` emits them under `[data-theme="light"]` in `tokens.css`, with matching `colorThemes` output in `tokens.ts`.

## 2.2.0 — hero motion and animated logos

### Added
- **Hero animated logos** (`assets/logos/`): `ezymap-mark-hero.svg` (float + counter-rotating orbit rings + comet + halo pulse + sheen sweep), `ezymap-mark-fintech.svg` (gem over a candlestick cluster with a gold trend line), `ezymap-mark-gold.svg` (all-metal gold gem), `ezymap-horizontal-animated.svg` (sheen wordmark + marching gold rule) and `ezymap-appicon-animated.svg` (floating gem + orbiting comet on the app tile). All honour `prefers-reduced-motion`.
- **Motion utilities** (`assets/motion/ezymap-motion.css`): `ezm-kenburns`, `ezm-marquee-reverse`, `ezm-slide-left`, `ezm-slide-right`, `ezm-scale-in`, `ezm-wiggle`, `ezm-heartbeat`, `ezm-aurora`, `ezm-grid-scroll`, `ezm-caret` — all with `prefers-reduced-motion` fallbacks.

### Changed
- Showcase gains 11 new motion tiles and 5 new animated logo entries; version strings bumped to v2.2.0.

## 2.1.0 — type refresh, more 3D and motion

### Added
- **Fonts**: display is now Clash Display (Fontshare) with Space Grotesk fallback; body is General Sans (Fontshare) with Inter Tight fallback; mono is JetBrains Mono with IBM Plex Mono fallback; new `serif` family (Instrument Serif) powers the `display-accent` italic editorial style. The font registry is documented in `type.fonts` and exported in `tokens.ts`.
- **Logo variants** (`assets/logos/`): `ezymap-mark-extrude.svg` (extruded 3D tile), `ezymap-mark-glass.svg` (frosted glass), `ezymap-mark-neon.svg` (phosphor glow), `ezymap-mark-ghost.svg` (watermark), `ezymap-mark-animated-orbit.svg` (floating gem + rotating gold ring).
- **Motion utilities** (`assets/motion/ezymap-motion.css`): `ezm-float-x`, `ezm-breathe`, `ezm-orbit`, `ezm-tilt` (CSS hover tilt), `ezm-text-shimmer`, `ezm-pan`, `ezm-scan` — all with `prefers-reduced-motion` fallbacks.
- **Component**: `Tilt` — pointer-tracked 3D tilt with cursor glare (`max`, `scale`, `perspective`, `disabled`), in React, vanilla bundle and typings.

### Changed
- Showcase (`docs/index.html`) shows the new type scale, 7 new motion tiles, 5 new logo variants and the Tilt demo; version strings bumped to v2.1.0.

## 2.0.0 — design-system refresh

EzyMap is now the only brand. The EzyAI mark, the Macro Desk icon and lockup, and the `EzyAiLogo` component are removed.

### Added
- **Motion tokens** (`tokens/tokens.json`): 4 durations and 3 easings, emitted as `--duration-*`/`--ease-*` and mapped in the Tailwind preset (`transitionDuration`, `transitionTimingFunction`). **Breakpoints**: `bp-sm`–`bp-xl` as `--bp-*` and Tailwind `screens`.
- **Motion utilities** (`assets/motion/ezymap-motion.css`): `ezm-float`, `ezm-float-slow`, `ezm-blink`, `ezm-spin-slow`, `ezm-rise`, `ezm-shimmer`, `ezm-pulse-ring`, `ezm-marquee` — transform/opacity only, all with `prefers-reduced-motion` fallbacks.
- **Logo variants** (`assets/logos/`): `ezymap-mark-animated.svg` (float + orbit comet), `ezymap-appicon-light.svg`, `ezymap-mark-line.svg` (currentColor outline), `ezymap-stacked-on-light.svg`.
- **Product icons** (`assets/products/`): one app-icon tile each for the channel, Mini App, gated bot, live ticker, calculators, exchanges & bots, EzyMapPro and ebooks.
- **Components**: `EzyMapLogo` (replaces `EzyAiLogo`; adds `animated`) and `PriceTicker`, in React, vanilla bundle and typings.
- **Generator**: `scripts/build-assets.mjs` rebuilds the SVG variants and product icons from the mark geometry.

### Changed
- Showcase (`docs/index.html`) gains Motion and Product sections and the new components; README and token docs updated to v2.

## 1.0.0 — initial release

First standalone release of the EzyMap design system.

### Included
- **Tokens** (`tokens/`): `tokens.json` source of truth (34 colour, 14 spacing, 8 radius, 8 shadow, 7 gradient tokens, 3 font families, 16 type styles), plus generated `tokens.css`, `tokens.ts` and a Tailwind v4 preset (`scripts/build-tokens.mjs`).
- **Components** (`components/`): the prebuilt `bundle.js`, `bundle.css` and `index.d.ts`, and TypeScript React versions in `components/react/` of Button, Card, HeroPill, SignalFlag, EzyAiLogo, HudFrame, StatTile and GridFloor, each with a README.
- **Assets** (`assets/`): the 3D gem logo set (mark, app icon, horizontal on dark and light, stacked, favicon, Apple touch icon), EzyAI mark, Macro Desk icon and lockup, Telegram profile photo, channel banner and chat wallpaper, social share image, website tier images and ebook covers, ambassador photos, cinematic imagery and isometric illustrations.
- **Docs** (`docs/`): brand book (`README.md`), voice guide, brand brief placeholder and a static showcase page (`docs/index.html`) deployed to GitHub Pages.
