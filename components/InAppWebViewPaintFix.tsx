"use client";

import { useLayoutEffect } from "react";

const BG = "#f3f3f3";
const FG = "#181818";

/**
 * In-app браузеры (X/Telegram и др.) иногда красят подложку под тёмную тему приложения
 * до/вместо наших стилей. Повторно фиксируем фон на первом кадре после гидрации.
 */
export function InAppWebViewPaintFix() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const apply = () => {
      root.style.setProperty("background-color", BG, "important");
      root.style.setProperty("color-scheme", "only light", "important");
      root.style.setProperty("color", FG, "important");
      body.style.setProperty("background-color", BG, "important");
      body.style.setProperty("color-scheme", "only light", "important");
      body.style.setProperty("color", FG, "important");
    };

    apply();
    const raf = requestAnimationFrame(apply);
    const t = window.setTimeout(apply, 0);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, []);

  return null;
}
