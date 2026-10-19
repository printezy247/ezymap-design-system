# HudFrame

A hairline frame with gold corner brackets and mono labels notched into its edges. It is the futuristic wrapper for the one section a reader must not miss.

- **Use** for Jack's plan, a trade setup, a checklist, a disclaimer or a key quote. Use one per view, two at most.
- **Consumer supplies:** children, an optional `label` notched into the top edge (`eyebrow` style in `accent`) and an optional `meta` notched into the bottom (`muted-foreground`). The notches paint `background` behind the text, so place the frame directly on `background`.
- **Tokens:** border in `frame-line`, corner brackets in `accent`, radius `radius-2xl`.
- **Don't** nest frames, put one inside a Card, or frame decorative content.
