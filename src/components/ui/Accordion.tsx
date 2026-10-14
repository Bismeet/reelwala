"use client";
// Adapted from shadcn/ui New York Accordion (MIT), styles mapped to the brand’s CSS modules.
// Upstream copyright/license retained in docs/licences/shadcn-ui.txt.
import * as React from "react";
import * as Primitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import s from "../effects/effects.module.css";
export const Accordion = Primitive.Root;
export const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof Primitive.Item>,
  React.ComponentPropsWithoutRef<typeof Primitive.Item>
>(({ className = "", ...props }, ref) => (
  <Primitive.Item
    ref={ref}
    className={`${s.faqItem} ${className}`}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";
export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof Primitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof Primitive.Trigger>
>(({ className = "", children, ...props }, ref) => (
  <Primitive.Header className={s.faqHeader}>
    <Primitive.Trigger
      ref={ref}
      className={`${s.faqTrigger} ${className}`}
      {...props}
    >
      {children}
      <ChevronDown size={18} aria-hidden="true" />
    </Primitive.Trigger>
  </Primitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";
export const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ children, ...props }, ref) => (
  <Primitive.Content ref={ref} className={s.faqContent} {...props}>
    <div>{children}</div>
  </Primitive.Content>
));
AccordionContent.displayName = "AccordionContent";
