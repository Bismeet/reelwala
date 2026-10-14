import ServicesSection from "@/components/sections/ServicesSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import WorkflowSection from "@/components/sections/WorkflowSection";
import CreatorSection from "@/components/sections/CreatorSection";
import SiteDetails from "@/components/sections/SiteDetails";
import StoryMotion from "@/components/story/StoryMotion";
import {
  StoryHero,
  CaptureStory,
  EditStory,
  Invitation,
} from "@/components/story/Narrative";

export default function Home() {
  return (
    <StoryMotion>
      <StoryHero />
      <CaptureStory />
      <ServicesSection />
      <EditStory />
      <WorkflowSection />
      <PricingSection />
      <TestimonialsSection />
      <Invitation />
      <CreatorSection />
      <SiteDetails />
    </StoryMotion>
  );
}
