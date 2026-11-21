import * as React from "react";
import { cx } from "./utils";

export interface TickerItem {
  /** Pair or instrument label, e.g. "XAUUSD". */
  symbol: React.ReactNode;
  /** Formatted price in mono. */
  value: React.ReactNode;
  /** Signed change, e.g. "+12.35 (+0.53%)". */
  delta?: React.ReactNode;
  /** up = market-up green, down = market-down gold. */
  tone?: "up" | "down";
}

export interface PriceTickerProps {
  items: TickerItem[];
  /** Accessible label for the strip. */
  label?: string;
  className?: string;
}

/** Scrolling price strip. The track is duplicated internally so the loop is seamless. */
export function PriceTicker({ items, label = "Prices", className }: PriceTickerProps) {
  const row = (keyPrefix: string) =>
    items.map((item, i) => (
      <span key={`${keyPrefix}-${i}`} className="ezm-ticker__item">
        <span className="ezm-ticker__symbol">{item.symbol}</span>
        <span className="ezm-ticker__value">{item.value}</span>
        {item.delta != null ? (
          <span className="ezm-ticker__delta" data-tone={item.tone || undefined}>
            {item.delta}
          </span>
        ) : null}
      </span>
    ));
  return (
    <div className={cx("ezm-ticker", className)} aria-label={label}>
      <div className="ezm-marquee">
        <div className="ezm-marquee__track">
          {row("a")}
          {row("b")}
        </div>
      </div>
    </div>
  );
}
