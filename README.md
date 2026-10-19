# EzyMap design system

`@ezymap/design-system` v1.0.0 — private, proprietary. Tokens, React components and brand assets for the EzyMap Algo desk.

## Install and use

This package is private and not published to npm. Install it from the private GitHub repo named in `package.json` (`repository`), pinned to the `v1.0.0` tag:

```bash
npm install "github:<owner>/ezymap-design-system#v1.0.0"
```

**Tokens.** Import the generated CSS once (it also loads the Google Fonts: Space Grotesk, Inter Tight, IBM Plex Mono):

```css
@import "@ezymap/design-system/tokens.css";
```

Every colour, spacing, radius, shadow and gradient token becomes a CSS variable (`var(--primary)`, `var(--radius-xl)`, `var(--shadow-glass)`), and each type style is a class (`.hero`, `.section-title`, `.price`). The same values are typed in TypeScript:

```ts
import { tokens } from "@ezymap/design-system/tokens";
tokens.color.primary; // "#2fbf71"
```

**Tailwind v4.** Map the tokens onto Tailwind's theme:

```css
@import "tailwindcss";
@import "@ezymap/design-system/tokens.css";
@config "@ezymap/design-system/tailwind-preset";
```

**Components.** Use the React/TypeScript versions, styled by `bundle.css`:

```tsx
import "@ezymap/design-system/components/bundle.css";
import { Button, Card, SignalFlag } from "@ezymap/design-system/react";

<Card holo eyebrow="Live format" title="Gold">
  <SignalFlag status="running" />
  <Button size="lg">Join Free Channel</Button>
</Card>
```

Or drop in the prebuilt bundle (`components/bundle.js`, a classic script that sets `window.EzyMap` and expects `window.React`).

**Regenerate tokens** after editing `tokens/tokens.json` (the source of truth):

```bash
node scripts/build-tokens.mjs
```

**Showcase.** `docs/index.html` renders every token, component and logo. It is deployed to GitHub Pages from `main`. Also see `docs/voice.md` and `docs/brand-brief.md`.

---

# Brand book

EzyMap is a premium trading desk that lives inside Telegram. Everything built on this system should feel like a private, institutional trading desk from a few years ahead: dark, precise, three-dimensional and quietly futuristic, green and gold on black, with white type.

## Brand facts

- **Brand name:** EzyMap. Write it exactly so: capital E, capital M, one word. The product/desk name is **EzyMap ALGO** on the website and **EzyMap Algo** for the Telegram channel.
- **Main platform:** the Telegram channel **EzyMap Algo**. Every primary CTA leads there ("Join Free Channel").
- **One name only:** the brand is EzyMap and nothing else. Never show the channel's previous name, its old money-and-arrow logo or old social handles in any work. Visible CTAs point to t.me/ezymap; the website's current domain is used only as a link target, never as visible branding.
- **Ambassador:** **Jack**, founder of EzyMap ALGO and a 10+ year trading veteran. Present Jack by name, role and track record. Never describe Jack's appearance or how he is shown. Do not call him faceless, anonymous or hidden.
- **Admin / support:** **Sarah**, on Telegram at t.me/ezysarah. Use "Ask Sarah" or "Message Sarah on Telegram" for help and support links.
- **Theme:** 3D, professional and futuristic. Use brushed metal, bevels, depth and isometric forms, plus a light layer of tech detail: perspective grid floors, hairline frames with gold corner brackets, orbit rings and mono data labels. Keep it restrained; the futuristic layer supports the content and never competes with it. Avoid flat, playful or cartoonish styles, neon overload and sci-fi clichés.

## Content fundamentals

- **Voice: two registers.**
  - **Website, ebooks and product UI:** a calm, experienced desk speaking to you. Use confident, specific, plain English, and back claims with mechanics, not hype. For example: "Every call carries entry, stop and targets, posted live with a timestamp you can verify."
  - **Telegram channel posts:** Jack speaking to his members, in casual Manglish (Malay and English mixed). Keep lines short and punchy, ask the reader a question, and close with an engagement call ("Tap 🔥 for the indicator", "Nak lagi ke mapping harini?"). Emoji are welcome here, usually one or two per post (🤔 😱 😉 😁 🔥 📈). Real examples: "Hmmm... Gold otw to 3,950 kah 🤔", "Berhabuk dah channel ni... 😷 Bagi Jack sapu² jap, then I'll upload the mapping for today. Standby!", "Jangan jadi haloba sebab nak withdraw. Be discipline."
