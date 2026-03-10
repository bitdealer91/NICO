"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { ConnectModal } from "@/components/ConnectModal";

type SectionId = "about" | "work" | "contact";
type NavId = SectionId;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function Header() {
  const connectBtnRef = useRef<HTMLButtonElement | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  const navItems = useMemo(
    () =>
      [
        { id: "about" as NavId, label: "About" },
        { id: "work" as NavId, label: "Work" },
        { id: "contact" as NavId, label: "Contact" },
      ] satisfies { id: NavId; label: string }[],
    []
  );

  useEffect(() => {
    const ids: SectionId[] = ["about", "work", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id === "about" || visible?.target?.id === "work" || visible?.target?.id === "contact") {
          setActiveSection(visible.target.id as SectionId);
        }
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function scrollTo(id: SectionId) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }

  function openConnect() {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    } else {
      setConnectOpen(true);
    }
  }

  function closeConnect() {
    setConnectOpen(false);
    // Return focus to trigger button
    setTimeout(() => connectBtnRef.current?.focus(), 0);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="relative mx-auto h-[110px] w-full max-w-[1440px]">
          {/* Desktop (Figma layout) */}
          <div className="hidden lg:block">
            <div className="absolute left-[40px] top-[42px]">
              <Image src="/figma/logo.png" alt="NICO studio" width={131} height={85} priority />
            </div>

            <nav
              aria-label="Primary"
              className="absolute left-1/2 top-[42px] flex h-[38px] w-[361px] -translate-x-1/2 items-center justify-between"
            >
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => (item.id === "contact" ? openConnect() : scrollTo(item.id))}
                    className={[
                      "font-sans text-[25px] leading-[37.5px] font-normal tracking-[-0.575px] transition-opacity",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
                      isActive ? "text-white opacity-100" : "text-white opacity-90 hover:opacity-100",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <button
              ref={connectBtnRef}
              type="button"
              onClick={openConnect}
              className="absolute right-[40px] top-[42px] flex h-[60px] w-[256px] items-center justify-center rounded-[50px] bg-[var(--accent)] font-sans text-[25px] leading-[37.5px] font-bold tracking-[-0.023em] text-white shadow-[0_18px_55px_rgba(0,0,0,0.28)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Let’s connect
            </button>
          </div>

          {/* Mobile / tablet */}
          <div className="lg:hidden px-5 sm:px-8 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur">
                  <div className="h-4 w-4 rounded bg-[var(--gold)] shadow-[0_10px_30px_rgba(226,178,90,0.25)]" />
                </div>
                <div className="text-sm font-semibold tracking-tight text-white">NICO studio</div>
              </div>
              <button
                ref={connectBtnRef}
                type="button"
                onClick={openConnect}
                className="rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.22)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Let’s connect
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center">
                  <div className="flex h-[52px] w-full max-w-[360px] items-center justify-between rounded-full border border-white/10 bg-black/30 px-6 backdrop-blur-lg">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => (item.id === "contact" ? openConnect() : scrollTo(item.id))}
                      className={[
                        "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                        isActive ? "text-white" : "text-white/75 hover:text-white",
                      ].join(" ")}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <ConnectModal open={connectOpen} onClose={closeConnect} />
    </>
  );
}

