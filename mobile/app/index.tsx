import { useAuth } from "@/components/AuthContext";
import HomeScreen from "@/components/HomeScreen";
import LoginScreen from "@/components/SignIn";
import { ActivityIndicator, View } from "react-native";

export default function MainScreen() {
  const { isLoading, userToken } = useAuth();

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return userToken == null ? <LoginScreen /> : <HomeScreen />;
}
