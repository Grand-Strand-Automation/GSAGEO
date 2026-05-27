import { Link } from "wouter";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`} data-testid="logo-link">
      <img
        src="/brand/logo-icon.png"
        alt="Grand Strand Ally logo"
        width={28}
        height={28}
        className="flex-shrink-0 object-contain"
      />
      <div className="flex flex-col leading-none">
        <span className="font-heading font-bold text-[13px] tracking-[0.08em] uppercase text-white group-hover:text-white/90 transition-colors">
          Grand Strand
        </span>
        <span className="font-heading font-semibold text-[10px] tracking-[0.18em] uppercase text-white/60 group-hover:text-white/50 transition-colors">
          Ally
        </span>
      </div>
    </Link>
  );
}
