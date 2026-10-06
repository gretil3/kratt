import { Platform } from "react-native";

// react-native-web passes unknown style keys straight through as CSS, so web
// can use properties native doesn't have (boxShadow, backdropFilter, …).
// Wrap those here so native never receives them.
export function webStyle(style) {
  return Platform.OS === "web" ? style : null;
}

// The inverse: native-only styles (e.g. shadow*, which react-native-web
// deprecates in favor of boxShadow and warns about).
export function nativeStyle(style) {
  return Platform.OS === "web" ? null : style;
}

// Native-driver animations aren't available on web.
export const useNativeDriver = Platform.OS !== "web";
