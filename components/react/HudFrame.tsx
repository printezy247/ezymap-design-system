import * as React from "react";
import { cx } from "./utils";

export interface HudFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono label notched into the top edge, e.g. "Jack's plan". */
  label?: React.ReactNode;
  /** Mono meta notched into the bottom edge, e.g. "XAUUSD · H1". */
  meta?: React.ReactNode;
}

/** Hairline frame with gold corner brackets and optional mono labels: the futuristic wrapper for a key section. */
export function HudFrame({ label, meta, className, children, ...rest }: HudFrameProps) {
  return (
    <div className={cx("ezm-hud", className)} {...rest}>
      {label ? <span className="ezm-hud__label">{label}</span> : null}
      {children}
      {meta ? <span className="ezm-hud__meta">{meta}</span> : null}
    </div>
  );
}
