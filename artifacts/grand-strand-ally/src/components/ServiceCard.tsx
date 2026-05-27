import { Link } from "wouter";
import { ArrowRight, Headset, Cloud, Wifi, Shield, Database, Zap, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  headset: Headset,
  cloud: Cloud,
  wifi: Wifi,
  shield: Shield,
  database: Database,
  zap: Zap
};

export function ServiceCard({ id, name, description, icon, href }: { id?: string, name: string, description: string, icon: string, href?: string }) {
  const Icon = iconMap[icon] || Zap;
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-6 text-accent">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-heading font-bold text-primary mb-3">{name}</h3>
      <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">{description}</p>
      {href && (
        <Link href={href} className="text-accent font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all group">
          Learn more <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
