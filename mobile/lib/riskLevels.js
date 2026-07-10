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
  low: "Indikasi rendah",
  medium: "Indikasi sedang",
  high: "Indikasi tinggi",
};

// A single category's share of all comments → level chip on its card.
export function levelForShare(percentage) {
  if (percentage > 25) return "high";
  if (percentage >= 10) return "medium";
  return "low";
}

export const LEVEL_LABELS = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
  neutral: "Bukan indikasi",
};
