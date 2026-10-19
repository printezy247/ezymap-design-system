import * as React from "react";
import { cx } from "./utils";

export interface StatTileProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** up = market-up green, down = market-down gold. Omit for white. */
  tone?: "up" | "down";
  /** Small line under the value, e.g. "+12.35 (+0.53%)". */
  delta?: React.ReactNode;
  className?: string;
}

/** Mono data readout on a metal tile. */
export function StatTile({ label, value, tone, delta, className }: StatTileProps) {
  return (
    <div className={cx("ezm-stat", className)}>
      <div className="ezm-stat__label">{label}</div>
      <div className="ezm-stat__value" data-tone={tone}>
        {value}
      </div>
      {delta != null ? <div className="ezm-stat__delta">{delta}</div> : null}
    </div>
  );
}
