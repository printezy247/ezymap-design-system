import * as React from "react";
import { cx } from "./utils";
import { SignalFlag } from "./SignalFlag";
import type { SignalStatus } from "./SignalFlag";

export interface TradeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Instrument, e.g. "XAUUSD". */
  pair: React.ReactNode;
  side: "buy" | "sell";
  entry: number;
  stopLoss: number;
  /** Take-profit levels, nearest first. The risk-to-reward line uses the first. */
  targets?: number[];
  /** Shows a SignalFlag in the header. */
  status?: SignalStatus;
  /** Price decimals. Default 2. */
  decimals?: number;
}

/** Signal card: pair, side, entry, stop loss, targets and risk-to-reward. */
export function TradeCard({
  pair,
  side,
  entry,
  stopLoss,
  targets = [],
  status,
  decimals = 2,
  className,
  ...rest
}: TradeCardProps) {
  const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(decimals) : "\u2014");
  const risk = Math.abs(entry - stopLoss);
  const reward = targets.length ? Math.abs(targets[0] - entry) : NaN;
  const rr = risk > 0 && Number.isFinite(reward) ? reward / risk : null;
  const cell = (kind: string, label: string, value: number) => (
    <div key={label} className="ezm-trade__cell" data-kind={kind}>
      <div className="ezm-trade__label">{label}</div>
      <div className="ezm-trade__value">{fmt(value)}</div>
    </div>
  );
  return (
    <div className={cx("ezm-trade", className)} data-side={side} {...rest}>
      <div className="ezm-trade__head">
        <div className="ezm-trade__pair">
          {pair}
          <span className="ezm-trade__side">{side === "buy" ? "Buy" : "Sell"}</span>
        </div>
        {status ? <SignalFlag status={status} /> : null}
      </div>
      <div className="ezm-trade__grid">
        {cell("entry", "Entry", entry)}
        {cell("sl", "Stop loss", stopLoss)}
        {targets.map((t, i) => cell("tp", `TP${i + 1}`, t))}
      </div>
      {rr != null ? (
        <div className="ezm-trade__rr">
          <span>Risk : reward</span>
          <span>{`1 : ${rr.toFixed(2)}`}</span>
        </div>
      ) : null}
    </div>
  );
}
