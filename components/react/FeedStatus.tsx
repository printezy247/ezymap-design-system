import * as React from "react";
import { cx } from "./utils";

export type FeedState = "live" | "delayed" | "offline";

export interface FeedStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: FeedState;
  /** Round-trip latency in ms, shown in mono. */
  latencyMs?: number;
  /** Override the default label (Live, Delayed, Offline). */
  children?: React.ReactNode;
}

const LABEL: Record<FeedState, string> = { live: "Live", delayed: "Delayed", offline: "Offline" };

/** Data-feed health pill. Live pulses, delayed and offline hold still. */
export function FeedStatus({ status, latencyMs, children, className, ...rest }: FeedStatusProps) {
  return (
    <span className={cx("ezm-feed", className)} data-status={status} role="status" {...rest}>
      <span className="ezm-feed__dot" aria-hidden="true" />
      {children ?? LABEL[status]}
      {latencyMs != null && Number.isFinite(latencyMs) ? (
        <span className="ezm-feed__ms">{`${Math.round(latencyMs)} ms`}</span>
      ) : null}
    </span>
  );
}
