import { PageHero } from "@/components/Shared";
import WorkflowSection from "@/components/sections/WorkflowSection";
export const metadata = { title: "Workflow" };
export default function WorkflowPage() {
  return (
    <>
      <PageHero eyebrow="THE REEL WALA" title="Workflow" number="04" />
      <WorkflowSection />
    </>
  );
}
