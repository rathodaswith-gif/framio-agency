import type { FounderRoleContent, ImageContent } from "@/types/content";

export const foundersContent = {
  heading: "Founders",
  description: "Two specialists shaping one founder-led creative growth studio.",
  watermark: "FOUNDERS",
  cursorLabel: "Alter ego",
  touchLabel: "Tap reveal",
  stageAriaLabel:
    "Interactive portrait of FRAMIO founders. Move over or tap either black blazer to reveal a Spider-Man inspired suit.",
  baseImage: {
    src: "/assets/images/founders/founders-blazer-3840.webp",
    alt: "FRAMIO founders Rathod Asvith and Jadhav Adithya in black blazers",
    width: 3840,
    height: 2160
  } satisfies ImageContent,
  revealImage: {
    src: "/assets/images/founders/founders-suit-3840.webp",
    alt: "",
    width: 3840,
    height: 2160
  } satisfies ImageContent,
  roles: [
    { index: "01", name: "Rathod Asvith", title: "Digital Marketing • AI Tool Creative Expert" },
    { index: "02", name: "Jadhav Adithya", title: "UI/UX • Professional Graphic Design Expert" }
  ] satisfies FounderRoleContent[]
} as const;
