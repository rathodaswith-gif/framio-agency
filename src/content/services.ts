import type { ImageContent, ServiceToolContent, SupportServiceContent } from "@/types/content";

const image = (src: ImageContent["src"], alt: string, width: number, height: number): ImageContent => ({
  src,
  alt,
  width,
  height
});

export const servicesContent = {
  backgroundImage: "/assets/images/services/services-dot-grid.png" as const,
  heading: { prefix: "Everything your brand ", accent: "needs to grow" },
  description: "One connected system for performance, content, production and digital experiences.",
  featured: {
    number: "01",
    title: "Performance Marketing",
    description:
      "We turn attention into measurable growth with campaigns built to acquire, convert and scale.",
    ctaLabel: "Start a Project",
    toolsAriaLabel: "Advertising and analytics platforms",
    tools: [
      {
        label: "Meta Ads",
        kind: "image",
        image: image("/assets/images/services/meta-logo.jpg", "", 736, 736)
      },
      {
        label: "Google Ads",
        kind: "image",
        imageClassName: "framio-services__tool-media--google",
        image: image("/assets/images/services/services-google-logo.png", "", 512, 173)
      },
      { label: "Analytics", kind: "analytics" }
    ] satisfies ServiceToolContent[],
    deliverablesLabel: "Growth deliverables",
    deliverables: [
      "Meta Ads Strategy & Campaign Management",
      "Google Search, Display & YouTube Ads",
      "Tracking, Retargeting & Conversion Optimisation"
    ]
  },
  support: [
    {
      number: "02",
      variant: "content",
      title: "Content & Social Growth",
      items: [
        "Content Strategy & Monthly Planning",
        "Reels & Short-Form Content",
        "Social Media Management",
        "Copywriting & Storytelling",
        "Organic Growth Systems"
      ],
      artImages: [image("/assets/images/services/services-growth-gem.webp", "", 512, 512)]
    },
    {
      number: "03",
      variant: "creative",
      title: "Creative Production",
      items: [
        "Performance Ad Creatives",
        "Video Editing & Motion Graphics",
        "Brand Films & Product Reels",
        "Posters, Thumbnails & Social Design"
      ],
      artImages: [
        image("/assets/images/services/services-premiere.png", "", 512, 499),
        image("/assets/images/services/services-ae.png", "", 512, 499),
        image("/assets/images/services/services-davinci.png", "", 512, 512)
      ]
    },
    {
      number: "04",
      variant: "brand",
      badge: "Full Stack",
      title: "Brand & Web Experiences",
      description:
        "Distinct visual identities and conversion-focused digital experiences designed to make your brand impossible to ignore.",
      artImages: [image("/assets/images/services/services-ai-star.webp", "", 512, 512)]
    }
  ] satisfies SupportServiceContent[]
} as const;
