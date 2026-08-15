import type { ImageContent } from "@/types/content";

export const heroContent = {
  badge: {
    label: "SUNHERA presents",
    image: {
      src: "/assets/images/brands/brand-sunhera-4k.jpg",
      alt: "",
      width: 3840,
      height: 2617
    } satisfies ImageContent
  },
  script: "not just a",
  title: "Marketing Agency",
  description:
    "We combine strategy, powerful content, performance marketing and AI-driven creativity to build brands people remember—and businesses that grow.",
  primaryCta: "START A PROJECT",
  secondaryCta: "VIEW OUR WORK",
  servicesAriaLabel: "FRAMIO services",
  serviceTags: ["Strategy", "Branding", "Content", "Performance", "AI Creative"],
  image: {
    src: "/assets/images/hero/framio-hero-4k.webp",
    alt: "",
    width: 3840,
    height: 2160
  } satisfies ImageContent,
  fallbackImage: {
    src: "/assets/images/hero/framio-hero-1920.webp",
    alt: "",
    width: 1920,
    height: 1080
  } satisfies ImageContent
} as const;
