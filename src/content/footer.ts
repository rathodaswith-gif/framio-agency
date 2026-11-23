import type { SocialLinkContent } from "@/types/content";

export const footerContent = {
  heading: ["Let’s make your brand", "impossible to scroll past."],
  description:
    "Tell us what you’re launching. We reply within 24 hours with the clearest next step.",
  primaryCta: "Start a project",
  whatsappCta: {
    label: "WhatsApp us",
    href: "https://wa.link/qf1x0u"
  },
  labels: {
    email: "Email",
    phone: "Call",
    studio: "Studio",
    explore: "Explore",
    social: "Follow",
    localTime: "Hyderabad",
    timeZone: "IST",
    backToTop: "Back to top"
  },
  contact: {
    email: "framioagency.india@gmail.com",
    phoneDisplay: "+91 90143 79060",
    phoneHref: "+919014379060",
    studio: ["Sigma Hub, 5th floor", "Kondapur, Hyderabad 500084"]
  },
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/weareframio?igsi=ZnlteDJjNGg1d2R1",
      ariaLabel: "FRAMIO on Instagram",
      external: true,
      icon: "instagram"
    },
    {
      label: "WhatsApp",
      href: "https://wa.link/qf1x0u",
      ariaLabel: "Message FRAMIO on WhatsApp",
      external: true,
      icon: "whatsapp"
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/rathod-asvith-2abbb2406/",
      ariaLabel: "Rathod Asvith on LinkedIn",
      external: true,
      icon: "linkedin"
    }
  ] satisfies SocialLinkContent[],
  /** Giant wordmark at the bottom. The letter at `accentIndex` uses the logo red. */
  wordmark: { text: "FRAMIO", accentIndex: 2 },
  legalName: "FRAMIO Marketing"
} as const;
