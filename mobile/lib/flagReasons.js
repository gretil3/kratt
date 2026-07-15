// Client-side guess at WHY a flagged comment was flagged, so the evidence
// list can carry the same category stamps as the cards above it.
//
// TODO(display heuristic): this is a stopgap. The contract currently ships
// sample_flagged_comments as bare strings; when the backend upgrades it to
// [{ text, category, reason }], delete this file and render the real
// category. (Deliberately NOT noted in docs/api-contract.md — that file is
// the backend track's.)

// Promotional tells: links, or the classic comment-section sales phrasing.
const ADS_PATTERN =
  /(https?:\/\/|www\.|\bcheck (?:out )?my\b|\bfree\b|\bcrypto\b|\bsubscribe\b|\bdm me\b|\bpromo code\b|\btelegram\b|\bwhatsapp\b)/i;

export function flagReasonFor(comment) {
  const text = (comment ?? "").trim();
  if (ADS_PATTERN.test(text)) return "ads_spam";

  // Very short and generic ("First!!!!", "nice", emoji-only) → low effort.
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 4) return "low_effort";

  // Everything else in the flagged sample: assumed caught by duplication.
  return "copy_paste";
}
