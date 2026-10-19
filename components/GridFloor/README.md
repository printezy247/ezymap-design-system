# GridFloor

A stage made of a perspective grid floor (`grid-line`) and a soft radial glow (`gradient-holo-glow`). It centres one hero object, which reads as standing in 3D space.

- **Use** behind the hero object of a page, banner, ebook cover or tier image: the EzyMap gem, a tilted chart panel or a stack of isometric slabs. Use one per surface.
- **Consumer supplies:** the hero object as children, an optional `height` (default 320px) and `glow={false}` to drop the glow.
- **Don't** put body text on the grid, stack two floors, or tint the grid any colour other than `primary`.
