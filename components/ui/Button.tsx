import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "btn-primary",
  ink: "btn-ink",
  gold: "bg-highlight text-ink hover:bg-[#F59E0B] btn-base min-h-[52px] px-6 text-[15px]",
  secondary: "btn-outline-on-dark",
  secondaryLight: "btn-outline",
  white: "btn-white",
  ghost: "btn-base text-accent hover:text-accent-hover hover:underline underline-offset-4 min-h-11 px-2",
} as const;

const sizes = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-[52px] px-6 text-[15px]",
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
    <Link href={href} onClick={onClick} className={cn(variants[variant], sizes[size], className)}>
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
    <button type="button" className={cn(variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
