import * as React from "react";
import { cx } from "./utils";

export interface CursorSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Redundant with wrapping; kept for API symmetry. */
}

/** Page-level pointer spotlight: a soft green glow follows the cursor over
 *  the page. Set the radius on the element for a tighter bubble. */
export function CursorSpotlight({ className, ...rest }: CursorSpotlightProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [xy, setXY] = React.useState([50, 50]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof document === "undefined") return;
    const on = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      setXY([
        Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
        Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
      ]);
    };
    document.addEventListener("pointermove", on);
    return () => document.removeEventListener("pointermove", on);
  }, []);

  return (
    <div
      ref={ref}
      className={cx("ezm-cursor-spotlight", className)}
      style={{ "--mx": `${xy[0]}%`, "--my": `${xy[1]}%` } as React.CSSProperties}
      {...rest}
    />
  );
}
