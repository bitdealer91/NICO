"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useId, useLayoutEffect, useRef, useState } from "react";

type Character = {
  id: "thinker" | "builder" | "creator" | "launcher";
  name: string;
  role: string;
  imageSrc: string;
  colorImageSrc: string;
};

const CHARACTERS: Character[] = [
  {
    id: "thinker",
    name: "THE THINKER",
    role: "Product Vision",
    imageSrc: "/figma/about-thinker.png",
    colorImageSrc: "/figma/about-thinker@2x.png",
  },
  {
    id: "builder",
    name: "THE BUILDER ",
    role: "Scalable Systems",
    imageSrc: "/figma/about-builder.png",
    colorImageSrc: "/figma/about-builder@2x.png",
  },
  {
    id: "creator",
    name: "THE CREATOR",
    role: "User Experience",
    imageSrc: "/figma/about-creator.png",
    colorImageSrc: "/figma/about-creator@2x.png",
  },
  {
    id: "launcher",
    name: "THE LAUNCHER",
    role: "Product Launch",
    imageSrc: "/figma/about-launcher.png",
    colorImageSrc: "/figma/about-launcher@2x.png",
  },
];

const LOOP_COPY = "WE CALL IT THE LAUNCH CREW  •  ";
/** Full-width row, fixed 120px high: viewBox height tracks width so `meet` = uniform scale, no anisotropic stretch. */
function CurvedLoopText() {
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
  const vbH = (120 * vbW) / wSafe;
  const pathD = `M0 ${0.709 * vbH} Q${vbW * 0.5} ${0.182 * vbH} ${vbW} ${0.709 * vbH}`;
  const fontSize = 0.78 * vbH;

  return (
    <div
      ref={hostRef}
      className="pointer-events-none relative h-[120px] w-full min-w-0 max-w-full select-none"
      aria-hidden
    >
      <svg viewBox={`0 0 ${vbW} ${vbH}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        <text
          fill="#181818"
          className="font-bold opacity-10"
          style={{
            fontFamily: "var(--font-nav), Oswald, sans-serif",
            fontSize,
            fontWeight: 700,
            letterSpacing: "-0.023em",
            textTransform: "uppercase",
            dominantBaseline: "middle",
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
          <div className="relative h-[358px] w-[207px] origin-bottom transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-4 group-hover:scale-[1.05]">
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
const MARQUEE_BAND = 120;
const MARQUEE_BLOCK = MARQUEE_OFFSET_TOP + MARQUEE_BAND;

export function Sections() {
  const reduceMotion = !!useReducedMotion();
  const cardsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardsRef,
    offset: ["start 0.72", "start 0.2"],
  });
  const marqueeOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const marqueeY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -32]);
  const marqueeHeight = useTransform(scrollYProgress, [0, 1], [MARQUEE_BLOCK, 0]);

  return (
    <div className="relative overflow-hidden bg-[#F3F3F3] text-[#181818]">
      <section
        id="about"
        className="relative w-full flex-col pb-12 pt-10 lg:min-h-0 lg:snap-start lg:pb-20 lg:pt-14"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col px-10">
          {/* Figma: thinker decoration on the left, rotated right and partially clipped */}
          <div className="pointer-events-none absolute -left-[316px] -top-[86px] z-0 h-[840px] w-[840px] rotate-90">
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
              <div className="max-w-[822px] flex-1">
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
          className="relative z-10 w-full min-w-0 overflow-hidden will-change-transform"
          style={{ height: marqueeHeight, opacity: marqueeOpacity, y: marqueeY }}
        >
          <div style={{ paddingTop: MARQUEE_OFFSET_TOP }}>
            <CurvedLoopText />
          </div>
        </motion.div>

        <div
          ref={cardsRef}
          className="relative z-10 mx-auto mt-[60px] w-full max-w-[1440px] px-10"
        >
          <div className="grid gap-y-10 gap-x-0 md:grid-cols-2 xl:grid-cols-4 xl:gap-x-0">
            {CHARACTERS.map((character) => (
              <div key={character.id} className="flex justify-center">
                <CharacterCard character={character} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
