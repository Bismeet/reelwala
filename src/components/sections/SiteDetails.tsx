"use client";
import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Eyebrow, TextLink } from "../Shared";
import s from "../site.module.css";
export default function SiteDetails() {
  useEffect(() => {
    const reveal = (hash: string) => {
      const id = hash.slice(1);
      if (!["privacy", "terms", "preview-status"].includes(id)) return;
      const node = document.getElementById(id);
      if (node instanceof HTMLDetailsElement) node.open = true;
    };
    const hashChanged = () => reveal(location.hash);
    const click = (event: MouseEvent) => {
      if (
        event.button ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (url.origin === location.origin && url.pathname === location.pathname)
        reveal(url.hash);
    };
    hashChanged();
    document.addEventListener("click", click, true);
    window.addEventListener("hashchange", hashChanged);
    return () => {
      document.removeEventListener("click", click, true);
      window.removeEventListener("hashchange", hashChanged);
    };
  }, []);
  return (
    <section className={s.sectionSmall} id="details">
      <div className={s.container}>
        <Eyebrow>A FEW MORE DETAILS</Eyebrow>
        <h2 className={s.sectionTitle}>Before your next chapter.</h2>
        <div className={s.disclosures}>
          <details id="privacy" className={s.disclosure}>
            <summary>
              <h3>Preview privacy notice</h3>
              <ChevronDown size={20} />
            </summary>
            <div className={s.legal}>
              {" "}
              <h4>What this preview saves</h4>
              <p>
                An enquiry saves your name, phone number, event type, date,
                location and optional package. A creator application saves your
                name, mobile number, email, gender, portfolio link, device
                model, locality and any files you choose to submit.
              </p>
              <h4>Where it goes</h4>
              <p>
                Records are stored in a private database on this computer.
                Creator files are stored outside the public website directory.
                They are not published as portfolio work. Notifications are
                queued locally; there is no configured email or messaging
                recipient.
              </p>
              <h4>Cookies and retention</h4>
              <p>
                An essential upload-session cookie lasts 24 hours and connects
                your selected files to your application. Unsubmitted files
                become eligible for cleanup after 24 hours; the local operator
                runs the cleanup command. Submitted records and attached files
                remain until the operator removes them. We do not add analytics,
                advertising or marketing cookies.
              </p>
              <h4>Review and deletion</h4>
              <p>
                Ask the person operating this private preview to review or
                delete your test submission. No public privacy contact has been
                supplied. A live launch requires the owner’s identity, privacy
                contact, retention period and approved notice before collecting
                customer data.
              </p>
            </div>
          </details>
          <details id="terms" className={s.disclosure}>
            <summary>
              <h3>Service terms</h3>
              <ChevronDown size={20} />
            </summary>
            <div className={s.legal}>
              {" "}
              <h4>An enquiry starts a conversation</h4>
              <p>
                Submitting your event details does not reserve a date, confirm
                availability or create a payment obligation. There is no payment
                checkout on this website.
              </p>
              <h4>Packages and delivery</h4>
              <p>
                Prices carried from reference screenshots are clearly marked for
                review. Deliverables follow the written brief where it overrides
                the screenshots. Final pricing, taxes, extra-hour scope and
                delivery timing need business confirmation before public launch.
              </p>
              <h4>Creator applications</h4>
              <p>
                Applying does not guarantee selection, a workshop place,
                assignments or earnings. Workshop arrangements, creator
                eligibility and payment terms are confirmed separately.
              </p>
              <h4>Launch terms</h4>
              <p>
                Cancellation, rescheduling, travel, permissions, ownership and
                refunds have not been supplied. This page does not invent those
                policies.
              </p>
              <TextLink href="/#enquiry">Start an enquiry</TextLink>
            </div>
          </details>
          <details id="preview-status" className={s.disclosure}>
            <summary>
              <h3>Private preview status</h3>
              <ChevronDown size={20} />
            </summary>{" "}
            <div className={s.statusGrid}>
              <article className={s.statusItem}>
                <h4>Working in this preview</h4>
                <ul>
                  <li>All 24 services, grouped as in the brief</li>
                  <li>
                    Services, Testimonials, Pricing, Workflow and Creator
                    sections on one page
                  </li>
                  <li>Saved enquiries and creator applications</li>
                  <li>Private, verified creator photo and video uploads</li>
                  <li>Responsive navigation and accessible form states</li>
                </ul>
              </article>
              <article className={s.statusItem}>
                <h4>Content still to approve</h4>
                <p>
                  Screenshot prices and deliverables, delivery conflict, premium
                  package, device eligibility, photo requirements, gender
                  options and locality requiredness. Real work, testimonials and
                  business contact details are still needed.
                </p>
              </article>
              <article className={s.statusItem}>
                <h4>Illustrative photography</h4>
                <p>
                  The cinematic images are generated art direction for review.
                  They do not depict The Reel Wala’s customers, completed shoots
                  or client results. The portfolio and testimonial sections stay
                  honest until approved work arrives.
                </p>
              </article>
              <article className={s.statusItem}>
                <h4>Before a live launch</h4>
                <p>
                  Configure managed private storage, staff notifications and
                  authenticated review access; approve privacy and service
                  policies; resolve the content decisions. Public intake remains
                  disabled. This preview accepts submissions on this computer.
                </p>
              </article>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
