"use client";
import { useEffect, useMemo, useRef, useState } from "react";

import { characters } from "@/lib/characters";
import { useScrollSteps } from "@/lib/useScrollSteps";
import { CharacterStage } from "@/components/CharacterStage";
import { Header } from "@/components/Header";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (full.length !== 6) return null;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

export function HeroScroller() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { activeIndex: scrollIndex, reduceMotion } = useScrollSteps({
    targetRef: sectionRef,
    steps: characters.length,
  });
  const activeIndex = isDesktop ? scrollIndex : mobileIndex;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  function scrollToIndex(index: number) {
    const i = Math.min(characters.length - 1, Math.max(0, index));
    if (!isDesktop) {
      setMobileIndex(i);
      return;
    }

    if (typeof window === "undefined") return;
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const maxScroll = Math.max(1, el.offsetHeight - window.innerHeight);
    // Jump to the middle of the step, so we cross `useScrollSteps` hysteresis thresholds.
    const progress = Math.min(0.999999, Math.max(0, (i + 0.5) / characters.length));
    const target = sectionTop + progress * maxScroll;

    window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
  }

  const accent = characters[activeIndex]?.roleColor ?? "#EBB55C";
  const accentRgb = useMemo(() => hexToRgb(accent), [accent]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--accent", accent);
    if (accentRgb) {
      document.documentElement.style.setProperty("--accent-rgb", `${accentRgb.r} ${accentRgb.g} ${accentRgb.b}`);
    }
  }, [accent, accentRgb]);

  return (
    <section
      ref={sectionRef}
      className={
        isDesktop
          ? "relative h-[400vh] lg:snap-start"
          : "relative isolate z-[35] min-h-[100svh] min-w-0"
      }
      aria-label="Hero"
    >
      {/* Sticky hero */}
      <div
        className={
          isDesktop
            ? "sticky top-0 h-screen overflow-hidden bg-[#F3F3F3]"
            : "flex min-h-[100svh] min-w-0 flex-col bg-[#F3F3F3]"
        }
      >
        <Header />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col lg:h-full lg:flex-none">
          <CharacterStage
            items={characters}
            activeIndex={activeIndex}
            reduceMotion={reduceMotion}
            onSelectIndex={scrollToIndex}
          />
        </div>
      </div>
    </section>
  );
}

