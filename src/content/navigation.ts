import type { NavigationItem } from "@/types/content";

export const navigationContent = {
  ariaLabel: "Primary navigation",
  mobileAriaLabel: "Mobile navigation",
  mobileEyebrow: "FRAMIO / Navigation",
  openLabel: "MENU +",
  closeLabel: "CLOSE ×",
  openAriaLabel: "Open navigation menu",
  closeAriaLabel: "Close navigation menu",
  ctaLabel: "START A PROJECT",
  items: [
    { label: "Work", href: "#work", section: "work", index: "01" },
    { label: "Services", href: "#services", section: "services", index: "02" },
    { label: "Process", href: "#process", section: "process", index: "03" },
    { label: "Brands", href: "#brands", section: "brands", index: "04" }
  ] satisfies NavigationItem[],
  mobileMeta: ["Hyderabad, India", "Creative × Growth × AI"]
} as const;
