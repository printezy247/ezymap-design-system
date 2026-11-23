# SessionClock

## Install

tsx
import "@ezymap/design-system/components/bundle.css";
import { SessionClock } from "@ezymap/design-system/react";

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.SessionClock`.

A 24-hour UTC strip showing which forex sessions are open, with a gold marker for the current time.

- **Use** in the live ticker and Mini App header.
- **Default sessions (UTC):** Sydney 22:00–07:00, Tokyo 00:00–09:00, London 08:00–17:00, New York 13:00–22:00. These are fixed UTC hours and do not shift with daylight saving. Pass `sessions` to change them.
- **Consumer supplies:** nothing by default. Pass `now` for a fixed time in tests and screenshots; otherwise it refreshes every 30 seconds.
- A close before the open wraps past midnight and draws as two segments.
