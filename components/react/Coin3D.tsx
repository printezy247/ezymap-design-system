import * as React from "react";
import { cx } from "./utils";

export interface Coin3DProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Coin diameter in px. Default 72. */
  size?: number;
}

/** Gold coin that spins on its vertical axis. Children render on the face. */
export function Coin3D({ size = 72, className, style, children, ...rest }: Coin3DProps) {
  return (
    <span
      className={cx("ezm-coin-3d", className)}
      style={{ "--size": `${size}px`, ...style } as React.CSSProperties}
      {...rest}
    >
      {children}
    </span>
  );
}
