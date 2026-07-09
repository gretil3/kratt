import { Stack } from "expo-router";
import { AnalysisProvider } from "../context/AnalysisContext";

export default function RootLayout() {
  return (
    <AnalysisProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AnalysisProvider>
  );
}
