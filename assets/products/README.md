# Product icons

One rounded app-icon tile per ready EzyMap product: dark brushed ground, green glyph, one gold accent. 64×64 viewBox, stroke-based, crisp at any size.

Every product ships four variants — `ezymap-<product>-icon.svg` plus `-animated` (glyph float + rotating gold ring), `-extrude` (offset-copy 3D depth) and `-glass` (frosted tile) — each also rendered as a 256px PNG. Regenerate all of them with `node scripts/build-assets.mjs`; `assets/manifest.json` lists every file.

| File | Product |
|---|---|
| `ezymap-channel-icon.svg` | Free Telegram channel — megaphone |
| `ezymap-miniapp-icon.svg` | Telegram Mini App — phone tile |
| `ezymap-bot-icon.svg` | Gated Telegram bot — robot |
| `ezymap-ticker-icon.svg` | Live price ticker — pulse line |
| `ezymap-calculators-icon.svg` | Trading calculators — calculator |
| `ezymap-exchanges-icon.svg` | Exchanges & bots — swap arrows |
| `ezymap-pro-icon.svg` | EzyMapPro indicator (Pine Script) — candlesticks |
| `ezymap-ebooks-icon.svg` | Ebooks — open book |
| `ezymap-macro-bot-icon.svg` | Macro Bot — globe with a gold trend line |
| `ezymap-macro-bot-icon-animated.svg` | Macro Bot — rotating meridian and a trend line that draws on (honours `prefers-reduced-motion`) |
| `ezymap-macro-bot-horizontal-on-dark.svg` | Macro Bot lockup for dark backgrounds. The wordmark is live text (Clash Display, falling back to Space Grotesk), so load the fonts or outline the text before using it in print. |

Use them for product cards, tier tables, store listings and cross-promotion tiles. Keep the tile background — the glyphs are drawn for the dark ground.
