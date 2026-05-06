"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { useWideDesktop } from "@/lib/useWideDesktop";

type Character = {
  id: "thinker" | "builder" | "creator" | "launcher";
  name: string;
  role: string;
  imageSrc: string;
  colorImageSrc: string;
  /** Mobile-only card art (`aboutMob*`), separate from desktop `about-*.png`. */
  mobileCardSrc: string;
};

/** Figma `757:519` — each card 360×410, `rounded-t-[250px]`, typography block `757:483…485` family. */
const MOBILE_CARD_W = 360;
const MOBILE_CARD_H = 410;

/** Figma `757:519` typography; horizontal nudge for `mobileCardSrc` raster. */
const MOBILE_CARD_LAYOUT: Record<
  Character["id"],
  { titleLeftSubtractPx: number; subtitleLeftSubtractPx: number; charNudgePx: number }
> = {
  thinker: { titleLeftSubtractPx: 63.5, subtitleLeftSubtractPx: 44.5, charNudgePx: -0.5 },
  builder: { titleLeftSubtractPx: 63.5, subtitleLeftSubtractPx: 54.5, charNudgePx: 0 },
  creator: { titleLeftSubtractPx: 65.5, subtitleLeftSubtractPx: 50.5, charNudgePx: 9.5 },
  launcher: { titleLeftSubtractPx: 73.5, subtitleLeftSubtractPx: 48.5, charNudgePx: 18.5 },
};

/** Figma `545:316` / per-card refs (`389:*`) — размеры слота персонажа и сдвиг по X (px). */
const DESKTOP_CARD_VISUAL: Record<Character["id"], { w: number; h: number; x: number }> = {
  thinker: { w: 207, h: 358, x: -0.5 },
  builder: { w: 238, h: 313, x: 0 },
  creator: { w: 235, h: 340, x: 9.5 },
  launcher: { w: 241, h: 395, x: 18.5 },
};

const CHARACTERS: Character[] = [
  {
    id: "thinker",
    name: "THE THINKER",
    role: "Product Vision",
    imageSrc: "/figma/about-thinker.png",
    colorImageSrc: "/figma/about-thinker@2x.png",
    mobileCardSrc: "/figma/aboutMobThinker.png",
  },
  {
    id: "builder",
    name: "THE BUILDER ",
    role: "Scalable Systems",
    imageSrc: "/figma/about-builder.png",
    colorImageSrc: "/figma/about-builder@2x.png",
    mobileCardSrc: "/figma/aboutMobBuilder.png",
  },
  {
    id: "creator",
    name: "THE CREATOR",
    role: "User Experience",
    imageSrc: "/figma/about-creator.png",
    colorImageSrc: "/figma/about-creator@2x.png",
    mobileCardSrc: "/figma/aboutMobCreator.png",
  },
  {
    id: "launcher",
    name: "THE LAUNCHER",
    role: "Product Launch",
    imageSrc: "/figma/about-launcher.png",
    colorImageSrc: "/figma/about-launcher@2x.png",
    mobileCardSrc: "/figma/aboutMobLauncher.png",
  },
];

