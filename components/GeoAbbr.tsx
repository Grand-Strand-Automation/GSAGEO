import { cn } from "@/lib/utils";

/** First-instance GEO abbreviation with accessible expansion. */
export function GeoAbbr({ className }: { className?: string }) {
  return (
    <abbr
      title="Generative Engine Optimization"
      className={cn(
        "cursor-help no-underline decoration-dotted underline-offset-2 [text-decoration-line:underline] [text-decoration-style:dotted]",
        className,
      )}
    >
      GEO
    </abbr>
  );
}

export const GEO_ONE_LINER =
  "GEO = Generative Engine Optimization: how well AI tools understand and recommend your business.";
