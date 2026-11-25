import type { HeroClipContent, ImageContent } from "@/types/content";

/**
 * The hero plays a showreel of FRAMIO's own work in a 3D monitor.
 *
 * To change the showreel:
 * 1. Put a short vertical clip (about 6 s, 9:16, H.264, no audio, under ~1 MB)
 *    and a JPG still of its first frame in /public/assets/videos/hero.
 * 2. Add or edit an entry in `reel.clips`. Order here = play order.
 */
export const heroContent = {
  badge: {
    label: "SUNHERA presents",
    image: {
      src: "/assets/images/brands/brand-sunhera-4k.jpg",
      alt: "",
      width: 3840,
      height: 2617
    } satisfies ImageContent
  },
  script: "not just a",
  title: "Marketing Agency",
  description:
    "We combine strategy, powerful content, performance marketing and AI-driven creativity to build brands people remember and businesses that grow.",
  primaryCta: "START A PROJECT",
  secondaryCta: "VIEW OUR WORK",
  reel: {
    ariaLabel: "FRAMIO showreel",
    pause: "Pause showreel",
    play: "Play showreel",
    showClip: "Show clip",
    clips: [
      {
        name: "Grand opening promo",
        format: "Brand film",
        video: { src: "/assets/videos/hero/grand-opening.mp4", poster: "/assets/videos/hero/grand-opening.jpg" }
      },
      {
        name: "Terrace 35",
        format: "Real estate reel",
        video: { src: "/assets/videos/hero/terrace-35.mp4", poster: "/assets/videos/hero/terrace-35.jpg" }
      },
      {
        name: "Personal brand story",
        format: "Story reel",
        video: { src: "/assets/videos/hero/creator-story.mp4", poster: "/assets/videos/hero/creator-story.jpg" }
      },
      {
        name: "Raghava LINQ",
        format: "Real estate ad",
        video: { src: "/assets/videos/hero/raghava-linq.mp4", poster: "/assets/videos/hero/raghava-linq.jpg" }
      },
      {
        name: "Township walkthrough",
        format: "Real estate reel",
        video: { src: "/assets/videos/hero/west-hyderabad-township.mp4", poster: "/assets/videos/hero/west-hyderabad-township.jpg" }
      }
    ] satisfies HeroClipContent[]
  }
} as const;
