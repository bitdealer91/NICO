 "use client";

import { useState } from "react";

import { ConnectModal } from "@/components/ConnectModal";

export function ContactSection() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="contact"
      className="relative mx-auto flex min-h-[50px] max-w-[1440px] items-center justify-center bg-black px-[10px] pb-[48px] pt-[48px] text-white"
    >
      <div className="flex w-full max-w-[730px] flex-col items-center gap-[33px] text-center">
        <p
          className="text-[40px] font-bold uppercase leading-[68.26px] tracking-[0] text-white"
          style={{ fontFamily: "var(--font-nav)" }}
        >
          An idea, a design, or just a direction —
          <br />
          we turn it into a product.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-[50px] bg-white px-[49px] py-[11px] font-sans text-[25px] font-bold leading-[1.5] tracking-[-0.575px] text-black transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
        >
          Let&apos;s connect
        </button>
      </div>

      <ConnectModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

