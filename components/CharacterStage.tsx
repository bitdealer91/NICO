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

export function CharacterStage({ items, activeIndex, reduceMotion, onSelectIndex }: CharacterStageProps) {
  const active = items[activeIndex];

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
      <div className="lg:hidden mx-auto flex h-full w-full max-w-[1240px] flex-col px-5 sm:px-8">
        <div className="flex flex-1 flex-col justify-center pt-24 sm:pt-28">
          <div className="grid items-center gap-10 md:grid-cols-[1fr]">
            <div className="order-1">
              <div className="select-none tracking-[-0.02em] leading-[0.86]">
                <div className="font-display text-[#181818] text-[clamp(44px,10vw,84px)]">THE</div>
                <div className="font-display text-[#181818] text-[clamp(44px,10vw,84px)]">LAUNCH</div>
                <div
                  className="font-accent text-[clamp(44px,10vw,84px)]"
                  style={{ color: active.roleColor ?? "var(--gold)" }}
                >
                  CREW
                </div>
              </div>
            </div>

            <div className="order-2">
              {reduceMotion ? (
                <CharacterVisual videoSrc={active.videoSrc} src={active.imageSrc} id={active.id} reduceMotion />
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <CharacterVisual videoSrc={active.videoSrc} src={active.imageSrc} id={active.id} />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <div className="order-3">
              <div className="max-w-[520px]">
                <div
                  className="font-display text-[28px] leading-[42px] tracking-[-0.02em] uppercase"
                  style={{ color: active.roleColor ?? "var(--gold)" }}
                >
                  {active.roleTitle}
                </div>
                <div className="mt-3 whitespace-pre-line text-[#181818] leading-7">
                  {active.roleBody.join("\n\n")}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pb-10">
            <div className="flex items-center justify-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#181818]/80" />
              <div className="font-display text-[22px] tracking-[0.02em] text-[#181818]/90">{active.navLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

