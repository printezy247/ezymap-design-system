import * as React from "react";
import { cx } from "./utils";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger delay in ms, applied as --reveal-delay. */
  delay?: number;
  /** Reveal once (default true) or every time the element enters the viewport. */
  once?: boolean;
}

/** Scroll-into-view reveal. JS fallback for browsers without animation-timeline;
 *  content stays visible when scripting is off or motion is reduced. */
export function Reveal({ delay = 0, once = true, className, style, children, ...rest }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-inview");
      return;
    }
    document.documentElement.classList.add("js");
    el.classList.add("ezm-js-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove("is-inview");
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, ...(delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : null) }}
      {...rest}
    >
      {children}
    </div>
  );
}
