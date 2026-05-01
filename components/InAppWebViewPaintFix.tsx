"use client";

import { useLayoutEffect } from "react";

const BG_DOC = "#ffffff";

/**
 * In-app WebView / Force Dark может перезаписать стили после гидрации.
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

      body.style.setProperty("background-color", BG_DOC, "important");
      body.style.setProperty("color-scheme", "only light", "important");
      body.style.setProperty("color", fg, "important");

      const shell = document.getElementById("nico-app-shell");
      if (shell) {
        shell.style.setProperty("background-color", "#f3f3f3", "important");
        shell.style.setProperty("color-scheme", "only light", "important");
      }
    };

    apply();
    const raf = requestAnimationFrame(apply);
    const t = window.setTimeout(apply, 0);
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    mq?.addEventListener?.("change", apply);
    return () => {
      mq?.removeEventListener?.("change", apply);
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, []);

  return null;
}
