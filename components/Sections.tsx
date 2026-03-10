"use client";

import Image from "next/image";

type Character = {
  id: "thinker" | "builder" | "creator" | "launcher";
  name: string;
  role: string;
  imageSrc: string;
  accent: string;
};

const CHARACTERS: Character[] = [
  {
    id: "thinker",
    name: "THE THINKER",
    role: "Product Vision",
    imageSrc: "/figma/about-thinker.png",
    accent: "#EBB55C",
  },
  {
    id: "builder",
    name: "THE BUILDER ",
    role: "Scalable Systems",
    imageSrc: "/figma/about-builder.png",
    accent: "#D2312F",
  },
  {
    id: "creator",
    name: "THE CREATOR",
    role: "User Experience",
    imageSrc: "/figma/about-creator.png",
    accent: "#518C52",
  },
  {
    id: "launcher",
    name: "THE LAUNCHER",
    role: "Product Launch",
    imageSrc: "/figma/about-launcher.png",
    accent: "#4FBBC5",
  },
];

function CharacterCard({ character }: { character: Character }) {
  return (
    <article
      className="group relative h-[500px] w-[360px] max-w-full overflow-hidden rounded-t-[250px] bg-black"
      aria-label={`${character.name} – ${character.role}`}
    >
      <div className="relative flex h-full translate-y-16 flex-col items-center justify-start rounded-t-[250px] bg-black transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 flex justify-center">
          <div className="relative h-[500px] w-[360px] max-w-full rounded-t-[250px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-shadow duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
              style={{
                backgroundColor: character.accent,
              }}
            />
          </div>
        </div>

        <div className="relative z-10 mt-12 flex flex-col items-center px-6">
          <h3
            className="text-center text-[30px] font-bold leading-none tracking-[-0.69px] text-black"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            {character.name}
          </h3>
          <p className="mt-1 text-center font-sans text-[25px] leading-[1.5] tracking-[-0.575px] text-black">
            {character.role}
          </p>
        </div>

        <div className="relative z-10 mt-6 flex w-full flex-1 items-end justify-center pb-4">
          <div className="relative h-[358px] w-[207px] origin-bottom transform-gpu transition-[transform,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] grayscale group-hover:-translate-y-4 group-hover:scale-[1.05] group-hover:grayscale-0 group-hover:saturate-150">
            <Image
              src={character.imageSrc}
              alt=""
              fill
              sizes="(min-width:1024px) 12vw, 40vw"
              className="object-contain object-bottom"
              priority={character.id === "thinker"}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export function Sections() {
  return (
    <div className="relative bg-black text-white">
      <section
        id="about"
        className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-10 pb-12 pt-16 lg:pb-16 lg:pt-20"
      >
        <div className="flex flex-1 flex-col gap-y-12 lg:flex-row lg:items-start lg:gap-x-16">
          <div className="max-w-[461px]">
            <p
              className="text-[32px] font-bold uppercase leading-[1.5] tracking-[-0.92px] sm:text-[36px] md:text-[40px]"
              style={{ fontFamily: "var(--font-nav)" }}
            >
              NICO STUDIO IS THE LAUNCH CREW BEHIND MODERN DIGITAL PRODUCTS.
            </p>
            <p
              className="mt-8 text-[32px] font-bold uppercase leading-none tracking-[-0.92px] sm:text-[36px] md:text-[40px]"
              style={{ fontFamily: "var(--font-nav)" }}
            >
              WE CALL IT THE LAUNCH CREW.
            </p>
          </div>

          <div className="mt-0 max-w-[783px] text-[18px] leading-[1.5] tracking-[-0.575px] text-white sm:text-[20px] md:text-[25px]">
            <p>Founders bring the vision. We make it real.</p>
            <p className="mt-4">
              From strategy to design, from code to motion — we work as one team focused on one goal: launching
              products people want to use.
            </p>
            <p className="mt-4">
              No disconnected freelancers. No slow handoffs.
              <br />
              Just one crew moving fast from idea to launch.
            </p>
            <p className="mt-4">
              Landing pages in days. Complex platforms built for long-term growth. Idea, design, or just a vision —
              NICO Studio becomes your launch team.
            </p>
          </div>
        </div>

        <div className="mt-[39px] w-full">
          <div className="grid gap-y-10 gap-x-0 md:grid-cols-2 xl:grid-cols-4 xl:gap-x-0">
            {CHARACTERS.map((character) => (
              <div key={character.id} className="flex justify-center">
                <CharacterCard character={character} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
