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
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="border-b border-[#D7E1EA] py-1"
        >
          <AccordionTrigger className="text-left font-heading font-bold text-[15px] text-[#0E2F54] hover:no-underline hover:text-[#1F5E95] py-4 transition-colors">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-[#4B5B6B] text-base leading-relaxed pb-5">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
