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
  index: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  art: "red" | "blue";
  featured?: boolean;
}

export interface PortfolioItemContent {
  title: string;
  caption: string;
  image: ImageContent;
}

export interface FounderRoleContent {
  index: string;
  name: string;
  title: string;
}

export interface BrandContent {
  name: string;
  image: ImageContent;
}

export type SocialIcon = "instagram" | "whatsapp" | "linkedin";

export interface SocialLinkContent extends LinkContent {
  icon: SocialIcon;
  className: string;
}

export interface TestimonialContent {
  quote: string;
  name: string;
  role: string;
  company: string;
  image?: ImageContent;
}