- **Mapping post format:** a header line (`EZYMAP | 01 Oct 2026 | 📈`), then "Jack's Plan:" with one bullet per level reaction (Hold > S1 → look for continuation; Break & reclaim R1 → watch R2; Rejection at R1 → wait S1 pullback; S1 break → bullish weakens → S2), then an "Invalidation:" line with the exact price. Setup posts list confluences as a numbered list (Daily SBR level, H4 fresh resistance, M30 multiple rejections) and end with hashtags (#EzyMap #XAUUSD #JackMappingSetup). Chart screenshots carry the t.me/ezymap watermark.
- **Person:** address the reader as "you". The desk speaks as "we" or in the third person ("the desk trades"). Jack is quoted in the first person only inside his quote ("Consistent wins come from consistent methodology.").
- **Casing:** use sentence case for headings and buttons ("Join Free Channel" and "See packages" are the house exceptions, so copy them as written). Uppercase only via `label-caps`, `eyebrow` and `flag` styles, never typed in caps.
- **Numbers:** show real figures in `mono` (`price` style) with tabular numerals. Never promise returns. Use "Sample signal" and "Live format" labels for illustrative data.
- **Emoji:** none in UI, the website, ebooks or marketing headings, where Lucide line icons carry meaning instead. Telegram posts are the exception (see Voice).
- **Real copy to model:**
  - Hero: "Professional trading signals, delivered live to your phone."
  - Sub: "Forex, commodities and crypto analysis from a 10-year veteran trader, delivered on Telegram with full entry, stop and target transparency."
  - Close: "Start with the free channel today." / "No payment, no commitment."

## Visual foundations

### Colour
- Ground every page on `background`, panels on `surface`, raised panels on `surface-elevated`. The palette is green, gold, black and white only. Never add blue, purple or rainbow accents.
- **Green leads.** `primary` (#2fbf71) is for primary CTAs, live states, links and eyebrows. `primary-glow` (#0f7a4a) is the preferred deep green for large fills, the dark end of `gradient-green` and button bevels. Never use `primary-glow` as text on dark grounds.
- **Gold is the premium accent.** `accent` (#c9a13a) is for outline CTAs, prices, premium tiers, numerals and focus rings. Use it on no more than about 20% of any view.
- **White** is `foreground` for headings and key figures. Paragraphs use `body-text`, and secondary labels use `muted-foreground`.
- Losses and errors use gold (`market-down`, `destructive`), not red. Always pair them with an arrow, sign or word, because up and down differ by hue alone. The single red, `status-stop`, appears only in a SignalFlag reading "Stopped".
- Text pairs that pass: `foreground`, `body-text`, `primary` and `accent` on any surface; `primary-foreground` on `primary`; `accent-foreground` on `accent`. `muted-foreground` on `surface-elevated` is 4.25:1, so use it there only at 24px or larger.

### Depth: the 3D feel
- Cards use `gradient-metal` with a `border` hairline and `shadow-glass`, which adds an inset top highlight and a bevelled bottom for brushed-metal depth. On hover (`Card lift`), raise the card 3px and use `shadow-card-hover`.
- Primary buttons are bevelled glass. The gradient runs from a lighter green into `primary` and then `primary-glow`, with `shadow-button-primary`. Pressing a button scales it to 0.97 and inverts the bevel.
- Floating layers (modals, popovers) use `shadow-elevated`. Shadows are neutral black. The only coloured halo is the green under primary buttons and lifted cards.
- Isometric cubes, stepped order books, stacked isometric slabs (the tier images) and 3D-tilted ebook covers (`shadow-book`, rotateY −18°) are the house motifs. Use perspective transforms, not drop-shadow stacks.
- The futuristic layer: a perspective grid floor in `primary` at 12–14% opacity fading into `background`, hairline frames in `accent` at about 22% opacity with solid gold corner brackets, and a soft radial `primary` glow behind the hero object. Use one of these per surface, two at most. In components: `GridFloor` is the grid floor plus glow stage, `HudFrame` is the bracketed frame, `Card holo` is the one glowing key panel per view, and `StatTile` is the mono data readout.
- Use `gradient-brand` (green → gold) at most once per page, for the CTA band, a gradient tick or one brand phrase.

### Type
- Load Google Fonts: Space Grotesk 500/600/700, Inter Tight 400/500/600, IBM Plex Mono 400/500 (`https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap`).
- Set headings in `display` (Space Grotesk 600, −0.02em, 1.05–1.1 leading): `hero` for the h1 and `section-title` for h2s. On mobile, step down to `hero-mobile` and `section-title-mobile`.
- Set UI and copy in `sans` (Inter Tight): `body` for paragraphs and `body-sm` for most UI.
- Set numbers, prices and eyebrows in `mono` (IBM Plex Mono). Each section opens with an `eyebrow` in `primary`, then a `section-title`, then a `lead` or `body` subtitle in `body-text`.

### Spacing, radii, layout
- Use the 4px Tailwind scale. Pad cards with `space-6`, gap grids with `space-8` and pad sections vertically with `space-20`. On phones, use a `space-4` gutter.
- Controls are at least `control-md` (44px) tall.
- Radii: buttons use `radius-lg` (lg size: `radius-button-lg`), cards use `radius-xl`, hero panels and modals use `radius-2xl`, and pills and flags use `radius-full`.
- Centre content in a max-width column. Section headers are centred, with a max width of about 672px.

### Motion
- Motion is functional: a running signal's dot pulses, a pending one blinks, and live rails sweep. Hover lifts take 250ms and presses 60ms. Respect `prefers-reduced-motion` by removing every transform and loop.

### States
- Focus: a 2px `accent` ring offset by 2px from `background`.
- Disabled: 50% opacity, no pointer.
- Hover: borders go from `border` to `border-hover`, and lifted cards pick up a green underglow.

## Iconography
- Use Lucide icons at stroke width 1.75, coloured with `primary` or `accent` and sized 14–20px beside text. No emoji and no filled icon sets.
- Logos live in `assets/logos`. The primary mark is the 3D EzyMap gem: a faceted diamond with a green crown and gold base, carrying a gold rising route line and wrapped in a gold orbit ring. Use `ezymap-3d-horizontal-on-dark.svg` as the default lockup, the app icon for avatars and Telegram, and the ring-less favicon below 48px. The EzyAI mark is a gold isometric cube on a deep-green disc and is used only for the EzyAI signal product. The Macro & Crypto Desk has its own heat-tile icon, which sits beside the EzyMap wordmark.

## Imagery
- Product photography is cinematic, dark and low-key, lit in green and gold, showing trading desks, monitors and devices. See `assets/imagery`.
- Jack appears only in the `assets/ambassador` images. Show him as a successful, composed professional: tailored suits, a trading desk with a city skyline, a luxury car, a high-rise balcony at golden hour. Warm gold light is the common thread. Caption with his name and role ("Jack, founder of EzyMap ALGO") and never comment on how he is pictured. Never use stock faces or generate new likenesses of him.
- Only the photos in `assets/ambassador` show Jack; never use any other person or silhouette as Jack. In social posts and Telegram banners, the golden-hour lifestyle images work well with a `background` panel or `gradient-metal` card holding the copy.
- Product diagrams in `assets/illustrations` are isometric and drawn in the brand palette on `background`.
- `assets/website` holds the four package tier images (16:9, one stacked slab per tier level, green for Beginner and Pro, gold for Premium and Elite) and the two ebook covers. `assets/telegram` and `assets/social` holds the Telegram channel banner (1280×320) and the social share image (1200×630).

## Not synced
- The 3D gem set in `assets/logos` is the only logo set. No legacy logo or favicon is included.
- Fonts are Google-hosted, so no font files are stored.
- Components are hand-written from the repository's sources, without running its build: Button (`src/components/ui/button.tsx`), Card (`glass-card` and `card-lift` in `src/styles.css`), HeroPill (`hero-pill`), SignalFlag (`signal-flag` and `STATUS_COLOR`), and EzyAiLogo (`src/components/brand/EzyAiLogo.tsx`). The Select, Sonner, SignalCard and landing-page sections were not brought in.
- Skipped variables: `--gradient-glow`, `--gradient-gold-glow` and `--shadow-inset-gold` (all `none`). Animated neon CTA styles were also skipped.
