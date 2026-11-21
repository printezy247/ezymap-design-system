# Marquee

A seamless scrolling strip for logos, product names, tickers or partner lists. Children are duplicated internally so the loop never shows a seam.

## Install

```tsx
import "@ezymap/design-system/components/bundle.css";
import { Marquee } from "@ezymap/design-system/react";
```

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.Marquee`.

## Use

- **Props:** `direction` (`"left"` default, `"right"` for a counter-scroll), `duration` (seconds per loop, default 32), `pauseOnHover` (default true), `label` (adds `role="region"` + `aria-label`).
- Style the items yourself — the strip is unstyled chrome. Space them with `gap` on a wrapper or `margin` on each child.
- Pauses on hover and keyboard focus; under `prefers-reduced-motion` the track does not animate and the strip becomes scrollable.
- For live prices prefer `PriceTicker`, which adds symbol/value/delta styling.
