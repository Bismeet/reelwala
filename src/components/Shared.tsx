import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { creatorSteps, customerSteps, preview } from "@/content/site";
import { Wordmark } from "./Header";
import { links } from "@/content/navigation";
import s from "./site.module.css";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className={s.eyebrow}>{children}</div>;
}
export function Button({
  children,
  href,
  dark = false,
}: {
  children: React.ReactNode;
  href: string;
  dark?: boolean;
}) {
  return (
    <Link className={`${s.button} ${dark ? s.buttonDark : ""}`} href={href}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
export function TextLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link className={s.textLink} href={href}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function PageHero({
  eyebrow,
  title,
  description,
  number,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  number: string;
}) {
  return (
    <section className={s.pageHero}>
      <div className={`${s.container} ${s.pageHeroRow}`}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={s.pageTitle}>{title}</h1>
          {description && <p className={s.sectionDescription}>{description}</p>}
        </div>
        <span className={s.pageNumber} aria-hidden="true">
          {number}
        </span>
      </div>
    </section>
  );
}
export function CTA() {
  return (
    <section className={s.ctaSection}>
      <div className={`${s.container} ${s.ctaRow}`}>
        <h2>
          What are we<span className={s.serif}>capturing next?</span>
        </h2>
        <div>
          <p>Your occasion. Your people. Your story.</p>
          <Button href="/workflow#enquiry" dark>
            Book a Shoot
          </Button>
        </div>
      </div>
    </section>
  );
}
export function Steps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={s.steps}>
      {customerSteps.map((step) => (
        <div className={s.step} key={step.number}>
          <span className={s.stepNumber}>{step.number}</span>
          <h3>{step.title}</h3>
          <p>
            {compact && step.number === "03"
              ? "Receive your reels and pictures through a secure download link."
              : step.body}
          </p>
          <span className={s.stepLabel}>{step.label}</span>
        </div>
      ))}
    </div>
  );
}
export function CreatorSteps() {
  return (
    <div className={s.creatorSteps}>
      {creatorSteps.map((step) => (
        <div className={s.step} key={step.number}>
          <span className={s.stepNumber}>{step.number}</span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </div>
      ))}
    </div>
  );
}
export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.footerGrid}>
          <div>
            <Wordmark />
            <p className={s.footerCopy}>
              A moment happens once.
              <br />
              You get to feel it again.
            </p>
          </div>
          <div>
            <h2 className={s.footerHeading}>EXPLORE THE REEL WALA</h2>
            <nav aria-label="Footer navigation" className={s.footerLinks}>
              {links.slice(0, 4).map((l) => (
                <Link href={l.href} key={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h2 className={s.footerHeading}>BE PART OF THE STORY</h2>
            <div className={s.footerLinks}>
              <Link href="/become-a-creator">
                Become a Creator <ArrowUpRight size={12} />
              </Link>
              <Link href="/workflow#enquiry">
                Book a Shoot <ArrowUpRight size={12} />
              </Link>
              <Link href="/#privacy">Privacy</Link>
              <Link href="/#terms">Service Terms</Link>
              <a href="/scene-3d/models/ATTRIBUTION.md" target="_blank" rel="noreferrer">
                3D credits
              </a>
            </div>
          </div>
        </div>
        <div className={s.footerBottom}>
          <span>© {new Date().getFullYear()} The Reel Wala</span>
          <span>
            PRIVATE CELEBRATIONS · CORPORATE EVENTS · CULTURAL GATHERINGS
          </span>
        </div>
      </div>
    </footer>
  );
}
export function PreviewBadge() {
  return preview ? (
    <Link
      className={s.previewBadge}
      href="/#preview-status"
      aria-label="Private preview: view content and integration status"
    >
      <span className={s.previewDot} />
      PRIVATE PREVIEW <ArrowUpRight size={11} />
    </Link>
  ) : null;
}
export function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <Check size={15} />
      <span>{children}</span>
    </li>
  );
}
export function ScrollHint() {
  return (
    <span>
      <span className={s.scrollIcon}>
        <ArrowDown size={12} />
      </span>
      SCROLL TO FEEL THE STORY
    </span>
  );
}
export function ChapterStar() {
  return <Sparkles size={13} aria-hidden="true" />;
}
