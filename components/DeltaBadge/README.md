# DeltaBadge

## Install

tsx
import "@ezymap/design-system/components/bundle.css";
import { DeltaBadge } from "@ezymap/design-system/react";

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.DeltaBadge`.

A signed change pill: arrow, sign and number, tinted by direction.

- **Use** next to a price or in table rows for 24h change, P&L percent or pips.
- **Consumer supplies:** `value` (number). `decimals` defaults to 2 and `suffix` to `%`. Use `suffix=" pips"` or `suffix=""` for other units.
- **Don't** rely on colour alone. The arrow and sign carry the direction, so keep both.
- The value is rounded to `decimals` first, so `-0.001` at 2 decimals reads as flat, not as a loss.
