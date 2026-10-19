import * as React from "react";

export interface EzyAiLogoProps {
  className?: string;
  style?: React.CSSProperties;
  /** Adds "EzyAI" under the cube. Only at 64px and up. */
  withWordmark?: boolean;
  /** Accessible name; omit when the word EzyAI is already beside it. */
  title?: string;
}

/** The EzyAI mark: gold isometric cube on a dark green disc. */
export function EzyAiLogo({ className, style, withWordmark = false, title }: EzyAiLogoProps) {
  const uid = React.useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      style={style}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <radialGradient id={`${uid}-disc`} cx="30%" cy="22%" r="80%">
          <stop offset="0%" stopColor="#1c6539" />
          <stop offset="45%" stopColor="#0f3a23" />
          <stop offset="100%" stopColor="#061c11" />
        </radialGradient>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4dc93" />
          <stop offset="35%" stopColor="#e0bc63" />
          <stop offset="72%" stopColor="#c9a13a" />
          <stop offset="100%" stopColor="#a3802a" />
        </linearGradient>
        <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#34b06a" />
          <stop offset="100%" stopColor="#1a7241" />
        </linearGradient>
      </defs>
      <circle cx={256} cy={256} r={256} fill={`url(#${uid}-disc)`} />
      <g transform={withWordmark ? undefined : "translate(0 44)"}>
        <path d="M256 116 L338 164 L256 212 L174 164 Z" fill={`url(#${uid}-top)`} />
        <path d="M174 164 L256 212 L256 308 L174 260 Z" fill="#0e3a22" />
        <path d="M338 164 L338 260 L256 308 L256 212 Z" fill="#07220f" />
        <path
          d="M256 116 L338 164 L338 260 L256 308 L174 260 L174 164 Z"
          fill="none"
          stroke={`url(#${uid}-gold)`}
          strokeWidth={16}
          strokeLinejoin="round"
        />
        <path
          d="M174 164 L256 212 L338 164"
          fill="none"
          stroke={`url(#${uid}-gold)`}
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={256} cy={212} r={13} fill={`url(#${uid}-gold)`} />
        <circle cx={256} cy={212} r={7} fill="#0a2a18" />
      </g>
      {withWordmark ? (
        <text
          x={256}
          y={390}
          textAnchor="middle"
          fontSize={70}
          fontWeight={700}
          letterSpacing={-1}
          style={{ fontFamily: "var(--font-display)" }}
        >
          <tspan fill="#f7faf8">Ezy</tspan>
          <tspan fill="#e3bd5e">AI</tspan>
        </text>
      ) : null}
    </svg>
  );
}
