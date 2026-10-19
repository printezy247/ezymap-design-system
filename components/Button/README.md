# Button

A bevelled glass button: `primary` is green glass for the one action the view is for, `outline` is gold glass for the secondary path, and `ghost` is plain text for tertiary links.

- **Use** `primary` once per view, usually "Join Free Channel" to the EzyMap Algo Telegram channel. Use `outline` for "See packages" or "Get the free ebook", and `ghost` for "Ask Sarah" or navigation.
- **Sizes:** `sm` (40px, 13px text), `md` (44px, the default), `lg` (48px, hero and CTA band).
- **Consumer supplies:** the label (sentence case, starting with a verb), an optional leading Lucide icon (16px), and `href` to render a link.
- **States:** press scales to 0.97 and inverts the bevel. Focus is a 2px `accent` ring offset from `background`. Disabled sets 50% opacity.
- **Don't** put two primaries side by side, recolour the outline to green, or drop the bevel shadows. The bevel is the 3D signature.
