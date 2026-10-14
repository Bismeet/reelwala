import { PageHero } from "@/components/Shared";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
export const metadata = { title: "Testimonials" };
export default function TestimonialsPage() {
  return (
    <>
      <PageHero eyebrow="THE REEL WALA" title="Testimonials" number="03" />
      <TestimonialsSection />
    </>
  );
}
