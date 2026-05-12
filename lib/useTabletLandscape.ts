"use client";

import { useEffect, useState } from "react";

const TABLET_LANDSCAPE_QUERY = "(min-width: 1024px) and (max-width: 1279px)";
/** iPad portrait / narrow tablet — same ABOUT frame as Figma `833:218`, distinct from phone & desktop lg. */
const TABLET_PORTRAIT_QUERY = "(min-width: 768px) and (max-width: 1023px)";

export function useTabletLandscape() {
  const [isTabletLandscape, setIsTabletLandscape] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(TABLET_LANDSCAPE_QUERY);
    const apply = () => setIsTabletLandscape(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return isTabletLandscape;
}

export function useTabletPortrait() {
  const [isTabletPortrait, setIsTabletPortrait] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(TABLET_PORTRAIT_QUERY);
    const apply = () => setIsTabletPortrait(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return isTabletPortrait;
}

/** Телефон в альбоме: узкая высота viewport — герой без наложения заголовка на персонажа. Не iPad landscape (обычно ≥600px по высоте). */
const MOBILE_LANDSCAPE_QUERY = "(orientation: landscape) and (max-height: 560px)";

export function useMobileLandscape() {
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(MOBILE_LANDSCAPE_QUERY);
    const apply = () => setIsMobileLandscape(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return isMobileLandscape;
}
