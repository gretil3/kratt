import {
  parseVideoId,
  isValidYouTubeUrl,
  canonicalUrl,
  thumbnailUrl,
} from "../youtube";

const ID = "dQw4w9WgXcQ";

describe("parseVideoId — accepted URL shapes", () => {
  test.each([
    [`https://www.youtube.com/watch?v=${ID}`],
    [`https://youtube.com/watch?v=${ID}`],
    [`http://youtube.com/watch?v=${ID}`],
    [`youtube.com/watch?v=${ID}`],
    [`https://youtu.be/${ID}`],
    [`https://youtube.com/embed/${ID}`],
    [`https://youtube.com/live/${ID}`],
    [`https://music.youtube.com/watch?v=${ID}`],
  ])("%s", (url) => {
    expect(parseVideoId(url)).toBe(ID);
  });

  // Regression: m.youtube.com is what the YouTube mobile app's Share button
  // produces — the single most common way someone copies a link from a phone.
  // The old mockApi regex only allowed "www." or no subdomain, so every link
  // shared from the app failed with invalid_url on the first try.
  test("m.youtube.com (mobile Share button format)", () => {
    expect(parseVideoId(`https://m.youtube.com/watch?v=${ID}`)).toBe(ID);
  });

  // Regression: /shorts/ links were rejected by the old anchored regex even
  // though Shorts comment sections are exactly the kind of surface Kratt is
  // meant to analyze.
  test("youtube.com/shorts/", () => {
    expect(parseVideoId(`https://youtube.com/shorts/${ID}`)).toBe(ID);
    expect(parseVideoId(`https://www.youtube.com/shorts/${ID}`)).toBe(ID);
  });
});

describe("parseVideoId — extra query params are ignored", () => {
  test.each([
    [`https://youtu.be/${ID}?si=AbCdEf123`],
    [`https://www.youtube.com/watch?v=${ID}&t=42s`],
    [`https://www.youtube.com/watch?v=${ID}&list=PLx&index=3`],
    [`https://m.youtube.com/watch?v=${ID}&pp=ygUFa3JhdHQ`],
    [`https://www.youtube.com/watch?app=desktop&v=${ID}`],
    [`https://youtube.com/shorts/${ID}?feature=share`],
  ])("%s", (url) => {
    expect(parseVideoId(url)).toBe(ID);
  });
});

describe("parseVideoId — rejected inputs", () => {
  test.each([
    ["https://vimeo.com/12345"],
    ["https://example.com/watch?v=dQw4w9WgXcQ"],
    ["https://youtube.com/watch?v=abc"], // ID shorter than 11 chars
    ["https://youtube.com/watch?v=dQw4w9WgXcQtoolong"], // longer than 11
    ["https://youtube.com/channel/UC12345678901"], // not a video path
    ["https://fakeyoutube.com/watch?v=dQw4w9WgXcQ"], // host must match exactly
    ["https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ"],
    ["not a url at all"],
    [""],
    [null],
    [undefined],
  ])("%s", (url) => {
    expect(parseVideoId(url)).toBeNull();
  });
});

describe("isValidYouTubeUrl", () => {
  test("mirrors parseVideoId", () => {
    expect(isValidYouTubeUrl(`https://m.youtube.com/watch?v=${ID}`)).toBe(true);
    expect(isValidYouTubeUrl("https://vimeo.com/12345")).toBe(false);
  });
});

describe("URL builders", () => {
  test("canonicalUrl", () => {
    expect(canonicalUrl(ID)).toBe(`https://youtube.com/watch?v=${ID}`);
  });

  test("thumbnailUrl", () => {
    expect(thumbnailUrl(ID)).toBe(
      `https://img.youtube.com/vi/${ID}/hqdefault.jpg`
    );
  });
});
