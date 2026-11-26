# EzyMap motion studio

[Open the motion studio](studio.html) or [orbit the 3D models](../assets/3d/preview.html).

| Scene | Live use | Video use | Editable 3D |
| --- | --- | --- | --- |
| Signal stack | Overview or strategy introduction | Open on the compact layers and let them fan out | Signal stack OBJ and MTL |
| Range scan | Illustration next to a range explanation | Show the marker sweep across the shaded band | Range gate OBJ and MTL |
| Signal relay | Illustration next to feed status | Follow the travelling pulse across three nodes | CSS scene |

These compositions show illustrative data. Keep actual prices and status in separately labelled UI. The scenes start in a static pose until played. With reduced motion enabled, the studio shows the static pose and disables playback and scrubbing.

## Live use

Import the design tokens and `assets/motion/ezymap-motion-studio.css`, or use `components/bundle.css` with the tokens. Copy the scene markup from [the studio](studio.html). Use `data-motion="ready"` to opt into a loop where the user has allowed motion. Omit it for a still. Keep the stage decorative and convey the meaning in adjacent text.

Use a white surface with a quiet neutral stage for the illustration. Leave surrounding data panels flat. The library retains the v2.7.0 dark root defaults. Set `data-theme="light"` on an application to opt into the light palette and depth tokens.

## Video capture

Use **Open current frame** after choosing a scene, format and position. A frame link has the form `studio.html?scene=stack&format=landscape&frame=1200`. The millisecond parameter covers a four-second cycle, from 0 to 3999. Use `format=portrait` for 9:16.

Capture at 1920 × 1080 or 1080 × 1920. For a 30 fps sequence, capture 120 frames using `frame = round(index * 1000 / 30)` for indices 0 through 119. Use a browser context with reduced motion disabled for video capture. At the exact capture aspect ratio, the artwork fills the viewport. Add editorial text and exports in your video project.

To use the meshes, keep each OBJ next to its MTL. The stack has separate `plate_*` and `bar_*` objects, and the range gate has an independent `scan_cursor`. The interactive 3D viewer supports `?model=ezymap-signal-stack&t=2` for a frozen pose at two seconds. Regenerate the models with `python3 scripts/generate-3d-assets.py`.
