import * as React from "react";
import { cx } from "./utils";

export interface SparklineProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "values" | "width" | "height"> {
  /** Series, oldest first. Non-finite values are skipped. Fewer than two points renders nothing. */
  values: number[];
  /** Width in px. Default 120. */
  width?: number;
  /** Height in px. Default 32. */
  height?: number;
  /** auto = up when the last value is at or above the first, otherwise down. neutral = body text colour. */
  tone?: "auto" | "up" | "down" | "neutral";
  /** Soft fill under the line. Default true. */
  area?: boolean;
  /** Accessible label. Default "Price trend". */
  label?: string;
}

/** Inline trend line that draws itself on mount. */
export function Sparkline({
  values,
  width = 120,
  height = 32,
  tone = "auto",
  area = true,
  label = "Price trend",
  className,
  ...rest
}: SparklineProps) {
  const data = values.filter((v) => Number.isFinite(v));
  if (data.length < 2) return null;
  const pad = 2;
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  const last = data.length - 1;
  const x = (i: number) => pad + (i * (width - 2 * pad)) / last;
  const y = (v: number) =>
    hi === lo ? height / 2 : height - pad - ((v - lo) / (hi - lo)) * (height - 2 * pad);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(" ");
  const fill = `${line} L${x(last).toFixed(2)} ${height - pad} L${x(0).toFixed(2)} ${height - pad} Z`;
  const resolved = tone === "auto" ? (data[last] >= data[0] ? "up" : "down") : tone === "neutral" ? undefined : tone;
  return (
    <svg
      className={cx("ezm-spark", className)}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      data-tone={resolved}
      {...rest}
    >
      {area ? <path className="ezm-spark__area" d={fill} /> : null}
      <path className="ezm-spark__line" d={line} pathLength={1} />
      <circle className="ezm-spark__dot" cx={x(last)} cy={y(data[last])} r={2} />
    </svg>
  );
}
