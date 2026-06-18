import { CheckCircle2 } from "lucide-react";

export function TrustBar({ items }: { items: string[] }) {
  return (
    <div className="bg-white border-b border-brand-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
          {items.map((label) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2.5 py-4 sm:px-8 text-sm text-brand-muted font-medium"
            >
              <CheckCircle2 size={14} className="text-brand-blue flex-shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
