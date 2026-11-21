# Skeleton

A loading placeholder with the shimmer sweep — one block or a stack of text-line bars.

## Install

```tsx
import "@ezymap/design-system/components/bundle.css";
import { Skeleton } from "@ezymap/design-system/react";
```

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.Skeleton`.

## Use

- **Props:** `width` / `height` (CSS length or px number), `lines` (renders N bars; the last bar is 62% width like real text).
- Keep the footprint close to the content it replaces so the layout doesn't jump when data lands.
- Mark the region busy while loading: `aria-busy="true"` on the parent, or `aria-hidden` on decorative skeletons.
- The shimmer stops under `prefers-reduced-motion`, leaving a static `surface-elevated` block.
