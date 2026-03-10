"use client";

import { useEffect } from "react";

export function ScrollToTopOnLoad() {
  useEffect(() => {
    let cancelled = false;

    try {
      if (typeof history !== "undefined" && "scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
    } catch {
      // ignore
    }

    function forceTop() {
      if (cancelled) return;
      if (typeof window === "undefined") return;
      if (window.scrollY !== 0) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    // Prevent post-hydration scroll restoration jumping to step 2/3/4.
    // Some browsers restore scroll *after* hydration; we override it briefly until user interacts.
    const t0 = window.setTimeout(forceTop, 0);
    const t1 = window.setTimeout(forceTop, 60);
    const t2 = window.setTimeout(forceTop, 220);
    const t3 = window.setTimeout(forceTop, 520);

    const stop = () => {
      cancelled = true;
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("keydown", onKeyDown);
    };

    const onWheel = () => stop();
    const onTouchStart = () => stop();
    const onKeyDown = () => stop();

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return stop;
  }, []);

  return null;
}

