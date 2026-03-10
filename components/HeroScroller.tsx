"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

import { characters } from "@/lib/characters";
import { useScrollSteps } from "@/lib/useScrollSteps";
import { CharacterStage } from "@/components/CharacterStage";

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
  const bgVersion = "2026-02-25-bg-v2";
  const sectionRef = useRef<HTMLElement | null>(null);
  const { activeIndex, reduceMotion } = useScrollSteps({
    targetRef: sectionRef,
    steps: characters.length,
  });

  function scrollToIndex(index: number) {
    if (typeof window === "undefined") return;
    const el = sectionRef.current;
    if (!el) return;

    const i = Math.min(characters.length - 1, Math.max(0, index));
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
    <section ref={sectionRef} className="relative h-[400vh]" aria-label="Hero">
      {/* Sticky hero */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background (per character, full-viewport) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 flex h-full w-[400%]"
            animate={{ x: `-${activeIndex * 25}%` }}
            transition={
              reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 22, mass: 0.7 }
            }
          >
            {characters.map((c) => (
              <div key={c.id} className="relative h-full w-[25%] shrink-0">
                {c.figmaBgSrc ? (
                  <Image
                    src={`${c.figmaBgSrc}?v=${bgVersion}`}
                    alt=""
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                    sizes="100vw"
                  />
                ) : null}
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 h-full">
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

