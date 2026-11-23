import * as React from "react";
import { cx } from "./utils";

export interface MarketSession {
  name: string;
  /** Open hour in UTC, 0 to 24. Fractions allowed (13.5 = 13:30). */
  open: number;
  /** Close hour in UTC, 0 to 24. A close before the open wraps past midnight. */
  close: number;
}

export interface SessionClockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Defaults to Sydney 22-07, Tokyo 00-09, London 08-17, New York 13-22 (UTC, no daylight-saving shift). */
  sessions?: MarketSession[];
  /** Fixed time, for tests and screenshots. Without it the clock follows the real time and refreshes every 30 s. */
  now?: Date;
}

const DEFAULT_SESSIONS: MarketSession[] = [
  { name: "Sydney", open: 22, close: 7 },
  { name: "Tokyo", open: 0, close: 9 },
  { name: "London", open: 8, close: 17 },
  { name: "New York", open: 13, close: 22 },
];

const isOpen = (h: number, s: MarketSession) =>
  s.open < s.close ? h >= s.open && h < s.close : h >= s.open || h < s.close;

const segments = (s: MarketSession): Array<[number, number]> =>
  s.open < s.close
    ? [[s.open, s.close]]
    : [
        [s.open, 24],
        [0, s.close],
      ];

const fmtHour = (h: number) => {
  const hh = Math.floor(h) % 24;
  const mm = Math.round((h - Math.floor(h)) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

/** 24-hour UTC strip showing which forex sessions are open now. */
export function SessionClock({ sessions = DEFAULT_SESSIONS, now, className, style, ...rest }: SessionClockProps) {
  const [tick, setTick] = React.useState(() => new Date());
  React.useEffect(() => {
    if (now) return;
    const id = setInterval(() => setTick(new Date()), 30000);
    return () => clearInterval(id);
  }, [now]);
  const current = now ?? tick;
  const hour = current.getUTCHours() + current.getUTCMinutes() / 60;
  return (
    <div
      className={cx("ezm-sessions", className)}
      role="group"
      aria-label="Market sessions"
      style={{ "--now": hour / 24, ...style } as React.CSSProperties}
      {...rest}
    >
      {sessions.map((s) => {
        const open = isOpen(hour, s);
        return (
          <div key={s.name} className="ezm-sessions__row" data-open={open}>
            <div>
              <div className="ezm-sessions__name">{s.name}</div>
              <div className="ezm-sessions__hours">{`${fmtHour(s.open)}\u2013${fmtHour(s.close)} UTC`}</div>
            </div>
            <div className="ezm-sessions__track" aria-hidden="true">
              {segments(s).map(([from, to], i) => (
                <span
                  key={i}
                  className="ezm-sessions__seg"
                  style={{ "--l": from / 24, "--w": (to - from) / 24 } as React.CSSProperties}
                />
              ))}
              <span className="ezm-sessions__now" />
            </div>
            <span className="ezm-sessions__state">{open ? "Open" : "Closed"}</span>
          </div>
        );
      })}
    </div>
  );
}
