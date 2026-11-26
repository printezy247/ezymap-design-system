import * as React from "react";
import { cx } from "./utils";

export interface EzyMapLogoProps {
  className?: string;
  style?: React.CSSProperties;
  /** Adds the "EzyMap" wordmark under the gem. Only at 96px and up. */
  withWordmark?: boolean;
  /** Gentle float plus a gold comet on the orbit ring. */
  animated?: boolean;
  /** Accessible name; omit when the word EzyMap is already beside it. */
  title?: string;
}

/** The EzyMap mark: faceted gem with a rising route line inside a gold orbit ring. */
export function EzyMapLogo({ className, style, withWordmark = false, animated = false, title }: EzyMapLogoProps) {
  const uid = React.useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 512 512"
      className={cx(animated && "ezm-logo-anim", className)}
      style={style}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`${uid}-mgl`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5be39a" />
          <stop offset=".45" stopColor="#2fbf71" />
          <stop offset="1" stopColor="#13804d" />
        </linearGradient>
        <linearGradient id={`${uid}-mgd`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14935a" />
          <stop offset=".55" stopColor="#0f7a4a" />
          <stop offset="1" stopColor="#073d25" />
        </linearGradient>
        <linearGradient id={`${uid}-mol`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7e3a0" />
          <stop offset=".4" stopColor="#e0bc63" />
          <stop offset="1" stopColor="#b38e2f" />
        </linearGradient>
        <linearGradient id={`${uid}-mod`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9a13a" />
          <stop offset=".6" stopColor="#8f7024" />
          <stop offset="1" stopColor="#5a4615" />
        </linearGradient>
        <linearGradient id={`${uid}-medge`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4dc93" />
          <stop offset=".35" stopColor="#e0bc63" />
          <stop offset=".7" stopColor="#c9a13a" />
          <stop offset="1" stopColor="#a3802a" />
        </linearGradient>
        <radialGradient id={`${uid}-mspec`} cx=".35" cy=".25" r=".6">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className={animated ? "ezm-logo-float" : undefined}>
        <path d="M50 262 A206 58 0 0 1 462 262" fill="none" stroke={`url(#${uid}-medge)`} strokeWidth="5" opacity=".55" />
        <polygon points="256,44 92,250 256,316" fill={`url(#${uid}-mgl)`} />
        <polygon points="256,44 256,316 420,250" fill={`url(#${uid}-mgd)`} />
        <polygon points="92,250 256,470 256,316" fill={`url(#${uid}-mol)`} />
        <polygon points="256,316 256,470 420,250" fill={`url(#${uid}-mod)`} />
        <polygon points="256,44 174,147 256,180" fill={`url(#${uid}-mspec)`} />
        <polygon points="92,250 174,360 256,316" fill="#fff6d6" opacity=".18" />
        <polyline
          points="140,242 184,220 216,234 256,182 292,202 326,164"
          fill="none"
          stroke="#0a2a18"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity=".35"
        />
        <polyline
          points="140,236 184,214 216,228 256,176 292,196 326,158"
          fill="none"
          stroke={`url(#${uid}-medge)`}
          strokeWidth="10"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="326" cy="158" r="13" fill="#0a2a18" stroke={`url(#${uid}-medge)`} strokeWidth="6" />
        <circle cx="140" cy="236" r="7" fill={`url(#${uid}-medge)`} />
        <polygon
          points="256,44 420,250 256,470 92,250"
          fill="none"
          stroke={`url(#${uid}-medge)`}
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <polyline
          points="92,250 256,316 420,250"
          fill="none"
          stroke={`url(#${uid}-medge)`}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <line x1="256" y1="316" x2="256" y2="470" stroke="#fff3c4" strokeWidth="2" opacity=".5" />
        <line x1="256" y1="44" x2="256" y2="316" stroke="#9af0c0" strokeWidth="2" opacity=".45" />
        <path d="M50 262 A206 58 0 0 0 462 262" fill="none" stroke={`url(#${uid}-medge)`} strokeWidth="7" />
        <circle cx="420" cy="296" r="9" fill="#f4dc93" />
        <circle cx="420" cy="296" r="18" fill="#f4dc93" opacity=".2" />
        {animated ? (
          <circle className="ezm-logo-comet" r="9" fill="#f4dc93">
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M50 262 A206 58 0 0 1 462 262 A206 58 0 0 1 50 262" />
          </circle>
        ) : null}
      </g>
      {withWordmark ? (
        <text
          x={256}
          y={488}
          textAnchor="middle"
          fontSize={64}
          fontWeight={700}
          letterSpacing={-1}
          style={{ fontFamily: "var(--font-display)" }}
        >
          <tspan fill="var(--wordmark-ink, #f7faf8)">Ezy</tspan>
          <tspan fill="var(--wordmark-accent, #e3bd5e)">Map</tspan>
        </text>
      ) : null}
    </svg>
  );
}
