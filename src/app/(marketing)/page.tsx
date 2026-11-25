import { HomeExperience } from "@/components/experience/HomeExperience";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { WorkReelSection } from "@/components/sections/WorkReelSection";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ProcessSection />
        <ServicesSection />
        <StatsSection />
        <WorkReelSection />
        <BrandsSection />
        <ManifestoSection />
      </main>
      <SiteFooter />
      <MobileMenu />
      <HomeExperience />
    </>
  );
}
