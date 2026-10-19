import * as React from "react";
import { cx } from "./utils";

export interface HeroPillProps {
  /** A 14px Lucide icon. */
  icon?: React.ReactNode;
  /** Mono green figure before the label (member count). */
  value?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** Dark pill with a green hairline for a hero badge or live stat. */
export function HeroPill({ icon, value, children, className }: HeroPillProps) {
  return (
    <span className={cx("ezm-pill", className)}>
      {icon ?? null}
      {value != null ? <span className="ezm-pill__value">{value}</span> : null}
      {children}
    </span>
  );
}
