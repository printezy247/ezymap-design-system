import * as React from "react";
import { cx } from "./utils";

export interface TiltProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum tilt in degrees. Default 10. */
  max?: number;
  /** Scale applied while tilting. Default 1.02. */
  scale?: number;
  /** Perspective distance in px. Default 900. */
  perspective?: number;
  /** Disable the effect entirely. */
  disabled?: boolean;
}

/** Pointer-tracked 3D tilt wrapper with a soft glare that follows the cursor. */
export function Tilt({ max = 10, scale = 1.02, perspective = 900, disabled, className, style, children, onPointerMove, onPointerLeave, ...rest }: TiltProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    onPointerMove?.(e);
    const el = ref.current;
    if (!el || disabled || reduce) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
    el.style.transition = "transform 60ms linear";
    el.style.transform = `perspective(${perspective}px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`;
  }

  function leave(e: React.PointerEvent<HTMLDivElement>) {
    onPointerLeave?.(e);
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform var(--duration-base) var(--ease-emphasized)";
    el.style.transform = "";
  }

  return (
    <div
      ref={ref}
      className={cx("ezm-tilt-el", className)}
      style={{ transformStyle: "preserve-3d", willChange: "transform", ...style }}
      onPointerMove={move}
      onPointerLeave={leave}
      {...rest}
    >
      {children}
    </div>
  );
}
