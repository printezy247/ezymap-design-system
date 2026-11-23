# CandleStrip

## Install

tsx
import "@ezymap/design-system/components/bundle.css";
import { CandleStrip } from "@ezymap/design-system/react";

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.CandleStrip`.

A mini candlestick chart. Up candles are `market-up` green, down candles `market-down` gold. Candles rise in one after another on mount.

- **Use** in cards and product tiles as a visual cue, 10 to 40 candles.
- **Consumer supplies:** `candles` as `{ open, high, low, close }`.
- **Don't** use it for analysis. It has no axes, volume or tooltip.
- Candles with a non-finite value are skipped. The rise-in is off under `prefers-reduced-motion`.
