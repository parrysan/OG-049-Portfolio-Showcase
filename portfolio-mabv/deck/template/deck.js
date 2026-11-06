// OGANIKO case-study deck — behaviour v1.0
// Deck mode on wide landscape screens: one slide at a time, scaled to fit, keyboard and swipe navigation, #n in the URL.
// Reading mode elsewhere: plain stacked sections, no script behaviour. ?print shows every slide at deck size for PDF export.
(() => {
  const root = document.documentElement;
  const slides = [...document.querySelectorAll(".slide")];
  const nav = document.querySelector(".deck-nav");
  const count = nav?.querySelector(".count");
  const prev = nav?.querySelector("[data-prev]");
  const next = nav?.querySelector("[data-next]");
  const wide = window.matchMedia("(min-width: 960px) and (min-aspect-ratio: 5/4)");
  const printAll = new URLSearchParams(location.search).has("print");
  let current = 0;
  let idleTimer = 0;

  const fit = () => {
    const k = Math.min(innerWidth / 1920, innerHeight / 1080);
    root.style.setProperty("--k", k);
    // Seat the nav in the letterbox below the slide when there is room; otherwise it floats over the slide corner.
    const band = (innerHeight - 1080 * k) / 2;
    root.style.setProperty("--nav-bottom", band >= 64 ? `${Math.round((band - 54) / 2)}px` : "16px");
  };
  const fromHash = () => {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), slides.length - 1) : 0;
  };

  function show(n) {
    current = Math.min(Math.max(n, 0), slides.length - 1);
    slides.forEach((s, i) => {
      const on = i === current;
      s.classList.toggle("is-current", on);
      s.toggleAttribute("inert", !on);
      s.setAttribute("aria-hidden", String(!on));
    });
    if (count) count.textContent = `${current + 1} / ${slides.length}`;
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === slides.length - 1;
    const hash = `#${current + 1}`;
    if (location.hash !== hash) history.replaceState(null, "", hash);
  }

  function release() {
    slides.forEach((s) => {
      s.classList.remove("is-current");
      s.removeAttribute("inert");
      s.removeAttribute("aria-hidden");
    });
  }

  function setMode() {
    const deck = printAll || wide.matches;
    root.classList.toggle("deck-mode", deck);
    root.classList.toggle("print-all", printAll);
    if (printAll) return release();
    if (deck) { fit(); show(fromHash()); } else { release(); }
  }

  // The nav stays visible until the viewer first moves or presses a key; after that it fades when idle.
  let interacted = false;
  function poke(fromUser = true) {
    interacted = interacted || fromUser;
    root.classList.remove("nav-idle");
    clearTimeout(idleTimer);
    if (interacted) idleTimer = setTimeout(() => root.classList.add("nav-idle"), 2200);
  }

  document.addEventListener("keydown", (e) => {
    if (!root.classList.contains("deck-mode") || printAll || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || (k === " " && !e.shiftKey)) show(current + 1);
    else if (k === "ArrowLeft" || k === "PageUp" || (k === " " && e.shiftKey)) show(current - 1);
    else if (k === "Home") show(0);
    else if (k === "End") show(slides.length - 1);
    else return;
    e.preventDefault();
    poke();
  });

  prev?.addEventListener("click", () => show(current - 1));
  next?.addEventListener("click", () => show(current + 1));

  let touchX = null;
  document.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (touchX === null || !root.classList.contains("deck-mode")) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  addEventListener("resize", () => { if (root.classList.contains("deck-mode") && !printAll) fit(); });
  addEventListener("hashchange", () => { if (root.classList.contains("deck-mode") && !printAll) show(fromHash()); });
  addEventListener("mousemove", poke, { passive: true });
  wide.addEventListener("change", setMode);

  // Browser printing from either mode: show every slide at deck size, then restore.
  let modeBeforePrint = null;
  addEventListener("beforeprint", () => {
    modeBeforePrint = { deck: root.classList.contains("deck-mode"), slide: current };
    root.classList.add("deck-mode", "print-all");
    release();
  });
  addEventListener("afterprint", () => {
    root.classList.remove("print-all");
    if (modeBeforePrint && !modeBeforePrint.deck) root.classList.remove("deck-mode");
    setMode();
    if (modeBeforePrint?.deck) show(modeBeforePrint.slide);
  });

  setMode();
  poke(false);

  // ?print&measure: record every slide's text, images and shapes at their rendered positions, for pptx.mjs.
  if (printAll && new URLSearchParams(location.search).has("measure")) {
    document.fonts.ready.then(() => setTimeout(() => {
      const out = document.createElement("script");
      out.type = "application/json";
      out.id = "deck-measure";
      out.textContent = JSON.stringify(slides.map(measureSlide)).replace(/</g, "\\u003c");
      document.body.append(out);
    }, 300));
  }

  function measureSlide(slide) {
    const origin = slide.getBoundingClientRect();
    const items = [];
    const box = (r) => ({ x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height });
    const visible = (el) => { const cs = getComputedStyle(el); return cs.display !== "none" && cs.visibility !== "hidden" && el.getClientRects().length > 0; };
    const isBlock = (el) => !["inline", "contents"].includes(getComputedStyle(el).display);
    const px = (v) => parseFloat(v) || 0;
    const clear = (c) => !c || c === "transparent" || /rgba\(.*,\s*0\)$/.test(c);

    function shapesFor(el, cs, r) {
      if (!clear(cs.backgroundColor) && r.width > 0 && r.height > 0) items.push({ t: "rect", ...box(r), fill: cs.backgroundColor });
      for (const side of ["Top", "Right", "Bottom", "Left"]) {
        const w = px(cs[`border${side}Width`]);
        if (!w || cs[`border${side}Style`] === "none" || el.tagName === "IMG") continue;
        const b = box(r);
        const line = { t: "line", color: cs[`border${side}Color`], weight: w };
        if (side === "Top") items.push({ ...line, x: b.x, y: b.y + w / 2, w: b.w, h: 0 });
        if (side === "Bottom") items.push({ ...line, x: b.x, y: b.y + b.h - w / 2, w: b.w, h: 0 });
        if (side === "Left") items.push({ ...line, x: b.x + w / 2, y: b.y, w: 0, h: b.h });
        if (side === "Right") items.push({ ...line, x: b.x + b.w - w / 2, y: b.y, w: 0, h: b.h });
      }
    }

    function runsOf(el) {
      const runs = [];
      const walk = (node) => {
        for (const n of node.childNodes) {
          if (n.nodeType === 3) {
            const text = n.textContent.replace(/\s+/g, " ");
            if (!text.trim() && !runs.length) continue;
            const cs = getComputedStyle(n.parentElement);
            runs.push({
              text: cs.textTransform === "uppercase" ? text.toUpperCase() : text,
              font: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
              size: px(cs.fontSize), weight: Number(cs.fontWeight), color: cs.color,
              tracking: cs.letterSpacing === "normal" ? 0 : px(cs.letterSpacing),
              href: n.parentElement.closest("a")?.href ?? null,
            });
          } else if (n.nodeType === 1 && !isBlock(n) && visible(n)) walk(n);
        }
      };
      walk(el);
      if (runs.length) runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/\s+$/, "");
      if (runs.length) runs[0].text = runs[0].text.replace(/^\s+/, "");
      return runs.filter((r) => r.text);
    }

    function visit(el) {
      if (!visible(el)) return;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      shapesFor(el, cs, r);
      if (el.tagName === "IMG") {
        const bw = px(cs.borderTopWidth);
        if (bw) items.push({ t: "rect", ...box(r), fill: cs.borderTopColor });
        const inner = { x: r.left + bw, y: r.top + bw, width: r.width - 2 * bw, height: r.height - 2 * bw };
        const ow = px(cs.outlineWidth);
        items.push({ t: "img", ...box({ left: inner.x, top: inner.y, width: inner.width, height: inner.height }), src: el.getAttribute("src"), alt: el.alt, fit: cs.objectFit, outline: ow && cs.outlineStyle !== "none" ? { color: cs.outlineColor, weight: ow, ...box(r) } : null });
        return;
      }
      if (el.tagName.toLowerCase() === "svg") {
        const svgBox = box(r);
        if (el.classList.contains("callout-lines")) {
          for (const n of el.querySelectorAll("line, circle")) {
            const ns = getComputedStyle(n);
            if (n.tagName === "line") items.push({ t: "line", x: svgBox.x + +n.getAttribute("x1"), y: svgBox.y + +n.getAttribute("y1"), w: +n.getAttribute("x2") - +n.getAttribute("x1"), h: +n.getAttribute("y2") - +n.getAttribute("y1"), color: ns.stroke, weight: px(ns.strokeWidth) });
            else { const cr = +n.getAttribute("r"); items.push({ t: "dot", x: svgBox.x + +n.getAttribute("cx") - cr, y: svgBox.y + +n.getAttribute("cy") - cr, w: 2 * cr, h: 2 * cr, fill: ns.fill, stroke: ns.stroke, weight: px(ns.strokeWidth) }); }
          }
        } else {
          const clone = el.cloneNode(true);
          clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          [...el.querySelectorAll("path")].forEach((p, i) => clone.querySelectorAll("path")[i].setAttribute("fill", getComputedStyle(p).fill));
          items.push({ t: "svg", ...svgBox, markup: clone.outerHTML });
        }
        return;
      }
      const hasOwnText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const inlineOnly = [...el.children].every((c) => !isBlock(c));
      if (isBlock(el) && (hasOwnText || (inlineOnly && el.textContent.trim()))) {
        const runs = runsOf(el);
        if (runs.length) {
          const pl = px(cs.paddingLeft), pt = px(cs.paddingTop), pr = px(cs.paddingRight), pb = px(cs.paddingBottom);
          const b = box(r);
          if (!inlineOnly) {
            // Mixed content (a block label plus loose text): place the box where the loose text actually renders.
            const rects = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).flatMap((n) => { const rg = document.createRange(); rg.selectNodeContents(n); return [...rg.getClientRects()]; });
            const top = Math.min(...rects.map((x) => x.top)), bottom = Math.max(...rects.map((x) => x.bottom));
            b.y = top - origin.top - pt; b.h = bottom - top + pt + pb;
          }
          items.push({ t: "text", x: b.x + pl, y: b.y + pt, w: b.w - pl - pr, h: b.h - pt - pb, runs, lineHeight: cs.lineHeight === "normal" ? px(cs.fontSize) * 1.36 : px(cs.lineHeight), align: cs.textAlign, tag: el.tagName.toLowerCase(), cls: el.className });
        }
        if (inlineOnly) return;
      }
      for (const c of el.children) visit(c);
    }

    for (const c of slide.children) visit(c);
    return { id: slide.id, label: slide.getAttribute("aria-label"), items };
  }
})();
