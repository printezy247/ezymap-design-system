import * as React from "react";
import { cx } from "./utils";

export interface Parallax3DProps extends React.HTMLAttributes<HTMLDivElement> {}

function clamp(v: number): number {
  return Math.min(1, Math.max(-1, v));
}

/** Pointer-driven depth container. Sets --px and --py (-1 to 1) on the root.
 *  Child elements with .ezm-parallax-3d__layer and a --depth value move at
 *  different rates. Motion stops under prefers-reduced-motion. */
export function Parallax3D({
  className,
  style,
  onPointerMove,
  onPointerLeave,
  children,
  ...rest
}: Parallax3DProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) {
        el.style.setProperty("--px", clamp(((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        el.style.setProperty("--py", clamp(((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      }
    }
    onPointerMove?.(e);
  };

  const leave = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (el) {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    }
    onPointerLeave?.(e);
  };

  return (
    <div
      ref={ref}
      className={cx("ezm-parallax-3d", className)}
      style={style}
      onPointerMove={move}
      onPointerLeave={leave}
      {...rest}
    >
      {children}
    </div>
  );
}
