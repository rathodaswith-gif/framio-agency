import type { BrandContent } from "@/types/content";

export const brandsContent = {
  heading: "We’re working with brands",
  description:
    "A compact showcase of founder-led, education, real-estate and consumer brands we create for.",
  rowOneAriaLabel: "Brand logos row one",
  rowTwoAriaLabel: "Brand logos row two",
  items: [
    { name: "StartupsIndia", image: { src: "/assets/images/brands/brand-startupsindia-4k.jpg", alt: "StartupsIndia logo", width: 3840, height: 1025 } },
    { name: "VH", image: { src: "/assets/images/brands/brand-wh-4k.jpg", alt: "VH logo", width: 3840, height: 2879 } },
    { name: "Vishwak Realty", image: { src: "/assets/images/brands/brand-vishwak-4k.jpg", alt: "Vishwak Realty logo", width: 3840, height: 1046 } },
    { name: "Bizgurukul", image: { src: "/assets/images/brands/brand-bizgurukul-4k.jpg", alt: "Bizgurukul logo", width: 3840, height: 1000 } },
    { name: "AchieverZon", image: { src: "/assets/images/brands/brand-achieverzon-4k.jpg", alt: "AchieverZon logo", width: 3840, height: 790 } },
    { name: "Sunhera", image: { src: "/assets/images/brands/brand-sunhera-4k.jpg", alt: "Sunhera logo", width: 3840, height: 2617 } },
    { name: "RichIND", image: { src: "/assets/images/brands/brand-richind-4k.jpg", alt: "RichIND logo", width: 3840, height: 1447 } }
  ] satisfies BrandContent[]
} as const;
