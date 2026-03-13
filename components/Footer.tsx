import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative mx-auto flex h-[268px] w-full max-w-[1440px] bg-black px-[10px] text-white">
      <div className="relative h-full w-full">
        {/* Logo block (matches Figma positioning) */}
        <div className="absolute left-0 top-0 h-[174px] w-[268px]">
          <Image src="/figma/logo.png" alt="NICO studio" fill className="object-contain" priority />
        </div>

        {/* Middle copy (two-line Manrope, with extra line gap like Figma) */}
        <div className="-translate-y-1/2 absolute left-[553px] top-[30px]">
          <p
            className="font-sans text-[25px] font-normal leading-[28px] text-white"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Partnering with founders
            <br />
            to turn ideas into real products.
          </p>
        </div>

        {/* Right column: email + X */}
        <div className="-translate-y-1/2 absolute left-[1097px] top-[10px] text-right">
          <a
            href="mailto:hello@nico.studio.com"
            className="font-sans text-[25px] font-normal leading-[20px] text-white underline"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            hello@nico.studio.com
          </a>
          <div className="-translate-y-1/2 absolute left-0 top-[40px] w-full">
            <a
              href="https://x.com/dreava_art"
              target="_blank"
              rel="noreferrer"
              className="font-sans text-[25px] font-normal leading-[20px] text-white hover:opacity-80"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              X
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="-translate-y-1/2 absolute left-0 top-[227px]">
          <p
            className="font-sans text-[15px] font-normal leading-[20px] text-white"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            © 2026 NICO Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

