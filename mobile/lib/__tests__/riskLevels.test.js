import { tierForScore, TIER_LABELS } from "../riskLevels";

// tierForScore drives the big score gauge's one-word summary. The thresholds
// (40/70) are product decisions — these tests pin the boundaries so a retune
// is always a deliberate edit here, never an accident.
describe("tierForScore", () => {
  test.each([
    [0, "low"],
    [39, "low"],
    [40, "medium"], // boundary: 40 is already medium
    [67, "medium"], // the current mock response's score
    [69, "medium"],
    [70, "high"], // boundary: 70 is already high
    [100, "high"],
  ])("%i%% → %s", (score, tier) => {
    expect(tierForScore(score)).toBe(tier);
  });

  test("every tier has a label", () => {
    for (const tier of ["low", "medium", "high"]) {
      expect(TIER_LABELS[tier]).toEqual(expect.any(String));
    }
  });
});
