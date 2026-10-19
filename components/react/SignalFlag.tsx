import * as React from "react";
import { cx } from "./utils";

export type SignalStatus = "pending" | "running" | "tp" | "be" | "sl" | "cancelled";

export interface SignalFlagProps {
  status: SignalStatus;
  /** Override the default label (Waiting, Running, Target, Break-even, Stopped, Cancelled). */
  children?: React.ReactNode;
  className?: string;
}

const STATUS_COLOR: Record<SignalStatus, string> = {
  pending: "#c9a13a",
  running: "#2fbf71",
  tp: "#2fbf71",
  be: "#8b948f",
  sl: "#d9534f",
  cancelled: "#8b948f",
};
const STATUS_LABEL: Record<SignalStatus, string> = {
  pending: "Waiting",
  running: "Running",
  tp: "Target",
  be: "Break-even",
  sl: "Stopped",
  cancelled: "Cancelled",
};

/** Signal status flag. Running pulses, pending blinks, closed states hold still. */
export function SignalFlag({ status = "pending", children, className }: SignalFlagProps) {
  return (
    <span
      className={cx("ezm-flag", className)}
      style={{ ["--flag" as string]: STATUS_COLOR[status] ?? STATUS_COLOR.pending } as React.CSSProperties}
      data-pulse={status === "running" || status === "pending" ? status : undefined}
    >
      {children ?? STATUS_LABEL[status] ?? status}
    </span>
  );
}
