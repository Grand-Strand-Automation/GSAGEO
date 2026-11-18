import { IconChevron } from "@/components/icons/StrokeIcons";

/**
 * FAQ row using native <details> so every answer stays in the server HTML
 * for crawlers and AI tools (critical for a GEO-focused site).
 */
export function FaqItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group border-b border-border last:border-0"
      open={defaultOpen || undefined}
    >
      <summary className="flex w-full cursor-pointer list-none items-start justify-between gap-4 py-5 text-left font-heading text-[15px] font-semibold text-ink transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
        <span>{q}</span>
        <IconChevron className="mt-0.5 flex-shrink-0 text-accent transition-transform duration-150 group-open:rotate-180" />
      </summary>
      <div className="pb-5 pr-8 text-base leading-relaxed text-body">{a}</div>
    </details>
  );
}
