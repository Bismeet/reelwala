import { PageHero } from "@/components/Shared";
import PricingSection from "@/components/sections/PricingSection";
export const metadata = { title: "Pricing" };
export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="THE REEL WALA" title="Pricing" number="02" />
      <PricingSection />
    </>
  );
}
