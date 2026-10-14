import { Button } from "@/components/Shared";
import s from "@/components/site.module.css";
export default function NotFound() {
  return (
    <section className={s.section}>
      <div className={`${s.container} ${s.emptyState}`}>
        <h1 className={s.sectionTitle}>This moment got away.</h1>
        <p style={{ marginTop: 25 }}>
          We couldn’t find that page. Let’s get you back to the story.
        </p>
        <Button href="/" dark>
          Back to Home
        </Button>
      </div>
    </section>
  );
}
