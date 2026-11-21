# EzyMapLogo

## Install

```tsx
import "@ezymap/design-system/components/bundle.css";
import { EzyMapLogo } from "@ezymap/design-system/react";
```

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.EzyMapLogo`.

The EzyMap gem mark: a faceted diamond (green crown, gold base) carrying a gold rising route line, wrapped in an orbit ring. Full colour — never tint it.

- **Use** for the EzyMap brand wherever a mark is needed: nav, hero, loading states, product tiles. Pair with `withWordmark` only at 96px and up.
- **Props:** `withWordmark` adds "EzyMap" ("Ezy" in white, "Map" in gold) under the gem. `animated` adds a gentle float and a gold comet travelling the orbit ring; both stop under `prefers-reduced-motion`.
- **Consumer supplies:** `title` for an accessible name; omit it when the word EzyMap is already beside the mark.
- **Don't** recolour it, place it on busy photography, or use `animated` more than once per view.
- **Static files:** matching SVGs live in `assets/logos/` (`ezymap-3d-mark.svg`, `ezymap-mark-animated.svg`, `ezymap-mark-line.svg`, lockups and app icons).
