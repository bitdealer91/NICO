"use client";

import { useLayoutEffect } from "react";

const BG_DOC = "#ffffff";
const BG_APP = "#f3f3f3";

function stampShellElements() {
  const shell = document.getElementById("nico-app-shell");
  if (shell) {
    shell.style.setProperty("background-color", BG_APP, "important");
    shell.style.setProperty("color-scheme", "only light", "important");
  }

  const stamp = (nodes: Iterable<Element>) => {
    for (const el of nodes) {
      if (el.tagName === "SCRIPT" || el.tagName === "STYLE" || el.tagName === "SVG") continue;
      const node = el as HTMLElement;
      node.style.setProperty("background-color", BG_APP, "important");
      node.style.setProperty("color-scheme", "only light", "important");
    }
  };

  stamp(document.querySelectorAll(".nico-app-page"));
  stamp(document.querySelectorAll("main"));
  stamp(document.querySelectorAll("footer"));
  stamp(document.querySelectorAll("section"));
}

/**
 * Samsung Internet «Force Dark» и часть in-app WebView перезаписывают стили после первой отрисовки.
 * Повторно фиксируем + на коротком окне ловим мутации атрибутов / шевеление head.
 */
export function InAppWebViewPaintFix() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const apply = () => {
      const dark =
        typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const fg = dark ? "#111111" : "#181818";

      root.style.setProperty("background-color", BG_DOC, "important");
      root.style.setProperty("color-scheme", "only light", "important");
      root.style.setProperty("color", fg, "important");
      root.style.setProperty("filter", "none", "important");

      body.style.setProperty("background-color", BG_DOC, "important");
      body.style.setProperty("color-scheme", "only light", "important");
      body.style.setProperty("color", fg, "important");
      body.style.setProperty("filter", "none", "important");

      stampShellElements();
    };

    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        apply();
      });
    };

    apply();
    schedule();

    const raf = requestAnimationFrame(() => apply());
    const t = window.setTimeout(apply, 0);

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    mq?.addEventListener?.("change", apply);

    const onVisible = () => {
      if (document.visibilityState === "visible") apply();
    };
    document.addEventListener("visibilitychange", onVisible);

    const interval = window.setInterval(apply, 250);

    const attrObserver = new MutationObserver(schedule);
    attrObserver.observe(root, { attributes: true, attributeFilter: ["style", "class"] });
    attrObserver.observe(body, { attributes: true, attributeFilter: ["style", "class"] });

    const headObserver = new MutationObserver(schedule);
    headObserver.observe(document.head, { childList: true, subtree: false });

    const stopAggressive = window.setTimeout(() => {
      window.clearInterval(interval);
      headObserver.disconnect();
      attrObserver.disconnect();
      apply();
    }, 12_000);

    return () => {
      mq?.removeEventListener?.("change", apply);
      document.removeEventListener("visibilitychange", onVisible);
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.clearInterval(interval);
      attrObserver.disconnect();
      headObserver.disconnect();
      window.clearTimeout(stopAggressive);
    };
  }, []);

  return null;
}
