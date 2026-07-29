import { AuthProvider } from "@/components/AuthContext";
import SafeScreen from "@/components/SafeScreen";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </AuthProvider>
  );
}
