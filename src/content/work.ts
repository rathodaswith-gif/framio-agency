import type { WorkReelContent } from "@/types/content";

/**
 * "Work that moves" — the 3D reel carousel.
 *
 * To add or swap a video:
 * 1. Put the MP4 (and a JPG still for the poster) in /public/assets/videos/work.
 * 2. Add or edit an entry below. Order here = order in the carousel.
 * 3. Vertical 9:16 clips look best. Keep each file under ~10 MB (H.264, 720×1280 or 1080×1920).
 *
 * `client` shows next to the format under the playing reel. Leave it empty to hide it.
 */
export const workContent = {
  heading: "Work that moves",
  description:
    "Reels, ad films and motion pieces we’ve edited and animated for the brands we work with.",
  carouselLabel: "FRAMIO work reels",
  controls: {
    previous: "Previous reel",
    next: "Next reel",
    play: "Play",
    pause: "Pause",
    soundOn: "Sound on",
    soundOff: "Sound off",
    dragHint: "Drag or use the arrows"
  },
  cta: {
    label: "Start a project",
    note: "Want a reel like these?"
  },
  items: [
    {
      title: "Luxury launch film",
      client: "Raghava LINQ",
      format: "Real estate ad",
      video: { src: "/assets/videos/work/raghava-linq.mp4", poster: "/assets/videos/work/raghava-linq.jpg" }
    },
    {
      title: "Doctor-led explainer",
      client: "ORA Skin & Hair Clinics",
      format: "Healthcare reel",
      video: { src: "/assets/videos/work/ora-skin-hair.mp4", poster: "/assets/videos/work/ora-skin-hair.jpg" }
    },
    {
      title: "Grand opening promo",
      client: "",
      format: "Brand film",
      video: { src: "/assets/videos/work/grand-opening.mp4", poster: "/assets/videos/work/grand-opening.jpg" }
    },
    {
      title: "Project launch reel",
      client: "Terrace 35",
      format: "Real estate reel",
      video: { src: "/assets/videos/work/terrace-35.mp4", poster: "/assets/videos/work/terrace-35.jpg" }
    },
    {
      title: "Personal brand story",
      client: "",
      format: "Story reel",
      video: { src: "/assets/videos/work/creator-story.mp4", poster: "/assets/videos/work/creator-story.jpg" }
    },
    {
      title: "Township walkthrough",
      client: "",
      format: "Real estate reel",
      video: { src: "/assets/videos/work/west-hyderabad-township.mp4", poster: "/assets/videos/work/west-hyderabad-township.jpg" }
    },
    {
      title: "Texture effect tutorial",
      client: "",
      format: "Motion design",
      video: { src: "/assets/videos/work/texture-effect-tutorial.mp4", poster: "/assets/videos/work/texture-effect-tutorial.jpg" }
    }
  ] satisfies WorkReelContent[]
} as const;
