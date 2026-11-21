# Reveal

Wraps children in a div that fades and rises into view the first time it scrolls into the viewport — the JS fallback for browsers without `animation-timeline` support (the CSS-only version is `.ezm-scroll-reveal` in `assets/motion/ezymap-motion-scroll.css`).

- **Use** for sections and cards that should arrive as the reader scrolls. Do not wrap every element — pick the few that carry the page.
- **Props:** `delay` (ms stagger via `--reveal-delay`), `once` (default true; false re-hides and re-reveals on each entry).
- Content stays visible with scripting off — the hidden state only applies under `html.js`, a class the component adds on mount — and under `prefers-reduced-motion` the reveal is skipped entirely.
