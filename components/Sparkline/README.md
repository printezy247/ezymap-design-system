# Sparkline

## Install

tsx
import "@ezymap/design-system/components/bundle.css";
import { Sparkline } from "@ezymap/design-system/react";

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.Sparkline`.

An inline trend line with a soft area fill and an end dot. The line draws itself on mount.

- **Use** inside `StatTile`, table rows and ticker items to show the shape of a move.
- **Consumer supplies:** `values` (oldest first). `tone` is `auto` by default: green when the last value is at or above the first, gold otherwise. Pass `up`, `down` or `neutral` to override.
- **Don't** use it as the only carrier of a number. Pair it with a value or `DeltaBadge`. It has no axes or tooltip.
- Fewer than two finite values renders nothing. The draw-in is off under `prefers-reduced-motion`.
