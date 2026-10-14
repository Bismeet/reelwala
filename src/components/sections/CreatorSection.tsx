import { CreatorMotif } from "../story/Narrative";
import { CreatorSteps, Eyebrow } from "../Shared";
import { CreatorForm } from "../Forms";
import s from "../site.module.css";
export default function CreatorSection() {
  return (
    <section id="become-a-creator" aria-labelledby="creator-title">
      {" "}
      <section className={s.sectionSmall}>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <div>
              <Eyebrow>07 / BEHIND THE REPLAY</Eyebrow>
              <h2 className={s.sectionTitle} id="creator-title">
                See the moment.
                <br />
                <span className={s.serif}>Tell its story.</span>
              </h2>
            </div>
            <p className={s.sectionDescription}>
              Bring your eye for the little things. Become a creator with The
              Reel Wala.
            </p>
          </div>
          <Eyebrow>YOUR NEXT CHAPTER</Eyebrow>
          <h2 className="sr-only">Four steps to creating with us</h2>
          <CreatorSteps />
        </div>
      </section>
      <section className={s.section} id="application">
        <div className={`${s.container} ${s.formGrid}`}>
          <div className={s.formIntro}>
            <Eyebrow>BECOME A CREATOR</Eyebrow>
            <h2>The best stories start with you.</h2>
            <p>
              You notice the laugh between the poses. The energy in a room. The
              moments everyone else walks past.
            </p>
            <p>
              Share your details and the work you’re proud of. This is your
              first step towards creating with us.
            </p>
            <CreatorMotif />
          </div>
          <CreatorForm />
        </div>
      </section>
    </section>
  );
}
