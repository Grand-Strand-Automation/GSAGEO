type IconProps = { className?: string };

const base = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function IconReview({ className }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 5h16v14H4z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

export function IconClarity({ className }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function IconTrust({ className }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconContent({ className }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...base}>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M10 13h6M10 17h4" />
    </svg>
  );
}

export function IconSteps({ className }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 6h10M4 12h14M4 18h8" />
      <path d="M18 4l2 2-2 2M20 14l2 2-2 2" />
    </svg>
  );
}

export function IconGuidance({ className }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className={className} {...base}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function IconChevron({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const ICONS = {
  review: IconReview,
  clarity: IconClarity,
  trust: IconTrust,
  content: IconContent,
  steps: IconSteps,
  guidance: IconGuidance,
} as const;

export function IncludedIcon({
  name,
  className,
}: {
  name: keyof typeof ICONS;
  className?: string;
}) {
  const Comp = ICONS[name];
  return <Comp className={className} />;
}
