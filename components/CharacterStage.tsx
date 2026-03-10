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
  src,
  id,
  reduceMotion,
  scale = 1,
  translateY = 0,
}: {
  src: string;
  id: string;
  reduceMotion?: boolean;
  scale?: number;
  translateY?: number;
}) {
  const [failed, setFailed] = useState(false);

  const placeholder = useMemo(() => {
    const map: Record<string, string> = {
      thinker: "from-amber-300/35 via-yellow-200/20 to-white/5",
      builder: "from-cyan-300/30 via-sky-200/20 to-white/5",
      maker: "from-fuchsia-300/30 via-purple-200/20 to-white/5",
      launcher: "from-rose-300/30 via-orange-200/20 to-white/5",
    };
    return map[id] ?? "from-white/15 via-white/10 to-white/5";
  }, [id]);

  return (
    <div className="relative mx-auto w-[min(520px,78vw)] lg:w-[520px]">
      <div
        className="relative aspect-[3/4] w-full drop-shadow-[0_55px_110px_rgba(0,0,0,0.60)]"
        style={{ transform: `translateY(${translateY}px) scale(${scale})` }}
      >
        {!failed ? (
          <Image
            src={src}
            alt=""
            fill
            priority
            className="object-contain object-center"
            onError={() => setFailed(true)}
          />
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
      <div className="hidden lg:block h-full">
        <h1
          className={[
            "absolute left-[40px] top-[329px] select-none",
            "text-white",
            "tracking-[-0.023em] leading-[0.82]",
          ].join(" ")}
        >
          <div className="font-display text-[150px]">THE</div>
          <div className="font-display text-[150px]">LAUNCH</div>
          <div className="font-accent text-[150px]" style={{ color: active.roleColor ?? "var(--gold)" }}>
            CREW
          </div>
        </h1>

        <div className="absolute left-1/2 top-[140px] -translate-x-1/2">
          {reduceMotion ? (
            <CharacterVisual
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
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <CharacterVisual
                  src={active.imageSrc}
                  id={active.id}
                  scale={active.stageScale}
                  translateY={active.stageTranslateY}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="absolute right-[59px] top-[310px] w-[280px]">
          {reduceMotion ? (
            <>
              <div
                className="font-display text-[40px] leading-[60px] tracking-[-0.023em]"
                style={{ color: active.roleColor ?? "var(--gold)" }}
              >
                {active.roleTitle}
              </div>
              <div className="mt-[24px] whitespace-pre-line font-sans text-[25px] leading-[37.5px] tracking-[-0.023em] text-white">
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
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
                  className="mt-[24px] whitespace-pre-line font-sans text-[25px] leading-[37.5px] tracking-[-0.023em] text-white"
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
                <div className="font-display text-white text-[clamp(44px,10vw,84px)]">THE</div>
                <div className="font-display text-white text-[clamp(44px,10vw,84px)]">LAUNCH</div>
                <div className="font-accent text-[clamp(44px,10vw,84px)]" style={{ color: active.roleColor ?? "var(--gold)" }}>
                  CREW
                </div>
              </div>
            </div>

            <div className="order-2">
              {reduceMotion ? (
                <CharacterVisual src={active.imageSrc} id={active.id} reduceMotion />
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <CharacterVisual src={active.imageSrc} id={active.id} />
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
                <div className="mt-3 whitespace-pre-line text-white/90 leading-7">
                  {active.roleBody.join("\n\n")}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pb-10">
            <div className="flex items-center justify-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-white/90" />
              <div className="font-display text-[22px] tracking-[0.02em] text-white/90">{active.navLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

