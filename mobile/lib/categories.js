// The four comment categories from docs/api-contract.md, with the display
// metadata shared by the landing page ("Evidence categories" section) and the
// analysis screen's category cards. Keys match `breakdown` in the response.
//
// `example` and `tell` are teaching material: a realistic comment and the
// concrete thing a human should look for. They render only in the landing
// page's explainer mode — the result screen shows measurements, not lessons.
export const CATEGORIES = [
  {
    key: "ads_spam",
    stamp: "SPAM",
    label: "Ads & spam",
    description: "Promotional links and scam patterns",
    example: "Great content sir, check my page for free crypto",
    tell: "The comment redirects your attention somewhere else — a channel, a link, an offer. It's about the video only long enough to earn the click.",
  },
  {
    key: "copy_paste",
    stamp: "DUP",
    label: "Copy-paste",
    description: "Near-identical comments across many videos",
    example: "This deserves way more views, the algorithm is hiding it",
    tell: "The same wording turns up under videos that have nothing to do with each other. One person types a sentence; a script pastes it a thousand times.",
  },
  {
    key: "low_effort",
    stamp: "LOW",
    label: "Low effort",
    description: "Generic, templated short phrases",
    example: "First!!!!",
    tell: "It could sit under any video ever made without changing a word. No name, no moment, no detail that ties it to what it's replying to.",
  },
  {
    key: "genuine",
    stamp: "REAL",
    label: "Genuine",
    description: "Not flagged by any bot heuristic",
    neutral: true, // a healthy share, not a bot signal
    example: "The part at 6:40 where she rechecks the math is what got me",
    tell: "It refers to something that only happens in this video — a timestamp, a mistake, a joke. That specificity is expensive to fake at scale.",
  },
];
