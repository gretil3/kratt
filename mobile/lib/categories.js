// The four comment categories from docs/api-contract.md, with the display
// metadata shared by the landing page ("Evidence categories" section) and the
// analysis screen's category cards. Keys match `breakdown` in the response.
export const CATEGORIES = [
  {
    key: "ads_spam",
    stamp: "SPAM",
    label: "Ads & spam",
    description: "Promotional links and scam patterns",
  },
  {
    key: "copy_paste",
    stamp: "DUP",
    label: "Copy-paste",
    description: "Duplicate comments within this video's comment section",
  },
  {
    key: "low_effort",
    stamp: "LOW",
    label: "Low effort",
    description: "Generic, templated short phrases",
  },
  {
    key: "genuine",
    stamp: "REAL",
    label: "Genuine",
    description: "Not flagged by any bot heuristic",
    neutral: true, // a healthy share, not a bot signal
  },
];
