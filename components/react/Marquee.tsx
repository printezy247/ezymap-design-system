import * as React from "react";
import { cx } from "./utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scroll direction. Default "left". */
  direction?: "left" | "right";
  /** Seconds per loop. Default 32. */
  duration?: number;
  /** Pause on hover/focus. Default true. */
  pauseOnHover?: boolean;
  /** Accessible label for the strip. */
  label?: string;
}

/** Seamless scrolling strip for logos, tickers or product names. Children are
 *  duplicated internally for a loop; pauses on hover and focus, and scrolls
 *  statically under prefers-reduced-motion. */
export function Marquee({
  direction = "left",
  duration = 32,
  pauseOnHover = true,
  label,
  className,
  style,
  children,
  ...rest
}: MarqueeProps) {
  return (
    <div
      className={cx("ezm-marquee", direction === "right" && "ezm-marquee-reverse", !pauseOnHover && "ezm-marquee--always", className)}
      role={label ? "region" : undefined}
      aria-label={label}
      style={{ ...style, ...(duration !== 32 ? ({ "--marquee-duration": `${duration}s` } as React.CSSProperties) : null) }}
      {...rest}
    >
      <div className="ezm-marquee__track">
        {children}
        <span className="ezm-marquee__dup" aria-hidden="true">{children}</span>
      </div>
    </div>
  );
}
