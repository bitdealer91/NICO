"use client";

import { useEffect, useState } from "react";

const PRELOADER_VIDEO_SRC = "/characters/videos/3D Carousel - Copy - Copy-3D Carousel-@4096x (6).mp4";
const MIN_PRELOADER_MS = 2000;

export function PagePreloader() {
  const [isActive, setIsActive] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const startedAt = Date.now();

    const completeLoading = () => {
      const elapsed = Date.now() - startedAt;
      const waitMs = Math.max(0, MIN_PRELOADER_MS - elapsed);
      window.setTimeout(() => {
        setIsFadingOut(true);
        window.setTimeout(() => setIsActive(false), 320);
      }, waitMs);
    };

    if (document.readyState === "complete") {
      completeLoading();
      return;
    }

    const onLoad = () => completeLoading();
    window.addEventListener("load", onLoad, { once: true });

    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const prevOverflow = document.body.style.overflow;
    if (isActive) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[9999] flex items-center justify-center bg-[#F3F3F3] transition-opacity duration-300",
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100",
      ].join(" ")}
      aria-hidden
    >
      <video className="h-full w-full object-cover" src={PRELOADER_VIDEO_SRC} autoPlay muted playsInline />
    </div>
  );
}
