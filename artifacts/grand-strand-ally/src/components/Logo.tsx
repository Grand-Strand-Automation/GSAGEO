import { Link } from "wouter";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 group flex-shrink-0 whitespace-nowrap ${className}`}
      data-testid="logo-link"
    >
      <img
        src="/brand/logo-icon.png"
        alt="Grand Strand Ally logo"
        width={30}
        height={30}
        className="flex-shrink-0 object-contain"
      />
      <div className="flex flex-col leading-none">
        <span className="font-heading font-bold text-[13px] tracking-[0.07em] uppercase text-white group-hover:text-white/90 transition-colors whitespace-nowrap">
          Grand Strand Ally
        </span>
        <span className="font-heading font-semibold text-[9px] tracking-[0.22em] uppercase text-white/50 group-hover:text-white/40 transition-colors whitespace-nowrap">
          Myrtle Beach, SC
        </span>
      </div>
    </Link>
  );
}
