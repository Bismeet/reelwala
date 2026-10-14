import { ArrowUpRight, Focus, MoveUpRight } from "lucide-react";
import Link from "next/link";
import Scene3D from "@/features/scene-3d/components/Scene3D";
export { StoryHero } from "./CelebrationHero";
import s from "./story.module.css";

export function CaptureStory() {
  return (
    <section
      className={s.captureSection}
      id="story"
      aria-labelledby="story-title"
    >
      <div className={s.sectionTop}>
        <span>01 / THE LITTLE THINGS</span>
        <span>BE IN THE MOMENT ↘</span>
      </div>
      <div className={s.captureHeading} data-reveal>
        <h2 id="story-title">
          Life doesn’t
          <br />
          <em>stop for a retake.</em>
        </h2>
        <p>
          So be there. Dance a little longer.
          <br />
          Laugh a little louder.
          <br />
          We’ll notice the details.
        </p>
      </div>
      <div className={s.captureStage} data-capture-stage>
        <div className={s.captureArt} data-capture-art>
          <Scene3D kind="capture" />
        </div>
        <div className={s.focusFrame} data-focus-frame aria-hidden="true">
          <span>FOCUS ON WHAT MATTERS.</span>
          <i />
          <i />
          <i />
          <i />
          <small>9:16 / A DIFFERENT PERSPECTIVE</small>
        </div>
        <span className={s.captureAnnotation}>01 — NOTICE THE DETAILS</span>
        <span className={s.captureAnnotationRight}>02 — FIND THE FEELING</span>
      </div>
      <div className={s.captureFooter}>
        <p>Your occasion. Our eye for the moments inside it.</p>
        <Link href="/#how-it-works">
          See how it works <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export function EditStory() {
  return (
    <section id="work" className={s.editSection} aria-labelledby="work-title">
      <div className={s.sectionTop}>
        <span>03 / FROM MOMENT TO MEMORY</span>
        <span>THE ART OF THE REPLAY</span>
      </div>
      <div className={s.editHeading} data-reveal>
        <h2 id="work-title">
          A little rhythm.
          <br />
          <em>A whole lot of feeling.</em>
        </h2>
        <p>
          The details come together.
          <br />
          Your story takes shape.
        </p>
      </div>
      <div className={s.editStage} data-edit-stage>
        <div className={s.editStageTop}>
          <span>
            <i /> THE MOMENTS
          </span>
          <span>THE REEL WALA / EDIT STUDY</span>
          <span>THE MEMORY ↘</span>
        </div>
        <div className={s.editWorld}>
          <Scene3D kind="edit" />
        </div>
        <div className={s.editTimeline} data-edit-timeline aria-hidden="true">
          <span>00:00</span>
          <div>
            <b />
            <b />
            <b />
            <i data-edit-playhead />
          </div>
          <span>00:03</span>
        </div>
        <p className={s.editFinished} data-edit-finished>
          One occasion. <em>Yours to replay.</em> <MoveUpRight size={18} />
        </p>
      </div>
      <div className={s.editFooter}>
        <span>A SCULPTURAL STUDY OF THE EDIT</span>
        <p>
          Real occasions deserve real examples. Our selected client reels will
          appear here once approved for sharing.
        </p>
      </div>
    </section>
  );
}

export function Invitation() {
  return (
    <div className={s.invitation}>
      <span>THE NEXT STORY IS YOURS.</span>
      <p>
        What are we
        <br />
        <em>capturing next?</em>
      </p>
      <svg
        viewBox="0 0 660 42"
        fill="none"
        aria-hidden="true"
        data-invitation-line
      >
        <path
          d="M5 30Q275-13 651 19M207 35q215-22 385-5"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function CreatorMotif() {
  return (
    <div className={s.creatorMotif} aria-hidden="true">
      <Focus size={76} strokeWidth={0.65} />
      <span>
        AN EYE FOR
        <br />
        <em>the moment.</em>
      </span>
      <ArrowUpRight size={32} strokeWidth={1} />
    </div>
  );
}
