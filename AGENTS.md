# EzyMap design system — project notes

- `website_sam` (`/mnt/hdd/storage/projects/home/website_sam`, github.com/printezy247/website_sam) is a **separate project, reference only**. Do not treat it as part of this repo's scope, roadmap, or pending work.
- Tokens: edit `tokens/tokens.json`, then run `node scripts/build-tokens.mjs` to regenerate `tokens.css`, `tokens.ts` and `tailwind-preset.js`.
- Docs/preview site: GitHub Pages via `.github/workflows/pages.yml`, published from `main`. Live at https://printezy247.github.io/ezymap-design-system/ — `docs/` plus root-level `preview-v2.html` / `preview-v3.html`.
- Brand: EzyMap is the only brand. Macro Bot is an EzyMap product with its own glyph, not a separate brand.
- EzyAI logo sets in `assets/ezyai-logos/` are kept as reference assets for the docs page. They are not a brand for new work, and new pages must not present EzyAI as a product.
