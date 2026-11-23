# TradeCard

## Install

tsx
import "@ezymap/design-system/components/bundle.css";
import { TradeCard } from "@ezymap/design-system/react";

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.TradeCard`.

A signal card: pair, side, entry, stop loss, take-profit levels and risk-to-reward.

- **Use** in signal feeds and the gated bot's channel previews.
- **Consumer supplies:** `pair`, `side` (`buy` or `sell`), `entry`, `stopLoss`, optional `targets` (nearest first), optional `status` (shown as a `SignalFlag`) and `decimals` (default 2).
- **Don't** put it inside another `Card`. It is already a raised surface.
- Risk : reward uses the first target and shows only when the stop distance is above zero. Prices are formatted as given; the card does no validation of side against the levels.
