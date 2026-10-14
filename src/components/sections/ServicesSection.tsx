import { ArrowUpRight } from "lucide-react";
import { categories } from "@/content/site";
import EnquiryLink from "../EnquiryLink";
import Scene3D from "@/features/scene-3d/components/Scene3D";
import s from "../story/story.module.css";

const scenes = ["private", "corporate", "cultural"] as const;
const lines = [
  "For the ones you love.",
  "For the shared milestones.",
  "For the joy of together.",
];
const descriptions = [
  "The big days and the little celebrations. The moments that are yours.",
  "The people behind the milestone. Capture the energy of coming together.",
  "The music, the colour, the feeling. For the energy of being together.",
];
export default function ServicesSection() {
  return (
    <section
      className={s.services}
      id="services"
      aria-labelledby="services-title"
    >
      <div className={s.servicesIntro}>
        <div className={s.sectionTop}>
          <span>02 / EVERY KIND OF OCCASION</span>
          <span>FIND YOUR STORY ↘</span>
        </div>
        <h2 id="services-title" data-reveal>
          Your people.
          <br />
          <em>Your kind of occasion.</em>
        </h2>
      </div>
      {categories.map((category, index) => (
        <article
          className={`${s.serviceChapter} ${index === 1 ? s.serviceCorporate : index === 2 ? s.serviceCultural : ""}`}
          id={category.id}
          key={category.id}
        >
          <div className={s.serviceArt} data-service-scene>
            <span>
              <span>
                0{index + 1} / {category.label.toUpperCase()}
              </span>
              <ArrowUpRight size={16} />
            </span>
            <div className={s.serviceWorld}>
              <Scene3D kind={scenes[index]} />
            </div>
            <p>{lines[index]}</p>
          </div>
          <div className={s.serviceContent}>
            <h3>{category.label}</h3>
            <p>{descriptions[index]}</p>
            <ul className={s.serviceList}>
              {category.items.map((item) => (
                <li key={item.id}>
                  <EnquiryLink service={item.id} plain>
                    {item.displayLabel}
                    <ArrowUpRight size={15} />
                  </EnquiryLink>
                </li>
              ))}
            </ul>
            <EnquiryLink dark>Enquire About Your Occasion</EnquiryLink>
          </div>
        </article>
      ))}
    </section>
  );
}
