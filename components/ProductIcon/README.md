# ProductIcon

Renders one of the ready-product app-icon tiles from `assets/products/` as an `<img>`.

- **Use** on product cards, tier tables, store listings and cross-promotion tiles — anywhere a product needs its mark.
- **Props:** `product` (`channel`, `miniapp`, `bot`, `ticker`, `calculators`, `exchanges`, `pro`, `ebooks`, `macro-bot`), `variant` (`default`, `animated`, `extrude`, `glass`), `src` to override the URL, `basePath` (default `assets/products` — point it at wherever the assets are served from in your app).
- Every product ships all four variants as SVG plus a 256px PNG; `assets/manifest.json` lists them.
- Pair with `.ezm-product-lift` or `.ezm-sheen` from `assets/motion/ezymap-motion-product.css` for the hover treatments.
