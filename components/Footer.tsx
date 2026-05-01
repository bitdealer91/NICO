import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative mx-auto w-full max-w-[1440px] bg-[#F3F3F3] px-[10px] pb-8 text-[#181818] lg:h-[268px] lg:snap-start lg:pb-0">
      <div className="relative hidden h-full w-full lg:block">
        <div className="absolute left-[40px] top-0 h-[174px] w-[268px]">
          <Image src="/figma/logo.png" alt="NICO studio" fill className="object-contain" priority />
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
            href="mailto:bitdealer91@gmail.com"
            className="font-sans text-[25px] font-bold leading-[33.1px] text-[#181818] underline"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            bitdealer91@gmail.com
          </a>
          <div className="mt-2">
            <a
              href="https://x.com/nico_studio_"
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
      <div className="flex flex-col items-center pt-6 text-center lg:hidden">
        <div className="relative h-[72px] w-[111px]">
          <Image src="/figma/logo.png" alt="NICO studio" fill className="object-contain" />
        </div>
        <p className="mt-7 font-sans text-[14px] leading-[1.5] tracking-[-0.322px] text-[#181818]">
          Partnering with founders to turn ideas into real products.
        </p>
        <a href="mailto:bitdealer91@gmail.com" className="mt-4 font-sans text-[14px] font-extrabold leading-[33.1px] underline">
          bitdealer91@gmail.com
        </a>
        <a href="https://x.com/nico_studio_" target="_blank" rel="noreferrer" className="mt-1 font-sans text-[14px] leading-[33.1px]">
          X
        </a>
        <p className="mt-4 font-sans text-[14px] leading-[20px] text-[#181818]">© 2026 NICO Studio. All rights reserved.</p>
      </div>
    </footer>
  );
}
