"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import type { Character } from "@/lib/characters";
import { ArcNav } from "@/components/ArcNav";

type CharacterStageProps = {
  items: Character[];
  activeIndex: number;
  reduceMotion?: boolean;
  onSelectIndex?: (index: number) => void;
};

function CharacterVisual({
  videoSrc,
  src,
  id,
  reduceMotion,
  scale = 1,
  translateY = 0,
  /** When true, parent supplies exact Figma slot size (840×840 desktop). */
  fillSlot = false,
}: {
  videoSrc?: string;
  src: string;
  id: string;
  reduceMotion?: boolean;
  scale?: number;
  translateY?: number;
  fillSlot?: boolean;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const placeholder = useMemo(() => {
    const map: Record<string, string> = {
      thinker: "from-amber-300/35 via-yellow-200/20 to-white/5",
      builder: "from-cyan-300/30 via-sky-200/20 to-white/5",
      maker: "from-fuchsia-300/30 via-purple-200/20 to-white/5",
      launcher: "from-rose-300/30 via-orange-200/20 to-white/5",
    };
    return map[id] ?? "from-white/15 via-white/10 to-white/5";
  }, [id]);

  const outerClass = fillSlot
    ? "relative h-full w-full"
    : "relative mx-auto w-[min(84vw,840px)] lg:h-[840px] lg:w-[840px]";

  return (
    <div className={outerClass}>
      {/* isolate + explicit #F3F3F3 under the media: transform() creates a stacking context, so mix-blend
          must blend against a real layer inside this subtree, not "through" to the hero background. */}
      <div
        className="relative isolate aspect-square w-full"
        style={{ transform: `translateY(${translateY}px) scale(${scale})` }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-[#F3F3F3]" aria-hidden />
        {videoSrc && !videoFailed ? (
          <video
            className="absolute inset-0 z-[1] h-full w-full object-contain object-center mix-blend-darken"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoFailed(true)}
          />
        ) : !imageFailed ? (
          <div className="absolute inset-0 z-[1]">
            <Image
              src={src}
              alt=""
              fill
              priority
              className="object-contain object-center mix-blend-darken"
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_45%_25%,rgba(255,255,255,0.22),transparent_62%)]" />
            <div className={["absolute inset-0 bg-gradient-to-b", placeholder].join(" ")} />
            <div className="absolute bottom-12 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-black/30 blur-2xl" />
          </div>
        )}

        {/* subtle float */}
        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}

function SideCharacterPreview({ item }: { item: Character }) {
  const [failed, setFailed] = useState(false);
  const src = item.mobileVideoSrc ?? item.videoSrc;

  return (
    <div className="absolute inset-0 isolate">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#F3F3F3]" aria-hidden />
      {!failed && src ? (
        <video
          className="absolute inset-0 z-[1] h-full w-full object-contain object-bottom mix-blend-darken"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setFailed(true)}
        />
      ) : (
        <Image src={item.imageSrc} alt="" fill sizes="180px" className="object-contain object-bottom mix-blend-darken" />
      )}
    </div>
  );
}

