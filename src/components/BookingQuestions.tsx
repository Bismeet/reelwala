"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion";
import s from "./effects/effects.module.css";
const questions = [
  {
    title: "Does my enquiry confirm a booking?",
    answer:
      "Your enquiry shares the event details with us. Availability and the booking are confirmed separately; this form does not take a payment.",
  },
  {
    title: "How will I receive my reels and pictures?",
    answer:
      "The brief specifies delivery through a secure download link. This preview uses the written 24-hour wording; the final timing is confirmed separately.",
  },
  {
    title: "Can I apply as a creator without adding videos?",
    answer:
      "Yes. Videos are optional. You can share up to two edited videos with your application. Photo requirements are still being confirmed; this preview permits up to five optional photos.",
  },
];
export default function BookingQuestions() {
  return (
    <Accordion type="single" collapsible className={s.faq}>
      {questions.map((q, i) => (
        <AccordionItem value={`question-${i}`} key={q.title}>
          <AccordionTrigger>{q.title}</AccordionTrigger>
          <AccordionContent>{q.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
