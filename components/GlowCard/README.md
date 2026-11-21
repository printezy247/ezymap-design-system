# GlowCard

The premium surface: the brushed-metal card with an animated edge — a breathing green/gold glow (`ezm-glow`) for live or key content, or the rotating conic border beam (`ezm-beam`) for the one hero panel per view.

## Install

```tsx
import "@ezymap/design-system/components/bundle.css";
import { GlowCard } from "@ezymap/design-system/react";
```

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.GlowCard`.

## Use

- **Props:** `variant` (`"glow"` default, `"beam"`), `eyebrow`, `title`, children — same slots as `Card`.
- One animated-edge card per view. More than that and the effect stops reading as premium and starts reading as noise.
- Both animations stop under `prefers-reduced-motion`, leaving a normal card.
