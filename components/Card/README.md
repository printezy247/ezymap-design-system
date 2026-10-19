# Card

A brushed-metal panel (`gradient-metal`, `border` hairline, `shadow-glass`) that gives every content block its 3D depth.

- **Use** for feature tiles, package tiers, signal summaries and FAQ groups. Set `lift` when the card is clickable: on hover it rises 3px and picks up the green underglow (`shadow-card-hover`).
- Set `holo` on the one panel per view that holds the key action or checklist. It gets a `holo-edge` border and `shadow-holo` glow.
- **Consumer supplies:** an optional `eyebrow` (mono, in `primary`), a `title` (display, 20px) and children. Wrap body copy in `p.ezm-card__body` for `body-text` at 14px.
- **Spacing:** padding `space-6`, radius `radius-xl`, gaps between cards `space-8`.
- **Don't** nest cards, add coloured fills or left-border accents, or use a card without its hairline.
