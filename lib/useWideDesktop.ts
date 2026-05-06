"use client";

import { useEffect, useState } from "react";

const WIDE_QUERY = "(min-width: 1920px)";

export function useWideDesktop() {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(WIDE_QUERY);
    const apply = () => setIsWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return isWide;
}
