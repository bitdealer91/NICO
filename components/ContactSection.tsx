"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useId, useLayoutEffect, useRef, useState } from "react";

import { ConnectModal } from "@/components/ConnectModal";

function ContactCurvedLoopText() {
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
  const vbH = (120 * vbW) / wSafe;
  const pathD = `M0 ${0.709 * vbH} Q${vbW * 0.5} ${0.182 * vbH} ${vbW} ${0.709 * vbH}`;
  const fontSize = 0.78 * vbH;

  return (
    <div ref={hostRef} className="pointer-events-none relative h-[120px] w-full min-w-0 select-none" aria-hidden>
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
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start 0.72", "start 0.2"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -32]);
  const titleHeight = useTransform(scrollYProgress, [0, 1], [120, 0]);

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-[#F3F3F3] pb-16 pt-8 text-[#181818] lg:snap-start lg:pb-24 lg:pt-10"
    >
      <motion.div
        className="relative z-10 w-full overflow-hidden will-change-transform"
        style={{ height: titleHeight, opacity: titleOpacity, y: titleY }}
      >
        <ContactCurvedLoopText />
      </motion.div>

      <div ref={videoRef} className="relative mt-8 h-[38vw] min-h-[220px] w-full max-h-[560px] overflow-hidden">
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

      <div className="relative z-10 mx-auto mt-10 flex w-full max-w-[1440px] flex-col items-center gap-[7px] px-[10px] text-center">
        <div className="w-full max-w-[730px]">
          <p
            className="select-none text-[40px] font-bold uppercase leading-[68.26px] tracking-[0] text-[#181818]"
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
