# SignalFlag

A status flag for a trading signal: the dot shows the state, pulsing while a trade runs, blinking while it waits for entry and holding still once closed.

- **Statuses:** `running` (green, pulse), `pending` (gold, blink, "Waiting"), `tp` (green, "Target"), `be` and `cancelled` (`status-neutral`), and `sl` (`status-stop` red, "Stopped"). This is the only place red appears in the system.
- **Consumer supplies:** `status`. Pass children only to translate the label. Colour always comes with its word, never colour alone.
- **Motion** stops under `prefers-reduced-motion`.
