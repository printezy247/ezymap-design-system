import * as React from "react";
import { cx } from "./utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = green bevelled glass (default) · outline = gold glass · ghost = text-only */
  variant?: "primary" | "outline" | "ghost";
  /** sm 40px · md 44px (default) · lg 48px min height */
  size?: "sm" | "md" | "lg";
  /** Renders an <a> with the button styling. */
  href?: string;
}

/** Bevelled glass button. One primary per view. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, href, children, type, ...rest },
  ref
) {
  const cls = cx("ezm-btn", `ezm-btn--${variant}`, `ezm-btn--${size}`, className);
  if (href) {
    return (
      <a
        className={cls}
        href={href}
        {...(rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={cls} type={type ?? "button"} {...rest} ref={ref}>
      {children}
    </button>
  );
});
