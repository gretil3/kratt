import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

// True when the OS/browser asks for reduced motion (react-native-web maps this
// to prefers-reduced-motion). Decorative loops should stand still when it is.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then(
      (value) => active && setReduced(Boolean(value)),
      () => {}
    );
    const sub = AccessibilityInfo.addEventListener?.(
      "reduceMotionChanged",
      (value) => setReduced(Boolean(value))
    );
    return () => {
      active = false;
      sub?.remove?.();
    };
  }, []);

  return reduced;
}
