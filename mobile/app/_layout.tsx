import { AuthProvider } from "@/components/AuthContext";
import SafeScreen from "@/components/SafeScreen";
import { Slot } from "expo-router";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </AuthProvider>
  );
}
