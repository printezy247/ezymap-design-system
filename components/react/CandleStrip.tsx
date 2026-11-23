import * as React from "react";
import { cx } from "./utils";

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandleStripProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "width" | "height"> {
  candles: Candle[];
  /** Width in px. Default 160. */
  width?: number;
  /** Height in px. Default 56. */
  height?: number;
  /** Accessible label. Default "Candlestick chart". */
  label?: string;
}

/** Mini candlestick chart. Up candles are market-up green, down candles market-down gold. */
export function CandleStrip({
  candles,
  width = 160,
  height = 56,
  label = "Candlestick chart",
  className,
  ...rest
}: CandleStripProps) {
  const data = candles.filter(
    (c) => c && [c.open, c.high, c.low, c.close].every((n) => Number.isFinite(n)),
  );
  if (!data.length) return null;
  const pad = 2;
  const hi = Math.max(...data.map((c) => c.high));
  const lo = Math.min(...data.map((c) => c.low));
  const y = (v: number) => (hi === lo ? height / 2 : height - pad - ((v - lo) / (hi - lo)) * (height - 2 * pad));
  const slot = width / data.length;
  const bodyW = Math.max(2, slot * 0.6);
  return (
    <svg
      className={cx("ezm-candles", className)}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      {...rest}
    >
      {data.map((c, i) => {
        const mid = slot * i + slot / 2;
        const top = Math.min(y(c.open), y(c.close));
        return (
          <g
            key={i}
            className="ezm-candles__c"
            data-tone={c.close >= c.open ? "up" : "down"}
            style={{ "--i": i } as React.CSSProperties}
          >
            <line x1={mid} x2={mid} y1={y(c.high)} y2={y(c.low)} />
            <rect x={mid - bodyW / 2} y={top} width={bodyW} height={Math.max(1, Math.abs(y(c.open) - y(c.close)))} rx={1} />
          </g>
        );
      })}
    </svg>
  );
}
