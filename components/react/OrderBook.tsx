import * as React from "react";
import { cx } from "./utils";

export interface BookLevel {
  price: number;
  size: number;
}

export interface OrderBookProps extends React.HTMLAttributes<HTMLDivElement> {
  bids: BookLevel[];
  asks: BookLevel[];
  /** Rows per side. Default 6. */
  levels?: number;
  /** Price decimals. Default 2. */
  decimals?: number;
  /** Size and total decimals. Default 2. */
  sizeDecimals?: number;
}

interface CumLevel extends BookLevel {
  total: number;
}

const clean = (list: BookLevel[]) =>
  (list || []).filter((l) => l && Number.isFinite(l.price) && Number.isFinite(l.size));

const cumulate = (list: BookLevel[]): CumLevel[] => {
  let total = 0;
  return list.map((l) => {
    total += l.size;
    return { price: l.price, size: l.size, total };
  });
};

/** Depth ladder: asks above the spread, bids below, with cumulative depth bars. */
export function OrderBook({
  bids,
  asks,
  levels = 6,
  decimals = 2,
  sizeDecimals = 2,
  className,
  ...rest
}: OrderBookProps) {
  const b = cumulate(clean(bids).sort((p, q) => q.price - p.price).slice(0, levels));
  const a = cumulate(clean(asks).sort((p, q) => p.price - q.price).slice(0, levels));
  const max = Math.max(b.length ? b[b.length - 1].total : 0, a.length ? a[a.length - 1].total : 0) || 1;
  const spread = a.length && b.length ? a[0].price - b[0].price : null;
  const row = (l: CumLevel, side: "bid" | "ask", i: number) => (
    <div
      key={`${side}${i}`}
      className="ezm-book__row"
      data-side={side}
      style={{ "--depth": (l.total / max).toFixed(3) } as React.CSSProperties}
    >
      <span className="ezm-book__price">{l.price.toFixed(decimals)}</span>
      <span>{l.size.toFixed(sizeDecimals)}</span>
      <span>{l.total.toFixed(sizeDecimals)}</span>
    </div>
  );
  return (
    <div className={cx("ezm-book", className)} role="group" aria-label="Order book" {...rest}>
      <div className="ezm-book__head">
        <span>Price</span>
        <span>Size</span>
        <span>Total</span>
      </div>
      {a
        .slice()
        .reverse()
        .map((l, i) => row(l, "ask", i))}
      <div className="ezm-book__spread">
        <span>Spread</span>
        <span>{spread == null ? "\u2014" : spread.toFixed(decimals)}</span>
      </div>
      {b.map((l, i) => row(l, "bid", i))}
    </div>
  );
}
