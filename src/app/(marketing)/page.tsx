import { HomeExperience } from "@/components/experience/HomeExperience";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ProcessSection />
        <ServicesSection />
        <StatsSection />
        <PortfolioSection />
        <BrandsSection />
        <SiteFooter />
      </main>
      <MobileMenu />
      <HomeExperience />
    </>
  );
}
