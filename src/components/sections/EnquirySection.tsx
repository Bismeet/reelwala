import { Eyebrow } from "../Shared";
import { EnquiryForm } from "../Forms";
import BookingQuestions from "../BookingQuestions";
import s from "../site.module.css";
export default function EnquirySection() {
  return (
    <>
      {" "}
      <section className={s.section} id="enquiry">
        <div className={`${s.container} ${s.formGrid}`}>
          <div className={s.formIntro}>
            <Eyebrow>LET’S MAKE A MEMORY</Eyebrow>
            <h2>Book Your Shoot with TheReelWala</h2>
            <h3>Your Events, Captured in Reels!</h3>
            <p>
              From corporate gatherings to weddings and creative events, we turn
              your special moments into engaging, scroll-stopping reels.
            </p>
            <p>
              Fill out the form to book your session. Let’s create content that
              captures the vibe of your event and makes every moment worth
              sharing.
            </p>
          </div>
          <EnquiryForm />
        </div>
      </section>
      <section className={s.sectionSmall}>
        <div className={`${s.container} ${s.formGrid}`}>
          <div>
            <Eyebrow>A FEW LITTLE DETAILS</Eyebrow>
            <h2 className={s.sectionTitle}>
              Before your
              <br />
              <span className={s.serif}>next chapter.</span>
            </h2>
          </div>
          <BookingQuestions />
        </div>
      </section>
    </>
  );
}
