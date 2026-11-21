# StatTile

## Install

```tsx
import "@ezymap/design-system/components/bundle.css";
import { StatTile } from "@ezymap/design-system/react";
```

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.StatTile`.

A mono data readout on a brushed-metal tile: label, value and an optional delta line.

- **Use** for live prices, risk figures, member counts and plan parameters (entry, stop, target), set in rows or a column beside a chart.
- **Consumer supplies:** `label` (uppercased by the style), `value` (set in `price` style with tabular numerals), an optional `tone` (`up` for `market-up`, `down` for `market-down`) and an optional `delta`.
- Label sample or illustrative figures as such nearby ("Sample signal", "Illustrative account"). Never show invented results as real.
