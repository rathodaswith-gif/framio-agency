import type { SocialLinkContent } from "@/types/content";

export const footerContent = {
  backgroundImage: "/assets/images/footer/footer-framio.svg" as const,
  heading: { prefix: "Build a brand with ", accent: "hero energy" },
  description:
    "Performance marketing, high-status visuals and creative systems that feel sharp, bold and unforgettable.",
  primaryCta: "START A PROJECT",
  secondaryCta: "See our work",
  brandNote: "Creative × Growth × AI - premium digital experiences built from Hyderabad.",
  sectionsLabel: "Sections",
  contactLabel: "Contact",
  socialLabel: "Social",
  contact: {
    email: "framioagency.india@gmail.com",
    phoneDisplay: "+91 94940 29070",
    phoneHref: "+919494029070",
    location: "Hyderabad / India"
  },
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/framioagency.india/",
      ariaLabel: "Open FRAMIO on Instagram",
      external: true,
      icon: "instagram",
      className: "is-instagram"
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/919494029070?text=Hi%20FRAMIO%2C%20I%27d%20like%20to%20discuss%20a%20project.",
      ariaLabel: "Message FRAMIO on WhatsApp",
      external: true,
      icon: "whatsapp",
      className: "is-whatsapp"
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/rathod-asvith-2abbb2406/",
      ariaLabel: "Open Rathod Asvith on LinkedIn",
      external: true,
      icon: "linkedin",
      className: "is-linkedin"
    }
  ] satisfies SocialLinkContent[],
  copyright: "© 2026 FRAMIO",
  closingLine: "Designed with cinematic intent"
} as const;
