import * as React from "react";

/** Bevelled glass button. One primary per view. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = green bevelled glass (default) · outline = gold glass · ghost = text-only */
  variant?: "primary" | "outline" | "ghost";
  /** sm 40px · md 44px (default) · lg 48px min height */
  size?: "sm" | "md" | "lg";
  /** Renders an <a> with the button styling. */
  href?: string;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

/** Brushed-metal 3D card (glass-card). */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rise 3px with a green underglow on hover (card-lift). */
  lift?: boolean;
  /** Green holographic edge glow (shadow-holo). One per view, for the key panel. */
  holo?: boolean;
  /** Mono uppercase line above the title, in primary. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
}
export declare function Card(props: CardProps): React.ReactElement;

/** Dark pill with a green hairline for a hero badge or live stat. */
export interface HeroPillProps {
  /** A 14px Lucide icon. */
  icon?: React.ReactNode;
  /** Mono green figure before the label (member count). */
  value?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
export declare function HeroPill(props: HeroPillProps): React.ReactElement;

export type SignalStatus = "pending" | "running" | "tp" | "be" | "sl" | "cancelled";
/** Signal status flag. Running pulses, pending blinks, closed states hold still. */
export interface SignalFlagProps {
  status: SignalStatus;
  /** Override the default label (Waiting, Running, Target, Break-even, Stopped, Cancelled). */
  children?: React.ReactNode;
  className?: string;
}
export declare function SignalFlag(props: SignalFlagProps): React.ReactElement;

/** The EzyAI mark: gold isometric cube on a dark green disc. */
export interface EzyAiLogoProps {
  className?: string;
  style?: React.CSSProperties;
  /** Adds "EzyAI" under the cube. Only at 64px and up. */
  withWordmark?: boolean;
  /** Accessible name; omit when the word EzyAI is already beside it. */
  title?: string;
}
export declare function EzyAiLogo(props: EzyAiLogoProps): React.ReactElement;

/** Hairline frame with gold corner brackets and optional mono labels: the futuristic wrapper for a key section. */
export interface HudFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono label notched into the top edge, e.g. "Jack's plan". */
  label?: React.ReactNode;
  /** Mono meta notched into the bottom edge, e.g. "XAUUSD · H1". */
  meta?: React.ReactNode;
}
export declare function HudFrame(props: HudFrameProps): React.ReactElement;

/** Mono data readout on a metal tile. */
export interface StatTileProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** up = market-up green, down = market-down gold. Omit for white. */
  tone?: "up" | "down";
  /** Small line under the value, e.g. "+12.35 (+0.53%)". */
  delta?: React.ReactNode;
  className?: string;
}
export declare function StatTile(props: StatTileProps): React.ReactElement;

/** Perspective grid floor with a soft green glow; centres its children as the hero object. */
export interface GridFloorProps {
  /** Pixel height of the stage (default 320). */
  height?: number;
  /** Set false to drop the radial glow. */
  glow?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function GridFloor(props: GridFloorProps): React.ReactElement;
