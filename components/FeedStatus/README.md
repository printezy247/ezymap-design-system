# FeedStatus

## Install

tsx
import "@ezymap/design-system/components/bundle.css";
import { FeedStatus } from "@ezymap/design-system/react";

Vanilla: load React 18 UMD, then `components/bundle.js`; use `window.EzyMap.FeedStatus`.

A data-feed health pill with a dot and optional latency.

- **Use** beside live prices to say whether the numbers can be trusted right now.
- **Consumer supplies:** `status` (`live`, `delayed` or `offline`) and optional `latencyMs`. Children replace the default label.
- **Don't** use it for signal state. That is `SignalFlag`. `LiveBadge` is a static "we are live" marker; `FeedStatus` reports measured health.
- It has `role="status"`. The live dot pulses; delayed and offline hold still, and the pulse is off under `prefers-reduced-motion`.
