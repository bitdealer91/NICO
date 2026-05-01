"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import type { Character } from "@/lib/characters";
import { ArcNav } from "@/components/ArcNav";

/** Как в ContactSection — мягкая «платформа» под видео-персонажа. */
const HERO_ELLIPSE_SHADOW_SRC = "/figma/Ellipse%2027.png";

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
  const mobileVideoFor = (item: Character | null) => item?.mobileVideoSrc ?? item?.videoSrc;
  /** Figma phone (390) → scale: multiply px by (100vw/390). */
  const m = (px: number) => `calc(${px} * (100vw / 390))`;

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[1440px] flex-1 flex-col lg:block lg:flex-none">
      {/* Desktop (pixel-ish to Figma) */}
      <div className="hidden h-full lg:block">
        <h1
          className="absolute left-[40px] top-[321px] z-30 select-none text-[#181818]"
          style={{ fontFamily: "var(--font-nav)" }}
        >
          {/* Figma 4:279 / Name Crew: Oswald 120 / 700 / LH 100% / LS -2.76px */}
          <div className="text-[120px] font-bold leading-[100%] tracking-[-2.76px]">THE</div>
          <div className="text-[120px] font-bold leading-[100%] tracking-[-2.76px]">LAUNCH</div>
          <div
            className="text-[120px] font-bold leading-[100%] tracking-[-2.76px]"
            style={{ color: active.roleColor ?? "#EBB55C" }}
          >
            CREW
          </div>
        </h1>

        {/* Figma 4:279 — `424:1013`: (306, 82) 840×840 on 1440×900; scale x/w with container, fixed top */}
        <div className="absolute left-[21.25%] top-[82px] z-10 w-[58.3333333%] max-w-[840px]">
          <div className="relative aspect-square w-full">
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
          <div className="pointer-events-none relative z-[1] -mt-12 flex w-full justify-center px-2 lg:-mt-[60px]" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_ELLIPSE_SHADOW_SRC}
              alt=""
              width={662}
              height={74}
              decoding="async"
              className="pointer-events-none mx-auto block h-auto w-[min(138%,940px)] max-w-none -translate-y-3 select-none opacity-[0.48] [filter:saturate(1)_brightness(0.93)_contrast(1.04)] will-change-transform lg:-translate-y-3.5"
              style={{ mixBlendMode: "darken" }}
            />
          </div>
        </div>

        {/* Figma `49:1148` Crew info: (1144, 325) w=261 on 1440 canvas */}
        <div className="absolute left-[79.4444444%] top-[325px] z-30 w-[18.125%] max-w-[261px]">
          {reduceMotion ? (
            <>
              <div
                className="text-[30px] font-bold uppercase leading-[150%] tracking-[-0.69px]"
                style={{ fontFamily: "var(--font-nav)", color: active.roleColor ?? "#EBB55C" }}
              >
                {active.roleTitle}
              </div>
              <div
                className="mt-[39px] whitespace-pre-line text-[25px] font-normal leading-[150%] tracking-[-0.575px] text-[#181818]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
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
                  className="text-[30px] font-bold uppercase leading-[150%] tracking-[-0.69px]"
                  style={{ fontFamily: "var(--font-nav)", color: active.roleColor ?? "#EBB55C" }}
                >
                  {active.roleTitle}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
                  className="mt-[39px] whitespace-pre-line text-[25px] font-normal leading-[150%] tracking-[-0.575px] text-[#181818]"
                  style={{ fontFamily: "var(--font-sans)" }}
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

      {/* Mobile — Figma `261:33` phone: Visual `750:454` (601×898), Circle `261:450` white circle on #f3f3f3 (arc = circle edge) */}
      <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col lg:hidden">
        <div className="relative z-20 shrink-0 px-[var(--mobile-gutter)] text-center" style={{ paddingTop: m(120) }}>
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

        {/* Gap Title → Visual */}
        <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col justify-end" style={{ paddingTop: m(27) }}>
          {/* Visual: ширина > viewport — без overflow-* на родителях hero, чтобы не резать края арта (html/body режут только ось X) */}
          <div className="relative left-1/2 shrink-0 overflow-visible -translate-x-1/2" style={{ width: m(601) }}>
            {/* Character: overlap with arc; если arcLower отодвигает CircleBlock вниз — mb компенсирует */}
            <div
              className="relative z-[1] mx-auto flex justify-center overflow-visible"
              style={{
                width: m(398),
                marginTop: m(-43),
                marginBottom: m(-102),
              }}
            >
                {reduceMotion ? (
                  <div className="w-full">
                    <CharacterVisual
                      fillSlot
                      videoSrc={mobileVideoFor(active)}
                      src={active.imageSrc}
                      id={active.id}
                      reduceMotion
                      scale={active.stageScale}
                      translateY={active.stageTranslateY}
                    />
                  </div>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active.id}
                      className="w-full"
                      initial={{ opacity: 0.85 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0.82 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.14}
                      onDragEnd={(_, info) => {
                        const threshold = 40;
                        if (info.offset.x <= -threshold && hasNext) onSelectIndex?.(activeIndex + 1);
                        if (info.offset.x >= threshold && hasPrev) onSelectIndex?.(activeIndex - 1);
                      }}
                    >
                      <CharacterVisual
                        fillSlot
                        videoSrc={mobileVideoFor(active)}
                        src={active.imageSrc}
                        id={active.id}
                        scale={active.stageScale}
                        translateY={active.stageTranslateY}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
            </div>

            {/* CircleBlock: текст в потоке задаёт высоту; ниже только фон + диск режутся overflow-hidden */}
            <div
              className="pointer-events-none relative z-[15] mx-auto shrink-0 overflow-visible"
              style={{ width: m(601), transform: `translateY(${m(28)})` }}
            >
              <div
                className="relative z-20 mx-auto flex w-full max-w-[100%] flex-col items-center text-center pointer-events-none"
                style={{
                  paddingTop: m(78),
                  paddingBottom: `max(${m(20)}, calc(env(safe-area-inset-bottom, 0px) + ${m(12)}))`,
                  paddingLeft: m(170),
                  paddingRight: m(170),
                }}
              >
                <div className="pointer-events-auto w-full" style={{ maxWidth: m(261) }}>
                  <div
                    className="font-bold leading-[1.5] tracking-[-0.575px] uppercase"
                    style={{
                      color: active.roleColor ?? "var(--gold)",
                      fontFamily: "var(--font-nav)",
                      fontSize: m(25),
                    }}
                  >
                    {active.roleTitle}
                  </div>
                  <div
                    className="mx-auto mt-3 max-w-full whitespace-pre-line font-sans leading-[1.5] tracking-[-0.322px] text-[#181818]"
                    style={{ fontSize: m(14) }}
                  >
                    {active.roleBody.join("\n\n")}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2.5">
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

              <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
                <div
                  className="pointer-events-none absolute left-1/2 top-0 z-[5] aspect-square max-w-none -translate-x-1/2"
                  style={{ width: m(601) }}
                >
                  <Image
                    src="/figma/hero-mobile-circle.svg"
                    alt=""
                    fill
                    sizes="602px"
                    className="select-none object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

