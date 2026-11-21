/* EzyMap hero pointer helper. Zero dependencies, ES module.
   Pairs with ezymap-motion-hero.css: it writes --px/--py (-1..1) and
   --mx/--my (pixel offsets from the centre) onto the hero element.
   It does nothing under prefers-reduced-motion or on narrow screens. */

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Track the pointer inside `root` and expose it as CSS variables.
 * Returns a cleanup function that removes listeners and variables.
 */
export function bindHeroPointer(root, options = {}) {
  const noop = () => {};
  if (typeof window === "undefined" || !(root instanceof Element)) return noop;

  const minWidth = typeof options.minWidth === "number" ? options.minWidth : 640;
  const reduced = window.matchMedia(REDUCED_QUERY);
  if (reduced.matches || window.innerWidth < minWidth) return noop;

  let frame = 0;
  let next = { px: 0, py: 0, mx: 0, my: 0 };

  const write = () => {
    frame = 0;
    root.style.setProperty("--px", next.px.toFixed(3));
    root.style.setProperty("--py", next.py.toFixed(3));
    root.style.setProperty("--mx", next.mx.toFixed(1) + "px");
    root.style.setProperty("--my", next.my.toFixed(1) + "px");
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(write);
  };

  const onMove = (event) => {
    if (event.pointerType === "touch" || reduced.matches) return;
    const rect = root.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
    const py = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
    next = { px, py, mx: px * rect.width * 0.5, my: py * rect.height * 0.5 };
    schedule();
  };

  const onLeave = () => {
    next = { px: 0, py: 0, mx: 0, my: 0 };
    schedule();
  };

  root.addEventListener("pointermove", onMove, { passive: true });
  root.addEventListener("pointerleave", onLeave, { passive: true });

  return () => {
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
    if (frame) window.cancelAnimationFrame(frame);
    ["--px", "--py", "--mx", "--my"].forEach((name) => root.style.removeProperty(name));
  };
}

/**
 * Flash an element green (direction "up") or red ("down") for a price change.
 * The class is removed once the flash animation ends.
 */
export function flashTick(element, direction) {
  if (typeof window === "undefined" || !(element instanceof Element)) return;
  if (window.matchMedia(REDUCED_QUERY).matches) return;

  element.classList.remove("ezm-tick-up", "ezm-tick-down");
  // Reading offsetWidth forces a reflow so the animation restarts.
  void element.offsetWidth;
  element.classList.add(direction === "down" ? "ezm-tick-down" : "ezm-tick-up");

  const onEnd = (event) => {
    if (event.animationName !== "ezm-tick") return;
    element.classList.remove("ezm-tick-up", "ezm-tick-down");
    element.removeEventListener("animationend", onEnd);
  };
  element.addEventListener("animationend", onEnd);
}
