 "use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useWideDesktop } from "@/lib/useWideDesktop";

type WorkProject = {
  id: "airdrop" | "lootbox" | "web3";
  index: string;
  title: string;
  imageSrc: string;
  videoSrc: string;
  accent: string;
  description: string[];
};

const PROJECTS: WorkProject[] = [
  {
    id: "airdrop",
    index: "01",
    title: "AIRDROP EVENT",
    imageSrc: "/assets/images/work-airdrop.png",
    videoSrc: "/assets/videos/work-airdrop.mp4",
    accent: "#EBB55C",
    description: [
      "An 8-week Web3 quest platform built as a space-themed digital experience.",
      "Each week represented a new “planet” with structured challenges and reward mechanics designed to drive user engagement.",
      "We delivered the full visual concept within days, handled complete custom development from scratch, and provided post-launch support.",
      "A fast execution. A scalable Web3 solution.",
    ],
  },
  {
    id: "lootbox",
    index: "02",
    title: "LOOTBOX PLATFORM",
    imageSrc: "/assets/images/work-lootbox.png",
    videoSrc: "/assets/videos/work-lootbox.mp4",
    accent: "#D2312F",
    description: [
      "An interactive Web3 lootbox experience designed to reward users for their previous activity.",
      "After connecting a wallet, users could open a digital chest and receive a randomly generated reward.",
      "We developed the full visual concept and interface design, ensuring an engaging and seamless user experience.",
      "A simple mechanic. A powerful engagement tool.",
    ],
  },
  {
    id: "web3",
    index: "03",
    title: "WEB3 SHOWCASE",
    imageSrc: "/assets/images/work-web3.png",
    videoSrc: "/assets/videos/work-web3.mp4",
    accent: "#4FBBC5",
    description: [
      "A cinematic showcase for a Web3 gaming experience, built to highlight the full visual universe.",
      "The page combined motion, lighting, and interface previews to communicate the product vision in one scroll.",
      "We crafted the visual language, interaction details, and hero moments for launch.",
      "A focused story, designed to convert attention into interest.",
    ],
  },
];

type WorkMediaProps = {
  project: WorkProject;
  isActive: boolean;
  grayscale?: boolean;
};

function WorkCurvedLoopText({ bandPx = 120 }: { bandPx?: number }) {
  const pathId = useId();
  const hostRef = useRef<HTMLDivElement>(null);
  const [wPx, setWPx] = useState(1404);
  const loopText = "WORK  WORK  WORK  WORK  WORK  WORK  WORK  WORK  ";

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
    <div ref={hostRef} className="relative w-full min-w-0 select-none" style={{ height: bandPx }} aria-hidden>
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

function WorkMedia({ project, isActive, grayscale }: WorkMediaProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        initial={false}
        animate={{
          scale: isActive ? 1.02 : 1,
          rotate: isActive ? -3 : -6,
          y: isActive ? 0 : -6,
          opacity: isActive ? 1 : 0.92,
        }}
        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative h-full w-full origin-center"
      >
        <Image
          src={project.imageSrc}
          alt=""
          fill
          className={[
            "pointer-events-none object-cover transition-[filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            grayscale ? "grayscale" : "grayscale-0",
          ].join(" ")}
          sizes="(min-width:1024px) 23vw, 50vw"
          priority={project.id === "airdrop"}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/[0.06] via-black/0 to-black/[0.10]" />
      </motion.div>
    </div>
  );
}

type WorkRowProps = {
  project: WorkProject;
  isActive: boolean;
  isOpen: boolean;
  isWide: boolean;
  onHover: () => void;
  onToggleOpen: () => void;
  anchorId?: string;
};

