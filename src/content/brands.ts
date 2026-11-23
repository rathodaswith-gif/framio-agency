import type { BrandContent } from "@/types/content";

/**
 * Brand wall. Each brand needs two files in /public/assets/images/brands:
 * - brand-<name>-mono.webp  : white logo on a transparent background
 * - brand-<name>-color.webp : the original colour logo
 * `background` is the colour behind the colour logo, so the plate blends into it.
 */
export const brandsContent = {
  heading: "Brands we create for",
  description:
    "Founder-led names in education, real estate and consumer, each with its own voice and all held to one standard.",
  wallLabel: "Brands FRAMIO works with",
  cta: {
    title: "Your brand next",
    description: "Start with a short project brief.",
    ariaLabel: "Start a project with FRAMIO"
  },
  items: [
    {
      name: "StartupsIndia",
      mono: { src: "/assets/images/brands/brand-startupsindia-mono.webp", alt: "StartupsIndia", width: 948, height: 267 },
      color: { src: "/assets/images/brands/brand-startupsindia-color.webp", alt: "", width: 948, height: 267 },
      background: "#191919"
    },
    {
      name: "Vishwak Realty",
      mono: { src: "/assets/images/brands/brand-vishwak-mono.webp", alt: "Vishwak Realty", width: 1000, height: 272 },
      color: { src: "/assets/images/brands/brand-vishwak-color.webp", alt: "", width: 1000, height: 272 },
      background: "#fefefe"
    },
    {
      name: "Bizgurukul",
      mono: { src: "/assets/images/brands/brand-bizgurukul-mono.webp", alt: "Bizgurukul", width: 959, height: 260 },
      color: { src: "/assets/images/brands/brand-bizgurukul-color.webp", alt: "", width: 959, height: 260 },
      background: "#fefefe"
    },
    {
      name: "VH",
      mono: { src: "/assets/images/brands/brand-wh-mono.webp", alt: "VH", width: 948, height: 692 },
      color: { src: "/assets/images/brands/brand-wh-color.webp", alt: "", width: 948, height: 692 },
      background: "#000000"
    },
    {
      name: "AchieverZon",
      mono: { src: "/assets/images/brands/brand-achieverzon-mono.webp", alt: "AchieverZon", width: 956, height: 206 },
      color: { src: "/assets/images/brands/brand-achieverzon-color.webp", alt: "", width: 956, height: 206 },
      background: "#fefefe"
    },
    {
      name: "Sunhera",
      mono: { src: "/assets/images/brands/brand-sunhera-mono.webp", alt: "Sunhera", width: 950, height: 624 },
      color: { src: "/assets/images/brands/brand-sunhera-color.webp", alt: "", width: 950, height: 624 },
      background: "#340100"
    },
    {
      name: "RichIND",
      mono: { src: "/assets/images/brands/brand-richind-mono.webp", alt: "RichIND", width: 987, height: 377 },
      color: { src: "/assets/images/brands/brand-richind-color.webp", alt: "", width: 987, height: 377 },
      background: "#fefefe"
    }
  ] satisfies BrandContent[]
} as const;
