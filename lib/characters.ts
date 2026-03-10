export type Character = {
  id: "thinker" | "builder" | "creator" | "launcher";
  navLabel: string;
  roleTitle: string;
  roleBody: string[];
  imageSrc: string;
  figmaBgSrc?: string;
  roleColor?: string;
  stageScale?: number;
  stageTranslateY?: number;
};

export const characters: Character[] = [
  {
    id: "thinker",
    navLabel: "THE THINKER",
    roleTitle: "Concept & Strategy",
    roleBody: [
      "Every product starts with an idea.",
      "We help shape the concept and define direction.",
    ],
    imageSrc: "/characters/thinker.png",
    figmaBgSrc: "/figma/hero-bg-1@2x.png",
    roleColor: "#EBB55C",
    stageScale: 0.75,
    stageTranslateY: 0,
  },
  {
    id: "builder",
    navLabel: "THE BUILDER",
    roleTitle: "Development",
    roleBody: [
      "From simple landing pages to complex systems — we build fast, scalable products ready for launch.",
    ],
    imageSrc: "/characters/builder.png",
    figmaBgSrc: "/figma/hero-bg-2@2x.png",
    roleColor: "#D2312F",
    stageScale: 0.93,
    stageTranslateY: 8,
  },
  {
    id: "creator",
    navLabel: "THE CREATOR",
    roleTitle: "Design & Motion",
    roleBody: [
      "Design, motion, and 3D that turn ideas into clear and engaging experiences.",
    ],
    imageSrc: "/characters/creator.png",
    figmaBgSrc: "/figma/hero-bg-3@2x.png",
    roleColor: "#518C52",
    stageScale: 0.91,
    stageTranslateY: 6,
  },
  {
    id: "launcher",
    navLabel: "THE LAUNCHER",
    roleTitle: "Product Launch / Web3 / AI",
    roleBody: ["We bring everything together — turning vision into a product ready for real users."],
    imageSrc: "/characters/launcher.png",
    figmaBgSrc: "/figma/hero-bg-4@2x.png",
    roleColor: "#43949B",
    stageScale: 0.87,
    stageTranslateY: 10,
  },
];