function WorkRow({ project, isActive, isOpen, isWide, onHover, onToggleOpen, anchorId }: WorkRowProps) {
  const underlineStyle = isWide
    ? project.id === "airdrop"
      ? { left: "calc(8.33% + 153px)" }
      : project.id === "lootbox"
        ? { left: "calc(16.67% + 65px)" }
        : { left: "calc(16.67% + 14px)" }
    : project.id === "airdrop"
      ? { left: "calc(16.67% + 73px)" }
      : project.id === "lootbox"
        ? { left: "calc(25% + 25px)" }
        : { left: "calc(16.67% + 94px)" };

  const mediaStyle = isWide
    ? project.id === "airdrop"
      ? { left: "calc(75% + 104px)", top: -14, width: 338, height: 236 }
      : project.id === "lootbox"
        ? { left: "calc(58.33% + 45px)", top: -7, width: 335, height: 222 }
        : { left: "calc(41.67% + 13px)", top: -5, width: 338, height: 218 }
    : project.id === "airdrop"
      ? { left: "calc(75% - 18px)", top: -14, width: 338, height: 236 }
      : project.id === "lootbox"
        ? { left: "calc(75% - 15px)", top: -7, width: 338, height: 236 }
        : { left: "calc(75% + 3px)", top: -5, width: 338, height: 236 };

  const expandedTextTopClass =
    project.id === "lootbox" ? "absolute left-[40px] top-[-39px] h-[370px] w-[671px]" : "absolute left-[40px] top-[-23px] h-[370px] w-[671px]";

  const expandedVideoStyle = (() => {
    if (project.id === "lootbox") {
      return isWide
        ? { left: "calc(58.33% + 109px)", top: -36, width: 651, height: 317 }
        : { left: "calc(50% + 29px)", top: -36, width: 651, height: 317 };
    }
    if (project.id === "web3") {
      return isWide
        ? { left: "calc(58.33% + 108px)", top: -36, width: 652, height: 318 }
        : { left: "calc(50% + 28px)", top: -36, width: 652, height: 318 };
    }
    return isWide
      ? { left: "calc(79.17% + 43px)", top: -40, width: 634, height: 405, transform: "translateX(-50%)" }
      : { left: "calc(79.17% - 57px)", top: -40, width: 634, height: 405, transform: "translateX(-50%)" };
  })();

  return (
    <motion.article
      id={anchorId}
      layout
      className="relative w-full cursor-pointer overflow-hidden bg-[#F3F3F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F3F3]"
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onToggleOpen}
      role="button"
      tabIndex={0}
      whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
      transition={{ layout: { duration: 0.24, ease: [0.25, 0.8, 0.25, 1] } }}
    >
      <motion.div layout className="relative h-[208px]">
        <div className="select-none -translate-y-1/2 absolute left-[40px] top-[79px] flex flex-col justify-center leading-[0] text-[25px] font-normal text-[#181818]">
          <p
            className="font-sans leading-[20px] tracking-[-0.575px]"
            style={isOpen ? { color: project.accent } : undefined}
          >
            {project.index}
          </p>
        </div>
        <div className="select-none -translate-y-1/2 absolute left-[115px] top-[103.5px] flex flex-col justify-center leading-[0] text-[40px] font-bold text-[#181818]">
          <p
            className="whitespace-nowrap leading-[68.26px] tracking-[0] uppercase"
            style={{ fontFamily: "var(--font-nav)", color: isOpen ? project.accent : "#181818" }}
          >
            {project.title}
          </p>
        </div>
        {!isOpen ? <div className="absolute top-[150px] h-px w-[61px] bg-[#181818]" style={underlineStyle} /> : null}
        {!isOpen ? (
          <div className="absolute overflow-hidden" style={mediaStyle}>
            <WorkMedia project={project} isActive={isActive} grayscale />
          </div>
        ) : null}
      </motion.div>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="expanded"
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-0 h-[385px] w-full"
          >
            <div
              className={isWide ? "absolute left-[40px] top-[-58px] h-px w-[1840px] bg-[#181818]/30" : "absolute left-0 top-[-58px] h-px w-full bg-[#181818]/30"}
            />

            <div className={expandedTextTopClass}>
              <p className="font-sans text-[25px] leading-[33.07px] text-[#181818]">
                {project.description.map((paragraph, index) => (
                  <span key={index} className={index > 0 ? "mt-4 block" : "block"}>
                    {paragraph}
                  </span>
                ))}
              </p>
            </div>

            <div className="absolute overflow-hidden bg-[#E8E8E8]" style={expandedVideoStyle}>
              <video
                className="h-full w-full object-cover"
                src={project.videoSrc}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}

