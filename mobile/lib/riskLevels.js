// Client-side reading aids on top of the API contract. The contract only
// returns percentages (docs/api-contract.md); the low/medium/high framing is a
// UI heuristic to make numbers readable, so the thresholds live here in one
// place and are deliberately easy to retune.

// Overall bot_percentage → risk tier for the score gauge.
export function tierForScore(botPercentage) {
  if (botPercentage >= 70) return "high";
  if (botPercentage >= 40) return "medium";
  return "low";
}

export const TIER_LABELS = {
  low: "Low indication",
  medium: "Moderate indication",
  high: "High indication",
};

// levelForShare/LEVEL_LABELS (per-category Low/Medium/High chips) were
// removed on purpose: the 10–25% "Medium" band swallowed nearly every real
// video, and a categorical verdict overclaims what the weak-supervised model
// can back. Category cards now show a proportional mini bar instead. The
// overall tierForScore above stays — one summary number can carry a label.
