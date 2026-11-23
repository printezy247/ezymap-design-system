import * as React from "react";
import { cx } from "./utils";

export interface PriceFlashProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Latest price. A change flashes green when it rises and gold when it falls. */
  value: number;
  /** Decimal places. Default 2. */
  decimals?: number;
}

interface Flash {
  dir: "up" | "down";
  id: number;
}

/** Mono price that flashes on each change. The flash is off under prefers-reduced-motion. */
export function PriceFlash({ value, decimals = 2, className, ...rest }: PriceFlashProps) {
  const prev = React.useRef(value);
  const [flash, setFlash] = React.useState<Flash | null>(null);
  React.useEffect(() => {
    if (!Number.isFinite(value) || !Number.isFinite(prev.current)) {
      prev.current = value;
      return;
    }
    if (value === prev.current) return;
    const dir = value > prev.current ? "up" : "down";
    prev.current = value;
    setFlash((f) => ({ dir, id: f ? f.id + 1 : 1 }));
  }, [value]);
  return (
    <span
      key={flash ? flash.id : 0}
      className={cx("ezm-price", className)}
      data-flash={flash ? flash.dir : undefined}
      {...rest}
    >
      {Number.isFinite(value) ? value.toFixed(decimals) : "\u2014"}
    </span>
  );
}
