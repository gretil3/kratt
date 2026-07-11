// Thin JSON wrapper around AsyncStorage (backed by localStorage on web).
// Every persisted key lives in STORAGE_KEYS so screens never invent their own
// strings, and reads/writes never throw — storage being unavailable (private
// browsing, quota) should degrade to "nothing saved", not a crash.
import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  onboardingSeen: "kratt.onboardingSeen",
  history: "kratt.history",
};

export async function getStored(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function setStored(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore — see note above.
  }
}
