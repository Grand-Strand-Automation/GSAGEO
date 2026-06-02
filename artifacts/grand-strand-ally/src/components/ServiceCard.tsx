import { Link } from "wouter";
import { ArrowRight, Headset, Cloud, Wifi, Shield, Database, Zap, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  headset: Headset,
  cloud: Cloud,
  wifi: Wifi,
  shield: Shield,
  database: Database,
  zap: Zap,
};

export function ServiceCard({
  name,
  description,
  icon,
  href,
  ...rest
}: {
  name: string;
  description: string;
  icon: string;
  href?: string;
  [key: string]: unknown;
}) {
  const Icon = iconMap[icon] || Zap;
  return (
    <div
      className="bg-white border border-[#D7E1EA] rounded-xl p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
      {...rest}
    >
      <div className="w-11 h-11 bg-[#DCEAF7] rounded-xl flex items-center justify-center mb-5 text-[#1F5E95] flex-shrink-0">
        <Icon size={21} />
      </div>
      <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-2 leading-snug">{name}</h3>
      <p className="text-sm text-[#4B5B6B] leading-relaxed flex-grow">{description}</p>
      {href && (
        <Link
          href={href}
          aria-label={`Learn more about ${name}`}
          className="text-[#1F5E95] text-sm font-semibold inline-flex items-center gap-1.5 mt-5 hover:gap-2.5 transition-all"
        >
          Learn more <ArrowRight size={14} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
