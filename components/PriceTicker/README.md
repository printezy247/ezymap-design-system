# PriceTicker

A scrolling strip of live prices: symbol, mono value and signed delta, in a bordered band on `surface`.

- **Use** under a hero or above a chart panel to show the desk is live. One per page.
- **Consumer supplies:** `items` as `{ symbol, value, delta?, tone? }` (`tone: "up" | "down"` colours the delta `market-up` / `market-down`). The track is duplicated internally, so pass each instrument once.
- **Don't** put it inside a card, use it for navigation, or feed it more than ~8 items — the loop gets crowded.
- The strip pauses on hover and becomes a plain scrollable row under `prefers-reduced-motion`. The same motion lives in `assets/motion/ezymap-motion.css` (`.ezm-marquee`) for non-React pages.
