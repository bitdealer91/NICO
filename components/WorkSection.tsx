 "use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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

function WorkMedia({ project, isActive, grayscale }: WorkMediaProps) {
  return (
    <div className="relative h-[236px] w-[338px] overflow-hidden">
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/10 via-black/0 to-black/30" />
      </motion.div>
    </div>
  );
}

type WorkRowProps = {
  project: WorkProject;
  isActive: boolean;
  isOpen: boolean;
  onHover: () => void;
  onToggleOpen: () => void;
};

function WorkRow({ project, isActive, isOpen, onHover, onToggleOpen }: WorkRowProps) {
  const underlineLeftClass =
    project.id === "airdrop"
      ? "left-[calc(16.67%+73px)]"
      : project.id === "lootbox"
        ? "left-[calc(25%+25px)]"
        : "left-[calc(16.67%+94px)]";

  const mediaPositionClass =
    project.id === "airdrop"
      ? "left-[calc(75%-18px)] top-[-14px]"
      : project.id === "lootbox"
        ? "left-[calc(75%-15px)] top-[-7px]"
        : "left-[calc(75%+3px)] top-[-5px]";

  return (
    <motion.article
      layout
      className="relative w-full cursor-pointer overflow-hidden bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onToggleOpen}
      role="button"
      tabIndex={0}
      whileHover={{ backgroundColor: "rgba(0,0,0,1)" }}
      transition={{ layout: { duration: 0.24, ease: [0.25, 0.8, 0.25, 1] } }}
    >
      <motion.div layout className="relative h-[208px]">
        <div className="-translate-y-1/2 absolute left-[40px] top-[79px] flex flex-col justify-center leading-[0] text-[25px] font-normal text-white">
          <p
            className="font-sans leading-[20px] tracking-[-0.575px]"
            style={isOpen ? { color: project.accent } : undefined}
          >
            {project.index}
          </p>
        </div>
        <div className="-translate-y-1/2 absolute left-[115px] top-[103.5px] flex flex-col justify-center leading-[0] text-[40px] font-bold text-white">
          <p
            className="whitespace-nowrap leading-[68.26px] tracking-[0] uppercase"
            style={{ fontFamily: "var(--font-nav)", color: isOpen ? project.accent : "#FFFFFF" }}
          >
            {project.title}
          </p>
        </div>
        {!isOpen ? (
          <div className={`absolute top-[150px] h-px w-[61px] ${underlineLeftClass}`}>
            <div className="absolute inset-0 bg-white" />
          </div>
        ) : null}
        {!isOpen ? (
          <div className={`absolute h-[236px] w-[338px] ${mediaPositionClass}`}>
            <WorkMedia project={project} isActive={isActive} grayscale />
          </div>
        ) : null}

        {/* Hover affordance: subtle "View details" hint on desktop */}
        <motion.div
          className="pointer-events-none absolute right-[120px] top-1/2 hidden -translate-y-1/2 items-center gap-2 lg:flex"
          initial={false}
          animate={{
            opacity: isActive || isOpen ? 1 : 0,
            x: isActive || isOpen ? 0 : 6,
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-sans text-[16px] uppercase tracking-[0.18em] text-white/70">
            View details
          </span>
          <span className="text-[18px] text-white/80">↗</span>
        </motion.div>
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
            {/* Full-width stripe: visually ~12px ниже прежнего прочерка */}
            <div className="absolute left-0 right-0 top-[-46px] h-px bg-[#3a3a3a]" />

            {/* Text block: 671x397, 34px ниже полосы */}
            <div className="absolute left-[40px] top-[-12px] h-[397px] w-[671px]">
              <p className="font-sans text-[25px] leading-[33.07px] text-white">
                {project.description.map((paragraph, index) => (
                  <span key={index} className={index > 0 ? "mt-4 block" : "block"}>
                    {paragraph}
                  </span>
                ))}
              </p>
            </div>

            {/* Video block: 634x405, aligned vertically with the text block (same top) */}
            <div className="absolute left-[766px] top-[-12px] h-[405px] w-[634px] overflow-hidden bg-black">
              <video
                className="h-full w-full object-contain"
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
  const [activeId, setActiveId] = useState<WorkProject["id"]>("airdrop");
  const [openProjectId, setOpenProjectId] = useState<WorkProject["id"] | null>(null);

  return (
    <section
      id="work"
      className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col bg-black px-[10px] pb-24 pt-16 text-white lg:snap-start lg:pb-[120px]"
    >
      {/* Desktop layout (WORK rows only; contact CTA moved to ContactSection) */}
      <div className="hidden w-full flex-col gap-[80px] lg:flex">
        <div className="flex w-full flex-col gap-0">
          {PROJECTS.map((project) => (
            <WorkRow
              key={project.id}
              project={project}
              isActive={project.id === activeId}
              isOpen={project.id === openProjectId}
              onHover={() => setActiveId(project.id)}
              onToggleOpen={() =>
                setOpenProjectId((current) => (current === project.id ? null : project.id))
              }
            />
          ))}
        </div>
      </div>

      {/* Tablet & mobile layout */}
      <div className="flex w-full flex-col gap-12 lg:hidden">
        <div className="flex flex-col divide-y divide-white/10 overflow-hidden rounded-none">
          {PROJECTS.map((project) => (
            <div key={project.id} className="py-6">
              <button
                type="button"
                className="block w-full text-left"
                onMouseEnter={() => setActiveId(project.id)}
                onFocus={() => setActiveId(project.id)}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-sans text-[20px] font-normal tracking-[-0.575px] text-white/80">
                      {project.index}
                    </span>
                    <span
                      className="font-bold uppercase tracking-[-0.04em] text-white"
                      style={{ fontFamily: "var(--font-nav)" }}
                    >
                      {project.title}
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-px w-[61px] bg-white" />
                <div className="mt-4">
                  <div className="relative h-[200px] w-full overflow-hidden rounded-[18px]">
                    <WorkMedia project={project} isActive={project.id === activeId} grayscale />
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

