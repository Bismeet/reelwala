import ServicesSection from "@/components/sections/ServicesSection";
import StoryMotion from "@/components/story/StoryMotion";
import { PageHero } from "@/components/Shared";
export const metadata = { title: "Services" };
export default function ServicesPage() {
  return (
    <StoryMotion>
      <PageHero eyebrow="THE REEL WALA" title="Services" number="01" />
      <ServicesSection />
    </StoryMotion>
  );
}
