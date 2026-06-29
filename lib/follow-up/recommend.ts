import type { BridgeOfferId } from "@/lib/content/follow-up";
import { BRIDGE_OFFERS } from "@/lib/content/follow-up";

export type OfferRecommendationInput = {
  overallScore?: number;
  issueCount?: number;
  suggestedTier?: string | null;
  selectedPlan?: string | null;
};

export function recommendBridgeOffer(input: OfferRecommendationInput): BridgeOfferId {
  const tier = (input.suggestedTier || input.selectedPlan || "").toLowerCase();

  if (tier === "monitor") {
    return "visibility-monitor";
  }

  if (tier === "growth" || tier === "managed") {
    return "visibility-growth";
  }

  const score = input.overallScore ?? 0;
  const issues = input.issueCount ?? 0;

  if (score >= 75 && issues <= 2) {
    return "strategy-session";
  }

  return "visibility-growth";
}

export function getRecommendedOffer(input: OfferRecommendationInput) {
  const id = recommendBridgeOffer(input);
  return { ...BRIDGE_OFFERS[id], id };
}
