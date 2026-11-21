import * as React from "react";
import { cx } from "./utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width as CSS length or number (px). */
  width?: string | number;
  /** Height as CSS length or number (px). Default 16. */
  height?: string | number;
  /** Render N stacked bars with standard gaps instead of one block. */
  lines?: number;
}

const len = (v: string | number | undefined, d: string) =>
  v == null ? d : typeof v === "number" ? `${v}px` : v;

/** Loading placeholder with the ezm-shimmer sweep. Announce it as busy:
 *  wrap real content in aria-busy or give the block an aria-label. */
export function Skeleton({ width, height, lines = 1, className, style, ...rest }: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className={cx("ezm-skeleton-lines", className)} style={style} {...rest} aria-hidden={rest["aria-hidden"]}>
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className="ezm-skeleton ezm-skeleton--line"
            style={{ width: i === lines - 1 ? "62%" : len(width, "100%"), height: len(height, "14px") }}
          />
        ))}
      </div>
    );
  }
  return (
    <span
      className={cx("ezm-skeleton", className)}
      style={{ ...style, width: len(width, "100%"), height: len(height, "16px") }}
      {...rest}
    />
  );
}
