import { flagReasonFor } from "../flagReasons";

// Pins the two comments the mock actually ships, so the chips on the result
// screen are guaranteed to read SPAM and LOW for the demo payload.
describe("flagReasonFor", () => {
  test("promotional phrasing → ads_spam", () => {
    expect(
      flagReasonFor("Great content sir, check my page for free crypto")
    ).toBe("ads_spam");
    expect(flagReasonFor("Visit https://scam.example for gains")).toBe(
      "ads_spam"
    );
  });

  test("very short generic comments → low_effort", () => {
    expect(flagReasonFor("First!!!!")).toBe("low_effort");
    expect(flagReasonFor("nice")).toBe("low_effort");
    expect(flagReasonFor("🔥🔥🔥")).toBe("low_effort");
  });

  test("everything else defaults to copy_paste", () => {
    expect(
      flagReasonFor("This is exactly what I was thinking about this topic")
    ).toBe("copy_paste");
  });
});
