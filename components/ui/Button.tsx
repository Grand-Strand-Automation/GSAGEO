import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 font-heading font-semibold text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const variants = {
  primary: "bg-brand-blue hover:bg-brand-blue-hover text-white border-0 shadow-sm",
  secondary:
    "bg-transparent border border-white/25 text-white hover:bg-white/[0.08]",
  secondaryLight:
    "bg-brand-cream hover:bg-brand-cream-dark text-brand-navy border border-brand-border",
  ghost: "bg-transparent text-brand-blue hover:text-brand-navy hover:underline underline-offset-4",
} as const;

const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6",
  lg: "h-12 px-7",
} as const;

type ButtonLinkProps = {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "lg",
  className,
  children,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link href={href} onClick={onClick} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: NativeButtonProps) {
  return (
    <button type="button" className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
