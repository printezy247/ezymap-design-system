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

/** The EzyMap gem mark: faceted diamond, rising route line, gold orbit ring. */
export interface EzyMapLogoProps {
  className?: string;
  style?: React.CSSProperties;
  /** Adds the "EzyMap" wordmark under the gem. Only at 96px and up. */
  withWordmark?: boolean;
  /** Gentle float plus a gold comet travelling the orbit ring. */
  animated?: boolean;
  /** Accessible name; omit when the word EzyMap is already beside it. */
  title?: string;
}
export declare function EzyMapLogo(props: EzyMapLogoProps): React.ReactElement;

export interface TickerItem {
  /** Pair or instrument label, e.g. "XAUUSD". */
  symbol: React.ReactNode;
  /** Formatted price in mono. */
  value: React.ReactNode;
  /** Signed change, e.g. "+12.35 (+0.53%)". */
  delta?: React.ReactNode;
  /** up = market-up green, down = market-down gold. */
  tone?: "up" | "down";
}
/** Scrolling price strip; the track is duplicated internally for a seamless loop. */
export interface PriceTickerProps {
  items: TickerItem[];
  /** Accessible label for the strip. */
  label?: string;
  className?: string;
}
export declare function PriceTicker(props: PriceTickerProps): React.ReactElement;

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

/** Pointer-tracked 3D tilt wrapper with a cursor-following glare. */
export interface TiltProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum tilt in degrees. Default 10. */
  max?: number;
  /** Scale applied while tilting. Default 1.02. */
  scale?: number;
  /** Perspective distance in px. Default 900. */
  perspective?: number;
  /** Disable the effect entirely. */
  disabled?: boolean;
}
export declare function Tilt(props: TiltProps): React.ReactElement;

/** Scroll-into-view reveal (JS fallback for browsers without animation-timeline). */
export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger delay in ms, applied as --reveal-delay. */
  delay?: number;
  /** Reveal once (default true) or every time the element enters the viewport. */
  once?: boolean;
}
export declare function Reveal(props: RevealProps): React.ReactElement;

export type ProductIconName =
  | "channel"
  | "miniapp"
  | "bot"
  | "ticker"
  | "calculators"
  | "exchanges"
  | "pro"
  | "ebooks"
  | "macro-bot"
  | "crypto"
  | "forex";
export type ProductIconVariant = "default" | "animated" | "extrude" | "glass";
/** Product app-icon tile from assets/products. */
export interface ProductIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  product?: ProductIconName;
  src?: string;
  variant?: ProductIconVariant;
  basePath?: string;
  alt?: string;
}
export declare function ProductIcon(props: ProductIconProps): React.ReactElement;

/** Small "live" status pill with a green dot and optional expanding ping ring. */
export interface LiveBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show the expanding ping ring. Default true. */
  ping?: boolean;
}
export declare function LiveBadge(props: LiveBadgeProps): React.ReactElement;

/** Seamless scrolling strip; children are duplicated internally for the loop. */
export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scroll direction. Default "left". */
  direction?: "left" | "right";
  /** Seconds per loop. Default 32. */
  duration?: number;
  /** Pause on hover/focus. Default true. */
  pauseOnHover?: boolean;
  /** Accessible label for the strip. */
  label?: string;
}
export declare function Marquee(props: MarqueeProps): React.ReactElement;

/** Loading placeholder with the shimmer sweep. */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width as CSS length or number (px). */
  width?: string | number;
  /** Height as CSS length or number (px). Default 16. */
  height?: string | number;
  /** Render N stacked bars instead of one block. */
  lines?: number;
}
export declare function Skeleton(props: SkeletonProps): React.ReactElement;

/** Premium card surface with an animated edge: breathing glow or rotating beam. */
export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** glow = soft breathing green edge · beam = rotating gold/green border beam. Default "glow". */
  variant?: "glow" | "beam";
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
}
export declare function GlowCard(props: GlowCardProps): React.ReactElement;

/** Deck of Apple-style 3D stacked glass cards; the front card springs up on hover. */
export interface CardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cards front to back. Only the front is interactive; hover pops it. */
  items: { title?: React.ReactNode; subtitle?: React.ReactNode }[];
  /** Max cards shown, from front. Default 3. */
  max?: number;
  /** Vertical step between cards in px. Default 10. */
  gap?: number;
}
export declare function CardStack(props: CardStackProps): React.ReactElement;

