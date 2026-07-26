import TestRenderer from "react-test-renderer";

// AnalysisProvider pulls in the history/storage layer, which imports the native
// AsyncStorage module. The cancel path never writes history, so the library's
// standard jest mock is enough to let the provider mount under the test env.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import { AnalysisProvider, useAnalysis } from "../../context/AnalysisContext";

const { act, create } = TestRenderer;

const VALID_URL = "https://youtube.com/watch?v=dQw4w9WgXcQ";

// Grab the live context value so a test can drive runAnalysis / cancelAnalysis
// exactly the way app/analyzing.jsx does (fire the request, then Cancel).
function captureAnalysis(ref) {
  function Probe() {
    ref.current = useAnalysis();
    return null;
  }
  return (
    <AnalysisProvider>
      <Probe />
    </AnalysisProvider>
  );
}

// Mirrors the navigation guard in app/analyzing.jsx:
//   if (!outcome.ok && !outcome.aborted) router.replace("/error");
// A cancelled run must NOT satisfy this — otherwise Cancel dumps the user on
// the error screen. This is the exact drift the property name has to prevent:
// if runAnalysis ever signals cancellation under a different key than the one
// analyzing.jsx checks, this predicate flips to true and the test fails.
function routesToError(outcome) {
  return !outcome.ok && !outcome.aborted;
}

describe("cancel during analysis", () => {
  test("cancelling mid-flight yields an aborted outcome that does not route to /error", async () => {
    const ref = { current: null };
    let root;
    act(() => {
      root = create(captureAnalysis(ref));
    });

    let outcome;
    await act(async () => {
      // Start the request but don't await it — the guess panel stays
      // interactive while it runs, and Cancel can fire at any point.
      const pending = ref.current.runAnalysis(VALID_URL);
      // Press Cancel: abort the in-flight request before it resolves.
      ref.current.cancelAnalysis();
      outcome = await pending;
    });

    // The contract analyzing.jsx relies on: a cancel is a non-error, aborted
    // outcome — never a plain failure.
    expect(outcome).toEqual({ ok: false, aborted: true });

    // Therefore the Cancel handler routes home (router.replace("/home")) and
    // the error-screen guard below is never taken.
    expect(routesToError(outcome)).toBe(false);

    act(() => root.unmount());
  });
});
