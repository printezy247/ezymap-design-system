import * as React from "react";
import { cx } from "./utils";

export type ProductIconName =
  | "channel"
  | "miniapp"
  | "bot"
  | "ticker"
  | "calculators"
  | "exchanges"
  | "pro"
  | "ebooks"
  | "macro-bot";

export type ProductIconVariant = "default" | "animated" | "extrude" | "glass";

export interface ProductIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Ready EzyMap product. Resolves to assets/products/ezymap-<name>-icon.svg. */
  product?: ProductIconName;
  /** Direct file URL; wins over `product`. */
  src?: string;
  /** default · animated (float + orbit ring) · extrude (3D depth) · glass. */
  variant?: ProductIconVariant;
  /** Path the product assets are served from. Default "assets/products". */
  basePath?: string;
  /** Accessible name; defaults to the product label. */
  alt?: string;
}

const FILES: Record<ProductIconName, string> = {
  channel: "ezymap-channel-icon",
  miniapp: "ezymap-miniapp-icon",
  bot: "ezymap-bot-icon",
  ticker: "ezymap-ticker-icon",
  calculators: "ezymap-calculators-icon",
  exchanges: "ezymap-exchanges-icon",
  pro: "ezymap-pro-icon",
  ebooks: "ezymap-ebooks-icon",
  "macro-bot": "ezymap-macro-bot-icon",
};

const LABELS: Record<ProductIconName, string> = {
  channel: "EzyMap channel",
  miniapp: "EzyMap Mini App",
  bot: "EzyMap gated bot",
  ticker: "EzyMap live ticker",
  calculators: "EzyMap calculators",
  exchanges: "EzyMap exchanges and bots",
  pro: "EzyMapPro",
  ebooks: "EzyMap ebooks",
  "macro-bot": "EzyMap Macro Bot",
};

/** Product app-icon tile from assets/products. Pair with .ezm-product-lift or
 *  .ezm-sheen for the hover treatments. */
export function ProductIcon({
  product = "channel",
  src,
  variant = "default",
  basePath = "assets/products",
  alt,
  loading = "lazy",
  decoding = "async",
  className,
  ...rest
}: ProductIconProps) {
  const file = FILES[product];
  const suffix = variant === "default" ? "" : `-${variant}`;
  const url = src ?? `${basePath.replace(/\/$/, "")}/${file}${suffix}.svg`;
  return (
    <img
      src={url}
      alt={alt ?? LABELS[product]}
      loading={loading}
      decoding={decoding}
      className={cx("ezm-product-icon", className)}
      {...rest}
    />
  );
}
