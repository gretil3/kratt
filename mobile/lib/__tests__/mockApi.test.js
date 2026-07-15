import { mockAnalyze } from "../mockApi";

const VALID_URL = "https://youtube.com/watch?v=dQw4w9WgXcQ";

// The mock's 2.2s delay is real time; fake timers keep the suite instant.
beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});

describe("mockAnalyze", () => {
  test("resolves ok for a valid URL", async () => {
    const promise = mockAnalyze(VALID_URL);
    jest.runAllTimers();
    await expect(promise).resolves.toMatchObject({ ok: true });
  });

  test("resolves invalid_url for a non-YouTube URL", async () => {
    const promise = mockAnalyze("https://vimeo.com/12345");
    jest.runAllTimers();
    const response = await promise;
    expect(response.ok).toBe(false);
    expect(response.error.error).toBe("invalid_url");
  });

  // Cancel support: an aborted request must reject (with AbortError) instead
  // of resolving later — otherwise a stale response would navigate the user
  // to a result screen they already walked away from.
  test("rejects with AbortError when the signal aborts mid-flight", async () => {
    const controller = new AbortController();
    const promise = mockAnalyze(VALID_URL, { signal: controller.signal });
    const assertion = expect(promise).rejects.toMatchObject({
      name: "AbortError",
    });
    controller.abort();
    await assertion;
    // The timer was cleared: advancing time must not cause a late resolve
    // (an unhandled resolve after reject would be swallowed silently, so we
    // just verify the rejection above and that no timers remain).
    expect(jest.getTimerCount()).toBe(0);
  });

  test("rejects immediately when the signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      mockAnalyze(VALID_URL, { signal: controller.signal })
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(jest.getTimerCount()).toBe(0);
  });
});
