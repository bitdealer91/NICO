"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { ConnectModal } from "@/components/ConnectModal";

type SectionId = "about" | "work" | "contact";
type NavId = SectionId;

function isDesktopViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(min-width: 1024px)")?.matches ?? false;
}

function openWorkFirstCase() {
  if (typeof window === "undefined") return;
  const w = window as Window & { __nicoOpenWorkFirstCase?: boolean };
  w.__nicoOpenWorkFirstCase = true;
  window.dispatchEvent(new CustomEvent("nico:open-work-first-case"));
}

export function Header({ maxWidthPx = 1440 }: { maxWidthPx?: number }) {
  const connectBtnRef = useRef<HTMLButtonElement | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navScrollOffsets = {
    desktop: 220,
    mobile: 16,
  } as const;

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

  function scrollToElement(
    el: HTMLElement | null,
    options?: {
      desktopOffset?: number;
      mobileOffset?: number;
    }
  ) {
    if (!el) return;
    const isDesktop = isDesktopViewport();
    const offset = isDesktop ? (options?.desktopOffset ?? 0) : (options?.mobileOffset ?? 0);
    if (offset === 0) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
    const top = Math.max(0, window.scrollY + el.getBoundingClientRect().top - offset);
    window.scrollTo({ top, behavior: "auto" });
  }

  function scrollTo(id: SectionId) {
    const isDesktop = isDesktopViewport();

    if (id === "work") {
      const firstCaseAnchorId = isDesktop ? "work-case-first-desktop" : "work-case-first-mobile";
      const sectionAnchorId = isDesktop ? "work-nav-anchor-desktop" : "work-nav-anchor-mobile";
      openWorkFirstCase();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToElement(
            document.getElementById(firstCaseAnchorId) ??
              document.getElementById(sectionAnchorId) ??
              document.getElementById("work"),
            {
              desktopOffset: navScrollOffsets.desktop,
              mobileOffset: navScrollOffsets.mobile,
            }
          );
        });
      });
      return;
    }

    if (id === "contact") {
      scrollToElement(document.getElementById("contact"), {
        desktopOffset: navScrollOffsets.desktop,
        mobileOffset: navScrollOffsets.mobile,
      });
      return;
    }

    scrollToElement(document.getElementById(id), {
      desktopOffset: navScrollOffsets.desktop,
      mobileOffset: navScrollOffsets.mobile,
    });
  }

  function openConnect() {
    const el = document.getElementById("contact");
    if (el) {
      scrollToElement(el, {
        desktopOffset: navScrollOffsets.desktop,
        mobileOffset: navScrollOffsets.mobile,
      });
    } else {
      setConnectOpen(true);
    }
  }

  function closeConnect() {
    setConnectOpen(false);
    // Return focus to trigger button
    setTimeout(() => connectBtnRef.current?.focus(), 0);
  }

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-40">
        <div
          className="relative mx-auto w-full lg:h-[110px]"
          style={{ maxWidth: maxWidthPx, minHeight: "calc(var(--mobile-menu-size) + var(--mobile-gutter) + env(safe-area-inset-top) + 8px)" }}
        >
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
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f3f3]",
                      isActive ? "text-[#181818] opacity-100" : "text-[#181818] opacity-75 hover:opacity-100",
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
          <div className="lg:hidden px-[var(--mobile-gutter)] pt-[var(--mobile-gutter)]">
            <div className="relative" style={{ height: "calc(var(--mobile-logo-h) + env(safe-area-inset-top))" }}>
              <div
                className="absolute"
                style={{
                  left: "max(0px, env(safe-area-inset-left))",
                  top: "max(0px, env(safe-area-inset-top))",
                  width: "var(--mobile-logo-w)",
                  height: "var(--mobile-logo-h)",
                }}
              >
                <Image src="/figma/logo.png" alt="NICO studio" fill className="object-contain object-left" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {!mobileMenuOpen ? (
        <div
          className="fixed inset-x-0 top-0 z-[90] pointer-events-none lg:hidden"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}
        >
          <div className="relative mx-auto h-[44px] w-full">
            <button
              ref={connectBtnRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="pointer-events-auto absolute right-4 top-0 h-[44px] w-[44px] rounded-full bg-[var(--accent)] shadow-[0_20px_60px_rgba(0,0,0,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span className="absolute left-1/2 top-[40%] h-[2px] w-[38%] -translate-x-1/2 rounded-full bg-white" />
              <span className="absolute left-1/2 top-[58%] h-[2px] w-[38%] -translate-x-1/2 rounded-full bg-white" />
            </button>
          </div>
        </div>
      ) : null}

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[100] h-dvh w-screen bg-[#181818] lg:hidden">
          <div className="relative h-dvh w-screen">
            <div
              className="absolute h-[47px] w-[73px]"
              style={{
                left: "calc(var(--mobile-gutter) + env(safe-area-inset-left))",
                top: "calc(var(--mobile-gutter) + env(safe-area-inset-top))",
              }}
            >
              <Image src="/figma/logo.png" alt="NICO studio" fill className="object-contain object-left invert" />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="absolute h-[45px] w-[45px] rounded-full bg-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                right: "16px",
                top: "calc(var(--mobile-gutter) + env(safe-area-inset-top))",
              }}
            >
              <span className="absolute left-1/2 top-1/2 h-[2px] w-[18px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-black/85" />
              <span className="absolute left-1/2 top-1/2 h-[2px] w-[18px] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-black/85" />
            </button>

            <div className="absolute inset-x-0 top-[170px] flex flex-col items-center gap-[26px]">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (item.id === "contact") openConnect();
                    else scrollTo(item.id);
                  }}
                  className="text-[25px] font-bold leading-[1.5] tracking-[-0.575px] text-white"
                  style={{ fontFamily: "var(--font-nav)" }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openConnect();
              }}
              className="absolute left-1/2 top-[398px] h-[60px] w-[218px] -translate-x-1/2 rounded-[50px] bg-[var(--accent)] text-[25px] font-bold leading-[1.5] tracking-[-0.575px] text-white"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Let&apos;s connect
            </button>

            <p
              className="absolute bottom-[114px] left-1/2 w-[240px] -translate-x-1/2 text-center text-[14px] font-normal leading-[1.5] text-white"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Partnering with founders to turn ideas into real products.
            </p>

            <a
              href="mailto:bitdealer91@gmail.com"
              className="absolute bottom-3 left-4 text-[14px] font-normal leading-[33.1px] text-white underline"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              bitdealer91@gmail.com
            </a>
            <a
              href="https://x.com/nico_studio_"
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 right-5 text-[14px] font-normal leading-[33.1px] text-white"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              X
            </a>
          </div>
        </div>
      ) : null}

      <ConnectModal open={connectOpen} onClose={closeConnect} />
    </>
  );
}

