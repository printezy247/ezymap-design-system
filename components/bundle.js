/* @ds-bundle: {"format":4,"namespace":"EzyMap","components":[{"name":"Button"},{"name":"Card"},{"name":"HeroPill"},{"name":"SignalFlag"},{"name":"EzyAiLogo"},{"name":"HudFrame"},{"name":"StatTile"},{"name":"GridFloor"}]} */
(function () {
  var React = window.React, h = React.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function omit(o, keys) { var r = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k) && keys.indexOf(k) < 0) r[k] = o[k]; return r; }

  var Button = React.forwardRef(function Button(props, ref) {
    var variant = props.variant || "primary", size = props.size || "md";
    var rest = omit(props, ["variant", "size", "className", "href", "children"]);
    rest.ref = ref;
    rest.className = cx("ezm-btn", "ezm-btn--" + variant, "ezm-btn--" + size, props.className);
    if (props.href) { rest.href = props.href; return h("a", rest, props.children); }
    if (!rest.type) rest.type = "button";
    return h("button", rest, props.children);
  });
  Button.displayName = "Button";

  function Card(props) {
    var rest = omit(props, ["lift", "holo", "eyebrow", "title", "className", "children"]);
    rest.className = cx("ezm-card", props.lift && "ezm-card--lift", props.holo && "ezm-card--holo", props.className);
    return h("div", rest,
      props.eyebrow ? h("p", { className: "ezm-card__eyebrow" }, props.eyebrow) : null,
      props.title ? h("h3", { className: "ezm-card__title" }, props.title) : null,
      props.children);
  }

  function HeroPill(props) {
    return h("span", { className: cx("ezm-pill", props.className) },
      props.icon || null,
      props.value != null ? h("span", { className: "ezm-pill__value" }, props.value) : null,
      props.children);
  }

  var STATUS_COLOR = { pending: "#c9a13a", running: "#2fbf71", tp: "#2fbf71", be: "#8b948f", sl: "#d9534f", cancelled: "#8b948f" };
  var STATUS_LABEL = { pending: "Waiting", running: "Running", tp: "Target", be: "Break-even", sl: "Stopped", cancelled: "Cancelled" };
  function SignalFlag(props) {
    var s = props.status || "pending";
    return h("span", {
      className: cx("ezm-flag", props.className),
      style: { "--flag": STATUS_COLOR[s] || STATUS_COLOR.pending },
      "data-pulse": s === "running" || s === "pending" ? s : undefined
    }, props.children || STATUS_LABEL[s] || s);
  }

  var uidN = 0;
  function EzyAiLogo(props) {
    var ref = React.useRef(null);
    if (ref.current === null) ref.current = "ezyai" + (++uidN);
    var uid = ref.current, title = props.title, ww = !!props.withWordmark;
    return h("svg", { viewBox: "0 0 512 512", className: props.className, style: props.style, role: title ? "img" : "presentation", "aria-label": title, "aria-hidden": title ? undefined : true },
      title ? h("title", null, title) : null,
      h("defs", null,
        h("radialGradient", { id: uid + "-disc", cx: "30%", cy: "22%", r: "80%" },
          h("stop", { offset: "0%", stopColor: "#1c6539" }), h("stop", { offset: "45%", stopColor: "#0f3a23" }), h("stop", { offset: "100%", stopColor: "#061c11" })),
        h("linearGradient", { id: uid + "-gold", x1: "0", y1: "0", x2: "1", y2: "1" },
          h("stop", { offset: "0%", stopColor: "#f4dc93" }), h("stop", { offset: "35%", stopColor: "#e0bc63" }), h("stop", { offset: "72%", stopColor: "#c9a13a" }), h("stop", { offset: "100%", stopColor: "#a3802a" })),
        h("linearGradient", { id: uid + "-top", x1: "0", y1: "0", x2: "0.7", y2: "1" },
          h("stop", { offset: "0%", stopColor: "#34b06a" }), h("stop", { offset: "100%", stopColor: "#1a7241" }))),
      h("circle", { cx: 256, cy: 256, r: 256, fill: "url(#" + uid + "-disc)" }),
      h("g", { transform: ww ? undefined : "translate(0 44)" },
        h("path", { d: "M256 116 L338 164 L256 212 L174 164 Z", fill: "url(#" + uid + "-top)" }),
        h("path", { d: "M174 164 L256 212 L256 308 L174 260 Z", fill: "#0e3a22" }),
        h("path", { d: "M338 164 L338 260 L256 308 L256 212 Z", fill: "#07220f" }),
        h("path", { d: "M256 116 L338 164 L338 260 L256 308 L174 260 L174 164 Z", fill: "none", stroke: "url(#" + uid + "-gold)", strokeWidth: 16, strokeLinejoin: "round" }),
        h("path", { d: "M174 164 L256 212 L338 164", fill: "none", stroke: "url(#" + uid + "-gold)", strokeWidth: 14, strokeLinecap: "round", strokeLinejoin: "round" }),
        h("circle", { cx: 256, cy: 212, r: 13, fill: "url(#" + uid + "-gold)" }),
        h("circle", { cx: 256, cy: 212, r: 7, fill: "#0a2a18" })),
      ww ? h("text", { x: 256, y: 390, textAnchor: "middle", fontSize: 70, fontWeight: 700, letterSpacing: -1, style: { fontFamily: "var(--font-display)" } },
        h("tspan", { fill: "#f7faf8" }, "Ezy"), h("tspan", { fill: "#e3bd5e" }, "AI")) : null);
  }


  function HudFrame(props) {
    var rest = omit(props, ["label", "meta", "className", "children"]);
    rest.className = cx("ezm-hud", props.className);
    return h("div", rest,
      props.label ? h("span", { className: "ezm-hud__label" }, props.label) : null,
      props.children,
      props.meta ? h("span", { className: "ezm-hud__meta" }, props.meta) : null);
  }

  function StatTile(props) {
    return h("div", { className: cx("ezm-stat", props.className) },
      h("div", { className: "ezm-stat__label" }, props.label),
      h("div", { className: "ezm-stat__value", "data-tone": props.tone || undefined }, props.value),
      props.delta != null ? h("div", { className: "ezm-stat__delta" }, props.delta) : null);
  }

  function GridFloor(props) {
    var lines = [], W = 800, H = 300, vx = W / 2, i, y = 0, st = 6;
    for (i = -14; i <= 14; i++) lines.push(h("line", { key: "v" + i, x1: vx + i * 14, y1: 0, x2: vx + i * 120, y2: H, stroke: "var(--grid-line)" }));
    while (y < H) { lines.push(h("line", { key: "h" + y, x1: 0, x2: W, y1: y, y2: y, stroke: "var(--grid-line)" })); st *= 1.32; y += st; }
    return h("div", { className: cx("ezm-floor", props.className), style: Object.assign({ height: props.height || 320 }, props.style) },
      props.glow === false ? null : h("div", { className: "ezm-floor__glow" }),
      h("svg", { className: "ezm-floor__svg", viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "none", "aria-hidden": true }, lines),
      h("div", { className: "ezm-floor__content" }, props.children));
  }

  window.EzyMap = { Button: Button, Card: Card, HeroPill: HeroPill, SignalFlag: SignalFlag, EzyAiLogo: EzyAiLogo, HudFrame: HudFrame, StatTile: StatTile, GridFloor: GridFloor };
})();
