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
    phoneDisplay: "+91 95028 06167",
    phoneHref: "+919502806167",
    location: "Hyderabad / India"
  },
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/weareframio?igsi=ZnlteDJjNGg1d2R1",
      ariaLabel: "Open FRAMIO on Instagram",
      external: true,
      icon: "instagram",
      className: "is-instagram"
    },
    {
      label: "WhatsApp",
      href: "https://wa.link/qf1x0u.",
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
} as const;
