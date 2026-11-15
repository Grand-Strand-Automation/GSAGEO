"use client";

import { useState } from "react";
import { IconChevron } from "@/components/icons/StrokeIcons";
import { cn } from "@/lib/utils";

export function FaqItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left font-heading text-[15px] font-semibold text-ink transition-colors hover:text-accent"
        aria-expanded={open}
      >
        <span>{q}</span>
        <IconChevron
          className={cn(
            "mt-0.5 flex-shrink-0 text-accent transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="pb-5 pr-8 text-base leading-relaxed text-body">{a}</div>
      )}
    </div>
  );
}
