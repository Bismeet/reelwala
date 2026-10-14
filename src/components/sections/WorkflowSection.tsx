import { Eyebrow, Steps } from "../Shared";
import EnquirySection from "./EnquirySection";
import s from "../site.module.css";

export default function WorkflowSection() {
  return (
    <section id="how-it-works" aria-labelledby="workflow-title">
      <div className={s.section}>
        <div className={s.container}>
          <div className={s.sectionHead} data-reveal>
            <div>
              <Eyebrow>04 / WORKFLOW</Eyebrow>
              <h2 className={s.sectionTitle} id="workflow-title">
                Your occasion.
                <br />
                <span className={s.serif}>Taken care of.</span>
              </h2>
            </div>
            <p className={s.sectionDescription}>
              Tell us where, what &amp; when.
              <br />
              We’ll take it from there.
            </p>
          </div>
          <Steps />
        </div>
      </div>
      <EnquirySection />
    </section>
  );
}
