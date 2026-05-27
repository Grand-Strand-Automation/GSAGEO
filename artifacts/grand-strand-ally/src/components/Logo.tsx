import { Link } from "wouter";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`} data-testid="logo-link">
      <img
        src="/brand/logo-icon.png"
        alt="Grand Strand Ally logo"
        width={32}
        height={32}
        className="flex-shrink-0 object-contain"
      />
      <div className="flex flex-col leading-none">
        <span className="font-heading font-bold text-[13px] tracking-[0.07em] uppercase text-white group-hover:text-white/90 transition-colors">
          Grand Strand
        </span>
        <span className="font-heading font-semibold text-[10px] tracking-[0.2em] uppercase text-white/55 group-hover:text-white/45 transition-colors">
          Ally
        </span>
      </div>
    </Link>
  );
}
