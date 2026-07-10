// The four comment categories from docs/api-contract.md, with the display
// metadata shared by the landing page ("Kategori bukti" section) and the
// analysis screen's category cards. Keys match `breakdown` in the response.
export const CATEGORIES = [
  {
    key: "ads_spam",
    stamp: "SPAM",
    label: "Iklan & spam",
    description: "Tautan promosi dan pola penipuan",
  },
  {
    key: "copy_paste",
    stamp: "DUP",
    label: "Salin-tempel",
    description: "Komentar nyaris identik di banyak video",
  },
  {
    key: "low_effort",
    stamp: "MIN",
    label: "Minim usaha",
    description: "Frasa pendek yang generik dan seragam",
  },
  {
    key: "genuine",
    stamp: "ASLI",
    label: "Komentar asli",
    description: "Tidak terjaring heuristik bot mana pun",
    neutral: true, // a healthy share, not a bot signal
  },
];