const LOOP_COPY = "WE CALL IT THE LAUNCH CREW  •  ";
/** Full-width row, fixed 120px high: viewBox height tracks width so `meet` = uniform scale, no anisotropic stretch. */
function CurvedLoopText({ bandPx = 120, alpha = 0.1 }: { bandPx?: number; alpha?: number }) {
  const pathId = useId();
  const hostRef = useRef<HTMLDivElement>(null);
  const [wPx, setWPx] = useState(1404);
  const loopText = `${LOOP_COPY}${LOOP_COPY}${LOOP_COPY}${LOOP_COPY}`;

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width;
      if (w && w > 0) setWPx(w);
    });
    ro.observe(el);
    setWPx(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const vbW = 1404;
  const wSafe = Math.max(1, wPx);
  const vbH = (bandPx * vbW) / wSafe;
  const pathD = `M0 ${0.709 * vbH} Q${vbW * 0.5} ${0.182 * vbH} ${vbW} ${0.709 * vbH}`;
  const fontSize = 0.78 * vbH;

  return (
    <div
      ref={hostRef}
      className="pointer-events-none relative w-full min-w-0 max-w-full select-none"
      style={{ height: bandPx }}
      aria-hidden
    >
      <svg viewBox={`0 0 ${vbW} ${vbH}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        <text
          fill="#181818"
          className="font-bold"
          style={{
            fontFamily: "var(--font-nav), Oswald, sans-serif",
            fontSize,
            fontWeight: 700,
            letterSpacing: "-0.023em",
            textTransform: "uppercase",
            dominantBaseline: "middle",
            opacity: alpha,
          }}
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {loopText}
            <animate attributeName="startOffset" from="0%" to="-50%" dur="16s" repeatCount="indefinite" />
          </textPath>
        </text>
      </svg>
    </div>
  );
}

function CharacterCard({ character }: { character: Character }) {
  const viz = DESKTOP_CARD_VISUAL[character.id];

  return (
    <article
      className="group relative h-[500px] w-[360px] max-w-full overflow-hidden rounded-t-[250px] bg-[#F3F3F3]"
      aria-label={`${character.name} – ${character.role}`}
    >
      <div className="relative flex h-full translate-y-16 flex-col items-center justify-start rounded-t-[250px] bg-[#F3F3F3] transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 flex justify-center">
          <div className="relative h-[500px] w-[360px] max-w-full rounded-t-[250px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.12)] transition-shadow duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
              style={{ backgroundColor: "#181818" }}
            />
          </div>
        </div>

        <div className="relative z-10 mt-12 flex flex-col items-center px-6">
          <h3
            className="text-center text-[30px] font-bold leading-none tracking-[-0.69px] text-[#181818] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            {character.name}
          </h3>
          <p className="mt-1 text-center font-sans text-[25px] leading-[1.5] tracking-[-0.575px] text-[#181818] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white">
            {character.role}
          </p>
        </div>

        <div className="relative z-10 mt-6 flex w-full flex-1 items-end justify-center pb-4">
          <div
            className="relative origin-bottom transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-4 group-hover:scale-[1.05]"
            style={{ width: viz.w, height: viz.h, marginLeft: viz.x }}
          >
            <Image
              src={character.imageSrc}
              alt=""
              fill
              sizes="(min-width:1024px) 12vw, 40vw"
              className="object-contain object-bottom transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0"
              priority={character.id === "thinker"}
            />
            <Image
              src={character.colorImageSrc}
              alt=""
              fill
              sizes="(min-width:1024px) 12vw, 40vw"
              className="object-contain object-bottom opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
              priority={character.id === "thinker"}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

const MARQUEE_OFFSET_TOP = 42;
/** Короче полосы = меньше «пустого» места под кривой; иначе к margin суммируется и зазор кажется огромным. */
const MARQUEE_BAND = 120;
const MARQUEE_BLOCK = MARQUEE_OFFSET_TOP + MARQUEE_BAND;
/** Отступ от низа блока с кривой до сетки карточек (десктоп). Не путать с 76px в Figma — там часто от базовой линии текста. */
const MARQUEE_TO_CARDS_GAP_PX = 20;

export function Sections() {
  const isWide = useWideDesktop();
  const reduceMotion = !!useReducedMotion();
  const aboutRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const mobileCardsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutScrollProgress } = useScroll({
    target: aboutRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress } = useScroll({
    target: cardsRef,
    offset: ["start 0.72", "start 0.2"],
  });
  const { scrollYProgress: mobileCardsProgress } = useScroll({
    target: mobileCardsRef,
    offset: ["start 0.95", "start 0.2"],
  });
  const marqueeOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const marqueeY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -32]);
  const marqueeHeight = useTransform(scrollYProgress, [0, 1], [MARQUEE_BLOCK, 0]);
  const wideMarqueeOpacity = useTransform(aboutScrollProgress, [0, 0.22, 0.38], [1, 1, 0]);
  const wideMarqueeY = useTransform(aboutScrollProgress, [0, 0.38], [0, reduceMotion ? 0 : -32]);
  const wideMarqueeHeight = useTransform(aboutScrollProgress, [0, 0.22, 0.38], [MARQUEE_BLOCK, MARQUEE_BLOCK, 0]);
  const mobileMarqueeOpacity = useTransform(mobileCardsProgress, [0, 0.85], [1, 0]);
  const mobileMarqueeY = useTransform(mobileCardsProgress, [0, 0.85], [0, reduceMotion ? 0 : -18]);
  const mobileMarqueeHeight = useTransform(mobileCardsProgress, [0, 0.85], [50, 0]);

  return (
    <div className="relative z-10 overflow-hidden bg-[#F3F3F3] text-[#181818]">
      <section ref={aboutRef} id="about" className="relative w-full flex-col pb-0 pt-10 lg:min-h-0 lg:snap-start lg:pb-0 lg:pt-14">
        {isWide ? (
          <div className="relative mx-auto hidden lg:block" style={{ height: 1150, width: 1920 }}>
            {/* thinker decoration */}
            <div className="pointer-events-none absolute z-0 h-[840px] w-[840px] rotate-90" style={{ left: -376, top: -129 }}>
              <div className="relative isolate h-full w-full">
                <div className="pointer-events-none absolute inset-0 z-0 bg-[#F3F3F3]" aria-hidden />
                <video
                  className="absolute inset-0 z-[1] h-full w-full object-contain mix-blend-darken"
                  src="/characters/videos/thinker.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>

            {/* Curved watermark */}
            <motion.div
              className="absolute left-0 top-[502px] z-10 h-auto w-[1920px] overflow-hidden"
              style={{ height: wideMarqueeHeight, opacity: wideMarqueeOpacity, y: wideMarqueeY }}
            >
              <div style={{ paddingTop: MARQUEE_OFFSET_TOP }}>
                <CurvedLoopText bandPx={MARQUEE_BAND} alpha={0.1} />
              </div>
            </motion.div>

            {/* Cards row */}
            <div ref={cardsRef} className="absolute left-0 top-[618px] h-[500px] w-[1920px]">
              {CHARACTERS.map((character) => {
                const leftX: Record<(typeof character)["id"], number> = {
                  thinker: 60,
                  builder: 540,
                  creator: 1020,
                  launcher: 1500,
                };
                return (
                  <div key={character.id} className="absolute top-0" style={{ left: leftX[character.id], width: 360 }}>
                    <CharacterCard character={character} />
                  </div>
                );
              })}
            </div>

            {/* Title */}
            <div className="absolute left-[514px] top-[45px] z-[2] w-[1201px] -translate-y-1/2">
              <p
                className="select-none text-[40px] font-bold uppercase leading-[1.5] tracking-[-0.92px] text-[#181818]"
                style={{ fontFamily: "var(--font-nav)" }}
              >
                NICO Studio is the launch crew behind modern digital products.
              </p>
            </div>

            {/* Description */}
            <div
              className="absolute left-[514px] top-[295px] z-[2] w-[1181px] -translate-y-1/2 whitespace-pre-wrap font-sans text-[25px] leading-[1.5] tracking-[-0.575px] text-[#181818]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {`Founders bring the vision. We make it real.\n\nFrom strategy to design, from code to motion — we work as one team focused on one goal: launching products people want to use.\n\nNo disconnected freelancers. No slow handoffs.\nJust one crew moving fast from idea to launch.\n\nLanding pages in days. Complex platforms built for long-term growth. Idea, design, or just a vision — NICO Studio becomes your launch team.`}
            </div>
          </div>
        ) : null}
        <div
          className={["relative z-10 mx-auto hidden w-full flex-col lg:flex", isWide ? "lg:hidden" : ""].join(" ")}
          style={{ maxWidth: isWide ? 1920 : 1440, paddingLeft: isWide ? 0 : 40, paddingRight: isWide ? 0 : 40 }}
        >
          {/* Figma: thinker decoration on the left, rotated right and partially clipped */}
          <div
            className="pointer-events-none absolute z-0 h-[840px] w-[840px] rotate-90"
            style={{ left: isWide ? -376 : -316, top: isWide ? -129 : -86 }}
          >
            <div className="relative isolate h-full w-full">
              <div className="pointer-events-none absolute inset-0 z-0 bg-[#F3F3F3]" aria-hidden />
              <video
                className="absolute inset-0 z-[1] h-full w-full object-contain mix-blend-darken"
                src="/characters/videos/thinker.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-y-10 lg:gap-y-0">
            <div className="flex flex-1 flex-col gap-y-8 lg:flex-row lg:items-start lg:gap-x-0">
              <div className="hidden w-[38%] min-w-0 shrink-0 lg:block" aria-hidden />
              <div className="flex-1" style={{ maxWidth: isWide ? 1201 : 822, marginLeft: isWide ? 514 : 0 }}>
                <p
                  className="select-none text-[40px] font-bold uppercase leading-[1.5] tracking-[-0.92px] text-[#181818]"
                  style={{ fontFamily: "var(--font-nav)" }}
                >
                  NICO Studio is the launch crew behind modern digital products.
                </p>
                <div
                  className="mt-8 max-w-[822px] text-[25px] font-normal leading-[1.5] tracking-[-0.575px] text-[#181818] lg:mt-[56px]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <p className="leading-none">Founders bring the vision. We make it real.</p>
                  <p className="mt-[24px] leading-[1.5]">
                    From strategy to design, from code to motion — we work as one team focused on one goal: launching
                    products people want to use.
                  </p>
                  <p className="mt-[24px] leading-[1.5]">
                    No disconnected freelancers. No slow handoffs.
                    <br />
                    Just one crew moving fast from idea to launch.
                  </p>
                  <p className="mt-[24px] leading-[1.5]">
                    Landing pages in days. Complex platforms built for long-term growth. Idea, design, or just a vision —
                    NICO Studio becomes your launch team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className={["relative z-10 hidden w-full min-w-0 overflow-hidden will-change-transform lg:block", isWide ? "lg:hidden" : ""].join(" ")}
          style={{ height: marqueeHeight, opacity: marqueeOpacity, y: marqueeY }}
        >
          <div style={{ paddingTop: MARQUEE_OFFSET_TOP }}>
            <CurvedLoopText bandPx={MARQUEE_BAND} />
          </div>
        </motion.div>

        <div
          ref={cardsRef}
          className={["relative z-10 mx-auto hidden w-full lg:block", isWide ? "lg:hidden" : ""].join(" ")}
          style={{ maxWidth: isWide ? 1920 : 1520, marginTop: MARQUEE_TO_CARDS_GAP_PX, paddingLeft: isWide ? 0 : 40, paddingRight: isWide ? 0 : 40 }}
        >
          {/*
            Контент 1440 (= 4×360): при max-w-[1440px]+px-10 ячейка ~340 и крайний столбец «плывёт». 1520 = 1440+80 паддингов.
           */}
          <div className="grid justify-items-center gap-x-0 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
            {CHARACTERS.map((character) => (
              <div key={character.id} className="flex justify-center">
                <CharacterCard character={character} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile layout (Figma 261:31) */}
        <div className="relative z-10 px-4 pb-0 pt-2 lg:hidden">
          <div className="pointer-events-none absolute -left-[76px] top-[-6px] h-[226px] w-[226px] rotate-90">
            <div className="relative isolate h-full w-full">
              <div className="pointer-events-none absolute inset-0 z-0 bg-[#F3F3F3]" aria-hidden />
              <video
                className="absolute inset-0 z-[1] h-full w-full object-contain mix-blend-darken"
                src="/characters/videos/thinkerMobile.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          <p
            className="relative z-10 ml-[33%] mt-1 max-w-[63%] text-[25px] font-bold uppercase leading-[1.5] tracking-[-0.575px] text-[#181818]"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            NICO STUDIO IS THE LAUNCH CREW BEHIND MODERN DIGITAL PRODUCTS.
          </p>
          <div className="relative z-10 mx-auto mt-5 w-full max-w-[calc(100vw-32px)] text-center font-sans text-[14px] leading-[1.5] tracking-[-0.322px] text-[#181818]">
            <p>Founders bring the vision. We make it real.</p>
            <p className="mt-3">From strategy to design, from code to motion — we work as one team focused on one goal: launching products people want to use.</p>
            <p className="mt-3">No disconnected freelancers. No slow handoffs. Just one crew moving fast from idea to launch.</p>
            <p className="mt-3">Landing pages in days. Complex platforms built for long-term growth. Idea, design, or just a vision — NICO Studio becomes your launch team.</p>
          </div>

          <motion.div className="mt-8 -mx-4 overflow-hidden" style={{ height: mobileMarqueeHeight, opacity: mobileMarqueeOpacity, y: mobileMarqueeY }}>
            <CurvedLoopText bandPx={50} alpha={0.1} />
          </motion.div>

          <div ref={mobileCardsRef} className="mt-3 -mx-4 flex snap-x snap-mandatory gap-[10px] overflow-x-auto px-4 pb-2">
            {CHARACTERS.map((character) => {
              const layout = MOBILE_CARD_LAYOUT[character.id];
              return (
                <article
                  key={character.id}
                  className="relative isolate shrink-0 snap-center overflow-hidden rounded-t-[250px] bg-[#181818]"
                  style={{ width: MOBILE_CARD_W, height: MOBILE_CARD_H }}
                  aria-label={`${character.name} – ${character.role}`}
                >
                  <div className="pointer-events-none absolute left-[116px] top-[50px] z-20 h-[62px] w-[127px] leading-[0] text-white">
                    <h3
                      className="absolute top-[12.5px] -translate-y-1/2 whitespace-nowrap text-left text-[25px] font-bold leading-none tracking-[-0.575px]"
                      style={{
                        left: `calc(50% - ${layout.titleLeftSubtractPx}px)`,
                        fontFamily: "var(--font-nav)",
                      }}
                    >
                      {character.name}
                    </h3>
                    <p
                      className="absolute top-[51.5px] -translate-y-1/2 whitespace-nowrap text-left font-sans text-[14px] leading-[1.5] tracking-[-0.322px]"
                      style={{ left: `calc(50% - ${layout.subtitleLeftSubtractPx}px)` }}
                    >
                      {character.role}
                    </p>
                  </div>
                  <div className="pointer-events-none absolute inset-x-[14px] bottom-0 top-[146px] z-10 flex items-end justify-center">
                    <div
                      className="relative h-full w-full"
                      style={{ transform: `translateX(${layout.charNudgePx}px)` }}
                    >
                      <Image
                        src={character.mobileCardSrc}
                        alt=""
                        fill
                        sizes={`${MOBILE_CARD_W}px`}
                        className="object-contain object-bottom select-none"
                        priority={character.id === "thinker"}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
