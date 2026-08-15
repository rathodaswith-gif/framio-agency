import type { StatContent } from "@/types/content";

export const statsContent = {
  artImages: {
    red: "/assets/images/stats/numbers-sunburst-red.jpg",
    blue: "/assets/images/stats/numbers-sunburst-blue.jpg"
  },
  heading: { prefix: "Numbers that ", accent: "matter" },
  description:
    "Not vanity. Real creative performance—built through strategy, content, design and consistent execution.",
  items: [
    {
      index: "01",
      value: 12,
      suffix: "+",
      label: "Brands",
      description: "Built with ambitious teams across growing categories.",
      art: "red"
    },
    {
      index: "02",
      value: 150,
      suffix: "+",
      label: "Creatives",
      description: "Visuals, campaigns and content systems delivered.",
      art: "blue"
    },
    {
      index: "03",
      value: 3,
      suffix: "M+",
      label: "Reach",
      description: "Attention generated through content and campaigns.",
      art: "red",
      featured: true
    },
    {
      index: "04",
      value: 5,
      suffix: "+",
      label: "Industries",
      description: "From real estate and education to consumer brands.",
      art: "blue"
    }
  ] satisfies StatContent[],
  captions: ["Strategy", "Creative", "Performance"]
} as const;
