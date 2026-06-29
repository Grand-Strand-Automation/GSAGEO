import type { CustomerPriority } from "@/lib/results/customer-report-view-model";

export function CustomerPriorityCard({
  priority,
  rank,
}: {
  priority: CustomerPriority;
  rank: number;
}) {
  return (
    <article className="rounded-2xl border border-brand-border bg-white p-5 md:p-6 shadow-card-md">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue mb-2">
        Priority {rank}
      </p>
      <h3 className="font-heading font-bold text-brand-navy text-lg">{priority.title}</h3>
      <p className="mt-2 text-sm text-brand-muted leading-relaxed">{priority.summary}</p>
      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand-subtle mb-1">
            Why it matters
          </p>
          <p className="text-brand-muted leading-relaxed">{priority.whyItMatters}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand-subtle mb-1">
            What to do next
          </p>
          <p className="text-brand-navy leading-relaxed">{priority.whatToDoNext}</p>
        </div>
      </div>
    </article>
  );
}
