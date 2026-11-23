# OrderBook

## Install

tsx
import "@ezymap/design-system/components/bundle.css";
import { OrderBook } from "@ezymap/design-system/react";

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.OrderBook`.

A depth ladder: asks above the spread, bids below, each row with a cumulative depth bar.

- **Use** in a market-depth panel for exchange and bot products.
- **Consumer supplies:** `bids` and `asks` as `{ price, size }`. Order does not matter; the component sorts and keeps `levels` rows per side (default 6).
- **Don't** pass hundreds of levels. It renders every row it keeps.
- Bid rows use `market-up`, ask rows `market-down`. The bar width is each row's cumulative size over the larger side total.