export function CharacterStage({ items, activeIndex, reduceMotion, onSelectIndex }: CharacterStageProps) {
  const active = items[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;
  const prev = hasPrev ? items[activeIndex - 1] : null;
  const next = hasNext ? items[activeIndex + 1] : null;
  const mobileVideoFor = (item: Character | null) => item?.mobileVideoSrc ?? item?.videoSrc;
  const sideSizeByActive: Record<
    Character["id"],
    {
      h: number;
      w: number;
      xShift: string;
      y: string;
      opacity: string;
      stageH: number;
      activeScale: number;
      activeY: number;
      arcBottom: number;
      arcH: number;
      textBottom: number;
    }
  > = {
    thinker: { h: 320, w: 188, xShift: "22%", y: "44%", opacity: "0.96", stageH: 520, activeScale: 1.2, activeY: 34, arcBottom: -42, arcH: 300, textBottom: 44 },
    builder: { h: 320, w: 188, xShift: "22%", y: "44%", opacity: "0.96", stageH: 520, activeScale: 1.2, activeY: 34, arcBottom: -42, arcH: 300, textBottom: 44 },
    creator: { h: 320, w: 188, xShift: "22%", y: "44%", opacity: "0.96", stageH: 520, activeScale: 1.2, activeY: 34, arcBottom: -42, arcH: 300, textBottom: 44 },
    launcher: { h: 320, w: 188, xShift: "22%", y: "44%", opacity: "0.96", stageH: 520, activeScale: 1.2, activeY: 34, arcBottom: -42, arcH: 300, textBottom: 44 },
  };
  const sideCfg = sideSizeByActive[active.id];

  return (
    <div className="relative mx-auto h-full w-full max-w-[1440px]">
      {/* Desktop (pixel-ish to Figma) */}
      <div className="hidden h-full lg:block">
        <h1
          className={[
            "absolute left-[40px] top-[321px] z-30 select-none",
            "text-[#181818]",
            "tracking-[-0.023em] leading-[0.82]",
          ].join(" ")}
        >
          <div className="font-display text-[150px]">THE</div>
          <div className="font-display text-[150px]">LAUNCH</div>
          <div className="font-accent text-[150px]" style={{ color: active.roleColor ?? "var(--gold)" }}>
            CREW
          </div>
        </h1>

        {/* Figma 4:279 — `424:1013`: (306, 82) 840×840 on 1440×900; scale x/w with container, fixed top */}
        <div className="absolute left-[21.25%] top-[82px] z-10 aspect-square w-[58.3333333%] max-w-[840px]">
          {reduceMotion ? (
            <CharacterVisual
              fillSlot
              videoSrc={active.videoSrc}
              src={active.imageSrc}
              id={active.id}
              reduceMotion
              scale={active.stageScale}
              translateY={active.stageTranslateY}
            />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                className="h-full w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <CharacterVisual
                  fillSlot
                  videoSrc={active.videoSrc}
                  src={active.imageSrc}
                  id={active.id}
                  scale={active.stageScale}
                  translateY={active.stageTranslateY}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Figma `49:1148` Crew info: (1144, 325) w=261 on 1440 canvas */}
        <div className="absolute left-[79.4444444%] top-[325px] z-30 w-[18.125%] max-w-[261px]">
          {reduceMotion ? (
            <>
              <div
                className="font-display text-[40px] leading-[60px] tracking-[-0.023em]"
                style={{ color: active.roleColor ?? "var(--gold)" }}
              >
                {active.roleTitle}
              </div>
              <div className="mt-[24px] whitespace-pre-line font-sans text-[25px] leading-[37.5px] tracking-[-0.023em] text-[#181818]">
                {active.roleBody.join("\n\n")}
              </div>
            </>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[40px] leading-[60px] tracking-[-0.023em] uppercase"
                  style={{ color: active.roleColor ?? "var(--gold)" }}
                >
                  {active.roleTitle}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
                  className="mt-[24px] whitespace-pre-line font-sans text-[25px] leading-[37.5px] tracking-[-0.023em] text-[#181818]"
                >
                  {active.roleBody.join("\n\n")}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="absolute left-1/2 bottom-[0px] z-50 w-[1187px] max-w-[calc(100vw-80px)] -translate-x-1/2">
          <ArcNav items={items} activeIndex={activeIndex} onSelectIndex={onSelectIndex} />
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="lg:hidden relative mx-auto h-full w-full overflow-visible">
        <div className="relative z-10 px-4 pt-[clamp(90px,16vh,124px)] text-center">
          <div className="select-none leading-[0.86] tracking-[-0.023em]">
            <div className="font-bold text-[#181818]" style={{ fontFamily: "var(--font-nav)", fontSize: "var(--mobile-hero-title-size)" }}>
              THE
            </div>
            <div className="font-bold text-[#181818]" style={{ fontFamily: "var(--font-nav)", fontSize: "var(--mobile-hero-title-size)" }}>
              LAUNCH
            </div>
            <div
              className="font-bold"
              style={{ color: active.roleColor ?? "var(--gold)", fontFamily: "var(--font-nav)", fontSize: "var(--mobile-hero-title-size)" }}
            >
              CREW
            </div>
          </div>
        </div>

        <div
          className="relative z-10 mx-auto mt-0 w-full max-w-[430px] overflow-visible px-2"
          style={{ height: "clamp(440px, 55vh, 520px)", maxWidth: "min(430px, calc(100vw - 8px))" }}
        >
          <div
            className="pointer-events-none absolute inset-x-[-12px] z-[8] flex -translate-y-1/2 justify-between px-0"
            style={{ top: sideCfg.y, opacity: Number(sideCfg.opacity) }}
          >
            {prev ? (
              <div
                className="relative"
                style={{
                  height: sideCfg.h,
                  width: sideCfg.w,
                  transform: `translateX(-${sideCfg.xShift})`,
                }}
              >
                <SideCharacterPreview item={prev} />
              </div>
            ) : (
              <div style={{ width: sideCfg.w }} />
            )}
            {next ? (
              <div
                className="relative"
                style={{
                  height: sideCfg.h,
                  width: sideCfg.w,
                  transform: `translateX(${sideCfg.xShift})`,
                }}
              >
                <SideCharacterPreview item={next} />
              </div>
            ) : (
              <div style={{ width: sideCfg.w }} />
            )}
          </div>
          {reduceMotion ? (
            <CharacterVisual
              videoSrc={mobileVideoFor(active)}
              src={active.imageSrc}
              id={active.id}
              reduceMotion
              scale={sideCfg.activeScale}
              translateY={sideCfg.activeY}
            />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                className="relative z-10"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  const threshold = 40;
                  if (info.offset.x <= -threshold && hasNext) onSelectIndex?.(activeIndex + 1);
                  if (info.offset.x >= threshold && hasPrev) onSelectIndex?.(activeIndex - 1);
                }}
              >
                <CharacterVisual
                  videoSrc={mobileVideoFor(active)}
                  src={active.imageSrc}
                  id={active.id}
                  scale={sideCfg.activeScale}
                  translateY={sideCfg.activeY}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="absolute inset-x-0 z-20" style={{ bottom: sideCfg.arcBottom }}>
          <div className="mx-auto w-[140%] -translate-x-[14.5%] rounded-t-[50%] bg-[#F3F3F3]" style={{ height: sideCfg.arcH }} />
          <div className="absolute inset-x-0 px-5 text-center" style={{ bottom: sideCfg.textBottom }}>
            <div
              className="mx-auto max-w-[260px] text-[25px] font-bold leading-[1.5] tracking-[-0.575px] uppercase"
              style={{ color: active.roleColor ?? "var(--gold)", fontFamily: "var(--font-nav)" }}
            >
              {active.roleTitle}
            </div>
            <div className="mx-auto mt-4 max-w-[193px] whitespace-pre-line font-sans text-[14px] leading-[1.5] tracking-[-0.322px] text-[#181818]">
              {active.roleBody.join("\n\n")}
            </div>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectIndex?.(idx)}
                  className={[
                    "h-2.5 w-2.5 rounded-full transition-all duration-200",
                    idx === activeIndex ? "bg-[#181818] scale-110" : "bg-[#181818]/30",
                  ].join(" ")}
                  aria-label={`Go to ${item.navLabel}`}
                  aria-current={idx === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

