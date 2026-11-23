# HeatGrid

## Install

tsx
import "@ezymap/design-system/components/bundle.css";
import { HeatGrid } from "@ezymap/design-system/react";

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.HeatGrid`.

A market heat map: one tile per instrument, tinted green or gold by the size of the move.

- **Use** for a sector, pair or coin overview, up to about 24 tiles.
- **Consumer supplies:** `items` as `{ label, change }` with `change` in percent. `columns` defaults to 4 (2 on narrow screens), `max` (the move that reaches full tint) to 3.
- **Don't** rely on tint alone. Each tile prints its signed change.
- Tint is computed with `color-mix` against `surface`, so it follows the light theme tokens.
