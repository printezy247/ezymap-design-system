# Tilt

A wrapper that tilts its child in 3D toward the pointer and adds a soft glare that follows the cursor. The trending card treatment for product tiles and key panels.

- **Use** on one or two hero cards per view — a product tile, the pricing panel, a logo lockup. Do not wrap every card; the effect reads best when rare.
- **Props:** `max` (degrees, default 10), `scale` (default 1.02), `perspective` (px, default 900), `disabled`.
- **Don't** put interactive controls inside unless you want nested pointer targets — the glare layer is pointer-transparent but the tilt applies to the whole box.
- Honours `prefers-reduced-motion`: no tilt and no glare transition for users who ask for less motion. For a CSS-only hover tilt without JS, use `.ezm-tilt` from `assets/motion/ezymap-motion.css`.
