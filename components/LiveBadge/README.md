# LiveBadge

A small status pill — green dot plus label — with an optional expanding ping ring for anything that is genuinely live: prices, running signals, bot status.

## Install

```tsx
import "@ezymap/design-system/components/bundle.css";
import { LiveBadge } from "@ezymap/design-system/react";
```

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.LiveBadge`.

## Use

- **Props:** `ping` (default true — the expanding ring), children for the label (default "Live").
- **Use** beside live data only. A badge that pings while nothing updates is noise — set `ping={false}` for static status.
- The dot blinks and the ring expands on a 2.2s cycle; both stop under `prefers-reduced-motion`, leaving a steady dot.
