import type { ProcessStepContent } from "@/types/content";

export const processContent = {
  heading: { prefix: "How our system ", accent: "works" },
  description:
    "Five focused stages connect strategy, creative execution, optimization and scalable growth.",
  diagramAriaLabel:
    "FRAMIO workflow connecting brand understanding, strategy, creation, optimization and growth",
  steps: [
    {
      index: "01",
      lead: "Understand the",
      emphasis: "Brand",
      mobileTitle: "Brand",
      mobileDescription: "Understand the brand.",
      position: "left"
    },
    {
      index: "02",
      lead: "Define the",
      emphasis: "Strategy",
      mobileTitle: "Strategy",
      mobileDescription: "Define the strategy.",
      position: "top"
    },
    {
      index: "03",
      lead: "Create + Launch",
      emphasis: "The System",
      mobileTitle: "The System",
      mobileDescription: "Create + launch.",
      position: "center"
    },
    {
      index: "04",
      lead: "Measure +",
      emphasis: "Optimize",
      mobileTitle: "Optimize",
      mobileDescription: "Measure + optimize.",
      position: "bottom"
    },
    {
      index: "05",
      lead: "Scale",
      emphasis: "Growth",
      mobileTitle: "Growth",
      mobileDescription: "Scale growth.",
      position: "right"
    }
  ] satisfies ProcessStepContent[]
} as const;
