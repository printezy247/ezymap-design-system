import * as React from "react";
import { cx } from "./utils";

export interface CardStackItem {
  /** Card title, in Clash Display 500. */
  title?: React.ReactNode;
  /** Smaller line under the title. */
  subtitle?: React.ReactNode;
}

export interface CardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cards front to back. Only the front is interactive; hover pops it. */
  items: CardStackItem[];
  /** Max cards shown, from front. Default 3. */
  max?: number;
  /** Vertical step between cards in px. Default 10. */
  gap?: number;
}

/** Apple-style 3D deck of glass cards. The front card springs up on hover
 *  and rotates toward the viewer, revealing the cards behind it. */
export function CardStack({ items, max = 3, gap = 10, className, ...rest }: CardStackProps) {
  const visible = items.slice(0, Math.max(1, max));
  return (
    <div className={cx("ezm-stack-3d", className)} style={{ gap: `${gap}px` }} {...rest}>
      {visible.map((item, i) => (
        <div key={i} className="ezm-stack-item">
          <div className="ezm-stack-card">
            {item.title != null ? <h4 className="ezm-stack-card__title">{item.title}</h4> : null}
            {item.subtitle != null ? <p className="ezm-stack-card__subtitle">{item.subtitle}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