export function WorkSection() {
  const isWide = useWideDesktop();
  const [activeId, setActiveId] = useState<WorkProject["id"]>("airdrop");
  const [openProjectId, setOpenProjectId] = useState<WorkProject["id"] | null>(null);
  const reduceMotion = !!useReducedMotion();
  const rowsRef = useRef<HTMLDivElement>(null);
  const mobileRowsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rowsRef,
    offset: ["start 0.72", "start 0.2"],
  });
  const { scrollYProgress: mobileRowsProgress } = useScroll({
    target: mobileRowsRef,
    offset: ["start 1.0", "end 0.05"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -32]);
  const titleHeight = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const mobileTitleOpacity = useTransform(mobileRowsProgress, [0, 0.45], [1, 0]);
  const mobileTitleY = useTransform(mobileRowsProgress, [0, 0.45], [0, reduceMotion ? 0 : -18]);
  const mobileTitleHeight = useTransform(mobileRowsProgress, [0, 0.45], [50, 0]);

  useEffect(() => {
    function openFirstCase() {
      setActiveId("airdrop");
      setOpenProjectId("airdrop");
    }

    const w = window as Window & { __nicoOpenWorkFirstCase?: boolean };
    if (w.__nicoOpenWorkFirstCase) {
      openFirstCase();
      w.__nicoOpenWorkFirstCase = false;
    }

    window.addEventListener("nico:open-work-first-case", openFirstCase as EventListener);
    return () => window.removeEventListener("nico:open-work-first-case", openFirstCase as EventListener);
  }, []);

  return (
    <section
      id="work"
      className={[
        "relative mx-auto mt-10 flex flex-col bg-[#F3F3F3] px-0 pb-0 pt-0 text-[#181818] lg:mt-10 lg:pb-0",
        !isWide ? "lg:pl-[45px] lg:pr-[45px]" : "",
      ].join(" ")}
      style={{ maxWidth: isWide ? 1530 : 1440 }}
    >
      {/* Figma: WORK watermark + rows with 24px gap */}
      <div className="hidden w-full flex-col gap-6 lg:flex">
        <motion.div
          className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden will-change-transform"
          style={{ height: titleHeight, opacity: titleOpacity, y: titleY }}
        >
          <WorkCurvedLoopText />
        </motion.div>
        <div id="work-nav-anchor-desktop" className="h-0 w-full scroll-mt-0" />
        <div
          ref={rowsRef}
          className={isWide ? "flex w-[1440px] flex-col gap-6" : "flex w-[1440px] flex-col gap-6"}
          style={isWide ? { transform: "translateX(-196px)" } : { transform: "translateX(-45px)" }}
        >
          {PROJECTS.map((project) => (
            <div key={project.id} className={isWide ? "w-[1920px]" : "w-full"}>
              <WorkRow
                anchorId={project.id === "airdrop" ? "work-case-first-desktop" : undefined}
                project={project}
                isActive={project.id === activeId}
                isOpen={project.id === openProjectId}
                isWide={isWide}
                onHover={() => setActiveId(project.id)}
                onToggleOpen={() => setOpenProjectId((current) => (current === project.id ? null : project.id))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tablet & mobile layout */}
      <div className="flex w-full flex-col gap-4 lg:hidden">
        <motion.div
          className="overflow-hidden"
          style={{ height: mobileTitleHeight, opacity: mobileTitleOpacity, y: mobileTitleY }}
        >
          <WorkCurvedLoopText bandPx={50} />
        </motion.div>
        <div id="work-nav-anchor-mobile" className="h-0 w-full scroll-mt-0" />
        <div ref={mobileRowsRef} className="flex flex-col gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              id={project.id === "airdrop" ? "work-case-first-mobile" : undefined}
              className="relative overflow-hidden bg-[#F3F3F3]"
            >
              {(() => {
                const mobileThumbStyle =
                  project.id === "airdrop"
                    ? { left: "calc(58.33% + 4.5px)", top: 0, width: 136, height: 95 }
                    : project.id === "lootbox"
                      ? { left: "calc(66.67% - 16px)", top: 3, width: 137, height: 90 }
                      : { left: "calc(66.67% - 10px)", top: 4, width: 137, height: 88 };
                const mobileUnderlineStyle =
                  project.id === "airdrop"
                    ? { left: "calc(33.33% + 6px)" }
                    : project.id === "lootbox"
                      ? { left: "calc(41.67% + 18.5px)" }
                      : { left: "calc(33.33% + 19px)" };
                return (
              <button
                type="button"
                className="relative block h-full w-full text-left"
                onClick={() => {
                  setActiveId(project.id);
                  setOpenProjectId((current) => (current === project.id ? null : project.id));
                }}
                onMouseEnter={() => setActiveId(project.id)}
                onFocus={() => setActiveId(project.id)}
              >
                <div className="relative h-[95px]">
                <span
                  className="absolute left-[16px] top-[31px] -translate-y-1/2 font-sans text-[14px] leading-[20px] text-[#181818]"
                  style={openProjectId === project.id ? { fontWeight: 800 } : undefined}
                >
                  {project.index}
                </span>
                <span
                  className="absolute left-[35px] top-[55.5px] -translate-y-1/2 whitespace-nowrap text-[25px] font-bold leading-[68.26px] tracking-[-0.575px] text-[#181818]"
                  style={{ fontFamily: "var(--font-nav)" }}
                >
                  {project.title}
                </span>
                {openProjectId !== project.id ? (
                  <span className="absolute top-[77px] h-px w-[61px] bg-[#181818]" style={mobileUnderlineStyle} />
                ) : null}
                {openProjectId !== project.id ? (
                  <div className="absolute overflow-hidden" style={mobileThumbStyle}>
                    <Image
                      src={project.imageSrc}
                      alt=""
                      fill
                      className={project.id === activeId ? "object-cover" : "object-cover grayscale"}
                      sizes="(max-width:1023px) 137px, 137px"
                    />
                  </div>
                ) : null}
                </div>
              </button>
                );
              })()}
              <AnimatePresence initial={false}>
                {openProjectId === project.id ? (
                  <motion.div
                    key={`${project.id}-mobile-expanded`}
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="px-0 pb-5"
                  >
                    <div className="h-px bg-[#181818]" />
                    <div className="px-4 pt-3">
                      <p className="whitespace-pre-line font-sans text-[14px] leading-[1.5] text-[#181818]">
                        {project.description.join("\n\n")}
                      </p>
                    </div>
                    <div
                      className={[
                        "mt-4 w-full overflow-hidden bg-black",
                        project.id === "airdrop" ? "h-[250px]" : "h-[190px]",
                      ].join(" ")}
                    >
                      <video className="h-full w-full object-cover" src={project.videoSrc} autoPlay muted loop playsInline />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

