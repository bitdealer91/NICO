"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import type { Character } from "@/lib/characters";

type ArcNavProps = {
  items: Character[];
  activeIndex: number;
  onSelectIndex?: (index: number) => void;
  className?: string;
};

export function ArcNav({ items, activeIndex, onSelectIndex, className }: ArcNavProps) {
  const reduceMotion = !!useReducedMotion();
  const active = items[Math.min(items.length - 1, Math.max(0, activeIndex))];
  const activeRoleColor = active.roleColor ?? "#EBB55C";

  const clickTargetsById = useMemo(
    () =>
      ({
        // In ArcNav labels viewport coordinates (968x908), derived from the original label ring centroids.
        // These are only used for click hit-areas (they rotate together with the labels layer).
        thinker: { x: 473.3, y: 20.7, rotateDeg: 358.63 },
        builder: { x: 756.8, y: 110.5, rotateDeg: 395.92 },
        creator: { x: 929.5, y: 357.6, rotateDeg: 433.85 },
        launcher: { x: 907.1, y: 673.0, rotateDeg: 113.81 },
      }) satisfies Record<Character["id"], { x: number; y: number; rotateDeg: number }>,
    []
  );

  const viewportH = 255;
  // Match Figma spacing precisely:
  // In Figma (Desktop - 1):
  // - Ellipse 25 absoluteBoundingBox.y = 747
  // - Ellipse 25 absoluteRenderBounds.y = 577  -> render crop top offset = 170
  // - ring-stroke absoluteBoundingBox.y = 699.414 -> gap = 47.586
  // - ring-labels should be 66.54 above Ellipse 25 (dev-mode measurement)
  const ellipseCropTop = 170;
  const ellipseToStroke = 40;
  const ellipseToLabels = 60;

  const ellipseCircleTopY = ellipseCropTop;
  const strokeCircleTopY = ellipseCircleTopY - ellipseToStroke;
  const labelsCircleTopY = ellipseCircleTopY - ellipseToLabels;
  // Offset labels so the top of the arc sits ~31px above the dot.
  const labelsYOffset = -226;

  // For our exported ring layers, circle top point is at y = translateY + 65.4 (stroke top offset inside ring group).
  const strokeTranslateY = strokeCircleTopY - 65.4;
  const labelsTranslateY = labelsCircleTopY - 65.4 + labelsYOffset;

  // Dot sits at the circle top point (top-center of the visible arc).
  const dotY = strokeCircleTopY;

  const ringCenter = { x: 484.5, y: 486.5 };
  const ellipseColorTransition = reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeInOut" as const };
  const labelOffsetStep = 100 / items.length;

  // Shift labels along the fixed path so the active one sits at 50% (top of arc) without rotating the arc.
  const activeOffset = activeIndex * labelOffsetStep;
  const targetOffsetDelta = 50 - activeOffset; // move active to 50%

  const [animatedOffsetDelta, setAnimatedOffsetDelta] = useState(targetOffsetDelta);
  const offsetDeltaSpring = useSpring(targetOffsetDelta, {
    stiffness: 140,
    damping: 22,
    mass: 0.8,
  });

  useMotionValueEvent(offsetDeltaSpring, "change", (v) => {
    setAnimatedOffsetDelta(v);
  });

  useEffect(() => {
    if (reduceMotion) {
      setAnimatedOffsetDelta(targetOffsetDelta);
      offsetDeltaSpring.set(targetOffsetDelta);
    } else {
      offsetDeltaSpring.set(targetOffsetDelta);
    }
  }, [reduceMotion, targetOffsetDelta, offsetDeltaSpring]);

  const arcRadius = 420; // matches path radius in arcPath

  function normalizedOffset(percent: number) {
    const v = (percent + 100) % 100;
    return v < 0 ? v + 100 : v;
  }

  function offsetForIndex(i: number) {
    return normalizedOffset(i * labelOffsetStep + animatedOffsetDelta);
  }

  function pointOnArc(offsetPercent: number) {
    const t = offsetPercent / 100;
    // arc from left (pi) to right (0) over the upper semicircle
    const angle = Math.PI * (1 - t);
    const x = ringCenter.x + arcRadius * Math.cos(angle);
    const y = ringCenter.y - arcRadius * Math.sin(angle);
    return { x, y, angleDeg: (angle * 180) / Math.PI };
  }

  return (
    <div className={className}>
      {/* Viewport (matches the visible arc slice in the hero) */}
      <div className="relative mx-auto w-full overflow-visible" style={{ height: viewportH }}>
        {/* Ellipse base (Figma `Ellipse 25`) — should touch the bottom edge and extend wider than the ring */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0" aria-hidden="true">
          <div className="relative mx-auto h-[847px] w-[847px] max-w-[847px] overflow-hidden">
            <Image
              src="/figma/ellipse-base.png"
              alt=""
              fill
              priority
              className="relative z-10 object-contain"
              style={{ filter: "brightness(0)", objectPosition: "50% 100%" }}
            />

            <motion.div
              className="absolute left-1/2 pointer-events-none z-[11]"
              style={{
                width: 847,
                height: 847,
                transform: "translate(-50%, 105%)",
                boxShadow: `0 0 200px 10px ${activeRoleColor}, inset 0 0 50px 10px ${activeRoleColor}`,
                borderRadius: "9999px",
              }}
              animate={{
                boxShadow: `0 0 200px 10px ${activeRoleColor}, inset 0 0 50px 10px ${activeRoleColor}`,
              }}
              transition={ellipseColorTransition}
            />
          </div>
        </div>

        {/* Labels: curved SVG text aligned to the existing ring label position. */}
        <div
          className="absolute left-1/2 top-0 z-[4] h-[908px] w-[968px]"
          style={{ transform: `translate(-50%, ${labelsTranslateY}px)` }}
        >
          <svg
            viewBox="0 0 968 908"
            className="absolute inset-0 pointer-events-none overflow-visible"
            style={{ transformOrigin: `${ringCenter.x}px ${ringCenter.y}px` }}
            aria-hidden="true"
          >
            <defs>
              <path id="arcPath" d="M63 700 A420 420 0 0 1 905 700" fill="none" />
            </defs>

            {items.map((item, i) => {
              const startOffset = offsetForIndex(i);
              return (
              <text
                key={item.id}
                fontFamily="var(--font-nav), Oswald, sans-serif"
                fontWeight="700"
                fontSize="28"
                fill="white"
                opacity={item.id === active.id ? 1 : 0.35}
              >
                <textPath href="#arcPath" startOffset={`${startOffset}%`} textAnchor="middle">
                  {item.navLabel}
                </textPath>
              </text>
              );
            })}
          </svg>

          <div className="absolute inset-0" style={{ transformOrigin: `${ringCenter.x}px ${ringCenter.y}px` }}>
            {onSelectIndex
              ? items.map((item, index) => {
                  const startOffset = offsetForIndex(index);
                  const p = pointOnArc(startOffset);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectIndex(index)}
                      className={[
                        "absolute -translate-x-1/2 -translate-y-1/2 rounded-[14px]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90",
                      ].join(" ")}
                      style={{
                        left: p.x,
                        top: p.y,
                        width: 180,
                        height: 90,
                        transform: `translate(-50%, -50%) rotate(${p.angleDeg - 90}deg)`,
                        background: "transparent",
                      }}
                      aria-label={item.navLabel}
                    />
                  );
                })
              : null}
          </div>
        </div>

        {/* Ring stroke above labels */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-[6] h-[908px] w-[968px]"
          style={{ transform: `translate(-50%, ${strokeTranslateY}px)` }}
          aria-hidden="true"
        >
          <div className="absolute inset-0" style={{ transformOrigin: "484.5px 486.5px" }}>
            <div className="absolute" style={{ left: 63.4, top: 65.4, width: 842.2, height: 842.1, opacity: 0.95 }}>
              <Image src="/figma/ring-stroke.png" alt="" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Fixed indicator dot centered on the stroke */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-[7]" style={{ top: dotY }}>
          <div className="h-[10px] w-[10px] rounded-full bg-white shadow-[0_12px_40px_rgba(255,255,255,0.15)]" />
        </div>
      </div>
    </div>
  );
}

