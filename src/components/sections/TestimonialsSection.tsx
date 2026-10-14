import { Button, Eyebrow } from "../Shared";
import s from "../site.module.css";
export default function TestimonialsSection() {
  return (
    <section
      className={s.sectionSmall}
      id="testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className={s.container}>
        <div className={s.emptyState}>
          <Eyebrow>06 / THE PEOPLE BEHIND THE MOMENTS</Eyebrow>
          <div className={s.emptySymbol} aria-hidden="true">
            “
          </div>
          <h2 id="testimonials-title">
            Every occasion
            <br />
            has a story.
          </h2>
          <p>
            Customer stories will be shared here.
          </p>
          <Button href="/#services" dark>
            Explore Our Services
          </Button>
        </div>
      </div>
    </section>
  );
}
