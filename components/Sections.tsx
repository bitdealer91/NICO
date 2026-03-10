"use client";

import Image from "next/image";
import { useRef } from "react";

import { ScrollVelocityText } from "@/components/ScrollVelocityText";
import { useScrollSteps } from "@/lib/useScrollSteps";

const aboutCharacters = [
  {
    id: "thinker",
    src: "/figma/about-thinker@2x.png",
    width: 222,
    height: 384,
    label: "THE THINKER",
    color: "#EBB55C",
    desc: "defines\ndirection",
  },
  {
    id: "builder",
    src: "/figma/about-builder@2x.png",
    width: 215,
    height: 283,
    label: "THE BUILDER",
    color: "#D2312F",
    desc: "turns ideas into\nscalable systems",
  },
  {
    id: "creator",
    src: "/figma/about-creator@2x.png",
    width: 238,
    height: 344,
    label: "THE CREATOR",
    color: "#518C52",
    desc: "shapes the\nexperience",
  },
  {
    id: "launcher",
    src: "/figma/about-launcher@2x.png",
    width: 218,
    height: 398,
    label: "THE LAUNCHER",
    color: "#4FBBC5",
    desc: "brings it all together\nand launches it",
  },
] as const;

export function Sections() {
  const crewRef = useRef<HTMLElement | null>(null);
  const { activeIndex } = useScrollSteps({
    targetRef: crewRef,
    steps: aboutCharacters.length,
    hysteresis: 0.08,
  });

  return (
    <div className="relative">
      {/* ═══════════════ ABOUT — text section (single screen) ═══════════════ */}
      <section id="about" className="relative">
        <div className="relative overflow-hidden">
          {/* ── White marquee band ── */}
          <div className="relative z-0 bg-white pb-[60px]">
            {/* ABOUT marquee */}
            <div className="pt-[clamp(0px,0.5vh,10px)]">
              <ScrollVelocityText
                text="ABOUT"
                baseVelocity={-80}
                numCopies={16}
                damping={50}
                stiffness={400}
                className="font-display text-[clamp(100px,13.9vw,200px)] leading-[1] tracking-[-0.023em] bg-[linear-gradient(120deg,#828282_0%,#5A5A5A_34%,#1A1A1A_100%)] bg-clip-text text-transparent"
              />
            </div>
            {/* NICO STUDIO marquee — below ABOUT with spacing */}
            <div className="mt-[clamp(4px,0.5vh,12px)]">
              <ScrollVelocityText
                text="NICO STUDIO"
                baseVelocity={60}
                numCopies={20}
                damping={50}
                stiffness={400}
                className="font-sans text-[clamp(18px,2.08vw,30px)] font-normal tracking-[-0.023em] text-[#1A1A1A]"
              />
            </div>
          </div>

          {/* ── Arc separator (white dome dropping into dark) ── */}
          <div className="absolute z-10 inset-x-0 flex justify-center pointer-events-none"
               style={{ top: "calc(100% - 60px)" }}>
            <svg
              viewBox="0 0 512 86"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[clamp(320px,35.5vw,512px)]"
              preserveAspectRatio="none"
            >
              <path
                d="M0 0 C0 47.5 114.6 86 256 86 C397.4 86 512 47.5 512 0 Z"
                fill="white"
              />
            </svg>
          </div>

          {/* ── Dark content area ── */}
          <div className="relative bg-[#1A1A1A]">
            {/* Subtle gradient overlays */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(110%_75%_at_50%_0%,rgba(255,255,255,0.04),transparent_56%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(75%_45%_at_50%_18%,rgba(235,181,92,0.06),transparent_64%)]" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10 py-[clamp(40px,8vh,100px)]">
              {/* Intro — two column text */}
              <div className="grid w-full max-w-[1360px] mx-auto gap-x-[clamp(40px,11.3vw,163px)] gap-y-4 md:grid-cols-2">
                <p className="max-w-[603px] whitespace-pre-line font-sans text-[clamp(16px,1.74vw,25px)] leading-[1.5] tracking-[-0.023em] text-white">
                  {"NICO Studio is the launch crew behind modern\ndigital products.\nFounders bring the vision. We make it real."}
                </p>
                <p className="max-w-[603px] whitespace-pre-line font-sans text-[clamp(16px,1.74vw,25px)] leading-[1.5] tracking-[-0.023em] text-white">
                  {"From strategy to design, from code to motion —\nwe work as one team focused on one goal:\nlaunching products people want to use."}
                </p>
              </div>

              {/* Center heading */}
              <p className="mx-auto mt-[clamp(32px,6vh,80px)] max-w-[762px] text-center font-display text-[clamp(28px,3.47vw,50px)] leading-[1.5] tracking-[-0.023em] text-white">
                No disconnected freelancers. No slow handoffs.
                <br />
                Just one crew moving fast from idea to launch.
              </p>

              {/* Facts — two column text */}
              <div className="mt-[clamp(24px,5vh,64px)] grid w-full max-w-[1360px] mx-auto gap-x-[clamp(40px,11.3vw,163px)] gap-y-4 md:grid-cols-2">
                <p className="max-w-[603px] whitespace-pre-line font-sans text-[clamp(16px,1.74vw,25px)] leading-[1.5] tracking-[-0.023em] text-white">
                  {"Landing pages in days.\nComplex platforms built for long-term growth."}
                </p>
                <p className="max-w-[603px] whitespace-pre-line font-sans text-[clamp(16px,1.74vw,25px)] leading-[1.5] tracking-[-0.023em] text-white">
                  {"Idea, design, or just a vision —\nNICO Studio becomes your launch team."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CREW — scroll-through characters page ═══════════════ */}
      <section id="crew" ref={crewRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-[#1A1A1A]">
          {/* Subtle gradient overlays */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(110%_60%_at_50%_0%,rgba(255,255,255,0.03),transparent_56%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_30%,rgba(235,181,92,0.04),transparent_64%)]" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-5 sm:px-8 lg:px-10">
            {/* "We call it THE LAUNCH CREW." */}
            <p className="mx-auto pt-[clamp(40px,8vh,100px)] font-display text-[clamp(26px,3.47vw,50px)] tracking-[-0.023em] text-white text-center">
              We call it THE LAUNCH CREW.
            </p>

            {/* ── Characters row ── */}
            <div className="mt-auto grid grid-cols-4 items-end gap-1 sm:gap-3 lg:gap-4 pb-[clamp(16px,3vh,40px)]">
              {aboutCharacters.map((ch, i) => {
                const active = i === activeIndex;
                return (
                  <div
                    key={ch.id}
                    className="relative flex flex-col items-center"
                  >
                    {/* Glow */}
                    <div
                      className="absolute bottom-[35%] left-1/2 -translate-x-1/2 w-[160%] aspect-square rounded-full transition-opacity duration-500 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.20) 34%, transparent 74%)",
                        opacity: active ? 0.9 : 0,
                      }}
                    />

                    {/* Image */}
                    <div
                      className="relative w-full max-w-[222px] transition-all duration-500"
                      style={{
                        aspectRatio: `${ch.width}/${ch.height}`,
                        opacity: active ? 1 : 0.6,
                        filter: active
                          ? "drop-shadow(0 0 58px rgba(255,255,255,0.38))"
                          : "grayscale(0.18) brightness(0.6) saturate(0.6)",
                        transform: active
                          ? "translateY(-4px) scale(1.02)"
                          : "translateY(0) scale(0.96)",
                      }}
                    >
                      <Image
                        src={ch.src}
                        alt={ch.label}
                        fill
                        sizes="(min-width:1024px) 16vw, 22vw"
                        className="object-contain"
                      />
                    </div>

                    {/* Label */}
                    <p
                      className="mt-2 font-display text-[clamp(18px,3.2vw,50px)] tracking-[-0.023em] text-center leading-none whitespace-nowrap transition-opacity duration-500"
                      style={{ color: ch.color, opacity: active ? 1 : 0.6 }}
                    >
                      {ch.label}
                    </p>

                    {/* Description */}
                    <p
                      className="mt-1 whitespace-pre-line font-sans text-[clamp(12px,1.4vw,25px)] leading-[1.5] tracking-[-0.023em] text-white text-center transition-opacity duration-500"
                      style={{ opacity: active ? 1 : 0.6 }}
                    >
                      {ch.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ WORK — placeholder ═══════════════ */}
      <section
        id="work"
        className="relative mx-auto max-w-[1240px] px-5 pb-28 pt-20 sm:px-8 sm:pb-36 sm:pt-24"
      >
        <div className="max-w-2xl">
          <div className="text-[var(--gold)] text-xs tracking-[0.28em] uppercase">
            Work
          </div>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Selected work (placeholder).
          </h2>
          <p className="mt-5 text-pretty leading-7 text-white/70">
            Swap these cards for real case studies once assets are ready.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {["Brand + site", "Product design", "Build + launch"].map(
            (title) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur"
              >
                <div className="h-40 rounded-2xl border border-white/10 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(226,178,90,0.20),transparent_60%)]" />
                <div className="mt-5 text-lg font-semibold text-white">
                  {title}
                </div>
                <div className="mt-2 text-sm leading-6 text-white/65">
                  Placeholder description. Replace with project details and
                  images.
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
