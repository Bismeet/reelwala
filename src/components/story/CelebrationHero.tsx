import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { heroMode } from "@/content/hero-mode";
import sequence from "@/content/cinematic-sequence.json";
import { StoryHero as ThreeDHero } from "@/features/scene-3d/components/CelebrationHero";
import ScrollImageSequence from "./ScrollImageSequence";
import s from "./sequence.module.css";

export function StoryHero() {
  if (heroMode === "3d") return <ThreeDHero />;
  return (
    <section id="home" aria-labelledby="hero-title">
      <ScrollImageSequence frames={sequence.frames} />
      <div id="hero-story" className={s.introduction}>
        <div data-reveal>
          <h1 id="hero-title">
            A moment lived.
            <br />
            <em>A memory preserved.</em>
          </h1>
          <p>We turn fleeting celebrations into stories worth remembering.</p>
          <Link href="/workflow#enquiry" className={s.book}>
            Book your shoot <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
