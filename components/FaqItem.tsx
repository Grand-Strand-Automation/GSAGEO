"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-brand-border last:border-0 py-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-start justify-between w-full text-left font-heading font-bold text-[15px] text-brand-navy hover:text-brand-blue py-4 gap-4 transition-colors"
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 mt-0.5 text-brand-blue transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="text-brand-muted text-base leading-relaxed pb-5 pr-8">{a}</div>
      )}
    </div>
  );
}
