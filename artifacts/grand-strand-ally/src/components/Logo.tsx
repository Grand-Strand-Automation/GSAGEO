import { Link } from "wouter";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <img
        src="/brand/logo-icon.png"
        alt="Grand Strand Ally"
        width={36}
        height={36}
        className="flex-shrink-0 object-contain"
      />
      <span className="font-heading font-bold text-xl tracking-tight group-hover:opacity-80 transition-opacity">
        Grand Strand Ally
      </span>
    </Link>
  );
}
