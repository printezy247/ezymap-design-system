/* @ds-bundle: {"format":4,"namespace":"EzyMap","components":[{"name":"Button"},{"name":"Card"},{"name":"HeroPill"},{"name":"SignalFlag"},{"name":"EzyMapLogo"},{"name":"HudFrame"},{"name":"StatTile"},{"name":"GridFloor"},{"name":"PriceTicker"},{"name":"Tilt"},{"name":"Reveal"},{"name":"ProductIcon"},{"name":"LiveBadge"},{"name":"Marquee"},{"name":"Skeleton"},{"name":"GlowCard"},{"name":"CardStack"},{"name":"CursorSpotlight"},{"name":"Carousel3D"},{"name":"Coin3D"},{"name":"Parallax3D"}]} */
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

  function Tilt(props) {
    var ref = React.useRef(null);
    var reduceRef = React.useRef(false);
    React.useEffect(function () {
      var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      reduceRef.current = mq.matches;
      function on() { reduceRef.current = mq.matches; }
      if (mq.addEventListener) mq.addEventListener("change", on); else mq.addListener(on);
      return function () { if (mq.removeEventListener) mq.removeEventListener("change", on); else mq.removeListener(on); };
    }, []);
    var max = props.max != null ? props.max : 10;
    var scale = props.scale != null ? props.scale : 1.02;
    var persp = props.perspective || 900;
    var rest = omit(props, ["max", "scale", "perspective", "disabled", "className", "style", "children", "onPointerMove", "onPointerLeave"]);
    rest.ref = ref;
    rest.className = cx("ezm-tilt-el", props.className);
    rest.style = Object.assign({ transformStyle: "preserve-3d", willChange: "transform" }, props.style);
    rest.onPointerMove = function (e) {
      if (props.onPointerMove) props.onPointerMove(e);
      var el = ref.current;
      if (!el || props.disabled || reduceRef.current) return;
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--mx", (px + 0.5) * 100 + "%");
      el.style.setProperty("--my", (py + 0.5) * 100 + "%");
      el.style.transition = "transform 60ms linear";
      el.style.transform = "perspective(" + persp + "px) rotateX(" + (-py * max).toFixed(2) + "deg) rotateY(" + (px * max).toFixed(2) + "deg) scale(" + scale + ")";
    };
    rest.onPointerLeave = function (e) {
      if (props.onPointerLeave) props.onPointerLeave(e);
      var el = ref.current;
      if (!el) return;
      el.style.transition = "transform var(--duration-base) var(--ease-emphasized)";
      el.style.transform = "";
    };
    return h("div", rest, props.children);
  }
  Tilt.displayName = "Tilt";

  function Reveal(props) {
    var ref = React.useRef(null);
    var once = props.once !== false;
    var delay = props.delay || 0;
    var rest = omit(props, ["delay", "once", "className", "style", "children"]);
    rest.ref = ref;
    rest.className = props.className;
    var inline = {};
    for (var k in props.style) inline[k] = props.style[k];
    if (delay) inline["--reveal-delay"] = delay + "ms";
    rest.style = inline;
    React.useEffect(function () {
      var el = ref.current;
      if (!el) return;
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || typeof IntersectionObserver === "undefined") { el.classList.add("is-inview"); return; }
      document.documentElement.classList.add("js");
      el.classList.add("ezm-js-reveal");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove("is-inview");
          }
        });
      }, { threshold: 0.15 });
      io.observe(el);
      return function () { io.disconnect(); };
    }, [once]);
    return h("div", rest, props.children);
  }
  Reveal.displayName = "Reveal";

  var PRODUCT_FILES = {
    channel: "ezymap-channel-icon", miniapp: "ezymap-miniapp-icon", bot: "ezymap-bot-icon",
    ticker: "ezymap-ticker-icon", calculators: "ezymap-calculators-icon", exchanges: "ezymap-exchanges-icon",
    pro: "ezymap-pro-icon", ebooks: "ezymap-ebooks-icon", "macro-bot": "ezymap-macro-bot-icon",
    crypto: "ezymap-crypto-icon", forex: "ezymap-forex-icon"
  };
  var PRODUCT_LABELS = {
    channel: "EzyMap channel", miniapp: "EzyMap Mini App", bot: "EzyMap gated bot",
    ticker: "EzyMap live ticker", calculators: "EzyMap calculators", exchanges: "EzyMap exchanges and bots",
    pro: "EzyMapPro", ebooks: "EzyMap ebooks", "macro-bot": "EzyMap Macro Bot",
    crypto: "EzyMap crypto", forex: "EzyMap forex"
  };
  function ProductIcon(props) {
    var product = props.product || "channel";
    var variant = props.variant || "default";
    var basePath = (props.basePath || "assets/products").replace(/\/$/, "");
    var suffix = variant === "default" ? "" : "-" + variant;
    var rest = omit(props, ["product", "src", "variant", "basePath", "alt", "className"]);
    rest.className = cx("ezm-product-icon", props.className);
    rest.src = props.src || (basePath + "/" + PRODUCT_FILES[product] + suffix + ".svg");
    rest.alt = props.alt != null ? props.alt : PRODUCT_LABELS[product];
    if (!rest.loading) rest.loading = "lazy";
    if (!rest.decoding) rest.decoding = "async";
    return h("img", rest);
  }
  ProductIcon.displayName = "ProductIcon";

  function LiveBadge(props) {
    var ping = props.ping !== false;
    var rest = omit(props, ["ping", "className", "children"]);
    rest.className = cx("ezm-live-badge", ping && "ezm-live-ping", ping && "is-live", props.className);
    return h("span", rest,
      h("span", { className: "ezm-live-badge__dot", "aria-hidden": true }),
      props.children != null ? props.children : "Live");
  }
  LiveBadge.displayName = "LiveBadge";

  function Marquee(props) {
    var direction = props.direction || "left";
    var duration = props.duration || 32;
    var pauseOnHover = props.pauseOnHover !== false;
    var rest = omit(props, ["direction", "duration", "pauseOnHover", "label", "className", "style", "children"]);
    rest.className = cx("ezm-marquee", direction === "right" && "ezm-marquee-reverse", !pauseOnHover && "ezm-marquee--always", props.className);
    if (props.label) { rest.role = "region"; rest["aria-label"] = props.label; }
    var inline = {};
    for (var k in props.style) inline[k] = props.style[k];
    if (duration !== 32) inline["--marquee-duration"] = duration + "s";
    rest.style = inline;
    var kids = props.children;
    return h("div", rest,
      h("div", { className: "ezm-marquee__track" }, kids, h("span", { className: "ezm-marquee__dup", "aria-hidden": true }, kids)));
  }
  Marquee.displayName = "Marquee";

  var len = function (v, d) { return v == null ? d : typeof v === "number" ? v + "px" : v; };
  function Skeleton(props) {
    var lines = props.lines || 1;
    var width = len(props.width, "100%");
    var height = len(props.height, lines > 1 ? "14px" : "16px");
    var rest = omit(props, ["width", "height", "lines", "className", "style"]);
    if (lines > 1) {
      var bars = [];
      for (var i = 0; i < lines; i++) {
        bars.push(h("span", { key: i, className: "ezm-skeleton ezm-skeleton--line",
          style: { width: i === lines - 1 ? "62%" : width, height: height } }));
      }
      rest.className = cx("ezm-skeleton-lines", props.className);
      return h("div", rest, bars);
    }
    rest.className = cx("ezm-skeleton", props.className);
    var inline = {};
    for (var s in props.style) inline[s] = props.style[s];
    inline.width = width; inline.height = height;
    rest.style = inline;
    return h("span", rest);
  }
  Skeleton.displayName = "Skeleton";

  function GlowCard(props) {
    var rest = omit(props, ["variant", "eyebrow", "title", "className", "children"]);
    rest.className = cx("ezm-card", "ezm-glow-card", props.variant === "beam" ? "ezm-beam" : "ezm-glow", props.className);
    return h("div", rest,
      props.eyebrow ? h("p", { className: "ezm-card__eyebrow" }, props.eyebrow) : null,
      props.title ? h("h3", { className: "ezm-card__title" }, props.title) : null,
      props.children);
  }
  GlowCard.displayName = "GlowCard";

  function CardStack(props) {
    var visible = (props.items || []).slice(0, Math.max(1, props.max != null ? props.max : 3));
    var rest = omit(props, ["items", "max", "gap", "className", "style", "children"]);
    rest.className = cx("ezm-stack-3d", props.className);
    rest.style = Object.assign({ gap: (props.gap != null ? props.gap : 10) + "px" }, props.style);
    rest.children = visible.map(function (item, i) {
      return h("div", { key: i, className: "ezm-stack-item" },
        h("div", { className: "ezm-stack-card" },
          item.title != null ? h("h4", { className: "ezm-stack-card__title" }, item.title) : null,
          item.subtitle != null ? h("p", { className: "ezm-stack-card__subtitle" }, item.subtitle) : null));
    });
    return h("div", rest);
  }
  CardStack.displayName = "CardStack";

  function CursorSpotlight(props) {
    var ref = React.useRef(null);
    var xy = React.useState([50, 50]);
    var x = xy[0], setXy = xy[1];
    React.useEffect(function () {
      var el = ref.current;
      if (!el || typeof document === "undefined") return;
      function on(e) {
        var r = el.getBoundingClientRect();
        if (!r.width) return;
        setXy([
          Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
          Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100))
        ]);
      }
      document.addEventListener("pointermove", on);
      return function () { document.removeEventListener("pointermove", on); };
    }, []);
    var rest = omit(props, ["className", "style"]);
    rest.ref = ref;
    rest.className = cx("ezm-cursor-spotlight", props.className);
    rest.style = Object.assign({ "--mx": x[0] + "%", "--my": x[1] + "%" }, props.style);
    return h("div", rest, props.children);
  }
  CursorSpotlight.displayName = "CursorSpotlight";

  function Carousel3D(props) {
    var itemW = props.itemWidth != null ? props.itemWidth : 160;
    var itemH = props.itemHeight != null ? props.itemHeight : 200;
    var items = props.items || [];
    var n = Math.max(1, items.length);
    var rest = omit(props, ["items", "itemWidth", "itemHeight", "className", "style"]);
    rest.className = cx("ezm-carousel-3d", props.className);
    rest.style = Object.assign({ "--item-w": itemW + "px", "--item-h": itemH + "px" }, props.style);
    rest.children = h("div", { className: "ezm-carousel-3d__ring", style: { "--n": n } },
      items.map(function (item, i) {
        return h("div", { key: i, className: "ezm-carousel-3d__item", style: { "--i": i } },
          item.title != null ? h("h4", { className: "ezm-carousel-3d__title" }, item.title) : null,
          item.subtitle != null ? h("p", { className: "ezm-carousel-3d__subtitle" }, item.subtitle) : null);
      }));
    return h("div", rest);
  }
  Carousel3D.displayName = "Carousel3D";

  function Coin3D(props) {
    var rest = omit(props, ["size", "className", "style"]);
    rest.className = cx("ezm-coin-3d", props.className);
    rest.style = Object.assign({ "--size": (props.size != null ? props.size : 72) + "px" }, props.style);
    return h("span", rest, props.children);
  }
  Coin3D.displayName = "Coin3D";

  function Parallax3D(props) {
    var ref = React.useRef(null);
    var rest = omit(props, ["className", "style", "onPointerMove", "onPointerLeave"]);
    function clamp(v) { return Math.min(1, Math.max(-1, v)); }
    function move(e) {
      var el = ref.current;
      if (el) {
        var r = el.getBoundingClientRect();
        if (r.width && r.height) {
          el.style.setProperty("--px", clamp(((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
          el.style.setProperty("--py", clamp(((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
        }
      }
      if (props.onPointerMove) props.onPointerMove(e);
    }
    function leave(e) {
      var el = ref.current;
      if (el) { el.style.setProperty("--px", "0"); el.style.setProperty("--py", "0"); }
      if (props.onPointerLeave) props.onPointerLeave(e);
    }
    rest.ref = ref;
    rest.className = cx("ezm-parallax-3d", props.className);
    rest.style = props.style;
    rest.onPointerMove = move;
    rest.onPointerLeave = leave;
    return h("div", rest, props.children);
  }
  Parallax3D.displayName = "Parallax3D";

  window.EzyMap = { Button: Button, Card: Card, HeroPill: HeroPill, SignalFlag: SignalFlag, EzyMapLogo: EzyMapLogo, HudFrame: HudFrame, StatTile: StatTile, GridFloor: GridFloor, PriceTicker: PriceTicker, Tilt: Tilt, Reveal: Reveal, ProductIcon: ProductIcon, LiveBadge: LiveBadge, Marquee: Marquee, Skeleton: Skeleton, GlowCard: GlowCard, CardStack: CardStack, CursorSpotlight: CursorSpotlight, Carousel3D: Carousel3D, Coin3D: Coin3D, Parallax3D: Parallax3D };
})();
