import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { content } from "@/lib/content";

export function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {content.faq.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="border-b border-border py-2">
          <AccordionTrigger className="text-left font-heading font-bold text-lg text-primary hover:no-underline hover:text-accent">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
