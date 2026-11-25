export type AssetPath = `/${string}`;

export interface LinkContent {
  label: string;
  href: string;
  ariaLabel?: string;
  external?: boolean;
}

export interface HeadingContent {
  prefix: string;
  accent?: string;
}

export interface ImageContent {
  src: AssetPath;
  alt: string;
  width: number;
  height: number;
}

export interface NavigationItem extends LinkContent {
  section: string;
  index: string;
}

export interface ProcessStepContent {
  index: string;
  lead: string;
  emphasis: string;
  mobileTitle: string;
  mobileDescription: string;
  position: "left" | "top" | "center" | "bottom" | "right";
}

export interface ServiceToolContent {
  label: string;
  kind: "image" | "analytics";
  image?: ImageContent;
  imageClassName?: string;
}

export interface SupportServiceContent {
  number: string;
  variant: "content" | "creative" | "brand";
  title: string;
  items?: string[];
  description?: string;
  badge?: string;
  artImages?: ImageContent[];
}

export interface StatContent {
  /** Whole number shown on the rolling counter, e.g. 150. */
  value: number;
  /** Text after the number, e.g. "+" or "M+". */
  suffix: string;
  label: string;
  description: string;
  /** Highlights this stat with the frame corners and light. Use on one item. */
  featured?: boolean;
}

export interface WorkReelContent {
  /** Short title shown under the playing reel, e.g. "Launch reel". */
  title: string;
  /** Client or brand name. Leave empty to hide it. */
  client: string;
  /** Kind of piece, e.g. "Reel", "Ad film", "Motion promo". */
  format: string;
  video: {
    /** MP4 (H.264) in /public/assets/videos/work. Vertical 9:16 works best. */
    src: AssetPath;
    /** Still frame shown before the reel plays and on the side cards. */
    poster?: AssetPath;
  };
}

export interface HeroClipContent {
  /** Client or project name shown in the viewfinder, e.g. "Terrace 35". */
  name: string;
  /** Kind of piece, e.g. "Real estate reel". */
  format: string;
  video: {
    /** Short (about 6 s) vertical MP4 in /public/assets/videos/hero, no audio. */
    src: AssetPath;
    /** First frame as a JPG; shown before the clip plays and for reduced motion. */
    poster: AssetPath;
  };
}

export interface ManifestoContent {
  heading: {
    /** First line, stays grey. */
    grey: string;
    /** Second line, paints in with the ribbon colours on scroll. */
    colour: string;
  };
  body: string;
  image: {
    alt: string;
    /** Full artwork for tablets and desktops. */
    wide: { src: AssetPath; srcSet: string; width: number; height: number };
    /** Tighter crop (globe, cut, ribbon, hand) for phones. */
    phone: { srcSet: string; width: number; height: number };
  };
}

export interface FounderRoleContent {
  index: string;
  name: string;
  title: string;
}

export interface BrandContent {
  name: string;
  /** White, transparent version shown on the dark brand wall. */
  mono: ImageContent;
  /** Full-colour logo revealed when the plate comes forward. */
  color: ImageContent;
  /** Background colour of the colour logo, so the plate blends with it. */
  background: string;
}

export type SocialIcon = "instagram" | "whatsapp" | "linkedin";

export interface SocialLinkContent extends LinkContent {
  icon: SocialIcon;
}

export interface TestimonialContent {
  quote: string;
  name: string;
  role: string;
  company: string;
  image?: ImageContent;
}
