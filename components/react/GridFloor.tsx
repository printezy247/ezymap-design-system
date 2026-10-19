import * as React from "react";
import { cx } from "./utils";

export interface GridFloorProps {
  /** Pixel height of the stage (default 320). */
  height?: number;
  /** Set false to drop the radial glow. */
  glow?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const W = 800;
const H = 300;

/** Perspective grid floor with a soft green glow; centres its children as the hero object. */
export function GridFloor({ height = 320, glow = true, children, className, style }: GridFloorProps) {
  const lines: React.ReactElement[] = [];
  const vx = W / 2;
  for (let i = -14; i <= 14; i++) {
    lines.push(<line key={`v${i}`} x1={vx + i * 14} y1={0} x2={vx + i * 120} y2={H} stroke="var(--grid-line)" />);
  }
  let y = 0;
  let step = 6;
  while (y < H) {
    lines.push(<line key={`h${y}`} x1={0} x2={W} y1={y} y2={y} stroke="var(--grid-line)" />);
    step *= 1.32;
    y += step;
  }
  return (
    <div className={cx("ezm-floor", className)} style={{ height, ...style }}>
      {glow ? <div className="ezm-floor__glow" /> : null}
      <svg className="ezm-floor__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
        {lines}
      </svg>
      <div className="ezm-floor__content">{children}</div>
    </div>
  );
}
