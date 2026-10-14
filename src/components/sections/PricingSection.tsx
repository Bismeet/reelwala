import { CheckItem, Eyebrow } from "../Shared";
import EnquiryLink from "../EnquiryLink";
import s from "../site.module.css";
export default function PricingSection() {
  return (
    <section className={s.section} id="pricing" aria-labelledby="pricing-title">
      <div className={s.container}>
        <div className={s.sectionHead}>
          <div>
            <Eyebrow>05 / FIND YOUR FIT</Eyebrow>
            <h2 className={s.sectionTitle} id="pricing-title">
              Room for
              <br />
              <span className={s.serif}>every story.</span>
            </h2>
          </div>
          <p className={s.sectionDescription}>
            Compare the shoot options for your occasion.
          </p>
        </div>
        <div className={s.packages}>
          <article className={s.package}>
            <span className={s.packageIndex}>01 / STANDARD</span>
            <h3>Standard package</h3>
            <p className={s.packageDescription}>
              Quick, focused content for when you need a high-quality reel
              without the wait.
            </p>
            <div className={s.price}>
              ₹1,999 <small>+ GST</small>
            </div>
            <ul className={s.packageList}>
              <CheckItem>4 complimentary colour-graded pictures</CheckItem>
              <CheckItem>Within 24 hours reel delivery</CheckItem>
              <CheckItem>Up to 1 hour shoot time</CheckItem>
              <CheckItem>1 edited reel, up to 60 seconds</CheckItem>
              <CheckItem>Trained and certified reel maker</CheckItem>
              <CheckItem>Shot on the latest iPhones</CheckItem>
            </ul>
            <EnquiryLink packageId="standard" dark>
              Enquire About This Package
            </EnquiryLink>
          </article>
          <article className={`${s.package} ${s.packageAccent}`}>
            <span className={s.packageIndex}>02 / MORE OF YOUR MOMENT</span>
            <h3>Half Day package</h3>
            <p className={s.packageDescription}>
              Ideal for longer shoots, events, and creating multiple
              high-quality reels in one session.
            </p>
            <div className={s.price}>
              ₹4,999 <small>+ GST</small>
            </div>
            <ul className={s.packageList}>
              <CheckItem>Up to 4 hours shoot time</CheckItem>
              <CheckItem>7 complimentary colour-graded pictures</CheckItem>
              <CheckItem>Within 24 hours reel delivery</CheckItem>
              <CheckItem>2 edited reels, up to 60 seconds each</CheckItem>
              <CheckItem>Trained and certified reel maker</CheckItem>
              <CheckItem>Shot on the latest iPhones</CheckItem>
              <CheckItem>Raw footage access</CheckItem>
            </ul>
            <EnquiryLink packageId="extended-session">
              Enquire About This Package
            </EnquiryLink>
          </article>
          <article className={s.package}>
            <span className={s.packageIndex}>03 / PREMIUM</span>
            <h3>Premium package</h3>
            <p className={s.packageDescription}>
              Share your occasion and requirements with us.
            </p>
            <div className={s.price}>Enquire</div>
            <EnquiryLink packageId="premium" dark>
              Share Your Requirements
            </EnquiryLink>
          </article>
        </div>
        <div className={s.addon}>
          <div>
            <Eyebrow>A LITTLE LONGER</Eyebrow>
            <h3>Extended hour</h3>
            <p>Keep capturing your occasion for an extra hour.</p>
          </div>
          <div className={s.price} style={{ marginTop: 0 }}>
            ₹1,000
          </div>
        </div>
        <p className={s.fineprint}>
          Submit an enquiry to check availability and confirm your booking.
        </p>
      </div>
    </section>
  );
}
