/* @ds-bundle: {"format":4,"namespace":"EzyMap","components":[{"name":"Button"},{"name":"Card"},{"name":"HeroPill"},{"name":"SignalFlag"},{"name":"EzyMapLogo"},{"name":"HudFrame"},{"name":"StatTile"},{"name":"GridFloor"},{"name":"PriceTicker"}]} */
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
  function EzyMapLogo(props) {
    var ref = React.useRef(null);
    if (ref.current === null) ref.current = "ezymap" + (++uidN);
    var uid = ref.current, title = props.title, ww = !!props.withWordmark, anim = !!props.animated;
    var u = function (n) { return "url(#" + uid + "-" + n + ")"; };
    var gem = [
      h("path", { key: "o1", d: "M50 262 A206 58 0 0 1 462 262", fill: "none", stroke: u("medge"), strokeWidth: 5, opacity: ".55" }),
      h("polygon", { key: "f1", points: "256,44 92,250 256,316", fill: u("mgl") }),
      h("polygon", { key: "f2", points: "256,44 256,316 420,250", fill: u("mgd") }),
      h("polygon", { key: "f3", points: "92,250 256,470 256,316", fill: u("mol") }),
      h("polygon", { key: "f4", points: "256,316 256,470 420,250", fill: u("mod") }),
      h("polygon", { key: "f5", points: "256,44 174,147 256,180", fill: u("mspec") }),
      h("polygon", { key: "f6", points: "92,250 174,360 256,316", fill: "#fff6d6", opacity: ".18" }),
      h("polyline", { key: "e1", points: "140,242 184,220 216,234 256,182 292,202 326,164", fill: "none", stroke: "#0a2a18", strokeWidth: 16, strokeLinejoin: "round", strokeLinecap: "round", opacity: ".35" }),
      h("polyline", { key: "e2", points: "140,236 184,214 216,228 256,176 292,196 326,158", fill: "none", stroke: u("medge"), strokeWidth: 10, strokeLinejoin: "round", strokeLinecap: "round" }),
      h("circle", { key: "c1", cx: 326, cy: 158, r: 13, fill: "#0a2a18", stroke: u("medge"), strokeWidth: 6 }),
      h("circle", { key: "c2", cx: 140, cy: 236, r: 7, fill: u("medge") }),
      h("polygon", { key: "o2", points: "256,44 420,250 256,470 92,250", fill: "none", stroke: u("medge"), strokeWidth: 8, strokeLinejoin: "round" }),
      h("polyline", { key: "o3", points: "92,250 256,316 420,250", fill: "none", stroke: u("medge"), strokeWidth: 6, strokeLinejoin: "round" }),
      h("line", { key: "l1", x1: 256, y1: 316, x2: 256, y2: 470, stroke: "#fff3c4", strokeWidth: 2, opacity: ".5" }),
      h("line", { key: "l2", x1: 256, y1: 44, x2: 256, y2: 316, stroke: "#9af0c0", strokeWidth: 2, opacity: ".45" }),
      h("path", { key: "o4", d: "M50 262 A206 58 0 0 0 462 262", fill: "none", stroke: u("medge"), strokeWidth: 7 }),
      h("circle", { key: "c3", cx: 420, cy: 296, r: 9, fill: "#f4dc93" }),
      h("circle", { key: "c4", cx: 420, cy: 296, r: 18, fill: "#f4dc93", opacity: ".2" })
    ];
    if (anim) gem.push(h("circle", { key: "comet", r: 9, fill: "#f4dc93" },
      h("animateMotion", { dur: "3.2s", repeatCount: "indefinite", path: "M50 262 A206 58 0 0 1 462 262 A206 58 0 0 1 50 262" })));
    return h("svg", { viewBox: "0 0 512 512", className: cx(anim && "ezm-logo-anim", props.className), style: props.style, role: title ? "img" : "presentation", "aria-label": title, "aria-hidden": title ? undefined : true },
      title ? h("title", null, title) : null,
      h("defs", null,
        h("linearGradient", { id: uid + "-mgl", x1: "0", y1: "0", x2: "1", y2: "1" },
          h("stop", { offset: "0", stopColor: "#5be39a" }), h("stop", { offset: ".45", stopColor: "#2fbf71" }), h("stop", { offset: "1", stopColor: "#13804d" })),
        h("linearGradient", { id: uid + "-mgd", x1: "1", y1: "0", x2: "0", y2: "1" },
          h("stop", { offset: "0", stopColor: "#14935a" }), h("stop", { offset: ".55", stopColor: "#0f7a4a" }), h("stop", { offset: "1", stopColor: "#073d25" })),
        h("linearGradient", { id: uid + "-mol", x1: "0", y1: "0", x2: "1", y2: "1" },
          h("stop", { offset: "0", stopColor: "#f7e3a0" }), h("stop", { offset: ".4", stopColor: "#e0bc63" }), h("stop", { offset: "1", stopColor: "#b38e2f" })),
        h("linearGradient", { id: uid + "-mod", x1: "1", y1: "0", x2: "0", y2: "1" },
          h("stop", { offset: "0", stopColor: "#c9a13a" }), h("stop", { offset: ".6", stopColor: "#8f7024" }), h("stop", { offset: "1", stopColor: "#5a4615" })),
        h("linearGradient", { id: uid + "-medge", x1: "0", y1: "0", x2: "1", y2: "1" },
          h("stop", { offset: "0", stopColor: "#f4dc93" }), h("stop", { offset: ".35", stopColor: "#e0bc63" }), h("stop", { offset: ".7", stopColor: "#c9a13a" }), h("stop", { offset: "1", stopColor: "#a3802a" })),
        h("radialGradient", { id: uid + "-mspec", cx: ".35", cy: ".25", r: ".6" },
          h("stop", { offset: "0", stopColor: "#ffffff", stopOpacity: ".55" }), h("stop", { offset: "1", stopColor: "#ffffff", stopOpacity: "0" }))),
      h("g", { className: anim ? "ezm-logo-float" : undefined }, gem),
      ww ? h("text", { x: 256, y: 505, textAnchor: "middle", fontSize: 58, fontWeight: 700, letterSpacing: -1, style: { fontFamily: "var(--font-display)" } },
        h("tspan", { fill: "#f7faf8" }, "Ezy"), h("tspan", { fill: "#e3bd5e" }, "Map")) : null);
  }

  function PriceTicker(props) {
    var items = props.items || [];
    function row(prefix) {
      return items.map(function (item, i) {
        return h("span", { key: prefix + i, className: "ezm-ticker__item" },
          h("span", { className: "ezm-ticker__symbol" }, item.symbol),
          h("span", { className: "ezm-ticker__value" }, item.value),
          item.delta != null ? h("span", { className: "ezm-ticker__delta", "data-tone": item.tone || undefined }, item.delta) : null);
      });
    }
    return h("div", { className: cx("ezm-ticker", props.className), "aria-label": props.label || "Prices" },
      h("div", { className: "ezm-marquee" },
        h("div", { className: "ezm-marquee__track" }, row("a"), row("b"))));
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

  window.EzyMap = { Button: Button, Card: Card, HeroPill: HeroPill, SignalFlag: SignalFlag, EzyMapLogo: EzyMapLogo, HudFrame: HudFrame, StatTile: StatTile, GridFloor: GridFloor, PriceTicker: PriceTicker };
})();
