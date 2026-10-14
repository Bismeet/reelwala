import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Scene3D from "./Scene3D";
import ReplayMoment from "./ReplayMoment";
import s from "./celebration.module.css";

export function StoryHero() {
  return (
    <section id="home" className={s.hero} aria-labelledby="hero-title">
      <div className={s.stage} data-hero-stage data-hero-phase="0">
        <div className={s.world} data-hero-art>
          <Scene3D kind="hero" />
        </div>
        <p className={s.accessibleScene}>
          An outdoor night party: guests cheer and clap around a celebration
          cake under warm fairy lights while a creator films them. Scroll to
          follow that same moment into the phone’s portrait recording.
        </p>
        <div className={s.copy} data-hero-copy>
          <span className={s.kicker}>THE REEL WALA</span>
          <h1 id="hero-title">
            You lived it.
            <br />
            <em>We captured it.</em>
          </h1>
          <p>
            Be present at your occasion. We’ll capture the moments you’ll want
            to replay.
          </p>
          <span className={s.categories}>
            Private celebrations · Corporate events · Cultural gatherings
          </span>
          <Link href="/#enquiry" className={s.book}>
            Book your shoot <ArrowUpRight size={18} />
          </Link>
          <ReplayMoment />
        </div>
        <a href="#hero-story" className={s.scroll} data-hero-scroll>
          SCROLL TO SEE IT CAPTURED <ArrowDown size={16} />
        </a>
        <span className={s.sceneNote}>A MOMENT IN THE MAKING.</span>
        <div className={s.progress} aria-hidden="true">
          <i data-hero-progress />
        </div>
      </div>
      <span id="hero-story" className={s.endAnchor} aria-hidden="true" />
    </section>
  );
}
