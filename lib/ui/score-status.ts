export type ScoreTone = "good" | "warn" | "bad";

/** Site-wide thresholds: 0–39 bad, 40–69 warn, 70–100 good. */
export function scoreTone(score: number): ScoreTone {
  if (score >= 70) return "good";
  if (score >= 40) return "warn";
  return "bad";
}

export function scoreStatusLabel(score: number): "Strength" | "Gap" | "Critical" {
  const tone = scoreTone(score);
  if (tone === "good") return "Strength";
  if (tone === "warn") return "Gap";
  return "Critical";
}

export function scoreBarClass(score: number): string {
  const tone = scoreTone(score);
  if (tone === "good") return "bg-accent";
  if (tone === "warn") return "bg-caution-bar";
  return "bg-bad";
}

export function scoreBadgeClass(tone: ScoreTone): string {
  if (tone === "good") return "text-accent bg-accent-tint";
  if (tone === "warn") return "text-caution bg-caution-soft";
  return "text-bad bg-bad-bg";
}
