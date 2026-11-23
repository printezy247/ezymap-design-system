import * as React from "react";
import { cx } from "./utils";

export interface DeltaBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Signed change. Zero and non-finite values render as flat. */
  value: number;
  /** Decimal places. Default 2. */
  decimals?: number;
  /** Text after the number. Default "%". */
  suffix?: string;
}

/** Signed change pill. Direction is shown by an arrow and a sign as well as colour. */
export function DeltaBadge({ value, decimals = 2, suffix = "%", className, ...rest }: DeltaBadgeProps) {
  const finite = Number.isFinite(value);
  const rounded = finite ? Number(value.toFixed(decimals)) : 0;
  const tone = !finite || rounded === 0 ? "flat" : rounded > 0 ? "up" : "down";
  const sign = tone === "up" ? "+" : tone === "down" ? "\u2212" : "";
  const arrow = tone === "up" ? "\u25B2" : tone === "down" ? "\u25BC" : "\u25AC";
  return (
    <span className={cx("ezm-delta", className)} data-tone={tone} {...rest}>
      <span className="ezm-delta__arrow" aria-hidden="true">
        {arrow}
      </span>
      {finite ? `${sign}${Math.abs(rounded).toFixed(decimals)}${suffix}` : "\u2014"}
    </span>
  );
}
