# PriceFlash

## Install

tsx
import "@ezymap/design-system/components/bundle.css";
import { PriceFlash } from "@ezymap/design-system/react";

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.PriceFlash`.

A mono price that flashes green when it rises and gold when it falls.

- **Use** for the main quote in a live panel. Update `value` as ticks arrive.
- **Consumer supplies:** `value` and optional `decimals` (default 2).
- **Don't** wrap every cell of a fast table in it. Flashing more than a handful of values at once is noisy.
- The flash is off under `prefers-reduced-motion`. Add a `DeltaBadge` when direction must stay visible without motion. The component does not announce changes to screen readers.
