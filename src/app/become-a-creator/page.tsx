import { PageHero } from "@/components/Shared";
import CreatorSection from "@/components/sections/CreatorSection";
export const metadata = { title: "Become a Creator" };
export default function CreatorPage() {
  return (
    <>
      <PageHero eyebrow="THE REEL WALA" title="Become a Creator" number="05" />
      <CreatorSection />
    </>
  );
}
