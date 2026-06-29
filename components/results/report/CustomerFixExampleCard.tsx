import type { CustomerFixExample } from "@/lib/results/customer-report-view-model";
import { Lightbulb } from "lucide-react";

export function CustomerFixExampleCard({ example }: { example: CustomerFixExample }) {
  return (
    <article className="rounded-2xl border border-brand-border bg-white p-5 md:p-6 shadow-card-md">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-brand-blue-light p-2.5 shrink-0">
          <Lightbulb size={18} className="text-brand-blue" />
        </div>
        <div className="min-w-0">
          <h3 className="font-heading font-bold text-brand-navy text-base">{example.title}</h3>
          <p className="mt-2 text-sm text-brand-navy leading-relaxed">{example.suggestion}</p>
          <p className="mt-3 text-sm text-brand-muted leading-relaxed">{example.explanation}</p>
        </div>
      </div>
    </article>
  );
}
