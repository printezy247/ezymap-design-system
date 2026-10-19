import * as React from "react";
import { cx } from "./utils";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Rise 3px with a green underglow on hover (card-lift). */
  lift?: boolean;
  /** Green holographic edge glow (shadow-holo). One per view, for the key panel. */
  holo?: boolean;
  /** Mono uppercase line above the title, in primary. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
}

/** Brushed-metal 3D card (glass-card). */
export function Card({ lift, holo, eyebrow, title, className, children, ...rest }: CardProps) {
  return (
    <div className={cx("ezm-card", lift && "ezm-card--lift", holo && "ezm-card--holo", className)} {...rest}>
      {eyebrow ? <p className="ezm-card__eyebrow">{eyebrow}</p> : null}
      {title ? <h3 className="ezm-card__title">{title}</h3> : null}
      {children}
    </div>
  );
}
