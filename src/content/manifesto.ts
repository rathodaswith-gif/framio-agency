import type { ManifestoContent } from "@/types/content";

/**
 * "Carved colour" manifesto: a grey marble Earth with a palette knife carving
 * a ribbon of colour out of it. As visitors scroll, the ribbon paints in from
 * the knife cut and the second line of the headline paints in with it.
 */
export const manifestoContent = {
  heading: {
    grey: "Most brands blend in.",
    colour: "We carve out colour."
  },
  body:
    "From a distance every market looks the same: the same posts, the same offers, the same grey. We find the one thing only your brand can own and carve it into work people stop for.",
  image: {
    alt: "A hand with a palette knife carving a ribbon of orange, red and blue paint out of a grey marble Earth",
    wide: {
      src: "/assets/images/manifesto/carve-1881.webp",
      srcSet: "/assets/images/manifesto/carve-1200.webp 1200w, /assets/images/manifesto/carve-1881.webp 1881w",
      width: 1881,
      height: 836
    },
    phone: {
      srcSet: "/assets/images/manifesto/carve-phone-800.webp 800w, /assets/images/manifesto/carve-phone-1250.webp 1250w",
      width: 1250,
      height: 836
    }
  }
} as const satisfies ManifestoContent;
