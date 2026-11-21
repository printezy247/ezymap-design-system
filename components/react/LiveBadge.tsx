import * as React from "react";
import { cx } from "./utils";

export interface LiveBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show the expanding ping ring. Default true. */
  ping?: boolean;
}

/** Small "live" status pill: green dot + label, with an optional expanding
 *  ping ring (ezm-live-ping). Use for live prices, running signals and bot
 *  status. Pair with a real status; never animate it when nothing is live. */
export function LiveBadge({ ping = true, className, children, ...rest }: LiveBadgeProps) {
  return (
    <span className={cx("ezm-live-badge", ping && "ezm-live-ping", ping && "is-live", className)} {...rest}>
      <span className="ezm-live-badge__dot" aria-hidden="true" />
      {children ?? "Live"}
    </span>
  );
}
