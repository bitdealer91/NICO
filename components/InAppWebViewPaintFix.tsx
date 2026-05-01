"use client";

import { useLayoutEffect } from "react";

const BG = "#ffffff";

/**
 * In-app WebView может перезаписать стили после гидрации. Дублируем фикс фона/meta-схемы с !important.
 */
export function InAppWebViewPaintFix() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const apply = () => {
      const dark =
        typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const fg = dark ? "#111111" : "#181818";

      root.style.setProperty("background", BG, "important");
      root.style.setProperty("color-scheme", "light", "important");
      root.style.setProperty("color", fg, "important");

      body.style.setProperty("background", BG, "important");
      body.style.setProperty("color-scheme", "light", "important");
      body.style.setProperty("color", fg, "important");
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
