import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative mx-auto flex h-[268px] w-full max-w-[1440px] bg-black px-[10px] pb-[40px] pt-[40px] text-white">
      <div className="relative flex h-full w-full items-start">
        {/* Logo block */}
        <div className="relative h-[174px] w-[268px]">
          <Image src="/figma/logo.png" alt="NICO studio" fill className="object-contain" priority />
        </div>

        {/* Middle copy */}
        <div className="absolute left-[553px] top-[50px]">
          <p className="font-sans text-[25px] font-normal leading-[20px] text-white">
            Partnering with founders
            <br />
            to turn ideas into real products.
          </p>
        </div>

        {/* Right column: email + X */}
        <div className="absolute left-[1097px] top-[50px] text-right">
          <a
            href="mailto:hello@nico.studio.com"
            className="font-sans text-[25px] font-normal leading-[20px] text-white underline"
          >
            hello@nico.studio.com
          </a>
          <div className="mt-[20px]">
            <a
              href="https://x.com/dreava_art"
              target="_blank"
              rel="noreferrer"
              className="font-sans text-[25px] font-normal leading-[20px] text-white hover:opacity-80"
            >
              X
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="absolute left-0 top-[227px] -translate-y-1/2">
          <p className="font-sans text-[15px] font-normal leading-[20px] text-white">
            © 2026 NICO Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

