import * as React from "react";
import { cx } from "./utils";

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** glow = soft breathing green edge · beam = rotating gold/green border beam. Default "glow". */
  variant?: "glow" | "beam";
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
}

/** The premium surface: a brushed-metal panel with an animated edge —
 *  breathing glow for live/key content, or the rotating beam for the one
 *  hero panel per view. Respects prefers-reduced-motion. */
export function GlowCard({ variant = "glow", eyebrow, title, className, children, ...rest }: GlowCardProps) {
  return (
    <div className={cx("ezm-card", "ezm-glow-card", variant === "beam" ? "ezm-beam" : "ezm-glow", className)} {...rest}>
      {eyebrow ? <p className="ezm-card__eyebrow">{eyebrow}</p> : null}
      {title ? <h3 className="ezm-card__title">{title}</h3> : null}
      {children}
    </div>
  );
}
