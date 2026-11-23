import * as React from "react";
import { cx } from "./utils";

export interface HeatItem {
  label: React.ReactNode;
  /** Percent change. Positive tiles tint green, negative tiles gold. */
  change: number;
}

export interface HeatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: HeatItem[];
  /** Columns. Default 4. */
  columns?: number;
  /** Absolute percent change that reaches full tint. Default 3. */
  max?: number;
  /** Decimals on the change. Default 2. */
  decimals?: number;
}

/** Market heat map: one tile per instrument, tint strength follows the size of the move. */
export function HeatGrid({ items, columns = 4, max = 3, decimals = 2, className, style, ...rest }: HeatGridProps) {
  const cap = max > 0 ? max : 1;
  return (
    <div
      className={cx("ezm-heat", className)}
      role="list"
      style={{ "--cols": columns, ...style } as React.CSSProperties}
      {...rest}
    >
      {items.map((item, i) => {
        const c = Number.isFinite(item.change) ? item.change : 0;
        const r = Number(c.toFixed(decimals));
        const tone = r > 0 ? "up" : r < 0 ? "down" : "flat";
        const sign = tone === "up" ? "+" : tone === "down" ? "\u2212" : "";
        return (
          <div
            key={i}
            className="ezm-heat__tile"
            role="listitem"
            data-tone={tone}
            style={{ "--k": Math.min(1, Math.abs(c) / cap).toFixed(3) } as React.CSSProperties}
          >
            <span className="ezm-heat__label">{item.label}</span>
            <span className="ezm-heat__change">{`${sign}${Math.abs(r).toFixed(decimals)}%`}</span>
          </div>
        );
      })}
    </div>
  );
}
