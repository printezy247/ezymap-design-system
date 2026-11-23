# RiskMeter

## Install

tsx
import "@ezymap/design-system/components/bundle.css";
import { RiskMeter } from "@ezymap/design-system/react";

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.RiskMeter`.

A half-circle gauge from 0 to 100 with the number in the middle.

- **Use** for position risk, account exposure or drawdown against a limit.
- **Consumer supplies:** `value` (0 to 100, clamped) and an optional `label` (default "Risk"). Below 34 is green, below 67 gold, otherwise red.
- **Don't** use it for P&L. A gauge implies a limit.
- It exposes `role="meter"` with `aria-valuenow`. The arc animates when `value` changes, unless `prefers-reduced-motion` is set.
