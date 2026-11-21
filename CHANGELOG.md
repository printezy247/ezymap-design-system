# Changelog

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
