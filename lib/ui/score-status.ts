export type ScoreTone = "good" | "warn" | "bad";

export function scoreTone(score: number): ScoreTone {
  if (score >= 65) return "good";
  if (score >= 45) return "warn";
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
  if (tone === "warn") return "bg-warn-bar";
  return "bg-bad";
}

export function scoreBadgeClass(tone: ScoreTone): string {
  if (tone === "good") return "status-good";
  if (tone === "warn") return "status-warn";
  return "status-bad";
}
