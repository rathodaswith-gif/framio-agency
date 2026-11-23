import type { StatContent } from "@/types/content";

/**
 * "Numbers that matter". Each number rolls into place on 3D counter drums.
 * Change `value` and `suffix` to update a stat; mark one item `featured`.
 */
export const statsContent = {
  heading: "Numbers that matter",
  description:
    "Not vanity metrics. Results built through strategy, content, design and consistent execution.",
  panelLabel: "FRAMIO in numbers",
  items: [
    {
      value: 12,
      suffix: "+",
      label: "Brands",
      description: "Built with ambitious teams across growing categories."
    },
    {
      value: 150,
      suffix: "+",
      label: "Creatives",
      description: "Visuals, campaigns and content systems delivered."
    },
    {
      value: 3,
      suffix: "M+",
      label: "Reach",
      description: "Attention generated through content and campaigns.",
      featured: true
    },
    {
      value: 5,
      suffix: "+",
      label: "Industries",
      description: "From real estate and education to consumer brands."
    }
  ] satisfies StatContent[],
  captions: ["Strategy", "Creative", "Performance"]
} as const;
