import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative mx-auto flex h-[268px] w-full max-w-[1440px] bg-[#F3F3F3] px-[10px] text-[#181818] lg:snap-start">
      <div className="relative h-full w-full">
        <div className="absolute left-[40px] top-0 h-[174px] w-[268px]">
          <Image src="/figma/Logo.png" alt="NICO studio" fill className="object-contain" priority />
        </div>

        <div className="-translate-y-1/2 absolute left-[553px] top-[30px] w-[335px]">
          <p
            className="select-none font-sans text-[25px] font-normal leading-[33.1px] text-[#181818]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Partnering with founders to
            <br />
            turn ideas into real products.
          </p>
        </div>

        <div className="-translate-y-1/2 absolute left-[1097px] top-[30px] text-left">
          <a
            href="mailto:hello@nicolab.studio"
            className="font-sans text-[25px] font-bold leading-[33.1px] text-[#181818] underline"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            hello@nicolab.studio
          </a>
          <div className="mt-2">
            <a
              href="https://x.com/dreava_art"
              target="_blank"
              rel="noreferrer"
              className="font-sans text-[25px] font-bold leading-[33.1px] text-[#181818]/80 transition-opacity hover:opacity-100"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              X
            </a>
          </div>
        </div>

        <div className="-translate-y-1/2 absolute left-[40px] top-[227px]">
          <p
            className="font-sans text-[15px] font-normal leading-[20px] text-[#181818]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            © 2026 NICO Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
