// Stands in for `POST /analyze` from ../docs/api-contract.md until the backend is live.
// Response shapes below are copied verbatim from the contract's example payloads.

// URL validation is delegated to lib/youtube.js — keeping a second regex here
// is how m.youtube.com links got rejected while the home screen accepted them.
import { isValidYouTubeUrl } from "./youtube";

const MOCK_DELAY_MS = 2200;

const MOCK_SUCCESS_RESPONSE = {
  bot_percentage: 67,
  breakdown: {
    ads_spam: 24,
    copy_paste: 18,
    low_effort: 25,
    genuine: 33,
  },
  total_comments_analyzed: 1214,
  sample_flagged_comments: [
    "Great content sir, check my page for free crypto",
    "First!!!!",
  ],
};

export const ERROR_MESSAGES = {
  invalid_url: "The provided URL is not a valid YouTube video link.",
  video_not_found: "This video doesn't exist or is private.",
  no_comments: "This video has comments disabled or has zero comments.",
  youtube_quota_exceeded:
    "YouTube's API quota has been hit. Please try again in a bit.",
  internal_error: "Something went wrong on our end. Please try again.",
};

// Testing hooks: include one of these keywords in the pasted URL to preview
// each error state without a live backend. The URL must still parse as a real
// YouTube link (11-char ID), e.g. "https://youtu.be/notfound000".
const TEST_KEYWORD_TO_ERROR = [
  [/notfound/i, "video_not_found"],
  [/nocomments/i, "no_comments"],
  [/quota/i, "youtube_quota_exceeded"],
  [/500|internal/i, "internal_error"],
];

function errorResponse(code) {
  return { ok: false, error: { error: code, message: ERROR_MESSAGES[code] } };
}

export function mockAnalyze(videoUrl, { signal } = {}) {
  const url = (videoUrl ?? "").trim();

  return new Promise((resolve, reject) => {
    // AbortError via a plain Error: DOMException isn't a given on native.
    const abortError = () => {
      const err = new Error("Analysis aborted");
      err.name = "AbortError";
      return err;
    };

    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    const timer = setTimeout(() => {
      if (!isValidYouTubeUrl(url)) {
        resolve(errorResponse("invalid_url"));
        return;
      }

      const matchedKeyword = TEST_KEYWORD_TO_ERROR.find(([pattern]) =>
        pattern.test(url)
      );
      if (matchedKeyword) {
        resolve(errorResponse(matchedKeyword[1]));
        return;
      }

      resolve({ ok: true, data: MOCK_SUCCESS_RESPONSE });
    }, MOCK_DELAY_MS);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(abortError());
    });
  });
}
