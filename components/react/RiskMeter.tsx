import * as React from "react";
import { cx } from "./utils";

export interface RiskMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0 to 100. Values outside the range are clamped. Below 34 is low, below 67 is medium, otherwise high. */
  value: number;
  /** Caption under the number. Default "Risk". */
  label?: string;
}

/** Half-circle gauge for position or account risk. */
export function RiskMeter({ value, label = "Risk", className, ...rest }: RiskMeterProps) {
  const v = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  const level = v < 34 ? "low" : v < 67 ? "medium" : "high";
  const arc = "M10 60 A50 50 0 0 1 110 60";
  return (
    <div
      className={cx("ezm-risk", className)}
      data-level={level}
      data-empty={v === 0 ? "" : undefined}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      {...rest}
    >
      <svg className="ezm-risk__svg" viewBox="0 0 120 68" aria-hidden="true" focusable="false">
        <path className="ezm-risk__track" d={arc} pathLength={100} />
        <path className="ezm-risk__fill" d={arc} pathLength={100} style={{ strokeDasharray: `${v} 100` }} />
      </svg>
      <div className="ezm-risk__value">{Math.round(v)}</div>
      <div className="ezm-risk__label">{label}</div>
    </div>
  );
}
