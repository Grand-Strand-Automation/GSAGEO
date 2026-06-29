export type PreviewStatus = "Limited" | "Moderate" | "Weak" | "Strong";

export const PREVIEW_STATUS_STYLES: Record<PreviewStatus, string> = {
  Limited: "bg-amber-50 text-amber-800 border-amber-200",
  Moderate: "bg-brand-blue-light text-brand-blue border-brand-blue/20",
  Weak: "bg-red-50 text-red-700 border-red-200",
  Strong: "bg-emerald-50 text-emerald-800 border-emerald-200",
};