/** Page-level pointer spotlight: a soft green glow follows the cursor. */
export interface CursorSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {}
export declare function CursorSpotlight(props: CursorSpotlightProps): React.ReactElement;

/** Slowly rotating 3D ring of glass cards. Pauses on hover and focus. */
export interface Carousel3DItem {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}
export interface Carousel3DProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cards placed evenly around the ring. */
  items: Carousel3DItem[];
  /** Card width in px. Default 160. */
  itemWidth?: number;
  /** Card height in px. Default 200. */
  itemHeight?: number;
}
export declare function Carousel3D(props: Carousel3DProps): React.ReactElement;

/** Inline trend line that draws itself on mount. */
export interface SparklineProps extends Omit<React.SVGAttributes<SVGSVGElement>, "values" | "width" | "height"> {
  /** Series, oldest first. Non-finite values are skipped. Fewer than two points renders nothing. */
  values: number[];
  width?: number;
  height?: number;
  /** auto = up when the last value is at or above the first, otherwise down. */
  tone?: "auto" | "up" | "down" | "neutral";
  area?: boolean;
  label?: string;
}
export declare function Sparkline(props: SparklineProps): React.ReactElement | null;

/** Signed change pill with arrow, sign and colour. */
export interface DeltaBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  decimals?: number;
  suffix?: string;
}
export declare function DeltaBadge(props: DeltaBadgeProps): React.ReactElement;

/** Mono price that flashes green on a rise and gold on a fall. */
export interface PriceFlashProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  decimals?: number;
}
export declare function PriceFlash(props: PriceFlashProps): React.ReactElement;

/** Depth ladder with cumulative depth bars. */
export interface BookLevel {
  price: number;
  size: number;
}
export interface OrderBookProps extends React.HTMLAttributes<HTMLDivElement> {
  bids: BookLevel[];
  asks: BookLevel[];
  levels?: number;
  decimals?: number;
  sizeDecimals?: number;
}
export declare function OrderBook(props: OrderBookProps): React.ReactElement;

/** Half-circle risk gauge, 0 to 100. */
export interface RiskMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: string;
}
export declare function RiskMeter(props: RiskMeterProps): React.ReactElement;

/** Signal card: pair, side, entry, stop loss, targets and risk-to-reward. */
export interface TradeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  pair: React.ReactNode;
  side: "buy" | "sell";
  entry: number;
  stopLoss: number;
  targets?: number[];
  status?: "pending" | "running" | "tp" | "be" | "sl" | "cancelled";
  decimals?: number;
}
export declare function TradeCard(props: TradeCardProps): React.ReactElement;

/** Mini candlestick chart. */
export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}
export interface CandleStripProps extends Omit<React.SVGAttributes<SVGSVGElement>, "width" | "height"> {
  candles: Candle[];
  width?: number;
  height?: number;
  label?: string;
}
export declare function CandleStrip(props: CandleStripProps): React.ReactElement | null;

/** 24-hour UTC strip of forex sessions. */
export interface MarketSession {
  name: string;
  /** Open hour in UTC, 0 to 24. */
  open: number;
  /** Close hour in UTC, 0 to 24. A close before the open wraps past midnight. */
  close: number;
}
export interface SessionClockProps extends React.HTMLAttributes<HTMLDivElement> {
  sessions?: MarketSession[];
  /** Fixed time for tests. Without it the clock follows real time. */
  now?: Date;
}
export declare function SessionClock(props: SessionClockProps): React.ReactElement;

/** Market heat map, one tile per instrument. */
export interface HeatItem {
  label: React.ReactNode;
  change: number;
}
export interface HeatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: HeatItem[];
  columns?: number;
  max?: number;
  decimals?: number;
}
export declare function HeatGrid(props: HeatGridProps): React.ReactElement;

/** Data-feed health pill. */
export type FeedState = "live" | "delayed" | "offline";
export interface FeedStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: FeedState;
  latencyMs?: number;
  children?: React.ReactNode;
}
export declare function FeedStatus(props: FeedStatusProps): React.ReactElement;

/** Gold coin that spins on its vertical axis. Children render on the face. */
export interface Coin3DProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Coin diameter in px. Default 72. */
  size?: number;
}
export declare function Coin3D(props: Coin3DProps): React.ReactElement;

/** Pointer-driven depth container. Sets --px and --py on the root. */
export interface Parallax3DProps extends React.HTMLAttributes<HTMLDivElement> {}
export declare function Parallax3D(props: Parallax3DProps): React.ReactElement;
