"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useId, useLayoutEffect, useRef, useState } from "react";

import { ConnectModal } from "@/components/ConnectModal";

/** Spaces in filenames are unreliable via next/image optimizer; `<img>` from `public/` is stable. */
const CONTACT_ELLIPSE_SRC = "/figma/Ellipse%2027.png";

function ContactCurvedLoopText({ bandPx = 120 }: { bandPx?: number }) {
  const pathId = useId();
  const hostRef = useRef<HTMLDivElement>(null);
  const [wPx, setWPx] = useState(1404);
  const loopText = "LET'S CONNECT  •  LET'S CONNECT  •  LET'S CONNECT  •  LET'S CONNECT  •  ";

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
    <div ref={hostRef} className="pointer-events-none relative w-full min-w-0 select-none" style={{ height: bandPx }} aria-hidden>
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

export function ContactSection() {
  const [open, setOpen] = useState(false);
  const reduceMotion = !!useReducedMotion();
  const videoRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start 0.72", "start 0.2"],
  });
  const { scrollYProgress: mobileProgress } = useScroll({
    target: mobileTriggerRef,
    offset: ["start 1.0", "start 0.05"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -32]);
  const titleHeight = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const mobileTitleOpacity = useTransform(mobileProgress, [0, 0.85], [1, 0]);
  const mobileTitleY = useTransform(mobileProgress, [0, 0.85], [0, reduceMotion ? 0 : -22]);
  const mobileTitleHeight = useTransform(mobileProgress, [0, 0.85], [50, 0]);

  return (
    <section
      id="contact"
      className="relative w-full overflow-x-hidden overflow-y-visible bg-[#F3F3F3] pb-16 pt-10 text-[#181818] lg:pb-24 lg:pt-10"
    >
      <motion.div
        className="relative z-10 hidden w-full overflow-hidden will-change-transform lg:block"
        style={{ height: titleHeight, opacity: titleOpacity, y: titleY }}
      >
        <ContactCurvedLoopText />
      </motion.div>
      <motion.div
        className="relative z-10 w-full overflow-hidden will-change-transform lg:hidden"
        style={{ height: mobileTitleHeight, opacity: mobileTitleOpacity, y: mobileTitleY }}
      >
        <ContactCurvedLoopText bandPx={50} />
      </motion.div>

      <div id="contact-nav-anchor-desktop" className="hidden h-0 w-full scroll-mt-0 lg:block" />
      <div id="contact-media-start-desktop" ref={videoRef} className="relative mt-6 hidden lg:block">
        <div className="relative h-[38vw] min-h-[220px] w-full max-h-[560px] overflow-hidden">
          <div className="relative isolate h-full w-full">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[#F3F3F3]" aria-hidden />
            <video
              className="absolute inset-0 z-[1] h-full w-full object-cover mix-blend-darken"
              src="/characters/videos/letsconnect.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
        <div className="pointer-events-none relative z-[1] -mt-12 flex w-full justify-center px-3 lg:-mt-[60px]" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CONTACT_ELLIPSE_SRC}
            alt=""
            width={662}
            height={74}
            decoding="async"
            className="pointer-events-none mx-auto block h-auto w-[min(100%,920px)] max-w-none -translate-y-3 select-none opacity-[0.48] [filter:saturate(1)_brightness(0.93)_contrast(1.04)] will-change-transform lg:-translate-y-3.5"
            style={{ mixBlendMode: "darken" }}
          />
        </div>
      </div>

      <div className="relative mt-2 lg:hidden">
        <div className="relative h-[234px] w-full overflow-hidden">
          <div className="relative isolate h-full w-full">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[#F3F3F3]" aria-hidden />
            <video
              className="absolute inset-0 z-[1] h-full w-full object-contain mix-blend-darken"
              src="/characters/videos/letsconnectMobile.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
        <div className="pointer-events-none relative z-[1] -mt-11 flex w-full justify-center px-2" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CONTACT_ELLIPSE_SRC}
            alt=""
            width={662}
            height={74}
            decoding="async"
            className="pointer-events-none mx-auto block h-auto w-full max-w-[min(100%,640px)] -translate-y-3 select-none opacity-[0.48] [filter:saturate(1)_brightness(0.93)_contrast(1.04)] will-change-transform"
            style={{ mixBlendMode: "darken" }}
          />
        </div>
      </div>

      <div
        ref={mobileTriggerRef}
        className="relative z-[3] mx-auto -mt-1 flex w-full max-w-[1440px] flex-col items-center gap-[7px] px-[10px] text-center lg:-mt-2"
      >
        <div className="w-full max-w-[730px]">
          <p
            className="select-none text-[25px] font-bold uppercase leading-[1.3] tracking-[-0.023em] text-[#181818] lg:text-[40px] lg:leading-[68.26px]"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            An idea, a design, or just a direction —
            <br />
            we turn it into a product.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-2 h-[62px] rounded-[50px] bg-[#ebb55c] px-[49px] py-[11px] font-sans text-[25px] font-bold leading-[1.5] tracking-[-0.575px] text-white transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
          >
            Let&apos;s connect
          </button>
        </div>
      </div>

      <ConnectModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
