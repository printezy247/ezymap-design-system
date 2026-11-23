import * as React from "react";
import { cx } from "./utils";

export interface Carousel3DItem {
  /** Card title. */
  title?: React.ReactNode;
  /** Smaller line under the title. */
  subtitle?: React.ReactNode;
}

export interface Carousel3DProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cards placed evenly around the ring. The ring radius adapts to the count. */
  items: Carousel3DItem[];
  /** Card width in px. Default 160. */
  itemWidth?: number;
  /** Card height in px. Default 200. */
  itemHeight?: number;
}

/** Slowly rotating 3D ring of glass cards. The ring pauses on hover and focus. */
export function Carousel3D({
  items,
  itemWidth = 160,
  itemHeight = 200,
  className,
  style,
  ...rest
}: Carousel3DProps) {
  const n = Math.max(1, items.length);
  return (
    <div
      className={cx("ezm-carousel-3d", className)}
      style={
        {
          "--item-w": `${itemWidth}px`,
          "--item-h": `${itemHeight}px`,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      <div className="ezm-carousel-3d__ring" style={{ "--n": n } as React.CSSProperties}>
        {items.map((item, i) => (
          <div key={i} className="ezm-carousel-3d__item" style={{ "--i": i } as React.CSSProperties}>
            {item.title != null ? <h4 className="ezm-carousel-3d__title">{item.title}</h4> : null}
            {item.subtitle != null ? <p className="ezm-carousel-3d__subtitle">{item.subtitle}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
