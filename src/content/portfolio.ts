import type { PortfolioItemContent } from "@/types/content";

export const portfolioContent = {
  heading: "Our design style",
  description: "Premium poster directions with stronger color, contrast and editorial energy.",
  carouselAriaLabel: "Framio design style carousel",
  footerLabel: "Poster Direction • Editorial Energy",
  items: [
    {
      title: "Cinematic",
      caption: "Hero framing and movie-poster energy.",
      image: { src: "/assets/images/portfolio/style-spiderman.jpg", alt: "Editorial Spider-Man style poster", width: 736, height: 1040 }
    },
    {
      title: "Bold",
      caption: "Big type and punchy composition.",
      image: { src: "/assets/images/portfolio/style-deadpool.webp", alt: "Deadpool graphic poster style", width: 736, height: 920 }
    },
    {
      title: "Grit",
      caption: "Rough print texture and layered mood.",
      image: { src: "/assets/images/portfolio/style-fightclub.jpg", alt: "Fight Club inspired gritty poster style", width: 736, height: 964 }
    },
    {
      title: "Dark",
      caption: "Clean tension with premium contrast.",
      image: { src: "/assets/images/portfolio/style-psycho.webp", alt: "American Psycho inspired noir poster style", width: 736, height: 981 }
    },
    {
      title: "Dynamic",
      caption: "Sharp movement and attitude-led layout.",
      image: { src: "/assets/images/portfolio/style-ferrari.jpg", alt: "Sport style editorial poster", width: 736, height: 910 }
    },
    {
      title: "Stylish",
      caption: "Cutout personality with visual flair.",
      image: { src: "/assets/images/portfolio/style-fashion.jpg", alt: "Fashion magazine style poster", width: 736, height: 920 }
    },
    {
      title: "Power",
      caption: "Heavy visual presence and iconic impact.",
      image: { src: "/assets/images/portfolio/style-kratos.webp", alt: "Kratos poster style", width: 736, height: 736 }
    }
  ] satisfies PortfolioItemContent[]
} as const;
