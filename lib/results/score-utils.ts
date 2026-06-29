export type ScoreTone = "strong" | "good" | "moderate" | "attention" | "critical";

export type GradeTone = "green" | "yellow" | "red";

/** Letter grade accent: A = green, B/C = yellow, D/F = red */
export function gradeTone(grade: string): GradeTone {
  const letter = grade.trim().charAt(0).toUpperCase();
  if (letter === "A") return "green";
  if (letter === "B" || letter === "C") return "yellow";
  return "red";
}

export function gradeToneClasses(tone: GradeTone): {
  ring: string;
  bg: string;
  text: string;
  bar: string;
  fill: string;
} {
  switch (tone) {
    case "green":
      return {
        ring: "stroke-emerald-600",
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        bar: "bg-emerald-500",
        fill: "#059669",
      };
    case "yellow":
      return {
        ring: "stroke-amber-500",
        bg: "bg-amber-50",
        text: "text-amber-800",
        bar: "bg-amber-500",
        fill: "#d97706",
      };
    default:
      return {
        ring: "stroke-red-500",
        bg: "bg-red-50",
        text: "text-red-800",
        bar: "bg-red-500",
        fill: "#dc2626",
      };
  }
}

export function gradeToneClassesForGrade(grade: string) {
  return gradeToneClasses(gradeTone(grade));
}

export function scoreTone(score: number): ScoreTone {
  if (score >= 85) return "strong";
  if (score >= 70) return "good";
  if (score >= 55) return "moderate";
  if (score >= 35) return "attention";
  return "critical";
}

export function scoreInterpretation(score: number): string {
  switch (scoreTone(score)) {
    case "strong":
      return "Strong foundation";
    case "good":
      return "Good but incomplete";
    case "moderate":
      return "Needs attention";
    case "attention":
      return "High-priority gap";
    default:
      return "Critical gap";
  }
}

export function scoreToneClasses(tone: ScoreTone): {
  ring: string;
  bg: string;
  text: string;
  bar: string;
} {
  switch (tone) {
    case "strong":
      return {
        ring: "stroke-emerald-600",
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        bar: "bg-emerald-500",
      };
    case "good":
      return {
        ring: "stroke-brand-blue",
        bg: "bg-brand-blue-light",
        text: "text-brand-blue",
        bar: "bg-brand-blue",
      };
    case "moderate":
      return {
        ring: "stroke-amber-500",
        bg: "bg-amber-50",
        text: "text-amber-800",
        bar: "bg-amber-500",
      };
    case "attention":
      return {
        ring: "stroke-orange-500",
        bg: "bg-orange-50",
        text: "text-orange-800",
        bar: "bg-orange-500",
      };
    default:
      return {
        ring: "stroke-red-500",
        bg: "bg-red-50",
        text: "text-red-800",
        bar: "bg-red-500",
      };
  }
}

export function statusBadgeClasses(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("present") && !normalized.includes("not")) {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
  if (normalized.includes("likely")) {
    return "bg-sky-50 text-sky-800 border-sky-200";
  }
  if (normalized.includes("not confirmed")) {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  if (normalized.includes("absent")) {
    return "bg-red-50 text-red-800 border-red-200";
  }
  return "bg-brand-cream text-brand-muted border-brand-border";
}

export function priorityLabel(priority: string): string {
  switch (priority) {
    case "fix_first":
      return "Fix first";
    case "improve_next":
      return "Improve next";
    case "nice_to_add":
      return "Nice to add";
    default:
      return priority;
  }
}

export function effortLabel(effort: string): string {
  switch (effort) {
    case "light":
      return "Light effort";
    case "medium":
      return "Medium effort";
    case "larger":
      return "Larger effort";
    default:
      return effort;
  }
}
