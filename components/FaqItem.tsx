"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#D7E1EA] py-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-start justify-between w-full text-left font-heading font-bold text-[15px] text-[#0E2F54] hover:text-[#1F5E95] py-4 gap-4 transition-colors"
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 mt-0.5 text-[#1F5E95] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="text-[#4B5B6B] text-base leading-relaxed pb-5 pr-8">{a}</div>
      )}
    </div>
  );
}
